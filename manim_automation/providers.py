"""
LLM Provider abstraction layer.

Supports three backends for generating Manim code:
- claude:  Anthropic Claude API (유료, 고품질)
- gemini:  Google Gemini API (무료 티어 있음)
- ollama:  로컬 Ollama (완전 무료, 무제한)

All providers share the same interface: generate(system_prompt, user_message) -> str
영상 품질은 Manim이 렌더링하므로 프로바이더와 무관합니다.
프로바이더는 '코드 생성 정확도'에만 영향을 줍니다.
"""

import os
import json
import urllib.request
import urllib.error

# 각 프로바이더의 기본 모델
DEFAULT_MODELS = {
    "claude": "claude-opus-4-8",
    "gemini": "gemini-2.0-flash",
    "ollama": "qwen2.5-coder:7b",
}


class ProviderError(RuntimeError):
    """LLM 호출 중 발생한 오류."""


def _generate_claude(system_prompt: str, user_message: str, model: str) -> str:
    try:
        import anthropic
    except ImportError as exc:
        raise ProviderError("anthropic 패키지가 없습니다. `pip install anthropic`") from exc

    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
    response = client.messages.create(
        model=model,
        max_tokens=4096,
        thinking={"type": "adaptive"},
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}],
    )
    for block in response.content:
        if block.type == "text":
            return block.text
    return ""


def _generate_gemini(system_prompt: str, user_message: str, model: str) -> str:
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise ProviderError("GEMINI_API_KEY 환경변수가 필요합니다. https://aistudio.google.com/apikey 에서 무료 발급")

    # 공식 SDK가 있으면 사용, 없으면 REST 폴백
    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model=model,
            contents=user_message,
            config=types.GenerateContentConfig(system_instruction=system_prompt),
        )
        return response.text or ""
    except ImportError:
        return _generate_gemini_rest(system_prompt, user_message, model, api_key)


def _generate_gemini_rest(system_prompt: str, user_message: str, model: str, api_key: str) -> str:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {
        "system_instruction": {"parts": [{"text": system_prompt}]},
        "contents": [{"parts": [{"text": user_message}]}],
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            body = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        raise ProviderError(f"Gemini API 오류 {exc.code}: {exc.read().decode('utf-8')[:300]}") from exc
    except urllib.error.URLError as exc:
        raise ProviderError(f"Gemini 연결 실패: {exc}") from exc

    try:
        return body["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError) as exc:
        raise ProviderError(f"Gemini 응답 파싱 실패: {json.dumps(body)[:300]}") from exc


def _generate_ollama(system_prompt: str, user_message: str, model: str) -> str:
    host = os.environ.get("OLLAMA_HOST", "http://localhost:11434")
    url = f"{host.rstrip('/')}/api/chat"
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        "stream": False,
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=300) as resp:
            body = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        raise ProviderError(f"Ollama 오류 {exc.code}: {exc.read().decode('utf-8')[:300]}") from exc
    except urllib.error.URLError as exc:
        raise ProviderError(
            f"Ollama 연결 실패 ({host}). Ollama가 실행 중인지 확인하세요: `ollama serve`. 원인: {exc}"
        ) from exc

    return body.get("message", {}).get("content", "")


_DISPATCH = {
    "claude": _generate_claude,
    "gemini": _generate_gemini,
    "ollama": _generate_ollama,
}


def generate(provider: str, system_prompt: str, user_message: str, model: str | None = None) -> str:
    """
    Generate text from the chosen provider.

    Args:
        provider: 'claude' | 'gemini' | 'ollama'
        system_prompt: 시스템 프롬프트 (Manim 전문가 페르소나)
        user_message: 사용자 요청
        model: 모델 이름 (생략 시 프로바이더별 기본값)
    """
    provider = provider.lower()
    if provider not in _DISPATCH:
        raise ProviderError(f"지원하지 않는 프로바이더: {provider}. 사용 가능: {list(_DISPATCH)}")

    chosen_model = model or DEFAULT_MODELS[provider]
    return _DISPATCH[provider](system_prompt, user_message, chosen_model)
