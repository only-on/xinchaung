<template>
  <div class="recommend-course">
    <div class="components-title">推荐课程</div>
    <div class="course-list">
      <div class="list" v-for="item in courseList" :key="item.id">
        <div class="left">
          <img :src="item.url" alt="" srcset="" />
        </div>
        <div class="right">
          <span class="name">{{ item.name }}</span>
          <span class="study_num">{{ item.learned_count }}人在学</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  watch,
  toRefs,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
const http = (request as any).teachCourse;
export default defineComponent({
  name: "RecommendCourse",
  setup: (props, { emit }) => {
    interface ICourseList {
      id: number
      name: string
      learned_count: number
      url: string
    }
    let courseList = reactive<ICourseList[]>([]);
    const getRecommendList = () => {
      courseList.length = 0
      http.hotCourseRecommend().then((res: IBusinessResp) => {
        const data = res.data
        courseList.push(...data)
      })
    }
    onMounted(() => {
      getRecommendList()
    })
    return {
      courseList,
    };
  },
});
</script>

<style scoped lang="less">
.recommend-course {
  margin-top: 40px;
  .course-list {
    margin-top: 4px;
    .list {
      margin: 12px 0;
      display: flex;
      justify-content: space-around;
      .left {
        width: 70px;
        height: 50px;
        background-color: var(--primary-3);
        margin-right: 6px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .name {
          color: var(--black-65);
        }
        .study_num {
          color: var(--black-45);
        }
      }
    }
  }
}
</style>
