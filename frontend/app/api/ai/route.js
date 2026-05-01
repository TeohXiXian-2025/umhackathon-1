import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Read the incoming JSON from your test command
    const { prompt, systemInstruction } = await req.json();

    const apiKey = process.env.GOOGLE_API_KEY;
    const model = 'gemini-3-flash-preview';
    
    // Use the REST API directly
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            temperature: 0.2,
          }
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'API error');
    }

    const text = data.candidates[0].content.parts[0].text;

    // Send the successful response back
    return NextResponse.json({ text });

  } catch (error) {
    // If it fails, print the exact error to your terminal so we can see it
    console.error('Gemini AI Error Details:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request', details: error.message }, 
      { status: 500 }
    );
  }
}