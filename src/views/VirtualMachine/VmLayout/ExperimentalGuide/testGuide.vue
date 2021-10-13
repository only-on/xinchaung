<template>
    <div v-if="allInfo">
      <h4 class="experimental-step-title">
        {{ currentStepIndex + 1 }}、{{ steps[currentStepIndex].name
        }}<a-button
          type="primary"
          @click="lookStep"
          v-if="isLookStatus===0"
          >查看步骤</a-button
        >
      </h4>
     <marked-editor
        v-if="steps[currentStepIndex].summary"
        v-model="steps[currentStepIndex].summary"
        :preview="preview"
      />

       <marked-editor
        v-if="isLookStatus === 1 && steps[currentStepIndex].detail"
        v-model="steps[currentStepIndex].detail"
        :preview="preview"
      />
      <div class="action">
        <a-button type="primary" @click="lastStep" v-if="currentStepIndex != 0"
          >上一步</a-button
        >
        <a-button
          type="primary"
          @click="nextStep"
          v-if="steps.length > 1 && currentStepIndex < steps.length - 1"
          >下一步</a-button
        >
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent,ref,inject,onMounted,Ref,watch } from 'vue'
import markedEditor from "src/components/editor/markedEditor.vue";
import { stepAction } from "src/utils/vncInspect";
import {findIndex} from "lodash"
import {Modal} from "ant-design-vue"
export default defineComponent({
    components: {
    "marked-editor": markedEditor,
  },
  props: ["opType","type","taskId","topoinst_id"],
    setup(props) {
        const preview=true
        const currentStepIndex = ref(0); // 当前步骤索引
        let allInfo: any = inject("allInfo");
        const steps:Ref<any>=ref([])
        const isLookStatus=ref(0)
        const currentStepStatus:any=ref([])
        onMounted(()=>{
            console.log(allInfo.value.base_info.step);
            // allInfo.value.current_step=[]
        })

        watch(()=>allInfo.value.base_info,()=>{
            console.log(allInfo.value.base_info);
            if (allInfo.value.base_info) {
                steps.value=allInfo.value.base_info.step
            }
            
        },{deep:true,immediate:true})

        watch(()=>allInfo.value.current_step,()=>{
            console.log(allInfo.value.current_step);
            
            if (allInfo.value.current_step) {
                currentStepStatus.value=allInfo.value.current_step
                getCurrentStepStatus()
                
            }
        },{deep:true,immediate:true})

        // 查看步骤
    function lookStep() {
      Modal.confirm({
        title: "提示",
        content: "查看步骤会扣除本步骤50%的分数，确定查看？",
        onOk: () => {
          let params = {
            opType: props.opType,
            type: props.type,
            taskId: props.taskId,
            action: "stepScore",
            topoinst_id: props.topoinst_id,
            task_step_id: steps.value[currentStepIndex.value].id,
            see_current_step: 1,
          };
          stepAction(params).then((res) => {
            let i = findIndex(allInfo.value.current_step, {
              task_step_id: steps.value[currentStepIndex.value].id,
            });
            if (i != -1) {
              allInfo.value.current_step[i].is_see_step = 1;
              isLookStatus.value = 1;
            } else {
              allInfo.value.current_step.push({
                task_step_id: steps.value[currentStepIndex.value].id,
                is_see_step: 1,
              });
              isLookStatus.value = 1;
            }
          });
        },
        onCancel: () => {
          return false;
        },
      });
    }

        // 上一步
        function lastStep() {
            currentStepIndex.value--
            getCurrentStepStatus()
        }

        // 下一步
        function nextStep() {
            let params = {
            opType: props.opType,
            type: props.type,
            taskId: props.taskId,
            action: "stepScore",
            topoinst_id: props.topoinst_id,
            task_step_id: steps.value[currentStepIndex.value].id,
            see_current_step: 0,
          };
          stepAction(params).then((res) => {
            currentStepIndex.value++
            getCurrentStepStatus();
          });
            
        }

        // 获取当前步骤显示状态
        function getCurrentStepStatus() {
            isLookStatus.value=0
            if (currentStepStatus.value.length===0) return;
            let i=findIndex(currentStepStatus.value,{task_step_id:steps.value[currentStepIndex.value].id})
                console.log(i);
                if (i!=-1) {
                    isLookStatus.value=currentStepStatus.value[i].is_see_step
                }else{
                    isLookStatus.value=0
                }
        }
        return {
            currentStepIndex,
            allInfo,
            lookStep,
            steps,
            preview,
            isLookStatus,
            currentStepStatus,
            lastStep,
            nextStep
        }
    },
})
</script>
