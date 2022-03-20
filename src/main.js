import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import 'mapbox-gl/dist/mapbox-gl.css'

createApp(App).use(router).mount('#app')
