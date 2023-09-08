<script setup lang="ts">
import { onMounted } from "vue";

console.log("version 1.0.2");

onMounted(() => {
  window.addEventListener("online", () => {
    console.log("you are online");
  })
  window.addEventListener("offline", () => {
    console.log("you are offline");
  })
})
</script>

<template>
  <router-view />
</template>


