<template>
  <div>
    <h3>实验详情</h3>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, inject, reactive, watch, onMounted, toRefs } from 'vue'
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { useRoute, useRouter } from 'vue-router'
import AntdvMarkdown from "@xianfe/antdv-markdown/src/index.vue";
export default defineComponent({
  setup(){
    let route = useRoute()
    let router = useRouter()
    const http=(request as any).teacherExperiment
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:false,componenttype:undefined,showNav:true})
  }
})
</script>
<style scoped lang="less">

</style>