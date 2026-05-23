import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a creative music journalist writing about AI-generated mashups.
When given a list of stems used in a mashup (e.g., drums from one song, vocals from another),
write a vivid, enthusiastic 2-3 sentence description that captures the sonic character and mood
of the resulting track. Be evocative and specific. Do not use generic phrases like "unique blend" —
paint a picture of what the listener will experience.`;

type StemInfo = { stem: string; fromTrack: string; fromArtist: string };

export async function generateMashupDescription(
  userTitle: string,
  stemsUsed: StemInfo[]
): Promise<string> {
  const stemList = stemsUsed
    .map((s) => `${s.stem} from "${s.fromTrack}" by ${s.fromArtist}`)
    .join(", ");

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 200,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Write a description for a mashup called "${userTitle}" made from: ${stemList}.`,
      },
    ],
  });

  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}
