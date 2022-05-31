<template>
  <r-modal
    color="red"
    width="300px"
    :visible="visible"
    closable
    @close="$emit('close')"
    class="help"
  >
    <template #title><Trash2 />确认</template>
    <p>确定删除所有已完成待办吗？</p>
    <template #footer>
      <r-row justify="end" :space="2">
        <r-button color="red" flat @click="onSubmit">确定</r-button>
        <r-button flat @click="$emit('close')">取消</r-button>
      </r-row>
    </template>
  </r-modal>
</template>
<script setup lang="ts">
import { RModal, RButton, RRow } from "rect-ui";
import { Trash2 } from "lucide-vue-next";

defineProps({
  visible: { type: Boolean, default: false },
});

const emits = defineEmits(["close", "submit"]);

const onSubmit = () => {
  emits("submit");
  emits("close");
};
</script>
<style>
.help-ul div {
  background-color: var(--color-gray-1);
  padding: 8px;
  margin: 8px 0;
}
</style>
