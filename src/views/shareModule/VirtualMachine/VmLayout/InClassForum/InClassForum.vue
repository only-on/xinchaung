<template>
  <div class="in-class-forum-box scrollbar">
    <a-tabs v-model:activeKey="activeKey" @change="tabChange">
      <a-tab-pane key="0" tab="论坛广场">
        <div>
          <a-input-search
            v-model:value="forumSearch.title"
            placeholder="请输入搜索关键字"
            style="width: 90%; max-width: 314px"
            @search="onSearch"
          />
          <a-spin :spinning="loading" size="large" tip="Loading...">
          <div v-if="forumnList.length > 0">
            <forumn :forumnList="forumnList" @pageChange="pageChange" :total="total"></forumn>
          </div>
          <div v-else>
            <empty></empty>
          </div>
          </a-spin>
        </div>
      </a-tab-pane>
      <a-tab-pane key="1" tab="我的帖子">
        <div>
          <a-input-search
            v-model:value="forumSearch.title"
            placeholder="请输入搜索关键字"
            style="width: 90%; max-width: 314px"
            @search="onSearch"
          />
          <div v-if="forumnList.length > 0">
            <forumn :forumnList="forumnList" @pageChange="pageChange" :total="total"></forumn>
          </div>
          <div v-else>
            <empty></empty>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  onMounted,
  reactive,
  toRefs,
  watch,
  nextTick,
} from "vue";
import empty from "src/components/Empty.vue";
import Forumn from "src/views/teacherModule/teacherForum/components/Forumn.vue";
import { IForumnList } from "src/views/teacherModule/teacherForum/forumnTyping.d"
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { goHtml } from "src/utils/common";
import { removeHtmlTag, fixHtml} from 'src/utils/htmlLabel'
interface Iparams {
  title: string;
  type: string;
  pageSize: number;
  page: number;
}
export default defineComponent({
  components: {
    Forumn,
    empty,
  },
  setup() {
    const http = (request as any).teacherForum;
    console.log(http);
    const activeKey = ref("1");
    let forumnList = reactive<IForumnList[]>([]);
    const forumSearch = reactive<Iparams>({
      title: "",
      type: "",
      pageSize: 10,
      page: 1,
    });

    function onSearch() {
      forumSearch.page = 1;
      getForumnList();
    }

    // 获取论坛列表
    const loading = ref<boolean>(false)
    const total = ref<number>(0)
    function getForumnList() {
      // 获取帖子列表
      loading.value = true
      forumnList.length = 0
      console.log(forumSearch)
      const param = {
        page: forumSearch.page,
        limit: forumSearch.pageSize,
        // keyword: forumSearch.title
      }
      forumSearch.type === '1' ? Object.assign(param, {self: 1}) : ''
      // 获取帖子列表
      http.getForumList({urlParams: {keyword: forumSearch.title}, param}).then((res: IBusinessResp) => {
        loading.value = false
        const { list, page } = res.data
        list.forEach((v: IForumnList) => {
          v.content = goHtml(v.content)
          fixHtml(removeHtmlTag(v.content).substr(0, 200))
          v.desc = fixHtml(removeHtmlTag(v.content).substr(0, 200))
          v.avatar = v.avatar ? v.avatar : 'src/assets/images/user/admin_p.png'
        })
        forumnList.push(...list)
        total.value = page.totalCount
      })
    }

    function tabChange(key: string) {
      console.log(key, '1');
      forumSearch.type = key;
      getForumnList();
    }

    onMounted(() => {
      getForumnList();
    });
    // 页码变化
    function pageChange(page: number) {
      console.log(page);
      forumSearch.page = page;
      getForumnList();
    }
    return {
      activeKey,
      onSearch,
      forumnList,
      forumSearch,
      tabChange,
      pageChange,
      total,
      loading,
    };
  },
});
</script>

<style lang="less" scoped>
.in-class-forum-box {
  white-space: normal;
  padding: 10px;
  margin-right: 10px;
  text-align: justify;
  height: calc(100% - 85px);
  // background: var(--black-100);
}
</style>
