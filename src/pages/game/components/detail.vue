<script setup lang="ts">
import { useQuasar } from "quasar";
import { computed, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { appStore } from "src/stores/app";
import { GameState } from "src/enums/GameState";
import ApiService from "src/services/ApiService";

////////

const $q = useQuasar();

const router = useRouter();

const store = appStore();

const state = reactive({
  showInviteDialog: false,
  selectedDices: [],
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
  roleLoading: false,
  selectLoading: false,
  ignoreLoading: false,
  stopLoading: false,
  deleteLoading: false,
});

////////

const players = computed(() => {
  return store.game?.players ?? [];
});

const dices = computed(() => {
  return store.game?.dices ?? [];
});

const activePlayer = computed(() => {
  return store.game?.players[store.game?.turn];
});

const activePlayerSpaceship = computed(() => {
  const active = activePlayer.value;
  for (let index in players.value) {
    if (players.value[index].userid == active.userid) {
      return state.playersColors[index];
    }
  }
});

const selectCondition = computed(() => {
  if (store.activePlayer.meeples.length == 3) {
    let totalDices = 0;
    for (let dice of dices.value) {
      totalDices += dice;
    }

    if (dices.value.length == 2) {
      const freeColumn = store.activePlayer.meeples.find(
        (meeple: any) => meeple.index == totalDices
      );
      if (!freeColumn) return false;

      if (store.game?.locks.includes(totalDices)) {
        return false;
      }
    }
  }
  return true;
});

const ignoreCondition = computed(() => {
  //if the user has got more than 2 dices, they can not ignore
  if (dices.value.length == 2) {
    let totalDices = 0;
    for (let dice of dices.value) {
      totalDices += dice;
    }

    //when has not got any choise because all of his spaceships are on the board and his dices is not suitable
    if (store.activePlayer.meeples.length == 3) {
      const emptyColumn = store.activePlayer.meeples.find(
        (meeple: any) => meeple.index == totalDices
      );
      if (!emptyColumn) return true;
    }

    //if the user has got 2 dice, and the total value of those dice is not locked on the board, they can not ignore otherwise they must ignore it because they can not move their spaceship into the locked column
    if (store.game?.locks.includes(totalDices)) {
      return true;
    }

    const sameMeepleInColumn = store.activePlayer.meeples.find(
      (meeple: any) => meeple.index == totalDices
    );
    if (sameMeepleInColumn) {
      switch (sameMeepleInColumn.index) {
        case 2:
          if (sameMeepleInColumn.value - sameMeepleInColumn.index == 1) {
            return true;
          }
        case 3:
          if (sameMeepleInColumn.value - sameMeepleInColumn.index == 2) {
            return true;
          }
        case 4:
          if (sameMeepleInColumn.value - sameMeepleInColumn.index == 3) {
            return true;
          }
        case 5:
          if (sameMeepleInColumn.value - sameMeepleInColumn.index == 4) {
            return true;
          }
        case 6:
          if (sameMeepleInColumn.value - sameMeepleInColumn.index == 5) {
            return true;
          }
        case 7:
          if (sameMeepleInColumn.value - sameMeepleInColumn.index == 6) {
            return true;
          }
        case 8:
          if (sameMeepleInColumn.value - sameMeepleInColumn.index == 3) {
            return true;
          }
        case 9:
          if (sameMeepleInColumn.value - sameMeepleInColumn.index == 0) {
            return true;
          }
        case 10:
          if (sameMeepleInColumn.value - sameMeepleInColumn.index == -3) {
            return true;
          }
        case 11:
          if (sameMeepleInColumn.value - sameMeepleInColumn.index == -6) {
            return true;
          }
        case 12:
          if (sameMeepleInColumn.value - sameMeepleInColumn.index == -9) {
            return true;
          }
      }
    }
  }
  return false;
});

////////

watch(
  () => store.game,
  () => {
    state.selectedDices = [];
  },
  { deep: true }
);

////////

function copy() {
  navigator.clipboard.writeText(store.game?._id);
  $q.notify({
    color: "green",
    message: "Copied",
  });
  state.showInviteDialog = false;
}

function getImageUrl(imageFile: string) {
  return new URL(
    `../../../../src/assets/images/spaceships/${imageFile}`,
    import.meta.url
  ).href;
}

function diceImage(imageFile: string) {
  return new URL(
    `../../../../src/assets/images/dices/${imageFile}.svg`,
    import.meta.url
  ).href;
}

function clickDice(index: number) {
  if (activePlayer.value.userid == store.profile?.userid) {
    const findItemIndex = state.selectedDices.findIndex(
      (itm) => itm == index + 1
    );
    if (findItemIndex != -1) {
      state.selectedDices.splice(findItemIndex, 1);
    } else if (findItemIndex == -1 && state.selectedDices.length < 2) {
      // i have added index by 1, because the first index(0) did not active in the ui
      state.selectedDices.push(index + 1);
    }
  }
}

async function startGame() {
  if (activePlayer.value.userid == store.profile?.userid) {
    try {
      const response = await ApiService.startGame(store.game?._id);
    } catch (error) {
      $q.notify({
        color: "negative",
        message: "There is a problem in starting the game!",
      });
    }
  }
}
async function rollDices() {
  if (activePlayer.value.userid == store.profile?.userid) {
    state.roleLoading = true;
    try {
      const response = await ApiService.roll();
      state.selectedDices = [];
    } catch (error) {
      $q.notify({
        color: "negative",
        message: "There is a problem in rolling the dices!",
      });
    }
    state.roleLoading = false;
  }
}
async function selectDices() {
  if (activePlayer.value.userid == store.profile?.userid) {
    state.selectLoading = true;
    try {
      const dice0: number = state.selectedDices[0] - 1;
      const dice1: number = state.selectedDices[1] - 1;
      const response = await ApiService.select(dice0, dice1);
      state.selectedDices = [];
    } catch (error) {
      $q.notify({
        color: "negative",
        message: "There is a problem in selecting the dices!",
      });
    }
    state.selectLoading = false;
  }
}
async function ignore() {
  if (activePlayer.value.userid == store.profile?.userid) {
    state.ignoreLoading = true;
    try {
      const response = await ApiService.ignore();
    } catch (error) {
      $q.notify({
        color: "negative",
        message: "There is a problem in rolling the dices!",
      });
    }
    state.ignoreLoading = false;
  }
}
async function stopTurn() {
  if (activePlayer.value.userid == store.profile?.userid) {
    state.stopLoading = true;
    try {
      const response = await ApiService.stopTurn();
    } catch (error) {
      $q.notify({
        color: "negative",
        message: "There is a problem in rolling the dices!",
      });
    }
    state.stopLoading = false;
  }
}
async function deleteGame() {
  if (activePlayer.value.userid == store.profile?.userid) {
    state.deleteLoading = true;
    try {
      const response = await ApiService.deleteGame(store.game?._id);
      router.push({ name: "join-game" });
    } catch (error) {
      $q.notify({
        color: "negative",
        message: "There is a problem in deleting the game!",
      });
    }
    state.deleteLoading = false;
  }
}

async function createNewGame(){
  if (store.activePlayer.userid == store.profile?.userid) {
    try {
      const response = await ApiService.deleteGame(store.game?._id);
      router.push({ name: "join-game" });
    } catch (error) {
      $q.notify({
        color: "negative",
        message: "There is a problem in deleting the game!",
      });
    }
  }
}


</script>

<template>

  <div class="detail">
    <div
      v-if="store.game?.state == GameState.Finished"
      class="backdrop-blur-sm h-full w-full absolute top-0 left-0 flex-center flex-col"
    >
      <span class="text-2xl text-violet-500">FINISHED</span>
      <!-- <q-btn
        outline
        rounded
        color="green"
        no-caps
        class="mt-5"
        @click="createNewGame"
      >Create new game</q-btn> -->
    </div>

    <template v-else>
      <q-btn-group unelevated rounded spread>
        <q-btn
          :size="$q.screen.width < 1024 ? 'xs' : ''"
          rounded
          color="deep-purple-8"
          no-caps
          @click="state.showInviteDialog = true"
          :disable="store.players.length == 4"
        >
          Invite
        </q-btn>
        <q-btn
          size="xs"
          icon="fa-solid fa-arrow-right-from-bracket"
          color="red"
          @click="logout"
        ></q-btn>
      </q-btn-group>

      <q-btn
        v-if="store.players[0].userid == store.profile.userid"
        unelevated
        :size="$q.screen.width < 1024 ? 'xs' : ''"
        rounded
        color="pink-13"
        no-caps
        @click="deleteGame"
        :loading="state.deleteLoading"
        >Delete Game</q-btn
      >

      <hr />

      <div v-if="store.game?.players.length > 1" class="flex flex-col gap-3 lg:gap-10">
        <div class="mt-1 lg:mt-5 flex-center gap-1 lg:gap-4">
          <div
            class="spaceship"
            :class="{ 'active-spaceship': item.userid === activePlayer.userid }"
            v-for="(item, index) in players"
            :key="index"
          >
            <img :src="state.playersColors[index].image" alt="" />
            <q-badge :color="state.playersColors[index].type" floating>{{
              item.winIndex.length
            }}</q-badge>
          </div>
        </div>

        <span
          v-if="
            activePlayer.userid == store.profile.userid &&
            store.game.state != GameState.Waiting
          "
          class="flex-center text-center text-gray-50 text-xs lg:text-base"
          >Your Turn</span
        >

        <!-- if game has not been started and it is the users turn -->
        <!-- it means, only the user who craeted the game are allowed to see this button -->
        <q-btn
          v-if="
            activePlayer.userid == store.profile.userid &&
            store.game.state == GameState.Waiting
          "
          :size="$q.screen.width < 1024 ? 'xs' : ''"
          rounded
          unelevated
          color="green-7"
          no-caps
          @click="startGame"
          >Start</q-btn
        >

        <!-- other users see below text -->
        <span
          v-if="
            activePlayer.userid != store.profile.userid &&
            store.game.state == GameState.Waiting
          "
          class="flex-center text-center text-gray-50"
          >Waitin for starting</span
        >

        <!-- if it is users turn and game has been started -->
        <div
          v-if="
            activePlayer.userid == store.profile.userid &&
            store.game?.state != GameState.Waiting &&
            !store.changingTurn
          "
          class="flex-center flex-wrap gap-2"
        >
          <template v-if="store.game?.dices.length > 0">
            <q-btn
              :size="$q.screen.width < 1024 ? 'xs' : ''"
              rounded
              unelevated
              color="green-7"
              no-caps
              @click="selectDices"
              :loading="state.selectLoading"
              :disable="!selectCondition"
              >Select</q-btn
            >
            <q-btn
              :size="$q.screen.width < 1024 ? 'xs' : ''"
              rounded
              unelevated
              color="pink-13"
              no-caps
              @click="ignore"
              :loading="state.ignoreLoading"
              :disable="!ignoreCondition"
              >Ignore</q-btn
            >
          </template>

          <template v-else>
            <q-btn
              :size="$q.screen.width < 1024 ? 'xs' : ''"
              rounded
              unelevated
              color="blue-7"
              no-caps
              @click="rollDices"
              :loading="state.roleLoading"
              >Roll</q-btn
            >
            <q-btn
              :size="$q.screen.width < 1024 ? 'xs' : ''"
              rounded
              unelevated
              color="pink-13"
              no-caps
              @click="stopTurn"
              :loading="state.stopLoading"
              >Stop</q-btn
            >
          </template>
        </div>

        <div v-if="store.game?.state != GameState.Waiting" class="flex-center">
          <template v-if="dices.length > 0">
            <img
              v-for="(item, index) in dices"
              :key="index"
              class="dice-item"
              :class="{
                'dice-item-active': state.selectedDices.find(
                  (itm) => itm === index + 1
                ),
                'cursor-not-allowed':
                  activePlayer.userid != store.profile.userid,
              }"
              :src="diceImage(item)"
              :alt="`dice number:${dice}`"
              @click="clickDice(index)"
            />
          </template>
          <template v-else>
            <div
              v-for="(item, index) in 4"
              :key="index"
              class="w-[25px] lg:w-[50px] h-[25px] lg:h-[50px] bg-violet-500 bg-opacity-30 rounded-sm lg:rounded-xl mx-1"
            ></div>
          </template>
        </div>

        <template v-if="store.activePlayer.meeples.length < 3 && store.game?.state != GameState.Waiting && !store.changingTurn">
          <hr />
          <div class="flex-center flex-wrap gap-2">
            <img
              v-for="(item, index) in 3 - activePlayer.meeples.length"
              :key="index"
              :src="activePlayerSpaceship.image"
              alt=""
              class="spaceship active-spaceship !w-1/6"
            />
          </div>
        </template>

        <div v-if="store.changingTurn" class="flex-center flex-col">
          <q-circular-progress
            rounded
            indeterminate
            :size="$q.screen.width < 1024 ? '45px' : '90px'"
            :thickness="0.2"
            color="green"
            track-color="transparent"
            class="q-ma-md"
          />
          <span class="text-gray-50 text-xs lg:text-base">Changin Turn</span>
        </div>
      </div>

      <div v-else>
        <p class="text-gray-50 text-center text-xs lg:text-sm">Waiting for other players.</p>
      </div>
    </template>

  </div>

  <q-dialog v-model="state.showInviteDialog" position="top">
    <div
      class="bg-[var(--main-gray2)] h-[80px] flex-center gap-2 !rounded-b-2xl px-10"
    >
      <span
        class="border border-dashed border-violet-600 rounded-md px-2 py-2 font-popins text-gray-100"
        >{{ store.game?._id }}</span
      >
      <q-btn unelevated padding="10px" color="deep-purple-6" @click="copy()">
        <i class="fas fa-clipboard"></i>
      </q-btn>
    </div>
  </q-dialog>
</template>
