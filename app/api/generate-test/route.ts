import { NextResponse } from "next/server";

const apiEndpointGroq = "https://api.groq.com/openai/v1/chat/completions";
const headersGroq = {
  Authorization:
    "Bearer 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",
  "Content-Type": "application/json",
};

export async function POST(req: Request) {
  const { challenge, topic, goal, genericFunction } = await req.json();

  const requestDataGroq = {
    model: "llama3-70b-8192",
    messages: [
      {
        role: "system",
        content: `You are a coding instructor. Create a Jest test case for the following challenge related to the topic "${topic}" and the goal "${goal}". The test should verify the implementation of the challenge and use the provided generic function. Format the response as a JSON object with a "test" key. Inside the test object, provide only the test file content in a single file. DO NOT WRITE ANYTHING ELSE. DO NOT SAY WHAT YOU ARE THINKING. JUST PROVIDE THE TEST FILE CONTENT. JUST GIVE THE WHOLE TEST FILE CODE IN A DIRECT STRING OBJECT INSIDE THE test object`,
      },
      {
        role: "user",
        content: `
  Challenge: ${challenge}
  
  Generic Function:
  ${genericFunction}
  
  Create a test file that imports and uses this generic function in the tests.`,
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
    const test = aiResponse.choices[0].message.content;

    return NextResponse.json({ test });
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return NextResponse.json(
      { error: "Failed to generate test" },
      { status: 500 }
    );
  }
}
