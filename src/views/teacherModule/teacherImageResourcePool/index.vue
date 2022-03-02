<template>
  <search-add
    @searchFn="searchFn"
    @handleMenuClick="handleMenuClick"
    :TypeList="ExperimentTypeList"
    :isShowAdd="true"
  ></search-add>
  <classify :list="classifyList" @change="classifyChange"></classify>
  <a-spin :spinning="loading" size="large" tip="Loading...">
    <div class="flexCenter mainBox">
      <div class="item flexCenter" v-for="(v, k) in 6" :key="v">
        <div class="left">
          <div class="img" :class="k % 2 === 0 ? 'KVMImg' : ''">
            <div class="type">镜像类型：KVM</div>
            <div class="type">架构信息：X86</div>
          </div>
          <div class="Belonging" :class="k % 2 === 0 ? 'myImg' : ''">
            内置镜像
          </div>
        </div>
        <div class="right">
          <div class="name">镜像名称</div>
          <div class="labels flexCenter">
            <span class="ellipsis">镜像标签1</span><span>标签1</span
            ><span>标签1</span>
          </div>
          <div class="text ellipsis">
            在 UI
            设计中，如何完美的避开问题、把按钮设计的更好，是每个设计师需要深思的问题。按钮设计的好坏，将直接关系着用户引流、触发行动、产品转化率等至关重要的问题。把按钮设计的更好，是每个设计师需要深思的问题。按钮设计的好坏，将直接关系着用户引流、触发行动
          </div>
          <div class="caoZuo flexCenter">
            <span>复制</span><span>删除</span><span>编辑</span>
          </div>
        </div>
      </div>
      <!-- <Empty v-if="!list.length && !loading" /> -->
      <a-pagination
        v-if="totalCount > 6"
        v-model:current="fromData.page"
        :pageSize="fromData.limit"
        :total="totalCount"
        @change="pageChange"
      />
    </div>
  </a-spin>
</template>
<script lang="ts" setup>
import classify from "src/components/classify/index.vue";
import searchAdd from "src/components/searchAdd/searchAdd.vue";
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  computed,
  toRefs,
  watch,
  defineExpose,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
const router = useRouter();
const route = useRoute();
const { editId } = route.query;
const http = (request as any).teacherImageResourcePool;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "镜像资源库", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: false,
});
const ExperimentTypeList = reactive([
  { name: "本地上传", key: "local" },
  { name: "在线制作", key: "Online" },
]);
const handleMenuClick = (val: any) => {
  // console.log(val);
  if (val.key === "local") {
    router.push("/teacher/teacherImageResourcePool/localCreated");
  } else {
    router.push("/teacher/teacherImageResourcePool/OnlineMake");
  }
};
/**
 * 标签操作
 */
const classifyList: any = reactive([
  {
    title: "镜像属性",
    value: 0,
    keyName: "type",
    data: [
      { name: "全部", value: 0 },
      { name: "内置镜像", value: 1 },
      { name: "我的镜像", value: 2 },
    ],
  },
  {
    title: "镜像标签",
    value: 0,
    keyName: "label",
    data: [
      { name: "全部", value: 0 },
      { name: "数据标注", value: 1 },
      { name: "目标监测", value: 2 },
      { name: "数据标注", value: 3 },
      { name: "目标监测", value: 4 },
    ],
  },
]);
const classifyChange = (obj: any) => {
  Object.assign(labelSearch, obj);
  // console.log(labelSearch)
  searchFn(search.key);
};
const labelSearch = reactive({
  type: 0,
  label: 0,
});

const search: any = reactive({
  key: "",
});
const searchFn = (key: string) => {
  fromData.page = 1;
  search.key = key;
  let obj = {
    ...labelSearch,
    ...search,
    ...fromData,
  };
  // console.log(obj);
  initData();
};
/**
 * 添加
 */

const initData = () => {
  loading.value = true;
  http.getList().then((res: IBusinessResp) => {
    // list.push(...res.data);
    loading.value = false;
  });
};
/**
 * 列表
 */
const fromData: any = reactive({
  limit: 6,
  page: 1,
});
var list: any[] = reactive([]);
var loading: Ref<boolean> = ref(false);
var totalCount: Ref<number> = ref(7);
const pageChange = async (current: any, pageSize: any) => {
  fromData.page = current;
  const { query, path } = route;
  await router.replace({
    path: path,
    query: { ...query, page: current },
  });
  initData();
};

onMounted(() => {
  // initData();
});
</script>
<style scoped lang="less">
.reference {
  position: fixed;
  width: 100%;
  top: 110px;
  left: 0;
  height: 50px;
  .addBox {
    width: var(--center-width);
    margin: 0 auto;
    .add {
      justify-content: end;
      .addCircular {
        margin-left: 20px;
      }
    }
  }
}
.mainBox {
  flex-wrap: wrap;
  justify-content: space-between;
  .item {
    width: 580px;
    height: 200px;
    margin-bottom: 2rem;
    .left {
      .img {
        border-radius: 14px 0px 0px 0px;
        height: 176px;
        width: 140px;
        background: url("src/assets/images/cover2.png") no-repeat;
        background-size: 100% 100%;

        display: flex;
        flex-direction: column;
        justify-content: end;
        .type {
          width: 100%;
          text-align: center;
          color: var(--white);
          margin-bottom: 6px;
        }
      }
      .KVMImg {
        background: url("src/assets/images/bg1.jpg") no-repeat;
        background-size: 100% 100%;
      }
      .Belonging {
        height: 24px;
        background: rgba(0, 0, 0, 0.25);
        border-radius: 0px 0px 0px 14px;
        text-align: center;
        color: var(--white-65);
      }
      .myImg {
        color: var(--white-70);
      }
    }
    .right {
      padding: 16px;
      .name {
        color: var(--black-85);
        font-size: var(--font-size-16);
        letter-spacing: 1.6px;
      }
      .labels {
        margin: 10px 0;
        span {
          display: inline-block;
          width: 92px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          color: var(--brightBtn);
        }
      }
      .text {
        height: 67px;
        line-height: 24px;
        letter-spacing: 0.98px;
        color: var(--black-65);
        -webkit-line-clamp: 3;
      }
      .caoZuo {
        height: 44px;
        justify-content: end;
        span {
          // display: none;
          color: var(--primary-color);
          cursor: pointer;
          padding: 0 16px;
        }
      }
    }
  }
}
</style>
