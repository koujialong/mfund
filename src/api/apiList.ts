import { get, post } from './http'

export function searchFund(fundCode: string) {
    return get(`/FundSearch/api/FundSearchAPI.ashx`,
        {
            key: fundCode,
            m: 9,
            _: new Date().getTime()
        }
    )
}

export function getFundData(fundCode: string) {
    return get(`/js/${fundCode}.js?rt=1463558676006`)
}

export function getMarketChart() {
    return get(`http://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=500&po=1&np=1&fields=f12,f13,f14,f62&fid=f62&fs=m:90+t:2&_=${new Date().getTime()}`)
}