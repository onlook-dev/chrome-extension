export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  teams: string[];

  // Integrations
  githubAuthId?: string;
}
