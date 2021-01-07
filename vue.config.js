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
    chainWebpack: config => {
        //打包入口
        config.when(process.env.BABEL_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.ts')
            //cdn
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                echarts: 'echarts',
                'element-plus': 'ElementPlus',
            })
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })

        config.when(process.env.BABEL_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.ts')
            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })


    }
};