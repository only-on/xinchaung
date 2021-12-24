<template>
  <div v-if="total>isShowNum">
    <a-pagination
      v-model:current="current"
      :total="total"
      @change="change"
      @showSizeChange="showSizeChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRef, toRefs, watch } from "vue";

export default defineComponent({
  props: {
    current: {
      default: 1,
      type: Number,
      required: false,
    },
    pageSize: {
      default: 10,
      type: Number,
      required: false,
    },
    total: {
      default: 0,
      type: Number,
      required: false,
    },
    isShowNum: {
      default: 10,
      type: Number,
      required: false,
    },
    pageSizeOptions: {
      default: ["10", "20", "30", "40"],
      type: Number,
      required: false,
    },
    showSizeChanger: {
      default: false,
      type: Boolean,
      required: false,
    },
  },
  emits: ["change", "showSizeChange"],
  setup(props, { emit }) {
    const reactiveData = reactive({
      current: 1,
      pageSize: 10,
      total: 0,
      pageSizeOptions: ["10", "20", "30", "40"],
      showSizeChanger: false,
    });
    Object.keys(props).forEach(function (key) {
      watch(
        function () {
          return props[key];
        },
        function () {
          reactiveData[key] = props[key];
        },{immediate:true}
      );
    });
    console.log(reactiveData);
    
    const method = {
      change(page: number, pageSize: number) {
        emit("change", page, pageSize);
      },
      showSizeChange(current: number, size: number) {
        emit("showSizeChange", current, size);
      },
    };
    return {
      ...toRefs(reactiveData),
      ...method,
    };
  },
});
</script>
