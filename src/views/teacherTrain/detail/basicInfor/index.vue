<template>
    <div class="basicInfo">
        <div class="info-left">
            <a-form ref="formRef" :model="form" layout="vertical" :rules="rules">
                <a-form-item label="实训名称" name="name">
                    <a-input v-model:value='form.name' :disabled='edit' ></a-input>
                </a-form-item>
                <a-form-item label="课时" name="class_cnt">
                    <a-input v-model:value='form.class_cnt' :disabled='edit'></a-input>
                </a-form-item>
                <div class="time">
                    <a-form-item label="开始时间" name="start_times">
                        <a-date-picker class="time" placeholder="开始日期" v-model:value="form.start_times" valueFormat='YYYY-MM-DD' :disabled='edit'/>
                    </a-form-item>
                    <a-form-item label="结束时间" name="end_times">
                        <a-date-picker placeholder="结束日期" v-model:value="form.end_times" valueFormat='YYYY-MM-DD' :disabled='edit' />
                    </a-form-item>
                </div>
                <a-form-item label="实训指导书">
                   <a-textarea v-model:value="form.guide" style="height:279px" :disabled='edit' />
                </a-form-item>
            </a-form>
        </div>
        <div class="info-right">
            <div class="right-top">
                <div>实训封面</div>
                <a-button type="primary" v-if="edit" @click="toModifiy">修改</a-button>
                <a-button type="primary" v-else @click="saveModifiy">保存</a-button>
            </div>
            <div>
                <upload-image trainCreateOrEdit='create' :trainId="trainId" :edit='edit' :uploadUrl="propTrainDetailInfo.url" @img-src='imgSrc' v-model:value="form.url"></upload-image>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
interface IformType{
    name?:string,
    class_cnt?:number,
    start_times?:string,
    end_times?:string,
    guide?:string,
    url?:string
}
interface Istate{
    form:IformType,
    edit:boolean,
    formRef:any
}
import { defineComponent,onMounted,reactive,toRefs,watch} from 'vue'
import uploadImage from '../../components/uploadImage/uploadImage.vue'
import request from 'src/api/index'
// import requestFile from 'src/api/modules/'
import {cloneDeep} from 'lodash'
export default defineComponent({
    name:'basicInfor',
    props:['propTrainDetailInfo','trainId'],
    components:{uploadImage},
    setup(props,context){
        const http=(request as any).teacherTrain
        const rules={
            name: [{ required: true, message: '请输入实训名称'},],
            start_times: [{ required: true, message: '请选择开始时间'},],
            end_times: [{ required: true, message: '请选择结束时间'},],
            class_cnt: [{ required: true, message: '请输入课时'},],
            content: [{ required: true, message: '请输入帖子内容'}],
            }
        const state:Istate=reactive({
            form:{},
            edit:true,
            formRef:'formRef'
        })
        const methods={
            toModifiy(){
                state.edit=false
            },
            imgSrc(value:any){
                console.log(value)
                state.form.url=value
            },
            saveModifiy(){
                state.formRef.validate().then(() => {
                    http.saveModefiy({ 
                    urlParams: {train:props.trainId},
                    param:
                    {
                    name:state.form.name,
                    start_time:state.form.start_times,
                    end_time:state.form.end_times,
                    url:state.form.url,
                    class_cnt:state.form.class_cnt,
                    guide:state.form.guide,
                    courseware:''}})
                    .then((res:any)=>{
                        console.log(res)
                        state.edit=true
                        context.emit('save-success')
                    })
                })
                console.log(state.form)
            }
        }
        watch(()=>props.propTrainDetailInfo,(val:any)=>{
             state.form=cloneDeep(props.propTrainDetailInfo)
            },{
            deep:true,
            immediate:true
            })
        return{ ...toRefs(state),...methods,rules}
    }
})
</script>
<style lang="less" scoped>
.basicInfo{
    display: flex;
    .info-left{
        width: 50%;
        .time{
            display: flex;
            justify-content:space-between;
        }
    }
    .info-right{
        padding: 15px;
        width: 50%;
         .right-top{
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        }
    }
   
}
</style>
