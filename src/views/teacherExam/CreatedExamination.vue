<template>
  <div v-layout-bg class="createPaper">
    <h1>创建考试</h1>
  </div>
</template>
<script lang="ts">
import { SelectTypes } from 'ant-design-vue/es/select';
import { defineComponent,ref, onMounted,reactive,Ref,inject, computed,toRefs } from 'vue'
import { useRouter,useRoute } from 'vue-router';
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch.d';
import { Modal,message } from 'ant-design-vue';
interface IlistItem{
  id:number;
  name:string;
  question:string;
  origin_score:number;
  answersany:any;
  options:any;

}
interface IforumSearch{
  name:string,
  description:string,
}
interface ISearch{
  name:string;
  page:number;
  limit:number;
  level_id:string | undefined
  pool_id:string | undefined
  type_id:number
}
interface IPaperList{
  name:string,
  type:string,
  type_id:number,
  data:any[],
  ids:number[]
}
interface Istate{
  formRef:any,
}
export default defineComponent({
  name: '',
  components: {
    // dan
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    const route = useRoute();
    const {editId}= route.query
    var QuestionsList:IlistItem[]=reactive([])
    var PaperList:IPaperList[]=reactive([{name:'单选题',type:'dan',type_id:1,data:[],ids:[]},{name:'多选题',type:'duo',type_id:2,data:[],ids:[]},{name:'判断题',type:'pan',type_id:3,data:[],ids:[]},{name:'填空题',type:'tian',type_id:4,data:[],ids:[]},{name:'简答题',type:'jian',type_id:5,data:[],ids:[]}])
    var activePaper:Ref<string> =ref('dan')
    const catalogueOptions =ref<SelectTypes['options']>([{label:'公有',options:[]},{label:'私有',options:[]}])    // 题库目录
    const options2 =ref<SelectTypes['options']>([{value: '1', label: '简单'},{value: '2', label: '中等'},{value: '3', label: '困难'}])
    // var activeKey:Ref<string> =ref('dan')
    var totalCount:Ref<number> =ref(0)
    var option=['A','B','C','D','E','F','G']
    var loading:Ref<boolean> =ref(false)
    const visible = ref<boolean>(false);
    var selectedPaperIds:number[]=reactive([])          // 已选择的题目id  description
    const totalScore = ref<number>(0);
    // var formRef:Ref<string> =ref('formRef')
    const formRef = ref();
    const state:Istate=reactive({
      formRef:'formRef',
    })
    const http=(request as any).teacherExam
    const ForumSearch:IforumSearch=reactive({
      name:'',
      description:'',
    })
    var search:ISearch=reactive({
      name:'',
      level_id:undefined,
      type_id:1,
      pool_id:undefined,
      page:1,
      limit:10
    })
    var updata=inject('updataNav') as Function
    updata({showContent:true,navType:false,tabs:[],navPosition:'outside',backOff:true})

    const rules={
        name: [
          { required: true, message: '请输入试卷名称', trigger: 'blur'},
        ],
        description: [{ required: true, message: '请输入试卷描述类型', trigger: 'blur' }],
    }
    var selectQuestionList= computed(()=>{
      type Tactive=Pick<IPaperList,'data'|'ids'>
      let active:Tactive={
        data:[],
        ids:[]
      }
      PaperList.forEach((v:IPaperList)=>{
        if(v.type===activePaper.value){
          active={
            data:v.data,
            ids:v.ids
          }
        }
      })
      return active
    })
    var avtiveData=computed(()=>{
      var item:any[]=[] 
      PaperList.filter((v:any)=>{
          if(activePaper.value === v.type){
            item=v.data
          }
        }
      )
      return item
    })
    function initData(){
      // 获取题库目录
      http.pools().then((res:IBusinessResp)=>{
        interface IOptions{
          value:string,
          label:string,
        }
        let data=res.data.list
        // console.log('[获取题库目录] ', data);
        catalogueOptions.value![0].options.length=0
        catalogueOptions.value![1].options.length=0
        data.forEach((v:any)=>{
          let obj:IOptions={value: v.id, label: v.name}
          if(v.initial===1){
            catalogueOptions.value![0].options.push(obj)
          }else{
            catalogueOptions.value![1].options.push(obj)
          }
        })
        // console.log(catalogueOptions.value)
      })
    }
    function screen(){

    }
    function answers(id:number,arr:any){
      let pitch= arr.find((item:any) => {
        return id === Number(item.answer)
      });
      // console.log(pitch)
      return pitch?true:false
    }
    function getQuestions(){
      let obj={
        ...search,
        pool_id:search.pool_id?search.pool_id:'',
        level_id:search.level_id?search.level_id:'',
      }
      http.getQuestions({param:{...obj}}).then((res:IBusinessResp)=>{
        QuestionsList.length=0
        QuestionsList.push(...res.data.list)
        totalCount.value=res.data.page.totalCount
        visible.value=true
      })
    }
    const  openSelectquestion = () => {
      let obj={
        ...search,
        pool_id:search.level_id?search.pool_id:'',
        level_id:search.level_id?search.level_id:'',
      }
      // initData()
      http.getQuestions({param:{...obj}}).then((res:IBusinessResp)=>{
        QuestionsList.length=0
        QuestionsList.push(...res.data.list)
        totalCount.value=res.data.page.totalCount
         visible.value=true
      })
      
    };
    const onShowSizeChange=(current:any,pageSize:any)=>{
        search.limit=pageSize
        getQuestions()
      }
    const pageChange=(current:any,pageSize:any)=>{
      search.page=current
      getQuestions()
    }
    function selectquestionAll(){
      // let type=search.type_id
      QuestionsList.forEach((v:IlistItem)=>{
        if(!selectedPaperIds.includes(v.id)){
          selectquestion(v)
        }
      })
    }
    function selectquestion(val:any){
      let num=selectedPaperIds.indexOf(val.id)
      let typeId=1
      PaperList.forEach((v:IPaperList)=>{
        if(v.type_id===val.type_id){
          let idx=v.ids.indexOf(val.id)
          if(idx===-1){
            v.ids.push(val.id)
            v.data.push(val)
          }else{
            v.ids.splice(idx,1)
            v.data.splice(idx,1)
          }
        }
      })
      if(num===-1){
        selectedPaperIds.push(val.id)
        totalScore.value+=Number(val.origin_score)
      }else{
        selectedPaperIds.splice(num,1)
        totalScore.value-=Number(val.origin_score)
      }
      // totalScore
    }
    function activeChange(v:IPaperList){
      activePaper.value=v.type
      search.type_id=v.type_id
      search.name=''
      search.level_id=undefined
      search.pool_id=undefined
      search.page=1
      getQuestions()
      // console.log(search)
    }
    function submit(){
      // formRef.value.validate().then(()=>{
      state.formRef.validate().then(()=>{
        console.log('验证过');
        let obj={
          ...ForumSearch,
          questions:selectedPaperIds,
         type:'simple',
        }
        http.submitPaper({param:{...obj}}).then((res:IBusinessResp)=>{
          message.success(editId?'修改成功':'创建成功')
          router.go(-1)
        })
      })
    }
    function cancel(answer: any) {
      router.go(-1)
    }
    onMounted(()=>{
     initData()
    })
    return {formRef,totalScore,QuestionsList,loading,ForumSearch,search,rules,PaperList,activePaper,option,catalogueOptions,options2,avtiveData,totalCount,selectedPaperIds,selectQuestionList,cancel,submit,activeChange,selectquestionAll,answers,selectquestion,getQuestions,onShowSizeChange,openSelectquestion,pageChange,screen,visible};
  },
})
</script>
<style  scoped lang="less">

</style>