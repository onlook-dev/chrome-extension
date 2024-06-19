export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  teamIds: string[];
  createdAt: string;
  toursCompleted?: { [key in TourName]?: boolean };
}

export enum TourName {
  INTRO = 'INTRO',
  PROJECT = 'PROJECT',
}