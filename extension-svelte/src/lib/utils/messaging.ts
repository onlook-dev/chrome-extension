import type { Project } from '$models/project'
import { getMessage } from '@extend-chrome/messages'
import type { SendOptions } from '@extend-chrome/messages/types/types'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export enum MessageReceiver {
	CONTENT = 'CONTENT',
	SIDEPANEL = 'SIDEPANEL',
	BACKGROUND = 'BACKGROUND'
}

// Used for message forwarding in background script
interface MessageWrapper<T> {
	data: T
	to: MessageReceiver
}

function getExtendedMessages<T>(
	greeting: string,
	to: MessageReceiver
): [
	((data: T, options?: SendOptions | undefined) => Promise<void>) & {
		toTab: (options?: SendOptions | undefined) => Promise<void>
	},
	Observable<[T, chrome.runtime.MessageSender]>
] {
	// Strip the Message wrapper on the observer and the sender.
	// This preserve getMessage behavior while allowing background script to verify receiver.

	const [send, stream] = getMessage<MessageWrapper<T>>(greeting)
	const sendExtended = (data: T, options?: SendOptions) => {
		return send({ data, to }, options)
	}
	sendExtended.toTab = (options?: SendOptions) => {
		return send.toTab(options)
	}
	const streamExtended: Observable<[T, chrome.runtime.MessageSender]> = stream.pipe(
		map(([message, sender]) => {
			return [message.data, sender]
		})
	)
	return [sendExtended, streamExtended]
}

// Messages
export const [sendToggleVigbug, toggleVisbugStream] = getExtendedMessages<void>(
	'TOGGLE_VISBUG',
	MessageReceiver.BACKGROUND
)

export const [sendAuthRequest, authRequestStream] = getExtendedMessages<void>(
	'REQUEST_AUTH',
	MessageReceiver.BACKGROUND
)

export const [sendEditProjectRequest, editProjectRequestStream] = getExtendedMessages<Project>(
	'REQUEST_EDIT_PROJECT',
	MessageReceiver.BACKGROUND
)
