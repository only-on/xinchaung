<template>
  <div class="virtual-env"  v-layout-bg>
    <virtual-env></virtual-env>
  </div>
</template>

<script lang="ts"> 
import { defineComponent, onMounted, ref, reactive, toRefs, UnwrapRef, provide, inject} from 'vue'
import { urlSearch } from 'src/utils/common'
import virtualEnv from '../teachCourse/virtualEnv.vue'
export default defineComponent({
  components: {
    virtualEnv
   },
  setup() {
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:false,componenttype:undefined})
    }
})
</script>

<style lang="less" scoped>
</style>
