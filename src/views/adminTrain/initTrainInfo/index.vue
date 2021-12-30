<template>
  <div id="initTrainInfo" v-layout-bg>
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
        <a-button type="primary" @click="querySearch">查询</a-button>
        <a-button type="primary" @click="clearAll">清空</a-button>
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
                pageSize: params.limit,
                onChange: onChange,
                onShowSizeChange: onShowSizeChange,
              }
            : false
        "
      >
        <template #content="{ record }">
          <div class="purple a-link" @click="lookContent(record.id)">查看</div>
        </template>
        <template #resource="{ record }">
          <div class="purple a-link" @click="lookResource(record.id)">查看</div>
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
  total: number;
  loading: boolean;
  params: any;
}
export default defineComponent({
  name: "initTrainInfo",
  components: { Empty },
  setup: (props, context) => {
    const router = useRouter();
    const http = (request as any).adminTrain;

    const columns: any = [
      {
        title: "名称",
        dataIndex: "name",
      },
      {
        title: "实验数",
        dataIndex: "task_num",
      },
      {
        title: "课时数",
        dataIndex: "class_cnt",
      },
      {
        title: "内容",
        dataIndex: "content",
        slots: { customRender: "content" },
      },
      {
        title: "资源",
        dataIndex: "resource",
        slots: { customRender: "resource" },
      },
    ];
    const state: state = reactive({
      data: [],
      total: 0,
      loading: false,
      params: {
        name: "",
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
        http.builtTrainList({ param: state.params }).then((res: any) => {
          state.loading = false;
          state.data = res.data.list;
          state.total = res.data.page.totalCount;
        });
      },
      querySearch() {
        state.params.page = 1;
        methods.tableList();
      },
      clearAll() {
        state.params.name = "";
        methods.tableList();
      },
      lookResource(id: any) {
        console.log(id);
        router.push({
          path: "adminTrain/initResource",
          query: { trainId: id, trainType: "1" },
        });
      },
      lookContent(id: any) {
        console.log(id);
        router.push({ path: "adminTrain/trainInfo", query: { id: id, currentTab: 1 } });
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
  color: @theme-color;
}
.purple:hover {
  color: @theme-light-color;
}
:deep(.ant-table-pagination.ant-pagination) {
  float: none;
  text-align: center;
}
</style>
