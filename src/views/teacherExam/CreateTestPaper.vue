<template>
  <div v-layout-bg class="createPaper">
    <div class="header">
      <div class="left">
        <a-form :model="ForumSearch" :label-col="{span:3 }" labelAlign="left" :wrapper-col="{span: 19}" :rules="rules" :ref="formRef">
          <a-form-item label="试卷名称" name="name">
            <a-input v-model:value="ForumSearch.name" />
          </a-form-item>
          <a-form-item label="试卷描述" name="description">
            <a-textarea v-model:value="ForumSearch.description" />
          </a-form-item>
        </a-form>
      </div>
      <div class="right"></div>
    </div>
    <div class="questions">
      <div class="title">
        <div class="info">
          <div class="tit">试卷试题</div>
          <div class="fraction">
            （<span class="num1">已选试题：<span class="num">{{selectedPaperIds && selectedPaperIds.length}}</span>个</span><span>试题总分：<span class="num">{{totalScore}}</span>分</span>）
          </div>
        </div>
        <div>
          <a-button type="primary" @click="openSelectquestion">选择试题</a-button>
        </div>
      </div>
      <div class="list">
        <div class="tabs setScrollbar">
          <div class="tab" :class="activePaper===v.type?'activePaper':''" v-for="v in PaperList" :key="v.type" @click="activePaper=v.type,search.type_id=v.type_id">
            <div class="questionType"></div>
            <div class="type">{{v.name}}</div>
            <div>（{{v.data.length}}）</div>
          </div>
        </div>
        <div class="questionsList setScrollbar">
          <template v-if="avtiveData.length">
            <div  class="duo">
              <div class="item" v-for="(v,k) in selectQuestionList.data" :key="v">
                <div class="subject">
                  <div class="serial">
                    <span class="number">{{k+1}}、</span>
                    <span>{{v.question}}</span>
                    <span class="mark">（{{v.origin_score}}分）</span>
                  </div>
                  <i class="iconfont icon-yichu1" @click="selectquestion(v)"></i>
                </div>
                <template v-if="activePaper==='duo' || activePaper==='dan'">
                  <div class="options" v-for="(i,k) in v.options" :key="i" :class="answers(i.id,v.answers)?'selected':''">{{`选项${option[k]}、${i.option}`}}</div>
                </template>
                <template v-if="activePaper==='pan'">
                  <div v-for="i in v.options" :key="i.id" class="options" :class="answers(i.id,v.answers)?'selected':''">{{i.option}}</div>
                </template>
                <template v-if="activePaper==='tian' || activePaper==='jian'">
                  <div class="options">{{v.answers[0] && v.answers[0].answer}}</div>
                </template>
              </div>
            </div>
          </template>
          <div class="nodata" v-else>
            <div class="kong"><empty text="暂未添加该类型试题，可点击下方按钮在题库中选择添加" /></div>
            <div class="select-question"><a-button type="primary" @click="openSelectquestion">选择试题</a-button></div>
          </div>
        </div>
      </div>
    </div>
    <div class="submit">
      <a-button @click="cancel"> 取 消 </a-button>
      <a-button type="primary" @click="submit"> 保 存 </a-button>
    </div>
  </div>
  <a-drawer
    width="760"
    placement="right"
    :closable="false"
    v-model:visible="visible"
  >
    <div class="selectPaper">
      <div class="tabs">
        <div v-for="v in PaperList" :key="v.name" :class="v.type_id===search.type_id?'active':''" @click="activeChange(v)">{{v.name}}</div>
      </div>
      <div class="search">
        <div  class="item custom_select">
            <a-select style="width: 300px" v-model:value="search.pool_id"  placeholder="请选择题库" :options="catalogueOptions" @change="getQuestions"></a-select>
        </div>
        <div  class="item custom_select">
            <a-select style="width: 300px" v-model:value="search.level_id" placeholder="请选择试题难度" :options="options2" @change="getQuestions"></a-select>
        </div>
        <div class="item custom_input">
          <a-input-search v-model:value="search.name" placeholder="请输入搜索关键字" @search="getQuestions" />
        </div>
        <div class="item item4">
          <a-button type="primary" @click="selectquestionAll">全选（{{QuestionsList && QuestionsList.length}}）</a-button>
        </div>
        
      </div>
      <div class="dataList">
        <div class="list" >
          <div class="item" v-for="v in QuestionsList" :key="v.id">
            <div>
              <span>{{v.question}}</span>
              <span class="num">（{{v.origin_score}}）</span>
            </div>
            <span class="iconfont" :class="selectedPaperIds.includes(v.id)?'icon-yichu1':'icon--tainjia'" @click="selectquestion(v)"></span>
          </div>
        </div>
        <Empty v-if="!QuestionsList.length" text="暂未添加该类型试题！" />
        <a-pagination v-if="QuestionsList.length"
          show-size-changer
          v-model:current="search.page"
          v-model:pageSize="search.limit"
          :total="totalCount"
          @change="pageChange"
          @showSizeChange="onShowSizeChange"
        />
      </div>
    </div>
  </a-drawer>
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
    // const formRef = ref();
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
      //  console.log(search)
      // console.log(typeof search.pool_id);
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
    return {...toRefs(state),totalScore,QuestionsList,loading,ForumSearch,search,rules,PaperList,activePaper,option,catalogueOptions,options2,avtiveData,totalCount,selectedPaperIds,selectQuestionList,cancel,submit,activeChange,selectquestionAll,answers,selectquestion,getQuestions,onShowSizeChange,openSelectquestion,pageChange,screen,visible};
  },
})
</script>
<style  scoped lang="less">
.createPaper{
  height: 100%;
  overflow: hidden;
}
.header{
  display: flex;
  align-items: center;
  .left{
    flex-grow: 1;
  }
  .right{
    width: 254px;
    height: 193px;
    background: url(src/assets/images/teacherExam/creatExam.png) no-repeat;
    background-size:100% 100%;
  }
}
.questions{
  font-size: 16px;
  border: 1px solid #d5d5d5;
  height: calc(100% - 245px);
  overflow: hidden;
  .title{
    height: 58px;
    display: flex;
    padding: 0 40px;
    align-items: center;
    justify-content: space-between;
     border-bottom: 1px solid #d5d5d5;
    .info{
       display: flex;
       justify-content: space-between;
       align-items: center;
       .tit{
         margin-right: 50px;
       }
       .fraction{
         font-size: 14px;
         color: #929090;
         >span{
          //  color: rgb(5, 1, 1,.45);
         }
         .num{
           font-size: 18px;
            color: @theme-color;
            padding: 0 6px;
         }
         .num1{
           margin-right: 40px;
         }
       }
    }
  }
  .list{
    height: calc(100% - 58px);
    overflow: auto;
    display: flex;
    .tabs{
      overflow: auto;
      width: 80px;
      .tab{
        height: 130px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f4f4f4;
        cursor: pointer;
        color: rgb(4, 1, 1,.65);
        font-size: 14px;
        .questionType{
          width: 34px;
          height: 34px;
        }
        .type{
            padding-top: 10px;
          }
      }
      .activePaper{
        background: #fff;
      }
      .tab:nth-child(1){
        .questionType{
          background: url('src/assets/images/teacherExam/dan.png') no-repeat;
          background-size: 100% 100%;
        }
      }
      .tab:nth-child(2){
        .questionType{
          background: url('src/assets/images/teacherExam/duo.png') no-repeat;
          background-size: 100% 100%;
        }
      }
      .tab:nth-child(3){
        .questionType{
          background: url('src/assets/images/teacherExam/pan.png') no-repeat;
          background-size: 100% 100%;
        }
      }
      .tab:nth-child(4){
        .questionType{
          background: url('src/assets/images/teacherExam/tian.png') no-repeat;
          background-size: 100% 100%;
        }
      }
      .tab:nth-child(5){
        .questionType{
          background: url('src/assets/images/teacherExam/jian.png') no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .questionsList{
      flex-grow: 1;
      padding: 16px 10px 10px 31px;
      overflow: auto;
      .nodata{
        .kong{
          height: 70%;
        }
        .select-question{
          width: 100%;
          text-align: center;
        }
      }
      .duo{
        .item{
          .subject{
            padding: 6px 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #f4f4f4;
            color: #000;
            .serial{
              
            }
            .mark{
              color: #FF9300;
            }
            i{
              cursor: pointer;
              color: #777777;
            }
          }
          .options{
            padding: 6px 0 6px 32px;
          }
          .selected{
              color: #27BE8F;
            }
        }
      }
    }
  }
}
.submit{
  text-align: center;
  padding-top: 20px;
  .ant-btn{
    margin: 0 16px;
  }
}
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
    .ant-pagination{
      text-align: center;
    }
  }
}
</style>