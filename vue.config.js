module.exports = {
    devServer: {
        host: '0.0.0.0',
        port: 8081, // 端口号
        https: false, // https:{type:Boolean}
        open: true, // 配置自动启动浏览器
        proxy: {
            // 配置多个跨域
            '/base': {
                target: 'http://fundgz.1234567.com.cn',//跨域接口的地址
                changeOrigin: true,
                pathRewrite: {
                    '^/base': ''
                }
            },
            '/search': {
                target: 'https://fundsuggest.eastmoney.com',//跨域接口的地址
                changeOrigin: true,
                pathRewrite: {
                    '^/search': ''
                }
            }
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    }
};