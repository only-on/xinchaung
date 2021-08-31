<template>
  <div class="in-class-forum-box scrollbar">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="交流中心">
        <div>
          <a-input-search
            v-model:value="searchTitle"
            placeholder="请输入搜索关键字"
            style="width: 90%; max-width: 314px"
            @search="onSearch"
          />
          <div class="in-class-forum-item" v-for="(item,index) in forumListData" :key="index.toString()">
            <div class="forum-header">
              <span class="forum-username">发帖人：{{item['user_name']}}</span>
              <span class="forum-time">{{item['created_at']}}</span>
              <span class="forum-reply-count">回复数/查看数：{{item?.reply_num}}/{{item?.views_num}}</span>
            </div>
            <div class="forum-content-header">
              <div class="forum-content-header-left">
                <span><i class="icon-gonggao iconfont"></i>公告</span>
                {{item.title}}
              </div>
              <div class="forum-content-header-right">
                <a-button type="ghost" size="small">回复</a-button>
                <span @click="openOrClose(item)"
                  ><i
                    class="iconfont"
                    :class="
                      currentOpenContent === item
                        ? 'icon-zhankai2-copy'
                        : 'icon-shouqi-copy'
                    "
                  ></i
                  >{{ currentOpenContent === item ? "收起" : "展开" }}</span
                >
              </div>
            </div>
            <div
              class="forum-content-box"
              :class="currentOpenContent === item ? 'open-active' : ''"
            >
              <div class="forum-content-padding">
                <div class="forum-content" v-html="item?.content">
                  
                </div>

                <section class="forum-reply-item" v-for="(ct,ci) in item.forum_articles" :key="ci.toString()">
                  <div class="forum-reply-header">
                    <span>回帖人：{{ct.user_name}}</span>
                    <span>发帖时间：{{ct.updated_at}}</span>
                  </div>
                  <div class="forum-reply-content-box">
                    <p class="forum-reply-content" v-html="ct.content">
                      
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="我的提问">
        <div>
          <div @click="vncScreenshot">截图</div>
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref,onMounted,reactive,toRefs } from "vue";
import { canvasToImage, canvasToFile,imageFileToBase64,screenshot } from "src/utils/manipulatePicture";
import request from "src/request/getRequest"
interface Iparams{
  title:string
  type:string
  pageSize:number
  page:number
}

interface IreactiveData{
  forumListData:any
}
export default defineComponent({
  setup() {
    const forum = request.forum
    console.log(forum);
    
    const searchTitle = ref("");
    const currentOpenContent: Ref<number | string> = ref(0);
    const imageUrl: Ref<string> = ref("");
    const reactiveData:IreactiveData=reactive({forumListData:[]})
    onMounted(()=>{
      getPubIndex({title:searchTitle.value,type:"",pageSize:10,page:1})
    })
    function onSearch() {
      console.log(searchTitle.value);
    }
    function openOrClose(index: number) {
      currentOpenContent.value === index
        ? (currentOpenContent.value = "")
        : (currentOpenContent.value = index);
    }

    // 截图
    function vncScreenshot() {
      let novncWrap: HTMLCanvasElement | null = document.querySelector(
        ".novnc-wrap>div>canvas"
      );
      if (!novncWrap) return;

      screenshot(novncWrap).then((canvas)=>{
          let file= canvasToFile(canvas,'testname.png')
          imageFileToBase64(file).then((url:string)=>{
              imageUrl.value=url
          })
      });
    }

    // 获取论坛列表
    function getPubIndex(params:Iparams){
      return new Promise((resolve:any,reject:any)=>{
        forum.pubIndex({param:{title:params.title,type:params.type,pageSize:params.pageSize,page:params.page}}).then((res:any)=>{
          console.log(res);
          if (res?.status===1) {
            reactiveData.forumListData=res.data.list
          }
        })
      })
    }

    return {
      activeKey: ref("1"),
      searchTitle,
      onSearch,
      currentOpenContent,
      openOrClose,
      vncScreenshot,
      imageUrl,
      ...toRefs(reactiveData)
    };
  },
});
</script>

<style lang="less">
.in-class-forum-box {
  white-space: normal;
  padding: 10px;
  margin-right: 10px;
  text-align: justify;
  height: calc(100% - 30px);
  background: @white;
  .in-class-forum-item {
    margin-top: 25px;
    border: 1px solid #d9d9d9;
    word-break: break-all;
    .forum-header {
      background: #d9d9d9;
      padding: 0 20px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      line-height: 24px;
      > span {
        font-size: 12px;
        color: #7a7a7a;
        &:nth-child(1) {
          margin-right: auto;
        }
        &:nth-child(2) {
          //   margin-right: auto;
        }
        &:nth-child(3) {
          margin-left: auto;
        }
      }
    }
    .forum-content-header {
      padding: 0 20px;
      border-bottom: 1px solid #d9d9d9;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      line-height: 30px;
      > .forum-content-header-left {
        font-size: 14px;
        font-weight: 400;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        > span {
          color: #07b28f;
          margin-right: 6px;
          > i {
            vertical-align: bottom;
            margin-right: 2px;
          }
        }
      }
      > .forum-content-header-right {
        color: @theme-color;
        font-size: @font-size-sm;
        margin-left: 15px;
        flex-shrink: 0;
        cursor: pointer;
        > button {
          margin-right: 15px;
          font-size: @font-size-sm;
        }
        > span {
          > i {
            margin-right: 5px;
          }
        }
      }
    }
    .forum-content-box {
      height: 0px;
      overflow: hidden;
      &.open-active {
        height: auto;
      }
      > .forum-content-padding {
        padding: 10px 20px;
        > .forum-content {
          font-size: 12px;
          color: #4c4c4c;
          text-indent: 2em;
        }
        > .forum-reply-item {
          border: 1px solid #d9d9d9;
          margin-top: 17px;
          .forum-reply-header {
            padding: 2px 20px;
            background: #fcfcfc;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            font-size: 12px;
            color: #4c4c4c;
            border-bottom: 1px solid #d9d9d9;
          }
          .forum-reply-content-box {
            padding: 10px 20px 0px 20px;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>