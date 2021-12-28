<template>
  <div class="searchResource" v-layout-bg>
    <div class="condition">
      <a-form-item>
        <!-- <a-input @keyup.enter="query" v-model:value="searchInfo.resourceName">
          <template><template
        </a-input> -->
         <a-input
            @keyup.enter="query"
            v-model:value="searchInfo.resourceName"
            placeholder="资源名称"
          >
            <template #prefix>
              <img src="src/assets/images/screenicon/Group6.png" /> </template
          ></a-input>
      </a-form-item>
      <a-form-item >
        <before-icon :icon="iconimg">
          <a-select v-model:value="searchInfo.resourceType" placeholder="资源类型">
          <a-select-option v-for="(v, i) in resourceTypeList" :key="i" :value="v">{{
            v
          }}</a-select-option>
        </a-select>
        </before-icon> 
      </a-form-item>
      <!-- <a-button type="primary" @click="query()">查询</a-button>
      <a-button type="primary" @click="clear()">清空</a-button> -->
      <div class="upload-box" v-if="isMyself">
        <a-upload
          :show-upload-list="false"
          name="file"
          :multiple="false"
          @change="handleChange"
          :before-upload="beforeUpload"
        >
          <a-input-search
            v-model:value="uploadResourceInfo.url"
            :disabled="true"
            style="cursor: pointer;" 
            enter-button="浏览"
          />
        </a-upload>
        <a-form-item label="资源说明">
          <a-input v-model:value="uploadResourceInfo.explain" />
        </a-form-item>
        <a-button type="primary" class="upload" @click="uploadResource"
          >上传资源</a-button
        >
        <p class="prompt">
          (选择文件最大512M，允许上传gif,jpg,png,mp4,xlsx,xls,docx,doc,rar,pdf,ppt,pptx文件类型)
        </p>
      </div>
    </div>
    <a-config-provider>
      <a-table
        :rowKey="rowkey"
        :dataSource="tableList"
        :columns="columns"
        :pagination="false"
      >
        <template #type="{ record }">
          <span>{{ record.posfix }}</span>
        </template>
        <template #operation="{ record }">
          <!-- <span class="iconfont icon-download" @click="download(record.url)"></span> -->
          <!-- href="http://192.168.101.150/upload/train/50304/train_resource/16336625584419.xlsx" -->
          <!-- <a class="iconfont icon-download" title="下载" :href="'http://192.168.101.150'+record.url" :download="record.name"></a> -->
          <span
            class="iconfont icon-download"
            title="下载"
            @click="downLoadResource(record.url, record.name)"
          ></span>
          <span
            class="iconfont icon-shanchu"
            title="删除"
            @click="deleteResource(record.id)"
          ></span>
        </template>
      </a-table>
      <template #renderEmpty>
        <div><empty type="tableEmpty"></empty></div>
      </template>
    </a-config-provider>
    <!-- <Empty v-else /> -->
    <div class="page-footer-box">
      <!-- show-size-changer @showSizeChange="onShowSizeChange"-->
      <a-pagination
       v-if="page.total>10"
        v-model:current="page.page"
        :pageSize="page.pageSize"
        :total="page.total"
        @change="pageChange"
        :hideOnSinglePage="true"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, createVNode, inject, onMounted } from "vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
// import { ITeacherTrainHttp } from "./typings";
import { ITeacherTrainHttp } from "src/views/teacherTrain/typings";

import { message } from "ant-design-vue";
import { Modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { useRoute } from "vue-router";
import FileSaver from "file-saver";
import BeforeIcon from "src/components/aiAnt/beforeIcon.vue";
import iconimg from 'src/assets/images/screenicon/Group3.png'
interface Istate {
  params: {
    name: string;
    ext: string;
    limit?: number;
    page?: number;
    type: number;
    id: string;
  };
  url: string;
}
export default defineComponent({
  name:'searchResource',
  components:{'before-icon':BeforeIcon},
  props: ["trainId", "isMyself"],
  setup(props, context) {
    var updata = inject("updataNav") as Function;
    updata({
      tabs: [],
      navPosition: "outside",
      navType: false,
      showContent: false,
      componenttype: undefined,
    });
    let route = useRoute();
    console.log(route.query);
    // const isMyself = route.query.trainType === "0";
    const isMyself = props.isMyself;
    // 教师自己的实训可以上传资源,内置实训不可以
    const trainInfo: { trainId: any } = {
      // trainId: route.query.trainId,
      trainId: props.trainId,
    };
    const http = (request as ITeacherTrainHttp).teacherTrain;
    console.log(request.teacherTrain);
    const state: Istate = reactive({
      params: {
        name: "",
        ext: "",
        type: 2,
        id: trainInfo.trainId,
      },
      url: "",
    });
    const data = reactive<Idata>({
      resourceTypeList: [
        "gif",
        "jpg",
        "png",
        "mp4",
        "xlsx",
        "xls",
        "docx",
        "doc",
        "rar",
        "pdf",
        "ppt",
        "pptx",
      ],
      searchInfo: {
        resourceName: "",
        resourceType:undefined,
      },
      uploadResourceInfo: {
        url: "",
        explain: "",
        size: "",
        type: "",
      },
      tableList: [],
      page: {
        page: 1,
        pageSize: 20,
        total: 0,
      },
    });
    const columns = [
      {
        title: "资源名称",
        dataIndex: "name",
        key: "name",
        ellipsis: true,
      },
      {
        title: "资源说明",
        dataIndex: "describe",
        key: "describe",
        ellipsis: true,
      },
      {
        title: "文件类型",
        dataIndex: "posfix",
        key: "posfix",
        slots: { customRender: "type" },
        width: 120,
      },
      {
        title: "文件大小",
        dataIndex: "size",
        key: "size",
        width: 120,
      },
      {
        title: "上传时间",
        dataIndex: "created_time",
        key: "created_time",
        width: 220,
      },
      {
        title: "操作",
        dataIndex: "operation",
        key: "operation",
        slots: { customRender: "operation" },
        width: 120,
      },
    ];
    // 获取列表数据
    const getResourceList = () => {
      http.getResourceList({ param: state.params }).then((res: any) => {
        console.log(res);
        data.tableList = res.data.list;
        data.page.total=res.data.page.totalCount
      });
    };
    // 查询
    const query = () => {
      state.params.name = data.searchInfo.resourceName;
      state.params.ext = data.searchInfo.resourceType;
      getResourceList();
    };
    // 清空
    const clear = () => {
      data.searchInfo.resourceName = "";
      data.searchInfo.resourceType =undefined;
    };
    // 下载
    const downLoadResource = (url: string, name: string) => {
      console.log(url, "urlurlurlurlurlur");
      let development = process.env.NODE_ENV == "development" ? true : false;
      let baseurl = development ? "http://localhost:3000/proxyPrefix" : "";
      FileSaver.saveAs(baseurl + url, name);
    };
    // 删除
    const deleteResource = (id: number) => {
      console.log(id);
      Modal.confirm({
        title: "提示",
        icon: createVNode(ExclamationCircleOutlined),
        content: "确定要删除吗？",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          http.delResource({ urlParams: { resource: id } }).then((res: IBusinessResp) => {
            console.log(res);
            getResourceList();
          });
        },
      });
    };
    // 页码发生变化时
    const pageChange = (page: number, pageSize: number) => {
      data.page.page = page;
      data.page.pageSize = pageSize;
      getResourceList();
    };
    // pageSize 变化的回调
    const onShowSizeChange = (current: number, size: number) => {
      data.page.page = current;
      data.page.pageSize = size;
      getResourceList();
    };
    let uploadfile: any;
    const beforeUpload = (file: any) => {
      console.log(file);
      let name = file.name.split(".");
      let type = name[name.length - 1];
      console.log(type);
      if (!data.resourceTypeList.includes(type)) {
        message.error({ content: "上传格式不正确!", duration: 2 });
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 512;
      if (!isLt2M) {
        message.error("(文件最大不能超过512M!");
        return false;
      }
      data.uploadResourceInfo.url = file.name;
      data.uploadResourceInfo.size = file.size;
      data.uploadResourceInfo.type = file.name.split(".")[
        file.name.split(".").length - 1
      ];
      uploadfile = file;
      const fd = new FormData();
      fd.append("uploadFiled", file);
      fd.append("upload_path", "trainCourseware");
      http.uploadsFile({ param: fd }).then((res: any) => {
        console.log(res);
        state.url = res.data.url;
      });
      return false;
    };
    const handleChange = (info: FileInfo) => {};
    const uploadResource = () => {
      if (!data.uploadResourceInfo.url) {
        message.warn("请选择要上传的文件!");
        return;
      }

      if (!data.uploadResourceInfo.explain) {
        message.warn("资源说明不能为空!");
        return;
      }
      const params = {
        relate_id: trainInfo.trainId,
        name: data.uploadResourceInfo.url,
        url: state.url,
        size: data.uploadResourceInfo.url.toString(),
        posfix: data.uploadResourceInfo.type,
        describe: data.uploadResourceInfo.explain,
        type: 2,
      };
      http
        .uploadResource({
          param: params,
        })
        .then((res: IBusinessResp) => {
          if (res.status) {
            data.uploadResourceInfo.url = "";
            data.uploadResourceInfo.explain = "";
            data.uploadResourceInfo.type = "";
            getResourceList();
          }
        });
    };
    const rowkey = (record: {}, index: number) => {
      return index;
    };

    onMounted(() => {
      getResourceList();
    });
    return {
      ...toRefs(state),
      ...toRefs(data),
      query,
      clear,
      columns,
      downLoadResource,
      deleteResource,
      pageChange,
      onShowSizeChange,
      rowkey,
      handleChange,
      beforeUpload,
      uploadResource,
      iconimg
    };
  },
});
interface IsearchInfo {
  resourceName: string;
  resourceType:any;
}
interface IuploadResourceInfo {
  url: string;
  explain: string;
  size: any;
  type: string;
}
interface Ipage {
  page: number;
  pageSize: number;
  total: number;
}
interface ItableList {
  id: number;
  name: string;
  describe: string;
  posfix: string;
  size: string;
  created_time: string;
  url: string;
}
interface Idata {
  resourceTypeList: any[];
  searchInfo: IsearchInfo;
  uploadResourceInfo: IuploadResourceInfo;
  tableList: ItableList[];
  page: Ipage;
}
interface FileItem {
  uid: string;
  name: string;
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
</script>

<style lang="less" scoped>
.font-size-14 {
  font-size: 14px;
}
.searchResource {
  width: @center-width;
  height: 100%;
  margin: 0 auto;
  background-color: @white;
  border-radius: 5px;
  padding: 40px;
  .condition {
    display: flex;
    justify-content: flex-start;
    margin-bottom:16px;
    :deep(.ant-form-item) {
      margin-right: 10px;
      .ant-form-item-control .ant-input,
      .ant-form-item-control .ant-select {
        width: 165px;
        .font-size-14();
      }
      .ant-form-item-label > label {
        .font-size-14();
      }
    }
    :deep(.ant-btn-primary) {
      margin-right: 10px;
      .font-size-14();
      &.upload {
        margin-right: 0;
      }
    }
    .upload-box {
      display: flex;
      position: relative;
      margin-left: auto;
      :deep(.ant-upload) {
        margin-right: 10px;
        :deep(.ant-input){
          cursor: pointer;
          .font-size-14();
        }
        .ant-btn {
          .font-size-14();
        }
      }
      .prompt {
        position: absolute;
        left: 0;
        bottom:-2px;
        font-size: 12px;
        color:rgba(@black,0.25);    
        
      }
    }
  }
  :deep(.ant-table-wrapper) {
    height: 600px;
    overflow: auto;
  }
  .page-footer-box {
    margin-top: 28px;
    text-align: center;
  }
  :deep(.ant-table) .ant-table-thead > tr > th,
  :deep(.ant-table) .ant-table-tbody > tr > td {
    .font-size-14();
    .iconfont {
      color: @theme-color;
      margin-right: 10px;
      cursor: pointer;
    }
  }
  :deep(.ant-btn-primary[disabled], .ant-btn-primary[disabled]:hover, .ant-btn-primary[disabled]:focus, .ant-btn-primary[disabled]:active){
    color: @white;
    background:@theme-color;
    border-color:@theme-color;
  }
  :deep(.ant-input[disabled]){
    cursor: pointer;
  }
  :deep(.ant-select-selector){
    height: 35px;
  }
  :deep(.ant-input-group-addon){
    background-color: transparent;
  }
}
</style>
