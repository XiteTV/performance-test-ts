import {Gender, Vendor} from "../domain/Auth";
import {PlayerType} from "../domain/Player";

export function getClientGuestPayload(clientId: string, clientSecret: string, deviceId: string) {
    return {
        grant_type: "client_credentials",
        client_id: `${clientId}`,
        client_secret: `${clientSecret}`,
        device_id: `${deviceId}`,
    };
}

export function adminGrantPayload(clientId: string, clientSecret: string) {
    return {
        grant_type: "client_credentials",
        client_id: `${clientId}`,
        client_secret: `${clientSecret}`,
    };
}

export function deviceGrantPayload(clientId: string, clientSecret: string, deviceId: string) {
    return {
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
        client_id: `${clientId}`,
        client_secret: `${clientSecret}`,
        device_id: `${deviceId}`,
    };
}

export function webLogin(clientId: string, clientSecret: string, email: string, password: string) {
    return {
        grant_type: "password",
        client_id: `${clientId}`,
        client_secret: `${clientSecret}`,
        username: `${email}`,
        password: `${password}`
    }
}

export function refreshTokenPayload(refreshToken: string) {
    return {
        grant_type: "refresh_token",
        refresh_token: refreshToken
    }
}

export function getInitSessionPayload(
    ownerkey: string,
    deviceId: string,
    appPlatform: string,
    appVersion: string,
    platform: string = "tv4"
) {
        return `{ "ownerKey": "${ownerkey}","deviceId": "${deviceId}","appPlatform": "${appPlatform}","platform": "${platform}","appVersion": "${appVersion}"}`;
}

export function getChannelPlayerStartPayload(
    ownerkey: string,
    deviceId: string,
    appPlatform: string,
    appVersion: string,
    channelID: number,
    playerType: string,
    categoryName: string,
    platform: string = "tv4"
) {
    return `{"ownerKey":"${ownerkey}","deviceId":"${deviceId}","appPlatform":"${appPlatform}","appVersion":"${appVersion}","channelId":"${channelID}","playerType":"${playerType}","channelCategoryName":"${categoryName}","platform":"${platform}"}`;
}

export function getMixerPlayerStartPayload(
    ownerkey: string,
    deviceId: string,
    appPlatform: string,
    appVersion: string,
    playerType: string,
    filterIds: Array<number>,
    platform: string = "tv4"
) {
    return `{"ownerKey":"${ownerkey}","deviceId":"${deviceId}","appPlatform":"${appPlatform}","appVersion":"${appVersion}","playerType":"${playerType}","filterIds":[${filterIds}],"platform":"${platform}"}`;
}

export function getSkipVideoPayload(
    ownerkey: string,
    deviceId: string,
    appPlatform: string,
    appVersion: string,
    action: string
) {
    return `{"ownerKey":"${ownerkey}","deviceId":"${deviceId}","appPlatform":"${appPlatform}","action":"${action}","appVersion":"${appVersion}"}`;
}

export function getLikeVideoPayload(
    ownerkey: string,
    deviceId: string,
    appPlatform: string,
    videoId: number | string,
    appVersion: string
) {
    return `{"ownerKey":"${ownerkey}","deviceId":"${deviceId}","appPlatform":"${appPlatform}","feedback":"like","videoId":"${videoId}","appVersion":"${appVersion}"}`;
}

export function getSongSearchPayload(
    ownerkey: string,
    deviceId: string,
    appPlatform: string,
    query: string,
    appVersion: string
) {
    return `{"ownerKey":"${ownerkey}","deviceId":"${deviceId}","appPlatform":"${appPlatform}","searchQuery":"${query}","limit":25,"offset":0,"appVersion":"${appVersion}"}`;
}

export function getSearchPlayerStartPayload(
    ownerkey: string,
    deviceId: string,
    appPlatform: string,
    appVersion: string,
    playerType: string,
    videoIndex: number,
    platform: string = "tv4"
) {
    return `{"ownerKey":"${ownerkey}","deviceId":"${deviceId}","appPlatform":"${appPlatform}","appVersion":"${appVersion}","playerType":"${playerType}","videoIndex":${videoIndex},"platform":"${platform}"}`;
}

export function getCloseSessionPayload(
    ownerKey: string,
    deviceId: string,
    platform: string,
    appVersion: string
) {
    return `{ "ownerKey": "${ownerKey}", "deviceId": "${deviceId}", "appPlatform": "${platform}", "appVersion": "${appVersion}"}`
}

export function PMTExitv5(
    platform: string,
    ownerKey: string,
    timestampMillis: number,
    id: string,
    deviceId: string
) {
    return `[{
     "clientPlatform": "${platform}", 
     "clientOwnerKey": "${ownerKey}", 
     "category": "user_action",
     "message": "PMT exit",
     "partitionDate": "2022-05",
     "timestamp": ${timestampMillis},
     "clientVersion": "5.3.84",
     "clientDeviceId": "${deviceId}",
     "clientDeviceSoftwareVersion": "unknown",
     "correlationId": "",
     "id": "${id}",
     "customSessionTime": 7290
     }]`
}

export function GDPRConsent(accept: boolean) {
    return`{"accept": ${accept}`
}

export function deviceGrantAuth(clientId: string, deviceId: string) {
    return `{ "client_id": "${clientId}", "device_id": "${deviceId}"}`
}

export function accountSignUp(
      email: string
    , password: string
    , firstname: string
    , lastname: string
    , birthdate: string
    , gender: Gender
    , countryCode: string
    , captcha: string
    , vendor?: Vendor) {
    return `{
        "email": "${email}",
        "password": "${password}",
        "firstname": "${firstname}",
        "lastname": "${lastname}",
        "birthdate": "${birthdate}",
        "gender": "${gender}",
        "countrycode": "${countryCode}",
        "captcha": "${captcha}",
        "vendor": "${vendor}"
        
    }`
}

export function connectDevicePayload(userCode: string) {
    return `{
        "code": "${userCode}"
    }`
}

export function upgradeToPremiumPayload() {
    return `{
       "role": "premium_registered" 
    }`
}

export function playerSearchPayload(
      appVersion: string
    , deviceId: string
    , limit: number
    , offset: number
    , ownerKey: string
    , searchQuery: string) {
    return `{
        "appVersion": "${appVersion}",
        "deviceId": "${deviceId}",
        "limit": "${limit}",
        "offset": "${offset}",
        "ownerKey": "${ownerKey}",
        "searchQuery": "${searchQuery}"
    }`
}

export function playerStartPayload(
      version: string
    , deviceId: string
    , ownerKey: string
    , platform: string
    , playerType: PlayerType
    , videoIndex: number) {
    return `{
    "appVersion": "${version}",
    "deviceId": "${deviceId}",
    "ownerKey": "${ownerKey}",
    "platform": "${platform}",
    "playerType": "${playerType}",
    "version": "${version}",
    "videoIndex": ${videoIndex}
    }`
}
