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
              <a-input v-model:value="groupName" maxLength="15">
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
            :tree-data="treeData"
            @select="selectTree"
            @check='checkGroupStu'
            v-model:checkedKeys="groupedKeys"
            v-if="flag === true"
          >
              <template #switcherIcon="{ switcherCls }"><down-outlined :class="switcherCls" /></template>
              <template #title="{ dataRef }">
                <div class="tree-title title">
                    <span class="name">
                      <span class="itemName">{{ dataRef.title }}</span>
                      <span class="itemNumber">
                        {{dataRef?.children?.length}}
                      </span>
                    </span>
                </div>
              </template>
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
            <a-input-search  enter-button
              v-model:value="searchvalue"
              placeholder="请输入搜索关键字"
              @search="onSearch"
            />
          </div>
          <div>
          </div>
          <div class="unselect">
            <a-checkbox-group v-model:value="checkedValues" @change='changeChecks'>
            <div v-for="(item, index) in unGroupData" :key="item.key">
              <a-checkbox :value="item.key">
                {{ item.name }}
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
  unGroupData.value.forEach((item: any, index: any) => {
    checkedValues.value.push(item.id);
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
  if(props.ifedit){
          const arryData: any = Array.from(treeData.value);
          const editData: any = arryData.filter((item: any) => {
            return item.id !== undefined;
          });
          const createData: any = arryData.filter((item: any) => {
            return item.id === undefined;
          });
          const params:any={
            name:'',
            members:[]
          }
          editData.forEach((item:any) => {
              params.name=item.title;
              item.children.forEach((it: any) => {
                      params.members.push(it.id);
              });
          });
        const promise=new Promise((resolve:any,reject:any)=>{
          return http.editGroup({urlParams:{group:props.group_id},param:params}).then((res:any)=>{
            if(res.code){
              // emit("updateVisable",'false',true);
              // treeData.value=[]
              // unGroupData.value=[]
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
                groups.push({name:item.title,members:[]})
                item.children.forEach((it:any)=>{
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
      groups.push({name:item.title,members:[]})
      item.children.forEach((it:any)=>{
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
    const newGroupData={title:groupName.value,children:[],key:treeData.value.length,id:treeData.value.length}
  treeData.value.push(newGroupData)
  }
  groupName.value=''
}
function onSearch() {
  getUngroupStu()
}
//选择要把学生放进的分组
function selectTree(selectedKeys:any,e:any){
  console.log(selectedKeys)
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
  if (selectedGroup.value === '' ||  selectedGroup.value === undefined) {
    message.warning("请选择或者创建分组!");
    return;
  }
  const selectstu:any=unGroupData.value.filter((item:any)=>{
      return checkedValues.value.includes(item.key)
  })
  treeData.value.forEach((treeItem:any,index:any) => {
    if (selectedGroup.value == treeItem.key) {
      selectstu.forEach((item:any)=> {
        treeData.value[index].children.push({
          title: item.name,
          key: item.key,
          id: item.id
        })
      });
    }
  })
  treeData.value=[...treeData.value]
  //过滤学生列表数据
  unGroupData.value=unGroupData.value.filter((item:any)=>{
      return !checkedValues.value.includes(item.id)
  })
  checkedValues.value=[]
}
//把分组的学生移回
function toRight(){
  const allstuids:any=[]
  const numberNum:any=[]
    groupedKeys.value.forEach((item:any) => {
      treeData.value.forEach((treeItem:any) => {
        treeItem.children.forEach((treeChild:any, index:any) => {
          if (treeChild.key === item) {
            treeItem.children.splice(index,1)
            unGroupData.value.push({
              id: treeChild.id,
              key: treeChild.key,
              name: treeChild.title
            }) 
          }
        })
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
        unGroupData.value.length = 0
        res.data.data.forEach((item:any) => {
          unGroupData.value.push({
            id: item.id,
            key: item.userProfile.id,
            name: item.userProfile.name
          })
        })
      }
   })
}
function groupNumberList(){
  http.groupNumberList({urlParams:{group:props.group_id}}).then((res:any)=>{
    if(res.code){
      let children:any = []
      res.data.list.forEach((item:any) => {
        children.push({
          id: item.id,
          key: item.userProfile.id,
          title: item.userProfile.name
        })
      })
      treeData.value=[{id:props.group_id,key:props.group_id,title:props.editGroupname,children:children}]
    }
  })
}
watch(
      () => checkedValues.value,
      val => {
        indeterminate.value = !!val.length && val.length < unGroupData.value.length;
        checkAll.value = val.length === unGroupData.value.length&&unGroupData.value.length!==0;
      }
)
watch(
      () =>props.visable,
      () => {
        if(props.visable){
          //分组列表置空
          treeData.value=[]
          //学生列表
          unGroupData.value=[]
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
  :deep(.ant-tree-switcher_open)+.ant-tree-checkbox{
    display: none;
  }
  :deep(.ant-tree-switcher_close)+.ant-tree-checkbox{
    display: none;
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
