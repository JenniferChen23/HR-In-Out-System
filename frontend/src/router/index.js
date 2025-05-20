import { createRouter, createWebHistory } from "vue-router";
import AttendenceLog from "../views/AttendenceLog.vue";
import MyTeam from "../views/MyTeam.vue";
import TodayAttendence from "../views/TodayLog.vue";
import UserLogin from "../views/UserLogin.vue";

const routes = [
  { path: "/", name: "UserLogin", component: UserLogin }, 
  { path: "/today", name: "TodayAttendence", component: TodayAttendence },
  { path: "/attendenceLog", name: "AttendenceLog", component: AttendenceLog },
  { path: "/myTeam", name: "MyTeam", component: MyTeam },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
