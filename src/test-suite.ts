import {Options} from "k6/options";
import {mixerSkip} from "./mixerSkip";
import {mixerLike} from "./mixerLike";

export let options: Options = {
    scenarios: {
        SkipMixer: {
            executor: "constant-vus",
            exec: "TC_mixerSkip",
            vus: 1,
            duration: "5s"
        },
        LikeMixer: {
            executor: "constant-vus",
            exec: "TC_mixerLike",
            vus: 1,
            duration: "5s"
        }
    }
}

export function TC_mixerSkip() {
    mixerSkip();
}

export function TC_mixerLike() {
    mixerLike();
}

export default function main() {
    // channelSkip.channelSkip();
    mixerSkip();
    mixerLike();
    // reporting({})
}