import { connectToDB } from '@utils/database';
import Prompt from '@models/prompt';

export const POST = async (req) => {
  const { userId, prompt, tag } = await req.json();

  const tags = tag
    .split(' ')
    .map((t) => (t.startsWith('#') ? t : `#${t}`))
    .join(' ');

  try {
    await connectToDB();
    const newPrompt = new Prompt({
      creator: userId,
      prompt,
      tag: tags,
    });

    await newPrompt.save();

    return new Response(JSON.stringify(newPrompt), { status: 201 });
  } catch (error) {
    return new Response('Failed to create a new prompt', { status: 500 });
  }
};
