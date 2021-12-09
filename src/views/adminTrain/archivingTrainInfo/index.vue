<template>
  <div id="archivingTrainInfo" v-layout-bg>
    <div class="header-search">
      <div class="search-left">
        <a-form-item label="实训名称">
          <a-input @keyup.enter="querySearch" v-model:value="params.name" />
        </a-form-item>
        <a-form-item label="任课教师">
          <a-input @keyup.enter="querySearch" v-model:value="params.teacher" />
        </a-form-item>
        <a-button type="primary" @click="querySearch">查询</a-button>
        <a-button type="primary" @click="clearParams">清空</a-button>
      </div>
      <div class="search-right">
        <a-button type="primary">批量删除</a-button>
      </div>
    </div>
    <a-config-provider>
      <a-table
        :columns="columns"
        :data-source="data"
        rowKey="id"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <template #name="{ record }">
          <div class="purple" @click="archivingInfo(record.id)">
            {{ record.name }}
          </div>
        </template>
        <template #action="{ record }">
          <div class="purple" @click="deleteRow(record.id)">删除</div>
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
interface state {
  data: any[];
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
      selectedRowKeys: [],
      params: {
        name: "",
        teacher: "",
      },
    });
    const methods = {
      tableList() {
        http.archiveTrainList({ param: state.params }).then((res: any) => {
          state.data = res.data.list;
          // state.data = [{ name: "wse" }];
        });
      },
      querySearch() {
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
    margin-right: 10px;
  }
  > button {
    margin-right: 10px;
  }
}
.purple {
  color: @theme-color;
}
.purple:hover {
  color: @theme-light-color;
}
</style>
