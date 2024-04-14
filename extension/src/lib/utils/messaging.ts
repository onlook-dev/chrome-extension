import type { MouseEvent } from '$shared/constants'
import type { Activity } from '$shared/models/activity'
import type { Project } from '$shared/models/project'
import type { EditEvent } from '$shared/models/editor'
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

export interface ActivityInspectDetail {
	selector: string
	event: MouseEvent
	scrollToElement: boolean
}

export interface EditProjectRequest {
	project: Project
	enable: boolean
}

// Messages
export const [sendAuthRequest, authRequestStream] = getExtendedMessages<void>(
	'REQUEST_AUTH',
	MessageReceiver.BACKGROUND
)

export const [sendEditProjectRequest, editProjectRequestStream] =
	getExtendedMessages<EditProjectRequest>('REQUEST_EDIT_PROJECT', MessageReceiver.BACKGROUND)

export const [sendEditEvent, editEventStream] = getExtendedMessages<EditEvent>(
	'EDIT_EVENT',
	MessageReceiver.BACKGROUND
)

export const [sendOpenUrlRequest, openUrlRequestStream] = getExtendedMessages<string>(
	'SEND_OPEN_URL_REQUEST',
	MessageReceiver.BACKGROUND
)

export const [sendSaveProject, saveProjectStream] = getExtendedMessages<Project>(
	'SAVE_PROJECT',
	MessageReceiver.BACKGROUND
)


export const [sendPageScreenshotRequest, pageScreenshotRequestStream] = getExtendedMessages<{ signature: string, refresh: boolean }>(
	'PAGE_SCREENSHOT_REQUEST',
	MessageReceiver.BACKGROUND
)

export const [sendPageScreenshotResponse, pageScreenshotResponseStream] = getExtendedMessages<{ image: string, signature: string }>(
	'PAGE_SCREENSHOT_RESPONSE',
	MessageReceiver.CONTENT
)

export const [sendApplyProjectChanges, applyProjectChangesStream] = getExtendedMessages<void>(
	'APPLY_PROJECT_CHANGES',
	MessageReceiver.CONTENT
)

export const [sendActivityApply, activityApplyStream] = getExtendedMessages<Activity>(
	'ACTIVITY_APPLY',
	MessageReceiver.CONTENT
)

export const [sendActivityRevert, activityRevertStream] = getExtendedMessages<Activity>(
	'ACTIVITY_REVERT',
	MessageReceiver.CONTENT
)

export const [sendGetScreenshotRequest, getScreenshotStream] = getExtendedMessages<Activity>(
	'ACTIVITY_SCREENSHOT',
	MessageReceiver.CONTENT
)
