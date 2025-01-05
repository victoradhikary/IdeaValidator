// pages/api/validate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

type Data = {
  success: boolean;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  const { idea } = req.body;

  if (!idea || idea.length < 10) {
    return res.status(400).json({ success: false, message: 'Please provide more details about your idea.' });
  }

  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'API key is missing. Please check your environment variables.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey); // Pass the API key directly as a string
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(`Evaluate this startup idea: ${idea}`);

    if (!result || !result.response) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get a response from the AI model.',
      });
    }

    res.status(200).json({
      success: true,
      message: result.response.text(), // Assuming the text response is in the response field
    });
  } catch (error) {
    console.error('Error validating the idea:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
}
