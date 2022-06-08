<template>
  <div class="userloginInformation" v-layout-bg>
    <div class="searchParams">
      <div class="searchItem">
        <span class="inputLable">用户名</span>
        <a-input
          style="width: 150px"
          placeholder="请输入搜索关键词"
          v-model:value="state.query.user_name"
          @keyup.enter="handleChange"
        >
        </a-input>
      </div>
      <div class="searchItem">
        <span class="inputLable">操作类型</span>
        <a-select
          class="input"
          v-model:value="state.query.type"
          default-value="请选择"
          @change="handleChange"
        >
          <a-select-option
            v-for="(item, index) in state.operateType"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
      </div>
    </div>
    <a-table
      :columns="columns"
      :data-source="state.data"
      rowKey="id"
      :pagination="
        tableData.total > 10
          ? {
              hideOnSinglePage: false,
              showSizeChanger:true,
              total: tableData.total,
              current: tableData.page,
              pageSize: tableData.limit,
              onChange: onChange,
              onShowSizeChange: onShowSizeChange,
            }
          : false
      "
    >
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  toRefs,
  inject,
  watch,
} from "vue";
import request from "src/api/index";
const http = (request as any).systemMaintenance;
const tableData = reactive({
  total: 0,
  page: 1,
  limit: 10,
});
const columns: any = ref();
columns.value = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "用户名",
    dataIndex: "user_name",
  },
  {
    title: "账号",
    dataIndex: "user_account",
  },
  {
    title: "操作类型",
    dataIndex: "type",
  },
  {
    title: "操作行为",
    dataIndex: "operation_type",
  },
  {
    title: "IP地址",
    dataIndex: "ip",
  },
  {
    title: "操作时间",
    dataIndex: "created_at",
  },
];
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "用户登录信息", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const state: any = reactive({
  data: [],
  query: {
    type: "",
    user_name: ""
  },
  operateType: [
    { value: "", label: "全部" },
    { value: "登录", label: "登录" },
    { value: "退出", label: "退出" }
  ]
});
function getSystemList() {
  let search = {
    // ...ForumSearch,
    limit: tableData.limit,
    page: tableData.page,
    "search[user_name]": state.query.user_name,
    "search[type]": state.query.type
  };
  http.systemLogList({ param: search }).then((res: any) => {
    console.log(res);
    state.data = res.data.list;
    tableData.total = res.data.page.totalCount;
  });
}
function search() {
  getSystemList();
}
function clear() {
  state.opertype = undefined;
  state.query.type = "";
  state.query.operation_type = "";
  state.query.ip = "";
  state.query.begintime = "";
  state.query.endtime = "";
  getSystemList();
}
function onChange(page: any, pageSize: any) {
  tableData.page = page;
  getSystemList();
}
function onShowSizeChange(page: any, pageSize: any) {
  tableData.page = 1;
  tableData.limit = pageSize;
  getSystemList();
}
function handleChange() {
  tableData.page = 1;
  getSystemList();
}
onMounted(() => {
  getSystemList();
});
</script>
<style lang="less" scoped>
.userloginInformation {
  padding: 30px;
  background: var(--white-100);
  .searchParams {
    display: flex;
    > div {
      margin-right: 30px;
      margin-bottom: 20px;
      .inputLable {
        margin-right: 15px;
      }
      .ant-input, .ant-select{
        width: 224px !important;
      }
    }
  }
}
</style>
