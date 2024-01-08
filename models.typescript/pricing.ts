export enum Tier {
    FREE = "FREE",
    PRO = "PRO",
    ORG = "ORG",
    ENTERPRISE = "ENTERPRISE",
}

export interface Pricing {
    id: string;
    tier: Tier;
    teamId: string;
    priceId: string; // This will be stripe price id
}
