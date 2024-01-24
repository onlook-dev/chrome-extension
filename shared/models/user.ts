export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  teamIds: string[];

  // Integrations
  githubAuthId?: string;
}
