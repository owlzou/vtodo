<template>
  <r-modal
    color="green"
    :visible="visible"
    closable
    @close="$emit('close')"
    class="help"
  >
    <template #title><HelpCircle />帮助</template>
    <div>
      <p>VTodo v{{pkg.version}}</p>
      <p>
        本 Web APP 使用
        <a href="http://todotxt.org/" target="_blank">todo.txt</a> 格式：<a
          href="https://github.com/todotxt/todo.txt"
          target="_blank"
          >Todo.txt 格式文档</a
        >
      </p>
      <hr />
      <ul>
        <li>源代码：<a href="https://github.com/owlzou/vtodo" target="_blank">Github@owlzou/vtodo</a></li>
        <li>构造：<a href="https://vuejs.org/" target="_blank">vue</a></li>
        <li>图标：<a href="https://lucide.dev/" target="_blank">lucide</a></li>
        <li>ID 生成：<a href="https://github.com/ai/nanoid" target="_blank">Nano ID</a></li>
        <li>存储：<a href="https://github.com/localForage/localForage" target="_blank">localForage</a></li>
      </ul>
    </div>
  </r-modal>
</template>
<script setup lang="ts">
import { RModal } from "rect-ui";
import { HelpCircle } from "lucide-vue-next";
import pkg from "../../package.json"

defineProps({
  visible: { type: Boolean, default: false },
});

defineEmits(["close"]);
</script>
