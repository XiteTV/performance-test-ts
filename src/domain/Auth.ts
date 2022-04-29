export interface Token {
    access_token: string
}

export interface TokenInfo {
    account: Account
}

export interface IssuedToken {
    access_token: string
    token_type: string
    expires_in: number
    refresh_token: string
    scope: string
}

export interface AccountResponse {
    account: Account
}

export interface Account {
    sub: string
    consent?: Consent
    gdprConsent?: object
}

export interface Consent {
    consentString?: string
    type: string
    isConsentNeeded: boolean
}

export interface DeviceCodeIssued {
    device_code: string
    user_code: string
    verification_uri: string
    starttrialpremium_uri: string
    expires_in: number
    interval: number
}

export interface AccountInfo {
    sub: string
    email?: string
    password?: string
    personalInfo?: PersonalInfo
    profiles: Array<AccountProfile>
    role: string,
    isActive: boolean,
    linkedDevice?: object
    lastTokenIssuedAt?: string
    triallStart?: string
    trialEnd?: string
    plannedCancellation?: string
    cbSubscriptionId?: string
    createdAt: string
    updatedAt: string
    gdprConsent?: object
    consent?: GDPRConsent
    referrerName?: string
    platformInfo?: PlatformInfo
    vendor?: object
}

export interface AccountUpgrade {
    sub: string
    email: string
    role: Role
    personalInfo?: PersonalInfo
    platformInfo?: PlatformInfo
}

export enum Role {
    FREE_GUEST = "FREE_GUEST",
    FREE_REGISTERED = "FREE_REGISTERED",
    PREMIUM_REGISTERED = "PREMIUM_REGISTERED",
    XIAM_ADMIN = "XIAM_ADMIN",
    ARTEMIS_ADMIN = "ARTEMIS_ADMIN"

}

export interface PersonalInfo {
    firstName: string
    lastName?: string
    dateOfBirth?: string
    gender?: Gender
}

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER",
    UNDISCLOSED = "UNDISCLOSED"
}

export interface AccountProfile {
    _id: string
    name: string
    isRestricted: boolean
    isDefault: boolean
    isActive?: boolean
    createdAt: string
    updatedAt: string
}

export interface GDPRConsent {
    productConsent: GdprContract
    adConsent: GdprContract
    consentString?: string
}

export interface GdprContract {
    consent?: boolean
    timestamp?: string
    consentSource?: string
}

export interface GdprContract {
    consent?: boolean
    timestamp?: string
    consentSource?: string
}

export interface PlatformInfo {
    platform: object
    countryCode: string
    externalAccountId?: string
}

export interface LinkingCodeResponse {
    code: string
    websiteUrl: string
    codeExpiresAt: number
    txid: string
}

export enum Vendor {
    XITE = "XITE",
    VEVO = "VEVO"
}
