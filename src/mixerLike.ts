import {group, fail} from "k6";
import {Config} from "./domain/Config";
import {
    generateRandomDeviceID, get,
    getPlatformConfig,
    getRandomMixerFilters, post, postForget,
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

    let maybeToken: Option<Token> = none;
    let filters: Array<number>= [];
    let videoId: Option<string | number> = none;

    group("01_Client_Guest_Login", function() {

        maybeToken = some(post<Token>(
            {
                route: "/iam/oauth2/token",
                payload: queries.getClientGuestPayload(
                    config.apiConfig.clientId,
                    clientSecret,
                    deviceId
                ),
                validStatusCode: 201
            }
        ));
    });

    group("02_Get_User_Token_Info", function() {
        runWithToken(
            maybeToken,
            (token: string) => {
                get<object>("/iam/oauth2/tokeninfo", token);
            }
        )
    });

    group("03_Init_Session", function() {
        runWithToken(
            maybeToken,
            (token: string) => {
                const init: StateUpdateResponse = post<StateUpdateResponse>(
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
                            "content-type": "application/json"
                        },
                        validStatusCode: 200
                    }
                )
                filters = getRandomMixerFilters(init);
            }
        )
    });

    group("04_Start_Mixer_Player", function() {
        runWithToken(
            maybeToken,
            (token: string) => {
                const start: StateUpdateResponse = post<StateUpdateResponse>(
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
                            "content-type": "application/json"
                        },
                        validStatusCode: 200
                    }
                )
                videoId = fromNullable(start.currentVideo?.id);
            }
        )
    });

    group("05_Like_Video", function() {
        runWithToken(
            maybeToken,
            (token: string) => {
                pipe(
                    videoId,
                    match(
                        () => fail("No videoId found to like"),
                        (id: string | number) => {
                            postForget(
                                "/api/player/feedback",
                                queries.getLikeVideoPayload(
                                    config.apiConfig.ownerKey,
                                    deviceId,
                                    appPlatform,
                                    id,
                                    appVersion
                                ),
                                token,
                                {
                                    "content-type": "application/json"
                                },
                                200
                            )
                        }
                    )
                )
            }
        )
    });
}
