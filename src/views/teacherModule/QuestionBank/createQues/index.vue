<template>
  <div class="create_ques">
    <a-form
      ref="formRef"
      name="advanced_search"
      class="ant-advanced-search-form"
      :model="formState"
      layout="vertical"
      :wrapperCol="{ span: 21 }"
      :rules="rules"
    >
      <a-row :gutter="24">
        <a-col v-if="type != 7" :span="12">
          <a-form-item name="purpose" label="题目用途">
            <a-select
              ref="select"
              v-model:value="formState.purpose"
              @focus="focus"
              @change="handleChange"
            >
              <a-select-option value="jack">考试题</a-select-option>
              <a-select-option value="lucy">作业题</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col v-if="!['5', '6'].includes(type) && type != 7" :span="12">
          <a-form-item name="difficulty" label="难度系数">
            <label-selection v-model:difficulty='formState.difficulty' :options='[{name:"简单",value:1},{name:"适中",value:2},{name:"困难",value:3}]'></label-selection>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="catalogue" label="选择目录">
            <a-cascader
              v-model:value="formState.catalogue"
              :options="options"
              placeholder="请选择"
            />
          </a-form-item>
        </a-col>
        <a-col :span="['1','2','3','4','7'].includes(type)? 12 : 24">
          <a-form-item name="knowledgePoints">
            <template v-slot:label>
              <div>
                知识点<span class="tiptit">最多可选择3个</span>
              </div>
            </template>
            <a-cascader
              v-model:value="formState.knowledgePoints"
              :style="['1','2','3','4','7'].includes(type) ? 'width:100%' : 'width:50%'"
              :multiple="true"
              max-tag-count="responsive"
              :options="options1"
              placeholder="请选择"
            ></a-cascader>
          </a-form-item>
        </a-col> 
        <!-- 题干 公有 -->
        <a-col v-if="type != 7" :span="24">
          <a-form-item name="stem" label="题干">
            <marked-editor
              v-model="formState.stem"
              :preview="preview"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <!-- 选择题 填空题-->
        <a-col v-if="['1','3'].includes(type)" :span="24">
          <answer-option-com :type='type' v-model:multipleQuesSelection="formState.multipleQuesSelection" @addItem='addItem(index)' @deleteItem='deleteItem(index)'></answer-option-com>
        </a-col>
        <!-- 判断题 -->
        <a-col v-if="type == 2" :span="24">
          <a-form-item label="答案选项" name="analysis">
            <div class="select_difficult">
              <span
                @click="formState.judgeAnswer = '1'"
                :class="formState.judgeAnswer === '1' ? 'active' : ''"
                >正确</span
              >
              <span
                @click="formState.judgeAnswer = '2'"
                :class="formState.judgeAnswer === '2' ? 'active' : ''"
                >错误</span
              >
            </div>
          </a-form-item>
        </a-col>
        <!-- 解答题 -->
        <a-col v-if="type == 4" :span="24">
          <a-form-item label="参考答案" name="referenceAnswer">
            <marked-editor
              v-model="formState.referenceAnswer"
              :preview="preview"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col v-if="type == 4" :span="24">
          <a-form-item label="关键词" name="keyword">
            <marked-editor
              v-model="formState.keyword"
              :preview="preview"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col v-if="!['5', '6'].includes(type) && type != 7" :span="24">
          <a-form-item label="题目解析" name="topicAnalysis">
            <marked-editor
              v-model="formState.topicAnalysis"
              :preview="preview"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div class="bottom_btn">
      <a-button style="margin-right: 10px" @click="reset">取消</a-button>
      <a-button type="primary" @click.prevent="onSubmit">保存</a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  ref,
  toRefs,
  onMounted,
  Ref,
  inject,
  computed,
  reactive,
  watch,
  toRaw,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { DownOutlined, UpOutlined } from "@ant-design/icons-vue";
import { Form } from "ant-design-vue";
import request from "src/api/index";
import markedEditor from "src/components/editor/markedEditor.vue";
import labelSelection from 'src/components/labelSelection/index.vue'
import uploadFile from 'src/components/uploadFile.vue'
import answerOptionCom from '../components/answerOptionsCom/index.vue'
import { Modal, message } from "ant-design-vue";
const route = useRoute();
const router = useRouter();
const type: any = ref(route.query.value);
const name: any = route.query.name;
const http = (request as any).studentAssignment;
const caseFile=http.caseFile
var updata = inject("updataNav") as Function;
const fileList: any = [];
updata({
  tabs: [{ name: "创建" + name, componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const preview = false;
const formRef = ref<any>();
const formState = reactive({
  // 名称
  name: "",
  // 用途
  purpose: "",
  // 选择的目录
  catalogue: [],
  // 难度系数
  difficulty: "1",
  // 知识点
  knowledgePoints: [],

  //内存限制
  memoryLimit:'',
  //时间限制
  timeLimit:'',
  //输入格式
  inputFormat:'',
  //输出格式
  outputFormat:'',
  //样例输入
  sampleInput:'',
  //样例输出
  sampleOutput:'',
  // 测试用例
  testCase:'1',
  // 用例文件
  useCaseFile:'',
  // 题干
  stem:'',
  // 参考答案
  referenceAnswer:'',
  // 关键词
  keyword:'',
  // 题目解析
  topicAnalysis:'',
  // 评测说明
  evaluationDescription:'',
  // 评测数据
  evaluationData:'',
  // 训练集路径
  trainingSetPath:'',
  // 验证集路径
  validationSetPath:'',

  // 选择题
  // 选项内容
  multipleQuesSelection:[
    {value:'',ifAnswer:false},
    {value:'',ifAnswer:false}
  ],
  // 答案
  judgeAnswer: "1",
});
var options: any[] = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake",
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men",
          },
        ],
      },
    ],
  },
];
const options1: any = [
  {
    label: "Light",
    value: "light",
    children: new Array(20)
      .fill(null)
      .map((_, index) => ({ label: `Number ${index}`, value: index })),
  },
  {
    label: "Bamboo",
    value: "bamboo",
    children: [
      {
        label: "Little",
        value: "little",
        children: [
          {
            label: "Toy Fish",
            value: "fish",
          },
          {
            label: "Toy Cards",
            value: "cards",
          },
          {
            label: "Toy Bird",
            value: "bird",
          },
        ],
      },
    ],
  },
];
var selectLabels: any = ref(["A", "B", "C", "D", "E", "F"]);
const selectOptions: any = ref([
  { label: 0, value: "" },
  { label: 1, value: "" },
]);
const rules = {
  name: [
    {
      required: true,
      trigger: "blur",
      message: "请输入名称",
    },
  ],
  purpose: [
    {
      required: true,
      tigger: "blur",
      message: "请选择用途",
    },
  ],
  catalogue: [
    {
      required: true,
      message: "请选择目录",
    },
  ],
  memoryLimit:[
    {
      required: true,
      message: "请输入内存",
    }
  ],
  timeLimit:[
    {
      required: true,
      message: "请输入时间",
    }
  ],
  difficulty: [
    {
      required: true,
      message: "请选择类别",
    },
  ],
  referenceAnswer:[
    {
      required: true,
      message: "请输入参考答案",
    },
  ],
  keyword:[
    {
      required: true,
      message: "请输入关键词",
    }
  ],
  stem: [
    {
      required: true,
      message: "请输入题干",
    },
  ]
};
const focus = () => {
  console.log("focus");
};
const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};
function addItem(index: any) {
  if (index == 5) {
    message.warning("最多六个选项！");
    return;
  }
  formState.multipleQuesSelection.push({value: "" ,ifAnswer:false});
}
function deleteItem(index: any) {
  if (formState.multipleQuesSelection.length == 2) {
    message.warning("最少两个选项！");
    return;
  }
  formState.multipleQuesSelection.splice(index, 1);
}
const onSubmit = () => {
  console.log(formState.multipleQuesSelection,'哈哈哈哈西西休息')
  formRef.value
    .validate()
    .then((res: any) => {
      console.log(res, toRaw(formState));
      
    })
    .catch((err: any) => {
      console.log("error", err);
    });
};
function createChoiceQues(){

}
const reset = () => {
  // formRef.value.resetFields();
  router.go(-1);
};
function handleChange1(info: any) {
  const status = info.file.status;
  if (status !== "uploading") {
    console.log(info.file, info.fileList);
  }
  if (status === "done") {
    message.success(`${info.file.name} file uploaded successfully.`);
  } else if (status === "error") {
    message.error(`${info.file.name} file upload failed.`);
  }
}
function handleDrop(e: any) {
  console.log(e);
}
function selectAnswer(){

}
</script>
<style lang="less" scoped>
.create_ques {
  background-color: var(--white-100);
  padding: 20px 40px;
}
.bottom_btn {
  display: flex;
  justify-content: center;
}
:deep(.ant-col-21) {
  max-width: 100%;
}
.tiptit{
  font-size: 12px;
  margin-left: 10px;
  color:var(--black-45);
}
:deep(.mark__container){
  border:1px solid var(--gray-5) !important;
}
</style>