<template>
    <div class="quesComonTable">
        <div class="question-content-operate">
                <div class="question-search">
                     <a-select
                    style="width:90px"
                    @change="handleChange"
                    placeholder='全部'
                    v-model:value="selectLeves"
                >
                    <a-select-option v-for="item in difficultyLevel" :key="item.id" :value="item.id">
                     {{item.name}}
                    </a-select-option>
                </a-select>
                  <a-input-search v-model:value='searchExercise' @keyup.enter="searchExerData" @search="searchExerData" style="width:352px;padding:0px 5px 0px 30px" placeholder="请输入目录名称关键字查询" />
                </div>
                <div class="question-btn" v-if="initial==='0'">
                    <a-button type="primary" @click="addTestQuestions">添加试题</a-button>
                    <a-button type="primary" @click="deleteCurrentRowMany">批量删除</a-button>
                    <a-button type="primary">批量导入</a-button>
                </div>
            </div>
            <div class="question-content-table">
                <a-table :row-selection="rowSelection" :columns="columns" rowKey="id" :loading="loading" :data-source="tabledata">
                    <template #difficulty='{record}'>
                        <span>{{record.level.name}}</span>
                    </template>
                    <template #operation='{record}'>
                        <div>
                            <span class="iconfont icon-bianji1" @click="editCurrentRow(record,true)" style="margin-right:20px"></span>
                            <span class="iconfont icon-shanchu-copy" @click="deleteCurrentRow(record.id)"></span>
                        </div>
                    </template>
                    <template #select-answers='{record}'>
                        <div v-if="record.type_id===4||record.type_id===5">
                            <span>{{record.answers[0].answer}}</span>  
                        </div>
                        <div v-else>
                            <span  v-for="(item,index) in record.options" :key="index.toString()">
                                <span v-for="(it,i) in record.answers" :key="i.toString()">
                                    <span v-if="it.answer===item.id.toString()">{{item.option}}<span v-if="i!==record.answers.length-1">，</span></span>
                                </span>  
                            </span>
                        </div>
                    </template>
                </a-table>
            </div>
            <div>
                <a-modal
                    :title="edit?'编辑'+createmodal.title:'添加'+createmodal.title"
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
                                    <a-radio-group v-model:value='value' @change="onRadioChange">
                                        <div class="option" v-for="(item,index) in single" :key='index.toString()'>
                                            <div class="option-item">
                                                <a-form-item required :label='"选项"+item.optionLable'>
                                                    <a-input v-model:value="expermodelValue.options[index]"></a-input>
                                                </a-form-item>
                                            </div>
                                            <div class="setAnswer">
                                                <!-- 单选框 -->
                                                <a-radio v-if="selectedId===1" :value='index'>设为答案</a-radio>
                                                <!-- 多选框 -->
                                                <!-- :checked='checked' -->
                                                <a-checkbox v-if="selectedId===2"  @change="e =>onMutilChange(e,expermodelValue.options,item,index)">
                                                    设为答案
                                                </a-checkbox>
                                            </div>
                                        </div>
                                    </a-radio-group>
                             </div>
                            <!-- 判断题 -->
                            <div v-if="selectedId===3" style="display:flex;height:50px">
                                <div style="margin-right:20px">
                                     <a-form-item required label="答案">
                                    </a-form-item>
                                </div>
                                <div>
                                    <a-radio-group v-model="value" @change="onJudgeChange">
                                        <a-radio value='正确'>正确</a-radio>
                                        <a-radio value='错误'>错误</a-radio>
                                    </a-radio-group>
                                </div>
                            </div>
                            <!-- 填空题 -->
                            <div v-if="selectedId===4">
                                <div>
                                    <a-form-item required label="答案">
                                    <a-input v-model:value="expermodelValue.answers"></a-input>
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

import { message } from 'ant-design-vue';
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
    index:any,
}
interface paramsType{
    pool_id?:number,
    question:string,
    type_id?:number,//习题类型id
    leves?:any,
    score?:string,//分数
    ordered_answer?:boolean,//答案是否有序
    // options?:string[],//习题选项
    options?:any[],//习题选项
    keyword?:any[]|string,//关键字
    points?:any[],// 知识点
    answers:any[],
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
    deleteid?:number,
    deleteidArr:number[],
    edit:any,
    searchExercise:string,
    value:any,
    question_id:any
}

export default defineComponent({
    name:'quesComonTable',
    props:['selectedId','poolid','tabledata','initial'],
    setup:(props,context)=>{
        const router = useRouter();
        const teacherDataExerApi = (request as any).teacherDataExercises
        const state:State=reactive({
            edit:'',
            searchExercise:'',
            difficultyLevel:[],
            selectLeves:undefined,
            createmodal:{
                title:'单选题',
                visible:false,
                confirmLoading:false,
            },
            single:[{optionLable:'A'},{optionLable:'B'},{optionLable:'C'},{optionLable:'D'}],
            expermodelValue:{
                question:'',
                options:[],
                leves:'',
                score:'',
                answers:[]
            },
            deleteidArr:[],
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
                    width:200,
                    align:'center',
                    slots: { customRender: 'operation' },
                },
                ],
            list:[],
            value:'',
            question_id:'',
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
             context.emit('selectLeves',state.selectLeves)
            },
            handleChangeLeves(value:any){
                state.expermodelValue.leves=value
            },
            addTestQuestions(){
                state.edit=false
            state.createmodal.visible=true
            },
            handleOk(){
                console.log(state.edit,'是编辑还是创建')
                if(props.selectedId===3){
                    state.expermodelValue.options=['正确','错误']
                }
                state.createmodal.visible=false
                console.log(state.expermodelValue.options,'state.expermodelValue')
                if(state.edit){
                         teacherDataExerApi.detailExerUpdate({
                urlParams:{question_id:state.question_id}, 
                param:{
                question:state.expermodelValue.question,
                type_id:props.selectedId,
                level_id:state.expermodelValue.leves,
                origin_score:state.expermodelValue.score,
                "points": [
                    "40","41"
                ],
                options:state.expermodelValue.options,
                keywords:state.expermodelValue.keyword?[state.expermodelValue.keyword]:[],
                answers: typeof(state.expermodelValue.answers)==='string'?[state.expermodelValue.answers]:state.expermodelValue.answers}
                }).then((res:any)=>{
                    console.log(res)
                    console.log('添加成功')
                    state.expermodelValue={
                        question:'',
                        leves:'',
                        score:'',
                        options:[],
                        keyword:[],
                        answers:[]
                    },
                    context.emit('finishCreate',true)
                })  
                }else{
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
                keywords:state.expermodelValue.keyword?[state.expermodelValue.keyword]:[],
                answers: typeof(state.expermodelValue.answers)==='string'?[state.expermodelValue.answers]:state.expermodelValue.answers}
                }).then((res:any)=>{
                    console.log(res)
                    console.log('添加成功')
                    state.expermodelValue={
                        question:'',
                        leves:'',
                        score:'',
                        options:[],
                        keyword:[],
                        answers:[]
                    },
                    context.emit('finishCreate',true)
                })  
                }   
            },
            handleCancel(){
                state.createmodal.visible=false
            },
            onJudgeChange(e:any){
                state.expermodelValue.answers=e.target.value
            },
            onMutilChange(e:any,options:any[],item:any,index:number){
                const quesAnswer:string=options[index].toString()
                console.log(e.target.checked,'e.target.checked')
                if(e.target.checked){
                    state.expermodelValue?.answers.push(quesAnswer)
                }else{
                    const deleindex=state.expermodelValue?.answers.indexOf(quesAnswer)
                    state.expermodelValue.answers.splice(deleindex,1)
                    console.log(state.expermodelValue.answers[index])    
                }
                console.log(state.expermodelValue.answers)
            },
            onRadioChange(e:any){
                const i=Number(e.target.value);
                state.expermodelValue.answers=state.expermodelValue.options?state.expermodelValue.options[i]:[]
                // state.expermodelValue.answers=[e.target.value]    
            },
            // 删除调用
            deleteDetailExer(id:any){
                if(id){
                    teacherDataExerApi.detailExerDelete({urlParams:{question_id:id}}).then((res:any)=>{
                    console.log(res)
                    if(res.code===1){
                        state.deleteidArr=[]
                        context.emit('finishCreate',true)
                    }
                })
                } else{
                    message.warning('请至少选择一个记录')
                } 
            },
            // 删除一行
            deleteCurrentRow(id:any){
                methods.deleteDetailExer(id)
            },
            //批量删除
            deleteCurrentRowMany(){
                console.log(state.deleteidArr,'批量删除')
                console.log(state.deleteidArr.join(','))
                methods.deleteDetailExer(state.deleteidArr.join(','))
            },
            //编辑
            editCurrentRow(record:any,edit:any){
                state.edit=edit
                state.question_id=record.id
                console.log(record)
                console.log(edit,'edit')
                 state.createmodal.visible=true
                const options1:any=[]
                const answer1:any=[]
                // 单选题 多选题
                record.options.forEach((item:any)=>{
                    console.log(item.name)
                    options1.push(item.option)
                    })
                record.answers.forEach((item:any) => {
                    answer1.push(item.answer)
                });
                //单选答案
                record.options.forEach((item:any,index:any)=>{
                    if(item.id==record.answers[0].answer){
                        return state.value=index
                    }
                })
                // 多选题答案
                 record.options.forEach((item:any,index:any)=>{
                     record.answers.forEach((it:any,j:any)=>{
                         if(item.id===it.answer){
                             console.log(index,'index多选')
                         }
                     })
                 })
                 state.expermodelValue={
                        question:record.question,
                        leves:record.level.id,
                        score:record.origin_score,
                        options:options1,
                        keyword:'',
                        answers:answer1
                    }
            },
            //查询
            searchExerData(){
                console.log(state.searchExercise)
                context.emit('searchExercise',state.searchExercise)
            }
        }
        const rowSelection = {
            onSelect: (record:any, selected:any, selectedRows:any) => {
                state.deleteidArr=[]
                selectedRows.forEach((item:any) => {
                    state.deleteidArr.push(item?.id)
                });
                console.log(state.deleteidArr)
            },
            onSelectAll: (selected:any, selectedRows:any, changeRows:any) => {
                console.log(selected, selectedRows, changeRows);
                 selectedRows.forEach((item:any) => {
                    state.deleteidArr.push(item?.id)
                });
                console.log(state.deleteidArr,'state.deleteidArr')
            },
        };
        watch(()=>props.selectedId, (newVal) => {
           state.selectLeves=''
           state.searchExercise=''
           state.expermodelValue={
                        question:'',
                        leves:'',
                        score:'',
                        options:[],
                        keyword:'',
                        answers:[]
                    }
           switch(newVal){
                  case 1:
                  return state.createmodal.title='单选题';
                  case 2:
                  return state.createmodal.title='多选题';
                  case 3:
                  return state.createmodal.title='判断题';
                  case 4:
                  return state.createmodal.title='填空题';
                  case 5:
                  return state.createmodal.title='解答题';
              }
        })
        onMounted(()=>{
            methods.exerciseLevels()
        })
        return {...methods,...toRefs(state),rowSelection,poolid}
    }
})
</script>
<style lang="less">
.ant-table-tbody > tr > td>.iconfont{
    color:@theme-color;
}
.quesComonTable{
    .ant-select:not(.ant-select-customize-input) .ant-select-selector{
    border-bottom-right-radius: 0px;
    border-top-right-radius: 0px;
    }
    .ant-input-affix-wrapper{
    border-bottom-left-radius: 0px;
    border-top-left-radius: 0px;
    }
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