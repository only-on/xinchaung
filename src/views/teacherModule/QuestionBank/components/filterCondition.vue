<template>
<div>
  <div class="filter-condition">
    <div class="drop-down">
      <a-select v-model:value="props.searchInfo.kind" style="width: 200px" class="type" @change="changeType">
        <a-select-option value="">所有类型</a-select-option>
        <a-select-option :value="key" v-for="(item, key) in getTopicType" :key="item">{{item.name}}</a-select-option>
      </a-select>
      <a-select v-model:value="props.searchInfo.difficulty" style="width: 200px" class="level" @change="changeType">
        <a-select-option value="">所有难度</a-select-option>
        <a-select-option :value="key" v-for="(item, key) in levelTypeList" :key="item">{{item.name}}</a-select-option>
      </a-select>
      <a-select v-model:value="props.searchInfo.usedBy" style="width: 200px" class="use" @change="changeType">
        <a-select-option value="">所有用途</a-select-option>
        <a-select-option :value="key" v-for="(item, key) in useTypeList" :key="item">{{item.name}}</a-select-option>
      </a-select>
      <div class="drawerContent" v-if="inDrawer">
        <a-input-search 
          style="width: 254px"
          v-model:value="props.searchInfo.keyWord" 
          placeholder="请输入搜索关键词"
          @search="changeType"
          @keyup.enter="changeType" >
        </a-input-search>
        <a-button type="primary" @click="drawerAdd">添加</a-button>
      </div>
    </div>
    <div class="select-knowledge">
      <div class="selected">
        <span class="tit">所选知识点 >&nbsp;</span>
        <span class="selected-knowledge" v-if="visible">
          <!-- <span>{{currentCourse.knowledge_map_name}} > </span>
          <span v-for="(list, index) in currentKnowledge" :key="list.id">{{list.knowledge_map_name+(index !== currentKnowledge.length - 1 ? " /&nbsp;" : "")}}</span> -->
          <span>{{selectedCourseKnowledge}}</span>
          <span class="iconfont icon-guanbi pointer" @click="deleteKnowledge"></span>
        </span>
      </div>
      <div class="directive">
        <span 
          class="btn pointer"
          :class="[currentDirective==0?'current-directive':'']"
          @click="selectDirective(0)"
        >
          全部
        </span>
        <span 
          class="btn pointer" 
          v-for="list in directiveList" 
          :key="list.id"
          :class="[currentDirective==list.id?'current-directive':'']"
          @click="selectDirective(list.id)"
        >
          {{list.knowledge_map_name}}
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
              {{list.knowledge_map_name}}
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
              {{list.knowledge_map_name}}
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
import { onMounted, ref, reactive, watch } from 'vue'
import getTopicType from 'src/components/TopicDisplay/topictype'
import { levelTypeList, useTypeList } from 'src/components/TopicDisplay/configType'
import Submit from "src/components/submit/index.vue";
import { Modal, message } from "ant-design-vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
const http = (request as any).QuestionBank;
interface Props {
  searchInfo: any,
  inDrawer: boolean
}
const props = withDefaults(defineProps<Props>(), {
  searchInfo: {},
  inDrawer: false
});
const emit = defineEmits<{
  (e: "searchFn", obj?: any): void;
  (e: "add", obj?: any): void;
}>();
const visible = ref(false)
const selectKnowledgeVisible = ref(false)
const selectedCourseKnowledge = ref('')
const directiveList = reactive<IKnowledge[]>([])
const courseList = reactive<IKnowledge[]>([])
const knowledgeList = reactive<IKnowledge[]>([])
const currentDirective = ref(0)
const currentCourse = ref({
  id: 1,
  knowledge_map_name: ''
})
const currentKnowledge = ref<IKnowledge[]>([])
const currentKnowledgeId = ref<number[]>([])
const selectDirective = (id: number) => {
  // console.log(id)
  if (!id) {
    deleteKnowledge()
    return
  }
  currentDirective.value = id
  selectKnowledgeVisible.value = true
  // visible.value = false
  getKnowledgeSub(id, 'course')
}
const selectCourse = (list: IKnowledge) => {
  currentCourse.value = list
  knowledgeList.length = 0
  currentKnowledge.value = []
  currentKnowledgeId.value = []
  getKnowledgeSub(list.id, 'knowledge')
}
const selectKnowledge = (list: IKnowledge) => {
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
    knowledge_map_name: ''
  }
  currentDirective.value = 0
  selectKnowledgeVisible.value = false
  visible.value = false
  props.searchInfo.knowledgeIds = []
  emit('searchFn')
}
const onSubmit = () => {
  selectedCourseKnowledge.value = currentCourse.value.knowledge_map_name + ' > '
  currentKnowledge.value.forEach((v: {knowledge_map_name: string}, k: number) => {
    selectedCourseKnowledge.value = selectedCourseKnowledge.value + v.knowledge_map_name + (k!==currentKnowledge.value.length-1?' \\ ':'')
  })
  console.log(selectedCourseKnowledge.value)
  selectKnowledgeVisible.value = false
  visible.value = currentDirective.value!==0
  // console.log(currentKnowledge.value)
  // console.log(currentKnowledgeId.value)
  // console.log(currentCourse.value)
  props.searchInfo.knowledgeIds = currentKnowledgeId.value
  emit('searchFn')
}
const cancel = () => {
  deleteKnowledge()
}
const changeType = () => {
  emit('searchFn')
}
const drawerAdd = () => {
  emit('add')
}
const getKnowledgeFirst = () => {
  directiveList.length = 0
  http.getKnowledgeFirst().then((res: IBusinessResp) => {
    directiveList.push(...res.data)
  })
}
const getKnowledgeSub = (id: number, type: string) => {
  if (type==='course'){
    courseList.length = 0
    knowledgeList.length = 0
  } else {
    knowledgeList.length = 0
  }
  http.getKnowledgeSub({urlParams: {id}}).then((res: IBusinessResp) => {
    if (type==='course'){
      courseList.push(...res.data)
      courseList.length ? selectCourse(courseList[0]) : ''
    } else {
      knowledgeList.push(...res.data)
    }
  })
}
watch(()=>props.searchInfo.knowledgeIds, (newVal: any) => {
  if (!newVal.length) {
    visible.value = false
    selectKnowledgeVisible.value = false
    currentDirective.value = 0
  }
},{immediate: true, deep:true})
onMounted(() => {
  getKnowledgeFirst()
})

interface IKnowledge {
  id: number
  knowledge_map_name: string
}
</script>

<style lang="less" scoped>
.filter-condition {
  width: var(--center-width);
  margin: 0 auto;
  margin-top: 16px;
  .drop-down {
    display: flex;
    .ant-select {
      margin-right: 24px;
    }
    .drawerContent{
      flex: 1;
      .ant-btn{
        float: right;
      }
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