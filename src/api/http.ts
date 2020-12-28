import axios from "axios"; // 引用axios
import config from "@/api/config";

const instance = axios.create({
    baseURL: config.baseUrl.dev,
    // baseURL: '/api',
    timeout: 60000,
});
//get请求
function get(url: string, params = {}) {
    return new Promise((resolve, reject) => {
        instance
            .get(url, {
                params: params,
            })
            .then((response) => {
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
    });
}
//post请求
function post(url: string, data = {}) {
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
