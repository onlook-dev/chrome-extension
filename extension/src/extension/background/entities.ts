import { projectsMapBucket, teamsMapBucket, userBucket, usersMapBucket } from "$lib/utils/localstorage"

import type { FirebaseService } from "$lib/storage"
import type { FirebaseProjectService } from "$lib/storage/project"
import type { Activity, Team, User } from "$shared/models"

export class EntitySubsciptionService {
    // TODO: Should move subscriptions into its own service
    projectSubs: (() => void)[] = []
    teamSubs: (() => void)[] = []
    userSubs: (() => void)[] = []
    activeProjectSub: (() => void) | null = null

    constructor(private projectService: FirebaseProjectService, private teamService: FirebaseService<Team>, private userService: FirebaseService<User>) { }
    listen() {
        // User  change from signing in
        userBucket.valueStream.subscribe(async ({ user }) => {
            if (!user) return

            // Save user in map
            usersMapBucket.set({ [user.id]: user })
            // When user added, get teams and add to map if not already there
            const mappedTeamIds = await teamsMapBucket.getKeys()
            const teamsNotInMap = user.teamIds.filter(teamId => !mappedTeamIds.includes(teamId))

            // Unsubscribe from previous teams
            this.teamSubs.forEach(unsubscribe => unsubscribe())

            for (const teamId of teamsNotInMap) {
                this.teamService.subscribe(teamId, async team => {
                    if (!team) return
                    teamsMapBucket.set({ [team.id]: team })
                }).then(unsubscribe => {
                    this.teamSubs.push(unsubscribe)
                })
            }
        })

        // Teams bucket change from user change
        teamsMapBucket.valueStream.subscribe(async teamsMap => {
            if (!teamsMap) return

            // When teams are added, get projects and add to map if not already there
            const mappedProjectIds = await projectsMapBucket.getKeys()
            const projectsNotInMap: string[] = Object.values(teamsMap)
                .flatMap((team: Team) => team.projectIds)
                .filter((projectId: string) => !mappedProjectIds.includes(projectId))

            // Unsubscribe from previous projects
            this.projectSubs.forEach(unsubscribe => unsubscribe())

            for (const projectId of projectsNotInMap) {
                this.projectService.subscribe(projectId, async project => {
                    if (!project) return
                    projectsMapBucket.set({ [project.id]: project })
                }).then(unsubscribe => {
                    this.projectSubs.push(unsubscribe)
                })
            }
        })

        // Project changes in map
        projectsMapBucket.valueStream.subscribe(async projectsMap => {
            if (!projectsMap) return

            // When projects are added, get users and add to map if not already there
            const mappedUserIds = await usersMapBucket.getKeys()

            // Get users from activities
            const usersNotInMap: string[] = Object.values(projectsMap)
                .flatMap(project =>
                    Object.values<Activity>(project.activities).map((item: Activity) => item.userId)
                )
                .filter((userId: string) => !mappedUserIds.includes(userId))

            // Unsubscribe from previous users
            this.userSubs.forEach(unsubscribe => unsubscribe())

            for (const userId of usersNotInMap) {
                this.userService.subscribe(userId, async user => {
                    if (!user) return
                    usersMapBucket.set({ [user.id]: user })
                }).then(unsubscribe => {
                    this.userSubs.push(unsubscribe)
                })
            }
        })

    }
}