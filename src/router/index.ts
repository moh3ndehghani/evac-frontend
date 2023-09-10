import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import ApiService from 'src/services/ApiService';
import { appStore } from 'src/stores/app';
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'hash' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from , next) => {
    const store = appStore()

    if(to.query.oauttoken){
      try {
        const response = await ApiService.getToken(to.query.oauttoken as string)
        if(response){
          window.localStorage.setItem("token" , response)
        }
      } catch (error) {
        console.log("error ====>" , error);
      }
    }


    const token = window.localStorage.getItem("token")
    if(token && to.name === "login"){
      return next({name:"join-game"})
    }
    if(!token && to.name !== "login"){
      return next({name:"login"})
    }

    if(to.name !== "login"){
      const profile = await ApiService.isLogin()
      store.profile = profile
    }

    if(token && to.name !== "login"){
      const game = await ApiService.getGame()
      // if there is a game on this gamil, the user redirects to game
      if(game){
        store.game = game
        if(to.name !== "game"){
          return next({name:"game"})
        }
      }
      else{
        if(to.name !== "join-game"){
          return next({name:"join-game"})
        }
      }
    }

    next()
  })

  return Router;
});
