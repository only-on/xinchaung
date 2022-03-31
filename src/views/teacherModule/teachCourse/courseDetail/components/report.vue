<template>
  <a-modal
    title="批阅实验报告"
    v-model:visible="reportVisible"
    @cancel="colseModal"
    :footer="false"
    :destroyOnClose="true"
    :maskClosable="false"
  >
    <div class="report-wrap"></div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted ,Ref,defineProps,defineEmits} from "vue";

// props传值
const props=defineProps({
    reportVisible:{ // 弹窗显示隐藏
        default:false,
        type:Boolean
    },
    data:{ // 数据
        type:Object as any,
        default:{
            remark:"",
            score:0
        }
    },
    isEdit:{
        type:Boolean,
        default:false
    }
})

// emit方法
const emit=defineEmits(["update:visible",'update:data'])

// 关闭弹窗
function colseModal() {
    emit("update:visible",false)
}
</script>