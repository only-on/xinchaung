<template>
  <div class="forum-square">
    <forumn-top @search="search" :tagList="tagList"></forumn-top>
    <div class="forumn-content">
      <div class="left">
        <a-spin :spinning="loading" size="large" tip="Loading...">
        <forumn :forumnList="forumnList" @pageChange="pageChange" :total="total" :forumSearch="forumSearch"></forumn>
        </a-spin>
      </div>
      <div class="right">
        <div class="post pointer" @click="createPost">发帖</div>
        <!-- 热门标签 -->
        <hot-label></hot-label>
        <!-- 热力图 -->
        <heat-map></heat-map>
        <!-- 推荐课程 -->
        <recommend-course></recommend-course>
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
  provide,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import ForumnTop from "./components/ForumnTop.vue";
import Forumn from "./components/Forumn.vue";
import HotLabel from "./components/HotLabel.vue";
import HeatMap from "./components/HeatMap.vue";
import RecommendCourse from "./components/RecommendCourse.vue";
import { goHtml } from "src/utils/common";
import { IForumSearch, IForumnList, ILabelList, ITagList } from "./forumnTyping.d";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { removeHtmlTag, fixHtml} from 'src/utils/htmlLabel'
export default defineComponent({
  name: "ForumSquare",
  components: {
    ForumnTop,
    Forumn,
    HotLabel,
    HeatMap,
    RecommendCourse,
  },
  setup: (props, { emit }) => {
    const route = useRoute();
    const router = useRouter();
    const http = (request as any).teacherForum;
    var forumSearch = reactive<IForumSearch>({
      title: "",
      pageSize: 10,
      page: 1,
      type: '',
    });
    const loading = ref(false)
    const total = ref(0)
    let forumnList = reactive<IForumnList[]>([]);
    function initData() {
      console.log({ ...forumSearch });
      loading.value = true
      const param = {
        page: forumSearch.page,
        limit: forumSearch.pageSize,
        type: forumSearch.type,
        // keyword: forumSearch.title
      }
      // 获取帖子列表
      http.getForumList({urlParams: {keyword: forumSearch.title}, param}).then((res: IBusinessResp) => {
        console.log(res)
        loading.value = false
        const { list, page } = res.data
        forumnList.length = 0
        list.forEach((v: IForumnList) => {
          v.content = goHtml(v.content)
          v.desc = fixHtml(removeHtmlTag(v.content).substr(0, 200))
          v.user_name = v.user_name ? v.user_name : '用户名'
          v.avatar = v.avatar ? v.avatar : 'src/assets/images/user/admin_p.png'
        })
        console.log(list)
        forumnList.push(...list)
        total.value = page.totalCount
      })
    }
    function search(params: IForumSearch) {
      console.log(params);
      forumSearch.title = params.title;
      forumSearch.type = params.type;
      forumSearch.page = 1
      initData();
    }
    // 页码变化
    function pageChange(page: number) {
      console.log(page);
      forumSearch.page = page;
      initData();
    }
    // 发帖
    function createPost() {
      router.push("/teacher/teacherForum/CreatePosts");
    }

    onMounted(() => {
      getTagsList()
      // initData();
      getHotLabels()
    });
    // 常驻类型
    let tagList = reactive<ITagList[]>([])
    const getTagsList = () => {
      http.getForumTags().then((res: IBusinessResp) => {
        console.log(res)
        const { data } = res
        data.forEach((v: ITagList) => {
          v.value = v.name
        })
        tagList.push(...data)
      })
    }
    
    // 热门标签
    const hotLabelList = reactive<ILabelList[]>([])
    provide("hotLabelList", hotLabelList)
    const getHotLabels = () => {
      http.getHotLabels().then((res: IBusinessResp) => {
        hotLabelList.push(...res.data)
      })
    }

    // 点击展开全文 底部收起样式
    let bottomStyle = reactive({
      bottom: "0px",
      width: "830px",
    });
    provide("bottomStyle", bottomStyle);
    return {
      forumnList,
      search,
      pageChange,
      createPost,
      tagList,
      total,
      loading,
      forumSearch,
    };
  },
});
</script>

<style scoped lang="less">
.forum-square {
  .forumn-content {
    width: var(--center-width);
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    .left {
      width: 830px;
    }
    .right {
      width: 300px;
      .post {
        height: 40px;
        line-height: 40px;
        border-radius: 20px;
        background-color: var(--primary-color);
        color: var(--white-100);
        text-align: center;
        margin-top: 32px;
      }
    }
  }
}
</style>
