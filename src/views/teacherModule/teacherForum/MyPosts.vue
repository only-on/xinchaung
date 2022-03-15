<template>
  <div class="my-posts">
    <forumn-top @search="search" :tagList="tagList"></forumn-top>
    <div class="forumn-content">
      <div class="left">
        <span
          class="pointer"
          :class="{ active: currentTab === item.id }"
          @click="tabChange(item.id)"
          v-for="item in tabs"
          :key="item.id"
        >
          {{ item.name }}
        </span>
      </div>
      <div class="right">
        <a-spin :spinning="loading" size="large" tip="Loading...">
        <forumn :forumnList="forumnList" @pageChange="pageChange" :total="total" :forumSearch="forumSearch"></forumn>
        </a-spin>
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
import { goHtml } from "src/utils/common";
import { IForumSearch, IForumnList, ITagList } from "./forumnTyping.d";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { removeHtmlTag, fixHtml} from 'src/utils/htmlLabel'
const http = (request as any).teacherForum;
export default defineComponent({
  name: "ForumSquare",
  components: {
    ForumnTop,
    Forumn,
  },
  setup: (props, { emit }) => {
    const route = useRoute();
    let currentTab = ref<number>(0);
    const httpList = {
      0: 'getForumList',
      1: 'getAttendList'
    }
    let forumSearch = reactive<IForumSearch>({
      title: "",
      pageSize: 10,
      page: 1,
      type: '',
    });
    const loading = ref(false)
    let forumnList = reactive<IForumnList[]>([]);
    const total = ref(0)
    function initData() {
      loading.value = true
      // 获取帖子列表
      const param = {
        page: forumSearch.page,
        limit: forumSearch.pageSize,
        type: forumSearch.type,
        // keyword: forumSearch.title
      }
      http[httpList[currentTab.value]]({urlParams: {keyword: forumSearch.title}, param}).then((res: IBusinessResp) => {
        loading.value = false
        forumnList.length = 0
        const { list, page } = res.data
        list.forEach((v: IForumnList) => {
          v.content = goHtml(v.content)
          v.desc = fixHtml(removeHtmlTag(v.content).substr(0, 200))
          v.user_name = v.user_name ? v.user_name : '用户名'
          v.avatar = v.avatar ? v.avatar : 'src/assets/images/user/admin_p.png'
        })
        forumnList.push(...list)
        total.value = page.totalCount
      })
    }
    function search(params: IForumSearch) {
      forumSearch.title = params.title;
      forumSearch.type = params.type;
      forumSearch.page = 1
      initData();
    }
    // 页码变化
    function pageChange(page: number) {
      forumSearch.page = page;
      initData();
    }
    //
    function tabChange(id: number) {
      currentTab.value = id;
      // initData();
      id === 0 ? getTagsList({self: 1}) : (id === 1 ? getTagsList({}) : '')
    }
    // 常驻类型
    let tagList = reactive<ITagList[]>([])
    const getTagsList = (param: any) => {
      tagList.length = 0
      http.getForumTags({param}).then((res: IBusinessResp) => {
        const { data } = res
        data.forEach((v: ITagList) => {
          v.value = v.name
        })
        tagList.push(...data)
        forumSearch.type = data[0].name
        initData()
      })
    }

    // 点击展开全文 底部收起样式
    let bottomStyle = reactive({
      bottom: "0px",
      width: "1044px",
    });
    provide("bottomStyle", bottomStyle);

    onMounted(() => {
      getTagsList({self: 1})
      // initData();
    });
    return {
      currentTab,
      forumnList,
      search,
      pageChange,
      tabs: [
        { id: 0, name: "我发布的帖子" },
        { id: 1, name: "我参与的帖子" },
      ],
      tabChange,
      bottomStyle,
      tagList,
      total,
      loading,
      forumSearch,
    };
  },
});
</script>

<style scoped lang="less">
.my-posts {
  .forumn-content {
    width: var(--center-width);
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    .left {
      width: 124px;
      height: 228px;
      background-color: #f2f2f2;
      margin-top: 32px;
      padding: 20px;
      span {
        display: block;
        margin-bottom: 16px;
        &.active {
          color: var(--primary-color);
        }
      }
    }
    .right {
      width: 1044px;
    }
  }
}
</style>
