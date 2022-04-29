import {get, post, put} from "./utilities";
import {
    AccountInfo,
    AccountResponse,
    DeviceCodeIssued,
    Gender,
    LinkingCodeResponse,
    Token,
    TokenInfo, Vendor
} from "../domain/Auth";
import {accountSignUp, deviceGrantAuth, deviceGrantPayload, GDPRConsent} from "./queries";
import {Option} from "fp-ts/Option";

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
            route: "/oauth2/device_authorization",
            payload: deviceGrantAuth(clientId, deviceId),
            headers: {
                'content-type': "application/x-www-form-urlencoded"
            }
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