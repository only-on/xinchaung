<template>
  <div v-layout-bg>
    <h2>详情</h2>
  </div>
</template>
<script  lang="ts">
import { defineComponent,ref, onMounted,reactive, toRefs,watch ,inject,Ref,computed} from 'vue'
import request from '../../api/index'
import { IBusinessResp} from '../../typings/fetch.d';
import { useRouter ,useRoute } from 'vue-router';
import { Modal,message } from 'ant-design-vue';
import extStorage from "src/utils/extStorage";
import chinaToPy from 'src/utils/py'
const http=(request as any).dataSet

export default defineComponent({
  name: '',
  components: {
   
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { lStorage } = extStorage
    const role = lStorage.get('role')
    const uid=lStorage.get('user_id')
    onMounted(()=>{
     
      // init()
    })
  },
})
</script>
<style scoped lang="less">

</style>
