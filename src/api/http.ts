import axios, { AxiosInstance } from "axios"; // 引用axios
import config from "@/api/config";
import { getCurrentInstance } from "vue";
import { baseBean } from "@/bean/baseBean";

const instanceBase: AxiosInstance = axios.create({
    timeout: 60000,
});

//get请求
export function get(url: string, params = {}) {
    const instance = instanceBase;
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
export function post(url: string, data = {}) {
    const instance = instanceBase;
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

export default {
    get,
    post
}
