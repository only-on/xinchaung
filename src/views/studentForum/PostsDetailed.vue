<template>
    <div class="header" v-layout-bg>
      <div class="title">
        <span>{{detailObj.title}}</span>
        <span>（{{detailObj.type}}）</span>
      </div>
      <a-button type="primary" @click.prevent="reply"> 回 帖 </a-button>
    </div>
    <div class="main">
        <div class="postItem item">
          <div class="topInfo">
            <div class="left">
              <span>发帖人：</span>
              <span>{{detailObj.user_name}}</span>
            </div>
            <span class="right">{{detailObj.created_at}}</span>
          </div>
          <div class="cont" v-html="detailObj.content">
          </div>
        </div>
        <!-- setScrollbar -->
        <div class="forumBody ">
            <div class="item" v-for="v in detailObj.forum_articles" :key="v.id">
              <div class="topInfo">
                <div class="left">
                  <span>回帖人：</span>
                  <span>{{v.user_name}}</span>
                </div>
                <div class="right">
                  <span >{{v.created_at}}</span>
                  <a-button type="link" v-if="v.can_delete"  @click.prevent="detale(v)"> 删除 </a-button>
                </div>
              </div>
              <div class="cont" v-html="v.content"></div>
            </div>
        </div>
    </div>
    <a-modal v-model:visible="visible" title="帖子回复" @ok="editReply" :width="745" class="postModal">
      <h4>回复内容</h4>
      <div class="text" style="height:300px;">
        <QuillEditor v-if="visible" toolbar="full" :options="options" v-model:content="ForumArticle.content"  /> 
      </div>
      <template #footer class="footer">
        <a-button @click="editReply" type="primary">提交</a-button>
      </template>
    </a-modal>
</template>

<script lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode,defineComponent,ref, onMounted,reactive ,toRefs,inject,Ref} from 'vue'
import request from '../../api/index'
import { useRouter ,useRoute } from 'vue-router';
import { IBusinessResp} from '../../typings/fetch.d';
import { Modal,message } from 'ant-design-vue';
import { QuillEditor } from "@vueup/vue-quill";
// import { Delta } from "quill-delta";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import {goHtml} from 'src/utils/common'
interface Ireply{
  forum_id:number,
  content:string
}
interface Istate{
  reply: () => void;
  initData: () => void;
  detale: (val:any) => void;
  detailObj:any;
  visible:boolean;
  options:any;
  editReply: () => void;
  ForumArticle:Ireply
}

export default defineComponent({
  name: 'PostsDetailed',
  components: {
   QuillEditor
  },
  setup: (props,{emit}) => {
    var updata=inject('updataNav') as Function
    updata({showContent:true,tabs:[],navPosition:'outside',navType:false})
    const http=(request as any).studentForum
    const route = useRoute();
    const {detailId}= route.query
    var visible:Ref<boolean>=ref(false)
    const state:Istate=reactive({
      visible:false,
      ForumArticle:{
        forum_id:Number(detailId),
        content:''
      },
     options:{
        placeholder: "输入内容...",
        theme: "snow",
      },
      reply:()=>{
        visible.value=true
      },
      editReply:()=>{
        let obj={
              ...state.ForumArticle,
              content:JSON.stringify(state.ForumArticle.content)
            }
        http.editReply({param:{ForumArticle:{...obj}}}).then((res:IBusinessResp)=>{
              state.initData()
              message.success('回复成功')
              visible.value=false
              state.ForumArticle.content=''
        })
      },
      detale:(val:any)=>{
          Modal.confirm({
            title: '确认删除吗？',
            icon: createVNode(ExclamationCircleOutlined),
            content: '删除后不可恢复',
            okText: '确认',
            cancelText: '取消',
            onOk(){
              http.delateReply({param:{id:val.id}}).then((res:IBusinessResp)=>{
                state.initData()
                message.success('删除回复成功')
              })
            }
        });
      },
      detailObj:{},
      initData:()=>{
        http.postsDetailed({param:{id:detailId}}).then((res:IBusinessResp)=>{
            // console.log(res)
            let data=res.data
            data.content=goHtml(data.content)
            if(data.forum_articles && data.forum_articles.length){
                data.forum_articles.map((v:any)=>{
                  v.content=goHtml(v.content)
                })
            }
            Object.assign(state.detailObj,data)
        })
      }
    })
    onMounted(()=>{
      state.initData()
    })
    return { ...toRefs(state),visible};
  },
})
</script>
<style scoped lang="less">
  @border-color:#d3d3d3;
  .header{
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    padding: 20px 10px 10px 10px;
    .title{
      font-size: 20px;
    }
    .ant-btn-primary{
      margin-top: 40px;
    }
  }
  .main{
    height: calc(100% - 102px);
    padding-top: 30px;
  }
  .item{
    border: @border-color solid 1px;
    min-height: 120px;
    font-size: 15px;
    .topInfo{
      display: flex;
      justify-content: space-between;
      border-bottom: @border-color solid 1px;
      padding: 0 20px;
    }
  }
  .cont{
    padding: 20px;
    word-break: break-all;
  }
  .forumBody{
    padding: 30px;
    overflow: auto;
    max-height: calc(100% - 200px);
    .item{
      margin-bottom: 15px;
    }
  }
  .postItem{
    height: 200px;
    // max-height: 200px;
    overflow-y: auto;
  }
  :deep(.ql-container){
    // text-align: center;
    height: calc(100% - 43px);
  }
  .postModal :deep(.ant-modal-footer){
    padding: 20px 16px;
  }
  .postModal :deep(.ant-modal-header){
    background-color: @theme-color;
    color: @white;
  }
  :deep(.postModal .ant-modal-header){
    background-color: @theme-color;
    color: @white;
  }
  
</style>
