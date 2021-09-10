<template>
  <div class="empty">
    <div class="emptyContent">
      <span class="emptyCon">{{emptyText}}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,computed ,Ref} from 'vue'
import {useStore} from "vuex"
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'Empty',
  components: {
   
  },
  props:{
    text:{
      required: false,
      type: String,
      default: true,
    }
  },
  setup: (props,{emit}) => {
    const store=useStore()
    const router = useRouter();
    var emptyText:Ref<string>=ref('')
    emptyText.value=props.text || '暂无数据!'
    onMounted(()=>{
     
    })
    return {emptyText};
  },
})
</script>

<style scoped lang="less">
  .empty {
        width: 100%;
        height: 100%;
        padding: 0px 20px;
        // margin: 20px;
        background-color: white;
        // border: 1px solid #ccc;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: url('../../assets/images/empty.png');
        background-repeat: no-repeat;
        background-position: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .emptyContent{
            width: 100%;
            height: 100%;
            margin: 20px;
            display: flex;
            justify-content: center;
            align-items:center;
            .emptyCon {
                font-size: 18px;
                padding-top: 306px;
            }
        }
        .black {
            font-size: 18px;
            color: #050101;
            font-weight: bold;
        }

        .tip {
            font-size: 14px;
            margin-left: 20px;
            color: rgba(5, 1, 1, 0.48);
        }

        .orange {
            color: #FFA900;
            font-size: 40px;
            margin: 0 10px;
        }

        .gray {
            color: #777;
            font-size: 20px;
            margin: 0 10px;
        }

        .green {
            color: #62CB2B;
            font-size: 30px;
            margin: 0 10px;
        }

        .red {
            color: #F2222A;
            font-size: 30px;
            margin: 0 10px
        }
    }
</style>
