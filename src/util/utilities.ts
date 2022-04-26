import {check} from "k6";
import {RefinedResponse} from "k6/http";
import {chain as flatMapOption, fromNullable as toOption, map, match, Option} from "fp-ts/Option";
import {chain as flatMapArray, filter, map as mapArray} from "fp-ts/Array";
import {pipe} from 'fp-ts/function'
import {Predicate} from "fp-ts/Predicate";
import {ChannelCategory, ChannelInfo, FilterCategory, FilterInfo, StateUpdateResponse} from "../domain/Player";

export function getRandomIntInclusive(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
export interface Channel {
    categoryname: string;
    channelid: number;
}

function toArray<T>(value: T | undefined): Array<T> {
    if(value != undefined) {
        return Array.of(value);
    } else return Array.of();
}

export function getRandomChannel(response: StateUpdateResponse): Option<Channel> {
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
                            map( (channel: ChannelInfo) => {
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

export function defaultgetResponseCheck(response: RefinedResponse<'text'>): boolean {
    return check(response, {
        "status is 200": (r) => r.status === 200 && r.body != null,
    });
}

export function defaultpostResponseCheck(response: RefinedResponse<'text'>): boolean {
    return check(response, {
        "status is 201": (r) => r.body != null && r.status === 201,
});
}

export function validateSkipCheck(response: RefinedResponse<'text'>, status: boolean): boolean {
    return check(response, {
        "Skip is Allowed": (r) => r.json("limitations.skip.isAllowed") == status,
});
}
