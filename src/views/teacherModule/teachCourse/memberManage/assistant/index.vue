<template>
  <div class="assistant">
    <div class="header">
      <div class="header-left">
        <a-form layout="inline">
          <a-form-item label="账号">
            <a-input></a-input>
          </a-form-item>
          <a-form-item label="姓名">
            <a-input></a-input>
          </a-form-item>
        </a-form>
      </div>
      <div class="header-right">
        <a-button type="primary">移除助教</a-button>
        <a-button type="primary" class="brightBtn right-btn1" @click="addHelp">添加助教</a-button>
      </div>
    </div>
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="
        tableData.total > 10
          ? {
              hideOnSinglePage: false,
              showSizeChanger: true,
              total: tableData.total,
              current: tableData.page,
              pageSize: tableData.limit,
              onChange: onChange,
              onShowSizeChange: onShowSizeChange,
            }
          : false
      "
      :row-selection="{
        selectedRowKeys: tableData.selectedRowKeys,
        onChange: onSelectChange,
      }"
    >
    </a-table>
    <a-modal v-model:visible="visible" title='添加助教' @cancel="cancel" @ok="submit" :width="500" class="modal-post">
      <a-form ref="formRef" :model="formState" layout="vertical" :rules="rules">
        <div class="formBox">
            <a-form-item label="账号"  name="username">
              <a-input v-model:value="formState.username" />
            </a-form-item>
            <a-form-item label="姓名"  name="name">
              <a-input v-model:value="formState.name" />
            </a-form-item>
            <a-form-item label="性别"  name="gender">
              <a-select v-model:value="formState.gender" placeholder="请选择">
                <a-select-option value="1">男</a-select-option>
                <a-select-option value="2">女</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="邮箱"  name="email">
              <a-input v-model:value="formState.email" />
            </a-form-item>
            <a-form-item label="电话"  name="phone">
              <a-input v-model:value="formState.phone" />
            </a-form-item>
            <a-form-item label="密码"  name="password_hash">
              <a-input-password v-model:value="formState.password_hash"  :visibilityToggle="false" />
            </a-form-item>
            <a-form-item label="确认密码"  name="repassword">
              <a-input-password v-model:value="formState.repassword"  :visibilityToggle="false" />
            </a-form-item>
            <div class="userinitpassword">
              <span>使用初始密码</span>
              <a-form-item label=""  name="userinitpassword">
                <a-checkbox v-model:checked="formState.userinitpassword"></a-checkbox>
              </a-form-item>
              <span>(账号+1q2w)</span>
            </div>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, reactive } from "vue";

const columns: any = ref();
const data: any = ref([]);
const modalVisable: any = ref(false);
const visible:any=ref(false)
columns.value = [
  {
    title: "账号",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "姓名",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "性别",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "邮箱",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "电话",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "所属教师",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];
const tableData: any = reactive({
  total: 0,
  page: 1,
  limit: 10,
});
var formState:any=reactive({
      username:'',
      password_hash:'',
      repassword:'',
      userinitpassword:true,
      direct:'',
      course:'',
      name:'',
      gender:'1',
      phone:'',
      email:'',
      status:'10',
      introduce:'',
      reset:false
    })
    const rules={
        username: [
          { required: true, message: '请输入账号', trigger: 'blur'},
          {pattern:/^[_a-zA-Z0-9]{1,10}$/,message:'账号应为字母或数字，长度不超过10', trigger: 'blur'}
          // var reg = new RegExp('^[_a-zA-Z0-9]{1,30}$')
        ],
        password_hash: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        repassword: [{ required: true, message: '请输入确认密码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        email: [
         {pattern:/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,message:'邮箱格式有误', trigger: 'blur'},
      ],
      phone:[{pattern:/^(1(3|4|5|6|7|8|9)|9(2|8))\d{9}$/, message: '请输入正确的手机号',trigger: 'blur'}]  
    }
function handleChange() {}
function onSearch(value: any) {
  console.log(value);
}
function onChange(page: any, pageSize: any) {}
function onShowSizeChange(current: any, size: any) {}
function onSelectChange(selectedRowKeys: any) {
  console.log(selectedRowKeys);
}
function addHelp(){
  visible.value=true;
}
function cancel(){
  visible.value=false;
}
function submit(){
  visible.value=false;
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .right-btn1 {
    margin-left: 16px;
  }
}

.formBox{
  width: 100%;
}
.ant-form-horizontal .ant-form-item-control{
  flex: none;
}
:deep(.ant-form-item-with-help){
  width:100%;
}
:deep(.ant-form-item){
  margin-bottom: 10px;
}
.userinitpassword{
  display: flex;
  align-items: center;
  .ant-checkbox-wrapper{
    margin: 0 10px;
  }
  .ant-form-item{
    margin-bottom: 0px;
  }
}
</style>
