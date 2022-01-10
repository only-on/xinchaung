<template>
  <div id="teacherTrainInfo" v-layout-bg>
    <div class="header-search">
      <div class="search-left">
        <!-- <a-form-item label="实训名称">
          <a-input @keyup.enter="querySearch" v-model:value="params.name" />
        </a-form-item>
        <a-form-item label="任课教师">
          <a-input @keyup.enter="querySearch" v-model:value="params.teacher" />
        </a-form-item>
        <a-form-item label="实训状态">
          <a-select
            default-value="请选择"
            v-model:value="status"
            style="width: 120px"
            @change="handleChange"
          >
            <a-select-option value="1"> 未开始 </a-select-option>
            <a-select-option value="2">进行中</a-select-option>
            <a-select-option value="3">已结束</a-select-option>
          </a-select>
        </a-form-item> -->
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
        <div class="item dev_state">
          <a-select
            placeholder="请选择实训状态"
            v-model:value="status"
            @change="handleChange"
            style="width: 240px"
          >
            <a-select-option value="2"> 未开始 </a-select-option>
            <a-select-option value="3">进行中</a-select-option>
            <a-select-option value="1">已结束</a-select-option>
          </a-select>
        </div>
        <a-button type="primary" @click="querySearch">查询</a-button>
        <a-button type="primary" @click="clearAll">清空</a-button>
      </div>
      <div class="search-right">
        <a-button type="primary" @click="deleteTrain">删除</a-button>
        <a-button type="primary" @click="clearVideoRecord(null)">删除录像记录</a-button>
      </div>
    </div>
    <a-config-provider>
      <a-table
        :columns="columns"
        :loading="loading"
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
            @click="lookTrainDetail(record.id)"
            class="purple a-link"
          >
            {{ record.name }}
          </div>
        </template>
        <template #result="{ record }">
          <div @click="lookResult(record.id)" class="purple a-link">查看</div>
        </template>
        <template #action="{ record }">
          <div @click="clearVideoRecord(record.id)" class="purple a-link">
            清除录像记录
          </div>
        </template>
      </a-table>
      <template #renderEmpty>
        <div v-if="!loading"><empty type="tableEmpty"></empty></div>
      </template>
    </a-config-provider>
    <a-modal v-model:visible="visible" title="提示" @ok="handleOk">
      <p>确定要删除吗？</p>
    </a-modal>
  </div>
</template>
<script lang="ts">
import {
  createVNode,
  defineComponent,
  ref,
  reactive,
  onMounted,
  toRefs,
  inject,
  watch,
} from "vue";
import Empty from "src/components/Empty.vue";
import request from "src/api/index";
import { Modal, message } from "ant-design-vue";
import { useRouter } from "vue-router";

interface state {
  data: any[];
  loading: boolean;
  total: number;
  selectedRowKeys: any[];
  params: any;
  visible: boolean;
  status: any;
}
export default defineComponent({
  name: "teacherTrainInfo",
  components: { Empty },
  setup: (props, context) => {
    const router = useRouter();
    const http = (request as any).adminTrain;
    const columns: any = [
      {
        title: "实训名称",
        dataIndex: "name",
        ellipsis: true,
        slots: { customRender: "name" },
      },
      {
        title: "任课教师",
        dataIndex: "creater",
      },
      {
        title: "实训状态",
        dataIndex: "status",
      },
      {
        title: "开始时间",
        dataIndex: "start_times",
      },
      {
        title: "结束时间",
        dataIndex: "end_times",
      },
      {
        title: "操作记录总大小",
        dataIndex: "video_size",
      },
      {
        title: "实训成果",
        dataIndex: "result",
        slots: { customRender: "result" },
      },
      {
        title: "操作",
        key: "action",
        slots: { customRender: "action" },
      },
    ];
    const state: state = reactive({
      data: [],
      loading: false,
      total: 0,
      selectedRowKeys: [],
      status: undefined,
      params: {
        name: "",
        teacher: "",
        state: "",
        limit: 10,
        page: 1,
      },
      visible: false,
    });
    const methods = {
      handleChange(value: any) {
        console.log(value);
        methods.tableList();
      },
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
      //   获取表格数据
      tableList() {
        state.loading = true;
        state.params.state = state.status === undefined ? "" : state.status;
        http.trainList({ param: state.params }).then((res: any) => {
          state.loading = false;
          state.data = res.data.list;
          state.total = res.data.page.totalCount;
        });
      },
      // 勾选多选框
      onSelectChange(selectedRowKeys: any) {
        state.selectedRowKeys = selectedRowKeys;
      },
      //   查询
      querySearch() {
        state.params.page = 1;
        methods.tableList();
      },
      clearAll() {
        state.params.name = "";
        state.params.teacher = "";
        state.status = undefined;
        methods.tableList();
      },
      //   确认删除
      handleOk() {
        http.deleteTrain({ param: { id: state.selectedRowKeys } }).then((res: any) => {
          console.log(res);
          methods.tableList();
        });
        state.visible = false;
      },
      deleteTrain() {
        console.log(state.selectedRowKeys, "state.selectedRowKeys");
        if (!state.selectedRowKeys.length) {
          message.warning("请选择要操作的实训！");
          return;
        }
        // else {
        // state.visible = true;
        Modal.confirm({
          title: "提示",
          // icon:,
          content: "确定要删除吗？",
          okText: "确认",
          cancelText: "取消",
          onOk: () => {
            http
              .deleteTrain({ param: { id: state.selectedRowKeys } })
              .then((res: any) => {
                console.log(res);
                methods.tableList();
              });
          },
        });
        // }
      },
      //   删除录像记录
      clearVideoRecord(id: any) {
        const deletearr: any = id ? [id] : state.selectedRowKeys;
        if (!deletearr.length) {
          message.warning("请选择要操作的实训！");
          return;
        }
        Modal.confirm({
          title: "提示",
          // icon:,
          content: "确定要删除吗？",
          okText: "确认",
          cancelText: "取消",
          onOk: () => {
            http.batchReleaseScreen({ param: { id: deletearr } }).then((res: any) => {
              console.log(res);
              state.selectedRowKeys = [];
            });
          },
        });
      },
      //   我的实训详情
      lookTrainDetail(id: any) {
        console.log("我的实训详情", id);
        router.push({ path: "adminTrain/trainInfo", query: { id: id, currentTab: 0 } });
      },
      //   我的实训查看结果
      lookResult(id: any) {
        console.log("我的实训结果", id);
        router.push({ path: "adminTrain/trainResult", query: { trainId: id } });
      },
    };
    onMounted(() => {
      methods.tableList();
    });
    return { ...toRefs(state), ...methods, columns };
  },
});
</script>
<style lang="less" scoped>
.header-search {
  display: flex;
  justify-content: space-between;
  .search-left {
    display: flex;
    > div {
      margin-right: 20px;
    }
    > button {
      margin-right: 20px;
    }
  }
  .search-right {
    > button:nth-child(1) {
      margin-right: 20px;
    }
  }
}
.purple {
  color: var(--purpleblue-6);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.purple:hover {
  color: var(--purplebule-3);
}

.item {
  display: flex;
  align-items: center;
  margin-right: 22px;
  :deep(.ant-select-selector) {
    width: 240px;
    height: 35px;
    padding-left: 30px;
    align-items: center;
  }
  :deep(.ant-input) {
    padding-left: 26px;
  }
}
.dev_state {
  :deep(.ant-select-selector)::before {
    content: "";
    position: absolute;
    left: 8px;
    top: 10px;
    background: url(src/assets/images/screenicon/Group3.png) no-repeat;
    width: 15px;
    height: 15px;
  }
}
</style>
