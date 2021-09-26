<template>
  <div>
    创建试卷
  </div>
</template>
<script lang="ts">
import { defineComponent,ref, onMounted,reactive,Ref,inject } from 'vue'
import { useRouter } from 'vue-router';
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch.d';
interface IlistItem{

}
interface IforumSearch{
  title:string,
  type:string | '' ,
  page:number
}
export default defineComponent({
  name: '',
  components: {
   
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    var list:IlistItem[]=reactive([])
    var loading:Ref<boolean> =ref(false)
    const http=(request as any).teacherExam
    const ForumSearch:IforumSearch=reactive({
      title:'',
      type:'',
      page:1
    })
    function initData(){
      loading.value=true
      http.TestPaper().then((res:IBusinessResp)=>{
        //  console.log(res)
        loading.value=false
        list.push(...res.data)
        
      })
    }
    function search(){

    }
    var updata=inject('updataNav') as Function

    onMounted(()=>{
    //  initData()
    })
    return {list,loading,ForumSearch,search};
  },
})
</script>
<style  scoped lang="less">

</style>