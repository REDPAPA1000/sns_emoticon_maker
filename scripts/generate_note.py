"""
REDPAPA AI 풀이 노트 생성기  —  A4 단일 페이지
────────────────────────────────────────────────
출력:  public/note_problem21.pdf   (A4, 150 DPI)
       public/note_problem21.png   (미리보기용)
사용법:  python3 scripts/generate_note.py
────────────────────────────────────────────────
스타일 요약
  캔버스:  1240 × 1754 px  (A4 @ 150 DPI)
  헤더:    딥 네이비 (30,42,80)  72px  |  좌측 7px 포인트 막대
  타이틀:  좌측 문제번호 + 우측 문제 썸네일  (208px 구역)
  줄선:    연한 스틸블루  #C8D6E5
  섹션박스: Pill 형태, 색상 아래 팔레트 참조
  단계배지: 컬러 원형  ①빨강 ②초록 ③보라 ④주황
  정답박스: 황금 배경  #FFEC64
  폰트:    NanumPen 38(본문) / NanumBrush 40(섹션) / NanumGothicBold
"""

from PIL import Image, ImageDraw, ImageFont
import random, os

# ── 경로 ───────────────────────────────────────────────
PEN   = "/usr/share/fonts/truetype/nanum/NanumPen.ttf"
BRUSH = "/usr/share/fonts/truetype/nanum/NanumBrush.ttf"
GT    = "/usr/share/fonts/truetype/nanum/NanumGothic.ttf"
GTB   = "/usr/share/fonts/truetype/nanum/NanumGothicBold.ttf"
PROB_IMG = "/root/.claude/uploads/1a91add9-2300-525d-baf0-8be57bf44486/6c64e491-1782618497842.jpg"
OUT_PDF  = "public/note_problem21.pdf"
OUT_PNG  = "public/note_problem21.png"

# ── A4 @ 150 DPI ───────────────────────────────────────
A4_W, A4_H = 1240, 1754
DPI         = 150
LINE_H      = 42
PAD_L       = 64
PAD_R       = 52
HDR_H       = 72          # 헤더 바 높이
FTR_H       = 42          # 푸터 높이

# 타이틀 구역 (헤더 아래)
TITLE_ZONE_H  = 204       # 문제 썸네일 + 제목 영역 총 높이
TITLE_TOP     = HDR_H + 14
LEFT_ZONE_END = 632       # 좌측 텍스트 컬럼 끝
RIGHT_ZONE_ST = 652       # 우측 썸네일 컬럼 시작

CONTENT_TOP = HDR_H + TITLE_ZONE_H + 18  # 본문 시작 y

# ── 팔레트 ─────────────────────────────────────────────
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

# ── 폰트 ───────────────────────────────────────────────
def fnt(p, s):
    try: return ImageFont.truetype(p, s)
    except: return ImageFont.load_default()

fb  = fnt(PEN,   38)
fs  = fnt(PEN,   29)
ft  = fnt(BRUSH, 39)
fa  = fnt(BRUSH, 50)
fk  = fnt(GT,    17)
fkb = fnt(GTB,   20)
fkl = fnt(GTB,   26)
fkx = fnt(GTB,   34)

# ── 콘텐츠 정의 (단일 목록) ────────────────────────────
ALL_ROWS = [
    ("sec_box", "q", "문제 파악"),
    ("body", "q", "공 1, 3, 5, 7이 각각 120, 90, 60, 30개  (총 300개)"),
    ("body", "q", "100개 임의추출 후 표본평균 X-bar"),
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
    ("body",  "s2", "sigma^2 = E(X^2) - mu^2  =  13 - 9  =  4    ( sigma = 2 )"),
    ("gap",   None, ""),
    ("step",  "s3", "표본평균의 분포  ( n = 100 )"),
    ("body",  "s3", "sigma(X-bar) = sigma/sqrt(n) = 2/10 = 0.2"),
    ("body",  "s3", "X-bar  ~  N( 3,  0.2^2 )   <중심극한정리>"),
    ("gap",   None, ""),
    ("step",  "s4", "k 계산"),
    ("body",  "s4", "P( |X-bar - 3| >= k )  =  0.0124"),
    ("body",  "s4", "P( |Z| >= k/0.2 )       =  0.0124"),
    ("body",  "s4", "2 x P( Z >= k/0.2 )     =  0.0124   =>   P(Z>=k/0.2) = 0.0062"),
    ("body",  "s4", "P( 0<=Z<=k/0.2 )        =  0.5 - 0.0062  =  0.4938"),
    ("body",  "s4", "표에서  z=2.5  =>  P(0<=Z<=2.5) = 0.4938  (V)"),
    ("body",  "s4", "따라서   k / 0.2  =  2.5    =>    k  =  0.5"),
    ("gap",   None, ""),
    ("answer", "a", "k  =  0.5  =  1/2"),
    ("gap",   None, ""),
    ("sec_box", "h", "핵심 공식"),
    ("body",  "h", "표본평균:   X-bar ~ N( mu,  sigma^2/n )"),
    ("body",  "h", "표준화:     Z = ( X-bar - mu ) / ( sigma/sqrt(n) )"),
    ("body",  "h", "양측확률:   P(|Z|>=z) = 2 x ( 0.5 - P(0<=Z<=z) )"),
]

# ── 캔버스 생성 ────────────────────────────────────────
rng = random.Random(42)

img = Image.new("RGB", (A4_W, A4_H), BG)
draw = ImageDraw.Draw(img)

# 배경 질감
px = img.load()
for y in range(HDR_H, A4_H):
    for x in range(A4_W):
        n = rng.randint(-3, 3)
        r, g, b = px[x, y]
        px[x, y] = (max(0,min(255,r+n)), max(0,min(255,g+n)), max(0,min(255,b+n)))

# 줄선 (본문 영역에만)
y0 = CONTENT_TOP + LINE_H
while y0 < A4_H - FTR_H - 8:
    draw.line([(0, y0), (A4_W, y0)], fill=LINE_C, width=1)
    y0 += LINE_H

# ══════════════════════════════════════════════════════
# 헤더 바
# ══════════════════════════════════════════════════════
draw.rectangle([(0, 0), (A4_W, HDR_H)], fill=HDR_BG)
draw.rectangle([(0, 0), (7, HDR_H)], fill=HDR_AC)
draw.text((22, 15), "AI 풀이 노트", font=fkl, fill=(255,255,255))
draw.text((22, 46), "REDPAPA  ·  수학 풀이 노트", font=fk, fill=(160,175,220))
bx = A4_W - PAD_R - 120
draw.rounded_rectangle([(bx, 18),(A4_W-PAD_R, HDR_H-18)], radius=8, fill=HDR_AC)
draw.text((bx+10, 25), "No. 21", font=fkb, fill=(255,255,255))
draw.line([(0, HDR_H),(A4_W, HDR_H)], fill=(60,80,140), width=2)

# ══════════════════════════════════════════════════════
# 타이틀 구역 — 좌: 문제정보 / 우: 썸네일
# ══════════════════════════════════════════════════════
# 우측: 문제 이미지 썸네일
THUMB_H = TITLE_ZONE_H - 20
THUMB_MAX_W = A4_W - PAD_R - RIGHT_ZONE_ST  # ~536px

if os.path.exists(PROB_IMG):
    pi = Image.open(PROB_IMG).convert("RGB")
    # 상단 48%만 크롭 (문제 텍스트 영역)
    crop_y = int(pi.height * 0.48)
    cropped = pi.crop((0, 0, pi.width, crop_y))
    # 썸네일 크기 계산
    scale = min(THUMB_MAX_W / cropped.width, THUMB_H / cropped.height)
    tw = int(cropped.width * scale)
    th = int(cropped.height * scale)
    thumb = cropped.resize((tw, th), Image.LANCZOS)
    # 우측 컬럼 내 중앙 정렬
    tx = RIGHT_ZONE_ST + (THUMB_MAX_W - tw) // 2
    ty = TITLE_TOP + (THUMB_H - th) // 2
    # 배경 카드
    draw.rounded_rectangle(
        [(tx-6, ty-6), (tx+tw+6, ty+th+6)],
        radius=6, fill=(228,228,222), outline=(180,185,200), width=1
    )
    img.paste(thumb, (tx, ty))
    # "문제" 라벨 (썸네일 좌상단)
    draw.rounded_rectangle([(tx, ty),(tx+58, ty+24)], radius=4, fill=(50,60,100))
    draw.text((tx+6, ty+4), "문 제", font=fk, fill=(255,255,255))

# 좌측: 문제 정보
lx = PAD_L
# 카테고리 배지
draw.rounded_rectangle(
    [(lx, TITLE_TOP),(lx+140, TITLE_TOP+28)],
    radius=6, fill=(240,244,255), outline=(180,195,240), width=1
)
draw.text((lx+10, TITLE_TOP+5), "확률과 통계", font=fk, fill=(60,80,180))

# 문제 번호 (크게)
draw.text((lx, TITLE_TOP+38), "21번", font=fkx, fill=(25,35,80))

# 주제
draw.text((lx, TITLE_TOP+84), "표준정규분포", font=fkb, fill=(50,60,110))
draw.text((lx, TITLE_TOP+112), "표본평균 추론", font=fkb, fill=(80,90,140))

# 장식 수평선들
for i, col in enumerate([(99,132,255),(239,68,68),(34,197,94)]):
    draw.rectangle(
        [(lx, TITLE_TOP+150+i*14), (lx+50+i*30, TITLE_TOP+156+i*14)],
        fill=col
    )

# 타이틀 구역 하단 구분선
sep_y = HDR_H + TITLE_ZONE_H + 6
draw.line([(PAD_L, sep_y),(A4_W-PAD_R, sep_y)], fill=(175,190,215), width=2)

# ══════════════════════════════════════════════════════
# 본문 렌더링
# ══════════════════════════════════════════════════════
def pill(x1,y1,x2,y2,fill,brd):
    draw.rounded_rectangle([(x1,y1),(x2,y2)], radius=10, fill=fill, outline=brd, width=2)

def badge(cx, cy, r, color, num):
    draw.ellipse([(cx-r,cy-r),(cx+r,cy+r)], fill=color)
    draw.text((cx-9, cy-14), str(num), font=fkb, fill=(255,255,255))

def jit(a=1):
    return rng.randint(-a,a), rng.randint(-a,a)

cy = CONTENT_TOP + 4
step_num = 0

for (t, key, text) in ALL_ROWS:
    dx, dy = jit()

    if t == "gap":
        cy += int(LINE_H * 0.55); continue

    if t == "sec_box":
        col = C[key]
        pill(PAD_L, cy+2, PAD_L+230, cy+LINE_H-8, col['box'], col['brd'])
        draw.text((PAD_L+14+dx, cy+4+dy), text, font=ft, fill=col['txt'])
        cy += LINE_H; step_num = 0; continue

    if t == "step":
        step_num += 1
        col = C[key]
        badge(PAD_L+18, cy+LINE_H//2-1, 15, col['badge'], step_num)
        draw.text((PAD_L+40+dx, cy+dy), text, font=fs, fill=col['badge'])
        cy += LINE_H; continue

    if t == "body":
        col = C[key]
        ink = col.get('ink', (40,40,40))
        indent = PAD_L+20 if key not in ('s1','s2','s3','s4') else PAD_L+46
        draw.text((indent+dx, cy+dy), text, font=fb, fill=ink)
        cy += LINE_H; continue

    if t == "answer":
        pill(PAD_L, cy, A4_W-PAD_R, cy+int(LINE_H*1.5), C['a']['box'], C['a']['brd'])
        draw.text((PAD_L+32+dx, cy+10+dy), text, font=fa, fill=(140,50,0))
        cy += int(LINE_H*1.6); continue

# ══════════════════════════════════════════════════════
# 푸터
# ══════════════════════════════════════════════════════
fy = A4_H - FTR_H
draw.line([(PAD_L, fy),(A4_W-PAD_R, fy)], fill=(200,210,225), width=1)
draw.text((PAD_L, fy+10), "AI 풀이 노트  ·  REDPAPA", font=fk, fill=(160,170,145))
draw.text((A4_W-PAD_R-190, fy+10), "표준정규분포 #21", font=fk, fill=(160,170,145))

# ── 저장 ───────────────────────────────────────────────
os.makedirs("public", exist_ok=True)
img.save(OUT_PDF, "PDF", resolution=DPI)
img.save(OUT_PNG, "PNG")
print(f"PDF: {OUT_PDF}  ({A4_W}x{A4_H}, {DPI} DPI)")
print(f"PNG: {OUT_PNG}")
print(f"본문 끝 y={cy}  /  여백={A4_H-FTR_H-cy}px")
