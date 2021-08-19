<template>
  <div class="content">
    <NavTab :tabs="tabs" @tabSwitch="tabSwitch" />
    <div class="content_box">
      <component :is="componentName" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive, toRefs } from 'vue'
import LatelyExperimentalList from './LatelyExperimentalList.vue'
import MyExperimentalList from './MyExperimentalList.vue'
import {useStore} from "vuex"
interface Iitem{
  name:string,
  componentName:string,
  path:string,
}
interface state{
    tabs:Array<TtabItem>,
    componentName:string,
    breadcrumbArr: Array<Tbreadcrumb>,
    tabSwitch:(item:Iitem)=>void
}
type TtabItem =Pick<Iitem,'name' | 'componentName'>
type Tbreadcrumb=Omit<Iitem,'componentName'>

export default defineComponent({
  name: '',
  components: {
   MyExperimentalList,
   LatelyExperimentalList
  },
  setup: (props,context) => {
    const state:state=reactive({
      tabs:[{name:'最近实训',componentName:'LatelyExperimentalList'},{name:'我的实训',componentName:'MyExperimentalList'}],
      breadcrumbArr:[{name:'首页',path:'/'},{name:'我的实训',path:'/Experimental/ExperimentalList'}],
      componentName:'LatelyExperimentalList',
      tabSwitch:(item:any)=>{
        state.componentName=item.componentName
      }
    })
    const store=useStore()
    onMounted(()=>{
      // console.
      // store.commit('saveBreadcrumb',state.breadcrumbArr)
    })
    return {...toRefs(state)};
  },
})
</script>

<style scoped lang="less">
  .content{
    width: @Edition-Center;
    margin: 20px auto 0;
    background: #fff;
    height: 100%;
    .content_box{
      width: 100%;
      margin-bottom: 20px;
      background: #fff;
      box-shadow: 0px 0 3px 3px rgb(0 0 0 / 10%);
      border-radius: 3px;
      padding: 10px;
      margin-top: 20px;
      height: calc(100% - 102px);
      overflow: auto;
    }
  }
</style>
