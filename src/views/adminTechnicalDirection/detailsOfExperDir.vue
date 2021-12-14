<template>
  <div class="detailsOfExperDir" v-layout-bg>
    <div class="header">
      <a-input-search
        class="input"
        placeholder="请输入章节名称关键字查询"
        enter-button="查询"
        size="large"
        @keyup.enter="onSearch"
        v-model:value="params.name"
        @search="onSearch"
      />
      <a-button type="primary" @click="goBack">返回</a-button>
    </div>

    <div class="table">
      <a-config-provider>
        <a-table :columns="columns" :data-source="data" rowKey="id">
          <template #action="{ record }">
            <div class="purple" @click="deleteRow(record.id)">删除</div>
          </template>
        </a-table>
        <template #renderEmpty>
          <div><empty type="tableEmpty"></empty></div>
        </template>
      </a-config-provider>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  toRefs,
  watch,
  inject,
  Ref,
} from "vue";
import request from "src/api/index";
import { useRoute, useRouter } from "vue-router";
import { Modal, message } from "ant-design-vue";
const columns = [
  {
    title: "章节名称",
    dataIndex: "name",
  },
  {
    title: "试验数量",
    dataIndex: "contents_count",
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 240,
    align: "center",
    slots: { customRender: "action" },
  },
];
interface Istate {
  data: any[];
  params: any;
}
export default defineComponent({
  name: "detailsOfExperDir",
  components: {},
  setup: (props, context) => {
    const route = useRoute();
    const router = useRouter();
    const http = (request as any).adminTechnicalDirection;
    var configuration: any = inject("configuration");
    var updata = inject("updataNav") as Function;
    updata({
      tabs: [],
      navPosition: "outside",
      navType: false,
      showContent: true,
      componenttype: undefined,
      showNav: true,
      backOff: false,
      showPageEdit: false,
    });
    const state: Istate = reactive({
      data: [],
      params: {
        name: "",
      },
    });
    const methods = {
      getList() {
        const params = {
          "search[name]": state.params.name,
        };
        http
          .dirListDetail({
            urlParams: { category_id: route.query.id },
            param: params,
          })
          .then((res: any) => {
            state.data = res.data.list;
          });
      },
      onSearch() {
        methods.getList();
      },
      deleteRow(id: any) {
        console.log(id);
        Modal.confirm({
          title: "提示",
          content: "确定要删除吗？",
          okText: "确认",
          cancelText: "取消",
          onOk: () => {
            http.deleteDetailList({ urlParams: { category_id: id } }).then((res: any) => {
              console.log(res);
              methods.getList();
            });
          },
        });
      },
      goBack() {
        router.go(-1);
      },
    };
    watch(
      () => {
        return configuration.componenttype;
      },
      (val) => {
        console.log(val);
      }
    );

    onMounted(() => {
      methods.getList();
    });
    return { columns, ...methods, ...toRefs(state) };
  },
});
</script>

<style scoped lang="less">
.header {
  display: flex;
  justify-content: space-between;
}
.table {
  margin-top: 20px;
}
.input {
  width: 60%;
  box-sizing: border-box;
}
:deep(.ant-input-lg) {
  padding: 5px 11px;
}
.purple {
  color: @theme-color;
}
.purple:hover {
  color: @theme-light-color;
}
</style>
