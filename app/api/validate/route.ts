// app/api/validate/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { idea } = await req.json();

  if (!idea || idea.length < 10) {
    return NextResponse.json(
      { success: false, message: 'Please provide more details about your idea.' },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: 'API key is missing. Please check your environment variables.' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey); // Pass the API key directly as a string
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(`Evaluate this startup idea: ${idea}`);

    if (!result || !result.response) {
      return NextResponse.json(
        { success: false, message: 'Failed to get a response from the AI model.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.response.text(), // Assuming the text response is in the response field
    });
  } catch (error) {
    console.error('Error validating the idea:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
