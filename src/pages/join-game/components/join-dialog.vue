<script setup lang="ts">
import * as Yup from "yup";
import { ErrorMessage, Field, useField, useForm } from "vee-validate";
import { reactive } from "vue";
import ApiService from "src/services/ApiService";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import WebSocketClient from "src/services/SocketService";

////////

const router = useRouter();
const $q = useQuasar();
const emit = defineEmits(["closeDialog"]);

const props = defineProps(["show"]);

const state = reactive({
  showDialog: props.show,
  schema: Yup.object({
    id: Yup.string().nullable("ID is required!").required("ID is required!"),
  }),
  btnLoading: false,
});

const { handleSubmit, errors } = useForm({
  validationSchema: state.schema,
});

const { value: id } = useField("id");

////////

function closeDialog() {
  emit("closeDialog");
}

async function confirm() {
  handleSubmit(async () => {
    try {
      state.btnLoading = true
      const response = await ApiService.joinGame(id.value as string);
      // const response = await WebSocketClient.join(id.value as string)
      // router.push({name: "game"})
      if (response) {
        router.push({ name: "game" });
      }
    } catch (error) {
      $q.notify({
        color: "negative",
        message: "There is a problem in joining the game!",
      });
    }
    state.btnLoading = false
  })();
}
</script>

<template>
  <q-dialog v-model="state.showDialog" @hide="closeDialog">
    <div class="w-[300px] p-5 bg-sky-900">
      <p class="text-gray-50 text-center text-xl">Join By ID</p>
      <q-input
        dark
        outlined
        color="blue-5"
        label-color="blue-2"
        v-model="id"
        label="ID"
        class="mt-5 text-gray-50"
        :error="errors.id ? true : false"
        hide-bottom-space
      />

      <div class="flex-center mt-5">
        <q-btn
          outline
          rounded
          color="blue-2"
          :loading="state.btnLoading"
          no-caps
          @click="confirm"
          >Join</q-btn
        >
      </div>
    </div>
  </q-dialog>
</template>
