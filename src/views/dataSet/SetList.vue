<template>
  <div class="dateSetList">
    <div class="search fixCenter">
      <div class="left">
        <a-radio-group v-model:value="search.category" button-style="solid">
          <a-radio-button :value="v.uid" v-for="v in option" :key="v.name">{{v.name}}</a-radio-button>
        </a-radio-group>
      </div>
      <div class="right fix">
        <div class="search-box">
          <a-input-search
            v-model:value="search.keyword"
            placeholder="请输入搜索关键字查询"
            @search="init"
          />
        </div>
         <a-button v-if="showCreate" type="primary" @click="create">新建数据集</a-button>
      </div>
    </div>
    <a-spin :spinning="loading" size="large" tip="Loading...">
      <div class="data-set-content setScrollbar">

      </div>
    </a-spin>
    
  </div>
</template>
<script lang="ts">
import { defineComponent,ref, onMounted,reactive, toRefs,watch ,inject,Ref,computed} from 'vue'
import request from '../../api/index'
import { IBusinessResp} from '../../typings/fetch.d';
import { useRouter ,useRoute } from 'vue-router';
import { Modal,message } from 'ant-design-vue';
const http=(request as any).dataSet
interface ISearch{
  category:string
  page:number
  per_page:number
  keyword:string
}
export default defineComponent({
  name: '',
  components: {
   
  },
  setup: (props,context) => {
    const router = useRouter();
    const route = useRoute();
    const {currentTab}=route.query
    var loading:Ref<boolean> =ref(false)
    var search:ISearch=reactive({
      category:'',
      page:1,
      per_page:1,
      keyword:''

    })
    var showCreate=computed(()=>{
      return true
    })
    var option:any[]=reactive([])
    var dataList:any[]=reactive([])
    function create(){

    }
    function categoryList(){
      option.length=0
      http.categoryList().then((res:IBusinessResp)=>{
          option.push(...res.data)
          option.unshift({uid:'',name:'全部'})
          // console.log(option)
      })
    }
    function init(){
      dataList.length=0
      loading.value=true
      http.datasets({}).then((res:IBusinessResp)=>{
          loading.value=false
          dataList.push(...res.data)
          console.log(dataList)
      })
    }
    onMounted(()=>{
     categoryList()
     init()
    })
    return {loading,search,option,init,create,showCreate};
  },
})
</script>
<style scoped lang="less">
.fix{
  display: flex;
  align-items: center;
}
.fixCenter{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dateSetList{
  height: 100%;
  overflow: hidden;
  .search{
    .right{
      .search-box{
        width: 340px;
      }
      .ant-btn{
        margin-left: 16px;
      }
    }
  }
  .data-set-content{

  }
}
</style>