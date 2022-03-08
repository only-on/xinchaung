<template>
<a-form :layout="'vertical'" :rules="rules" :model="formState" ref="baseInfoFormRef">
  <div class="left">
    <a-form-item :label="props.materialType+'名称'" name="name" required>
      <a-input v-model:value="formState.name" :placeholder="'请在这里输入'+props.materialType+'名称'" />
    </a-form-item>
    <a-form-item :label="props.materialType+'描述'" name="description">
      <a-textarea v-model:value="formState.description" :auto-size="{ minRows: 3, maxRows: 5 }" placeholder="请在这里输入描述文字" />
    </a-form-item>
    <a-form-item label="添加标签" name="label">
      <div class="label-list">
        <span
          v-for="(item, index) in formState.labels"
          :key="index"
          class="active"
        >
          {{ item }}
          <i
            class="remove iconfont icon-guanbi"
            @click="removeLabel(item)"
          ></i>
        </span>
        <span class="edit-box" v-if="formState.labels && formState.labels.length < 3">
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
            v-for="v in 10" :key="v"
            @click="addTag(v)"
            :class="formState.labels.includes(String(v)) ? 'act' : ''"
            >{{v}}{{v}}{{v}}</span
          >
        </div>
      </div>
    </a-form-item>
  </div>
  <div class="right">
    <a-form-item label="可见范围" name="range" required class="visible-range">
      <a-select v-model:value="formState.range">
        <a-select-option :value="'0'">
          <span class="name">公开</span>
          <span class="tips">所有人可见</span>
        </a-select-option>
        <a-select-option :value="'1'">
          <span class="name">私有</span>
          <span class="tips">仅自己可见</span>
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="封面图" class="cover">
      <img v-if="formState.src" :src="formState.src" alt="" srcset="">
      <a-upload
        v-model:file-list="fileList"
        list-type="picture"
        class="uploader"
        :show-upload-list="false"
        :before-upload="beforeUpload"
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
import { ref, reactive, Ref, nextTick, inject } from 'vue'
import request from "src/api/index";
import { MessageApi } from "ant-design-vue/lib/message";
import { LoadingOutlined } from '@ant-design/icons-vue';
const http = (request as any).teacherMaterialResource;
const $message: MessageApi = inject("$message")!;

const props = defineProps({
  materialType: String
})

interface IFormState {
  name: string
  description: string
  range: string
  src: string
  labels: string[]
}
const formState = reactive<IFormState>({
  name: '',
  description: '',
  range: '0',
  src: '',
  labels: []
})
// 上传封面图
const fileList:Ref<any>=ref([])
const loading = ref<boolean>(false)
const beforeUpload = (file:any) => {
  // console.log(file)
  const isJpgOrPng = ['image/jpeg','image/png'].includes(file.type)
  if (!isJpgOrPng) {
    $message.warn('图片类型不正确')
    return false
  }
  loading.value = true
  const fd = new FormData()
  fd.append('upload_file', file)
  http.upLoadCover({param:fd}).then((res:any)=>{
    loading.value = false
    console.log(res)
    formState.src = res.data.path
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
  })
  // formState.src = "src/assets/images/cover2.png"
}
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
  let num = formState.labels.indexOf(val);
  if (num !== -1) {
    formState.labels.splice(num, 1);
  }
}
function customFinish() {
  if (customLabelV.value.trim()) {
    formState.labels.push(customLabelV.value);
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
  if (formState.labels.length < 3) {
    formState.labels.push(val);
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
