import {get, post, put} from "./utilities";
import {
    AccountInfo,
    AccountResponse, AccountUpgrade,
    DeviceCodeIssued,
    Gender, IssuedToken,
    LinkingCodeResponse,
    Token,
    TokenInfo, Vendor
} from "../domain/Auth";
import {
    accountSignUp,
    adminGrantPayload,
    connectDevicePayload,
    deviceGrantAuth,
    deviceGrantPayload,
    GDPRConsent,
    playerSearchPayload,
    playerStartPayload,
    refreshTokenPayload,
    upgradeToPremiumPayload,
    webLogin
} from "./queries";
import {Option} from "fp-ts/Option";
import {PlayerType, SearchResponse, StateUpdateResponse} from "../domain/Player";

export function acceptGDPR(accountId: string, token: Token): Option<AccountInfo> {
    return put<AccountInfo>(
        {
            route: `/iam/account/${accountId}/gdpr`,
            payload: GDPRConsent(true),
            token: token.access_token,
            headers: {
                'content-type': "application/json"
            },
            validStatusCode: 200
        }
    )
}

export function getGdprManageCode(accountId: string, ownerKey: string, token: Token): Option<LinkingCodeResponse> {
    return get<LinkingCodeResponse>(
        {
            route: `/fetch-code/${accountId}/?ownerKey=${ownerKey}`,
            token: token.access_token,
            headers: {
                'content-type': "application/json"
            },
            validStatusCode: 200
        }
    )
}

export function getDeviceAuthCode(clientId: string, deviceId: string): Option<DeviceCodeIssued> {
    return post<DeviceCodeIssued>(
        {
            route: "/iam/oauth2/device_authorization",
            payload: deviceGrantAuth(clientId, deviceId),
            headers: {
                'content-type': "application/x-www-form-urlencoded"
            },
            validStatusCode: 200
        }
    )
}

export function getWebsiteLogin(clientId: string, clientSecret: string, email: string, password: string): Option<Token> {
    return post<any>(
        {
            route: "/iam/oauth2/token",
            payload: webLogin(clientId, clientSecret, email, password),
            headers: {
                'content-type': "application/x-www-form-urlencoded"
            },
            validStatusCode: 200
        }
    )
}

export function validateDeviceCode(clientId: string, clientSecret: string, deviceId: string): Option<TokenInfo> {
    return post<TokenInfo>(
        {
            route: "/iam/oauth2/token",
            payload: deviceGrantPayload(clientId, clientSecret, deviceId),
            validStatusCode: 201
        }
    )
}

export function createAccount(
      email: string
    , password: string
    , firstname: string
    , lastname: string
    , birthdate: string
    , gender: Gender
    , countryCode: string
    , captcha: string
    , vendor?: Vendor): Option<AccountResponse> {
    return post<AccountResponse>(
        {
            route: "/iam//signup",
            payload: accountSignUp(
                email,
                password,
                firstname,
                lastname,
                birthdate,
                gender,
                countryCode,
                captcha,
                vendor),
            headers: {
                'content-type': "application/json"
            },
            validStatusCode: 200
        }
    )
}

export function connectDevice(deviceCode: string, token: Token): Option<object> {
    return post<object>(
        {
            route: "/oauth2/device_connect",
            payload: connectDevicePayload(deviceCode),
            token: token.access_token,
            headers: {
                'content-type': "application/x-www-form-urlencoded"
            },
            validStatusCode: 200
        }
    )
}

export function refreshToken(refreshToken: string): Option<IssuedToken> {
    return post<IssuedToken>(
        {
            route: "/iam/oauth2/token",
            payload: refreshTokenPayload(refreshToken),
            headers: {
                'content-type': "application/x-www-form-urlencoded"
            },
            validStatusCode: 200
        }
    )
}

export function adminLogin(clientId: string, clientSecret: string): Option<Token> {
    return post<Token>(
        {
            route: "/iam/oauth2/token",
            payload: adminGrantPayload(clientId, clientSecret),
            headers:  {
                'content-type': "application/x-www-form-urlencoded"
            },
            validStatusCode: 200
        }
    )
}

export function upgradeToPremium(accountId: string, token: Token): Option<AccountUpgrade> {
    return put<AccountUpgrade>(
        {
            route: `/iam/account/${accountId}`,
            payload: upgradeToPremiumPayload(),
            token: token.access_token,
            headers:  {
                'content-type': "application/x-www-form-urlencoded"
            },
            validStatusCode: 200
        }
    )
}

export function playerSearch(
      appVersion: string
    , deviceId: string
    , limit: number
    , offset: number
    , ownerKey: string
    , searchQuery: string
    , token: Token)
: Option<SearchResponse> {
    return post<SearchResponse>(
        {
            route: "/api/player/search",
            payload: playerSearchPayload(appVersion, deviceId, limit, offset, ownerKey, searchQuery),
            token: token.access_token,
            headers:  {
                'content-type': "application/json"
            },
            validStatusCode: 200
        }
    )
}

export function playerStartSearch(
      version: string
    , deviceId: string
    , ownerKey: string
    , platform: string
    , playerType: PlayerType
    , videoIndex: number
    , token: Token
): Option<StateUpdateResponse> {
    return post<StateUpdateResponse>(
        {
            route: "/api/player/start",
            payload: playerStartPayload(version, deviceId, ownerKey, platform, playerType, videoIndex),
            token: token.access_token,
            headers:  {
                'content-type': "application/json"
            },
            validStatusCode: 200
        }
    )
}