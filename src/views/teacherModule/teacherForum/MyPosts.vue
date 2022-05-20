<template>
  <div class="my-posts">
    <forumn-top @search="search" :tagList="tagList"></forumn-top>
    <div class="forumn-content">
      <div class="top">
        <div class="tabs">
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
        <div class="create-post pointer" @click="createPost">发帖</div>
      </div>
      <div class="right">
        <a-spin :spinning="loading" size="large" tip="Loading...">
          <forumn :forumnList="forumnList" @pageChange="pageChange" :total="total" :forumSearch="forumSearch"></forumn>
          <Empty v-if="!forumnList.length && !loading" :type="EmptyType" />
        </a-spin>
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
import { goHtml } from "src/utils/common";
import { IForumSearch, IForumnList, ITagList } from "./forumnTyping.d";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { removeHtmlTag, fixHtml} from 'src/utils/htmlLabel'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal, message } from "ant-design-vue";
const http = (request as any).teacherForum;
const route = useRoute();
const router = useRouter();
const {path} = route
let {type, tab} = route.query
let currentTab = ref<number>(tab?Number(tab):0);
const httpList = {
  0: 'getForumList',
  1: 'getAttendList'
}
const EmptyType:any=computed(()=>{
  let str=''
  if(forumSearch.title === ''){
    str= 'empty'
  }else{
    str= 'searchEmpty'
  }
  return str
})
// 发帖
function createPost() {
  router.push("/teacher/teacherForum/CreatePosts");
}
let forumSearch = reactive<IForumSearch>({
  title: "",
  pageSize: 10,
  page: 1,
  type: type ? String(type) : 'wiki',
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
    // type: forumSearch.type,
    // keyword: forumSearch.title
  }
  // order=2 最新 1 热门
  currentTab.value ? 
    (forumSearch.type === 'hot' ? 
      Object.assign(param, {order: 1}) : 
      (forumSearch.type === 'new'? 
        Object.assign(param, {order: 2}) : 
        Object.assign(param, {type: forumSearch.type}))) : 
    Object.assign(param, {self: 1, type: forumSearch.type})
  http[httpList[currentTab.value]]({urlParams: {keyword: forumSearch.title}, param}).then((res: IBusinessResp) => {
    loading.value = false
    forumnList.length = 0
    const { list, page } = res.data
    list.forEach((v: IForumnList) => {
      v.content = goHtml(v.content)
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
  initData();
}
//
async function tabChange(id: number) {
  currentTab.value = id;
  let NewQuery = { tab: id,currentTab: route.query.currentTab, type: type ? type : 'wiki', };
  await router.replace({
    path: path,
    query: NewQuery,
  });
  // initData();
  id === 0 ? getTagsList({scene: 'private'}) : (id === 1 ? getTagsList({}) : '')
}
// 常驻类型
const tags = [
  {id: 0, name: '热门', value: 'hot'},
  {id: -1, name: '最新', value: 'new'}
]
let tagList = reactive<ITagList[]>([])
const getTagsList = (param: any) => {
  tagList.length = 0
  http.getForumTags({param}).then((res: IBusinessResp) => {
    const { data } = res
    data.forEach((v: ITagList) => {
      v.value = v.name
    })
    currentTab.value ? data.splice(1, 0, ...tags) : ''
    tagList.push(...data)
    // forumSearch.type = data[0].name
    initData()
  })
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


// 点击展开全文 底部收起样式
let bottomStyle = reactive({
  bottom: "0px",
  width: "1200px",
});
provide("bottomStyle", bottomStyle);

onMounted(async() => {
  
  let NewQuery = { currentTab:route.query.currentTab, tab, type };
  await router.replace({
    path: path,
    query: NewQuery,
  });
  // getTagsList({scene: 'private'})
  currentTab.value === 0 ? getTagsList({scene: 'private'}) : (currentTab.value === 1 ? getTagsList({}) : '')
  // initData();
});
const tabs = [
  { id: 0, name: "我发布的帖子" },
  { id: 1, name: "我参与的帖子" },
]
</script>

<style scoped lang="less">
.my-posts {
  .forumn-content {
    width: var(--center-width);
    margin: 0 auto;
    .top {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;
      .create-post {
        width: 140px;
        height: 34px;
        line-height: 34px;
        border-radius: 18px;
        color: var(--white);
        text-align: center;
        background: var(--primary-color);
      }
    }
    .tabs {
      // width: 270px;
      height: 30px;
      line-height: 30px;
      background-color: var(--white);
      // border-radius: 16px;
      span {
        display: inline-block;
        // margin-bottom: 16px;
        padding: 0 25px;
        border: 1px solid #DBDBDB;
        color: var(--black-45);
        &.active {
          color: var(--white);
          border-color: var(--primary-color);
          background-color: var(--primary-color);
        }
        &:nth-child(1) {
          border-radius: 15px 0px 0px 15px;
          border-right: none;
        }
        &:nth-child(2) {
          border-left: none;
          border-radius: 0px 15px 15px 0px;;
        }
      }
    }
    .right {
      // width: 1044px;
    }
  }
}
</style>
