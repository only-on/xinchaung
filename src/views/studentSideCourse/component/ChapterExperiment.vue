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
          <span class="iconfont icon-baocun" v-if="saveOrEdit === 2" @click="ToSaveExperContent"></span>
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
          <QuillEditor toolbar="full" :options="options" v-model:content="content1"  />
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
import {QuillDeltaToHtmlConverter} from 'quill-delta-to-html'
import { defineComponent,ref, onMounted,reactive,Ref, computed,onBeforeMount,watch,toRefs,inject } from 'vue'
import { useRouter ,useRoute} from 'vue-router';
import request from '../../../api/index'
import { IBusinessResp} from '../../../typings/fetch';
import {message } from 'ant-design-vue';
import { QuillEditor } from "@vueup/vue-quill";
// import { Delta } from "quill-delta";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

import {toVmConnect,IEnvirmentsParam} from "src/utils/vmInspect" // 打开虚拟机

interface IdetailObj{
  saveOrEdit:number;
  experData:any;
  updatedAt:string;
  content1:string;
  studystr:string;
}
export default defineComponent({
  name: '',
  components: {
   QuillEditor
  },
  props:{
    experimentalId:{
      required:false,
      type:Number,
      default:0,
    },
    taskid:{
      required:false,
      type:Number,
      default:0,
    },
    experimentName:{
      required:false,
      type:String,
      default:'',
    },
    note_id:{
      required:false,
      type:String,
      default:'',
    },
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    const route = useRoute();
    const http=(request as any).studentCourse
    var id:Ref<number>=ref(0)
    var course_id:Ref<string>=inject('course_id')!
    var detailId=inject("detailId")
    var notesId:Ref<string>=ref('')
    const options = {
      placeholder: "输入内容...",
      theme: "snow",
    };
    const detail:IdetailObj=reactive({
      saveOrEdit:0,
      experData:null,
      updatedAt:'',
      content1:'',
      studystr:'',
    })
    watch(()=>{return props.experimentalId},(val:any)=>{
      // console.log(val)
       id.value=val
       detail.content1=''
       init()
    })
    notesId.value=props.note_id
    watch(()=>{return props.note_id},(val:any)=>{
      // console.log(val)
      notesId.value=val
    })
    id.value=props.experimentalId
    function init() {
      http.experimentalNotes({param:{id:id.value}}).then((res:IBusinessResp)=>{
        if(res){
            detail.studystr=res.data.study
            detail.updatedAt=res.data.note.updated_at
            detail.saveOrEdit=res.data.note.ops?3:1
            if(res.data.note.ops){
              detail.content1 = res.data.note.ops
              var converter = new QuillDeltaToHtmlConverter(res.data.note.ops, {})
              detail.experData = converter.convert()
            }
        }
      })
    }
    function clickExportNote(val:string) {
      const dev_base_url=import.meta.env.VITE_APP_BASE_API || ''
      let url=`${dev_base_url}/student-course/convert-as-pdf?note_id=${notesId.value}`
      fetch(url,{
          method: 'get',
      }).then((res:any) => {     
          return res.arrayBuffer();
      }).then(arraybuffer => {
          let blob = new Blob([arraybuffer], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
          let fileName = props.experimentName+".pdf";
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
          window.URL.revokeObjectURL(link.href);
      })
    }
    function ToSaveExperContent(val:any) {
      let obj={
        taskId:props.taskid,
        courseId:course_id,
        content:JSON.stringify(detail.content1)
      }
      http.SaveExperContent({param:{...obj}}).then((res:any)=>{
          notesId.value = res.note_id       // 新增时  刷新noteid
          message.success('操作成功')
          init()
      })
    }
    function toEdit() {
      detail.saveOrEdit = 2
    }
    function addNote() {
      detail.saveOrEdit = 2
    }
    function study(val:any) {
      console.log('准备虚拟机环境')
      let param:IEnvirmentsParam= {
        type: "course",
        opType: 'start',
        taskId: id.value,
      }

      toVmConnect(router,param,{detailId:detailId,course_id:course_id})
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
    return { go,getStudyStatus,addNote,study,clickExportNote,toEdit,ToSaveExperContent,options,...toRefs(detail)};
  },
})
</script>

<style scoped lang="less">
.quill{
      width: 100%;
    height: calc(100% - 35px);
    overflow: hidden;
}
.edit{
  width: 100%;
    height: 100%;
    overflow: auto;
}
:deep(.markdown__editor){
  height: auto;
}
:deep(.demo__emd){
  width: 100%;
}
:deep(.mark__body .mark__editor){
  min-width: auto;
  min-height: 360px;
}
:deep(.mark__body .mark__preview){
  min-width: auto;
}
  .experRight {
    background-color: rgba(247,247,247,1);
    height: 100%;
    overflow: hidden;
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
        // height: 541px;
        height: calc(100% - 78px);
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
            height:100%;
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
