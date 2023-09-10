import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/main-layout.vue'),
    children: [
      {
        path: "join-game",
        name:"join-game",
        component: () => import('src/pages/join-game/join-game.vue')
      },
      {
        path: "game",
        name:"game",
        component: () => import('src/pages/game/game.vue')
      },
      {
        path: "login",
        name:"login",
        component: () => import('src/pages/login/login.vue')
      }
    ],
  },



  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
