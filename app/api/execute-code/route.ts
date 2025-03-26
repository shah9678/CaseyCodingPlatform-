// app/api/execute-code/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { code } = await req.json();
  
  // Dynamically import VM2 to avoid SSR issues
  const { VM } = await import('vm2');
  const vm = new VM({
    timeout: 1000,
    sandbox: {},
    compiler: 'javascript' // Force JavaScript-only mode
  });

  try {
    let output = "";
    vm.run(`
      (function() {
        const __originalConsole = console;
        console = {
          log: (...args) => {
            output += args.join(' ') + '\\n';
          }
        };
        ${code}
        console = __originalConsole;
      })();
    `);
    return NextResponse.json({ output });
  } catch (error: any) {
    return NextResponse.json(
      { output: `Error: ${error.message}` },
      { status: 400 }
    );
  }
}