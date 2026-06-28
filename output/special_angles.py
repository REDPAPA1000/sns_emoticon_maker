from manim import *
import numpy as np

class MathAnimation(Scene):
    def construct(self):
        KRH = {"font": "NanumSquareRound ExtraBold"}
        KR  = {"font": "NanumSquareRound"}

        # ════════════════════════════════════════════════
        #  Section 0 — 제목
        # ════════════════════════════════════════════════
        title = Text("특수각의 삼각비", font_size=52, color=BLUE, **KRH)
        sub   = Text("30°  ·  45°  ·  60° 는 어떻게 구할까?", font_size=26, color=GRAY_B, **KR)
        sub.next_to(title, DOWN, buff=0.25)
        g = VGroup(title, sub).move_to(ORIGIN)

        self.play(Write(title), run_time=1.0)
        self.play(FadeIn(sub, shift=UP*0.2), run_time=0.7)
        self.wait(1.0)
        self.play(FadeOut(g), run_time=0.6)

        # ════════════════════════════════════════════════
        #  Section 1 — 삼각비의 정의
        # ════════════════════════════════════════════════
        head1 = Text("① 삼각비란?", font_size=34, color=BLUE, **KRH).to_edge(UP, buff=0.45)
        self.play(FadeIn(head1, shift=DOWN*0.2), run_time=0.6)

        # 직각삼각형
        O  = np.array([-3.4, -1.6, 0])
        B  = O + RIGHT*4.2
        A  = O + RIGHT*4.2 + UP*2.6
        tri = Polygon(O, B, A, color=WHITE, stroke_width=3,
                      fill_color=BLUE_E, fill_opacity=0.12)
        ra  = Square(side_length=0.3, color=WHITE, stroke_width=2).move_to(B + LEFT*0.15 + UP*0.15)
        ang = Angle(Line(O, B), Line(O, A), radius=0.7, color=YELLOW)
        ang_lbl = MathTex(r"\theta", font_size=36, color=YELLOW).next_to(ang, RIGHT, buff=0.12)

        # 변 레이블
        lab_c = Text("빗변", font_size=20, color=YELLOW, **KR).move_to((O+A)/2 + UP*0.35 + LEFT*0.25)
        lab_a = Text("높이", font_size=20, color=RED, **KR).move_to((B+A)/2 + RIGHT*0.55)
        lab_b = Text("밑변", font_size=20, color=GREEN, **KR).move_to((O+B)/2 + DOWN*0.35)

        self.play(Create(tri), Create(ra), run_time=1.0)
        self.play(Create(ang), Write(ang_lbl), run_time=0.6)
        self.play(FadeIn(lab_c), FadeIn(lab_a), FadeIn(lab_b), run_time=0.7)

        # 정의식 (오른쪽) — 기호로 표현 (a=높이, b=밑변, c=빗변)
        defs = VGroup(
            MathTex(r"\sin\theta=\dfrac{a}{c}", font_size=34),
            MathTex(r"\cos\theta=\dfrac{b}{c}", font_size=34),
            MathTex(r"\tan\theta=\dfrac{a}{b}", font_size=34),
        ).arrange(DOWN, buff=0.45, aligned_edge=LEFT).to_edge(RIGHT, buff=0.9)
        defs[0][0][4].set_color(RED)     # sin 분자 a
        defs[0][0][-1].set_color(YELLOW) # sin 분모 c
        defs[1][0][4].set_color(GREEN)   # cos 분자 b
        defs[1][0][-1].set_color(YELLOW) # cos 분모 c
        defs[2][0][4].set_color(RED)     # tan 분자 a
        defs[2][0][-1].set_color(GREEN)  # tan 분모 b

        legend = VGroup(
            Text("a = 높이", font_size=18, color=RED, **KR),
            Text("b = 밑변", font_size=18, color=GREEN, **KR),
            Text("c = 빗변", font_size=18, color=YELLOW, **KR),
        ).arrange(DOWN, buff=0.18, aligned_edge=LEFT)
        legend.next_to(defs, DOWN, buff=0.5).align_to(defs, LEFT)

        self.play(LaggedStart(*[Write(d) for d in defs], lag_ratio=0.4), run_time=1.8)
        self.play(FadeIn(legend), run_time=0.6)
        self.wait(1.2)

        sec1 = VGroup(head1, tri, ra, ang, ang_lbl, lab_c, lab_a, lab_b, defs, legend)
        self.play(FadeOut(sec1), run_time=0.7)

        # ════════════════════════════════════════════════
        #  Section 2 — 45°의 원리 (직각이등변삼각형)
        # ════════════════════════════════════════════════
        head2 = Text("② 45° — 직각이등변삼각형", font_size=32, color=GREEN, **KRH).to_edge(UP, buff=0.45)
        self.play(FadeIn(head2, shift=DOWN*0.2), run_time=0.6)

        P  = np.array([-3.0, -1.7, 0])
        Q  = P + RIGHT*3.0
        R  = P + UP*3.0
        t45 = Polygon(P, Q, R, color=GREEN, stroke_width=3, fill_color=GREEN, fill_opacity=0.12)
        ra45 = Square(side_length=0.28, color=WHITE, stroke_width=2).move_to(P + RIGHT*0.14 + UP*0.14)

        s1 = MathTex("1", font_size=32, color=WHITE).next_to((P+Q)/2, DOWN, buff=0.2)
        s2 = MathTex("1", font_size=32, color=WHITE).next_to((P+R)/2, LEFT, buff=0.2)
        s3 = MathTex(r"\sqrt{2}", font_size=32, color=YELLOW).next_to((Q+R)/2, RIGHT+UP*0.2, buff=0.2)
        a45 = MathTex("45^\\circ", font_size=28, color=GREEN).next_to(Q, UP*0.5+LEFT*0.9)

        self.play(Create(t45), Create(ra45), run_time=0.9)
        self.play(Write(s1), Write(s2), run_time=0.6)
        self.play(Write(s3), Write(a45), run_time=0.6)

        calc45 = VGroup(
            Text("피타고라스 정리", font_size=22, color=GRAY_B, **KR),
            MathTex(r"1^2+1^2=(\sqrt{2})^2", font_size=34),
            MathTex(r"\sin 45^\circ=\dfrac{1}{\sqrt{2}}=\dfrac{\sqrt{2}}{2}", font_size=36, color=GREEN),
        ).arrange(DOWN, buff=0.4, aligned_edge=LEFT).to_edge(RIGHT, buff=0.7)
        self.play(FadeIn(calc45[0]), run_time=0.5)
        self.play(Write(calc45[1]), run_time=0.9)
        self.play(Write(calc45[2]), run_time=1.0)
        self.wait(1.3)

        sec2 = VGroup(head2, t45, ra45, s1, s2, s3, a45, calc45)
        self.play(FadeOut(sec2), run_time=0.7)

        # ════════════════════════════════════════════════
        #  Section 3 — 30°·60°의 원리 (정삼각형 절반)
        # ════════════════════════════════════════════════
        head3 = Text("③ 30°·60° — 정삼각형의 절반", font_size=32, color=RED, **KRH).to_edge(UP, buff=0.45)
        self.play(FadeIn(head3, shift=DOWN*0.2), run_time=0.6)

        # 30-60-90 삼각형 (밑변 1, 높이 √3, 빗변 2)
        M  = np.array([-3.0, -1.7, 0])
        N  = M + RIGHT*2.0      # 밑변 1 (스케일 2배 시각화)
        T  = M + UP*3.46        # 높이 √3 ≈ 1.73 (스케일 2배)
        t30 = Polygon(M, N, T, color=RED, stroke_width=3, fill_color=RED, fill_opacity=0.12)
        ra30 = Square(side_length=0.28, color=WHITE, stroke_width=2).move_to(M + RIGHT*0.14 + UP*0.14)

        b1 = MathTex("1", font_size=32, color=WHITE).next_to((M+N)/2, DOWN, buff=0.2)
        b2 = MathTex(r"\sqrt{3}", font_size=32, color=WHITE).next_to((M+T)/2, LEFT, buff=0.2)
        b3 = MathTex("2", font_size=32, color=YELLOW).next_to((N+T)/2, RIGHT+UP*0.1, buff=0.2)
        a60 = MathTex("60^\\circ", font_size=26, color=RED).next_to(M, RIGHT*1.2+UP*0.45)
        a30 = MathTex("30^\\circ", font_size=26, color=RED).next_to(T, DOWN*1.0+RIGHT*0.2)

        self.play(Create(t30), Create(ra30), run_time=0.9)
        self.play(Write(b1), Write(b2), Write(b3), run_time=0.7)
        self.play(Write(a60), Write(a30), run_time=0.6)

        calc30 = VGroup(
            MathTex(r"\sin 30^\circ=\dfrac{1}{2}", font_size=36, color=RED),
            MathTex(r"\sin 60^\circ=\dfrac{\sqrt{3}}{2}", font_size=36, color=RED),
        ).arrange(DOWN, buff=0.55, aligned_edge=LEFT).to_edge(RIGHT, buff=0.9)
        self.play(Write(calc30[0]), run_time=0.9)
        self.play(Write(calc30[1]), run_time=0.9)
        self.wait(1.3)

        sec3 = VGroup(head3, t30, ra30, b1, b2, b3, a60, a30, calc30)
        self.play(FadeOut(sec3), run_time=0.7)

        # ════════════════════════════════════════════════
        #  Section 4 — 공식 정리 표
        # ════════════════════════════════════════════════
        head4 = Text("④ 공식 정리", font_size=36, color=BLUE, **KRH).to_edge(UP, buff=0.45)
        self.play(FadeIn(head4, shift=DOWN*0.2), run_time=0.6)

        rows = [
            [r"\theta",     r"30^\circ",        r"45^\circ",         r"60^\circ"],
            [r"\sin\theta", r"\dfrac{1}{2}",    r"\dfrac{\sqrt{2}}{2}", r"\dfrac{\sqrt{3}}{2}"],
            [r"\cos\theta", r"\dfrac{\sqrt{3}}{2}", r"\dfrac{\sqrt{2}}{2}", r"\dfrac{1}{2}"],
            [r"\tan\theta", r"\dfrac{\sqrt{3}}{3}", r"1",             r"\sqrt{3}"],
        ]
        col_x = [-4.2, -1.4, 1.2, 3.8]
        row_y = [1.6, 0.4, -0.9, -2.2]
        row_colors = [WHITE, GREEN, YELLOW, RED]

        table = VGroup()
        cells = []
        for r, row in enumerate(rows):
            row_cells = []
            for c, item in enumerate(row):
                fs = 38 if r == 0 or c == 0 else 34
                col = row_colors[r] if c > 0 else (BLUE if r == 0 else row_colors[r])
                cell = MathTex(item, font_size=fs, color=col).move_to([col_x[c], row_y[r], 0])
                row_cells.append(cell)
                table.add(cell)
            cells.append(row_cells)

        # 구분선
        hline = Line([-5.1, (row_y[0]+row_y[1])/2, 0], [4.9, (row_y[0]+row_y[1])/2, 0],
                     color=GRAY, stroke_width=2)
        vline = Line([(col_x[0]+col_x[1])/2, 2.1, 0], [(col_x[0]+col_x[1])/2, -2.7, 0],
                     color=GRAY, stroke_width=2)

        # 헤더 행 먼저
        self.play(*[Write(cells[0][c]) for c in range(4)], Create(hline), Create(vline), run_time=1.0)
        # 행별로 등장
        for r in range(1, 4):
            self.play(LaggedStart(*[Write(cells[r][c]) for c in range(4)], lag_ratio=0.25), run_time=1.0)

        # sin 행 강조 박스
        sin_box = SurroundingRectangle(
            VGroup(cells[1][0], cells[1][3]), color=GREEN, buff=0.18, corner_radius=0.08
        )
        self.play(Create(sin_box), run_time=0.7)
        self.wait(2.5)
