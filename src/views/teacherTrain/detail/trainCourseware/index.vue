<template>
  <div class="trainCourseware">
    <div class="top-btn">
      <span>
        <a-upload
          class="upload"
          v-if="!edit"
          name="file"
          :multiple="true"
          :beforeUpload="beforeUpload"
        >
          <a-button type="primary">选择文件</a-button>
        </a-upload>
      </span>
      <span v-if="role !== '2'">
        <span v-if="trainType !== '1'">
          <a-button type="primary" v-if="edit" @click="toModify">修改</a-button>
          <a-button type="primary" v-if="!edit" @click="ToSavepptModify">保存</a-button>
        </span>
      </span>
    </div>
    <div class="pdtView" v-if="ppt_url">
      <div v-if="status">
        <div class="status-img">
          <img :src="transimg" />
        </div>
        <div class="status-word">文档转换中，请稍后查看！</div>
      </div>
      <div v-else>
        <iframe
          width="100%"
          height="460px"
          :src="baseurl + ppt_url"
          frameborder="0"
        ></iframe>
      </div>
    </div>
    <div v-if="!propTrainDetailInfo.courseware_html">
      <empty text="亲~这里什么都没有~"></empty>
    </div>
  </div>
</template>
<script lang="ts">
interface Istate {
  edit: boolean;
  ppt_url: string;
  file: string;
  url: string;
  status: boolean;
}
import { defineComponent, onMounted, inject, reactive, toRefs, ref, watch } from "vue";
import request from "src/api/index";
import Empty from "src/components/Empty.vue";
import { message } from "ant-design-vue";
import transimg from "src/assets/images/common/ppt-trans.gif";
export default defineComponent({
  name: "trainCourseware",
  props: ["propTrainDetailInfo", "trainId", "trainType", "role"],
  components: {
    Empty,
  },
  setup(props, context) {
    const http = (request as any).teacherTrain;
    const state: Istate = reactive({
      transimg,
      edit: true,
      ppt_url: "",
      file: "",
      url: "",
      status: false,
    });
    let development = process.env.NODE_ENV == "development" ? true : false;
    let baseurl = development ? "http://localhost:3000/proxyPrefix" : "";
    const methods = {
      toModify() {
        state.edit = false;
      },
      beforeUpload(file: any) {
        console.log(file);
        state.file = file;
        const fileType = file.name.split(".")[file.name.split(".").length - 1];
        const isType = fileType === "ppt" || fileType === "pptx" || fileType === "pdf";
        if (!isType) {
          message.error("文件格式不正确!");
          return;
        }
        const fd = new FormData();
        fd.append("upload_type", "train_ppt");
        fd.append("train_id", props.trainId);
        fd.append("file", file);
        http
          .trainUploadImage({ param: fd })
          .then((res: any) => {
            state.url = res.datas.url;
          })
          .catch((err: any) => {
            message.error(err.error);
          });
        // const fd=new FormData()
        // fd.append('uploadFiled',file)
        // fd.append('upload_path','trainCourseware')
        // http.uploadsFile({param:fd}).then((res:any)=>{
        //   console.log(res)
        //   state.file=res.data.url
        // })
        return false;
      },
      ToSavepptModify() {
        const formdata = new FormData();
        formdata.append("train_id", props.trainId);
        formdata.append("courseware", state.url);
        http.savepptModefiy({ param: formdata }).then((res: any) => {
          console.log(res);
          state.ppt_url = baseurl + res.datas.courseware_html;
          context.emit("uploadppt");
        });
        //     const fd=new FormData()
        //     fd.append('uploadFiled',state.file)
        //     fd.append('upload_path','trainCourseware')
        //     http.uploadsFile({param:fd}).then((res:any)=>{
        //       console.log(res)
        //       state.file=res.data.url
        //     })
      },
      pptTransIfOk(url: any) {
        const newurl = baseurl + url;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function (res: any) {
          if (res.target.status == 404) {
            console.log("文件正在转换中");
            state.status = true;
          }
          console.log(res);
        };
        xhttp.open("GET", newurl, true);
        xhttp.send();
      },
    };
    watch(
      () => props.propTrainDetailInfo.courseware_html,
      (val: any) => {
        console.log(props.propTrainDetailInfo.courseware_html, "ppt发生变化了");
        state.ppt_url = props.propTrainDetailInfo.courseware_html;
        // setTimeout(function(){methods.pptTransIfOk(state.ppt_url)},5000);
        methods.pptTransIfOk(state.ppt_url);
      },
      {
        immediate: true,
        deep: true,
      }
    );
    onMounted(() => {
      state.ppt_url = props.propTrainDetailInfo.courseware_html;
    });
    return { ...toRefs(state), ...methods, baseurl, transimg };
  },
});
</script>
<style lang="less">
.trainCourseware {
  .top-btn {
    display: flex;
    justify-content: space-between;
    .upload {
      display: flex;
    }
  }
  .pdtView {
    margin-top: 30px;
    .status-img {
      width: 100%;
      text-align: center;
      height: 200px;
    }
    .status-word {
      color: @theme-color;
      display: flex;
      justify-content: center;
    }
  }
  .ant-upload-list-item-info {
    width: 450px;
  }
}
</style>
