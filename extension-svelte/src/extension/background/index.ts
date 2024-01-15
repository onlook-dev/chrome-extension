import { DashboardRoutes, DASHBOARD_URL } from '$shared/constants'
import {
	authRequestStream,
	editProjectRequestStream,
	toggleVisbugStream
} from '$lib/utils/messaging'
import { toggleIn } from '$lib/visbug/visbug'
import {
	authUserBucket,
	projectsMapBucket,
	teamsMapBucket,
	userBucket,
	usersMapBucket
} from '$lib/utils/localstorage'
import { signInUser, subscribeToFirebaseAuthChanges } from '$lib/firebase/auth'
import { getTeamFromFirebase } from '$lib/storage/team'
import { getProjectFromFirebase } from '$lib/storage/project'
import type { Team } from '../../../../shared/models/team'
import type { Activity } from '../../../../shared/models/activity'
import type { Comment } from '../../../../shared/models/comment'
import { EventMetadataType, type EventMetadata } from '../../../../shared/models/eventData'
import { getUserFromFirebase } from '$lib/storage/user'

// When triggered, open tab or use existin project tab and toggle visbug in

const setListeners = () => {
	subscribeToFirebaseAuthChanges()

	toggleVisbugStream.subscribe(() => {
		toggleVisbugOnActiveTab()
	})

	authRequestStream.subscribe(() => {
		const authUrl = `${DASHBOARD_URL}/${DashboardRoutes.SIGNIN}`
		chrome.tabs.create({ url: authUrl })
		return
	})

	editProjectRequestStream.subscribe(([project]) => {
		// Get tab if same host using pattern matching
		const searchUrl = new URL(project.hostUrl).origin + '/*'

		chrome.tabs.query({ url: searchUrl }, tabs => {
			// Check if tab with same url exists
			if (tabs?.length) {
				// Make sure tab is active
				chrome.tabs.update(tabs[0].id as number, { active: true })
				toggleIn({ id: tabs[0].id })
				return
			} else {
				chrome.tabs
					.create({
						url: project.hostUrl
					})
					.then(tab => {
						toggleIn({ id: tab.id })
					})
				return
			}
		})

		return
	})

	authUserBucket.valueStream.subscribe(({ authUser }) => {
		if (authUser) {
			signInUser(authUser)
		}
	})

	// TODO: Use subscribe instead to Firebase instead
	userBucket.valueStream.subscribe(async ({ user }) => {
		if (!user) return
		// When user added, get teams and add to map if not already there
		const mappedTeamIds = await teamsMapBucket.getKeys()
		const teamsNotInMap = user.teams.filter(teamId => !mappedTeamIds.includes(teamId))
		for (const teamId of teamsNotInMap) {
			const team = await getTeamFromFirebase(teamId)
			if (!team) return
			teamsMapBucket.set({ [team.id]: team })
		}
	})

	// TODO: Use subscribe to Firebase instead
	teamsMapBucket.valueStream.subscribe(async teamsMap => {
		if (!teamsMap) return

		// When teams are added, get projects and add to map if not already there
		const mappedProjectIds = await projectsMapBucket.getKeys()
		const projectsNotInMap: string[] = Object.values(teamsMap)
			.flatMap((team: Team) => team.projectIds)
			.filter((projectId: string) => !mappedProjectIds.includes(projectId))

		for (const projectId of projectsNotInMap) {
			const project = await getProjectFromFirebase(projectId)
			if (!project) return

			// Testing
			let activities: Activity[] = [
				{
					id: '1',
					userId: 'urGM6E9N7yf9hoBuc9lPBwRNf4m2',
					selector: 'body >',
					projectId: project?.id,
					eventData: [
						{
							key: 'click',
							value: 'click',
							type: EventMetadataType.SOURCE_MAP_ID
						} as EventMetadata
					],
					visible: true,
					creationTime: new Date(),
					styleChanges: [{ key: 'color', newVal: 'red', oldVal: 'blue' }]
				} as Activity,
				{
					id: '2',
					userId: 'urGM6E9N7yf9hoBuc9lPBwRNf4m2',
					selector: 'body >',
					projectId: project?.id,
					eventData: [
						{
							key: 'click',
							value: 'click',
							type: EventMetadataType.SOURCE_MAP_ID
						} as EventMetadata
					],
					visible: true,
					creationTime: new Date(),
					styleChanges: [{ key: 'color', newVal: 'red', oldVal: 'blue' }]
				} as Activity
			]
			let comments: Comment[] = [
				{
					id: '1',
					userId: 'urGM6E9N7yf9hoBuc9lPBwRNf4m2',
					projectId: project?.id,
					creationTime: new Date(),
					text: 'This is a comment'
				} as Comment,
				{
					id: '2',
					userId: 'urGM6E9N7yf9hoBuc9lPBwRNf4m2',
					projectId: project?.id,
					creationTime: new Date(),
					text: 'This is a comment, too'
				} as Comment
			]
			if (project) {
				project.activities = activities
				project.comments = comments
			}
			// End testing

			projectsMapBucket.set({ [project.id]: project })
		}
	})

	// TODO: Use subscribe to Firebase instead
	projectsMapBucket.valueStream.subscribe(async projectsMap => {
		if (!projectsMap) return

		// When projects are added, get users and add to map if not already there
		const mappedUserIds = await usersMapBucket.getKeys()

		// Get users from activities and comments
		const usersNotInMap: string[] = Object.values(projectsMap)
			.flatMap(project => project.activities.map((item: Activity) => item.userId))
			.concat(
				Object.values(projectsMap).flatMap(project =>
					project.comments.map((item: Comment) => item.userId)
				)
			)
			.filter((userId: string) => !mappedUserIds.includes(userId))

		for (const userId of usersNotInMap) {
			const user = await getUserFromFirebase(userId)
			if (!user) return
			usersMapBucket.set({ [user.id]: user })
		}
	})
}

function toggleVisbugOnActiveTab() {
	chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
		toggleIn({ id: tabs[0].id })
	})
}

try {
	setListeners()
	console.log('Background script loaded!')
} catch (error) {
	console.error(error)
}
