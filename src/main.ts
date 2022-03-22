import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./tailwind.css";
import "./assets/main.scss";

const app = createApp(App);

// Import Components
import Debug from "revue-components/vues/Debug.vue";

app.component("Debug", Debug);

app.use(router);
app.mount("#app");
