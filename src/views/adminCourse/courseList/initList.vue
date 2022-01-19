<template>
  <div class="a-init-course-list-wrap">
    <div class="action-top">
      <!-- <a-input-search
        v-model:value="params.course_name"
        placeholder="请输入查询关键字"
        size="large"
        @search="onSearch"
        enter-button="查询"
      >
      </a-input-search> -->
      <a-input
        @keyup.enter="onSearch"
        v-model:value="params.course_name"
        placeholder="请输入查询关键字"
        class="input"
      >
        <template #prefix> <span class="iconfont icon-sousuo"></span> </template
      ></a-input>
    </div>
    <a-config-provider>
      <a-table
        class="course-content-wrap"
        :columns="columns"
        :data-source="dataList"
        :pagination="false"
        :rowKey="rowKey"
      >
        <template #result="{ text }"
          ><span class="a-link" @click="toDetail(text, 'experiment')"
            >查看</span
          ></template
        >
        <template #action="{ text }">
          <span class="a-link" @click="toDetail(text, 'resource')">查看</span>
        </template>
      </a-table>
      <template #renderEmpty>
        <div><empty type="tableEmpty"></empty></div>
      </template>
    </a-config-provider>
      <page
        :isShowNum="10"
        v-model:current="params.page"
        v-model:pageSize="params.limit"
        :total="total"
        @change="pageChange"
      />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { getInitCourseListApi } from "../api";
import Empty from "src/components/Empty.vue";
import { useRouter } from "vue-router";
import page from "src/components/page/page.vue"
const columns = [
  {
    title: "课程名称",
    ellipsis: true,
    dataIndex: "course_name",
  },
  {
    title: "实验数",
    dataIndex: "contents_count",
    width: 100,
  },
  {
    title: "课时数",
    width: 100,
    dataIndex: "classes_count",
  },
  {
    title: "课程实验",
    dataIndex: "id",
    align: "center",
    slots: { title: "id", customRender: "result" },
  },
  {
    title: "课程资源",
    dataIndex: "id",
    align: "center",
    width: 200,
    slots: { title: "id", customRender: "action" },
  },
];
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
        page: 1,
        limit: 10,
      },
      dataList: [],
      total: 0,
    });
    const method = {
      onSearch() {
        method.getDataList();
      },
      getDataList() {
        let params = {
          "search[course_name]": reactiveData.params.course_name,
          page: reactiveData.params.page,
          limit: reactiveData.params.limit,
        };
        getInitCourseListApi(params).then((res: any) => {
          reactiveData.dataList = res.data.list;
          reactiveData.total = res.data.page.totalCount;
          reactiveData.params.page = res.data.page.currentPage;
          reactiveData.params.limit = res.data.page.perPage;
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
      toDetail(id: number, type: string) {
        router.push({
          path: "/admin/adminCourse/courseDetail",
          query: {
            course_id: id,
            type: type,
          },
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
    };
  },
});
</script>

<style lang="less">
.a-init-course-list-wrap {
  .action-top {
    margin-bottom: 30px;
    .ant-input-search {
      width: 600px;
    }
  }
  .input {
    width: 314px;
  }
  .iconfont {
    color: rgba(0, 0, 0, 0.25);
  }
}
</style>
