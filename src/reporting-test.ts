import { group } from "k6";
import { InitConfigParams, InitReportingParams } from 'xite-reporting-sdk/dist/types/types';
import * as reportingSdk from 'xite-reporting-sdk';
import { accountReport, adBeaconReport, AccountMessage }  from 'xite-reporting-sdk';
import * as reportingService from 'xite-reporting-sdk';
import {AdBeaconsMessage, AccountRole} from "xite-reporting-sdk";

class InitConf implements InitConfigParams {
    batchSize: number;
    batchTimeout: number;

    reportingUrl: string;

    constructor(batchSize: number, batchTimeout: number, reportingUrl: string ) {
        this.batchSize = batchSize
        this.batchTimeout = batchTimeout
        this.reportingUrl = reportingUrl
    }

    headers(): { [p: string]: string | number } {
        return {};
    }
}

class InitReport implements InitReportingParams {
    appVersion: string;
    buildVersion: string;
    deviceId: string;
    deviceModel: string;
    deviceModelName: string;
    deviceName: string;
    deviceResolution: string;
    deviceSoftwareVersion: string;
    experimentGroup: string | undefined;
    experimentId: string | undefined;
    launchId: number;
    ownerKey: string;
    platform: string;

    constructor(
          appVersion: string
        , buildVersion: string
        , deviceId: string
        , deviceModel: string
        , deviceModelName: string
        , deviceName: string
        , deviceResolution: string
        , deviceSoftwareVersion: string
        , experimentGroup: string | undefined
        , experimentId: string | undefined
        , launchId: number
        , ownerKey: string
        , platform: string) {
        this.appVersion = appVersion
        this.buildVersion = buildVersion
        this.deviceId = deviceId
        this.deviceModel = deviceModel
        this.deviceModelName = deviceModelName
        this.deviceName = deviceName
        this.deviceResolution = deviceResolution
        this.deviceSoftwareVersion = deviceSoftwareVersion
        this.experimentGroup = experimentGroup
        this.experimentId = experimentId
        this.launchId = launchId
        this.ownerKey = ownerKey
        this.platform = platform
    }
}

export function setup() {
    const initConfigParams = new InitConf(
        0,
        0,
        ""
    );

    const initReportingParams = new InitReport(
        "5.0.0",
        "0.1",
        "device-1",
        "Samsung",
        "SamsungTV Plus",
        "SamsungTV Plus",
        "1024x1000",
        "0.1.2",
        undefined,
        undefined,
        5,
        "comcast-us",
        "xite"
    );
    reportingSdk.init(initConfigParams, initReportingParams);
}

export default function() {
    function handleProfileChange() {
        accountReport.reportAccountAction<accountReport.ChangeProfileType>(AccountMessage.changeProfile, {
            isSuccessful: true,
            role: AccountRole.guest
        });
    }

    group("01_Change_Profile_Free_Guest", function (){
        handleProfileChange()
    })

    group("02_Ad_Beacon_Success", function() {
        let complete = "complete" as const
        let beaconSuccess = {
            beaconType: complete,
            beaconUrl: 'https://s.xite.com/beacons/complete/eyJ0eXAiOiJKV1QiLCJhbGciOiJITUQ1In0.eyJpc3MiOiJhcnRlbWlzIiwiZXhwIjoxNjMzMDg5NjE5LCJpYXQiOjE2MzMwODc4MTksImV2ZW50IjoiY29tcGxldGUiLCJhY2NvdW50SWQiOiIzMTZlZWEzMi1hY2Y0LTRlNTMtYjM4OC0wZjIzMWM1ZjU1NzgiLCJwcm9maWxlSWQiOiI1ZmYyNTcyOGE2NmFjZTE5N2I1MjRkN2YiLCJkZXZpY2VJZCI6ImM4MmE0N2IwLTY5YzItNWZkZC1hZTdjLTRhYTQyYjE0MTA5YSIsImRldmljZVNlc3Npb25JZCI6IjE5ODIxMTIxOTkzMjY1Mzc4NCIsIm93bmVyS2V5IjoidmV2b3Jva3UtdXMiLCJhZElkIjoiNTcyNDEwOTAifQ.x3KtiDUGXRKLZOD2lcU_SQ',
            adUrl: 'https://a.xite.com/N8D1UFWDAXGQYHYY5EKABVG0UUSRLDRQ.mp4',
            adsCorrelationId: 0,
            adId: '57241090',
            adTitle: 'Geico Ad',
            adDuration: 1000,
            adBreakId: 198211220022143889,
            searchQuery: 'Query'
        }
        adBeaconReport.reportAdBeacon<adBeaconReport.BeaconCallSuccessfulType>(AdBeaconsMessage.beaconCallSuccessful, beaconSuccess, false)
    })

}

export function teardown() {
    reportingService.destroy();
}