<template>
  <div class="a-teacher-list-wrap">
    <div class="top-action-wrap">
      <!-- <label> 课程名称： </label>
      <a-input v-model:value="search.course_name" class="class-name" /> -->
      <div class="inputSearch">
        <a-input
          @keyup.enter="searchFun"
          v-model:value="search.course_name"
          placeholder="请输入课程名称"
          class="input"
        >
          <template #prefix>
            <img src="src/assets/images/screenicon/Group12.png" /> </template
        ></a-input>
      </div>
      <!-- <label> 任课教师： </label>
      <a-input v-model:value="search.user_name" class="class-teacher-name" /> -->
      <div class="inputSearch">
        <a-input
          @keyup.enter="searchFun"
          v-model:value="search.user_name"
          placeholder="请输入教师名称"
          class="input"
        >
          <template #prefix>
            <img src="src/assets/images/screenicon/Group11.png" /> </template
        ></a-input>
      </div>
      <!-- <label> 课程状态： </label>
      <a-select v-model:value="search.course_state" placeholder="请选择">
        <a-select-option value="">请选择</a-select-option>
        <a-select-option value="2">未开始</a-select-option>
        <a-select-option value="3">进行中</a-select-option>
        <a-select-option value="1">已结束</a-select-option>
      </a-select> -->
      <div class="item custom_select dev_state">
        <a-select
          v-model:value="search.course_state"
          placeholder="请选择课程状态"
          @change="searchFun"
        >
          <a-select-option value="2">未开始</a-select-option>
          <a-select-option value="3">进行中</a-select-option>
          <a-select-option value="1">已结束</a-select-option>
        </a-select>
      </div>
      <a-button type="primary" @click="searchFun">查询</a-button>
      <a-button type="primary" @click="clearSearch">清空</a-button>
      <span class="action-right">
        <a-button type="primary" @click="archives">归档</a-button>
        <a-button type="primary" @click="deleteData">批量删除</a-button>
        <a-button type="primary" @click="clearVideosLog">清除录像记录</a-button>
      </span>
    </div>
    <a-config-provider>
      <a-table
        class="course-content-wrap"
        :columns="columns"
        :data-source="dataList"
        :row-selection="rowSelection"
        :pagination="false"
        :rowKey="rowKey"
      >
        <template #course_name="{ text }"
          ><span :title="text.course_name" class="a-link" @click="toDetail(text.id)">{{
            text.course_name
          }}</span></template
        >
        <template #result="{ text }"
          ><span class="a-link" @click="lookResult(text)">查看</span></template
        >
        <template #action="{ text, record }">
          <div class="action-table">
            <span class="a-link" @click="clearVideoLog(text)">清除录像记录</span>
            <span class="a-link" v-if="record.state === '已结束'" @click="toArchive(text)"
              >归档</span
            >
          </div></template
        >
      </a-table>
      <template #renderEmpty>
        <div><empty type="tableEmpty"></empty></div>
      </template>
    </a-config-provider>
      <page
        v-model:current="search.page"
        v-model:pageSize="search.limit"
        :total="total"
        @change="pageChange"
      />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  unref,
  ref,
  Ref,
  computed,
} from "vue";
import {
  getTeacherCourseListApi,
  clearVideoApi,
  updateArchiveApi,
  deleteCourseApi,
  clearVideosApi,
} from "../api";
import Empty from "src/components/Empty.vue";
import page from "src/components/page/page.vue"
import { message, Modal } from "ant-design-vue";
import { ColumnProps } from "ant-design-vue/es/table/interface";
import { useRouter } from "vue-router";
const columns = [
  {
    title: "课程名称",
    ellipsis: true,
    slots: { customRender: "course_name" },
  },
  {
    title: "任课教师",
    dataIndex: "user_name",
    ellipsis: true,
    width: 100,
  },
  {
    title: "课程状态",
    width: 100,
    dataIndex: "state",
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
    title: "操作记录总大小",
    dataIndex: "record_size",
    width: 150,
    align: "center",
  },
  {
    title: "课程成果",
    dataIndex: "id",
    align: "center",
    width: 100,
    slots: { title: "id", customRender: "result" },
  },
  {
    title: "操作",
    dataIndex: "id",
    align: "center",
    width: 200,
    slots: { title: "id", customRender: "action" },
  },
];
type TreactiveData = {
  search: {
    course_name: string;
    user_name: string;
    course_state: string|undefined;
    page: number;
    limit: number;
  };
  total: number;
  dataList: any[];
};
type Key = ColumnProps["key"];
export default defineComponent({
  components: {
    empty: Empty,
    page
  },
  setup() {
    const router = useRouter();
    const reactiveData: TreactiveData = reactive({
      search: {
        course_name: "",
        user_name: "",
        course_state:undefined,
        page: 1,
        limit: 10,
      },
      total: 0,
      dataList: [],
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
      getCourseList() {
        selectedRowKeys.value = [];
        let params = {
          "search[course_name]": reactiveData.search.course_name,
          "search[user_name]": reactiveData.search.user_name,
          "search[course_state]": reactiveData.search.course_state?reactiveData.search.course_state:'',
          page: reactiveData.search.page,
          limit: reactiveData.search.limit,
        };
        getTeacherCourseListApi(params).then((res: any) => {
          reactiveData.dataList = res.data.list;
          reactiveData.total = res.data.page.totalCount;
          reactiveData.search.page = res.data.page.currentPage;
          reactiveData.search.limit = res.data.page.perPage;
        });
      },
      searchFun() {
        method.getCourseList();
      },
      clearSearch() {
        reactiveData.search = {
          course_name: "",
          user_name: "",
          course_state:undefined,
          page: 1,
          limit: 10,
        };
        method.getCourseList();
      },
      toDetail(id: number) {
        router.push({
          path: "/admin/adminCourse/courseDetail",
          query: {
            course_id: id,
          },
        });
      },
      lookResult(id: number) {
        router.push({
          path: "/admin/adminCourse/courseResult",
          query: {
            course_id: id,
          },
        });
      },
      clearVideoLog(id: number) {
        Modal.confirm({
          title: "提示",
          content: "确定清除记录吗",
          onOk: () => {
            clearVideoApi({ course_id: id }).then((res: any) => {
              message.success("清除成功");
              method.getCourseList();
            });
          },
        });
      },
      clearVideosLog() {
        Modal.confirm({
          title: "提示",
          content: "确定清除录像吗",
          onOk: () => {
            method.clearVideos(selectedRowKeys.value);
          },
        });
      },
      clearVideos(course_ids: any[]) {
        if (course_ids.length === 0) {
          message.warn("请选择要清除录像的数据");
          return;
        }
        clearVideosApi({ course_ids: course_ids }).then((res: any) => {
          message.success("清除成功");
          method.getCourseList();
        });
      },
      archives() {
        Modal.confirm({
          title: "提示",
          content: "确定归档吗",
          onOk: () => {
            method.updateArchive(selectedRowKeys.value);
          },
        });
      },
      toArchive(id: number) {
        Modal.confirm({
          title: "提示",
          content: "确定归档吗",
          onOk: () => {
            method.updateArchive([id]);
          },
        });
      },
      updateArchive(course_ids: any[]) {
        if (course_ids.length === 0) {
          message.warn("请选择要归档的数据");
          return;
        }
        updateArchiveApi({ course_ids: course_ids }).then((res: any) => {
          message.success("归档成功");
          method.getCourseList();
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
          method.getCourseList();
        });
      },
      rowKey(row: any) {
        return row.id;
      },
      pageChange(page: number, pageSize: number) {
        reactiveData.search.page = page;
        reactiveData.search.limit = pageSize;
        method.getCourseList();
      },
    };
    onMounted(() => {
      method.getCourseList();
    });
    return {
      ...method,
      ...toRefs(reactiveData),
      columns,
      rowSelection,
    };
  },
});
</script>

<style lang="less">
.a-teacher-list-wrap {
  .top-action-wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    label {
      flex-shrink: 0;
      margin-left: 10px;
    }
    > button {
      margin-left: 10px;
    }
    .action-right {
      flex-shrink: 0;
      margin-left: auto;
      > button {
        margin-left: 5px;
      }
    }
    // .ant-select {
    //   width: 160px;
    // }
    .class-name {
      width: 160px;
    }
    .class-teacher-name {
      width: 160px;
    }
  }
  .course-content-wrap {
    margin-top: 30px;
    .action-table {
      > span {
        margin-right: 15px;
      }
    }
  }
}
.inputSearch {
  margin-right: 20px;
}
.item {
  display: flex;
  align-items: center;
  margin-right: 22px;
  .ant-select-selector {
    width: 240px;
    height: 35px;
    padding-left: 30px;
    align-items: center;
  }
  .ant-input {
    padding-left: 26px;
  }
}
.dev_state {
  .ant-select-selector::before {
    content: "";
    position: absolute;
    left: 8px;
    top: 8px;
    background: url(src/assets/images/screenicon/Group4.png) no-repeat;
    width: 17px;
    height: 17px;
  }
  .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
    padding: 0px 30px;
  }
}
</style>
