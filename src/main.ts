import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import "rect-ui/dist/style.css"
import { useRegisterSW } from 'virtual:pwa-register/vue';

useRegisterSW();
createApp(App).mount('#app')
