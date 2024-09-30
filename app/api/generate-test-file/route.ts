import { NextResponse } from "next/server";

const apiEndpointGroq = "https://api.groq.com/openai/v1/chat/completions";
const headersGroq = {
  Authorization:
    "Bearer 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",
  "Content-Type": "application/json",
};

export async function POST(req: Request) {
  const { challenges, topic, goal } = await req.json();

  const requestDataGroq = {
    model: "llama3-8b-8192",
    messages: [
      {
        role: "system",
        content: `You are a coding instructor. Create a complete Jest test file for the following challenges related to the topic "${topic}" and the goal "${goal}". The test file should include all necessary imports and test cases for each challenge.`,
      },
      { role: "user", content: JSON.stringify(challenges) },
    ],
  };

  try {
    const responseGroq = await fetch(apiEndpointGroq, {
      method: "POST",
      headers: headersGroq,
      body: JSON.stringify(requestDataGroq),
    });

    const aiResponse = await responseGroq.json();
    const testFile = aiResponse.choices[0].message.content;

    return NextResponse.json({ testFile });
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return NextResponse.json(
      { error: "Failed to generate test file" },
      { status: 500 }
    );
  }
}
