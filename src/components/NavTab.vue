<template>
  <div class="navList" :class="configuration.tabs && configuration.tabs.length?'border_bottom':''">
    <div class="back" v-if="configuration.backOff || configuration.showPageEdit">
      <a-button v-if="configuration.backOff" @click="back" type="primary">返回</a-button>
      <a-button v-if="configuration.showPageEdit" @click="pageEdit" type="primary">编辑</a-button>
    </div>
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
// import { number } from "echarts";
import { defineComponent, ref, onMounted, reactive, Ref, watch ,inject, computed} from "vue";
import { useStore } from "vuex";
import { useRouter ,useRoute } from 'vue-router';
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
      
    async function tabChange(item: ITab) {
      // console.log(item)
      if(activeName.value!==item.name){
        context.emit("tabSwitch", item.componenttype);
        await updateRouter(item.componenttype);
        activeName.value = item.name;
        updata({...configuration,componenttype:item.componenttype})
      }
    }
    function pageEdit(){
      configuration.pageEdit()
    }
    async function  updateRouter(val?:number){
      const {query,path}= route
      // console.log(query)
      let Newquery={currentTab: val}
      await router.replace({
            path: path,
            query: Newquery,
      })
      // var query2= route.query
      // console.log(query2)
    }
    async function initData(){
      if(configuration.tabs && configuration.tabs.length){
        // 页面首次进入加currentTab参数    原地刷新则不刷新路由
        const { currentTab } = route.query
        const SwitchNumber=currentTab?Number(currentTab):(configuration.componenttype?configuration.componenttype:0)
        currentTab?'':await updateRouter(SwitchNumber)
        //     用户指定了componenttype时使用指定的，否则加componenttype为0
        const newCurrentTab= route.query.currentTab
        const newSwitchNumber=newCurrentTab?Number(newCurrentTab):(configuration.componenttype?configuration.componenttype:0)
        await tabChange(configuration.tabs[newSwitchNumber])
        configuration.componenttype=newSwitchNumber
        activeName.value =configuration.tabs[configuration.componenttype].name
        
      }
    }
    function back(){
      router.go(-1)
    }
    onMounted(() => {
      initData()
    });
    watch(configuration, (val) => {
      // initData()
    });
    watch(()=>{return configuration.componenttype}, (val) => {
      if(val===undefined){
        initData()
      }
    });
    return { activeName, tabChange ,back,pageEdit,configuration};
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
  margin-bottom: 20px;
  .tab {
    display: flex;
    div {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      margin-right: 15px;
      color: #ffffffb3;
      font-size: 16px;
      padding: 0 15px;
      text-align: center;
      cursor: pointer;
      &:hover {
        color: @theme-color;
      }
    }
    .active {
      background: @primary-color;
      color: #fff;
      transition: all .3s;
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
  border-bottom: 1px solid #765e8b;
}
.back{
  margin-bottom: -16px;
  .ant-btn-primary{
    margin-right: 16px;
  }
}
</style>
