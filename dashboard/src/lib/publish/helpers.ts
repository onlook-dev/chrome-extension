import type { Activity } from "$shared/models/activity";

export function filterActivitiesWithoutPath(activities: Record<string, Activity>): Record<string, Activity> {
  return Object.entries(activities)
    .filter(([_, activity]) => activity.path)
    .reduce((filteredActivities, [key, activity]) => {
      filteredActivities[key] = activity;
      return filteredActivities;
    }, {} as Record<string, Activity>);
}