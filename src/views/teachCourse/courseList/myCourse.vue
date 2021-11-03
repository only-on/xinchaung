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
      <div class="crate-card course-item"></div>
      <course-card
        v-for="(item,index) in courseList"
        :key="item.id"
        :courseData="item"
        :currentTab="currentTab"
        :index="index"
        @updateData="updateData"
        @update="init"
      ></course-card>
    </div>
    <div class="page-box">
      <a-pagination :default-current="1" :default-page-size="11" :total="totalCount" @change="pageChange"/>
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

type TreactiveData={
  directionTag: any[],
      allTag: any|null,
      directionsShow: boolean,
      directionsHeight:number,
      params: {
        directions: string,
        category: string,
        name: string,
        page: number,
        limit: number,
        direction: string,
      },
      courseList: any[],
      totalCount:number
}
export default defineComponent({
  components: {
    tag,
    "course-card": courseCard,
  },
  props: ["currentTab"],
  setup(props) {
    const currentTab = props.currentTab;
    const reactiveData:TreactiveData = reactive({
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
      },
      courseList: [],
      totalCount:0
    });

    onMounted(() => {
      getCourseList();
      // setTimeout(()=>{
      //   console.log(111111111)
      //   reactiveData.courseList=[]
      // },5000)
    });

    function init() {
       reactiveData.params= {
        directions: "",
        category: "",
        name: "",
        page: 1,
        limit: 11,
        direction: "",
      }
      getCourseList()
    }
    function onSearch() {}
    // tag选择
    function tagChange(tags: any) {
      console.log(tags);
    }

    
    // 获取课程列表
    function getCourseList() {
      getCourseListApi(reactiveData.params).then((res) => {
        console.log(res);
        reactiveData.courseList = res?.data.list;
        reactiveData.totalCount=res?.data.page.totalCount
      });
    }

    // page发生变化时
    function pageChange(page:number, pageSize:number) {
      reactiveData.params.page=page
      reactiveData.params.limit=pageSize
      getCourseList()
    }
    // 更新数据
    function updateData(val:any,index:number) {
      reactiveData.courseList[index]=val
    }
    // 设置参数
    return {
      onSearch,
      ...toRefs(reactiveData),
      tagChange,
      currentTab,
      updateData,
      init,
      pageChange
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
  }
  .page-box{
    margin-top: 20px;
    text-align: center;
  }
}
</style>
