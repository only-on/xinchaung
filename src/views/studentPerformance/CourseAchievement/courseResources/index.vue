<template>
  <div id="courseResource" v-layout-bg>
      <div class="search-header">
          <div class="search"><a-input-search class="search" style="width:503px;padding:8px 5px 8px 30px" placeholder="请输入课程资源关键字查询" @keyup.enter="onSearch" @search="onSearch"/></div>
          <div class="btn-return" @click="goBack"><span class="iconfont icon-fanhui"></span></div>
      </div>
      <div class="content-table">
           <a-table class="table" :columns="columns" :data-source="resourceData"/>
      </div>
  </div>
</template>

<script  lang="ts">
import {defineComponent,inject} from 'vue'
import {useRouter} from 'vue-router'
export default defineComponent({
    name:'listItem',
    setup:(props,{emit})=>{
        const router=useRouter()
        var updata=inject('updataNav') as Function
        updata({tabs:[],navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true})
        const columns=[
            {
                title: '资源名称',
                dataIndex: 'name',
                key: 'name',
                scopedSlots: { customRender: 'name' },
            },
            {
                title: '资源说明',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '文件类型',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '文件大小',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '上传时间',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '操作',
                dataIndex: 'age',
                key: 'age',
                scopedSlots: { customRender: 'tags' },
            }
        ]
        const resourceData:any=[] 
        function onSearch(value:string){
            console.log(value)
        }
        function goBack(){
            router.go(-1)
        }
        return{onSearch,goBack,columns,resourceData}
    }
})
</script>

<style lang='less' scoped>
#courseResource{
    font-size: 14px;
    .search-header{
        display: flex;
        justify-content: space-between;
        margin: 20px 0px;
        .btn-return{
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background-color:#ebeff8;
            display: flex;
            justify-content: center;
            align-items: center;
            .icon-fanhui{
                color: #8955b5;
            }
        }
    }
}

</style>
<style lang="less">
    .table{
        .ant-table-thead > tr > th, .ant-table-tbody > tr > td{
            font-size: 14px;
        }
    }
</style>