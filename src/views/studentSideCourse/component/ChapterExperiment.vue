<template>
  <div class="experRight">
    <div class="rightTop">
      <div class="black">实验笔记</div>
      <div class="rightButton">
        <a-button :disabled="studystr === 'finish'" type="primary" @click="study(studystr)">
          {{ getStudyStatus(studystr) }}
        </a-button>
        <a-button
          class="excise"
          type="primary"
          @click="study('test')"
          v-if="studystr === 'rebuild' || studystr === 'finish'"
        >
          练习
        </a-button>
      </div>
    </div>
    <!-- 实验笔记内容 -->
    <div class="rightBottom">
      <div class="firstRow" v-if="saveOrEdit === 2 || saveOrEdit === 3">
        <div class="updatetime">修改日期：{{ updatedAt }}</div>
        <!-- <div></div> -->
        <div>
          <span class="iconfont icon-bianji1" v-if="saveOrEdit === 3" @click="toEdit"></span>
          <span class="iconfont iconbaocun" v-if="saveOrEdit === 2" @click="ToSaveExperContent"></span>
          <span class="iconfont icon-download" @click="clickExportNote('pdf')"></span>
        </div>
      </div>
      <div class="quill">
        <!-- 展示 -->
        <div v-if="saveOrEdit === 3" class="initQuill exhibation ql-snow">
          <div class="ql-editor" v-html="experData"></div>
        </div>
        <!-- 编辑 -->
        <div v-if="saveOrEdit === 2" class="edit">
          <!-- <quill-editor ref="myQuillEditor" v-model="content1" :options="editorOption" /> -->
        </div>
        <!-- 笔记内容为空 -->
        <div v-if="saveOrEdit === 1" class="empty">
          <div class="emptyContent">
            <div>该实验暂无笔记,可点击下方按钮添加。</div>
            <div><a-button type="primary" @click="addNote">添加笔记</a-button></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive,Ref, computed,onBeforeMount,watch,toRefs } from 'vue'
import { useRouter ,useRoute} from 'vue-router';
import request from '../../../api/index'
import { IBusinessResp} from '../../../typings/fetch';
import {message } from 'ant-design-vue';
interface IdetailObj{
  saveOrEdit:number;
  experData:any;
  updatedAt:string;
  content1:string;
  experimentDetail:any
  studystr:string;
}
export default defineComponent({
  name: '',
  components: {
   
  },
  props:{
    experimentalId:{
      required:true,
      type:Number,
      default:0,
    }
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    const route = useRoute();
    const http=(request as any).studentCourse
    var id:Ref<number>=ref(0)
    var saveOrEdit:Ref<number>=ref(0)
    const detail:IdetailObj=reactive({
      saveOrEdit:0,
      experData:null,
      updatedAt:'',
      content1:'',
      experimentDetail:{},
      studystr:''
    })
    watch(()=>{return props.experimentalId},(val:any)=>{
      console.log(val)
       id.value=val
        init()
    })
    id.value=props.experimentalId
    function init() {
      http.experimentalNotes({param:{id:id.value}}).then((res:IBusinessResp)=>{
        if(res){
            detail.studystr=res.data.study
            detail.experimentDetail=res.data
            detail.updatedAt=res.data.note.updated_at
            detail.saveOrEdit=res.data.note.length === undefined?3:1
            detail.experData=res.data.note.length
            // console.log(res.data.note.length)
            if(res.data.note.length){
              // var converter = new QuillDeltaToHtmlConverter(res.data.note.ops, {})
              // detail.experData = converter.convert()
            }
        }
      })
    }
    function clickExportNote(val:string) {
      
    }
    function ToSaveExperContent(val:any) {
      
    }
    function toEdit() {
      
    }
    function addNote() {
      saveOrEdit.value = 2
    }
    function study(val:any) {
      
    }
    function getStudyStatus(type:any) {
      let obj={'start':'开始学习','continue':'继续学习','finish':'重修','rebuild':'重修'}
      return obj[type]?obj[type]:''
    }
    onBeforeMount(()=>{
      init()
    })
    function go(){
      // console.log(path);
      router.push('/Course/ContinueLearning')
    }
    return { go,getStudyStatus,addNote,study,clickExportNote,toEdit,ToSaveExperContent,...toRefs(detail)};
  },
})
</script>

<style scoped lang="less">
  .experRight {
    background-color: rgba(247,247,247,1);

    .rightTop {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: white;
        border-radius: 4px;

        .black {
            font-size: 18px;
            font-weight: bold;
            padding: 15px 30px;
        }

        .rightButton {
            margin-right: 20px;
        }
        .excise{
            margin-left: 14px;
        }

        margin-bottom: 20px;
    }

    .rightBottom {
        background-color: white;
        height: 541px;
        padding:24px 20px;
        border-radius: 4px;
        .exhibation{
           border: none !important;
        }
        .firstRow{
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            .updatetime{
                font-size: 12px;
            }
            .iconfont {
                color: #8955B5;
                margin-left: 20px;
                cursor: pointer;
            }
        }

        .edit {
            .ql-editor {
                height: 370px;
            }
        }

        .exhibation {
            border: 1px solid #ccc;
            height: 463px;
            padding: 12px 15px;
            overflow-y: auto;
        }
        .empty{
            width:100%;
            height:508px;
            // padding:24px 30px;
            background-color: white;
            // border: 1px solid #ccc;
            background-image: url('../../../assets/images/empty.png');
            background-repeat: no-repeat;
            background-position: top center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .emptyContent {
                padding-top: 300px;

                div {
                    &:nth-of-type(1) {
                        font-size: 16px;
                        color: #050101;
                        margin-bottom: 30px;
                    }

                    &:nth-of-type(2) {
                        width: 100%;
                        text-align: center;
                    }
                }
            }
        }
    }

}
</style>
