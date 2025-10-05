import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, subject, topic, style, companionId } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const systemPrompt = `You are a highly knowledgeable tutor teaching a student about ${topic} in the subject of ${subject}. 

Tutor Guidelines:
- Stick to the given topic "${topic}" and subject "${subject}" and teach the student about it.
- Keep the conversation flowing smoothly while maintaining control.
- From time to time make sure that the student is following you and understands you.
- Break down the topic into smaller parts and teach the student one part at a time.
- Keep your style of conversation ${style}.
- Keep your responses concise and educational.
- Ask follow-up questions to ensure understanding.
- Provide examples and explanations that help the student learn.

Current conversation context: The student is asking about "${message}"`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in AI chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
