<template>
  <div class="emptyContent">
    <div class="no-data" :class="emptyType" :style="height?`height:${height}px`:''">
  
    </div>
    <div class="emptyCon">{{emptyText}}</div>
    <div class="empty-action-box"><slot></slot></div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,computed ,Ref, PropType,watch} from 'vue'
import {useStore} from "vuex"
import { useRouter } from 'vue-router';
type TEmptyType= 'empty' | 'searchEmpty' | 'tableEmpty' | 'tableSearchEmpty' | 'drawerEmpty' | 'drawerSearchEmpty'
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
      type: String as PropType<TEmptyType>,
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
      searchEmpty:'抱歉，未搜到相关数据！',
      tableEmpty:'抱歉，暂无数据！',
      tableSearchEmpty:'抱歉，未搜到相关数据！',
      drawerEmpty:'抱歉，暂无数据！',
      drawerSearchEmpty:'抱歉，未搜到相关数据！',
      filePreview:'抱歉，该文件暂不支持预览，建议下载查看'
    }
    height.value=props.height
    emptyType.value=props.type
    // emptyText.value=props.text?props.text:defaultText[emptyType.value]
    // console.log(props)
    watch(
    ()=> {return props.text},
    (val: any) => {
      emptyText.value=props.text?props.text:defaultText[emptyType.value]
    },{
      immediate:true
    })
    watch(()=>props.type, newVal => {
      emptyType.value=newVal
      emptyText.value=props.text?props.text:defaultText[newVal]
    })
    onMounted(()=>{
     
    })
    return {emptyText,emptyType,height};
  },
})
</script>

<style scoped lang="less">

  .no-data {
    width: 100%;
    height: 100%;
    // height: 300px;
    height: 190px;
    // background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    background-repeat: no-repeat;
    background-position: center;
    // background-size: auto 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .empty{
    height: 226px;
    background-image: url('src/assets/images/empty/empty.png');
  }
  .searchEmpty{
    height: 226px;
    background-image: url('src/assets/images/empty/searchEmpty.png');    
  }
  .tableEmpty,.drawerEmpty{
    height: 126px;
    background-image: url('src/assets/images/empty/tableEmpty.png');    
  }
  .tableSearchEmpty,.drawerSearchEmpty{
    height: 126px;
    background-image: url('src/assets/images/empty/tableSearchEmpty.png');    
  }
  .filePreview{
    height: 198px;
    background-image: url('src/assets/images/empty/file.png'); 
  }
  .emptyContent{
    width: 100%;
    padding: 20px;
  }
  .emptyCon {
    // margin-top: 20px;
      font-size: 14px;
      width: 100%;
      text-align: center;
      color:rgba(5, 1, 1,.45);
  }
  .empty-action-box{
    text-align: center;
    margin-top: 15px;
  }
</style>
