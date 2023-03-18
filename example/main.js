import {createApp} from 'vue'
import App from './App.vue'
import canvue from "../src";
import router from "./router.js"

const app = createApp(App)

app.use(router)
app.use(canvue)

app.mount('#app')
