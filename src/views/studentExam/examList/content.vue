<template>
  <div class="exam-content-box">
    <div class="search-box">
      <a-radio-group default-value="a" button-style="solid">
        <a-radio-button value="a"> 全部 </a-radio-button>
        <a-radio-button value="b"> 未开始 </a-radio-button>
        <a-radio-button value="c"> 进行中 </a-radio-button>
        <a-radio-button value="d"> 已结束 </a-radio-button>
      </a-radio-group>
      <a-input-search
        placeholder="请输入考试名称关键搜索"
        size="small"
        @search="onSearch"
      />
    </div>
    <div class="exam-content-list">
      <div class="exam-content-item" v-for="i in 5" :key="i">
        <div class="exam-item-card">
          <div class="exam-card-head">
            <span class="card-item-header-title">试卷名称</span>
            <span class="card-item-header-status has-end">已结束</span>
          </div>
          <div class="exam-card-content">
            <p>日期：2021.03.08</p>
            <p>时间：12:05:00~ 12:15:00</p>
            <div class="exam-action-card">
              <router-link to="/exam/look">查看成绩</router-link>
              <span class="teacher-name"><i class="user-icon"></i>文和</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
 
</template>

<script lang="ts">
import { defineComponent,ref } from "vue";

export default defineComponent({
  setup() {
      const visible=ref<boolean>(false)
      const showModal=()=>{
          visible.value=true
      }
      const closeModal=()=>{
          visible.value=false
      }
    function onSearch() {}

    return {
      onSearch,
      visible,
      showModal,
      closeModal
    };
  },
});
</script>


<style lang="less">
.exam-content-box {
  margin-top: 24px;
  .search-box {
    display: flex;
    flex-direction: row;
    .ant-radio-group {
    }
    .ant-input-search {
      margin-left: auto;
      width: 500px;
    }
  }
  .exam-content-list {
    display: flex;
    flex-wrap: wrap;
    > div {
      width: 33.33%;
      height: 205px;
      margin-top: 24px;
      &:nth-of-type(3n + 1) {
        padding-right: 20px;
      }
      &:nth-of-type(3n + 2) {
        padding-left: 10px;
        padding-right: 10px;
      }
      &:nth-of-type(3n + 3) {
        padding-left: 20px;
      }
      > div.exam-item-card {
        background: @white;
        height: 100%;
        box-shadow: 0px 1px 7px 1px #a6a6a6;
        border-radius: @border-radius-base;
        display: flex;
        flex-direction: column;

        .exam-card-head {
          background: linear-gradient(310deg, #6c60e2, #8955b5 92%);
          border-radius: @border-radius-base @border-radius-base 0px 0px;
          /* height: 54px; */
          line-height: 44px;
          padding: 0 16px;
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
          .card-item-header-title {
            font-size: 18px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: default;
          }
          .card-item-header-status {
            font-size: 12px;
            height: 20px;
            line-height: 20px;
            border-radius: 8px;
            width: 62px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: default;
            text-align: center;
            &.has-end {
              background-color: rgba(185, 169, 199, 0.8);
              color: #e6e6e6;
            }
          }
        }
        .exam-card-content {
          flex: 1;
          padding: 24px 16px 16px 16px;
          background-image: url("../../../assets/exam/exam-img.png");
          background-repeat: no-repeat;
          background-position: 95% center;
          .exam-action-card {
            margin-top: 20px;
            >a{
                color: @theme-color;
                font-size: 14px;
                margin-left: 20px;
            }
            .teacher-name {
              margin-left: 20px;
              color: rgba(#050101,0.45);
              font-size: 14px;
              .user-icon{
                  display: inline-block;
                  background-image: url("../../../assets/exam/teacher.png");
                  background-size: 100%;
                  width: 24px;
                  height: 24px;
                  vertical-align: sub;
                  margin-right: 3px;
              }
            }
          }
        }
      }
    }
  }
}
</style>