<template>
  <search-add
    @searchFn="searchFn"
    @handleMenuClick="handleMenuClick"
    :TypeList="ExperimentTypeList"
    :isShowAdd="true"
  ></search-add>
  <classify :list="classifyList" @change="classifyChange"></classify>
  <a-spin :spinning="loading" size="large" tip="Loading...">
    <div class="flexCenter mainBox">
      <div class="item flexCenter" v-for="(v, k) in list" :key="v" :class="v.is_init?'':'operable'">
        <div class="left">
          <!-- :style="`background-image: url(src/assets/images/teacherImageResourcePool/${v.ostype}.png)`" -->
          <div class="img" :class="v.ostype">
            <div class="imgType" v-if="v.is_init">{{'内置'}}</div>
          </div>
        </div>
        <div class="right" >
          <div class="name single_ellipsis" :title="v.name">{{v.name}}</div>
          <div class="change">
            <div class="FrontDisplay">
              <div class="information flexCenter">
                <span>类型：{{v.classify}}</span>
                <span>架构：{{'X86'}}</span>
              </div>
              <div class="labels flexCenter" :class="(v.tags && v.tags.length)?'labelsBg':''">
                <template v-for="(i,n) in v.tags" :key="i">
                  <span class="single_ellipsis">{{i}}</span>
                  <span>&nbsp;&nbsp;{{`${(n !== (v.tags && v.tags.length-1) && i)?'/':''}`}}&nbsp;&nbsp;</span>
                </template>
              </div>
            </div>
            <div class="PostDisplay single_ellipsis">
              <div class="text single_ellipsis" :title="v.description?v.description:''">
              {{v.description?v.description:'该镜像暂无描述'}}
              </div>
              <div class="caoZuo flexCenter" v-if="!v.is_init">
                <!-- <span v-if="!v.is_init" @click="copy(v)">复制</span> -->
                <span v-if="!v.is_init" @click="strike(v)">删除</span>
                <span v-if="!v.is_init" @click="edit(v)">编辑</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Empty v-if="!list.length && !loading" :type="EmptyType"/>
      <a-pagination
        v-if="totalCount > 12"
        v-model:current="fromData.page"
        :pageSize="fromData.limit"
        :total="totalCount"
        @change="pageChange"
      />
    </div>
  </a-spin>

  <!-- 编辑镜像 -->
    <a-modal title="编辑镜像" width="850px" :visible="visible" @cancel="handleCancel" class="editImage" :destroyOnClose="true">
      <div>
        <a-form layout="vertical" :rules="rules" ref="formRef" :model="imageData">
          <div class="row">
            <a-form-item  label="镜像名称" name="name">
              <a-input class="form-input" v-model:value="imageData.name"></a-input>
            </a-form-item>
            <a-form-item  label="镜像类型" name="ostype">
              <a-select
                class="form-input"
                v-model:value="imageData.ostype"
                placeholder="请选择系统类型"
              >
                <a-select-option
                  :value="item.name"
                  v-for="(item, index) in imageData.image_classify"
                  :key="item"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="row"> 
            <a-form-item label="添加标签" name="tags">
              <LabelList :tag="imageData.tags" :recommend="recommend" @selectTag="selectTag"  />
            </a-form-item>
          </div>
          <a-form-item label="描述">
            <a-textarea
              placeholder="镜像描述"
              v-model:value="imageData.description"
              class="ant-input-desc"
              :maxlength="200"
            ></a-textarea>
          </a-form-item>
        </a-form>
      </div>
      <template #footer>
        <Submit @submit="handleOk" @cancel="handleCancel"></Submit>
      </template>
    </a-modal>
</template>
<script lang="ts" setup>
import Submit from "src/components/submit/index.vue";
import Classify from "src/components/classify/index.vue";
import searchAdd from "src/components/searchAdd/searchAdd.vue";
import LabelList from 'src/components/LabelList.vue'
import {
  createVNode,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  nextTick,
  computed,
  toRefs,
  watch,
  defineExpose,
} from "vue";
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
const router = useRouter();
const route = useRoute();
const { editId } = route.query;
const http = (request as any).teacherImageResourcePool;
const tag = ref<string>('')
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "镜像资源库", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: false,
});
const EmptyType:any=computed(()=>{
  let str=''
  if(labelSearch.is_init === '' && fromData.name === '' && tag.value === ''){
    str= 'empty'
  }else{
    str= 'searchEmpty'
  }
  return str
})
const ExperimentTypeList = reactive([
  { name: "本地上传", key: "local" },
  { name: "在线制作", key: "Online" },
]);
const handleMenuClick = (val: any) => {
  // console.log(val);
  if (val.key === "local") {
    router.push("/teacher/teacherImageResourcePool/localCreated");
  } else {
    router.push("/teacher/teacherImageResourcePool/OnlineMake");
  }
};
/**
 * 标签操作
 */
const classifyList: any = reactive([
  {
    title: "镜像属性",
    value: "",
    keyName: "is_init",
    data: [
      { name: "全部", value: "" },
      { name: "内置镜像", value: 1 },
      { name: "我的镜像", value: 0 },
    ],
  },
  {
    title: "镜像标签",
    value: "",
    keyName: "tags",
    data: [
      { name: "全部", value:"" },
    ],
  },
  {
    title: "镜像类型",
    value: "",
    keyName: "ostype",
    data: [
      { name: "全部", value:"" },
    ],
  },
]);
const classifyChange = (obj: any) => {
  Object.assign(labelSearch, obj);
  console.log(labelSearch)
  searchFn(fromData.name);
};
const labelSearch = reactive({
  is_init: '',
  tags: '',
  ostype:'',
});

const searchFn = (key: string) => {
  fromData.page = 1;
  fromData.name = key;
  totalCount.value=0
  // console.log(obj);
  initData();
};

/**
 * 列表
 */
const fromData: any = reactive({
  limit: 12,
  page: 1,
  name: "",
});
var list: any[] = reactive([]);
var loading: Ref<boolean> = ref(false);
var totalCount: Ref<number> = ref(0);
const pageChange = async (pageNumber: number) => {
  fromData.page = pageNumber;
  const { query, path } = route;
  await router.replace({
    path: path,
    query: { ...query, page: pageNumber },
  });
  initData();
};
const initData = () => {
  loading.value = true;
  list.length=0
  totalCount.value=0
  // const tag=[labelSearch.tags,labelSearch.ostype].join(',')
  tag.value=`${labelSearch.tags}${(labelSearch.tags && labelSearch.ostype)?',':''}${labelSearch.ostype}`
  let obj={
    ...fromData,
    is_init:labelSearch.is_init,
    tags:tag.value
  }
  http.imagesList({param:{...obj}}).then((res: IBusinessResp) => {
    // console.log(res.data)
    list.push(...res.data.list);
    totalCount.value=res.data.page.totalCount
    loading.value = false;
  });
};

const strike=(val:any)=>{
  Modal.confirm({
    title: '确认删除吗？',
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复',
    okText: '确认',
    cancelText: '取消',
    onOk(){
        http.deleteImg({urlParams: {imageID: val.id}}).then((res:IBusinessResp)=>{
          message.success('删除成功')
          initData()
      })
    }
  });
}
const copy=(val:any)=>{
  let data={
    name:val.name,
    description:val.description
  }
  http.imgCopy({urlParams: {imageID: val.id},param:{...data}}).then((res:IBusinessResp)=>{
        message.success('复制成功')
        initData()
    })
}
// 编辑 
var imageData:any=reactive({
  id:'',
  tags:[],
  customLabelV:'',
  name:'',
  classify_id:'',
  description:''
})
var visible: Ref<boolean> = ref(false);
const edit=(val:any)=>{
  console.log(val) // ostype
  let copyVal = JSON.parse(JSON.stringify(val))
  imageData.ostype = copyVal.ostype,  
  imageData.id = copyVal.id
  imageData.tags = copyVal.tags
  imageData.classify_id = copyVal.classify      
  imageData.name = copyVal.name
  imageData.description = copyVal.description

  visible.value=true
}
const handleCancel=()=>{
  visible.value=false
}
const rules = {
  name: [{ required: true, message: "请输入镜像名称", trigger: "blur" }],
  ostype: [{ required: true, message: "请选择系统类型" }],
  tags: [
    // { required: true, message: "请选择镜像标签",trigger: "blur"},
    {required: true,validator: fileListValidator,trigger: "blur"},
  ],
};
async function fileListValidator() {
  console.log(imageData);
  if (imageData.tags.length === 0) {
    message.warn("请选择镜像标签");
    return Promise.reject();
  } else if(!(imageData.tags.includes('vnc') || imageData.tags.includes('jupyter'))){
    message.warn("vnc或jupyter标签需至少选择一个");
    return Promise.reject();
  }else if((imageData.tags.includes('vnc') && imageData.tags.includes('jupyter'))){
    message.warn("vnc或jupyter标签需只需任选其一");
    return Promise.reject();
  }
  else {
    formRef.value.clearValidate('tag')
    return Promise.resolve();
  }
}
const selectTag=async (val:any,arr:any)=>{
  console.log(val);
  fileListValidator()
}
const formRef = ref();
const handleOk=()=> {
  console.log(formRef.value);
  
  // state.visible = false;
  formRef.value.validate().then( async ()=>{
    const val= await fileListValidator()
    let params: any = {
      ...imageData,
    };
    http.editMyImage({param:{...params},urlParams:{imageID:imageData.id}}).then((res: any) => {
      message.success('编辑成功')
      visible.value=false
      initData();
    });
  })
  
}
var showTag: Ref<boolean> = ref(false);
var openCustom: Ref<boolean> = ref(false);
const refCustomLabel = ref<HTMLElement>();
function removeLabel(val: any) {
  let num = imageData.tags.indexOf(val);
  if (num !== -1) {
    imageData.tags.splice(num, 1);
  }
}
function clickCustomLabel() {
  showTag.value = true;
  openCustom.value = true;
  nextTick(() => {
    refCustomLabel.value && refCustomLabel.value.focus();
  });
}
function customFinish() {
  if (imageData.customLabelV.trim()) {
    imageData.tags.push(imageData.customLabelV);
    // image.tag=['555']
    imageData.customLabelV = "";
    openCustom.value = false;
  } else {
    openCustom.value = false;
  }
}
function addTag(val: any) {
  if (imageData.tags.length < 3) {
    imageData.tags.push(val);
  } else {
    message.warn("最多添加3个标签");
  }
}
function changeLabel() {
  // console.log(val)
  // console.log(state.customLabelV)
  imageData.customLabelV =
    imageData.customLabelV.length > 10
      ? imageData.customLabelV.slice(0, 10)
      : imageData.customLabelV;
}
function getConfig() {
  http.getConfigApi().then((res: any) => {
    const { image_classify} = res.data;
    imageData.image_classify=image_classify
    image_classify.forEach((v:any) => {
      classifyList[2].data.push({name:v.name,value:v.name})
    });
    // classifyList[1].data.push({name:v.name,value:v.name})
  });
}
const recommend:any=reactive([])
function getImgTag() {
  http.getImgTag().then((res: any) => {
    let  data= res.data;
    let arr=[{name:'vnc',value:'vnc'},{name:'jupyter',value:'jupyter'}]
    recommend.push(...arr)
    data.forEach((v:any) => {
      classifyList[1].data.push({name:v.name,value:v.name})
      recommend.push({name:v.name,value:v.name})
    });
    // classifyList
  });
}
onMounted(() => {
  initData();
  getConfig()
  getImgTag()
});

</script>
<style scoped lang="less">
.mainBox {
  flex-wrap: wrap;
  // justify-content: space-between;
  min-height: 200px;
  .item {
    // width: 580px;
    // height: 200px;
    border-radius: 14px 0px 14px 14px;
    width: 384px;
    height: 120px;
    margin-bottom:24px;
    box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.07);
    background-color: #fff;
    .left {
      .img {
        border-radius: 13px 0px 0px 13px;
        height: 120px;
        width: 120px;
        background: url("src/assets/images/teacherImageResourcePool/docker.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        justify-content: end;
        position: relative;
        .imgType{
          width: 44px;
          height: 20px;
          opacity: 0.44;
          background: var(--black);
          border-radius: 13px 0px 13px 0px;
          color: var(--white-65);
          text-align: center;
          font-size: var(--font-size-sm);
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      .ARM{
        background-image:url('src/assets/images/teacherImageResourcePool/ARM.png');
      }
      .docker{
        background-image:url('src/assets/images/teacherImageResourcePool/docker.png');
      }
      .KVM-Linux{
        background-image:url('src/assets/images/teacherImageResourcePool/KVM-Linux.png');
      }
      .KVM-Windows{
        background-image:url('src/assets/images/teacherImageResourcePool/KVM-Windows.png');
      }
      .Belonging {
        height: 24px;
        background: rgba(0, 0, 0, 0.25);
        border-radius: 0px 0px 0px 14px;
        text-align: center;
        color: var(--white-65);
      }
      .myImg {
        color: var(--white-70);
      }
    }
    .right {
      padding: 9px 10px 0;
      flex: 1;
      height: 100%;
      .name {
        color: var(--black-85);
        font-size: var(--font-size-16);
        letter-spacing: 1.6px;
        max-width: 240px;
      }
      .information{
        color: var(--black-45);
        height: 40px;
        span:nth-child(1){
          margin-right: 24px;
        }
      }
      .labels {
        // height: 40px;
        margin-top: 8px;
        color: var(--primary-color);
        .single_ellipsis {
          display: inline-block;
          width: max-content;
          max-width: 82px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          // color: var(--brightBtn);
          // color: var(--primary-color);
        }
      }
      .labelsBg{
        background: var(--primary-1);
        padding-left: 6px;
      }
      .text {
        height: 41px;
        line-height: 22px;
        color: var(--black-45);
        -webkit-line-clamp: 2;
        letter-spacing: 0.34px;
        margin-top: 9px;
      }
      .caoZuo {
        height: 30px;
        justify-content: end;
        span {
          // display: none;
          color: var(--brightBtn);
          cursor: pointer;
          padding: 0 10px;
        }
      }
      .change:hover{
        .FrontDisplay{
          display: none;
        }
        .PostDisplay{
          display: block;
        }
      }
      .FrontDisplay{
        display: block;
      }
      .PostDisplay{
        width: 253px;
        display: none;
      }
    }
    
  }
  .item:nth-child(3n -1){
    margin: 0 24px 24px;
  }
  .operable:hover{
    cursor: pointer;
    box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16); 
    border-radius: 14px 0px 14px 14px;
  }
}
.editImage {
  .row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .ant-form-item {
      width: 48%;
    }
  }
  .ant-input-desc {
    min-height: 115px;
    max-height: 136px;
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
        background: var(--primary-1);
      }
    }
  }
}
.recommend {
  color: var(--black-65);
  margin-top: 1rem;
  .tagBox {
    width: 60%;
    display: flex;
    flex-wrap: wrap;
    div {
      text-align: center;
      cursor: pointer;
      width: 25%;
      padding: 6px 0;
      span {
        background: #ebebeb;
        border: 1px solid #dfdfdf;
        border-radius: 11px;
        font-size: 12px;
        color: var(--black-65);
        padding: 2px 7px;
      }
      .act {
        background: var(--primary-color);
        color: #fff;
        // color: var(--primary-color);
      }
    }
  }
}
</style>
