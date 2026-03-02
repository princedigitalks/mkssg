import { createApp } from 'vue'
import App from './App.vue'

import router from './../routes/index';
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import store from './store';
import mitt from 'mitt';


  
const emitter = mitt();
const app = createApp(App);
app.config.globalProperties.emitter = emitter;


app.use(Toast, {
  position: POSITION.TOP_CENTER
});
app.use(store);
app.use(router).mount('#app');

