import { NextResponse } from "next/server";

const apiEndpointGroq = "https://api.groq.com/openai/v1/chat/completions";
const headersGroq = {
  Authorization:
    "Bearer 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",
  "Content-Type": "application/json",
};

export async function POST(req: Request) {
  const { topic, goal, personality } = await req.json();

  const requestDataGroq = {
    model: "llama3-8b-8192",
    messages: [
      {
        role: "system",
        content: `You are a coding instructor with a ${personality} personality. Create a list of 5 progressive coding challenges related to the topic "${topic}" and the goal "${goal}". Each challenge should be a single sentence describing a task or problem to solve. Format the output as a numbered list.`,
      },
    ],
  };

  try {
    const responseGroq = await fetch(apiEndpointGroq, {
      method: "POST",
      headers: headersGroq,
      body: JSON.stringify(requestDataGroq),
    });

    const aiResponse = await responseGroq.json();
    const challengesText = aiResponse.choices[0].message.content;
    const challenges = challengesText.split("\n").filter(Boolean);

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return NextResponse.json(
      { error: "Failed to get challenges" },
      { status: 500 }
    );
  }
}
