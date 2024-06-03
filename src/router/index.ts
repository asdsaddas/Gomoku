// Composables
import { createRouter, createWebHistory } from "vue-router";
//路由表
const routes = [
  {
    path: "/",
    redirect: "/Welcome",
  },
  {
    path: "/Welcome",
    name: "Welcome",
    component: () => import("~/Welcome.vue"),
  },

  //主页面
  {
    path: "/Lobby",
    name: "Lobby",
    component: () => import("~/views/Lobby.vue"),
  },
  //房间
  {
    path:"/Room",
    name:"Room",
    component: () => import("~/views/Room.vue"),
  }
];
//路由创建
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
//路由导出
export default router;
