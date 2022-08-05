<template>
  <search-add
    @searchFn="searchFn"
    @handleMenuClick="handleMenuClick"
    :TypeList="createQuestionTypeList"
    :isShowAdd="isMyQuestion"
    :isReset="resetKeyword"
  ></search-add>
  <!-- <directory-tree></directory-tree> -->
  <filter-condition :searchInfo="searchInfo" @searchFn="searchFn"></filter-condition>
  <div class="question-content">
    <div class="left" v-if="isMyQuestion">
      <directory-tree></directory-tree>
    </div>
    <div class="right">
      <a-spin :spinning="loading" size="large" tip="Loading...">
        <div class="mainBox">
          <question-list 
            :isOperation="isMyQuestion"
            menuClick="menuClick"
            :questionList="questionListData"
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
    </div>
  </div>
  <div class="footer">
    <div class="bottom">
      <div class="left">
        <a-checkbox v-model:checked="checkedAll" @change="checkedAllHandle">全选</a-checkbox>
        <span class="selected-num">已选（{{checkedNum}}题）</span>
      </div>
      <div class="center">
        <span v-if="isMyQuestion">
          <a-button class="btn">批量移动到</a-button>
          <a-button class="btn">批量导出</a-button>
          <a-button class="btn">批量公开</a-button>
          <a-button class="btn">批量删除</a-button>
        </span>
        <a-button class="btn" type="primary">发布作业</a-button>
        <a-button class="btn" type="primary">发布考试</a-button>
      </div>
      <div class="right">
        <span class="iconfont icon-guanbi pointer"></span>
      </div>
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
const questionListData = reactive([
  {
    id: 1,
    type: 1,
    level: 1,
    use: 1,
    desc: '在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱， 设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向 进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。',
    analysis: 'fasdkfj;lqre',
    options: ['aaaaaaa', 'bbbbbbbb', 'ccccccc', 'ddddddddd'],
    answers: ['aaaaaaa'],
    user_profile: {
      name: "小黄帽姑娘",
      portrait: ""
    },
    created_at: '',
  },
  {
    id: 2,
    type: 2,
    level: 2,
    use: 2,
    desc: '在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱， 设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向 进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。',
    analysis: 'fasdkfj;lqre',
    answers: [0],
    user_profile: {
      name: "小黄帽姑娘",
      portrait: ""
    },
    created_at: '',
  },
  {
    id: 3,
    type: 3,
    level: 3,
    use: 1,
    desc: '在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱， 设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向 进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。',
    analysis: 'fasdkfj;lqre',
    answers: ['填空答案1','填空答案2'],
    user_profile: {
      name: "小黄帽姑娘",
      portrait: ""
    },
    created_at: '',
  },
  {
    id: 4,
    type: 4,
    level: 1,
    use: 2,
    desc: '在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱， 设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向 进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。',
    analysis: 'fasdkfj;lqre',
    answers: ['导致不同对齐的原因：有时候你希望能降低人们速度，使他们有时间进行深思熟虑。也可能受到屏幕显示的限制，要求表单纵向或者横向空间最小化。也可能由 于本地化需要，表单要适应不同长度的多种语言。所以标签顶对齐、左对齐或者右对齐的正确答案取决于这些及其他更多因素。'],
    user_profile: {
      name: "小黄帽姑娘",
      portrait: ""
    },
    created_at: '',
  },
  {
    id: 5,
    type: 5,
    level: 2,
    use: 1,
    desc: '在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱， 设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向 进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。',
    analysis: 'fasdkfj;lqre',
    user_profile: {
      name: "小黄帽姑娘",
      portrait: ""
    },
    created_at: '',
  },
  {
    id: 61,
    type: 6,
    level: 3,
    use: 2,
    desc: '在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱， 设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向 进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。',
    analysis: 'fasdkfj;lqre',
    user_profile: {
      name: "小黄帽姑娘",
      portrait: ""
    },
    created_at: '',
  },
  {
    id: 7,
    type: 7,
    level: 1,
    use: 1,
    desc: '在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱， 设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向 进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。',
    analysis: 'fasdkfj;lqre',
    user_profile: {
      name: "小黄帽姑娘",
      portrait: ""
    },
    created_at: '',
  },
])
const checkedNum = computed(() => {
  let i = 0
  questionListData.forEach((v: any) => {
    v.checked ? i++ : ''
  })
  return i
})

// 搜索
const searchInfo = reactive({
  keyWord: '',
  type: '',
  level: '',
  use: '',
  knowledge: []
})
const resetKeyword = ref<boolean>(false)  // 重置keyword
const searchFn = (key?: string) => {
  console.log(searchInfo)
  key ? searchInfo.keyWord = key:''
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
  let path=''
  createQuestionTypeList.forEach((v => {
    if (v.key === key){
      name = v.name
      path=v.path
    }
  }))
  router.push ({
    path:path,
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
  questionListData.forEach((v: any) => {
    e.target.checked ? v.checked = true :v.checked = false
  })
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
function menuClick(type:string) {
  console.log(type)
  switch (type) {
    case 'edit':
      
      break;
    case 'delete':
      
      break;
    case 'public':
      
      break;
    case 'export':
      break;
    case 'move':
      break;
  }
}
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
  // width: var(--center-width);
  // margin: 0 auto;
}
.question-content {
  display: flex;
  width: var(--center-width);
  margin: 0 auto;
  justify-content: space-between;
  margin-top: 24px;
  .left {
    width: 240px;
    height: 692px;
    background: var(--white);
    border-radius: 10px;
    box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.07); 
    margin-right: 16px;
    .tit {
      margin-top: 16px;
      color: var(--black-85);
      font-size: var(--font-size-16);
      line-height: 22px;
      margin-left: 10px;
    }
    .create-btn {
      height: 24px;
      line-height: 24px;
      margin: 10px;
      text-align: center;
      color: var(--brightBtn);
      background-color: var(--brightBtn-14);
      border-radius: 12px;
    }
  }
  .right {
    flex: 1;
  }
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--white);
  box-shadow: 0px -2px 4px 0px rgba(0,0,0,0.07);
  z-index: 2;
  .bottom {
    padding: 18px 0;
    display: flex;
    width: var(--center-width);
    margin: 0 auto;
    justify-content: space-between;
    .left {
      line-height: 33px;
      .selected-num {
        margin-left: 16px;
      }
    }
    .center {
      .btn {
        margin-right: 16px;
      }
    }
    .right {
      line-height: 32px;
      margin-right: 18px;
    }
  }
}
</style>
