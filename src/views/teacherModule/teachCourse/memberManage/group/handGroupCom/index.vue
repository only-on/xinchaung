<template>
  <div>
    <a-modal
      :width="900"
      cancelText="取消"
      okText="分组"
      :destroyOnClose="true"
      :visible="visable"
      @ok="handleOk"
      @cancel="handleCancel"
      title="学生分组"
    >
    <div class="editCon">
        <div class="hasGroup">
          <div class="title">分组列表({{treeData.length}})</div>
          <div class="createInpt">
              <a-input v-model:value="groupName">
                <template #addonAfter>
                  <div class="createBtn" @click="createGroup()">创建</div>
                </template>
              </a-input>
          </div>
          <div>
          </div>
          <div class='selected'>
            <a-tree
            checkable
            @select="selectTree"
            @check='checkGroupStu'
            v-model:checkedKeys="groupedKeys"
            v-if="flag === true"
          >
            <template #switcherIcon>
              <down-outlined />
            </template>
            <a-tree-node
              :checkable="false"
              v-for="(item, index) in treeData"
              :key="index.toString()"
            >
              <template #title>
                <div class="tree-title title">
                  <template v-if="currentEditData === index">
                    <a-input
                      class="name inputname"
                      v-model:value="item.name"
                      @blur="titleBlurs"
                    ></a-input>
                  </template>
                  <template v-else>
                    <span class="name"
                      >
                      <span class="itemName">{{ item.name }}</span>
                      <!-- <i
                        class="edit icon-bianji1 iconfont"
                        @click="editTreeTittle(index)"
                      ></i> -->
                      <i
                        v-if="!ifautoGroupEdit"
                        class="delete icon-shanchu-copy iconfont"
                        @click="deleteTree(index)"
                      ></i>
                      <span class="itemNumber">
                        {{item?.student_list?.length}}
                      </span>
                    </span>
                  </template>
                </div>
              </template>
              <a-tree-node
                :checkable="true"
                v-for="it in item?.student_list"
                :key="index + '-' + it?.userProfile?.id"
                :title="it?.userProfile?.name"
              >
              </a-tree-node>
            </a-tree-node>
            </a-tree>
          </div>
        </div>
        <div class="middle">
          <div class="transferBox">
            <li :class="['left',ifselect(groupedKeys)]" @click="toRight()">
            <span class="icon iconfont icon-youjiantou"></span>
          </li>
          
          <li :class="['right',ifselect(checkedValues)]" @click="toLeft()">
            <span class="icon iconfont icon-zuojiantou"></span>
          </li>
          </div>
        </div>
        <div class="unGroup">
          <div class="title">学生列表
            <a-checkbox
              :indeterminate="indeterminate"
              v-model:checked="checkAll"
              @change="onCheckAllChange"
            >
            {{checkedValues.length}}/{{unGroupData.length}}
            </a-checkbox>
            </div>
          <div class="searchvalue">
            <a-input-search
              v-model:value="searchvalue"
              placeholder="请输入搜索关键字"
              @search="onSearch"
            />
          </div>
          <div>
          </div>
          <div class="unselect">
            <a-checkbox-group v-model:value="checkedValues" @change='changeChecks'>
            <div v-for="(item, index) in unGroupData" :key="item.userProfile.id">
              <a-checkbox :value="item.userProfile.id">
                {{ item.userProfile.name }}
              </a-checkbox>
            </div>
          </a-checkbox-group>
          </div>
        </div>
      </div>
    </a-modal>
    
  </div>
</template>
<script lang="ts" setup>
import { computed, defineComponent, onMounted, ref ,watch} from 'vue';
import { DownOutlined } from "@ant-design/icons-vue";
import {message} from 'ant-design-vue'
import request from 'src/api/index'
import { useRouter ,useRoute } from 'vue-router';
import { resolve } from 'path/posix';
const http = (request as any).teacherMemberManage;
const route=useRoute()
const courseId:any=route.query.courseId  //章节id
interface Props {
      visable:any;
      ifedit:any;
      group_id:any;
      editGroupname:any
      
}
const props = withDefaults(defineProps<Props>(), {
      visable:()=>{},
      ifedit:()=>{},
      group_id:()=>{},
      editGroupname:()=>{}
})
const groupName:any=ref('')
const searchvalue:any=ref('')
const groupedKeys:any=ref([])
const ifautoGroupEdit:any=ref('')
const flag:any=ref(true)
const currentEditData:any=ref('')
const treeData:any=ref([])
const unGroupData:any=ref([])
const checkedValues:any=ref([])
const selectedGroup:any=ref('')//选中的分组
const checkAll:any=ref(false)
const indeterminate:any=ref(false)
const allStuIdsValues:any=ref([])
function onCheckAllChange(e:any){
  checkedValues.value=[]
  console.log(e)
  unGroupData.value.forEach((item: any, index: any) => {
    checkedValues.value.push(item.userProfile.id);
  });
  checkedValues.value=e.target.checked ?checkedValues.value : []
  // indeterminate.value=e.target.checked ?true:false
  checkAll.value=e.target.checked ?true:false
}
function toDoKey(index:any,it:any){
  return index + '-' + it?.userProfile?.id;
}
const emit = defineEmits<{ (e: "updateVisable", val: any,groupok:any): void }>();
function handleOk(){
  console.log(treeData.value)
  if(props.ifedit){
          const arryData: any = Array.from(treeData.value);
          const editData: any = arryData.filter((item: any) => {
            console.log(item.id !== undefined, item.id, "edit");
            return item.id !== undefined;
          });
          const createData: any = arryData.filter((item: any) => {
            console.log(item.id === undefined);
            return item.id === undefined;
          });
          const params:any={
            name:'',
            members:[]
          }
          editData.forEach((item:any) => {
              params.name=item.name;
              item.student_list.forEach((it: any) => {
                      params.members.push(it.id);
              });
          });
        const promise=new Promise((resolve:any,reject:any)=>{
          return http.editGroup({urlParams:{group:props.group_id},param:params}).then((res:any)=>{
            if(res.code){
              // emit("updateVisable",'false',true);
              treeData.value=[]
              unGroupData.value=[]
                resolve((res:any)=>{
                  return res
                })
              }
            })
          })
          promise.then((res:any)=>{
            if(createData?.length){
              const groups:any=[]
              createData.forEach((item:any,index:any)=> {
                groups.push({name:item.name,members:[]})
                item.student_list.forEach((it:any)=>{
                  groups[index].members.push(it.id)
                })
              });
              http.handGroup({param:{id:courseId,type:1,groups:groups}}).then((res:any)=>{
                  if(res.code){
                    emit("updateVisable",'false',true);
                  }
                })   
            }else{
              emit("updateVisable",'false',true);
            }
          })
  }else{
    const groups:any=[]
    treeData.value.forEach((item:any,index:any)=> {
      groups.push({name:item.name,members:[]})
      item.student_list.forEach((it:any)=>{
        groups[index].members.push(it.id)
      })
    });
    http.handGroup({param:{id:courseId,type:1,groups:groups}}).then((res:any)=>{
      if(res.code){
        emit("updateVisable",'false',true);
      }
    })
  }
}
function handleCancel(){
  emit("updateVisable",'false',false);
  treeData.value=[]
  unGroupData.value=[]
}
function createGroup(){
  if(groupName.value){
    const newGroupData={name:groupName.value,student_list:[]}
  treeData.value.push(newGroupData)
  }
  groupName.value=''
}
function onSearch() {
  getUngroupStu()
}
//选择要把学生放进的分组
function selectTree(selectedKeys:any,e:any){
  selectedGroup.value=selectedKeys[0]
}
function editTreeTittle(index:any){

}
function deleteTree(index:any){

}
function titleBlurs(){

}
//勾选已经分组的学生
function checkGroupStu(){
  checkedValues.value=[]
}
//勾选未分组的学生
function changeChecks(){
  groupedKeys.value=[]
}
//把学生添加到分组里
function toLeft(){
  console.log(selectedGroup.value)
  console.log(treeData.value)
  if (!selectedGroup.value && selectedGroup.value !== 0) {
    message.warning("请选择或者创建分组!");
    return;
  }
  const selectstu:any=unGroupData.value.filter((item:any)=>{
      return checkedValues.value.includes(item.userProfile.id)
  })
  console.log(checkedValues.value,'checkedValues.value',selectstu,'selectstu',selectedGroup.value,'selectedGroup.value')
  selectstu.forEach((item:any)=> {
    treeData.value[selectedGroup.value].student_list.push(item)
  });
  treeData.value=[...treeData.value]
  //过滤学生列表数据
  unGroupData.value=unGroupData.value.filter((item:any)=>{
      return !checkedValues.value.includes(item.userProfile.id)
  })
  checkedValues.value=[]
}
//把分组的学生移回
function toRight(){
  const allstuids:any=[]
  const numberNum:any=[]
    groupedKeys.value.forEach((item:any) => {
        const i=item.split('-')[0] //treeData里的第几个数据
        const id=item.split('-')[1]  //学生id
        allstuids.push(id)
        const j=treeData.value[i].student_list.filter((it:any,n:any)=>{
          return it.userProfile.id==id;
        })
        console.log(j,'jjjjjjjjjjjjjjj')
        j.forEach((item:any,index:any)=> {
          unGroupData.value.push(item) 

          // treeData.value[i].student_list.splice(index,1)
        });
       treeData.value[i].student_list.forEach((it:any,n:any)=>{
         if(it.userProfile.id==id){
          treeData.value[i].student_list.splice(n,1)
         }
        })
    }) 
    groupedKeys.value=[]
}
function ifselect(keys:any){
  if(keys?.length){
    return 'hover'
  }
}
function getUngroupStu(){
   http.unGroupstuList({param:{id:courseId,type:1,name:searchvalue.value}}).then((res:any)=>{
      if(res.code){
        unGroupData.value=res.data.data
      }
   })
}
function groupNumberList(){
  http.groupNumberList({urlParams:{group:props.group_id}}).then((res:any)=>{
    if(res.code){
      treeData.value=[{id:props.group_id,name:props.editGroupname,student_list:res.data.list}]
    }
  })
}
watch(
      () => checkedValues.value,
      val => {
        console.log(val.length,unGroupData.value.length,'valvalval')
        indeterminate.value = !!val.length && val.length < unGroupData.value.length;
        checkAll.value = val.length === unGroupData.value.length&&unGroupData.value.length!==0;
      }
)
watch(
      () =>props.visable,
      () => {
        // console.log(props.visable);
        
        if(props.visable){
          //分组列表置空
          treeData.value=[]
          //学生列表
          unGroupData.value=[]
          console.log(props.ifedit,'props.ifedit')
          //勾选的数据
          checkedValues.value=[]
          //选择的分组
          selectedGroup.value=''
          if(props.ifedit){
            groupNumberList()
            getUngroupStu()
          }else{
            getUngroupStu()
          }
        }
      },
      { deep: true, immediate: true }
);
onMounted(()=>{
  // getUngroupStu()
})
</script>
<style lang="less" scoped>
.editCon{
  display: flex;
  justify-content: space-between;
}
.middle{
  display: flex;
  flex-direction: column;
  justify-content: center;
  .left,.right{
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .hover{
    background-color: var(--primary-color);
    .iconfont{
      color: var(--white-100);
    }
  }
  .hover:hover{
    cursor: pointer;
  }
  .left{
    margin-bottom: 20px;
  }
}
.hasGroup{
  width: 390px;
  height: 542px;
  border: 1px solid var(--gray-5);
  padding: 10px;
  .createInpt{
    width: 100%;
    display: flex;
    margin-bottom:15px;
    .createBtn{
      width:73px;
      height: 30px;
      color: var(--white-100); 
      background-color: var(--primary-color);
      display: flex;
      justify-content: center;
      align-items: center;
      border-left: none;
    }
    .createBtn:hover{
      cursor: pointer;
    }
  }
}
.unGroup{
  width: 400px;
  height: 542px;
  border: 1px solid var(--gray-5);
  padding: 15px;
  .searchvalue{
    margin-bottom: 20px;
  }
}
.title{
  margin-bottom: 15px;
}
:deep(.ant-input-group-addon){
  padding: 0px;
}
.unselect,.selected{
  height: 420px;
  overflow-y: auto;
}
.name{
  display: flex;
  justify-content:space-between;
  .itemName{
    width:300px;
  }
  .itemNumber{
    width:30px;
    text-align: center;
  }
}
</style>
