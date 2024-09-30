import { NextResponse } from "next/server";
import { VM } from "vm2";

export async function POST(req: Request) {
  const { code } = await req.json();

  try {
    const vm = new VM({
      timeout: 1000,
      sandbox: {
        console: {
          log: (...args) => {
            output += args.join(" ") + "\n";
          },
        },
      },
    });

    let output = "";
    let htmlOutput = "";

    vm.run(`
      ${code}
      
      // Capture HTML output
      if (typeof document !== 'undefined') {
        htmlOutput = document.documentElement.outerHTML;
      }
    `);

    return NextResponse.json({ output, htmlOutput });
  } catch (error) {
    return NextResponse.json(
      { output: `Error: ${error.message}`, htmlOutput: "" },
      { status: 400 }
    );
  }
}
