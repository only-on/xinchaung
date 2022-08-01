<template>
  <search-add
    @searchFn="searchFn"
    @handleMenuClick="handleMenuClick"
    :TypeList="materialTypeList"
    :isShowAdd="currentTab == 1"
    :isReset="resetKeyword"
  ></search-add>
  <!-- <directory-tree></directory-tree> -->
  <a-spin :spinning="loading" size="large" tip="Loading...">
    <div class="mainBox">
      <div
        class="item pointer"
        v-for="(list, k) in [1,2,3]"
        :key="list+k"
      >{{list}}
      </div>
      <Empty v-if="!questionList.length && !loading" :type="EmptyType" />
      <a-pagination
        v-if="pageTotal > 12"
        v-model:current="pageInfo.page"
        :pageSize="pageInfo.limit"
        :total="pageTotal"
        @change="pageChange"
      />
    </div>
  </a-spin>
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

// 搜索
const searchKey = ref<string>("");
const resetKeyword = ref<boolean>(false)
const tag = ref<string>('')
const searchFn = (key: string) => {
  searchKey.value = key;
  pageInfo.page = 1
  initData();
};
const EmptyType: any = computed(() => {
  let str = ''
  if(searchKey.value === '' && tag.value === ''){
    str = 'empty'
  }else{
    str = 'searchEmpty'
  }
  return str
})
const materialTypeList = reactive([
  {key:1, name:'选择题'},
  {key:2, name:'判断题'},
  {key:3, name:'填空题'},
  {key:4, name:'解答题'},
  {key:5, name:'编程题'},
  {key:6, name:'模型题'},
  {key:7, name:'批量导入'},
]);
const handleMenuClick = ({ key }: { key: number|string }) => {
  let name = ''
  materialTypeList.forEach((v => {
    if (v.key === key) name = v.name
  }))
  router.push ({
    path:"./QuestionBank/createQues",
    query:{value:key, name}
  })
};

const loading = ref<boolean>(false);
const pageInfo = reactive({
  page: 1,
  limit: 12,
});
let questionList = reactive<IMaterialList[]>([]);
const pageTotal = ref<number>(0);
const pageChange = (page: number) => {
  pageInfo.page = page;
  initData();
};
const currentTab = ref<number>(0);
watch(
  () => {
    return configuration.componenttype;
  },
  (val) => {
    currentTab.value = Number(val);
    pageInfo.page = 1
    searchKey.value = ''
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
    name: searchKey.value,
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
  
}
</style>
