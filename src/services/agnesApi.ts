import { API_URL, IMAGE_MODEL, TEXT_MODEL } from '../constants/options';
import type { Lang } from '../types';
import type { PromptVariant } from '../types';

interface GenerateImageInput {
  prompt: string;
  size: string;
  negativePrompt?: string;
}

interface ModifyImageInput extends GenerateImageInput {
  baseImageUrl: string;
}

async function parseJsonResponse(response: Response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error?.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export async function optimizePrompt(prompt: string, lang: Lang) {
  const systemPrompt =
    lang === 'zh'
      ? '你是一名专业的 AI 生图提示词工程师。你的任务是把用户输入的简单构想，扩写成细节丰富、画面感强、可直接用于图像生成的高质量提示词。输出语言必须为中文。只输出优化后的提示词正文，不要加解释、前缀或引号。'
      : 'You are an expert image prompt engineer. Expand the user idea into a detailed, cinematic, and directly usable image generation prompt. The output language must be English. Return only the optimized prompt text with no explanation, prefix, or quotes.';

  const response = await fetch(`${API_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: TEXT_MODEL,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        { role: 'user', content: prompt }
      ]
    })
  });

  const data = await parseJsonResponse(response);
  const optimizedPrompt = data?.choices?.[0]?.message?.content?.trim();

  if (!optimizedPrompt) {
    throw new Error('Unknown API Error');
  }

  return optimizedPrompt as string;
}

export async function generatePromptVariants(prompt: string, lang: Lang) {
  const systemPrompt =
    lang === 'zh'
      ? '你是一名专业的 AI 生图提示词策划师。请围绕同一个主题生成 3 个明显不同的提示词方向。必须只返回合法 JSON，格式为 {"variants":[{"title":"...","prompt":"..."}]}。title 和 prompt 都必须是中文，title 控制在 2 到 6 个字，prompt 要足够详细，可直接用于图像生成。'
      : 'You are an expert image prompt strategist. Generate exactly 3 distinct prompt directions for the same concept. Return valid JSON only in this shape: {"variants":[{"title":"...","prompt":"..."}]}. Both title and prompt must be in English. Titles should be 2-4 words and prompts should be detailed, cinematic, and directly usable for image generation.';

  const response = await fetch(`${API_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: TEXT_MODEL,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        { role: 'user', content: prompt }
      ]
    })
  });

  const data = await parseJsonResponse(response);
  const rawContent = data?.choices?.[0]?.message?.content?.trim();

  if (!rawContent) {
    throw new Error('Unknown API Error');
  }

  let parsedContent: { variants?: Array<{ title?: string; prompt?: string }> } | null = null;

  try {
    parsedContent = JSON.parse(rawContent);
  } catch {
    const cleaned = rawContent
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '');

    parsedContent = JSON.parse(cleaned);
  }

  const variants = (parsedContent?.variants || [])
    .filter((item) => item?.title && item?.prompt)
    .slice(0, 3)
    .map((item, index): PromptVariant => {
      return {
        id: `variant-${index + 1}`,
        title: item.title!.trim(),
        prompt: item.prompt!.trim()
      };
    });

  if (variants.length === 0) {
    throw new Error('Unknown API Error');
  }

  return variants;
}

export async function generateImage({ prompt, size, negativePrompt }: GenerateImageInput) {
  const response = await fetch(`${API_URL}/v1/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: IMAGE_MODEL,
      prompt,
      size,
      ...(negativePrompt ? { negative_prompt: negativePrompt } : {})
    })
  });

  const data = await parseJsonResponse(response);
  const imageUrl = data?.data?.[0]?.url;

  if (!imageUrl) {
    throw new Error('Unknown API Error');
  }

  return imageUrl as string;
}

export async function modifyImage({ baseImageUrl, prompt, size, negativePrompt }: ModifyImageInput) {
  const response = await fetch(`${API_URL}/v1/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: IMAGE_MODEL,
      prompt,
      size,
      ...(negativePrompt ? { negative_prompt: negativePrompt } : {}),
      extra_body: {
        image: [baseImageUrl],
        response_format: 'url'
      }
    })
  });

  const data = await parseJsonResponse(response);
  const imageUrl = data?.data?.[0]?.url;

  if (!imageUrl) {
    throw new Error('Unknown API Error');
  }

  return imageUrl as string;
}
