from manim import *
import numpy as np

# 세로 쇼츠 설정
config.pixel_width = 1080
config.pixel_height = 1920
config.frame_width = 9
config.frame_height = 16
config.background_color = BLACK


class KoreanTrigRatioShorts(Scene):
    def construct(self):
        # 렌더 환경(리눅스)용 폰트. 윈도우에선 "Malgun Gothic" 사용 가능.
        KOREAN_FONT = "NanumSquareRound"
        TITLE_COLOR = "#F5D28A"
        MAIN_COLOR = BLUE_C
        GUIDE_COLOR = GREY_B
        POINT_COLOR = YELLOW
        MID_COLOR = GREEN_C
        THIRD_COLOR = RED_C
        THIRD2_COLOR = PURPLE_C

        def ktext(txt, size=36, color=WHITE, weight=NORMAL):
            return Text(txt, font=KOREAN_FONT, font_size=size, color=color, weight=weight)

        def small_label(txt, point, color=WHITE, size=28, direction=UP, buff=0.12):
            label = ktext(txt, size=size, color=color)
            label.next_to(point, direction, buff=buff)
            return label

        # 1. 제목
        title = ktext("삼각함수의 비율관계", size=52, color=TITLE_COLOR, weight=BOLD)
        subtitle = ktext("특수각은 그래프 위에 숨어 있다", size=30, color=GREY_A)
        title.to_edge(UP, buff=0.9)
        subtitle.next_to(title, DOWN, buff=0.18)
        self.play(FadeIn(title, shift=DOWN * 0.2), run_time=1.0)
        self.play(FadeIn(subtitle, shift=DOWN * 0.15), run_time=0.8)
        self.wait(0.5)

        # 2. 좌표축과 사인 그래프
        axes = Axes(
            x_range=[-0.2, PI + 0.25, PI / 6], y_range=[-0.2, 1.25, 0.5],
            x_length=7.4, y_length=4.6, tips=False,
            axis_config={"color": GUIDE_COLOR, "stroke_width": 2}
        )
        axes.shift(UP * 1.15)
        sine_wave = axes.plot(lambda x: np.sin(x), x_range=[0, PI], color=MAIN_COLOR, stroke_width=5)
        formula = MathTex(r"y=\sin x", font_size=46, color=MAIN_COLOR)
        formula.next_to(axes, DOWN, buff=0.45)
        self.play(Create(axes), run_time=1.2)
        self.play(Create(sine_wave), FadeIn(formula, shift=UP * 0.1), run_time=2.0)
        self.wait(0.5)

        # 3. 변곡점과 극점 표시
        inflection_x = 0
        peak_x = PI / 2
        inflection_point = Dot(axes.c2p(inflection_x, 0), color=WHITE, radius=0.085)
        peak_point = Dot(axes.c2p(peak_x, 1), color=POINT_COLOR, radius=0.095)
        inflection_label = small_label("변곡점", inflection_point, color=WHITE, size=26, direction=UP, buff=0.18)
        inflection_label.shift(LEFT * 0.7)
        peak_label = small_label("극점", peak_point, color=POINT_COLOR, size=30, direction=UP, buff=0.22)
        interval_line = Line(axes.c2p(inflection_x, -0.08), axes.c2p(peak_x, -0.08), color=TITLE_COLOR, stroke_width=5)
        interval_text = ktext("변곡점에서 극점까지", size=31, color=TITLE_COLOR)
        interval_text.next_to(interval_line, DOWN, buff=0.22)
        self.play(FadeIn(inflection_point), FadeIn(peak_point), run_time=0.7)
        self.play(FadeIn(inflection_label), FadeIn(peak_label), run_time=0.8)
        self.play(Create(interval_line), FadeIn(interval_text, shift=DOWN * 0.1), run_time=1.0)
        self.wait(0.7)

        # 4. 1 : 1 비율 → sqrt(2)/2
        section_title_1 = ktext("먼저, 1 : 1 로 나누면", size=36, color=MID_COLOR, weight=BOLD)
        section_title_1.move_to(DOWN * 3.2)
        mid_x = PI / 4
        mid_y = np.sqrt(2) / 2
        mid_bottom = Dot(axes.c2p(mid_x, 0), color=MID_COLOR, radius=0.06)
        mid_point = Dot(axes.c2p(mid_x, mid_y), color=MID_COLOR, radius=0.09)
        mid_vline = DashedLine(axes.c2p(mid_x, 0), axes.c2p(mid_x, mid_y), color=MID_COLOR, dash_length=0.08, stroke_width=3)
        mid_hline = DashedLine(axes.c2p(0, mid_y), axes.c2p(mid_x, mid_y), color=MID_COLOR, dash_length=0.08, stroke_width=3)
        left_half = Line(axes.c2p(0, -0.16), axes.c2p(mid_x, -0.16), color=MID_COLOR, stroke_width=5)
        right_half = Line(axes.c2p(mid_x, -0.16), axes.c2p(peak_x, -0.16), color=MID_COLOR, stroke_width=5)
        one_one_label = MathTex(r"1:1", font_size=42, color=MID_COLOR)
        one_one_label.next_to(right_half, DOWN, buff=0.2)
        sqrt_label = MathTex(r"\frac{\sqrt{2}}{2}", font_size=56, color=MID_COLOR)
        sqrt_label.next_to(mid_point, RIGHT, buff=0.18)
        self.play(FadeOut(interval_text), FadeIn(section_title_1), run_time=0.7)
        self.play(Create(left_half), Create(right_half), FadeIn(one_one_label), run_time=1.2)
        self.play(FadeIn(mid_bottom), Create(mid_vline), Create(mid_hline), run_time=1.1)
        self.play(FadeIn(mid_point, scale=1.3), FadeIn(sqrt_label, shift=RIGHT * 0.1), run_time=1.0)
        self.wait(1.0)
        self.play(
            FadeOut(section_title_1), FadeOut(mid_bottom), FadeOut(mid_point),
            FadeOut(mid_vline), FadeOut(mid_hline), FadeOut(left_half),
            FadeOut(right_half), FadeOut(one_one_label), FadeOut(sqrt_label), run_time=0.8
        )

        # 5. 1 : 1 : 1 비율 → 1/2, sqrt(3)/2
        section_title_2 = ktext("이번엔, 1 : 1 : 1 로 나누면", size=35, color=THIRD_COLOR, weight=BOLD)
        section_title_2.move_to(DOWN * 3.2)
        x_a, y_a = PI / 6, 1 / 2
        x_b, y_b = PI / 3, np.sqrt(3) / 2
        bottom_a = Dot(axes.c2p(x_a, 0), color=THIRD_COLOR, radius=0.06)
        bottom_b = Dot(axes.c2p(x_b, 0), color=THIRD2_COLOR, radius=0.06)
        point_a = Dot(axes.c2p(x_a, y_a), color=THIRD_COLOR, radius=0.09)
        point_b = Dot(axes.c2p(x_b, y_b), color=THIRD2_COLOR, radius=0.09)
        vline_a = DashedLine(axes.c2p(x_a, 0), axes.c2p(x_a, y_a), color=THIRD_COLOR, dash_length=0.08, stroke_width=3)
        vline_b = DashedLine(axes.c2p(x_b, 0), axes.c2p(x_b, y_b), color=THIRD2_COLOR, dash_length=0.08, stroke_width=3)
        hline_a = DashedLine(axes.c2p(0, y_a), axes.c2p(x_a, y_a), color=THIRD_COLOR, dash_length=0.08, stroke_width=3)
        hline_b = DashedLine(axes.c2p(0, y_b), axes.c2p(x_b, y_b), color=THIRD2_COLOR, dash_length=0.08, stroke_width=3)
        seg1 = Line(axes.c2p(0, -0.16), axes.c2p(x_a, -0.16), color=THIRD_COLOR, stroke_width=5)
        seg2 = Line(axes.c2p(x_a, -0.16), axes.c2p(x_b, -0.16), color=THIRD_COLOR, stroke_width=5)
        seg3 = Line(axes.c2p(x_b, -0.16), axes.c2p(peak_x, -0.16), color=THIRD_COLOR, stroke_width=5)
        one_three_label = MathTex(r"1:1:1", font_size=42, color=THIRD_COLOR)
        one_three_label.next_to(seg2, DOWN, buff=0.22)
        half_label = MathTex(r"\frac{1}{2}", font_size=50, color=THIRD_COLOR)
        half_label.next_to(point_a, LEFT, buff=0.16)
        root_three_label = MathTex(r"\frac{\sqrt{3}}{2}", font_size=50, color=THIRD2_COLOR)
        root_three_label.next_to(hline_b, LEFT, buff=0.12)
        self.play(FadeIn(section_title_2), run_time=0.7)
        self.play(Create(seg1), Create(seg2), Create(seg3), FadeIn(one_three_label), run_time=1.2)
        self.play(FadeIn(bottom_a), Create(vline_a), Create(hline_a), FadeIn(point_a, scale=1.3), FadeIn(half_label, shift=RIGHT * 0.1), run_time=1.2)
        self.play(FadeIn(bottom_b), Create(vline_b), Create(hline_b), FadeIn(point_b, scale=1.3), FadeIn(root_three_label, shift=RIGHT * 0.1), run_time=1.2)
        self.wait(1.0)

        # 6. 일반형으로 확장
        expand_text_1 = ktext("그래프가 변해도", size=38, color=TITLE_COLOR, weight=BOLD)
        expand_text_2 = ktext("비율은 남는다", size=46, color=TITLE_COLOR, weight=BOLD)
        expand_group = VGroup(expand_text_1, expand_text_2).arrange(DOWN, buff=0.2)
        expand_group.move_to(DOWN * 3.25)
        general_formula = MathTex(r"y=a\sin b(x-c)+d", font_size=46, color=TITLE_COLOR)
        general_formula.next_to(formula, DOWN, buff=0.15)
        transformed_wave = axes.plot(lambda x: 0.72 * np.sin(1.35 * (x - 0.22)) + 0.22, x_range=[0.22, 0.22 + PI / 1.35], color=TEAL_C, stroke_width=5)
        old_objects = VGroup(
            section_title_2, bottom_a, bottom_b, point_a, point_b,
            vline_a, vline_b, hline_a, hline_b, seg1, seg2, seg3,
            one_three_label, half_label, root_three_label
        )
        self.play(FadeOut(old_objects), run_time=0.7)
        self.play(FadeIn(expand_group), FadeIn(general_formula), run_time=0.9)
        self.play(Transform(sine_wave, transformed_wave), run_time=1.8)
        self.wait(0.8)

        # 7. 최종 정리 — 그래프를 먼저 깨끗이 비우고 정리 박스를 중앙에 표시
        self.play(
            FadeOut(expand_group), FadeOut(general_formula),
            FadeOut(axes), FadeOut(sine_wave), FadeOut(formula),
            FadeOut(inflection_point), FadeOut(peak_point),
            FadeOut(inflection_label), FadeOut(peak_label), FadeOut(interval_line),
            run_time=0.8
        )

        summary_box = RoundedRectangle(width=7.8, height=4.6, corner_radius=0.25, color=TITLE_COLOR, stroke_width=3, fill_color="#111111", fill_opacity=1.0)
        summary_box.move_to(UP * 0.3)
        summary_title = ktext("정리", size=44, color=TITLE_COLOR, weight=BOLD)
        summary_title.move_to(summary_box.get_top() + DOWN * 0.55)
        summary_1 = ktext("변곡점 ↔ 극점 구간을 등분하면", size=30, color=WHITE)
        summary_2 = MathTex(r"1:1 \ \Rightarrow\ \frac{\sqrt{2}}{2}", font_size=46, color=MID_COLOR)
        summary_3 = MathTex(r"1:1:1 \ \Rightarrow\ \frac{1}{2},\ \frac{\sqrt{3}}{2}", font_size=46, color=THIRD_COLOR)
        summary_group = VGroup(summary_1, summary_2, summary_3).arrange(DOWN, buff=0.5)
        summary_group.next_to(summary_title, DOWN, buff=0.45)
        final_msg = ktext("특수각은 외우는 것이 아니라, 보이는 것이다", size=28, color=GREY_A)
        final_msg.next_to(summary_box, DOWN, buff=0.45)
        self.play(FadeIn(summary_box, scale=0.96), run_time=0.7)
        self.play(FadeIn(summary_title), FadeIn(summary_group, shift=UP * 0.1), run_time=1.2)
        self.play(FadeIn(final_msg), run_time=0.8)
        self.wait(2.0)
        self.play(FadeOut(title, subtitle, summary_box, summary_title, summary_group, final_msg), run_time=1.0)
        self.wait(0.5)
