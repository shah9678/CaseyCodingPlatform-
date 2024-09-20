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
        content: `You are a knowledgeable coding instructor with a ${personality} personality. Provide a brief overview of the given topic and some key points to keep in mind while working towards the specified goal. Adjust your communication style to match the ${personality} personality trait. Keep your response concise and informative.`,
      },
      { role: "user", content: `Topic: ${topic}\nGoal: ${goal}` },
    ],
  };

  try {
    const responseGroq = await fetch(apiEndpointGroq, {
      method: "POST",
      headers: headersGroq,
      body: JSON.stringify(requestDataGroq),
    });

    const aiResponse = await responseGroq.json();
    const info = aiResponse.choices[0].message.content;

    return NextResponse.json({ info });
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return NextResponse.json(
      { error: "Failed to get topic information" },
      { status: 500 }
    );
  }
}
