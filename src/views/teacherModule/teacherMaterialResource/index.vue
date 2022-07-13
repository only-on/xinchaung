<template>
  <search-add
    @searchFn="searchFn"
    @handleMenuClick="handleMenuClick"
    :TypeList="materialTypeList"
    :isShowAdd="true"
    :isReset="resetKeyword"
  ></search-add>
  <classify :list="classifyList" @change="classifyChange"></classify>
  <a-spin :spinning="loading" size="large" tip="Loading...">
    <div class="flex-row-reverse" v-if="currentTab === 1">
      <div class="rest-disk">
        <div class="text">
          <div class="left">剩余可用磁盘</div>
          <div class="right">
            <!-- <span class="usable">30GB可用</span>
            <span class="total">共100GB</span> -->
            <span class="usable">{{mountInfo.un_used}}可用</span>
            <span class="total">共{{mountInfo.total}}</span>
          </div>
        </div>
        <div class="progress">
          <div class="progress-inner" :style="{ width: mountInfo.used_accuracy }"></div>
        </div>
      </div>
    </div>
    <div class="mainBox">
      <div
        class="item flexCenter pointer"
        v-for="(list, k) in materialList"
        :key="list.id"
        :style="{ marginRight: !((k + 1) % 4) ? 0 : '24px' }"
        @click="detail(list)"
      >
        <div class="item-top" :style="list.cover?`background-image: url('${encodeURI(list.cover)}');`:defaultCover">
          <div class="labels">
            <span>{{(list.tags && list.tags.length)?`${list.tags.join(' / ')}`:''}}</span>
          </div>
        </div>
        <div class="item-content">
          <div class="item-name single_ellipsis" :title="list.name">{{ list.name }}</div>
          <div class="item-desc">
            <span class="type">{{ list.type_name }}</span>
            <span class="desc single_ellipsis" :title="list.description">{{ list.description }}</span>
          </div>
          <div class="user-num">
            <div class="user" v-if="currentTab === 0 && list.user">
              <img :src="list.user.avatar||defaultAvatar" alt="" srcset="" />
              <span class="name" :title="list.username">{{list.username}}</span>
            </div>
            <div class="num-size">
              <span class="num">数量 {{ list.item_count }}</span>
              <span class="size">大小 {{ list.item_size }}</span>
            </div>
          </div>
        </div>
      </div>
      <Empty v-if="!materialList.length && !loading" :type="EmptyType" />
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
import classify from "src/components/classify/index.vue";
import searchAdd from "src/components/searchAdd/searchAdd.vue";
import { bytesToSize } from "src/utils/common"
import extStorage from "src/utils/extStorage";
import defaultCover from 'src/assets/images/teacherMaterialResource/defaultCover.jpg'
import defaultAvatar from 'src/assets/images/user/admin_p.png'
const router = useRouter();
const route = useRoute();
const http = (request as any).teacherMaterialResource;
const datasetHttp = (request as any).dataSet;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [
    { name: "公开素材", componenttype: 0 },
    { name: "我的素材", componenttype: 1 },
  ],
  showContent: true,
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
const EmptyType:any=computed(()=>{
  let str=''
  if(searchKey.value === '' && tag.value === ''){
    str= 'empty'
  }else{
    str= 'searchEmpty'
  }
  return str
})
const handleMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: "/teacher/teacherMaterialResource/createMaterial",
    query: { key },
  });
};
const materialTypeList = reactive([
  { name: "数据集", key: "dataSet" },
  { name: "视频目录", key: "videoDirectory" },
  { name: "实验文档", key: "documentDirectory" },
  { name: "课件目录", key: "coursewareDirectory" },
  { name: "备课资料目录", key: "lessonDirectory" },
  { name: "教学指导目录", key: "guidanceDirectory" },
]);

const loading = ref<boolean>(false);
const pageInfo = reactive({
  page: 1,
  limit: 12,
});
const pageTotal = ref<number>(0);
const pageChange = (page: number) => {
  pageInfo.page = page;
  initData();
};
const detail=(val:any)=>{
  let query:any={
    currentTab:currentTab.value,
    editId: val.slab_uid ? val.slab_uid: val.id,
    type:val.type_name,
    cardType: val.slab_uid ? 'setData':'other',
    user_id: uid
  }
  if(val.type==1){
    router.push({
      path:'/teacher/teacherMaterialResource/setDataDetail',
      query:{
        ...query,  
        avatar: val.user.avatar,
        username: val.username
      }
    })
  }else{
    router.push({
      path:'/teacher/teacherMaterialResource/ResourceDetail',
      query:{...query}
    })
  }
  
}
const currentTab = ref<number>(0);
watch(
  () => {
    return configuration.componenttype;
  },
  (val) => {
    currentTab.value = Number(val);
    pageInfo.page = 1
    searchKey.value = ''
    labelSearch.label = 0
    labelSearch.type = 0
    classifyList[0].value = 0
    classifyList[1].value = 0
    resetKeyword.value = !resetKeyword.value
    initData();
    // getLabelsList()
    // getTypeList()
    // getMountInfo()
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
  materialList.length = 0
  tag.value = !labelSearch.type ? 
      (!labelSearch.label ? '' : labelSearch.label) : 
      (!labelSearch.label ? labelSearch.type : labelSearch.type + ',' + labelSearch.label)
  const param = {
    name: searchKey.value,
    is_public: currentTab.value ? 0 : 1,  // 1公开 0私有
    tags: tag.value,
    ...pageInfo,
  };
  // if (labelSearch.type === '数据集') {
  //   http.getDatasetsUidList({param}).then((res: IBusinessResp) => {
  //     if (!res) return
  //     // console.log(Object.values(res.data.list))
  //     http.getDataSetsList({param: {datasets: Object.values(res.data.list)}}).then((res: any) => {
  //       // console.log(res)
  //       if (!res) return
  //       const { data, total} = res
  //       // data.forEach((v: any) => {
  //       //   v.id = v.uid
  //       //   v.item_count = v.amount
  //       //   v.item_size = v.size
  //       //   v.tags = v.labels?.map((v: any) => v.name)
  //       //   v.type_name = '数据集'
  //       //   v.username = v.username ? v.username : 'teach'
  //       //   v.avatar = v.cover ? v.cover : 'src/assets/images/user/teacher_p.png'
  //       // })
  //       materialList.push(...data);
  //       pageTotal.value = total;
  //     })
  //   })
  //   return
  // }
  http.dataSets({ param }).then((res: any) => {
    if (!res) return
    const { list, page } = res.data;
    // list.forEach((v: any) => {
    //   // v.item_size = bytesToSize(v.item_size)
    // })
    materialList.push(...list);
    pageTotal.value = page.totalCount;
  });
};
onMounted(() => {
  if (!Number(route.query.currentTab)) {
    currentTab.value = 0
    configuration.componenttype = 0
  } else {
    currentTab.value = 1
    configuration.componenttype = 1
  }
  getLabelsList()
  getTypeList()
  getMountInfo()
})

// 获取挂载分区信息
const mountInfo = reactive({
  "mounted_on": "/professor", // 分区挂载目录
  "total": "100GB", //  总大小
  "un_used": "50GB", // 未使用
  "used": "411MB", // 已使用
  "used_accuracy": "50%" // 使用率

})
const getMountInfo = () => {
  http.getMountInfo().then((res: IBusinessResp) => {
    if (!res) return
    Object.assign(mountInfo, res.data)
  })
}
// 标签
const classifyList: any = reactive([
  {
    title: "类型",
    value: 0,
    keyName: "type",
    data: [
      { name: "全部", value: 0 },
    ],
  },
  {
    title: "标签",
    value: 0,
    keyName: "label",
    data: [
      { name: "全部", value: 0 },
    ],
  },
]);
const classifyChange = (obj: any) => {
  Object.assign(labelSearch, obj);
  pageInfo.page = 1
  // searchFn();
  initData()
};
const labelSearch: {type: any, label: any} = reactive({
  type: 0,
  label: 0,
});
const getLabelsList = () => {
  http.getLabelsList().then((res: IBusinessResp) => {
    if (!res) return
    const data = res.data
    data.forEach((v: any) => {
      v.value = v.name
    })
    classifyList[1].data.push(...data)
  })
}
const getTypeList = () => {
  http.getTypeList().then((res: IBusinessResp) => {
    if (!res) return
    const data = res.data
    data.forEach((v: any) => {
      v.value = v.name
    })
    classifyList[0].data.push(...data)
  })
}
</script>

<style lang="less" scoped>
.mainBox {
  // flex-wrap: wrap;
  // justify-content: space-between;
  .item {
    width: 282px;
    height: 265px;
    margin-bottom: 27px;
    margin-right: 24px;
    display: inline-block;
    // background: var(--white-70);
    background: var(--white);
    border-radius: 6px;
    box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.07); 
    &:hover {
      box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
    }
    &-top {
      height: 150px;
      position: relative;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      display: flex;
      align-items: flex-end;
      .labels {
        width: 100%;
        padding: 1px 6px;
        background: var(--black-5);
        font-size: var(--font-size-sm);
        color: var(--white-85);
      }
    }
    &-content {
      padding: 10px 8px;
    }
    &-name {
      font-size: var(--font-size-16);
      color: var(--black-85);
      margin-bottom: 8px;
    }
    &-desc {
      height: 31px;
      line-height: 20px;
      display: flex;
      padding-bottom: 11px;
      border-bottom: 1px solid #f0f0f0;
      .type {
        display: inline-block;
        padding: 0 7px;
        background: var(--primary-color);
        border-radius: 2px;
        font-size: var(--font-size-sm);
        color: var(--white-100);
        margin-right: 4px;
      }
      .desc {
        flex: 1;
        color: var(--black-45);
        vertical-align: middle;
      }
    }
    .user-num {
      height: 20px;
      line-height: 20px;
      margin-top: 13px;
      display: flex;
      justify-content: space-between;
      color: var(--black-45);
      .user {
        img {
          width: 20px;
          height: 20px;
          // background-color: pink;
          margin-right: 4px;
        }
        .name {
          display: inline-block;
          max-width: 56px;
          word-break: normal;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          vertical-align: middle;
        }
      }
      .num-size {
        .num {
          margin-right: 16px;
        }
      }
    }
  }
}
.rest-disk {
  width: 282px;
  display: flex;
  flex-direction: column;
  font-size: var(--font-size-sm);
  color: var(--black-65);
  margin-bottom: 16px;
  .text {
    display: flex;
    justify-content: space-between;
    .usable {
      color: var(--brightBtn);
    }
  }
  .progress {
    width: 100%;
    height: 4px;
    background: #f3f3f3;
    border-radius: 2px;
    &-inner {
      width: 200px;
      height: 100%;
      background: var(--brightBtn);
      border-radius: 2px;
    }
  }
}
.flex-row-reverse {
  display: flex;
  flex-direction: row-reverse;
}
</style>
