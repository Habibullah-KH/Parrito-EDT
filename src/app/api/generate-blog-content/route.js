    // app/api/generate-blog-content/route.js
    import { NextResponse } from 'next/server';

    export async function POST(req) {
      const { prompt, existingContent } = await req.json();

      if (!prompt) {
        console.error("API Error: Prompt is required for AI generation (400).");
        return NextResponse.json({ message: 'Prompt is required for AI generation.' }, { status: 400 });
      }

      // Construct the full prompt for Gemini
      let fullPrompt = `Generate a compelling blog post.`;
      if (existingContent) {
        fullPrompt += ` The user has already provided the following text: "${existingContent}". Please expand on this or generate a complete blog post based on this idea.`;
      } else {
        fullPrompt += ` The main topic or idea is: "${prompt}".`;
      }
      fullPrompt += ` Ensure the response is only text, suitable for a blog body, and engaging.`;

      try {
        // --- CHANGE THIS LINE ---
        const apiKey = process.env.GEMINI_API_KEY; // Read API key from environment variable
        // --- END CHANGE ---
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        // Validate API Key before making the request
        if (!apiKey) {
            console.error("API Error: GEMINI_API_KEY is not set in environment variables.");
            return NextResponse.json({ message: 'Server configuration error: Gemini API Key is missing.' }, { status: 500 });
        }


        const payload = {
          contents: [{
            role: "user",
            parts: [{ text: fullPrompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        };

        console.log("DEBUG: Calling Gemini API with payload:", JSON.stringify(payload, null, 2));

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`DEBUG: Gemini API HTTP Error: ${response.status} ${response.statusText}`, errorBody);
            // Attempt to parse JSON error if available, otherwise use raw text
            try {
                const parsedError = JSON.parse(errorBody);
                return NextResponse.json({ message: `Gemini API error: ${parsedError.error.message || response.statusText}` }, { status: 500 });
            } catch (e) {
                return NextResponse.json({ message: `Gemini API returned an error: ${response.statusText}. Details: ${errorBody.substring(0, 100)}...` }, { status: 500 });
            }
        }

        const result = await response.json();
        console.log("DEBUG: Gemini API Raw Result:", JSON.stringify(result, null, 2));

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
          const generatedText = result.candidates[0].content.parts[0].text;
          return NextResponse.json({ generatedContent: generatedText }, { status: 200 });
        } else {
          console.error("DEBUG: Gemini API response structure unexpected or empty content:", result);
          return NextResponse.json({ message: "Failed to generate content: Unexpected or empty AI response." }, { status: 500 });
        }
      } catch (error) {
        console.error("DEBUG: Error caught when calling Gemini API:", error);
        return NextResponse.json({ message: "Failed to generate content: " + (error.message || "Unknown network error") }, { status: 500 });
      }
    }
    