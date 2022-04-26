import {group, check} from "k6";
import http, {RefinedParams, RefinedResponse} from "k6/http";
import {Option, isSome, fromNullable, none, chain, some} from "fp-ts/Option";
import {Channel, getPlatformConfig, runWithToken} from "./util/utilities";
const queries = require("./util/queries");
import {defaultgetResponseCheck, generateRandomDeviceID, defaultpostResponseCheck, getRandomChannel, validateSkipCheck} from "./util/utilities";
import { pipe } from 'fp-ts/function'
import {StateUpdateResponse} from "./domain/Player";
import {Config} from "./domain/Config";
import {Token} from "./domain/Auth";

export function mixerSkip() {

    let token: Option<Token> = none;
    let initResponse: Option<StateUpdateResponse> = none
    let channelDetails: Option<Channel> = none
    let videoId: Option<string | number> = none

    const config: Config = getPlatformConfig();
    const deviceId: string = generateRandomDeviceID();
    const appPlatform: string = "x1";
    const appVersion: string = "5.0.71";
    const playerType: string = "mixer";
    const clientSecret: string = "hyperion";

    const defaultHeaders = {
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en",
    };

    group("01_Client_Guest_Login", function() {
        let url = `https://${__ENV.BASE_URL}/iam/oauth2/token`;
        let payload = queries.getClientGuestPayload(
            config.apiConfig.clientId,
            clientSecret,
            deviceId
        );
        let params: RefinedParams<'text'> = {
            headers: defaultHeaders
        };
        const response: RefinedResponse<'text'> = http.post(url, payload, params);
        defaultpostResponseCheck(response);
        token = some(JSON.parse(response.body));
    });

    group("02_Get_User_Token_Info", function() {
        runWithToken(
            token,
            (t: string) => {
                let url = `https://${__ENV.BASE_URL}/iam/oauth2/tokeninfo`;
                let params: RefinedParams<'text'> = {
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
                            'content-type': "application/json",
                        },
                    }
                );
                initResponse = some(JSON.parse(response.body))
                defaultgetResponseCheck(response);
            }
        )
    });

    group("04_Get_Random_Channel_From_Session", function() {
        channelDetails = pipe(
            initResponse,
            chain( (response: StateUpdateResponse) => {
                    return getRandomChannel(response);
                }
            )
        )

        check(
            channelDetails,
            {
                "Channel details are returned": (details: Option<Channel>) => {
                    return pipe(
                        details,
                        isSome
                    );
                }
            }
        )
    });

    group("05_Start_Mixer_Player", function() {
        runWithToken(
            token,
            (t: string) => {
                const filters: Array<number> = [1745844053, 1080229685, 812932015]
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
                            'content-type': "application/json",
                        }
                    }
                );
                defaultgetResponseCheck(response);
                const startResponse: StateUpdateResponse = JSON.parse(response.body)
                videoId = fromNullable(startResponse.currentVideo?.id)
                check(
                    videoId,
                    {
                        "VideoId found": (id: Option<string | number>) => {
                            return pipe(
                                id,
                                isSome
                            );
                        }
                    }
                )
            }
        )
    });

    group("06_Skip_Video", function() {

        runWithToken(
            token,
            (t: string) => {
                const response: RefinedResponse<'text'> = http.post(
                    `https://${__ENV.BASE_URL}/api/player/next`,
                    queries.getSkipVideoPayload(
                        config.apiConfig.ownerKey,
                        deviceId,
                        appPlatform,
                        appVersion,
                        "skip"
                    ),
                    {
                        headers: {
                            ...defaultHeaders,
                            authorization: "Bearer " + t,
                            'content-type': "application/json",
                        },
                    }
                );
                defaultgetResponseCheck(response);
                validateSkipCheck(response, true);
            }
        )
    });
}
