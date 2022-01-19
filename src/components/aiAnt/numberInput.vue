<template>
  <div class="number-input-wrap">
    <a-textarea
      class="c-textarea"
      v-model:value="value"
      :placeholder="placeholder"
      :auto-size="autoSize"
    />
    <span class="text-number" v-if="maxlength"
      ><i class="current-text-length" :class="currentLength>maxlength?'error':''">{{ currentLength }}</i>/{{ maxlength }}</span
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, PropType, watch } from "vue";

export default defineComponent({
  props: {
    value: {
      default: "",
      require: true,
    },
    autoSize: {
      default: { minRows: 2, maxRows: 3 },
      type: Object as PropType<{ minRows: number; maxRows: number }>,
      require: false,
    },
    placeholder: {
      default: "",
      require: false,
    },
    maxlength: {
      type: Number,
      require: false,
    },
  },
  setup(props, { emit }) {
    const value: Ref<string> = ref(props.value);
    const currentLength = ref(value.value.length);
    watch(
      () => props.value,
      () => {
        value.value=props.value
        currentLength.value = value.value.length;
      },
      { deep: true }
    );
    watch(
      () => value,
      () => {
        currentLength.value = value.value.length;
        emit("update:value", value.value);
      },
      { deep: true }
    );
    return {
      value,
      currentLength,
    };
  },
});
</script>

<style lang="less">
.number-input-wrap {
  position: relative;
  .text-number {
    position: absolute;
    bottom: 0;
    right: 5px;
    color: #c3df5d;
    .current-text-length{
        font-style: normal;
    }
    .error{
        color: red;
    }
  }
}
</style>
