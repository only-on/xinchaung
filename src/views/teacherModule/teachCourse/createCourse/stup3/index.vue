<template>
  <div class="customerInfor">
    <div class="stuAndclass">
      <div class="operateBtn">
        <a-button type="primary" class="choice" @click="selectStuClassFn()">添加学生</a-button>
        <a-button type="primary" @click="deleteMany()">删除学生</a-button>
      </div>
      <div>
        <a-config-provider>
          <a-table
            :columns="stuColumns"
            :data-source="studentData.list"
            :pagination="
              total > 10
                ? {
                    hideOnSinglePage: false,
                    total: total,
                    current: studentData.page,
                    pageSize: studentData.limit,
                    onChange: onChange,
                  }
                : false
            "
            :row-selection="{ selectedRowKeys: studentData.selectedRowKeys, onChange: onSelectChange, } " rowkey="id"
          >
            <template #username="{ record }">
              <div>
                {{ record.user.username }}
              </div>
            </template>
            <template #name="{ record }">
              <div>{{ record.userProfile?.name }}</div>
            </template>
            <template #department="{ record }">
              <div>{{ record.userProfile?.department }}</div>
            </template>
            <template #gender="{ record }">
              <div>{{ record.userProfile?.gender }}</div>
            </template>
            <template #phone="{ record }">
              <div>{{ record.userProfile?.phone }}</div>
            </template>
            <template #stuaction="{ record }">
              <div class="action">
                <a
                  ><span
                    class="spanleft iconfont icon-shanchu"
                    @click="removeStudent(record.id)"
                    title="删除"
                  ></span
                ></a>
                <a
                  ><span
                    @click="initPassword(record.id)"
                    class="icon-mimachushihuaicon iconfont"
                    title="初始化密码"
                  ></span
                ></a>
              </div>
            </template>
          </a-table>
          <template #renderEmpty>
            <div><Empty type="tableEmpty" /></div>
          </template>
        </a-config-provider>
      </div>
      <div>
        <selectStuClass v-if="isVisible"
          :courseId="props.courseId"
          :isVisible="isVisible"
          @cancelSelectStu="cancelSelectStu"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, onMounted, inject, reactive, Ref, ref, watch } from "vue";
import request from "src/api/index";
import Empty from "src/components/Empty.vue";
import selectStuClass from "../selectStuClass/index.vue";
import { message, Modal } from "ant-design-vue";
import { ColumnProps } from "ant-design-vue/es/table/interface";
const http = (request as any).teachCourse;
interface Props {
  courseId:number
}
const props = withDefaults(defineProps<Props>(), {
  courseId:0
});
const stuColumns= [
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
          title: "所属院系",
          dataIndex: "userProfile.department",
          ellipsis: true,
          // slots: { customRender: "department" },
        },
        {
          title: "性别",
          dataIndex: "gender",
          slots: { customRender: "gender" },
          width:80,
        },
        {
          title: "邮箱",
          dataIndex: "user.email",
          align: "center",
          ellipsis: true,
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
        },
      ]
var isVisible:Ref<boolean>=ref(false)
const selectStuClassFn=()=>{
  isVisible.value=true
}
const cancelSelectStu=()=>{
  isVisible.value=false
  initData()
}
type Key = ColumnProps["key"];
interface IStudentData{
  selectedRowKeys: Key[];
  list:any[],
  page:number,
  limit:number
}
var studentData:IStudentData=reactive({
  page:1,
  limit:10,
  selectedRowKeys:[],
  StuDeleteid:[],
  list:[]
})
var total:Ref<number>=ref(0)
 // 学生排课移除
const removeStudent=(id: any) =>{
  http.deleteScheduleStu({ urlParams: { id: id } }).then((res: any) => {
    message.success("移除成功");
    // methods.getStudentList();
  });
}
 // 初始化
const initPassword=(id: any) =>{
  http.resetPassWord({ param: { schedule_id: id } }).then((res: any) => {
    message.success("重置密码成功！");
  });
}
const onSelectChange=(selectedRowKeys: Key[], selectedRows: Key[])=> {
  studentData.selectedRowKeys = selectedRowKeys; // 不去分别分页的弹窗已选ids
  // state.selectedRows = selectedRows; // 弹窗当前页已选 list
}
const deleteMany=()=>{

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
  }
  studentData.list.length=0
  http.getCourseStudent({param:{...obj}}).then((res:any)=>{
    let {list,page}=res.data
    total.value=page.totalCount
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
      color: var(--purpleblue-6);
      cursor: pointer;

      .spanleft {
        margin-right: 10px;
      }
    }
  }
}
:deep(.ant-table-pagination.ant-pagination) {
  float: none;
  text-align: center;
}
</style>
