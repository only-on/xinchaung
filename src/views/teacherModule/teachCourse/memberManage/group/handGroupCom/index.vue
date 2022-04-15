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
                  <div class="createBtn">创建</div>
                </template>
              </a-input>
          </div>
            <a-tree
            checkable
            @select="selectTree"
            v-model:checkedKeys="groupedKeys"
            v-if="flag === true"
          >
            <template #switcherIcon>
              <down-outlined />
            </template>
            <a-tree-node
              :checkable="false"
              v-for="(item, index) in treeData"
              :key="index"
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
                :key="index + '-' + it?.userProfile?.id"
                :title="it?.userProfile?.name"
              >
              </a-tree-node>
            </a-tree-node>
            </a-tree>
        </div>
        <div class="middle">
          <div class="transferBox">
            <li class="left">
            <span class="icon iconfont icon-youjiantou"></span>
          </li>
          
          <li class="right">
            <span class="icon iconfont icon-zuojiantou"></span>
          </li>
          </div>
        </div>
        <div class="unGroup">
          <div class="title">学生列表</div>
          <div>
            <a-input-search
              v-model:value="searchvalue"
              placeholder="请输入搜索关键字"
              @search="onSearch"
            />
          </div>
        </div>
      </div>
    </a-modal>
    
  </div>
</template>
<script lang="ts" setup>
import { computed, defineComponent, ref } from 'vue';
import { DownOutlined } from "@ant-design/icons-vue";

interface Props {
      visable:any;
}
const props = withDefaults(defineProps<Props>(), {
      visable:()=>{}
})
const groupName:any=ref('')
const searchvalue:any=ref('')
const groupedKeys:any=ref({})
const ifautoGroupEdit:any=ref('')
const flag:any=ref(true)
const currentEditData:any=ref('')
const treeData:any=ref('')
treeData.value=[{ id:505,
  name:'小组2',
  student_list:[
    {userProfile:{id:1616,name:'stu1234'}}
  ]
}]
const emit = defineEmits<{ (e: "updateVisable", val: any,groupok:any): void }>();
function handleOk(){
  emit("updateVisable",'false',true);
}
function handleCancel(){
  emit("updateVisable",'false',false);
}
function onSearch() {
  
}
function selectTree(){

}
function editTreeTittle(index:any){

}
function deleteTree(index:any){

}
function titleBlurs(){

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
    background-color: var(--primary-color);
    display: flex;
    justify-content: center;
    align-items: center;
    .iconfont{
      color: var(--white-100);
    }
  }
  .left{
    margin-bottom: 20px;
  }
}
.hasGroup{
  width: 390px;
  height: 542px;
  border: 1px solid var(--gray-5);
  padding: 15px;
  .createInpt{
    width: 100%;
    display: flex;
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
}
.title{
  margin-bottom: 15px;
}
:deep(.ant-input-group-addon){
  padding: 0px;
}
</style>
