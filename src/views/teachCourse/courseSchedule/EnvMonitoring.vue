<template>
  <div class="env-monitoring setScrollbar" v-layout-bg>
    <!--检索  -->
    <div class="filtrate-wrap">
      <div class="left">
        <a-form layout="inline" ref="formRef" :model="searchForm">
          <a-form-item label="姓名" class="name-box" name="name">
            <a-input v-model:value="searchForm.name"/>
          </a-form-item>
          <a-form-item label="班级" class="select-input-box label" name="class">
            <a-select :show-arrow="false" v-model:value="searchForm.classType">
              <!-- <a-select-option value="1">=</a-select-option> -->
              <a-select-option value="2">包含</a-select-option>
              <a-select-option value="3">不包含</a-select-option>
            </a-select>
            <a-input v-model:value="searchForm.class" />
          </a-form-item>
          <a-form-item class="btn-wrap">
            <a-button type="primary" @click="handleSubmit">查询</a-button>
            <a-button type="primary" @click="clearFormData">清空</a-button>
            <a-button @click="selectRank" class="search">{{!isAdvancedSearch ? '高级检索' : '普通检索'}}</a-button>
          </a-form-item>
          <a-form-item label="内存" class="select-input-box" name="memory" v-if="isAdvancedSearch">
            <a-select :show-arrow="false" v-model:value="searchForm.memoryType">
              <a-select-option value="1">=</a-select-option>
              <a-select-option value="2">&lt;</a-select-option>
              <a-select-option value="3">&gt;</a-select-option>
            </a-select>
            <a-input v-model:value="searchForm.memory" />
          </a-form-item>
          <a-form-item label="虚机数" class="select-input-box label" name="vm_num" v-if="isAdvancedSearch">
            <a-select :show-arrow="false" v-model:value="searchForm.vm_numType">
              <a-select-option value="1">=</a-select-option>
              <a-select-option value="2">&lt;</a-select-option>
              <a-select-option value="3">&gt;</a-select-option>
            </a-select>
            <a-input v-model:value="searchForm.vm_num" />
          </a-form-item>
          <a-form-item label="IP" class="select-input-box" name="ip" :class="isAdvancedSearch ? 'label' : 'ip'">
            <a-select :show-arrow="false" v-model:value="searchForm.ipType">
              <!-- <a-select-option value="1">=</a-select-option> -->
              <a-select-option value="2">包含</a-select-option>
              <a-select-option value="3">不包含</a-select-option>
            </a-select>
            <a-input v-model:value="searchForm.ip" />
          </a-form-item>
        </a-form>
      </div>
      <div class="right">
        <a-button type="primary" class="disable-btn" @click="batchForbidden()">批量禁用</a-button>
      </div>
    </div>
    <a-config-provider>
      <template #renderEmpty>
        <Empty type="tableEmpty"></Empty>
      </template>
      <!-- 表格内容 -->
      <div class="content-wrap">
        <a-table
          rowKey="id"
          :columns="column"
          :loading="loading"
          :data-source="tableList"
          :showHeader="true"
          bordered
          :row-selection="rowSelection"
          :pagination="{
            current: pageInfo.page, 
            pageSize: pageInfo.pageSize, 
            total: pageInfo.total, 
            onChange: pageChange, 
            hideOnSinglePage:true,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: onShowSizeChange,
          }"
        >
          <template #action="{record}">
            <span
              :title="record.status === 0 ? '禁用' : '已禁用'"
              class="iconfont icon-jinzhi"
              :class="record.status === 0 ? 'disable' : ''"
              @click="record.status === 0 ? forbiddenData(record) : ''"
            ></span>
          </template>
        </a-table>
      </div>
    </a-config-provider>
  </div>
  <forbidden-modal ref="forbiddenModal"></forbidden-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, onMounted, provide, inject, watch, nextTick, PropType } from 'vue'
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch.d';
import { MessageApi } from "ant-design-vue/lib/message";
import forbiddenModal from './components/forbiddenModal.vue'

export default defineComponent({
  name: 'env-monitoring',
  components: { forbiddenModal },
  props: {},
  emit: [],
  setup() {
    var updata = inject("updataNav") as Function;
    updata({tabs:[],navPosition:'outside',navType:false,showContent:false,componenttype:undefined})
    const $message: MessageApi = inject("$message")!;
    const http=(request as any).teachCourse
    let formRef = ref()
    let forbiddenModal = ref()

    let loading = ref<boolean>(false)
    let isAdvancedSearch = ref<boolean>(false)
    let pageInfo = reactive({
      page: 1,
      pageSize: 10,
      total: 0
    })
    let searchForm = reactive({
      pageinfo: {
        index: 1,
        size: 10,
      },
      sortinfo: {
        field: 'id',
        type: 'desc',
      },
      ipType: '2',
      ip: '',
      name: '',
      class: null,
      classType: '2',
      memory: null,
      memoryType: '1',
      vm_num: null,
      vm_numType: '1',
    })
    let tableList = reactive<ITableList[]>([])
    // 批量禁用
    let selectRowKeys = ref<string[]>([])
    function batchForbidden() {
      if (selectRowKeys.value.length) {
        forbiddenModal.value.openModal({
          callbackOk: () => {
            getList()
          },
          ids: selectRowKeys.value?.join(',')
        })
      } else {
        $message.error('请选择要禁用的数据', 3)
      }
    }
    function forbiddenData(list: any) {
      forbiddenModal.value.openModal({
        callbackOk: () => {
          getList()
        },
        ids: list.id
      })
    }
    // 查询
    function handleSubmit() {
      getList()
    }
    // 清空
    function clearFormData() {
      formRef.value.resetFields()
      searchForm.ipType = '2'
      searchForm.classType = '2'
      searchForm.memoryType = '1'
      searchForm.vm_numType = '1'
      getList()
    }
    // 高级/普通检索
    function selectRank() {
      isAdvancedSearch.value = !isAdvancedSearch.value
      formRef.value.resetFields()
    }
    function getList() {
      tableList.length = 0
      http.envMonitoringList({
        param: searchForm
      }).then((res: IBusinessResp) => {
        console.log(res)
        const { data, total } = res.data
        pageInfo.total = total
        tableList.push(...data)
      })
    }
    getList()
    function pageChange(page: number) {
      searchForm.pageinfo.index = page
      pageInfo.page = page
      getList()
    }
    // size变化
    function onShowSizeChange(current: number, pageSize: number) {
      searchForm.pageinfo.index = current
      pageInfo.page = current
      searchForm.pageinfo.size = pageSize
      pageInfo.pageSize = current
      getList()
    }
    const rowSelection = {
      onChange: (selectedRowKeys: (string)[], selectedRows: ITableList[]) => {
        selectRowKeys.value = selectedRowKeys
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows, 1);
      },
      onSelect: (record: ITableList, selected: boolean, selectedRows: ITableList[]) => {
        console.log(record, selected, selectedRows, 2);
      },
      onSelectAll: (selected: boolean, selectedRows: ITableList[], changeRows: ITableList[]) => {
        console.log(selected, selectedRows, changeRows, 3);
      },
    };
    return {
      formRef,
      searchForm,
      loading,
      isAdvancedSearch,
      tableList,
      pageInfo,
      column,
      batchForbidden,
      forbiddenData,
      handleSubmit,
      clearFormData,
      selectRank,
      pageChange,
      onShowSizeChange,
      rowSelection,
      selectRowKeys,
      forbiddenModal,
    }
  },
})
let column = [
  {
    title: '账号',
    dataIndex: 'username',
    align: 'center',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '班级',
    dataIndex: 'classname',
    align: 'center',
  },
  {
    title: 'IP',
    dataIndex: 'ip',
    align: 'center',
  },
  {
    title: '虚拟机个数',
    dataIndex: 'num',
    align: 'center',
  },
  {
    title: '占用内存',
    dataIndex: 'memory',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: '',
    align: 'center',
    slots: { customRender: 'action' },
  },
]
interface ITableList {
  id: string
  username: string
  name: string
  classname: string
  ip: string
  memory: string
  num: string
  status: number
}
</script>

<style lang="less" scoped>
.font14 {
  font-size: 14px;
}
.env-monitoring {
  height: 100%;
  width: @center-width;
  margin: 0 auto;
  // display: flex;
  background-color: @white;
  border-radius: @border-radius-default;
  padding: 29px 37px;
  overflow-y: auto;
  .filtrate-wrap {
    display: flex;
    .left {
      flex: 1;
      .name-box {
        margin-bottom: 12px;
        .ant-input {
          width: 207px;
        }
      }
      .select-input-box {
        .ant-select {
          width: 68px;
          .font14();
        }
        .ant-input {
          width: 142px;
          height: 32px;
          // margin-left: -1px;
        }
      }
      :deep(.ant-form-item-label > label) {
        font-weight: bold;
        .font14();
      }
      .ant-input {
        .font14();
      }
      .btn-wrap {
        padding-left: 31px;
        .ant-btn {
          margin-right: 10px;
          &.search {
            border: 1px solid @theme-color;
            color: @theme-color;
          }
        }
      }
      .label {
        :deep(.ant-form-item-label) {
          width: 112px;
        }
      }
      .ip {
        :deep(.ant-form-item-label) {
          width: 46px;
        }
      }
    }
    .right {
      width: 150px;
      text-align: right;
    }
    .ant-btn {  
      .font14();
    }
  }
  .content-wrap {
    margin-top: 28px;
    .ant-table {
      .iconfont.disable{
        color: @theme-color;
        cursor: pointer;
      }
    }
  }
}
:deep(.ant-table) {
  .ant-table-body {
    & > table {
      border-color: #e8e8e8;
      .font14();
    }
    .ant-table-thead tr > th {
      border-color: #e8e8e8;
    }
    .ant-table-tbody tr > td {
      border-color: #e8e8e8;
    }
  }
}
:deep(.ant-select-dropdown) {
  .ant-select-item {
    .font14();
  }
}
</style>
