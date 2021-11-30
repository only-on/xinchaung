<template>
  <div id="courseResource" v-layout-bg>
      <div class="search-header">
          <div class="search"><a-input-search class="searchInput"  placeholder="请输入课程资源关键字查询" @keyup.enter="onSearch" @search="onSearch"/></div>
          <div class="btn-return" @click="goBack"><span class="iconfont icon-fanhui"></span></div>
      </div>
      <div class="content-table">
          <a-config-provider>
            <a-table 
            class="table"
            rowKey='id' 
            :columns="columns"
            :data-source="resourceData"
            :pagination="pagination"/>
            <template #renderEmpty>
                    <div><empty type="tableEmpty"></empty></div>
            </template>
           </a-config-provider>
      </div>
  </div>
</template>

<script  lang="ts">
import {defineComponent,inject,onMounted,ref} from 'vue'
import {useRouter} from 'vue-router'
import request from 'src/api'
import Empty from 'src/components/Empty.vue'
export default defineComponent({
    name:'listItem',
    components: {Empty},
    setup:(props,{emit})=>{
        const http=(request as any).studentPerformance
        const router=useRouter()
        var updata=inject('updataNav') as Function
        updata({tabs:[],navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true})
        const columns=[
            {
                title: '资源名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '资源说明',
                dataIndex: 'describe',
                key: 'describe',
            },
            {
                title: '文件类型',
                dataIndex: 'posfix',
                key: 'posfix',
            },
            {
                title: '文件大小',
                dataIndex: 'size',
                key: 'size',
            },
            {
                title: '上传时间',
                dataIndex: 'updated_time',
                key: 'updated_time',
            },
            {
                title: '操作',
                dataIndex: 'age',
                key: 'age',
                scopedSlots: { customRender: 'tags' },
            }
        ]
        const resourceData:any=ref([])
        const pagination:any=ref({
            hideOnSinglePage:true
        })
        const params:any=ref({type:1,id:router.currentRoute.value.query.id,name:''})
        function onSearch(value:string){
            console.log(value)
            params.value.name = value
            resourceList()
        }
        function goBack(){
            router.go(-1)
        }
        function resourceList(){
            http.getResources({param:params.value}).then((res:any)=>{
                console.log(res)
                resourceData.value=res.data.list
            })
        }
        onMounted(() => {
            resourceList()
            console.log(router.currentRoute.value.query.id,'resourceId')
        })
        return{onSearch,goBack,columns,resourceData,resourceList,params,pagination}
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
        .searchInput{
            width:503px;
            padding:8px 5px 8px 30px;
        }
        .btn-return{
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background-color:#ebeff8;
            display: flex;
            justify-content: center;
            align-items: center;
            .icon-fanhui{
                color:@theme-color;
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