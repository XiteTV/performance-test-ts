export interface Token {
    access_token: string
}

export interface TokenInfo {
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