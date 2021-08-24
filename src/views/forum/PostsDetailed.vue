<template>
    <div v-layout-bg>
      <div class="title">
        <div>
          <span>HTML是编程语言吗</span>
          <span>(分享)</span>
        </div>
        <a-button type="primary" @click.prevent="Reply"> 回 帖 </a-button>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive ,toRefs,inject} from 'vue'
interface Istate{
  Reply: () => void;
}
export default defineComponent({
  name: 'PostsDetailed',
  components: {
   
  },
  setup: (props,{emit}) => {
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false})
    const state:Istate=reactive({
      Reply:()=>{

      }
    })
    onMounted(()=>{
     
    })
    return { ...toRefs(state)};
  },
})
</script>
<style scoped lang="less">
  .header{
    display: flex;
    justify-content: space-between;
    // width: @center-width;
    margin: 0 auto;
  }
</style>
