<template>
  <div class="navList" :class="configuration.tabs && configuration.tabs.length?'border_bottom':''">
    <div class="tab">
      <div
        v-for="v in configuration.tabs"
        :key="v.name"
        :class="activeName === v.name ? 'active' : ''"
        @click="activeName !== v.name ? tabChange(v) : ''"
      >
        {{ v.name }}
      </div>
    </div>
    <div class="nav__tab--middle">
      <slot></slot>
    </div>
    <breadcrumb :type="configuration.navType" />
  </div>
</template>

<script lang="ts">
import { number } from "echarts";
import { defineComponent, ref, onMounted, reactive, Ref, watch ,inject, computed} from "vue";
import { useStore } from "vuex";
import { useRouter ,useRoute } from 'vue-router';
import { log } from "util";
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
    var configuration:any=inject('configuration')
    const router = useRouter();
    const route = useRoute();
    const tabs = reactive(configuration.tabs) as ITab[];
    const activeName: Ref<string> = ref("");
    var updata=inject('updataNav') as Function
      
    function tabChange(item: ITab) {
      // console.log(item)
      if(activeName.value!==item.name){
        context.emit("tabSwitch", item);
        activeName.value = item.name;
        updateRouter(item.componenttype);
        updata({...configuration,componenttype:item.componenttype})
      }
    }
    function updateRouter(val?:number){
      const {query,path}= route
      router.replace({
            path: path,
            query: {...query, currentTab: val },
       })
    }
    function initData(){
      if(configuration.tabs && configuration.tabs.length){
        const { currentTab } = route.query
        updateRouter(currentTab?Number(currentTab):0)
        configuration.componenttype=currentTab?Number(currentTab):0
        activeName.value =configuration.tabs[configuration.componenttype].name
        tabChange(configuration.tabs[configuration.componenttype])
      }
    }
    onMounted(() => {
      initData()
    });
    watch(configuration, (val) => {
    
    });
    return { activeName, tabChange ,configuration};
  },
});
</script>

<style scoped lang="less">
.navList {
  width: 1330px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  line-height: 43px;
  // padding: 16px 0;
  .tab {
    display: flex;
    div {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      margin-right: 15px;
      color: #444;
      font-size: 16px;
      padding: 0 15px;
      text-align: center;
      cursor: pointer;
      &:hover {
        color: #999;
      }
    }
    .active {
      background: @primary-color;
      color: #fff;
      &:hover {
        color: #fff;
      }
    }
  }
  .nav__tab--middle {
    flex: 1;
    display: flex;
    align-items: center;
  }
}
.border_bottom{
  border-bottom: 1px solid #d0d0d0;
}
</style>
