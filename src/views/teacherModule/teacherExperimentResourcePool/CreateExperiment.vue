<template>
  <a-form :model="formState"  ref="formRef" layout="vertical" :label-col="{ span: 10 }" :wrapperCol="{ span: 20 }" :rules="rules">
    <div class="base-info">
    <h3 class="title">实验基本信息</h3>
    <div class="create-middle">
      <div class="left">
        <a-form-item label="实验名称" name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="实验难度" name="complexity">
          <div class="complexity flexCenter">
            <span
              @click="formState.level = 1"
              :class="formState.level === 1 ? 'active' : ''"
              >初级</span
            >
            <span
              @click="formState.level = 2"
              :class="formState.level === 2 ? 'active' : ''"
              >中级</span
            >
            <span
              @click="formState.level = 3"
              :class="formState.level === 3 ? 'active' : ''"
              >高级</span
            >
          </div>
        </a-form-item>
        <a-form-item label="知识点" name="selectedKnowledgeList">
          <div class="Knowledge">
            <div class="flexCenter">
              <a-button
                type="primary"
                @click="isShowKnowledge = true"
                :disabled="formState.selectedKnowledgeList.length >= 3"
                class="add-data-set-btn"
              >
                选择</a-button
              >
              <div class="data-set-hint">最多添加3个知识点</div>
            </div>
            <LabelDisplay
              :labels="formState.selectedKnowledgeList"
              @remove="removeKnowledge"
            ></LabelDisplay>
          </div>
          <knowledge-modal
            v-model:isShow="isShowKnowledge"
            v-model:selectedList="formState.selectedKnowledgeList"
          ></knowledge-modal>
        </a-form-item>
        <a-form-item label="添加标签" name="tags">
          <div>
              <LabelList :tag="formState.tags" :recommend="formState.recommend" />
            </div>
        </a-form-item>
      </div>
      <div class="right">
        <a-form-item label="课时" name="class_cnt">
          <a-input v-model:value="formState.class_cnt" />
        </a-form-item>
        <a-form-item label="所属技术方向" name="direction">
          <a-select
            v-model:value="formState.direction"
            placeholder="请选择技术方向"
          >
            <a-select-option :value="item.name" v-for="(item, index) in directionList" :key="index.toString()">
                {{ item.name }}
              </a-select-option>
            <!-- <a-select-option value="shanghai">Zone one</a-select-option>
            <a-select-option value="beijing">Zone two</a-select-option> -->
          </a-select>
        </a-form-item>
        <a-form-item label="实验报告" name="report">
          <div class="reportBox flexCenter">
            <!-- :disabled="formState.report.name ? true : false" -->
            <a-button type="primary" @click="selectReport()">选 择</a-button>
            <div class="data-set-hint">支持单个doc或docx格式文件上传</div>
          </div>
          <div class="reportName flexCenter" v-if="formState.report.name">
            <span class="iconfont icon-fujian"></span>
            <span class="name single_ellipsis" :title="formState.report.name">{{ formState.report.name }}</span>
            <span
              class="iconfont icon-shanchu"
              @click="delSelectedReport()"
            ></span>
          </div>
        </a-form-item>
        <a-form-item name="datasets" label="数据集" v-if="componentsList.includes('setData')">
          <div class="datasets-box flexCenter">
            <a-button
              type="primary"
              @click="formState.drawerVisible = true"
              :disabled="formState.selectedName.length >= 3"
              class="add-data-set-btn"
            >
              选择</a-button
            >
            <div class="data-set-hint">最多可选3个数据集</div>
          </div>
          <LabelDisplay :labels="formState.selectedName" @remove="remove"></LabelDisplay>
        </a-form-item>
      </div>
    </div>
    </div>
    <!-- 实验环境配置 -->
    <div class="configuration" v-if="componentsList.includes('configuration')">
      <Environment
        :type="formState.single"
        @handleOk="ConfirmConfiguration"
        :imageType="createTypeNumber === 2 ? 'jupyter':'vnc'"
      />
    </div>
    <!-- 桌面实验  实验指导 -->
    <div class="zhuomian" v-if="componentsList.includes('zhuomian')">
      <div class="guide">
        <div class="guide-top flexCenter">
          <h3>实验指导</h3>
          <div class="upload-box">
            <a-upload
              :custom-request="()=>{}"
              class="upload"
              :showUploadList="false"
              :before-upload="mdBeforeUpload"
              accept=".md"
            >
              <a-button type="primary"> 上传文档 </a-button>
            </a-upload>
            <i class="data-set-hint">仅支持md文件</i>
          </div>
          <div class="osd-mode">
            <!-- <span @click="openScreen()"> 进入同屏模式 </span> -->
            <a-button type="link" @click.stop="openScreen()" :loading="openScreenLoading">{{openScreenLoading?'连接中...':'进入同屏模式'}}</a-button>
          </div>
        </div>
      </div>
      <MarkedEditor v-model="formState.guide" class="markdown__editor" />
    </div>
    <!-- jupyter实验   实验指导 ipynb -->
    <div class="jupyter docxBox" v-if="componentsList.includes('jupyter')">
      <!-- <h3 class="guide-title">实验指导</h3> -->
      <div class="docTop flexCenter guide-title">
        <h3>实验指导</h3>
        <div class="docTopRight flexCenter docx">
          <span class="data-set-hint">仅支持ipynb文件</span>
          <a-upload
            accept=".ipynb"
            :custom-request="()=>{}"
            :show-upload-list="false"
            :before-upload="beforeUploadIpynb"
            :remove="IpynbFileRemove"
          >
            <a-button type="primary"> 上传文档</a-button>
          </a-upload>
        </div>
      </div>
      <div class="jupyterBox">
        <!-- <div class="uploadBox">
          <a-upload
            accept=".ipynb"
            :custom-request="()=>{}"
            :file-list="formState.ipynbList"
            :before-upload="beforeUploadIpynb"
            :remove="IpynbFileRemove"
          >
            <a-button type="primary"> 上传文档</a-button>
          </a-upload>
        </div>
        <div class="data-set-hint">仅选择ipynb文件</div> -->
        <div class="selectFile" v-if="formState.ipynbList.length">
          <span class="single_ellipsis" :title="formState.ipynbList[0].name">{{formState.ipynbList[0].name}}</span>
          <span class="iconfont icon-shanchu" @click.stop="formState.ipynbList=[]"></span>
        </div>
      </div>
    </div>
    <!-- 任务制实验 实验指导任务选择 -->
    <div class="TaskSystem" v-if="componentsList.includes('task')">
      <div class="top flexCenter guide-title">
        <h3>实验指导</h3>
        <a-button
          type="primary"
          @click="addTask()"
          :disabled="TaskLIst && TaskLIst.length >= 3 ? true : false"
        >
          添加任务
        </a-button>
      </div>
      <div class="item" v-for="(v, k) in TaskLIst" :key="v">
        <div class="title flexCenter" :class="{show: v.open}">
          <div class="left">
            <span class="num">{{ `任务${["一", "二", "三"][k]}` }}</span>
            <span v-show="!v.open">{{ v.name }}</span>
          </div>
          <div class="right">
            <span @click="deleteTask(k)">删除</span>
            <span @click="v.open = !v.open">{{
              v.open ? "收起" : "展开"
            }}</span>
          </div>
        </div>
        <div class="TaskContent" v-show="v.open">
          <div class="taskName">
            <div><span class="star">*</span>任务名称</div>
            <a-input
              v-model:value="v.name"
              placeholder="请输入任务名称"
            ></a-input>
          </div>
          <div class="taskStep">
            <div class="taskStepBox flexCenter">
              <div class="stepBox"><span class="star">*</span>任务描述</div>
              <!-- <a-button type="primary" size="small" @click="selectTaskMd(v,'description')">上传文档</a-button> -->
              <div @click="TaskMdTaskStep(k, 'description')">
                <a-upload
                  :custom-request="()=>{}"
                  class="upload"
                  :showUploadList="false"
                  :before-upload="TaskMdBeforeUpload"
                  accept=".md"
                >
                  <a-button type="primary" size="small"> 上传文档 </a-button>
                </a-upload>
              </div>
            </div>
            <MarkedEditor v-model="v.description" class="markdown__editor" />
          </div>
          <div class="taskDescription">
            <div class="statusBox flexCenter">
              <div>
                <span class="star">*</span>任务步骤
                <span class="status">状态</span
                ><a-switch
                  class="switch"
                  :checked="v.state"
                  @change="v.state = !v.state"
                />
              </div>
              <!-- <a-button type="primary" size="small" @click="selectTaskMd(v,'detail')">上传文档</a-button> -->
              <div @click="TaskMdTaskStep(k, 'detail')">
                <a-upload
                  class="upload"
                  :custom-request="()=>{}"
                  :showUploadList="false"
                  :before-upload="TaskMdBeforeUpload"
                  accept=".md"
                >
                  <a-button type="primary" size="small"> 上传文档 </a-button>
                </a-upload>
              </div>
            </div>
            <MarkedEditor v-model="v.detail" class="markdown__editor" />
          </div>
        </div>
      </div>
    </div>
    <!-- 文档实验  实验指导文件 -->
    <div class="docxBox" v-if="componentsList.includes('text')">
      <div class="docTop flexCenter guide-title">
        <h3>实验指导</h3>
        <div class="docTopRight flexCenter docx">
          <span class="data-set-hint">仅支持单个md、doc、docx、pdf文件</span>
          <a-button type="primary" @click="upDocx(1)"> 上传文档 </a-button>
          <a-button type="primary" @click="selectDocx(1)"> 选择文档 </a-button>
        </div>
      </div>
      <div v-if="formState.document.type === 'md'">
        <MarkedEditor v-model="formState.document.mdValue" class="markdown__editor" />
      </div>
      <div v-if="formState.document.type === 'pdf'" class="pdfBox">
        <!-- <PdfVue :url="formState.document.pdf" /> -->
        <div class="selectFile">
          <span class="single_ellipsis" :title="upDoc.docFileList[0] && upDoc.docFileList[0].name" v-if="upDoc.docFileList.length">{{upDoc.docFileList[0] && upDoc.docFileList[0].name}}</span>
          <span v-else>{{docOrMp4Drawer.activeFile.file_name}}</span>
          <span class="iconfont icon-shanchu" v-if="upDoc.docFileList.length || docOrMp4Drawer.activeFile.file_name" @click.stop="removeDocMp4"></span>
        </div>
      </div>
    </div>
    <!-- 视频实验  实验指导文件 -->
    <div class="docxBox" v-if="componentsList.includes('video')">
      <div class="docTop flexCenter guide-title">
        <h3>实验指导</h3>
        <div class="docTopRight flexCenter">
          <span class="data-set-hint">仅支持单个MP4文件上传</span>
          <a-button type="primary" @click="upDocx(2)"> 上传视频 </a-button>
          <a-button type="primary" @click="selectDocx(2)"> 选择视频 </a-button>
        </div>
      </div>
      <div class="video-box">
        <common-video v-if="formState.document.videoUrl" :src="formState.document.videoUrl" controls="true"></common-video>
      </div>
    </div>
    <div class="submitBox">
      <Submit @submit="create" @cancel="cancel"></Submit>
    </div>
  </a-form>
  <!-- 选择数据集 -->
  <a-drawer
    title="选择数据集"
    class="select-imag-drawer"
    :closable="true"
    placement="right"
    :visible="formState.drawerVisible"
    width="640"
    @close="closeDrawer"
  >
    <select-data-set
      v-model:value="formState.datasets"
      v-model:names="formState.selectedName"
    ></select-data-set>
  </a-drawer>
  <!-- 选择 和 设置实验实验报告模板 -->

  <SelectReport v-if="reportVisible" :selectedReport="formState.report"
    @reportCancel="reportCancel"
    @reportOk="reportOk"
  ></SelectReport>

  <!-- 上传文档 视频 文件 弹窗 -->
  <a-modal v-model:visible="upDocVisible" @cancel="cancelUpDoc" :title="`上传${docOrMp4Type === 1 ? '文档' : '视频'}文件`"
    class="uploadImage" :width="640">
    <a-select
      style="width: 400px; margin-bottom: 3rem"
      v-model:value="upDoc.catalogue"
      :placeholder="`请选择${docOrMp4Type === 1 ? '文档' : '视频'}目录`"
      :options="catalogueOptions"
    ></a-select>
    <a-upload-dragger
      :custom-request="()=>{}"
      :show-upload-list="false"
      :before-upload="docBeforeUpload"
      :remove="removeDocMp4"
      :multiple="false"

      :accept="docOrMp4Type === 1?`.md,.doc,.docx,.pdf`:`.mp4`"
      class="upload"
    >
      <p class="ant-upload-drag-icon">
        <span class="iconfont icon-upload"></span>
      </p>
      <p class="ant-upload-text">选择要上传的文件或将文件拖拽到此处</p>
      <p class="ant-upload-hint" v-if="docOrMp4Type === 1">
        支持单个md、doc、docx、pdf格式文件上传
      </p>
      <p class="ant-upload-hint" v-if="docOrMp4Type === 2">
        支持单个MP4格式文件上传 且文件小于500M
      </p>
    </a-upload-dragger>
    <div v-if="upDoc.docFileList.length&&upDoc.docFileList[0]?.name" class="progress-box">
      <div class="file-base-info">
        <span>文件名称：{{ upDoc.docFileList[0].name }}</span
        ><span class="icon-shanchu iconfont" @click="removeDocMp4"></span>
      </div>
      <a-progress :percent="upDoc.docFileList[0].percent" />
    </div>
    <template #footer>
      <Submit @submit="confirmDoc()" @cancel="cancelUpDoc()" :loading="(upDoc.docFileList && upDoc.docFileList.length && upDoc.docFileList[0].status !== 'done')?true:false"></Submit>
    </template>
  </a-modal>
  <SelectDocOrMp4 :activeFile="docOrMp4Drawer.activeFile" :visible="docOrMp4Drawer.visible" :docOrMp4Type="docOrMp4Type" @selectDocOrMp4File="selectDocOrMp4File" @closeDrawerDoc="closeDrawerDoc" />
  <!-- 同屏模式 -->
  <SameScreen
    ref="sameScreen"
    v-model:screenStatus="screenStatus"
    v-model="formState.guide"
    :screenInfo="screenVmInfo"
    :connection_id="connection_id"
  ></SameScreen>
</template>
<script lang="ts" setup>
import { getFileType,getFileTypeIcon,readFile } from "src/utils/getFileType";
import iconList from "src/utils/iconList";
import { SelectTypes } from "ant-design-vue/es/select";
import SameScreen from "src/components/teacherExperiment/sameScreen.vue";
import MarkedEditor from "src/components/editor/markedEditor.vue";
import PdfVue from "src/components/pdf/pdf.vue";
import Submit from "src/components/submit/index.vue";
import knowledgeModal from "src/views/teacherModule/teachCourse/createTestPaper/knowledgeModal.vue";
import LabelDisplay from "src/components/labelDisplay/index.vue";
import selectDataSet from "src/components/selectDataSet/selectDataSet.vue";
import Environment from "./component/Environment.vue";
import SelectReport from "./component/selectReport.vue";
import { ModalFunc } from "ant-design-vue/lib/modal/Modal";
import _ from "lodash";
import { UUID } from "src/utils/uuid";
import tusFileUpload from 'src/utils/tusFileUpload'
import { bytesToSize } from "src/utils/common"
import SelectDocOrMp4 from 'src/components/SelectDocOrMp4/index.vue'
import LabelList from 'src/components/LabelList.vue'
import videoCover from 'src/assets/images/common/videoCover.jpg'
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  watch,
  inject,
  nextTick,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import { resolve } from "path/posix";
import CommonVideo from "../../../components/common/CommonVideo.vue";
const $confirm: ModalFunc = inject("$confirm")!;
const router = useRouter();
const route = useRoute();
const { editId } = route.query;
const http = (request as any).teacherExperimentResourcePool;
const ExperimentTypeList = reactive({
  desktop: {
    type:1,
    title: "桌面实验",
    assembly: ["configuration", "", "zhuomian",'setData'],
    method:'createVnc'
  },
  Jupyter: {
    type:2,
    title: "Jupyter实验",
    assembly: ["configuration", "jupyter",'setData'],
    method:'createJupyter'
  },
  task: {
    type:3,
    title: "任务制实验",
    assembly: ["configuration", "task",'setData'],
    method:'createTask'
  },
  text: {
    type:4,
    title: "文档实验",
    assembly: ["text"],
    method:'createText'
  },
  video: {
    type:5,
    title: "视频实验",
    assembly: ["video"],
    method:'createVideo'
  },
});
var updata = inject("updataNav") as Function;
const createType = String(route.query.key);
const name = `创建${ExperimentTypeList[createType].title}`;
const componentsList = ExperimentTypeList[createType].assembly;
const createTypeNumber=ExperimentTypeList[createType].type;
const createMethod=ExperimentTypeList[createType].method;
updata({
  tabs: [{ name: name, componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
var isShowKnowledge = ref<boolean>(false);
interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  url?: string;
  file: string | Blob;
}
const formRef = ref();
const formState: any = reactive({
  tags:[],
  recommend:[],
  drawerVisible: false,
  datasets: [],
  selectedName: [],
  class_cnt: 2,
  name: "",
  level: 2,
  direction:'',
  selectedKnowledgeList: [],
  report: { id: 0, name: "" },
  imageConfigs: [],
  single: createType === "Jupyter" ? true : false, // 桌面 任务制多环境配置      jupyter 单环境
  reportUploadList: [],
  guide: "",
  ipynbList: [],
  document: {
    type: "md",
    pdf: "",
    mdValue: "",
    videoUrl:''
  },
});
const rules = {
  name: [
    { required: true, message: "请输入实验名称", trigger: "blur" },
    { max: 30, message: "实验名称最长为30个字符", trigger: "blur" },
  ],
  class_cnt: [
    { required: true, message: "" },
    { validator: classCutValidator, trigger: "blur" },
  ],
  report:[
    { required: true, message: "" },
    { validator: reportValidator, trigger: "change" },
  ],
  // selectedKnowledgeList:[
  //   { required: true, message: "" },
  //   { validator: selectedKnowledgeValidator, trigger: "change" },
  // ],
  tags:[
    { required: true, message: "" },
    { validator: tagsValidator, trigger: "blur" },
  ],
  direction:[
    { required: true, message: "请选择所属方向" ,trigger: "change" },
  ]
};
async function classCutValidator(rule: any, value: string) {
  if (!value) {
    return Promise.reject("请输入课时数");
  }
  const reg = new RegExp("^([1-9]|[1][0-6])$");
  if (!reg.test(String(formState.class_cnt))) {
    return Promise.reject("课时数为1~16之间整数");
  }
}
async function reportValidator(rule: any, value:any) {
  // console.log(value)
  if (!value.id) {
    return Promise.reject("请选择实验报告");
  }else{
    formRef.value.clearValidate('report')
    return Promise.resolve()
  }
}
async function selectedKnowledgeValidator(rule: any, value:any) {
  // console.log(value)
  if (!value.length) {
    return Promise.reject("请选择知识点");
  }else{
    formRef.value.clearValidate('selectedKnowledgeList')
    return Promise.resolve()
  }
}
async function tagsValidator(rule: any, value:any) {
  // console.log(value)
  if (!value.length) {
    return Promise.reject("请填写标签");
  }
}
const closeDrawer = () => {
  formState.drawerVisible = false;
};
watch(()=>{
  return isShowKnowledge.value
},(val:any)=>{
  // console.log(val);
  if(!val){
    selectedKnowledgeValidator({},formState.selectedKnowledgeList)
  }
})
// 移除知识点
function removeKnowledge(val: any, index: number) {
  formState.selectedKnowledgeList.forEach((v: any, k: number) => {
    if (v.id === val.id) {
      formState.selectedKnowledgeList.splice(k, 1);
    }
  });
}
// 移除数据集
function remove(val: any, index: number) {
  let i = formState.datasets.indexOf(val.uid);
  i != -1 ? formState.datasets.splice(i, 1) : "";
  formState.selectedName.splice(index, 1);
}

let currentUuid = ''
function create() {
  // console.log(TaskLIst)
  // return
  formRef.value.validate().then(async () => {
    currentUuid ? await removeTopo() : ''
    const docMp4File:any=upDoc.docFileList.length?upDoc.docFileList[0]:docOrMp4Drawer.activeFile;  // tusd上传的 或者选择的素材资源的
    const ipynbFileObj:any=createTypeNumber === 2 ? formState.ipynbList[0]:{}               // 是视频和文档公用一个 文件对象
    let selectedKnowledgeIds= formState.selectedKnowledgeList.reduce((pre:any, cur:any) => {
      pre.indexOf(cur.id) === -1 && pre.push(cur.id);
      return pre
    }, [])
     const docMp4FileObj:any={
       file_name:docMp4File.name || docMp4File.file_name
      // directory_id:upDoc.catalogue, // 选择资源时不用 目录id  docOrMp4Drawer.activeFile.file_url?
      // file_path:docMp4File.file_url  // md文件是guide  其他文件是file_path
    }
    const param={
      tags:formState.tags,
      type:createTypeNumber,  //
      name:formState.name,
      level:formState.level,
      direction:formState.direction,
      class_cnt:formState.class_cnt,
      ds:formState.datasets,
      knowledge:selectedKnowledgeIds,
      report:formState.report.id,
      container:formState.imageConfigs
    }
    if(docMp4File.suffix === 'md' || formState.document.mdValue){
      docMp4FileObj.directory_id = upDoc.catalogue
      docMp4FileObj.guide=formState.document.mdValue
      docMp4FileObj.file_path=docMp4File.file_url
    }else{
      docMp4FileObj.directory_id = docMp4File.dataset_id      // 取的已选资源的目录id
      docMp4FileObj.file_path=docMp4File.file_url
    }
    // console.log(docMp4File);
    (docOrMp4Drawer.activeFile.file_url || docMp4File.suffix === 'md' || formState.document.mdValue) ? '' : docMp4FileObj.directory_id=upDoc.catalogue
    // console.log(ipynbFileObj)
    if (createTypeNumber === 1 && formState.imageConfigs.length === 0) {
      message.warning('请添加实验环境')
      return
    }
    if(createTypeNumber === 2 && formState.ipynbList.length === 0){
      message.warning('请选择实验指导')
      return
    }
    if (createTypeNumber === 2 && !formState.imageConfigs[0].image) {
      message.warning('请选择实验环境')
      return
    }
    if(createTypeNumber === 3 && TaskLIst.length === 0){
      message.warning('请添加实验任务')
      return
    }
    if(createTypeNumber === 3 && TaskLIst.length !== 0){
      let flage=checkTask(TaskLIst)
      console.log(flage);
      if(!flage){
        return
      }
    }
    if([4,5].includes(createTypeNumber) && (!docMp4File.file_url && !docMp4FileObj.guide)){
      console.log(docMp4FileObj)
      message.warning('请选择实验指导')
      return
    }
    // console.log(docMp4FileObj)
    // return
    const {type,file_name,file_url,suffix,size,sort}=ipynbFileObj
    let parameter=[
      {
        guide:formState.guide,},
      {
        jupyter_tasks:{type,file_name,file_url,suffix,size,sort}
      },
      {
        tasks:TaskLIst
      },
      {
        document_file:{...docMp4FileObj}
      },
      {
        video_file:{...docMp4FileObj}
      }
    ]
    let obj=parameter[createTypeNumber-1]
    //  createTypeNumber
    // console.log(obj)
    // return
    http[createMethod]({param:{...param,...obj}}).then((res: IBusinessResp)=>{
      message.success('创建成功')
      router.go(-1);
    })
  });
}
const checkTask=(list:any)=>{
  let obj={name:'任务名称',description:'任务描述',detail:'任务步骤'}
  let obj2={0:'一',1:'二',2:'三'}
  let flage=true
  Object.keys(obj).forEach((key:string)=>{
    list.forEach((v:any,k:number)=>{
      if(!v[key]){
        let str=`请输入任务${obj2[k]}的${obj[key]}`
        message.warning(str)
        flage=false
        return
      }
      if(!flage){
        return
      }
    })
    if(!flage){
      return
    }
  })
  return flage
}
// 取消
function cancel() {
  currentUuid ? removeTopo() : ''
  router.go(-1);
}

var reportVisible = ref<boolean>(false);

const selectReport = () => {
  reportVisible.value = true;
};
function delSelectedReport() {
  formState.report.id = 0;
  formState.report.name = "";
}
const reportCancel = () => {
  reportVisible.value = false;
};
const reportOk = (val: any) => {
  // console.log(val)
  formState.report.id = val.id;
  formState.report.name = val.name;
  reportValidator({},formState.report)
};
// 同屏vm连接信息
let screenVmInfo: any = reactive([]);
let screenStatus = ref<boolean>(false);
const connection_id = ref('')
// 获取同屏连接信息请求参数
let screenParam: any = reactive({
  container: [],
  topo_id: "",
  dataset_id: [],
  notebook: [],
});
let sameScreen = ref();
let oldImageDataSelected: any = "";
let topoinstId = -1;
function pollGetVM(id: number) {
  screenVmInfo.length = 0;
  // clearInterval(timers);
  // screenStatus.value = true;
  getTopoVmInfo(id);
}
var openScreenLoading= ref<boolean>(false);
async function openScreen() {
  // message.warn("接口暂未调试");
  // return
  screenParam.container = [];
  screenParam.dataset_id = [];
  screenParam.topo_id = '';
  formState.selectedName.forEach((item: any) => {
    screenParam.dataset_id.push(item.uid);
  });
  formState.imageConfigs.forEach((item: any) => {
    screenParam.container.push({
      "image": item.image,
      "is_use_gpu": item.is_use_gpu,
      "flavor": item.flavor
    })
  });
  if (screenParam.container.length <= 0) {
    message.warn("请选择实验环境");
    return;
  }
  console.log(sameScreen.value);
  sameScreen.value.detail = formState.guide;
  // screenStatus.value = true
  currentUuid ? await removeTopo() : ''
  if (_.isEqual(oldImageDataSelected, formState.imageConfigs)) {
    pollGetVM(topoinstId);
  } else {
    getTopoBaseInfo()
      .then((res: any) => {
        console.log(res);
        if (res.code === 1) {
          if (res.data?.topo?.id) {
            screenParam.topo_id = res.data.topo.id;
          }
          currentUuid = res.data?.topoinst?.info?.uuid
          connection_id.value = res.data?.topoinst?.connection_id
          // oldImageDataSelected = _.cloneDeep(formState.imageConfigs);
          topoinstId = res.data.topoinst.topoinst_id;
          pollGetVM(res.data.topoinst.topoinst_id);
          // this.screenStatus = true
        }
      })
  }
}
function removeTopo() {
  return new Promise((response: any, reject: any) => {
    http.removeTopo({ param: {uuid: currentUuid} }).then((res: IBusinessResp) => {
      currentUuid = ''
      response(res);
    }).catch((err: any) => {
      reject(err);
    });
  })
}
function getTopoBaseInfo() {
  return new Promise((response: any, reject: any) => {
    http
      .getSameScreenInfo({ param: screenParam })
      .then((res: IBusinessResp) => {
        response(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
}
// 获取基础信息
function getTopoVmInfo(id: number) {
  openScreenLoading.value=true
  return new Promise((resolve: any, reject: any) => {
    http.getTopoVmInfo({ urlParams: { id } }).then((res: IBusinessResp) => {
      console.log(res);
      if (res.code === 1) {
        if (res.data.vms.length > 0) {
          screenVmInfo.push(...res.data.vms);
          screenStatus.value = true;
          openScreenLoading.value=false
          nextTick(() => {
            sameScreen.value.init();
          });
        } else {
          setTimeout(() => {
            getTopoVmInfo(id);
          }, 1500);
        }
      } else {
        openScreenLoading.value=false
        message.warn(res.msg);
      }
      resolve(res);
    }).catch(() => {
      openScreenLoading.value=false
    });
  });
}
const ConfirmConfiguration = (val: any) => {
  let arr:any=[]
  val.forEach((v:any) => {
    // console.log(v)
    const {ram,cpu,disk}=v.flavor
    let obj={
      image:v.image_id,
      is_use_gpu:v.flavor.gpu,
      flavor:{ram,cpu,disk}
    }
    arr.push(obj)
  });
  formState.imageConfigs = arr;
};
//   任务制实验
var TaskLIst: any = reactive([]);
const addTask = () => {
  TaskLIst.push({
    name: "",
    description: "",
    detail: "",
    state: false,
    open: true,
  });
};
const deleteTask = (k: number) => {
  TaskLIst.splice(k, 1);
};
const selectTaskMd = (v: any, key: string) => {
  // v[key]=
};
let jupyterUuid: any = ref(UUID.uuid4());
function beforeUploadIpynb(file: any) {
  let arr = file.name.split(".");
  if (arr[arr.length - 1] !== "ipynb") {
    message.warn("请上传jupyter文件");
    return;
  }
  if (file.name.length > 100) {
    message.warn(`文件名称长度不能超过100`);
    return
  }
  // formState.ipynbList[0]={}
  // console.log(file)
  let obj={
    id: 1,
    suffix:'ipynb',
    uid: file.uid,
    type:2,
    status: "uploading",// uploading
    sort:0,
    file_name:file.name,
    name:file.name,
    file_url:'',
    size:'',
  }
  // return false
  const fs = new FormData();
  fs.append("jupyter_file", file);
  // return
  http.uploadTaskFile({ param: fs }).then((res: any) => {
    message.success('上传成功');
    let data=res.data
    obj.status = "done",
    obj.file_url = data.url;
    obj.size = data.size;
    formState.ipynbList[0]=obj
  });
}
const IpynbFileRemove = () => {
  formState.ipynbList = [];
};
const mdBeforeUpload = async (file: any) => {
  const text = await readFile(file);
  formState.guide = text;
};
const TaskMdBeforeUpload = async (file: any) => {
  const text = await readFile(file);
  // console.log(text)
  TaskLIst[activeTaskMd.idx][activeTaskMd.key] = text;
};
const activeTaskMd: any = reactive({
  idx: 0,
  key: "",
});
const TaskMdTaskStep = (num: number, key: string) => {
  activeTaskMd.idx = num;
  activeTaskMd.key = key;
  // console.log(num)
};

// 文档实验
var upDoc: any = reactive({
  catalogue: '',
  docFileList: [],
  nowDocument: {
    // 正在上传  未确认的文档
    type: "md",
    pdf: "",
    mdValue: "",
    videoUrl:'',
  },
});
var upDocVisible = ref<boolean>(false);
const docBeforeUpload =(file: any) => {
  if (!upDoc.catalogue) {
    message.warn("上传文件时请选择目录");
    return false;
  }
  if (file.name.length > 100) {
    message.warn(`文件名称长度不能超过100`);
    return
  }
  console.log(file)
  // docOrMp4Type === 1  文档    docOrMp4Type === 2  视频
  // console.log(file)
  upDoc.docFileList[0]={status: 'done'}
  const postfix = (file && file.name).split(".")[1];
  if(postfix === "md" && docOrMp4Type.value === 1){
    // let obj:any={
    //   uid: file.uid,    // ant  渲染的key
    //   file_url:'',
    //   name:file.name
    // }
    // upDoc.docFileList[0]=obj
    upDoc.nowDocument.type = "md";
  }else{
    upDoc.nowDocument.type = "pdf";
  }
  // if (postfix === "md" && docOrMp4Type.value === 1){
  //   readFile(file).then((text:any)=>{
  //     // formState.document.mdValue = text;
  //     upDoc.nowDocument.mdValue = text;
  //     upDoc.docFileList[0].percent=100
  //     upDoc.docFileList[0].status="done"
  //     upDoc.docFileList[0].suffix='md'
  //   })
  // }else{
    let accept=docOrMp4Type.value === 1 ? ['md','doc','docx','pdf']:['mp4']
    let tusdDirKey=docOrMp4Type.value === 1 ? 'document_path' : 'video_path';
    console.log(file)
    tusFileUpload.onUpload(file,tusdDirKey,accept,upDoc.docFileList[0])
  // }
  docOrMp4Drawer.activeFile={}
  return false
};
const removeDocMp4=()=>{
  upDoc.nowDocument.mdValue=''
  if(upDoc.docFileList.length && upDoc.docFileList[0].status !== "done"){
    tusFileUpload.remove(upDoc.docFileList[0])
  }
  upDoc.docFileList=[]
  docOrMp4Drawer.activeFile={}
}
const upDocx = (n: number) => {
  // upDoc.docFileList.length=0
  docOrMp4Type.value = n;
  upDocVisible.value = true;
};
const docOrMp4Type = ref<number>(createTypeNumber === 4?1:2);
const docOrMp4Drawer: any = reactive({
  visible: false,
  activeFile: {}, //  选择或上传的文档、视频
});
// 目录  视频和文档公用字段   弹窗和抽屉共用
const catalogueOptions = ref<SelectTypes["options"]>([
  { label: "公有", options: [{ label: "共有1", value: 1 }] },
  { label: "私有", options: [{ label: "私有1", value: 2 }] },
]);
// 获取文档目录
const getCatalogue = () => {
  let type=docOrMp4Type.value === 1?7:4
  http.getCatalogueList({urlParams:{typeId:type}}).then((res: IBusinessResp) => {
    interface IOptions {
      value: string;
      label: string;
    }
    // console.log(res)
    let data = res.data;
    // console.log('[获取题库目录] ', data);
    catalogueOptions.value![0].options.length = 0;
    catalogueOptions.value![1].options.length = 0;
    (data.private && data.private.length)?data.private.forEach((v: any) => {
      let obj: IOptions = { value: v.id, label: v.name };
      catalogueOptions.value![1].options.push(obj);
    }):'';
    (data.public && data.public.length)?data.public.forEach((v: any) => {
      let obj: IOptions = { value: v.id, label: v.name };
      catalogueOptions.value![0].options.push(obj);
    }):'';
    if(data.private && data.private.length){
      upDoc.catalogue=data.private[0].id
    }
    if(data.public && data.public.length){
      upDoc.catalogue=data.public[0].id
    }
    //  upDoc.catalogue  默认第一个
  })
};

const selectDocx = (n: number) => {
  docOrMp4Type.value = n;
  docOrMp4Drawer.visible = true;
};
const closeDrawerDoc = () => {
  docOrMp4Drawer.visible = false;
};
const cancelUpDoc = () => {
  upDoc.nowDocument.mdValue=''
  if(upDoc.docFileList.length && upDoc.docFileList[0].status !== "done"){
    tusFileUpload.remove(upDoc.docFileList[0])
  }
  upDoc.docFileList=[]
  docOrMp4Drawer.activeFile={}
  upDocVisible.value = false;
};
// 选择系统内置文档或者视频
const env = process.env.NODE_ENV == "development" ? true : false;
const selectDocOrMp4File = (val: any) => {
  console.log(val)
  upDoc.docFileList.length=0
  docOrMp4Drawer.activeFile = { ...val};
  if(docOrMp4Type.value === 1){
    formState.document.type = val.suffix === 'md' ?'md':'pdf'
    formState.document.pdf = formState.document.type === 'md' ? '' : val.file_url
    formState.document.mdValue =formState.document.type === 'md' ? val.file_html : ''
  }else{
    formState.document.videoUrl=val.file_url
  }
};
//  视频实验
const confirmDoc = () => {
  console.log('file_url',upDoc.docFileList)
  if (!(upDoc.docFileList&&upDoc.docFileList.length)) {
    message.warning('请上传文件')
    return
  }
  if(docOrMp4Type.value === 1 && upDoc.docFileList && upDoc.docFileList.length){
    if(upDoc.docFileList[0].suffix !== 'md'){
      upDoc.nowDocument.mdValue=''
      upDoc.nowDocument.pdf=upDoc.docFileList[0].file_url
    }else{
      upDoc.nowDocument.mdValue = upDoc.docFileList[0].mdValue
      upDoc.nowDocument.pdf=''
    }
  }else if(upDoc.docFileList && upDoc.docFileList.length && docOrMp4Type.value === 2){
      // http://192.168.101.221:84/video/8f1fa06626f8cb2c1593787353fc6f5a.mp4
      upDoc.nowDocument.videoUrl=upDoc.docFileList[0].tusdVideoUrl
  }
  formState.document = {
    ...upDoc.nowDocument,
  };
  // console.log(formState.document)
  upDocVisible.value = false;
};

const detailInfoUrl = "/professor/classic/video/112/22/1523425771.mp4";

// 
const directionList:any=reactive([])

function getDirection() {
  directionList.length=0
  http.getDirection().then((res: any) => {
    const data= res.data;
    directionList.push(...data)
  });
}
onMounted(()=>{
  getDirection()
  if([4,5].includes(createTypeNumber)){
    getCatalogue()
    tusFileUpload.init()
  }
})

</script>
<style scoped lang="less">
.ant-form {
  margin-top: 32px;
  .guide-title {
    padding: 15px 0;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 16px;
  }
}
.datasets-box {
   margin-bottom: 1rem;
  .ant-btn {
    // margin-right: 1rem;
  }
  .add-data-set-btn {
    width: 100px;
    font-size: var(--base-font-size);
    border: 1px solid var(--primary-color);
    // margin-bottom: 1rem;
  }
}
.Knowledge{
  .ant-btn {
    // margin-bottom: 1rem;
  }
}
.data-set-hint {
  font-size: 12px;
  font-style: normal;
  color: var(--black-25);
  margin-left: 1rem;
}
.configuration {
  // padding: 2rem;
  // padding-top: 0;
  margin-bottom: 24px;
  padding:  24px;
  // padding-bottom: 30px;
  background-color: var(--white);
  .title {
    padding: 15px 0;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 16px;
  }
}
.base-info {
  background-color: var(--white);
  margin-bottom: 24px;
  padding: 0 24px 24px;
  .title {
    padding: 15px 0;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 16px;
  }
}
.create-middle {
  display: flex;
  .left,
  .right {
    width: 50%;
  }
  .right {
    .reportBox {
      // justify-content: space-between;
    }
    .reportName {
      margin-top: 1rem;
      color: var(--black-85);
      .icon-shanchu {
        margin-left: 1rem;
        cursor: pointer;
      }
      .icon-fujian{
        padding: 0 4px;
      }
      .name{
        max-width: 300px;
      }
    }
  }
}
.complexity {
  span {
    line-height: 34px;
    width: 100px;
    border: 1px solid #dfdfdf;
    color: rgba(51, 57, 75, 0.85);
    text-align: center;
    cursor: pointer;
  }
  .active {
    color: var(--primary-color);
    border-color: var(--primary-color);
  }
}

.zhuomian {
  padding: 24px;
  background-color: var(--white);
  h3 {
    margin-left: 24px;
  }
  .guide-top {
    display: flex;
    .upload-box {
      .upload {
        button {
          margin: 0 16px;
        }
      }
    }
    .osd-mode {
      margin-left: auto;
      color: var(--brightBtn);
      cursor: pointer;
      .ant-btn-link{
        color: var(--brightBtn);
        &:hover{
          color: var(--brightBtn);
        }
      }
    }
  }
  .markdown__editor {
    height: 400px;
    padding: 1rem 24px 0;
  }
}
.markdown__editor {
  height: 400px;
  padding-top: 8px;
}
.jupyter {
  // padding-top: 2rem;
  padding: 0 24px;
  background-color: var(--white);
  .jupyterBox {
    // padding: 2rem;
  }
  .uploadBox {
    width: 40%;
  }
}
.TaskSystem {
  // padding-top: 2rem;
  padding:  24px;
  background: var(--white);
  overflow: auto;
  .top {
    justify-content: space-between;
  }
  .item {
    padding: 0 24px;
    background-color: #F9F9F9;
    margin-bottom: 24px;
    .title {
      justify-content: space-between;
      padding: 1rem 0;
      &.show {
        border-bottom: 1px dashed #dbdbdb;
      }
      .left {
        color: var(--black-85);
        font-size: 16px;
        .num {
          margin-right: 2rem;
        }
      }
      .right {
        span {
          color: var(--primary-color);
          cursor: pointer;
          padding: 0 10px;
        }
      }
    }
    .TaskContent {
      .star {
        width: 12px;
        color: red;
      }
      .taskName {
        margin-top: 16px;
        margin-bottom: 24px;
        // padding: 6px 0;
        .ant-input {
          width: 400px;
          margin-top: 5px;
        }
      }
      .taskDescription {
        padding-bottom: 24px;
        .statusBox {
          // padding-top: 1rem;
          justify-content: space-between;
        }
        .status {
          margin-left: 20px;
          margin-right: 10px;
          color: #ccc;
        }
      }
      .taskStep {
        margin-bottom: 24px;
        .taskStepBox {
          // padding: 0rem 2rem 0;
          justify-content: space-between;
        }
      }
    }
  }
}
.docxBox {
  // padding-top: 2rem;
  padding: 0 24px;
  background-color: var(--white);
  .docTop {
    justify-content: space-between;
  }
  .pdfBox{
    width: 100%;
    height: 500px;
    margin-top: 24px;
  }
  .selectFile{
    padding-left: 2rem;
    display: flex;
    justify-content: space-between;
    // width: 40%;
    .iconfont{
      margin-left: 3rem;
      cursor: pointer;
    }
  }
  .docTopRight {
    // width: 32.5%;
    justify-content: space-between;
    .data-set-hint {
      margin-right: 1rem;
    }
    .ant-btn{
      margin-right: 8px;
    }
  }
  .docx {
    // width: 38%;
  }
  .video-box {
    min-height: 155px;
    // height: 500px;
    width: 100%;
    padding: 2rem;
    video {
      width: 100%;
      height: 650px;
      // object-fit: cover;
    }
  }
}
.uploadImage {
  .icon-upload {
    font-size: 24px;
    color: var(--primary-color);
  }
  .progress-box {
    margin-top: 10px;
    .file-base-info {
      display: flex;
      justify-content: space-between;
      &:hover {
        cursor: pointer;
        color: var(--primary-color);
      }
    }
  }
}
.submitBox {
  margin: 24px 0;
}
</style>
