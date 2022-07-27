<template>
  <div class="group">
    <div class="header">
      <a-button class="btn1" type="primary" @click="autoGroup">自动分组</a-button>
      <a-button type="primary" @click="handGroup">手动分组</a-button>
    </div>
    <div class="tableScrollbar">
      <a-config-provider>
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
            <template v-slot:bodyCell="{column,record}">
              <template v-if="column.dataIndex === 'action'">
                <div class="action">
                  <span class='delete actionBtn' @click="deleteGroup(record.id)">删除</span>
                  <span class="actionBtn" @click="editGroup(record.id,record.name)">编辑</span>
                </div>
              </template>
            </template>
          </a-table>
          <template #renderEmpty>
            <div><Empty type="tableEmpty"/></div>
          </template>
      </a-config-provider>
     
    </div>
    <autoGroupCom v-if="groupType=='auto'" :visable='modalVisable' @updateVisable='updateVisable'></autoGroupCom>
    <handGroupCom v-if="groupType=='hand'" :ifedit='ifedit' :editGroupname='editGroupname' :group_id='group_id' :visable='modalVisable' @updateVisable='updateVisable'></handGroupCom>
  </div>
</template>

<script lang="ts" setup>
import { message,Modal } from "ant-design-vue";
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
    dataIndex: "action",
    key: "action",
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
  Modal.confirm({
        title: "确认删除吗？",
        icon: '',
        content: "删除后不可恢复",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          http.deleteGroup({urlParams:{group:id}}).then((res:any)=>{
            if(res.code){
              groupListParams.page=1
              getGroupList()
              message.success("删除成功");
            }
          })
        },
      });
    
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
    margin-right: 8px;
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
  // height: 530px;
  // overflow-y: auto;
}
</style>
