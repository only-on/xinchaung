<template>
  <h2 v-layout-bg>课程资源</h2>
  <div>
    <!-- <Breadcrumb /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,inject,reactive } from 'vue'
import { useRouter,useRoute } from 'vue-router';
import request from '../../api/index'
import { IBusinessResp} from '../../typings/fetch';
import {message } from 'ant-design-vue';
export default defineComponent({
  name: '',
  components: {
   
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    const route = useRoute();
    const http=(request as any).studentCourse
    var configuration:any=inject('configuration')
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:false})
    const {course_id}=route.query
    var par:any=reactive({
      page:1,
      limit:10,
      name:''
    })
    function init(params:any) {
      
      http.getTreeList({urlParams: {courseId: course_id},param:{...par}}).then((res: IBusinessResp)=>{

      })
    }
    onMounted(()=>{
     
    })
    function go(){
      // console.log(path);
      router.push('/Course/ContinueLearning/ContinueLearningSon')
    }
    return { par};
  },
})
</script>

<style scoped lang="less">

</style>
