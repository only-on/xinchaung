<template>
  <div class="my-posts">
    <forumn-top @search="search"></forumn-top>
    <div class="forumn-content">
      <div class="left">
        <span 
          class="pointer" 
          :class="{active: currentTab === item.id}" 
          @click="tabChange(item.id)"
          v-for="item in tabs"
          :key="item.id"
        >
          {{item.name}}
        </span>
      </div>
      <div class="right">
        <forumn
          :forumnList="forumnList"
          @pageChange="pageChange"
        ></forumn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, Ref, inject, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import ForumnTop from './components/ForumnTop.vue'
import Forumn from './components/Forumn.vue'
import { goHtml } from 'src/utils/common'
import { IForumSearch, IForumnList } from './forumnTyping.d'
export default defineComponent({
  name: 'ForumSquare',
  components: {
    ForumnTop,
    Forumn,
  },
  setup: (props, { emit }) => {
    const route = useRoute();
    let currentTab = ref<number>(0)
    let forumSearch = reactive<IForumSearch>({
      title: '',
      pageSize: 10,
      page: 1,
      type: 1,
    })
    let forumnList = reactive<IForumnList[]>([])
    function initData() {
      console.log({...forumSearch, tabType: currentTab.value})
      // 获取帖子列表
      let obj = [
        {
          id: 1,
          title: '个人2021读过的值得分享的历史相关书籍的汇总（非新书）',
          desc: '[Treasures from the Oxus] [北美洲] [安第斯文明特展：探寻印加帝国的起源] [萨珊朝伊朗] [罗马史研究入门] [探寻史前欧洲文明] [民主的古代先祖][民主的古代先祖] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [INCAS AND THEIR ANCESTORS:THE ARCHAEOLOGY OF PERU] [中国考古学] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [中国考古学] [最早的...',
          content: '[Treasures from the Oxus] [北美洲] [安第斯文明特展：探寻印加帝国的起源] [萨珊朝伊朗] [罗马史研究入门] [探寻史前欧洲文明] [民主的古代先祖][民主的古代先祖] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [INCAS AND THEIR ANCESTORS:THE ARCHAEOLOGY OF PERU] [中国考古学] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [中国考古学] [最早的<b>[Treasures from the Oxus] [北美洲] [安第斯文明特展：探寻印加帝国的起源] [萨珊朝伊朗] [罗马史研究入门] [探寻史前欧洲文明] [民主的古代先祖][民主的古代先祖] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [INCAS AND THEIR ANCESTORS:THE ARCHAEOLOGY OF PERU] [中国考古学] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [中国考古学] [最早的...</b>',
          userName: '小黄帽菇凉',
          userAvatar: '',
          createTime: '2022/01/21',
          replayNum: 24,
          isAllText: false
        },
        {
          id: 2,
          title: '个人2021读过的值得分享的历史相关书籍的汇总（非新书）',
          desc: '[Treasures from the Oxus] [北美洲] [安第斯文明特展：探寻印加帝国的起源] [萨珊朝伊朗] [罗马史研究入门] [探寻史前欧洲文明] [民主的古代先祖][民主的古代先祖] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [INCAS AND THEIR ANCESTORS:THE ARCHAEOLOGY OF PERU] [中国考古学] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [中国考古学] [最早的...',
          content: '[Treasures from the Oxus] [北美洲] [安第斯文明特展：探寻印加帝国的起源] [萨珊朝伊朗] [罗马史研究入门] [探寻史前欧洲文明] [民主的古代先祖][民主的古代先祖] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [INCAS AND THEIR ANCESTORS:THE ARCHAEOLOGY OF PERU] [中国考古学] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [中国考古学] [最早的<b>[Treasures from the Oxus] [北美洲] [安第斯文明特展：探寻印加帝国的起源] [萨珊朝伊朗] [罗马史研究入门] [探寻史前欧洲文明] [民主的古代先祖][民主的古代先祖] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [INCAS AND THEIR ANCESTORS:THE ARCHAEOLOGY OF PERU] [中国考古学] [民主的古代先祖] [A History of the Ancient Near East, ca. 3000-323 BC] [东南亚大陆早期文化] [中国考古学] [最早的...</b>',
          userName: '小黄帽菇凉',
          userAvatar: '',
          createTime: '2022/01/21',
          replayNum: 222,
          isAllText: false
        }
      ]
      forumnList.push(...obj)
    }
    function search(params: IForumSearch) {
      console.log(params)
      forumSearch.title = params.title
      forumSearch.type = params.type
      initData()
    }
    // 页码变化
    function pageChange(page: number) {
      console.log(page)
      forumSearch.page = page
      initData()
    }
    // 
    function tabChange(id: number) {
      currentTab.value = id
      initData()
    }

    onMounted(() => {
      initData()
    })
    return { 
      currentTab,
      forumnList,
      search,
      pageChange,
      tabs: [{id: 0, name: '我发布的帖子'}, {id: 1, name: '我参与的帖子'}],
      tabChange,
    };
  },
})
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
          color: var(--orangeyellow-6);
        }
      }
    }
    .right {
      width: 1044px;
    }
  }
}
</style>
