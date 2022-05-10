import {chain as flatMapOption, fromNullable, match, none, Option} from "fp-ts/Option";
import {Token} from "./domain/Auth";
import {Config} from "./domain/Config";
import {
    generateRandomDeviceID,
    getPlatformConfig,
    getRandomIntInclusive,
    post,
    runWithToken,
    validateSkipCheck
} from "./util/utilities";
import {fail, group} from "k6";
import {getClientGuestPayload, getCloseSessionPayload, getLikeVideoPayload, PMTExitv5} from "./util/queries";
import {appSkip, playerSearch, playerStartSearch} from "./util/actions";
import {SearchResponse, StateUpdateResponse} from "./domain/Player";
import {pipe} from "fp-ts/function";
import {RefinedResponse} from "k6/http";

export const options = {
    thresholds: {
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        http_req_duration: ['p(95)<250'], // 95% of requests should be below 200ms
    },
};

export function searchTest() {
    let maybeToken: Option<Token> = none;
    let searchResponse: Option<SearchResponse> = none;
    let playerResponse: Option<StateUpdateResponse> = none;

    const clientSecret: string = "hyperion";
    const searchTerms: string[] = [
        "love","drunk","girl","peace","voice",
        "where","you","baby","akon","shakira",
        "backstreet","metallica","jonas",
        "kill this love","back in black"
]
    const config: Config = getPlatformConfig();
    const deviceId: string = generateRandomDeviceID();
    const appVersion: string = "5.0.71";

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
        );
    });

    group("02_Search_Random_Term", function () {
        const term: string = searchTerms[getRandomIntInclusive(0, searchTerms.length-1)]
        searchResponse = runWithToken(
            maybeToken,
            (token: string) => {
                return playerSearch(
                    appVersion,
                    deviceId,
                    10,
                    0,
                    config.apiConfig.ownerKey,
                    term,
                    token
                )
            }
        )
    });

    group("03_Play_Random_Search_Result", function(){
        pipe(
            searchResponse,
            flatMapOption(
                (response: SearchResponse) => {
                    const videoIndex: number = getRandomIntInclusive(0, response.videoItems.length-1)
                    return runWithToken(
                        maybeToken,
                        (token: string) => {
                            return playerStartSearch(
                                appVersion,
                                deviceId,
                                config.apiConfig.ownerKey,
                                config.apiConfig.clientId,
                                videoIndex,
                                token
                            )
                        }
                    )
                }
            )
        )
    });

    group("04_Skip_Video", function(){
        runWithToken(
            maybeToken,
            (token: string) => {
                const validateSkip = (res: RefinedResponse<'text'>) => {
                    return validateSkipCheck(res, true)
                }
                playerResponse = appSkip(
                    config.apiConfig.ownerKey,
                    deviceId,
                    config.apiConfig.clientId,
                    appVersion,
                    token,
                    Array.of(validateSkip)
                )
            }
        )
    });


    group("05_Like_Video", function() {
        runWithToken(
            maybeToken,
            (token: string) => {
                pipe(
                    playerResponse,
                    flatMapOption((response: StateUpdateResponse) => fromNullable(response.currentVideo?.id)),
                    match(
                        () => fail("No videoId found to like"),
                        (videoId: string | number) => {
                            post<object>(
                                {
                                    route: "/api/player/feedback",
                                    payload: getLikeVideoPayload(
                                        config.apiConfig.ownerKey,
                                        deviceId,
                                        config.apiConfig.clientId,
                                        videoId,
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
                )
            }
        )
    });

    group("06_Close_Session", function () {
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
    });
}