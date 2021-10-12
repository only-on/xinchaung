<template>
  <div class="resource" v-layout-bg>
    <div class="condition">
      <a-form-item label="资源名称">
        <a-input v-model:value="searchInfo.resourceName"/>
      </a-form-item>
      <a-form-item label="资源类型">
        <a-select v-model:value="searchInfo.resourceType" placeholder="">
          <a-select-option value="">请选择</a-select-option>
          <a-select-option v-for="(v, i) in resourceTypeList" :key="i" :value="v">{{v}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-button type="primary" @click="query()">查询</a-button>
      <a-button type="primary" @click="clear()">清空</a-button>
      <div class="upload-box" v-if="isMyself">
        <a-upload
          :show-upload-list="false"
          name="file"
          :multiple="false"
          @change="handleChange"
          :before-upload=beforeUpload
          >
          <a-input v-model:value="uploadResourceInfo.url" :disabled="true"/>
          <a-button>
            上传
          </a-button>
        </a-upload>
        <a-form-item label="资源说明">
          <a-input v-model:value="uploadResourceInfo.explain"/>
        </a-form-item>
        <a-button type="primary" class="upload" @click="uploadResource">上传资源</a-button>
        <p class="prompt">(选择文件最大512M，允许上传gif,jpg,png,mp4,xlsx,xls,docx,doc,rar,pdf,ppt,pptx文件类型)</p>
      </div>
    </div>
    <a-table 
      :rowKey="rowkey"
      :dataSource="tableList" 
      :columns="columns" 
      :bordered="true"
      :pagination="false"
      v-if="tableList.length"
    >
      <template #type="{ record }">
        <span>{{ record.posfix }}</span>
      </template>
      <template #operation="{ record }">
        <!-- <span class="iconfont icon-download" @click="download(record.url)"></span> -->
        <!-- href="http://192.168.101.150/upload/train/50304/train_resource/16336625584419.xlsx" -->
        <a class="iconfont icon-download" title="下载" :href="'http://192.168.101.150'+record.url" :download="record.name"></a>
        <span class="iconfont icon-shanchu" title="删除" @click="deleteResource(record.id)"></span>
      </template>
    </a-table>
    <Empty v-else/>
    <div class="page-footer-box">
        <!-- show-size-changer @showSizeChange="onShowSizeChange"-->
      <a-pagination
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
import { defineComponent, reactive, toRefs, createVNode, inject, onMounted } from 'vue'
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { ITeacherExperimentalHttp } from './typings'
import { message } from 'ant-design-vue'
import { Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { useRoute } from 'vue-router'

export default defineComponent({
  setup() {
    var updata = inject('updataNav') as Function
    updata({ tabs:[], navPosition:'outside', navType:false, showContent:false, componenttype:undefined })
    let route = useRoute()
    console.log(route.query)
    const isMyself = route.query.trainType === '0'   // 教师自己的实训可以上传资源,内置实训不可以
    const trainInfo:{trainId: any} = {
      trainId: route.query.trainId
    }
    const http=(request as ITeacherExperimentalHttp).teacherExperimental
    console.log (request.teacherExperimental)
    const data = reactive<Idata>({
      resourceTypeList: ["gif", "jpg", "png", "mp4", "xlsx", "xls", "docx", "doc", "rar", "pdf", "ppt", "pptx"],
      searchInfo: {
        resourceName: '',
        resourceType: ''
      },
      uploadResourceInfo: {
        url: '',
        explain: ''
      },
      tableList: [],
      page: {
        page: 1,
        pageSize: 20,
        total: 0
      }
    })
    const columns = [
      {
        title: '资源名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true
      },
      {
        title: '资源说明',
        dataIndex: 'describe',
        key: 'describe',
        ellipsis: true
      },
      {
        title: '文件类型',
        dataIndex: 'posfix',
        key: 'posfix',
        slots: { customRender: 'type' },
        width: 120,
      },
      {
        title: '文件大小',
        dataIndex: 'size',
        key: 'size',
        width: 120,
      },
      {
        title: '上传时间',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 220,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        slots: { customRender: 'operation' },
        width: 120,
      },
    ]
    // 获取列表数据
    const getResourceList = () => {
      // data.tableList = [
      //   {
      //     id: 1,
      //     name: '111',
      //     describe: '222',
      //     posfix: 'lsx',
      //     size: '1024kb',
      //     created_time: '2021.9.16',
      //     url: "/src/assets/images/bg1.jpg"
      //   }
      // ]
      let param = {
        query: {
          id: trainInfo.trainId,
          name: data.searchInfo.resourceName,
          posfix: data.searchInfo.resourceType,
        },
        page: {
          pageSize: data.page.pageSize,
          page: data.page.page
        }
      }
      console.log(param)
      http.getResourceList({param}).then((res: IBusinessResp) => {
        console.log(res)
        data.tableList = res.data.list
        data.page.page = res.data.page.currentPage
        data.page.total = res.data.page.totalCount
      })
    }
    // 查询
    const query = () => {
      data.page.page = 1
      getResourceList()
    }
    // 清空
    const clear = () => {
      data.searchInfo.resourceName = ''
      data.searchInfo.resourceType = ''
    }
    // 下载
    const download = (url: string) => {
      console.log(url)
      location.href = url
    }
    // 删除
    const deleteResource = (id: number) => {
      console.log(id)
      Modal.confirm({
        title: '提示',
        icon: createVNode(ExclamationCircleOutlined),
        content: '确定要删除吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          http.delResource({param: {train_resource_id: id}}).then((res: IBusinessResp) => {
            console.log(res)
            getResourceList()
          })
        }
      });
    }
    // 页码发生变化时
    const pageChange = (page: number, pageSize: number) => {
      data.page.page = page
      data.page.pageSize = pageSize
      getResourceList()
    }
    // pageSize 变化的回调
    const onShowSizeChange = (current: number, size: number) => {
      data.page.page = current
      data.page.pageSize = size
      getResourceList()
    }
    let uploadfile:any
    const beforeUpload = (file: any) => {
      console.log(file)
      let name = file.name.split('.')
      let type = name[name.length - 1]
      console.log(type)
      if (!data.resourceTypeList.includes(type)) {
        message.error({ content: '上传格式不正确!', duration: 2 })
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 512;
      if (!isLt2M) {
        message.error('(文件最大不能超过512M!');
        return false
      }
      data.uploadResourceInfo.url = file.name
      uploadfile = file
      return false
    }
    const handleChange = (info: FileInfo) => {

    }
    const uploadResource = () =>{
      if(!data.uploadResourceInfo.url) {
        message.warn('请选择要上传的文件!');
        return
      }
      
      if (!data.uploadResourceInfo.explain) {
        message.warn('资源说明不能为空!');
        return
      }
      console.log(uploadfile)
      const fd = new FormData()
      fd.append('resource', uploadfile)
      fd.append('train_id', trainInfo.trainId)
      fd.append('introduce', data.uploadResourceInfo.explain)
      console.log(fd)
      http.uploadResource({
        param: fd
      }).then((res: IBusinessResp) => {
        if (res.status) {
          data.uploadResourceInfo.url = ''
          data.uploadResourceInfo.explain = ''
          getResourceList()
        }
      })
    }
    const rowkey = (record: {}, index: number) => {
      return index
    }

    onMounted(() => {
      getResourceList()
    })
    return {
      isMyself,
      ...toRefs(data),
      query,
      clear,
      columns,
      download,
      deleteResource,
      pageChange,
      onShowSizeChange,
      rowkey,
      handleChange,
      beforeUpload,
      uploadResource,
    }
  },
})
interface IsearchInfo {
  resourceName: string
  resourceType: string
}
interface IuploadResourceInfo {
  url: string
  explain: string
}
interface Ipage{
  page: number
  pageSize: number
  total: number
} 
interface ItableList {
  id: number
  name: string
  describe: string
  posfix: string
  size: string
  created_time: string
  url: string
}
interface Idata {
  resourceTypeList: string[],
  searchInfo: IsearchInfo
  uploadResourceInfo: IuploadResourceInfo
  tableList: ItableList[]
  page: Ipage
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
.resource {
  width: @center-width;
  height: 100%;
  margin: 0 auto;
  background-color: @white;
  border-radius: 5px;
  padding: 40px;
  .condition {
    display: flex;
    justify-content: flex-start;
    :deep(.ant-form-item) {
      margin-right: 10px;
      .ant-form-item-control .ant-input, 
      .ant-form-item-control .ant-select  {
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
        .ant-input {
          width: 165px;
          .font-size-14();
          cursor: pointer;
        }
        .ant-btn {
          .font-size-14();
        }
      }
      .prompt {
        color: #F44336;
        position: absolute;
        bottom: -10px;
        left: 0;
        font-size: 14px;
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
}
</style>