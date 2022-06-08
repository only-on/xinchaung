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
            <forumn :forumnList="forumnList" :forumSearch="forumSearch" @pageChange="pageChange" :total="total"></forumn>
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
          <a-spin :spinning="loading" size="large" tip="Loading...">
          <div v-if="forumnList.length > 0">
            <forumn :forumnList="forumnList" :forumSearch="forumSearch" @pageChange="pageChange" :total="total"></forumn>
          </div>
          <div v-else>
            <empty></empty>
          </div>
          </a-spin>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  ref,
  Ref,
  onMounted,
  reactive,
  toRefs,
  watch,
  nextTick,
  createVNode,
  provide,
  inject,
} from "vue";
import empty from "src/components/Empty.vue";
import Forumn from "src/views/teacherModule/teacherForum/components/Forumn.vue";
import { IForumnList } from "src/views/teacherModule/teacherForum/forumnTyping.d"
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { goHtml } from "src/utils/common";
import { removeHtmlTag, fixHtml} from 'src/utils/htmlLabel'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal, message } from "ant-design-vue";
interface Iparams {
  title: string;
  type: string;
  pageSize: number;
  page: number;
}
const http = (request as any).teacherForum;
// console.log(http);
const activeKey = ref("0");
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
  // console.log(forumSearch)
  const param = {
    page: forumSearch.page,
    limit: forumSearch.pageSize,
    // keyword: forumSearch.title
    type: '求助'
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
  // console.log(key, '1');
  forumSearch.type = key;
  getForumnList();
}

// 删除帖子
const deleteForum = (id: number) => {
  // console.log(id)
  Modal.confirm({
    title: '确认删除吗？',
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复',
    okText: '确认',
    cancelText: '取消',
    onOk(){
      http.deleteForum({urlParams: {id}}).then((res:IBusinessResp)=>{
        message.success('删除成功')
        getForumnList();
      })
    }
  });
}
provide("deleteForum", deleteForum)

const leftWidth: Ref<number> = inject("leftWidth", ref(70));
// console.log(leftWidth.value)

// 点击展开全文 底部收起样式
let bottomStyle = reactive({
  bottom: "80px",
  width: (Number(leftWidth.value)-70-20)+"px",
});
provide("bottomStyle", bottomStyle);
watch(
  () => leftWidth.value,
  () => {
    bottomStyle.width = (Number(leftWidth.value)-70-20)+"px"
  },
  { deep: true, immediate: true }
);
onMounted(() => {
  getForumnList();
});
// 页码变化
function pageChange(page: number,pageSize:number) {
  // console.log(page);
  forumSearch.page = page;
  forumSearch.pageSize = pageSize;
  getForumnList();
}

defineExpose({ getForumnList})
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
