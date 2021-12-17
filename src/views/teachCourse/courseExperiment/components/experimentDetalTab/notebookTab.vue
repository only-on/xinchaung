<template>
  <div class="note-book-tab-box">
    <div class="note-book-tab-top">
      <div>
        <span class="experiment-name">{{detailInfo.name}}</span>
        <div class="experiment-type-or-class-count">
          <span>类型{{detailInfo.task_type.name}}</span>
          <span>课时数：{{detailInfo.class_cnt}}</span>
        </div>
      </div>
      <div>
        <span v-for="(item,index) in know_points" :key="index">{{item}}</span>
      </div>
    </div>
    <tabs v-model:currentKey="currentKey" @change="keyChange"/>
    <template v-if="currentKey === 1">
      <div class="data-set-box">
        <label>数据集</label>
        <span v-for="item in detailInfo.datasets" :key="item.uid">{{item.name}}</span>
      </div>
      <div class="experiment-task-box">
        <div class="experiment-task-title">试验任务</div>
        <div class="experiment-task-list">
          <div class="experiment-task-item" v-for="item in detailInfo.files" :key="item.id">
            {{item.file_name}}
          </div>
        </div>
      </div>
    </template>
    <template v-if="currentKey === 2">
      <report/>
    </template>
    <template v-if="currentKey === 3">
      <experiment-exercise/>
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs,inject,watch,ref } from "vue";
import report from "./report.vue"
import experimentExercise from "./experimentExercise.vue"
import tabs from "../tabs.vue"
export default defineComponent({
  components:{
    report,
    "experiment-exercise":experimentExercise,
    tabs
  },
  setup() {
    const reactiveData = reactive({
      // currentKey: 1,
    });
    const currentKey=ref(1)
     const detailInfo: any = inject("detailInfo");
    // const course_id = inject("course_id") as number;
    // const experiment_id: any = inject("experiment_id");
    const know_points=ref([])
    watch(()=>detailInfo,()=>{
      if (detailInfo.value.know_point&&detailInfo.value.know_point.knowledge_name) {
        know_points.value=detailInfo.value.know_point.knowledge_name.split(",")
      }
    },{deep:true,immediate:true})
    function keyChange(key: number) {
      currentKey.value = key;
    }
    return {
      detailInfo,
      keyChange,
      ...toRefs(reactiveData),
      know_points,
      currentKey
    };
  },
});
</script>


<style lang="less">
.note-book-tab-box {
  height: 100%;
  display: flex;
  flex-direction: column;
  .note-book-tab-top {
    background: linear-gradient(270deg, #d3ddff 0%, #e8f9ff);
    border-radius: 4px;
    box-shadow: 0px 3px 6px 0px undefined;
    padding: 27px 22px;
    > div {
      &:first-child {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        .experiment-name {
          font-size: 22px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .experiment-type-or-class-count {
          flex-shrink: 0;
          span {
            margin-left: 35px;
          }
        }
      }
      &:nth-child(2) {
        display: flex;
        flex-wrap: wrap;
        margin-top: 20px;
        > span {
          background: rgba(@theme-color, 0.2);
          border: 1px solid @theme-color;
          border-radius: 15px;
          padding: 4px 20px;
          margin: 0 10px;
          color: #7b65fa;
          &:first-child {
            margin-left: 0;
          }
        }
      }
    }
  }
  
  .data-set-box {
    display: flex;
    flex-direction: row;
    height: 80px;
    align-items: center;
    background: @white;
    padding: 0 15px;
    label {
      color: #000000;
      font-size: 16px;
      font-weight: 600;
      flex-shrink: 0;
    }
    span {
      width: 32%;
      margin-left: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      background: #fbfbfb;
      border: 1px solid #eaeaea;
      border-radius: 17px;
      padding: 0 10px;
    }
  }
  .experiment-task-box {
    margin-top: 20px;
    background: @white;
    padding: 15px;
    flex: 1;
    .experiment-task-title {
      font-size: 16px;
      font-weight: 600;
    }
    .experiment-task-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .experiment-task-item {
        border: 1px solid @theme-color;
        border-radius: 6px;
        width: 48%;
        margin-top: 15px;
        line-height: 35px;
        padding: 0 15px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .experiment-report-box{
    flex: 1;
    background: @white;
  }
}
</style>