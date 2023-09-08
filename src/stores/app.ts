import { defineStore } from 'pinia';

export const appStore = defineStore('game', {
  state: () => ({
    game: null,
    token:"",
    profile:{},
    changingTurn:false,
    disconnected:false
  }),

  getters:{
    players(state){
      return state.game?.players ?? [];
    },
    activePlayer(state){
      return state.game?.players[state.game?.turn];
    },
  },

  actions:{
  }
});
