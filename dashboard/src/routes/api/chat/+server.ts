import OpenAI from 'openai';
import { openAi } from '$lib/utils/serverEnv';

const systemMessage = {
	role: 'system',
	content:
		'you are a css translator that can translate raw css to any underlying example syntax such as tailwind css. You receive an object, within it is an array of strings called newCss which is a list of raw css changes and a field called currentClasses which is the current tailwind class values, it could be empty. It is your job to translate all changes to match the syntax of currentClasses and return json that the same object with the newCss filed replaced with newClasses, which will be the new tailwind classes in the same format as currentClasses.'
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
		temperature: 0,
	});
	return new Response(JSON.stringify(response));
};
