import OpenAI from 'openai';
import { openAi } from '$lib/utils/serverEnv';
import { TAILWIND_PROMPT } from '$lib/translation/prompt.js';

import adapter from '@sveltejs/adapter-vercel';

// This function can run for a maximum of 30 seconds
export default {
	kit: {
		adapter: adapter({
			maxDuration: 30
		})
	}
};

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
	const stream = await openai.chat.completions.create({
		model: 'gpt-4-0125-preview',
		messages: combinedMessages,
		response_format: { type: 'json_object' },
		temperature: 0,
		stream: true
	});

	let response = '';
	for await (const chunk of stream) {
		response += chunk.choices[0]?.delta?.content || '';
	}
	return new Response(JSON.stringify(response));
};
