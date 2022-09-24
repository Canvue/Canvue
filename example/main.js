import {createApp} from 'vue'
import App from './App.vue'
import canvue from "../src";

const app = createApp(App)
app.use(canvue)
app.mount('#app')
