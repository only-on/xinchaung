<template>
  <div class="testlistItem">
    <div class="testlistItemCon">
      <div class="itemLeft">
        <div>
          <p class="quesTitle">
            {{ itemValue.title }}
            <span class="score">({{ itemValue.score }}分)</span>
          </p>
          <div
            v-for="item in itemValue.answer"
            :key="item.id"
            :class="['itemcon', item.id == 3 ? 'right' : 'wrong']"
          >
            <span class="option">选项{{ item.id }}:</span>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
      <div class="itemRight">
        <div class="pie">
          <a-progress
            class="pie-circle-inner"
            type="circle"
            :percent="75"
            strokeColor="#FF9544"
            :width="70"
            :showInfo="false"
            :strokeWidth="15"
            stroke-linecap="square"
          />
          <a-progress
            class="pie-circle"
            type="circle"
            :percent="55"
            strokeColor="#00CBC2"
            :width="120"
            :showInfo="false"
            :strokeWidth="10"
            stroke-linecap="square"
          />
        </div>

        <div class="rate">
          <div class="correctRate">正确率：70%</div>
          <div class="submitRate">提交率：40%</div>
        </div>
      </div>
    </div>

    <div class="delete" @click="deleteQues(itemValue.id)">
      <span class="icon iconfont icon-shanchu"></span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, ref, toRef, inject, reactive, toRefs, onMounted } from "vue";
import request from 'src/api/index'
const http = (request as any).teacherInclassTest;
const itemValue: any = ref("");
itemValue.value = {
  id: "198",
  title:
    "声意形置实我集还图路而表党场争行四取至全严土适准山月新才变天将自先产除积四九色是明起龙合基整厂标心公阶。真解即天劳龙对化三是效可象上强步任更做线百收样前住圆理机信造即史带件想置别它",
  score: 10,
  answer: [
    { id: 1, name: "好设计是诚实的" },
    { id: 2, name: "改变别人之前，先改变自己" },
    { id: 3, name: "不怕输才会赢" },
  ],
};
const emit = defineEmits<{ (e: "deleteQues", val: any): void }>();
function deleteQues(id: any) {
  console.log(id);
  emit("deleteQues", id);
}
function getListData(){
  http.inClasstestList({urlParams:{content_id:50000}}).then((res:any)=>{
    console.log(res,'jjjjjjjjjjjjjjj')
  })
}
onMounted(()=>{
  getListData()
})
</script>
<style lang="less" scoped>
.testlistItem {
  background: rgba(0, 0, 0, 0.04);
  width: 100%;
  display: flex;
  .testlistItemCon {
    width: 99%;
    padding: 20px;
    display: flex;
    justify-content: space-between;
  }
  .itemLeft {
    width: 80%;
    .quesTitle {
      margin-bottom: 16px;
      .score {
        margin-left: 16px;
        color: var(--primary-color);
      }
    }
    .itemcon {
      margin-bottom: 14px;
      .option {
        margin-right: 10px;
      }
    }
    .itemcon:nth-last-child(1) {
      margin-bottom: 0;
    }
    .right {
      color: var(--green-1);
    }
    .wrong {
      color: var();
    }
  }
  .itemRight {
    width: 19%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    :deep(.ant-progress-circle-trail) {
      stroke: var(--white-100);
    }
    .pie {
      width: 120px;
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      .pie-circle {
        position: absolute;
        left: 0px;
        top: 0px;
      }
      .pie-circle-inner {
        position: absolute;
        left: 25px;
        top: 25px;
      }
    }
    .rate {
      .correctRate {
        color: var(--cyan-100);
      }
      .submitRate {
        color: var(--primary-color);
      }
    }
  }
  .delete {
    width: 30px;
    height: 30px;
    background: var(--gray-7);
    border-bottom-left-radius: 100%;
    line-height: 30px;
    text-align: center;
    padding-left: 5px;
  }
  .delete:hover {
    cursor: pointer;
  }
}
</style>
