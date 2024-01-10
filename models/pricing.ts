export enum Tier {
    BASIC = "Basic",
    PRO = "Pro",
    ORG = "Organization",
    ENTERPRISE = "Enterprise",
}

export interface Pricing {
    id: string;
    tier: Tier;
    teamId: string;
    priceId: string; // This will be stripe price id
}
