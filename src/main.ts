import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./tailwind.css";
import "./assets/main.scss";
import Debug from "revue-components/vues/Debug.vue";
import { AbolishPlugin } from "abolish-vue";
import { extendAbolish } from "./abolish";

const app = createApp(App);

app.use(AbolishPlugin, <AbolishPlugin>{
  init: extendAbolish
  // abolish: () => new Abolish()
});

app.component("Debug", Debug);

app.use(router);
app.mount("#app");
