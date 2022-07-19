<template>
<a-form :layout="'vertical'" :rules="rules" :model="formState" ref="baseInfoFormRef">
  <div class="info">
    <div class="left">
      <a-form-item :label="props.materialType+'名称'" name="name" required>
        <a-input v-model:value="formState.name" :placeholder="'请在这里输入'+props.materialType+'名称'" />
      </a-form-item>
      <a-form-item :label="props.materialType+'描述'" name="description">
        <a-textarea v-model:value="formState.description" :auto-size="{ minRows: 3, maxRows: 5 }" placeholder="请在这里输入描述文字" />
      </a-form-item>
    </div>
    <div class="right">
      <a-form-item label="可见范围" name="is_public" required class="visible-range">
        <a-select v-model:value="formState.is_public">
          <!-- 1-公开，0-私有 -->
          <a-select-option value="1">
            <span class="name">公开</span>
            <span class="tips">所有人可见</span>
          </a-select-option>
          <a-select-option value="0">
            <span class="name">私有</span>
            <span class="tips">仅自己可见</span>
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="封面图" class="cover">
        <upload-cover :coverUrl="formState" :isUpload="props.materialType === '数据集'" @uploadCoverHandle="uploadCoverHandle"></upload-cover>
      </a-form-item>
    </div>
  </div>
  <div class="type">  
    <a-form-item class="left" label="选择类型" name="categoryText" v-if="props.materialType === '数据集'">
      <a-radio-group
        name="radioGroup"
        v-model:value="formState.categoryText"
      >
        <a-radio
          v-for="(item, index) in navList"
          :value="item.name"
          :key="index"
        >
          {{ item.name }}
        </a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item class="right" label="添加标签" name="tags">
      <div>
        <LabelList :tag="formState.tags" :recommend="commonLabelsList" />
      </div>
    </a-form-item>
  </div>
</a-form>
</template>

<script lang="ts" setup>
import { ref, reactive, Ref, nextTick, inject, onMounted ,PropType} from 'vue'
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { MessageApi } from "ant-design-vue/lib/message";
import { LoadingOutlined } from '@ant-design/icons-vue';
import uploadCover from "src/components/uploadCover/index.vue"
import LabelList from 'src/components/LabelList.vue'
const http = (request as any).teacherMaterialResource;
const datasetHttp = (request as any).dataSet;
const $message: MessageApi = inject("$message")!;

const props = defineProps({
  materialType: String,
  editInfo: {
    type: Object as PropType<any>,
    require: false,
    default: {}
  },
  coverLoading: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits<{
  (e: "update:coverLoading", val: boolean): void;  // 上传文件的回调
}>();
interface IFormState {
  name: string
  description: string
  is_public: string
  tags: string[]
  src: string
  cover: any,
  categoryText: string
}
const formState = reactive<IFormState>({
  name: '',
  description: '',
  is_public: '0',
  src: '',
  tags: [],
  cover: '',
  categoryText: ''
})
const imageUrl = ref('')
if(Object.keys(props.editInfo).length){
  let arr=Object.keys(props.editInfo)
  arr.forEach((key:string)=>{
    formState[key]=props.editInfo[key]
    // formState.is_public=formState.is_public?'1':'0'
    imageUrl.value=props.editInfo.cover
    // formState[key]?formState[key]=props.editInfo[key]:''
  })
  // console.log(formState)
}
// 上传封面图
const uploadCoverHandle = (file: any) => {
  emit("update:coverLoading", true)
  const fd = new FormData()
  fd.append('upload_file', file)
  datasetHttp.upLoadCover({param:fd}).then((res:any)=>{
    emit("update:coverLoading", false)
    console.log(res)
    formState.cover = res.data.path
  })
}

interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
  type?: string;
  size: number;
  originFileObj: any;
}
interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}
const rules = {
  name: [
    { required: true, message: `请输入${props.materialType}名称`, trigger: "blur" },
    { max: 20, message: `${props.materialType}名称最多20个字符`, trigger: "blur" },
  ],
  categoryText: [
    { required: true, message: "请选择数据集类型", trigger: "change" },
  ],
}
let baseInfoFormRef = ref()
const fromValidate = () => {
  return new Promise((resolve: any, reject: any) => {
    baseInfoFormRef.value.validate().then(() => {
      console.log(formState) 
      resolve()
    })
  })
}
defineExpose({
  formState,
  fromValidate
})
const commonLabelsList: any = reactive([])
const getLabelsList = () => {
  commonLabelsList.length = 0
  http.getLabelsList().then((res: IBusinessResp) => {
    const data = res.data
    data.forEach(({name}: {name: string}) => {
      commonLabelsList.push({value: name, name})
    })
    // commonLabelsList.push(...data)
  })
}
onMounted(() => {
  getLabelsList()
  props.materialType === '数据集'?getNavList():''
})


// 获取选择类型列表
const navList = reactive<{name: string}[]>([])
const getNavList = () => {
  navList.length = 0
  datasetHttp.categoryList().then((res: IBusinessResp) => {
    console.log(res)
    navList.push(...res.data)
  })
}
</script>

<style lang="less" scoped>
.create {
  .info, .type {
    display: flex;
    justify-content: space-between;
  }
}
.left {
  width: 570px;
}
.right {
  width: 500px;
  .visible-range {
    .ant-select {
      width: 300px;
    }
  }
  .cover {
    height: 100%;
    img {
      width: 162px;
      height: 90px;
      border-radius: 17px;
      margin-right: 16px;
    }
  }
  .upload {
    width: 162px;
    height: 90px;
    background: #fffdfb;
    border: 1px dashed #ffdcc1;
    border-radius: 17px;
    img {
      width: 100%;
      height: 100%;
    }
    .cover {
      text-align: center;
      cursor: pointer;
      img {
        width: 70px;
      }
    }
  }
}
.recommend {
  width: 344px;
  color: var(--black-65);
  margin-top: 1rem;
  background: var(--white-100);
  border-radius: 10px;
  box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16); 
  padding: 0 10px;
  position: absolute;
  z-index: 9;
  .iconfont {
    position: absolute;
    top: 6px;
    right: 6px;
    font-size: var(--base-font-size);
    cursor: pointer;
  }
  .tit {
    padding: 4px;
  }
  .tagBox {
    display: flex;
    flex-wrap: wrap;
      span {
        display: inline-block;
        height: 20px;
        line-height: 20px;
        background: #ebebeb;
        border: 1px solid #dfdfdf;
        border-radius: 11px;
        font-size: 12px;
        color: var(--black-65);
        padding: 0 10px;
        margin-right: 8px;
        margin-bottom: 8px;
        cursor: pointer;
      }
      .act {
        background: var(--primary-color);
        color: #fff;
        // color: var(--primary-color);
      }
  }
}
</style>

<style lang="less">
.ant-select-item-option-content {
  display: flex;
  flex-direction: column;
  .tips {
    color: rgba(51,57,75,0.25);
    font-size: var(--font-size-sm);
  }
}
</style>
