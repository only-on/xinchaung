<template>
  <div class="reply-list">
    <div class="user-info">
      <div class="left">
        <img src="" alt="" />
        <span class="user-name">dnsgjhgaf</span>
        <span class="rep">回应</span>
        <span class="reply-name">skjhfaksfjh</span>
      </div>
      <div class="right">
        <span>1小时前</span>
      </div>
    </div>
    <div class="reply">
      <div class="reply-info">看到楼主发的，犹如醍醐灌顶~ 感谢了！</div>
      <div class="reply-btn">
        <span class="pointer" @click="isReply = !isReply">回应</span>
      </div>
      <div class="reply-box" v-if="isReply">
        <a-input v-model:value="replyContent" placeholder="回复 jzjzhd" />
        <span class="pointer" @click="submitReply">回应</span>
        <!-- <a-button type="primary">回应</a-button> -->
      </div>
      <div class="reply-reply" v-if="child">
        <reply-list></reply-list>
        <reply-list></reply-list>
        <div class="reply-all">
          <span class="pointer">查看全部7条回应</span>
        </div>
      </div>
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
} from "vue";
// import ReplyList from './ReplyList.vue'
export default defineComponent({
  name: "ReplyList",
  props: {
    item: {
      type: Object,
    },
    child: Boolean,
  },
  components: {
    // ReplyList
  },
  setup: (props, { emit }) => {
    let replyContent = ref<string>("");
    let isReply = ref<boolean>(false);

    function submitReply() {
      console.log(replyContent.value);
    }
    return {
      ...toRefs(props),
      replyContent,
      isReply,
      submitReply,
    };
  },
});
</script>

<style lang="less" scoped>
.reply-list {
  margin: 0 20px;
  padding-top: 16px;
  color: #656565;
  /*border-bottom: 1px solid var(--lightgray-4);*/
  &:last-child {
    padding-bottom: 16px;
  }
}
.user-info {
  display: flex;
  justify-content: space-between;
  .left {
    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: pink;
      margin-right: 6px;
    }
    .rep {
      margin: 0 16px;
      color: var(--black-25);
    }
  }
  .right {
    color: var(--black-25);
  }
}
.reply {
  padding-left: 30px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--lightgray-4);
  .reply-info {
    margin: 8px 0 12px;
    line-height: 19px;
  }
  .reply-btn {
    line-height: 19px;
    color: var(--primary-color);
  }
  .reply-box {
    display: flex;
    margin: 16px 0 8px;
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
  .reply-reply {
    background: var(--white-100);
    margin-top: 8px;
    .reply-all {
      padding: 16px 0 16px 50px;
      line-height: 19px;
      color: var(--black-65);
    }
  }
}
</style>
