import {check, fail} from "k6";
import http, {RefinedResponse, StructuredRequestBody} from "k6/http";
import {
    chain as flatMapOption, fromEither,
    fromNullable,
    fromNullable as toOption,
    map as mapOption,
    match,
    Option
} from "fp-ts/Option";
import {chain as flatMapArray, filter, map as mapArray} from "fp-ts/Array";
import {pipe} from 'fp-ts/function'
import {Predicate} from "fp-ts/Predicate";
import {ChannelCategory, ChannelInfo, FilterCategory, FilterInfo, StateUpdateResponse} from "../domain/Player";
import {Config} from "../domain/Config";
import {Token} from "../domain/Auth";
import {tryCatch} from 'fp-ts/Either'

export interface ChannelDetails {
    categoryname: string;
    channelid: number;
}

export function getRandomIntInclusive(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function toArray<T>(value: T | undefined): Array<T> {
    if(value != undefined) {
        return Array.of(value);
    } else return Array.of();
}

export function getRandomChannel(response: StateUpdateResponse): Option<ChannelDetails> {
    let categories: Option<Array<ChannelCategory>> = toOption(response.channelCategories)

    return pipe(
        categories,
        flatMapOption( (arr: Array<ChannelCategory>) => {
            let max_category = arr.length - 1;
            let category_index = getRandomIntInclusive(0, max_category);

            return pipe(
                toOption(arr[category_index]),
                flatMapOption( (category: ChannelCategory) => {
                        let max_channel = category.channels.length
                        let channel_index = getRandomIntInclusive(0, max_channel);

                        return pipe(
                            toOption(category.channels[channel_index]),
                            mapOption( (channel: ChannelInfo) => {
                                    return {
                                        categoryname: category.name,
                                        channelid: channel.id,
                                    };
                                }
                            )
                        )
                    }
                )
            )
            }
        )
    )
}

export function getRandomMixerFilters(response: StateUpdateResponse): Array<number> {
    const isValid: Predicate<FilterCategory> = (category: FilterCategory) => {
        return category.name == "Genre" || category.name == "Decade" || category.name == "Style";
    }
    return pipe(
        toOption(response.filterCategories),
        match( () => [0, 0, 0],
            (arr: Array<FilterCategory>) => {
                return pipe(
                    arr,
                    filter(isValid),
                    flatMapArray(
                        (category: FilterCategory) => {
                            let max_filters: number = arr.length - 1
                            let random_index: number = getRandomIntInclusive(0, max_filters);

                            return pipe(
                                toArray(category.filters[random_index]),
                                mapArray(
                                    (random: FilterInfo) => random.id
                                )
                            )
                        }
                    )
                );

            }
        )
    )
}

export function generateRandomDeviceID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
    v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
});
}

export function checkResponseOk(response: RefinedResponse<'text'>, validStatus: number): boolean {
    return check(response, {
        "status is valid" : (r) => r.body != null && r.status === validStatus,
    });
}

export function validateSkipCheck(response: RefinedResponse<'text'>, status: boolean): boolean {
    return check(response, {
        "Skip is Allowed": (r) => r.json("limitations.skip.isAllowed") == status,
});
}

export function getPlatformConfig(): Config {
    const configReponse: RefinedResponse<'text'> = http.get(`https://${__ENV.CONFIG_URL}/config.json`);
    return JSON.parse(configReponse.body);
}

export function runWithToken<R>(token: Option<Token>, f: (t: string) => R): R | never {
    return pipe(
        token,
        mapOption(
            (t: Token) => t.access_token
        ),
        match(
            () => fail("No Auth token, unable to run test"),
            f
        )
    )
}

const defaultHeaders = {
    "accept": "*/*",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en",
};

export function post<T>(
    args: {
          route: string
        , payload: string | StructuredRequestBody
        , token?: string
        , headers?: object
        , validStatusCode?: number
        , prechecks?: Array<(r: RefinedResponse<'text'>) => boolean>
    }
): Option<T> {
    const params = pipe(
        fromNullable(args.token),
        match(
            () => {
                return {
                    headers: {
                        ...defaultHeaders,
                        ...args.headers
                    },
                }
            },
            (t: string) => {
                return {
                    headers: {
                        ...defaultHeaders,
                        authorization: "Bearer " + t,
                        ...args.headers
                    },
                }
            }
        )
    )

    const response: RefinedResponse<'text'> = http.post(
        `https://${__ENV.BASE_URL}${args.route}`,
        args.payload,
        params
    );

    pipe(
        fromNullable(args.validStatusCode),
        match(
            () => console.log("Not validating status code"),
            (code: number) => checkResponseOk(response, code)
        )
    )

    pipe(
        fromNullable(args.prechecks),
        match(
            () => console.log("No prechecks to run"),
            (arr: Array<(r: RefinedResponse<'text'>) => boolean>) => {
                pipe(
                    arr,
                    mapArray(
                        (predicate: (r: RefinedResponse<'text'>) => boolean) => predicate(response)
                    )
                )
            }
        )
    )


    return fromEither(
        tryCatch(
            () => JSON.parse(response.body),
            (e) => console.error("Error on parsing response", e, response.body)
        )
    );
}

export function get<T>(route: string, token?: string, validStatusCode?: number): T {
    const url = `https://${__ENV.BASE_URL}${route}`;

    const params = pipe(
        fromNullable(token),
        match(
            () => {
                return {
                    headers: {
                        ...defaultHeaders
                    }
                }
            },
            (t: string) => {
                return {
                    headers: {
                        ...defaultHeaders,
                        authorization: "Bearer " + t,
                    }
                }
            }
        )
    )

    const response: RefinedResponse<'text'> = http.get(url, params);

    pipe(
        fromNullable(validStatusCode),
        match(
            () => console.log("Not validating status code"),
            (code: number) => checkResponseOk(response, code)
        )
    )

    return JSON.parse(response.body);
}
