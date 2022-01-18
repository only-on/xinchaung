<template>
  <div class="classical__container" v-layout-bg>
    <div class="classical__card">
      <div class="classical__search-form">
        <!-- <div class="classical__search">
          <a-input
            class="classical_search-input"
            v-model:value="searchStr"
            placeholder="请输入目录名称关键字查询"
            @keypress.enter="handleSearch"
          >
            <template #prefix>
              <a-button
                type="text"
                class="classical__search-form--prefix"
                @click="handleSearch"
              >
                <span class="iconfont icon-sousuo" />
              </a-button>
            </template>
          </a-input>
        </div> -->
         <div class="searchInput">
          <a-input-search
            class="inputStyle"
            placeholder="请输入目录名称关键字查询"
            @keyup.enter="handleSearch"
            @search="handleSearch"
            v-model:value="searchStr"
          />
        </div>
        <div class="classical_op">
          <disk-usage
            :available="diskUsage.available"
            :total="diskUsage.total"
            :ratio="diskUsage.ratio"
            v-show="showDiskUsage"
            class="classical__disk-usage--container"
          ></disk-usage>
          <a-button v-show="showDiskUsage" type="primary" @click="createFolder">
            <template #icon
              ><span class="iconfont icon-tianjia"></span>&nbsp;
            </template>
            创建目录
          </a-button>
        </div>
      </div>
      <div class="data" v-if="data?.length > 0">
        <!-- :powerType='showDiskUsage?1:0' -->
        <asset-folder
          v-for="(item, key) in data"
          :key="'dataset-dir-' + key"
          :title="item.name"
          :date="item.created_at"
          :powerType='powerType'
          :size="typeof item.item_size !== 'undefined' ? item.item_size : ''"
          :count="
            (typeof item.item_count !== 'undefined' ? item.item_count : '') +
            '个'
          "
          @deleteItem='deleteItem(item.id)'
          @click="gotoContent(item.id)"
        />
      </div>
      <div class="data" v-else>
        <empty />
      </div>
      <div class="page" v-if="dataPage.total > 10">
        <a-pagination
          show-size-changer
          v-model:current="dataPage.current"
          :pageSize="dataPage.pageSize"
          :total="dataPage.total"
          @change="handlePageChange"
          @showSizeChange='showSizeChange'
        />
      </div>
    </div>
    <a-modal
      v-model:visible="createFolderVisible"
      title="创建目录"
      @ok="handleCreateFolder"
      class="classical__create"
    >
      <a-form
        :model="folderInfo"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="名称：">
          <div
            class="classical__input--count-inner"
            :class="{ 'classical__input--focused': nameFocused }"
          >
            <a-textarea
              rows="1"
              placeholder="输入名称"
              v-model:value="folderInfo.name"
              showCount
              :maxlength="30"
              class="classical__folder-desc"
              @focus="handleNameFocused"
              @blur="handleNameBlurred"
            />
          </div>
        </a-form-item>
        <a-form-item label="描述：">
          <div
            class="classical__input--count-inner"
            :class="{ 'classical__input--focused': descFocused }"
          >
            <a-textarea
              rows="4"
              placeholder="请输入描述"
              v-model:value="folderInfo.description"
              showCount
              :maxlength="500"
              class="classical__folder-desc"
              @focus="handleDescriptionFocused"
              @blur="handleDescriptionBlurred"
            />
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  inject,
  computed,
  Ref,
  onMounted,
  watch,
} from "vue";
import AssetFolder from "../../components/classical/AssetFolder.vue";
import DiskUsage from "../../components/classical/DiskUsage.vue";
import { ILayoutConfiguration } from "../../types";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import http from "../../api";
import Empty from "src/components/Empty.vue";
import { MessageApi } from "ant-design-vue/lib/message";
import messages from "src/i18n/zh_CN";
import { message } from "ant-design-vue";

export default defineComponent({
  name: "ClassicalAssetPanel",
  components: {
    AssetFolder,
    DiskUsage,
    Empty,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const searchStr = ref("");
    const createFolderVisible = ref(false);
    const nameFocused = ref(false);
    const descFocused = ref(false);
    const folderInfo = reactive({
      name: "",
      description: "",
    });
    const data = ref([]) as Ref<any[]>;
    // 分页组件数据
    const dataPage = reactive({ current: 1, pageSize: 10, total: 1 });
    // 数据集类型
    // let dataType = route.params["type"] ? route.params["type"] : 3; // 3是课件
    const dataType:any = ref(0);
    const dataIsPublic=ref();

    const powerType=ref(0);
    // console.log("[Panel] route.params: ", route.params);
    // 磁盘利用情况
    const diskUsage = reactive({ available: "0GB", total: "0GB", ratio: 0 });

    const $message: MessageApi = inject("$message")!;

    const updateNav: (config: ILayoutConfiguration) => void =
      inject("updataNav")!;
    
    function upNav(){
      updateNav({
        showNav: true,
        navPosition: "outside",
        tabs: [
          { name: "公有", componenttype: 0 },
          { name: "私有", componenttype: 1 },
        ],
        componenttype:Number((route as any).query["currentTab"]),
        showContent: false,
        navType: false,
        backOff: false,
        showPageEdit: false,
        pageEdit: () => {},
      });
    }
    const configuration: ILayoutConfiguration = inject("configuration")!;
    upNav()
    const showDiskUsage = computed(() => {
      return configuration.componenttype === 1;
    });
    const labelCol = { span: 3 };
    const wrapperCol = { span: 21 };
    const handleSearch = (e: Event) => {
      getDataSetList(1, 10, searchStr.value);
    };
    const createFolder = () => {
      createFolderVisible.value = true;
    };
    const handleCreateFolder = () => {
      if(!folderInfo.name){
        message.warning("名称不能为空！")
        return

      }
      http.classicalAsset
        .datasetFolderCreate({
          param: {
            type: dataType.value,
            name: folderInfo.name,
            description: folderInfo.description,
          },
        })
        .then((res) => {
          $message.success('创建成功！')
          folderInfo.name=''
          folderInfo.description=''
          getDataSetList();
        });
      createFolderVisible.value = false;
    };
    /**
     * 前往数据详情页面
     * @param {number} id 数据集id
     */
    const gotoContent = (id: number) => {
      // console.log(id,'前往数据')
      router.push({
        path: "/teacher/classical/list/"+dataType.value+"/content/"+id,
        query: { type: dataType.value, id: id,powerType:configuration.componenttype },
      });
    };
    const deleteItem=(id:number)=>{
        http.classicalAsset.deleteData({param:{id:id}}).then((res:any)=>{
          message.success("删除成功！")
          getDataSetList();
        })
    };
    const handleNameFocused = (e: FocusEvent) => {
      nameFocused.value = true;
    };
    const handleDescriptionFocused = (e: FocusEvent) => {
      descFocused.value = true;
    };
    const handleNameBlurred = (e: Event) => {
      nameFocused.value = false;
    };
    const handleDescriptionBlurred = (e: Event) => {
      descFocused.value = false;
    };

    // 获取数据
    const getDataSetList = (
      page: number = 1,
      pageSize: number = 10,
      name = ""
    ) => {
      http.classicalAsset
        .datasetList({
          param: {
            type:dataType.value,
            // is_public: dataIsPublic.value,
            is_public:configuration.componenttype===1?0:1,
            name: name,
            page:dataPage.current,
            pageSize:dataPage.pageSize,
          },
        })
        .then((res) => {
          // if (!res?.status) {
          //   data.value = [];
          //   $message.error("无法获取数据！");
          //   return;
          // }
          data.value = res?.data.list;

          // dataPage.current = res?.data.page.currentPage;
          // dataPage.pageSize = res?.data.page.perPage;
          dataPage.total = res?.data.page.totalCount;
        });
    };

    // 获取磁盘信息
    const getDiskInfo = () => {
      http.classicalAsset.diskInfo({}).then((res) => {
        diskUsage.available = res!.data.un_used;
        diskUsage.total = res!.data.total;
        diskUsage.ratio = parseFloat(res!.data.used_accuracy);
      });
    };

    // 处理翻页
    const handlePageChange = (page: number, pageSize: number) => {
          dataPage.current=page
      getDataSetList(page, pageSize, searchStr.value);
    };
    const showSizeChange =(page: number, pageSize: number)=>{
          dataPage.current=1
          dataPage.pageSize=pageSize
      getDataSetList(page, pageSize, searchStr.value);
    }
    watch(()=>route.params["type"],(val:any)=>{
      console.log(val,'route.params.type')
      dataType.value=val,
      searchStr.value=''
    },{
      immediate: true,
      deep:true
    })
    //  watch(()=>route.query["currentTab"],(val:any)=>{
    //   console.log(val,'route.query.currentTab')
    //   configuration.componenttype=val==1?0:1
    // },{
    //   immediate: true,
    //   deep:true
    // })
    watch(()=>dataType.value,(newVal:number)=>{
      upNav()
      // console.log(dataType.value,configuration.componenttype,'dataType.value DATATYPE')
    },{
      immediate: true,
      deep:true
    })
    watch(
      () => configuration.componenttype,
      (newVal: number) => {
      console.log(configuration.componenttype,'configuration.componenttype TAB')
      dataIsPublic.value=configuration.componenttype == 1 ? 0: 1;
      powerType.value=configuration.componenttype
        getDataSetList();      
      },{
      immediate: true,
      deep:true
    });
    onMounted(() => {
      getDiskInfo();
    });

    return {
      dataType,
      dataIsPublic,
      searchStr,
      showDiskUsage,
      powerType,
      createFolderVisible,
      folderInfo,
      labelCol,
      wrapperCol,
      nameFocused,
      descFocused,
      data,
      dataPage,
      diskUsage,
      gotoContent,
      deleteItem,
      handleSearch,
      createFolder,
      handleCreateFolder,
      handleNameFocused,
      handleDescriptionFocused,
      handleNameBlurred,
      handleDescriptionBlurred,
      handlePageChange,
      showSizeChange
    };
  },
});
</script>
<style lang="less" scoped>
.classical__container {
  margin: 0 auto;
  min-height: 750px;
  width: 1330px;
  padding: 30px;
  border-radius: var(--border-radius-default);
  background: var(--white-100);

  .classical__card {
    width: 100%;
    height: 100%;

    .ant-card-body {
      padding: 40px 50px;
    }

    .classical__disk-usage--container {
      margin-right: var(--margin-lg);
    }

    .classical__search-form {
      padding: 0px 0px var(--padding-md) 0px;
      display: flex;
      justify-content: space-between;

      .classical__search-form--prefix {
        padding: 0;
      }

      .classical_search-input {
        width: 400px;
      }

      .classical_op {
        display: flex;
        .icon-tianjia{
          font-size: 14px;
        }
      }
    }

    .data {
      min-height: 646px;
    }
    .page {
      display: flex;
      justify-content: center;
    }
  }
}

.classical__input--count-inner {
  border: 1px solid var(--gray-5);
  border-radius: var(--border-radius-default);

  :deep(.ant-input) {
    border: none;
    resize: none;
  }

  :deep(.ant-input:focus) {
    box-shadow: none;
  }

  :deep(.ant-input-textarea-show-count::after) {
    margin-bottom: 0;
    font-size: 12px;
    color:rgba(0, 0, 0, 0.25);
  }

  &:hover {
    border: 1px solid var(--purpleblue-6);
  }

  &.classical__input--focused {
    border: 1px solid var(--purpleblue-6);
    box-shadow: 0 0 0 2px var(--purpleblue-1);
  }
}
.searchInput {
  .inputStyle {
    width: 503px;
    padding: 8px 5px 8px 10px;
  }
}
</style>
