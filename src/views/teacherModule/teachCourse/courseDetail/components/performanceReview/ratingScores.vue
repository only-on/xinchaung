<template>
  <a-modal
    :title="isEdit?'编辑成绩评分':'成绩评分'"
    v-model:visible="scoreVisible"
    @cancel="colseModal"
    :footer="false"
    :destroyOnClose="true"
    :maskClosable="false"
  >
  <a-form :rules="rules"  :model="data" layout="vertical" ref="formRef">
    <a-form-item label="评语" name="remark">
        <!-- <markedEditor v-model="data.remark"></markedEditor> -->
        <a-textarea v-model:value="data.remark" />
    </a-form-item>
    <a-form-item label="分数" name="score">
        <a-input v-model:value="data.score"></a-input>
    </a-form-item>
  </a-form>
  <submitDom @submit="submit" @cancel="cancel"></submitDom>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted ,Ref,defineProps,defineEmits} from "vue";
import markedEditor from "src/components/editor/markedEditor.vue";
import submitDom from "src/components/submit/index.vue";
import { RuleObject, ValidateErrorEntity } from 'ant-design-vue/es/form/interface';

const formRef = ref();

// props传值
const props=defineProps({
    scoreVisible:{ // 弹窗显示隐藏
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
const emit=defineEmits(["update:visible",'update:data','submit'])

const scoreValidator= async(rule: RuleObject, value: any)=>{
    if (value=="") {
        return Promise.reject("请输入分数")
    }else if (isNaN(value)) {
        return Promise.reject("请输入数字")
    }else{
        return Promise.resolve();
    }
}
// 校验规则
const rules:any={
    remark:[{required:true, trigger: 'change', max: 100,message:"评语不能为空，字符长度最大100"}],
    score:[{required:true, trigger: 'change',validator:scoreValidator}],
}
// 关闭弹窗
function colseModal() {
    emit("update:visible",false)
}

// 确认
function submit(){
    formRef.value
        .validate().then(()=>{
            emit("submit")
        }).catch((err:any)=>{
            console.log(err);
        })
}

// 取消
function cancel() {
    emit("update:visible",false)
}
</script>