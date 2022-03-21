import {createApp} from "vue";
import App from "./App.vue";
import router from "./router";
import "./tailwind.css";
import "./assets/main.scss"
import AbolishBrowser from "./abolish";

const app = createApp(App);

app.use(router);
app.use(AbolishBrowser)

app.mount("#app");
