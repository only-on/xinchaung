<template>
    <div class="header" v-layout-bg>
      <div class="search">
        <div>班级：</div>
        <div class="item ">
          <a-input v-model:value="formState.name" placeholder="请输入班级名称" :disabled="!edit" />
        </div>
        <div class="item">
          <a-button type="primary" @click="editClassName">{{!edit?'编辑':'保存'}}</a-button>
        </div>
        <div class="addTeacher">
        <a-button @click="addTeacher()" type="primary">添加学生</a-button>
      </div>
      </div>
      <div class="addTeacher">
        <a-button @click="addTeacher()" type="primary">批量删除学生</a-button>
      </div>
    </div>
    <a-config-provider :renderEmpty="customizeRenderEmpty">
      <a-table :columns="columns" :loading="loading" :data-source="list" :bordered="true"  row-key="id"
        :pagination="{current:ForumSearch.page,pageSize:ForumSearch.pageSize,total:total,onChange:onChangePage,hideOnSinglePage:true}" 
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        class="components-table-demo-nested">
        <template #operation="{record}">
          <i class="caozuo iconfont icon-shanchu" @click="delateStudent(record.id )" title="删除"></i>
        </template>
      </a-table>
    </a-config-provider>
    <a-modal v-model:visible="visible" :title="editId?'编辑班级':'添加班级'" @cancel="cancel" @ok="submit" :width="745" class="modal-post">
      
    </a-modal>
</template>

<script lang="tsx">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal,message} from 'ant-design-vue';
import {createVNode,VNode, defineComponent,ref, onMounted,reactive,UnwrapRef,Ref ,toRefs,inject,watch, computed} from 'vue'
import { IBusinessResp} from '../../typings/fetch.d';
import request from '../../api/index'
import { useRouter ,useRoute } from 'vue-router';
import serve from "../../request/getRequest";
import { SmileOutlined, MehOutlined ,UserOutlined} from '@ant-design/icons-vue';
import { ColumnProps } from 'ant-design-vue/es/table/interface';
interface IforumSearch{
  students_count:string,
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

const columns=[
  {
    title: '账号',
    dataIndex:"username",
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
    dataIndex:"gender",
    align:'center',
    width:120,
    // slots: { customRender: 'title' },
  },
  {
    title: '所属院系',
    dataIndex:"department",
    align:'center',
    width:120,
    // slots: { customRender: 'title' },
  },
  {
    title: '年级',
    dataIndex:"grade",
    align:'center',
    width:120,
    // slots: { customRender: 'title' },
  },
  {
    title: '邮箱',
    dataIndex:"email",
    align:'center',
    width:160,
    // slots: { customRender: 'title' },
  },
  {
    title: '电话',
    dataIndex:"phone",
    align:'center',
    width:130,
    // slots: { customRender: 'title' },
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
  name: 'classEdit',
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
    var editId:Ref<number>=ref(Number(route.query.editId))
    var edit:Ref<boolean>=ref(false)
    var formRef = ref();
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
        let type=(ForumSearch.students_count || ForumSearch.name)?'tableSearchEmpty':'tableEmpty'
        return <empty type={type} />
      }
    }
    var ForumSearch:IforumSearch=reactive({
      pageSize:10,
      page:1,
      name:'',
      students_count:''
    })
    var formState:any=reactive({
      name:''
    })
    function initData(){
      // console.log(ForumSearch)
      loading.value=true
      list.length=0
      http.classBelongingList({urlParams:{class_id:editId.value}}).then((res:IBusinessResp)=>{
        loading.value=false
        let data=res.data.list
        list.push(...data)
        total.value=res.data.page.totalCount
        // console.log(list)
      })
      http.classBelongingDetail({urlParams:{class_id:editId.value}}).then((res:IBusinessResp)=>{
        formState.name=res.data.classname
      })
    }
    async function search(){
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
        ForumSearch.page=1
        initData()
      // }
    }
    function delateStudent(val:number){
      console.log(val)
      Modal.confirm({
        title: '确认删除吗？',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除后不可恢复',
        okText: '确认',
        cancelText: '取消',
        onOk(){
          http.classUserDelete({urlParams:{class_id:val}}).then((res:IBusinessResp)=>{
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
      http.teacherUserBatchDelete({param:{user_ids:state.selectedRowKeys}}).then((res:IBusinessResp)=>{
          initData()
          message.success('删除成功')
        })
    }
    function submit(){
      // createTeacher
      formRef.value.validate().then(()=>{
        // const promise=editId.value?http.editClass({urlParams:{id:editId.value},param:{...formState}}):http.classCreate({param:{...formState}})
        const promise=http.classCreate({param:{}})
        promise.then((res:IBusinessResp)=>{
          initData()
          message.success(editId.value?'编辑成功':'创建成功')
          formRef.value.resetFields()
          visible.value=false
        })
      })      
      
    }
    function cancel(){
      formRef.value.resetFields()
    }
    function editClassName(){
      // editId.value=val.id
      if(edit.value===false){
        edit.value=true
        return
      }
      const reg = new RegExp('^[a-zA-Z0-9\u4e00-\u9fa5]{3,15}$')
      if(!reg.test(formState.name)){
        message.warn('班级名称为字母、数字、汉子，长度为3-15')
        return
      }
      let obj={
        name:formState.name,
        student_ids:[]
      }
      http.editClass({urlParams:{class_id:editId.value},param:{...obj}}).then((res:IBusinessResp)=>{
        initData()
      })
    }
    async function clearSearch(){
      if(ForumSearch.students_count || ForumSearch.name){
        ForumSearch.name=''
        ForumSearch.students_count=''
        initData()
      }
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
      // router.push('/studentForum/CreatePosts')
    }
    onMounted(()=>{
      initData()
    })
    return {...toRefs(state),customizeRenderEmpty,cancel,formRef,formState,edit,list,columns,ForumSearch,loading,total,visible,editId,search,onChangePage,clearSearch,delateStudent,BatchDelete,submit,editClassName,addTeacher};
  },
})
</script>

<style scoped lang="less">
// .modal-post{
//   :deep(.ant-modal-header){
//       border:  1px solid @theme-color;
//       background: @theme-color;
//     }
//   .ant-modal-header{
//     background: @theme-color;
//   }
// }
    // :deep(.ant-modal-header){
    //   border:  1px solid @theme-color;
    //   background: @theme-color;
    // }
:deep(.ant-table-pagination.ant-pagination){
  width: 100%;
  text-align: center;
}
.caozuo{
  padding: 0 8px;
  color: @theme-color;
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
