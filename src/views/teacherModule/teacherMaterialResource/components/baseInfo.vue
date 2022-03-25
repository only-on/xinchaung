<template>
<a-form :layout="'vertical'" :rules="rules" :model="formState" ref="baseInfoFormRef">
  <div class="left">
    <a-form-item :label="props.materialType+'名称'" name="name" required>
      <a-input v-model:value="formState.name" :placeholder="'请在这里输入'+props.materialType+'名称'" />
    </a-form-item>
    <a-form-item :label="props.materialType+'描述'" name="description">
      <a-textarea v-model:value="formState.description" :auto-size="{ minRows: 3, maxRows: 5 }" placeholder="请在这里输入描述文字" />
    </a-form-item>
    <a-form-item label="添加标签" name="tags">
      <div class="label-list">
        <span
          v-for="(item, index) in formState.tags"
          :key="index"
          class="active"
        >
          {{ item }}
          <i
            class="remove iconfont icon-guanbi"
            @click="removeLabel(item)"
          ></i>
        </span>
        <span class="edit-box" v-if="formState.tags && formState.tags.length < 3">
          <span @click="clickCustomLabel" v-show="!openCustom">
            <span class="iconfont iconbiaoqian"></span>
            + 添加标签
          </span>
          <a-input
            ref="refCustomLabel"
            @pressEnter="customFinish"
            @blur="customFinish"
            @change="changeLabel"
            v-show="openCustom"
            v-model:value="customLabelV"
          />
        </span>
      </div>
      <div class="recommend" v-if="showTag">
        <div class="tit">或从推荐中选择</div>
        <span class="iconfont icon-guanbi" @click="showTag = false"></span>
        <div class="tagBox">
          <span 
            v-for="v in commonLabelsList" :key="v.id"
            @click="addTag(v)"
            :class="formState.tags.includes(v.name) ? 'act' : ''"
            >{{v.name}}</span
          >
        </div>
      </div>
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
      <img v-if="imageUrl" :src="imageUrl" alt="" srcset="">
      <a-upload
        v-model:file-list="fileList"
        list-type="picture"
        class="uploader"
        :show-upload-list="false"
        :before-upload="beforeUpload"
        @change="handleChange"
      >
        <div class="upload">
          <div class="cover">
            <img src="src/assets/images/teacherMaterialResource/cover.png" alt="">
          </div>
          <loading-outlined v-if="loading"></loading-outlined>
        </div>
      </a-upload>
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
const http = (request as any).teacherMaterialResource;
const $message: MessageApi = inject("$message")!;

const props = defineProps({
  materialType: String,
  editInfo: {
    type: Object as PropType<any>,
    require: false,
    default: {}
  }
})
interface IFormState {
  name: string
  description: string
  is_public: string
  tags: string[]
  // src: string
  cover: any
}
const formState = reactive<IFormState>({
  name: '',
  description: '',
  is_public: '0',
  // src: '',
  tags: [],
  cover: ''
})
const imageUrl = ref('')
if(Object.keys(props.editInfo).length){
  let arr=Object.keys(props.editInfo)
  arr.forEach((key:string)=>{
    formState[key]=props.editInfo[key]
    formState.is_public=formState.is_public?'1':'0'
    imageUrl.value=props.editInfo.cover
    // formState[key]?formState[key]=props.editInfo[key]:''
  })
}
// 上传封面图
const fileList:Ref<any>=ref([])
const loading = ref<boolean>(false)
const beforeUpload = (file:any) => {
  console.log(file)
  const isJpgOrPng = ['image/jpeg','image/png'].includes(file.type)
  if (!isJpgOrPng) {
    $message.warn('图片类型不正确')
    return false
  }
  formState.cover = file
  // formState.src = file
  // const fd = new FormData()
  // fd.append('upload_file', file)
  // http.upLoadCover({param:fd}).then((res:any)=>{
  //   loading.value = false
  //   console.log(res)
  //   formState.src = res.data.path
    // let data = res.data;
    // let obj = [
    //   {
    //     uid: "-1",
    //     name: data.name,
    //     status: "",
    //     url: data.path,
    //   },
    // ];
    // (state.ForumSearch.cover = data.path), (coverFileList.value = obj);
  // })
  // formState.src = "src/assets/images/cover2.png"
  // return false
}
function getBase64(img: Blob, callback: (base64Url: string) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
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
const handleChange = (info: FileInfo) => {
  console.log(info)
    loading.value = true
  getBase64(info.file.originFileObj, (base64Url: string) => {
    imageUrl.value = base64Url;
    loading.value = false;
  });
  if (info.file.status === 'uploading') {
    loading.value = true;
    return;
  }
  if (info.file.status === 'done') {
    // Get this url from response in real world.
    getBase64(info.file.originFileObj, (base64Url: string) => {
      imageUrl.value = base64Url;
      loading.value = false;
    });
  }
  // if (info.file.status === 'error') {
  //   loading.value = false;
  //   $message.error('upload error');
  // }
  // return false
};
// 添加标签
const openCustom: Ref<boolean> = ref(false);
const showTag: Ref<boolean> = ref(false);
const customLabelV = ref<string>('')
const refCustomLabel = ref<HTMLElement>()
function clickCustomLabel() {
  showTag.value = true;
  openCustom.value = true;
  nextTick(() => {
    refCustomLabel.value && refCustomLabel.value.focus();
  });
}
function removeLabel(val: string) {
  let num = formState.tags.indexOf(val);
  if (num !== -1) {
    formState.tags.splice(num, 1);
  }
}
function customFinish() {
  if (customLabelV.value.trim()) {
    formState.tags.push(customLabelV.value);
    customLabelV.value = "";
    openCustom.value = false;
  } else {
    openCustom.value = false;
  }
}
function changeLabel() {
  customLabelV.value =
    customLabelV.value.length > 10
      ? customLabelV.value.slice(0, 10)
      : customLabelV.value;
}
function addTag(val: any) {
  if (formState.tags.length < 3) {
    formState.tags.push(val.name);
  } else {
    $message.warn("最多添加3个标签");
  }
}

const rules = {
  name: [
    { required: true, message: `请输入${props.materialType}名称`, trigger: "blur" },
    { max: 20, message: `${props.materialType}名称最多20个字符`, trigger: "blur" },
  ],
}
// let baseInfoFormRef = ref<HTMLElement | null>(null)
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
    commonLabelsList.push(...data)
  })
}
onMounted(() => {
  getLabelsList()
})
</script>

<style lang="less" scoped>
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
.label-list {
  display: flex;
  flex-wrap: wrap;

  > span {
    margin: 0px 5px 0px 0px;
    padding: 5px 15px;
    background: #ebebeb;
    margin-bottom: 5px;
    position: relative;
    border-radius: 5px;
    margin-right: 10px;

    > .remove {
      position: absolute;
      font-size: 12px;
      background: red;
      width: 14px;
      height: 14px;
      top: -5px;
      right: -5px;
      border-radius: 50%;
      text-align: center;
      line-height: 14px;
      cursor: pointer;
    }

    &.active {
      background: var(--primary-color);
      color: #ffffff;
    }
  }

  .edit-box {
    margin: 0px 5px 0px 0px;
    padding: 0px 0px;
    background: #ebebeb;
    margin-bottom: 5px;
    position: relative;
    width: 120px;
    cursor: pointer;

    > span {
      // padding: 0px 15px;
      display: block;
      text-align: center;
      width: 100%;
      line-height: 30px;
      color: var(--primary-color);
      border: 1px solid var(--primary-color);
      border-radius: 5px;
      background: #ffffff;

      &:hover {
        background: #f8efff;
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
