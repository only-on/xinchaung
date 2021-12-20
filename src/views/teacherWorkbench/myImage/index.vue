<template>
  <div class="my-image-tab">
    <div class="my-image-search">
      <a-input-search
        placeholder="请输入关键字查询"
        v-model:value="params.name"
        style="width: 506px"
        @keyup.enter="onSearch"
        @search="onSearch"
      />
      <a-button type="primary" @click="createImage">创建镜像</a-button>
    </div>
    <div v-if="ifTip" class="loading">
      <a-spin tip="加载中...">
        <div class="spin-content"></div>
      </a-spin>
    </div>
    <div v-else>
      <div class="my-image-box" v-if="myImageList?.length">
        <div
          class="my-image-item"
          v-for="(item, index) in myImageList"
          :key="index.toString()"
        >
          <card
            :modelValue="myImageList[index]"
            @delete-image="deleteImage"
            @copy-image="copyImage"
            @edit-image="editImage"
          />
        </div>
      </div>
      <div v-else class="empty-box">
        <empty></empty>
      </div>
    </div>
    <!-- 编辑镜像 -->
    <a-modal
      title="编辑镜像"
      width="850px"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      class="editImage"
    >
      <div>
        <a-form layout="vertical">
          <div class="row">
            <a-form-item required label="镜像名称">
              <a-input
                class="form-input"
                v-model:value="imageData.name"
              ></a-input>
            </a-form-item>
            <a-form-item required label="系统类型">
              <a-select
                class="form-input"
                v-model:value="imageData.classify_id"
                placeholder="请选择系统类型"
              >
                <a-select-option
                  :value="Number(index)"
                  v-for="(item, index) in config.image_classify"
                  :key="index.toString()"
                >
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <a-form-item required label="镜像标签">
            <a-checkbox-group v-model:value="imageData.tags" @change="change">
              <span
                v-for="(item, index) in config.tags"
                :key="index.toString()"
              >
                <a-checkbox
                  @click="changeTarget(index)"
                  :value="Number(index)"
                  >{{ item }}</a-checkbox
                >
              </span>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item label="描述">
            <a-textarea
              placeholder="镜像描述"
              v-model:value="imageData.description"
              class="ant-input-desc"
            ></a-textarea>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, ref } from "vue";
import { useRouter } from "vue-router";
import {
  getMyImageApi,
  deleteMyImageApi,
  getConfigApi,
  editMyImageApi,
} from "../api";
import { message, Modal } from "ant-design-vue";
import Empty from "src/components/Empty.vue";
import { cloneDeep } from "lodash";
import card from "./card.vue";
interface Istate {
  confirmLoading: boolean;
  visible: boolean;
  imageData: any;
  config: any;
  target: any;
  ifTip: boolean;
}
export default defineComponent({
  components: {
    card,
    Empty,
  },
  setup() {
    const router = useRouter();
    const myImageList = ref([]);
    const reactiveData: {
      params: any;
      pageCount: number;
    } = reactive({
      params: {
        name: "",
        limit: 16,
        // withs: "image,config,image.classify",
        withs: "classify,user,userProfile",
        page: 1,
      },
      pageCount: 0,
    });
    const state: Istate = reactive({
      confirmLoading: false,
      visible: false,
      imageData: {},
      config: {},
      target: "",
      ifTip: false,
    });
    function init() {
      reactiveData.params = {
        name: "",
        limit: 16,
        withs: "classify,user,userProfile",
        page: 1,
        is_init: 0,
        type: "",
      };
      getMyImage();
    }
    // 获取我的镜像列表
    function getMyImage() {
      state.ifTip = true;
      getMyImageApi(reactiveData.params).then((res) => {
        state.ifTip = false;
        myImageList.value = res?.data.list;
        reactiveData.params.page = res?.data.page.currentPage;
        reactiveData.params.limit = res?.data.page.perPage;
        reactiveData.pageCount = res?.data.page.pageCount;
      });
    }
    // 创建镜像
    function createImage() {
      router.push({ path: "/teacher/Workbench/createImage" });
    }
    // 搜索
    function onSearch() {
      getMyImage();
    }
    const methods = {
      deleteImage(id: number) {
        Modal.confirm({
          title: "确定要删除这个镜像吗？",
          content: "删除后不可恢复",
          okText: "删除",
          okType: "danger",
          cancelText: "取消",
          onOk() {
            deleteMyImageApi(id).then((res: any) => {
              if (res.code === 1) {
                message.success("删除成功！");
                init();
              } else {
                message.warning(res.msg);
              }
            });
          },
        });
      },
      copyImage() {},
      editImage(data: any) {
        state.imageData = cloneDeep(data);
        state.visible = true;
      },
      handleOk() {
        state.visible = false;
        let params: any = {
          // flavor:{
          //   cpu:state.imageData.config.cpu,
          //   disk:state.imageData.config.disk,
          //   ram:state.imageData.config.ram,
          // },
          // image:{
          //   name:state.imageData.image.name,
          //   classify_id:state.imageData.image.classify_id,
          //   is_use_gpu:state.imageData.image.is_use_gpu?1:0,
          //   description:state.imageData.image.description
          // },
          // tag:state.imageData.image.tags
          name: state.imageData.name,
          classify_id: state.imageData.classify_id,
          tag: state.imageData.tags,
          description: state.imageData.description,
          is_use_gpu: state.imageData.is_use_gpu,
          ssh_user: " ",
          ssh_pass: " ",
        };
        editMyImageApi({ id: state.imageData.id }, params).then((res: any) => {
          params = {};
          getMyImage();
        });
      },
      handleCancel() {
        state.visible = false;
      },
      getConfig() {
        getConfigApi().then((res: any) => {
          state.config = res.data;
        });
      },
      changeTarget(index: any) {
        state.target = Number(index);
      },
      change(e: any) {
        if (state.target === 1) {
          if (e.indexOf(2) !== -1 && e.indexOf(2) !== -1) {
            e.splice(e.indexOf(2), 1);
          }
        } else if (state.target === 2 && e.indexOf(1) !== -1) {
          e.splice(e.indexOf(1), 1);
        }
      },
    };
    onMounted(() => {
      init();
      methods.getConfig();
    });
    return {
      ...toRefs(reactiveData),
      ...toRefs(state),
      createImage,
      onSearch,
      ...methods,
      myImageList,
    };
  },
});
</script>

<style lang="less">
.my-image-tab {
  height: 100%;
  font-size: 14px;
  .loading {
    padding: 245px;
  }
  .spin-content {
    padding: 30px;
  }
  .my-image-search {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .my-image-box {
    flex: 1;
    padding-left: 2px;
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    .my-image-item {
      width: 24%;
      height: 150px;
      margin-top: 20px;
      margin-right: 1.3333%;
    }
    .my-image-item:nth-child(4n) {
      margin-right: 0px;
    }
  }
  .empty-box{
    padding-top: 100px;
    .emptyCon{
      color: rgba(@black,0.65);
    }
    
  }
}
.editImage {
  .row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .ant-form-item {
      width: 48%;
    }
  }
  .ant-input-desc {
    min-height: 115px;
    max-height: 136px;
  }
}
</style>
