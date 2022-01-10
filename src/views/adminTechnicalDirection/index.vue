<template>
  <div class="adminTechnicalDirection" v-layout-bg>
    <a-input-search
      class="input"
      placeholder="请输入技术方向关键字查询"
      enter-button="查询"
      size="large"
      @keyup.enter="onSearch"
      v-model:value="params.name"
      @search="onSearch"
    />
    <div class="table">
      <a-config-provider>
        <a-table :columns="columns" :data-source="data" rowKey="id">
          <template #name="{ record }">
            <div class="purple" @click="lookDetail(record.id)">
              {{ record.name }}
            </div>
          </template>
          <template #action="{ record }">
            <div class="purple" @click="lookDetail(record.id)">查看</div>
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
import { useRouter } from "vue-router";
const columns = [
  {
    title: "技术方向",
    dataIndex: "name",
    slots: { customRender: "name" },
    filtered: true,
  },
  {
    title: "章节数",
    dataIndex: "projects_count",
    filtered: true,
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 240,
    align: "center",
    slots: { customRender: "action" },
    filtered: true,
  },
];
interface Istate {
  data: any[];
  params: any;
}
export default defineComponent({
  name: "adminTechnicalDirection",
  components: {},
  setup: (props, context) => {
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
        http.technicalDirectionList({ param: params }).then((res: any) => {
          state.data = res.data.list;
        });
      },
      onSearch() {
        methods.getList();
      },
      lookDetail(id: any) {
        console.log("hahha");
        router.push({
          path: "technicalDirection/detailsOfExperDir",
          query: { id: id },
        });
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
  color: var(--purpleblue-6);
}
.purple:hover {
  color: var(--purplebule-3);
}
</style>
