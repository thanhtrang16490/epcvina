type ContentAiInput = {
  title: string;
  topic?: string | null;
  category?: string | null;
  contentType?: string | null;
  excerpt?: string | null;
  body?: string | null;
  cta?: string | null;
  tone?: string | null;
  brand?: {
    brand_name?: string | null;
    positioning?: string | null;
    primary_website?: string | null;
    tone?: string[] | null;
    core_cta?: string[] | null;
    notes?: string | null;
  } | null;
};

export type ContentAiSuggestion = {
  summary: string;
  suggested_title?: string | null;
  suggested_excerpt?: string | null;
  suggested_body?: string | null;
  suggested_cta?: string | null;
  issues: string[];
  actions: string[];
  facebook_caption?: string | null;
};

function buildFallbackSuggestion(input: ContentAiInput): ContentAiSuggestion {
  const issues = [
    !input.excerpt ? "Thiếu excerpt ngắn để mở bài." : "",
    !input.body ? "Thiếu body/dàn ý cho bài." : "",
    !input.cta ? "Chưa có CTA rõ ràng." : "",
  ].filter(Boolean);
  const actions = [
    "Bổ sung câu mở đầu nêu vấn đề thực tế.",
    "Chèn 1 đoạn giải pháp EPCVINA và 1 CTA cụ thể.",
  ];
  return {
    summary: `Bài "${input.title}" có thể tối ưu thêm cho giọng điệu EPCVINA.`,
    suggested_title: input.title,
    suggested_excerpt: input.excerpt || `Tối ưu nội dung cho chủ đề ${input.topic || input.category || "content"}.`,
    suggested_body:
      input.body ||
      [
        "Mở bài: nêu bối cảnh hoặc vấn đề thực tế.",
        "Thân bài: giải thích giải pháp và lưu ý kỹ thuật.",
        "Kết luận: đưa CTA phù hợp.",
      ].join("\n"),
    suggested_cta: input.cta || "Nhận tư vấn",
    issues,
    actions,
    facebook_caption: `EPCVINA chia sẻ nhanh về ${input.title}.\n\n${input.excerpt || input.topic || "Nội dung thực tế, dễ áp dụng."}\n\nCTA: ${input.cta || "Nhận tư vấn"}`,
  };
}

export async function suggestContentEdits(input: ContentAiInput, settings?: { apiKey?: string | null; modelName?: string | null; provider?: string | null }) {
  const apiKey = settings?.apiKey?.trim();
  const model = settings?.modelName?.trim() || "gpt-5.6";
  if (!apiKey) return buildFallbackSuggestion(input);

  const system = [
    "Bạn là biên tập viên content cho EPCVINA Solar.",
    "Hãy sửa nội dung để rõ ràng, thực tế, không giật tít, không phóng đại hiệu quả tài chính.",
    "Trả về JSON hợp lệ với các keys: summary, suggested_title, suggested_excerpt, suggested_body, suggested_cta, issues, actions, facebook_caption.",
    "issues và actions là mảng chuỗi ngắn.",
  ].join(" ");

  const user = JSON.stringify(input, null, 2);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      }),
      cache: "no-store",
    });

    if (!response.ok) return buildFallbackSuggestion(input);
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content || typeof content !== "string") return buildFallbackSuggestion(input);
    const parsed = JSON.parse(content) as Partial<ContentAiSuggestion>;
    return {
      summary: String(parsed.summary ?? `AI đã review bài "${input.title}".`),
      suggested_title: parsed.suggested_title ?? input.title,
      suggested_excerpt: parsed.suggested_excerpt ?? input.excerpt ?? null,
      suggested_body: parsed.suggested_body ?? input.body ?? null,
      suggested_cta: parsed.suggested_cta ?? input.cta ?? null,
      issues: Array.isArray(parsed.issues) ? parsed.issues.map(String) : [],
      actions: Array.isArray(parsed.actions) ? parsed.actions.map(String) : [],
      facebook_caption: parsed.facebook_caption ?? null,
    };
  } catch {
    return buildFallbackSuggestion(input);
  }
}

