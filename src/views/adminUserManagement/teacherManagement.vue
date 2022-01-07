<template>
    <div class="header" v-layout-bg>
      <div class="search">
        <div class="item custom_input custom_input1">
          <a-input v-model:value="ForumSearch.username" placeholder="请输入账号" @keyup.enter="search()" />
        </div>
        <div  class="item custom_input custom_input2">
          <a-input v-model:value="ForumSearch.name" placeholder="请输入姓名" @keyup.enter="search()" />
        </div>
        <div  class="item custom_input custom_input3">
          <a-input v-model:value="ForumSearch.department" placeholder="请输入院系" @keyup.enter="search()" />
        </div>
        <div class="item">
          <a-button type="primary" @click="search()">查询</a-button>
          <a-button type="primary" @click="clearSearch()">清空</a-button>
        </div>
      </div>
      <div class="addTeacher">
        <a-button @click="addTeacher()" type="primary">添加教师</a-button>
      </div>
      <a-button @click="BatchDelete()" type="primary" >批量删除</a-button>
    </div>
    <a-config-provider :renderEmpty="customizeRenderEmpty">
      <a-table :columns="columns" :loading="loading" :data-source="list" :bordered="true"  row-key="id"
        :pagination="{current:ForumSearch.page,pageSize:ForumSearch.pageSize,total:total,onChange:onChangePage,hideOnSinglePage:true}" 
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        class="components-table-demo-nested">
        <template #title="{record, text }">
          <a @click="details(record.id)">{{ text }}</a>
        </template>
        <template #operation="{record}">
          <i class="caozuo iconfont icon-bianji" @click="editCard(record )" title="更新"></i>
          <i class="caozuo iconfont icon-shanchu" @click="delateCard(record.id )" title="删除"></i>
        </template>
      </a-table>
    </a-config-provider>
    <a-modal v-model:visible="visible" :title="editId?'编辑教师':'添加教师'" @cancel="cancel" @ok="submit" :width="745" class="modal-post">
      <a-form ref="formRef" :model="formState" :label-col="{span:10}" :wrapper-col="{span:24}" labelAlign="left" :rules="rules">
        <div class="formBox">
          <div class="left">
            <a-form-item label="账号"  name="username">
              <a-input v-model:value="formState.username" :disabled="editId?true:false" />
            </a-form-item>
            <a-form-item label="密码"  name="password_hash">
              <!-- <a-input v-model:value="formState.password_hash" :disabled="InputPassword" /> -->
              <a-input-password v-model:value="formState.password_hash" :disabled="InputPassword" :visibilityToggle="false" />
            </a-form-item>
            <a-form-item label="确认密码"  name="repassword">
              <!-- <a-input v-model:value="formState.repassword" :disabled="InputPassword" /> -->
              <a-input-password v-model:value="formState.repassword" :disabled="InputPassword" :visibilityToggle="false" />
            </a-form-item>
            <div class="userinitpassword" v-if="!editId">
              <span>使用初始密码</span>
              <a-checkbox v-model:checked="formState.userinitpassword"></a-checkbox>
              <span>{{`(账号+${suffix})`}}</span>
            </div>
            <div class="userinitpassword" v-if="editId">
              <a-checkbox v-model:checked="formState.reset"></a-checkbox>
              <span>重置密码</span>
            </div>
            <a-form-item label="院系"  name="department">
              <a-input v-model:value="formState.department" />
            </a-form-item>
            <a-form-item label="研究方向"  name="direct">
              <a-input v-model:value="formState.direct" />
            </a-form-item>
            <a-form-item label="主讲课程"  name="course">
              <a-input v-model:value="formState.course" />
            </a-form-item>
          </div>
          <div class="right">
            <a-form-item label="姓名"  name="name">
              <a-input v-model:value="formState.name" />
            </a-form-item>
            <a-form-item label="性别"  name="gender">
              <a-select v-model:value="formState.gender" placeholder="请选择">
                <a-select-option value="1">男</a-select-option>
                <a-select-option value="2">女</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="电话"  name="phone">
              <a-input v-model:value="formState.phone" />
            </a-form-item>
            <a-form-item label="邮箱"  name="email">
              <a-input v-model:value="formState.email" />
            </a-form-item>
            <a-form-item label="状态"  name="status">
              <a-select v-model:value="formState.status" placeholder="请选择">
                <a-select-option value="10">开启</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </div>
        <a-form-item label="介绍"  name="introduce">
          <a-textarea v-model:value="formState.introduce" placeholder="输入介绍" :rows="4" />
        </a-form-item>
      </a-form>
    </a-modal>
</template>

<script lang="tsx">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal,message} from 'ant-design-vue';
import {createVNode,VNode, defineComponent,ref, onMounted,reactive,UnwrapRef,Ref ,toRefs,inject,watch, computed} from 'vue'
import { IBusinessResp} from '../../typings/fetch.d';
import request from '../../api/index'
import { useRouter ,useRoute } from 'vue-router';
import { SmileOutlined, MehOutlined ,UserOutlined} from '@ant-design/icons-vue';
import { ColumnProps } from 'ant-design-vue/es/table/interface';
interface IforumSearch{
  username:string,
  department:string,
  name:string,
  pageSize:number,
  page:number
}
interface ItdItems{
  title:string,
  type:string,
  creat:string,
  replyViews:string,
  reply:string,
  id:number,
}
type Key = ColumnProps['key'];
interface TState{
  selectedRowKeys:Key[];
  onSelectChange: (v:Key[],selectedRows:Key[]) => void;
}
interface IFormState{
  username:string
  password_hash:string
  repassword:string
  userinitpassword:boolean
  department:string
  direct:string
  course:string
  name:string
  gender:string
  phone:string
  email:string
  status:string
  introduce:string
  reset:boolean
}
const columns=[
  {
    title: '账号',
    dataIndex:"stu_no",
    align:'center',
    width:120,
    // slots: { customRender: 'title' },
  },
  {
    title: '姓名',
    dataIndex: 'name',
    align:'center',
    width:120
  },
  {
    title: '性别',
    dataIndex: 'genderText',
    align:'center',
    // width:260
  },
  {
    title: '所属院系',
    dataIndex: 'department',
    align:'center',
    // width:160
  },
  {
    title: '研究方向',
    dataIndex: 'direct',
    align:'center',
    // width:260
  },
  {
    title: '主讲课程',
    dataIndex: 'course',
    align:'center',
    // width:260
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    align:'center',
    width:200
  },
  {
    title: '电话',
    dataIndex: 'phone',
    align:'center',
    width:140
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align:'center',
    slots: { customRender: 'operation' },
    fixed:'right',
    width:200
  }
]

export default defineComponent({
  name: 'teacherManagement',
  components: {
    SmileOutlined,
    MehOutlined,
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    const route = useRoute();

    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true,backOff:false,showPageEdit:false})

    const http=(request as any).adminUserManagement
    var loading:Ref<boolean>=ref(false)
    var visible:Ref<boolean>=ref(false)
    var total:Ref<number>=ref(0)  
    var list:ItdItems[]=reactive([])
    var editId:Ref<number>=ref(0)
    var formRef = ref();
    var suffix='1q2w'
    var state:TState=reactive({
      selectedRowKeys:[],
      onSelectChange:(selectedRowKeys:Key[],selectedRows:Key[])=>{      
          // console.log('RowKeys changed: ', selectedRowKeys);
          // console.log('selectedRows: ', selectedRows);
          state.selectedRowKeys = selectedRowKeys;           
          // state.selectedRows = selectedRows;             
        },
    })  
    const customizeRenderEmpty =function (): VNode{
      if(loading.value){
        return <template></template>
      }else{
        let type=(ForumSearch.username || ForumSearch.name)?'tableSearchEmpty':'tableEmpty'
        return <empty type={type} />
      }
    }
    var ForumSearch:IforumSearch=reactive({
      username:'',
      pageSize:10,
      page:1,
      name:'',
      department:''
    })
    var formState:IFormState=reactive({
      username:'',
      password_hash:'',
      repassword:'',
      userinitpassword:true,
      department:'',
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
    watch(()=>{return formState.userinitpassword},(val)=>{
      // console.log(val)
      if(val===true && formState.username){
        formState.password_hash=`${formState.username}${suffix}`
        formState.repassword=`${formState.username}${suffix}`
      }else{
        formState.password_hash=''
        formState.repassword=''
      }
    },{immediate:true})
    watch(()=>{return formState.username},(val)=>{
      // console.log(val)
      if(val && formState.userinitpassword===true){
        formState.password_hash=`${formState.username}${suffix}`
        formState.repassword=`${formState.username}${suffix}`
      }
    },{immediate:true})
    watch(()=>{return formState.reset},(val)=>{
      // console.log(val)
      if(val===true){
        formState.password_hash=''
        formState.repassword=''
      }
    },{immediate:true})
    const InputPassword=computed(()=>{
      let sign=false
      if(editId.value){
        sign=formState.reset?false:true
      }else{
        sign=formState.userinitpassword?true:false
      }
      return sign
    })
    function initData(){
      // console.log(ForumSearch)
      loading.value=true
      list.length=0
      let obj={
        query:{
          username:ForumSearch.username,
          name:ForumSearch.name,
          department:ForumSearch.department
        },
        page:{
          pageSize:ForumSearch.pageSize,
          page:ForumSearch.page,
        }
      }
      http.teacherList({param:{...obj}}).then((res:IBusinessResp)=>{
        if(res){
          loading.value=false
          let data=res.data.list
          data.map((v:any)=>{
            v.genderText=v.gender===2?'女':'男'
          })
          list.push(...data)
          total.value=res.data.page.totalCount
        }
        // console.log(list)
      })
    }
    function search(){
        ForumSearch.page=1
        initData()
    }
    function delateCard(val:number){
      console.log(val)
      Modal.confirm({
        title: '确认删除吗？',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除后不可恢复',
        okText: '确认',
        cancelText: '取消',
        onOk(){
          http.teacherUserDelete({urlParams:{id:val}}).then((res:IBusinessResp)=>{
            initData()
            message.success('删除成功')
          })
        }
      });
    }
    function BatchDelete(){
      if(!state.selectedRowKeys.length){
        message.warn('请选择要删除的数据')
        return
      }
      Modal.confirm({
        title: '确认删除吗？',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除后不可恢复',
        okText: '确认',
        cancelText: '取消',
        onOk(){
          http.teacherUserBatchDelete({param:{user_ids:state.selectedRowKeys}}).then((res:IBusinessResp)=>{
            initData()
            message.success('删除成功')
          })
        }
      });
      
    }
    function submit(){
      // createTeacher
      formRef.value.validate().then(()=>{
        const {username,password_hash,repassword,userinitpassword,department,direct,course,name,gender,phone,email,status,introduce}=formState
        if(password_hash !== repassword){
          message.warn('密码输入不一致')
          return
        }
        let obj:any={
            Teacher:{
              username:username,
              email:email,
              userinitpassword:userinitpassword,
            },
            TeacherProfile:{
              department:department,
              direct:direct,
              course:course,
              name:name,
              gender:gender,
              phone:phone,
              status:status,
              introduce:introduce,
            }
        }
        // 编辑时改变了就传  
        if((formState.reset && editId.value) || editId.value === 0){
          obj.Teacher.password_hash=password_hash
          obj.Teacher.repassword=repassword
        }
        const promise=editId.value?http.editTeacher({urlParams:{id:editId.value},param:{...obj}}):http.createTeacher({param:{...obj}})
        promise.then((res:IBusinessResp)=>{
          initData()
          message.success(editId.value?'编辑成功':'创建成功')
          formRef.value.resetFields()
          formState.reset=false
          visible.value=false
        })
      })      
      
    }
    function cancel(){
      formRef.value.resetFields()
    }
    function editCard(val:ItdItems){
      editId.value=val.id
      http.viewTeacher({urlParams:{id:editId.value}}).then((res:IBusinessResp)=>{
        Object.keys(res.data).forEach((v:any)=>{
          if(v in formState){
            formState[v]=res.data[v]
          }
        })
        formState.status=String(res.data.status)
        formState.gender=String(res.data.gender===2?2:1)
        formState.username=res.data.stu_no
      })
      visible.value=true
    }
    async function clearSearch(){
      // if(ForumSearch.username || ForumSearch.name || ForumSearch.department){
        ForumSearch.username=''
        ForumSearch.name=''
        ForumSearch.department=''
        initData()
      // }
    }
    function onChangePage(val:number){
      const {query,path}= route
      ForumSearch.page=val
      state.selectedRowKeys.length=0
      router.replace({
            path: path,
            query: {...query,page:val},
      })
      initData()
    }
    function addTeacher(){
      editId.value=0
      visible.value=true
    }
    function details(id:number){
      let {currentTab}= route.query
      router.push({
        path:'/studentForum/PostsDetailed',
        query:{detailId:id,currentTab:currentTab}
      })
    }
    onMounted(()=>{
      initData()
    })
    return {...toRefs(state),customizeRenderEmpty,suffix,cancel,InputPassword,formRef,formState,rules,list,columns,ForumSearch,loading,total,visible,editId,search,onChangePage,clearSearch,delateCard,BatchDelete,submit,editCard,addTeacher,details};
  },
})
</script>

<style scoped lang="less">
:deep(.ant-table-pagination.ant-pagination){
  width: 100%;
  text-align: center;
}
.caozuo{
  padding: 0 8px;
  color: var(--purpleblue-6);
  cursor: pointer;
}
.header{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 0 15px ;
  .search{
    flex: 1;
    display: flex;
    align-items: center;
    .item{
      display: flex;
      align-items: center;
      margin-right: 22px;
      :deep(.ant-select-selector){
        width: 240px;
        height: 35px;
        padding-left: 30px;
        align-items: center;
      }
      :deep(.ant-input){
          padding-left: 26px;
      }
    }
    .item:last-child{
      .ant-btn{
        margin: 0 8px;
      }
    } 
    .custom_input{
      position: relative;
      &::before{
          content: '';
          position: absolute;
          left:8px;
          top:8px;
          background: url(../../assets/images/screenicon/Group7.png) no-repeat;
          width: 16px;
          height: 16px;
          z-index: 10;
      }
    }
    .custom_input2{
      &::before{
        background: url(../../assets/images/screenicon/Group6.png) no-repeat;
      }
    }
    .custom_input3{
      &::before{
        background: url(../../assets/images/screenicon/Group8.png) no-repeat;
      }
    }
  }
  .addTeacher{
      margin-right: 16px;
    }
}
:deep(.ant-form-item-control){
  flex: 0 0 100%;
}
:deep(.ant-radio-group){
  display: flex;
}
.formBox{
  width: 100%;
  display: flex;
  justify-content: space-between;
  .left,.right{
    width: 46%;
  }
}
:deep(.ant-form-item-with-help){
  width:100%;
}
:deep(.ant-form-item){
  margin-bottom: 10px;
}
.userinitpassword{
  .ant-checkbox-wrapper{
    margin: 0 10px;
  }
}
</style>
