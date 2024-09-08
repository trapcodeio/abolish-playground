import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./tailwind.css";
import "./assets/main.scss";
import { extendAbolish } from "./abolish";
import { AbolishPlugin } from "abolish-vue/index.esm-bundled";
import {useDebugPlugin} from 'vue-json-debug/src/plugin';
import 'vue-json-debug/src/debug.css';

const app = createApp(App);

app.use(AbolishPlugin, <AbolishPlugin>{
  init: extendAbolish
  // abolish: () => new Abolish()
});

useDebugPlugin(app, {
  registerDebugComponent: true,
});


app.use(router);
app.mount("#app");
