import { get, post, baseType } from './http'

export function searchFund(fundCode: string) {
    return get(`/FundSearch/api/FundSearchAPI.ashx`, {
        type: baseType.SEARCH,
        params: {
            key: fundCode,
            m: 1
        }
    })
}

export function getFundData(fundCode: string) {
    return get(`/js/${fundCode}.js?rt=1463558676006`)
}