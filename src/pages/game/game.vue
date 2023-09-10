<script setup lang="ts">
import { useQuasar } from "quasar";
import webSocket from "src/boot/web-socket";
import { GameState } from "src/enums/GameState";
import Board from "src/pages/game/components/board.vue";
import Detail from "src/pages/game/components/detail.vue";
import ApiService from "src/services/ApiService";
import WebSocketClient from "src/services/SocketService";
import { appStore } from "src/stores/app";
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";

////////

const store = appStore();

////////

onMounted(async () => {
  await WebSocketClient.init()
});

</script>

<template>
  <div class="game ">
    <div class="col-span-2 section-info">
      <Detail />
    </div>
    <div class="col-span-6 section-info">
      <Board />
    </div>
  </div>
</template>
