import {fail, group} from "k6";
import {RefinedResponse} from "k6/http";
import {Config} from "./domain/Config";
import {
    ChannelDetails, generateRandomDeviceID,
    get,
    getPlatformConfig,
    getRandomChannel,
    post,
    runWithToken,
    validateSkipCheck
} from "./util/utilities";
import {
    getChannelPlayerStartPayload,
    getClientGuestPayload,
    getInitSessionPayload,
    getSkipVideoPayload
} from "./util/queries"
import {Token} from "./domain/Auth";
import {fromNullable, match, none, Option} from "fp-ts/Option";
import {StateUpdateResponse} from "./domain/Player";
import {pipe} from "fp-ts/function";

export function channelSkip() {

    const config: Config = getPlatformConfig();

    let maybeToken: Option<Token> = none;
    let maybeInit: Option<StateUpdateResponse> = none
    let maybeChannelDetails: Option<ChannelDetails> = none
    // @ts-ignore
    let maybeVideoId: Option<number | string> = none

    const deviceId = generateRandomDeviceID();
    const appPlatform = "x1";
    const appVersion = "5.0.71";
    const playerType = "channel";
    const clientSecret = "hyperion";

    group("01_Client_Guest_Login", function() {
        maybeToken = post<Token>(
            {
                route: "/iam/oauth2/token",
                payload: getClientGuestPayload(
                    config.apiConfig.clientId,
                    clientSecret,
                    deviceId
                ),
                validStatusCode: 201
            }

        )
    });

    group("02_Get_User_Token_Info", function() {
        runWithToken(maybeToken,
            (token: string) => {
                get<object>(
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
                maybeInit = post<StateUpdateResponse>(
                    {
                        route: "/api/player/init",
                        payload: getInitSessionPayload(
                            config.apiConfig.ownerKey,
                            deviceId,
                            appPlatform,
                            appVersion
                        ),
                        token: token,
                        headers: {
                            "content-type": "application/json"
                        },
                        validStatusCode: 200
                    }
                )
            }
        )
    });

    group("05_Get_Random_Channel_From_Session", function() {
        pipe(
            maybeInit,
            match(
                () => fail("No init response"),
                (response: StateUpdateResponse) => {
                    maybeChannelDetails = getRandomChannel(response)
                }
            )
        )
    });

    group("06_Start_Channel_Player", function() {
        pipe(
            maybeChannelDetails,
            match(
                () => fail("No Channel found to start"),
                (channelDetails: ChannelDetails) => {
                    pipe(
                        runWithToken(
                            maybeToken,
                            (token: string) => {
                                return post<StateUpdateResponse>(
                                    {
                                        route: "/api/player/start",
                                        payload: getChannelPlayerStartPayload(
                                            config.apiConfig.ownerKey,
                                            deviceId,
                                            appPlatform,
                                            appVersion,
                                            channelDetails.channelid,
                                            playerType,
                                            channelDetails.categoryname
                                        ),
                                        token: token,
                                        headers: {
                                            "content-type": "application/json"
                                        },
                                        validStatusCode: 200
                                    }
                                )
                            }
                        ),
                        match(
                            () => fail("No start response parsed"),
                            (response: StateUpdateResponse) => {
                                maybeVideoId = fromNullable(response.currentVideo?.id)
                            }
                        )
                    )
                }
            )
        )
    });

    group("07_Skip_Video", function() {
        const validateSkip = (res: RefinedResponse<'text'>) => {
            return validateSkipCheck(res, true)
        }
        runWithToken(
            maybeToken,
            (token: string) => {
                post<StateUpdateResponse>(
                    {
                        route: "/api/player/next",
                        payload: getSkipVideoPayload(
                            config.apiConfig.ownerKey,
                            deviceId,
                            appPlatform,
                            appVersion,
                            "skip"
                        ),
                        token: token,
                        headers: {
                            "content-type": "application/json"
                        },
                        validStatusCode: 200,
                        prechecks: Array.of(validateSkip)
                    }
                )
            }
        )
    });
}
