export function formatTime(dataStr: string) {
    var time = new Date(dataStr);
    return formatDateTime(time)
}

export function formatDateTime(time: Date) {
    function timeAdd(str: number | string) {
        if (str < 10) {
            str = '0' + str;
        }
        return str
    }
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + timeAdd(m) + '-' + timeAdd(d) + ' ' + timeAdd(h) + ':' + timeAdd(mm) + ':' + timeAdd(s);
}