<template>
  <h3 class="forum-title">
    <span class="sub">#标题#</span>
    {{ item.title }}
  </h3>
  <div class="forum-content" v-if="!item.isAllText">
    <span class="desc" v-html="item.desc"></span>
    <span>...</span>
    <span class="read-btn pointer" @click="readAllText(item.id)"
      >阅读全文<i class="iconfont icon-zhankai"></i
    ></span>
  </div>
  <div class="forum-content-all" v-else v-html="item.content"></div>
  <div class="user-info">
    <img :src="item.user.avatar || defaultAvatar" alt="" />
    <span class="user-name">{{ item.user_profile?.name }}</span>
    <span class="create-time">{{ dateFormat1(item.created_at * 1000) }}</span>
    <span class="btns">
      <span class="reply-btn pointer" @click="clickFirstReply(item.id)">{{
        !isReply ? "回应" : "收起回应"
      }}
      <!--  v-if="!isReply" -->
        <span class="reply-num">{{ item.reply_number_count }}</span>
      </span>
      <span class="delet pointer" v-if="item.is_del" @click="delet(item.id)">
        <span class="division" v-if="item.is_del"></span>删除
      </span>
    </span>
  </div>
  <!--回应内容-->
  <div class="reply-box" v-if="isReply">
    <div class="reply-total">回应区 （{{totalReply}}条）</div>
    <a-spin :spinning="loading" tip="Loading...">
    <div class="reply-content">
      <reply-list :child="child" v-for="list in replyList" :key="list.id" :list="list"></reply-list>
      <div class="more" v-if="totalReply !== replyList.length && replyList.length" @click="clickLoadingMore(item.id)">
        <span class="pointer">加载更多</span>
      </div>
    </div>
    </a-spin>
    <div class="comment-box">
      <a-input v-model:value="replyContent" placeholder="请写下你的评论" />
      <span class="pointer" @click="submitReply(item.id)">回应</span>
    </div>
  </div>
  <div class="bottom" :style="bottomStyle" v-if="item.isAllText">
    <div class="left">
      <span>{{ item.reply_number_count }}</span>
      <span class="pointer" @click="isReply = !isReply">{{
        !isReply ? "回应" : "收起回应"
      }}</span>
    </div>
    <div class="right pointer">
      <span @click="item.isAllText = false"
        >收起<i class="iconfont icon-zhankai"></i
      ></span>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  watch,
  toRefs,
  PropType,
  createVNode,
  provide,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import ReplyList from "./ReplyList.vue";
import { dateFormat1 } from 'src/utils/common'
import { IForumnList, IReplyList } from "./../forumnTyping.d";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal, message } from "ant-design-vue";
import defaultAvatar from 'src/assets/images/user/admin_p.png'
const http = (request as any).teacherForum;
export default defineComponent({
  name: "ForumnList",
  props: {
    item: {
      type: Object as PropType<IForumnList>,
      default: {},
    },
  },
  emits: ["readAllText"],
  components: {
    ReplyList,
  },
  setup: (props, { emit }) => {
    const route = useRoute();
    const router = useRouter();
    let {currentTab} = route.query
    let isReply = ref<boolean>(false);
    let child = ref<boolean>(true);
    let replyContent = ref<string>("");

    // 阅读全文
    function readAllText(i: number) {
      emit("readAllText", i);
    }
    // 回应
    function submitReply(id: number) {
      let param = {
        content: replyContent.value,
        id
      }
      http.replyForum({param}).then((res: IBusinessResp) => {
        replyContent.value = ''
        // replyList.length = 0
        getReplyList(id)
        props.item.reply_number_count ++
      })
    }

    // 回应内容
    const loading = ref(false)
    let replyList = reactive<IReplyList[]>([])
    const totalReply = ref(0)
    function getReplyList(id: number) {
      loading.value = true
      page.value === 1 ?replyList.length = 0 : ''
      let param = {
        page: page.value,
      }
      http.getReplyList({urlParams: {id}, param}).then((res: IBusinessResp) => {
        loading.value = false
        const { list, page } = res.data
        replyList.push(...list.data)
        totalReply.value = page.totalCount
      })
    }
    onMounted(() => {
      // getReplyList()
    })
    // 展开一级回复
    const clickFirstReply = (id: number) => {
      page.value = 1
      replyList.length = 0
      isReply.value = !isReply.value
      getReplyList(id)
    }

    // 删除帖子
    const deleteForum: any = inject("deleteForum")
    const delet = (id: number) => {
      deleteForum(id)
    }
    // 删除一级回复
    const deleteReply = (id: number) => {
      getReplyList(id)
    }
    provide("deleteReply", deleteReply)

    const page = ref(1)
    const clickLoadingMore = (id: number) => {
      page.value ++
      getReplyList(id)
    }

    const bottomStyle: any = inject("bottomStyle");
    return {
      ...toRefs(props),
      isReply,
      child,
      replyContent,
      readAllText,
      submitReply,
      bottomStyle,
      replyList,
      clickFirstReply,
      clickLoadingMore,
      totalReply,
      dateFormat1,
      loading,
      delet,
      deleteReply,
      defaultAvatar,
    };
  },
});
</script>

<style lang="less" scoped>
.forum-title {
  margin-bottom: 10px;
  font-size: var(--font-size-20);
  color: var(--black-100);
  font-weight: 700;
  .sub {
    color: var(--brightBtn);
    margin-right: 4px;
  }
}
.forum-content {
  color: var(--black-65);
  // line-height: 24px;
  .desc {
    word-break: break-all;
  }
  .read-btn {
    color: var(--primary-color);
    margin-left: 12px;
    white-space: nowrap;
    .iconfont {
      font-size: 14px;
      margin-left: 6px;
    }
  }
}
.forum-content-all {
  :deep(h1) {
    font-size: var(--font-size-18);
  }
  :deep(h2) {
    font-size: var(--font-size-16);
  }
}
.user-info {
  color: var(--black-45);
  // margin: 12px 0;
  margin-top: 16px;
  line-height: 32px;
  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: pink;
    margin-right: 6px;
  }
  .create-time {
    margin: 0 24px;
  }
  .btns {
    padding: 0 22px;
    background: var(--primary-3);
    color: var(--primary-color);
    height: 32px;
    display: inline-block;
    border-radius: 16px;
  }
  .reply-num {
    margin-left: 4px;
  }
  .delet {
    // margin-left: 24px;
  }
  .division {
    display: inline-block;
    width: 1px;
    height: 17px;
    background: var(--primary-color);
    margin: 0 16px;
    vertical-align: middle;
    margin-bottom: 2px;
  }
}
.reply-box {
  /*background: var(--lightgray-2);*/
  .reply-total {
    background: var(--lightgray-2);
    font-size: 16px;
    color: var(--black-65);
    padding: 12px 0 9px 20px;
    border-bottom: 1px solid var(--lightgray-4);
  }
  .reply-content {
    background: var(--lightgray-2);
    /*margin: 16px 20px;*/
    .more {
      padding: 19px 0 24px;
      text-align: center;
      span {
        display: inline-block;
        height: 34px;
        line-height: 34px;
        padding: 0 22px;
        border-radius: 18px;
        border: 1px solid var(--primary-color);
        color: var(--primary-color);
      }
    }
  }
  .comment-box {
    margin-top: 4px;
    padding: 21px 20px 23px 18px;
    background: var(--lightgray-2);
    display: flex;
    .ant-input {
      flex: 1;
      height: 34px;
      border-radius: 17px;
    }
    span {
      margin-left: 16px;
      line-height: 34px;
      padding: 0 36px;
      border-radius: 17px;
      background: var(--primary-color);
      color: var(--white-100);
    }
  }
}
.bottom {
  height: 54px;
  line-height: 54px;
  display: flex;
  justify-content: space-between;
  background: var(--white-100);
  box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.07);
  padding-left: 20px;
  padding-right: 30px;
  color: var(--black-45);
  position: fixed;
  bottom: 0;
  width: 830px;
  .right {
    color: var(--primary-color);
    margin-left: 12px;
    .iconfont {
      font-size: 14px;
      margin-left: 6px;
    }
  }
  .left {
    span:last-child {
      color: var(--primary-color);
      margin-left: 4px;
    }
  }
}
.ant-spin-nested-loading {
  min-height: 80px;
}
.forum-content-all{
  :deep(.ql-image){
    max-width: 830px;
  }
  :deep(.ql-video){
    width: 830px;
    height: 500px;
  }
}
</style>
