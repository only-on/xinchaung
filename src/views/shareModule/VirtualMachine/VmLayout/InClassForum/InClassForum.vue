<template>
  <div class="in-class-forum-box scrollbar">
    <a-tabs v-model:activeKey="activeKey" @change="tabChange">
      <a-tab-pane key="1" tab="论坛广场">
        <div>
          <a-input-search
            v-model:value="params.title"
            placeholder="请输入搜索关键字"
            style="width: 90%; max-width: 314px"
            @search="onSearch"
          />
          <div v-if="forumnList.length > 0">
            <forumn :forumnList="forumnList" @pageChange="pageChange"></forumn>
          </div>
          <div v-else>
            <empty></empty>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="我的帖子">
        <div>
          <a-input-search
            v-model:value="params.title"
            placeholder="请输入搜索关键字"
            style="width: 90%; max-width: 314px"
            @search="onSearch"
          />
          <div v-if="forumnList.length > 0">
            <forumn :forumnList="forumnList" @pageChange="pageChange"></forumn>
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
import request from "src/request/getRequest";
import empty from "src/components/Empty.vue";
import Forumn from "src/views/teacherModule/teacherForum/components/Forumn.vue";
interface Iparams {
  title: string;
  type: string;
  pageSize: number;
  page: number;
}
interface IForumnList {
  id: number;
  title: string;
  desc: string;
  content: string;
  user_name: string;
  avatar: string;
  createTime: string;
  views: number;
  isAllText: boolean;
}
export default defineComponent({
  components: {
    Forumn,
    empty,
  },
  setup() {
    const forum = request.studentForum;
    console.log(forum);
    const activeKey = ref("1");
    let forumnList = reactive<IForumnList[]>([]);
    const params: Ref<Iparams> = ref({
      title: "",
      type: "",
      pageSize: 10,
      page: 1,
    });

    function onSearch() {
      params.value.page = 1;
      getForumnList();
    }

    // 获取论坛列表
    function getForumnList() {
      // 获取帖子列表
      // let obj = [
      //   {
      //     id: 1,
      //     title: "个人2021读过的值得分享的历史相关书籍的汇总（非新书）",
      //     desc: "[Treasures from the Oxus] [北美洲] [安第斯文明特展：探寻印加帝国的起源] [萨珊朝伊朗] [罗马史研究入门] [探寻史前欧洲文明] [民主的古代先祖][民主的古代先祖] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [INCAS AND THEIR ANCESTORS:THE ARCHAEOLOGY OF PERU] [中国考古学] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [中国考古学] [最早的...",
      //     content:
      //       "[Treasures from the Oxus] [北美洲] [安第斯文明特展：探寻印加帝国的起源] [萨珊朝伊朗] [罗马史研究入门] [探寻史前欧洲文明] [民主的古代先祖][民主的古代先祖] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [INCAS AND THEIR ANCESTORS:THE ARCHAEOLOGY OF PERU] [中国考古学] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [中国考古学] [最早的<b>[Treasures from the Oxus] [北美洲] [安第斯文明特展：探寻印加帝国的起源] [萨珊朝伊朗] [罗马史研究入门] [探寻史前欧洲文明] [民主的古代先祖][民主的古代先祖] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [INCAS AND THEIR ANCESTORS:THE ARCHAEOLOGY OF PERU] [中国考古学] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [中国考古学] [最早的...</b>",
      //     userName: "小黄帽菇凉",
      //     userAvatar: "",
      //     createTime: "2022/01/21",
      //     replayNum: 24,
      //     isAllText: false,
      //   },
      //   {
      //     id: 2,
      //     title: "个人2021读过的值得分享的历史相关书籍的汇总（非新书）",
      //     desc: "[Treasures from the Oxus] [北美洲] [安第斯文明特展：探寻印加帝国的起源] [萨珊朝伊朗] [罗马史研究入门] [探寻史前欧洲文明] [民主的古代先祖][民主的古代先祖] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [INCAS AND THEIR ANCESTORS:THE ARCHAEOLOGY OF PERU] [中国考古学] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [中国考古学] [最早的...",
      //     content:
      //       "[Treasures from the Oxus] [北美洲] [安第斯文明特展：探寻印加帝国的起源] [萨珊朝伊朗] [罗马史研究入门] [探寻史前欧洲文明] [民主的古代先祖][民主的古代先祖] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [INCAS AND THEIR ANCESTORS:THE ARCHAEOLOGY OF PERU] [中国考古学] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [中国考古学] [最早的<b>[Treasures from the Oxus] [北美洲] [安第斯文明特展：探寻印加帝国的起源] [萨珊朝伊朗] [罗马史研究入门] [探寻史前欧洲文明] [民主的古代先祖][民主的古代先祖] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [INCAS AND THEIR ANCESTORS:THE ARCHAEOLOGY OF PERU] [中国考古学] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [中国考古学] [最早的...</b>",
      //     userName: "小黄帽菇凉",
      //     userAvatar: "",
      //     createTime: "2022/01/21",
      //     replayNum: 222,
      //     isAllText: false,
      //   },
      // ];
      // forumnList.push(...obj);
    }

    function tabChange(key: string) {
      console.log(key);
      params.value.type = key;
      getForumnList();
    }

    onMounted(() => {
      getForumnList();
    });
    // 页码变化
    function pageChange(page: number) {
      console.log(page);
      params.value.page = page;
      getForumnList();
    }
    return {
      activeKey,
      onSearch,
      forumnList,
      params,
      tabChange,
      pageChange,
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
