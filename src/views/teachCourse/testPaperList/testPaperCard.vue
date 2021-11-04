<template>
  <div class="test-paper-card">
    <div class="itemTop">
      <div>{{data.paper_title}}</div>
      <div class="itemTopSecond">
        <span class="icon-zhangjie iconfont">{{ data.question_count }}</span>
        <span class="icon-fenshu1 iconfont">{{ data.score }}</span>
        <span class="icon-renshu iconfont">{{ data.student_count }}</span>
      </div>
      <div>{{ data.updated_at }}</div>
    </div>
    <div class="itemBottom">
      <span><span class="item-bom-btn" @click="selectStu">选学生</span></span
      >
      <span>
        <router-link :to="{path:'/teacher/course/result',query:{paper_id:data.paper_id}}">查结果</router-link>
      </span>
      <a-popover placement="bottom">
        <template v-slot:content>
          <div class="edit">
            <p class="item-bom-btn" @click="editTest" style="cursor: default">编辑</p>
            <p class="item-bom-btn" @click="deleteTest" style="cursor: default">删除</p>
          </div>
        </template>
        <span>
          <span class="icon-gengduo iconfont"></span>
        </span>
      </a-popover>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["value"],
  emits:["selectStu","editTest","deleteTest"],
  setup(props, { emit }) {
    const data = props.value;
    // 打开选择学生modal
    function selectStu() {
        emit("selectStu",data.paper_id)
    }
    // 编辑
    function editTest() {
      emit("editTest",data.paper_id)
    }
    // 删除
    function deleteTest() {
      emit("deleteTest",data.paper_id)
    }
    return {
      data,
      selectStu,
      editTest,
      deleteTest
    };
  },
});
</script>

<style lang="less">
.card-item {
  color: hsla(0, 0%, 100%, 0.7);
  width: 24%;
  height: 190px;
  //   margin-right: 2%;
  margin-bottom: 20px;
  box-sizing: border-box;
  opacity: 1;
  background: #fff;
  border-radius: 7px;
  box-shadow: 0 2px 4px 0 rgb(164 36 167 / 14%);
}
.test-paper-card {
  .itemTop {
    height: 152px;
    background-image: url("../../../assets/testPaper/bitmap.png");
    background-size: 100% 152px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: left;
    > div {
      height: 22px;
      margin-bottom: 15px;
      &:first-child {
        font-size: 16px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      &:nth-child(2) {
        font-size: 14px;
      }
      &:nth-child(3) {
        font-size: 12px;
      }
      &.itemTopSecond {
        span {
          padding: 0 20px;
          border-right: 1px solid #fff;
          font-size: 12px;
        }
        .iconfont {
          font-size: 12px;
          &::before {
            margin-right: 5px;
          }
        }
        span:nth-child(1) {
          padding-left: 0;
        }
        span:nth-child(3) {
          border-right: none;
        }
      }
    }
  }
  .itemBottom {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      height: 14px;
      border-right: 1px solid #979797;
      line-height: 14px;
      width: 33%;
      text-align: center;
      color: rgba(5, 1, 1, 0.45);
      cursor: pointer;
      &:last-child {
        border-right: none;
      }
    }
    .item-bom-btn {
      color: rgba(5, 1, 1, 0.45);
      &:hover {
        color: @theme-color;
      }
    }
  }
}
.edit {
  .item-bom-btn {
    color: rgba(5, 1, 1, 0.45);
    margin-bottom: 8px;
    cursor: pointer;
    &:hover {
      color: @theme-color;
    }
  }
}
</style>