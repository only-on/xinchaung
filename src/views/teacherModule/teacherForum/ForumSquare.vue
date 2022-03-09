<template>
  <div class="forum-square">
    <forumn-top @search="search" :tagList="tagList"></forumn-top>
    <div class="forumn-content">
      <div class="left">
        <forumn :forumnList="forumnList" @pageChange="pageChange"></forumn>
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
      type: 1,
    });
    let forumnList = reactive<IForumnList[]>([]);
    function initData() {
      console.log({ ...forumSearch });
      const params = {
        page: forumSearch.page,
        limit: forumSearch.pageSize,
        type: forumSearch.type,
        keyword: forumSearch.title
      }
      // 获取帖子列表
      http.getForumList({params}).then((res: IBusinessResp) => {
        console.log(res)
      })
      let obj = [
        {
          id: 1,
          title: "个人2021读过的值得分享的历史相关书籍的汇总（非新书）",
          desc: "[Treasures from the Oxus] [北美洲] [安第斯文明特展：探寻印加帝国的起源] [萨珊朝伊朗] [罗马史研究入门] [探寻史前欧洲文明] [民主的古代先祖][民主的古代先祖] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [INCAS AND THEIR ANCESTORS:THE ARCHAEOLOGY OF PERU] [中国考古学] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [中国考古学] [最早的...",
          content:
            "[Treasures from the Oxus] [北美洲] [安第斯文明特展：探寻印加帝国的起源] [萨珊朝伊朗] [罗马史研究入门] [探寻史前欧洲文明] [民主的古代先祖][民主的古代先祖] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [INCAS AND THEIR ANCESTORS:THE ARCHAEOLOGY OF PERU] [中国考古学] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [中国考古学] [最早的<b>[Treasures from the Oxus] [北美洲] [安第斯文明特展：探寻印加帝国的起源] [萨珊朝伊朗] [罗马史研究入门] [探寻史前欧洲文明] [民主的古代先祖][民主的古代先祖] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [INCAS AND THEIR ANCESTORS:THE ARCHAEOLOGY OF PERU] [中国考古学] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [中国考古学] [最早的...</b>",
          user_name: "小黄帽菇凉",
          avatar: "",
          createTime: "2022/01/21",
          views: 24,
          isAllText: false,
        },
        {
          id: 2,
          title: "个人2021读过的值得分享的历史相关书籍的汇总（非新书）",
          desc: "[Treasures from the Oxus] [北美洲] [安第斯文明特展：探寻印加帝国的起源] [萨珊朝伊朗] [罗马史研究入门] [探寻史前欧洲文明] [民主的古代先祖][民主的古代先祖] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [INCAS AND THEIR ANCESTORS:THE ARCHAEOLOGY OF PERU] [中国考古学] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [中国考古学] [最早的...",
          content:
            "[Treasures from the Oxus] [北美洲] [安第斯文明特展：探寻印加帝国的起源] [萨珊朝伊朗] [罗马史研究入门] [探寻史前欧洲文明] [民主的古代先祖][民主的古代先祖] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [INCAS AND THEIR ANCESTORS:THE ARCHAEOLOGY OF PERU] [中国考古学] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [中国考古学] [最早的<b>[Treasures from the Oxus] [北美洲] [安第斯文明特展：探寻印加帝国的起源] [萨珊朝伊朗] [罗马史研究入门] [探寻史前欧洲文明] [民主的古代先祖][民主的古代先祖] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [INCAS AND THEIR ANCESTORS:THE ARCHAEOLOGY OF PERU] [中国考古学] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [中国考古学] [最早的...</b>",
          user_name: "小黄帽菇凉",
          avatar: "",
          createTime: "2022/01/21",
          views: 222,
          isAllText: false,
        },
      ];
      forumnList.push(...obj);
    }
    function search(params: IForumSearch) {
      console.log(params);
      forumSearch.title = params.title;
      forumSearch.type = params.type;
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
      initData();
      getHotLabels()
    });
    // 常驻类型
    let tagList = reactive<ITagList[]>([])
    const getTagsList = () => {
      http.getForumTags().then((res: IBusinessResp) => {
        console.log(res)
      }).catch(() => {
        let arr = [
          { name: "WIKI", id: 1 },
          { name: "热门", id: 2 },
          { name: "最新", id: 3 },
          { name: "求助", id: 4 },
          { name: "分享", id: 5 },
          { name: "公告", id: 6 },
        ];
        tagList.push(...arr)
      })
    }
    
    // 热门标签
    const hotLabelList = reactive<ILabelList[]>([])
    provide("hotLabelList", hotLabelList)
    const getHotLabels = () => {
      http.getHotLabels().then((res: IBusinessResp) => {
        console.log(res)
      }).catch(() => {
        let arr = [
          {id: 1, name: 'bootstrap', count: 1},
          {id: 2, name: 'C++基础', count: 2},
          {id: 3, name: 'Jave', count: 3},
          {id: 4, name: '大学计算机基础', count: 4},
        ]
        hotLabelList.push(...arr)
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
