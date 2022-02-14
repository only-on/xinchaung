<template>
  <div class="reference">
    <div class="addBox">
      <div class="add flexCenter">
        <a-input-search
          class="greenSearch"
          v-model:value="search.key"
          placeholder="请输入关键字查询"
          @search="searchFn"
        />
        <a-dropdown>
          <span class="addCircular iconfont icon-tianjia"></span>
          <template #overlay>
            <a-menu class="menu__group">
              <a-menu-item>
                <div @click="select()">本地上传</div>
              </a-menu-item>
              <a-menu-item>
                <div @click="select()">在线制作</div>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </div>
  <classify ref="classifyV" :list="classifyList"></classify>
  <a-spin :spinning="loading" size="large" tip="Loading...">
    <div class="flexCenter mainBox">
      <div class="item">
        <div class="left">
          <div class="img">
            <div class="type">镜像类型：KVM</div>
            <div class="type">架构信息：X86</div>
          </div>
          <div>内置镜像</div>
        </div>
        <div class="right">
          <div class="name">镜像名称</div>
          <div class="labels">
            <span>标签1</span><span>标签1</span><span>标签1</span>
          </div>
          <div class="text">
            在 UI
            设计中，如何完美的避开问题、把按钮设计的更好，是每个设计师需要深思的问题。按钮设计的好坏，将直接关系着用户引流、触发行动、产品转化率等至关重要的问题。
          </div>
          <div class="caoZuo">
            <span>复制</span><span>删除</span><span>编辑</span>
          </div>
        </div>
      </div>
      <Empty v-if="!list.length && !loading" />
      <a-pagination
        v-if="totalCount > 11"
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

/**
 * 标签操作
 */
const classifyV = ref();
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
const labelSearch = computed(() => {
  return classifyV.value && classifyV.value.labelObj;
});

const search: any = reactive({
  key: "",
});
const searchFn = () => {
  let obj = {
    ...labelSearch.value,
    ...search,
  };
  console.log(obj);
  initData();
};
/**
 * 添加
 */
const select = () => {};
const initData = () => {
  // http.getList()
};
/**
 * 列表
 */
const fromData: any = reactive({
  limit: 10,
  page: 1,
});
var list: any[] = reactive([]);
var loading: Ref<boolean> = ref(false);
var totalCount: Ref<number> = ref(0);
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
  initData();
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
}
</style>
