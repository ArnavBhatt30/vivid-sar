// Colorize a SAR / grayscale image using Lovable AI (Gemini image edit model).
// Accepts: { imageBase64?: string, mimeType?: string, lat?: number, lng?: number }
// If no imageBase64 is provided, generates a synthetic colorized SAR-style scene from coordinates.
// Returns: { imageBase64: string, mimeType: string }

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash-image";

const COLORIZE_PROMPT =
  "Convert this Sentinel-1 SAR (synthetic aperture radar) grayscale image into a realistic, naturally colorized RGB satellite image. " +
  "Preserve all radar structure, edges, and shapes exactly — do not invent or remove features. " +
  "Map radar intensity to plausible land cover: dense vegetation as deep green, sparse vegetation as olive/khaki, " +
  "bare soil as warm brown/tan, urban / built-up areas as light gray, water bodies as deep blue, sand as pale yellow. " +
  "Output only the colorized image, no text or borders.";

const SYNTHESIZE_PROMPT = (lat: number, lng: number) =>
  `Generate a realistic top-down colorized Sentinel-1 SAR-derived satellite image of the area at latitude ${lat.toFixed(
    4,
  )}, longitude ${lng.toFixed(4)}. ` +
  "Render it as a square aerial view at ~10m/pixel resolution with naturalistic colors: vegetation in greens, water in blue, " +
  "urban areas in light gray, soil in brown. Subtle radar speckle texture. No text, labels, borders, or UI.";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const body = await req.json().catch(() => ({}));
    const { imageBase64, mimeType, lat, lng } = body as {
      imageBase64?: string;
      mimeType?: string;
      lat?: number;
      lng?: number;
    };

    let userContent: any[];
    if (imageBase64) {
      const mt = mimeType || "image/png";
      userContent = [
        { type: "text", text: COLORIZE_PROMPT },
        { type: "image_url", image_url: { url: `data:${mt};base64,${imageBase64}` } },
      ];
    } else if (typeof lat === "number" && typeof lng === "number") {
      userContent = [{ type: "text", text: SYNTHESIZE_PROMPT(lat, lng) }];
    } else {
      return new Response(
        JSON.stringify({ error: "Provide imageBase64 or { lat, lng }" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const aiRes = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: userContent }],
        modalities: ["image", "text"],
      }),
    });

    if (!aiRes.ok) {
      const txt = await aiRes.text();
      console.error("AI gateway error:", aiRes.status, txt);
      if (aiRes.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (aiRes.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Add credits in workspace settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(
        JSON.stringify({ error: `AI gateway returned ${aiRes.status}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await aiRes.json();
    // Image returned as data URL in message.images[0].image_url.url
    const dataUrl: string | undefined =
      data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!dataUrl || !dataUrl.startsWith("data:")) {
      console.error("No image in AI response:", JSON.stringify(data).slice(0, 500));
      return new Response(
        JSON.stringify({ error: "AI did not return an image" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    const outMime = match?.[1] ?? "image/png";
    const outB64 = match?.[2] ?? dataUrl.split(",")[1];

    return new Response(
      JSON.stringify({ imageBase64: outB64, mimeType: outMime }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("colorize-sar error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
