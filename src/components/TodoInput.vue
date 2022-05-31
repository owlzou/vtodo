<template>
  <r-row :space="2" style="padding: 8px">
    <r-input style="flex-grow: 1" v-model="model" class="todo-input" @keyup.enter.native="onclick" />
    <r-button color="yellow" @click="onclick">
      <template #icon><Plus /></template>
      添加
    </r-button>
  </r-row>
</template>
<script lang="ts" setup>
import { RInput, RButton, RRow } from "rect-ui";
import { ref, PropType } from "vue";
import { Plus } from "lucide-vue-next";
const props = defineProps({
  onsubmit: { type: Function as PropType<(a: string) => void>, require: true },
});
const model = ref("");
const onclick = () => {
  props.onsubmit!(model.value);
  model.value = "";
};
</script>
<style>
.todo-input input {
  width: calc(100% - 16px);
}
</style>
