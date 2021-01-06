const path = require('path')
module.exports = {
    devServer: {
        host: '0.0.0.0',
        port: 8081, // 端口号
        https: false, // https:{type:Boolean}
        open: true, // 配置自动启动浏览器
        proxy: {
            // 配置多个跨域
            '/js': {
                target: 'http://fundgz.1234567.com.cn',//跨域接口的地址
                changeOrigin: true,
            },
            '/FundSearch': {
                target: 'https://fundsuggest.eastmoney.com',//跨域接口的地址
                changeOrigin: true,
            },
            '/FundMApi': {
                target: 'https://fundmobapi.eastmoney.com',//跨域接口的地址
                changeOrigin: true,
            },
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    },
    pages: {
        index: {
            // page 的入口
            entry: 'src/main.ts',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'index.html',
            // 当使用 title 选项时，
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        }
    }
};