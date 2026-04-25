import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_BUILDS = 20;
const MAX_STRING_LEN = 200;

export interface BuildSummary {
  name: string;
  nationalDex: number;
  role: string;
  tags: string[];
  teraType: string;
  nature: string;
  ability: string;
  item: string;
  moves: string[];
  strategy: string;
}

export interface RecommendRequest {
  bossName?: string;
  bossTypes?: string[];
  bossTeraType: string;
  bossStars?: number | null;
  builds: BuildSummary[];
}

export interface AIRecommendation {
  name: string;
  role: string;
  tier: "S" | "A" | "B";
  reason: string;
}

const SYSTEM_CONTEXT = `You are a Pokémon SV Tera Raid expert. Key mechanics:
- Boss Tera Type = STAB for boss. Moves super effective against it deal more damage.
- Shield phase: support moves (Helping Hand, Screech) help break it faster.
- Bosses reset stat boosts periodically. Setup sweepers must rebuild.
- STAB: move gets 1.5x if user type or Tera Type matches move type.
- Defiant/Competitive/Clear Body prevent debuffs — very valuable.
- Shell Bell / healing moves sustain through long raids.`;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Anthropic API key not configured" }, { status: 500 });
  }

  let body: RecommendRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { bossName, bossTypes, bossTeraType, bossStars, builds } = body;

  if (!bossTeraType || !builds?.length) {
    return NextResponse.json({ error: "bossTeraType and builds are required" }, { status: 400 });
  }

  if (typeof bossTeraType !== "string" || bossTeraType.length > 20) {
    return NextResponse.json({ error: "Invalid bossTeraType" }, { status: 400 });
  }

  if (!Array.isArray(builds) || builds.length > MAX_BUILDS) {
    return NextResponse.json({ error: `Maximum ${MAX_BUILDS} builds allowed` }, { status: 400 });
  }

  for (const b of builds) {
    if (
      typeof b.name !== "string" ||
      typeof b.role !== "string" ||
      typeof b.teraType !== "string" ||
      typeof b.nature !== "string" ||
      typeof b.ability !== "string" ||
      typeof b.item !== "string" ||
      typeof b.strategy !== "string" ||
      !Array.isArray(b.tags) ||
      !Array.isArray(b.moves) ||
      b.name.length > MAX_STRING_LEN ||
      b.strategy.length > MAX_STRING_LEN
    ) {
      return NextResponse.json({ error: "Invalid build format" }, { status: 400 });
    }
  }

  const buildsText = builds
    .map(
      (b, i) =>
        `${i + 1}.${b.name}(${b.role[0].toUpperCase()})[${b.tags.map((t) => t.split(" ")[0]).join(",")}]` +
        ` Tera:${b.teraType} ${b.nature} ${b.ability} @${b.item}` +
        ` Moves:${b.moves.join("/")}` +
        ` Hint:${b.strategy.slice(0, 80)}`
    )
    .join("\n");

  const bossLine = [
    bossName ?? "Unknown boss",
    `Tera:${bossTeraType}`,
    bossTypes?.length ? bossTypes.join("/") : null,
    bossStars ? `${bossStars}★` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  const prompt = `${SYSTEM_CONTEXT}

BOSS: ${bossLine}

BUILDS (${builds.length}):
${buildsText}

Pick TOP 5 for this raid. Return ONLY valid JSON, no markdown:
{"recommendations":[{"name":"exact name","role":"physical|special|support","tier":"S|A|B","reason":"max 20 words"}]}`;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const block = response.content[0];
    if (block.type !== "text") {
      throw new Error("Unexpected response type");
    }

    const json = block.text.trim()
      .replace(/^```(?:json)?\n?/, "")
      .replace(/\n?```$/, "");

    const parsed = JSON.parse(json) as { recommendations: AIRecommendation[] };
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to get AI recommendations" }, { status: 500 });
  }
}
