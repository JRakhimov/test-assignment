export const UserRole = {
    admin: "admin",
    manager: "manager"
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export const PartnerRole = {
    owner: "owner",
    manager: "manager",
    master: "master"
} as const;
export type PartnerRole = (typeof PartnerRole)[keyof typeof PartnerRole];
