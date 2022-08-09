<template>
  <div class="BasicInfo">
    <div class="title flexCenter">
        <div>基础信息</div>
        <a-button type="primary" @click="edit()">编辑</a-button>
    </div>
    <div class="infoBox">
        <div class="item1 flexCenter">
            <div>作业名称：{{props.name}}</div>
            <div>起止时间：{{props.time}}</div>
        </div>
        <div class="item2">
            <div>作业说明：</div>
            <div class="text2">{{props.explainText}}</div>
        </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
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
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
const router = useRouter();
const route = useRoute();
const { editId } = route.query;
interface Props {
  name: string;
  time:string;
  explainText:string
}
const props = withDefaults(defineProps<Props>(), {
  name:'',
  time:'',
  explainText:'',
});

// const emit = defineEmits<{
//   (e: "selectedImage", val: any): void;
// }>();
const edit=()=>{

}
</script>
<style scoped lang="less">
  .BasicInfo{
    color: var(--black-65);
    
    .title{
      color: var(--black-85);
      justify-content: space-between;
      padding: 11px 0;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      margin-bottom: 24px;
    }
    .infoBox{
        height:144px;
        padding: 24px 40px;
        background-color: var(--white);
        .item1{
            margin-bottom: 24px;
            justify-content: space-between;
        }
        .item2{
            display:flex;
            .text2{
                flex:1;
            }
        }
    }
  }

</style>
