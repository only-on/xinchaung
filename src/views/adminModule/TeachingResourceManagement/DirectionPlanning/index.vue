<template>
  <div class="directionPlanning">
    <a-tabs @change="changeTab" v-model:activeKey="activeKey"  :animated="false">
      <a-tab-pane v-for="(tab, i) in planTtab" :key="i" :tab="tab.tabList">
        <div class="search-plan" v-if="i !== 3">
          <a-input
            style="width: 245px"
            v-model:value="searchParams.name"
            placeholder="请输入搜索关键词"
            @pressEnter="getList"
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
        <a-config-provider>
            <a-table
            v-if="i !== 3"
            :data-source="tableData.data"
            :columns="columns"
            rowKey="id"
            :pagination="{
              current: searchParams.page,
              pageSize: searchParams.limit,
              total: tableData.total,
              onChange: onChangePage,
              hideOnSinglePage: true,
            }">
            <template #name="{ text, index }">
              <div class="editable-cell">
                <div
                  v-if="editableData[index]"
                  class="editable-cell-input-wrapper"
                >
                  <a-input
                    v-model:value="editableData[index].name"
                    @pressEnter="save(index)"
                  />
                </div>
                <div v-else class="editable-cell-text-wrapper">
                  {{ text || " " }}
                </div>
              </div>
            </template>
            <template #operation="{ record, index }">
              <span class="functionButton" v-if="editableData[index]">
                <a @click="save(index)">确定</a>
              </span>
              <span class="functionButton" v-else>
                <a @click="edit(record, index)">修改</a>
                <a @click="onDelete(record.id)">删除</a>
              </span>
            </template>
          </a-table>
          <template #renderEmpty>
            <Empty :type="EmptyType"/>
          </template>
        </a-config-provider>
      </a-tab-pane>
    </a-tabs>
  </div>
  <!-- 添加 -->
  <a-modal
    v-model:visible="dialogVisible"
    :title="'添加' + modalTitle"
    :width="500"
  >
    <a-form
      :layout="'vertical'"
      :rules="rules"
      :model="formState"
      ref="formRef"
    >
      <a-form-item :label="modalTitle + '名称'" name="name">
        <a-input
          v-model:value="formState.name"
          :placeholder="modalTitle + '名称'"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <Submit @submit="saveAdd" @cancel="cancel"></Submit>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  inject,
  UnwrapRef,
  computed
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { SelectTypes } from "ant-design-vue/es/select";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import logicDiagram from "src/views/teacherModule/knowledgeMap/index.vue";
import { CheckOutlined, EditOutlined } from "@ant-design/icons-vue";
import { cloneDeep } from "lodash";
import Submit from "src/components/submit/index.vue";
const router = useRouter();
const route = useRoute();
const { editId } = route.query;
const http = (request as any).adminTechnicalDirection;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
const activeKey = ref<any>(0);
const tabsName = ref<any>("方向规划");
const formRef = ref<any>();
const formState = reactive<any>({
  name: ''
})
const searchParams = reactive<any>({
  name: '',
  page: 1,
  limit: 10
})
const modalTitle = ref<string>('')
const tableData = reactive<any>({
  data: [],
  total: 0
})
const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});
const dialogVisible = ref<boolean>(false)
const EmptyType:any=computed(()=>{
  let str=''
  if(searchParams.name === ''){
    str= 'tableEmpty'
  }else{
    str= 'tableSearchEmpty'
  }
  return str
})

updata({
  tabs: [{ name: "方向规划", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const rules = {
  name: [
    { required: true, message: `请输入方向名称`, trigger: "blur" },
    { max: 30, message: `名称最多30个字符`, trigger: "blur" },
  ],
}
const planTtab: any = [
  { tabList: "课程方向规划", title: "课程方向" },
  { tabList: "职业方向规划", title: "职业方向" },
  { tabList: "技术方向规划", title: "技术方向" },
  { tabList: "知识图谱规划", title: "知识图谱" },
  { tabList: "标签规划", title: "标签" },
];
var editableDataKey: any;
let obj: any = {
  0: {
    list: "classList",
    delete: "classdel",
    modify: "classedit",
    add: "classAdd"
  },
  /**职业方向 */
  1: {
    list: "occupation",
    delete: "occupationdel",
    modify: "occupationedit",
    add: "occupationAdd"
  },
  /**技术方向 */
  2: {
    list: "technologyList",
    delete: "technologydel",
    modify: "technologyedit",
    add: "technologyAdd"
  },
  3: {},
  4: {
    list: "LabelingrulesList",
    delete: "Labelingrulesdel",
    modify: "Labelingruleseditt",
    add: "LabelingrulesAdd"
  },
};
/** table */
interface DataItem {
  key: string;
  name: string;
  id: any;
}
const columns = reactive<any>([
  {
    title: "课程方向",
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
  }
])

function getList () {
  if (activeKey.value !== 3) {
    var newhttp = http[obj[activeKey.value]["list"]]({
      param: searchParams
    });
    newhttp.then((res: IBusinessResp) => {
      tableData.data = res.data.list;
      tableData.total = res.data.page.totalCount
    });
  }
}
const onChangePage = (val:number) => {
  searchParams.page = val
  getList()
}
const changeTab = (key: any) => {
  if (!!editableDataKey || editableDataKey == 0) {
    delete editableData[editableDataKey];
  }
  columns[0].title = planTtab[key].title
  searchParams.page = 1
  searchParams.name = ''
  getList()
};
const edit = (record:any, key: number) => {
  if (!!editableDataKey || editableDataKey == 0) {
    delete editableData[editableDataKey];
  }
  editableDataKey = key;
  editableData[key] = cloneDeep(record);
};
const save = (key: number) => {
  if (!editableData[key].name) {
    message.warn(planTtab[activeKey.value].title + '不能为空')
    return
  }
  if (editableData[key].name.length > 30) {
    message.warn(planTtab[activeKey.value].title + '不能超过30个字符')
    return
  }
  var newhttp = http[obj[activeKey.value]["modify"]]({
    urlParams: { ID: editableData[key].id },
    param: {
      name: editableData[key].name
    },
  });
  newhttp.then((res: IBusinessResp) => {
    message.success('修改成功')
    delete editableData[key];
    getList()
  });
};

const onDelete = (id: number) => {
  Modal.confirm({
    title: "删除",
    content: "确定删除该项吗",
    okText: "确认",
    cancelText: "取消",
    onOk: () => {
      if (!id) return
      var newhttp = http[obj[activeKey.value]["delete"]]({
        urlParams: { ID: id },
      });
      newhttp.then((res: IBusinessResp) => {
        message.success('删除成功')
        getList()
      });
    },
  });
};
// 添加
const handleAdd = () => {
  dialogVisible.value = true
  modalTitle.value = planTtab[activeKey.value].title
  formState.name = ''
};
const saveAdd = () => {
  var newhttp = http[obj[activeKey.value]["add"]]({
    param: formState,
  });
  formRef.value.validate().then(() => {
    newhttp.then((res: IBusinessResp) => {
      dialogVisible.value = false
      message.success('添加成功')
      getList()
    });
  })
}
const cancel = () => {
  dialogVisible.value = false
  formRef.value.resetFields();
}
onMounted(() => {
  getList();
});
</script>
<style scoped lang="less">
.directionPlanning {
  padding: 30px;
  background: var(--white-100);
  .search-plan {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
  :deep(.ant-tabs) {
    .ant-tabs-nav .ant-tabs-tab {
      font-size: 16px;
    }
    .ant-tabs-ink-bar {
      height: 1px;
    }
  }
  .knowledgeMap {
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
}
</style>
