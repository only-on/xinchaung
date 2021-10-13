<template>
  <div class="assistant-table">
    <a-table 
      :rowKey="rowkey"
      :dataSource="tableList" 
      :columns="columns" 
      :bordered="true"
      :pagination="false"
      :row-selection="rowSelection"
      @change="onChange"
    >
      <!-- v-if="tableList.length" -->
      <template #time="{ record }">
        <span>{{ record.time || '--'}}</span>
      </template>
      <template #class="{ record }">
        <span>{{ record.class || '--'}}</span>
      </template>
      <template #status="{ record }">
        <a-switch checked-children="开启" un-checked-children="关闭" :checked="record.status ? true: false" @change="changeSwitch(record)"/>
      </template>
      <template #operate="{ record }">
        <span class="iconfont icon-chakan1" @click="look(record)"></span>
        <span class="iconfont icon-bianji" @click="edit(record)"></span>
        <span class="iconfont icon-shanchu" @click="del(record.id)"></span>
      </template>
    </a-table>
    <!-- <Empty v-else/> -->
    <div class="page-footer-box">
        <!-- show-quick-jumper  -->
      <a-pagination
        v-model:current="page.page" 
        :pageSize="page.pageSize" 
        :total="total" 
        @change="pageChange" 
        :hideOnSinglePage="true"
      />
    </div>
  </div>
  <add-assistant v-model:isShow="isShow" v-model:formState="formState"></add-assistant>
  <look-model v-model:isShowLook="isShowLook" :lookDetail="lookDetail"></look-model>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, PropType, ref, createVNode, inject } from 'vue'
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { message } from 'ant-design-vue'
import { Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import addAssistant from './addAssistant.vue'
import lookModel from './lookModel.vue'
import { ITableList, IPage } from './typings'

export default defineComponent({
  components: {addAssistant, lookModel},
  props: {
    trainId: {
      type: String
    },
    tableList: {
      type: Array as PropType<ITableList[]>,
      default: []
    },
    total: {
      type: Number,
      default: 0
    },
    selectedRows: {
      type: Array as PropType<ITableList[]>,
      default: []
    },
  },
  emits: ['update:selectedRows', 'pageChange'],
  setup(props, {emit}) {
    const page = reactive<IPage>({
      page: 1,
      pageSize: 10,
      total: 0
    })
    // const http=(request as ITeacherExperimentalHttp).teacherExperimental
    const columns = [
      {
        title: '帐号',
        dataIndex: 'username',
        key: 'username',
        width: 100,
        sorter: (a: any, b: any) => {
          // console.log(a, b);  
        },
        sortDirections: ['username', '-username'],
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 100,
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        width: 80,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        slots: { customRender: 'email' },
        sorter: (a: any, b: any) => {
          // console.log(a, b);
          
        },
        sortDirections: ['email', '-email'],
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '所属教师',
        dataIndex: 'teacher',
        key: 'teacher',
        slots: { customRender: 'report' },
        width: 160,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        slots: { customRender: 'status' },
        width: 160,
        sorter: (a: any, b: any) => {
          // console.log(a, b);
          
        },
        sortDirections: ['bind_status', '-bind_status'],
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        slots: { customRender: 'operate' },
        width: 160,
      },
    ]
    // 编辑
    let isShow = ref<boolean>(false)
    let formState = reactive<ITableList>({
      id: 1,
      username: '',
      name: '',
      sex: '',
      email: '',
      phone: '',
      passWord: '1q2w',
      submitPass: '1q2w',
      teacher: '',
      status: 1
    })
    function edit(list: ITableList) {
      console.log(list)
      isShow.value = true
      
      formState.id = list.id
      formState.username = list.username
      formState.name = list.name
      formState.sex = list.sex
      formState.email = list.email
      formState.phone = list.phone
      formState.passWord = list.passWord
      formState.submitPass = list.submitPass
      formState.teacher = list.teacher
      formState.status = list.status
    }
    // 查看
    let isShowLook = ref<boolean>(false)
    let lookDetail = reactive<ITableList>({
      username: '',
      name: '',
      sex: '',
      teacher: '',
      status: 1,
      createTime: '',
      updateTime: ''
    })
    function look(list: ITableList) {
      isShowLook.value = true
      lookDetail.username = list.username
      lookDetail.name = list.name
      lookDetail.sex = list.sex
      lookDetail.teacher = list.teacher
      lookDetail.status = list.status
      lookDetail.createTime = list.createTime
      lookDetail.updateTime = list.updateTime
    }
    var upTableList = inject('upTableList') as Function 
    // 删除
    function del(id: number) {
      Modal.confirm({
        title: '提示',
        icon: createVNode(ExclamationCircleOutlined),
        content: '确定要删除此项吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          upTableList()
          // http.delResource({param: {train_resource_id: id}}).then((res: IBusinessResp) => {
          //   console.log(res)
          //   getResourceList()
          // })
        }
      });
    }

    function changeSwitch (item:ITableList) {
      item.status = item.status == 1 ? 0 : 1
      upTableList()
      // let params = {
      //   train_id: item.id,
      //   is_open: item.is_open
      // }
      // http.changeStatus({param: params}).then((res:IBusinessResp) => {
      //   message.success('操作成功')
      //   emit('refresh')
      // })
    } 
    const onChange = (pagination: PaginationType, filters: FilterType[], sorter: ColumnType) => {
      console.log('params', sorter);
      upTableList(sorter.order)
    }
    // 页码发生变化时
    const pageChange = (current: number, pageSize: number) => {
      page.page = current
      page.pageSize = pageSize
      emit('pageChange', page)
    }
    // pageSize 变化的回调
    const onShowSizeChange = (current: number, size: number) => {
      page.page = current
      page.pageSize = size
    }
    
    const rowSelection = {
      onChange: (selectedRowKeys: (string | number)[], selectedRows: ITableList[]) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows, 1);
        emit('update:selectedRows', selectedRows)
      },
      onSelect: (record: ITableList, selected: boolean, selectedRows: ITableList[]) => {
        console.log(record, selected, selectedRows, 2);
      },
      onSelectAll: (selected: boolean, selectedRows: ITableList[], changeRows: ITableList[]) => {
        console.log(selected, selectedRows, changeRows, 3);
      },
    };
    const rowkey = (record: {}, index: number) => {
      return index
    }
    return {
      ...toRefs(props),
      page,
      columns,
      pageChange,
      onShowSizeChange,
      rowkey,
      rowSelection,
      changeSwitch,
      onChange,
      look,
      edit,
      del,
      isShow,
      formState,
      isShowLook,
      lookDetail,
    }
  },
})
type PaginationType = {
  current: number;
  pageSize: number;
};

type FilterType = {
  name: string;
  address: string;
};

type ColumnType = {
  title: string;
  dataIndex: string;
  order: string
  filters?: {
    text: string;
    value: string;
    children?: {
      text: string;
      value: string;
    }[];
  }[];
}
</script>

<style lang="less" scoped>
.assistant-table {
  :deep(.ant-table-column-sorters) {
    .ant-table-column-title {
      color: @theme-color;
    }
    .ant-table-column-sorter {
      display: none;
    }
  }
  :deep(.ant-table-tbody) {
    .iconfont {
      color: @theme-color;
      margin: 0 5px;
      cursor: pointer;
    }
  }
  .page-footer-box {
    margin-top: 28px;
    text-align: center;
    margin-bottom: 48px;
  }
}
</style>