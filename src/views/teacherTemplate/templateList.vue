<template>
  <div class="templateList" v-layout-bg>
    <div class="head">
      <a-input v-model:value="form.name" placeholder="请输入模板标题关键词" @pressEnter="handleSearch">
        <template #suffix>
          <i class="iconfont icon-sousuo" @click="handleSearch"></i>
        </template>
      </a-input>
    </div>
    <div class="content">
      <card-list v-if="data.length > 0 || templateType==='mine'" 
        :type="templateType" 
        :data="data"
        @delete="handleDelete"
        @copy="handleCopy"
        @share="handleShare"
        @down="handleDownload"
        @upload="handleUpload"
        @create="handleCreate"
        @edit="handleEdit"
        @view="handleView"/>
      <Empty v-else/>
      <a-pagination
        v-model:current="form.page"
        v-model:pageSize="form.pageSize"
        :total="total"
        :hideOnSinglePage="true"
        @change="pageChange"
      />
    </div>
  </div>
<!-- 复用保存弹框 -->
<copy-save :dialogVisible="copyDialog" :name="copyItem.name" @close="copyDialog = false" @save="handleCopySave"/>
<!-- 离线文件上传 -->
<upload-file :dialogVisible="uploadDialog" @refresh="getList" @close="uploadDialog = false" />
<!-- 离线报告详情 -->
<offline-report :dialogVisible="offlineDialog" :pdfUrl="pdfUrl" @close="offlineDialog = false"/>
</template>
<script lang="ts">
import { defineComponent,inject, reactive, watch, ref, onMounted, toRefs } from 'vue'
import {useRouter} from 'vue-router'
import cardList from './components/cardList.vue'
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { ITeacherTemplateHttp,TemplateModel } from './templateTyping'
import { MessageApi } from "ant-design-vue/lib/message";
import { ModalFunc } from "ant-design-vue/lib/modal/Modal";
import copySave from './components/copySave.vue'
import uploadFile from './components/uploadFile.vue'
import offlineReport from './components/offlineReport.vue'
interface Iform{
  name: string,
  page: number,
  pageSize: number
} 
interface IlistData{
  total: number,
  data: TemplateModel[]
}
const tabNames = ['mine', 'init', 'shared', 'teacher']
const teacherTabs = [
    {
      name: '我的模板',
      componenttype: 0
    },
    {
      name: '内置模板',
      componenttype: 1
    },
    {
      name: '共享模板',
      componenttype: 2
    }
  ]
const adminTabs =  [
    {
      name: '教师创建模板',
      componenttype: 0
    },
    {
      name: '系统内置模板',
      componenttype: 1
    }
]
const templateShared = {
  unshare: {
    request: 'unshare',
    message: '取消共享'
  },
  share: {
    request: 'share',
    message: '共享'
  }
}
export default defineComponent({
  components: {
    cardList,
    copySave,
    uploadFile,
    offlineReport
  },
  setup() {
    const http=(request as ITeacherTemplateHttp).teacherTemplate
    const $message: MessageApi = inject("$message")!;
    const $confirm: ModalFunc = inject("$confirm")!;
    const router = useRouter()
    const httpType = [http.mineTemplateList, http.initTemplateList, http.sharedTemplateList, http.teachersTemplateList]
    const tabs = localStorage.role == 3 ? teacherTabs : adminTabs
    var listData = reactive<IlistData>({
      total: 0,
      data: []
    })
    var updata=inject('updataNav') as Function
    updata({tabs:tabs,navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true})
    var configuration:any=inject('configuration')
    var tabType = ref<number>(0)
    var templateType = ref<string>(tabNames[0])
    const form = reactive<Iform>({
      name: '',
      page: 1,
      pageSize: 14
    })
    var copyDialog = ref<boolean>(false)
    var uploadDialog = ref<boolean>(false)
    var offlineDialog = ref<boolean>(false)
    var pdfUrl = ref<string>('')
    var copyItem = reactive<any>({})
    const handleSearch = () => {
      form.page = 1
      getList()
    }
    const pageChange = (page:number) => {
      form.page = page
      getList()
    }
    const getList = () => {
      httpType[tabType.value]({param:form}).then((res:IBusinessResp) => {
        if (res && res.data) {
          listData.data = res.data.list
          listData.total = res.data.page.totalCount
        }
      })
    }
    watch(()=>configuration.componenttype, newVal => {
      // 设置教师创建模板的tabType值
      if (localStorage.role != 3 && newVal===0) {
        tabType.value = 3
      } else {
        tabType.value = newVal
      }
      templateType.value = tabNames[tabType.value]
      form.page = 1
      form.name = ''
      if (tabType.value === 0) {
        form.pageSize = 14
      } else {
        form.pageSize = 15
      }
      getList()
    }) 
    // 删除模板
    const handleDelete = (item:any) => {
      $confirm({
        title: '提示',
        content: templateType.value === 'shared' ? '删除此模板的同时将删除“我的模板”中的此报告模板，确定要删除吗？' :'确定删除实验报告模板?删除后不可恢复',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          http.deleteTemplate({param: {id: item.id}}).then((res:IBusinessResp) => {
            $message.success(`实验报告模板：${item.name}, 删除成功！`)
            getList()
          })
        },
      })
    }
    // 复用、保存模板
    const handleCopy = (item:any) => {
      copyDialog.value = true
      Object.assign(copyItem, item)
    }
    const handleCopySave = (data:any) => {
      if (!data.name && data.name.trim().length === 0) {
        $message.warn('请填写实验模板名称')
        return
      }
      let params = JSON.parse(JSON.stringify(copyItem))
      params.name = data.name
      http.copyTemplate({param: params}).then((res:IBusinessResp) => {
        if (templateType.value === 'mine') {
          $message.success(`实验报告模板：${data.name} 复用成功，可以在我的模板中查看！`)
        } else {
          $message.success(`实验报告模板：${data.name} 保存成功，可以在我的模板中查看！`)
        }
        getList()
        copyDialog.value = false
      })
    }
    // 共享、取消共享
    const handleShare = (item:any) => {
      let option = item.is_shared ? templateShared.unshare : templateShared.share
      http[option.request+'Template']({param: {id: item.id}}).then((res:IBusinessResp) => {
        $message.success(`实验报告模板：${item.name}, ${option.message}成功！`)
        getList()
      })
    }
    // 下载
    const handleDownload = (item:any) => {
      const a: any = document.createElement('a')
      a.href = item.word_path
      a.download = item.file_name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
    // 上传离线模板
    const handleUpload = () => {
      uploadDialog.value = true
    }
    // 创建在线模板
    const handleCreate = () => {
      router.push('/teacher/teacherTemplate/createTemplate')
    }
    // 编辑
    const handleEdit = (item:any) => {
      router.push({
        path: '/teacher/teacherTemplate/createTemplate',
        query: {
          id: item.id
        }
      })
    }
    // 查看
    const handleView = (item:any) => {
      if (item.type === 'file') {
        offlineDialog.value = true
        if (item.pdf_url) {
          pdfUrl.value = item.pdf_url
        }
      } else {
        router.push({
          path: '/teacher/teacherTemplate/createTemplate',
          query: {
            id: item.id,
            type: 'view'
          }
        })
      }
    }
    onMounted(()=>{
      getList()
    })
    return {
      form,
      templateType,
      ...toRefs(listData),
      handleSearch,
      pageChange,
      handleDelete,
      handleCopy,
      copyDialog,
      handleCopySave,
      copyItem,
      handleShare,
      handleDownload,
      handleUpload,
      uploadDialog,
      getList,
      handleCreate,
      handleEdit,
      handleView,
      offlineDialog,
      pdfUrl
    }
  },
})
</script>
<style lang="less" scoped>
.templateList{
  .head{
    margin-bottom: 20px;
    :deep(.ant-input-affix-wrapper){
      border-radius: 0;
      width: 400px;
      i{
        color: #c7c4c4;
        font-weight: bold;
        cursor: pointer;
      }
    }
  }
  .ant-pagination{
    text-align: center;
  }
}
</style>

