<template>
  <main>
    <r-row justify="space-between" align="center" style="padding: 0 8px">
      <h1 class="title">VTodo</h1>
      <r-row :space="1">
        <r-button
          title="导入"
          @click="inputModalVisible = true"
          type="text"
          flat
          color="blue"
        >
          <template #icon><Upload /></template>
        </r-button>
        <r-button
          title="导出"
          @click="outputModalVisible = true"
          type="text"
          flat
          color="pink"
        >
          <template #icon><Download /></template>
        </r-button>
        <r-button
          title="帮助"
          @click="helpModalVisible = true"
          type="text"
          color="green"
          style="justify-self: end"
          ><template #icon><HelpCircle /></template
        ></r-button> </r-row
    ></r-row>

    <TodoInput :onsubmit="onsubmit" />

    <r-card dialog>
      <template #title>
        <r-row style="width: 100%" :space="1">
          <r-dropdown :width="200">
            <r-button title="排序" type="text" color="yellow">
              <template #icon><SortDesc /></template>
            </r-button>
            <template #items>
              <r-dropdown-item
                v-for="i in sortByOptions"
                :key="i.key"
                @click="currentSortBy = i.key"
              >
                <template #icon>
                  <Check v-if="currentSortBy == i.key" />
                  <span class="icon-size" v-else></span>
                </template>
                {{ i.text }}
              </r-dropdown-item>
            </template>
          </r-dropdown>
          <r-input flat v-model="keyword">
            <template #before><Search /></template>
            <template #after>
              <Delete
                v-if="keyword.length > 0"
                @click="keyword = ''"
                style="cursor: pointer"
              />
            </template>
          </r-input>
          <!-- SPACE -->
          <div style="flex-grow: 1"></div>
          <r-button
            title="清理已完成待办"
            @click="confirmModalVisible = true"
            type="text"
            color="red"
            ><template #icon><Eraser /></template
          ></r-button>
        </r-row>
      </template>

      <div v-if="todoData.length > 0">
        <TodoLine
          v-for="i in showData"
          :value="i.val"
          :key="i.id"
          @completed="(val) => onCompleted(val, i)"
          @remove="onRemove(i.id)"
          @click-tag="onClickTag"
          @submit="(val) => onEditSubmit(i.id, val)"
        />
      </div>

      <div class="all-completed" v-else>🎉 已清理所有待办 🎉</div>
    </r-card>
  </main>
  <footer>
    <r-row
      justify="center"
      align="center"
      style="padding: 16px; font-size: 12px"
    >
      2022&nbsp;Owlzou&nbsp;✨&nbsp;
      <a href="https://github.com/owlzou/vtodo" target="_blank">Github</a>
    </r-row>
  </footer>
  <OutputModal
    :text="outputText.join('\n')"
    :visible="outputModalVisible"
    @close="outputModalVisible = false"
  />
  <InputModal
    :visible="inputModalVisible"
    @close="inputModalVisible = false"
    @submit="onInputSubmit"
  ></InputModal>
  <HelpModal
    :visible="helpModalVisible"
    @close="helpModalVisible = false"
  ></HelpModal>
  <ConfirmModal
    :visible="confirmModalVisible"
    @close="confirmModalVisible = false"
    @submit="removeAllCompleted"
  />
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref, watch, computed } from "vue";
import {
  RCard,
  RButton,
  RRow,
  RDropdown,
  RDropdownItem,
  RInput,
} from "rect-ui";
import {
  Check,
  Download,
  Eraser,
  HelpCircle,
  Search,
  SortDesc,
  Upload,
  Delete,
} from "lucide-vue-next";
import { nanoid } from "nanoid";
import { TodoTxt, TodoType, sortTodoBy, TodoNode } from "./todotxt";
import {
  TodoLine,
  TodoInput,
  OutputModal,
  InputModal,
  HelpModal,
  ConfirmModal,
} from "./components";
import { load, save } from "./data";
interface Data {
  id: string;
  val: TodoTxt;
}
/* ----------------------------------- 数据 ----------------------------------- */

const todoData: Ref<Data[]> = ref([]);
const keyword: Ref<string> = ref("");

const currentSortBy = ref(TodoType.Priority);

const sortByOptions = [
  { key: TodoType.Priority, text: "按优先度" },
  { key: TodoType.Date, text: "按结束时间" },
  { key: TodoType.CompletedDate, text: "按创建时间" },
];

const outputModalVisible = ref(false);
const inputModalVisible = ref(false);
const helpModalVisible = ref(false);
const confirmModalVisible = ref(false);

const outputText = computed(() => {
  return todoData.value.map((i) => i.val.raw);
});

const showData = computed(() => {
  const key = keyword.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return todoData.value.filter((i) => i.val.raw.search(key) >= 0);
});

/* ----------------------------------- 函数 ----------------------------------- */
// 提交新的 TODO
const onsubmit = (text: string) => {
  if (text.trim().length > 0) {
    todoData.value.push({ id: nanoid(), val: new TodoTxt(text) });
  }
  sort(currentSortBy.value);
  save(outputText.value);
};

// 导入新的 TODO
const onInputSubmit = (text: string) => {
  text
    .split("\n")
    .filter((i) => i.length > 0)
    .forEach((i) => onsubmit(i));
  save(outputText.value);
};

// 点击完成一个待办时
const onCompleted = (completed: Boolean, todo: Data) => {
  todo.val.setComplete(completed);
  sort(currentSortBy.value);
  save(outputText.value);
};

// 点击删除一个待办时
const onRemove = (id: string) => {
  const index = todoData.value.findIndex((i) => i.id === id);
  todoData.value.splice(index, 1);
  save(outputText.value);
};

// 移除所有已完成
const removeAllCompleted = () => {
  const newdata: Data[] = [];
  todoData.value.forEach((i) => {
    if (!i.val.completed) {
      newdata.push(i);
    }
  });
  todoData.value = newdata;
  save(outputText.value);
};

// 点击 Tag 设置新的筛选内容
const onClickTag = (val: TodoNode) => {
  switch (val.type) {
    case TodoType.Context: {
      keyword.value = "@" + val.val;
      break;
    }
    case TodoType.Project: {
      keyword.value = "+" + val.val;
      break;
    }
    default: {
      keyword.value = val.val;
    }
  }
};

// 提交修改
const onEditSubmit = (id: string, text: string) => {
  const index = todoData.value.findIndex((i) => i.id == id);
  todoData.value[index].val = new TodoTxt(text);
  sort(currentSortBy.value);
  save(outputText.value);
};

const sort = (by: TodoType) => {
  todoData.value.sort((a, b) => sortTodoBy(by, a.val, b.val));
};

/* ---------------------------------- WATCH --------------------------------- */

watch(currentSortBy, (val, _oldval) => {
  sort(val);
});

onMounted(() => {
  load().then((data) => {
    todoData.value = data.map((i) => ({
      id: nanoid(),
      val: new TodoTxt(i),
    }));
  });
});
</script>
<style>
main {
  max-width: 800px;
  margin: 0 auto;
}
.icon-size {
  display: inline-block;
  width: 24px;
  height: 24px;
}
.all-completed {
  text-align: center;
  color: var(--color-gray-8);
  padding: 25px;
}
</style>
