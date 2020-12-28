import config from "@/api/config";
module.exports = {
    devServer: {
        host: 'localhost',
        port: 8081, // 端口号
        https: false, // https:{type:Boolean}
        open: true, // 配置自动启动浏览器
        proxy: {
            // 配置多个跨域
            [config.baseurl.dev]: {
                target: 'http://fundgz.1234567.com.cn',//跨域接口的地址
                changeOrigin: true,
                pathRewrite: {
                    [`^/${config.baseurl.dev}`]: '/'
                }
            }
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    }
};