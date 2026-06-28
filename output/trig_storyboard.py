from manim import *
import numpy as np

class TrigRatioStoryboard(Scene):
    def construct(self):
        KR = "NanumSquareRound"  # 렌더 환경용. 윈도우에선 자유롭게.

        axes = Axes(
            x_range=[-0.5 * PI, 2.5 * PI, PI / 2],
            y_range=[-1.5, 1.5, 1],
            x_length=10,
            y_length=4,
            axis_config={"color": WHITE, "include_numbers": False}
        )

        # ===== SCENE 1: 8칸 격자 + 사인 =====
        self.next_section("Scene 1: 8-Box Grid")

        grid_lines = VGroup()
        for y in [-1, 0, 1]:
            line = axes.get_horizontal_line(axes.c2p(2 * PI, y), color=GRAY, line_func=DashedLine)
            grid_lines.add(line)
        for x in [0, PI / 2, PI, 1.5 * PI, 2 * PI]:
            line = axes.get_vertical_line(axes.c2p(x, 1), color=GRAY, line_func=DashedLine)
            line_down = axes.get_vertical_line(axes.c2p(x, -1), color=GRAY, line_func=DashedLine)
            grid_lines.add(line, line_down)

        grid_text = Text("8칸 격자 대칭성", font=KR, font_size=36).to_edge(UP)

        self.play(Create(axes), Write(grid_text))
        self.play(Create(grid_lines), run_time=2)

        sine_wave = axes.plot(lambda x: np.sin(x), color=BLUE, x_range=[0, 2 * PI])
        self.play(Create(sine_wave), run_time=2)
        self.wait(1)
        self.play(FadeOut(grid_lines), FadeOut(grid_text))

        # ===== SCENE 2: 사인 3대 비율 =====
        self.next_section("Scene 2: Sine Ratios")

        def prove_sine_ratio(k_val, color_theme, ratio_str, tex_str):
            math_tex = MathTex(f"k = {tex_str}", font_size=48).to_edge(UP).shift(LEFT * 2)
            ratio_text = Text(f"비율 {ratio_str}", font=KR, font_size=40, color=color_theme).next_to(math_tex, RIGHT, buff=1)

            line = axes.plot(lambda x: k_val, color=color_theme, x_range=[0, 2.5 * PI])
            self.play(Create(line), Write(math_tex))

            x1 = np.arcsin(k_val)
            x2 = PI - x1
            x3 = 2 * PI + x1

            dots = VGroup(Dot(axes.c2p(x1, k_val), color=color_theme), Dot(axes.c2p(x2, k_val), color=color_theme), Dot(axes.c2p(x3, k_val), color=color_theme))
            lines = VGroup(
                axes.get_vertical_line(axes.c2p(x1, k_val), color=color_theme, line_func=DashedLine),
                axes.get_vertical_line(axes.c2p(x2, k_val), color=color_theme, line_func=DashedLine),
                axes.get_vertical_line(axes.c2p(x3, k_val), color=color_theme, line_func=DashedLine)
            )
            self.play(FadeIn(dots), Create(lines))

            brace_in = BraceBetweenPoints(axes.c2p(x1, 0), axes.c2p(x2, 0), direction=DOWN)
            brace_out = BraceBetweenPoints(axes.c2p(x2, 0), axes.c2p(x3, 0), direction=DOWN)
            self.play(Create(brace_in), Create(brace_out))

            unit_val = x2 - x1
            vis_width = axes.c2p(unit_val, 0)[0] - axes.c2p(0, 0)[0]
            base_block = Rectangle(width=vis_width * 0.95, height=0.4, color=color_theme, fill_opacity=0.6).next_to(brace_in, DOWN)
            self.play(FadeIn(base_block))

            num_blocks = int(round((x3 - x2) / unit_val))
            blocks_group = VGroup()
            for i in range(num_blocks):
                block = base_block.copy()
                center_x = x2 + (i + 0.5) * unit_val
                block.set_x(axes.c2p(center_x, 0)[0])
                blocks_group.add(block)

            self.play(FadeIn(blocks_group, lag_ratio=0.3), Write(ratio_text), run_time=1.5)
            self.wait(1.5)
            self.play(FadeOut(line, dots, lines, brace_in, brace_out, base_block, blocks_group, math_tex, ratio_text))

        prove_sine_ratio(0.5, RED, "1 : 2", r"\frac{1}{2}")
        prove_sine_ratio(np.sqrt(2)/2, GREEN, "1 : 3", r"\frac{\sqrt{2}}{2}")
        prove_sine_ratio(np.sqrt(3)/2, PURPLE, "1 : 5", r"\frac{\sqrt{3}}{2}")

        # ===== SCENE 3: 코사인 확장 =====
        self.next_section("Scene 3: Cosine Extension")

        cos_text = Text("코사인 그래프로의 확장", font=KR, font_size=36).to_edge(UP)
        self.play(Write(cos_text))

        cosine_wave = axes.plot(lambda x: np.cos(x), color=YELLOW, x_range=[-0.5 * PI, 2 * PI])
        self.play(Transform(sine_wave, cosine_wave), run_time=2)
        self.wait(0.5)

        k_val = 0.5
        cos_tex = MathTex(r"k = \frac{1}{2}").to_edge(UP).shift(LEFT * 2)
        cos_ratio = Text("비율 1 : 2", font=KR, font_size=40, color=RED).next_to(cos_tex, RIGHT, buff=1)

        cos_line = axes.plot(lambda x: k_val, color=RED, x_range=[-0.5 * PI, 2 * PI])
        self.play(Create(cos_line), FadeOut(cos_text), Write(cos_tex))

        cx1, cx2, cx3 = -PI/3, PI/3, 5*PI/3

        c_lines = VGroup(
            axes.get_vertical_line(axes.c2p(cx1, k_val), color=RED, line_func=DashedLine),
            axes.get_vertical_line(axes.c2p(cx2, k_val), color=RED, line_func=DashedLine),
            axes.get_vertical_line(axes.c2p(cx3, k_val), color=RED, line_func=DashedLine)
        )
        self.play(Create(c_lines))

        c_brace_in = BraceBetweenPoints(axes.c2p(cx1, 0), axes.c2p(cx2, 0), direction=DOWN)
        c_brace_out = BraceBetweenPoints(axes.c2p(cx2, 0), axes.c2p(cx3, 0), direction=DOWN)
        self.play(Create(c_brace_in), Create(c_brace_out))

        c_unit = cx2 - cx1
        c_width = axes.c2p(c_unit, 0)[0] - axes.c2p(0, 0)[0]
        c_base_block = Rectangle(width=c_width * 0.95, height=0.4, color=RED, fill_opacity=0.6).next_to(c_brace_in, DOWN)
        self.play(FadeIn(c_base_block))

        c_blocks = VGroup()
        for i in range(2):
            block = c_base_block.copy()
            center_x = cx2 + (i + 0.5) * c_unit
            block.set_x(axes.c2p(center_x, 0)[0])
            c_blocks.add(block)

        self.play(FadeIn(c_blocks, lag_ratio=0.3), Write(cos_ratio), run_time=1.5)
        self.wait(2)

        self.play(FadeOut(Group(*self.mobjects)))
        self.wait(1)
