<template>
  <div class="create-wrap" v-layout-bg>
    <div class="create-nav-head">
      <span>{{ skillName }} > {{ chapterName }}</span>
    </div>
    <div class="base-box">
      <a-form
        ref="formRef"
        :model="formState"
        layout="vertical"
        :rules="rules"
      >
        <div class="base-info">
          <a-form-item label="实验名称" name="name">
            <a-input v-model:value="formState.name" placeholder="请输入实验名称"/>
          </a-form-item>
          <a-form-item label="课时数" name="class_cnt">
            <a-input v-model:value="formState.class_cnt" placeholder="请输入课时数"/>
          </a-form-item>
        </div>
        <a-form-item label="实验环境" name="imageDataSelected">
          <a-button class="add-btn" @click="select('image')">
            <span class="iconfont icon-tianjia"></span>
          </a-button>
          <span class="max-hint">最多可选3个镜像</span>
        </a-form-item>
         <env-list :envData="formState.imageDataSelected"></env-list>
        <a-form-item label="数据集" name="selectedName">
          <a-button class="add-btn" @click="select('data')">
            <span class="iconfont icon-tianjia"></span>
          </a-button>
          <span class="max-hint">最多可选3个数据集</span>
          <div class="data-list-box">
            <div class="data-item" v-for="(item, index) in formState.selectedName" :key="item.uid">
              <span class="data-name">{{ item.name }}</span>
              <span class="wenjian iconfont icon-wenjian">256个</span>
              <span class="cunchuzhi iconfont icon-cunchuzhi">124MB</span>
              <span class="shanchu iconfont icon-shanchu" @click="removeDataSet(item, index)"></span>
            </div>
          </div>
        </a-form-item>
        <a-form-item label="实验指导" v-if="type === 'vnc'" name="guide">
          <div class="guide">
            <div class="guide-top">
              <div class="upload-box">
                <a-upload
                  class="upload"
                  :transform-file="transformFile"
                  :showUploadList="false"
                  :before-upload="mdBeforeUpload"
                  accept=".md"
                >
                  <a-button>
                    <span class="iconfont icon-upload"></span>
                    上传文档
                  </a-button>
                </a-upload>
                <i class="hint">仅支持md文件</i>
              </div>
              <div class="osd-mode">
                <span @click="openScreen">
                  <span class="iconfont icon-xushitongping"></span>
                  同屏模式
                </span>
              </div>
            </div>
          </div>
          <antdv-markdown v-model="formState.guide"  class="markdown__editor"/>
        </a-form-item>
        <a-form-item label="实验任务" v-if="type === 'note'" name="taskData">
          <task-list v-model:taskData="formState.taskData" :jupyterUuid="jupyterUuid"></task-list>
        </a-form-item>
        <a-form-item class="footer-btn">
          <a-button @click="cancel">取消</a-button>
          <a-button class="create-btn" type="primary" @click="submit">创建</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-drawer
      class="data-image-drawer"
      width="640"
      placement="right"
      :closable="false"
      :visible="visible"
      @close="onClose"
     >
      <div class="data" v-if="selectType === 'data'">
        <data-set v-model:value="formState.datasets" v-model:name="formState.selectedName"></data-set>
      </div>
      <div class="image" v-if="selectType === 'image'">
        <environment v-model="formState.imageDataSelected"></environment>
      </div>
    </a-drawer>
    <same-screen ref="sameScreen" v-model:screenStatus="screenStatus" v-model="formState.guide" :screenInfo="screenVmInfo"></same-screen>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, reactive, watch, onMounted, toRefs } from 'vue'
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { ITeacherExperHttp, ITreeList, IListSearchInfo, IExporimentList, IimageData } from './../experTyping'
import { useRoute, useRouter } from 'vue-router'
import dataSet from 'src/components/selectDataSet/selectDataSet.vue'
import environment from 'src/components/teacherExperiment/environment.vue'
import AntdvMarkdown from "@xianfe/antdv-markdown/src/index.vue";
import { MessageApi } from "ant-design-vue/lib/message";
import sameScreen from 'src/components/teacherExperiment/sameScreen.vue'
import taskList from './taskList.vue'
import envList from './envList.vue'
import { UUID } from 'src/utils/uuid'
import _ from 'lodash'
import { RuleObject } from 'ant-design-vue/es/form/interface';
interface Iparam{
  category_id: any
  name: string
  class_cnt: any
  container_ids: number[],
  dataset_ids: any,
  detail: string,
  jupyter_tasks: any,
  taskfile_subdir: any
}
export default defineComponent({
  components: {dataSet, environment, AntdvMarkdown, sameScreen, taskList, envList},
  setup() {
    let route = useRoute()
    let router = useRouter()
    const http=(request as ITeacherExperHttp).teacherExperiment
    const $message: MessageApi = inject("$message")!;
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:false,componenttype:undefined,showNav:true})
    const type = ref<string>(String(route.query.type))
    
    let jupyterUuid = ref(UUID.uuid4())

    // 技术名称
    const skillName = route.query.skill_name
    // 章节名称
    const chapterName = route.query.chapter_name
    let formState = reactive<formState>({
      name: '',
      class_cnt: 2,
      datasets: [],
      selectedName: [],
      // 已选择镜像数据
      imageDataSelected: [],
      // 实验指导
      guide: '',
      taskData:[{ name:'', status: false }]
    })
    let visible = ref<boolean>(false)
    let selectType = ref<string>()
    // 选择环境 数据集 抽屉
    function select(s: string) {
      selectType.value = s
      visible.value = true
    }
    function onClose() {
      visible.value = false
      selectType.value = ''
      formRef.value.validate()
    }
    let formRef = ref()
    function submit() {
      // console.log(_.findKey(taskData, ['name', '']))
      formRef.value.validate().then(() => {
         // console.log(formState, formRef.value, taskData)
         console.log(type.value)
        let param:Iparam = {
          category_id: route.query.chapter_id,
          name: formState.name,
          class_cnt: formState.class_cnt,
          container_ids: formState.imageDataSelected.map(v => v.id),
          dataset_ids: formState.datasets,
          detail: formState.guide,
          jupyter_tasks: [],
          taskfile_subdir: jupyterUuid.value
        }
        if (type.value === 'vnc') {
          http.createVnc({param}).then((res: IBusinessResp) => {
              $message.success('创建实验成功')
              router.push({
                path: '/teacher/teacherExperiment',
                query: {
                  course_index: route.query.course_index,
                  chapter_index: route.query.chapter_index,
                },
              })
          })
          return
        }
        if (_.findKey(formState.taskData, ['name', ''])) {
          $message.warn('请上传文件')
          return
        }
        if (_.findKey(formState.taskData, ['status', false])) {
          $message.warn('文件上传中，请稍后重试')
          return
        }
        formState.taskData.forEach((item: any, index: number) => {
          // console.log(item, index)
          const temp = {
            type: 1,
            file_name: item.data.file_name,
            file_url: item.data.file_path,
            suffix: item.data.suffix,
            size: item.data.size,
            sort: index, //排序
          }
          param.jupyter_tasks.push(temp)
        })
        http.createJupyter({param}).then((res: any) => {
            $message.success('创建实验成功')
            router.push({
              path: '/teacher/teacherExperiment',
              query: {
                course_index: route.query.course_index,
                chapter_index: route.query.chapter_index,
                currentTab: 0
              },
            })
        })
      }).catch((err: any) => {
        console.log(err)
      })
    }
    function cancel() {
      router.push({
        path: '/teacher/teacherExperiment/creatExperiment',
        query: {
          chapter_id: route.query.chapter_id,
          chapter_name: route.query.chapter_name,
          skill_name: route.query.skill_name,
          course_index: route.query.course_index,
          chapter_index: route.query.chapter_index,
        },
      })
    }
    // 移除镜像
    function removeImage(index: number) {
      formState.imageDataSelected.splice(index, 1)
    }
    // 移除数据集
    function removeDataSet(val: IselectedName, index: number) {
      let i = formState.datasets.indexOf(val.uid);
      i != -1 ? formState.datasets.splice(i, 1) : "";
      formState.selectedName.splice(index, 1);
    }
    // 上传md文件
    function mdBeforeUpload(file: any) {
      const suffix = (file && file.name).split('.')[1]
      console.log(suffix)
      if (suffix !== 'md') {
        $message.warn('请上传 .md 格式文件')
        return false
      }
      const reader = new FileReader()
      reader.readAsText(file, 'utf-8')
      reader.onload = () => {
        console.log(reader)
        if (reader.result) {
          formState.guide = reader.result
        }
      }
      return false
    }
    function transformFile(file: any) {
      console.log(file)
    }
    // 打开同屏
    let sameScreen = ref()
    let screenStatus = ref<boolean>(false)
    // 获取同屏连接信息请求参数
    let screenParam: any = reactive({
      container_id: [],
      topo_id: '',
      dataset_id: [],
    })
    // topo实例id
    let topoinstId = -1
    function openScreen() {
      screenParam.container_id = []
      screenParam.dataset_id = []
      formState.selectedName.forEach((item: any) => {
        screenParam.dataset_id.push(item.uid)
      })
      formState.imageDataSelected.forEach((item: any) => {
        screenParam.container_id.push(item.id)
      })
      if (screenParam.container_id.length <= 0) {
        $message.warn('请选择镜像')
        return
      }
      console.log(sameScreen.value)
      sameScreen.value.detail = formState.guide
      screenStatus.value = true
      getTopoBaseInfo().then((res: any) => {
        console.log(res)
        if (res.code === 1) {
          if (res.data?.topo?.id) {
            screenParam.topo_id = res.data.topo.id
          }
          // this.oldImageDataSelected = _.cloneDeep(this.imageDataSelected)
          topoinstId = res.data.topoinst.topoinst_id
          pollGetVM(res.data.topoinst.topoinst_id)
          // this.screenStatus = true
        }
      })
      .catch(err => {
        $message.warn(err.message)
      })
    }
    function getTopoBaseInfo() {
      return new Promise((response: any, reject: any) => {
        http.getSameScreenInfo({param: screenParam})
          .then((res: IBusinessResp) => {
            response(res)
          })
          .catch((err: any) => {
            reject(err)
          })
      })
    }
    let timers: any = null
    // 同屏vm连接信息
    let screenVmInfo: any = reactive([])
    function pollGetVM(id: number) {
      screenVmInfo.length = 0
      clearInterval(timers)
      timers = setInterval(() => {
        http.getTopoVmInfo({ param: {id} })
          .then((res: IBusinessResp) => {
            console.log(res)
            if (res.code === 1) {
              if (res.data.vms.length > 0) {
                screenVmInfo.push(...res.data.vms)
                // this.vncLoading = false
                clearInterval(timers)
                sameScreen.value.init()
                // this.screenStatus = true
              }
            }
          })
          .catch((err: any) => {
            $message.warn(err.message)
          })
      }, 1500)
    }
    // 获取同屏数据
    function getGuidData(val: any) {
      console.log(val)
      // this.form.detail = val
    }
    watch(
      () => screenStatus.value,
      (newVal) => {
        if (!screenStatus.value) {
          clearInterval(timers)
          topoinstId != -1
            ? http.deleteTopo({param: {
              id: topoinstId,
            }})
              .then((r: IBusinessResp) => {
                if (r.code === 1) {
                  $message.success('退出同屏模式！')
                }
              })
              .catch((err: any) => {
                $message.warn(err.message)
              })
            : ''
        }
      },
      {deep: true}
    )
    watch(()=>{return formState.guide},(val:any)=>{
      // console.log(val)
      formRef.value.validate()
    })
    // formState.taskData
    watch(()=>{return formState.taskData},(val:any)=>{
      console.log(val)
      formRef.value.validate()
    })
    // formState.guide
    // 模拟实验任务数据
    // let taskData: any = reactive([{ name: '', status: false }])
    // 删除上传文件list对象
    function deleteFile(i: number) {
      console.log(i)
      // this.taskData.splice(i, 1)
    }
    async function imageDataSelectedValidator(rule: RuleObject, value: string){
      // if (!value) return
      // console.log(value)
      if(formState.imageDataSelected.length===0){ 
        return Promise.reject('请选择实验环境')
      }else{
        return Promise.resolve()
      }
    }
    async function taskDataValidator(rule: RuleObject, value: string){
      // if (!value) return // fromState.taskData
      if(formState.taskData.length<=1 && formState.taskData[0].name===''){ 
        return Promise.reject('请选择实验任务')
      }
    }
    async function classCutValidator(rule: RuleObject, value: string){
      if (!value){
        return Promise.reject('请输入课时数')
      } 
      const reg = new RegExp('^([1-9]|[1][0-6])$')
      if(!reg.test(String(formState.class_cnt))){
        return Promise.reject('课时数为1~16之间整数')
      }
    }
    const rules = {
      name: [
        { required: true, message: '请输入实验名称', trigger: 'blur'},
        {pattern:/^[a-zA-Z0-9_\u4e00-\u9fa5]{0,20}$/,message: "实验名称只能包含汉字、数字、字母和下划线，名称最长为20字符", trigger: "blur"}
      ],
      class_cnt: [
        { required: true,message: '',},
        // {pattern:/^([1-9]|[1][0-6])$/,message: "课时数为1~16之间整数", trigger: "blur"},       
        {validator: classCutValidator, trigger: 'blur'}
      ],
      guide: [{ required: true, message: '请输入实验指导', trigger: 'blur' }],
      imageDataSelected: [
        {required: true,message: '',},
        { validator: imageDataSelectedValidator, message: '请选择实验环境'}
        ],
      taskData: [{ required: true, message: '',trigger: 'blur'},{ validator: taskDataValidator, trigger: 'blur'}],
    }
    return {
      jupyterUuid,
      formRef,
      type,
      skillName,
      chapterName,
      rules,
      formState,
      cancel,
      submit,
      selectType,
      select,
      visible,
      onClose,
      removeDataSet,
      removeImage,
      mdBeforeUpload,
      transformFile,
      openScreen,
      screenStatus,
      sameScreen,
      screenVmInfo,
      // taskData,
    }
  }
})
interface formState {
  name: string
  class_cnt: number | undefined
  datasets: string[]
  selectedName: IselectedName[]
  // 已选择镜像数据
  imageDataSelected: IimageData[]
  guide: any,
  taskData:any[]
}
interface IselectedName {
  uid: string
  name: string
}
</script>

<style lang="less" scoped>
.create-wrap {
  width: @center-width;
  margin: 0 auto;
  height: 100%;
  background-color: @white;
  overflow-y: scroll;
  .create-nav-head {
    line-height: 58px;
    border-bottom: 1px solid #eaeaea;
    text-align: center;
    margin-bottom: 24px;

    >span {
      display: inline-block;
      width: 850px;
      color: @theme-color;
      font-size: 16px;
      font-weight: 400;
      text-align: left;
    }
  }
  .base-box {
    width: 930px;
    margin: auto;
    .base-info {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .ant-form-item {
        width: 400px;
      }
    }
    .add-btn {
      width: 112px;
      height: 32px;
      border: 1px solid @theme-color;
      border-radius: 4px;
      color: @theme-color;
      .iconfont {
        font-weight: 600;
        font-size: 18px;
      }
    }
    .max-hint {
      color: rgba(5,1,1,.25);
      font-size: 12px;
      margin-left: 14px;
    }
    .footer-btn {
      text-align: center;
      font-size: 14px;
      margin-top: 35px;

      .create-btn {
        margin-left: 14px;
      }
    }
    .data-list-box {
      .data-item {
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        background: #f5f5f5;
        line-height: 38px;
        margin-top: 16px;
        padding: 0 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .data-name {
          flex: 1;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .shanchu {
          width: 20px;
          flex-shrink: 0;
          cursor: pointer;
        }
        .iconfont {
          color: rgba(0,0,0,.45);
          font-size: 14px;
        }
        .wenjian {
          margin-right: 50px;
        }
        .cunchuzhi {
          margin-right: 170px;
        }
      }
    }
    .guide {
      position: absolute;
      top: -38px;
      left: 80px;
      width: calc(100% - 80px)
    }
    .guide-top {
      display: flex;
      .upload-box {
        .upload {
          button {
            border: none;
            background: #ffffff;
            height: auto;
            color: @theme-color;
            .iconfont {
              margin-right: 8px;
            }
          }
        }
      }
      .hint {
        font-style: normal;
        margin-left: 15px;
        color: rgba(0, 0, 0, 0.2);
        font-size: 12px;
        line-height: 24px;
      }
      .osd-mode {
        margin-left: auto;
        color: @theme-color;
        cursor: pointer;
      }
    }
  }
}
.ant-select-dropdown-content {
  .ant-select-item {
    color: rgba(0,0,0,0.65);
    font-size: 14px;
  }
}
.mark__container.markdown__editor {
  min-height: 300px;
}
.data-image-drawer{
  .image,.data{
    height: 100%;
    overflow: hidden;
  }
}
</style>