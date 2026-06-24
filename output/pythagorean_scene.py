from manim import *
import numpy as np

class MathAnimation(Scene):
    def construct(self):
        # 폰트: NanumSquareRound ExtraBold (제목), NanumSquareRound (본문)
        KRH = {"font": "NanumSquareRound ExtraBold"}
        KR  = {"font": "NanumSquareRound"}

        # ── 제목 영역 (y > 2.0 전용) ──────────────────────
        title = Text("피타고라스 정리", font_size=44, color=BLUE, **KRH)
        subtitle = Text("직각삼각형의 세 변의 관계", font_size=20, color=GRAY_B, **KR)
        title.to_edge(UP, buff=0.35)
        subtitle.next_to(title, DOWN, buff=0.10)

        sep = Line(LEFT*6.0, RIGHT*6.0, stroke_width=1, color=BLUE_E)
        sep.next_to(subtitle, DOWN, buff=0.18)

        self.play(Write(title), run_time=0.9)
        self.play(FadeIn(subtitle), FadeIn(sep), run_time=0.5)
        self.wait(0.3)

        # ── 삼각형 꼭짓점 (3-4-5, scale=0.50) ────────────
        #    모든 도형이 y < 1.8 이내에 들어오도록 배치
        s = 0.50
        a, b, c_len = 3*s, 4*s, 5*s   # 1.5, 2.0, 2.5

        O  = np.array([-3.2, -1.8, 0])
        Bv = O + RIGHT * a             # (-1.7, -1.8)
        Cv = O + UP    * b             # (-3.2,  0.2)

        tri = Polygon(O, Bv, Cv,
                      color=WHITE,
                      fill_color=BLUE_E, fill_opacity=0.20,
                      stroke_width=2.5)

        # 직각 기호
        d = 0.17
        ra = VGroup(
            Line(O + RIGHT*d,           O + RIGHT*d + UP*d, stroke_width=2),
            Line(O + UP*d,              O + RIGHT*d + UP*d, stroke_width=2),
        ).set_color(WHITE)

        # 변 레이블
        la = MathTex("a", font_size=36, color=RED   ).next_to((O+Bv)/2, DOWN,        buff=0.20)
        lb = MathTex("b", font_size=36, color=GREEN ).next_to((O+Cv)/2, LEFT,        buff=0.20)
        lc = MathTex("c", font_size=36, color=YELLOW).next_to((Bv+Cv)/2, RIGHT+UP*0.15, buff=0.20)

        self.play(Create(tri), Create(ra), run_time=0.9)
        self.play(Write(la), Write(lb), Write(lc), run_time=0.6)
        self.wait(0.3)

        # ── a² 사각형 (아래) ─────────────────────────────
        sq_a = Square(side_length=a,
                      color=RED, fill_color=RED, fill_opacity=0.20, stroke_width=2)
        sq_a.move_to((O + Bv)/2 + DOWN*(a/2))
        la2 = MathTex("a^2", font_size=28, color=RED).move_to(sq_a.get_center())

        # ── b² 사각형 (왼쪽) ─────────────────────────────
        sq_b = Square(side_length=b,
                      color=GREEN, fill_color=GREEN, fill_opacity=0.20, stroke_width=2)
        sq_b.move_to((O + Cv)/2 + LEFT*(b/2))
        lb2 = MathTex("b^2", font_size=28, color=GREEN).move_to(sq_b.get_center())

        # ── c² 사각형 (빗변 바깥, y_max≈1.7 확인됨) ──────
        cd = (Cv - Bv) / np.linalg.norm(Cv - Bv)
        cp = np.array([cd[1], -cd[0], 0])          # 시계 방향 90° 회전 → 바깥쪽
        P1, P2 = Bv, Cv
        P3 = Cv + cp * c_len
        P4 = Bv + cp * c_len
        sq_c = Polygon(P1, P2, P3, P4,
                        color=YELLOW, fill_color=YELLOW, fill_opacity=0.20, stroke_width=2)
        lc2 = MathTex("c^2", font_size=28, color=YELLOW).move_to((P1+P2+P3+P4)/4)

        self.play(Create(sq_a), FadeIn(la2), run_time=0.6)
        self.play(Create(sq_b), FadeIn(lb2), run_time=0.6)
        self.play(Create(sq_c), FadeIn(lc2), run_time=0.6)
        self.wait(0.4)

        # ── 수식 (오른쪽 영역 x > 1.5) ───────────────────
        formula = MathTex(
            "a^2", "+", "b^2", "=", "c^2",
            font_size=54,
        ).move_to(RIGHT*3.8 + UP*0.9)
        formula[0].set_color(RED)
        formula[2].set_color(GREEN)
        formula[4].set_color(YELLOW)

        self.play(Write(formula), run_time=1.0)
        self.wait(0.3)

        # ── 3-4-5 수치 예시 ───────────────────────────────
        ex_lbl = Text("예시  3 - 4 - 5", font_size=20, color=GRAY_B, **KR)
        ex_lbl.next_to(formula, DOWN, buff=0.45)
        ex1 = MathTex(r"3^2 + 4^2 = 5^2", font_size=36)
        ex1.next_to(ex_lbl, DOWN, buff=0.20)
        ex2 = MathTex(r"9 + 16 = 25", font_size=36)
        ex2.next_to(ex1, DOWN, buff=0.18)

        self.play(FadeIn(ex_lbl), run_time=0.4)
        self.play(Write(ex1), run_time=0.7)
        self.play(Write(ex2), run_time=0.6)
        self.wait(0.4)

        # ── 강조 박스 ─────────────────────────────────────
        box = SurroundingRectangle(formula, color=BLUE, buff=0.20, corner_radius=0.12)
        self.play(Create(box), Flash(formula, color=BLUE, line_length=0.3), run_time=0.8)
        self.wait(2.0)
