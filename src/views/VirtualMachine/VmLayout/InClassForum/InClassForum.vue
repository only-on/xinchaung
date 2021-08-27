<template>
  <div class="in-class-forum-box scrollbar">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="交流中心">
        <div>
          <a-input-search
            v-model:value="searchContent"
            placeholder="请输入搜索关键字"
            style="width: 90%; max-width: 314px"
            @search="onSearch"
          />
          <div class="in-class-forum-item" v-for="i in 5" :key="i">
            <div class="forum-header">
              <span class="forum-username">发帖人：张三李四</span>
              <span class="forum-time">2017-12-24 14:24:17</span>
              <span class="forum-reply-count">回复数/查看数：4/33</span>
            </div>
            <div class="forum-content-header">
              <div class="forum-content-header-left">
                <span><i class="icon-zhuangtai iconfont"></i>公告</span>
                帖子题题目题目题目帖子题题目题目题目题题目题目题目
              </div>
              <div class="forum-content-header-right">
                <a-button type="ghost" size="small">回复</a-button>
                <span @click="openOrClose(i)"
                  ><i class="iconfont icon-shouqi"></i>收起</span
                >
              </div>
            </div>
            <div
              class="forum-content-box"
              :class="currentOpenContent === i ? 'open-active' : ''"
            >
              <div class="forum-content-padding">
                <div class="forum-content">
                  帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖
                </div>

                <section class="forum-reply-item" v-for="i in 5" :key="i">
                  <div class="forum-reply-header">
                    <span>回帖人：星期四</span>
                    <span>发帖时间：2017-12-25 07:54:57</span>
                  </div>
                  <div class="forum-reply-content-box">
                    <p class="forum-reply-content">
                      回复文字回复文字回复文字回复文字回复文字回复文字回复文字回复文字回复文字回复文字回复文字回复文字回复文字回复文字
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="我的提问">
        <div></div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const searchContent = ref("");
    const currentOpenContent = ref(0);
    function onSearch() {
      console.log(searchContent.value);
    }
    function openOrClose(index: number) {
      currentOpenContent.value = index;
    }
    return {
      activeKey: ref("1"),
      searchContent,
      onSearch,
      currentOpenContent,
      openOrClose,
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