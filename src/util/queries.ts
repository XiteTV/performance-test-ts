
export function getClientGuestPayload(clientID: string, clientSecret: string, deviceID: string) {
    return {
        grant_type: "client_credentials",
        client_id: `${clientID}`,
        client_secret: `${clientSecret}`,
        device_id: `${deviceID}`,
    };
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
    return `{
     "clientPlatform": "${platform}", 
     "clientOwnerKey": "${ownerKey}", 
     "category": "user_action",
     "clientPlatform": "Ziggo",
     "message": "PMT exit",
     "partitionDate": "2020-06",
     "timestamp": ${timestampMillis},
     "clientVersion": "5.3.84",
     "clientDeviceId": "${deviceId}",
     "clientDeviceSoftwareVersion": "unknown",
     "clientOwnerKey": "ziggo-nl",
     "correlationId": "",
     "id": "${id}",
     "customSessionTime": 7290
     }`
}
