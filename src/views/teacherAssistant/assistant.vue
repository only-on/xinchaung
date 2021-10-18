<template>
  <div v-layout-bg>
    <div class="condition">
      <a-form-item label="帐号">
        <a-input v-model:value="searchInfo.username"/>
      </a-form-item>
      <a-form-item label="姓名">
        <a-input v-model:value="searchInfo.name"/>
      </a-form-item>
      <a-button type="primary" @click="query()">查询</a-button>
      <a-button type="primary" @click="clear()">清空</a-button>
      <div class="right">
        <a-button type="primary" class="upload" @click="addAssistant()">添加助教</a-button>
        <a-button type="primary" class="upload" @click="batchDelete()">批量删除</a-button>
      </div>
    </div>
    <Table
      :tableList="tableList" 
      :total="page.total" 
      v-model:selectedRows="selectedRows"
      @pageChange="pageChange"
    ></Table>
  </div>
  <a-modal
    title="提示"
    v-model:visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
  >
    <p>{{ selectedRows.length ? '删除内容后不可恢复,确定要删除吗？' : '请至少选择一条删除数据' }}</p>
    <template #footer>
      <a-button key="back" @click="handleCancel" v-if="selectedRows.length">取消</a-button>
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleOk">确定</a-button>
    </template>
  </a-modal>
  <add-assistant v-model:isShow="isShow" v-model:formState="formState"></add-assistant>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, onMounted, provide, inject, watch, nextTick, PropType, createVNode } from 'vue'
import Table from './Table.vue'
import addAssistant from './addAssistant.vue'
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { ITableList, IData, IHttp } from './typings'

export default defineComponent({
  name: '',
  components: { Table, addAssistant },
  props: {},
  emit: [],
  setup() {
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true,backOff:false})

    const http = (request as IHttp).teacherAssistant
    const data = reactive<IData>({
      searchInfo: {
        name: '',
        username: ''
      },
      tableList: [],
      page: {
        page: 1,
        pageSize: 1,
        total: 0
      },
      selectedRows: []
    })

    // 查询
    function query(){
      getAssistantList()
      // data.tableList = [
      //   {
      //     id: 1,
      //     username: '123',
      //     name: '123',
      //     sex: '男',
      //     email: '1243234',
      //     status: 1,
      //     phone: '12313',
      //     teacher: 'sfsaf',
      //     passWord: '1q2w',
      //     submitPass: '1q2w',
      //     createTime: '2021-10-12',
      //     updateTime: '2021-10-12'
      //   },
      //   {
      //     id: 2,
      //     username: 'dfhdfg',
      //     name: 'dfghdfgh',
      //     sex: '男',
      //     email: 'dfghdfh',
      //     status: 1,
      //     phone: 'dghdfgh',
      //     teacher: 'dfghkjhkhjk',
      //     passWord: 'sfghsh',
      //     submitPass: '1qsfhgshg2w',
      //     createTime: '2021-11-12',
      //     updateTime: '2021-12-12'
      //   }
      // ]
    }
    // 列表
    function getAssistantList(sort?: '') {
      let params = {
        query: {
          username: data.searchInfo.username,
          name: data.searchInfo.name,
          sort: sort,
        },
        page: {
          page: data.page.page,
          pageSize: data.page.pageSize
        }
      }
      console.log(params)
      http.getAssistantList({param: {params}}).then((res: IBusinessResp) => {
        console.log(res)
        data.tableList = res.data.list
        data.page.page = res.data.page.currentPage
        data.page.total = res.data.page.totalCount
      })
      
      // data.tableList = [
      //   {
      //     id: 3,
      //     username: 'hello',
      //     name: 'hello',
      //     sex: '女',
      //     email: '1985567456',
      //     status: 1,
      //     phone: '098765',
      //     teacher: '零空间',
      //     passWord: '1q2w',
      //     submitPass: '1q2w',
      //     createTime: '2021-10-12',
      //     updateTime: '2021-10-12'
      //   },
      // ]
    }
    provide('upTableList', getAssistantList)
    // 清空
    function clear() {
      data.searchInfo.name = ''
      data.searchInfo.username = ''
        
    }

    // 添加
    let isShow = ref<boolean>(false)
    let formState = reactive({
      username: '',
      name: '',
      gender: '',
      email: '',
      phone: '',
      passWord: '1q2w',
      submitPass: '1q2w',
      bind_status: ''
    })
    function addAssistant() {
      isShow.value = true
    }
    // 批量删除
    const visible = ref<boolean>(false)
    const confirmLoading = ref<boolean>(false)
    function batchDelete() {
      visible.value = true
    }
    const handleOk = () => {
      if (!data.selectedRows.length) {
        visible.value = false;
        return
      }
      confirmLoading.value = true  
      let ids = data.selectedRows.map(v => v.id).join(',')
      http.delAssistant({urlParams: {ids}}).then((res: IBusinessResp) => {
        console.log(res)
        visible.value = false;
        confirmLoading.value = false;
      })
    };
    const handleCancel = () => {
      visible.value = false;
    };
    // 页码变化
    const pageChange = (page: number) => {
      data.page.page = page
    }
    onMounted(() => {
      getAssistantList()
    })
    return {
      ...toRefs(data),
      query,
      clear,
      addAssistant,
      batchDelete,
      visible,
      confirmLoading,
      handleOk,
      handleCancel,
      pageChange,
      isShow,
      formState,
    }
  },
})
</script>

<style lang="less" scoped>
.font-size-14 {
  font-size: 14px;
}
.condition {
  display: flex;
  justify-content: flex-start;
  :deep(.ant-form-item) {
    margin-right: 10px;
    .ant-form-item-control .ant-input, 
    .ant-form-item-control .ant-select  {
      width: 165px;
      .font-size-14();
    }
    .ant-form-item-label > label {
      .font-size-14();
    }
  }
  :deep(.ant-btn-primary) {
    margin-right: 10px;
    .font-size-14();
  }
  .right {
    margin-left: auto;
    :deep(.ant-btn-primary) {
      &:last-child {
        margin-right: 0; 
      }
    }
  }
}
</style>
