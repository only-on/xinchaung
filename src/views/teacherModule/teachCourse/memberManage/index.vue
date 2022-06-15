<template>
  <div id="memberManage">
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="学生"><student></student> </a-tab-pane>
      <a-tab-pane key="2" tab="分组"><group @updateGroup='updateGroup'></group></a-tab-pane>
      <a-tab-pane key="3" tab="助教"><assistant></assistant> </a-tab-pane>
    </a-tabs>
   <div class="tooTip" v-if="is_high&&is_teamed==false&&visableHigh">
      <div>有高配实验建议分组 <span class="icon-guanbi icon iconfont" @click="noshow"></span></div>
      <div class='sanjiao'></div>
   </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted} from "vue";
import student from "./student/index.vue";
import group from "./group/index.vue";
import assistant from "./assistant/index.vue";
interface Props {
  is_high:any;
  is_teamed:any
}
const props = withDefaults(defineProps<Props>(), {
  is_high: () =>false,
  is_teamed: () =>false,
})
const visableHigh:any=ref(true)
function callback() {}
function noshow(){
  visableHigh.value=false
}
const emit = defineEmits<{ (e: "updateGroup",groupok:any): void }>();
function updateGroup(val:any){
  visableHigh.value=val
  emit("updateGroup",val);
}
</script>

<style lang="less" scoped>
#memberManage {
  width: 100%;
  height: 714px;
  border-radius: 10px;
  box-shadow: 0 2px 4px 0 var(--black-0-7);
  background: var(--white-100);
  padding: 41px;
  margin-top:10px;
  position: relative;
}
.tooTip{
  width: 160px;
  height:25px;
  background-color: red;
  position:absolute;
  left: 110px;
  top:10px;
  color: white;
  padding-left: 10px;
  border-radius:12px;
}
.sanjiao{
  border-top:8px solid red;
  border-bottom:8px solid transparent;
  border-left:8px solid transparent;
  border-right:8px solid transparent;
  height: 0;
  width: 0;
  margin-left: 30px;
}
.icon-guanbi{
  font-size: 14px;
}
.icon-guanbi:hover{
  cursor: pointer;
}
</style>
