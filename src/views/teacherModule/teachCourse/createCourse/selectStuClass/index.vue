<template>
  <div class="selectStuClass">
    <a-modal
      :destroyOnClose="true"
      width="1200px"
      :title="'学生选择'"
      :visible="isVisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div>
        <div>
          <a-form layout="inline" class="searchContent">
            <div class="stuSearch">
              <a-form-item label='姓名'>
                <a-input
                  style="width: 150px"
                  @keyup.enter="inquiry"
                  v-model:value="studentValue"
                >
                </a-input>
              </a-form-item>
              <a-form-item label='班级'>
                <a-input
                  style="width: 150px"
                  @keyup.enter="inquiry"
                  v-model:value="classes"
                >
                </a-input>
              </a-form-item>
              <a-form-item label="年级">
                <a-input v-model:value='grade' @keyup.enter="inquiry"></a-input>
              </a-form-item>
              <a-form-item label="专业">
                <a-input
                  style="width: 150px"
                  @keyup.enter="inquiry"
                  v-model:value="faculty"
                >
                </a-input>
              </a-form-item>
            </div>
            <!-- <div class="operateBtn">
              <a-button class="clear" type="primary" @click="clearAll">清空</a-button>
              <a-button type="primary" @click="inquiry">查询</a-button>
            </div> -->
          </a-form>
        </div>
        <a-config-provider>
          <a-table
            :columns="columns"
            :loading="unselectLoading"
            :data-source="studentData.list"
            :pagination="{
                    hideOnSinglePage: false,
                    showSizeChanger: false,
                    total:studentData.total,
                    pageSize: studentData.limit,
                    current: studentData.page,
                    onChange: onChange,
                    onShowSizeChange: onShowSizeChange,
                  }"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
              getCheckboxProps: getCheckboxProps,
            }"
            rowKey="id"
            :scroll="studentData.list.length>10?{ y: 560 }:{}"
          >
            <!-- <template #name="{ record }">
              <div>{{ record.user_profile?.name }}</div>
            </template>
            <template #department="{ record }">
              <div>{{ record.user_profile?.department }}</div>
            </template> -->
          </a-table>
          <template #renderEmpty>
            <div><empty type="tableEmpty"></empty></div>
          </template>
        </a-config-provider>
      </div>
      <template #footer>
        <Submit @submit="addittion()" @cancel="handleCancel()"></Submit>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts">
import Submit from "src/components/submit/index.vue";
interface Istate {
  confirmLoading: boolean;
  columns: any[];
  data: any[];
  studentValue: string;
  fullName: string;
  faculty: string;
  grade:string;
  classes: string;
  selectedRows: any[];
  unSelectKeys: any[];
  selectedRowKeys: any[];
  params: {
    limit: number;
    page: number;
  };
  studentData:any
}
import { defineComponent, onMounted, inject, reactive, toRefs, ref, watch } from "vue";
import request from "src/api/index";
import { message } from "ant-design-vue";
export default defineComponent({
  name: "selectStuClass",
  props: [
    "propTrainDetailInfo",
    "trainId",
    "isVisible",
    "addids",
    "unSelectData",
    "tatal",
    "unselectLoading",
    'courseId'
  ],
  components: {
    Submit,
  },
  setup(props, context) {
    const http = (request as any).teachCourse;
    const state: Istate = reactive({
      confirmLoading: false,
      columns: [
      {
    title: "账号",
    dataIndex: "username",
    key: "username",
    width:100,
    ellipsis: true,
  },
  {
    title: "姓名",
    dataIndex: "user_profile.name",
    key: "user_profile.name",
    width:100,
    ellipsis: true,
  },
  {
    title: "性别",
    dataIndex: "user_profile.gender",
    key: "user_profile.gender",
  },
  {
    title: "班级",
    dataIndex: "user_profile.class",
    key: "user_profile.class",
  },
  {
    title: "年级",
    dataIndex: "user_profile.grade",
    key: "user_profile.grade",
    width:100,
    ellipsis: true,
  },
  {
    title: "专业",
    dataIndex: "user_profile.major",
    key: "user_profile.major",
    width:120,
    ellipsis: true,
  },
  {
    title: "学院",
    dataIndex: "user_profile.department",
    key: "user_profile.department",
    width:120,
    ellipsis: true,
  },
  {
    title: "邮箱",
    dataIndex: "email",
    key: "email",
    width:150,
    ellipsis: true,
  },
  {
    title: "电话",
    dataIndex: "user_profile.phone",
    key: "user_profile.phone",
    width:150,
    ellipsis: true,
  },
      ],
      data: [],
      studentValue: "",
      fullName: "",
      grade:'',
      faculty: "",
      classes: "",
      selectedRows: [],
      unSelectKeys: [],
      selectedRowKeys: [],
      params: {
        limit: 10,
        page: 1,
      },
      studentData:{
        page:1,
        limit:10,
        selectedRowKeys:[],
        StuDeleteid:[],
        list:[],
        total:0,
        loading:false,
      }
    });
    const rowSelection = {
      //    selectedRowKeys:state.selectedRows,
      onChange: (selectedRowKeys: any, selectedRows: any) => {
        state.selectedRows = selectedRows;
      },
      onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
        state.selectedRows = selectedRows;
      }
    };
    const methods = {
      onChange(page: any, pageSize: any) {
        state.studentData.page = page;
        // state.studentData.limit = pageSize;
        initData()
      },
      onShowSizeChange(current: any, size: any) {
        console.log(current, size, "current, size");
        state.studentData.page = 1;
      },
      onSelectChange(selectedRowKeys: any, selectedRows: any) {
        state.selectedRowKeys = selectedRowKeys;
        state.selectedRows = selectedRows;
      },
      getCheckboxProps: (record: any) => ({
        disabled: record.selected,
        defaultChecked: record.selected,
      }),
      handleOk() {
        context.emit("cancelSelectStu");
      },
      handleCancel() {
        methods.clearAll();
        context.emit("cancelSelectStu");
      },
      rowkey(record: {}, index: number) {
        return index;
      },
      addittion() {
        //   添加
        console.log(state.selectedRowKeys, "选中的数据");
        // context.emit(
        //   "selected-rows",
        //   state.selectedRows,
        //   state.selectedRowKeys
        // );
        // state.selectedRowKeys = [];
        if (!state.selectedRowKeys.length) {
          message.warning('请选择需要添加的学生')
          return
        }
        let obj={
          id:props.courseId,
          student_id:state.selectedRowKeys,
          type:1,
        }
         http.saveCourseStudentt({param:{...obj}}).then((res:any)=>{
          message.success("保存成功");
          context.emit("cancelSelectStu");
          context.emit("init");
        })
      },
      clearAll() {
        state.studentValue = "";
        state.fullName = "";
        state.faculty = "";
        state.classes = "";
      },
      inquiry() {
        state.studentData.page = 1;
        console.log(state.studentValue, state.fullName, state.faculty, state.classes);
        initData()
      },
    };
    const initData=()=>{
      let obj={
        type:1,
        id:props.courseId,
        page:state.studentData.page,
        limit:state.studentData.limit,
        withs:'userProfile,user',
        name:state.studentValue,
        class:state.classes,
        grade:state.grade,
        direct:state.faculty
      }
      state.studentData.list.length=0
      http.getAllCourseStudent({param:{...obj}}).then((res:any)=>{
        let {list,page}=res.data
        state.studentData.total=page.totalCount
        state.studentData.list.push(...list)
      })
    }
    onMounted(() => {
      initData()
    });
    return { ...toRefs(state), ...methods, rowSelection };
  },
});
</script>
<style lang="less" scoped>
.searchContent {
  display: flex;
  margin-bottom: 24px;
  // justify-content:space-between;
}
.stuSearch {
  display: flex;
}
.operateBtn {
  display: flex;
}
:deep(.ant-table-pagination.ant-pagination) {
  float: none;
  text-align: center;
}
</style>
