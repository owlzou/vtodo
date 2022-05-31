<template>
  <r-modal
    color="blue"
    width="600px"
    :visible="visible"
    closable
    @close="$emit('close')"
  >
    <template #title><Upload />导入</template>
    <r-textarea class="input-textarea" :rows="15" v-model="text" />
    <template #footer>
      <r-row justify="end">
        <r-button color="blue" flat @click="onSubmit">
          <template #icon><Check /></template>确定
        </r-button>
      </r-row>
    </template>
  </r-modal>
</template>
<script setup lang="ts">
import { RModal, RTextarea, RButton, RRow } from "rect-ui";
import { ref } from "vue";
import { Upload, Check } from "lucide-vue-next";

defineProps({
  visible: { type: Boolean, default: false },
});

const emits = defineEmits(["close", "submit"]);

const text = ref("");

const onSubmit = () => {
  emits("submit", text.value);
  emits("close");
  text.value = "";
};
</script>
<style>
.input-textarea {
  width: calc(100% - 20px);
  resize: vertical;
}
</style>
