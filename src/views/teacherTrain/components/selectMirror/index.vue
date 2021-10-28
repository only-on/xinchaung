<template>
   <div class="setupMirror"  v-layout-bg>
        <div class="typeBtn">
            <div class="btntype">类型：</div>
            <div :class="typeNumber===Number(index)?'btn selectedBtn':'btn'" v-for="(item,index) in typeTabs" :key="index.toString()" @click="selectEnvirType(index)">{{item}}</div>
        </div>
        <div class="searchInput">
            <a-input-search v-model:value='searchValue' @keyup.enter="searchData" @search="searchData" style="width:340px;padding:4px 30px 4px 11px" placeholder="请输入目录名称关键字查询" />
        </div>
        <!-- envirListData.length -->
        <div v-if="true" class="tableList">
            <div class="listItem" v-for="(item,index) in envirListData"  :key="index.toString()">
                <div class="name">{{item.name}}</div>
                <div class="tags">标签：{{item.tag.join('/')}}</div>
                <div class="selectDelete">
                  <!-- v-if="choice=mirroridArr.indexOf(item.id)===-1?true:false" -->
                    <span v-if="choice=mirroridArr.indexOf(item.id)===-1?true:false" @click="choiceEnvir(item)">选择</span>
                    <span v-else  @click="deleteEnvir(item)" class="iconfont icon-shanchu-copy"></span>
                </div>
            </div>
            <!-- <a-pagination
                v-model="pageInfo.current"
                :page-size-options="pageInfo.pageSizeOptions"
                :total="pageInfo.total"
                show-size-changer
                :page-size="pageInfo.pageSize"
                :hideOnSinglePage='true'
                @change="currentPageChange"
                @showSizeChange="onShowSizeChange"
            >
                <template #buildOptionText="props">
                    <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
                    <span v-if="props.value === '50'">全部</span>
                </template>
            </a-pagination> -->
        </div>
        <div v-else>
            <empty/>
        </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive,toRefs ,inject,computed} from 'vue'
import request from 'src/api/index'
const http=(request as any).teacherTrain
interface mirrorListType{
  name:string,
  limit:number,
  page:number,
  withs:string,
  types:number|string,
}
interface Istate{
  typeTabs:string[],
  typeNumber:number,
  searchValue:string,
  mirrorParams:mirrorListType,
  envirListData:any[],
  choice:boolean,
}
export default defineComponent({
  name: 'setupMirror',
  props:['mirroridArr'],
  components: {
  },
  setup: (props,context) => {
    const http=(request as any).teacherTrain
    const state:Istate=reactive({
       typeTabs:['全部','KVM','Docker'],
       typeNumber:0,
       searchValue:'',
       mirrorParams:{
          name:'',
          limit:20,
          page:1,
          withs:'image,config,image.classify',
          types:'',
       },
       envirListData:[],
       choice:true,
     })
     const methods={
       selectEnvirType(index:any){
            state.typeNumber=index
            state.mirrorParams.types=index===0?'':index
            methods.mirrorList()
        },
        searchData(){
            state.mirrorParams.name=state.searchValue
            methods.mirrorList()
        },
        mirrorList(){
          http.selectMirror({param:state.mirrorParams}).then((res:any)=>{
            console.log(res)
            state.envirListData=res.data.list
          })
        },
        choiceEnvir(item:any){
            context.emit('choice-item',item)
            state.choice=false
        },
        deleteEnvir(item:any){
            context.emit('delete-item',item)
            state.choice=true
        }
     }
    onMounted(()=>{
        methods.mirrorList()
    })
    return {...toRefs(state),...methods};
  },
})
</script>

<style  lang="less">
.setupMirror{
  width: 100%;
  // margin: 30px;
  .typeBtn{
        display: flex;
        .btntype{
            height:34px;
            line-height:34px;
        }
        .btn{
            padding: 0 20px;
            height:34px;
            line-height:34px;
            border-radius: 4px;
        };
        .selectedBtn{
            color: white;
            background: @theme-color;
        }
    }
    .searchInput{
        margin-top: 20px;
        .input-search{
          width:340px;
          padding:4px 30px 4px 11px;
        }
    }
     .tableList{
        margin-top: 20px;
        .listItem:hover{
            background: #fdfaff;
            border: 1px solid @theme-color;
            border-radius: 4px;
            box-shadow: 0 3px 6px 0 rgb(187 156 214 / 40%);
            cursor: pointer;
        }
        .listItem{
            display: flex;
            padding: 10px 16px;
            border: 1px solid #eee;
            border-radius: 6px;
            display: flex;
            margin-bottom: 16px;
            justify-content: space-between;
            .name{
                width: 60%;
            }
            .tags{
                width:40%;
                color: rgba(5,1,1,.45);
            }
            .selectDelete{
                width:80px;
                text-align:center;
                color: @theme-color;
            }
        }
    }
}
</style>
