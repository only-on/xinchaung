<template>
  <div id="CourseAchievement">
    <div class="searchInput">
      <a-input-search
        class="inputStyle"
        placeholder="请输入课程名称关键字查询"
        @keyup.enter="onSearch"
        @search="onSearch"
      />
    </div>
    <div v-if="courseDataList.length" class="content-list">
      <div class="itemlist" v-for="(item, index) in courseDataList" :key="index">
        <div class="card-pic">
          <!-- <img src="../../../assets/images/stuAchievement/d3.jpg" alt=""> -->
          <img :src="item.url" alt="" />
        </div>
        <div class="card-mask" @click="lookScore(item.id)">
          <div class="state-desc">{{ item.name }}</div>
        </div>
        <div class="card-info">
          <h3 class="card-info-top">{{ item.name }}</h3>
          <div class="card-info-time">
            起止时间：{{ startEndTime(item.between_time) }}
          </div>
          <div class="card-info-status">课程状态:{{ item.state }}</div>
          <div class="check-score">
            <span
              ><img
                src="../../../assets/images/stuAchievement/teacher.png"
                alt=""
                srcset=""
              />{{ item.user_nick_name }}</span
            >
            <span class="look-score" @click="lookScore(item.id)"
              ><span class="iconfont icon-chakan1"></span>查看成绩</span
            >
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-search-data">
      <div v-if="ifTip" class="loading">
        <a-spin tip="加载中..." size="large">
          <div class="spin-content"></div>
        </a-spin>
      </div>
      <empty v-else></empty>
    </div>
    <a-pagination
      :hideOnSinglePage="true"
      v-model="pagingData.currentPage"
      :pageSize="pagingData.perPage"
      :total="pagingData.totalCount"
      @change="pageChange"
    />
  </div>
</template>
<script lang="ts">
import { message } from "ant-design-vue";
import { defineComponent, reactive, toRefs, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import request from "../../../api";
import Empty from "src/components/Empty.vue";
interface CourseType {
  url?: string;
  id?: number;
  between_time?: string;
  state?: string;
  user_nick_name?: string;
  chapter_score?: any;
  name?: string;
  index?: string;
  time?: string;
  status?: string;
  teacher?: string;
}
interface pageingType {
  currentPage?: number;
  pageCount?: number;
  perPage?: number;
  totalCount?: number;
}
interface paramsType {
  keyword?: string;
  limit?: number;
  page?: number;
}
interface State {
  courseDataList: CourseType[];
  pagingData: pageingType;
  params: paramsType;
  ifTip: boolean;
}
export default defineComponent({
  name: "CourseAchievement",
  components: { Empty },
  setup: (props, context) => {
    const router = useRouter();
    const state: State = reactive({
      courseDataList: [],
      pagingData: {},
      params: {},
      ifTip: false,
    });
    function onSearch(value: string) {
      (state.params.keyword = value), getData();
    }
    function lookScore(id: any) {
      router.push({ path: "/studentPerformance/courseScore", query: { id: id } });
    }
    function getData() {
      state.ifTip = true;
      const infoRequest = (request as any).studentPerformance;
      infoRequest
        .courseAchievement({
          param: state.params,
        })
        .then((res: any) => {
          if (res.status == 1) {
            console.log(res.data.list);
            state.courseDataList = res.data.list;
            state.pagingData = res.data.page;
          } else {
            message.error(res.msg);
          }
          state.ifTip = false;
        });
    }
    function startEndTime(time: any) {
      console.log(time);
      const newtime = time?.substring(0, 10) + "-" + time?.substring(20, 30);
      return newtime;
    }
    function pageChange(current: number) {
      state.pagingData.currentPage;
      (state.params.page = current), getData();
    }
    onMounted(() => {
      getData();
    });
    return {
      onSearch,
      lookScore,
      getData,
      ...toRefs(state),
      startEndTime,
      pageChange,
    };
  },
});
</script>
<style lang="less" scoped>
#CourseAchievement {
  font-size: 14px;
  .loading {
    padding: 245px;
  }
  .spin-content {
    padding: 30px;
  }
}
.searchInput {
  height: 100px;
  line-height: 100px;
  .inputStyle {
    width: 503px;
    padding: 8px 5px 8px 30px;
  }
}
.content-list {
  display: flex;
  flex-wrap: wrap;
  .itemlist {
    width: 24%;
    margin-bottom: 30px;
    background-color: white;
    position: relative;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.14);
    border-radius: 6px;
    .card-pic {
      height: 166px;
      width: 100%;
      img {
        width: 100%;
        height: 100%;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
      }
    }
    .card-mask {
      position: absolute;
      left: 0;
      top: 0;
      background-color: rgba(47, 40, 21, 0.73);
      height: 166px;
      z-index: 20;
      width: 100%;
      display: none;
      text-align: center;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      .state-desc {
        line-height: 166px;
        color: white;
      }
    }
    .card-info {
      padding: 15px;
      .card-info-top {
        color: #050101;
        font-size: 17px;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
        overflow: hidden;
      }
      .card-info-time {
        min-height: 25px;
      }
      .card-info-status {
        min-height: 25px;
      }
      .check-score {
        display: flex;
        justify-content: space-between;
        img {
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
        .look-score {
          color: @theme-color;
          cursor: pointer;
        }
      }
    }
  }
  .itemlist:hover {
    .card-mask {
      display: block;
    }
  }
  .itemlist:nth-child(n) {
    margin-right: 1%;
  }
  .itemlist:nth-child(2n) {
    margin-right: 1%;
  }
  .itemlist:nth-child(3n) {
    margin-right: 1%;
  }
}
</style>
