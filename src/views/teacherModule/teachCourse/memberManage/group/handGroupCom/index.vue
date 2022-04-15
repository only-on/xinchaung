<template>
  <div>
    <a-modal
      :width="900"
      cancelText="取消"
      okText="分组"
      :visible="visable"
      @ok="handleOk"
      @cancel="handleCancel"
      title="学生分组"
    >
    <div class="editCon">
        <div class="hasGroup">
          <div class="title">分组列表</div>
          <div class="createInpt">
              <a-input v-model:value="groupName">
                <template #addonAfter>
                  <div class="createBtn" @click="createGroup()">创建</div>
                </template>
              </a-input>
          </div>
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
                      >{{ item.name }}
                      <i
                        class="edit icon-bianji1 iconfont"
                        @click="editTreeTittle(index)"
                      ></i>
                      <i
                        v-if="!ifautoGroupEdit"
                        class="delete icon-shanchu-copy iconfont"
                        @click="deleteTree(index)"
                      ></i>
                    </span>
                  </template>
                </div>
              </template>
              <a-tree-node
                :checkable="true"
                v-for="it in item?.student_list"
                :key="index+ '-' + it?.userProfile?.id"
                :title="it?.userProfile?.name"
              >
              </a-tree-node>
            </a-tree-node>
            </a-tree>
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
          <div class="title">学生列表</div>
          <div class="searchvalue">
            <a-input-search
              v-model:value="searchvalue"
              placeholder="请输入搜索关键字"
              @search="onSearch"
            />
          </div>
          <a-checkbox-group v-model:value="checkedValues" @change='changeChecks'>
            <div v-for="(item, index) in unGroupData" :key="index.toString()">
              <a-checkbox :value="item.userProfile.id">
                {{ item.userProfile.name }}
              </a-checkbox>
            </div>
          </a-checkbox-group>
        </div>
      </div>
    </a-modal>
    
  </div>
</template>
<script lang="ts" setup>
import { computed, defineComponent, ref } from 'vue';
import { DownOutlined } from "@ant-design/icons-vue";
import {message} from 'ant-design-vue'

interface Props {
      visable:any;
}
const props = withDefaults(defineProps<Props>(), {
      visable:()=>{}
})
const groupName:any=ref('')
const searchvalue:any=ref('')
const groupedKeys:any=ref([])
const ifautoGroupEdit:any=ref('')
const flag:any=ref(true)
const currentEditData:any=ref('')
const treeData:any=ref('')
const unGroupData:any=ref([])
const checkedValues:any=ref([])
const selectedGroup:any=ref('')//选中的分组
treeData.value=[{ id:505,
  name:'小组2',
  index:0,
  student_list:[
    {userProfile:{id:1616,name:'stu1234'}}
  ]
},{ id:506,
  name:'小组3',
  index:1,
  student_list:[
    {userProfile:{id:1617,name:'stu1236'}}
  ]
}]
unGroupData.value=[
  {userProfile:{id:1618,name:'stu1'}},
  {userProfile:{id:1619,name:'stu2'}},
  {userProfile:{id:1620,name:'stu3'}},
  {userProfile:{id:1621,name:'stu4'}},
]
const emit = defineEmits<{ (e: "updateVisable", val: any,groupok:any): void }>();
function handleOk(){
  emit("updateVisable",'false',true);
}
function handleCancel(){
  emit("updateVisable",'false',false);
}
function createGroup(){
  const newGroupData={name:groupName.value}
  treeData.value.push(newGroupData)
  groupName.value=''
}
function onSearch() {
  
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
  console.log(selectedGroup.value,treeData.value)
  if (!selectedGroup.value && selectedGroup.value !== 0) {
    message.warning("请选择或者创建分组!");
    return;
  }
  const selectstu:any=unGroupData.value.filter((item:any)=>{
      return checkedValues.value.includes(item.userProfile.id)
  })
  console.log(checkedValues.value,'checkedValues.value',selectstu,'selectstu')
  selectstu.forEach((item:any)=> {
    console.log(item,'item')
    treeData.value[selectedGroup.value].student_list.push(item)
    console.log(treeData.value[selectedGroup.value],'treeData.value')
  });
  treeData.value=[...treeData.value]
  //过滤学生列表数据
  unGroupData.value=unGroupData.value.filter((item:any)=>{
      return !checkedValues.value.includes(item.userProfile.id)
  })
}
//把分组的学生移回
function toRight(){
    console.log(treeData.value,groupedKeys.value,'groupedKeys')
    groupedKeys.value.forEach((item:any) => {
        const i=item.split('-')[0] //treeData里的第几个数据
        const id=item.split('-')[1]  //学生id
        console.log(treeData.value[i].student_list,'gggg')
        const j=treeData.value[i].student_list.filter((it:any)=>{
          console.log(id,it)
          return it.userProfile.id==id;
        })
        console.log(j)
        // unGroupData.value.push(j) 
        // removerRightStu.push(j)
    })  
}

function ifselect(keys:any){
  if(keys?.length){
    return 'hover'
  }
}
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
</style>
