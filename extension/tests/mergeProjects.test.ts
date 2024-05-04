// @ts-ignore - Bun test exists
import { expect, test, describe } from 'bun:test';
// @ts-ignore - Module exists
import { Project, Activity } from '$shared/models';
// @ts-ignore - Module exists
import { ProjectChangeService } from '$lib/projects/changes';

describe('ProjectChangeService', () => {

    test('should merge project', () => {
        const currentProject = {
            id: '1',
            activities: {
                'activity1': {
                    styleChanges: {
                        'style1': 'style1',
                        'style3': 'style3'
                    },
                    textChanges: {
                        'text1': 'text1'
                    },
                    attributeChanges: {
                        'attribute1': 'attribute1'
                    },
                    previewImage: 'previewImage1',
                } as Activity,
                'activity2': {
                    styleChanges: {
                        'style1': 'style2',
                        'style2': 'style2'
                    },
                    textChanges: {
                        'text1': 'text2'
                    },
                    attributeChanges: {
                        'attribute1': 'attribute2'
                    },
                }
            },
            updatedAt: '1'
        } as Project;
        const targetProject = {
            id: '2',
            activities: {
                'activity1': {
                    styleChanges: {
                        'style1': 'style2',
                        'style2': 'style2'
                    },
                    textChanges: {
                        'text1': 'text2'
                    },
                    attributeChanges: {
                        'attribute1': 'attribute2'
                    }
                },
                'activity3': {
                    styleChanges: {
                        'style1': 'style2',
                        'style2': 'style2'
                    },
                    textChanges: {
                        'text1': 'text2'
                    },
                    attributeChanges: {
                        'attribute1': 'attribute2'
                    }
                }
            },
            updatedAt: '2'
        } as Project;
        const mergedProject = {
            id: '2',
            activities: {
                'activity1': {
                    styleChanges: {
                        'style1': 'style1',
                        'style2': 'style2',
                        'style3': 'style3'
                    },
                    textChanges: {
                        'text1': 'text1'
                    },
                    attributeChanges: {
                        'attribute1': 'attribute1'
                    },
                    previewImage: 'previewImage1',
                },
                'activity2': {
                    styleChanges: {
                        'style1': 'style2',
                        'style2': 'style2'
                    },
                    textChanges: {
                        'text1': 'text2'
                    },
                    attributeChanges: {
                        'attribute1': 'attribute2'
                    }
                },
                'activity3': {
                    styleChanges: {
                        'style1': 'style2',
                        'style2': 'style2'
                    },
                    textChanges: {
                        'text1': 'text2'
                    },
                    attributeChanges: {
                        'attribute1': 'attribute2'
                    }
                }
            },
            updatedAt: '1'
        } as Project;

        const service = new ProjectChangeService();
        const newProject = service.mergeProjects(currentProject, targetProject);
        expect(newProject).toEqual(mergedProject);
    });

});
