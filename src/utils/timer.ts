
let timer: NodeJS.Timeout;
import bus from '@/utils/bus'
export enum TIMER {
    SECCB = 'SECCB',
    SECCB10 = 'SECCB10',
    SECCB30 = 'SECCB30'
}
export function startTimer() {
    timer && clearInterval();
    let count = 0
    timer = setInterval(() => {
        bus.$emit(TIMER.SECCB)
        count % 10 || bus.$emit(TIMER.SECCB10)
        count % 30 || bus.$emit(TIMER.SECCB30)
        count += 1;
    }, 1000);
}