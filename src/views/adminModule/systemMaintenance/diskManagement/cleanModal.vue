<template>
    <div>
        <a-modal v-model:visible="visible" :width='480' :title="cleanType?'自动清理设置':(diskType==='video'?'录屏':'系统日志')" @cancel='handCancel'  @ok="handleOk">
            <div v-if="cleanType">
                <div >
                    <div>单个节点磁盘使用量达到80%</div>
                    <div class="cnadelBox">
                        自动清除系统中
                        <before-icon class="select" :icon="selectIcon">
                            <a-select style="width: 143px" v-model:value="value2">
                            <a-select-option
                                v-for="item in timeSelectData"
                                :value="item.value"
                                :key="item.value"
                                >{{ item.label }}</a-select-option
                            >
                            </a-select>
                        </before-icon>
                        日期当日及之前的<span>{{diskType==='video'?'操作视频':'系统日志'}}</span>
                    </div>

                </div>
            </div>
            <div v-else>
                <div>
                    <div class="cnadelBox">
                        请选择，清理
                        <before-icon class="select" :icon="selectIcon">
                                <a-select style="width: 143px" v-model:value="value2">
                                <a-select-option
                                    v-for="item in timeSelectData"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}</a-select-option
                                >
                                </a-select>
                        </before-icon>
                        日期当日及之前的<span>{{diskType==='video'?'操作视频':'系统日志'}}</span>
                </div>
                    <br>
                （建议不要清除近三个月的内容）
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
      inject,
      watch
    } from "vue";
    import request from "src/api/index";
    import { message } from "ant-design-vue";
    const http = (request as any).systemMaintenance;
    import moment from 'moment';
    import beforeIcon from "src/components/aiAnt/beforeIcon.vue";
    import selectIcon from "src/assets/images/screenicon/date.png";
    const timeSelectData=[
        {label:'一个月前',value:30},
        {label:'二个月前',value:60},
        {label:'三个月前',value:90},
        {label:'六个月前',value:180},
        {label:'一年前',value:365}
    ]
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
const value1:any=ref()
const value2:any=ref(365)
const disabledDate = (current:any) => {
      // Can not select days before today and today
      return current && current > moment().endOf('day');
};
const emit = defineEmits<{
  (e: "update:visible", visible: boolean): void;
  (e: "getday",value2:any): void;
}>();
function handleOk(){ 
    emit("update:visible", false);
    emit('getday',value2.value)
}
function handCancel(){
    emit("update:visible", false);
}
function getLogDay(){
        http.dayOfsetLog().then((res:any)=>{
            value2.value=res.data.day_before
        })
    }
function getVideoDay(){
    http.dayOfsetVideo().then((res:any)=>{
        value2.value=res.data.day_before
    })
}
watch(()=>props.visible,()=>{
    if(props.cleanType){
        props.diskType==='video'?getVideoDay():getLogDay()
    }else{
        value2.value=365
    }
},{
    immediate:true
})
</script>
<style lang="less" scoped>
  .cnadelBox{
      display: flex;
      align-items: center;
      margin-top: 10px;
  } 
  .select {
      :deep(.ant-select-selector){
        border-radius: 20px;
      }
  }
</style>