<script setup lang="ts">
import { useQuasar } from "quasar";
import ApiService from "src/services/ApiService";
import { reactive } from "vue";

////////

const $q = useQuasar()

const state = reactive({
  btnLoading:false
})

////////

async function login() {
  state.btnLoading = true
  try {
    const response = await ApiService.login();
    window.location.href = response
  } catch (error) {
    $q.notify({
      color: "negative",
      message: "There is a problem in connecting whit gmail!",
    });
  }
  state.btnLoading = false
}

</script>

<template>
  <div class="flex-center flex-col gap-10 h-screen">
    <span class="text-gray-50 font-monument text-4xl">EVAC</span>
    <q-btn rounded color="red" icon="fab fa-google" :loading="state.btnLoading" no-caps @click="login">
      <span class="ml-2">Connect With Google</span>
    </q-btn>
  </div>
</template>
