<template>
  <a-form :model="formState"  ref="formRef" layout="vertical" :label-col="{ span: 10 }" :wrapperCol="{ span: 20 }" :rules="rules">
    <div class="create-middle">
      <div class="left">
        <a-form-item label="实验名称" name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="实验难度" name="complexity">
          <div class="complexity flexCenter">
            <span
              @click="formState.level = '1'"
              :class="formState.level === '1' ? 'active' : ''"
              >初级</span
            >
            <span
              @click="formState.level = '2'"
              :class="formState.level === '2' ? 'active' : ''"
              >中级</span
            >
            <span
              @click="formState.level = '3'"
              :class="formState.level === '3' ? 'active' : ''"
              >高级</span
            >
          </div>
        </a-form-item>
        <a-form-item name="datasets" label="知识点">
          <div class="Knowledge">
            <div class="flexCenter">
              <a-button
                type="primary"
                @click="isShowKnowledge = true"
                :disabled="formState.know_point.length >= 3"
                class="add-data-set-btn"
              >
                选择</a-button
              >
              <div class="data-set-hint">最多添加3个知识点</div>
            </div>
            <LabelDisplay
              :labels="formState.know_point"
              @remove="removeKnowledge"
            ></LabelDisplay>
          </div>
          <knowledge-modal
            v-model:isShow="isShowKnowledge"
            v-model:selectedList="formState.know_point"
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
          </a-select>
        </a-form-item>
        <a-form-item label="实验报告" name="report">
          <div class="reportBox flexCenter">
            <a-button type="primary" @click="selectReport()">选 择</a-button>
            <div class="data-set-hint">支持单个doc或docx格式文件上传</div>
          </div>
          <div class="reportName flexCenter" v-if="formState.report.name">
            <span class="iconfont icon-fujian"></span>
            <span class="name single_ellipsis">{{ formState.report.name }}</span>
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
    <!-- 实验环境配置 -->
    <div class="configuration" v-if="componentsList.includes('configuration')">
      <Environment
        :type="createTypeNumber === 4 ? true : false"
        @handleOk="ConfirmConfiguration"
        :imageType="createTypeNumber === 4 ? 'jupyter':'vnc'"
        :envList="formState.imageConfigs"
      />
    </div>
    <div class="submitBox">
      <Submit @submit="create" @cancel="cancel"></Submit>
    </div>
  </a-form>
  <!-- 选择数据集 -->
  <a-drawer
    title="选择数据集"
    class="select-imag-drawer"
    :closable="false"
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

</template>
<script lang="ts" setup>
import Submit from "src/components/submit/index.vue";
import knowledgeModal from "src/views/teacherModule/teachCourse/createTestPaper/knowledgeModal.vue";
import LabelDisplay from "src/components/labelDisplay/index.vue";
import selectDataSet from "src/components/selectDataSet/selectDataSet.vue";
import Environment from "./Environment.vue";
import SelectReport from "./selectReport.vue";
import { ModalFunc } from "ant-design-vue/lib/modal/Modal";
import _ from "lodash";
import { bytesToSize } from "src/utils/common"
import LabelList from 'src/components/LabelList.vue'
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  nextTick,
  watch
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import { resolve } from "path/posix";
const $confirm: ModalFunc = inject("$confirm")!;
const router = useRouter();
const route = useRoute();
const http = (request as any).teacherExperimentResourcePool;
const ExperimentTypeList = reactive({
  desktop: {
    type:1,
    title: "桌面实验",
    assembly: ["configuration", "", "zhuomian",'setData'],
    method:'createVnc'
  },
  Jupyter: {
    type:4,
    title: "Jupyter实验",
    assembly: ["configuration", "jupyter",'setData'],
    method:'createJupyter'
  },
  task: {
    type:5,
    title: "任务制实验",
    assembly: ["configuration", "task",'setData'],
    method:'createTask'
  },
  text: {
    type:7,
    title: "文档实验",
    assembly: ["text"],
    method:'createText'
  },
  video: {
    type:6,
    title: "视频实验",
    assembly: ["video"],
    method:'createVideo'
  },
});
const props = withDefaults(defineProps<{detail: any}>(), {
  detail: {}
});
const emit = defineEmits<{
  (e: "handleOk"): void;
  (e: "handleCancel"): void;
}>();
const currentTypeInfo: any = {}
Object.keys(ExperimentTypeList).forEach((k: string) => {
  if (ExperimentTypeList[k].type === props.detail.task_type) {
    Object.assign(currentTypeInfo, ExperimentTypeList[k])
  }
})
const componentsList = currentTypeInfo.assembly;
const createTypeNumber = props.detail.task_type;
const createMethod = currentTypeInfo.method;
const isShowKnowledge = ref<boolean>(false);
const formRef = ref();
const formState = reactive<any>({})
const saveImages = reactive<any>([])
watch(()=>props.detail, newVal => {
  Object.assign(formState, newVal)
  saveImages.length = 0
  formState.direction = formState.direction
  let arr:any = []
  formState.know_point ? formState.know_point.split(',').forEach((v: number, k: number) => {
    arr.push({
      id: Number(v),
      text: formState.konwledge_map[k]
    })
  }) : ''
  formState.know_point = arr
  formState.tags = formState.tag.map((v : any) => v.name)
  formState.report = formState.content_template ? {id: formState.content_template.template_id, name: formState.content_template.name} : ''
  formState.selectedName = []
  formState.datasets = []
  formState.dataset?.forEach((v: any) => {
    formState.selectedName.push(v.name)
    formState.datasets.push(v.uid)
  })
  formState.imageConfigs = []
  formState.env?.forEach((v: any, k: number) => {
    formState.imageConfigs.push({
      id: k,
      image_id: v.image.id,
      imageName: v.image.name,
      flavor: v.flavor,
      is_use_gpu: v.is_use_gpu
    })
  })
}, {deep:true,immediate:true})
// console.log(formState)
const rules = {
  name: [
    { required: true, message: "请输入实验名称", trigger: "blur" },
    { max: 30, message: "实验名称最长为30个字符", trigger: "blur" },
  ],
  class_cnt: [
    { required: true, message: "" },
    { validator: classCutValidator, trigger: "blur" },
  ],
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
const closeDrawer = () => {
  formState.drawerVisible = false;
};
// 移除知识点
function removeKnowledge(val: any, index: number) {
  formState.know_point.forEach((v: any, k: number) => {
    if (v.id === val.id) {
      formState.know_point.splice(k, 1);
    }
  });
}
// 移除数据集
function remove(val: any, index: number) {
  let i = formState.datasets.indexOf(val.uid);
  i != -1 ? formState.datasets.splice(i, 1) : "";
  formState.selectedName.splice(index, 1);
}

const ConfirmConfiguration = (val: any) => {
  if (!val.length) {
    formState.imageConfigs.length = 0
  }
  saveImages.length = 0
  val.forEach((v:any) => {
    const {ram,cpu,disk}=v.flavor
    let obj={
      image:v.image_id,
      is_use_gpu:v.flavor.gpu !== undefined ? v.flavor.gpu :v.is_use_gpu ,
      flavor:{ram,cpu,disk}
    }
    saveImages.push(obj)
  });
};

function create() {
  // console.log(formState)
  // return
  formRef.value.validate().then(() => {
    // let 
    const selectedKnowledgeIds = formState.know_point.reduce((pre:any, cur:any) => {
      pre.indexOf(cur.id) === -1 && pre.push(cur.id);
      return pre
    }, [])
    // 未改变实验环境直接保存
    let arr:any = []
    if (!saveImages.length) {
      formState.imageConfigs.forEach((item:any) => {
        if (item.image_id) {
          let obj = {
            flavor: item.flavor,
            image: item.image_id,
            is_use_gpu: item.is_use_gpu
          }
          arr.push(obj)
        }
      })
    }
    const param = {
      // id: formState.id,
      name: formState.name,
      direction: formState.direction,
      class_cnt: formState.class_cnt,
      level: Number(formState.level),
      knowledge: selectedKnowledgeIds,
      report: formState.report.id,
      tags: formState.tags,
      dataset_ids: formState.datasets,
      container: arr.length ? arr : saveImages
    }
    if (!param.container.length) {
      message.warn('实验环境不能为空')
      return
    }
    // return
    http.updateBaseInfo({urlParams: {id: formState.id}, param}).then((res: IBusinessResp)=>{
      message.success('编辑基本信息成功')
      cancel()
      emit("handleOk")
    })
  });
}
// 取消
function cancel() {
  emit("handleCancel")
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
};

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
})

</script>
<style scoped lang="less">
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
    margin-bottom: 1rem;
  }
}
.data-set-hint {
  font-size: 12px;
  font-style: normal;
  color: var(--black-25);
  margin-left: 1rem;
}
.configuration {
  padding: 2rem;
  padding-top: 0;
}
.create-middle {
  display: flex;
  padding: 2rem;
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
</style>
