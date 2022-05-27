<template>
  <div class="assistant">
    <div class="header">
      <div class="header-left">
        <a-form layout="inline">
          <a-form-item label="账号">
            <a-input v-model:value='params.username'  @keyup.enter="onSearch"></a-input>
          </a-form-item>
          <a-form-item label="姓名">
            <a-input v-model:value='params.name'  @keyup.enter="onSearch"></a-input>
          </a-form-item>
        </a-form>
      </div>
      <div class="header-right">
        <a-button type="primary" @click="BatchDelete">移除助教</a-button>
        <a-button type="primary" class="brightBtn right-btn1" @click="addHelp">添加助教</a-button>
      </div>
    </div>
    <div class="tableScrollbar">
      <a-config-provider>
        <a-table
            :columns="columns"
            :data-source="data"
            rowKey='id'
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
              selectedRowKeys:tableData.selectedRowKeys,
              onChange: onSelectChange,
            }"
          >
          <template #status="{ record }">
              <a-switch
                checked-children="启用"
                un-checked-children="禁用"
                :checked="record.bind_status === '1' ? true : false"
                @change="changeSwitch(record)"
              />
            </template>
            <template #action="{ record }">
              <div class="action">
                <span class="delete" @click="delateCard(record.id)">删除</span>
                <span class="caozuo" @click="editCard(record)"
                title="更新">编辑</span>
              </div>  
            </template>
          </a-table>
          <template #renderEmpty>
            <div><Empty :text='ifSearch?"抱歉，未搜到相关数据！":"抱歉，暂无数据！"' type="tableEmpty" /></div>
          </template>
        </a-config-provider> 
    </div>
    <a-modal v-model:visible="visible" :title='editId?"编辑助教":"添加助教"' @cancel="cancel" @ok="submit" :width="500" class="modal-post">
      <a-form ref="formRef" :model="formState" layout="vertical" :rules="rules">
        <div class="formBox">
            <a-form-item label="账号"  name="username">
              <a-input v-model:value="formState.username" :disabled='editId?true:false' />
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
              <a-input-password v-model:value="formState.password_hash" :disabled="formState.userinitpassword"  :visibilityToggle="false" />
            </a-form-item>
            <a-form-item label="确认密码"  name="repassword">
              <a-input-password v-model:value="formState.repassword" :disabled="formState.userinitpassword"  :visibilityToggle="false" />
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
import request from 'src/api/index'
import { message,Modal } from "ant-design-vue";
import { useRouter ,useRoute } from 'vue-router';
const http = (request as any).teacherMemberManage;
const route=useRoute()
const courseId:any=route.query.courseId  //课程id
const columns: any = ref();
const data: any = ref([]);
const modalVisable: any = ref(false);
const visible:any=ref(false)
const formRef:any=ref('formRef')
columns.value = [
  {
    title: "账号",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "性别",
    dataIndex: "gender",
    key: "gender",
  },
  {
    title: "邮箱",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "电话",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "所属教师",
    dataIndex: "teacher_name",
    key: "teacher_name",
  },
  {
    title: "状态",
    key: "status",
    slots: { customRender: "status" },
  },
  {
    title: "操作",
    key: "action",
    slots: { customRender: "action" },
  },
];
const tableData: any = reactive({
  total: 0,
  page: 1,
  limit: 10,
  selectedRowKeys:[]
});
const tableSelectedRowKeys:any=ref()
const params:any=reactive({
  username:'',
  name:''
})
const editId:any=ref('')
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
const ifSearch:any=ref(false)
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
function onChange(page: any, pageSize: any) {
  tableData.page=page
  getAssistantList()
}
function onShowSizeChange(current: any, size: any) {
  tableData.page=1
  tableData.limit=size
  getAssistantList()
}
function onSelectChange(selectedRowKeys: any) {
  tableData.selectedRowKeys=selectedRowKeys
}
function addHelp(){
  visible.value=true;
}
function cancel(){
  visible.value=false;
}
function changeSwitch(item: any) {
      item.bind_status = item.bind_status === "1" ? "0" : "1";
      let params = {
        aid: item.id,
        state: item.bind_status === "1" ? true : false,
      };
      http.changeStatus({ param: params }).then((res:any) => {
        message.success("操作成功");
        getAssistantList()
      });
 }
 function editCard(val:any) {
      editId.value = val.id;
      http
        .getAssistantDetail({ urlParams: { id: editId.value } })
        .then((res:any) => {
          Object.keys(res.data).forEach((v: any) => {
            if (v in formState) {
              formState[v] = res.data[v];
            }
          });
          formState.gender = String(res.data.gender === 2 ? 2 : 1);
          formState.username = res.data.stu_no;
          formState.phone = res.data.phone_no;
        });
      visible.value = true;
}
function delateCard(val: number) {
      console.log(val);
      Modal.confirm({
        title: "确认删除吗？",
        icon: '',
        content: "删除后不可恢复",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          http
            .AssistantBatchDelete({ param: { user_ids: [val] } })
            .then((res:any) => {
              tableData.page=1
              getAssistantList()
              message.success("删除成功");
            });
        },
      });
    }
    function BatchDelete() {
      if (!tableData.selectedRowKeys.length) {
        message.warn("请选择要删除的数据");
        return;
      }
      Modal.confirm({
        title: "确认删除吗？",
        content: "删除后不可恢复",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          http
            .AssistantBatchDelete({ param: { user_ids:tableData.selectedRowKeys} })
            .then((res:any) => {
              tableData.page=1
              getAssistantList()
              message.success("删除成功");
            });
        },
      });
}
function submit(){
  if(formState.userinitpassword){
    formState.password_hash=formState.username+'1q2w'
    formState.repassword=formState.username+'1q2w'
  }
  formRef.value.validate().then(()=>{
    if (formState.password_hash !== formState.repassword) {
          message.warn("密码输入不一致");
          return;
        }
    const params={
    Assistant:{
      username:formState.username,
      email:formState.email,
      password_hash:formState.password_hash,
      userinitpassword:formState.userinitpassword,
    },
    AssistantProfile:{
      name:formState.name,
      gender:formState.gender,
      phone:formState.phone
    }
  }
  if(editId.value){
    http.updateAssistant({ urlParams: { id: editId.value }, param:params}).then((res:any)=>{
      if(res){
        visible.value=false;
        editId.value=''
        getAssistantList()
      }
    })
  }else{
    http.addAssistanter({param:params}).then((res:any)=>{
      if(res){
        visible.value=false;
        getAssistantList()
      }
  })
  }
  })
}
function onSearch(){
  tableData.page=1
  getAssistantList()
  if(params.username||params.name){
    ifSearch.value=true
  }else{
    ifSearch.value=false
  }
}
function getAssistantList(){
  let obj = {
        query: {
          username:params.username,
          name:params.name,
        },
        page: {
          pageSize:tableData.limit,
          page:tableData.page,
        },
      };
  http.assistantList({param:obj}).then((res:any)=>{
      if(res.status==1){
        data.value=res.data.list
        tableData.total=res.data.page.totalCount
      }
  })
}
onMounted(()=>{
  getAssistantList()
})
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


.action{
  color: var(--primary-color);
  >span:hover{
    cursor: pointer;
  }
  .delete{
    margin-right:10px;
  }
}
.tableScrollbar{
  height: 530px;
  overflow-y: auto;
}
</style>
