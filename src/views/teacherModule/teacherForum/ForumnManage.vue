<template>
  <div class="forum-square">
    <forumn-top @search="search" :tagList="tagList"></forumn-top>
    <div class="forumn-content">
      <div class="top-operate">
        <a-button type="primary" @click="batchDelete">批量删除</a-button>
      </div>
      <a-spin :spinning="loading" size="large" tip="Loading...">
        <!-- <forumn :forumnList="forumnList" @pageChange="pageChange" :total="total" :forumSearch="forumSearch"></forumn>
        <Empty v-if="!forumnList.length && !loading" :type="EmptyType" /> -->
        <a-config-provider>
          <a-table
            rowKey='id'
              :columns="columns"
              :data-source="forumnList"
              :pagination="
                total > 10
                  ? {
                      hideOnSinglePage: false,
                      total: total,
                      current: forumSearch.page,
                      pageSize: forumSearch.pageSize,
                      onChange: pageChange,
                      onShowSizeChange: onShowSizeChange,
                    }
                  : false
              "
              :row-selection="{
                selectedRowKeys: tableSelect.selectedRowKeys,
                onChange: onSelectChange,
              }"
            >
              <template #title='{record}'>
                <div class="title pointer single_ellipsis">
                  <span class='delete' @click="detail(record.id)">{{record?.title}}</span>
                </div>
              </template>
              <template #time='{record}'>
                <div class="time">{{dateFormat(record.created_at*1000)}}</div>
              </template>
              <template #action='{record}'>
                <div class="action pointer">
                  <span class='delete' @click="deleteForumn(record.id)">删除</span>
                </div>
              </template>
            </a-table>
            <template #renderEmpty>
              <div><Empty :height='80' :text='forumSearch.title?"抱歉，未搜到相关数据！":"抱歉，暂无数据！"' type="tableEmpty" /></div>
            </template>
        </a-config-provider> 
      </a-spin>
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
import { IForumSearch, IForumnList, ILabelList, ITagList } from "./forumnTyping.d";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { removeHtmlTag, fixHtml} from 'src/utils/htmlLabel'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal, message } from "ant-design-vue";
import extStorage from "src/utils/extStorage";
import { dateFormat } from 'src/utils/common'
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
  type: type ? String(type) : '',
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
const columns = [
  {
    title: "帖子名称",
    key: "action",
    slots: { customRender: "title" },
  },
  {
    title: "发帖人",
    dataIndex: "user.username",
    key: "user.username",
    width:180,
  },
  {
    title: "发帖时间",
    slots: { customRender: "time" },
    key: "created_at",
    width:230,
  },
  {
    title: "评论数",
    dataIndex: "reply_number_count",
    key: "reply_number_count",
    width:140,
  },
  {
    title: "操作",
    key: "action",
    slots: { customRender: "action" },
    width:80,
  },
];
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
  // 获取帖子列表
  http.getForumList({urlParams: {keyword: forumSearch.title}, param}).then((res: IBusinessResp) => {
    loading.value = false
    const { list, page } = res.data
    forumnList.length = 0
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
  initData();
}
function onShowSizeChange(current: any, size: any) {}
const tableSelect = reactive({
  selectedRowKeys: []
})
function onSelectChange(selectedRowKeys: any) {
  console.log(selectedRowKeys);
  tableSelect.selectedRowKeys = selectedRowKeys
}

// 删除帖子
const deleteForumn = (id: number) => {
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
provide("deleteForum", deleteForumn)
// 详情
const detail = (id: number) => {
  console.log(id)
  router.push({
    path: "/teacher/teacherForum/ForumnDetail",
    query: {id}
  });
}
// 批量删除
const batchDelete = () => {
  console.log(tableSelect.selectedRowKeys)
  if (!tableSelect.selectedRowKeys.length) {
    message.warning('请至少一条帖子！')
    return
  }
  Modal.confirm({
    title: '确认删除吗？',
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复',
    okText: '确认',
    cancelText: '取消',
    onOk(){
      // http.deleteForum({urlParams: {id}}).then((res:IBusinessResp)=>{
      //   message.success('删除成功')
      //   initData()
      // })
    }
  });
}

onMounted(async() => {
  let NewQuery = { currentTab:route.query.currentTab, tab, type };
  await router.replace({
    path: path,
    query: NewQuery,
  });
  if (currentTab === '2') {
    initData();
  }
});
// 常驻类型
const tags = [
  {id: 0, name: '全部', value: ''},
]
let tagList = reactive<ITagList[]>([])
const getTagsList = () => {
  http.getForumTags().then((res: IBusinessResp) => {
    if (!res) return
    const { data } = res
    data.forEach((v: ITagList) => {
      v.value = v.name
    })
    tags.push(...data)
    tagList.push(...tags)
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
    margin-top: 24px;
    padding: 0 40px;
    .top-operate {
      margin-top: 24px;
      text-align: right;
    }
    .ant-table-wrapper {
      .title, .action {
        color: var(--primary-color);
      }
    }
  }
}
</style>
