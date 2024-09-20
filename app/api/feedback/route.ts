import { NextResponse } from "next/server";

const apiEndpointGroq = "https://api.groq.com/openai/v1/chat/completions";
const headersGroq = {
  Authorization:
    "Bearer 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",
  "Content-Type": "application/json",
};

export async function POST(req: Request) {
  const { topic, goal, code, personality } = await req.json();

  const requestDataGroq = {
    model: "llama3-8b-8192",
    messages: [
      {
        role: "system",
        content: `You are a helpful coding assistant with a ${personality} personality. Your task is to provide real-time feedback on the user's code based on their current topic and goal. Be encouraging and point out both good practices and areas for improvement. Adjust your feedback style to match the ${personality} personality trait. The current topic is "${topic}" and the goal is "${goal}".`,
      },
      { role: "user", content: code },
    ],
  };

  try {
    const responseGroq = await fetch(apiEndpointGroq, {
      method: "POST",
      headers: headersGroq,
      body: JSON.stringify(requestDataGroq),
    });

    const aiResponse = await responseGroq.json();
    const feedback = aiResponse.choices[0].message.content;

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return NextResponse.json(
      { error: "Failed to get AI feedback" },
      { status: 500 }
    );
  }
}
