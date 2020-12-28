import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { useElements } from '@/init/init_element'
import http from '@/api/http'
const app = createApp(App)
app.config.globalProperties.$http = http
app.use(store)
app.use(router)
useElements(app);
app.mount('#app')
