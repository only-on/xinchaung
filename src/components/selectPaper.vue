<template>
  <div class="selectPaper">
    <div class="tabs">
      <div v-for="v in PaperList" :key="v.name" :class="v.type_id===search.type_id?'active':''" @click="activeChange(v)">{{v.name}}</div>
    </div>
    <div class="search">
      <div  class="item custom_select">
          <a-select style="width: 300px" v-model:value="search.pool_id"  placeholder="请选择题库" :options="catalogueOptions" @change="getQuestions"></a-select>
      </div>
      <div  class="item custom_select">
          <a-select style="width: 300px" v-model:value="search.level_id" placeholder="请选择试题难度" :options="difficultyOptions" @change="getQuestions"></a-select>
      </div>
      <div class="item custom_input">
        <a-input-search v-model:value="search.name" placeholder="请输入搜索关键字" @search="getQuestions" />
      </div>
      <div class="item item4">
        <a-button type="primary" @click="selectquestionAll">全选（{{QuestionsList && QuestionsList.length}}）</a-button>
      </div>
      
    </div>
    <div class="dataList setScrollbar">
      <div class="list" v-if="QuestionsList.length">
        <div class="item" v-for="v in QuestionsList" :key="v.id">
          <div>
            <span>{{v.question}}</span>
            <span class="num">（{{v.origin_score}}）</span>
          </div>
          <span class="iconfont" :class="selectedPaperIds.includes(v.id)?'icon-yichu1':'icon--tainjia'" @click="selectquestion(v)"></span>
        </div>
      </div>
      <Empty v-if="!QuestionsList.length" text="暂未添加该类型试题！" />
    </div>
    <a-pagination v-if="QuestionsList.length"
      show-size-changer
      v-model:current="search.page"
      v-model:pageSize="search.limit"
      :total="totalCount"
      @change="pageChange"
      @showSizeChange="onShowSizeChange"
    />
  </div>
</template>
<script lang="ts">
import { SelectTypes } from 'ant-design-vue/es/select';
import { defineComponent,ref, onMounted,reactive,Ref,inject, computed,toRefs } from 'vue'
import { useRouter,useRoute } from 'vue-router';
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch.d';
import { Modal,message } from 'ant-design-vue';
import { MessageApi } from "ant-design-vue/lib/message";
import empty from "src/components/Empty.vue";
interface IlistItem{
  id:number;
  name:string;
  question:string;
  origin_score:number;
  answersany:any;
  options:any;

}
interface IPaperList{
  name:string,
  type:string,
  type_id:number,
  data:any[],
  ids:number[]
}
interface ISearch{
  name:string;
  page:number;
  limit:number;
  level_id:string | undefined
  pool_id:string | undefined
  type_id:number
}
export default defineComponent({
  name: '',
  components: {
   empty
  },
  props: ["value",'totalScore','classifyValue'],
  setup:(props,{emit})=>{
    const $message: MessageApi = inject("$message")!;
    const http = request.teacherExam;
    var PaperList:IPaperList[]=reactive([{name:'单选题',type:'dan',type_id:1,data:[],ids:[]},{name:'多选题',type:'duo',type_id:2,data:[],ids:[]},{name:'判断题',type:'pan',type_id:3,data:[],ids:[]},{name:'填空题',type:'tian',type_id:4,data:[],ids:[]},{name:'简答题',type:'jian',type_id:5,data:[],ids:[]}])
    const catalogueOptions =ref<SelectTypes['options']>([{label:'公有',options:[]},{label:'私有',options:[]}])    // 题库目录
    const difficultyOptions =ref<SelectTypes['options']>([{value: '1', label: '简单'},{value: '2', label: '中等'},{value: '3', label: '困难'}])

    var selectedPaperIds:number[]=reactive([])          // 已选择的题目id  description
    var selectedPaperList:number[]=reactive([])          // 已选择的题目

    var QuestionsList:IlistItem[]=reactive([])
    var activePaper:Ref<string> =ref('dan')
    var totalCount:Ref<number> =ref(0)
    const totalScore = ref<number>(0);

    var search:ISearch=reactive({
      name:'',
      level_id:undefined,
      type_id:1,
      pool_id:undefined,
      page:1,
      limit:10
    })
    function selectquestion(val:any){
      let num=selectedPaperIds.indexOf(val.id)
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
        selectedPaperList.push(val)
        totalScore.value+=Number(val.origin_score)
      }else{
        selectedPaperIds.splice(num,1)
        selectedPaperList.splice(num,1)
        totalScore.value-=Number(val.origin_score)
      }
      
      emit("update:classifyValue", PaperList);
      emit("update:value", selectedPaperList);
      emit("update:totalScore", totalScore.value);
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
    function getQuestions(){
      //  console.log(search)
      // console.log(typeof search.pool_id);
      let obj={
        ...search,
        pool_id:search.pool_id?search.pool_id:'',
        level_id:search.level_id?search.level_id:'',
      }
      http.getQuestions({param:{...obj}}).then((res:any)=>{
        QuestionsList.length=0
        QuestionsList.push(...res.data.list)
        totalCount.value=res.data.page.totalCount
      })
    }
    function initData(){
      // 获取题库目录
      http.pools({param:{limit:10000}}).then((res:any)=>{
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
    onMounted(()=>{
      getQuestions()
      initData()
    })
    return {QuestionsList,PaperList,search,totalCount,catalogueOptions,difficultyOptions,selectedPaperIds,pageChange,onShowSizeChange,selectquestion,activeChange,getQuestions,selectquestionAll}
  }
})
</script>
<style  scoped lang="less">
.selectPaper{
  height: 100%;
    display: flex;
    flex-direction: column;
  .tabs{
    display: flex;
    align-items: center;
    justify-content: space-between;
    div{
      width: 138px;
      height: 38px;
      border-radius: 6px 6px 0px 0px;
      color: #050101;
      text-align: center;
      line-height: 38px;
      cursor: pointer;
    }
    .active{
      color: @white;
      background-color: @theme-color;
    }
  }
  .search{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    padding: 30px 20px 0;
    .item{
      width: 300px;
      margin-bottom: 20px;
    }
    .item4{
      text-align: right;
    }
  }
  .dataList{
    height: calc(100% - 208px);
    overflow: auto;
    .list{
      padding: 0 20px;
      min-height: 430px;
      .item{
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 50px;
        .num{
          color: red;
        }
        .iconfont{
          color: @theme-color;
          font-size: 20px;
          cursor: pointer;
          padding: 0 12px;
        }
      }
    }
  }
  .ant-pagination{
      text-align: center;
    }
}
</style>