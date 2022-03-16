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
          <div class="img" :class="v.is_init? '' : 'KVMImg'">
            <div class="imgType" v-if="v.is_init">{{'内置'}}</div>
          </div>
        </div>
        <div class="right" >
          <div class="name">{{v.name}}</div>
          <div class="change">
            <div class="FrontDisplay">
              <div class="information flexCenter">
                <span>类型：{{v.ostype}}</span>
                <span>信息：{{'X86'}}</span>
              </div>
              <div class="labels flexCenter">
                <span class="ellipsis" v-for="i in v.tags" :key="i">{{i}}</span>
              </div>
            </div>
            <div class="PostDisplay">
              <div class="text ellipsis">
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
      <Empty v-if="!list.length && !loading" />
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
    <a-modal title="编辑镜像" width="850px" :visible="visible" @cancel="handleCancel" class="editImage">
      <div>
        <a-form layout="vertical">
          <div class="row">
            <a-form-item required label="镜像名称">
              <a-input class="form-input" v-model:value="imageData.name"></a-input>
            </a-form-item>
            <a-form-item required label="系统类型">
              <a-select
                class="form-input"
                v-model:value="imageData.classify_id"
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
          <a-form-item label="添加标签" name="tag">
            <div class="label-list">
              <span v-for="(item, index) in imageData.tags" :key="index" class="active">
                {{ item }}
                <i class="remove iconfont icon-guanbi" @click="removeLabel(item)" ></i>
              </span>
              <span class="edit-box" v-if="imageData.tags && imageData.tags.length < 3">
                <span @click="clickCustomLabel" v-show="!openCustom">
                  <span class="iconfont iconbiaoqian"></span>
                  + 自定义标签
                </span>
                <a-input
                  ref="refCustomLabel"
                  @pressEnter="customFinish"
                  @blur="customFinish"
                  @change="changeLabel"
                  v-show="openCustom"
                  v-model:value="imageData.customLabelV"
                />
              </span>
            </div>
            <div class="recommend" v-if="showTag">
              <div class="tit">或从推荐中选择</div>
              <div class="tagBox">
                <div v-for="v in recommend" :key="v">
                  <span
                    @click="addTag(v.value)"
                    :class="imageData.tags.includes(v.value) ? 'act' : ''"
                    >{{v.value}}</span
                  >
                </div>
              </div>
            </div>
          </a-form-item>
          <a-form-item label="描述">
            <a-textarea
              placeholder="镜像描述"
              v-model:value="imageData.description"
              class="ant-input-desc"
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
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "镜像资源库", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: false,
});
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
]);
const classifyChange = (obj: any) => {
  Object.assign(labelSearch, obj);
  console.log(labelSearch)
  searchFn(fromData.name);
};
const labelSearch = reactive({
  is_init: '',
  tags: '',
});

const searchFn = (key: string) => {
  fromData.page = 1;
  fromData.name = key;
  totalCount.value=0
  let obj = {
    ...labelSearch,
    ...fromData,
  };
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
  let obj={
    ...fromData,
    ...labelSearch
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
  imageData.ostype= "docker" ,  
  imageData.id=val.id
  imageData.tags=val.tags
  imageData.classify_id=val.classify      
  imageData.name=val.name
  imageData.description=val.description

  visible.value=true
}
const handleCancel=()=>{
  visible.value=false
}
const handleOk=()=> {
  // state.visible = false;
  let params: any = {
    ...imageData,
  };
  http.editMyImage({param:{...params},urlParams:{imageID:imageData.id}}).then((res: any) => {
    message.success('编辑成功')
    visible.value=false
    initData();
  });
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
  });
}
const recommend:any=reactive([])
function getImgTag() {
  http.getImgTag().then((res: any) => {
    let  data= res.data;
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
.reference {
  position: fixed;
  width: 100%;
  top: 110px;
  left: 0;
  height: 50px;
  .addBox {
    width: var(--center-width);
    margin: 0 auto;
    .add {
      justify-content: end;
      .addCircular {
        margin-left: 20px;
      }
    }
  }
}
.mainBox {
  flex-wrap: wrap;
  // justify-content: space-between;
  min-height: 200px;
  .item {
    // width: 580px;
    // height: 200px;
    width: 384px;
    height: 120px;
    margin-bottom:24px;
    .left {
      .img {
        border-radius: 13px 0px 0px 13px;
        height: 120px;
        width: 120px;
        background: url("src/assets/images/teacherImageResourcePool/img1.jpg") no-repeat;
        background-size: 100% 100%;

        display: flex;
        flex-direction: column;
        justify-content: end;
        position: relative;
        .type {
          width: 100%;
          text-align: center;
          color: var(--white);
          margin-bottom: 6px;
        }
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
      .KVMImg {
        background: url("src/assets/images/teacherImageResourcePool/img2.jpg") no-repeat;
        background-size: 100% 100%;
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
      }
      .information{
        color: var(--black-45);
        height: 40px;
        span:nth-child(1){
          margin-right: 24px;
        }
      }
      .labels {
        height: 40px;
        span {
          display: inline-block;
          width: 92px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          color: var(--brightBtn);
        }
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
        background: #f8efff;
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
