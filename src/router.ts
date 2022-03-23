import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Index from "./views/Index.vue";
import Vue from "./views/Vue.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Index,
    // component: () => import("./views/Index.vue"),
    name: "index"
  },
  {
    path: "/vue",
    component: Vue,
    // component: () => import("./views/Vue.vue"),
    name: "vue"
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
