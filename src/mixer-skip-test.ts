import {group, check, fail} from "k6";
import {RefinedResponse} from "k6/http";
import {Option, isSome, fromNullable, none, chain, match} from "fp-ts/Option";
import {ChannelDetails, get, getPlatformConfig, post, runWithToken} from "./util/utilities";
const queries = require("./util/queries");
import {generateRandomDeviceID, getRandomChannel, validateSkipCheck} from "./util/utilities";
import { pipe } from 'fp-ts/function'
import {StateUpdateResponse} from "./domain/Player";
import {Config} from "./domain/Config";
import {Token, TokenInfo} from "./domain/Auth";
import {getCloseSessionPayload, PMTExitv5} from "./util/queries";

export function mixerSkipTest() {

    let maybeToken: Option<Token> = none;
    let initResponse: Option<StateUpdateResponse> = none
    let channelDetails: Option<ChannelDetails> = none
    let videoId: Option<string | number> = none

    const config: Config = getPlatformConfig();
    const deviceId: string = generateRandomDeviceID();
    const appPlatform: string = "x1";
    const appVersion: string = "5.0.71";
    const playerType: string = "mixer";
    const clientSecret: string = "hyperion";

    group("01_Client_Guest_Login", function() {
        maybeToken = post<Token>(
            {
                route: "/iam/oauth2/token",
                payload: queries.getClientGuestPayload(
                    config.apiConfig.clientId,
                    clientSecret,
                    deviceId
                ),
                validStatusCode: 201
            }
        );
    });

    group("02_Get_User_Token_Info", function() {
        runWithToken(
            maybeToken,
            (token: string) => {
                return get<TokenInfo>(
                    {
                        route: "/iam/oauth2/tokeninfo",
                        token: token,
                        validStatusCode: 200
                    }
                )
            }
        )
    });

    group("03_Init_Session", function() {
        runWithToken(
            maybeToken,
            (token: string) => {
                initResponse = post<StateUpdateResponse>(
                    {
                        route: "/api/player/init",
                        payload: queries.getInitSessionPayload(
                            config.apiConfig.ownerKey,
                            deviceId,
                            appPlatform,
                            appVersion
                        ),
                        token: token,
                        headers: {
                            'content-type': "application/json"
                        },
                        validStatusCode: 200
                }
                )
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
                "Channel details are returned": (details: Option<ChannelDetails>) => {
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
            maybeToken,
            (token: string) => {
                const filters: Array<number> = [1745844053, 1080229685, 812932015]
                const startResponse: Option<StateUpdateResponse> = post<StateUpdateResponse>(
                    {
                        route: "/api/player/start",
                        payload: queries.getMixerPlayerStartPayload(
                            config.apiConfig.ownerKey,
                            deviceId,
                            appPlatform,
                            appVersion,
                            playerType,
                            filters
                        ),
                        token: token,
                        headers: {
                            'content-type': "application/json"
                        },
                        validStatusCode: 200
                    }
                )

                pipe(
                    startResponse,
                    match(
                        () => fail("Didnt parse start response"),
                        (response: StateUpdateResponse) => {
                            videoId = fromNullable(response.currentVideo?.id)
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
                )
            }
        )
    });

    group("06_Skip_Video", function() {
        runWithToken(
            maybeToken,
            (token: string) => {
                const validateSkip = (res: RefinedResponse<'text'>) => {
                    return validateSkipCheck(res, true);
                }

                post<StateUpdateResponse>(
                    {
                        route: "/api/player/next",
                        payload: queries.getSkipVideoPayload(
                            config.apiConfig.ownerKey,
                            deviceId,
                            appPlatform,
                            appVersion,
                            "skip"
                        ),
                        token: token,
                        headers: {
                            'content-type': "application/json"
                        },
                        validStatusCode: 200,
                        prechecks: Array.of(validateSkip)
                    }
                )
            }
        )
    });

    group("07_Close_Session", function () {
        runWithToken(
            maybeToken,
            (token: string) => {
                post<object>(
                    {
                        route: "/api/player/close",
                        payload: getCloseSessionPayload(
                            config.apiConfig.ownerKey,
                            deviceId,
                            config.appConfig.platform,
                            "5.0.0"
                        ),
                        token: token,
                        headers: {
                            'content-type': "application/json"
                        },
                        validStatusCode: 200
                    }
                )
                const now: number = Date.now()
                post<object>(
                    {
                        route: "/report",
                        payload: PMTExitv5("xite", config.apiConfig.ownerKey, Date.now(), `${now}-device`, deviceId),
                        token: token,
                        headers: {
                            'content-type': "application/json"
                        },
                        validStatusCode: 200
                    }
                )
            }
        )
    })
}
