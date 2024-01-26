export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  teamIds: string[];
  createdAt: string;

  // Integrations
  githubAuthId?: string;
}
