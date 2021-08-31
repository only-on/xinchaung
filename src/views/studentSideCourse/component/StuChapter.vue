<template>
  <div class="ctuChapter">
    <div class="main" v-if="chapterData.nums">
      <div v-if="chapterData.status === 0" class="mainrightTop">
        <div>
          <span class="black">课后习题</span>
          <span class="tip">(共{{ chapterData.nums }}题,满分{{ totalScoreAll }}分)</span>
        </div>
        <div>
          <a-button type="primary" @click="answerQues">答题</a-button>
          <a-modal
            title="提示"
            :visible="visable"
            @ok="submitOk"
            @cancel="submitCancel"
            cancelText="取消"
            okText="确定"
          >
            <p>习题只能提交一次，确定提交吗？</p>
          </a-modal>
        </div>
      </div>
      <div v-if="chapterData.status === 1" class="mainrightTop">
        <div>
          成绩
          <span class="orange">{{ chapterData.scores }}</span>
          分 满分
          <span class="gray">{{ chapterData.scores_all }}</span>
          分
        </div>
        <div>
          答对
          <span class="green">{{ chapterData.result_true }}</span>
          题 答错
          <span class="red">{{ chapterData.result_false }}</span>
          题
        </div>
      </div>
      <div class="chapter scroll-bar-customize">
        <div class="chapterList"
          :style="chapterData.status === 0 ? 'pointer-events:auto' : 'pointer-events:none'"
          v-for="(item) in chapterData.quest_list_questions" :key="item.id">

          <single-echoice v-if="item.type === 1" :index="item.index" :data="item" />

          <multipl-echoice v-if="item.type === 2" :data="item" :index="item.index" />
          
          <judge v-if="item.type === 3" :index="item.index" :data="item" />

        </div>
      </div>
    </div>
    <div class="empty" v-if="!chapterData.nums">
      <div class="emptyContent">
        <span class="emptyCon">当前章节暂无相关资料!</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,inject,reactive,Ref, computed } from 'vue'
import { useRouter } from 'vue-router';
import request from '../../../api/index'
import { IBusinessResp} from '../../../typings/fetch.d';
import MultiplEchoice from './MultiplEchoice.vue'
import SingleEchoice from './SingleEchoice.vue'
import judge from 'Judge.vue'
export default defineComponent({
  name: 'StuChapter',
  components: {
   MultiplEchoice,
   SingleEchoice,
   judge,
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    const http=(request as any).studentCourse
    const chapterData:any=reactive({})
    var visable:Ref<boolean> =ref(false)
    var totalScoreAll=computed(()=>{
      let scoreAll = 0
        // console.log(chapterData.quest_list_questions)
        if (chapterData.quest_list_questions && chapterData.quest_list_questions.length) {
          chapterData.quest_list_questions.forEach((item:any) => {
            scoreAll += item.default_score
          })
        }
        return scoreAll
    })
    function init(){
      // {course_id:501477,chapter_id:513342}
      // {course_id:501378,chapter_id:508992}
      http.questionsList({param:{course_id:501378,chapter_id:508992}}).then((res:IBusinessResp)=>{
       
       let data=res.data
       data.quest_list_questions?data.quest_list_questions.map((v:any,k:Number)=>{
         v.index=k
       }):''
      //  console.log(data)
       Object.assign(chapterData,data)
     })
    } 
   
    function answerQues(){
      visable.value=true
    }
    function submitOk(){

    }
    function submitCancel(){
        visable.value=false
    }
    onMounted(()=>{
     init()
    })
    function go(){
      // console.log(path);
      router.push('/Course/ContinueLearning/ContinueLearningSon')
    }
    return { go,chapterData,visable,totalScoreAll,answerQues,submitOk,submitCancel};
  },
})
</script>

<style scoped lang="less">
.ctuChapter{
  height: 100%;
  overflow: hidden;
  .main{
    background-color: rgba(247, 247, 247, 1);
    height: 100%;
  }
}
.chapter::-webkit-scrollbar-thumb {
  border-radius: 3px;
    background: #e3d9ff;
}
.chapter::-webkit-scrollbar{
  width: 8px;
}
.chapter {
    width: 100%;
    text-align: left;
    overflow: auto;
    background: #fff;
    height: calc(100% - 112px);
    padding: 0 30px;

    .chapterList {

        // height:486px;
        // overflow: auto;
        input:disabled,
        textarea:disabled,
        select:disabled,
        .bootstrap-select>.disabled,
        .form-control[disabled],
        input:disabled.btn-primary,
        input:disabled.btn-primary:hover {
            opacity: 0;
        }

        .title {
            background-color: #F6F6F6;
            padding: 8px 17px;

            .score {
                margin-left: 20px;
                color: #FFA900;
            }

            .typeThird {
                margin-left: 20px;
            }

            .radioAnswer {
                margin-left: 20px;
            }
        }

        .quesList {
            line-height: 22px;
            width: 100%;
            padding: 10px;
            vertical-align: middle;
            .quesList-item{
                width: 100%;
                display: flex;
                align-items: center;
               
            }
            .quesList-item-content{
                white-space: pre-wrap;
                word-break: break-all;
                word-wrap: break-word;
            }
        }

        .ant-checkbox-disabled+span {
            color: black;
        }

        .ant-radio-disabled+span {
            color: black;
        }

        .noClick {
            pointer-events: none;
        }
    }
}

.mainrightTop {
    width: 100%;
    padding: 15px 30px 35px;
    background-color: white;
    // margin-bottom: 20px;
    display: flex;
    .black {
        font-size: 18px;
        color: #050101;
        font-weight: bold;
    }

    .tip {
        font-size: 14px;
        margin-left: 20px;
        color: rgba(5, 1, 1, 0.48);
    }
    .orange {
        color: #FFA900;
        font-size: 40px;
        margin: 0 10px;
    }

    .gray {
        color: #777;
        font-size: 20px;
        margin: 0 10px;
    }

    .green {
        color: #62CB2B;
        font-size: 30px;
        margin: 0 10px;
    }

    .red {
        color: #F2222A;
        font-size: 30px;
        margin: 0 10px
    }
    div {
        // &:nth-of-type(1) {
        // }

        &:nth-of-type(2) {
            // float: right;
            margin-left: auto;
        }
    }

}
.ctuChapter {
    .empty {
        width: 100%;
        height: 613px;
        padding: 0px 20px;
        // margin: 20px;
        background-color: white;
        // border: 1px solid #ccc;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: url('../../../assets/images/empty.png');
        background-repeat: no-repeat;
        background-position: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .emptyContent{
            width: 100%;
            height: 100%;
            margin: 20px;
            display: flex;
            justify-content: center;
            align-items:center;
            .emptyCon {
                font-size: 18px;
                padding-top: 306px;
            }
        }
        .black {
            font-size: 18px;
            color: #050101;
            font-weight: bold;
        }

        .tip {
            font-size: 14px;
            margin-left: 20px;
            color: rgba(5, 1, 1, 0.48);
        }

        .orange {
            color: #FFA900;
            font-size: 40px;
            margin: 0 10px;
        }

        .gray {
            color: #777;
            font-size: 20px;
            margin: 0 10px;
        }

        .green {
            color: #62CB2B;
            font-size: 30px;
            margin: 0 10px;
        }

        .red {
            color: #F2222A;
            font-size: 30px;
            margin: 0 10px
        }
    }

}
</style>
