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
    <div class="course-list">
      <div class="crate-card course-item create-box">
        <div class="create-btn" @click="create">
          <span class="icon-chuangjian iconfont"></span
          ><span class="create-text">创建课程</span>
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
    <div class="page-box">
      <a-pagination
        :default-current="1"
        :default-page-size="11"
        :total="totalCount"
        @change="pageChange"
      />
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
import {useRouter} from "vue-router"

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
};
export default defineComponent({
  components: {
    tag,
    "course-card": courseCard,
  },
  props: ["currentTab"],
  setup(props) {
    const router = useRouter()
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
    });

    onMounted(() => {
      init();
      // setTimeout(()=>{
      //   console.log(111111111)
      //   reactiveData.courseList=[]
      // },5000)
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
    function onSearch(val:any) {
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
      getCourseListApi(reactiveData.params).then((res) => {
     
        reactiveData.courseList = res?.data.list;
        reactiveData.totalCount = res?.data.page.totalCount;
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
        path:"/teacher/course/create"
      })
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
      create
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
      border: 1px dashed @theme-color;
      border-radius: 11px;
      box-shadow: 0 2px 4px 0 rgb(164 36 167 / 14%);
      .create-btn {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .icon-chuangjian {
          font-size: 67px;
          color: @theme-color;
        }
        .create-text {
          font-size: 20px;
          color: @theme-color;
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
