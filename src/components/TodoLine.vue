<template>
  <r-row nowrap align="center">
    <r-col class="todo-checkbox">
      <r-checkbox v-model="value.completed" @change="onCompletedChange" />
    </r-col>
    <r-col v-if="editing" class="todo-content">
      <r-input
        v-model="text"
        flat
        style="width: calc(100% - 16px)"
        @keyup.enter.native="onSubmit"
        ref="inputRef"
      />
    </r-col>
    <r-col :class="lineClass" v-else>
      <LineItem
        :nodes="value.nodes"
        @click-tag="(val:string) => $emit(`clickTag`, val)"
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
            <Edit @click="onEdit" />
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
import { PropType, computed, ref, Ref, nextTick } from "vue";
import { TodoTxt } from "../todotxt";
import LineItem from "./LineItem";

const props = defineProps({
  value: { type: Object as PropType<TodoTxt>, required: true },
});

const emits = defineEmits(["completed", "remove", "clickTag", "submit"]);

const editing = ref(false);
const text = ref(props.value.raw);
const inputRef: Ref<typeof RInput | null> = ref(null);

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

async function onEdit() {
  editing.value = true;
  await nextTick();
  inputRef.value?.focus();
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
