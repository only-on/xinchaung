<template>
  <div class="navBox" :class=" configuration.showNav ? 'showNavBox' : '' " v-show="configuration.showNav || configuration.tabs.length">
    <div class="crumbs" v-show="configuration.showNav">
      <breadcrumb v-show="configuration.showNav" />
    </div>
    <div class="navList" :class="configuration.tabs.length > 1?'navListTab':''">
      <div :class="['tab', themeClass]">
        <div
          v-for="(v, i) in configuration.tabs" :key="v.name" :class=" ActiveName === v.name || (!ActiveName && i == 0)? configuration.tabs.length > 1 ? 'active activeBor' : 'active single_ellipsis' : '' "
          @click="ActiveName !== v.name ? tabChange(v) : ''"
          :title="v.name"
        >
          {{ v.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  watch,
  inject,
  computed,
} from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
export declare interface ITab {
  name: string;
  componenttype: number;
}

export default defineComponent({
  name: "NavTab",
  props: {
    // tabs: {
    //   required: true,
    //   type: Array,
    //   default: () => [],
    // },
    // current: {
    //   required: false,
    //   type: Number,
    //   default: 0,
    // },
    // configuration:{
    //   required: true,
    //   type: Object,
    //   default: () => {},
    // }
  },
  emits: ["tabSwitch"],
  setup: (props, context) => {
    var configuration: any = inject("configuration");
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const themeClass = ref<string>('theme' + store.state.systemInfo.theme)
    const tabs = reactive(configuration.tabs) as ITab[];
    const activeName: Ref<string> = ref("");
    var updata = inject("updataNav") as Function;

    async function tabChange(item: ITab) {
      // console.log(item)
      if (activeName.value !== item.name) {
        await updateRouter(item.componenttype);
        context.emit("tabSwitch", item.componenttype);
        updata({ ...configuration, componenttype: item.componenttype });
        activeName.value = item.name;
      }
    }
    async function updateRouter(val?: number) {
      const { query, path } = route;
      // console.log(query)
      let NewQuery = { currentTab: val };
      await router.replace({
        path: path,
        query: NewQuery,
      });
      // console.log(route.query)
    }
    async function initData() {
      if (
        configuration.tabs &&
        configuration.tabs.length &&
        configuration.tabs.length > 1
      ) {
        // debugger
        // ?????????????????????currentTab??????    ??????????????????????????????
        const { currentTab } = route.query;
        const SwitchNumber =
          currentTab !== undefined
            ? Number(currentTab)
            : configuration.componenttype
            ? configuration.componenttype
            : 0;
        currentTab !== undefined ? "" : await updateRouter(SwitchNumber);
        //     ???????????????componenttype??????????????????????????????componenttype???0
        const newCurrentTab = route.query.currentTab;
        const newSwitchNumber =
          newCurrentTab !== undefined
            ? Number(newCurrentTab)
            : configuration.componenttype
            ? configuration.componenttype
            : 0;
        await tabChange(configuration.tabs[newSwitchNumber]);
        configuration.componenttype = newSwitchNumber;
        activeName.value = configuration.tabs[configuration.componenttype].name;
      }
    }
    var ActiveName = computed(() => {
      let str = "";
      if (activeName.value !== "") {
        str = activeName.value;
      } else {
        str = configuration.tabs[0].name;
      }
      return str;
    });
    onMounted(() => {
      initData();
    });
    watch(
      () => {
        return configuration.componenttype;
      },
      (val) => {
        if (val === undefined) {
          initData();
        } else {
          configuration.tabs.map((item: any) => {
            if (configuration.componenttype == item.componenttype) {
              activeName.value = item.name;
            }
          });
        }
      },
      {
        deep: true,
      }
    );
    watch(
      () => configuration.tabs,
      () => {
        configuration.tabs.some((item: any) => {
          return activeName.value == item.name;
        })
          ? ""
          : (activeName.value = "");
        if (configuration.tabs.length > 0) {
          configuration.tabs.map((item: any) => {
            if (configuration.componenttype == item.componenttype) {
              activeName.value = item.name;
            }
          });
        }
      }
    );
    watch(()=>{
      //  route
      const { query, path } = route;
      return query.currentTab?query.currentTab:query
      },(val)=>{
      // console.log(val)
      updata({ ...configuration, componenttype:val });
    },{deep:true})
    // ??????????????????
    watch(()=>store.state.systemInfo, newVal => {
      themeClass.value = 'theme'+newVal.theme
    },{deep: true, immediate: true})
    return { activeName, ActiveName, tabChange, configuration, themeClass };
  },
});
</script>
<style scoped lang="less">
.navBox {
  width: var(--center-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 60px;
  justify-content: flex-end;
}
.showNavBox {
  height: 80px;
}
.navList {
  display: flex;
  justify-content: space-between;
  line-height: 36px;
  position: relative;
  // margin-bottom: 20px;
  &.navListTab{
    margin-bottom: -3px;
  }
  .tab {
    display: flex;
    width: 100%;
    div {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      margin-right: 48px;
      color: var(--menu-text);
      font-size: var(--font-size-18);
      // padding-right: 15px;
      border-bottom: 3px solid transparent;
      // padding:0 8px;
      letter-spacing: 0.79px;
      text-align: left;
      cursor: pointer;
      &:hover {
        color: var(--glod-4);
      }
    }
    .active {
      color: var(--menu-active);
      transition: all 0.3s;
        &:hover {
          color: var(--menu-active);
        }
    }
    &.themeC{
      .active {
        color: var(--black-85);
        transition: all 0.3s;
        &:hover {
          color: var(--black-85);
        }
      }
    }
    .activeBor {
      border-bottom: 3px solid var(--primary-color);
    }
  }
  .nav__tab--middle {
    flex: 1;
    display: flex;
    align-items: center;
  }
}
.crumbs {
  flex: 1;
  padding-top: 6px;
}
</style>
