<template>
  <div class="submit">
    <a-button @click="close">取消</a-button>
    <a-button type="primary" @click="submit">确定</a-button>
  </div>
</template>
<script lang="ts" setup>
const emit = defineEmits<{
  (e: "submit"): void;
  (e: "cancel"): void;
}>();
const submit = () => {
  emit("submit");
};
const close = () => {
  emit("cancel");
};
</script>
<style scoped lang="less">
.submit {
  width: 100%;
  text-align: center;
  .ant-btn {
    margin: 0 1rem;
  }
}
</style>
