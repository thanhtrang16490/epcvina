type FacebookPublishInput = {
  pageId: string;
  pageAccessToken: string;
  graphVersion?: string | null;
  message: string;
  link?: string | null;
  published?: boolean;
};

export async function publishFacebookPagePost(input: FacebookPublishInput) {
  const version = input.graphVersion || process.env.FACEBOOK_GRAPH_VERSION || "v23.0";
  const url = `https://graph.facebook.com/${version}/${encodeURIComponent(input.pageId)}/feed`;
  const body = new URLSearchParams();
  body.set("message", input.message);
  if (input.link) body.set("link", input.link);
  body.set("published", input.published === false ? "false" : "true");
  body.set("access_token", input.pageAccessToken);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({} as Record<string, unknown>));
  return {
    ok: response.ok,
    status: response.status,
    payload,
  };
}

export function extractFacebookPostId(payload: unknown) {
  if (!payload || typeof payload !== "object") return null;
  const value = (payload as Record<string, unknown>).id;
  return typeof value === "string" && value.trim() ? value : null;
}

export function buildFacebookCaption(post: {
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  topic?: string | null;
  cta?: string | null;
  content_id?: string | null;
  tone?: "professional" | "concise" | "sales" | null;
}) {
  const baseUrl = post.slug ? `https://epcvina.com/blog/${post.slug}` : "https://epcvina.com";
  const introByTone = {
    professional: `EPCVINA chia sẻ góc nhìn thực tế về ${post.title || "chủ đề này"}.`,
    concise: `Đi nhanh vào trọng tâm: ${post.title || "một chủ đề đáng chú ý"}.`,
    sales: `Nếu bạn đang cân nhắc giải pháp cho ${post.title || "hệ solar"}, đây là điểm cần lưu ý.`,
  } as const;
  const intro = introByTone[post.tone || "professional"] ?? introByTone.professional;
  const lines = [
    intro,
    post.excerpt || post.topic || "Bài viết ngắn, dễ hiểu, tập trung vào vấn đề thực tế của khách hàng.",
    `Xem thêm: ${baseUrl}?utm_source=facebook&utm_medium=social&utm_campaign=${encodeURIComponent(post.slug || "content")}${post.content_id ? `&content_id=${encodeURIComponent(post.content_id)}` : ""}`,
    `CTA: ${post.cta || "Nhận tư vấn"}`,
  ];
  return lines.join("\n\n");
}
