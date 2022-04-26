export interface Config {
    apiConfig: Api
    appConfig: App
}

export interface Api {
    apiAuth: Auth
    apiConsent: Consent
    apiPlayer: Player
    apiReporting: Reporting
    clientId: string
    debugReporting: Debug
    ownerKey: string
    recoveryPlaylistUrl: string
    signUpFormUrl: string
}

export interface App {
    channelsFeature: boolean
    consentRequired: boolean
    debugReportsFeature: boolean
    isMuxDataEnabled: boolean
    likesFeature: boolean
    likesVisibleGuest: boolean
    likesVisiblePremium: boolean
    logUserActions: boolean
    loginFeature: boolean
    maxResults: number
    menuIsActiveOnStart: boolean
    mixerFeature: boolean
    muxApiKey: string
    muxDataPercentageCoverage: number
    openMenuDelayOnStart: number
    platform: string
    searchFeature: boolean
    searchFeatureGuest: boolean
    sentryEnabled: boolean
    silentReportsLimit: number
    skipFeature: boolean
    userFeature: boolean
}

export interface Reporting {
    apiUrl: string
    apiUrlv6: string
}

export interface Auth {
    apiUrl: string
}

export interface Consent {
    apiUrl: string
}

export interface Player {
    apiUrl: string
    withCredentials: boolean
}

export interface Debug {
    apiUrl: string
    debugInterval: number
}

