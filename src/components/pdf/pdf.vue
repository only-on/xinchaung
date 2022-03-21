<template>
  <div style="width:100%;height:100%">
    <iframe
    v-if="isShowPdf"
    style="width:100%;height:100%"
      :src="`${env ? '' : ''}/pdfjs-2.5.207/web/viewer.html?file=${
        env ? '/proxyPrefix' + pdfUrl : pdfUrl}`"
      frameborder="0"
    ></iframe>
    <!-- <iframe
    v-if="isShowPdf"
    style="width:100%;height:100%"
      :src="`${env ? '' : '/frontend'}/pdfjs-2.5.207/web/viewer.html?file=${pdfUrl}`"
      frameborder="0"
    ></iframe> -->
    <div v-else>
        <empty text="加载失败，请点击下方按钮进行刷新">
            <div>
                <div><a-spin :spinning="spinning"></a-spin></div>
                <a-button type="primary" @click="checkPdf(pdfUrl)">刷新</a-button>
            </div>
        </empty>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent ,watch,ref, onUnmounted} from "vue";
import empty from "src/components/Empty.vue"
import {message} from "ant-design-vue"
export default defineComponent({
    components:{
        empty
    },
  props: ["url"],
  setup(props) {
    const env = process.env.NODE_ENV == "development" ? true : false;
    const pdfUrl=ref("")
    const isShowPdf=ref(false)
    const spinning=ref(false)
    let timer:NodeJS.Timeout|null=null
    watch(()=>props.url,()=>{
        pdfUrl.value=props.url
        checkPdf(pdfUrl.value)
    },{immediate:true})
    
    function checkPdf(url:string) {
        if (!url) {
            clearTimeout(Number(timer))
            return;
        }
        spinning.value=true
        clearTimeout(Number(timer))
        fetch(env ? '/proxyPrefix' + url : url).then(res=>{
        // fetch(url).then(res=>{
            console.log(res);
            if (res.status==200) {
                isShowPdf.value=true
                clearTimeout(Number(timer))
            }else{
                isShowPdf.value=false
                // message.warn("加载失败")
                timer=setTimeout(()=>{
                    checkPdf(url)
                },2000)
            }
            spinning.value=true
        })
    }

    onUnmounted(()=>{
        clearTimeout(Number(timer))
    })
    return {
      env,
      pdfUrl,
      isShowPdf,
      spinning,
      checkPdf
    };
  },
});
</script>
