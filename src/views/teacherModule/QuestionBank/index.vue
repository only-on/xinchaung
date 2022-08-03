<template>
  <search-add
    @searchFn="searchFn"
    @handleMenuClick="handleMenuClick"
    :TypeList="createQuestionTypeList"
    :isShowAdd="isMyQuestion"
    :isReset="resetKeyword"
  ></search-add>
  <!-- <directory-tree></directory-tree> -->
  <filter-condition></filter-condition>
  <a-spin :spinning="loading" size="large" tip="Loading...">
    <div class="mainBox">
      <question-list 
        :isOperation="isMyQuestion"
      ></question-list>
      <Empty v-if="!list.length && !loading" :type="EmptyType" />
      <a-pagination
        v-if="pageTotal > 12"
        v-model:current="pageInfo.page"
        :pageSize="pageInfo.limit"
        :total="pageTotal"
        @change="pageChange"
      />
    </div>
  </a-spin>
  <div class="footer">
    <div class="left">
      <a-checkbox v-model:checked="checkedAll" @change="checkedAllHandle">全选</a-checkbox>
      <span>已选（35题）</span>
    </div>
    <div class="center">
      <a-button>批量移动到</a-button>
      <a-button>批量导出</a-button>
      <a-button>批量公开</a-button>
      <a-button>批量删除</a-button>
      <a-button type="primary">发布作业</a-button>
      <a-button type="primary">发布考试</a-button>
    </div>
    <div class="right">
      <span class="iconfont icon-guanbi"></span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, inject, watch, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import searchAdd from "src/components/searchAdd/searchAdd.vue";
import extStorage from "src/utils/extStorage";
import directoryTree from "./components/directoryTree.vue";
import filterCondition from "./components/filterCondition.vue"
import questionList from "./components/questionList.vue"
import { createQuestionTypeList } from "./questionConfig"
const router = useRouter();
const route = useRoute();
const http = (request as any).QuestionBank;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [
    { name: "公共题库", componenttype: 0 },
    { name: "我的题库", componenttype: 1 },
  ],
  showContent: false,
  componenttype: undefined,
  showNav: false,
});
const { lStorage } = extStorage;
const uid = lStorage.get("uid")

const currentTab = ref<number>(0);
const loading = ref<boolean>(false);
const pageInfo = reactive({
  page: 1,
  limit: 12,
});
let list = reactive<IMaterialList[]>([]);
const pageTotal = ref<number>(0);
const checkedAll = ref(false)

// 搜索
const searchInfo = reactive({
  keyWord: '',
  type: '',
  level: '',
  use: '',
  knowledge: []
})
const resetKeyword = ref<boolean>(false)  // 重置keyword
const searchFn = (key: string) => {
  searchInfo.keyWord = key;
  pageInfo.page = 1
  initData();
};
const isMyQuestion = computed(() => currentTab.value==1)
const EmptyType: any = computed(() => {
  let str = ''
  if(searchInfo.keyWord === ''){
    str = 'empty'
  }else{
    str = 'searchEmpty'
  }
  return str
})
const handleMenuClick = ({ key }: { key: number|string }) => {
  let name = ''
  createQuestionTypeList.forEach((v => {
    if (v.key === key) name = v.name
  }))
  router.push ({
    path:"./QuestionBank/createQues",
    query:{value:key, name}
  })
};
const pageChange = (page: number) => {
  pageInfo.page = page;
  initData();
};
// 全选
const checkedAllHandle = (e: any) => {
  console.log(e)
}
watch(
  () => {
    return configuration.componenttype;
  },
  (val) => {
    currentTab.value = Number(val);
    pageInfo.page = 1
    searchInfo.keyWord = ''
    resetKeyword.value = !resetKeyword.value
    initData();
  }
);

interface ILabel {
  uid: string;
  name: string;
}
interface IMaterialList {
  id: number
  name: string
  type: number
  description: string
  tags: string[]
  item_size: number
  item_count: string
  is_public: number
  cover: string
  type_name: string
  username: string
  user: Iuser
  avatar: string
}
interface Iuser {
  username: string
  avatar: string
}
let materialList = reactive<IMaterialList[]>([]);
const initData = () => {
  const param = {
    name: searchInfo.keyWord,
    is_public: currentTab.value ? 0 : 1,  // 1公开 0私有
    ...pageInfo,
  };
  materialList.length = 0
  pageTotal.value=0
  loading.value=true
  // http.dataSets({ param }).then((res: any) => {
  //   if (!res) return
  //   const { list, page } = res.data;
  //   list.forEach((v: any) => {
  //     if(v.type==1){
  //       v.cover = `${v.cover}?data-time=${new Date().getTime()}`
  //     }
  //   })
  //   materialList.push(...list);
  //   pageTotal.value = page.totalCount;
    loading.value=false
  // }).catch((err:any)=>{
  //   loading.value=false
  // })
};
onMounted(() => {
  if (!Number(route.query.currentTab)) {
    currentTab.value = 0
    configuration.componenttype = 0
  } else {
    currentTab.value = 1
    configuration.componenttype = 1
  }
})
</script>

<style lang="less" scoped>
.mainBox {
  // flex-wrap: wrap;
  // justify-content: space-between;
  width: var(--center-width);
  margin: 0 auto;
}
</style>
