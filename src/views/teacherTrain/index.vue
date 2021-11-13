<template>
  <div class="experimentalList" v-layout-bg>
    <div class="head">
      <a-input v-model:value="form.name" placeholder="请输入实训名称关键字查询" @pressEnter="handleSearch">
        <template #prefix>
          <i class="iconfont icon-sousuo"></i>
        </template>
      </a-input>
      <a-button type="primary" @click="handleSearch">查询</a-button>
    </div>
    <div class="content">
      <card-list v-if="listData.length > 0 || trainType === 0" :trainType="trainType" :data="listData" @refresh="refresh"/>
      <Empty v-else/>
      <a-pagination
        show-size-changer
        v-model:current="form.page"
        v-model:pageSize="form.limit"
        :total="total"
        :hideOnSinglePage="true"
        :pageSizeOptions="pageSizeOptions"
        @showSizeChange="onShowSizeChange"
        @change="pageChange"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, inject, reactive, watch, onMounted } from 'vue'
import cardList from './components/cardList.vue'
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { ITeacherTrainHttp } from './typings'
interface Iform{
  name: string,
  page: number,
  limit: number,
  is_archive: number,
  is_init: number
}
export default defineComponent({
  components: {
    cardList
  },
  setup() {
    const http=(request as ITeacherTrainHttp).teacherTrain
    const tabs = [
      {
        name: '我的实训',
        componenttype: 0
      },
      {
        name: '内置实训',
        componenttype: 1
      },
      {
        name: '归档实训',
        componenttype: 2
      }
    ]
    var updata=inject('updataNav') as Function
    updata({tabs:tabs,navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true})
    var configuration:any=inject('configuration')
    var form = reactive<Iform>({
      name: '',
      page: 1,
      limit: 11,
      is_archive: 0,
      is_init: 0
    })
    var listData =ref<any>([])
    var total = ref<number>(0)
    var trainType = ref<number>(0)
    var pageSizeOptions = ref<string[]>(['11','23','35'])
    watch(()=>configuration.componenttype, (newVal) => {
      trainType.value = newVal
      total.value = 0
      form.name = ''
      form.page = 1
      form.limit = 12
      pageSizeOptions.value = ['12','24','36']
      if (newVal == 0) {
        // 我的实训
        form.is_archive = 0
        form.is_init = 0
        form.limit = 11
        pageSizeOptions.value = ['11','23','35']
      } else if (newVal == 1) {
        // 内置实训
        form.is_archive = 0
        form.is_init = 1
      } else {
        // 归档实训
        form.is_archive = 1
        form.is_init = 0
      }
      getList()
    })
    function getList () {
      http.trainList({param: form}).then((res:IBusinessResp) => {
        if (res && res.data) {
          listData.value =res.data.list
          total.value = res.data.page.totalCount
        }
      })
    }
    function pageChange (page:number) {
      form.page = page
      getList()
    }
    function onShowSizeChange (val:number,size:number) {
      form.limit = size
      getList()
    }
    function handleSearch () {
      form.page = 1
      getList()
    }
    
    function refresh () {
      getList()
    }
    onMounted(()=>{
      getList()
    })
    return {
      form,
      trainType,
      total,
      listData,
      onShowSizeChange,
      handleSearch,
      pageChange,
      refresh,
      pageSizeOptions
    }
  },
})
</script>
<style lang="less" scoped>
.experimentalList{
  .head{
    margin-bottom: 20px;
    :deep(.ant-input-affix-wrapper){
      border-radius: 0;
      width: 400px;
      i{
        color: #c7c4c4;
        font-weight: bold;
      }
    }
    .ant-btn{
      border-radius: 0;
      height: 35px;
    }
  }
  .cardList{
    display: flex;
    flex-wrap: wrap;
  }
  .ant-pagination{
    text-align: center;
  }
}
</style>
