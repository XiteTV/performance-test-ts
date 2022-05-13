import { group } from "k6";
import { InitConfigParams, InitReportingParams } from 'xite-reporting-sdk/dist/types/types';
import * as reportingSdk from 'xite-reporting-sdk';
import {accountReport, adBeaconReport, AccountMessage} from 'xite-reporting-sdk';
import * as reportingService from 'xite-reporting-sdk';
import {AdBeaconsMessage, AccountRole} from "xite-reporting-sdk";

export function setup() {
    const initConfigParams: InitConfigParams = {
        batchSize: 0,
        batchTimeout: 0,
        reportingUrl: "",
        headers: () => {
            return {}
        }
    }

    const initReportingParams: InitReportingParams = {

        appVersion: "5.0.0",
        deviceSoftwareVersion: "0.1",
        deviceId: "device-1",
        deviceName: "Samsung",
        deviceModel: "SamsungTV Plus",
        deviceModelName: "SamsungTV Plus",
        deviceResolution: "1024x1000",
        buildVersion: "0.1.2",
        launchId: 5,
        ownerKey: "comcast-us",
        platform: "xite",
        experimentGroup: undefined,
        experimentId: undefined
    };
    reportingSdk.init(initConfigParams, initReportingParams);
}

export default function() {
    function handleProfileChange(): Promise<void> {
        return accountReport.reportAccountAction<accountReport.ChangeProfileType>(AccountMessage.changeProfile, {
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