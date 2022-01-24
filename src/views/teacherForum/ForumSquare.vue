<template>
  <div class="forum-square">
    <forumn-top :type="'ForumSquare'"></forumn-top>
    <div class="forumn-content">
      <div class="left">
        <forumn
          :forumnList="forumnList"
        ></forumn>
      </div>
      <div class="right">
        right
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
export default defineComponent({
  name: 'ForumSquare',
  components: {
    ForumnTop,
    Forumn
  },
  setup: (props, { emit }) => {
    const route = useRoute();
    var forumSearch = reactive<IForumSearch>({
      title: '',
      pageSize: 10,
      page: 1,
      type: undefined
    })
    let forumnList = reactive<IForumnList>([])
    function initData() {
      // 获取帖子列表
      forumnList.push(
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
        }
      )
    }
    onMounted(() => {
      initData()
      initData()
    })
    return { 
      forumnList
    };
  },
})
interface IForumSearch {
  title: string
  pageSize: number
  page: number
  type: number | undefined
}
interface IForumnList {
  id: number
  title: string
  desc: string
  content: string
  userName: string
  userAvatar: string
  createTime: string
  replayNum: number
  isAllText: boolean
}
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
    }
  }
}
</style>
