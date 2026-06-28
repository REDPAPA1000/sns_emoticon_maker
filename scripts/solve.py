#!/usr/bin/env python3
"""
AI 풀이 노트 생성기  —  CLI 독립 실행
────────────────────────────────────
사용법:
  python3 scripts/solve.py <문제이미지>
  python3 scripts/solve.py problem.jpg
  python3 scripts/solve.py problem.jpg -o output_note

필요:
  · Claude Code 로그인 상태 (claude login)
  · apt: fonts-nanum fonts-nanum-extra  또는  pip: pillow

출력:
  <이름>_note.pdf  /  <이름>_note.png
────────────────────────────────────
"""

import sys, os, json, subprocess, base64, shutil, argparse, re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# ── Claude CLI ──────────────────────────────────────────
CLAUDE_BIN = shutil.which("claude") or "/opt/node22/bin/claude"

PROMPT = """당신은 수학, 과학, 국어, 영어 전문 선생님입니다.
이미지에 있는 문제를 보고 아래 형식 그대로 한국어로 답변하세요.

규칙:
- 마크다운 기호(**, ##, *, -, `, > 등)는 절대 사용하지 마세요
- 수식은 텍스트로 표현하세요 (예: x^2, sqrt(n), sigma^2, mu)
- 각 섹션 헤더는 반드시 이모지로 시작하세요
- 풀이 단계는 반드시 "1단계. 제목" 형식을 사용하세요

📌 문제
(이미지의 문제 텍스트를 정확하게 옮겨 적으세요. 수식과 조건 포함)

✏️ 풀이 과정
1단계. [단계 제목]
[계산 및 설명을 여러 줄로]

2단계. [단계 제목]
[계산 및 설명]

(필요한 만큼 단계 추가)

✅ 정답
[최종 정답을 명확하게]

💡 핵심 공식
[공식 1]
[공식 2]"""


def solve_image(image_path: str) -> str:
    """Claude CLI로 문제 풀이 텍스트 반환."""
    import io
    img = Image.open(image_path).convert("RGB")
    img.thumbnail((1000, 1000), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=88)
    img_b64 = base64.b64encode(buf.getvalue()).decode()
    print(f"  이미지 크기: {img.size[0]}x{img.size[1]}  ({len(img_b64)//1024}KB base64)", flush=True)

    mime = "image/jpeg"

    message = json.dumps({
        "type": "user",
        "message": {
            "role": "user",
            "content": [
                {"type": "image", "source": {"type": "base64", "media_type": mime, "data": img_b64}},
                {"type": "text", "text": PROMPT},
            ],
        },
    })

    print("  Claude에게 풀이 요청 중...", flush=True)
    proc = subprocess.run(
        [CLAUDE_BIN, "-p",
         "--input-format", "stream-json",
         "--output-format", "stream-json",
         "--verbose"],
        input=message, capture_output=True, text=True, timeout=300
    )

    if proc.returncode != 0:
        raise RuntimeError(f"Claude CLI 오류: {proc.stderr[:400]}")

    for line in proc.stdout.splitlines():
        try:
            ev = json.loads(line)
            if ev.get("type") == "result":
                return ev.get("result", "")
            if ev.get("type") == "rate_limit_event":
                info = ev.get("rate_limit_info", {})
                if info.get("status") == "hard_limited":
                    raise RuntimeError("Claude 주간 사용량 한도 초과. 잠시 후 다시 시도하세요.")
        except json.JSONDecodeError:
            pass

    raise RuntimeError("Claude 응답을 파싱할 수 없습니다.")


# ── 솔루션 파서 ─────────────────────────────────────────
SECTION_EMOJIS = ["📌", "✏️", "✅", "💡"]

def parse_solution(text: str):
    """섹션 목록 반환:  [{"emoji": str, "title": str, "lines": [str]}]"""
    sections = []
    current = None
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        is_header = any(line.startswith(e) for e in SECTION_EMOJIS)
        if is_header:
            if current:
                sections.append(current)
            emoji = next((e for e in SECTION_EMOJIS if line.startswith(e)), "")
            current = {"emoji": emoji, "title": line, "lines": []}
        elif current:
            current["lines"].append(line)
    if current:
        sections.append(current)
    return sections


# ── 폰트 & 팔레트 ───────────────────────────────────────
PEN   = "/usr/share/fonts/truetype/nanum/NanumPen.ttf"
BRUSH = "/usr/share/fonts/truetype/nanum/NanumBrush.ttf"
GT    = "/usr/share/fonts/truetype/nanum/NanumGothic.ttf"
GTB   = "/usr/share/fonts/truetype/nanum/NanumGothicBold.ttf"

def fnt(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

# 팔레트
BG     = (252, 252, 245)
LINE_C = (200, 214, 229)
HDR_BG = (30,  42,  80)
HDR_AC = (99, 132, 255)

SEC = {
    "📌": dict(box=(219,234,254), brd=(96,165,250),  txt=(29,78,216),   ink=(40,80,180)),
    "✏️": dict(box=(255,243,196), brd=(251,191,36),  txt=(120,60,0),    ink=(100,60,10)),
    "✅": dict(box=(255,236,100), brd=(220,160,0),   txt=(140,50,0),    ink=(140,50,0)),
    "💡": dict(box=(209,250,229), brd=(52,211,153),  txt=(5,90,60),     ink=(10,100,70)),
}
STEP_COLORS = [
    (239,68,68), (34,197,94), (139,92,246), (249,115,22), (6,182,212), (236,72,153)
]

# A4 레이아웃
A4_W, A4_H = 1240, 1754
DPI         = 150
LINE_H      = 42
PAD_L       = 64
PAD_R       = 52
HDR_H       = 72
FTR_H       = 42
GAP_H       = int(LINE_H * 0.55)


def build_note_image(sections, prob_img_path=None, title="풀이 노트"):
    """PIL로 A4 노트 이미지 생성 후 반환."""
    import random
    rng = random.Random(42)

    fb  = fnt(PEN,   38)
    fs  = fnt(PEN,   29)
    ft  = fnt(BRUSH, 39)
    fa  = fnt(BRUSH, 50)
    fk  = fnt(GT,    17)
    fkb = fnt(GTB,   20)
    fkl = fnt(GTB,   26)

    # ── 썸네일 준비 ──────────────────────────────────────
    TITLE_ZONE_H  = 204
    THUMB_H       = TITLE_ZONE_H - 20
    RIGHT_ZONE_ST = 652
    THUMB_MAX_W   = A4_W - PAD_R - RIGHT_ZONE_ST
    TITLE_TOP     = HDR_H + 14
    CONTENT_TOP   = HDR_H + TITLE_ZONE_H + 18

    thumb = None
    if prob_img_path and os.path.exists(prob_img_path):
        pi = Image.open(prob_img_path).convert("RGB")
        cropped = pi.crop((0, 0, pi.width, int(pi.height * 0.48)))
        scale = min(THUMB_MAX_W / cropped.width, THUMB_H / cropped.height)
        tw, th = int(cropped.width * scale), int(cropped.height * scale)
        thumb = (cropped.resize((tw, th), Image.LANCZOS), tw, th)

    # ── 전체 높이 계산 ───────────────────────────────────
    def row_px(sec):
        h = 0
        if sec["emoji"] in ("📌", "✏️", "💡"):
            h += LINE_H  # 섹션 헤더
        elif sec["emoji"] == "✅":
            h += int(LINE_H * 1.6)

        for ln in sec["lines"]:
            step_m = re.match(r"^(\d+)단계[.·\s](.*)", ln)
            if sec["emoji"] == "✏️" and step_m:
                h += LINE_H
            else:
                h += LINE_H
        h += GAP_H  # 섹션 뒤 간격
        return h

    content_h = sum(row_px(s) for s in sections) + 20
    total_h = max(A4_H, CONTENT_TOP + content_h + FTR_H + 20)

    # ── 캔버스 ──────────────────────────────────────────
    img = Image.new("RGB", (A4_W, total_h), BG)
    draw = ImageDraw.Draw(img)

    # 배경 질감
    px = img.load()
    for y in range(HDR_H, total_h):
        for x in range(A4_W):
            n = rng.randint(-3, 3)
            r, g, b = px[x, y]
            px[x, y] = (max(0,min(255,r+n)), max(0,min(255,g+n)), max(0,min(255,b+n)))

    # 줄선
    y0 = CONTENT_TOP + LINE_H
    while y0 < total_h - FTR_H - 8:
        draw.line([(0, y0), (A4_W, y0)], fill=LINE_C, width=1)
        y0 += LINE_H

    # ── 헤더 바 ─────────────────────────────────────────
    draw.rectangle([(0,0),(A4_W,HDR_H)], fill=HDR_BG)
    draw.rectangle([(0,0),(7,HDR_H)], fill=HDR_AC)
    draw.text((22,15), "AI 풀이 노트", font=fkl, fill=(255,255,255))
    draw.text((22,46), "REDPAPA  ·  손글씨 풀이 노트", font=fk, fill=(160,175,220))
    draw.line([(0,HDR_H),(A4_W,HDR_H)], fill=(60,80,140), width=2)

    # ── 썸네일 ──────────────────────────────────────────
    if thumb:
        t_img, tw, th = thumb
        tx = RIGHT_ZONE_ST + (THUMB_MAX_W - tw) // 2
        ty = TITLE_TOP + (THUMB_H - th) // 2
        draw.rounded_rectangle([(tx-6,ty-6),(tx+tw+6,ty+th+6)],
                                radius=6, fill=(228,228,222), outline=(180,185,200), width=1)
        img.paste(t_img, (tx, ty))
        draw.rounded_rectangle([(tx,ty),(tx+58,ty+24)], radius=4, fill=(50,60,100))
        draw.text((tx+6,ty+4), "문 제", font=fk, fill=(255,255,255))

    # ── 타이틀 구역 ─────────────────────────────────────
    lx = PAD_L
    draw.rounded_rectangle([(lx,TITLE_TOP),(lx+130,TITLE_TOP+28)],
                            radius=6, fill=(240,244,255), outline=(180,195,240), width=1)
    draw.text((lx+10,TITLE_TOP+5), "AI 풀이 노트", font=fk, fill=(60,80,180))
    draw.text((lx,TITLE_TOP+38), title, font=fnt(GTB,34), fill=(25,35,80))
    for i, col in enumerate([(99,132,255),(239,68,68),(34,197,94)]):
        draw.rectangle([(lx,TITLE_TOP+118+i*14),(lx+50+i*30,TITLE_TOP+124+i*14)], fill=col)

    sep_y = HDR_H + TITLE_ZONE_H + 6
    draw.line([(PAD_L,sep_y),(A4_W-PAD_R,sep_y)], fill=(175,190,215), width=2)

    # ── 본문 렌더링 ──────────────────────────────────────
    def pill(x1,y1,x2,y2,fill,brd):
        draw.rounded_rectangle([(x1,y1),(x2,y2)], radius=10, fill=fill, outline=brd, width=2)

    def badge_circle(cx, cy, r, color, num):
        draw.ellipse([(cx-r,cy-r),(cx+r,cy+r)], fill=color)
        draw.text((cx-9,cy-14), str(num), font=fkb, fill=(255,255,255))

    def jit(a=1):
        return rng.randint(-a,a), rng.randint(-a,a)

    cy = CONTENT_TOP + 4

    for sec in sections:
        emoji = sec["emoji"]
        col = SEC.get(emoji, SEC["📌"])
        dx, dy = jit()

        if emoji == "✅":
            # 정답 박스: 풀 너비
            box_h = int(LINE_H * 1.5)
            pill(PAD_L, cy, A4_W-PAD_R, cy+box_h, col["box"], col["brd"])
            draw.text((PAD_L+16+dx, cy+4+dy), sec["title"], font=ft, fill=col["txt"])
            cy += LINE_H
            for ln in sec["lines"]:
                draw.text((PAD_L+32+dx, cy+dy), ln, font=fa, fill=col["ink"])
                cy += LINE_H
            cy += GAP_H
            continue

        # 섹션 헤더 필
        pill(PAD_L, cy+2, PAD_L+260, cy+LINE_H-8, col["box"], col["brd"])
        draw.text((PAD_L+14+dx, cy+4+dy), sec["title"], font=ft, fill=col["txt"])
        cy += LINE_H

        step_num = 0
        for ln in sec["lines"]:
            dx, dy = jit()
            step_m = re.match(r"^(\d+)단계[.·\s](.*)", ln)
            if emoji == "✏️" and step_m:
                step_num += 1
                n = int(step_m.group(1)) - 1
                bcol = STEP_COLORS[n % len(STEP_COLORS)]
                badge_circle(PAD_L+18, cy+LINE_H//2-1, 15, bcol, int(step_m.group(1)))
                draw.text((PAD_L+40+dx, cy+dy), step_m.group(2), font=fs, fill=bcol)
                cy += LINE_H
            else:
                indent = PAD_L + (46 if emoji == "✏️" else 20)
                draw.text((indent+dx, cy+dy), ln, font=fb, fill=col["ink"])
                cy += LINE_H

        cy += GAP_H

    # ── 푸터 ────────────────────────────────────────────
    fy = total_h - FTR_H
    draw.line([(PAD_L,fy),(A4_W-PAD_R,fy)], fill=(200,210,225), width=1)
    draw.text((PAD_L,fy+10), "AI 풀이 노트  ·  REDPAPA", font=fk, fill=(160,170,145))

    return img, total_h


# ── 메인 ────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="문제 사진 → AI 풀이 → 손글씨 노트 PDF",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="예시:\n  python3 scripts/solve.py problem.jpg\n  python3 scripts/solve.py math.png -o my_note -t '수학 21번'"
    )
    parser.add_argument("image", help="문제 이미지 경로 (jpg/png/webp)")
    parser.add_argument("-o", "--output", help="출력 파일 이름 (확장자 제외, 기본: <이미지명>_note)")
    parser.add_argument("-t", "--title", default="풀이 노트", help="노트 제목 (기본: 풀이 노트)")
    args = parser.parse_args()

    img_path = args.image
    if not os.path.exists(img_path):
        print(f"[오류] 이미지 파일을 찾을 수 없습니다: {img_path}")
        sys.exit(1)

    stem = Path(img_path).stem
    out_name = args.output or f"{stem}_note"
    out_pdf  = f"{out_name}.pdf"
    out_png  = f"{out_name}.png"

    print(f"\n┌─ AI 풀이 노트 생성기 ─────────────────────────")
    print(f"│  입력: {img_path}")
    print(f"│  출력: {out_pdf}")
    print(f"└────────────────────────────────────────────────\n")

    # 1. Claude CLI로 풀이
    try:
        solution_text = solve_image(img_path)
    except Exception as e:
        print(f"[오류] 풀이 실패: {e}")
        sys.exit(1)

    print(f"  풀이 완료 ({len(solution_text)}자)\n")
    print("─" * 48)
    print(solution_text[:600] + ("..." if len(solution_text) > 600 else ""))
    print("─" * 48)

    # 2. 파싱
    sections = parse_solution(solution_text)
    if not sections:
        print("[경고] 파싱된 섹션이 없습니다. 원본 텍스트를 그대로 저장합니다.")
        with open(out_name + "_solution.txt", "w") as f:
            f.write(solution_text)
        sys.exit(0)

    print(f"\n  섹션 {len(sections)}개 파싱 완료")
    for s in sections:
        print(f"    {s['emoji']} {s['title'][:40]}  ({len(s['lines'])}줄)")

    # 3. 노트 이미지 생성
    print("\n  노트 이미지 렌더링 중...", flush=True)
    note_img, h = build_note_image(sections, prob_img_path=img_path, title=args.title)

    # 4. 저장
    # A4 한 장이면 그대로, 넘으면 두 장으로 분할
    if h <= A4_H + 40:
        note_img.save(out_pdf, "PDF", resolution=DPI)
        note_img.save(out_png, "PNG")
    else:
        p1 = note_img.crop((0, 0, A4_W, A4_H))
        p2 = note_img.crop((0, A4_H, A4_W, h))
        p1.save(out_pdf, "PDF", resolution=DPI, save_all=True, append_images=[p2])
        note_img.save(out_png, "PNG")

    print(f"\n  ✓ PDF 저장: {out_pdf}")
    print(f"  ✓ PNG 저장: {out_png}")
    print(f"  캔버스 높이: {h}px  (A4={A4_H}px)\n")


if __name__ == "__main__":
    main()
