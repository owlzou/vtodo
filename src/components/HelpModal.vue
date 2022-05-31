<template>
  <r-modal
    color="green"
    :visible="visible"
    closable
    @close="$emit('close')"
    class="help"
  >
    <template #title><HelpCircle />帮助</template>
    <div style="height:100px">
      <p>本 Web APP 使用 <a href="http://todotxt.org/" target="_blank">todo.txt</a> 格式：</p>
      <p><a href="https://github.com/todotxt/todo.txt" target="_blank">Todo.txt 格式文档</a></p>
    </div>
  </r-modal>
</template>
<script setup lang="ts">
import { RModal } from "rect-ui";
import { HelpCircle } from "lucide-vue-next";

defineProps({
  visible: { type: Boolean, default: false },
});

defineEmits(["close"]);
</script>

