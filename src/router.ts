import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Index from "./views/Index.vue";
// import Vue from "./views/Vue.vue";
import { ifDevRun } from "revue-components/vue3/utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("./views/Index.vue"),
    name: "index"
  }
];

ifDevRun(() => {
  routes.push({
    path: "/vue",
    component: () => import("./views/Vue.vue"),
    name: "vue"
  });
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
