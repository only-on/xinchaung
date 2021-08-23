<template>
  <div class="virtual-env">
    <div class="content-wrapper">
      <div class="tree">
        <tree @selectNode="selectNode"></tree>
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
          <a-button type="primary" @click="openEnv">开启实验环境</a-button>
        </div>
        <div class="env-lists">
          <div class="env-list" v-for="v in envListState.data" :key="v.id">
            <card :list="v" @getList="getList"></card>
          </div>
          <div v-if="!envListState.data.length" class="nodata">暂无相关数据</div>
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
      <div>
        <a-modal
          v-model:visible="visible"
          title="设置环境数量"
          :ok-button-props="{ disabled: false }"
          :cancel-button-props="{ disabled: false }"
          @ok="handleOk"
        >
          <a-input v-model:value="openEnvNum"  allow-clear />
          <span class="prompt">*最多开启{{limit}}套环境</span>
        </a-modal>
      </div>
    </div>
  </div>
</template>

<script lang="ts" scope> 
import { PlayCircleOutlined, PoweroffOutlined, ReloadOutlined, SyncOutlined, LeftCircleOutlined, RightCircleOutlined  } from '@ant-design/icons-vue';
import tree from './tree.vue'
import card from './card.vue'
import request from 'src/api/index'
import { defineComponent, onMounted, ref, reactive, toRefs, UnwrapRef} from 'vue'
import { message } from 'ant-design-vue'
import {getTree} from './api'


interface Ipage {
  totals?: number
  pageSize: number
  currPage: number
  keyWord?: string
}
interface Iparams {
  taskId: number
  type: string
  name: string
  courseId: number
  page: Ipage
  grouped: number
}
interface INode extends Pick<Iparams, 'taskId' | 'type' | 'name' | 'courseId' | 'grouped' >{}

interface Ivms {
  uuid: string
  status: string
}
interface Iuser {
  username: string
  id: number
  student_id: number
  [propname: string]: any
  vms: Ivms[]
}

interface IListState {
  data: Iuser[];
  page: Ipage
}

interface IlimitParams {
  taskId: number
  type: string
  count: number
  limit: number
  courseId: number
}

interface IselectTreeNode {
  taskId: number
  type: string
  name: string
  courseId: number
  grouped: number
}

export default defineComponent({
  components: {
    tree,
    card,
    PlayCircleOutlined,
    PoweroffOutlined,
    ReloadOutlined,
    SyncOutlined,
    LeftCircleOutlined, 
    RightCircleOutlined
  },
  setup() {
    const http=(request as any).course
    const envListState = reactive<IListState>({
      data: [],
      page: {
        pageSize: 6,
        currPage: 1,
        keyWord: ''
      }
    })
    let page = reactive<Ipage>({
      totals: 0,
      pageSize: 6,
      currPage: 1,
      keyWord: ''
    })
    const params = reactive<Iparams>({
      taskId: 533005,
      type: 'course',
      name: '',
      courseId: 501703,
      page: envListState.page,
      grouped: 0
    })
    // tree 
    const selectTreeNode = reactive<IselectTreeNode>({
      taskId: 0,
      type: 'course',
      name: 'hello',
      courseId: 1,
      grouped: 2
    })
    const selectNode = (node:INode) => {
      console.log(node)
      selectTreeNode.taskId = node.taskId
      selectTreeNode.type = node.type
      selectTreeNode.name = node.name
      selectTreeNode.courseId = node.courseId
      selectTreeNode.grouped = node.grouped
      params.taskId = node.taskId
      params.type = node.type
      params.name = node.name
      params.courseId = node.courseId
      params.grouped = node.grouped
      getList()
      console.log(selectTreeNode.taskId);
      
    }
    
    // 查询
    const search = reactive({
      stuName: '',
      onSearch: (val: string) => {
        console.log(search.stuName, '查询环境列表');
        params.page.keyWord = search.stuName
        console.log(toRefs(toRefs(params)));
        
        getList()
      }
    })

    
    function getList() {
      http.getPre({param: params}).then((res: any) => {
        if(res && res.status) {
          message.success({ content: '请求成功!', duration: 2 });
          let {data, page} = res.datas.data
          envListState.data = data
          envListState.data[0] = {
            username: 'hello',
            id: 111,
            student_id: 11,
            number: '',
            is_online: 1,
            current: 1,
            vms: [
              {
                status: 'SHUTOFF',
                uuid: 'e81c9056-91c6-4695-8188-a815f28ba34a',
              },
              {
                status: 'ACTIVE',
                uuid: 'e81c9056-91c6-4695-8188-a815f28ba34a'
              }
            ]
          }
          envListState.page = page
        }
      })
    }
    const onChangePage = (page: number) => {
      params.page.currPage = page
      getList()
    }

    // 弹框
    const showModal = ref<boolean>(false);
    const visible = ref<boolean>(false);
    const openEnv = () => {
      visible.value = true;
    }
    const handleOk = (e: MouseEvent) => {
      console.log(e);
      visible.value = false;
      saveTopinst()
    };
    const handleCancel = (e: MouseEvent) => {
      console.log(e);
      visible.value = false;
    };

    

    let openEnvNum = ref('')
    let limit = ref(0)
    function getLimit() {
      http.preLimit().then((res: any) => {
        limit.value = res.data
      })
    }
    function saveTopinst() {
      // const limitParams = reactive<IlimitParams>({
      const limitParams = {
        taskId: selectTreeNode.taskId,
        type: selectTreeNode.type,
        count: openEnvNum.value,
        limit: limit.value,
        courseId: selectTreeNode.courseId
      }
      console.log(limitParams);
      
      http.saveTopoinst({param: limitParams}).then((res: any) => {
        if (res && res.status) {
          message.success({ content: '请求成功!', duration: 2 });
        }
      })
    }
    
    onMounted(() => {
      // getList()
      getLimit()
      let timer = setInterval(() => {
        clearInterval(timer)
        getLimit()
      }, 60000)
      getTree(501703).then((res) => {
        console.log(res, 'tree')
      })
    })

    return {
      ...toRefs(search),
      envListState,
      getList,
      page,
      onChangePage,
      showModal,
      visible,
      openEnv,
      handleOk,
      handleCancel,
      selectNode,
      limit,
      openEnvNum,
    }
  },
})
</script>

<style lang="less">
@hover-color: #7c49a8;
.virtual-env {
  margin-top: 80px;
  .content-wrapper {
    width: 1330px;
    min-height: 750px;
    margin: 0 auto;
    padding: 30px;
    border: 10px;
    background-color: #fff;
    box-shadow: 0 0 5px rgb(0 0 0 / 10%);
    display: flex;
    .tree {
      width: 320px;
      max-height: 700px;
      padding: 0 15px;
      border-top: 3px solid @theme-color;
      box-shadow: 0 0 5px rgb(0 0 0 / 10%);
      overflow-y: auto;
    }
    .content {
      flex: 1;
      padding: 0 15px;
      .search{
        padding-bottom: 20px;
      }
      .env-lists {
        height: 600px;
        .env-list {
          // width: 31.1%;
          width: 264px;
          padding: 10px;
          margin: 10px;
          border: 1px solid #ccc;
          display: inline-block;
          .stu-name {
            color: @theme-color;
            font-size: 22px;
            min-height: 25px;
            font-weight: 600;
            display: inline-block;
            max-width: 130px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .stu-id {
            font-size: 16px;
            color: #464646;
            line-height: 29px;
            display: inline-block;
            max-width: 135px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            float: right;
          }
          .swiper-box {
            height: 165px;
            .kvm-info {
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              text-align: center;
              top: -165px;
              position: relative;
              color: #fff;
              font-size: 12px;
            }
          }
          .btns {
            text-align: center;
            .btn {
              height: 30px;
              font-size: 20px;
              color: #fff;
              padding: 0 13px;
              margin: 0px 2px;
              background-color: @theme-color;
              color: #fff;
              border: 1px solid transparent;
              border-radius: 3px;
              // opacity: .65;
            }
            .btn.disabled {
              opacity: .65;
            }
          }
        }
        .nodata {
          height: 600px;
          text-align: center;
          font-size: 30px;
          color: @theme-color;
          padding-top: 250px;
        }
      }
    }
  }
}

.ant-input-search {
  .ant-input-group{
    .ant-input {
      border-radius: 4px;
      background: #fff;
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
      background-color: @theme-color;
      border-color: @hover-color;
      color: #fff;
      height: 41px;
      width: 100px;
      font-size: 16px;
    }
  }
}

.ant-btn.ant-btn-primary {
  height: 41px;
  background-color: @theme-color;
  border-color: @hover-color;
  color: #fff;
  padding: 0 20px;
  line-height: 41px;
  font-size: 16px;
  float: right;
}
.ant-btn.ant-btn-primary:hover, .ant-btn.ant-btn-primary:focus {
  background-color: @hover-color;
  border-color: @hover-color;
}

.ant-carousel {
  height: 100%;
  // background: url(./kvm-computer-open.png) center no-repeat;
  background-size: 90%;
  .custom-slick-arrow.slick-arrow  {
    width: 0;
    height: 0;
    // border: 15px solid @theme-color;
    border: 15px solid #d6c4e5;;
    border-bottom-color: transparent;
    border-top-color: transparent;
    z-index: 1;
  }
  .custom-slick-arrow.slick-arrow.slick-prev {
    border-left-color: transparent;
    left: -12px;
  }
  .custom-slick-arrow.slick-arrow.slick-next {
    border-right-color: transparent;
    right: -12px;
  }
  .swiper {
    height: 165px;
  }
}
.ant-carousel :deep(.slick-slide) {
  text-align: center;
  height: 160px;
  line-height: 160px;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.3;
}
.ant-carousel :deep(.custom-slick-arrow:before) {
  display: none;
}
.ant-carousel :deep(.custom-slick-arrow:hover) {
  opacity: 0.5;
}

.ant-carousel :deep(.slick-slide h3) {
  color: #fff;
}

.ant-modal-content {
  .ant-btn {
    height: 30px;
    padding: 5px 10px;
    font-size: 12px;
    line-height: 1.5;
    border-radius: 3px;
    color: #fff;
    background-color: @theme-color;
    border-color: @hover-color;
  }
  .ant-modal-close-x {
    height: 40px;
    color: #fff;
    line-height: 40px;
  }
  .ant-modal-header {
    background-color: @theme-color;
    padding: 0;
    height: 40px;
    /* line-height: 40px; */
    /* font-size: 1.15em; */
    /* font-weight: bold; */
    /* color: #fff; */
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-bottom-color: #f4f4f4;
    .ant-modal-title {
      line-height: 40px;
      font-weight: bold;
      padding-left: 15px;
      color: #fff;
      font-size: 15px;
    }
  }
  .ant-modal-body {
    padding-top: 40px;
    .ant-input-affix-wrapper {
      width: 300px;
    }
    .prompt {
      color: red;
      padding-left: 6px;
    }
  }
}


ul.ant-pagination {
  // margin: 20px 0;
  .ant-pagination-item-active{
    font-weight: 500;
    background: @theme-color;
    border-color: @theme-color;
    a {
      color: #fff;
    }
  }
  .ant-pagination-item:focus, 
  .ant-pagination-item:hover{
    background: @theme-color;
    border-color: @theme-color;
    transition: all 0.3s;
    a {
      color: #fff;
    }
  }
  .ant-pagination-next .ant-pagination-item-link:hover,
  .ant-pagination-next .ant-pagination-item-link:focus,
  .ant-pagination-prev .ant-pagination-item-link:hover,
  .ant-pagination-prev .ant-pagination-item-link:focus {
    color: #fff;
    background: @theme-color; 
    border-color: @theme-color;
    transition: all 0.3s;
  }
  .ant-pagination-disabled:hover,
  .ant-pagination-disabled .ant-pagination-item-link:hover {
    color: rgba(0, 0, 0, 0.25);
    border-color: #d9d9d9;
    background-color: #fff;
  }
  .ant-pagination-options-quick-jumper input:hover,
  .ant-pagination-options-quick-jumper input:focus {
    border-color: @theme-color;
    box-shadow: 0 0 0 2px rgb(137 85 181 / 30%);
  }
}
</style>
