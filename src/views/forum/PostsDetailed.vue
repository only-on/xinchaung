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
        <div class="forumBody">
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
    <a-modal v-model:visible="visible" title="帖子回复" @ok="editReply" :width="620">
      <h4>回复内容</h4>
      <a-textarea v-model:value="ForumArticle.content" placeholder="请输入回复内容" :rows="6" showCount :maxlength="100" />
      <template #footer>
        <a-button @click="editReply" type="primary">提交</a-button>
      </template>
    </a-modal>
</template>

<script lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode,defineComponent,ref, onMounted,reactive ,toRefs,inject,Ref} from 'vue'
import request from '../../api/index'
import serve from "../../request/getRequest";
import { useRouter ,useRoute } from 'vue-router';
import { IBusinessResp} from '../../typings/fetch.d';
import { Modal,message } from 'ant-design-vue';
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
  editReply: () => void;
  ForumArticle:Ireply
}

export default defineComponent({
  name: 'PostsDetailed',
  components: {
   
  },
  setup: (props,{emit}) => {
    var updata=inject('updataNav') as Function
    updata({showContent:true,tabs:[],navPosition:'outside',navType:false})
    const http=(request as any).forum
    const route = useRoute();
    const {detailId}= route.query
    var visible:Ref<boolean>=ref(false)
    var my_content="<p>wo1回复内容测试<br/></p>"
    const state:Istate=reactive({
      visible:false,
      ForumArticle:{
        forum_id:Number(detailId),
        content:''
      },
      reply:()=>{
        visible.value=true
      },
      editReply:()=>{
        http.editReply({param:{ForumArticle:{...state.ForumArticle}}}).then((res:IBusinessResp)=>{
          if(res.status===1){
            state.initData()
              message.success('回复成功')
              visible.value=false
              state.ForumArticle.content=''
            }else{
              message.warning(res.error.msg)
            }
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
                if(res.status===1){
                  state.initData()
                  message.success('删除回复成功')
                }else{
                  message.warning(res.msg)
                }
                
              })
            }
        });
      },
      initData:()=>{
        http.postsDetailed({param:{id:detailId},bindName:'detailObj'}).then((res:any)=>{
            // console.log(res.data.content)
        })
      },
      detailObj:{}
    })
    onMounted(()=>{
      serve.v(state);
      state.initData()
    })
    return { ...toRefs(state),visible,my_content};
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
</style>
