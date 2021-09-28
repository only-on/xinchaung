<template>
    <div class="quesComonTable">
        <div class="question-content-operate">
                <div class="question-search">
                  <a-input class="input-search" placeholder='请输入题目关键字搜索'></a-input>
                  <a-select
                    style="width: 200px"
                    @change="handleChange"
                    placeholder='全部'
                    v-model:value="selectLeves"
                >
                    <a-select-option v-for="item in difficultyLevel" :key="item.id" :value="item.id">
                     {{item.name}}
                    </a-select-option>
                </a-select>
                </div>
                <div class="question-btn">
                    <a-button type="primary" @click="addTestQuestions">添加试题</a-button>
                    <a-button type="primary">批量删除</a-button>
                    <a-button type="primary">批量导入</a-button>
                </div>
            </div>
            <div class="question-content-table">
                <!-- <a-table :columns="columns" :loading="loading" :data-source="list"></a-table> -->
                <a-table></a-table>
            </div>
            <div>
                <a-modal
                    :title="createmodal.title"
                    :visible="createmodal.visible"
                    :confirm-loading="createmodal.confirmLoading"
                    @ok="handleOk"
                    @cancel="handleCancel"
                    width="820px"
                    class="addModal"
                    >
                    <div class="modal-content">
                        <a-form layout="vertical">
                            <a-form-item required label="题目描述">
                                 <a-textarea v-model:value='expermodelValue.question'></a-textarea>
                            </a-form-item>
                             <!-- 单选题 或者 多选题 -->
                             <div v-if="selectedId===1||selectedId===2">
                                <div class="option" v-for="(item,index) in single" :key='index.toString()'>
                                <div class="option-item">
                                    <!-- v-for="(item,index) in exerparams.options" :key="index.toString()" -->
                                     <a-form-item required :label='"选项"+item.optionLable'>
                                        <a-input></a-input>
                                        <!-- v-model="item.option" -->
                                    </a-form-item>
                                </div>
                                <div class="setAnswer">
                                    <!-- 单选框 -->
                                    <a-radio v-if="selectedId===1">设为答案</a-radio>
                                    <!-- 多选框 -->
                                     <a-checkbox v-if="selectedId===2" @change="onChange">
                                        设为答案
                                    </a-checkbox>
                                </div>
                            </div>
                             </div>
                            <!-- 判断题 -->
                            <div v-if="selectedId===3" style="display:flex;height:50px">
                                <div style="margin-right:20px">
                                     <a-form-item required label="答案">
                                    </a-form-item>
                                </div>
                                <div>
                                    <a-radio>正确</a-radio>
                                    <a-radio>错误</a-radio>
                                </div>
                            </div>
                            <!-- 填空题 -->
                            <div v-if="selectedId===4">
                                <div>
                                    <a-form-item required label="答案">
                                    <a-input></a-input>
                                </a-form-item>
                                </div>
                                <div style="margin-bottom:20px">
                                    <a-checkbox>
                                    答案有序
                                    </a-checkbox>
                                </div>
                            </div>
                            <!-- 解答题 -->
                            <div v-if="selectedId===5">
                                <div>
                                    <a-form-item required label="答案">
                                        <a-textarea></a-textarea>
                                    </a-form-item>
                                </div>
                                 <div>
                                    <a-form-item required label="关键字">
                                        <a-textarea></a-textarea>
                                    </a-form-item>
                                </div>
                            </div>
                            <div class="difficultyAndScore">
                                <div class="difficult">
                                    <a-form-item required label="难度">
                                        <a-input></a-input>
                                    </a-form-item>
                                </div>
                                 <div class="score">
                                    <a-form-item required label="分数">
                                        <a-input></a-input>
                                    </a-form-item>
                                </div>
                            </div>
                            <div>
                                <a-form-item label="知识点">
                                    <a-button type="primary">选择</a-button>
                                </a-form-item>
                            </div>
                        </a-form>
                    </div>
                </a-modal>
            </div>
    </div>
</template>
<script lang="ts">
import { configConsumerProps } from 'ant-design-vue/lib/config-provider';
import {defineComponent, onMounted, reactive,toRefs,watch} from 'vue'
import { useRouter } from 'vue-router';
import request from "../../../../api";
interface levelType{
    name:string,
    id:number,
}
interface modalType{
    title:string,
    visible:boolean,
    confirmLoading:boolean,
}
interface exerType{
 optionLable:string,
}
interface paramsType{
    pool_id?:number,
    question:string,
    type_id?:number,//习题类型id
    level_id?:number,
    origin_score?:string,//分数
    ordered_answer?:boolean,//答案是否有序
    options?:string[],//习题选项
    keywords?:any[],//关键字
    points?:[],// 知识点
    answers?:[],
}
interface State{
    difficultyLevel:levelType[],
    selectLeves:any,
    createmodal:modalType,
    single:exerType[],
    exerparams?:paramsType,
    expermodelValue:paramsType,
}

export default defineComponent({
    name:'quesComonTable',
    props:['selectedId'],
    setup:(props)=>{
        const router = useRouter();
        const teacherDataExerApi = (request as any).teacherDataExercises
        const state:State=reactive({
            difficultyLevel:[],
            selectLeves:undefined,
            createmodal:{
                title:'添加单选题',
                visible:false,
                confirmLoading:false,
            },
            single:[{optionLable:'A'},{optionLable:'B'},{optionLable:'C'},{optionLable:'D'}],
            expermodelValue:{
                question:'',
                options:[]
            }
        })
        const methods = {
         exerciseLevels(){
                teacherDataExerApi.getDetailExerLevels().then((res:any)=>{
                    state.difficultyLevel=res.data
                })
            },
         handleChange(value:any){
             console.log(value)
             state.selectLeves=value
            },
            addTestQuestions(){
            // detailExerCreate
            state.createmodal.visible=true
            },
            handleOk(){
                state.createmodal.visible=false
            },
            handleCancel(){
                state.createmodal.visible=false
            },
            onChange(e:any){
                console.log(e)
            }
        }
        watch(()=>props.selectedId, (newVal) => {
          console.log(newVal,'newVal')
           switch(newVal){
                  case 1:
                  return state.createmodal.title='添加单选题';
                  case 2:
                  return state.createmodal.title='添加多选题';
                  case 3:
                  return state.createmodal.title='添加判断题';
                  case 4:
                  return state.createmodal.title='添加填空题';
                  case 5:
                  return state.createmodal.title='添加解答题';
              }
        })
        onMounted(()=>{
             methods.exerciseLevels()
        })
        return {...methods,...toRefs(state)}
    }
})
</script>
<style lang="less">
.question-content-operate{
        display: flex;
        justify-content:space-between;
        padding: 20px 0;
        .question-search{
            display: flex;
            .input-search{
                margin-right: 20px;
            }
            .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
            height: 35px!important;
        }
        }
        .question-btn{
            .ant-btn{
                margin-left: 10px;
            }
        }
    }
.modal-content{
    .option{
        display: flex;
        justify-content: space-between;
        .option-item{
            width: 630px;
        }
        .setAnswer{
            width:105px;
            text-align: center;
        }
        .ant-radio-wrapper,.ant-checkbox-wrapper{
            width:105px;
            height: 35px;
            line-height: 35px;
            margin-top:33px;
            background: #F5F5F5;
        }
        
    }
    .difficultyAndScore{
        width: 630px;
        display: flex;
        justify-content: space-between;
        .difficult{
            width: 285px;
        }
        .score{
            width: 285px;
        }
    }
}
.addModal{
    .ant-modal-footer{
        text-align: center;
    }
}
</style>