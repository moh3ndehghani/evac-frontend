<script setup lang="ts">
import { useQuasar } from "quasar";
import ApiService from "src/services/ApiService";
import { appStore } from "src/stores/app";
import { onMounted, reactive } from "vue";
import { useRoute } from "vue-router";

////////

const store = appStore()

const route = useRoute()

const $q = useQuasar()

const state = reactive({
  isMobile:false,
  isLandScape:false,
  platform:null
})

////////

onMounted(async () => {
  //if the user comes with mobile, if statement is executed
  detectOS()
  if(state.isMobile){
    checkOrientation();
    window.addEventListener('orientationchange', function() {
      checkOrientation();
    });
  }


})

////////

function checkOrientation() {
  if (window.orientation === 90 || window.orientation === -90) {
    state.isLandScape = true
  } else {
    state.isLandScape = false
  }
}

function detectOS(){
  if (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)) {
      state.isMobile = true ;
    } else {
      state.isMobile = false ;
    }
}



</script>

<template>
  <q-layout view="lHh lpr lFf" class="bg-[var(--main-dark)]">
    <q-page-container v-if="state.isMobile && !state.isLandScape" class="flex-center bg-black w-screen h-screen" >
      <img src="~/assets/images/global/rotate.gif" alt="rotate-phone">
    </q-page-container>
    <q-page-container v-if="(state.isMobile && state.isLandScape) || !state.isMobile" class="bg" >
      <router-view  />
    </q-page-container>
  </q-layout>
</template>

<style scoped lang="scss">
.bg{
  @apply  bg-cover bg-no-repeat  bg-center;
  background-image: url(../assets/images/global/bg.png) !important;
}

</style>

