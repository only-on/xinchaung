<template>
  <div class="a-archive-course-list-wrap">
    <div class="action-top">
      <!-- <label> 课程名称： </label>
      <a-input v-model:value="params.course_name" class="class-name" />
      <label> 任课教师： </label>
      <a-input v-model:value="params.user_name" class="class-teacher-name" />
      <label> 归档时间： </label> -->
      <div class="searchInput">
        <a-input
          @keyup.enter="onSearch"
          v-model:value="params.course_name"
          placeholder="请输入课程名称"
          class="input"
        >
          <template #prefix>
            <img src="src/assets/images/screenicon/Group12.png" /> </template
        ></a-input>
      </div>
      <div class="searchInput">
        <a-input
          @keyup.enter="onSearch"
          v-model:value="params.user_name"
          placeholder="请输入任课教师"
          class="input"
        >
          <template #prefix>
            <img src="src/assets/images/screenicon/Group11.png" /> </template
        ></a-input>
      </div>
      <a-date-picker placeholder="请选择归档日期" v-model:value="params.archive_time" />
      <a-button type="primary" @click="onSearch">查询</a-button>
      <a-button type="primary" @click="clearParams">清空</a-button>
      <a-button class="delete-btn" type="primary" @click="deleteData">批量删除</a-button>
    </div>
    <a-config-provider>
      <a-table
        class="course-content-wrap"
        :columns="columns"
        :data-source="dataList"
        :pagination="false"
        :rowKey="rowKey"
        :row-selection="rowSelection"
      >
        <template #course_name="{ text }">
          <span class="a-link" @click="toDetail(text.id)">{{ text.course_name }}</span>
        </template>
        <template #action="{ text }">
          <div class="table-action">
            <span class="a-link" @click="exportData(text)">导出</span>
            <span class="a-link" @click="deleteRow(text)">删除</span>
          </div>
        </template>
      </a-table>
      <template #renderEmpty>
        <div><empty type="tableEmpty"></empty></div>
      </template>
    </a-config-provider>
      <page
        v-model:current="params.page"
        v-model:pageSize="params.limit"
        :total="total"
        @change="pageChange"
      />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, computed, ref, unref } from "vue";
import { getArchiveCourseListApi, deleteCourseApi } from "../api";
import Empty from "src/components/Empty.vue";
import page from "src/components/page/page.vue"
import { useRouter } from "vue-router";
import { ColumnProps } from "ant-design-vue/es/table/interface";
import moment from "moment";
import { message, Modal } from "ant-design-vue";
import fileSaver from "file-saver";
const columns = [
  {
    title: "课程名称",
    ellipsis: true,
    slots: { customRender: "course_name" },
  },
  {
    title: "任职教师",
    dataIndex: "user_name",
    width: 100,
  },
  {
    title: "实验数",
    width: 100,
    dataIndex: "contents_count",
  },
  {
    title: "学生人数",
    dataIndex: "students_count",
  },
  {
    title: "开始时间",
    dataIndex: "start_time",
  },
  {
    title: "结束时间",
    dataIndex: "end_time",
  },
  {
    title: "归档时间",
    dataIndex: "archive_time",
  },
  {
    title: "课程资源",
    dataIndex: "id",
    align: "center",
    width: 200,
    slots: { title: "id", customRender: "action" },
  },
];

type Key = ColumnProps["key"];
export default defineComponent({
  components: {
    empty: Empty,
    page
  },
  setup() {
    const router = useRouter();
    const reactiveData = reactive({
      params: {
        course_name: "",
        user_name: "",
        archive_time: "",
        page: 1,
        limit: 10,
      },
      dataList: [],
      total: 0,
    });
    const selectedRowKeys = ref<Key[]>([]); // Check here to configure the default column

    const onSelectChange = (changableRowKeys: Key[]) => {
      selectedRowKeys.value = changableRowKeys;
    };
    const rowSelection = computed(() => {
      return {
        selectedRowKeys: unref(selectedRowKeys),
        onChange: onSelectChange,
        hideDefaultSelections: true,
      };
    });
    const method = {
      onSearch() {
        method.getDataList();
      },
      getDataList() {
        selectedRowKeys.value = [];
        let params = {
          "search[course_name]": reactiveData.params.course_name,
          "search[user_name]": reactiveData.params.user_name,
          "search[archive_time]": moment(reactiveData.params.archive_time).format(
            "YYYY-MM-DD"
          ),
          page: reactiveData.params.page,
          limit: reactiveData.params.limit,
        };
        getArchiveCourseListApi(params).then((res: any) => {
          reactiveData.dataList = res.data.list;
          reactiveData.total = res.data.page.totalCount;
          reactiveData.params.page = res.data.page.currentPage;
          reactiveData.params.limit = res.data.page.perPage;
        });
      },
      clearParams() {
        reactiveData.params = {
          course_name: "",
          user_name: "",
          archive_time: "",
          page: 1,
          limit: 10,
        };
        method.getDataList();
      },
      exportData(id: number) {
        fileSaver.saveAs(
          "/teacher-course/course-export?course_id=" + id,
          "课程详情报表.xls"
        );
      },
      deleteRow(id: number) {
        Modal.confirm({
          title: "提示",
          content: "确定删除吗",
          onOk: () => {
            method.deleteCourse([id]);
          },
        });
      },
      rowKey(row: any) {
        return row.id;
      },
      pageChange(page: number, pageSize: number) {
        reactiveData.params.page = page;
        reactiveData.params.limit = pageSize;
        method.getDataList();
      },
      toDetail(id: number) {
        router.push({
          path: "/admin/adminCourse/evalute",
          query: {
            courseId: id,
          },
        });
      },
      deleteData() {
        if (selectedRowKeys.value.length === 0) {
          message.warn("请选择要删除的数据");
          return;
        }
        Modal.confirm({
          title: "提示",
          content: "确定删除吗",
          onOk: () => {
            method.deleteCourse(selectedRowKeys.value);
          },
        });
      },
      deleteCourse(course_ids: any[]) {
        deleteCourseApi({ course_ids: course_ids }).then((res: any) => {
          message.success("删除成功");
          method.getDataList();
        });
      },
    };

    onMounted(() => {
      method.getDataList();
    });
    return {
      ...toRefs(reactiveData),
      ...method,
      columns,
      rowSelection,
    };
  },
});
</script>

<style lang="less">
.a-archive-course-list-wrap {
  .action-top {
    margin-bottom: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    .searchInput {
      margin-right: 20px;
    }
    > input {
      width: 150px;
      margin-right: 15px;
    }
    > button {
      margin-left: 15px;
      &.delete-btn {
        margin-left: auto;
      }
    }
  }
  .table-action {
    > span {
      margin-left: 20px;
    }
  }
}
</style>
