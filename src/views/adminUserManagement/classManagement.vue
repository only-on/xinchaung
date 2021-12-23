<template>
    <div class="header" v-layout-bg>
      <div class="search">
        <div class="item custom_input custom_input1">
          <a-input v-model:value="ForumSearch.name" placeholder="请输入班级名称" @keyup.enter="search()" />
        </div>
        <div  class="item custom_input custom_input2">
          <a-input v-model:value="ForumSearch.students_count" placeholder="请输入学生人数" @keyup.enter="search()" />
        </div>
        <div class="item">
          <a-button type="primary" @click="search()">查询</a-button>
          <a-button type="primary" @click="clearSearch()">清空</a-button>
        </div>
      </div>
      <div class="addTeacher">
        <a-button @click="addTeacher()" type="primary">添加班级</a-button>
      </div>
      <a-button @click="BatchDelete()" type="primary" >批量删除</a-button>
    </div>
    <a-config-provider :renderEmpty="customizeRenderEmpty">
      <a-table :columns="columns" :loading="loading" :data-source="list" :bordered="true"  row-key="id"
        :pagination="{current:ForumSearch.page,pageSize:ForumSearch.limit,total:total,onChange:onChangePage,hideOnSinglePage:true}" 
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        class="components-table-demo-nested">
        <template #operation="{record}">
          <i class="caozuo iconfont icon-bianji" @click="editCard(record )" title="更新"></i>
          <i class="caozuo iconfont icon-shanchu" @click="delateCard(record.id )" title="删除"></i>
        </template>
      </a-table>
    </a-config-provider>
    <a-modal v-model:visible="visible" :title="editId?'编辑班级':'添加班级'" @cancel="cancel" @ok="submit" :width="745" class="modal-post">
      <a-form ref="formRef" :model="formState" :label-col="{span:10}" :wrapper-col="{span:24}" labelAlign="left" :rules="rules">
        <a-form-item label="班级名称"  name="name">
          <a-input v-model:value="formState.name" />
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
import serve from "../../request/getRequest";
import { SmileOutlined, MehOutlined ,UserOutlined} from '@ant-design/icons-vue';
import { ColumnProps } from 'ant-design-vue/es/table/interface';
interface IforumSearch{
  students_count:string,
  name:string,
  limit:number,
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
  name:string
}
const columns=[
  {
    title: '班级名称',
    dataIndex:"classname",
    align:'center',
    width:120,
    // slots: { customRender: 'title' },
  },
  {
    title: '学生人数',
    dataIndex: 'students_count',
    align:'center',
    width:120
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
  name: 'classManagement',
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
        let type=(ForumSearch.students_count || ForumSearch.name)?'tableSearchEmpty':'tableEmpty'
        return <empty type={type} />
      }
    }
    var ForumSearch:IforumSearch=reactive({
      limit:10,
      page:1,
      name:'',
      students_count:''
    })
    var formState:IFormState=reactive({
      name:'',
    })
    const rules={
        name: [
          { required: true, message: '请输入班级名称', trigger: 'blur'},
          {pattern:/^[a-zA-Z0-9\u4e00-\u9fa5]{3,15}$/,message:'班级名称为字母、数字、汉子，长度为3-15', trigger: 'blur'}
          // const reg = new RegExp('^[a-zA-Z0-9\u4e00-\u9fa5]+$')
        ]
    }
    function initData(){
      // console.log(ForumSearch)
      loading.value=true
      list.length=0
      let param={
        // 'search[students_count]':ForumSearch.students_count,
        // 'search[name]':ForumSearch.name,
        limit:ForumSearch.limit,
        page:ForumSearch.page,
      }
      ForumSearch.students_count?param['search[students_count]']=ForumSearch.students_count:''
      ForumSearch.name?param['search[name]']=ForumSearch.name:''
      http.classList({param:{...param}}).then((res:IBusinessResp)=>{
         loading.value=false
        let data=res.data.list
        // data.map((v:any)=>{
        //   v.genderText=v.gender===2?'女':'男'
        // })
        list.push(...data)
        total.value=res.data.page.totalCount
        // console.log(list)
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
    function delateCard(val:number){
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
      Modal.confirm({
        title: '确认删除吗？',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除后不可恢复',
        okText: '确认',
        cancelText: '取消',
        onOk(){
          http.classUserBatchDelete({param:{class_ids:state.selectedRowKeys}}).then((res:IBusinessResp)=>{
            initData()
            message.success('删除成功')
          })
        }
      });
      
    }
    function submit(){
      // createTeacher
      formRef.value.validate().then(()=>{
        // console.log(formState)
        const promise=http.classCreate({param:{...formState}})
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
    function editCard(val:ItdItems){
      editId.value=val.id
      // http.viewTeacher({urlParams:{id:editId.value}}).then((res:IBusinessResp)=>{
      //   Object.keys(res.data).forEach((v:any)=>{
      //     if(v in formState){
      //       formState[v]=res.data[v]
      //     }
      //   })
      //   formState.name=res.data.stu_no
      // })
      // visible.value=true
      router.push('/admin/adminUserManagement/classManagement/classEdit?editId='+val.id)
    }
    function clearSearch(){
      // if(ForumSearch.students_count || ForumSearch.name){
        ForumSearch.name=''
        ForumSearch.students_count=''
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
      // router.push('/studentForum/CreatePosts')
    }
    onMounted(()=>{
      initData()
    })
    return {...toRefs(state),customizeRenderEmpty,suffix,cancel,formRef,formState,rules,list,columns,ForumSearch,loading,total,visible,editId,search,onChangePage,clearSearch,delateCard,BatchDelete,submit,editCard,addTeacher};
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
    .custom_input{
      position: relative;
      &::before{
          content: '';
          position: absolute;
          left:8px;
          top:10px;
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
