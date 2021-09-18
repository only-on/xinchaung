<template>
  <div class="experimentalList" v-layout-bg>
    <div class="head">
      <a-input v-model:value="form.keyword" placeholder="请输入实训名称关键字查询" @pressEnter="handleSearch">
        <template #prefix>
          <i class="iconfont icon-sousuo"></i>
        </template>
      </a-input>
      <a-button type="primary" @click="handleSearch">查询</a-button>
    </div>
    <div class="content">
      <card-list :trainType="trainType"/>
      <a-pagination
        show-size-changer
        v-model:current="form.page"
        v-model:pageSize="form.pageSize"
        :total="500"
        @showSizeChange="onShowSizeChange"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { number } from 'echarts'
import { defineComponent, ref, inject, reactive, watch } from 'vue'
import cardList from './components/cardList.vue'
interface Iform{
  keyword: string,
  page: number,
  pageSize: number
}
export default defineComponent({
  components: {
    cardList
  },
  setup() {
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
      keyword: '',
      page: 1,
      pageSize: 10
    })
    var trainType = ref<number>(0)

    watch(()=>configuration.componenttype, (newVal) => {
      trainType.value = newVal
      form.keyword = ''
      form.page = 1
      form.pageSize = 10
    })

    function onShowSizeChange (val:number,size:number) {
      form.pageSize = size
    }
    function handleSearch () {
      console.log(form)
    }
    return {
      form,
      trainType,
      onShowSizeChange,
      handleSearch
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
        color: #e1dddd;
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
