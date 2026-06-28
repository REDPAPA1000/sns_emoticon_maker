from manim import *
import numpy as np

class WordlessTrigProof(Scene):
    def construct(self):
        # 1. 축 및 사인 함수 생성
        axes = Axes(
            x_range=[0, 3 * PI, PI / 2],
            y_range=[-1.5, 1.5, 1],
            x_length=10,
            y_length=4,
            axis_config={"color": WHITE}
        )

        # 사인 곡선 렌더링
        sine_wave = axes.plot(lambda x: np.sin(x), color=BLUE, x_range=[0, 3*PI])
        self.play(Create(axes), Create(sine_wave), run_time=2)
        self.wait(0.5)

        # 텍스트 없이 시각적 블록만으로 비율을 증명하는 내부 함수
        def prove_ratio_wordlessly(k_val, color_theme):
            # 가로선 y = k
            line = axes.plot(lambda x: k_val, color=color_theme, x_range=[0, 3*PI])
            self.play(Create(line))

            # 교점 x좌표 계산 (내부적으로만 사용되며 화면에 텍스트로 출력되지 않음)
            x1 = np.arcsin(k_val)
            x2 = PI - x1
            x3 = 2 * PI + x1

            # 교점에 점 생성
            d1 = Dot(axes.c2p(x1, k_val), color=color_theme)
            d2 = Dot(axes.c2p(x2, k_val), color=color_theme)
            d3 = Dot(axes.c2p(x3, k_val), color=color_theme)
            self.play(FadeIn(d1, d2, d3))

            # x축으로 수선의 발 내리기 (Dashed Line)
            l1 = axes.get_vertical_line(axes.c2p(x1, k_val), color=color_theme, line_func=DashedLine)
            l2 = axes.get_vertical_line(axes.c2p(x2, k_val), color=color_theme, line_func=DashedLine)
            l3 = axes.get_vertical_line(axes.c2p(x3, k_val), color=color_theme, line_func=DashedLine)
            self.play(Create(l1), Create(l2), Create(l3))

            # 구간 표시용 괄호(Brace)
            brace_in = BraceBetweenPoints(axes.c2p(x1, 0), axes.c2p(x2, 0), direction=DOWN)
            brace_out = BraceBetweenPoints(axes.c2p(x2, 0), axes.c2p(x3, 0), direction=DOWN)
            self.play(Create(brace_in), Create(brace_out))

            # 시각적 비율 블록 생성 (기준이 되는 단위 길이)
            unit_val = x2 - x1
            num_blocks = int(round((x3 - x2) / unit_val))

            # 첫 번째 구간을 채우는 기준 단위 블록 1개
            vis_width = axes.c2p(unit_val, 0)[0] - axes.c2p(0, 0)[0]
            base_block = Rectangle(width=vis_width * 0.95, height=0.4, color=color_theme, fill_opacity=0.6)
            base_block.next_to(brace_in, DOWN)
            self.play(FadeIn(base_block))

            # 두 번째 구간을 채우는 복제 블록 N개
            blocks_group = VGroup()
            for i in range(num_blocks):
                block = base_block.copy()
                # 기준 길이에 맞춰 위치를 정확하게 분할 배치
                center_x = x2 + (i + 0.5) * unit_val
                block.set_x(axes.c2p(center_x, 0)[0])
                block.match_y(base_block)
                blocks_group.add(block)

            # 시각적 충격: 블록이 순차적으로 나타나며 눈으로 비율을 세게 만듦
            self.play(FadeIn(blocks_group, lag_ratio=0.3), run_time=2)
            self.wait(2)

            # 다음 증명을 위한 화면 전환 (Clean up)
            self.play(FadeOut(line, d1, d2, d3, l1, l2, l3, brace_in, brace_out, base_block, blocks_group))

        # 1. k = 1/2 일 때 (1:2 비율 증명 - 빨간색 블록 1개 vs 2개)
        prove_ratio_wordlessly(0.5, RED)

        # 2. k = sqrt(2)/2 일 때 (1:3 비율 증명 - 초록색 블록 1개 vs 3개)
        prove_ratio_wordlessly(np.sqrt(2)/2, GREEN)

        # 3. k = sqrt(3)/2 일 때 (1:5 비율 증명 - 보라색 블록 1개 vs 5개)
        prove_ratio_wordlessly(np.sqrt(3)/2, PURPLE)

        self.play(FadeOut(axes, sine_wave))
        self.wait(1)
