import {Options} from "k6/options";
import {mixerSkip} from "./mixerSkip";
import {mixerLike} from "./mixerLike";
import {channelSkip} from "./channelSkip";
import {search} from "./search";
// import reportingTest from "./reporting-test";

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
        },
        ChannelSkip: {
            executor: "constant-vus",
            exec: "TC_channelSkip",
            vus: 1,
            duration: "5s"
        },
        Search: {
            executor: "constant-vus",
            exec: "TC_search",
            vus: 1,
            duration: "5s"
        }
        // Reporting: {
        //     executor: "constant-vus",
        //     exec: "TC_reporting",
        //     vus: 1,
        //     duration: "5s"
        // }
    }
}

export function TC_mixerSkip() {
    mixerSkip();
}

export function TC_mixerLike() {
    mixerLike();
}

export function TC_channelSkip() {
    channelSkip();
}

export function TC_search() {
    search();
}

// export function TC_reporting() {
//     reportingTest()
// }

export default function main() {
    channelSkip();
    mixerSkip();
    mixerLike();
    // reportingTest();
}