<template>
  <div>
    <a-drawer
      class="addQuestion"
      :destroyOnClose="true"
      :closable="false"
      placement="right"
      :visible="visible"
      width="1300"
      @close="closeDrawer"
    >
    <div class="select flexCenter">
      <div class="flexCenter type">
        <span @click="selectType(1)" :class="{active: selectNum === 1}"> 公开题库 </span>
        <span @click="selectType(2)" :class="{active: selectNum === 2}"> 我的题库 </span>
      </div>
      <span class="iconfont icon-guanbi" @click="closeDrawer"></span>
    </div>
      <questionBank :inDrawer="true" :activeTab="selectNum" @addData="handleAddData"/>
    </a-drawer>
  </div>
</template>
<script lang="ts" setup>
import{ref,reactive} from 'vue'
import questionBank from 'src/views/teacherModule/QuestionBank/index.vue'
const props =withDefaults(defineProps<{
  visible: boolean
}>(), {
  visible: false
})
const emit = defineEmits<{
  (e: "update:visible", val: any): void;
  (e: "select", val: any): void;
}>();
const selectNum = ref<number>(1)
const selectType=(v:number)=>{
  selectNum.value=v
}
const closeDrawer = () => {
  emit('update:visible', false)
}
const handleAddData = (data:any) => {
  console.log(data)
  emit('select',data)
  emit('update:visible', false)
}
</script>
<style lang="less" scoped>
.addQuestion{
  .select{
    justify-content:space-between;
    margin-bottom:24px;
    border-bottom: 1px solid #E8E8E8;
    .type{
      span{
        border-bottom: 4px solid transparent;
        margin-right: 50px;
        padding-bottom: 8px;
        cursor: pointer;
        color:var(--black-45);
      }
      .active{
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
    }
    .iconfont{
      cursor:pointer;
    }
  }
}
</style>
