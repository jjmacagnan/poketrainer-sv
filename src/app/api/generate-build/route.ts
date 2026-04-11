import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a competitive Pokémon Scarlet & Violet Tera Raid expert. You generate optimal counter builds for Tera Raid battles.

When given a raid boss (name, star rating, tera type) and optionally available Pokémon from the user's game, you must suggest the BEST counter build.

Rules:
- Only suggest Pokémon available in Scarlet & Violet (Paldea + Kitakami + Blueberry Pokédex)
- Consider the boss's Tera Type for type matchup — you need moves that are super effective against the Tera Type
- For 7★ raids, prioritize bulky attackers that can survive and deal consistent damage
- Consider abilities that help in raids (e.g., Intimidate, Sword of Ruin, Tablets of Ruin)
- EVs should total exactly 510 with no stat exceeding 252
- IVs are always 31 (Hyper Trained)
- Level is always 100
- Always suggest exactly 4 moves
- Include a brief strategy explanation in Portuguese (pt-BR)

You MUST respond with ONLY a valid JSON object in this exact format (no markdown, no code blocks, just raw JSON):
{
  "pokemonName": "string (exact English name as in the game)",
  "teraType": "string (one of: Normal, Fire, Water, Electric, Grass, Ice, Fighting, Poison, Ground, Flying, Psychic, Bug, Rock, Ghost, Dragon, Dark, Steel, Fairy)",
  "nature": "string (exact nature name e.g. Adamant, Modest, Bold)",
  "ability": "string (exact ability name)",
  "item": "string (exact held item name)",
  "moves": ["move1", "move2", "move3", "move4"],
  "evs": {"HP": number, "Atk": number, "Def": number, "SpA": number, "SpD": number, "Spe": number},
  "strategy": "string (2-4 sentences in Portuguese explaining the strategy)"
}`;

function buildUserPrompt(bossName: string, bossStars: number, bossTeraType: string) {
  return `Generate the best counter build for this Tera Raid boss:

Boss: ${bossName}
Star Rating: ${bossStars}★
Tera Type: ${bossTeraType}

Consider type effectiveness against ${bossTeraType} Tera Type. The counter Pokémon should be able to survive the boss's attacks and deal super effective damage. For ${bossStars}★ raids, ${bossStars >= 7 ? "the boss has massively boosted stats and a shield — prioritize sustained damage and survivability over speed" : bossStars >= 6 ? "the boss is strong — balance offense and defense" : "a standard strong counter works well"}.`;
}

function parseJsonResponse(raw: string): unknown {
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }
  return JSON.parse(text);
}

async function generateWithAnthropic(bossName: string, bossStars: number, bossTeraType: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY não configurada no servidor");

  console.log(`[AI] provider=anthropic model=claude-sonnet-4-6 boss="${bossName}" stars=${bossStars} tera=${bossTeraType}`);
  const t0 = Date.now();

  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(bossName, bossStars, bossTeraType) }],
  });

  console.log(`[AI] anthropic OK — ${Date.now() - t0}ms | input_tokens=${message.usage.input_tokens} output_tokens=${message.usage.output_tokens}`);

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") throw new Error("Resposta inesperada da IA");
  return parseJsonResponse(textBlock.text);
}

async function generateWithGemini(bossName: string, bossStars: number, bossTeraType: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY não configurada no servidor");

  console.log(`[AI] provider=gemini model=gemini-2.0-flash boss="${bossName}" stars=${bossStars} tera=${bossTeraType}`);
  const t0 = Date.now();

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContent(buildUserPrompt(bossName, bossStars, bossTeraType));
  const usage = result.response.usageMetadata;
  console.log(`[AI] gemini OK — ${Date.now() - t0}ms | prompt_tokens=${usage?.promptTokenCount} output_tokens=${usage?.candidatesTokenCount}`);

  return parseJsonResponse(result.response.text());
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bossName, bossStars, bossTeraType, provider = "anthropic" } = body;

    if (!bossName || !bossStars || !bossTeraType) {
      return NextResponse.json({ error: "Dados do boss incompletos" }, { status: 400 });
    }

    let build: unknown;
    console.log(`[AI] request received — provider=${provider} boss="${bossName}" ${bossStars}★ tera=${bossTeraType}`);

    if (provider === "gemini") {
      build = await generateWithGemini(bossName, bossStars, bossTeraType);
    } else {
      build = await generateWithAnthropic(bossName, bossStars, bossTeraType);
    }

    // Validate required fields
    const required = ["pokemonName", "teraType", "nature", "ability", "item", "moves", "evs", "strategy"];
    for (const field of required) {
      if (!(field in (build as Record<string, unknown>))) {
        return NextResponse.json({ error: `Campo obrigatório ausente: ${field}` }, { status: 500 });
      }
    }

    return NextResponse.json({ build });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("AI build generation error:", message);
    return NextResponse.json({ error: `Erro ao gerar build: ${message}` }, { status: 500 });
  }
}
