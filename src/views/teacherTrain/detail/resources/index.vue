<template>
  <div class="resources">
    <div v-if="role != '2'" class="resource-top">
      <span class="choiceFile">
        选择文件:
        <a-upload name="file" :beforeUpload="beforeUpload">
          <a-input style="width: 140px" v-model:value="name"></a-input
          ><a-button type="primary">浏览</a-button>
        </a-upload>
      </span>
      <span
        >资源说明：<a-input style="width: 140px" v-model:value="introduce"></a-input
        ><a-button type="primary" @click="uploadFile">上传文件</a-button
        ><span class="fileLimit"
          >文件限制：512M，文件格式：gif,jpg,png,mp4,xlsx,xls,docx,doc,rar,pdf,ppt,pptx</span
        ></span
      >
    </div>
    <div>
      <a-config-provider>
        <a-table :columns="columns" :data-source="data" rowKey="id" :pagination="
          total > 10
            ? {
                hideOnSinglePage: false,
                showSizeChanger: true,
                total: total,
                pageSize: params.limit,
                onChange: onChange,
                onShowSizeChange: onShowSizeChange,
              }
            : false
        ">
          <template #action="{ record }">
            <div class="action">
              <span class="spanleft" @click="deleteUploadFile(record.id)">删除</span>
              <span @click="downLoad(record.url, record.name)">下载</span>
              <!-- <a :href="record.url">下载</a> -->
            </div>
          </template>
        </a-table>
        <template #renderEmpty>
          <div><empty type="tableEmpty"></empty></div>
        </template>
      </a-config-provider>
    </div>
  </div>
</template>
<script lang="ts">
interface Istate {
  // columns: any[];
  data: any[];
  total:number,
  params:{
    limit:number,
    page:number,
  };
  file: any;
  name: string;
  size: string;
  introduce: string;
  url: string;
  type: string;
}
import { defineComponent, onMounted, watch, inject, reactive, toRefs, ref } from "vue";
import request from "src/api/index";
import Empty from "src/components/Empty.vue";
import { message } from "ant-design-vue";
import FileSaver from "file-saver";
export default defineComponent({
  name: "resources",
  props: ["propTrainDetailInfo", "trainId", "resource", "type"], // type 判断是否是课程资源
  components: {
    Empty,
  },
  setup(props, context) {
    const http = (request as any).teacherTrain;
    const role = localStorage.getItem("role");
    const columns1 = [
      {
        title: "资源名称",
        dataIndex: "name",
        ellipsis: true,
      },
      {
        title: "资源说明",
        dataIndex: "describe",
        ellipsis: true,
      },
      {
        title: "文件类型",
        dataIndex: "posfix",
        ellipsis: true,
      },
      {
        title: "文件大小",
        dataIndex: "size",
      },
      {
        title: "上传时间",
        dataIndex: "created_time",
        align: "center",
      },
      {
        title: "操作",
        dataIndex: "action",
        align: "center",
        slots: { customRender: "action" },
      },
    ];
    const columns = role === "2" ? columns1?.splice(0, 5) : columns1;
    const state: Istate = reactive({
      data: [],
      total:0,
      params:{
        limit:10,
        page:1,
      },
      file: "",
      name: "",
      size: "",
      introduce: "",
      url: "",
      type: "",
    });
    const methods = {
      onChange(page: any, pageSize: any) {
        state.params.page = page;
        state.params.limit = pageSize;
        methods.getResourceList();
      },
      onShowSizeChange(current: any, size: any) {
        console.log(current, size, "current, size");
        state.params.page = current;
        state.params.limit = size;
        methods.getResourceList();
      },
      beforeUpload(file: any) {
        state.file = file;
        const type = state.file.name.split(".")[state.file.name.split(".").length - 1];
        if (
          type !== "gif" &&
          type !== "jpg" &&
          type !== "png" &&
          type !== "mp4" &&
          type !== "xlsx" &&
          type !== "xls" &&
          type !== "docx" &&
          type !== "doc" &&
          type !== "rar" &&
          type !== "pdf" &&
          type !== "ppt" &&
          type !== "pptx"
        ) {
          message.warning("文件格式不正确！");
          return;
        }
        console.log(file);
        state.name = file.name;
        state.size = file.size;
        state.type = type;
        const fd = new FormData();
        fd.append("uploadFiled", state.file);
        fd.append("upload_path", "trainCourseware");
        http.uploadsFile({ param: fd }).then((res: any) => {
          console.log(res);
          state.url = res.data.url;
        });
        return false;
      },
      getResourceList() {
        const params = {
          type: props.type === "course" ? 1 : 2,
          id: props.trainId,
          limit:state.params.limit,
          page:state.params.page,
        };
        http.resourceList({ param: params }).then((res: any) => {
          console.log(res);
          state.data = res.data.list;
          state.total=res.data.page.totalCount;
          //    context.emit('stepFourInfo',state.data)
          inject["stepInfoFour"] = state.data;
        });
      },
      uploadFile() {
        if (!state.file) {
          message.warning("请上传文件！");
          return;
        }
        if (!state.introduce) {
          message.warning("资源说明不能为空！");
          return;
        }
        const params = {
          relate_id: props.trainId,
          name: state.name,
          url: state.url,
          size: state.size.toString(),
          posfix: state.type,
          describe: state.introduce,
          type: props.type === "course" ? 1 : 2,
        };
        http
          .uploadResource({ param: params })
          .then((res: any) => {
            console.log(res);
            state.name=''
            state.url=''
            state.introduce=''
            message.success("上传成功！")
            methods.getResourceList();
          })
          .catch(() => {
            message.error("网络错误");
          });
      },
      deleteUploadFile(id: any) {
        http.deleteResource({ urlParams: { resource: id } }).then((res: any) => {
          console.log(res);
          message.warning("删除成功");
          methods.getResourceList();
        });
      },
      downLoad(url: any, name: any) {
        let development = process.env.NODE_ENV == "development" ? true : false;
        let baseurl = development ? "http://localhost:3000/proxyPrefix" : "";
        FileSaver.saveAs(baseurl + url, name);
      },
    };
    //  watch(()=>props.resource,(val:any)=>{
    //      console.log(val,'sssdccccddccddcdcdc')
    //      if(val!=={}){
    //          state.data=val;
    //      }
    // },{
    //     deep:true,
    //     immediate:true
    // })
    onMounted(() => {
      methods.getResourceList();
      console.log(inject["stepInfoFour"]);
      if (inject["stepInfoFour"]) {
        state.data = inject["stepInfoFour"];
      }
    });
    return { ...toRefs(state), ...methods, columns, role };
  },
});
</script>
<style lang="less" scoped>
.resources {
  margin: 10px;
  .ant-upload-list {
    display: none;
  }
  .resource-top {
    display: flex;
    .choiceFile {
      margin-right: 20px;
    }
    .ant-btn {
      margin-left: 10px;
    }
    .fileLimit {
      color: #777;
      font-size: 14px;
      margin-left: 10px;
    }
  }
  .action {
    color: var(--purpleblue-6);
    .spanleft {
      margin-right: 5px;
    }
  }
}
:deep(.ant-table-pagination.ant-pagination) {
  float: none;
  text-align: center;
}
</style>
