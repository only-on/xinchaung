<template>
  <div class="labelSearchBox">
    <div v-for="v in props.list" :key="v.value" class="labelSearch">
      <div class="title" v-if="v.title">{{ v.title }}：</div>
      <div class="labelBox">
        <div
          v-for="i in v.data"
          :key="`${v.keyName}${i.name}`"
          class="label-btn"
          :class="(i.name && i.value === v.value) ? 'current' : ''"
          @click="change(v, i)"
        >
          {{ i.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup="props">
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  computed,
  toRefs,
  watch,
  defineExpose,
  defineProps,
  withDefaults,
  useAttrs,
} from "vue";
interface ILabelData {
  title?: string; // 分类的标题
  value: number | string; // 默认选中值
  keyName: string; // 绑定值  对应的key
  data: any[]; // 全部标签 {标签名，标签绑定值}
}
interface Props {
  list: ILabelData[];
}
// 演示
// const list:any=reactive([
//   {title:'镜像属性',value:0,keyName:'type',data:[{name:'全部',value:0},{name:'内置镜像',value:1},{name:'我的镜像',value:2},]},
//   {title:'镜像标签',value:0,keyName:'label',data:[{name:'全部',value:0},{name:'数据标注',value:1},{name:'目标监测',value:2},{name:'数据标注',value:3},{name:'目标监测',value:4},]}
// ])
const props = withDefaults(defineProps<Props>(), {
  list: () => [],
});

let labelObj: any = reactive({});
props.list && props.list.length
  ? props.list.forEach((v: ILabelData) => {
      labelObj[v.keyName] = v.value;
    })
  : "";

const emit = defineEmits<{
  (e: "change", obj: any): void;
}>();
const change = (v: any, i: any) => {
  v.value = i.value;
  labelObj[v.keyName] = i.value;
  emit("change", labelObj);
};

watch(() => props.list, (val) => {
  labelObj = {}
}, {
  deep: true
})

defineExpose({
  labelObj,
});
</script>
<style scoped lang="less">
.labelSearch {
  color: var(--black-65);
  margin-bottom: 18px;
  display: flex;
  // align-items: center;
  .title {
    // margin-right: 16px;
    width: 80px;
    // line-height: 44px;
  }
  .labelBox{
    flex:1;
    // line-height: 44px;
  }
  .label-btn {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    padding: 0px 20px;
    color: var(--black-65);
    cursor: pointer;
    // width:70px;
  }
  .current {
    background-color: var(--primary-color);
    color: var(--white-100);
  }
}
</style>
