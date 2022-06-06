<template>
  <div class="forum-square">
    <forumn-top @search="search" :tagList="tagList"></forumn-top>
    <div class="forumn-content" id="scrool">
      <div class="left">
        <a-spin :spinning="loading" size="large" tip="Loading...">
          <forumn :forumnList="forumnList" @pageChange="pageChange" :total="total" :forumSearch="forumSearch"></forumn>
          <Empty v-if="!forumnList.length && !loading" :type="EmptyType" />
        </a-spin>
      </div>
      <div class="right" v-if="role !== 2">
        <div v-show="!loading">
        <div class="post pointer" @click="createPost">发帖</div>
        <!-- 热门标签 -->
        <hot-label></hot-label>
        <!-- 热力图 -->
        <heat-map id="echarts-list"></heat-map>
        <!-- 推荐课程 -->
        <recommend-course></recommend-course>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  watch,
  provide,
  createVNode,
  computed
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
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal, message } from "ant-design-vue";
import extStorage from "src/utils/extStorage";
const route = useRoute();
const router = useRouter();
const {path} = route
let {currentTab, type, tab} = route.query
const http = (request as any).teacherForum;
const { lStorage } = extStorage;
const role = lStorage.get("role") || 3;
var forumSearch = reactive<IForumSearch>({
  title: "",
  pageSize: 10,
  page: 1,
  type: type ? String(type) : 'wiki',
});
const loading = ref(false)
const total = ref(0)
const EmptyType:any=computed(()=>{
  let str=''
  if(forumSearch.title === ''){
    str= 'empty'
  }else{
    str= 'searchEmpty'
  }
  return str
})
let forumnList = reactive<IForumnList[]>([]);
function initData() {
  loading.value = true
  const param = {
    page: forumSearch.page,
    limit: forumSearch.pageSize,
    // type: forumSearch.type,
    // keyword: forumSearch.title
  }
  forumSearch.type === 'hot' ? 
    Object.assign(param, {order: 1}) : 
    (forumSearch.type === 'new'? 
      Object.assign(param, {order: 2}) : 
      Object.assign(param, {type: forumSearch.type}))
    forumnList.length = 0
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
function search(params: IForumSearch) {
  forumSearch.title = params.title;
  forumSearch.type = params.type;
  forumSearch.page = 1
  initData();
}
// 页码变化
function pageChange(page: number) {
  forumSearch.page = page;
  const target:any=document.getElementsByClassName('main-box')[0];
  target.scrollTop='0px';
  initData();
}
// 发帖
function createPost() {
  router.push("/teacher/teacherForum/CreatePosts");
}

// 删除帖子
const deleteForum = (id: number) => {
  Modal.confirm({
    title: '确认删除吗？',
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复',
    okText: '确认',
    cancelText: '取消',
    onOk(){
      http.deleteForum({urlParams: {id}}).then((res:IBusinessResp)=>{
        message.success('删除成功')
        initData()
      })
    }
  });
}
provide("deleteForum", deleteForum)

onMounted(async() => {
  
  let NewQuery = { currentTab:route.query.currentTab, tab, type };
  await router.replace({
    path: path,
    query: NewQuery,
  });
  if (currentTab === '0' || !currentTab) {
    getTagsList()
    // initData();
    role === 2 ? '' : getHotLabels()
  }
});
// 常驻类型
const tags = [
  {id: 0, name: '热门', value: 'hot'},
  {id: -1, name: '最新', value: 'new'}
]
let tagList = reactive<ITagList[]>([])
const getTagsList = () => {
  http.getForumTags().then((res: IBusinessResp) => {
    if (!res) return
    const { data } = res
    data.forEach((v: ITagList) => {
      v.value = v.name
    })
    data.splice(1, 0, ...tags)
    tagList.push(...data)
    // forumSearch.type = data[0].name
    initData();
  })
}

// 热门标签
const hotLabelList = reactive<ILabelList[]>([])
provide("hotLabelList", hotLabelList)
const getHotLabels = () => {
  http.getHotLabels().then((res: IBusinessResp) => {
    if (!res) return
    hotLabelList.push(...res.data)
  })
}

// 点击展开全文 底部收起样式
let bottomStyle = reactive({
  bottom: "0px",
  width: "830px",
});
provide("bottomStyle", bottomStyle);
</script>

<style scoped lang="less">
.forum-square {
  .forumn-content {
    width: var(--center-width);
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    .left {
      // width: 830px;
      width: 100%;
    }
    .right {
      width: 300px;
      margin-left: 70px;
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
