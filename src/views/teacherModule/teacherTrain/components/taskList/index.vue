<template>
  <div class="taskList">
    <div class="listItem" v-for="(item, index) in contentList" :key="index.toString()">
      <span class="name">
        <span class="number">{{ Number(index) + 1 }}</span>
        <span>{{ item.name }}</span>
      </span>
      <span class="status">状态：{{ item.steps[0].state === 1 ? "显示" : "隐藏" }}</span>
      <span class="points-box"
        >知识点：{{ item.steps[0].knowledge_id.knowledge_name }}
        <span class="more-icon" :title="item.steps[0].knowledge_id.knowledge_name">
          <div></div>
          <div></div>
          <div></div>
        </span>
      </span>
      <span class="delete" @click="deleteTask(index)">
        <span v-if="!edit" class="iconfont icon-shanchu-copy"></span>
      </span>
      <a-modal title="删除提示" :visible="visible" @ok="handleOk" @cancel="handleCancel">
        <p>任务删除后无法恢复，确认删除吗？</p>
      </a-modal>
    </div>
  </div>
</template>
<script lang="ts">
interface Istate {
  visible: boolean;
  deleteIndex?: number;
}
import { defineComponent, onMounted, inject, reactive, toRefs, ref, watch } from "vue";
export default defineComponent({
  name: "taskList",
  props: ["contentList", "edit"],
  setup(props, context) {
    const state: Istate = reactive({
      visible: false,
    });
    const methods = {
      deleteTask(index: any) {
        state.visible = true;
        state.deleteIndex = index;
      },
      handleOk() {
        state.visible = false;
        context.emit("deleteItemIndex", state.deleteIndex);
      },
      handleCancel() {
        state.visible = false;
      },
    };
    onMounted(() => {
      console.log(props.contentList);
    }),
      watch(
        () => {
          return props.contentList;
        },
        (val: any) => {
          console.log(props.contentList, "props.contentList");
        }
      );
    return { ...toRefs(state), ...methods };
  },
});
</script>
<style lang="less">
.taskList {
  width: 100%;
  margin: 0 auto;
  .listItem {
    width: 100%;
    padding: 20px;
    box-shadow: 0 0 5px #ccc;
    margin-bottom: 15px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    // justify-content:space-between;
    align-items: center;
    .name {
      width: 40%;
    }
    .status {
      width: 20%;
    }
    .points-box {
      width: 35%;
      display: flex;
      justify-content: space-between;
    }
    .number {
      display: inline-block;
      text-align: center;
      color: #fff;
      border-radius: 50%;
      width: 30px;
      line-height: 30px;
      height: 30px;
      margin-right: 5px;
      background: var(--primary-color);
    }
    .iconfont {
      color: var(--primary-color);
      size: 24px;
    }
    .more-icon {
      border-radius: 20px;
      width: 40px;
      height: 15px;
      line-height: 15px;
      // background: #f2e5ff;
      text-align: right;
      div {
        border-radius: 50px;
        background: var(--primary-color);
        width: 5px;
        height: 5px;
        display: inline-block;
        margin: 2px 4px;
        cursor: pointer;
      }
      &:hover{
        background-color:var(--primary-1);
      }
    }
    .delete {
      width: 5%;
      text-align: right;
    }
  }
}
</style>
