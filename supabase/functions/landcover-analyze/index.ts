// Analyze a colorized satellite image and return land cover percentages.
// Classes: Urban, Agriculture, Rangeland, Forest, Water, Barren, Unknown
// Accepts: { imageBase64: string, mimeType?: string }
// Returns: { breakdown: { urban, agriculture, rangeland, forest, water, barren, unknown } } (sum = 100)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

const SYSTEM = "You are a remote sensing land-cover classifier. " +
  "Estimate the proportion of each land cover class visible in the provided satellite image. " +
  "Respond ONLY by calling the report_landcover tool with integer percentages that sum to exactly 100.";

const tools = [
  {
    type: "function",
    function: {
      name: "report_landcover",
      description: "Report estimated land cover percentages.",
      parameters: {
        type: "object",
        properties: {
          urban: { type: "integer", minimum: 0, maximum: 100 },
          agriculture: { type: "integer", minimum: 0, maximum: 100 },
          rangeland: { type: "integer", minimum: 0, maximum: 100 },
          forest: { type: "integer", minimum: 0, maximum: 100 },
          water: { type: "integer", minimum: 0, maximum: 100 },
          barren: { type: "integer", minimum: 0, maximum: 100 },
          unknown: { type: "integer", minimum: 0, maximum: 100 },
        },
        required: ["urban", "agriculture", "rangeland", "forest", "water", "barren", "unknown"],
        additionalProperties: false,
      },
    },
  },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const { imageBase64, mimeType } = await req.json();
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "imageBase64 required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const mt = mimeType || "image/png";

    const aiRes = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: [
              { type: "text", text: "Classify the land cover proportions in this image." },
              { type: "image_url", image_url: { url: `data:${mt};base64,${imageBase64}` } },
            ],
          },
        ],
        tools,
        tool_choice: { type: "function", function: { name: "report_landcover" } },
      }),
    });

    if (!aiRes.ok) {
      const txt = await aiRes.text();
      console.error("AI error:", aiRes.status, txt);
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: `AI gateway ${aiRes.status}` }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiRes.json();
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    const argsStr = call?.function?.arguments;
    if (!argsStr) {
      console.error("No tool call:", JSON.stringify(data).slice(0, 400));
      return new Response(JSON.stringify({ error: "No classification returned" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const parsed = JSON.parse(argsStr);
    // Normalize to sum 100
    const keys = ["urban", "agriculture", "rangeland", "forest", "water", "barren", "unknown"] as const;
    const total = keys.reduce((s, k) => s + (Number(parsed[k]) || 0), 0) || 1;
    const breakdown: Record<string, number> = {};
    keys.forEach((k) => { breakdown[k] = Math.round(((Number(parsed[k]) || 0) / total) * 100); });
    // Fix rounding so sum = 100
    let diff = 100 - keys.reduce((s, k) => s + breakdown[k], 0);
    if (diff !== 0) {
      const maxKey = keys.reduce((a, b) => (breakdown[a] >= breakdown[b] ? a : b));
      breakdown[maxKey] += diff;
    }

    return new Response(JSON.stringify({ breakdown }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("landcover error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
