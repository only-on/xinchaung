<template>
  <h3 class="title">{{ item.title }}</h3>
  <div class="content" v-if="!item.isAllText">
    <span class="desc">{{ item.desc }}</span>
    <span class="read-btn pointer" @click="readAllText(item.id)"
      >阅读全文<i class="iconfont icon-zhankai"></i
    ></span>
  </div>
  <div class="content" v-html="item.content" v-else></div>
  <div class="user-info">
    <img :src="item.avatar" alt="" />
    <span class="user-name">{{ item.user_name }}</span>
    <span class="create-time">{{ item.createTime }}</span>
    <span class="reply-num">{{ item.views }}</span>
    <span class="reply-btn pointer" @click="isReply = !isReply">{{
      !isReply ? "回应" : "收起回应"
    }}</span>
  </div>
  <!--回应内容-->
  <div class="reply-box" v-if="isReply">
    <div class="reply-total">回应区 （522条）</div>
    <div class="reply-content">
      <reply-list :child="child"></reply-list>
      <div class="more">
        <span class="pointer">加载更多</span>
      </div>
    </div>
    <div class="comment-box">
      <a-input v-model:value="replyContent" placeholder="请写下你的评论" />
      <span class="pointer" @click="submitReply">回应</span>
    </div>
  </div>
  <div class="bottom" :style="bottomStyle" v-if="item.isAllText">
    <div class="left">
      <span>{{ item.views }}</span>
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
} from "vue";
import ReplyList from "./ReplyList.vue";
import { IForumnList } from "./../forumnTyping.d";
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
    let isReply = ref<boolean>(false);
    let child = ref<boolean>(true);
    let replyContent = ref<string>("");

    // 阅读全文
    function readAllText(i: number) {
      emit("readAllText", i);
    }
    // 回应
    function submitReply() {}

    const bottomStyle: any = inject("bottomStyle");
    return {
      ...toRefs(props),
      isReply,
      child,
      replyContent,
      readAllText,
      submitReply,
      bottomStyle,
    };
  },
});
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 8px;
}
.content {
  color: var(--black-65);
  line-height: 24px;
  .read-btn {
    color: var(--primary-color);
    margin-left: 12px;
    .iconfont {
      font-size: 14px;
      margin-left: 6px;
    }
  }
}
.user-info {
  color: var(--black-45);
  margin: 12px 0;
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
  .reply-btn {
    color: var(--primary-color);
    margin-left: 3px;
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
</style>
