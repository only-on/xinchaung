<template>
  <div class="in-class-forum-box scrollbar">
    <a-tabs v-model:activeKey="activeKey" @change="tabChange">
      <a-tab-pane key="1" tab="交流中心">
        <div>
          <a-input-search
            v-model:value="lookParams.title"
            placeholder="请输入搜索关键字"
            style="width: 90%; max-width: 314px"
            @search="onSearch"
          />
          <div
            class="in-class-forum-item"
            v-for="(item, index) in forumListData"
            :key="index.toString()"
          >
            <div class="forum-header">
              <span class="forum-username"
                >发帖人：{{ item["user_name"] }}</span
              >
              <span class="forum-time">{{ item["created_at"] }}</span>
              <span class="forum-reply-count"
                >回复数/查看数：{{ item?.reply_num }}/{{
                  item?.views_num
                }}</span
              >
            </div>
            <div class="forum-content-header">
              <div class="forum-content-header-left">
                <span><i class="icon-gonggao iconfont"></i>公告</span>
                {{ item.title }}
              </div>
              <div class="forum-content-header-right">
                <a-button type="ghost" size="small" @click="reply(item)"
                  >回复</a-button
                >
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
                <div class="forum-content">
                  <QuillEditor
                    v-model="item.content"
                    type="preview"
                    height="500px"
                  ></QuillEditor>
                </div>

                <section
                  class="forum-reply-item"
                  v-for="(ct, ci) in item.forum_articles"
                  :key="ci.toString()"
                >
                  <div class="forum-reply-header">
                    <span>回帖人：{{ ct.user_name }}</span>
                    <span>发帖时间：{{ ct.updated_at }}</span>
                  </div>
                  <div class="forum-reply-content-box">
                    <p class="forum-reply-content">
                      <QuillEditor
                        v-model="ct.content"
                        type="preview"
                        height="500px"
                      ></QuillEditor>
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
          <div class="in-class-forum-footer">
            <div
              class="look-more"
              @click="lookMore"
              v-if="lookParams.page < pageSum"
            >
              查看更多...
            </div>
            <div v-else class="none-more">暂无更多</div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="我的提问">
        <div class="put-question-tab">
          <span
            @click="vncScreenshot"
            class="icon-jieping iconfont screen-shot theme-active"
          ></span>

          <div>
            <div class="put-question-head">
              <label>主题：</label
              ><a-input v-model:value="forumThemeTitle"></a-input>
            </div>
            <QuillEditor
              ref="quillQuestion"
              v-model="forumThemeContent"
              v-model:rang="forumThemeContentRang"
              height="500px"
            ></QuillEditor>
            <div class="put-question-footer">
              <a-button type="primary" @click="activeKey = '1'">返回</a-button>
              <a-button type="primary" @click="questionSubmit">提交</a-button>
            </div>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
  <div>
    <a-modal
      ref="forumModal"
      class="forum-modal"
      :visible="replyVisible"
      :title="replyToUser"
      @cancel="closeReplyModal"
      @ok="replySubmit"
      width="740px"
    >
      <QuillEditor
        ref="quillRef"
        v-if="replyVisible"
        v-model="content"
        height="500px"
      ></QuillEditor>
    </a-modal>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  onMounted,
  reactive,
  toRefs,
  watch,
} from "vue";
import {
  canvasToImage,
  canvasToFile,
  imageFileToBase64,
  screenshot,
} from "src/utils/manipulatePicture";
import request from "src/request/getRequest";
import QuillEditor from "src/components/editor/quill.vue";
import { Delta } from "quill-delta";
import { context } from "ant-design-vue/lib/vc-image/src/PreviewGroup";
interface Iparams {
  title: string;
  type: string;
  pageSize: number;
  page: number;
}

interface IreactiveData {
  forumListData: Array<any>;
  content: Delta;
  forumThemeContent: Delta;
}
export default defineComponent({
  components: {
    QuillEditor,
  },
  setup() {
    const forum = request.studentForum;
    console.log(forum);
    const activeKey = ref("1");
    const quillQuestion = ref();
    const currentOpenContent: Ref<number | string> = ref(0);
    const imageUrl: Ref<string> = ref("");
    const reactiveData: IreactiveData = reactive({
      forumListData: [],
      content: {
        ops: [],
      },
      forumThemeContent: {
        ops: [],
      },
    });
    const { forumListData, content, forumThemeContent } = toRefs(reactiveData);
    const lookParams: Ref<Iparams> = ref({
      title: "",
      type: "",
      pageSize: 10,
      page: 1,
    });
    const pageSum: Ref<number> = ref(0);
    const replyToUser: Ref<string> = ref("@");
    const replyVisible: Ref<boolean> = ref(false);
    const forumThemeTitle: Ref<string> = ref("");
    const forumThemeContentRang=ref(1)
    // const content: Ref<Delta> = ref({
    //   ops: [
    //   ],
    // });
    let replyParams: any = {
      forum_id: "",
      content: "",
    };
    const forumModal = ref();
    const quillRef = ref();
    onMounted(() => {
      getPubIndex(lookParams.value);
    });

    watch(
      () => forumThemeContent.value,
      () => {
        console.log(forumThemeContent.value);
      }
    );
    watch(
      () => content.value,
      () => {
        console.log(content.value);
      }
    );

    function onSearch() {
      lookParams.value.page = 1;
      getPubIndex(lookParams.value);
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

      screenshot(novncWrap).then((canvas) => {
        let file = canvasToFile(canvas, "testname.png");
        imageFileToBase64(file).then((url: string) => {
          imageUrl.value = url;
          let htm='<img src='+url+'>'
          quillQuestion.value.insertHtml(htm)
        });
      });
    }

    // 获取论坛列表
    function getPubIndex(params: Iparams) {
      return new Promise((resolve: any, reject: any) => {
        forum
          .pubIndex({
            param: {
              title: params.title,
              type: params.type,
              pageSize: params.pageSize,
              page: params.page,
            },
          })
          .then((res: any) => {
            console.log(res);
            if (res?.status === 1) {
              if (lookParams.value.page === 1) {
                reactiveData.forumListData = res.data.list;
              } else {
                reactiveData.forumListData = reactiveData.forumListData.concat(
                  ...res.data.list
                );
              }

              pageSum.value = res.data.page.pageCount;
              lookParams.value.page = res.data.page.currentPage;
            }
          });
      });
    }

    // 查看更多
    function lookMore() {
      lookParams.value.page++;
      getPubIndex(lookParams.value);
    }
    // 回复
    function reply(val: any) {
      replyVisible.value = true;
      replyToUser.value = "@" + val.user_name;
      replyParams.forum_id = val.id;
      console.log(val);
    }
    function closeReplyModal() {
      replyParams.forum_id = "";
      replyParams.content = "";
      content.value = {
        ops: [],
      };
      (quillRef.value as any).setContents(content.value);
      replyVisible.value = false;
      replyToUser.value = "@";
    }

    function replySubmit() {
      replyParams.content = JSON.stringify(content.value);
      forum
        .editReply({ param: { ForumArticle: replyParams } })
        .then((res: any) => {
          getPubIndex(lookParams.value);
          replyVisible.value = false;
          content.value = {
            ops: [],
          };
          replyToUser.value = "@";
          (quillRef.value as any).setContents(content.value);
        });
    }

    function questionSubmit() {
      let params = {
        forum: {
          type: 1,
          title: forumThemeTitle.value,
          content: JSON.stringify(forumThemeContent.value),
        },
      };
      forum.createForum({ param: params }).then((res: any) => {
        console.log(res);
      });
      activeKey.value = "1";
    }

    function tabChange(key: string) {
      console.log(key);
      if (key === "2") {
        forumThemeContent.value.ops = [];
        quillQuestion.value.setContents(forumThemeContent.value);
        forumThemeTitle.value = "";
      }
    }
    return {
      forumModal,
      quillRef,
      activeKey,
      onSearch,
      currentOpenContent,
      openOrClose,
      vncScreenshot,
      imageUrl,
      ...toRefs(reactiveData),
      lookMore,
      pageSum,
      lookParams,
      replyToUser,
      replyVisible,
      reply,
      replySubmit,
      closeReplyModal,
      content,
      forumThemeTitle,
      questionSubmit,
      tabChange,
      quillQuestion,
      forumThemeContentRang
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
  .in-class-forum-footer {
    margin-top: 10px;
    text-align: center;
    font-size: 12px;
    .look-more {
    }
    .none-more {
      color: #d9d9d9;
    }
  }
}
.forum-modal {
  .ant-modal-footer {
    text-align: center;
  }
}
.put-question-tab {
  position: relative;
  .screen-shot {
    position: absolute;
    right: 0;
    top: -58px;
    font-size: 24px;
    color: @theme-color;
    cursor: pointer;
  }
  .put-question-head {
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
    > label {
      flex-shrink: 0;
    }
  }
  .put-question-footer {
    text-align: right;
    margin-top: 20px;
    > button {
      margin-left: 15px;
    }
  }
}
</style>