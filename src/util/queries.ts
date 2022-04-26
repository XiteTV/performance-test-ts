module.exports = {
    getClientGuestPayload: (clientID: string, clientSecret: string, deviceID: string) => {
        return {
            grant_type: "client_credentials",
            client_id: `${clientID}`,
            client_secret: `${clientSecret}`,
            device_id: `${deviceID}`,
        };
    },

    getInitSessionPayload: (
        ownerkey: string,
        deviceId: string,
        appPlatform: string,
        appVersion: string,
        platform: string = "tv4"
    ) => {
        return `{ "ownerKey": "${ownerkey}","deviceId": "${deviceId}","appPlatform": "${appPlatform}","platform": "${platform}","appVersion": "${appVersion}"}`;
    },

    getChannelPlayerStartPayload: (
        ownerkey: string,
        deviceId: string,
        appPlatform: string,
        appVersion: string,
        channelID: string,
        playerType: string,
        categoryName: string,
        platform: string = "tv4"
    ) => {
        return `{"ownerKey":"${ownerkey}","deviceId":"${deviceId}","appPlatform":"${appPlatform}","appVersion":"${appVersion}","channelId":"${channelID}","playerType":"${playerType}","channelCategoryName":"${categoryName}","platform":"${platform}"}`;
    },

    getMixerPlayerStartPayload: (
        ownerkey: string,
        deviceId: string,
        appPlatform: string,
        appVersion: string,
        playerType: string,
        filterIds: Array<number>,
        platform: string = "tv4"
    ) => {
        return `{"ownerKey":"${ownerkey}","deviceId":"${deviceId}","appPlatform":"${appPlatform}","appVersion":"${appVersion}","playerType":"${playerType}","filterIds":[${filterIds}],"platform":"${platform}"}`;
    },

    getSkipVideoPayload: (
        ownerkey: string,
        deviceId: string,
        appPlatform: string,
        appVersion: string,
        action: string
    ) => {
        return `{"ownerKey":"${ownerkey}","deviceId":"${deviceId}","appPlatform":"${appPlatform}","action":"${action}","appVersion":"${appVersion}"}`;
    },

    getLikeVideoPayload: (
        ownerkey: string,
        deviceId: string,
        appPlatform: string,
        videoId: number,
        appVersion: string
    ) => {
        return `{"ownerKey":"${ownerkey}","deviceId":"${deviceId}","appPlatform":"${appPlatform}","feedback":"like","videoId":"${videoId}","appVersion":"${appVersion}"}`;
    },

    getSongSearchPayload: (
        ownerkey: string,
        deviceId: string,
        appPlatform: string,
        query: string,
        appVersion: string
    ) => {
        return `{"ownerKey":"${ownerkey}","deviceId":"${deviceId}","appPlatform":"${appPlatform}","searchQuery":"${query}","limit":25,"offset":0,"appVersion":"${appVersion}"}`;
    },

    getSearchPlayerStartPayload: (
        ownerkey: string,
        deviceId: string,
        appPlatform: string,
        appVersion: string,
        playerType: string,
        videoIndex: number,
        platform: string = "tv4"
    ) => {
        return `{"ownerKey":"${ownerkey}","deviceId":"${deviceId}","appPlatform":"${appPlatform}","appVersion":"${appVersion}","playerType":"${playerType}","videoIndex":${videoIndex},"platform":"${platform}"}`;
    },
};
