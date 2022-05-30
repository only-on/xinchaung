<template>
  <div class="group">
    <div class="header">
      <a-button class="btn1" type="primary" @click="autoGroup">自动分组</a-button>
      <a-button type="primary" @click="handGroup">手动分组</a-button>
    </div>
    <div class="tableScrollbar">
      <a-table
      rowKey='id'
      :columns="columns"
      :data-source="data"
      :pagination="
        tableData.total > 10
          ? {
              hideOnSinglePage: false,
              showSizeChanger: true,
              total: tableData.total,
              current: groupListParams.page,
              pageSize:groupListParams.limit,
              onChange: onChange,
              onShowSizeChange: onShowSizeChange,
            }
          : false
      "
    >
    <template #action='{record}'>
      <div class="action">
        <span class='delete actionBtn' @click="deleteGroup(record.id)">删除</span>
        <span class="actionBtn" @click="editGroup(record.id,record.name)">编辑</span>
      </div>
    </template>
    </a-table>
    </div>
    <autoGroupCom v-if="groupType=='auto'" :visable='modalVisable' @updateVisable='updateVisable'></autoGroupCom>
    <handGroupCom v-if="groupType=='hand'" :ifedit='ifedit' :editGroupname='editGroupname' :group_id='group_id' :visable='modalVisable' @updateVisable='updateVisable'></handGroupCom>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted,reactive } from "vue";
import handGroupCom from './handGroupCom/index.vue'
import autoGroupCom from './autoGroupCom/index.vue'
import request from 'src/api/index'
import { useRouter ,useRoute } from 'vue-router';
const http = (request as any).teacherMemberManage;
const route=useRoute()
const courseId:any=route.query.courseId  //章节id
const columns: any = ref();
const data: any = ref([]);
const modalVisable: any = ref(false);
const selectValue: any = ref("");
const number: any = ref("");
const groupType:any=ref('');
const ifedit:any=ref('false');
const group_id:any=ref('')
const editGroupname:any=ref('')
columns.value = [
  {
    title: "小组名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "小组人数",
    dataIndex: "num",
    key: "num",
  },
  {
    title: "姓名",
    dataIndex: "members",
    key: "members",
  },
  {
    title: "操作",
    key: "action",
    slots: { customRender: "action" },
    width:140,
  },
];
const tableData: any = reactive({
  total: 0
});
const groupListParams:any=reactive({
    id:courseId,
    type:1,
    page:1,
    limit:10,
})
function focus() {
  console.log("focus");
}
function handleChange(value: string) {
  console.log(`selected ${value}`);
}
function onSearch(value: any) {
  console.log(value);
  groupListParams.page=1
  getGroupList()
}
function onChange(page: any, pageSize: any) {
  groupListParams.page=page
  getGroupList()
}
function onShowSizeChange(current: any, size: any) {
  groupListParams.page=1
  groupListParams.limit=size
  getGroupList()
}
function autoGroup() {
  groupType.value='auto';
  modalVisable.value = true;
}
function handGroup(){
  groupType.value='hand';
  modalVisable.value = true;
  ifedit.value=false;
  group_id.value=''
  editGroupname.value=''
}
function updateVisable(val:any,groupok:any){
  modalVisable.value = false;
  if(groupok){
    getGroupList()
  }
}
function deleteGroup(id:any){
    http.deleteGroup({urlParams:{group:id}}).then((res:any)=>{
      if(res.code){
        groupListParams.page=1
        getGroupList()
      }
    })
}
function editGroup(id:any,name:any){
  groupType.value='hand';
  modalVisable.value = true;
  ifedit.value=true;
  group_id.value=id
  editGroupname.value=name
}
const emit = defineEmits<{ (e: "updateGroup",groupok:any): void }>();
// 获取分组列表
function getGroupList() {
        http
          .grouplist({
            param: groupListParams
          })
          .then((res: any) => {
            console.log(res);
            data.value = res.data.list;
            tableData.total = res?.data.page.totalCount;
            if(tableData.total){
              emit("updateGroup",false);
            }else{
              emit("updateGroup",true);
            }
          });
}
onMounted(()=>{
  getGroupList()
})
</script>

<style lang="less" scoped>
.header {
  margin-bottom: 20px;
  .btn1 {
    margin-right: 16px;
  }
}
.select {
  margin-left: 10px;
  margin-right: 4px;
}
.action{
  color: var(--primary-color);
  .delete{
  margin-right: 20px;
  }
}
.actionBtn:hover{
  cursor: pointer;
}
.tableScrollbar{
  height: 530px;
  overflow-y: auto;
}
</style>
