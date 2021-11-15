<template>
  <div class="experiment-tabs">
    <span :class="currentKey === 1 ? 'active' : ''" @click="keyChange(1)"
      >详情</span
    >
    <span :class="currentKey === 2 ? 'active' : ''" @click="keyChange(2)"
      >报告</span
    >
    <span :class="currentKey === 3 ? 'active' : ''" @click="keyChange(3)"
      >习题</span
    >
    <a-button type="primary" @click="prepare">备课</a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref ,inject} from "vue";
import {useRouter,useRoute} from "vue-router"
import {toVmConnect,IEnvirmentsParam} from "src/utils/vncInspect" // 打开虚拟机
export default defineComponent({
  props: ["currentKey"],
  setup(props, { emit }) {
      const router=useRouter()
    const currentKey:any = ref(1);
    const detailInfo: any = inject("detailInfo");
    const routeQuery=useRoute().query
    console.log(routeQuery);
    
    watch(
      () => props.currentKey,
      () => {
          console.log(currentKey.value);
          
        currentKey.value = props.currentKey;
      }
    );

    // 
    function prepare() {
        console.log('准备虚拟机环境')
        console.log(detailInfo);
        
      let param:any= {
        type: "course",
        opType: 'prepare',
        taskId: detailInfo.value.id,
      }
      if (detailInfo.value.task_type.type===4) {
        // webide
        if (detailInfo.value.task_type.programing_type===1) {
          router.push({
            path:'/vm/ace',
            query:{
              type:param.type,
              opType:param.opType,
              taskId:param.taskId,
              routerQuery: JSON.stringify(routeQuery)
            }
          })
        }else{
          // note
          //   router.push({
          //   path:'/vm/notebook',
          //   query:{
          //     type:param.type,
          //     opType:param.opType,
          //     taskId:param.taskId,
          //     routerQuery: JSON.stringify({detailId:detailId,course_id:course_id})
          //   }
          // })
          toVmConnect(router,param,routeQuery)
        }
      }else{
        toVmConnect(router,param,routeQuery)
      }
    }
    function keyChange(key: number) {
      emit("update:currentKey",key)
      emit("change", key);
    }
    return {
      keyChange,
      currentKey,
      prepare
    };
  },
});
</script>

<style lang="less">
.experiment-tabs {
  background: @white;
  margin: 16px 0;
  height: 40px;
  display: flex;
  padding: 0 15px;
  align-items: center;
  > span {
    margin-right: 50px;
    position: relative;
    line-height: 40px;
    padding: 0 15px;
    cursor: pointer;

    &.active {
      color: @theme-color;
      transition: 0.5s;
      &::after {
        position: absolute;
        content: "";
        width: 100%;
        height: 2px;
        background: @theme-color;
        bottom: 0;
        left: 0;
        transition: 0.5s;
      }
    }
  }
  button {
    margin-left: auto;
  }
}
</style>
