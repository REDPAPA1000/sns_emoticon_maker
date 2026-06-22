"""
Manim AI Automation - Batch Processing

Reads topics from a JSON file and generates Manim videos for each topic
using the Claude-powered pipeline in generate_manim.py.
"""

import argparse
import json
import os
import sys
import time
from pathlib import Path

from generate_manim import generate_and_render

DEFAULT_TOPICS_FILE = Path(__file__).parent / "data" / "topics.json"
DEFAULT_OUTPUT_DIR = Path(__file__).parent / "output"


def load_topics(topics_file: str) -> list[dict]:
    with open(topics_file, encoding="utf-8") as f:
        return json.load(f)


def print_summary(results: list[dict]) -> None:
    total = len(results)
    succeeded = sum(1 for r in results if r["success"])
    failed = total - succeeded

    print("\n" + "=" * 60)
    print(f"배치 처리 완료: {succeeded}/{total} 성공, {failed} 실패")
    print("=" * 60)

    if failed:
        print("\n실패 목록:")
        for r in results:
            if not r["success"]:
                short_error = (r["error"] or "알 수 없는 오류")[:120]
                print(f"  - [{r.get('id', '?')}] {r['topic'][:40]}...\n    {short_error}")


def batch_process(
    topics_file: str,
    output_dir: str,
    max_retries: int = 3,
    filter_tags: list[str] | None = None,
    filter_ids: list[str] | None = None,
    delay: float = 2.0,
) -> list[dict]:
    """
    Process all topics from the JSON file.

    Args:
        topics_file: Path to topics JSON.
        output_dir: Base directory for video output.
        max_retries: Retry attempts per topic.
        filter_tags: If set, only process topics matching at least one tag.
        filter_ids: If set, only process topics with these IDs.
        delay: Seconds to wait between topics (rate limiting).

    Returns:
        List of result dicts from generate_and_render.
    """
    topics = load_topics(topics_file)

    if filter_ids:
        topics = [t for t in topics if t.get("id") in filter_ids]
    if filter_tags:
        topics = [t for t in topics if any(tag in t.get("tags", []) for tag in filter_tags)]

    if not topics:
        print("처리할 주제가 없습니다. 필터를 확인하세요.")
        return []

    print(f"총 {len(topics)}개 주제 처리 시작")
    results = []

    for index, entry in enumerate(topics, start=1):
        topic_id = entry.get("id", f"topic_{index}")
        topic_text = entry.get("topic", "")
        topic_output = os.path.join(output_dir, topic_id)

        print(f"\n[{index}/{len(topics)}] ID: {topic_id}")

        result = generate_and_render(
            topic=topic_text,
            max_retries=max_retries,
            output_dir=topic_output,
        )
        result["id"] = topic_id
        results.append(result)

        if index < len(topics):
            time.sleep(delay)

    print_summary(results)
    return results


def save_results(results: list[dict], output_dir: str) -> None:
    os.makedirs(output_dir, exist_ok=True)
    report_path = os.path.join(output_dir, "batch_report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\n결과 리포트 저장: {report_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Batch-generate Manim animations from a topics JSON file.")
    parser.add_argument(
        "--topics",
        default=str(DEFAULT_TOPICS_FILE),
        help=f"주제 JSON 파일 경로 (기본값: {DEFAULT_TOPICS_FILE})",
    )
    parser.add_argument(
        "--output",
        default=str(DEFAULT_OUTPUT_DIR),
        help=f"출력 디렉터리 (기본값: {DEFAULT_OUTPUT_DIR})",
    )
    parser.add_argument(
        "--retries",
        type=int,
        default=3,
        help="주제당 최대 재시도 횟수 (기본값: 3)",
    )
    parser.add_argument(
        "--tags",
        nargs="+",
        help="처리할 태그 필터 (예: --tags calculus geometry)",
    )
    parser.add_argument(
        "--ids",
        nargs="+",
        help="처리할 ID 필터 (예: --ids fourier_transform pythagorean_theorem)",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=2.0,
        help="주제 간 대기 시간(초), API 속도 제한 방지 (기본값: 2.0)",
    )
    args = parser.parse_args()

    results = batch_process(
        topics_file=args.topics,
        output_dir=args.output,
        max_retries=args.retries,
        filter_tags=args.tags,
        filter_ids=args.ids,
        delay=args.delay,
    )

    save_results(results, args.output)

    failed = sum(1 for r in results if not r["success"])
    sys.exit(1 if failed else 0)
