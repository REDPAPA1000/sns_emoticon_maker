"""
Math Visual Automation - Web UI
브라우저에서 개념을 입력 → AI 코드 생성 → 검토 → 렌더링 → Obsidian Vault 자동 저장

실행: python app.py
접속: http://localhost:5000
"""

import os
import re
import json
import shutil
import uuid
import subprocess
import threading
from pathlib import Path
from datetime import datetime

from flask import Flask, render_template, request, jsonify, send_file

from generate_manim import generate_manim_code, render_manim, find_output_video
import providers

app = Flask(__name__)
OUTPUT_DIR  = Path("output/web")
CONFIG_FILE = Path("vault_config.json")
JOBS: dict[str, dict] = {}


# ── Vault 설정 로드/저장 ──────────────────────────────────
def load_config() -> dict:
    if CONFIG_FILE.exists():
        return json.loads(CONFIG_FILE.read_text(encoding="utf-8"))
    return {"vault_path": "", "grade": "중학교"}

def save_config(cfg: dict):
    CONFIG_FILE.write_text(json.dumps(cfg, ensure_ascii=False, indent=2), encoding="utf-8")


# ── Obsidian Vault에 저장 ────────────────────────────────
def save_to_vault(job_id: str, topic: str, video_path: str, grade: str, vault_path: str):
    """MP4 + 키프레임 PNG + 마크다운 노트를 Vault에 자동 저장."""
    vault = Path(vault_path)
    if not vault.exists():
        return False, f"Vault 경로를 찾을 수 없습니다: {vault_path}"

    # 안전한 폴더/파일명 생성
    safe_name = re.sub(r'[\\/:*?"<>|]', '_', topic)[:50].strip()
    note_dir  = vault / grade / safe_name
    note_dir.mkdir(parents=True, exist_ok=True)

    # 1) MP4 복사
    mp4_dest = note_dir / "animation.mp4"
    shutil.copy2(video_path, mp4_dest)

    # 2) 키프레임 추출 (ffmpeg: 0s, 5s, 10s, 15s)
    frames = []
    for i, t in enumerate([0, 5, 10, 15]):
        frame_path = note_dir / f"frame_{i+1:02d}.png"
        result = subprocess.run(
            ["ffmpeg", "-ss", str(t), "-i", str(mp4_dest),
             "-frames:v", "1", "-q:v", "2", str(frame_path), "-y"],
            capture_output=True
        )
        if frame_path.exists():
            frames.append(frame_path.name)

    # 3) 마크다운 노트 생성
    date_str = datetime.now().strftime("%Y-%m-%d")
    frame_embeds = "\n".join(f"![[{f}]]" for f in frames) if frames else ""

    md_content = f"""---
tags: [{grade}, 수학, 자동생성]
date: {date_str}
---

# {topic}

## 애니메이션 프레임
{frame_embeds}

## 영상
![[animation.mp4]]

## 메모

"""
    (note_dir / f"{safe_name}.md").write_text(md_content, encoding="utf-8")

    return True, str(note_dir)


# ── Flask 라우트 ─────────────────────────────────────────

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/config", methods=["GET", "POST"])
def config():
    if request.method == "GET":
        return jsonify(load_config())
    cfg = load_config()
    data = request.json or {}
    if "vault_path" in data:
        cfg["vault_path"] = data["vault_path"].strip()
    if "grade" in data:
        cfg["grade"] = data["grade"].strip()
    save_config(cfg)
    return jsonify({"ok": True})


@app.route("/generate", methods=["POST"])
def generate():
    data     = request.json or {}
    topic    = (data.get("topic") or "").strip()
    provider = data.get("provider", "ollama")

    if not topic:
        return jsonify({"error": "주제를 입력해주세요."}), 400
    if provider not in ("claude", "gemini", "ollama"):
        return jsonify({"error": "잘못된 프로바이더입니다."}), 400

    job_id = uuid.uuid4().hex[:10]
    JOBS[job_id] = {"status": "generating", "video": None, "error": None, "topic": topic}

    def run_generate():
        try:
            code = generate_manim_code(topic, provider)
            JOBS[job_id]["status"] = "preview"
            JOBS[job_id]["code"]   = code
        except Exception as exc:
            JOBS[job_id]["status"] = "error"
            JOBS[job_id]["error"]  = str(exc)

    threading.Thread(target=run_generate, daemon=True).start()
    return jsonify({"job_id": job_id})


@app.route("/render", methods=["POST"])
def render():
    data    = request.json or {}
    job_id  = (data.get("job_id") or "").strip()
    code    = data.get("code", "")
    quality = data.get("quality", "l")

    if not job_id or job_id not in JOBS:
        return jsonify({"error": "없는 작업입니다."}), 404
    if not code.strip():
        return jsonify({"error": "코드가 비어 있습니다."}), 400

    JOBS[job_id]["status"] = "rendering"
    JOBS[job_id]["code"]   = code

    def run_render():
        try:
            out = str(OUTPUT_DIR / job_id)
            os.makedirs(out, exist_ok=True)
            success, error_log = render_manim(code, out, quality)
            if not success:
                JOBS[job_id]["status"] = "error"
                JOBS[job_id]["error"]  = error_log or "렌더링 실패"
                return

            video = find_output_video(out)
            JOBS[job_id]["video"] = video

            # Obsidian Vault 자동 저장
            cfg = load_config()
            if cfg.get("vault_path") and video:
                ok, vault_result = save_to_vault(
                    job_id, JOBS[job_id]["topic"],
                    video, cfg["grade"], cfg["vault_path"]
                )
                JOBS[job_id]["vault_saved"] = ok
                JOBS[job_id]["vault_path"]  = vault_result
            else:
                JOBS[job_id]["vault_saved"] = False

            JOBS[job_id]["status"] = "done"

        except Exception as exc:
            JOBS[job_id]["status"] = "error"
            JOBS[job_id]["error"]  = str(exc)

    threading.Thread(target=run_render, daemon=True).start()
    return jsonify({"job_id": job_id})


@app.route("/status/<job_id>")
def status(job_id: str):
    job = JOBS.get(job_id)
    if not job:
        return jsonify({"error": "없는 작업입니다."}), 404
    resp = {k: v for k, v in job.items() if k not in ("video", "code")}
    if job["status"] == "preview":
        resp["code"] = job.get("code", "")
    return jsonify(resp)


@app.route("/video/<job_id>")
def video(job_id: str):
    job = JOBS.get(job_id)
    if not job or not job.get("video"):
        return "영상을 찾을 수 없습니다.", 404
    return send_file(job["video"], mimetype="video/mp4")


@app.route("/download/<job_id>")
def download(job_id: str):
    job = JOBS.get(job_id)
    if not job or not job.get("video"):
        return "영상을 찾을 수 없습니다.", 404
    topic_safe = re.sub(r'[\\/:*?"<>|]', '_', job["topic"])[:40].strip()
    return send_file(
        job["video"], mimetype="video/mp4",
        as_attachment=True, download_name=f"{topic_safe}.mp4",
    )


if __name__ == "__main__":
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print("\n" + "=" * 50)
    print("  Math Visual Automation")
    print("  브라우저에서 http://localhost:5000 을 여세요")
    print("=" * 50 + "\n")
    app.run(host="0.0.0.0", port=5000, debug=False)
