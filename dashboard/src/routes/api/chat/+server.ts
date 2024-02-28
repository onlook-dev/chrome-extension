import OpenAI from 'openai';
import { openAi } from '$lib/utils/env';

const systemMessage = {
	role: 'system',
	content:
		'you are a css translator that can translate raw css to any underlying example syntax such as tailwind css. You receive lists of objects with each object having a field called changes which is a list of raw css changes and a field called currentValue which is the current css class values. It is your job to translate all changes to match the syntax of currentValue and return json that is a list of objects each with a field for the currentValue which is the current css values and a field called newValue which is the newly translated css.'
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
		...messages.map((message: any) => ({
			content: message.content,
			role: message.role
		}))
	];

	// Ask OpenAI for a chat completion given the prompt
	const response = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		messages: combinedMessages,
		response_format: { type: 'json_object' },
		temperature: 0
	});
	return new Response(JSON.stringify(response));
};
