<template>
  <div class="submit">
    <a-button @click="close">取消</a-button>
    <a-button type="primary" @click="submit" :loading="props.loading">确定</a-button>
  </div>
</template>
<script lang="ts" setup>
interface Props {
  loading?: boolean;
}
const props = withDefaults(defineProps<Props>(),{
  loading: false
});
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
