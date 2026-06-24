"""
Math Visual Automation - Web UI
브라우저에서 개념을 입력하면 Manim 영상을 자동으로 생성합니다.

흐름:
  1. POST /generate  → AI가 Manim 코드 생성, 코드 반환 (렌더링 없음)
  2. POST /render    → 사용자가 검토·수정한 코드를 실제로 렌더링
  3. GET  /status/<id> → 렌더 진행 상황 폴링
  4. GET  /video/<id>  → 완성된 MP4 스트리밍
  5. GET  /download/<id> → MP4 파일 다운로드

실행: python app.py
접속: http://localhost:5000
"""

import os
import uuid
import threading
from pathlib import Path

from flask import Flask, render_template, request, jsonify, send_file

from generate_manim import generate_manim_code, render_manim, find_output_video
import providers

app = Flask(__name__)
OUTPUT_DIR = Path("output/web")
JOBS: dict[str, dict] = {}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/generate", methods=["POST"])
def generate():
    """Step 1: AI가 Manim 코드를 생성해서 반환 (렌더링 없음)."""
    data = request.json or {}
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
        except providers.ProviderError as exc:
            JOBS[job_id]["status"] = "error"
            JOBS[job_id]["error"]  = str(exc)
        except Exception as exc:
            JOBS[job_id]["status"] = "error"
            JOBS[job_id]["error"]  = str(exc)

    threading.Thread(target=run_generate, daemon=True).start()
    return jsonify({"job_id": job_id})


@app.route("/render", methods=["POST"])
def render():
    """Step 2: 검토·수정된 코드를 받아 Manim으로 렌더링."""
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
            if success:
                video = find_output_video(out)
                JOBS[job_id]["status"] = "done"
                JOBS[job_id]["video"]  = video
            else:
                JOBS[job_id]["status"] = "error"
                JOBS[job_id]["error"]  = error_log or "렌더링 실패"
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
    resp["status"] = job["status"]
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
    topic_safe = "".join(
        c for c in job["topic"] if c.isalnum() or c in " _-"
    )[:40].strip()
    return send_file(
        job["video"],
        mimetype="video/mp4",
        as_attachment=True,
        download_name=f"{topic_safe}.mp4",
    )


if __name__ == "__main__":
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print("\n" + "=" * 50)
    print("  Math Visual Automation")
    print("  브라우저에서 http://localhost:5000 을 여세요")
    print("=" * 50 + "\n")
    app.run(host="0.0.0.0", port=5000, debug=False)
