<script setup lang="ts">
import ApiService from "src/services/ApiService";
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import JoinDialog from "src/pages/join-game/components/join-dialog.vue";

////////

const $q = useQuasar();
const router = useRouter();

const state = reactive({
  showJoinDialog: false,
});

////////

function closeDialog() {
  state.showJoinDialog = false;
}

async function createGame() {
  try {
    const response = await ApiService.createGame();
    if (response) {
      router.push({ name: "game" });
    }
  } catch (error) {
    $q.notify({
      color: "negative",
      message: "There is a problem in creating a game!",
    });
  }
}

async function logout() {
  window.localStorage.removeItem("token");
  router.push({ name: "login" });
}

</script>

<template>
  <div class="flex-center flex-col gap-10 h-screen relative">
    <span class="text-gray-50 font-monument text-4xl">EVAC</span>
    <div class="flex flex-col items-center gap-5">
      <q-btn
        rounded
        text-color="white"
        class="bg-sky-600 hover:bg-sky-700"
        icon="fas fa-plus"
        @click="createGame()"
      >
        Create New Game
      </q-btn>
      <q-btn
        rounded
        text-color="white"
        class="bg-[var(--main-purple)] hover:bg-violet-900"
        @click="state.showJoinDialog = true"
      >
        Join By ID
      </q-btn>
    </div>

    <div class="hidden  lg:!flex flex-col items-center gap-1 absolute bottom-4 ">
      <a
        href="https://github.com/origamicore/core"
        class="fixed px-5 py-2 rounded-full bg-[var(--main-purple)] text-gray-50 hover:text-gray-50"
      >
        <i class="fab fa-github mr-1"></i>
        Don't forget to star
        <i class="fas fa-star text-yellow-400 ml-1"></i>
      </a>

      <div class="flex items-center gap-2 mt-12">
        <a
          href="https://github.com/moh3ndehghani/evac-frontend"
          target="_blank"
          class="btn btn-sm bg-gray-900 hover:bg-gray-950"
        >
          <q-icon name="fab fa-github"></q-icon>
          Front-End
        </a>
        <a
          href="https://github.com/OrigamiShowcase/evac-server"
          target="_blank"
          class="btn btn-sm bg-gray-900 hover:bg-gray-950"
        >
          <q-icon name="fab fa-github"></q-icon>
          Back-End
        </a>
        <a
          href="https://github.com/OrigamiShowcase/evac-server"
          target="_blank"
          class="btn btn-sm bg-gray-900 hover:bg-gray-950"
        >
          <q-icon name="fab fa-github"></q-icon>
          OrigamiCore
        </a>
      </div>
    </div>

    <q-btn
      size="sm"
      round
      icon="fa-solid fa-arrow-right-from-bracket"
      color="red"
      class="absolute right-2 top-2"
      @click="logout"
    ></q-btn>

    <JoinDialog
      v-if="state.showJoinDialog"
      :show="state.showJoinDialog"
      @closeDialog="closeDialog"
    />
  </div>

</template>
