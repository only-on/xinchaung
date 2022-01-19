<template>
  <div class="selectStuClass">
    <a-modal
      width="1000px"
      :title="selectvalue === 1 ? '学生选择' : '班级选择'"
      :visible="isvisible"
      :confirm-loading="confirmLoading"
      :footer="null"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div>
        <div>
          <a-form layout="inline" class="searchContent">
            <div class="stuSearch" v-if="selectvalue === 1">
              <a-form-item>
                <a-input
                  style="width: 150px"
                  @keyup.enter="inquiry"
                  v-model:value="studentValue"
                  placeholder="学号"
                >
                 <template #prefix>
              <img src="src/assets/images/screenicon/Group7.png" /> </template>
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-input
                  style="width: 150px"
                  @keyup.enter="inquiry"
                  v-model:value="fullName"
                  placeholder="姓名"
                >
               <template #prefix><img src="src/assets/images/screenicon/Group6.png" /> </template>
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-input
                  style="width: 150px"
                  @keyup.enter="inquiry"
                  v-model:value="faculty"
                  placeholder="院系"

                >
               <template #prefix><img src="src/assets/images/screenicon/Group8.png" /> </template>
                </a-input>
              </a-form-item>
            </div>
            <div class="classSearch" v-else>
              <a-form-item>
                <a-input
                  style="width: 150px"
                  @keyup.enter="inquiry"
                  v-model:value="classes"
                  placeholder="班级"
                >
               <template #prefix><img src="src/assets/images/screenicon/Group8.png" /> </template>
                </a-input>
              </a-form-item>
            </div>
            <div class="operateBtn">
              <a-button class="add" type="primary" @click="addittion">添加</a-button>
              <a-button class="clear" type="primary" @click="clearAll">清空</a-button>
              <a-button type="primary" @click="inquiry">查询</a-button>
            </div>
          </a-form>
        </div>
        <a-config-provider>
          <a-table
            :columns="columns"
            :loading="unselectLoading"
            :data-source="unSelectData.list"
            :pagination="
              unSelectData?.page?.totalCount > 10
                ? {
                    hideOnSinglePage: false,
                    showSizeChanger: true,
                    total:unSelectData.page.totalCount,
                    pageSize: params.limit,
                    current:params.page,
                    onChange: onChange,
                    onShowSizeChange: onShowSizeChange,
                  }
                : false
            "
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
              getCheckboxProps: getCheckboxProps,
            }"
            rowKey="id"
          >
            <template #name="{ record }">
              <div>{{ record.user_profile.name }}</div>
            </template>
            <template #department="{ record }">
              <div>{{ record.user_profile.department }}</div>
            </template>
            <template #gender="{ record }">
              <div>{{ record.user_profile.gender }}</div>
            </template>
            <template #phone="{ record }">
              <div>{{ record.user_profile.phone }}</div>
            </template>
          </a-table>
          <template #renderEmpty>
            <div><empty type="tableEmpty"></empty></div>
          </template>
        </a-config-provider>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
interface Istate {
  confirmLoading: boolean;
  selectClass: any[];
  selectStu: any[];
  columns: any[];
  data: any[];
  studentValue: string;
  fullName: string;
  faculty: string;
  classes: string;
  selectedRows: any[];
  unSelectKeys: any[];
  selectedRowKeys: any[];
  params:{
    limit:number,
    page:number,
  }
}
import { defineComponent, onMounted, inject, reactive, toRefs, ref, watch } from "vue";
import request from "src/api/index";
import Empty from "src/components/Empty.vue";
import test from "./test.vue";
import { message } from "ant-design-vue";
export default defineComponent({
  name: "selectStuClass",
  props: [
    "propTrainDetailInfo",
    "trainId",
    "selectvalue",
    "isvisible",
    "addids",
    "unSelectData",
    'tatal',
    "unselectLoading",
  ],
  components: {
    Empty,
  },
  setup(props, context) {
    const http = (request as any).teacherTrain;
    const state: Istate = reactive({
      confirmLoading: false,
      selectClass: [
        {
          title: "班级名称",
          dataIndex: "classname",
          align: "center",
          scopedSlots: { customRender: "classname" },
        },
        {
          title: "人数",
          dataIndex: "number",
          align: "center",
          scopedSlots: { customRender: "number" },
        },
      ],
      selectStu: [
        {
          title: "学号",
          dataIndex: "username",
          align: "left",
          ellipsis: true,
        },
        {
          title: "姓名",
          dataIndex: "name",
          ellipsis: true,
          slots: { customRender: "name" },
        },
        {
          title: "所属院系",
          dataIndex: "department",
          ellipsis: true,
          slots: { customRender: "department" },
        },
        {
          title: "性别",
          dataIndex: "gender",
          slots: { customRender: "gender" },
        },
        {
          title: "邮箱",
          dataIndex: "email",
          align: "center",
          ellipsis: true,
        },
        {
          title: "电话",
          dataIndex: "phone",
          ellipsis: true,
          slots: { customRender: "phone" },
        },
      ],
      columns: [],
      data: [],
      studentValue: "",
      fullName: "",
      faculty: "",
      classes: "",
      selectedRows: [],
      unSelectKeys: [],
      selectedRowKeys: [],
      params:{
        limit:10,
        page:1,
      }
    });
    const rowSelection = {
      //    selectedRowKeys:state.selectedRows,
      onChange: (selectedRowKeys: any, selectedRows: any) => {
        state.selectedRows = selectedRows;
      },
      onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
        state.selectedRows = selectedRows;
      },
      getCheckboxProps: (record: any) => ({
        // disabled: record.selected||record.number==0,
        // defaultChecked:record.selected||record.number==0
      }),
    };
    const methods = {
       onChange(page: any, pageSize: any) {
        state.params.page = page;
        state.params.limit = pageSize;
        context.emit(
          "search-inquiry",
          state.studentValue,
          state.fullName,
          state.faculty,
          state.classes,
          state.params
        );
      },
      onShowSizeChange(current: any, size: any) {
        console.log(current, size, "current, size");
        state.params.page = 1;
        state.params.limit = size;
         context.emit(
          "search-inquiry",
          state.studentValue,
          state.fullName,
          state.faculty,
          state.classes,
          state.params
        );
      },
      onSelectChange(selectedRowKeys: any, selectedRows: any) {
        state.selectedRowKeys = selectedRowKeys;
        state.selectedRows = selectedRows;
      },
      getCheckboxProps: (record: any) => ({
        disabled: record.selected || (props.selectvalue === 2 && !record.number),
        defaultChecked: record.selected,
      }),
      handleOk() {
        context.emit("ifSelect", "ok");
      },
      handleCancel() {
        context.emit("ifSelect", "cancel");
      },
      rowkey(record: {}, index: number) {
        return index;
      },
      addittion() {
        //   添加
        console.log(state.selectedRows, "选中的数据");
        context.emit(
          "selected-rows",
          state.selectedRows,
          props.selectvalue,
          state.selectedRowKeys
        );
        state.selectedRowKeys = [];
      },
      clearAll() {
        state.studentValue = "";
        state.fullName = "";
        state.faculty = "";
        state.classes = "";
      },
      inquiry() {
        console.log(state.studentValue, state.fullName, state.faculty, state.classes);
        context.emit(
          "search-inquiry",
          state.studentValue,
          state.fullName,
          state.faculty,
          state.classes
        );
      },
    };
    watch(
      () => props.isvisible,
      (val: any) => {
        state.columns = props.selectvalue === 1 ? state.selectStu : state.selectClass;
      },
      {
        immediate: true,
      }
    );
    onMounted(() => {});
    return { ...toRefs(state), ...methods, rowSelection };
  },
});
</script>
<style lang="less" scoped>
.searchContent {
  display: flex;
  // justify-content:space-between;
}
.stuSearch {
  display: flex;
}
.operateBtn {
  display: flex;
  .add,
  .clear {
    margin-right: 20px;
  }
}
:deep(.ant-table-pagination.ant-pagination) {
  float: none;
  text-align: center;
}
</style>
