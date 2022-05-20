<template>
  <div class="forumn-top">
    <div class="top-content">
      <div class="search_input">
        <a-input-search
          v-model:value="ForumSearch.title"
          placeholder="请输入搜索关键词"
          @search="search"
        />
      </div>
      <div class="label-list">
        <classify :list="classifyList" @change="classifyChange"></classify>
        <!-- <span class="label-btn" :class="{'current': item.id === ForumSearch.type}" v-for="item in labelList" :key="item.id" @click="changeLabel(item.id)">{{item.name}}</span> -->
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
  computed,
  PropType,
} from "vue";
import { IForumSearch, ITagList } from "./../forumnTyping.d";
import classify from "src/components/classify/index.vue";
import { useRouter, useRoute } from "vue-router";
export default defineComponent({
  name: "ForumTop",
  components: {
    classify,
  },
  emits: ["search"],
  props: {
    tagList: {
      type: Array as PropType<ITagList[]>,
      default: [{name: ''}]
    }
  },
  setup: (props, { emit }) => {
    const route = useRoute();
    const router = useRouter();
    const { query, path } = route;
    const {type } = query
    let ForumSearch = reactive<IForumSearch>({
      title: "",
      type: '',
    });
    let labelList: Ref = computed(() => inject("labelList"));
    let classifyList = reactive([
      {
        title: "",
        value: props.tagList[0]?props.tagList[0].name:'',
        keyName: "label",
        // data: labelList.value,
        data: props.tagList,
      },
    ]);
    watch(props.tagList, (val) => {
      if (!val.length) return
      classifyList[0].value = type ? String(type) : val[0].name;
      ForumSearch.type = type ? String(type) : val[0].name;
      // emit("search", ForumSearch);
    })
    function search() {
      emit("search", ForumSearch);
    }
    // function changeLabel(val: number) {
    //   ForumSearch.type = val;
    //   emit("search", ForumSearch);
    // }
    const classifyChange = async (obj: any) => {
      ForumSearch.title = ''
      ForumSearch.type = obj.label;
      // console.log(query)
      let NewQuery = { type: ForumSearch.type, currentTab: query.currentTab };
      await router.replace({
        path: path,
        query: NewQuery,
      });
      emit("search", ForumSearch);
    };

    onMounted(() => {});
    return {
      ...toRefs(props),
      ForumSearch,
      search,
      labelList,
      // changeLabel,
      classifyList,
      classifyChange,
    };
  },
});
</script>

<style scoped lang="less">
.forumn-top {
  width: 100%;
  height: 70px;
  background-color: var(--lightgray-3);
  .top-content {
    width: var(--center-width);
    height: 100%;
    margin: 0 auto;
    padding: 18px 0;
    display: flex;
    .search_input {
      width: 273px;
      margin-right: 88px;
      .ant-input-search {
        height: 34px;
        border: 1px solid #e6e6e6;
        border-radius: 18px;
      }
    }
    .label-list {
      margin: 2px 0;
    }
  }
}
</style>
