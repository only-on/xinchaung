<template>
  <common-card title="题目">
    <template #tip>
      <span>题数：{{topInfo.num}}</span>
      <span>总分：{{topInfo.totalScore}}</span>
    </template>
    <template #right>
      <a-button type="primary" @click="setScore" class="brightBtn">批量设置分值</a-button>
      <a-button type="primary" @click="handleSelect">选择题目</a-button>
    </template>
    <template #content>
      <a-config-provider>
        <a-table
          :columns="columns"
          :data-source="listData"
          row-key="id"
          :pagination="false"
          :customRow="customRow"
        >
          <template v-slot:bodyCell="{ column, record:record1, index:index1 }">
            <template v-if="column.dataIndex === 'type'">
              <i class="iconfont icon-tuozhuai"></i>
              {{getTopicType[record1.type].name}}
            </template>
            <template v-if="column.dataIndex === 'operation'">
              <a-button type="link" @click="delOuter(record1, index1)">删除</a-button>
            </template>
          </template>
          <template #expandedRowRender="{record:record2, index:index2}">
            <a-form :model="record2.data" ref="tableFormRef">
              <a-table
              class="innerTable"
                :columns="innerColumns"
                :data-source="record2.data"
                row-key="id"
                :pagination="false"
                :customRow="innerCustomRow"
                :data-index="index2"
              >
                <template v-slot:bodyCell="{ column, record, index }">
                  <template v-if="column.dataIndex === 'id'">
                    <i class="iconfont icon-tuozhuai"></i>
                    {{record.id}}
                  </template>
                  <template v-if="column.dataIndex === 'question'">
                    <span class="a-link">{{record.question}}</span>
                  </template>
                  <template v-if="column.dataIndex === 'difficulty'">
                    <span class="level" :style="{background: levelTypeList[record.difficulty].bgColor,color: levelTypeList[record.difficulty].color}">
                      {{levelTypeList[record.difficulty].name}}
                    </span>
                  </template>
                  <template v-if="column.dataIndex === 'score'">
                      <a-form-item :name="[index, 'score']" :rules="validateNum">
                        <a-input class="scoreInput" type="text" v-model:value="record.score" @blur="handleBlur"></a-input>
                      </a-form-item>
                  </template>
                  <template v-if="column.dataIndex === 'operation'">
                    <a-button type="link" @click="delInner(record, index)">移除</a-button>
                  </template>
                </template>
              </a-table>
            </a-form>
          </template>
        </a-table>
        <template #renderEmpty>
          <Empty type="tableEmpty" />
        </template>
      </a-config-provider>
    </template>
  </common-card>
  <!-- 批量设置 -->
  <a-modal v-model:visible="modelVisible" title="批量设置分数" class="settingModal" :width="640">
    <a-checkbox-group v-model:value="checkArr" style="width: 100%" @change="changeCheck">
      <a-form :model="batchData" ref="batchFormRef">
          <a-row>
            <a-col :span="12" v-for="(item,index) in batchData" :key="index" class="customCol">
              <a-checkbox :value="item.type">
                <span class="questionType">{{item.name}}</span>
              </a-checkbox>
                <a-form-item :name="[index, 'score']" :rules="checkArr.includes(item.type) ? validateNum : {}">
                  <a-input class="scoreInput" type="text" v-model:value="item.score" :disabled="!checkArr.includes(item.type)"></a-input>分/题
                </a-form-item>
            </a-col>
          </a-row>
      </a-form>
    </a-checkbox-group>
    <template #footer>
      <Submit @submit="saveSetting" @cancel="cancelSetting"></Submit>
    </template>
  </a-modal>
  <!-- 选择题目 -->
  <addQuestion v-model:visible="addVisible" @select="questionSelect" :allQuestionIds="allQuestionIds" />
</template>
<script lang="ts" setup>
import { ref, reactive, watch, onMounted, provide } from "vue";
import CommonCard from "src/components/common/CommonCard.vue";
import Submit from "src/components/submit/index.vue";
import addQuestion from './addQuestion.vue'
import markedEditor from "src/components/editor/markedEditor.vue";
import { message } from "ant-design-vue";
import getTopicType from "src/components/TopicDisplay/topictype"
import {TotalScore} from "src/utils/common"
import {validateNum} from "../utils"
import { levelTypeList } from 'src/components/TopicDisplay/configType'
// @ts-ignore 类型声明需要完善，此处先用注解压制错误
import {renderMarkdown} from  '@xianfe/antdv-markdown';
import { removeHtmlAllTag } from 'src/utils/htmlLabel'

const props = defineProps({
  data: Array,
  pageInfo: {
    type: Object,
    require: true,
    default: {},
  },
});
const emit = defineEmits<{
  (e: "delete", type:string, val: any, outerIndex?:any): void;
  (e: "update:pageInfo", val: any): void;
  (e: "update:data", val: any): void;
}>();
var listData = ref<any>([]); // 表格当前页展示的数据
const columns = [
  {
    title: "题目类型",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "题目数量",
    dataIndex: "num",
    key: "num",
  },
  {
    title: "题目总分",
    dataIndex: "score",
    key: "score",
  },
  {
    title: "操作",
    dataIndex: "operation",
    key: "operation",
  },
];
const innerColumns = [
  {
    title: "编号",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "题目",
    dataIndex: "question",
    key: "question",
    ellipsis: true
  },
  {
    title: "难度",
    dataIndex: "difficulty",
    key: "difficulty",
  },
  {
    title: "分数",
    dataIndex: "score",
    key: "score",
  },
  {
    title: "操作",
    dataIndex: "operation",
    key: "operation",
  },
];
const topInfo = reactive({
  num: 0,
  totalScore: 0
})
const modelVisible = ref<boolean>(false)
var sourceIndex:any = null
var targetIndex:any = null
var innerSourceIndex:any = null
var innerTargetIndex:any = null
var outerIndex:any = null
const checkArr = ref<string[]>([])
const checkDetail = () => {

}
// 批量设置分数表单验证
const batchFormRef = ref<any>()
const batchData = reactive<any>([])
onMounted(()=>{
  for (let i in getTopicType) {
    batchData.push({
      type: i,
      name: getTopicType[i].name,
      score: '',
      disabled: true
    })
  }
})
// 选择的题目
const questionSelect = (data:any) => {
  data.forEach((item:any) => {
    let isExitType = listData.value.filter((a:any) => item.kind === a.type).length
    let questionItem:any = {
      id: item.id,
      question: item.question,
      difficulty: item.difficulty,
      score: item.score
    }
    // 已选的题目里面不存在当前选择题目的类型
    if (!isExitType) {
      listData.value.push({
        id: listData.value.length, // 表格展开
        type: item.kind,
        data: [questionItem]
      })
    } else {
      listData.value.forEach((outerItem:any,index:any) => {
        if (item.kind === outerItem.type) {
          let isExit = outerItem.data.filter((innerItem:any) => innerItem.id === questionItem.id).length
          if (isExit) return
          outerItem.data.push(questionItem)
        }
      })
    }
  })
  handleStatistical()
}
const customRow = (record:any,index:any) => {
  return {
    style: {
      cursor: "move",
    },
    // 鼠标移入
    onMouseenter: (event:any) => {
      // 兼容IE
      var ev = event || window.event;
      ev.target.draggable = true;
    },
    // 开始拖拽
    onDragstart: (event:any) => {
      // 兼容IE
      var ev = event || window.event;
      // 阻止冒泡
      ev.stopPropagation();
      sourceIndex = index
    },
    // 拖动元素经过的元素
    onDragover: (event:any) => {
      // 兼容 IE
      var ev = event || window.event;
      // 阻止默认行为
      ev.preventDefault();
    },
    // 鼠标松开
    onDrop: (event:any) => {
      // 兼容IE
      var ev = event || window.event;
      // 阻止冒泡
      ev.stopPropagation();
      targetIndex = index;
      if (!sourceIndex) return
      [listData.value[sourceIndex], listData.value[targetIndex]] = [listData.value[targetIndex], listData.value[sourceIndex]]
      emit("update:data", listData.value);
      // console.log('外层target', targetIndex)
      // console.log('外层sourceIndex', sourceIndex)
    },
  };
}
// 内层表格
const innerCustomRow = (record:any,index:any) => {
  return {
    style: {
      cursor: "move",
    },
    // 鼠标移入
    onMouseenter: (event:any) => {
      // 兼容IE
      var ev = event || window.event;
      ev.target.draggable = true;
      outerIndex = ev.target.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('data-index')
    },
    // 开始拖拽
    onDragstart: (event:any) => {
      // 兼容IE
      var ev = event || window.event;
      // 阻止冒泡
      ev.stopPropagation();
      innerSourceIndex = index
      outerIndex = ev.target.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('data-index')
      // 外层index初始化
      sourceIndex = null
      targetIndex = null
      console.log('开始', outerIndex)
    },
    // 拖动元素经过的元素
    onDragover: (event:any) => {
      // 兼容 IE
      var ev = event || window.event;
      // 阻止默认行为
      ev.preventDefault();
    },
    // 鼠标松开
    onDrop: (event:any) => {
      // 兼容IE
      var ev = event || window.event;
      // 阻止冒泡
      ev.stopPropagation();
      innerTargetIndex = index;
      let endIndex = ev.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('data-index')
      console.log('结束', endIndex)
      // 判断移出的和移入的是否是同一个表格
      if (outerIndex !== endIndex) return
      var temp:any = listData.value[outerIndex].data
      var source = listData.value[outerIndex].data[innerSourceIndex]
      temp.splice(innerSourceIndex,1)
      temp.splice(innerTargetIndex,0,source)
      emit("update:data", listData.value);
    },
  };
}
// 删除
const delOuter = (record: any, index: any) => {
  listData.value.splice(index,1)
}
const delInner = (record: any, index: any) => {
  listData.value[outerIndex].data.splice(index,1)
};
// 统计总分及题目数量
const handleStatistical = (setItem:Boolean=false) => {
  topInfo.totalScore = 0
  topInfo.num = 0
  listData.value.forEach((item:any) => {
    topInfo.num += item.data.length
    item.num = item.data.length
    item.score = TotalScore(item.data, 'score')
    if (setItem) {
      batchData.forEach((batchItem:any) => {
      if (batchItem.type === item.type && batchItem.score) {
          item.score = 0
          item.data.forEach((questionItem:any) => {
            item.score += Number(batchItem.score)
            questionItem.score = batchItem.score // 每道题分值
          })
        }
      })
    }
  })
  topInfo.totalScore = TotalScore(listData.value, 'score')
}
// 批量设置分值
const setScore = () => { 
  modelVisible.value = true
  checkArr.value.length = 0
  batchFormRef.value?.resetFields()
}
const changeCheck = (checkedValue:any) => {
  checkArr.value = checkedValue
  batchData.forEach((item:any,index:any) => {
    if (!checkedValue.includes(item.type)) {
      item.score = ''
      // batchFormRef.value.clearValidate([index, 'score'])
    }
  })
}
// 保存设置
const saveSetting = () => {
  batchFormRef.value.validate().then(()=>{
    modelVisible.value = false
    handleStatistical(true)
  })
}
const cancelSetting = () => {
  modelVisible.value = false
}
// 选择题目
const addVisible = ref<boolean>(false)
const handleSelect = () => {
  addVisible.value = true
}
const handleBlur = () => {
  topInfo.totalScore = 0
  topInfo.num = 0
  listData.value.forEach((item:any) => {
    topInfo.num += item.data.length
    item.score = TotalScore(item.data, 'score')
  })
  topInfo.totalScore = TotalScore(listData.value, 'score')
}
// 内层表格表单验证
const tableFormRef = ref<any>()
const tablefromValidate = () => {
  return new Promise((resolve: any, reject: any) => {
    if (!tableFormRef.value) {
      resolve()
      return
    }
    tableFormRef.value?.validate().then(() => {
      resolve()
    })
  })
}
watch(
  () => props.data,
  (newVal:any) => {
    listData.value = JSON.parse(JSON.stringify(newVal))
    handleStatistical()
  },
  { deep: true, immediate: true }
);
const questions_ids = ref<any>([])
const allQuestionIds = reactive<any>([]) // 所有选中题目的id数组
// provide('selectIds', allQuestionIds)
// 监测表格数据，计算统计数据
watch(()=>listData.value, newVal => {
  allQuestionIds.length = 0
  questions_ids.value.length = 0
  newVal.forEach((item:any) => {
    item.data.forEach((dItem:any) => {
      // 处理makrdown显示问题
      if(['choice','judge','blank','short-answer'].includes(item.type)) {
        // @ts-ignore
        dItem.question = removeHtmlAllTag(renderMarkdown(true, dItem.question))
      }
      allQuestionIds.push(dItem.id)
      questions_ids.value.push(
        {
          id: dItem.id,
          score: dItem.score
        }
      )
    })
  })
  console.log(listData.value)
  handleStatistical()
},{ deep: true, immediate: true })
defineExpose({
  questions_ids,
  tablefromValidate
})
</script>
<style lang="less" scoped>
.ant-table {
  .ant-btn {
    padding-left: 0;
  }
  .scoreInput{
    width: 100px;
  }
  .icon-tuozhuai{
    color: var(--black-45);
  }
}
.innerTable :deep(.ant-table) {
  tr{
    background: #fbfbfb;
  }
  .ant-table-thead > tr > th{
    background: #fbfbfb;
  }
  .ant-form-item{
    margin-bottom: 0;
  }
  .level {
          display: inline-block;
          padding: 0 18px;
          background-color: rgba(81,176,72,0.15);
          border-radius: 12px;
          color: #51b048;
        }
}
.ant-pagination{
  margin-top: 20px;
}
.settingModal{
  .customCol{
    display: flex;
    align-items: center;
  }
  .ant-input{
    width: 100px;
    display: inline-block;
    margin-right: 5px;
  }
  .ant-checkbox-wrapper{
    margin-bottom: 20px;
  }
  .questionType{
    margin: 0 10px
  }
}
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
