<template>
  <div class="reply-list">
    <div class="user-info">
      <div class="left">
        <img :src="list.avatar" alt="" />
        <span class="user-name">{{list.user_name}}</span>
        <span class="rep" v-if="replyUserName">回应</span>
        <span class="reply-name" v-if="replyUserName">{{replyUserName}}</span>
      </div>
      <div class="right">
        <span>{{dateFormat(list.created_at * 1000)}}</span>
      </div>
    </div>
    <div class="reply">
      <div class="reply-info" v-html="list.content"></div>
      <div class="reply-btn">
        <span class="pointer" @click="isReply = !isReply">回应</span>
        <span class="pointer view" @click="clickViewReply(list)">查看回复</span>
      </div>
      <div class="reply-box" v-if="isReply">
        <a-input v-model:value="replyContent" :placeholder="'回复 '+ list.user_name" />
        <span class="pointer" @click="submitReply(list)">回应</span>
        <!-- <a-button type="primary">回应</a-button> -->
      </div>
      <div class="reply-reply" v-if="viewReply">
        <!--  tip="Loading..." -->
        <a-spin :spinning="loading" size="large" tip="Loading...">
        <reply-list 
          v-for="item in replyList" 
          :key="item.id" 
          :list="item" 
          :replyUserName="list.user_name"
        ></reply-list>
        </a-spin>
        <!-- <reply-list></reply-list> -->
        <div class="reply-all" v-if="totalReply !== replyList.length" @click="clickLoadingMore(list)">
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
  PropType,
} from "vue";
import { IForumnList, IReplyList } from "./../forumnTyping.d";
// import ReplyList from './ReplyList.vue'
import { dateFormat } from 'src/utils/common'
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
      console.log(replyContent.value);
      let param = {
        content: replyContent.value,
        id: list.forum_id,
        reply_id: list.id
      }
      http.replyForum({param}).then((res: IBusinessResp) => {
        console.log(res)
        replyContent.value = ''
        getReplyList(list.forum_id,  list.id)
      })
    }

    // 回应内容
    let replyList = reactive<IReplyList[]>([])
    const loading = ref(false)
    const totalReply = ref(0)
    function getReplyList(id: number, pid: number) {
      loading.value = true
      let param = {
        reply_id: pid
      }
      http.getReplyList({urlParams: {id}, param}).then((res: IBusinessResp) => {
        console.log(res)
        loading.value = false
        const { data, num } = res.data
        totalReply.value = num
        data.forEach((v: IForumnList) => {
          v.user_name = v.user_name ? v.user_name : '回帖2'
          v.avatar = v.avatar ? v.avatar : 'src/assets/images/user/admin_p.png'
        })
        replyList.push(...data)
      }).catch(() => {
        let arr = [
          {"id": 1,"content": "<p>看到楼主发的，犹如醍醐灌顶~ 感谢了！</p>","user_id": 1,"level": 0,"pid": 0,"forum_id": 1,"user_name": "张三", "avatar": "/www/path/1.png","created_at": 1642744562,"updated_at": 1642744562,"deleted_at": null},
          {"id": 2,"content": "<p>testets222222222</p>","user_id": 1,"level": 0,"pid": 0,"forum_id": 1,"user_name": "sfasdf", "avatar": "/www/path/1.png","created_at": 1642744562,"updated_at": 1642744562,"deleted_at": null},
          {"id": 3,"content": "<p>testets3333333</p>","user_id": 1,"level": 0,"pid": 0,"forum_id": 1,"user_name": "asfahjg", "avatar": "/www/path/1.png","created_at": 1642744562,"updated_at": 1642744562,"deleted_at": null},
        ]
        replyList.push(...arr)
      })
    }

    // 查看回复
    const viewReply = ref(false)
    function clickViewReply(list: {id: number, forum_id: number}) {
      viewReply.value = true
      getReplyList(list.forum_id,  list.id)
    }
    // 加载更多
    const clickLoadingMore = (list: {id: number, forum_id: number}) => {
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
      display: inline-block;
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
</style>
