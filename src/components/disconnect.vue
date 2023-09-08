<script setup>
import { onMounted, reactive } from "vue";
import { appStore } from "src/stores/app";

// ////////

const store = appStore()

// const state = reactive({
//   disconnected:false
// })

// ////////

// onMounted(() => {
//   window.addEventListener('online',  updateOnlineStatus);
//   window.addEventListener('offline', updateOnlineStatus);
// })

// function updateOnlineStatus(event) {
//   navigator.onLine ? state.disconnected = false : state.disconnected = true;
// }

</script>

<template>
  <div v-if="store.disconnected" class=" bg-red-500 flex items-center justify-between gap-2 lg:gap-10 px-3 lg:px-10 py-2 !text-gray-50 w-full">
    <div class="flex items-center gap-2">
      <q-icon size="md" name="wifi_off"></q-icon>
      <span class="font-popins">You have lost connection to the internet. Trying to make connection.</span>
    </div>
    <q-spinner size="md"></q-spinner>
  </div>
</template>
