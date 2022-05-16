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
        <!-- iconfont icon-bianji -->
        <span
          class="caozuo"
          @click="editCard(record)"
          title="更新"
        >编辑</span>
        <!-- iconfont icon-shanchu -->
        <span
          class="caozuo"
          @click="delateCard(record.id)"
          title="删除"
        >删除</span>
        <span  class="caozuo">
          关闭
        </span>
      </template>
    </a-table>
  </a-config-provider>
  <a-modal
    v-model:visible="visible"
    :title="editId ? '编辑学生' : '添加学生'"
    @cancel="cancel"
    @ok="submit"
    :width="745"
    class="modal-post"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="{ span: 10 }"
      :wrapper-col="{ span: 24 }"
      labelAlign="left"
      :rules="rules"
    >
      <div class="formBox">
        <div class="left">
          <a-form-item label="账号" name="username">
            <a-input
              v-model:value="formState.username"
              :disabled="editId ? true : false"
            />
          </a-form-item>
          <a-form-item label="姓名" name="name">
            <a-input v-model:value="formState.name" />
          </a-form-item>
          <a-form-item label="密码" name="password_hash">
            <a-input-password
              v-model:value="formState.password_hash"
              :disabled="InputPassword"
              :visibilityToggle="false"
            />
          </a-form-item>
          <a-form-item label="确认密码" name="repassword">
            <a-input-password
              v-model:value="formState.repassword"
              :disabled="InputPassword"
              :visibilityToggle="false"
            />
          </a-form-item>
          <a-form-item label="性别" name="gender">
                <a-radio-group v-model:value="formState.gender">
                    <a-radio :value="1">男</a-radio>
                    <a-radio :value="2">女</a-radio>
                 </a-radio-group>
          </a-form-item>
        </div>
        <div class="right">
          <a-form-item label="班级" name="class">
            <a-input v-model:value="formState.class" />
          </a-form-item>
          <a-form-item label="年级" name="grade">
            <a-input v-model:value="formState.grade" />
          </a-form-item>
          <a-form-item label="专业" name="major">
            <a-input v-model:value="formState.major" />
          </a-form-item>
           <a-form-item label="学院" name="department">
            <a-input v-model:value="formState.department" />
          </a-form-item>
          <a-form-item label="手机" name="phone">
            <a-input v-model:value="formState.phone" />
          </a-form-item>
          <a-form-item label="邮箱" name="email">
            <a-input v-model:value="formState.email" />
          </a-form-item>
        </div>
      </div>
      <!-- <a-form-item label="介绍" name="introduce">
        <a-textarea
          v-model:value="formState.introduce"
          placeholder="输入介绍"
          :rows="4"
        />
      </a-form-item> -->
    </a-form>
  </a-modal>
  <a-modal
    v-model:visible="ImportVisible"
    title="导入"
    :width="960"
    class="modal-post"
    :footer="null"
  >
    <div class="studentList">
      <div class="heard">
        <a-upload
          :before-upload="fileBeforeUpload"
          :show-upload-list="false"
          accept=".xls,.xlsx"
        >
          <a-button>
            <span class="icon iconfont icon-upload"></span>
            选择文件
          </a-button>
        </a-upload>
        <!-- <div>
            <a-button @click="DownloadTemplate" type="primary">导入</a-button>
          </div> -->
        <div>
          <a-button @click="DownloadTemplate" type="link">下载学生模板</a-button>
          <span class="notes">*注：建议每次导入的数量不要超过500条</span>
        </div>
      </div>
      <div class="list">
        <div class="title">
          <span>已导入：{{ ImportData.finished }} 条</span>
          <span>未导入：{{ ImportData.unfinished }} 条</span>
        </div>
        <a-table
          v-if="!uploadData"
          :columns="studentColumns"
          :data-source="ImportData.list"
          :bordered="true"
          row-key="username"
          class="components-table-demo-nested"
        >
        </a-table>
        <div v-else>
          <a-spin tip="Loading...">
            <div class="spin-content">数据导入中,请稍等！</div>
          </a-spin>
        </div>
      </div>
    </div>
  </a-modal>
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
interface IFormState {
  class:string;
  major:any;
  username: string;
  password_hash: string;
  repassword: string;
  userinitpassword: boolean;
  department: string;
  grade: string;
  name: string;
  gender: string;
  phone: string;
  email: string;
  status: string;
  introduce: string;
  reset: boolean;
}
const columns = [
  {
    title: "账号",
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
    title: "班级",
    dataIndex: "",
    align: "",
  },
  {
    title: "年级",
    dataIndex: "grade",
    align: "center"
  },
  {
    title: "专业",
    dataIndex: "",
    align: "center"
  },
  {
    title: "学院",
    dataIndex: "department",
    align: "center"
  },
  {
    title: "邮箱",
    dataIndex: "email",
    align: "center",
    width:150,
  },
  {
    title: "电话",
    dataIndex: "phone",
    align: "center",
    width:150,
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
const studentColumns = [
  {
    title: "学号",
    dataIndex: "username",
  },
  {
    title: "姓名",
    dataIndex: "name",
  },
  {
    title: "导入情况",
    dataIndex: "result",
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
    const rules = {
      username: [
        { required: true, message: "请输入学号", trigger: "blur" },
        {
          pattern: /^[_a-zA-Z0-9]{1,10}$/,
          message: "学号应为字母或数字，长度不超过10",
          trigger: "blur",
        },
        // var reg = new RegExp('^[_a-zA-Z0-9]{1,30}$')
      ],
      password_hash: [{ required: true, message: "请输入密码", trigger: "blur" }],
      repassword: [{ required: true, message: "请输入确认密码", trigger: "blur" }],
      name: [
        {
          required: true,
          pattern: /^.{1,10}$/,
          message: "姓名包含至多10个字符",
          trigger: "blur",
        },
      ],
      gender: [{ required: true, message: "请选择性别", trigger: "change" }],
      email: [
        {
          pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
          message: "邮箱格式有误",
          trigger: "blur",
        },
      ],
      phone: [
        {
          pattern: /^(1(3|4|5|6|7|8|9)|9(2|8))\d{9}$/,
          message: "请输入正确的手机号",
          trigger: "blur",
        },
      ],
    };
    var ForumSearch: any = reactive({
      username: "",
      pageSize: 10,
      page: 1,
      name: "",
      department: "",
    });
    var formState: IFormState = reactive({
      class:'',
      major:'',
      username: "",
      password_hash: "",
      repassword: "",
      userinitpassword: true,
      department: "",
      grade: "",
      name: "",
      gender: "1",
      phone: "",
      email: "",
      status: "10",
      introduce: "",
      reset: false,
    });
    var uploadData:any= ref(false);
    const loading:any=ref(false)
    var visible:any = ref(false);
    var ImportVisible:any= ref(false);
    var editId:any= ref(0);
    var suffix = "1q2w";
    var formRef = ref();
    var list:any[] = reactive([]);
    const total:any=ref(0)
    const state:any=reactive({
      selectedRowKeys:[]
    })
    var ImportData: any = reactive({
      list: [],
      finished: 0,
      unfinished: 0,
    });
    function initData() {
      loading.value = true;
      list.length = 0;
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
          loading.value = false;
          let data = res.data.list;
          data.map((v: any) => {
            v.genderText = v.gender === 2 ? "女" : "男";
          });
          list.push(...data);
          total.value = res.data.page.totalCount;
        }
        // console.log(list)
      });
    }
    function search() {
      ForumSearch.page = 1;
      initData();
    }
    watch(
      () => {
        return formState.userinitpassword;
      },
      (val) => {
        // console.log(val)
        if (val === true && formState.username) {
          formState.password_hash = `${formState.username}${suffix}`;
          formState.repassword = `${formState.username}${suffix}`;
        } else {
          formState.password_hash = "";
          formState.repassword = "";
        }
      },
      { immediate: true }
    );
    watch(
      () => {
        return formState.username;
      },
      (val) => {
        // console.log(val)
        if (val && formState.userinitpassword === true) {
          formState.password_hash = `${formState.username}${suffix}`;
          formState.repassword = `${formState.username}${suffix}`;
        }
      },
      { immediate: true }
    );
    watch(
      () => {
        return formState.reset;
      },
      (val) => {
        // console.log(val)
        if (val === true) {
          formState.password_hash = "";
          formState.repassword = "";
        }
      },
      { immediate: true }
    );
    const InputPassword = computed(() => {
      let sign = false;
      if (editId.value) {
        sign = formState.reset ? false : true;
      } else {
        sign = formState.userinitpassword ? true : false;
      }
      return sign;
    });
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
    function submit() {
      formRef.value.validate().then(() => {
        const {
          username,
          password_hash,
          repassword,
          userinitpassword,
          department,
          grade,
          name,
          gender,
          phone,
          email,
          status,
          introduce,
        } = formState;
        if (password_hash !== repassword) {
          message.warn("密码输入不一致");
          return;
        }
        let obj: any = {
          Student: {
            username: username,
            email: email,
            userinitpassword: editId.value ? false : userinitpassword, // 编辑时默认false
          },
          StudentProfile: {
            department: department,
            grade: grade,
            name: name,
            gender: gender,
            phone: phone,
            status: status,
            introduce: introduce,
          },
        };
        if ((formState.reset && editId.value) || editId.value === 0) {
          obj.Student.password_hash = password_hash;
          obj.Student.repassword = repassword;
        }
        const promise = editId.value
          ? http.editStudent({ urlParams: { id: editId.value }, param: { ...obj } })
          : http.studentCreate({ param: { ...obj } });
          promise.then((res:any) => {
          initData();
          message.success(editId.value ? "编辑成功" : "创建成功");
          formRef.value.resetFields();
          formState.reset = false;
          visible.value = false;
        });
      });
    }
    function cancel() {
      formRef.value.resetFields();
    }
    function editCard(val:any) {
      editId.value = val.id;
      http
        .viewStudent({ urlParams: { id: editId.value } })
        .then((res:any) => {
          Object.keys(res.data).forEach((v: any) => {
            if (v in formState) {
              formState[v] = res.data[v];
            }
          });
          formState.status = String(res.data.status);
          formState.gender =res.data.gender;
          formState.username = res.data.stu_no;
        });
      visible.value = true;
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
      if (file && file.size === 0) {
        message.warn("文件大小不能为空");
        return false;
      }
      // loading.value=true
      const fd = new FormData();
      fd.append("file", file);
      http.BatchImport({ param: fd }).then((res:any) => {
        ImportData.finished = res.data.total.finished;
        ImportData.unfinished = res.data.total.unfinished;
        ImportData.list = res.data.msg;
        message.success("导入完成");
        initData();
      });
      return false
    }
    function DownloadTemplate() {
      const isDev = process.env.NODE_ENV == "development" ? true : false;
      let url = isDev
        ? "./public/template/student.xlsx"
        : "./template/student.xlsx";
      const a = document.createElement("a");
      a.href = url;
      a.download = "学生模板.xlsx";
      a.click();
    }
    function ImportStudent() {
      ImportData.list.length = 0;
      ImportData.finished = 0;
      ImportData.unfinished = 0;
      ImportVisible.value = true;
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
:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector){
  border-radius: 20px;
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
</style>
