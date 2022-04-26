import {group, fail} from "k6";
import http, {RefinedResponse} from "k6/http";
import {Config} from "./domain/Config";
import {
    defaultgetResponseCheck,
    defaultpostResponseCheck, generateRandomDeviceID,
    getPlatformConfig,
    getRandomMixerFilters,
    runWithToken
} from "./util/utilities";
import {fromNullable, match, none, Option, some} from "fp-ts/Option";
import {Token} from "./domain/Auth";
import {StateUpdateResponse} from "./domain/Player";
import {pipe} from "fp-ts/function";
const queries = require("./util/queries");

export function mixerLike() {

    const config: Config = getPlatformConfig();
    const deviceId: string = generateRandomDeviceID();
    const appPlatform: string = "x1";
    const appVersion: string = "5.0.71";
    const playerType: string = "mixer";
    const clientSecret: string = "hyperion";

    const defaultHeaders = {
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en",
    };

    let token: Option<Token> = none;
    let filters: Array<number>= [];
    let videoId: Option<string | number> = none;

    group("01_Client_Guest_Login", function() {
        const url = `https://${__ENV.BASE_URL}/iam/oauth2/token`;
        const payload = queries.getClientGuestPayload(
            config.apiConfig.clientId,
            clientSecret,
            deviceId
        );
        const params = {
            headers: {
                ...defaultHeaders,
            },
        };
        const response: RefinedResponse<'text'> = http.post(url, payload, params);

        defaultpostResponseCheck(response);
        token = some(JSON.parse(response.body));
    });

    group("02_Get_User_Token_Info", function() {
        runWithToken(
            token,
            (t: string) => {
                const url = `https://${__ENV.BASE_URL}/iam/oauth2/tokeninfo`;
                const params = {
                    headers: {
                        ...defaultHeaders,
                        authorization: "Bearer " + t,
                    },
                };
                const response: RefinedResponse<'text'> = http.get(url, params);
                defaultgetResponseCheck(response);
            }
        )
    });

    group("03_Init_Session", function() {
        runWithToken(
            token,
            (t: string) => {
                const response: RefinedResponse<'text'> = http.post(
                    `https://${__ENV.BASE_URL}/api/player/init`,
                    queries.getInitSessionPayload(
                        config.apiConfig.ownerKey,
                        deviceId,
                        appPlatform,
                        appVersion
                    ),
                    {
                        headers: {
                            ...defaultHeaders,
                            authorization: "Bearer " + t,
                            "content-type": "application/json",
                        },
                    }
                );

                const init: StateUpdateResponse = JSON.parse(response.body)
                filters = getRandomMixerFilters(init);
                defaultgetResponseCheck(response);
            }
        )
    });

    group("04_Start_Mixer_Player", function() {
        runWithToken(
            token,
            (t: string) => {
                const response: RefinedResponse<'text'> = http.post(
                    `https://${__ENV.BASE_URL}/api/player/start`,
                    queries.getMixerPlayerStartPayload(
                        config.apiConfig.ownerKey,
                        deviceId,
                        appPlatform,
                        appVersion,
                        playerType,
                        filters
                    ),
                    {
                        headers: {
                            ...defaultHeaders,
                            authorization: "Bearer " + t,
                            "content-type": "application/json",
                        },
                    }
                );
                defaultgetResponseCheck(response);
                const start: StateUpdateResponse = JSON.parse(response.body)
                videoId = fromNullable(start.currentVideo?.id);
            }
        )
    });

    group("05_Like_Video", function() {
        runWithToken(
            token,
            (t: string) => {
                pipe(
                    videoId,
                    match(
                        () => fail("No videoId found to like"),
                        (id: string | number) => {
                            const response = http.post(
                                `https://${__ENV.BASE_URL}/api/player/feedback`,
                                queries.getLikeVideoPayload(
                                    config.apiConfig.ownerKey,
                                    deviceId,
                                    appPlatform,
                                    id,
                                    appVersion
                                ),
                                {
                                    headers: {
                                        ...defaultHeaders,
                                        authorization: "Bearer " + t,
                                        "content-type": "application/json",
                                    },
                                }
                            );
                            defaultgetResponseCheck(response);
                        }
                    )
                )
            }
        )
    });
}
