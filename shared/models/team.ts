export enum Role {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  GUEST = "GUEST",
}

export enum Tier {
  FREE = "Free",
  PRO = "Pro",
  ORG = "Organization",
  ENTERPRISE = "Enterprise",
}

export interface Team {
  id: string;
  name: string;
  tier: Tier;
  users: Record<string, Role>;
  projectIds: string[];
  paymentId?: string;
  createdAt: string;
}
