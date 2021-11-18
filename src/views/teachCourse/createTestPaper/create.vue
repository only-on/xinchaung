<template>
  <div class="create-test-paper" v-layout-bg>
    <div class="create-top">
      <a-form
        ref="formRef"
        :model="formSate"
        :rules="{testName: {required: true,message: '请输入测试卷名称',}}"
        layout="vertical"
      >
        <a-form-item label="测试卷名称" required>
          <a-input v-model:value="formSate.testName"/>
        </a-form-item>
      </a-form>
      <a-dropdown placement="bottomCenter">
        <a-button type="primary" class="add">添加试题</a-button>
        <template #overlay>
          <a-menu @click="clickAddPaper">
            <a-menu-item v-for="(type) in paperType" :key="type.id">{{type.name}}</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <a-dropdown placement="bottomCenter">
        <a-button type="primary">选择试题</a-button>
        <template #overlay>
          <a-menu @click="clickSelectPaper">
            <a-menu-item v-for="(type) in paperType" :key="type.id">{{type.name}}</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <!-- 试题列表 -->
    <div class="create-content">
      <test-paper-list v-model="paperLists"></test-paper-list>
    </div>
    <div class="btns">
      <a-button @click="cancel">取消</a-button>
      <a-button type="primary" @click="createHandle">{{paper_id?"更新":"创建"}}</a-button>
    </div>
  </div>
  <add-single-modal v-model:isShow="isShowSingle" :addType="addType" @addPaperContent="addPaperContent" @getPCatalogueList="getPCatalogueList"></add-single-modal>
  <select-paper-draw v-model:isShow="isShowDraw" v-model:selectType="selectType" v-model="formSate.paperLists"></select-paper-draw>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, onMounted, provide, inject, watch, nextTick, PropType } from 'vue'
import { message } from 'ant-design-vue'
import addSingleModal from './addSingleModal.vue'
import testPaperList from './testPaperList.vue'
import selectPaperDraw from './selectPaperDraw.vue'
import request from 'src/api/index'
import { IformSate, IPaperList, Ihttp, IpaperType, Ilist } from './typings'
import { IBusinessResp } from 'src/typings/fetch.d'
import {useRoute,useRouter} from "vue-router"

export default defineComponent({
  name: '',
  components: { addSingleModal, testPaperList, selectPaperDraw },
  props: {},
  emit: [],
  setup() {
    const route = useRoute()
    const router=useRouter()
    let course_id = route.query.course_id
    const paper_id=route.query.paper_id
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:false,componenttype:undefined})
    const http = (request as Ihttp).teachCourse
    const examApi=request.studentExam
    // 试题名称
    let formSate = reactive<IformSate>({
      testName: '',
      paperLists: []
    })

    let isShowSingle = ref(false)
    let addType = ref(0)
    onMounted(()=>{
      getQuestionsList()
    })
    // 点击添加试题
    const clickAddPaper = ({key}: {key: string}) => {
      // if(!formSate.testName) {
      //   message.warning('请填写测试卷名称')
      //   return 
      // }
      console.log('clickAddPaper', key)
      addType.value = Number(key)
      isShowSingle.value = true
    }

    let isShowDraw = ref(false)
    let selectType = ref(0)
    // 点击选择试题
    const clickSelectPaper = ({key}: {key: string}) => {
      console.log('clickAddPaper', key)
      // if(!formSate.testName) {
      //   message.warning('请填写测试卷名称')
      //   return 
      // }
      selectType.value = Number(key)
      isShowDraw.value = true
    }

    // 添加一条试题
    const addPaperContent = (list: Ilist) => {
      console.log(list)
      formSate.paperLists.push(list)
    }
    // 创建试卷
    const createHandle = () => {
      if(!formSate.testName) {
        message.warning('请填写测试卷名称')
        return 
      }
      if (paper_id) {
        router.push({
          path:"/teacher/teacherCourse/testPaperList",
          query:{
            course_id: course_id
          }
        })
        return;
      }
      console.log(formSate.paperLists)
      http.createPaper({
        param: {
          name: formSate.testName,
          type: 'test',  // 随测
          // is_publish:    // 发布
          course_id: course_id
        }
      }).then((res: IBusinessResp) => {
        console.log(res)
        relationQuest(res.data.id)
        router.push({
          path:"/teacher/teacherCourse/testPaperList",
          query:{
            course_id: course_id
          }
        })
      })
    }
    // 关联习题
    const relationQuest = (id: number) => {
      http.relationQuest({
        param: {
          questions: formSate.paperLists.map(v => v.id)
        },
        urlParams: {
          entity_id: id,
          entity_type: 'test'
        }
      }).then((res: IBusinessResp) => {
        console.log(res)
        // getPaperList()
      })
    }
    // 获取试卷习题
    function getQuestionsList() {
      examApi.getQuestionsListApi({urlParams:{entity_type:"test",entity_id:paper_id},param:{include:"answers"}}).then((res:any)=>{
        console.log(res);
        formSate.paperLists=res.data
      })
    }
    // 获取试卷列表
    const getPaperList = () => {
      http.getPaperList({
        param: {
          // name: 'test',
          type: 'test',
          course_id: course_id,
        }
      }).then((res: IBusinessResp) => {
        console.log(res)
      })
    }
    // 习题类型和难易类型
    let typeList = reactive<IpaperType>({
      paperType: [],
      levelType: []
    })
    provide('typeList', typeList)
    // 获取目录列表
    let directoryList = reactive<IDirectoryList>({
      commonList: [],
      privateList: []
    })
    const getCCatalogueList = () => {
      http.getCatalogueList({param: {limit: 100}}).then((res: IBusinessResp) => {
        console.log(res)
        let commonList: ICPDirectoryList[] = []
        let privateList: ICPDirectoryList[] = []
        res.data.list.map((v: any) => {
          v.initial === 0 ? privateList.push(v) : commonList.push(v)
        })
        directoryList.commonList = commonList
        directoryList.privateList = privateList
        // getPCatalogueList()
      })
    }
    const getPCatalogueList = () => {
      http.getCatalogueList({param: {initial: 0, limit: 100}}).then((res: IBusinessResp) => {
        console.log(res)
        directoryList.privateList = res.data.list
      })
    }
    provide('directoryList', directoryList)
    onMounted(() => {
      // 获取目录
      getCCatalogueList()
      // 获取习题类型列表
      http.getPaperTypeList().then((res: IBusinessResp) => {
        console.log(res)
        typeList.paperType = res.data
      })
      // 获取习题难易程度列表
      http.getLevelList().then((res: IBusinessResp) => {
        console.log(res)
        typeList.levelType = res.data
      })
    })
    // 取消
    function cancel() {
      router.push({
          path:"/teacher/teacherCourse/testPaperList",
          query:{
            course_id: course_id
          }
        })
    }
    return {
      ...toRefs(formSate),
      formSate,
      ...toRefs(typeList),
      clickAddPaper,
      clickSelectPaper,
      isShowSingle,
      addType,
      addPaperContent,
      isShowDraw,
      selectType,
      createHandle,
      getPCatalogueList,
      cancel,
      paper_id
    }
  },
})
interface ICPDirectoryList {
  id: number,
  name: string
}
interface IDirectoryList {
  commonList: ICPDirectoryList[],
  privateList: ICPDirectoryList[]
}
</script>

<style lang="less" scoped>
.create-test-paper {
  width: @center-width;
  height: 100%;
  margin: 0 auto;
  background-color: @white;
  border-radius: 6px;
  padding: 60px 100px;
  overflow: auto;
  .create-top {
    display: flex;
    justify-content: flex-end;
    :deep(.ant-form) {
      margin-right: auto;
      .ant-input {
        width: 844px;
      }
    }
    :deep(.ant-btn-primary) {
      margin-top: 35px;
      &.add {
        margin-right: 14px;
      }
    }
  }
  .create-content {
    width: 844px;
    padding: 18px;
  }
  .btns {
    text-align: center;
    .ant-btn-primary {
      margin-left: 14px;
    }
  }
}
</style>
