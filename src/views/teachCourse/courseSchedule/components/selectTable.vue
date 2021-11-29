<template>
  <div class="select-table">
    <a-input-search
      :placeholder="'请输入'+(currentType === 'student' ? '学生' : '班级')+'相关词'"
      @search="onSearch"
      v-model:value="name"
    />
    <a-config-provider>
      <template #renderEmpty>
        <Empty type="tableEmpty"></Empty>
      </template>
      <div class="list-wrapper scroll-view-wrapper">
        <a-table
          rowKey="class_id"
          :columns="columns[currentType]"
          :loading="loading"
          :data-source="dataList[currentType]"
          :showHeader="true"
          bordered
          :pagination="{
            current: pageinfo.page, 
            pageSize: pageinfo.pageSize, 
            total: pageinfo.total, 
            onChange: pageChange, 
            hideOnSinglePage:true
          }"
        >
          <template #action="{record}">
            <span class="iconfont icon-del" @click="handleSelectData(record)" v-if="neverShow(record)"></span>
            <!-- <span class="iconfont icon-yichu"></span> -->
          </template>
        </a-table>
      </div>
    </a-config-provider>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, onMounted, provide, inject, watch, nextTick, PropType, computed } from 'vue'
import { MessageApi } from "ant-design-vue/lib/message";
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch.d';

export default defineComponent({
  name: 'selectTable',
  components: {},
  props: {
    currentType:  {
      type: String,
      default: 'student'
    }
  },
  emit: [],
  setup(props) {
    const $message: MessageApi = inject("$message")!;
    const http=(request as any).teachCourse

    let name = ref('')
    let loading = ref(false)
    let dataList = reactive({
      student: [],
      class: []
    })
    let pageinfo = reactive({
      page: 1,
      pageSize: 12,
      total: 0
    })
    function onSearch(value: string, e: any) {
      e.preventDefault()
      if (!value) {
        $message.warn('请输入查询关键词')
        return
      }
      currentType()
    }
    function getStudentList () {
      loading.value = true
      let param = {
        pageinfo: {index: pageinfo.page, size: pageinfo.pageSize},
        query: {class_ids: [], stu_no: name.value}
      }
      http.getStudentList({param}).then((res: IBusinessResp) => {
        loading.value = false
        let {data, page, total} = res.data
        dataList.student = data
        pageinfo.total = total
      })
    }
    function getClassestList () {
      loading.value = true
      let param = {
        pageinfo: {index: pageinfo.page, size: pageinfo.pageSize},
        query: {classname: name.value}
      }
      http.getClassestList({param}).then((res: IBusinessResp) => {
        loading.value = false
        let {data, page, total} = res.data
        dataList.class = data
        pageinfo.total = total
      })
    }
    function pageChange(val: number) {
      pageinfo.page = val
      currentType()
    }
    function currentType() {
      if (props.currentType === 'student') {
        getStudentList()
      } else {
        getClassestList()
      }
    }
    var onCrossvalidation = inject("onCrossvalidation") as Function;
    function handleSelectData(list: any) {
      onCrossvalidation(list)
    }
    let selectedIds: any = computed(() => {
      return inject('selectedIds')
    })
    function neverShow(record: any) {
      const id = props.currentType === 'student' ? 'stu_id' : 'class_id'
      const neverShowId = [...selectedIds.value[props.currentType]].includes(record[id])
      if (neverShowId) {
        // return { neverShow: true }
        return false
      } else {
        return true
      }
    }

    onMounted(() => {
      currentType()
    })
    return {name, onSearch, columns, loading, dataList, pageinfo, pageChange, handleSelectData, selectedIds, neverShow}
  },
})
const columns = {
  class: [
    {
      title: '班级名称',
      dataIndex: 'classname',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '人数',
      dataIndex: 'stu_num',
      align: 'center',
    },
    {
      title: '操作',
      slots: { customRender: 'action' },
      align: 'center',
    },
  ],
  student: [
    {
      title: '学号',
      dataIndex: 'stu_no',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      align: 'center',
    },
    {
      title: '班级',
      dataIndex: 'class_name',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '操作',
      slots: { customRender: 'action' },
      align: 'center',
    },
  ],
}
interface ISelectedIds {
  class: number[],
  student: number[],
}
</script>

<style lang="less" scoped>
.select-table {
  .ant-input-search {
    height: 34px;
    margin: 5px 0;
  }
  :deep(.ant-table-pagination.ant-pagination) {
    float: inherit;
    margin: 16px 0;
    text-align: center;
  }
  .iconfont {
    cursor: pointer;
  }
  :deep(.ant-table) {
    height: 750px;
    overflow: auto;
    .ant-table-body > table {
      border-color: #e8e8e8;
      .ant-table-thead > tr > th, 
      .ant-table-tbody > tr > td {
        border-color: #e8e8e8;
        border-right: none;
        &:last-child {
          border-right: 1px solid #e8e8e8;
        }
      }
    }
  }
}
</style>
