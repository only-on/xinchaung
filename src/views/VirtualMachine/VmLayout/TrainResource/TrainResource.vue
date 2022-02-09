<template>
  <div class="train-resource">
    <a-config-provider>
      <a-table
        :data-source="dataSource"
        :columns="columns"
        :rowKey="rowKey"
        :pagination="false"
      >
        <template #name="{ text }">
          <div :title="text">{{ text }}</div>
        </template>
        <template #describe="{ text }">
          <div :title="text">{{ text }}</div>
        </template>
        <template #operation="{ text }">
          <div class="row-action">
            <span @click="show(text)" class="icon-chakan1 iconfont"></span>
            <span @click="down(text)" class="icon-download iconfont"></span>
          </div>
        </template>
      </a-table>
      <template #renderEmpty>
        <div><empty type="tableEmpty"></empty></div>
      </template>
    </a-config-provider>
    <a-pagination
      class="page-box"
      v-if="total != 0"
      :default-current="param.page"
      :default-page-size="param.limit"
      :total="total"
      @change="pageChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
import request from "src/request/getRequest";
import { useRoute } from "vue-router";
import { downloadUrl } from "src/utils/download";
import empty from "src/components/Empty.vue"

export default defineComponent({
  components:{
    empty
  },
  setup() {
    const TrainApi = request.vmApi;
    const route = useRoute();
    let vmQuery = route.query as any;
    const { taskId }: any = vmQuery;
    const columns = [
      {
        title: "资源名称",
        dataIndex: "name",
        width: "30%",
        slots: { customRender: "name" },
      },
      {
        title: "资源说明",
        dataIndex: "describe",
        slots: { customRender: "describe" },
      },
      {
        title: "类型",
        dataIndex: "posfix",
      },
      {
        title: "操作",
        slots: { customRender: "operation" },
      },
    ];
    const reactiveData = reactive({
      total: 0,
      param: {
        id: taskId,
        limit: 20,
        page: 1,
        name: "",
        ext: "",
        type: 2,
      },
    });
    const dataSource: any = ref([]);
    onMounted(() => {
      getResource();
    });
    function getResource() {
      dataSource.value = [];
      TrainApi.getTrainResourceApi({ param: reactiveData.param }).then(
        (res) => {
          if (res?.data) {
            dataSource.value = res.data.list;
          }
        }
      );
    }
    const rowKey = (row: any) => {
      return row.id;
    };
    function show(val: any) {
      console.log(val);
    }

    function down(val: any) {
      let env = process.env.NODE_ENV === "development" ? true : false;
      downloadUrl(env ? "/proxyPrefix" + val.url : val.url);
    }

    // 页码发生变化时
    function pageChange(page: number, pageSize: number) {
      reactiveData.param.limit = pageSize;
      reactiveData.param.page = page;
      getResource();
    }
    return {
      dataSource,
      columns,
      show,
      down,
      rowKey,
      ...toRefs(reactiveData),
      pageChange,
    };
  },
});
</script>

<style lang="less">
.train-resource {
  padding: 15px;
  .row-action {
    > span {
      margin-right: 10px;
      &:hover {
        color: var(--primary-color);
        cursor: pointer;
      }
    }
  }
  .ant-table-row-cell-break-word {
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .page-box {
    text-align: center;
    margin-top: 15px;
  }
}
</style>
