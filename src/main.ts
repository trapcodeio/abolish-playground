import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./tailwind.css";
import "./assets/main.scss";
import Debug from "revue-components/vues/Debug.vue";
import { extendAbolish } from "./abolish";
import { AbolishPlugin } from "abolish-vue/index.esm-bundled";

const app = createApp(App);

app.use(AbolishPlugin, <AbolishPlugin>{
  init: extendAbolish
  // abolish: () => new Abolish()
});

app.component("Debug", Debug);

app.use(router);
app.mount("#app");
