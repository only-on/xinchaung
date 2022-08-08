<template>
  <div class="labelSearchBox">
    <div v-for="(v, itemIndex) in props.list" :key="v.value" class="labelSearch">
      <div class="title" v-if="v.title">{{ v.title }}：</div>
      <div :class="['labelBox','textScrollbar',isOpen[itemIndex] ? 'open' : '']">
        <div
          v-for="(i,index) in v.data"
          :key="`${v.keyName}${i.name}${index}`"
          class="label-btn"
          :class="{'current': i.name && i.value === v.value, 'isEnd': index === (v.data.length && v.data.length-1) }"
          @click="change(v, i)"
        >
          {{ i.name }}
        </div>
      </div>
      <span class="fold-btn" v-show="showFold[itemIndex]" @click="handleFold(itemIndex)">
        更多
        <i :class="['iconfont', isOpen[itemIndex] ? 'icon-shouqi' : 'icon-zhankai']"></i>
      </span>
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
  nextTick
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
const isOpen = reactive<boolean[]>([false, false])
const showFold = reactive<boolean[]>([false, false])

let labelObj: any = reactive({});
props.list && props.list.length
  ? props.list.forEach((v: ILabelData) => {
      labelObj[v.keyName] = v.value;
    })
  : "";

const emit = defineEmits<{
  (e: "change", obj: any): void;
}>();
const handleFold = (index:any) => {
  isOpen[index] = !isOpen[index]
}
const change = (v: any, i: any) => {
  v.value = i.value;
  labelObj[v.keyName] = i.value;
  emit("change", labelObj);
};

watch(() => props.list, (val) => {
  labelObj = {}
  isOpen.length = 0
  showFold.length = 0
  for(let i =0; i < val.length; i++) {
    isOpen[i]=false
    showFold[i] = false
  }
  nextTick(()=>{
      let isEnd = document.getElementsByClassName('isEnd')
      if (isEnd.length) {
        let labelBox = document.getElementsByClassName('labelBox')
        for (let i = 0; i < labelBox.length; i++) {
          let labelBoxTop = (labelBox[i] as any).offsetTop
          let endLabelTop = (isEnd[i] as any).offsetTop
          // 最后一个标签距离labelBox顶部的距离
          if (endLabelTop - labelBoxTop > 0) {
            showFold[i] = true
          }
        }
        
      }
    })
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
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  position:relative;
  // align-items: center;
  .title {
    // margin-right: 16px;
    width: 80px;
    line-height: 30px;
  }
  .labelBox{
    flex:1;
    // line-height: 44px;
    max-height:30px;
    overflow: hidden;
    margin-right: 50px;
    &.open{
        max-height: 120px;
        overflow: auto;
      }
  }
    .fold-btn{
        cursor: pointer;
        color: var(--black-45);
        position: absolute;
        right: 0;
        top: 4px;
        i{
          font-size: 14px;
        }
        &:hover{
          color: var(--primary-color);
        }
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
