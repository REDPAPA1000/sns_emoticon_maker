from manim import *
import numpy as np

class MathAnimation(Scene):
    def construct(self):
        KR = {"font": "NanumGothic"}

        # ── 제목 ──────────────────────────────────────
        title = Text("피타고라스 정리", font_size=52, color=BLUE, **KR)
        subtitle = Text("직각삼각형의 세 변의 관계", font_size=26, color=GRAY, **KR)
        title.to_edge(UP, buff=0.35)
        subtitle.next_to(title, DOWN, buff=0.12)

        self.play(Write(title), run_time=1.0)
        self.play(FadeIn(subtitle), run_time=0.6)
        self.wait(0.4)

        # ── 삼각형 꼭짓점 (3-4-5, 스케일 0.65) ──────
        s = 0.65
        a, b, c_len = 3 * s, 4 * s, 5 * s
        O  = np.array([-3.2, -1.8, 0])   # 직각
        Bv = O + RIGHT * a
        Cv = O + UP * b

        tri = Polygon(O, Bv, Cv,
                      color=WHITE,
                      fill_color=BLUE_E, fill_opacity=0.15,
                      stroke_width=2.5)

        # 직각 표시
        d = 0.22
        ra = VGroup(
            Line(O + RIGHT * d, O + RIGHT * d + UP * d, stroke_width=2),
            Line(O + UP * d,    O + RIGHT * d + UP * d, stroke_width=2)
        ).set_color(WHITE)

        # 변 레이블
        la = MathTex("a", font_size=40, color=RED   ).next_to((O + Bv)/2, DOWN,  buff=0.25)
        lb = MathTex("b", font_size=40, color=GREEN ).next_to((O + Cv)/2, LEFT,  buff=0.25)
        lc = MathTex("c", font_size=40, color=YELLOW).next_to((Bv+Cv)/2, RIGHT + UP*0.2, buff=0.28)

        self.play(Create(tri), Create(ra), run_time=1.0)
        self.play(Write(la), Write(lb), Write(lc), run_time=0.7)
        self.wait(0.4)

        # ── a² 정사각형 (아래) ────────────────────────
        sq_a = Rectangle(width=a, height=a,
                          color=RED, fill_color=RED, fill_opacity=0.25, stroke_width=2)
        sq_a.next_to(tri, DOWN, buff=0, aligned_edge=LEFT)
        sq_a.align_to(O, LEFT)
        sq_a.next_to(O + RIGHT*(a/2), DOWN, buff=0).shift(LEFT*(a/2))
        sq_a.move_to((O + Bv)/2 + DOWN*(a/2))
        la2 = MathTex("a^2", font_size=34, color=RED).move_to(sq_a.get_center())

        # ── b² 정사각형 (왼쪽) ───────────────────────
        sq_b = Rectangle(width=b, height=b,
                          color=GREEN, fill_color=GREEN, fill_opacity=0.25, stroke_width=2)
        sq_b.move_to((O + Cv)/2 + LEFT*(b/2))
        lb2 = MathTex("b^2", font_size=34, color=GREEN).move_to(sq_b.get_center())

        # ── c² 정사각형 (빗변, 기울어짐) ─────────────
        cd = (Cv - Bv) / np.linalg.norm(Cv - Bv)           # 빗변 방향
        cp = np.array([ cd[1], -cd[0], 0])                   # 바깥 수직
        P1, P2 = Bv, Cv
        P3, P4 = Cv + cp * c_len, Bv + cp * c_len
        sq_c = Polygon(P1, P2, P3, P4,
                        color=YELLOW, fill_color=YELLOW, fill_opacity=0.25, stroke_width=2)
        center_c = (P1 + P2 + P3 + P4) / 4 + cp * 0.05
        lc2 = MathTex("c^2", font_size=34, color=YELLOW).move_to(center_c)

        self.play(Create(sq_a), FadeIn(la2), run_time=0.7)
        self.play(Create(sq_b), FadeIn(lb2), run_time=0.7)
        self.play(Create(sq_c), FadeIn(lc2), run_time=0.7)
        self.wait(0.5)

        # ── 수식 ─────────────────────────────────────
        formula = MathTex(
            "a^2", "+", "b^2", "=", "c^2",
            font_size=58
        ).to_edge(RIGHT, buff=0.7).shift(UP * 0.8)
        formula[0].set_color(RED)
        formula[2].set_color(GREEN)
        formula[4].set_color(YELLOW)

        self.play(Write(formula), run_time=1.1)
        self.wait(0.4)

        # ── 3-4-5 예시 ───────────────────────────────
        ex_label = Text("예시 (3-4-5)", font_size=24, color=GRAY, **KR)
        ex_label.next_to(formula, DOWN, buff=0.55)
        ex1 = MathTex("3^2", "+", "4^2", "=", "5^2", font_size=40)
        ex1[0].set_color(RED)
        ex1[2].set_color(GREEN)
        ex1[4].set_color(YELLOW)
        ex1.next_to(ex_label, DOWN, buff=0.2)
        ex2 = MathTex("9", "+", "16", "=", "25", font_size=40)
        ex2.next_to(ex1, DOWN, buff=0.18)

        self.play(FadeIn(ex_label), run_time=0.5)
        self.play(Write(ex1), run_time=0.8)
        self.play(Write(ex2), run_time=0.7)
        self.wait(0.5)

        # ── 강조 박스 ─────────────────────────────────
        box = SurroundingRectangle(formula, color=BLUE, buff=0.2, corner_radius=0.1)
        self.play(Create(box), run_time=0.6)
        self.wait(2.0)
