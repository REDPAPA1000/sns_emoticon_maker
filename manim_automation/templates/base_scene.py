"""
Base scene template for injecting pre-defined topics into a consistent Manim structure.

Usage (batch injection):
    from templates.base_scene import build_scene_code
    code = build_scene_code(title="피타고라스 정리", formula=r"a^2 + b^2 = c^2", description="직각삼각형의 세 변 관계")
"""

from string import Template

_SCENE_TEMPLATE = Template('''from manim import *

class MathAnimation(Scene):
    def construct(self):
        title = Text("$title", font_size=48, color=BLUE)
        formula = MathTex(r"$formula", font_size=60)
        description = Text("$description", font_size=28, color=GRAY)

        title.to_edge(UP)
        formula.move_to(ORIGIN)
        description.to_edge(DOWN)

        self.play(Write(title), run_time=1.5)
        self.play(FadeIn(formula, shift=UP * 0.3), run_time=1.5)
        self.play(FadeIn(description), run_time=1)
        self.wait(2)

        box = SurroundingRectangle(formula, color=YELLOW, buff=0.3)
        self.play(Create(box))
        self.wait(1)
''')


def build_scene_code(title: str, formula: str, description: str) -> str:
    """Return a complete Manim scene string for the given topic data."""
    return _SCENE_TEMPLATE.substitute(
        title=title.replace("\\", "\\\\"),
        formula=formula,
        description=description.replace("\\", "\\\\"),
    )
