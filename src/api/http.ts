import axios, { AxiosInstance } from "axios"; // 引用axios
import config from "@/api/config";
import { getCurrentInstance } from "vue";
import { baseBean } from "@/bean/baseBean";

const instanceBase: AxiosInstance = axios.create({
    baseURL: '/base',
    timeout: 60000,
});

const instanceSearch: AxiosInstance = axios.create({
    baseURL: '/search',
    timeout: 60000,
});

export enum baseType {
    BASE,
    SEARCH
}

//get请求
export function get(url: string, { params = {}, type = baseType.BASE } = {}) {
    const instance = getInstacne(type);
    return new Promise((resolve, reject) => {
        instance
            .get(url, {
                params: params,
            })
            .then((response) => {
                if (response.status == 200) {
                    resolve(response.data);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}
//post请求
export function post(url: string, { data = {}, type = baseType.BASE } = {}) {
    const instance = getInstacne(type);
    return new Promise((resolve, reject) => {
        instance.post(url, data).then(
            (response) => {
                resolve(response.data);
            },
            (err) => {
                reject(err);
            }
        );
    });
}

function getInstacne(type: baseType) {
    switch (type) {
        case baseType.SEARCH:
            console.log('search api');
            return instanceSearch
        default:
            return instanceBase
    }
}

export default {
    get,
    post
}
