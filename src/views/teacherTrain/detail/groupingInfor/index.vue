<template>
    <div class="groupingInfor" v-layout-bg>
       <div class="groupBtn">
           <a-button class="autoGroup" type="primary" @click="aotuGroup">自动分组</a-button>
           <a-button type="primary" @click="manualGroup">手动分组</a-button>
       </div>
       <div>
           <a-config-provider>
                    <a-table class="groupTable" :columns="columns" :data-source="data" :rowkey='rowkey'>
                        <template #action>
                            <div class="action">
                               <span @click="deleteGroup">删除</span>
                               <span @click="editGroup">编辑</span>
                            </div>
                        </template>
                    </a-table>
                    <template #renderEmpty>
                        <div><empty type="tableEmpty"></empty></div>
                    </template>
            </a-config-provider>
                <a-modal
                title="提示"
                :visible="deletevisible"
                :confirm-loading="confirmLoading"
                @ok="deleteOk"
                @cancel="deleteCancel"
                class="groupModal"
                >
                <p>确定要删除此分组吗？</p>
                </a-modal>
                <group-modal :trainId="trainId" :editvisible='editvisible' @edit-modal='editModal' :ifautoGroupEdit='ifautoGroupEdit'></group-modal>
                 <a-modal
                title="学生分组"
                width="550px"
                :footer="null"
                :visible="autoGroupVisible"
                :confirm-loading="autoConfirmLoading"
                @ok="autoGroupOk"
                @cancel="autoGroupCancel"
                class="groupModal"
                >
                <div class="groupWay">
                     <span class="groupItem">分组方式：</span>
                     <span class="groupItem">
                        <a-select default-value="1" style="width:100px;height:32px" @change="handleChange">
                            <a-select-option value="1">
                                小组数
                            </a-select-option>
                            <a-select-option value="2">
                                分组人数
                            </a-select-option>
                     </a-select>
                     </span>
                     <a-input class="groupItem" style="width:170px" v-model:value="groupNumber"></a-input>
                     <a-button type="primary" @click="grouping">分组</a-button>
                </div>
                </a-modal>
       </div>
    </div>
</template>
<script lang="ts">
interface Istate{
   columns:any[],
   data:any[],
   deletevisible:boolean,
   confirmLoading:boolean,
   editvisible:boolean,
   autoGroupVisible:boolean,
   autoConfirmLoading:boolean,
   ifautoGroupEdit:boolean,
   groupNumber:any,
   groupway:number
} 
import { defineComponent,onMounted,inject,reactive,toRefs,ref} from 'vue'
import request from 'src/api/index'
import Empty from 'src/components/Empty.vue'
import { message } from 'ant-design-vue';
import groupModal from '../../components/groupModal/index.vue'
export default defineComponent({
    name:'groupingInfor',
    props:['propTrainDetailInfo','trainId'],
    components:{
        Empty,
        groupModal
    },
    setup(props,context){
    const http=(request as any).teacherTrain
    const state:Istate=reactive({
        deletevisible:false,
        confirmLoading:false,
        editvisible:false,
        autoGroupVisible:false,
        autoConfirmLoading:false,
        ifautoGroupEdit:false,
        groupway:1,
        groupNumber:'',
      columns:[{
        title: '小组名称',
        dataIndex: 'name',
        align: 'center',
    },
    {
        title: '小组人数',
        dataIndex: 'age',
        align: 'center',
    },
    {
        title: '创建时间',
        dataIndex: 'createtime',
        align: 'center',
    },
    {
        title: '操作',
        key: 'action',
        align: 'center',
        slots: { customRender: 'action' },
    },],
    data:[{name:'小组1',age:3,createtime:'2019-09-8'}]
    })
    const methods={
      deleteGroup(){
          state.deletevisible=true
      },
      editGroup(){
          state.editvisible=true
          state.ifautoGroupEdit=true
      },
      deleteOk(){
          state.deletevisible=false
      },
      deleteCancel(){
          state.deletevisible=false
      },
      editModal(){
          state.editvisible=false
          state.ifautoGroupEdit=false
      },
    //   自动分组
      aotuGroup(){
          state.autoGroupVisible=true
      },
      autoGroupOk(){
          state.autoGroupVisible=false
      },
      autoGroupCancel(){
          state.autoGroupVisible=false
      },
      grouping(){
          if(!state.groupNumber){
              message.warning('人数或小组数不能为空！')
              return
          }
        //   AutomaticGroup
          let params:any={}
          if(state.groupway===1){
              params={
              train_id:props.trainId,
              group_num:state.groupNumber
              }
          }else{
               params={
            //    train_id:props.trainId,
               train_id:50338,
               group_people_num:state.groupNumber
            }
          }
         http.automaticGroup({param:params}).then((res:any)=>{
             console.log(res)
         })
      },
    //   手动分组
      manualGroup(){
          state.editvisible=true
      },
      handleChange(value:any){
          console.log(value)
          state.groupway=value
      },
      rowkey(record: {}, index: number){
         return index
      },
    //   获取分组列表
      getGroupList(){
          http.groupList({param:{course_id:501714}}).then((res:any)=>{
              console.log(res)
          })
      }
    }
    onMounted(()=>{
        methods.getGroupList()
    })
    return {...toRefs(state),...methods}
    }
})
</script>
<style lang="less">
.groupingInfor{
    margin: 10px;
    .groupBtn{
        margin-bottom: 20px;
        .autoGroup{
            margin-right:20px;
        }
    }
    .groupTable{
        .action{
            span{
                margin: 0 5px;
                color: @theme-color;
            }
            span:hover{
                color:@theme-light-color;
            }
        }
    }
}
.editCon{
    display: flex;
    .transferBox {
    float: left;
    padding: 160px 0 0 10px;
    width: 84px;
    text-align: center;
    }
}
.groupWay{
    // justify-content: center;
    // align-items:center;
    text-align: center;
    .groupItem{
        margin-right: 5px;
    }
}
.groupModal{
    .ant-modal-body{
        min-height: 120px;
    }
}
</style>