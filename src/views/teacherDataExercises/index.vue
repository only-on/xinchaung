<template>
    <div id='teacherDataExercises' v-layout-bg>
        <div class="conTop">
             <div class="searchInput">
                <a-input-search class="inputToSearch" v-model:value='searchValue' @keyup.enter="searchData" @search="searchData" placeholder="请输入题库名称关键字查询" />
            </div>
            <div v-if="type">
                <a-button type="primary" @click="createExceriseBtn">创建题库</a-button>
            </div>
             <a-modal class="createExercise" :visible="visible" title="创建题库" width="900px" @cancel="handleCancel" @ok="handleOk">
                <div class="modal-con">
                    <a-form ref="formRef" :model="form" :rules="rules">
                        
                        <a-form-item
                            label="名称"
                            required
                            name='name'
                            >
                            <div
                            class="classical__input--count-inner"
                            :class="{ 'classical__input--focused': nameFocused }"
                            >
                                <a-textarea
                                    rows="1"
                                    placeholder="请输入名称"
                                    v-model:value="form.name"
                                    showCount
                                    :maxlength="10"
                                    class="classical__folder-desc"
                                    @focus="handleNameFocused"
                                    @blur="handleNameBlurred"
                                />
                            </div>
                            <!-- <a-input
                                placeholder="请输入名称"
                                v-model:value='form.name'
                            /> -->
                        </a-form-item>
                        <a-form-item label="描述" name="description">
                            <div
                            class="classical__input--count-inner"
                            :class="{ 'classical__input--focused': descFocused }"
                            >
                                <a-textarea
                                rows="4"
                                v-model:value='form.description'
                                :maxlength="500"
                                placeholder="请输入描述内容"
                                showCount
                                class="classical__folder-desc"
                                @focus="handleDescriptionFocused"
                                @blur="handleDescriptionBlurred">
                                </a-textarea>
                            </div>   
                        </a-form-item>
                    </a-form>
                </div>
            </a-modal>
        </div>
        <component :is="componentName" :componentData='componentData' :searchValue='searchValue' @poolId='getPollId'/>
         <a-pagination
            class="pagination"
            v-model="pagination.current"
            :page-size-options="pagination.pageSizeOptions"
            :total="pagination.total"
            :hideOnSinglePage='true'
            show-size-changer
            :page-size="pagination.pageSize"
            @change="currentPageChange"
            @showSizeChange="onShowSizeChange"
        >
        </a-pagination>
    </div>
</template>
<script lang="ts">
import {defineComponent,inject,watch,reactive,toRefs, onMounted,toRef,Ref,ref,provide} from 'vue'
import privateExercises from './privateExercises/index.vue'
import shareExercises from './shareExercises/index.vue'
import request from "../../api";
import { message } from 'ant-design-vue';
interface Iitem{
  name:string,
  componenttype:any,
}
interface fromType{
    name?:string,
    description?:string,
    initial?:any,
}
interface ExerciseParam{
    name?:string,
    description?:string,
    initial?:any,
    limit?:number,
    page?:number,
}
interface paginationType{
     pageSizeOptions:string[],
     current:number,
     pageSize?:number,
     total?:number,
}
interface paramsType{
    pool_id:string
}
interface state{
    tabs:Array<Iitem>,
    componentName:string,
    componentNames:Array<string>,
    searchValue:string,
    componentData:any,
    form:fromType,
    pagination:paginationType,
    formRef:any,
    rules:any,
}
export default defineComponent({
    name:'teacherDataExercises',
    components: {
        privateExercises,
        shareExercises
    },
     setup:(props,context)=>{
        const nameFocused = ref(false);
        const descFocused = ref(false);
        const teacherDataExerApi = (request as any).teacherDataExercises
        const state:state=reactive({
            componentName:'',
            componentNames:['shareExercises','privateExercises'],
            tabs:[{name:'共有',componenttype:0},{name:'私有',componenttype:1}],
            searchValue:'',
            componentData:[],
            form:{},
            formRef:'formRef',
            rules:{
            name: [
                {required: true, message: '请输入内容', trigger: 'blur'},
            ],
             description:[
                {required: true, message: '请输入描述', trigger: 'blur'},
            ],
        },
            pagination:{
            pageSizeOptions:['10', '20', '30', '40', '50'],
            current:1,
            pageSize:10,
        }
       })
        var type:Ref<any>=ref(0)
        var visible:Ref<any>=ref(false)
        var componentData=ref([])
        var params:ExerciseParam={}
        var createParams:fromType={}
    var configuration:any=inject('configuration')
    var updata=inject('updataNav') as Function
    updata({tabs:state.tabs,navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true,backOff:false,showPageEdit:false})
    // 监听tab变化
    watch(()=>{return configuration.componenttype},(val)=>{
      state.componentName=state.componentNames[val]
        type.value=val
        state.searchValue=''
        params.name=''
        params.limit=10
        params.page=1
        if(type.value===0){
            params.initial=1
            getExerciseList(params)
        }else if(type.value===1){
            params.initial=0
            getExerciseList(params)
        }
        
    })
    // 请求列表数据
    function getExerciseList(params:any){
          teacherDataExerApi.getExerciseList({param:params}).then((res:any)=>{
            componentData.value=res?.data.list
            state.pagination.total=res?.data.page.totalCount
            state.pagination.pageSize=res?.data.page.perPage
            state.pagination.current=res?.data.page.currentPage
          })
    }
    // 查询
    function searchData(){
        console.log('查询')
        params.name=state.searchValue
        getExerciseList(params)
    }
    // 分页
    function currentPageChange(page:any){
        state.pagination.current=page
        params.page=page
         getExerciseList(params)
    }
    function onShowSizeChange(current:any,pageSize:any){
        console.log(current,pageSize)
        state.pagination.pageSize=pageSize
        params.limit=pageSize
        getExerciseList(params)
    }
    // 创建习题
    function createExceriseBtn(){
        visible.value=true   
    }
    // 题目字数限制
    function handleNameFocused(e: FocusEvent){
      console.log("[classical/panel] name focused");
      nameFocused.value = true;
    };
    function handleNameBlurred(e: Event){
      console.log("[classical/panel] name blurred");
      nameFocused.value = false;
    };
    // 描述字数限制
    function handleDescriptionFocused(e: FocusEvent){
      console.log("[classical/panel] description focused");
      descFocused.value = true;
    };
    function handleDescriptionBlurred(e: Event){
      console.log("[classical/panel] description blurred");
      descFocused.value = false;
    };
    
    function createExcerise(createParams:fromType){
        teacherDataExerApi.createExercise({param:createParams}).then((res:any)=>{
            console.log(res)
            getExerciseList(params)
        })
    }
    function handleOk(){
        console.log(state.form.name)
            if(!state.form.name){
                message.warning('请输入名称')
                return
            }
            if(!state.form.description){
                message.warning('请输入描述')
                return
            }
            createParams.name=state.form.name
            createParams.description=state.form.description
            createParams.initial=0
            console.log(state.form,'form')
            createExcerise(createParams)
            visible.value=false
            
        } 
    function handleCancel(){
         visible.value=false
    }
    // 删除
    function getPollId(id:any){
        console.log(id,'id')
        deleteExamList(id)
    }
    function deleteExamList(id:any){
           console.log(id,'id')
           let deleteParams: paramsType={pool_id:id}
           teacherDataExerApi.deleteExercise({urlParams:deleteParams}).then(()=>{
               getExerciseList(params) 
           })
    }
      return {...toRefs(state),
      params,
      createParams,
      type,
      componentData,
      visible,
      deleteExamList,
      getPollId,
      currentPageChange,
      onShowSizeChange,
      getExerciseList,
      createExceriseBtn,
      createExcerise,
      handleOk,
      handleCancel,
      searchData,
    nameFocused,
    descFocused,
    handleNameFocused,
    handleNameBlurred,
    handleDescriptionFocused,
    handleDescriptionBlurred}
    }
})
</script>
<style lang="less" scoped>
.conTop{
    display: flex;
    justify-content:space-between;
    margin-bottom: 20px;
    .inputToSearch{
       width:503px;
       padding:8px 5px 8px 30px;
    }
}
.createExercise .ant-modal-footer{
    text-align: center;
}
.modal-con a-form-item{
    display: flex;
    justify-content: center;
}
.createExercise .ant-form-horizontal .ant-form-item-label{
    width: 57px;
}
.pagination{
    text-align: center;
}
.classical__input--count-inner {
  border: 1px solid var(--black-85);
  border-radius: var(--border-radius-default);

  :deep(.ant-input) {
    border: none;
    resize: none;
  }

  :deep(.ant-input:focus) {
    box-shadow: none;
  }

  :deep(.ant-input-textarea-show-count::after) {
    margin-bottom: 0;
  }

  &:hover {
    border: 1px solid var(--purpleblue-6);
  }

  &.classical__input--focused {
    border: 1px solid var(--purpleblue-6);
    box-shadow: 0 0 0 2px var(--black-7);
  }
}
</style>