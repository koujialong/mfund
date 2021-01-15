
let timer: any;
import bus from '@/utils/bus'
export enum TIMER {
    SECCB = 'SECCB',
    SECCB10 = 'SECCB10',
    SECCB30 = 'SECCB30'
}

let isOpen = checkIsOpen()

export function startTimer() {
    timer && clearInterval();
    let count = 0
    timer = setInterval(() => {
        if (isOpen()) {
            bus.$emit(TIMER.SECCB)
            count % 10 || bus.$emit(TIMER.SECCB10)
            count % 30 || bus.$emit(TIMER.SECCB30)
            count += 1;
        }
    }, 1000);
}

/**
 * 判断当前是否开盘
 * @returns
 */
export function checkIsOpen() {
    let now = new Date();
    let nowTime = now.getTime();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let startStr = year + "/" + month + "/" + date + " " + "9:30:00";
    let startTime = Date.parse(startStr);
    return function (this: any) {
        let now = new Date();
        let nowTime = now.getTime();
        return nowTime >= startTime && hour < 15;
    };
}