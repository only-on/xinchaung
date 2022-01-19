<template>
  <div class="course-list-box">
    <div>
      <a-input-search
        placeholder="请输入课程名称"
        style="width: 450px"
        @search="onSearch"
      />
      <tag @tagChange="tagChange"></tag>
    </div>
    
    <div v-if="spinning" style="text-align: center;">
      <a-spin :spinning="spinning"></a-spin>
    </div>
    <template v-if="courseList.length >0">
      <div class="course-list">
        <div class="crate-card course-item create-box">
          <div class="create-btn" @click="create">
            <img :src="createImg" alt="创建课程">
            <span class="create-text">创建课程</span>
          </div>
        </div>
        <course-card
          v-for="(item, index) in courseList"
          :key="item.id"
          :courseData="item"
          :currentTab="currentTab"
          :index="index"
          @updateData="updateData"
          @update="init"
        ></course-card>
      </div>
      <div class="page-box" v-if="totalCount>11">
        <a-pagination
          :default-current="1"
          :default-page-size="11"
          :total="totalCount"
          @change="pageChange"
        />
      </div>
    </template>

    <div v-else>
      <empty :text="emptyText" :type="emptyType" />
      <div style="text-align:center;margin-top:30px">
        <a-button type="primary" @click="create">创建课程</a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  toRefs,
  computed,
  watch,
} from "vue";
import tag from "./tag.vue";
import courseCard from "./courseCard.vue";
import { getCourseListApi } from "./api";
import { useRouter } from "vue-router";
import empty from "src/components/Empty.vue";
import createImg from "src/assets/images/Experimental/createdTrain.png"
type TreactiveData = {
  directionTag: any[];
  allTag: any | null;
  directionsShow: boolean;
  directionsHeight: number;
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
  spinning:boolean
};
export default defineComponent({
  components: {
    tag,
    "course-card": courseCard,
    empty,
  },
  props: ["currentTab"],
  setup(props) {
    const router = useRouter();
    const currentTab = props.currentTab;
    const reactiveData: TreactiveData = reactive({
      directionTag: [{}],
      allTag: null,
      directionsShow: true,
      directionsHeight: 0,
      params: {
        directions: "",
        category: "",
        name: "",
        page: 1,
        limit: 11,
        direction: "",
        state: 1,
      },
      courseList: [],
      totalCount: 0,
      emptyText: "您还未创建课程，可点击下方按钮进行创建。",
      emptyType: "empty",
      spinning:true
    });

    watch(
      () => reactiveData.params,
      () => {
        if (
          reactiveData.params.directions ||
          reactiveData.params.category ||
          reactiveData.params.name
        ) {
          (reactiveData.emptyType = "searchEmpty");
            (reactiveData.emptyText =
              "暂未搜到相关数据，可点击下方按钮创建您需要的课程。");
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
        limit: 11,
        direction: "",
        state: 1,
      };
      getCourseList();
    }
    function onSearch(val: any) {
      reactiveData.params.name = val;
      reactiveData.params.page = 1;
      reactiveData.params.limit = 12;
      getCourseList();
    }
    // tag选择
    function tagChange(tags: any) {
      reactiveData.params.direction = tags.directions;
      reactiveData.params.category = tags.category;
      getCourseList();
    }

    // 获取课程列表
    function getCourseList() {
      reactiveData.spinning=true
      getCourseListApi(reactiveData.params).then((res) => {
        reactiveData.courseList = res?.data.list;
        reactiveData.totalCount = res?.data.page.totalCount;
        reactiveData.spinning=false
      });
    }

    // page发生变化时
    function pageChange(page: number, pageSize: number) {
      reactiveData.params.page = page;
      reactiveData.params.limit = pageSize;
      getCourseList();
    }
    // 更新数据
    function updateData(val: any, index: number) {
      reactiveData.courseList[index] = val;
    }
    // 跳转到创建页面
    function create() {
      router.push({
        path: "/teacher/teacherCourse/create",
      });
    }
    // 设置参数
    return {
      onSearch,
      ...toRefs(reactiveData),
      tagChange,
      currentTab,
      updateData,
      init,
      pageChange,
      create,
      createImg
    };
  },
});
</script>

<style lang="less">
.course-list-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  .course-list {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    .create-box {
      // border: 1px dashed var(--purpleblue-6);
      // border-radius: 11px;
      // box-shadow: 0 2px 4px 0 rgb(164 36 167 / 14%);
      .create-btn {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px dashed var(--purpleblue-6);
        border-radius: 11px;
        box-shadow: 0 2px 4px 0 rgb(164 36 167 / 14%);
        .icon-chuangjian {
          font-size: 67px;
          color: var(--purpleblue-6);
        }
        .create-text {
          font-size: 20px;
          color: var(--purpleblue-6);
          margin-top: 10px;
        }
      }
    }
  }
  .page-box {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
