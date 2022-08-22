<template>
  <a-select
    v-model:value="lanuageVal"
    placeholder="请选择"
    :class="{customSelect: !inDrawer}"
    :label-in-value="true"
    :disabled="disabled"
    @change="changeSelect"
  >
    <a-select-option
      v-for="(item, index) in lanuageList"
      :key="index"
      :value="item.id"
    >
      {{ item.name }}
    </a-select-option>
  </a-select>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted,watch } from "vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
const props = withDefaults(
  defineProps<{
    inDrawer?: boolean;
    lang?: string,
    disabled?: boolean
  }>(),
  {
    inDrawer: false,
    lang: '',
    disabled: false
  }
);
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();
interface Ilist {
  id: number |string;
  name: string;
}
const http = (request as any).QuestionBank;
const lanuageVal = ref<any>({
  value: '',
  label: ''
});
const lanuageList = reactive<Ilist[]>([]);

// 获取语言配置
const getLanuage = () => {
  http.ojConfig().then((res: IBusinessResp) => {
    Object.assign(lanuageList, res.data.language);
    if (!lanuageList.length) return
    if (props.inDrawer) {
      lanuageList.unshift({
        id: '',
        name: 'ALL'
      })
    }
    lanuageVal.value = {
      value: lanuageList[0].id,
      label: lanuageList[0].name
    }
  });
};
watch(()=>props.lang, newVal => {
  if(newVal) {
    setTimeout(() => {
      let arr:any = lanuageList.filter((item:any) => item.name == newVal.toUpperCase())
      lanuageVal.value = {
        value: arr.length && arr[0].id,
        label: newVal.toUpperCase()
      }
    }, 400);
  }
},{immediate:true})
const changeSelect = () => {
  emit("change", {
    value:lanuageVal.value.value,
    label: Array.isArray(lanuageVal.value.label) ? lanuageVal.value.label[0].children : lanuageVal.value.label
  });
}
onMounted(() => {
  getLanuage();
});
</script>
<style lang="less" scoped>
.customSelect {
  &.ant-select {
    margin-right: 20px;
    // border: 1px solid var(--brightBtn);
    color: var(--brightBtn);
    margin-top: -3px;
    :deep(.ant-select-selector) {
      border: 1px solid var(--brightBtn) !important;
      color: var(--brightBtn);
      background: rgba(0, 0, 0, 0);
      width: 200px;
      height: 24px;
      line-height: 24px;
      box-shadow: none !important;
      .ant-select-selection-item {
        line-height: 22px;
      }
    }
    &.ant-select-open :deep(.ant-select-selection-item) {
      color: var(--brightBtn);
    }
    :deep(.ant-select-arrow) {
      color: var(--brightBtn);
    }
  }
}
</style>
>
