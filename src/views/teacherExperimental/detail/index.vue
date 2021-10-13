<template>
  <div class="editExperimental" v-layout-bg>
    <div class="top-info">
        <div class="info-left">
          <img :src="trainDetailInfo.url?trainDetailInfo.url:defaultImg">
        </div>
        <div class="info-right">
          <div>
            <div>{{trainDetailInfo.name}}</div>
            <div>
              课时数：{{trainDetailInfo.train_time}}
            </div>
            <div>
              实验数：{{trainDetailInfo.vm_type}}
            </div>
            <div>
              实训时间：{{trainDetailInfo.start_time}}-{{trainDetailInfo.end_time}}
            </div>
          </div>
          <a-button type="primary" @click="goback"><span class="iconfont icon-fanhui"></span> 返回</a-button>
        </div>
    </div>
    <a-tabs type="card" default-active-key="0" @change="callback">
        <a-tab-pane v-for="item in componentsNames" :key="item.key" :tab='item.textname'></a-tab-pane>
    </a-tabs>
    <component :is="componentName" :trainDetailInfo='trainDetailInfo' />
  </div>
</template>
<script lang="ts">
import { defineComponent,onMounted,inject,reactive,toRefs,ref} from 'vue'
import { useRoute } from "vue-router";
import request from 'src/api/index'
import basicInfo from './basicInfor/index.vue'
import trainingGuide from './trainingGuide/index.vue'
interface State{
  trainDetailInfo:any,
  componentName:string
}
export default defineComponent({
  name:'editExperimental',
  components:{basicInfo,trainingGuide},
  setup() {
    let router = useRoute();
    const http=(request as any).teacherExperimental
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true,backOff:false,showPageEdit:false})
     const state:State=reactive({
       trainDetailInfo:"",
       componentName:''
     })
    onMounted(()=>{
      console.log(router.query.id)
      const id=router.query.id
      http.trainDetailInfo({param:{train_id:id}}).then((res:any)=>{
        state.trainDetailInfo=res.datas
      })
    })
    const componentsNames=ref([{key:0,textname:'基础信息',name:'basicInfo'},{key:1,textname:'实训指导',name:'trainingGuide'}])
    const methods={
      goback(){
        window.history.go(-1)
      },
      callback(key:any){
        state.componentName=componentsNames.value[key].name
      }
    }
    return {...toRefs(state),...methods,componentsNames,defaultImg: '/src/assets/images/Experimental/wlkc.png'}
  },
})
</script>
<style lang="less" scoped>
.top-info{
  display: flex;
  width: 100%;
  margin-bottom: 10px;
  .info-left{
    width:290px;
  }
  .info-right{
    display: flex;
    justify-content: space-between;
    flex: 1;
  }
}
</style>
