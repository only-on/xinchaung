<template>
  <div v-layout-bg class="detail">
    <div class="head-exam fixCenter">
      <div class="left">
        <div class="box fix">
          <div class="label fix">
            <span class="icon">*</span>
            <span class="name">试卷名称：</span>
          </div>
          <span class="text">{{detail.name}}</span>
        </div>
        <div class="box fix">
          <div class="label fix">
            <span class="icon">*</span>
            <span class="name">试卷描述：</span>
          </div>
          <span class="text">{{detail.description}}</span>
        </div>
      </div>
      <div class="right">
        <div class="examNum">
          <div class="">试卷总分：<span>{{totalScore}}</span></div>
          <div class="">已选试题：<span>{{selectedPaperIds && selectedPaperIds.length}}</span></div>
        </div>
      </div>
    </div>
    <div class="questions">
      <div class="title">
        <div class="tab" :class="activePaper===v.type?'activePaper':''" v-for="v in PaperList" :key="v.type" @click="activePaper=v.type">
          <i class="iconfont" :class="v.icon"></i>
          <span>{{v.name}}</span>
          </div>
      </div>
      <div class="questionsList">
        <template v-if="activeData.length">
          <div  class="PaperType setScrollbar">
            <div class="item" v-for="(v,k) in activeData" :key="v">
              <div class="subject">
                <div class="serial">
                  <span class="number">{{k+1}}、</span>
                  <span>{{v.question}}</span>
                  <span class="mark">（{{v.origin_score}}分）</span>
                </div>
                <!-- <i class="iconfont icon-yichu1" @click="selectquestion(v)"></i> -->
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
        <div class="noData" v-else>
          <div class="kong">
            <empty text="暂未添加该类型试题" />
          </div>
          <div class="select-question">
            <!-- <a-button type="primary" @click="openSelectquestion">选择试题</a-button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script  lang="ts">
import { defineComponent,ref, onMounted,reactive, toRefs,watch ,inject,Ref,computed} from 'vue'
import request from '../../api/index'
import { IBusinessResp} from '../../typings/fetch.d';
import { useRouter ,useRoute } from 'vue-router';
import { Modal,message } from 'ant-design-vue';
import extStorage from "src/utils/extStorage";
import chinaToPy from 'src/utils/py'
const http=(request as any).teacherExam
interface IPaperList{
  name:string,
  type:string,
  type_id:number,
  data:any[],
  ids:number[],
  icon:string
}
export default defineComponent({
  name: '',
  components: {
   
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const {detailId}= route.query
    const { lStorage } = extStorage
    const role = lStorage.get('role')
    const uid=lStorage.get('user_id')
    var activePaper:Ref<string> =ref('dan')
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:true,showNav:true,backOff:false,showPageEdit:false})

    var PaperList:IPaperList[]=reactive([{name:'单选题',type:'dan',icon:'icon-danxuanxuanzhong',type_id:1,data:[],ids:[]},{name:'多选题',type:'duo',icon:'icon-duoxuan',type_id:2,data:[],ids:[]},{name:'判断题',type:'pan',icon:'icon-panduanti',type_id:3,data:[],ids:[]},{name:'填空题',type:'tian',icon:'icon-tiankongti',type_id:4,data:[],ids:[]},{name:'简答题',type:'jian',icon:'icon-jiandati',type_id:5,data:[],ids:[]}])
    var option=['A','B','C','D','E','F','G']

    var selectedPaperIds:number[]=reactive([])          // 已选择的题目id  description
    const totalScore = ref<number>(0);
    var detail:any=reactive({name:'',description:''}) 
    var activeData=computed(()=>{
      var item:any[]=[] 
      PaperList.filter((v:any)=>{
          if(activePaper.value === v.type){
            item=v.data
          }
        }
      )
      return item
    })
    function answers(id:number,arr:any){
      let pitch= arr.find((item:any) => {
        return id === Number(item.answer)
      });
      // console.log(pitch)
      return pitch?true:false
    }
    function selectQuestion(val:any){
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
    function getPaperDetail(val:number){
      http.getPaperDetail({urlParams: {paper_id: val}}).then((res:IBusinessResp)=>{
        // console.log(res)
        let data=res.data
        detail.name=data.name
        detail.description=data.description
      })
    }
    function getDetailQuestions(val:number){
      http.getDetailQuestions({urlParams: {paper_id: val}}).then((res:IBusinessResp)=>{
        // console.log(res)
        let data=res.data
        data.forEach((v:any)=>{
          selectQuestion(v)
        })
      })
    }
    onMounted(()=>{
     getDetailQuestions(Number(detailId))
     getPaperDetail(Number(detailId))
      // init()
    })
    return {detail,PaperList,activePaper,activeData,answers,option,selectedPaperIds,totalScore}
  },
})
</script>
<style scoped lang="less">
.fix{
  display: flex;
  align-items: center;
}
.fixCenter{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.detail{
  height: 100%;
  overflow: hidden;
}
.head-exam{
  margin-bottom: 10px;
  .left{
    .box{
      line-height: 30px;
      margin-bottom: 15px;
      .label{
        width: 96px;
        font-size: 14px;
        color: #777;
        .icon{
          color: #de1010;
        }
        .name{
          font-weight: bold;
          min-width: max-content;
        }
      }
    }
  }
  .right{
    .examNum{
      width: 266px;
      height: 102px;
      background: url(src/assets/images/teacherExam/paper_num.jpg) no-repeat;
      background-size:100% 100%;
      div{
        height: 50%;
        // padding: 0 30px;
        color: #fff;
        font-size: 18px;
        text-align: center;
        span{
          font-size: 32px;
        }
      }
    }
  }
}
.questions{
  font-size: 16px;
  border: 1px solid #d5d5d5;
  height: calc(100% - 114px);
  overflow: hidden;
  padding: 8px;
  .title{
    height: 46px;
    display: flex;
    // padding: 0 40px;
    align-items: center;
    // justify-content: space-between;
    border-bottom: 1px solid #d5d5d5;
    .tab{
      width: 96px;
      height: 43px;
      text-align: center;
      line-height: 46px;
      cursor: pointer;
      color: #777;
      margin-bottom: -1px;
      i{
        color: var(--primary-color);
        margin-right: 5px;
      }
    }
    .activePaper{
      border-bottom: 3px solid var(--primary-color);
    }
  }
  .questionsList{
      flex-grow: 1;
      padding: 16px 10px 10px 31px;
      height: calc(100% - 46px);
      max-height: 900px;
      overflow: auto;
      .noData{
        .kong{
          height: 70%;
        }
        .select-question{
          width: 100%;
          text-align: center;
        }
      }
      .PaperType{
         overflow: auto;
         height: 100%;
        .item{
          .subject{
            padding: 6px 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #f4f4f4;
            color: #000;
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
</style>
