<template>
  <div class="train-coursewar">
    <iframe v-if="isNoData" class="train-coursewar-pdf" :src="pdfUrl" frameborder="0"></iframe>
    <div v-else>
      <empty/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref,inject ,watch} from "vue";
import empty from "src/components/Empty.vue"
export default defineComponent({
  components:{
    empty
  },
  setup() {
    const pdfUrl = ref("");
    const allInfo:any= inject("allInfo")
    // pdfUrl.value = "/public/pdfjs-2.5.207/web/viewer.html?file=''";
    const env=process.env.NODE_ENV==="development"?true:false
    console.log(env);
    const isNoData=ref(false)
    watch(()=>allInfo.value.base_info.courseware,()=>{
      console.log(allInfo.value.base_info.courseware);
      if (allInfo.value.base_info.courseware) {
        isNoData.value=true
        pdfUrl.value=env?"/public/pdfjs-2.5.207/web/viewer.html?file="+'/proxyPrefix'+allInfo.value.base_info.courseware:"/frontend/public/pdfjs-2.5.207/web/viewer.html?file="+allInfo.value.base_info.courseware
      }else{
        isNoData.value=false
      }
      
    },{
      immediate:true
    })
    return {
      pdfUrl,
      isNoData
    };
  },
});
</script>

<style lang="less">
.train-coursewar {
  width: 100%;
  height: 100%;
  background: var(--black-100);
  .train-coursewar-pdf {
    width: 100%;
    height: 100%;
  }
}
</style>