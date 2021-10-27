<template>
   <div class="setupMirror"  v-layout-bg>
        镜像内容
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive,toRefs ,inject,computed} from 'vue'
import request from 'src/api/index'
const http=(request as any).teacherTrain
interface Istate{
}
export default defineComponent({
  name: 'setupMirror',
  components: {
  },
  setup: (props,context) => {
    const http=(request as any).teacherTrain
     const state:Istate=reactive({
     })
     const methods={
     }
    onMounted(()=>{
        
    })
    return {...toRefs(state),...methods};
  },
})
</script>

<style  lang="less">
</style>
