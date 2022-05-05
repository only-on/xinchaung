<template>
  <a-tabs @change="changeTab" defaultActiveKey="1">
    <a-tab-pane v-for="(tab, i) in planTtab" :key="i" :tab="tab.tabList">
      <div class="search-plan">
        <a-input
          style="width: 245px"
          v-model:value="searchValue"
          placeholder="请输入搜索关键词"
        />
        <a-button
          class="editable-add-btn"
          @click="handleAdd"
          type="primary"
          shape="circle"
          >添加{{ tab.title }}</a-button
        >
      </div>

      <logicDiagram v-if="i == 3" :tabsName="tabsName" />

      <a-table :data-source="dataSource" a :columns="columns" v-if="i != 3">
        <template #name="{ text, record }">
          <div class="editable-cell">
            <div
              v-if="editableData[record.key]"
              class="editable-cell-input-wrapper"
            >
              <a-input
                v-model:value="editableData[record.key].name"
                @pressEnter="save(record.key)"
              />
            </div>
            <div v-else class="editable-cell-text-wrapper">
              {{ text || " " }}
            </div>
          </div>
        </template>
        <template #operation="{ record }">
          <span class="functionButton" v-if="editableData[record.key]">
            <a @click="save(record.key)">确定</a>
          </span>
          <span class="functionButton" v-else>
            <a @click="edit(record.key)">修改</a>
            <a @click="onDelete(record.key)">删除</a>
          </span>
        </template>
      </a-table>
    </a-tab-pane>
  </a-tabs>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  computed,
  toRefs,
  watch,
  defineExpose,
  defineProps,
  withDefaults,
  UnwrapRef,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { SelectTypes } from "ant-design-vue/es/select";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import logicDiagram from "src/views/teacherModule/knowledgeMap/index.vue";
import { CheckOutlined, EditOutlined } from "@ant-design/icons-vue";
import { cloneDeep } from "lodash";
const router = useRouter();
const route = useRoute();
const { editId } = route.query;
const http = (request as any).adminTechnicalDirection;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
const activeKey = ref<string>("0");
const searchValue = ref<any>("");
const tabsName = ref<any>("方向规划");
updata({
  tabs: [{ name: "方向规划", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const planTtab: any = [
  { tabList: "课程方向规划", title: "课程方向" },
  { tabList: "职业方向规划", title: "职业方向" },
  { tabList: "技术方向规划", title: "技术方向" },
  { tabList: "知识图谱规划", title: "知识图谱" },
  { tabList: "标签规划", title: "标签" },
];


onMounted(() => {
  changeTab(0);
});
var actKey: any;
var editableDataKey: any;
let obj: any = {
  0: {
    list: "classList",
    delete: "classdel",
    modify: "classedit",
  },
  /**职业方向 */
  1: {
    list: "occupation",
    delete: "occupationdel",
    modify: "occupationedit",
  },
  /**技术方向 */
  2: {
    list: "technologyList",
    delete: "technologydel",
    modify: "technologyedit",
  },
  3: {},
  4: {
    list: "LabelingrulesList",
    delete: "Labelingrulesdel",
    modify: "Labelingruleseditt",
  },
};
const changeTab = (activeKey: any) => {
  actKey = activeKey;
  if (!!editableDataKey || editableDataKey == 0) {
    delete editableData[editableDataKey];
  }
  /**切换tab标签 */
  var newhttp = http[obj[activeKey]["list"]]();
  if (activeKey != 3) {
    newhttp.then((res: any) => {
      // dataSource.value = res.data.list;
      let data: any = res.data.list;
      data.forEach((item: any, index: any) => {
        for (const key in item) {
          data[index].key = index;
        }
      });
      dataSource.value = data;
    });
  }
};
/** table */
interface DataItem {
  key: string;
  name: string;
  id: any;
}
const columns = [
  {
    title: "方向",
    dataIndex: "name",
    width: "50%",
    align: "center",
    slots: { customRender: "name" },
  },

  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    slots: { customRender: "operation" },
  },
];
var dataSource: Ref<DataItem[]> = ref([]);
const count = computed(() => dataSource.value.length + 1);
const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

const edit = (key: string) => {
  if (!!editableDataKey || editableDataKey == 0) {
    delete editableData[editableDataKey];
  }
  editableDataKey = key;
  editableData[key] = cloneDeep(
    dataSource.value.filter((item) => key === item.key)[0]
  );
};
const save = (key: string) => {
  /**保存对号 */
  Object.assign(
    dataSource.value.filter((item) => key === item.key)[0],
    editableData[key]
  );
  const params = {
    name: editableData[key].name,
  };
  console.log(editableData[key]);
  var newhttp = http[obj[actKey]["list"]]({
    urlParams: { ID: editableData[key].id },
    param: params,
  });
  newhttp.then((res: any) => {
    console.log(res);
    delete editableData[key];
  });
};

const onDelete = (key: string) => {
  Modal.confirm({
    title: "删除",
    content: "确定删除改项吗",
    onOk: () => {
      var newhttp = http[obj[actKey]["list"]]({
        urlParams: { ID: dataSource.value[key].id },
      });
      newhttp.then((res: any) => {
        console.log(res);
        delete editableData[key];
        dataSource.value = dataSource.value.filter((item) => item.key !== key);
      });
    },
  });
};
const handleAdd = () => {
  const newData = {
    key: `${count.value}`,
    name: `Edward King ${count.value}`,
    id:'',
  };
  dataSource.value.push(newData);
  edit(`${count.value}`);
};
</script>
<style scoped lang="less">
.search-plan {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
.ant-tabs {
  margin: 0 auto;
  width: var(--center-width);
}
.knowledgeMap {
  width: var(--center-width);
  .jsmind-inner {
    overflow: inherit;
  }
}
.ant-input {
  width: 70%;
}
.functionButton {
  a {
    color: var(--primary-color);
    font-size: 14px;
    margin: 0 7.5px;
  }
}
</style>
