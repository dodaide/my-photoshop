import App from './App.vue'
import { createApp } from 'vue'
import { TinyEmitter } from 'tiny-emitter'
import * as cv from 'opencv.js'
import { registerPlugins } from '@/plugins'
import ToastPlugin from 'vue-toast-notification';
// Import one of the available themes
//import 'vue-toast-notification/dist/theme-default.css';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import { useToast } from 'vue-toast-notification'

const tiniEmitter = new TinyEmitter();
const toast = useToast();

const app = createApp(App)
app.use(ToastPlugin);
app.config.globalProperties.$emitter = tiniEmitter;
app.config.globalProperties.$toast = toast;
app.config.globalProperties.$cv = cv; 

registerPlugins(app)

app.mount('#app')
