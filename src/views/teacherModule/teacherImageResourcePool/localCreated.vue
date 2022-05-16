<template>
  <div class="create-image-box">
    <a-form layout="vertical" ref="formRef" :model="image" :rules="rules">
      <a-form-item label="镜像文件" name="fileName">
        <upload-image @upload-imageinfo="uploadImageinfo" @upload-percentage="uploadPercentage"></upload-image>
      </a-form-item>
      <div class="create-img-middle">
        <div>
          <a-form-item label="镜像名称" name="name">
            <a-input class="form-input" v-model:value="image.name"></a-input>
          </a-form-item>
          <a-form-item label="添加标签" name="tag">
            <div>
              <LabelList :tag="image.tag" :recommend="recommend" />
            </div>
          </a-form-item>
          <!-- <a-form-item label="系统类型" name="ostype">
            <a-select
              class="form-input"
              v-model:value="image.ostype"
              placeholder="请选择系统类型"
            >
              <a-select-option
                :value="item.name"
                v-for="(item, index) in image.image_classify"
                :key="index.toString()"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item> -->
        </div>
        <div>
          <!-- <a-form-item label="镜像类型" required>
            <a-input
              class="form-input"
              disabled
              v-model:value="image.classify_id"
            ></a-input>
            是通过上传的文件获取的文件类型
          </a-form-item> -->
          <a-form-item label="系统类型" name="ostype">
            <a-select
              class="form-input"
              v-model:value="image.ostype"
              placeholder="请选择系统类型"
            >
              <a-select-option
                :value="item.name"
                v-for="(item, index) in image.image_classify"
                :key="index.toString()"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <!-- <a-form-item label="添加标签" name="tag">
            <div>
              <LabelList :tag="image.tag" :recommend="recommend" />
            </div>
          </a-form-item> -->
        </div>
      </div>
      <a-form-item label="镜像描述">
        <a-textarea
          placeholder="镜像描述"
          class="ant-input-desc"
          v-model:value="image.desc"
          :auto-size="{ minRows: 6, maxRows: 8 }"
        ></a-textarea>
      </a-form-item>
    </a-form>
    <Submit @submit="create" @cancel="cancel"></Submit>
  </div>
</template>

<script lang="ts" setup>
import {
  defineComponent,
  watch,
  Ref,
  ref,
  inject,
  reactive,
  toRefs,
  onMounted,
  nextTick,
} from "vue";
import tusFileUpload from 'src/utils/tusFileUpload'
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import uploadImage from "./uploadImage.vue";
import Submit from "src/components/submit/index.vue";
import LabelList from 'src/components/LabelList.vue'
import request from "src/api/index";
const http = (request as any).teacherImageResourcePool;

interface ImageType {
  name: string;
  ostype: any;
  imageType: any;
  classify_id: string;
  tag: any;
  desc: any;
  file_path:string
  fileName: string;
  fileSize: any;
  image_classify:any
  percent:number
}
interface IState {
  config: any;
  customLabelV: any;
}
const router = useRouter();
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "创建镜像", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const rules = {
  fileName: [{ required: true, message: "请选择镜像文件", trigger: "change" }],
  name: [{ required: true, message: "请输入镜像名称", trigger: "blur" }],
  classify_id: [{ required: true, message: "请选择系统类型" }],
  tag: [
    // { required: true, message: "请选择镜像标签",trigger: "blur"},
    // { validator: fileListValidator,},
  ],
};
async function fileListValidator() {
  // console.log(image);
  if (image.tag.length === 0) {
    message.warn("请选择镜像标签");
    return Promise.reject();
  } else if(!(image.tag.includes('vnc') || image.tag.includes('jupyter'))){
    message.warn("vnc或jupyter标签需至少选择一个");
    return Promise.reject();
  }else if((image.tag.includes('vnc') && image.tag.includes('jupyter'))){
    message.warn("vnc或jupyter标签需只需任选其一");
    return Promise.reject();
  }
  else {
    return Promise.resolve();
  }
}
const image: ImageType = reactive({
  name: "",
  imageType: "",
  ostype : undefined,
  classify_id:'',
  tag: [],
  desc: "",
  file_path:'',
  fileSize: "",
  fileName: "",
  image_classify:[],
  percent:0
});
const state: IState = reactive({
  customLabelV: "",
  config: {},
});
const formRef = ref();

const uploadPercentage=(percent:number)=>{
  image.percent=percent
}
const uploadImageinfo = (name: any, size: any, url: any) => {
  // console.log(file)
  image.file_path=url
  image.fileName = name;
  image.fileSize = size;
  image.imageType = image.fileName.split(".")[ image.fileName.split(".").length - 1];
  image.fileName.split(".")[image.fileName.split(".").length - 1];
  image.classify_id=image.imageType === "qcow2" ? 'kvm':'docker'
  // image.ostype = image.imageType === "qcow2" ? image.image_classify[2].name : image.image_classify[1].name;
  // console.log(image)
  // tusFileUpload(file)  
};
const cancel = () => {
  // console.log("取消");
  router.go(-1)
};
const create = () => {
  // console.log("提交");
  // console.log(formRef.value)
  // fileListValidator()
  // return
  formRef.value.validate().then(async () => {
    // fileListValidator().then((res:any)=>{
    //   console.log(res)
    // })
    if(!image.file_path){
      message.warning('请上传镜像文件')
      return
    }
    const val= await fileListValidator()
    // console.log(image)
    // return
    const parmas = {
      // ostype: "docker" , 
      classify_id: image.classify_id,
      ostype: image.ostype,
      name: image.name,
      file_path: image.file_path,
      file_size: image.fileSize,
      tags: image.tag,
      description: image.desc,
      // ssh_user: " ",
      // ssh_pass: " ",
      is_use_gpu: image.tag.indexOf(3) !== -1 ? 1 : 0,
    };
    console.log(parmas);
    http.createMirrorApi({param:{...parmas}}).then((res: any) => {
      message.success('创建成功')
      cancel();
    });
  });
};
function getConfig() {
  http.getConfigApi().then((res: any) => {
    const { image_classify} = res.data;
    image.image_classify=image_classify
  });
}
const recommend:any=reactive([])
function getImgTag() {
  recommend.length=0
  http.getImgTag().then((res: any) => {
    let  data= res.data;
    let arr=[{name:'vnc',value:'vnc'},{name:'jupyter',value:'jupyter'}]
    recommend.push(...arr)
    data.forEach((v:any) => {
      recommend.push({name:v.name,value:v.name})
    });
  });
}
onMounted(() => {
 getConfig()
 getImgTag()
});
</script>

<style lang="less">
.create-image-box {
  width: 806px;
  margin: 0 auto;
  height: 100%;
  font-size: 14px;
  //   .uploadBtn{
  //       display: flex;
  //   }
  //   .upload{
  //       .ant-upload.ant-upload-drag .ant-upload-btn{
  //           padding: 40px;
  //       }
  //   }
  .ant-input-desc {
    height: 115px;
    min-height: 115px;
    max-height: 136px;
    overflow-y: hidden;
  }
  .form-bottom {
    width: 100%;
    margin-top: auto;
    text-align: center;
    > button {
      margin-right: 16px;
    }
  }
}
.create-img-middle {
  display: flex;
  justify-content: space-between;
  > div {
    width: 45%;
    .form-input {
      width: 100%;
    }
  }
}


</style>
