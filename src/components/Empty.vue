<template>
  <div class="emptyContent">
    <div class="no-data" :class="emptyType" :style="height?`height:${height}px`:''">
  
    </div>
    <div class="emptyCon" :class="`${emptyType}2`">{{emptyText}}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,computed ,Ref, PropType} from 'vue'
import {useStore} from "vuex"
import { useRouter } from 'vue-router';
type TemptyType= 'empty' | 'searchEmpty' | 'tableEmpty' | 'tableSearchEmpty'
export default defineComponent({
  name: 'Empty',
  components: {
   
  },
  props:{
    text:{
      required: false,
      type: String,
      default: '',
    },
    type:{
      required: false,
      type: String as PropType<TemptyType>,
      default: 'empty',
    },
    height:{
      required: false,
      type: Number,
      default: 0,
    },
  },
  setup: (props,{emit}) => {
    var emptyText:Ref<string>=ref('')
    var emptyType:Ref<string>=ref('')
    var height:Ref<number>=ref(0)
    let defaultText={
      empty:'暂无数据！',
      searchEmpty:'暂未搜到数据！',
      tableEmpty:'抱歉。该表格暂无数据！',
      tableSearchEmpty:'抱歉。未搜到相关数据！',
    }
    height.value=props.height
    emptyType.value=props.type
    emptyText.value=props.text?props.text:defaultText[emptyType.value]
    // console.log(props)
    onMounted(()=>{
     
    })
    return {emptyText,emptyType,height};
  },
})
</script>

<style scoped lang="less">
  .empty{
    background-image: url('src/assets/images/empty/empty.png');
  }
  .searchEmpty{
    background-image: url('src/assets/images/empty/searchEmpty.png');    
  }
  .tableEmpty{
    background-image: url('src/assets/images/empty/tableEmpty.jpg');    
  }
  .tableSearchEmpty{
    background-image: url('src/assets/images/empty/tableSearchEmpty.jpg');    
  }
  .emptyContent{
    width: 100%;
    padding: 20px;
  }
  .no-data {
    width: 100%;
    height: 100%;
    height: 300px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    background-repeat: no-repeat;
    background-position: center;
    background-size: auto 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .emptyCon {
    // margin-top: 20px;
      font-size: 16px;
      width: 100%;
      text-align: center;
  }
  .empty2,.searchEmpty2{
    color:#050101;
    // .emptyCon{
    //   color:#050101;
    // }
  }
  .tableEmpty2,.tableSearchEmpty2{
    color: rgba(0, 0, 0, 0.25);
    // color:rgb(5, 1, 1,.45);
      // font-size: 14px;
    // .emptyCon{
    //   color:rgb(5, 1, 1,.45);
    //   font-size: 14px;
    // }
  }
  
  
</style>
