<template>
    <div class="selectEnvir" v-layout-bg>
         <a-modal
            class="selectModal"
            title="设置环境"
            okText='提交'
            width="770px"
            :visible="envirVisible"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancel"
            >
            <div>
                <div class="typeBtn">
                    <div class="btntype">类型：</div>
                    <div :class="typeNumber===Number(index)?'btn selectedBtn':'btn'" v-for="(item,index) in typeTabs" :key="index.toString()" @click="selectEnvirType(index)">{{item}}</div>
                </div>
                <div class="searchInput">
                    <a-input-search v-model:value='searchValue' @keyup.enter="searchData" @search="searchData" style="width:340px;padding:4px 30px 4px 11px" placeholder="请输入目录名称关键字查询" />
                </div>
                <div v-if="envirListData.length" class="tableList">
                    <div class="listItem" v-for="(item,index) in envirListData"  :key="index.toString()">
                        <div class="name">{{item.image.name}}</div>
                        <div class="tags">标签：{{item.image.tag.join()}}</div>
                        <div class="selectDelete">
                            <span v-if="choice=envirIdArr.indexOf(item.id)===-1?true:false" @click="choiceEnvir(item)">选择</span>
                            <span v-else @click="deleteEnvir(item)" class="iconfont icon-shanchu-copy"></span>
                        </div>
                    </div>
                    <a-pagination
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
                    </a-pagination>
                </div>
                <div v-else>
                    <empty/>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script lang="ts">
interface envirType{
    name?:string,
    limit?:number,
    page?:number,
    withs?:any,
    types?:any,
}
interface pageInfoType{
    pageSizeOptions?:any[],
    current?:number,
    pageSize?:number,
    total?:number,
    pageCount?:number,
}
interface Istate{
    confirmLoading:boolean,
    searchValue:string,
    envirListParmas:envirType,
    envirListData:any[],
    typeTabs:any[],
    typeNumber:number,
    pageInfo:pageInfoType,
    choice:boolean,
    choicedEnvir:any[],
    envirIdArr:number[]
} 
import { defineComponent,onMounted,inject,reactive,toRefs,ref,watch, computed} from 'vue'
import request from 'src/api/index'
import Empty from 'src/components/Empty.vue'
import { message } from 'ant-design-vue';
export default defineComponent({
    name:'resources',
    props:['propTrainDetailInfo','trainId','envirVisible'],
    components:{
        Empty
    },
    setup(props,context){
    const http=(request as any).teacherTrain
    const state:Istate=reactive({
       typeTabs:['全部','windows','Linux'],
       confirmLoading:false,
       searchValue:'',
       envirListParmas:{},
       envirListData:[],
       typeNumber:0,
       pageInfo:{
           pageSizeOptions: ['10', '20', '30', '40', '50'],
       },
       choice:true,
       choicedEnvir:[],
       envirIdArr:[]
    })
    const methods={
        handleOk(){
            if(state.choice){
                context.emit('deleteOneEnivr',state.choicedEnvir)
            }else{
                context.emit('selectEnvirOk',state.choicedEnvir)
            }
        },
        handleCancel(){
            context.emit('selectEnvirCancel')
        },
        searchData(){
            state.envirListParmas.name=state.searchValue
            methods.getSelectEnvirList()
        },
        getSelectEnvirList(){
            state.envirListParmas.withs='image,config,image.classify'
            http.selectEnvirList({param:state.envirListParmas}).then((res:any)=>{
                state.envirListData=res.data.list
                state.pageInfo.total=res.data.page.totalCount
                state.pageInfo.pageSize=res.data.page.perPage
                state.pageInfo.current=res.data.page.currentPage
                state.pageInfo.pageCount=res.data.page.pageCount
            })
        },
        selectEnvirType(index:any){
            state.envirListParmas.types=index===0?'':index
            state.typeNumber=index
            methods.getSelectEnvirList()
        },
        onShowSizeChange(current:any, pageSize:any) {
            state.pageInfo.pageSize = pageSize;
            state.envirListParmas.limit=pageSize;
            methods.getSelectEnvirList()
        },
        currentPageChange(page:any, pageSize:any){
            state.envirListParmas.page=page;
            methods.getSelectEnvirList()
        },
        choiceEnvir(item:any){
            // state.choice=false
            state.envirIdArr.push(item.id)
            state.choicedEnvir=item
        },
        deleteEnvir(item:any){
            // state.choice=true
            const index=state.envirIdArr.indexOf(item.id)
            state.envirIdArr.splice(index,1)
            state.choicedEnvir=item
        }
    }
    watch(()=>props.propTrainDetailInfo,(val:any)=>{
        props.propTrainDetailInfo.server.forEach((item:any) => {
            state.envirIdArr.push(item.id)  
        });
    },{
        deep:true,
        immediate:true
    })
    onMounted(()=>{
        methods.getSelectEnvirList()
    })
    return {...toRefs(state),...methods}
    }
})
</script>
<style lang="less">
.selectModal {
    .ant-modal-body{
    min-height: 600px;
    max-height: 700px;
    }
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