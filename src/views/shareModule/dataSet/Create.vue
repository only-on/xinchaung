<template>
  <div class="createOrEditWrap" v-layout-bg>
    <a-form :model="ForumSearch" :rules="rules" ref="formRef">
      <div class="create-form">
        <div class="base-info">
          <h2 class="create-title">基本信息</h2>
          <a-form-item label="数据名称" name="name">
            <a-input
              v-model:value="ForumSearch.name"
              placeholder="请输入数据名称"
            />
          </a-form-item>
          <div>
            <label for="datacategory">数据简介</label>
            <a-textarea
              v-model:value="ForumSearch.description"
              placeholder="请输入数据简介 最多250字"
              :maxLength="250"
              :auto-size="{ minRows: 4, maxRows: 7 }"
            />
          </div>

          <div class="cover">
            <label for="cover">
              <span>封面</span>
              <span class="label-hint">建议封面类型为jpg或png</span>
            </label>
            <div class="flex-row clearfix">
              <a-upload
                list-type="picture-card"
                v-model:file-list="coverFileList"
                :before-upload="beforeUpload"
                @change="handleChange"
                @preview="handlePreview"
              >
                <div class="uploading-box">
                  <loading-outlined v-if="loading"></loading-outlined>
                  <!-- <plus-outlined v-else></plus-outlined> -->
                  <!-- <div class="ant-upload-text">Upload</div> -->
                </div>
              </a-upload>
              <a-modal
                :visible="previewVisible"
                :footer="null"
                @cancel="handleCancel"
                :class="'createdSet'"
              >
                <img alt="example" style="width: 100%" :src="previewImage" />
              </a-modal>
            </div>
          </div>
          <div class="datacategory-box">
            <a-form-item label="选择类型" name="categoryText">
              <a-radio-group
                name="radioGroup"
                v-model:value="ForumSearch.categoryText"
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
          </div>
          <div>
            <label for="label">标签</label>
            <div class="label-list">
              <span
                v-for="(item, index) in ForumSearch.label"
                :key="index"
                class="active"
              >
                {{ item }}
                <i
                  class="remove iconfont icon-guanbi"
                  @click="removeLabel(item)"
                ></i>
              </span>
              <span
                class="edit-box"
                v-if="ForumSearch.label && ForumSearch.label.length < 3"
              >
                <span @click="clickCustomLabel" v-show="!openCustom">
                  <span class="iconfont iconbiaoqian"></span>
                  自定义标签
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
          </div>
        </div>
        <div class="file-upload">
          <h2 class="create-title">数据文件</h2>
          <div class="file-upload-box">
            <a-form-item label="数据集" name="fileList">
              <div>
                <a-upload
                  :multiple="true"
                  :before-upload="fileBeforeUpload"
                  :show-upload-list="false"
                >
                  <a-button>
                    <span class="icon iconfont icon-upload"></span>
                    上传数据集
                  </a-button>
                </a-upload>
                <div class="chunk-list">
                  <div v-for="(v, k, i) in ChunkStatus" :key="i">
                    <span>文件名称：{{ v.name }}</span>
                    <span
                      >计算md5进度：{{ v.chunks + "/" + v.currentChunk }}</span
                    >
                  </div>
                </div>
                <div class="progress-box scroll-bar-customize">
                  <div
                    v-for="(value, key) in ForumSearch.fileList"
                    :key="value"
                  >
                    <div class="progress-item">
                      <span class="img" :class="getFileType(value.name)">
                        <img :src="getFileTypeIcon(value.name)" alt="" />
                      </span>
                      <span class="">
                        <span class="item-top">
                          <span>{{ value.name }}</span>
                          <span
                            class="deleteicon"
                            v-if="value.status !== 'end'"
                            @click="deleteFile(value, key)"
                          >
                            <i class="icon-guanbi iconfont"></i>
                          </span>
                          <span
                            v-if="value.status === 'end'"
                            class="icon-shanchu iconfont"
                            @click="removeFile(value, key)"
                          ></span>
                        </span>
                        <span class="file-size">{{ value.data.size }}</span>
                        <span><a-progress :percent="value.progress" /></span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </a-form-item>
          </div>
          <div class="md-upload-box">
            <label for="file">
              说明
              <span class="label-hint">仅支持.md格式文件</span>
            </label>
            <span></span>
            <div>
              <a-upload
                :before-upload="MdFileBeforeReader"
                :show-upload-list="false"
                accept=".md"
              >
                <a-button>
                  <span class="icon iconfont icon-upload"></span>
                  上传说明
                </a-button>
              </a-upload>
              <div class="md-info" v-if="documentName">
                <div>
                  <span>{{ documentName }}</span>
                  <span>
                    <!-- <i @click="RemoveMdFile()">x</i> -->
                    <i class="icon-guanbi iconfont" @click="RemoveMdFile()"></i>
                    <!-- <span @click="RemoveMdFile()" class="remove iconfont .iconguanbi"></span> -->
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-form>
    <div class="action">
      <a-button @click="closeCreateModal">取消</a-button>
      <a-button type="primary" @click="submit">确定</a-button>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  toRefs,
  watch,
  inject,
  Ref,
  computed,
  nextTick,
} from "vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { useRouter, useRoute } from "vue-router";
import { Modal, message } from "ant-design-vue";
import extStorage from "src/utils/extStorage";
import { getFileType,getFileTypeIcon } from "src/utils/getFileType";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import Upload from "src/utils/MoreUpload";
import { UUID } from "src/utils/uuid";
import { RuleObject } from "ant-design-vue/es/form/interface";
const http = (request as any).dataSet;
interface IForumSearch {
  creator: number;
  name: string;
  description: string;
  cover: string;
  categoryText: string;
  category: any[];
  label: any[];
  file: any[];
  doc_name: string;
  documents: string;
  common: number;
  fileList: any;
}
interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  percent?: number;
  url?: string;
  preview?: string;
  originFileObj?: any;
}
interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}
interface IState {
  ForumSearch: IForumSearch;
  customLabelV: string;
  documentName: string;
}
export default defineComponent({
  name: "",
  components: {
    LoadingOutlined,
    PlusOutlined,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { lStorage } = extStorage;
    const role = lStorage.get("role");
    const uid = lStorage.get("user_id");
    var updata = inject("updataNav") as Function;
    updata({
      tabs: [],
      navPosition: "outside",
      navType: false,
      showContent: true,
      showNav: true,
      backOff: false,
      showPageEdit: false,
    });

    const uploadFileUuid = ref(UUID.uuid4());

    const previewVisible = ref<boolean>(false);
    const previewImage = ref<string | undefined>("");
    let formRef = ref();
    var navList: any = reactive([]);
    var ChunkStatus: any = reactive({});
    // var fileList:any= reactive({})
    const coverFileList = ref<FileItem[]>([]);
    var loading: Ref<boolean> = ref(false);
    var openCustom: Ref<boolean> = ref(false);

    const refCustomLabel = ref<HTMLElement>();
    const rules = {
      name: [
        { required: true, message: "请输入数据集名称", trigger: "blur" },
        { max: 20, message: "数据集名称最多20个字符", trigger: "blur" },
      ],
      categoryText: [
        { required: true, message: "请选择数据集类型", trigger: "change" },
      ],
      fileList: [
        { required: true, message: "请选择数据集" },
        { validator: fileListValidator, message: "请选择数据集" },
      ],
    };
    async function fileListValidator(rule: RuleObject, value: string) {
      // console.log(state.ForumSearch.fileList)
      if (Object.keys(state.ForumSearch.fileList).length === 0) {
        return Promise.reject("请选择数据集");
      } else {
        return Promise.resolve();
      }
    }
    const state: IState = reactive({
      ForumSearch: {
        creator: Number(lStorage.get("user_id")),
        role: Number(lStorage.get("role")),
        common: [3, 5].includes(Number(lStorage.get("role"))) ? 0 : 1,
        name: "",
        description: "",
        cover: "",
        categoryText: "",
        category: [],
        label: [],
        file: [],
        doc_name: "",
        documents: "",
        fileList: {},
      },
      customLabelV: "",
      documentName: "",
    });
    function beforeUpload(file: any) {
      // console.log(file)
      const isJpgOrPng = ["image/jpeg", "image/png"].includes(file.type);
      if (!isJpgOrPng) {
        message.warn("图片类型不正确");
        return false;
      }
      loading.value = true;
      const fd = new FormData();
      fd.append("upload_file", file);
      http.upLoadCover({ param: fd }).then((res: any) => {
        loading.value = false;
        // console.log(res)
        let data = res.data;
        let obj = [
          {
            uid: "-1",
            name: data.name,
            status: "",
            url: data.path,
          },
        ];
        (state.ForumSearch.cover = data.path), (coverFileList.value = obj);
      });
    }
    function removeLabel(val: any) {
      let num = state.ForumSearch.label.indexOf(val);
      if (num !== -1) {
        state.ForumSearch.label.splice(num, 1);
      }
    }
    function clickCustomLabel() {
      openCustom.value = true;
      nextTick(() => {
        refCustomLabel.value && refCustomLabel.value.focus();
      });
    }
    function customFinish() {
      // console.log(state.customLabelV)
      if (state.customLabelV.trim()) {
        state.ForumSearch.label.push(state.customLabelV);
        state.customLabelV = "";
        openCustom.value = false;
      } else {
        openCustom.value = false;
      }
    }
    function changeLabel() {
      // console.log(val)
      // console.log(state.customLabelV)
      state.customLabelV =
        state.customLabelV.length > 10
          ? state.customLabelV.slice(0, 10)
          : state.customLabelV;
    }
    function closeCreateModal() {
      router.go(-1);
    }
    function submit() {
      formRef.value.validate().then(() => {
        collectForm();
        defaultCover();
        http.create({ param: { ...state.ForumSearch } }).then((res: any) => {
          message.success("创建成功");
          router.go(-1);
        });
      });
    }
    function defaultCover() {
      // /public/img/default
      const path =
        process.env.NODE_ENV === "development" ? "/public/" : "/frontend/";
      if (!state.ForumSearch.cover || state.ForumSearch.cover === "") {
        const i = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
        var url =
          i > 10
            ? `${path}img/default/${i}.jpg`
            : `${path}img/default/d${i}.jpg`;
        state.ForumSearch.cover = url;
        console.log(url);
      }
    }
    function fileBeforeUpload(file: any) {
      // console.log(file)
      if (file && file.size === 0) {
        message.warn("文件大小不能为空");
        return false;
      }
      Upload({
        startUploadURL: "/dmc/v1.0/create_multi_part",
        multiUploadURL: "/dmc/v1.0/multi_part_upload",
        mergeUploadUrl: "/dmc/v1.0/compose_part",
        data_set_id: "",
        file: file,
        chunkSize: 5242880, // 2096963
        chunkFun: chunkFun,
        startUploadFun: startUploadFun,
        processFun: processFun,
        endUploadFun: endUploadFun,
        eruptNum: 6,
        uploadFileUuid: uploadFileUuid.value,
      });
      return false;
    }
    function chunkFun(
      name: string,
      chunks: number,
      currentChunk: number,
      key: string
    ) {
      Object.assign(ChunkStatus, {
        [key]: { name: name, chunks: chunks, currentChunk: currentChunk },
      });
      if (chunks === currentChunk) {
        delete ChunkStatus[key];
      }
    }
    function startUploadFun(v: any, file_name: string, file_size: number) {
      Object.assign(state.ForumSearch.fileList, {
        [v]: {
          name: file_name,
          status: "start",
          progress: 0,
          files: [],
          data: {},
          open: false,
          size: file_size,
        },
      });
    }
    function processFun(e: any, v: any, length: number) {
      // console.log(e, v, length)
      if (!state.ForumSearch.fileList[v.fileMd5]?.status) {
        return;
      }
      Object.assign(
        typeof state.ForumSearch.fileList[v.fileMd5].files[v.index] === "object"
          ? state.ForumSearch.fileList[v.fileMd5].files[v.index]
          : (state.ForumSearch.fileList[v.fileMd5].files[v.index] = {}),
        {
          xhr: v.xhr,
          progress: Number(((e.loaded / e.total) * 100).toFixed(2)),
          upload_status: e.loaded > e.total ? "loading" : "end",
        }
      );
      let progress = 0;
      state.ForumSearch.fileList[v.fileMd5].files.forEach((item: any) => {
        progress += item.progress;
      });

      state.ForumSearch.fileList[v.fileMd5].progress =
        Number((progress / length).toFixed(2)) !== 100
          ? Number((progress / length).toFixed(2))
          : 99;
    }
    function endUploadFun(v: any, d: any) {
      state.ForumSearch.fileList[v].status = "end";
      state.ForumSearch.fileList[v].progress = 100;
      state.ForumSearch.fileList[v].data = d;
    }
    function deleteFile(file: any, key: any) {
      if (file.files.length > 0) {
        file.files.forEach((item: any) => {
          if (item.xhr) {
            // console.log(item)
            item.xhr.abort();
          }
        });
      }
      delete state.ForumSearch.fileList[key];
    }
    function removeFile(file: any, index: any) {
      file.files.forEach((item: any) => {
        if (item.xhr) {
          // console.log(item)
          item.xhr.abort();
        }
      });
      delete state.ForumSearch.fileList[index];
    }
    function collectForm() {
      if (state.ForumSearch.categoryText) {
        state.ForumSearch.category = [state.ForumSearch.categoryText];
      }
      state.ForumSearch.file = [];
      for (const key in state.ForumSearch.fileList) {
        if (
          Object.prototype.hasOwnProperty.call(state.ForumSearch.fileList, key)
        ) {
          if (state.ForumSearch.fileList[key].status === "end") {
            state.ForumSearch.file.push({
              uid: state.ForumSearch.fileList[key].data.uid,
              path: state.ForumSearch.fileList[key].data.path,
            });
          }
        }
      }
    }
    function MdFileBeforeReader(file: any) {
      if (getFileType(file.name) === "md") {
        const fd = new FormData();
        fd.append("upload_file", file);
        http.uploadDoc({ param: fd }).then((res: any) => {
          state.ForumSearch.doc_name = res.data.name;
          var reader = new FileReader();
          reader.readAsText(file, "utf-8");
          reader.onload = () => {
            if (reader.result) {
              state.documentName = file.name;
              state.ForumSearch.documents = reader.result.toString();
            }
          };
        });
      } else {
        message.warn("请上传md文件");
      }
      return false;
    }
    function RemoveMdFile() {
      state.documentName = "";
      state.ForumSearch.documents = "";
    }
    function getBase64(file: File) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    }
    const handlePreview = async (file: FileItem) => {
      if (!file.url && !file.preview) {
        file.preview = (await getBase64(file.originFileObj)) as string;
      }
      previewImage.value = file.url || file.preview;
      previewVisible.value = true;
    };
    const handleChange = ({ fileList: newFileList }: any) => {
      if (newFileList && newFileList.length) {
        let file = newFileList[0];
        const isJpgOrPng = ["image/jpeg", "image/png"].includes(file.type);
        coverFileList.value = isJpgOrPng ? newFileList : [];
      }
      // coverFileList.value = newFileList;
    };
    const handleCancel = () => {
      previewVisible.value = false;
    };
    function categoryList() {
      navList.length = 0;
      http.categoryList().then((res: IBusinessResp) => {
        navList.push(...res.data);
        // option.unshift({uid:'',name:'全部'})
        // console.log(option)
      });
    }
    onMounted(() => {
      categoryList();
      // init()
    });
    return {
      ...toRefs(state),
      getFileTypeIcon,
      handlePreview,
      handleChange,
      rules,
      formRef,
      refCustomLabel,
      previewImage,
      coverFileList,
      handleCancel,
      beforeUpload,
      navList,
      loading,
      openCustom,
      removeLabel,
      clickCustomLabel,
      customFinish,
      changeLabel,
      closeCreateModal,
      submit,
      fileBeforeUpload,
      getFileType,
      ChunkStatus,
      deleteFile,
      removeFile,
      MdFileBeforeReader,
      RemoveMdFile,
      previewVisible,
    };
  },
});
</script>
<style scoped lang="less">
.createOrEditWrap {
  padding: 27px 16px;
  background: white;
  border-radius: 6px;
  //box-shadow: 0px 0px 0px 1px #eeeeee;

  .header-box {
    color: #b2b2b2;

    > span {
      font-size: 12px;
      cursor: pointer;
      margin-right: 8px;

      &:nth-child(1),
      &:nth-child(3) {
        color: #404040;
      }

      &:nth-child(2) {
        color: #b2b2b2;
      }
    }
  }

  .create-title-box {
    //display: flex;
    //align-items: center;
    //justify-content: space-between;
    //width: 57%;
  }

  .create-title {
    color: #404040;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 24px;
  }

  .action {
    text-align: center;

    button {
      margin-right: 10px;
    }
  }

  .create-form {
    padding: 0px 22px 30px 22px;
    display: flex;
    flex-direction: row;

    .base-info > div {
      margin-bottom: 32px;
    }

    > div:nth-child(1) {
      width: 50%;
      padding-right: 21px;
    }

    > div:nth-child(2) {
      width: 50%;
      padding-left: 21px;
      border-left: 1px solid #ebebeb;
    }

    label {
      margin: 9px 0px;
      display: block;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 400;

      .label-hint {
        color: rgba(0, 0, 0, 0.25);
        font-size: 12px;
        margin-left: 13px;
      }
      i {
        color: #ff0918;
      }
    }

    .datacategory-list {
      label {
        display: inline-block;
        margin: 0;
        padding: 0;
        margin-right: 28px;

        span.ant-radio + * {
          padding-left: 4px;
          padding-top: 12px;
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

    .all-label {
      // border-top: 0.1px dashed #c9c4c4;
      margin-top: 20px;

      label {
        color: #c9c4c4;
      }

      .all-label-list {
        display: flex;
        flex-wrap: wrap;

        > span {
          margin: 0px 5px 0px 0px;
          padding: 2px 15px;
          background: #ffffff;
          margin-bottom: 5px;
          border: 1px dashed #c9c4c4;
          border-radius: 4px;

          &.active {
            background: var(--primary-color);
            color: #ffffff;
          }
        }

        .custom-label {
          color: var(--primary-color);

          > span {
            vertical-align: revert;
          }
        }
      }
    }

    .cover {
      .flex-row {
        display: flex;
        :deep(.ant-upload.ant-upload-select-picture-card) {
          border: 1px dashed rgba(52, 131, 226, 0.61);
        }
        // .showImg{
        //   border: 1px dashed rgba(52, 131, 226, 0.61);
        // }
        // >div {
        // width: 104px;
        // height: 104px;
        // border-radius: 5px;
        // margin-right: 30px;

        .ant-upload.ant-upload-select-picture-card {
          width: 100%;
          height: 100%;
        }
        .ant-upload-picture-card-wrapper {
          height: 100%;
        }

        .ant-upload.ant-upload-select-picture-card > .ant-upload {
          padding: 0px;
        }

        .uploading-box {
          width: 100%;
          height: 100%;
          background-image: url("src/assets/images/dateSet/uploading.png");
          background-repeat: no-repeat;
          background-size: 100% 100%;

          > i {
            font-size: 30px;
          }
        }

        > img {
          width: 100%;
          height: 100%;
        }
        // }
      }
    }

    .file-upload-box {
      margin-bottom: 42px;

      .ant-upload {
        button {
          background: var(--primary-color);
          border-radius: 5px;
          color: #ffffff;
          .icon-upload {
            font-size: 12px;
            padding-right: 6px;
          }
        }
      }

      .progress-box {
        max-height: 500px;
        overflow-y: auto;
        overflow-x: hidden;

        > div {
          padding-bottom: 10px;
          background: #ffffff;
          box-shadow: 0px 0px 40px 0px var(--black-0-7);
        }

        .progress-item {
          display: flex;
          flex-direction: row;
          margin-top: 15px;

          padding: 16px;
          border-radius: 6px;

          > span:nth-child(1) {
            width: 24px;
            height: 26px;
            flex-shrink: 0;

            svg {
              vertical-align: middle;
              width: 24px;
              height: 26px;
              // fill: #fff;
              .st7 {
                fill: #ffffff;
              }
              .st6 {
                fill-rule: evenodd;
                clip-rule: evenodd;
                fill: #107c41;
              }
            }

            img {
              width: 100%;
              height: 100%;
            }
          }

          > span:nth-child(2) {
            width: 100%;
            margin: 0 10px;

            > .item-top {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              list-style: none;
              line-height: 30px;

              > span:nth-child(1) {
                color: #404040;
                font-size: 14px;
              }

              i {
                display: none;
                width: 20px;
                font-style: normal;
                height: 20px;
                border-radius: 50%;
                border: 1px solid var(--primary-color);

                text-align: center;
                line-height: 17px;
                font-size: 12px;
                color: var(--primary-color);
                cursor: pointer;
              }

              .icon-shanchu {
                color: #9a9a9a;
                padding: 0 7px;

                &.iconfont {
                  cursor: pointer;
                }

                &:hover {
                  //width: 32px;
                  //height: 32px;
                  background-color: #ebeff8;
                  border-radius: 50%;
                }
              }
            }

            .file-size {
              color: #000000;
              opacity: 0.5;
            }
          }

          // >span:nth-child(3) {
          //     flex-shrink: 0;
          //     width: 20px;
          //     height: 20px;

          // }
        }

        div > .progress-item:hover {
          > :nth-child(2) {
            i {
              display: inline-block;
            }
          }
        }

        .detail-box {
          padding: 0 16px;
          transition: 0.5s;
          overflow: hidden;

          .detail-name {
            color: rgba(64, 64, 64, 0.45);
            font-size: 12px;
          }

          .ant-progress-status-success {
            .ant-progress-bg {
              // background-color: rgba($success-color, 1);
              background-color: rgba(var(--primary-color), 1);
            }
          }

          .ant-progress-bg {
            background-color: rgba(var(--primary-color), 0.4);
            height: 4px !important;
          }
        }

        .look-btn {
          margin-left: 16px;
          cursor: pointer;
        }
      }

      .chunk-list {
        > div {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
      }
    }

    .md-upload-box {
      .ant-upload {
        button {
          background: var(--primary-color);
          border-radius: 5px;
          color: #ffffff;
          .icon-upload {
            font-size: 12px;
            padding-right: 6px;
          }
        }
      }

      .md-info {
        > div {
          display: flex;
          flex-direction: row;
          padding: 6px 64px;
          background: #ffffff;
          margin-top: 15px;

          > :nth-child(1) {
            width: 100%;
          }

          > :nth-child(2) {
            flex-shrink: 0;
            width: 20px;
            height: 20px;

            i {
              display: none;
              width: 20px;
              font-style: normal;
              height: 20px;
              border-radius: 50%;
              border: 1px solid var(--primary-color);

              text-align: center;
              line-height: 17px;
              font-size: 12px;
              color: var(--primary-color);
              cursor: pointer;
            }
          }
        }

        > div:hover {
          > :nth-child(2) {
            i {
              display: block;
            }
          }
        }
      }
    }
  }
}

.upload-drawer-detail {
  .title {
    display: flex;
    justify-content: space-between;
  }

  .ant-drawer-wrapper-body {
    display: flex;
    flex-direction: column;

    .ant-drawer-header {
      height: 55px;
      flex-shrink: 0;
    }

    .ant-drawer-body {
      height: 100%;
      overflow-y: auto;
    }

    .ant-drawer-body {
      //火狐
      scrollbar-color: rgba(var(--primary-color), 0.8)
        rgba(var(--primary-color), 0.2);
      scrollbar-width: thin;

      //谷歌
      //高宽分别对应横竖滚动条的尺寸
      &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      //滑块
      &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background: rgba(var(--primary-color), 0.9);
      }

      //轨道
      &::-webkit-scrollbar-track {
        border-radius: 3px;
        background: rgba(var(--primary-color), 0.1);
      }
    }
  }
}
:deep(.ant-form-item-control) {
  flex: 0 0 100%;
}
:deep(.ant-radio-group) {
  display: flex;
}
// .avatar-uploader > .ant-upload {
//   width: 128px;
//   height: 128px;
// }
// .ant-upload-select-picture-card i {
//   font-size: 32px;
//   color: #999;
// }

// .ant-upload-select-picture-card .ant-upload-text {
//   margin-top: 8px;
//   color: #666;
// }
</style>
