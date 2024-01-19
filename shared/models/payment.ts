export enum PaymentStatus {
    UNPAID = "unpaid",
    PENDING = "pending",
    EXPIRED = "expired",
    PAID= "paid",
    CANCELLED = "cancelled",
}

export interface Payment {
    id: string;
    stripePriceId: string;
    paymentStatus: PaymentStatus;
    checkoutSessionId?: string;
    subscriptionId?: string;
}
