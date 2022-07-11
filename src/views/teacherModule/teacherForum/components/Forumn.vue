<template>
  <div class="forumn-list">
    <div class="lists" v-for="item in forumnList" :key="item.id">
      <forumn-list :item="item" @readAllText="readAllText"></forumn-list>
    </div>
  </div>
  <div class="forumn-pagination" v-if="total">
    <a-pagination
      v-if="forumnList.length&&total>10"
      show-size-changer
      :total="total"
      :current="forumSearch.page"
      :pageSize="forumSearch.pageSize"
      @change="pageChange"
      @showSizeChange="showSizeChange"
    >
      <!-- <template #itemRender="{ page, type, originalElement }">
				<a v-if="type === 'prev'">上一页</a>
				<a v-else-if="type === 'next'">下一页</a>
				<renderVNode v-else :vnode="originalElement">{{page}}</renderVNode>
			</template> -->
    </a-pagination>
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
  VNode,
  PropType,
} from "vue";
import ForumnList from "./ForumnList.vue";
import { IForumnList, IForumSearch } from "./../forumnTyping.d";
// function renderVNode(
//   _: any,
//   { attrs: { vnode } }: { attrs: { vnode: VNode } }
// ): VNode {
//   return vnode;
// }
export default defineComponent({
  name: "Forum",
  components: {
    ForumnList,
    // @ts-ignore
    // renderVNode,
  },
  props: {
    type: String,
    forumnList: {
      type: Array as PropType<IForumnList[]>,
      default: [],
    },
    total: {
      type: Number,
      default: 0
    },
    forumSearch: {
      type: Object as PropType<IForumSearch>,
      default: {}
    }
  },
  emits: ["pageChange"],
  setup: (props, { emit }) => {
    let pageInfo = reactive<IPageInfo>({
      page: 1,
      pageSize: 10,
      total: 100,
    });
    function pageChange(page: number,pageSize:number) {
      pageInfo.page = page;
      pageInfo.pageSize = pageSize;
      emit("pageChange", page,pageSize);
    }
    function showSizeChange(page:number,pageSize:number){
      pageInfo.page =1;
      pageInfo.pageSize = pageSize;
      emit("pageChange",pageInfo.page,pageInfo.pageSize);
    }
    function readAllText(i: number) {
      props.forumnList?.forEach((v, k) => {
        v.isAllText = false;
        if (i === v.id) v.isAllText = true;
      });
    }
    return {
      ...toRefs(props),
      pageChange,
      showSizeChange,
      pageInfo,
      readAllText,
    };
  },
});
interface IPageInfo {
  page: number;
  pageSize: number;
  total: number;
}
</script>

<style lang="less" scoped>
.forumn-list {
  .lists {
    margin-top: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid rgba(0,0,0,0.15);
  }
}
.forumn-pagination {
  text-align: right;
  margin: 32px 0;
}
</style>
