<template>
  <div class="recommend-course">
    <div class="components-title">推荐课程</div>
    <div class="course-list">
      <div class="list" v-for="item in courseList" :key="item.id">
        <div class="left">
          <img :src="item.src" alt="" srcset="">
        </div>
        <div class="right">
          <span class="name">{{item.name}}</span>
          <span class="study_num">{{item.num}}人在学</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, Ref, inject, watch, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router';
export default defineComponent({
  name: 'RecommendCourse',
	props: {},
  setup: (props, { emit }) => {
    let courseList = reactive([
      {id: 1, name: 'Python3 机器学习', num: 124, src: ''},
      {id: 1, name: 'Python3 机器学习', num: 124, src: ''},
      {id: 1, name: 'Python3 机器学习', num: 124, src: ''},
      {id: 1, name: 'Python3 机器学习', num: 124, src: ''},
      {id: 1, name: 'Python3 机器学习', num: 124, src: ''},
    ])
    return {
      courseList
    }
  }
})
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
        background-color: var(--purpleblue-3);
        margin-right: 6px;
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