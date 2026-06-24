"""
Math Visual Automation - Web UI
브라우저에서 개념을 입력하면 Manim 영상을 자동으로 생성합니다.

실행: python app.py
접속: http://localhost:5000
"""

import os
import uuid
import threading
from pathlib import Path

from flask import Flask, render_template, request, jsonify, send_file

from generate_manim import generate_and_render

app = Flask(__name__)
OUTPUT_DIR = Path("output/web")
JOBS: dict[str, dict] = {}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/generate", methods=["POST"])
def generate():
    data = request.json or {}
    topic = (data.get("topic") or "").strip()
    provider = data.get("provider", "ollama")
    quality = data.get("quality", "l")

    if not topic:
        return jsonify({"error": "주제를 입력해주세요."}), 400
    if provider not in ("claude", "gemini", "ollama"):
        return jsonify({"error": "잘못된 프로바이더입니다."}), 400

    job_id = uuid.uuid4().hex[:10]
    JOBS[job_id] = {"status": "running", "video": None, "error": None, "topic": topic}

    def run() -> None:
        try:
            out = str(OUTPUT_DIR / job_id)
            result = generate_and_render(
                topic=topic,
                provider=provider,
                max_retries=3,
                output_dir=out,
                quality=quality,
            )
            if result["success"]:
                JOBS[job_id]["status"] = "done"
                JOBS[job_id]["video"] = result["video"]
            else:
                JOBS[job_id]["status"] = "error"
                JOBS[job_id]["error"] = result.get("error", "렌더링 실패")
        except Exception as exc:
            JOBS[job_id]["status"] = "error"
            JOBS[job_id]["error"] = str(exc)

    threading.Thread(target=run, daemon=True).start()
    return jsonify({"job_id": job_id})


@app.route("/status/<job_id>")
def status(job_id: str):
    job = JOBS.get(job_id)
    if not job:
        return jsonify({"error": "없는 작업입니다."}), 404
    return jsonify({k: v for k, v in job.items() if k != "video"} | {"status": job["status"]})


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
    topic_safe = "".join(c for c in job["topic"] if c.isalnum() or c in " _-")[:40].strip()
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
