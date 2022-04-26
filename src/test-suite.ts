import {Options} from "k6/options";
import {mixerSkip} from "./mixerSkip";

export let options: Options = {
    scenarios: {
        SkipMixer: {
            executor: "constant-vus",
            exec: "TC_mixerSkip",
            vus: 1,
            duration: "5s"
        }
    }
}

export function TC_mixerSkip() {
    mixerSkip();
}

export default function main() {
    // channelSkip.channelSkip();
    // mixerLike.mixerLike();
    mixerSkip();
    // reporting({})
}