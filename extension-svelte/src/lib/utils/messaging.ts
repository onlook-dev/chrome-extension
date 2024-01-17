import type { MouseEvent } from '$shared/constants'
import type { Project } from '../../../../shared/models/project'
import { getMessage } from '@extend-chrome/messages'
import type { SendOptions } from '@extend-chrome/messages/types/types'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export enum MessageReceiver {
	CONTENT = 'CONTENT',
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

export interface StyleChangeDetail {
	selector: string
	styleType: string
	changeMap: Record<string, string>
}

export interface ActivityInspectDetail {
	selector: string
	event: MouseEvent
	scrollToElement: boolean
}

// Messages
export const [sendAuthRequest, authRequestStream] = getExtendedMessages<void>(
	'REQUEST_AUTH',
	MessageReceiver.BACKGROUND
)

export const [sendEditProjectRequest, editProjectRequestStream] = getExtendedMessages<Project>(
	'REQUEST_EDIT_PROJECT',
	MessageReceiver.BACKGROUND
)

export const [sendStyleChange, styleChangeStream] = getExtendedMessages<StyleChangeDetail>(
	'STYLE_CHANGE',
	MessageReceiver.BACKGROUND
)

export const [sendActivityInspect, activityInspectStream] =
	getExtendedMessages<ActivityInspectDetail>('ACTIVITY_INSPECT', MessageReceiver.CONTENT)

export const [sendOpenUrlRequest, openUrlRequestStream] = getExtendedMessages<string>(
	'SEND_OPEN_URL_REQUEST',
	MessageReceiver.BACKGROUND
)
