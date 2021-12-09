<template>
  <div id="initTrainInfo" v-layout-bg>
    <div class="header-search">
      <div class="search-left">
        <a-form-item label="实训名称">
          <a-input @keyup.enter="querySearch" v-model:value="params.name" />
        </a-form-item>
        <a-button type="primary" @click="querySearch">查询</a-button>
        <a-button type="primary" @click="clearAll">清空</a-button>
      </div>
    </div>
    <a-config-provider>
      <a-table :columns="columns" :data-source="data" rowKey="id">
        <template #content="{ record }">
          <div class="purple" @click="lookContent(record.id)">查看</div>
        </template>
        <template #resource="{ record }">
          <div class="purple" @click="lookResource(record.id)">查看</div>
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
      params: {
        name: "",
      },
    });
    const methods = {
      tableList() {
        http.builtTrainList({ param: state.params }).then((res: any) => {
          state.data = res.data.list;
        });
      },
      querySearch() {
        methods.tableList();
      },
      clearAll() {
        state.params.name = "";
        methods.tableList();
      },
      lookResource(id: any) {
        console.log(id);
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
