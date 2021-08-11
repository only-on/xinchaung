<template>
  <div> <div @click="testemit">测试emit</div></div>
  <div class="map">
    <p v-for="v,k of dataList.content_type" :key="k" @click="fun(v)">{{v}}</p>
  </div>
  <div @click="fun(add)">我是计算{{add}}</div>
  <div>我是父传的值{{number}}</div>
</template>
<script lang="ts">
import { defineComponent ,reactive,ref,toRef,toRefs,watch,computed,shallowReactive, onMounted,getCurrentInstance} from 'vue'
import request from '../api'
import serve from '../request/getRequest.js'
export default defineComponent({
  name:"Test",
  emits:["emitclick"],
  props:['number'],
  setup(props,context) {
    //     方式1
    // import { useRouter } from 'vue-router';
    // const router = useRouter();
    // function goto(){
    //   router.push("/about");
    // }

    // 方式2
    // import router from "../../router/index.js";
    // router.push("/");

    // const data=getCurrentInstance()           全局注册后组件引入  实测可用
    //   const { appContext : { config: { globalProperties } } } = (data as any)
    //   console.log(globalProperties.$router); 
    const state:any=reactive({
      testemit:()=>{
          context.emit("emitclick","1212121")
      },
      list:[1,2,{c:3}],
      fun:(v:any)=>{
        console.log(v);
        v.c?v.c=4:''
        state.num=v.c?v.c:v
        context.emit("emitclick",state.num)
      },
      num:2,
      add:computed(()=>{return state.num*5+'元'}),
      dataList:{}
    })
    onMounted(()=>{
      serve.v(state)           // 传内一个引用类型的字段
      const httpTeacherExperimental=(request as any).teacherExperimental
      // httpTeacherExperimental.getList({param:{init_type:0},bindName:'dataList',concurrent:true})
      // httpTeacherExperimental.getList({param:{init_type:0},bindName:'dataList',concurrent:true}).then((res:any)=>{
      //   console.log(res);
      // })         concurrent:true     同个接口可以并发请求     或者用 await等第一次请求完再下一次
      httpTeacherExperimental.getList({param:{init_type:0}})
      httpTeacherExperimental.getList({param:{init_type:0},concurrent:true,bindName:'dataList'}).then((res:any)=>{
        console.log(res);
      })
    })
  return {...toRefs(state)}
  },
})
</script>
