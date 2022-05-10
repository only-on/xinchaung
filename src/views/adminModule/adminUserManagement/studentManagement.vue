<template>
  <div class="header" v-layout-bg>
    <div class="search">
      <!-- <div class="item custom_input custom_input1">
        <a-input
          v-model:value="ForumSearch.username"
          placeholder="请输入学号"
          @keyup.enter="search()"
        />
      </div> -->
      <div class="item custom_input custom_input2">
        <span style="width:50px">姓名</span>
        <a-input
          style="width:224px"
          v-model:value="ForumSearch.name"
          placeholder="请输入搜索关键词"
          @keyup.enter="search()"
        />
      </div>
      <div class="item custom_input custom_input2">
        <span style="width:50px">专业</span>
        <a-input
          style="width:224px"
          v-model:value="ForumSearch.name"
          placeholder="请输入搜索关键词"
          @keyup.enter="search()"
        />
      </div>
      <div class="item custom_input custom_input2">
        <span style="width:50px">班级</span>
        <a-input
          style="width:224px"
          v-model:value="ForumSearch.name"
          placeholder="请输入搜索关键词"
          @keyup.enter="search()"
        />
      </div>
      <div class="item custom_input custom_input2">
        <span style="width:50px">年级</span>
        <a-input
        style="width:224px"
          v-model:value="ForumSearch.name"
          placeholder="请输入搜索关键词"
          @keyup.enter="search()"
        />
      </div>
      <!-- <div class="item custom_input custom_input3">
        <a-input
          v-model:value="ForumSearch.department"
          placeholder="请输入院系"
          @keyup.enter="search()"
        />
      </div>
      <div class="item">
        <a-button type="primary" @click="search()">查询</a-button>
        <a-button type="primary" @click="clearSearch()">清空</a-button>
      </div> -->
    </div>
    <div class="header-btn">
      <a-button class="addStudent" @click="createStu()" type="primary">创建学生</a-button>
      <a-button class="brightBtn addStudent" @click="ImportStudent()" type="primary">批量导入</a-button>
      <a-button class="addStudent" @click="batchResetPassword()" type="primary">批量重置密码</a-button>
      <a-button class="brightBtn addStudent" @click="BatchDelete()" type="primary">批量删除</a-button>
    </div>
  </div>
  <a-config-provider>
    <a-table
      :columns="columns"
      :loading="loading"
      :data-source="list"
      row-key="id"
      :pagination="{
        current: ForumSearch.page,
        pageSize: ForumSearch.pageSize,
        total: total,
        onChange: onChangePage,
        hideOnSinglePage: true,
      }"
      :row-selection="{
        selectedRowKeys: state.selectedRowKeys,
        onChange: onSelectChange,
      }"
      class="components-table-demo-nested"
    >
      <template #operation="{ record }">
        <i
          class="caozuo iconfont icon-bianji"
          @click="editCard(record)"
          title="更新"
        ></i>
        <i
          class="caozuo iconfont icon-shanchu"
          @click="delateCard(record.id)"
          title="删除"
        ></i>
      </template>
    </a-table>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { Modal, message } from "ant-design-vue";
import {
  createVNode,
  defineComponent,
  ref,
  onMounted,
  reactive,
  toRefs,
  inject,
  watch,
  computed,
} from "vue";
import request from "src/api/index";
import { useRouter, useRoute } from "vue-router";
import {
  SmileOutlined,
  MehOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
const columns = [
  {
    title: "学号",
    dataIndex: "stu_no",
    align: "center",
    width: 120,
  },
  {
    title: "姓名",
    dataIndex: "name",
    align: "center",
    width: 120,
  },
  {
    title: "性别",
    dataIndex: "genderText",
    align: "center",
  },
  {
    title: "所属院系",
    dataIndex: "department",
    align: "center",
  },
  {
    title: "年级",
    dataIndex: "grade",
    align: "center"
  },
  {
    title: "邮箱",
    dataIndex: "email",
    align: "center"
  },
  {
    title: "电话",
    dataIndex: "phone",
    align: "center"
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
    const router = useRouter();
    const route = useRoute();

    var updata = inject("updataNav") as Function;
    updata({
      tabs: [
        { name: "学生管理", componenttype: 0 }
      ],
      showContent: true,
      componenttype: undefined,
      showNav:true,
    });

    const http = (request as any).adminUserManagement;
    var ForumSearch: any = reactive({
      username: "",
      pageSize: 10,
      page: 1,
      name: "",
      department: "",
    });
    const loading:any=ref(false)
    const list:any=ref([])
    const total:any=ref(0)
    const state:any=reactive({
      selectedRowKeys:[]
    })
    function initData() {
      let obj = {
        query: {
          username: ForumSearch.username,
          name: ForumSearch.name,
          department: ForumSearch.department,
        },
        page: {
          pageSize: ForumSearch.pageSize,
          page: ForumSearch.page,
        },
      };
      http.studentList({ param: { ...obj } }).then((res:any) => {
        if (res) {
          let data = res.data.list;
          data.map((v: any) => {
            v.genderText = v.gender === 2 ? "女" : "男";
          });
          list.value.push(...data);
          total.value = res.data.page.totalCount;
        }
        // console.log(list)
      });
    }
    function search() {
      ForumSearch.page = 1;
      initData();
    }
    function  onSelectChange(selectedRowKeys:any[], selectedRows:any[]) {
        state.selectedRowKeys = selectedRowKeys;
      }
    function delateCard(val: number) {
      console.log(val);
      Modal.confirm({
        title: "确认删除吗？",
        icon: createVNode(ExclamationCircleOutlined),
        content: "删除后不可恢复",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          http
            .studentUserDelete({ urlParams: { id: val } })
            .then((res:any) => {
              initData();
              message.success("删除成功");
            });
        },
      });
    }
    function createStu(){
      router.push({path: '/admin/adminUserManagement/createStudent'});
    }
    function batchResetPassword(){

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
          http
            .studentUserBatchDelete({
              param: { user_ids: state.selectedRowKeys },
            })
            .then((res:any) => {
              initData();
              message.success("删除成功");
            });
        },
      });
    }
    function editCard(val:any) {
      // editId.value = val.id;
      // http
      //   .viewStudent({ urlParams: { id: editId.value } })
      //   .then((res:any) => {
      //     Object.keys(res.data).forEach((v: any) => {
      //       if (v in formState) {
      //         formState[v] = res.data[v];
      //       }
      //     });
      //     formState.status = String(res.data.status);
      //     formState.gender = String(res.data.gender === 2 ? 2 : 1);
      //     formState.username = res.data.stu_no;
      //   });
      // visible.value = true;
    }
    function clearSearch() {
      ForumSearch.username = "";
      ForumSearch.name = "";
      ForumSearch.department = "";
      initData();
    }
    function onChangePage(val: number) {
      const { query, path } = route;
      ForumSearch.page = val;
      // state.selectedRowKeys.length = 0;
      router.replace({
        path: path,
        query: { ...query, page: val },
      });
      initData();
    }
    function addStudent() {
    }
    function fileBeforeUpload(file: any) {
    //   if (file && file.size === 0) {
    //     message.warn("文件大小不能为空");
    //     return false;
    //   }
    //   // loading.value=true
    //   const fd = new FormData();
    //   fd.append("file", file);
    //   http.BatchImport({ param: fd }).then((res:any) => {
    //     ImportData.finished = res.data.total.finished;
    //     ImportData.unfinished = res.data.total.unfinished;
    //     ImportData.list = res.data.msg;
    //     message.success("导入完成");
    //     initData();
    //   });
    // }
    // function DownloadTemplate() {
    //   const isDev = process.env.NODE_ENV == "development" ? true : false;
    //   let url = isDev
    //     ? "./public/template/student.xlsx"
    //     : "./template/student.xlsx";
    //   const a = document.createElement("a");
    //   a.href = url;
    //   a.download = "学生模板.xlsx";
    //   a.click();
    }
    function ImportStudent() {
      // ImportData.list.length = 0;
      // ImportData.finished = 0;
      // ImportData.unfinished = 0;
      // ImportVisible.value = true;
    }
    onMounted(() => {
      initData();
    });
</script>

<style scoped lang="less">
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

  .header-btn{
    margin-top: 20px;
    text-align: right;
  }
  .addStudent {
    margin-right: 16px;
  }
}
:deep(.ant-form-item-control) {
  flex: 0 0 100%;
}
:deep(.ant-radio-group) {
  display: flex;
}
:deep(.ant-form-item-with-help) {
  width: 100%;
}
:deep(.ant-form-item) {
  margin-bottom: 10px;
}
:deep(.ant-input){
  border-radius:20px;
}
.userinitpassword {
  .ant-checkbox-wrapper {
    margin: 0 10px;
  }
}
.studentList {
  min-height: 400px;
  .heard {
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // justify-content: space-around;
    .notes {
      color: red;
      padding-left: 16px;
      font-size: 13px;
    }
  }
  .list {
    .title {
      span {
        margin-right: 50px;
      }
    }
  }
}
.ant-upload {
  button {
    background: var(--primary-color);
    border-radius: 5px;
    color: #ffffff;
    .icon-upload {
      font-size: 12px;
      padding-right: 6px;
    }
  }
}
</style>
