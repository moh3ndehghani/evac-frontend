<script setup lang="ts">
import { useQuasar } from "quasar";
import { computed, reactive } from "vue";
import { appStore } from "src/stores/app";
import { GameState } from "src/enums/GameState";
import ApiService from "src/services/ApiService";
import { log } from "console";

////////

const $q = useQuasar();

const store = appStore();

const state = reactive({
  board: [
    { col: 2, count: 3 },
    { col: 3, count: 5 },
    { col: 4, count: 7 },
    { col: 5, count: 9 },
    { col: 6, count: 11 },
    { col: 7, count: 13 },
    { col: 8, count: 11 },
    { col: 9, count: 9 },
    { col: 10, count: 7 },
    { col: 11, count: 5 },
    { col: 12, count: 3 },
  ],
  playersColors: [
    {
      type: "green",
      color: "bg-green-500",
      image: getImageUrl("green.svg"),
    },
    {
      type: "red",
      color: "bg-red-500",
      image: getImageUrl("red.svg"),
    },
    {
      type: "violet",
      color: "bg-violet-500",
      image: getImageUrl("purple.svg"),
    },
    {
      type: "yellow",
      color: "bg-yellow-500",
      image: getImageUrl("yellow.svg"),
    },
  ],
});

////////

const activePlayerSpaceship = computed(() => {
  const active = store.activePlayer;
  for (let index in store.players) {
    if (store.players[index].userid == active.userid) {
      return state.playersColors[index];
    }
  }
});

const allShips = computed(() => {
  const ships = [];
  for (let index in store.players) {
    ships.push({
      indexPlayer: parseFloat(index),
      color: state.playersColors[index],
      ships: store.players[index].ships,
    });
  }
  return ships;
});

////////

function getImageUrl(imageFile: string) {
  return new URL(
    `../../../../src/assets/images/spaceships/${imageFile}`,
    import.meta.url
  ).href;
}

function setMeeple(colomn: number, index: number) {
  const meeples = store.activePlayer.meeples;
  const res = meeples.find(
    (meeple: any) => meeple.index == colomn && meeple.value == index
  );
  return res ? true : false;
}

function checkLock(column:number){
  const locks = store.game?.locks
  if(locks.find((lock:number) => lock == column)) return true
  return false
}

function lockColor(column:number){
  const locks = store.game?.locks
  const colors = [
    "#22c55e",
    "#ef4444",
    "#8b5cf6",
    "#eab308"
  ]
  for(let playerIndex in store.players){
    const res = store.players[playerIndex].winIndex.find((lock:any) => lock == column)
    if(res) return colors[playerIndex]
  }
}

</script>

<template>
  <div class="board">
    <div
      v-for="(column, index) in state.board"
      :key="index"
      class="col-span-1 flex flex-col-reverse items-center "
    >
      <span class="text-gray-50 text-base lg:text-2xl text-center" :style="{color: lockColor(column.col)}">{{ column.col }}</span>
      <div
        v-for="(item, indx) in column.count"
        :key="indx"
        class="place-item grid grid-cols-8"
        :class="[`${checkLock(column.col) ? 'opacity-30 cursor-not-allowed' : ''}`]"
        :style="{backgroundColor: lockColor(column.col)}"
      >
        <div class="col-span-6 w-full h-full flex-center">
          <img
            v-if="setMeeple(column.col, indx + 1)"
            :src="activePlayerSpaceship.image"
            class="spaceship"
          />
        </div>

        <div class="col-span-2 flex items-center flex-col translate-x-2">
          <template v-for="(playerShips, shipIndex) in allShips" :key="shipIndex">
            <template v-for="(ship , shipIndx) in playerShips.ships" :key="shipIndx">
              <div
                v-if="ship.index == column.col && ship.value == indx+1"
                class="w-[7px] h-[7px] my-[.5px]"
                :class="[playerShips.color.color]"
              ></div>
            </template>
          </template>
        </div>
      </div>

    </div>
  </div>
</template>
