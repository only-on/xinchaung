<template>
  <div class="submit">
    <a-button @click="close">{{props.cancelText}}</a-button>
    <a-button type="primary" @click="submit" :loading="props.loading">{{props.okText}}</a-button>
  </div>
</template>
<script lang="ts" setup>
interface Props {
  loading?: boolean;
  okText?:string,
  cancelText?:string
}
const props = withDefaults(defineProps<Props>(),{
  loading: false,
  okText:'确定',
  cancelText:'取消'
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
