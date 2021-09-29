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
                <a-table :columns="columns" rowKey="id" :loading="loading" :data-source="tabledata">
                    <template #difficulty='{record}'>
                        <span>{{record.level.name}}</span>
                    </template>
                    <template #operation>
                        <span class="iconfont icon-bianji1"></span>
                        <span class="iconfont icon-shanchu-copy"></span>
                    </template>
                    <template #select-answers='{record}'>
                        <div v-for="(item,index) in record.options" :key="index.toString()">
                          <span v-if="record.answers.answer==item.id">{{item.option}}</span>  
                        </div>
                    </template>
                </a-table>
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
                             <div v-if="selectedId==='1'||selectedId==='2'">
                                    <a-radio-group v-model="value" @change="onRadioChange">
                                        <div class="option" v-for="(item,index) in single" :key='index.toString()'>
                                            <div class="option-item">
                                                <a-form-item required :label='"选项"+item.optionLable'>
                                                    <a-input v-model:value="expermodelValue.options[index]"></a-input>
                                                </a-form-item>
                                            </div>
                                            <div class="setAnswer">
                                                <!-- 单选框 -->
                                            
                                                <a-radio v-if="selectedId==='1'" :value='index'>设为答案</a-radio>
                                                <!-- 多选框 -->
                                                <a-checkbox v-if="selectedId==='2'" @change="onChange">
                                                    设为答案
                                                </a-checkbox>
                                            </div>
                                        </div>
                                    </a-radio-group>
                             </div>
                            <!-- 判断题 -->
                            <div v-if="selectedId==='3'" style="display:flex;height:50px">
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
                            <div v-if="selectedId==='4'">
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
                            <div v-if="selectedId==='5'">
                                <div>
                                    <a-form-item required label="答案">
                                        <a-textarea v-model:value="expermodelValue.answers"></a-textarea>
                                    </a-form-item>
                                </div>
                                 <div>
                                    <a-form-item required label="关键字">
                                        <a-textarea v-model:value='expermodelValue.keyword'></a-textarea>
                                    </a-form-item>
                                </div>
                            </div>
                            <div class="difficultyAndScore">
                                <div class="difficult">
                                    <a-form-item required label="难度">
                                        <a-select
                                            @change="handleChangeLeves"
                                            v-model:value="expermodelValue.leves"
                                        >
                                            <a-select-option v-for="item in difficultyLevel" :key="item.id" :value="item.id">
                                            {{item.name}}
                                            </a-select-option>
                                        </a-select>
                                    </a-form-item>
                                </div>
                                 <div class="score">
                                    <a-form-item required label="分数">
                                        <a-input v-model:value="expermodelValue.score"></a-input>
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
import { context } from 'ant-design-vue/lib/vc-image/src/PreviewGroup';
import indexVue from 'src/views/studentExperimental/index.vue';
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
interface optionsType{
    value:string,
}
interface paramsType{
    pool_id?:number,
    question:string,
    type_id?:number,//习题类型id
    leves?:any,
    score?:string,//分数
    ordered_answer?:boolean,//答案是否有序
    options:any[],//习题选项
    keyword?:any[]|string,//关键字
    points?:[],// 知识点
    answers?:[]|string,
}
interface State{
    difficultyLevel:levelType[],
    selectLeves:any,
    createmodal:modalType,
    single:exerType[],
    exerparams?:paramsType,
    expermodelValue:paramsType,
    loading:boolean,
    columns:any[],
    list:any[],
}

export default defineComponent({
    name:'quesComonTable',
    props:['selectedId','poolid','tabledata'],
    setup:(props,context)=>{
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
                options:[],
                leves:'',
                score:'',
            },
            loading:false,
            columns:[
                {
                    title: '题目',
                    dataIndex: 'question',
                    key: 'question',
                },
                {
                    title: '难度',
                    dataIndex: 'difficulty',
                    slots: { customRender:'difficulty'},
                },
                {
                    title: '答案',
                    dataIndex: 'select-answers',
                    slots: { customRender:'select-answers'},
                },
                {
                    title: '分数',
                    dataIndex: 'origin_score',
                    key: 'origin_score',
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    slots: { customRender: 'operation' },
                },
                ],
            list:[]
        })
        var poolid:any=''
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
            handleChangeLeves(value:any){
                state.expermodelValue.leves=value
            },
            addTestQuestions(){
            // detailExerCreate
            // console.log(id,'idddddddd')
            // poolid=id
            state.createmodal.visible=true
            },
            handleOk(){
                state.createmodal.visible=false
                console.log(state.expermodelValue.options,'state.expermodelValue')
                teacherDataExerApi.detailExerCreate({
                urlParams:{pool_id:props.poolid}, 
                param:{
                question:state.expermodelValue.question,
                type_id:props.selectedId,
                level_id:state.expermodelValue.leves,
                origin_score:state.expermodelValue.score,
                "points": [
                    "40","41"
                ],
                options:state.expermodelValue.options,
                keywords:state.expermodelValue.keyword?[state.expermodelValue.keyword]:'',
                answers: [state.expermodelValue.answers]}
                }).then((res:any)=>{
                    console.log(res)
                    state.expermodelValue={
                        question:'',
                        leves:'',
                        score:'',
                        options:[],
                        keyword:''
                    },
                    context.emit('finishCreate',true)
                })
               
            },
            handleCancel(){
                state.createmodal.visible=false
            },
            onChange(e:any){
                console.log(e)
            },
            onRadioChange(e:any){
                const i=Number(e.target.value)
                state.expermodelValue.answers=state.expermodelValue.options[i]
            }
        }
        watch(()=>props.selectedId, (newVal) => {
           switch(newVal){
                  case '1':
                  return state.createmodal.title='添加单选题';
                  case '2':
                  return state.createmodal.title='添加多选题';
                  case '3':
                  return state.createmodal.title='添加判断题';
                  case '4':
                  return state.createmodal.title='添加填空题';
                  case '5':
                  return state.createmodal.title='添加解答题';
              }
        })
        onMounted(()=>{
             methods.exerciseLevels()
            //  state.list=
        })
        return {...methods,...toRefs(state),poolid}
    }
})
</script>
<style lang="less">
.ant-table-tbody > tr > td>.iconfont{
            color: @theme-color;
}
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