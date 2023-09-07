<script setup lang="ts">
import { useQuasar } from "quasar";
import { GameState } from "src/enums/GameState";
import Board from "src/pages/game/components/board.vue";
import Detail from "src/pages/game/components/detail.vue";
import ApiService from "src/services/ApiService";
import WebSocketClient from "src/services/SocketService";
import { appStore } from "src/stores/app";
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";

////////

const $q = useQuasar()
const store = appStore();

const router = useRouter()

////////

onMounted(() => {
  WebSocketClient.client.addEventListener("open", async () => {
    await WebSocketClient.connectToServer();
  });
  WebSocketClient.client.addEventListener("message", async (event) => {
    // await WebSocketClient.connectToServer()
    var data = JSON.parse(event.data);
    WebSocketClient.messages(data);
  });
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
