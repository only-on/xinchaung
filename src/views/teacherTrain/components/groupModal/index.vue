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
                <div>
                    <!-- :replaceFields='replaceFields' -->
                    <a-tree :treeData='treeData' :replaceFields='replaceFields' :defaultExpandAll='true'></a-tree>
                </div>
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
interface Istate{
   editLoading:boolean,
   ungroup:any[],
   group:groupType,
   treeData:any,
   replaceFields:any,
   groupname:string,
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
            group_info: {group_id: 313, group_name: "小组2"},
            student_list:[
            {train_id: "50225", group_id: 313, id: 4259, name: "sihaiv1"},
            {train_id: "50225", group_id: 313, id: 4251, name: "yt"},
            {train_id: "50225", group_id: 313, id: 4250, name: "lmm2"},
            {train_id: "50225", group_id: 313, id: 4249, name: "乔晶晶"},
            {train_id: "50225", group_id: 313, id: 4246, name: "123456"}]
        },
        replaceFields:{children:'student_list', title:'name', key:'id'},
        groupname:''      
    })
    const methods={
      editOk(){
         context.emit('editModal',true)
      },
      editCancel(){
         context.emit('editModal',false)
      },
      getStuGroup(){
          const formdata=new FormData()
          formdata.append('train_id','50317')
          formdata.append('group_id','308')
          http.studentGroup({urlParams:{train_id:50317}},).then((res:any)=>{
              
          })
      },
      leftMove(){

      },
      rightMove(){
          
      },
      onChange(checkedValues:any) {
      console.log('checked = ', checkedValues);
        },
      addGroup(){
          if(!state.groupname){
              message.warning('请输入分组名称')
              return
          }
      }
    }
    onMounted(()=>{
        // methods.getStuGroup()
        state.treeData=[{
            name:state.group.group_info.group_name,
            id:state.group.group_info.group_id,
            student_list:state.group.student_list,
        }]
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