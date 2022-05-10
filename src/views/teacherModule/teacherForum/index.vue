<template>
  <div class="forumn">
    <search-add
      v-if="role === 2"
      @handleMenuClick="handleMenuClick"
      :TypeList="ExperimentTypeList"
      :isShowAdd="true"
      :isShowSearch="false"
    ></search-add>
    <!-- <a-button type="primary" shape="round" size="large">确定</a-button>
    <a-button type="primary" shape="round" size="middle">确定</a-button>
    <a-button type="primary" shape="round" size="small">取消</a-button> -->
    <component :is="componentName" :componentName="componentName" />
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
  markRaw,
} from "vue";
import ForumSquare from "./ForumSquare.vue";
import MyPosts from "./MyPosts.vue";
import { useRouter, useRoute } from "vue-router";
import { ILabel } from "./forumnTyping.d";
import ForumnTop from "./components/ForumnTop.vue";
import extStorage from "src/utils/extStorage";
import searchAdd from "src/components/searchAdd/searchAdd.vue";
const route = useRoute();
const router = useRouter();
const componentNames = [markRaw(ForumSquare), markRaw(MyPosts), markRaw(MyPosts)];
const { lStorage } = extStorage;
const role = lStorage.get("role") || 3;
const tabs = [
  { name: "论坛广场", componenttype: 0 },
  // { name: "我的帖子", componenttype: 1 },
];
role === 2 ? tabs.push({ name: "帖子管理", componenttype: 2 }):tabs.push({ name: "我的帖子", componenttype: 1 })
var componentName: any = ref(ForumSquare);

var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: tabs,
  showContent: false,
  componenttype: undefined,
  showNav: true,
});

watch(
  () => {
    return configuration.componenttype;
  },
  (val) => {
    componentName.value = componentNames[val];
  }
);

// watch(
//   () => {
//     return route.query.currentTab;
//   },
//   (val: any) => {
//     componentName.value = componentNames[val];
//   },
//   { immediate: true }
// );
onMounted(() => {});
const ExperimentTypeList = reactive([
  { name: "发布公告", key: "desktop" }
])
const handleMenuClick = ({ key }: { key: string }) => {
  router.push("/teacher/teacherForum/CreatePosts");
};
</script>

<style scoped lang="less">
.forumn {
  /*width: var(--center-width);
  height: 100%;
  margin: 0 auto;*/
  background-color: var(--lightgray-1);
  min-height: 749px;
  color: var(--black-65);
}
</style>
