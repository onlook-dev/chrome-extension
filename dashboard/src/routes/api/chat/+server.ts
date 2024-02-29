import OpenAI from 'openai';
import { openAi } from '$lib/utils/serverEnv';
import { TAILWIND_PROMPT } from '$lib/utils/prompt.js';

const systemMessage = {
	role: 'system',
	content: TAILWIND_PROMPT
};

// Create an OpenAI API client
const openai = new OpenAI({
	apiKey: openAi.apiKey || ''
});

export const POST = async ({ request }) => {
	// Extract the `prompt` from the body of the request
	const { messages } = await request.json();

	const combinedMessages = [
		systemMessage,
		{
			content: messages.content,
			role: messages.role
		}
	];

	// Ask OpenAI for a chat completion given the prompt
	const response = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		messages: combinedMessages,
		response_format: { type: 'json_object' },
		temperature: 0,
	});
	return new Response(JSON.stringify(response));
};
