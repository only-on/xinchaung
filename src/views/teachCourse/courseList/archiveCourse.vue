<template>
  <div class="archive-course-box">
    <a-input-search
      placeholder="请输入课程名称"
      style="width: 450px"
      @search="onSearch"
    />
    <template v-if="courseList.length">
      <div class="course-list">
        <course-card
          v-for="(item, index) in courseList"
          :key="item.id"
          :courseData="item"
          :currentTab="currentTab"
          :index="index"
        ></course-card>
      </div>

      <div class="page-box" v-if="totalCount>12">
        <a-pagination
          :default-current="1"
          :default-page-size="12"
          :total="totalCount"
          @change="pageChange"
        />
      </div>
    </template>

    <div v-else>
      <empty :text="emptyText" :type="emptyType" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs,watch } from "vue";
import { getCourseListApi } from "./api";
import courseCard from "./courseCard.vue";
import empty from "src/components/Empty.vue";
type TreactiveData = {
  params: {
    directions: string;
    category: string;
    name: string;
    page: number;
    limit: number;
    direction: string;
    state: number;
  };
  courseList: any[];
  totalCount: number;
  emptyText: string;
  emptyType: 'empty' | 'searchEmpty' | 'tableEmpty' | 'tableSearchEmpty';
};
export default defineComponent({
  components: {
    "course-card": courseCard,
    empty,
  },
  props: ["currentTab"],
  setup(props) {
    const currentTab = props.currentTab;
    const reactiveData: TreactiveData = reactive({
      params: {
        directions: "",
        category: "",
        name: "",
        page: 1,
        limit: 12,
        direction: "",
        state: 3,
      },
      courseList: [],
      totalCount: 0,
      emptyText: "暂无数据。",
      emptyType: "empty",
    });
     watch(
      () => reactiveData.params,
      () => {
        if (
          reactiveData.params.name
        ) {
          (reactiveData.emptyType = "searchEmpty");
            (reactiveData.emptyText =
              "暂未搜到相关数据");
        }
      },
      { deep: true, immediate: true }
    );
    onMounted(() => {
      init();
    });
    function init() {
      reactiveData.params = {
        directions: "",
        category: "",
        name: "",
        page: 1,
        limit: 12,
        direction: "",
        state: 3,
      };
      getCourseList();
    }
    // 获取课程列表
    function getCourseList() {
      getCourseListApi(reactiveData.params).then((res: any) => {
        reactiveData.courseList = res?.data.list;
        reactiveData.totalCount = res?.data.page.totalCount;
      });
    }

    // 搜索
    function onSearch(val: any) {
      reactiveData.params.name = val;
      reactiveData.params.page = 1;
      reactiveData.params.limit = 12;
      getCourseList();
    }
    // page发生变化时
    function pageChange(page: number, pageSize: number) {
      reactiveData.params.page = page;
      reactiveData.params.limit = pageSize;
      getCourseList();
    }
    return {
      ...toRefs(reactiveData),
      onSearch,
      currentTab,
      init,
      pageChange,
    };
  },
});
</script>

<style lang="less">
.archive-course-box {
  .course-list {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
  }
  .page-box {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
