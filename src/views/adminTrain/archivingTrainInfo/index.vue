<template>
  <div id="archivingTrainInfo" v-layout-bg>
    <div class="header-search">
      <div class="search-left">
        <div class="searchInput">
          <a-input
            @keyup.enter="querySearch"
            v-model:value="params.name"
            placeholder="请输入实训名称"
            class="input"
          >
            <template #prefix>
              <img src="src/assets/images/screenicon/Group12.png" /> </template
          ></a-input>
        </div>
        <div class="searchInput">
          <a-input
            @keyup.enter="querySearch"
            v-model:value="params.teacher"
            placeholder="请输入任课教师"
            class="input"
          >
            <template #prefix>
              <img src="src/assets/images/screenicon/Group11.png" /> </template
          ></a-input>
        </div>
        <a-button type="primary" @click="querySearch">查询</a-button>
        <a-button type="primary" @click="clearParams">清空</a-button>
      </div>
      <div class="search-right">
        <a-button type="primary" @click="deleteTrain(null)">批量删除</a-button>
      </div>
    </div>
    <a-config-provider>
      <a-table
        :columns="columns"
        :data-source="data"
        rowKey="id"
        :pagination="
          total > 10
            ? {
                hideOnSinglePage: false,
                showSizeChanger: true,
                total: total,
                current:params.page,
                pageSize: params.limit,
                onChange: onChange,
                onShowSizeChange: onShowSizeChange,
              }
            : false
        "
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <template #name="{ record }">
          <div
            :title="record.name"
            class="purple a-link"
            @click="archivingInfo(record.id)"
          >
            {{ record.name }}
          </div>
        </template>
        <template #action="{ record }">
          <div class="purple a-link" @click="deleteTrain(record.id)">删除</div>
        </template>
      </a-table>
      <template #renderEmpty>
        <div><empty type="tableEmpty"></empty></div>
      </template>
    </a-config-provider>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, onMounted, toRefs, inject, watch } from "vue";
import Empty from "src/components/Empty.vue";
import request from "src/api/index";
import { useRouter } from "vue-router";
import { Modal, message } from "ant-design-vue";

interface state {
  data: any[];
  total: number;
  loading: boolean;
  selectedRowKeys: any[];
  params: any;
}
export default defineComponent({
  name: "archivingTrainInfo",
  components: { Empty },
  setup: (props, context) => {
    const router = useRouter();
    const http = (request as any).adminTrain;

    const columns: any = [
      { title: "实训名称", dataIndex: "name", slots: { customRender: "name" } },
      {
        title: "任课教师",
        dataIndex: "creater",
        key: "creater",
      },
      {
        title: "实验数",
        dataIndex: "task_num",
        key: "task_num",
      },
      {
        title: "课时数",
        key: "class_cnt",
        dataIndex: "class_cnt",
      },
      {
        title: "学生数",
        key: "user_num",
        dataIndex: "user_num",
      },
      {
        title: "归档时间",
        key: "updated_time",
        dataIndex: "updated_time",
        width: "150",
        ellipsis: "true",
      },
      {
        title: "操作",
        key: "action",
        slots: { customRender: "action" },
      },
    ];
    const state: state = reactive({
      data: [],
      total: 0,
      loading: false,
      selectedRowKeys: [],
      params: {
        name: "",
        teacher: "",
      },
    });
    const methods = {
      onChange(page: any, pageSize: any) {
        state.params.page = page;
        state.params.limit = pageSize;
        methods.tableList();
      },
      onShowSizeChange(current: any, size: any) {
        console.log(current, size, "current, size");
        state.params.page = 1;
        state.params.limit = size;
        methods.tableList();
      },
      tableList() {
        state.loading = true;
        http.archiveTrainList({ param: state.params }).then((res: any) => {
          state.data = res.data.list;
          state.total = res.data.page.totalCount;
          state.loading = false;
          // state.data = [{ name: "wse" }];
        });
      },
      querySearch() {
        state.params.page = 1;
        methods.tableList();
      },
      clearParams() {
        state.params.name = "";
        state.params.teacher = "";
        methods.tableList();
      },
      onSelectChange(selectedRowKeys: any) {
        state.selectedRowKeys = selectedRowKeys;
      },
      deleteRow(id: any) {
        console.log(id);
      },
      archivingInfo(id: any) {
        router.push({ path: "adminTrain/trainInfo", query: { id: id, currentTab: 3 } });
      },
      deleteTrain(id: any) {
        const deleteArr: any = id ? [id] : state.selectedRowKeys;
        if (!deleteArr.length) {
          message.warning("请选择要操作的实训！");
          return;
        }
        Modal.confirm({
          title: "提示",
          content: "确定要删除吗？",
          okText: "确认",
          cancelText: "取消",
          onOk: () => {
            http.deleteTrain({ param: { id: deleteArr } }).then((res: any) => {
              console.log(res);
              methods.tableList();
            });
          },
        });
      },
    };
    onMounted(() => {
      methods.tableList();
    });
    return { ...toRefs(state), columns, ...methods };
  },
});
</script>
<style lang="less" scoped>
.header-search {
  display: flex;
  justify-content: space-between;
}
.search-left {
  display: flex;
  > div {
    margin-right: 20px;
  }
  > button {
    margin-right: 20px;
  }
}
.purple {
  color: var(--purpleblue-6);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.purple:hover {
  color: @theme-light-color;
}
:deep(.ant-table-pagination.ant-pagination) {
  float: none;
  text-align: center;
}
</style>
