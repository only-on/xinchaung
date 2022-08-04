<template>
<div>
  <div class="filter-condition">
    <div class="drop-down">
      <a-select v-model:value="props.searchInfo.type" style="width: 200px" class="type" @change="changeType">
        <a-select-option value="">所有类型</a-select-option>
        <a-select-option :value="key" v-for="(item, key) in questionTypeList" :key="item">{{item.name}}</a-select-option>
      </a-select>
      <a-select v-model:value="props.searchInfo.level" style="width: 200px" class="level" @change="changeType">
        <a-select-option value="">所有难度</a-select-option>
        <a-select-option :value="key" v-for="(item, key) in levelTypeList" :key="item">{{item.name}}</a-select-option>
      </a-select>
      <a-select v-model:value="props.searchInfo.use" style="width: 200px" class="use" @change="changeType">
        <a-select-option value="">所有用途</a-select-option>
        <a-select-option :value="key" v-for="(item, key) in useTypeList" :key="item">{{item.name}}</a-select-option>
      </a-select>
    </div>
    <div class="select-knowledge">
      <div class="selected">
        <span class="tit">所选知识点 >&nbsp;</span>
        <span class="selected-knowledge" v-if="selectKnowledgeVisible">
          <span>{{currentCourse.name}} > </span>
          <span v-for="(list, index) in currentKnowledge" :key="list.id">{{list.name+(index !== currentKnowledge.length - 1 ? " /&nbsp;" : "")}}</span>
          <span class="iconfont icon-guanbi pointer" @click="deleteKnowledge"></span>
        </span>
      </div>
      <div class="directive">
        <span 
          class="btn pointer" 
          v-for="list in directive" 
          :key="list.id"
          :class="[currentDirective==list.id?'current-directive':'']"
          @click="selectDirective(list.id)"
        >
          {{list.name}}
        </span>
      </div>
    </div>
  </div>
  <div class="knowledge-box" v-show="selectKnowledgeVisible">
    <div class="content">
      <div class="main" :style="{height: currentDirective?'260px':0}">
        <div class="left">
          <div class="tit">相关课程</div>
          <div class="textScrollbar course-box">
            <div 
              class="course-list pointer"
              v-for="list in courseList" 
              :key="list.id"
              :class="[currentCourse.id==list.id?'current-course':'']"
              @click="selectCourse(list)"
            >
              {{list.name}}
            </div>
          </div>
        </div>
        <div class="right">
          <div class="knowledge-content textScrollbar">
            <span
              class="knowledge-list pointer"
              v-for="list in knowledgeList"
              :key="list.id"
              :class="[currentKnowledgeId.includes(list.id)?'current-knowledge':'']"
              @click="selectKnowledge(list)"
            >
              {{list.name}}
            </span>
          </div>
        </div>
      </div>
      <div class="footer" v-if="currentDirective">
        <Submit @submit="onSubmit" @cancel="cancel"></Submit>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { questionTypeList, levelTypeList, useTypeList } from "./../questionConfig"
import Submit from "src/components/submit/index.vue";
import { Modal, message } from "ant-design-vue";
interface Props {
  searchInfo: any
}
const props = withDefaults(defineProps<Props>(), {
  searchInfo: {}
});
const emit = defineEmits<{
  (e: "searchFn", obj?: any): void;
}>();
const selectKnowledgeVisible = ref(false)
const directive = [
  {id: 0, name: '全部'},
  {id: 100, name: '程序设计语言'},
  {id: 1, name: '计算机基础'},
  {id: 2, name: '计算机系统能力'},
  {id: 3, name: '算法设计'},
  {id: 4, name: '云计算与大数据'},
  {id: 5, name: '数据库'},
  {id: 6, name: '人工智能'},
  {id: 7, name: '电子信息'},
  {id: 8, name: 'Web开发'},
  {id: 9, name: '软件工程'},
  {id: 10, name: '网络与安全'},
  {id: 11, name: '区块链'},
  {id: 12, name: '数学与统计'},
  {id: 13, name: '物联网'},
  {id: 14, name: '企业课程'},
  {id: 15, name: '虚拟仿真'},
  {id: 16, name: '经济管理'},
]
const courseList = [
  {id: 1, name: '多场景数据可视化数'},
  {id: 2, name: '虚拟化与云计算'},
  {id: 3, name: '数据可视化与Bl'},
  {id: 4, name: 'ETL工具离线日志采集与清'},
  {id: 5, name: 'Hadoop-离线数据分析'},
]
const knowledgeList = [
  {id: 1, name: '知识点1'},
  {id: 2, name: '知识点1'},
  {id: 3, name: '知识点1'},
  {id: 4, name: '知识点1'},
  {id: 5, name: '知识点1'},
  {id: 6, name: '知识点1'},
  {id: 7, name: '知识点1'},
  {id: 8, name: '知识点1'},
  {id: 9, name: '知识点1'},
  {id: 10, name: '知识点1'},
  {id: 11, name: '知识点1'},
  {id: 12, name: '知识点1'},
  {id: 13, name: '知识点1'},
  {id: 14, name: '知识点1'},
  {id: 15, name: '知识点1'},
  {id: 16, name: '知识点1'},
]
const currentDirective = ref(0)
const currentCourse = ref({
  id: 1,
  name: '多场景数据可视化数'
})
const currentKnowledge = ref<any[]>([])
const currentKnowledgeId = ref<number[]>([])
const selectDirective = (id: number) => {
  console.log(id)
  currentDirective.value = id
  id ? selectKnowledgeVisible.value = true : selectKnowledgeVisible.value = false
}
const selectCourse = (list: any) => {
  currentCourse.value = list
}
const selectKnowledge = (list: any) => {
  let index = currentKnowledgeId.value.indexOf(list.id)
  if (index !== -1) {
    currentKnowledge.value.splice(index, 1)
    currentKnowledgeId.value.splice(index, 1)
  } else {
    if (currentKnowledge.value.length >= 3) {
      message.warn("最多选择3个知识点")
    } else {
      currentKnowledge.value.push(list)
      currentKnowledgeId.value.push(list.id)
    }
  }
}
const deleteKnowledge = () =>  {
  currentKnowledge.value = []
  currentKnowledgeId.value = []
  currentCourse.value = {
    id: 1,
    name: ''
  }
  selectKnowledgeVisible.value = false
}
const onSubmit = () => {
  selectKnowledgeVisible.value = false
  console.log(currentKnowledge.value)
  console.log(currentKnowledgeId.value)
  console.log(currentCourse.value)
  props.searchInfo.knowledge = currentKnowledgeId.value
  emit('searchFn')
}
const cancel = () => {
  currentDirective.value = 0
  selectKnowledgeVisible.value = false
}
const changeType = () => {
  emit('searchFn')
}
</script>

<style lang="less" scoped>
.filter-condition {
  width: var(--center-width);
  margin: 0 auto;
  margin-top: 16px;
  .drop-down {
    .ant-select {
      margin-right: 24px;
    }
  }
  .select-knowledge {
    .selected {
      margin-top: 10px;
      padding-bottom: 8px;
      border-bottom: 1px dashed var(--black-15);
      font-size: var(--font-size-sm);
      .tit {
        color: var(--black-45);
        height: 22px;
        line-height: 22px;
        display: inline-block;
      }
      .selected-knowledge {
        border: 1px solid var(--brightBtn);
        border-radius: 12px;
        color: var(--brightBtn);
        height: 22px;
        line-height: 20px;
        display: inline-block;
        padding: 0 10px;
        .iconfont {
          margin-left: 16px;
          font-size: var(--font-size-sm);
        }
      }
    }
    .directive {
      padding: 10px 0;
      .btn {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        padding: 0 19px;
        margin: 0 1px;
        border-radius: 15px;
        margin-bottom: 1px;
        &:hover,
        &.current-directive {
          color: var(--white);
          background-color: var(--primary-color);
        }
      }
    }
  }
}
.knowledge-box {
  border-top: 1px solid var(--black-15);
  position: relative;
  .content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    box-shadow: 0px 3px 6px 0px var(--black-15); 
    z-index: 2;
    background-color: var(--white);
    .main {
      width: var(--center-width);
      margin: 0 auto;
      display: flex;
      height: 260px;
      .left {
        width: 300px;
        margin-right: 40px;
        background-color: #f2f2f3;
        padding: 24px 0 0 32px;
        .course-box {
          max-height: 195px;
          overflow: auto;
        }
        .tit {
          font-weight: 700;
          color: var(--black-85);
          margin-bottom: 20px;
        }
        .course-list {
          color: var(--black-85);
          margin-bottom: 12px;
          &:hover,
          &.current-course {
            color: var(--primary-color);
          }
        }
      }
      .right {
        flex: 1;
        margin-top: 24px;
        .knowledge-content {
          overflow: auto;
          max-height: 236px;
        }
        .knowledge-list {
          display: inline-block;
          height: 24px;
          line-height: 24px;
          padding: 0 14px;
          border-radius: 12px;
          border: 1px solid var(--lightgray-6);
          margin-right: 24px;
          margin-bottom: 24px;
          &:hover,
          &.current-knowledge {
            color: var(--primary-color);
            border-color: var(--primary-color);
          }
        }
      }
    }
    .footer {
      border-top: 1px solid var(--black-15);
      padding: 10px 0;
    }
  }
}
</style>
