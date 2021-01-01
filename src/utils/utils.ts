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

export function time_arr(type: string) {
    if (type.indexOf("us-s") != -1) {
        //生成美股时间段 夏令时
        var timeArr = new Array();
        timeArr.push("21:30");
        return getNextTime("21:30", "04:00", 1, timeArr);
    }
    if (type.indexOf("us-w") != -1) {
        //生成美股时间段
        var timeArr = new Array();
        timeArr.push("22:30");
        return getNextTime("22:30", "05:00", 1, timeArr);
    }
    if (type.indexOf("hs") != -1) {
        //生成沪深时间段
        var timeArr = new Array();
        timeArr.push("09:30");
        timeArr.concat(getNextTime("09:30", "11:30", 1, timeArr));
        timeArr.concat(getNextTime("13:00", "15:00", 1, timeArr));
        return timeArr;
    }
    if (type.indexOf("hk") != -1) {
        //生成港股时间段
        var timeArr = new Array();
        timeArr.push("09:30");
        timeArr.concat(getNextTime("09:30", "12:00", 1, timeArr));
        timeArr.concat(getNextTime("13:00", "16:00", 1, timeArr));
        return timeArr;
    }
}

function getNextTime(startTime: string, endTIme: string, offset: number, resultArr: string[]): string[] {
    var result = addTimeStr(startTime, offset);
    resultArr.push(result);
    if (result == endTIme) {
        return resultArr;
    } else {
        return getNextTime(result, endTIme, offset, resultArr);
    }
}

function addTimeStr(time: string, num: number) {
    let hour = time.split(":")[0];
    let mins: any = Number(time.split(":")[1]);
    let mins_un = parseInt('' + (mins + num) / 60);
    let hour_un = parseInt('' + (Number(hour) + mins_un) / 24);
    if (mins_un > 0) {
        if (hour_un > 0) {
            let tmpVal = ((Number(hour) + mins_un) % 24) + "";
            hour = tmpVal.length > 1 ? tmpVal : "0" + tmpVal; //判断是否是一位
        } else {
            let tmpVal = Number(hour) + mins_un + "";
            hour = tmpVal.length > 1 ? tmpVal : "0" + tmpVal;
        }
        let tmpMinsVal = ((mins + num) % 60) + "";
        mins = tmpMinsVal.length > 1 ? tmpMinsVal : 0 + tmpMinsVal; //分钟数为 取余60的数
    } else {
        let tmpMinsVal = mins + num + "";
        mins = tmpMinsVal.length > 1 ? tmpMinsVal : "0" + tmpMinsVal; //不大于整除60
    }
    return hour + ":" + mins;
}