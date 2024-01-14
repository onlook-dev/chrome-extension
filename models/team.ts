export enum Role {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  GUEST = "GUEST",
}

export interface Team {
  id: string;
  name: string;
  users: Record<string, Role>;
  projectIds: string[];
}
