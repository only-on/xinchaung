<template>
    <div class="groupModal" v-layout-bg>
      <a-modal
        title="学生分组"
        :visible="editvisible"
        :confirm-loading="editLoading"
        @ok="editOk"
        @cancel="editCancel"
        width="800px"
        >
        <div class="editCon">
            <div class="hasGroup">
                <div class="groupHeader"><a-input placeholder="请输入组名" style="width:70%" v-model:value="inputGroupName"></a-input><a-button type="primary" @click='addGroup'>创建</a-button></div>
                <div class="groupOperate" v-if="ifautoGroupEdit">
                    <a-input style="width:150px"></a-input>
                    <a-button type="primary">修改</a-button>
                </div>
                <div class="groupOperate" v-else>
                    <!-- <a-input style="width:150px"></a-input>
                    <a-button type="primary">编辑</a-button>
                    <a-button type="primary">解散</a-button> -->

                </div>
                <!-- :treeData='treeData'   :replaceFields='replaceFields' -->
                    <a-tree  checkable @select='selectTree'>
                        <template #switcherIcon>
                            <down-outlined />
                        </template>
                        <a-tree-node :checkable='false' v-for="(item,index) in treeData" :key="index" :title="item.name">
                            <a-tree-node :checkable='false' v-for="(it,j) in item.student_list" :key="index+''+j" :title="it?.userProfile?.name">
                            </a-tree-node>
                        </a-tree-node>
                    </a-tree>
            </div>
            <div>
            <div class="transferBox">
                <div class='move'>
                    <span @click="leftMove" class="icon-chuansuojiantou iconfont"></span>
                </div>
                <div :class="checkedValues.length?'moveHover':'move'">
                    <span @click="rightMove" class="icon-chuansuojiantou-copy iconfont"></span>
                </div>
            </div>
            </div>
            <div class="unGroup">
                <div>学生列表
                     <a-checkbox 
                     :indeterminate="indeterminate" 
                     v-model:checked="checkAll" 
                     @change="onCheckAllChange">
                        {{checkedValues?.length}}/{{unGroupData?.length}}人
                    </a-checkbox>
                </div>
                <div class="groupOperate" v-if="!ifautoGroupEdit">
                    <a-input-search style="width:100%" 
                    placeholder="请输入搜索关键字" 
                    v-model:value="groupname" 
                    @keyup.enter="onSearch"
                    @search="onSearch"></a-input-search>
                    <!-- <a-button type='primary' @click="addGroup">添加分组</a-button> -->
                </div>
                 <!-- 如果按班级排课 -->
                <div v-if="groupType==='class'" class="checkGroup">
                   <a-tree checkable  v-model:selectedKeys="selectedKeysClass" @expand='expandTree' checkStrictly>
                       <template #switcherIcon>
                            <down-outlined />
                       </template>
                       <a-tree-node :checkable='false' v-for="(item,index) in unGroupData" :key="index" :title="index">
                            <a-tree-node v-for="(it,j) in item.student_list" :key="j" :checkable='true' :title="it?.userProfile?.name">
                            </a-tree-node>
                       </a-tree-node>
                   </a-tree>    
                </div>
                <!-- 如果按学生排课 -->
                <div v-else class="checkGroup">
                    <a-checkbox-group v-model:value="checkedValues">
                        <div v-for="(item,index) in unGroupData" :key="index.toString()">
                            <a-checkbox :value="item.userProfile.id">
                                {{item.userProfile.name}}
                            </a-checkbox>
                        </div>
                   </a-checkbox-group>
                </div>
            </div>
        </div>
        </a-modal>
    </div>
</template>
<script lang="ts">
interface groupType{
    group_info:any,
    student_list:any,
}
interface groupItem{
    name:string,
    student_list:any[]
}
interface Istate{
   editLoading:boolean,
   group:groupType,
   treeData:groupItem[],
   replaceFields:any,
   groupname:string,
   checkedValues:number[],
   selectedKeys:string[],
   indeterminate:boolean,
   checkAll:boolean,
   inputGroupName:string,
   selectedKeysClass:string[],
   selectedGroup:any,
} 
import { defineComponent,onMounted,inject,reactive,toRefs,ref,watch} from 'vue'
import request from 'src/api/index'
import Empty from 'src/components/Empty.vue'
import { DownOutlined} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
export default defineComponent({
    name:'resources',
    props:['propTrainDetailInfo','trainId','editvisible','ifautoGroupEdit','unGroupData','groupType'],
    components:{
        Empty,
        DownOutlined
    },
    setup(props,context){
    const http=(request as any).teacherTrain
    const state:Istate=reactive({
        editLoading:false,
        treeData:[],
        group:{
            group_info: {},
            student_list:[]
        },
        replaceFields:{children:'student_list', title:'name', key:'id'},
        groupname:'' ,
        checkedValues:[],
        selectedKeys:[],
        indeterminate:false,
        checkAll: false,
        inputGroupName:'',
        selectedKeysClass:[],
        selectedGroup:''
    })
    const methods={
      editOk(){
          console.log(state.treeData,'treeData')
        //  context.emit('editModal',true,state.treeData)
      },
      editCancel(){
         context.emit('editModal',false)
      },
      onCheckAllChange(e: any){
            state.checkedValues=[] 
            props.unGroupData.forEach((item:any,index:any)=>{
                state.checkedValues.push(item.userProfile.id)
            })
            Object.assign(state, {
                checkedValues: e.target.checked ?state.checkedValues : [],
                indeterminate:true,
            });
      },
      onSearch(){
          console.log(state.groupname)
          context.emit("search-group",state.groupname)
      },
      getStuGroup(){
           http.getGroupAndNogroupStu({param:{train_id:50347}}).then((res:any)=>{
               console.log(res)
           })
      },
      leftMove(){

      },
      expandTree(e:any){
          console.log(e)
      },
    //   onChange(checkedValues:any) {
    //     state.checkedValues=checkedValues
           
    //     },
      addGroup(){
          if(!state.inputGroupName){
              message.warning('请输入分组名称')
              return
          }
        // state.group.student_list
           const treeItem:any={
            name:state.inputGroupName,
            student_list:[],
            }
            console.log(treeItem)
            state.treeData.push(treeItem)
            state.checkedValues=[]
            console.log(state.checkedValues)
      },
      selectTree(selectedKeys:any, e:any){
          state.selectedGroup=selectedKeys[0]
      },
      clickTree(index:any){
          state.selectedGroup=index
      },
      rightMove(){
        console.log(state.selectedGroup,'state.selectedGroup')
        if(state.selectedGroup===''){
            message.warning('请选择或者创建分组')
            return
        }
        let deleteArr:any=[]
        props.unGroupData.forEach((item:any,index:any)=>{
               console.log(item,'item')
               state.checkedValues.forEach((it:any)=>{
                    if(item.id===it){
                        console.log(it)
                        deleteArr.push(index)
                    }
               })
        })
        deleteArr.forEach((value:any)=>{
                console.log(value,'value3333333333')
               state.treeData[state.selectedGroup].student_list.push(props.unGroupData[value])
               props.unGroupData.splice(value,1)
        })
        state.checkedValues=[]
      },
    }
    watch(
      () => state.checkedValues,
      val => {
        state.indeterminate = !!val.length && val.length < props.unGroupData.length;
        state.checkAll = val.length === props.unGroupData.length;
      }
    ),
    watch(state.selectedKeysClass, () => {
      console.log('selectedKeys',state.selectedKeysClass);
    });
    onMounted(()=>{
        methods.getStuGroup()
    })
    return {...toRefs(state),...methods}
    }
})
</script>
<style lang="less">
.transferBox{
        .move{
        width:24px;
        height:24px;
        border-radius: 2px;
        background-color:#f5f5f5;
        }
        .move:hover{
            cursor: not-allowed
        }
        .moveHover{
            width:24px;
            height:24px;
            border-radius: 2px;
            background-color:@theme-color; 
            color: white;
        }
        .move:nth-child(1){
            margin-bottom:20px;
        }
        .isMoveRight{
            cursor: none;
        }
        .isMoveLeft{
            cursor: none;
        }
    }
// .groupModal{
    
// }
.hasGroup,.unGroup{
        width: 45%;
        border: 1px solid #C5D2DA;
        padding: 0 10px 10px 10px;
        height: 390px;
        overflow-y: auto;
        text-align: left;
        .groupHeader{
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            // border-bottom: 1px solid #C5D2DA;
        }
        .groupOperate{
            margin-top:10px;
            display: flex;
            justify-content: space-between;
        }
        .checkGroup{
            margin-top: 10px;
        }
    }
</style>