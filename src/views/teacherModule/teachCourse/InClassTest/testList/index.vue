<template>
  <div>
    <div class="testlistItem" v-for="itemValue in datalist">
      <div class="testlistItemCon">
      <div class="itemLeft">
        <div>
          <p class="quesTitle">
            {{ itemValue.question }}
            <span class="score">({{ itemValue.score }}分)</span>
          </p>
          <div
          v-if="itemValue.type_id==2"
            v-for="(item,index) in itemValue.options"
            :key="item.id"
            :class="['itemcon',ifCorrect(itemValue.answer,item.id) ? 'right' : 'wrong']"
            
          >
            <span class="option">选项{{optionsNames[index] }}:</span>
            <span>{{ item.option }}</span>
          </div>
          <div
          v-if="itemValue.type_id==5"
          >
            <span class="answer right">答案:</span>
            <span class="right">{{itemValue.answer[0].answer}}</span>
          </div>
        </div>
      </div>
      <div class="itemRight">
        <div class="pie">
          <a-progress
            class="pie-circle-inner"
            type="circle"
            :percent="itemValue.correct_rate"
            strokeColor="#FF9544"
            :width="70"
            :showInfo="false"
            :strokeWidth="15"
            stroke-linecap="square"
          />
          <a-progress
            class="pie-circle"
            type="circle"
            :percent="itemValue.submission_rate"
            strokeColor="#00CBC2"
            :width="120"
            :showInfo="false"
            :strokeWidth="10"
            stroke-linecap="square"
          />
        </div>

        <div class="rate">
          <div class="correctRate">正确率： <span>{{itemValue.correct_rate}}</span>%</div>
          <div class="submitRate">提交率：<span>{{itemValue.submission_rate}}</span>%</div>
        </div>
      </div>
      <div class="delete" @click="deleteQues(itemValue.id)">
      <span class="icon iconfont icon-shanchu"></span>
    </div>
    </div> 
    </div> 
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, ref, toRef, inject, reactive, toRefs, onMounted } from "vue";
import request from 'src/api/index'
import { Modal, message } from "ant-design-vue";
const http = (request as any).teacherInclassTest;
const itemValue: any = ref("");
interface Props {
  datalist: any;
}
const props = withDefaults(defineProps<Props>(), {
  datalist: () => {},
})
const optionsNames:any=ref(['A','B','C','D'])
const emit = defineEmits<{ (e: "deleteQues", val: any): void }>();
function deleteQues(id: any) {
  console.log(id);
  Modal.confirm({
        title: "提示",
        content: "确定要删除吗？删除之后不可恢复",
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          emit("deleteQues", id);
        }
      })
}
function ifCorrect(answers:any,id:any){
  const correctAnswer:any=[];
  answers?.forEach((e:any) => {
    correctAnswer.push(Number(e.answer))
  });
  if(correctAnswer.includes(id)){
    return true}}
</script>
<style lang="less" scoped>
.testlistItem {
  background: rgba(0, 0, 0, 0.04);
  width: 100%;
  display: flex;
  margin-bottom: 20px;
  >div{
    width: 100%;
  }
  .testlistItemCon {
    width:100%;
    display: flex;
    justify-content: space-between;
  }
  .itemLeft {
    width: 80%;
    padding: 20px;
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
    .answer{
        margin-right: 10px;
      }
      .correct{
        color: var(--cyan-100);
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
    padding: 20px;
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
      width: 120px;
      text-align: center;
      .correctRate {
        color: var(--primary-color);
        width: 100%;
      }
      .submitRate {
        color: var(--cyan-100);
        width: 100%;
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
