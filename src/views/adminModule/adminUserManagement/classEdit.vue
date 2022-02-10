<template>
  <div class="header" v-layout-bg>
    <div class="search">
      <div>班级：</div>
      <div class="item">
        <a-input
          v-model:value="formState.name"
          placeholder="请输入班级名称"
          :disabled="!edit"
        />
      </div>
      <div class="item">
        <a-button type="primary" @click="editClassName">{{
          !edit ? "编辑" : "保存"
        }}</a-button>
      </div>
      <div class="addTeacher">
        <a-button @click="addStudent()" type="primary">添加学生</a-button>
      </div>
    </div>
    <div class="addTeacher">
      <a-button @click="BatchDelete()" type="primary">批量删除学生</a-button>
    </div>
  </div>
  <a-config-provider :renderEmpty="customizeRenderEmpty">
    <a-table
      :columns="columns"
      :loading="loading"
      :data-source="list"
      :bordered="true"
      row-key="id"
      :pagination="{
        current: ForumSearch.page,
        pageSize: ForumSearch.limit,
        total: total,
        onChange: onChangePage,
        hideOnSinglePage: true,
      }"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      class="columns"
    >
      <template #operation="{ record }">
        <i
          class="caozuo iconfont icon-shanchu"
          @click="delateStudent(record.id)"
          title="删除"
        ></i>
      </template>
    </a-table>
  </a-config-provider>
  <a-modal
    v-model:visible="visible"
    title="学生选择"
    :width="1080"
    class="modal-post"
    :footer="null"
  >
    <div class="header">
      <div class="search">
        <div class="item custom_input custom_input1">
          <a-input
            v-model:value="studentForm.username"
            placeholder="请输入账号"
            @keyup.enter="search()"
          />
        </div>
        <div class="item custom_input custom_input2">
          <a-input
            v-model:value="studentForm.name"
            placeholder="请输入姓名"
            @keyup.enter="search()"
          />
        </div>
        <div class="item custom_input custom_input3">
          <a-input
            v-model:value="studentForm.department"
            placeholder="请输入院系"
            @keyup.enter="search()"
          />
        </div>
        <div class="item">
          <a-button @click="addStudent()" type="primary">添加</a-button>
          <a-button type="primary" @click="search()">查询</a-button>
          <a-button type="primary" @click="clearSearch()">清空</a-button>
        </div>
      </div>
    </div>
    <a-config-provider :renderEmpty="StudentCustomizeRenderEmpty">
      <a-table
        :columns="StudentColumns"
        :loading="StudentLoading"
        :data-source="AllStudent"
        :bordered="true"
        row-key="id"
        :pagination="{
          current: studentForm.page,
          pageSize: studentForm.limit,
          total: StudentTotal,
          onChange: StudentOnChangePage,
          hideOnSinglePage: true,
        }"
        :row-selection="{
          selectedRowKeys: StudentSelectedRowKeys,
          onChange: StudentOnSelectChange,
        }"
        class="StudentColumns"
      >
      </a-table>
    </a-config-provider>
  </a-modal>
</template>

<script lang="tsx">
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { Modal, message } from "ant-design-vue";
import {
  createVNode,
  VNode,
  defineComponent,
  ref,
  onMounted,
  reactive,
  UnwrapRef,
  Ref,
  toRefs,
  inject,
  watch,
  computed,
} from "vue";
import { IBusinessResp } from "src/typings/fetch.d";
import request from "src/api/index";
import { useRouter, useRoute } from "vue-router";
import serve from "src/request/getRequest";
import {
  SmileOutlined,
  MehOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import { ColumnProps } from "ant-design-vue/es/table/interface";
import { log } from "console";
interface IforumSearch {
  limit: number;
  page: number;
}
interface IStudentForm {
  limit: number;
  page: number;
  username: string;
  department: string;
  name: string;
}
interface ItdItems {
  title: string;
  type: string;
  creat: string;
  replyViews: string;
  reply: string;
  id: number;
}
type Key = ColumnProps["key"];
interface TState {
  selectedRowKeys: Key[];
  onSelectChange: (v: Key[], selectedRows: Key[]) => void;
  StudentSelectedRowKeys: Key[];
  StudentOnSelectChange: (v: Key[], selectedRows: Key[]) => void;
}

const columns = [
  {
    title: "账号",
    dataIndex: "username",
    align: "center",
    width: 120,
    // slots: { customRender: 'title' },
  },
  {
    title: "姓名",
    dataIndex: "name",
    align: "center",
    width: 120,
  },
  {
    title: "性别",
    dataIndex: "gender",
    align: "center",
    // width:120,
    // slots: { customRender: 'title' },
  },
  {
    title: "所属院系",
    dataIndex: "department",
    align: "center",
    width: 120,
    // slots: { customRender: 'title' },
  },
  {
    title: "年级",
    dataIndex: "grade",
    align: "center",
    // width:120,
    // slots: { customRender: 'title' },
  },
  {
    title: "邮箱",
    dataIndex: "email",
    align: "center",
    width: 200,
    // slots: { customRender: 'title' },
  },
  {
    title: "电话",
    dataIndex: "phone",
    align: "center",
    width: 140,
    // slots: { customRender: 'title' },
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    slots: { customRender: "operation" },
    fixed: "right",
    width: 200,
  },
];
const StudentColumns = [
  {
    title: "账号",
    dataIndex: "username",
    align: "center",
    width: 120,
    // slots: { customRender: 'title' },
  },
  {
    title: "姓名",
    dataIndex: "name",
    align: "center",
    // width:120
  },
  {
    title: "性别",
    dataIndex: "gender",
    align: "center",
    // width:120,
    // slots: { customRender: 'title' },
  },
  {
    title: "所属院系",
    dataIndex: "department",
    align: "center",
    width: 120,
    // slots: { customRender: 'title' },
  },
  {
    title: "年级",
    dataIndex: "grade",
    align: "center",
    width: 120,
    // slots: { customRender: 'title' },
  },
  {
    title: "邮箱",
    dataIndex: "email",
    align: "center",
    width: 200,
    // slots: { customRender: 'title' },
  },
  {
    title: "电话",
    dataIndex: "phone",
    align: "center",
    width: 140,
    // slots: { customRender: 'title' },
  },
];

export default defineComponent({
  name: "classEdit",
  components: {
    SmileOutlined,
    MehOutlined,
  },
  setup: (props, { emit }) => {
    const router = useRouter();
    const route = useRoute();

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

    const http = (request as any).adminUserManagement;
    var loading: Ref<boolean> = ref(false);
    var StudentLoading: Ref<boolean> = ref(false);
    var visible: Ref<boolean> = ref(false);
    var total: Ref<number> = ref(0);
    var list: ItdItems[] = reactive([]);
    var AllStudent: any = reactive([]);
    var StudentTotal: Ref<number> = ref(0);
    var editId: Ref<number> = ref(Number(route.query.editId));
    var edit: Ref<boolean> = ref(false);
    var formRef = ref();
    var state: TState = reactive({
      selectedRowKeys: [],
      onSelectChange: (selectedRowKeys: Key[], selectedRows: Key[]) => {
        console.log("RowKeys changed: ", selectedRowKeys);
        // console.log('selectedRows: ', selectedRows);
        state.selectedRowKeys = selectedRowKeys;
        // state.selectedRows = selectedRows;
        // console.log(state);
      },
      StudentSelectedRowKeys: [],
      StudentOnSelectChange: (selectedRowKeys: Key[], selectedRows: Key[]) => {
        // console.log('RowKeys changed: ', selectedRowKeys);
        // console.log('selectedRows: ', selectedRows);
        state.StudentSelectedRowKeys = selectedRowKeys;
        // state.selectedRows = selectedRows;
      },
    });
    const customizeRenderEmpty = function (): VNode {
      if (loading.value) {
        return <template></template>;
      } else {
        let type = "tableEmpty";
        return <empty type={type} />;
      }
    };
    const StudentCustomizeRenderEmpty = function (): VNode {
      if (StudentLoading.value) {
        return <template></template>;
      } else {
        let type = "tableEmpty";
        return <empty type={type} />;
      }
    };
    var studentForm: IStudentForm = reactive({
      limit: 10,
      page: 1,
      username: "",
      department: "",
      name: "",
    });
    var ForumSearch: IforumSearch = reactive({
      limit: 10,
      page: 1,
    });
    var formState: any = reactive({
      name: "",
    });
    function initData() {
      // console.log(ForumSearch)
      loading.value = true;
      list.length = 0;
      http
        .classBelongingList({
          urlParams: { class_id: editId.value },
          param: { ...ForumSearch },
        })
        .then((res: IBusinessResp) => {
          loading.value = false;
          let data = res.data.list;
          list.push(...data);
          total.value = res.data.page.totalCount;
          // total.value=30
          // console.log(list)
        });
      http
        .classBelongingDetail({ urlParams: { class_id: editId.value } })
        .then((res: IBusinessResp) => {
          formState.name = res.data.classname;
        });
    }
    function search() {
      // const {query,path}= route
      // let obj:any={
      //   title:ForumSearch.students_count,
      //   type:ForumSearch.name
      // }
      // ForumSearch.students_count?'': delete obj.title
      // ForumSearch.name === undefined ? delete obj.type:''
      // await router.replace({
      //       path: path,
      //       query: {currentTab:query.currentTab,...obj},
      // })
      studentForm.page = 1;
      state.StudentSelectedRowKeys = [];
      GetStudent();
      // }
    }
    function delateStudent(id: number) {
      // console.log(val)
      Modal.confirm({
        title: "确认删除吗？",
        icon: createVNode(ExclamationCircleOutlined),
        content: "删除后不可恢复",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          deleteStudent([id]);
        },
      });
    }
    function deleteStudent(ids: any) {
      console.log(ids);
      // return
      http
        .deleteClassStudent({
          urlParams: { class_id: editId.value },
          param: { student_ids: ids },
        })
        .then((res: IBusinessResp) => {
          initData();
          state.selectedRowKeys = [];
          state.StudentSelectedRowKeys = [];
          message.success("删除成功");
        });
    }
    function BatchDelete() {
      if (!state.selectedRowKeys.length) {
        message.warn("请选择要删除的数据");
        return;
      }
      Modal.confirm({
        title: "确认删除吗？",
        icon: createVNode(ExclamationCircleOutlined),
        content: "删除后不可恢复",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          deleteStudent(state.selectedRowKeys);
        },
      });
    }
    function editClassName() {
      // editId.value=val.id
      if (edit.value === false) {
        edit.value = true;
        return;
      }
      const reg = new RegExp("^[a-zA-Z0-9\u4e00-\u9fa5]{3,15}$");
      if (!reg.test(formState.name)) {
        message.warn("班级名称为字母、数字、汉子，长度为3-15");
        return;
      }
      let obj = {
        name: formState.name,
        student_ids: [],
      };
      http
        .editClass({ urlParams: { class_id: editId.value }, param: { ...obj } })
        .then((res: IBusinessResp) => {
          message.success("保存成功");
          edit.value = false;
          initData();
        });
    }
    function clearSearch() {
      // if(studentForm.username || studentForm.department || studentForm.name){
      studentForm.name = "";
      studentForm.username = "";
      studentForm.department = "";
      GetStudent();
      // }
    }
    function onChangePage(val: number) {
      ForumSearch.page = val;
      state.selectedRowKeys.length = 0;
      initData();
    }
    function StudentOnChangePage(val: number) {
      studentForm.page = val;
      state.StudentSelectedRowKeys.length = 0;
      GetStudent();
    }
    function GetStudent() {
      StudentLoading.value = true;
      AllStudent.length = 0;
      let obj = {
        "search[username]": studentForm.username,
        "search[name]": studentForm.name,
        "search[department]": studentForm.department,
        "search[class_id]": editId.value,
        limit: studentForm.limit,
        page: studentForm.page,
      };
      // class_id:editId.value,
      http
        .classStudentList({ param: { ...obj } })
        .then((res: IBusinessResp) => {
          StudentLoading.value = false;
          let data = res.data.list;
          AllStudent.push(...data);
          StudentTotal.value = res.data.page.totalCount;
        });
    }
    function addStudent() {
      if (visible.value === false) {
        clearSearch();
        visible.value = true;
        state.selectedRowKeys = [];
        state.StudentSelectedRowKeys = [];
        return;
      }
      if (!state.StudentSelectedRowKeys.length) {
        message.warn("请选择要添加的学生");
        return;
      }
      http
        .editClass({
          urlParams: { class_id: editId.value },
          param: { student_ids: state.StudentSelectedRowKeys },
        })
        .then((res: IBusinessResp) => {
          state.selectedRowKeys = [];
          state.StudentSelectedRowKeys = [];
          message.success("添加成功");
          initData();
          visible.value = false;
        });
      // router.push('/studentForum/CreatePosts')
    }
    onMounted(() => {
      initData();
    });
    return {
      ...toRefs(state),
      customizeRenderEmpty,
      StudentCustomizeRenderEmpty,
      StudentColumns,
      AllStudent,
      StudentTotal,
      formRef,
      formState,
      edit,
      list,
      columns,
      studentForm,
      ForumSearch,
      loading,
      StudentLoading,
      total,
      visible,
      search,
      onChangePage,
      StudentOnChangePage,
      clearSearch,
      delateStudent,
      BatchDelete,
      editClassName,
      addStudent,
    };
  },
});
</script>

<style scoped lang="less">
// .modal-post{
//   :deep(.ant-modal-header){
//       border:  1px solid var(--primary-color);
//       background: var(--primary-color);
//     }
//   .ant-modal-header{
//     background: var(--primary-color);
//   }
// }
// :deep(.ant-modal-header){
//   border:  1px solid var(--primary-color);
//   background: var(--primary-color);
// }
:deep(.ant-table-pagination.ant-pagination) {
  width: 100%;
  text-align: center;
}
.caozuo {
  padding: 0 8px;
  color: var(--primary-color);
  cursor: pointer;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 0 15px;
  .search {
    flex: 1;
    display: flex;
    align-items: center;
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
    .item:last-child {
      .ant-btn {
        margin: 0 8px;
      }
    }
    .custom_input {
      position: relative;
      &::before {
        content: "";
        position: absolute;
        left: 8px;
        top: 8px;
        background: url(../../assets/images/screenicon/Group7.png) no-repeat;
        width: 16px;
        height: 16px;
        z-index: 10;
      }
    }
    .custom_input2 {
      &::before {
        background: url(../../assets/images/screenicon/Group6.png) no-repeat;
      }
    }
    .custom_input3 {
      &::before {
        background: url(../../assets/images/screenicon/Group8.png) no-repeat;
      }
    }
  }
  .addTeacher {
    margin-right: 16px;
  }
}
:deep(.ant-form-item-control) {
  flex: 0 0 100%;
}
:deep(.ant-radio-group) {
  display: flex;
}
.formBox {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .left,
  .right {
    width: 46%;
  }
}
:deep(.ant-form-item-with-help) {
  width: 100%;
}
:deep(.ant-form-item) {
  margin-bottom: 10px;
}
.userinitpassword {
  .ant-checkbox-wrapper {
    margin: 0 10px;
  }
}
</style>
