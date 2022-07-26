<template>
  <div class="customerInfor">
    <div class="stuAndclass">
      <div class="operateBtn">
        <a-button type="primary" class="choice" @click="selectStuClassFn()">添加学生</a-button>
        <a-button type="primary" @click="deleteScheduleStuMany()">删除学生</a-button>
      </div>
      <div>
        <a-config-provider>
          <a-table
            :columns="columns"
            :data-source="studentData.list"
            :pagination="
              total > 10
                ? {
                    hideOnSinglePage: false,
                    total: total,
                    pageSize: studentData.limit,
                    current: studentData.page,
                    onChange: onChange,
                  }
                : false
            "
            :row-selection="{
              selectedRowKeys: studentData.selectedRowKeys,
              onChange: onSelectChange,
            }"
            rowKey="id"
          >
            <template #username="{ record }">
              <div class="single_ellipsis" :title="record.user?.username">{{ record.user?.username }}</div>
            </template>
            <template #name="{ record }">
              <div class="single_ellipsis" :title="record.userProfile?.name">{{ record.userProfile?.name }}</div>
            </template>
            <template #gender="{ record }">
              <div>{{ record.userProfile?.gender }}</div>
            </template>
            <template #major="{ record }">
              <div class="single_ellipsis" :title="record.userProfile?.major">{{ record.userProfile?.major }}</div>
            </template>
            <template #department="{ record }">
              <div class="single_ellipsis" :title="record.userProfile?.department">{{ record.userProfile?.department }}</div>
            </template>
            <template #phone="{ record }">
              <div class="single_ellipsis" :title="record.userProfile?.phone">{{ record.userProfile?.phone }}</div>
            </template>
            <template #email="{ record }">
              <div  class="single_ellipsis" :title="record.user?.email">{{ record.user?.email }}</div>
            </template>
            <template #stuaction="{ record }">
              <div class="action">
                <span class="spanleft iconfont" @click.stop="removeStudent(record.id)">删除</span>
                <span class="spanleft iconfont" @click.stop="initPassword(record.id)">初始化密码</span>
              </div>
            </template>
          </a-table>
          <template #renderEmpty>
            <div><Empty type="tableEmpty" /></div>
          </template>
        </a-config-provider>
      </div>
      <div>
        <addStudent :visable='isVisible' :courseId='props.courseId' @updateSelectStuVisable="updateSelectStuVisable" :type='1'></addStudent>
      </div>
      <!-- <template #stuaction="{ record }">
              <div class="action">
                <span class="spanleft iconfont" @click.stop="removeStudent(record.id)">删除</span>
                <span class="spanleft iconfont" @click.stop="initPassword(record.id)">初始化密码</span>
              </div>
            </template> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, onMounted, inject, reactive, Ref, ref, watch } from "vue";
import request from "src/api/index";
import Empty from "src/components/Empty.vue";
import addStudent from '../../component/common/addStudent/index.vue';
import { message, Modal } from "ant-design-vue";
import { ColumnProps } from "ant-design-vue/es/table/interface";
const http = (request as any).teachCourse;
interface Props {
  courseId:number
}
const props = withDefaults(defineProps<Props>(), {
  courseId:0
});
const columns= [
        {
          title: "学号",
          dataIndex: "username",
          align: "left",
          ellipsis: true,
          slots: { customRender: "username" },
        },
        {
          title: "姓名",
          dataIndex: "name",
          ellipsis: true,
          slots: { customRender: "name" },
        },
        {
          title: "性别",
          dataIndex: "gender",
          slots: { customRender: "gender" },
          width: 80,
        },
        {
          title: "班级",
          dataIndex: "classes",
          align: "left",
          ellipsis: true,
        },
        {
          title: "年级",
          dataIndex: "userProfile.grade",
          align: "left",
          ellipsis: true,
        },
        {
          title: "专业",
          dataIndex: "major",
          slots: { customRender: "major" },
          align: "left",
          ellipsis: true,
        },
        {
          title: "学院",
          dataIndex: "department",
          ellipsis: true,
          slots: { customRender: "department" },
        },
        {
          title: "邮箱",
          dataIndex: "email",
          align: "center",
          ellipsis: true,
          slots: { customRender: "email" },
        },
        {
          title: "电话",
          dataIndex: "phone",
          ellipsis: true,
          slots: { customRender: "phone" },
        },
        {
          title: "操作",
          dataIndex: "stuaction",
          align: "center",
          slots: { customRender: "stuaction" },
          width:200
        },
      ]
var isVisible:Ref<boolean>=ref(false)
const selectStuClassFn=()=>{
  isVisible.value=true
}
const cancelSelectStu=()=>{
  isVisible.value=false
  // initData()
}
const updateSelectStuVisable=(value: any,studentids:any)=>{
  console.log(value,'value')
  if(value==='ok'){
    if (!studentids.length) {
          message.warning('请选择需要添加的学生')
          return
    }else{
      let obj={
          id:props.courseId,
          student_id:studentids,
            type:1,
      }
        http.saveCourseStudentt({param:{...obj}}).then((res:any)=>{
              message.success("保存成功");
              isVisible.value=false
              initData()
            })
      }
    }else{
      isVisible.value=false
    }
}
type Key = ColumnProps["key"];
interface IStudentData{
  selectedRowKeys: any[];
  list:any[],
  page:number,
  limit:number
}
var studentData:IStudentData=reactive({
  page:1,
  limit:10,
  selectedRowKeys:[],
  // StuDeleteid:[],
  list:[]
})
var total:Ref<number>=ref(0)
 // 学生排课移除
const removeStudent=(id: any) =>{
  http.deleteScheduleStu({ urlParams: { id: id } }).then((res: any) => {
    message.success("删除成功");
    initData()
  });
}
 // 初始化
const initPassword=(id: any) =>{
  http.resetPassWord({ param: { schedule_id: id } }).then((res: any) => {
    message.success("重置密码成功！");
    initData()
  });
}
const onSelectChange=(selectedRowKeys: Key[], selectedRows: Key[])=> {
  studentData.selectedRowKeys = selectedRowKeys; // 不去分别分页的弹窗已选ids
  // state.selectedRows = selectedRows; // 弹窗当前页已选 list
}
const deleteScheduleStuMany=()=>{
  if(!studentData.selectedRowKeys.length){
    return
  }
  http.deleteScheduleStuMany({ param:{id:studentData.selectedRowKeys}}).then((res: any) => {
    message.success("删除成功！");
    initData()
  });
}

const onChange=(page: any, pageSize: any)=> {
  studentData.page=page
  initData()
}
function initData(){
  let obj={
    type:1,
    id:props.courseId,
    page:studentData.page,
    limit:studentData.limit,
    withs:'userProfile,user'
  }
  studentData.list.length=0
  http.getCourseStudent({param:{...obj}}).then((res:any)=>{
    let {list,page}=res.data
    total.value=page.totalCount
    // list.map((v:any)=>{
      
    // })
    studentData.list.push(...list)
  })
}       
onMounted(()=>{
  initData()
})
</script>
<style lang="less" scoped>
.customerInfor {
  margin: 10px;
  .stuAndclass {
    margin-top: 20px;
    .operateBtn {
      margin-bottom: 16px;
      .choice {
        margin-right: 10px;
      }
    }
    .action {
      color: var(--primary-color);
      cursor: pointer;
      span{
        margin: 0 10px;
        font-size: 14px;
      }
      // .spanleft {
      //   margin-right: 10px;
      // }
    }
  }
  .ant-table-thead > tr > th{
    background: var(--gray-4);
  }
}
:deep(.ant-table-pagination.ant-pagination) {
  float: none;
  text-align: center;
}
</style>
