<template>
  <div class="reply-list">
    <div class="user-info">
      <div class="left">
        <img :src="list.avatar" alt="" />
        <span class="user-name">{{list.user.username}}</span>
        <span class="rep" v-if="replyUserName">回应</span>
        <span class="reply-name" v-if="replyUserName">{{replyUserName}}</span>
      </div>
      <div class="right">
        <span>{{getTimer(list.created_at * 1000)}}</span>
      </div>
    </div>
    <div class="reply">
      <div class="reply-info" v-html="list.content"></div>
      <div class="reply-btn" v-if="!list.pid">
        <span class="pointer" @click="isReply = !isReply">回应</span>
        <span 
          class="pointer view" 
          @click="clickViewReply(list)" 
          v-if="!list.pid"
          :class="{'no': !list.second_reply_number_count}"
        >
          <span class="reply-num" v-if="!viewReply">{{list.second_reply_number_count}}</span>
           {{!viewReply ? '查看回应' : '收起回应'}}
        </span>
      </div>
      <div class="reply-box" v-if="isReply">
        <a-input v-model:value="replyContent" :placeholder="'回复 '+ list.user.username" />
        <span class="pointer" @click="submitReply(list)">回应</span>
        <!-- <a-button type="primary">回应</a-button> -->
      </div>
      <a-spin :spinning="loading" tip="Loading...">
      <div class="reply-reply" v-if="viewReply">
        <!--  tip="Loading..." size="large" -->
        <reply-list 
          v-for="item in replyList" 
          :key="item.id" 
          :list="item" 
          :replyUserName="list.user.username"
        ></reply-list>
        <!-- <reply-list></reply-list> -->
        <div class="reply-all" v-if="totalReply !== replyList.length && replyList.length" @click="clickLoadingMore(list)">
          <span class="pointer">加载更多回应</span>
        </div>
      </div>
      </a-spin>
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
import { IForumnList, IReplyList } from "./../forumnTyping.d";
// import ReplyList from './ReplyList.vue'
import { dateFormat, getTimer } from 'src/utils/common'
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
const http = (request as any).teacherForum;
export default defineComponent({
  name: "ReplyList",
  props: {
    item: {
      type: Object,
    },
    child: Boolean,
    list: {
      type: Object as PropType<IReplyList>,
      default: {},
    },
    replyUserName: {
      type: String,
      default: ''
    }
  },
  components: {
    // ReplyList
  },
  setup: (props, { emit }) => {
    let replyContent = ref<string>("");
    let isReply = ref<boolean>(false);

    function submitReply(list: {id: number, forum_id: number}) {
      let param = {
        content: replyContent.value,
        id: list.forum_id,
        pid: list.id
      }
      http.replyForum({param}).then((res: IBusinessResp) => {
        isReply.value = false
        replyContent.value = ''
        replyList.length = 0
        page.value = 1
        getReplyList(list.forum_id,  list.id)
        props.list.second_reply_number_count ++
      })
    }

    // 回应内容
    let replyList = reactive<IReplyList[]>([])
    const page = ref(1)
    const loading = ref(false)
    const totalReply = ref(0)
    function getReplyList(id: number, pid: number) {
      loading.value = true
      let param = {
        page: page.value,
        pid
      }
      http.getReplyList({urlParams: {id}, param}).then((res: IBusinessResp) => {
        loading.value = false
        const { list, page } = res.data
        totalReply.value = page.totalCount
        list.data.forEach((v: IReplyList) => {
          v.avatar = v.avatar ? v.avatar : 'src/assets/images/user/admin_p.png'
        })
        replyList.push(...list.data)
      })
    }

    // 查看回复
    const viewReply = ref(false)
    function clickViewReply(list: IReplyList) {
      if (!list.second_reply_number_count) return
      viewReply.value = !viewReply.value
      replyList.length = 0
      page.value = 1
      viewReply.value ? getReplyList(list.forum_id,  list.id) : ''
    }
    // 加载更多
    const clickLoadingMore = (list: {id: number, forum_id: number}) => {
      page.value ++
      getReplyList(list.forum_id,  list.id)
    }
    onMounted(() => {
      // getReplyList()
    })
    return {
      ...toRefs(props),
      replyContent,
      isReply,
      submitReply,
      replyList,
      viewReply,
      clickViewReply,
      loading,
      dateFormat,
      getTimer,
      totalReply,
      clickLoadingMore,
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
  &:hover {
    .reply-btn .view {
      // display: inline-block;
    }
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
    .view {
      margin-left: 16px;
      // display: none;
      &.no {
        color: var(--black-45);
        cursor: default;
      }
    }
    .reply-num {
      color: var(--black-45);
    }
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
.ant-spin-nested-loading {
  min-height: 80px;
}
</style>
