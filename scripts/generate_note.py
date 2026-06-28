"""
REDPAPA AI 풀이 노트 생성기
────────────────────────────
A4 2페이지 PDF + PNG 출력
사용법:
  python3 scripts/generate_note.py

출력:
  public/note_problem21.pdf  (A4 2페이지)
  public/note_problem21.png  (전체 이미지)

────── 스타일 가이드 ───────────────────────────────────
캔버스:  A4 150 DPI  →  1240 × 1754 px / 페이지
배경:    크림색 (#FCFCF5) + 미세 질감 노이즈
줄선:    연한 스틸블루 (#C8D6E5), 1px
마진선:  없음

헤더 바 (상단)
  배경:   딥 네이비 (30, 42, 80)
  포인트: 왼쪽 7px 파란 막대 (99, 132, 255)
  폰트:   NanumGothicBold / NanumGothic
  우측:   문제 번호 배지 (둥근 파란 박스)

섹션 박스 (pill 스타일, radius=10)
  문제 파악:  배경 #DBE9FE / 테두리 #60A5FA / 텍스트 #1D4ED8
  풀이 과정:  배경 #FFF3C4 / 테두리 #FBC124 / 텍스트 #783C00
  핵심 공식:  배경 #D1FADA / 테두리 #34D399 / 텍스트 #05593C

단계별 색상 (원형 배지 + 잉크)
  1단계:  배지 #EF4444 (빨강)  / 잉크 (180,30,30)
  2단계:  배지 #22C55E (초록)  / 잉크 (15,100,50)
  3단계:  배지 #8B5CF6 (보라)  / 잉크 (90,30,160)
  4단계:  배지 #F97316 (주황)  / 잉크 (160,60,0)

정답 박스:  배경 #FFEC64 / 테두리 #DCA000 / NanumBrush 48px
폰트:
  본문:    NanumPen 38px,  줄간격 52px
  소제목:  NanumPen 30px
  섹션:    NanumBrush 40px
  정답:    NanumBrush 52px
────────────────────────────────────────────────────────
"""

from PIL import Image, ImageDraw, ImageFont
import random, os, sys

# ── 경로 ──────────────────────────────────────────────
PEN   = "/usr/share/fonts/truetype/nanum/NanumPen.ttf"
BRUSH = "/usr/share/fonts/truetype/nanum/NanumBrush.ttf"
GT    = "/usr/share/fonts/truetype/nanum/NanumGothic.ttf"
GTB   = "/usr/share/fonts/truetype/nanum/NanumGothicBold.ttf"

PROB_IMG = "/root/.claude/uploads/1a91add9-2300-525d-baf0-8be57bf44486/6c64e491-1782618497842.jpg"

OUT_PDF = "public/note_problem21.pdf"
OUT_PNG = "public/note_problem21.png"

# ── A4 @ 150 DPI ──────────────────────────────────────
A4_W   = 1240
A4_H   = 1754
DPI    = 150
LINE_H = 52
PAD_L  = 64
PAD_R  = 52
HDR_H  = 72
FTR_H  = 44

# ── 폰트 ──────────────────────────────────────────────
def fnt(path, sz):
    try: return ImageFont.truetype(path, sz)
    except: return ImageFont.load_default()

fb  = fnt(PEN,   38)
fs  = fnt(PEN,   30)
ft  = fnt(BRUSH, 40)
fa  = fnt(BRUSH, 52)
fk  = fnt(GT,    18)
fkb = fnt(GTB,   21)
fkl = fnt(GTB,   26)

# ── 팔레트 ────────────────────────────────────────────
BG     = (252, 252, 245)
LINE_C = (200, 214, 229)
HDR_BG = (30,  42,  80)
HDR_AC = (99, 132, 255)

C = {
    'q':  dict(box=(219,234,254), brd=(96,165,250),  txt=(29,78,216),  ink=(40,80,180)),
    'p':  dict(box=(255,243,196), brd=(251,191,36),  txt=(120,60,0),   ink=(100,60,10)),
    's1': dict(badge=(239,68,68),   ink=(180,30,30)),
    's2': dict(badge=(34,197,94),   ink=(15,100,50)),
    's3': dict(badge=(139,92,246),  ink=(90,30,160)),
    's4': dict(badge=(249,115,22),  ink=(160,60,0)),
    'a':  dict(box=(255,236,100), brd=(220,160,0)),
    'h':  dict(box=(209,250,229), brd=(52,211,153),  txt=(5,90,60),    ink=(10,100,70)),
}

# ── 콘텐츠 정의 ───────────────────────────────────────
# (type, color_key, text)
PAGE1_ROWS = [
    ("sec_box", "q", "문제 파악"),
    ("body", "q", "공 1, 3, 5, 7이 각각 120, 90, 60, 30개  (총 300개)"),
    ("body", "q", "100개 임의추출 → 표본평균 X-bar"),
    ("body", "q", "P( |X-bar - mu| >= k ) = 0.0124    →   k = ?"),
    ("gap",  None, ""),
    ("sec_box", "p", "풀이 과정"),
    ("step",  "s1", "모평균(mu) 계산"),
    ("body",  "s1", "P(X=1)=2/5,  P(X=3)=3/10,  P(X=5)=1/5,  P(X=7)=1/10"),
    ("body",  "s1", "mu = 1x(2/5) + 3x(3/10) + 5x(1/5) + 7x(1/10)"),
    ("body",  "s1", "   = 4/10 + 9/10 + 10/10 + 7/10  =  30/10  =  3"),
    ("gap",   None, ""),
    ("step",  "s2", "모분산(sigma^2) 계산"),
    ("body",  "s2", "E(X^2) = 1x(2/5) + 9x(3/10) + 25x(1/5) + 49x(1/10) = 13"),
    ("body",  "s2", "sigma^2 = E(X^2) - mu^2 = 13 - 9 = 4    ( sigma = 2 )"),
]

PAGE2_ROWS = [
    ("step",  "s3", "표본평균의 분포  ( n = 100 )"),
    ("body",  "s3", "sigma(X-bar) = sigma/sqrt(n) = 2/10 = 0.2"),
    ("body",  "s3", "X-bar  ~  N( 3,  0.2^2 )   < 중심극한정리 >"),
    ("gap",   None, ""),
    ("step",  "s4", "k 계산"),
    ("body",  "s4", "P( |X-bar - 3| >= k )  =  0.0124"),
    ("body",  "s4", "P( |Z| >= k/0.2 )       =  0.0124"),
    ("body",  "s4", "2 x P( Z >= k/0.2 )     =  0.0124"),
    ("body",  "s4", "P( Z >= k/0.2 )          =  0.0062"),
    ("body",  "s4", "P( 0<=Z<=k/0.2 )  = 0.5 - 0.0062  =  0.4938"),
    ("body",  "s4", "표에서  z=2.5 일 때  P(0<=Z<=2.5) = 0.4938  (V)"),
    ("body",  "s4", "따라서   k / 0.2  =  2.5    =>    k  =  0.5"),
    ("gap",   None, ""),
    ("answer", "a", "k  =  0.5  =  1/2"),
    ("gap",   None, ""),
    ("sec_box", "h", "핵심 공식"),
    ("body",  "h", "표본평균:    X-bar ~ N( mu,  sigma^2/n )"),
    ("body",  "h", "표준화:      Z = ( X-bar - mu ) / ( sigma/sqrt(n) )"),
    ("body",  "h", "양측확률:    P(|Z|>=z) = 2 x ( 0.5 - P(0<=Z<=z) )"),
]

# ── 헬퍼 ──────────────────────────────────────────────
rng = random.Random(42)

def make_canvas():
    img = Image.new("RGB", (A4_W, A4_H), BG)
    # 질감
    px = img.load()
    for y in range(HDR_H, A4_H):
        for x in range(A4_W):
            n = rng.randint(-3, 3)
            r, g, b = px[x, y]
            px[x, y] = (max(0,min(255,r+n)), max(0,min(255,g+n)), max(0,min(255,b+n)))
    return img

def draw_lines(draw, from_y):
    y = from_y + LINE_H
    while y < A4_H - 10:
        draw.line([(0, y), (A4_W, y)], fill=LINE_C, width=1)
        y += LINE_H

def draw_header(draw, page_num, title="AI 풀이 노트"):
    draw.rectangle([(0,0),(A4_W, HDR_H)], fill=HDR_BG)
    draw.rectangle([(0,0),(8, HDR_H)], fill=HDR_AC)
    draw.text((24, 16), title, font=fkl, fill=(255,255,255))
    draw.text((24, 46), "REDPAPA  ·  수학 풀이 노트", font=fk, fill=(160,175,220))
    badge = f"No. 21  |  {page_num}/2"
    bx = A4_W - PAD_R - 130
    draw.rounded_rectangle([(bx, 18),(A4_W - PAD_R, HDR_H - 18)], radius=8, fill=HDR_AC)
    draw.text((bx + 10, 25), badge, font=fkb, fill=(255,255,255))
    draw.line([(0, HDR_H),(A4_W, HDR_H)], fill=(60,80,140), width=2)

def draw_footer(draw, label=""):
    fy = A4_H - FTR_H
    draw.line([(PAD_L, fy),(A4_W - PAD_R, fy)], fill=(200,210,225), width=1)
    draw.text((PAD_L, fy + 10), "AI 풀이 노트  ·  REDPAPA", font=fk, fill=(160,170,145))
    draw.text((A4_W - PAD_R - 190, fy + 10), label, font=fk, fill=(160,170,145))

def jit(a=1):
    return rng.randint(-a,a), rng.randint(-a,a)

def pill(draw, x1,y1,x2,y2,fill,brd):
    draw.rounded_rectangle([(x1,y1),(x2,y2)], radius=10, fill=fill, outline=brd, width=2)

def badge_circle(draw, cx, cy, r, color, num):
    draw.ellipse([(cx-r,cy-r),(cx+r,cy+r)], fill=color)
    draw.text((cx-9, cy-14), str(num), font=fkb, fill=(255,255,255))

def render_rows(draw, rows, cy_start, step_offset=0):
    cy = cy_start
    step_num = step_offset
    for (t, key, text) in rows:
        dx, dy = jit()
        if t == "gap":
            cy += int(LINE_H * 0.55); continue
        if t == "sec_box":
            col = C[key]
            pill(draw, PAD_L, cy+2, PAD_L+240, cy+LINE_H-8, col['box'], col['brd'])
            draw.text((PAD_L+14+dx, cy+4+dy), text, font=ft, fill=col['txt'])
            cy += LINE_H; step_num = 0; continue
        if t == "step":
            step_num += 1
            col = C[key]
            badge_circle(draw, PAD_L+18, cy+LINE_H//2-1, 16, col['badge'], step_num)
            draw.text((PAD_L+42+dx, cy+dy), text, font=fs, fill=col['badge'])
            cy += LINE_H; continue
        if t == "body":
            col = C[key]
            ink = col.get('ink', (40,40,40))
            indent = PAD_L+20 if key not in ('s1','s2','s3','s4') else PAD_L+48
            draw.text((indent+dx, cy+dy), text, font=fb, fill=ink)
            cy += LINE_H; continue
        if t == "answer":
            pill(draw, PAD_L, cy, A4_W-PAD_R, cy+int(LINE_H*1.5),
                 C['a']['box'], C['a']['brd'])
            draw.text((PAD_L+32+dx, cy+10+dy), text, font=fa, fill=(140,50,0))
            cy += int(LINE_H*1.6); continue
    return cy

# ══════════════════════════════════════════════════════
# PAGE 1
# ══════════════════════════════════════════════════════
p1 = make_canvas()
d1 = ImageDraw.Draw(p1)
draw_header(d1, 1)
draw_lines(d1, HDR_H)

cy = HDR_H + 16

# 문제 이미지
PROB_W = A4_W - PAD_L - PAD_R
MAX_PROB_H = 580
if os.path.exists(PROB_IMG):
    pi = Image.open(PROB_IMG).convert("RGB")
    ratio = PROB_W / pi.width
    ph = int(pi.height * ratio)
    if ph > MAX_PROB_H:
        ratio = MAX_PROB_H / pi.height
        pw = int(pi.width * ratio)
        ph = MAX_PROB_H
    else:
        pw = PROB_W
    pi = pi.resize((pw, ph), Image.LANCZOS)
    # 테두리
    d1.rounded_rectangle([(PAD_L-4, cy-4),(PAD_L+pw+4, cy+ph+4)],
                          radius=6, fill=(228,228,222), outline=(180,185,200), width=2)
    p1.paste(pi, (PAD_L, cy))
    # 라벨
    d1.rounded_rectangle([(PAD_L, cy),(PAD_L+70, cy+28)], radius=4, fill=(50,60,100))
    d1.text((PAD_L+8, cy+5), "문  제", font=fk, fill=(255,255,255))
    cy += ph + 16

# 구분선 + 소제목
d1.text((PAD_L, cy+6), "21번  ·  표준정규분포 / 표본평균", font=fkb, fill=(70,80,110))
cy += 42
d1.line([(PAD_L, cy),(A4_W-PAD_R, cy)], fill=(180,195,215), width=2)
cy += 10

render_rows(d1, PAGE1_ROWS, cy)
draw_footer(d1, "표준정규분포 #21")

# ══════════════════════════════════════════════════════
# PAGE 2
# ══════════════════════════════════════════════════════
p2 = make_canvas()
d2 = ImageDraw.Draw(p2)
draw_header(d2, 2)
draw_lines(d2, HDR_H)

cy2 = HDR_H + 20
render_rows(d2, PAGE2_ROWS, cy2, step_offset=2)
draw_footer(d2, "표준정규분포 #21")

# ══════════════════════════════════════════════════════
# 저장
# ══════════════════════════════════════════════════════
os.makedirs("public", exist_ok=True)

# PDF (2페이지)
p1.save(OUT_PDF, "PDF", save_all=True, append_images=[p2], resolution=DPI)
print(f"PDF 저장: {OUT_PDF}  (A4 x 2페이지, {DPI} DPI)")

# PNG (전체 세로 이미지 - 미리보기용)
combined = Image.new("RGB", (A4_W, A4_H*2 + 20), (200, 205, 215))
combined.paste(p1, (0, 0))
combined.paste(p2, (0, A4_H + 20))
combined.save(OUT_PNG, "PNG")
print(f"PNG 저장: {OUT_PNG}  ({A4_W}x{A4_H*2+20})")
