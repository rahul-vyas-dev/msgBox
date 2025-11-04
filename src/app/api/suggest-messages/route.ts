import { GoogleGenAI } from "@google/genai";
export const maxDuration = 30;

export async function GET(req: Request) {
  try {
    
    console.log("this is your req");
    const context =
      "Create a list of ten open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";   
    const ai = new GoogleGenAI({});
   
    const stream = await ai.models.generateContentStream({
      model: "gemini-2.0-flash-001",
      contents: context,
      config: {
        maxOutputTokens: 300,
        
      }
    });
    
 const encoder = new TextEncoder();
  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk;
            if (text) controller.enqueue(
              encoder.encode(text?.candidates[0]?.content?.parts[0].text)
            );
          }
        } catch (err) {
          controller.enqueue(encoder.encode("Error occurred"));
        } finally {
          controller.close();
        }
      },
    }),
    {
      headers: {
        "Content-Type": "text/event-stream charset=utf-8",
        "Cache-Control": "no-cache",
        'Connection':"keep-alive"
      },
    }
    );
    
} catch (error) {
  console.log("error in sending prompt ", error);
    return Response.json(
      {
        success: false,
        message: "Server Internal Error!!",
      },
      { status: 500 }
    );
  }
}
      // const stream = new ReadableStream({
      //   async start(controller) {
      //     console.log("reached at this ", result);
      //     try {
      //       for await (const chunk of result) {
      //         const text = chunk;
      //         if (text) {
      //           const responses = text?.candidates[0]?.content?.parts[0].text;
    
      //           controller.enqueue(`${JSON.stringify({ responses })}+`);
      //         }
      //       }
      //       controller.enqueue("data: DONE\n\n");
      //       controller.close();
      //     } catch (err) {
      //       controller.enqueue(`data: ${JSON.stringify({ error: err })}`);
      //       controller.close();
      //     }
      //   },
      // });
    
      // return new Response(stream, {
      //   headers: {
      //     "Content-Type": "text/event-stream",
      //     "Cache-Control": "no-cache",
      //     Connection: "keep-alive",
      //   },
      // });
