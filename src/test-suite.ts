import {Options} from "k6/options";
import {mixerSkipTest} from "./mixer-skip-test";
import {mixerLikeTest} from "./mixer-like-test";
import {channelSkipTest} from "./channel-skip-test";
import {searchTest} from "./search-test";
// import reportingTest from "./reporting-test";

export let options: Options = {
    scenarios: {
        SkipMixer: {
            executor: "ramping-vus",
            exec: "TC_mixerSkip",
            startVUs: 1,
            stages: [
                { duration: '20s', target: 5 },
                { duration: '20s', target: 10 },
                { duration: '10s', target: 15 },
                { duration: '10s', target: 5 },
            ],
            gracefulRampDown: '10s'
        },
        LikeMixer: {
            executor: "ramping-arrival-rate",
            exec: "TC_mixerLike",
            startRate: 300,
            timeUnit: '1m',
            preAllocatedVUs: 2,
            maxVUs: 15,
            stages: [
                { target: 300, duration: '1m' },
                { target: 600, duration: '1m' },
                { target: 800, duration: '1m' }
            ]
        },
        ChannelSkip: {
            executor: "constant-arrival-rate",
            exec: "TC_channelSkip",
            duration: '30s',
            timeUnit: '1s',
            rate: 30,
            preAllocatedVUs: 2,
            maxVUs: 15,
        },
        Search: {
            executor: 'per-vu-iterations',
            exec: "TC_search",
            vus: 10,
            iterations: 20,
            maxDuration: '60s'
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
    mixerSkipTest();
}

export function TC_mixerLike() {
    mixerLikeTest();
}

export function TC_channelSkip() {
    channelSkipTest();
}

export function TC_search() {
    searchTest();
}

// export function TC_reporting() {
//     reportingTest()
// }

export default function main() {
    channelSkipTest();
    mixerSkipTest();
    mixerLikeTest();
    searchTest();
    // reportingTest();
}