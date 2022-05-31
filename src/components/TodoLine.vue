<template>
  <r-row nowrap align="center">
    <r-col class="todo-checkbox">
      <r-checkbox v-model="value.completed" @change="onCompletedChange" />
    </r-col>
    <r-col v-if="editing" class="todo-content">
      <r-input v-model="text" flat />
    </r-col>
    <r-col :class="lineClass" v-else>
      <!-- 选择合适的 key，类型再不行只能选择特殊key了 -->
      <LineItem
        v-for="i in value.nodes"
        :node="i"
        :key="i.type"
        @click-tag="(val) => $emit(`clickTag`, val)"
      />
    </r-col>
    <r-col class="todo-editbar">
      <r-row nowrap>
        <r-button type="text" color="green" title="保存" v-if="editing">
          <template #icon>
            <Save @click="onSubmit" />
          </template>
        </r-button>
        <r-button type="text" color="gray" title="编辑" v-else>
          <template #icon>
            <Edit @click="editing = true" />
          </template>
        </r-button>
        <r-button type="text" color="red" @click="$emit(`remove`)" title="删除"
          ><template #icon><Trash2 /></template
        ></r-button>
      </r-row>
    </r-col>
  </r-row>
</template>
<script setup lang="ts">
import { RCheckbox, RRow, RButton, RCol, RInput } from "rect-ui";
import { Edit, Trash2, Save } from "lucide-vue-next";
import { PropType, computed, ref } from "vue";
import { TodoTxt } from "../todotxt";
import LineItem from "./LineItem";

const props = defineProps({
  value: { type: Object as PropType<TodoTxt>, required: true },
});

const emits = defineEmits(["completed", "remove", "clickTag", "submit"]);

const editing = ref(false);
const text = ref(props.value.raw);

const lineClass = computed(() => ({
  ["todo-content"]: true,
  ["todo-completed"]: props.value.completed,
}));

function onCompletedChange(completed: Boolean) {
  emits("completed", completed);
}

function onSubmit() {
  emits("submit", text.value);
  editing.value = false;
}
</script>
<style>
.todo-completed * {
  color: var(--color-light-6) !important;
  text-decoration: line-through;
}
.todo-checkbox {
  flex-grow: 0;
}
.todo-content {
  flex-grow: 1;
}
.todo-content input {
  font-size: 16px;
}
.todo-editbar {
  width: 75px;
  flex-shrink: 0;
}
</style>
