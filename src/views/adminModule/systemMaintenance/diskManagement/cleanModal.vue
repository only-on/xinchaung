<template>
    <div>
        <a-modal v-model:visible="visible" :width='502' :title="cleanType?'自动清理':(diskType==='video'?'录制视频':'系统日志')" @cancel='handCancel'  @ok="handleOk">
            <div v-if="cleanType">
                <div>
                    <div>单个节点磁盘使用量达到80%</div>
                    自动清除系统中
                    <a-month-picker v-model:value="value2" format="M月" :disabled-date="disabledDate" placeholder="请选择月份"/>
                    以前的操作视频
                </div>
            </div>
            <div v-else>
                <div>
                    请选择，清理
                    <a-month-picker v-model:value="value2" format="M月" :disabled-date="disabledDate" placeholder="请选择月份"/>
                    日期当日及之前的系统日志（建议不要清除近三个月的内容）
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
   import {
      defineComponent,
      ref,
      onMounted,
      reactive,
      inject
    } from "vue";
    import moment from 'moment';
interface Props {
    visible:any;
    cleanType:any;
    diskType:any;
}
const props = withDefaults(defineProps<Props>(), {
  visible:()=>{},
  cleanType:()=>{},
  diskType:()=>{}
});
const value2:any=ref()
const disabledDate = (current:any) => {
      // Can not select days before today and today
      return current && current > moment().endOf('day');
};
const emit = defineEmits<{
  (e: "update:visible", visible: boolean): void;
}>();
function handleOk(){ 
    emit("update:visible", false);
    value2.value=''
}
function handCancel(){
    emit("update:visible", false);
    value2.value=''
}

</script>