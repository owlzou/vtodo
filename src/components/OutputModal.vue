<template>
  <r-modal
    color="pink"
    width="600px"
    :visible="visible"
    closable
    @close="$emit('close')"
  >
    <template #title><Download/>导出</template>
    <r-textarea class="output-textarea" :rows="15" readonly v-model="text"/>
  </r-modal>
</template>
<script setup lang="ts">
import { RModal, RTextarea } from "rect-ui";
import {Download} from "lucide-vue-next"
defineProps({
  text: { type: String, default: "" },
  visible: { type: Boolean, default: false },
});
defineEmits(["close"]);
</script>
<style>
.output-textarea {
  width: calc(100% - 20px);
  resize: vertical;
}
</style>
