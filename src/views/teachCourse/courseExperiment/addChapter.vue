<template>
  <div class="add-chapter-tab">
    <a-tabs v-model:activeKey="currentKey" class="add-chapter-tabs">
      <a-tab-pane key="0" tab="内置章节" class="chapter-tabs">
        <template v-if="currentKey === '0'">
          <select-list
            v-model:value="chapterList"
            :columns="columns"
            v-model:keys="keys"
            @select="selectBtn"
          >
            <template #head>
              <div class="select-top">
                <a-input-search
                  v-model:value="params.name"
                  placeholder="请输入搜索关键字查询"
                  style="width: 350px"
                  @search="onSearch"
                />
                <a-button type="primary" @click="selectBtn('all')"
                  >选择章节</a-button
                >
                <div class="statistics-box">
                  <span
                    >已选择<i>{{ chapterCount }}</i
                    >个章节</span
                  >
                  <span
                    >包含实验共计<i>{{ contentCount }}</i
                    >个</span
                  >
                  <span>清空</span>
                </div>
              </div>
            </template>
            <template #footer>
              <a-pagination :default-current="params.page" :default-page-size="params.limit" :total="totalCount" @change="pageChange"/>
            </template>
            <template #icon>
              <span class="iconfont icon-zhangjie"></span>
            </template>
          </select-list>
          <div class="add-content-loading" v-if="isLoading">
            <LoadingOutlined />
          </div>
        </template>
      </a-tab-pane>
      <a-tab-pane key="1" tab="我的章节" force-render class="chapter-tabs">
        <template v-if="currentKey === '1'">
          <select-list
            v-model:value="chapterList"
            :columns="columns"
            v-model:keys="keys"
            @select="selectBtn"
          >
            <template #head>
              <div class="select-top">
                <a-input-search
                  v-model:value="params.name"
                  placeholder="请输入搜索关键字查询"
                  style="width: 350px"
                  @search="onSearch"
                />
                <a-button type="primary" @click="selectBtn('all')"
                  >选择章节</a-button
                >
                <div class="statistics-box">
                  <span
                    >已选择<i>{{ chapterCount }}</i
                    >个章节</span
                  >
                  <span
                    >包含实验共计<i>{{ contentCount }}</i
                    >个</span
                  >
                  <span>清空</span>
                </div>
              </div>
            </template>
            <template #footer>
              <a-pagination :default-current="params.page" :default-page-size="params.limit" :total="totalCount" @change="pageChange"/>
            </template>
            <template #icon>
              <span class="iconfont icon-zhangjie"></span>
            </template>
          </select-list>
          <div class="add-content-loading" v-if="isLoading">
            <LoadingOutlined />
          </div>
        </template>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, inject, watch } from "vue";
import selectList from "./components/selectList.vue";
import { LoadingOutlined } from "@ant-design/icons-vue";
import {
  getAllChapterListApi,
  saveChapterToCourseApi,
  saveContentToChapterApi,
} from "./api";
import { message } from "ant-design-vue";
type TreactiveData = {
  currentKey: string;
  params: {
    type: string;
    limit: number;
    page: number;
    name: string;
  };
  chapterList: any[];
  keys: number[];
  isLoading: boolean;
  chapterCount:number;
  contentCount: number;
  initChapterCount:number
  initContentCount:number
  totalCount:number
};

export default defineComponent({
  components: {
    "select-list": selectList,
    LoadingOutlined,
  },
  setup() {
    const course_id = inject("course_id") as number;
    const updateTree: any = inject("updateTree");

    const columns = {
      key: "id", // id
      name: "name", // 展示name字段
      typeName: "实验数", // 类型字段
      count: "contents_count", // 统计数量字段
      is_selected: "is_selected", // 已选中字段
      selected: "selected", // 选中字段
    };
    const reactiveData: TreactiveData = reactive({
      currentKey: "0",
      params: {
        type: "0",
        limit: 10,
        page: 1,
        name: "",
      },
      totalCount:0,
      chapterList: [],
      keys: [],
      isLoading: false,
      chapterCount: 0,
      contentCount: 0,
      initChapterCount: 0,
      initContentCount: 0,
    });
    watch(
      () => reactiveData.currentKey,
      () => {
        reactiveData.params.type = reactiveData.currentKey;
        reactiveData.params.page=1
        reactiveData.params.limit=10
        reactiveData.params.name=""
        getAllChapterList();
      },
      { deep: true, immediate: true }
    );
    watch(
      () => reactiveData.chapterList,
      () => {
        console.log(reactiveData.chapterList);
      },
      { deep: true }
    );
    watch(
      () => reactiveData.keys,
      () => {
        console.log(reactiveData.keys);
        const selectedData=filterData(reactiveData.keys)
        console.log(selectedData);
        reactiveData.chapterCount=reactiveData.initChapterCount+selectedData.chapterCount
        reactiveData.contentCount=reactiveData.initContentCount+selectedData.contentCount
      },
      { deep: true }
    );
    function getAllChapterList() {
      getAllChapterListApi(
        { ...reactiveData.params },
        { course_id: course_id }
      ).then((res: any) => {
        console.log(res);
        reactiveData.chapterList = res.data.list;
        reactiveData.totalCount=res.data.page.totalCount
        reactiveData.contentCount=0
        const selectedChapters=reactiveData.chapterList.filter((el:any)=>{
          if (el.is_selected===true) {
            reactiveData.contentCount+=el.contents_count
          }
         return el.is_selected===true
        })
        reactiveData.chapterCount=selectedChapters.length
        reactiveData.initChapterCount=reactiveData.chapterCount
        reactiveData.initContentCount=reactiveData.contentCount
        console.log(reactiveData.chapterCount);
        
      });
    }
    // 选择按钮
    function selectBtn(val: any) {
      let chapterParams: any = {
        chapter_ids: [],
        course_id: course_id,
      };
      let content_ids: any[] = [];
      if (val === "all" && reactiveData.keys.length === 0) {
        message.warn("请选择行");
        return;
      }
      if (val === "all") {
        chapterParams.chapter_ids = reactiveData.keys;
        reactiveData.chapterList.forEach((item: any) => {
          if (reactiveData.keys.includes(item.id)) {
            content_ids.push(item.content_ids);
          }
        });
      } else {
        chapterParams.chapter_ids = [val.id];
        content_ids.push(val.content_ids);
      }
      console.log(content_ids);
      reactiveData.isLoading = true;
      saveChapterToCourseApi({ ...chapterParams }).then(async (res: any) => {
        const sum = res.data.chapter_ids.length;
        let i = 0;
        while (i < sum + 1) {
          if (i < sum) {
            await saveContentToChapterApi(
              { content_ids: content_ids[i], type: 1 },
              { course_id: course_id, chapter_id: res.data.chapter_ids[i] }
            );
          } else {
            await getAllChapterList();
            reactiveData.isLoading = false;
            updateTree();
          }
          i++;
        }
        // res.data.chapter_ids.forEach((item: any, index: number) => {
        //   setTimeout(() => {
        //     saveContentToChapterApi(
        //       { content_ids: content_ids[index], type: 1 },
        //       { course_id: course_id, chapter_id: item }
        //     );
        //   }, 2000);
        // });
      });
    }
    // 搜索
    function onSearch() {}
    // 分页发生变化时
    function pageChange(page:number, pageSize:number) {
      reactiveData.params.page=page
      reactiveData.params.limit=pageSize
      getAllChapterList()
    }
    // 筛选出当前选中的项
    function filterData(keys:any[]) {
      let i=0
     return {chapterCount:reactiveData.chapterList.filter((item:any)=>{
       if (item.selected) {
         i+=item.contents_count
       }
        return item.selected&&keys.includes(item.id)
      }).length,contentCount:i}
    }
    return {
      columns,
      ...toRefs(reactiveData),
      selectBtn,
      onSearch,
      pageChange
    };
  },
});
</script>

<style lang="less">
.add-chapter-tab {
  height: 100%;
  background: @white;
  padding: 15px;
  .add-chapter-tabs {
    height: 100%;
    position: relative;
    .add-content-loading {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(204, 204, 204, 0.35);
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        font-size: 50px;
      }
    }
    > .ant-tabs-top-content {
      height: calc(100% - 58px);
      
      .select-top {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-bottom: 5px;
        .statistics-box {
          width: 100%;
          flex-shrink: 0;
          display: flex;
          flex-direction: row;
          line-height: 40px;
          background: #fdfaff;
          border: 1px solid #ebdbfa;
          border-radius: 3px;
          margin-top: 17px;
          padding: 0 20px;
          margin-bottom: 10px;
          > span {
            margin-right: 20px;
            font-size: 14px;
            > i {
              margin: 0 5px;
              font-style: normal;
              color: @theme-color;
            }
            &:last-child {
              margin-right: 0;
              margin-left: auto;
              color: @theme-color;
              cursor: pointer;
            }
          }
        }
      }
    }
    .ant-pagination{
      text-align: center;
      margin-top: 15px;
    }
  }
}
</style>
