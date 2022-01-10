<template>
  <div class="virtual-env"  v-layout-bg>
    <div class="content-wrapper">
      <div class="tree" v-if="courseInfo.type === 'course'">
        <drag-tree 
        :treeData="treeData.data"
         @updateData="updateData"
         @selectChapter="selectChapter"
         @selectExperiment="selectExperiment"
         @editNode="editNode"
         @deleteNode="deleteNode"
         :isDefaultSelectChapter="isDefaultSelectChapter"
         ></drag-tree>
      </div>
      <div class="content">
        <div class="search">
          <a-input-search
            v-model:value="stuName"
            placeholder="请输入学生名或分组名查询"
            style="width: 200px"
            @search="onSearch"
            enter-button="查询"
          />
          <modal :limit="limit" @saveTopinst="saveTopinst" :selectedNodes="selectedNodes" :courseInfo="courseInfo"></modal>
        </div>
        <div class="env-lists">
          <div class="loading" v-if="envListState.loading">
              <a-spin size="large" />
          </div>
          <div class="env-list" v-for="v in envListState.data" :key="v.id">
            <card :list="v" @getList="getList"></card>
          </div>
          <!-- <Empty v-if="!envListState.data.length && !envListState.loading"/> -->
          <div v-if="!envListState.data.length && !envListState.loading" class="nodata">{{noDataPrompt}}</div>
        </div>
        <a-pagination 
          show-quick-jumper 
          v-model:current="envListState.page.currPage" 
          :pageSize="envListState.page.pageSize" 
          :total="envListState.page.totals" 
          @change="onChangePage" 
          :hideOnSinglePage="true" 
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts"> 
import dragTree from 'src/components/dragTree.vue'
import card from './card.vue'
import modal from './modal.vue'
import request from 'src/api/index'
import { defineComponent, onMounted, ref, reactive, toRefs, UnwrapRef, provide, inject} from 'vue'
import { message } from 'ant-design-vue'
import { IBusinessResp } from 'src/typings/fetch.d'
import { Ihttp, ICourseInfo, ITreeHttp } from './typings'
import { urlSearch } from 'src/utils/common'


interface Ipage {
  totals?: number
  pageSize: number
  currPage: number
  keyWord?: string
}
interface Iparams {
  taskId?: number
  type?: string
  keyword?: string
  courseId?: number
  page: Ipage
  grouped?: number
}
// interface INode extends Pick<Iparams, 'taskId' | 'type' | 'name' | 'courseId' | 'grouped' >{}
interface INode {
  taskId: number
  type: string
  grouped: number
  isHigh: boolean
}

interface Ivms {
  uuid: string
  status: string
}
interface Iuser {
  username: string
  id: number
  student_id: string
  online: number
  number: string
  current: string
  vms: Ivms[]
}

interface IListState {
  loading: boolean
  data: Iuser[];
  page: Ipage
}

interface IselectTreeNode {
  taskId: number
  type: string
  name: string
  courseId: number
  grouped: number
}
interface IResponseData {
  status: number;
  msg: string;
  data: any;
  error:any;
  datas: any
}
interface Isolts {
  icon: string
}
interface ITreeDataItem {
  id: number
  name: string
  sort: number
  type: string
  is_high: boolean
  slots: Isolts
  grouped: number
  contents: ITreeDataItem[]
}
interface ITreeData {
  data: ITreeDataItem[]
}

export default defineComponent({
  components: {
    dragTree,
    card,
    modal,
  },
  setup() {
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:false,componenttype:undefined})

    const query = urlSearch()
    // 课程
    let  courseInfo = reactive<ICourseInfo>({
      type: String(query.type),
      taskId: Number(query.taskId),
      courseType: Number(query.courseType),
      courseId: query.type === 'train' ? 0 : Number(query.courseId),
      grouped: 0
    })
    // let courseInfo = reactive<ICourseInfo>({
    //   type: 'course',      // 课程'course' 实训'train'
    //   courseType: 1,
    //   courseId: 501703,   // 课程id
    //   taskId: 50235,         // 实验id
    //   grouped: 1          // 1分组 0未分组
    // })
    // 实训
    // let trainInfo = reactive<ICourseInfo>({
    //   taskId: 50234,
    //   type: 'train',
    //   courseId: 0,
    //   grouped: 0
    // })
    
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:false,componenttype:undefined})
    // 是否默认选中章节
    const isDefaultSelectChapter = ref(false)
    provide('courseInfo', courseInfo)
    const http=(request as Ihttp).teachCourse
    const envListState = reactive<IListState>({
      loading: false,
      data: [],
      page: {
        totals: 0,
        pageSize: courseInfo.type === 'train' ? 8 : 6,
        currPage: 1,
        keyWord: ''
      }
    })
    //  courseId: courseInfo.courseId,
    // grouped: courseInfo.grouped
    const params = reactive<Iparams>({
      taskId: courseInfo.taskId,
      type: courseInfo.type,
      keyword: '',
      page: envListState.page,
    })

    // tree
    let selectedNodes = reactive<INode>({
      taskId: 1,
      type: '',
      isHigh: false,
      grouped: 0
    })
    
    // 查询
    const search = reactive({
      stuName: '',
      onSearch: (val: string) => {
        params.keyword=search.stuName
        getList()
      }
    })

    // let noDataPrompt = ref('')
    let noDataPrompt = ref('请选择')
    function getList() {
      let type = courseInfo.type === "train" ? "实训" : (courseInfo.courseType == 2 ? "课程" : "实验")
      envListState.data = []
      envListState.loading = true
      http.getPre({param: params}).then((res: IResponseData) => {
        envListState.loading = false
        if(res && res.status) {
          message.success({ content: '请求成功!', duration: 2 });
          let {data, page} = res.datas.data
          envListState.data = data
          // envListState.data[0].vms.push(data[0].vms[0])
          let taskType = res.datas.task_type
          if (params.keyword !== '') {
            noDataPrompt.value = '暂无相关数据'
          }else if (taskType === 1) {
            noDataPrompt.value = `尚未开启${type}环境`
          } else if (taskType === 4) {
            noDataPrompt.value = '交互编程类型实验不支持开启虚拟机环境'
          } else {
            noDataPrompt.value = '暂无数据'
          }
          envListState.page = page
        }
      })
    }
    const onChangePage = (page: number) => {
      params.page.currPage = page
      getList()
    }
 
    onMounted(() => {
      courseInfo.type === 'train' ? getList() : getTreeList()
      getLimit()
      let timer = setInterval(() => {
        clearInterval(timer)
        getLimit()
      }, 60000)
    }) 

    // 开启实验环境
    let limit = ref()
    function getLimit() {
      http.preLimit().then((res: IBusinessResp) => {
        limit.value = res.data
        // limit.value = 10
      })
    }
    function saveTopinst(num: number) {
      // const limitParams = reactive<IlimitParams>({
          // limit: limit.value,
          // courseId: params.courseId
      const limitParams = {
        opType:'precreate',
        type: params.type,
        taskId: params.taskId,
        count: num,
      }
      http.saveTopoinst({param: limitParams}).then((res: IBusinessResp) => {
        if (res && res.status) {
          getList()
          message.success({ content: '请求成功!', duration: 2 });
        }
      })
    }

    const TreeTttp=(request as ITreeHttp).courseTree
    // 课程目录树
    let treeData = reactive<ITreeData>({
      data: []
    })
    function getTreeList() {
      TreeTttp.getTreeList({
        param: {endpoint: 'env'}, 
        urlParams: {courseId: courseInfo.courseId}
      }).then((res: IBusinessResp) => {
        treeData.data = res.data
      })
    }
    // 更新tree数据
    const updateData = (data: ITreeDataItem[], parentId: number) => {
      let obj = {}
      treeData.data = data
      if (!parentId) {
        data.forEach((item, index) => {
          item.sort = index + 1
          obj[item.id] = index + 1
        })
        // 章节排序
        TreeTttp.chapterSort({     
          param: {sort: obj},
          urlParams: {courseId: courseInfo.courseId}
        }).then((res: IBusinessResp) => {
          message.success({ content: res.msg, duration: 2 });
        })
      } else {
        data.forEach(item => {
          item.contents.forEach((v, i) => {
            v.sort = i + 1
            obj[v.id] = i + 1
          })
        })
        // 实验排序
        TreeTttp.contentSort({
          param: {sort: obj},
          urlParams: {courseId: courseInfo.courseId}
        }).then((res: IBusinessResp) => {
          message.success({ content: res.msg, duration: 2 });
        })
      }
    }
    // 点击章节
    const selectChapter = (val: ITreeDataItem) => {
      selectedNodes.taskId = 0
      selectedNodes.type = ''
      // selectedNodes.isHigh = val.is_high
      // selectedNodes.grouped = val.grouped
      params.taskId = 0
      let type = courseInfo.type === "train" ? "实训" : (courseInfo.courseType == 2 ? "课程" : "实验")
      if (!selectedNodes.taskId) {
        noDataPrompt.value = `请选择${type}`
      }
    }
    // 点击实验树
    const selectExperiment = (val: ITreeDataItem) => {
      selectedNodes.taskId = val.id
      selectedNodes.type = val.type
      selectedNodes.isHigh = val.is_high
      // selectedNodes.grouped = val.grouped
      params.taskId = val.id
      // params.grouped = val.grouped
      getList() 
    }
    // 编辑节点
    const editNode = (name: string, id: number) => {
      TreeTttp.editNode({
        param: {chapter_name: name},
        urlParams: {
          courseId: courseInfo.courseId,
          nodeId: id
        }
      }).then((res: IBusinessResp) => {
        if (res.status) {
          getTreeList()
        }
        message.success({ content: res.msg, duration: 2 });
      })
    }
    // 删除节点
    function deleteNode(val: ITreeDataItem) {
      TreeTttp.deleteNode({
        urlParams: {
          courseId: courseInfo.courseId,
          nodeId: val.id
        }
      }).then((res: IBusinessResp) => {
        if (res.status) {
          getTreeList()
        }
        message.success({ content: res.msg, duration: 2 });
      })
    }
      

    return {
      selectedNodes,
      courseInfo,
      ...toRefs(search),
      envListState,
      getList,
      noDataPrompt,
      onChangePage,
      limit,
      saveTopinst,
      treeData,
      updateData,
      selectChapter,
      selectExperiment,
      editNode,
      deleteNode,
      isDefaultSelectChapter,
    }
  },
})
</script>

<style lang="less" scoped>
// var(--gray-8): var(--purpleblue-6);
.virtual-env {
  width: 1330px;
  // margin-top: 50px;
  min-height: 750px;
  margin: 0 auto;
  .content-wrapper {
    padding: 30px;
    border: 10px;
    border-radius: 10px;
    background-color: var(--black-100);
    box-shadow: 0 0 5px rgb(0 0 0 / 10%);
    display: flex;
    .tree {
      width: 320px;
      max-height: 700px;
      // padding: 0 15px;
      border-top: 3px solid var(--purpleblue-6);
      box-shadow: 0 0 5px rgb(0 0 0 / 10%);
      overflow-y: auto;
      overflow-x: hidden;
    }
    .content {
      flex: 1;
      padding: 0 15px;
      .search{
        padding-bottom: 20px;
      }
      .env-lists {
        height: 600px;
        // text-align: center;
        .env-list {
          // width: 31.1%;
          width: 264px;
          padding: 10px;
          margin: 10px;
          border: 1px solid #ccc;
          display: inline-block;
        }
        .loading {
          text-align: center;
        }
        .nodata {
          height: 600px;
          text-align: center;
          font-size: 30px;
          color: var(--purpleblue-6);
          padding-top: 250px;
        }
      }
    }
  }
}

:deep(.ant-input-search) {
  .ant-input-group{
    .ant-input {
      border-radius: 4px;
      background: var(--black-100);
      color: #5e5e5e;
      font-size: 15px;
      padding: 8px 5px 8px 30px;
      box-sizing: border-box;
      width: 450px;
      height: 41px;
      box-shadow: none;
      border: 1px solid #e7e7e7;
    }
  }
  .ant-input-group-addon{
    .ant-btn{
      background-color: var(--purpleblue-6);
      // border-color: var(--gray-8);
      color: var(--black-100);
      height: 41px;
      width: 100px;
      font-size: 16px;
    }
  }
}

.ant-btn.ant-btn-primary {
  height: 41px;
  background-color: var(--purpleblue-6);
  // border-color: var(--gray-8);
  color: var(--black-100);
  padding: 0 20px;
  line-height: 41px;
  font-size: 16px;
  float: right;
}
.ant-btn.ant-btn-primary:hover, .ant-btn.ant-btn-primary:focus {
  background-color: var(--gray-8);
  border-color: var(--gray-8);
}




:deep(ul.ant-pagination) {
  // margin: 20px 0;
  .ant-pagination-item-active{
    font-weight: 500;
    background: var(--purpleblue-6);
    border-color: var(--purpleblue-6);
    a {
      color: var(--black-100);
    }
  }
  .ant-pagination-item:focus, 
  .ant-pagination-item:hover{
    background: var(--purpleblue-6);
    border-color: var(--purpleblue-6);
    transition: all 0.3s;
    a {
      color: var(--black-100);
    }
  }
  .ant-pagination-next .ant-pagination-item-link:hover,
  .ant-pagination-next .ant-pagination-item-link:focus,
  .ant-pagination-prev .ant-pagination-item-link:hover,
  .ant-pagination-prev .ant-pagination-item-link:focus {
    color: var(--black-100);
    background: var(--purpleblue-6); 
    border-color: var(--purpleblue-6);
    transition: all 0.3s;
  }
  .ant-pagination-disabled:hover,
  .ant-pagination-disabled .ant-pagination-item-link:hover {
    color: rgba(0, 0, 0, 0.25);
    border-color: #d9d9d9;
    background-color: var(--black-100);
  }
  .ant-pagination-options-quick-jumper input:hover,
  .ant-pagination-options-quick-jumper input:focus {
    border-color: var(--purpleblue-6);
    box-shadow: 0 0 0 2px rgb(137 85 181 / 30%);
  }
}
</style>
