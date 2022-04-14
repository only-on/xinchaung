<template>
  <div class="selectStuClass">
    <a-modal
      width="1000px"
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
              <a-form-item>
                <a-input
                  style="width: 150px"
                  @keyup.enter="inquiry"
                  v-model:value="studentValue"
                  placeholder="姓名"
                >
                  <template #prefix>
                    <img src="src/assets/images/screenicon/Group7.png" />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-input
                  style="width: 150px"
                  @keyup.enter="inquiry"
                  v-model:value="fullName"
                  placeholder="班级"
                >
                  <template #prefix
                    ><img src="src/assets/images/screenicon/Group6.png" />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-input
                  style="width: 150px"
                  @keyup.enter="inquiry"
                  v-model:value="faculty"
                  placeholder="专业"
                >
                  <template #prefix
                    ><img src="src/assets/images/screenicon/Group8.png" />
                  </template>
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
            :data-source="unSelectData.list"
            :pagination="
              unSelectData?.page?.totalCount > 10
                ? {
                    hideOnSinglePage: false,
                    showSizeChanger: true,
                    total: unSelectData.page.totalCount,
                    pageSize: params.limit,
                    current: params.page,
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
            :scroll="unSelectData?.list?.length>10?{ y: 560 }:{}"
          >
            <template #name="{ record }">
              <div>{{ record.user_profile?.name }}</div>
            </template>
            <template #department="{ record }">
              <div>{{ record.user_profile?.department }}</div>
            </template>
            <template #gender="{ record }">
              <div>{{ record.user_profile?.gender }}</div>
            </template>
            <template #phone="{ record }">
              <div>{{ record.user_profile?.phone }}</div>
            </template>
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
  classes: string;
  selectedRows: any[];
  unSelectKeys: any[];
  selectedRowKeys: any[];
  params: {
    limit: number;
    page: number;
  };
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
  ],
  components: {
    Submit,
  },
  setup(props, context) {
    const http = (request as any).teacherTrain;
    const state: Istate = reactive({
      confirmLoading: false,
      columns: [
        {
          title: "账号",
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
          title: "性别",
          dataIndex: "gender",
          slots: { customRender: "gender" },
          width: 80,
        },
        {
          title: "班级",
          dataIndex: "username",
          align: "left",
          ellipsis: true,
        },
        {
          title: "专业",
          dataIndex: "username",
          align: "left",
          ellipsis: true,
        },
        {
          title: "学院",
          dataIndex: "user_profile.department",
          ellipsis: true,
          // slots: { customRender: "department" },
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
      data: [],
      studentValue: "",
      fullName: "",
      faculty: "",
      classes: "",
      selectedRows: [],
      unSelectKeys: [],
      selectedRowKeys: [],
      params: {
        limit: 10,
        page: 1,
      },
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
          state.params,
          state.params.page,
          state.params.limit
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
          state.params,
          state.params.page,
          state.params.limit
        );
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
        context.emit("ifSelect", "ok");
      },
      handleCancel() {
        methods.clearAll();
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
          state.selectedRowKeys
        );
        state.selectedRowKeys = [];
      },
      clearAll() {
        state.studentValue = "";
        state.fullName = "";
        state.faculty = "";
        state.classes = "";
        context.emit(
          "search-inquiry",
          state.studentValue,
          state.fullName,
          state.faculty,
          state.classes,
          state.params,
          state.params.page,
          state.params.limit
        );
      },
      inquiry() {
        state.params.page = 1;
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
    onMounted(() => {});
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
