## Prerequisites

- [k6](https://k6.io/docs/getting-started/installation)
- [NodeJS](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/getting-started/install) (optional)

## Installation

**Install dependencies**

Clone the generated repository on your local machine, move to the project root folder and install the dependencies defined in [`package.json`](./package.json)

```bash
$ yarn install
```

## Running the test

To run a test written in TypeScript, we first have to transpile the TypeScript code into JavaScript and bundle the project

```bash
$ yarn webpack
```

Also make sure to set the following Environment variables in `test-suite.ts`
- K6_STATSD_ADDR: Is used for our generating our prometheus metrics from the STATSD metrics in the project
- BASE_URL: The base endpoint for the cluster you are testing
- CONFIG_URL: The configuration used for running these tests

This command creates the final test files to the `./dist` folder.

Once that is done, we can run our script the same way we usually do, for instance:

```bash
$ k6 run --out json=results/out.json --summary-export=results/summary.json --out csv=results/out.csv --out statsd ./dist/test-suite.js
```

## Writing own tests

House rules for writing tests:
- The test code is located in `src` folder
- New interfaces and frequently used classes is located in `src/domain` folder
- New utility functions are located in `src/util` folder. Split between actions (common API calls or flows like authenticate user), queries (json payloads) and utilities (for misc. shared logic)
- If static files are required then add them to `./assets` folder. Its content gets copied to the destination folder (`dist`) along with compiled scripts.

Creating a new test suite:
For naming convention use kebab-case where possible and suffix the test name with test, for example: `cool-new-feature-test.ts`

most tests will look something like this
```typescript
export function coolNewFeatureTest() {
    // fetch a config to use for scenario
    const config: Config = getPlatformConfig();

    // groups are units of tests
    group("01_Do-A-Cool-Thing", function() {
        // test logic in here
    })

    group("02_Do-A-Even-Cooler-Thing", function() {
        // test logic in here
    })
}
```

with a reference in the entrypoint file `src/test-suite.ts`
```typescript
    import {coolNewFeatureTest} from "./cool-new-feature-test.ts";

    export let options: Options = {
        scenarios: {
            //...
            SkipMixer: { // Name of your scenario (doesn't need to match filename)
                executor: "ramping-vus", // type of scenario see https://k6.io/docs/using-k6/scenarios/ for different scenarios you can use
                exec: "TC_coolNewFeatureTest", // target function
                startVUs: 1,
                stages: [
                    { duration: '20s', target: 5 },
                    { duration: '20s', target: 10 },
                    { duration: '10s', target: 15 },
                    { duration: '10s', target: 5 },
                ],
                gracefulRampDown: '10s'
            }
        }
    }

export function TC_coolNewFeatureTest() {
    coolNewFeatureTest();
}

export default function main() {
    //..
    coolNewFeatureTest();
}
```

### Transpiling and Bundling

By default, k6 can only run ES5.1 JavaScript code. To use TypeScript, we have to set up a bundler that converts TypeScript to JavaScript code. 

This project uses `Babel` and `Webpack` to bundle the different files - using the configuration of the [`webpack.config.js`](./webpack.config.js) file.

If you want to learn more, check out [Bundling node modules in k6](https://k6.io/docs/using-k6/modules#bundling-node-modules).
