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
                <div>分组情况</div>
                <div class="groupOperate" v-if="ifautoGroupEdit">
                    <a-input style="width:150px"></a-input>
                    <a-button type="primary">修改</a-button>
                </div>
                <div class="groupOperate" v-else>
                    <a-input style="width:150px"></a-input>
                    <a-button type="primary">编辑</a-button>
                    <a-button type="primary">解散</a-button>
                </div>
                    <a-tree :treeData='treeData' @select='selectTree'  :replaceFields='replaceFields'></a-tree>
            </div>
            <div>
            <div class="transferBox">
                <div>
                    <span @click="leftMove" class="icon-chuansuojiantou iconfont"></span>
                </div>
                <div>
                    <span @click="rightMove" class="icon-chuansuojiantou-copy iconfont"></span>
                </div>
            </div>
            </div>
            <div class="unGroup">
                <div>未分组情况(未分组学生)</div>
                <div class="groupOperate" v-if="!ifautoGroupEdit">
                    <a-input style="width:180px" placeholder="选择学生命名新数组" v-model:value="groupname"></a-input>
                    <a-button type='primary' @click="addGroup">添加分组</a-button>
                </div>
                <div class="checkGroup">
                    <a-checkbox-group @change="onChange">
                        <div v-for="(item,index) in ungroup" :key="index.toString()">
                            <a-checkbox :value="item.id">
                                {{item.name}}
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
   ungroup:any[],
   group:groupType,
   treeData:groupItem[],
   replaceFields:any,
   groupname:string,
   checkedValues:number[],
   selectedKeys:string[]
} 
import { defineComponent,onMounted,inject,reactive,toRefs,ref} from 'vue'
import request from 'src/api/index'
import Empty from 'src/components/Empty.vue'
import { message } from 'ant-design-vue';
export default defineComponent({
    name:'resources',
    props:['propTrainDetailInfo','trainId','editvisible','ifautoGroupEdit'],
    components:{
        Empty
    },
    setup(props,context){
    const http=(request as any).teacherTrain
    const state:Istate=reactive({
        editLoading:false,
        ungroup: [{id: 4253, name: "lee dong", train_id: "50225"}],
        treeData:[],
        group:{
            group_info: {},
            student_list:[]
        },
        replaceFields:{children:'student_list', title:'name', key:'id'},
        groupname:'' ,
        checkedValues:[],
        selectedKeys:[]    
    })
    const methods={
      editOk(){
         context.emit('editModal',true)
      },
      editCancel(){
         context.emit('editModal',false)
      },
      getStuGroup(){
           http.getGroupAndNogroupStu({param:{train_id:50347}}).then((res:any)=>{
               console.log(res)
           })
      },
      leftMove(){

      },
      rightMove(){
          
      },
      onChange(checkedValues:any) {
        state.checkedValues=checkedValues
           
        },
      addGroup(){
          if(!state.groupname){
              message.warning('请输入分组名称')
              return
          }
          let deleteArr:any=[]
          state.ungroup.forEach((item:any,index:any)=>{
               state.checkedValues.forEach((value:any)=>{
                    if(item.id===value){
                        deleteArr.push(index)
                        state.group.student_list.push(item)
                    }
               })
           })
           deleteArr.forEach((value:any)=>{
               state.ungroup.splice(value,1)
           })
           const treeItem:any={
            name:state.groupname,
            student_list:state.group.student_list,
            }
            console.log(treeItem)
            state.treeData.push(treeItem)
            state.checkedValues=[]
            console.log(state.checkedValues)
      },
      selectTree(selectedKeys:any){
          console.log(selectedKeys,'hvvvvvvvvvvvvvv')
      }
    }
    onMounted(()=>{
        methods.getStuGroup()
        state.ungroup=[
        {id: 4251, name: "yt", train_id: "50338"},
        {id: 4255, name: "sihai fu", train_id: "50338"},
        {id: 4253, name: "lee dong", train_id: "50338"}]
    })
    return {...toRefs(state),...methods}
    }
})
</script>
<style lang="less">
.groupModal{
    .transferBox{
        display: flex;
        flex-direction: column;
        align-content: center;
        .isMoveRight{
            cursor: none;
        }
        .isMoveLeft{
            cursor: none;
        }
    }
}
.hasGroup,.unGroup{
        width: 45%;
        border: 1px solid #C5D2DA;
        padding: 0 10px 10px 10px;
        height: 390px;
        overflow-y: auto;
        text-align: left;
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