<template>
  <div class="dateSetList">
    <div class="search fixCenter" v-if="showSearch">
      <div class="left">
        <a-radio-group v-model:value="search.category" button-style="solid">
          <a-radio-button :value="v.uid" v-for="v in option" :key="v.name">{{
            v.name
          }}</a-radio-button>
        </a-radio-group>
      </div>
      <div class="right fix">
        <div class="search-box">
          <a-input-search  enter-button
            v-model:value="search.keyword"
            placeholder="请输入搜索关键字查询"
            @search="searchData"
          />
        </div>
        <a-button v-if="showNewly" type="primary" @click="create"
          >新建数据集</a-button
        >
      </div>
    </div>
    <a-spin :spinning="loading" size="large" tip="Loading...">
      <div class="data-set-content setScrollbar">
        <div class="card-item" v-for="(item, index) in dataList" :key="index">
          <div class="card-box">
            <div class="card-content">
              <div class="card-look">
                <div class="img"><img :src="item.cover" alt="" /></div>
                <div class="base-info-box">
                  <h2>{{ item.name }}</h2>
                  <div>
                    <div class="system-box" v-if="role === 2">
                      <div>
                        <i>{{ FunChinaToPy(item.creator) }}</i>
                        <span>{{ item.creator }}</span>
                      </div>
                    </div>
                    <div class="size-box">
                      <div>
                        <i class="iconfont icon-wenjianjia"></i>
                        <span>{{ item.amount }}</span>
                      </div>
                      <div>
                        <i class="iconfont icon-cunchuzhi"></i>
                        <span>{{ item.size }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-detail">
                <div @click.stop="dataSetDetail(item)">
                  <div class="">
                    <h2>{{ item.name }}</h2>
                    <div class="data-set-detail-box" :title="item.description">
                      {{ item.description }}
                    </div>
                    <div class="tags-box">
                      <span class="iconfont icon-biaoqian"></span>
                      <span v-if="!item.labels.length" class="notYet"
                        >暂无标签！</span
                      >
                      <div class="labelsBox">
                        <span v-for="c in item.labels" :key="c.name">
                          {{ c.name }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="action-box">
                    <span
                      class="iconfont icon-shanchu"
                      @click.stop="openDeletePop(item)"
                      v-if="
                        (role === 2 && item.role === '3') ||
                        role === 1 ||
                        ((role === 3 || role === 5) && currentTab === 1)
                      "
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="emptyBox" v-if="!loading">
          <Empty
            v-if="dataList.length === 0"
            :type="emptyType"
            :text="emptyText"
            :height="400"
          />
          <a-button v-if="showCreate" type="primary" @click="create"
            >创建数据集</a-button
          >
        </div>
        <a-pagination
          v-if="totalCount > search.per_page"
          v-model:current="search.page"
          :pageSize="search.per_page"
          :total="totalCount"
          @change="pageChange"
        />
      </div>
    </a-spin>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  toRefs,
  watch,
  inject,
  Ref,
  computed,
  createVNode,
} from "vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { useRouter, useRoute } from "vue-router";
import { Modal, message } from "ant-design-vue";
import extStorage from "src/utils/extStorage";
import chinaToPy from "src/utils/py";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
const http = (request as any).dataSet;
interface ISearch {
  category: string;
  page: number;
  per_page: number;
  keyword: string;
  common: number | undefined;
  user_id: number;
  label: string;
}
export default defineComponent({
  name: "",
  components: {},
  setup: (props, context) => {
    const router = useRouter();
    const route = useRoute();
    const { lStorage } = extStorage;
    const role = lStorage.get("role");
    const uid = lStorage.get("uid");
    var showSearch: Ref<boolean> = ref(false);
    var currentTab: Ref<number> = ref(0);
    var totalCount: Ref<number> = ref(0);
    var configuration: any = inject("configuration");
    var emptyType: Ref<string> = ref("empty"); // searchEmpty
    // var emptyText:Ref<string>=ref('暂无数据集')

    var loading: Ref<boolean> = ref(false);
    var search: ISearch = reactive({
      category: "",
      page: 1,
      per_page: 12,
      keyword: "",
      common: 1,
      user_id: uid,
      label: "",
    });
    var showNewly = computed(() => {
      let show: boolean = false;
      if (
        role === 1 ||
        ((role === 3 || role === 5) && currentTab.value === 1)
      ) {
        show = true;
      }
      return show;
    });
    var showCreate = computed(() => {
      var show: boolean = false;
      let empty = !dataList.length && showSearch.value === false ? true : false;
      if (empty && showNewly.value === true) {
        show = true;
      }
      return show;
    });
    var emptyText = computed(() => {
      let Type: string =
        !dataList.length && (search.category || search.keyword)
          ? "search"
          : "empty";
      let str: string = "";
      if (role === 1) {
        str = Type !== "empty" ? "未搜到符合条件的数据" : "您还未创建数据集";
        str += `${
          search.category === "" && search.keyword === ""
            ? "，快点击下方按钮创建吧！"
            : ""
        }`;
      } else if (role === 3 || role === 5) {
        if (Type !== "empty") {
          str = "未搜到符合条件的数据";
        } else {
          str = currentTab.value === 1 ? "您还未创建数据集" : "暂无数据集";
        }
        str += `${
          currentTab.value === 1 &&
          search.category === "" &&
          search.keyword === ""
            ? "，快点击下方按钮创建吧！"
            : ""
        }`;
      } else if (role === 2) {
        str = Type !== "empty" ? "未搜到符合条件的数据" : "暂无数据集";
      }
      // str += `${currentTab.value ===1 && search.category==='' && search.keyword==='' ? '，快点击下方按钮创建吧！' : ''}`
      return str;
    });
    var option: any[] = reactive([]);
    var dataList: any[] = reactive([]);
    function create() {
      router.push({
        path: "/dataSet/Create",
        // query: { id: item.uid, common: item.common, user_id: item.creator },
      });
    }
    function categoryList() {
      option.length = 0;
      http.categoryList().then((res: IBusinessResp) => {
        option.push(...res.data);
        option.unshift({ uid: "", name: "全部" });
        // console.log(option)
      });
    }
    function searchData() {
      search.page = 1;
      init();
    }
    function init() {
      // console.log(search)
      dataList.length = 0;
      loading.value = true;
      let promise: any = null;
      if (role === 2) {
        promise = http.dataSetAll({ param: { ...search } });
      } else {
        promise = http.dataSets({ param: { ...search } });
      }
      promise.then((res: any) => {
        if (res) {
          loading.value = false;
          let data = res.data;
          const env = process.env.NODE_ENV === "development" ? true : false;
          data.map((v: any) => {
            if (!env && v.cover.indexOf("/public/img/default/") !== -1) {
              // let str:string=v.cover
              let str = v.cover.replace(
                "/public/img/default/",
                "/frontend/img/default/"
              );
              v.cover = str;
              console.log(v.cover);
            }
          });
          dataList.push(...data);
          totalCount.value = res.total;
          // console.log(dataList)
          emptyType.value =
            !dataList.length && (search.category || search.keyword)
              ? "searchEmpty"
              : "empty";
          showSearch.value =
            !dataList.length && search.keyword === "" && search.category === ""
              ? false
              : true;
        }
      });
    }
    function pageChange(current: any) {
      // console.log(current)
      search.page = current;
      init();
    }
    watch(
      () => {
        return configuration.componenttype;
      },
      (val) => {
        // console.log(val)
        currentTab.value = val;
        search.common = val === 1 ? 0 : 1;
        search.page = 1;
        search.category = "";
      }
    );
    watch(
      () => {
        return search.common;
      },
      (val) => {
        // console.log(val)
        init();
      }
    );
    watch(
      () => {
        return search.category;
      },
      (val) => {
        // console.log(val)
        search.page = 1;
        init();
      }
    );
    function FunChinaToPy(name: string) {
      return chinaToPy.chineseToPinYin(name).substring(0, 1);
    }
    function dataSetDetail(item: any) {
      // console.log(item)
      router.push({
        path: "/dataSet/DataSetDetail",
        query: {
          data_id: item.uid,
          common: item.common,
          user_id: item.creator,
        },
      });
    }
    function openDeletePop(item: any) {
      Modal.confirm({
        title: "确定要删除这个数据集吗？",
        icon: createVNode(ExclamationCircleOutlined),
        content: "删除后不可恢复",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          let deleteParam = `data_id=${item.uid}&data_name=${item.name}`;
          http
            .deleteDataSet({ urlParams: { deleteParam: deleteParam } })
            .then((res: IBusinessResp) => {
              message.success("删除成功");
              init();
            });
        },
      });
    }
    function categoryChange(val: any) {
      console.log(val);
    }
    onMounted(() => {
      const { currentTab } = route.query;
      search.common = Number(currentTab) === 1 ? 0 : 1;
      categoryList();
      init();
      init();
    });
    return {
      loading,
      search,
      option,
      init,
      create,
      showSearch,
      searchData,
      showCreate,
      showNewly,
      dataList,
      role,
      currentTab,
      totalCount,
      emptyType,
      emptyText,
      FunChinaToPy,
      dataSetDetail,
      openDeletePop,
      pageChange,
      categoryChange,
    };
  },
});
</script>
<style scoped lang="less">
.fix {
  display: flex;
  align-items: center;
}
.fixCenter {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dateSetList {
  height: 100%;
  overflow: hidden;
  .search {
    .right {
      .search-box {
        width: 340px;
      }
      .ant-btn {
        margin-left: 16px;
      }
    }
  }
  .data-set-content {
    min-height: 200px;
    display: flex;
    flex-wrap: wrap;
    .card-item {
      height: 323px;
      margin-bottom: 20px;
      width: 25%;
      .card-box {
        height: 100%;
        cursor: pointer;

        .card-content {
          background: #ffffff;
          height: 100%;
          position: relative;
          .card-look {
            height: 100%;
            padding: 20px;
            display: flex;
            flex-direction: column;
            border-radius: 5px;
            box-shadow: 0px 3px 6px 0px var(--black-0-7);
            box-sizing: border-box;

            > div:nth-child(1) {
              height: 220px;

              > img {
                width: 100%;
                height: 100%;
              }
            }

            .base-info-box {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              height: 64px;

              h2 {
                margin-top: 10px;
                color: #404040;
                font-size: 16px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }

              > div {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                > div {
                  // width: 0%;
                  span {
                    color: #808080;
                    font-size: 12px;
                  }
                }

                > div:nth-child(2) {
                  width: 60%;
                }

                .system-box {
                  i {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: var(--primary-color);
                    display: inline-block;
                    line-height: 18px;
                    text-align: center;
                    color: #ffffff;
                    margin-right: 10px;
                  }
                }

                .size-box {
                  text-align: left;
                  > div {
                    display: inline-block;
                    i {
                      color: #ffaf47;
                    }
                  }

                  > div:nth-child(1) {
                    margin-right: 30px;
                    i {
                      width: 18px;
                      height: 14px;
                      display: inline-block;
                      margin-right: 10px;
                    }

                    span {
                      vertical-align: middle;
                    }
                  }

                  > div:nth-child(2) {
                    i {
                      width: 16px;
                      height: 16px;
                      display: inline-block;
                      margin-right: 10px;
                    }

                    span {
                      vertical-align: middle;
                    }
                  }
                }
              }
            }
          }

          .card-detail {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            padding: 20px;
            transition: 0.5s;
            transform: rotateY(90deg);

            > div {
              width: 100%;
              height: 100%;
              background: linear-gradient(
                131deg,
                var(--primary-color) 3%,
                #6b43f1 90%
              );
              padding: 44px 24px 24px 24px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;

              > div {
                > h2 {
                  text-align: left;
                  color: #ffffff;
                  font-size: 18px;
                  margin-bottom: 14px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }

                > div.data-set-detail-box {
                  color: rgba(255, 255, 255, 0.8);
                  font-size: 14px;
                  line-height: 24px;
                  text-align: left;
                  word-wrap: break-word;
                  text-justify: inter-ideograph;
                  height: 70px;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  display: -webkit-box;
                  -webkit-line-clamp: 3;
                  -webkit-box-orient: vertical;
                }

                > .tags-box {
                  margin-top: 14px;
                  display: flex;
                  height: 71px;
                  // flex-wrap: wrap;
                  // justify-content: space-between;
                  span {
                    color: #e1cfff;
                    font-size: 12px;
                    line-height: 18px;
                    padding: 5px;
                    &.more-point {
                      border: 1px solid var(--primary-color);
                      padding: 0 7px;
                      display: inline-block;
                      line-height: 12px;
                      border-radius: 11px;
                      font-size: 26px;
                      vertical-align: sub;
                      margin-left: 5px;
                      transition: 0.5s;
                      height: min-content;
                      margin: auto 0;
                      background: #ffffff;
                      color: var(--primary-color);
                      position: relative;

                      .more-tag-box {
                        position: absolute;
                        background: #ffffff;
                        top: 26px;
                        right: -22px;
                        width: max-content;
                        display: flex;
                        flex-direction: column;
                        // flex-wrap: wrap;
                        display: none;
                        border-radius: 6px;
                        box-shadow: 0px 3px 6px 0px var(--black-0-7);
                        z-index: 111;
                        flex-shrink: 1;
                        cursor: default;
                        padding: 14px 12px;
                        > span {
                          width: max-content;
                          background: #f7f7f7;
                          // margin: 12px;
                          padding: 0;
                          color: #808080;
                          border-radius: 12px;
                          font-size: 12px;
                        }
                      }

                      &:hover {
                        .more-tag-box {
                          display: flex;
                        }
                        background: var(--primary-color);
                        color: #ffffff;
                        border: 1px solid transparent;
                      }
                    }
                  }
                  .iconbiaoqian {
                    font-size: 14px;
                    color: #f7f7f7;
                  }
                  .notYet {
                    color: rgba(255, 255, 255, 0.25);
                    flex: 1;
                  }
                  .labelsBox {
                    display: flex;
                    flex-wrap: wrap;
                    padding-top: 5px;
                    span {
                      padding: 0;
                      padding-bottom: 4px;
                      padding-right: 10px;
                      color: #e1cfff;
                    }
                  }
                }
              }

              > .action-box {
                text-align: right;

                button {
                  width: 28px;
                  height: 28px;
                  background: transparent;
                  border-radius: 50%;
                  text-align: center;
                  line-height: 28px;
                  border: none;
                }
                span {
                  color: #ffffff;
                  font-size: 18px;
                  background-color: #6b43f1;
                  padding: 4px;
                  border-radius: 50%;
                }
                span:hover {
                  background-color: #f7f7f7;
                  color: #6b43f1;
                  // padding: 4px;
                  // border-radius: 50%;
                }
              }
            }
          }
        }
        .card-content:hover .card-look {
          box-shadow: 0px 0px 11px -4px var(--black-0-7);
        }
      }

      .card-box:hover {
        .card-detail {
          transform: rotateY(0deg);
          transition: 0.5s;
        }
      }
    }
  }
}
.ant-pagination {
  width: 100%;
  text-align: center;
  margin-top: 20px;
}
.emptyBox {
  width: 100%;
  text-align: center;
}
</style>
