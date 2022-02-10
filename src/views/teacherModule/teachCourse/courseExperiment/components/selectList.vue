<template>
  <div class="select-list">
    <slot name="head"></slot>
    <div class="list-box">
      <template v-if="dataList&&dataList.length">
      <div class="list-item" v-for="item in dataList" :key="item[columns.id]">
        <template v-if="item[columns.is_selected]">
          <a-checkbox
            class="checked-box"
            v-model:checked="item[columns.is_selected]"
            :disabled="item[columns.is_selected]"
          />
        </template>
        <template v-else>
          <a-checkbox
            class="checked-box"
            v-model:checked="item[columns.selected]"
          />
        </template>
        <span class="title-name">
          <slot name="icon" :data="item"></slot>
          {{ item[columns.name] }}
        </span>
        <span v-if="columns.typeName" class="content-count-box">
          {{ columns.typeName }}: <i>{{ item[columns.count] }}</i>
        </span>
        <span
          class="select-box"
          :class="item[columns.is_selected] ? 'active' : ''"
          @click="selectBtn(item)"
        >
          <span>选择</span>
        </span>
      </div>
      </template>
      <empty v-else></empty>
    </div>
    <slot name="footer"></slot>
  </div>
</template>


<script lang="ts">
import { CheckEvent } from "ant-design-vue/lib/tree/Tree";
import { defineComponent, watch, reactive, toRefs } from "vue";
import empty from "src/components/Empty.vue"
export default defineComponent({
  components:{
    empty
  },
  props: ["value", "columns","keys"],
  setup(props, { emit }) {
    const reactiveData = reactive({
      dataList: [],
    });
    const columns = props.columns;
    watch(
      () => props.value,
      () => {
        reactiveData.dataList = props.value;
        let keys: any[] = [];
        if (!reactiveData.dataList) return;
        reactiveData.dataList.map((item: any) => {
          if (item[columns.selected]) {
            keys.push(item[columns.key]);
          }
        });
        emit("update:keys",keys)
      },
      {
        deep: true,
        immediate: true,
      }
    );

    function checkedChange(e: CheckEvent, val: any) {
    }

    // 选择按钮
    function selectBtn(val:any) {
        emit("select",val)
    }
    return {
      ...toRefs(reactiveData),
      checkedChange,
      columns,
      selectBtn
    };
  },
});
</script>

<style lang="less">
.select-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  .list-box {
    .list-item {
      display: flex;
      flex-direction: row;
      width: 100%;
      padding: 15px;
      align-items: center;
      border: 1px solid transparent;
      transition: 0.5;
      border-radius: 4px;
      &:hover {
        border: 1px solid var(--primary-color);
        box-shadow: 0 3px 6px 0 rgb(var(--primary-color), 0.5);
      }
      .checked-box {
        flex-shrink: 0;
      }
      .title-name {
        flex: 1;
        padding-left: 15px;
        > span {
          margin-right: 5px;
          background: var(--primary-color);
          color: var(--white-100);
          border-radius: 50%;
          padding: 2px;
        }
      }
      .content-count-box {
        width: 200px;
        flex-shrink: 0;
        font-size: 12px;
        color: rgba(5, 1, 1, 0.45);
        > i {
          font-style: normal;
        }
      }
      .select-box {
        flex-shrink: 0;
        cursor: pointer;
        color: var(--primary-color);
        &.active {
          color: #d6d6d6;
          pointer-events: none;
        }
      }
    }
  }
}
</style>
