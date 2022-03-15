<template>
  <div class="forumn">
    <!-- <a-button type="primary" shape="round" size="large">确定</a-button>
    <a-button type="primary" shape="round" size="middle">确定</a-button>
    <a-button type="primary" shape="round" size="small">取消</a-button> -->
    <component :is="componentName" :componentName="componentName" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  watch,
  provide,
} from "vue";
import ForumSquare from "./ForumSquare.vue";
import MyPosts from "./MyPosts.vue";
import { useRouter, useRoute } from "vue-router";
import { ILabel } from "./forumnTyping.d";
import ForumnTop from "./components/ForumnTop.vue";
export default defineComponent({
  name: "",
  components: {
    ForumSquare,
    MyPosts,
    ForumnTop,
  },
  setup: (props, { emit }) => {
    const route = useRoute();
    const componentNames = ["ForumSquare", "MyPosts"];
    const tabs = [
      { name: "论坛广场", componenttype: 0 },
      { name: "我的帖子", componenttype: 1 },
    ];
    var componentName: Ref<string> = ref("ForumSquare");

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
    onMounted(() => {});
    return { componentName, tabs };
  },
});
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
