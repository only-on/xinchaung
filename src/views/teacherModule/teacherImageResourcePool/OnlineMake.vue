<template>
  <div class="reference">
    <div class="addBox">
      <div class="add flexCenter">
        <span
          class="addCircular iconfont icon-tianjia"
          @click="OnlineAdd"
        ></span>
      </div>
    </div>
  </div>
  <a-spin :spinning="loading" size="large" tip="Loading...">
    <div class="flexCenter mainBox">
      <div class="imageBox" v-for="(v, k) in 5" :key="v" :class="getClass(k)">
        <div class="image">
          <div class="top flexCenter">
            <div class="left">
              <div class="tit">使用镜像</div>
              <div class="text single-ellipsis">镜像描述文字需省略</div>
              <div class="parameter flexCenter">
                <div class="item">
                  <span>内存</span>
                  <span>4GB</span>
                </div>
                <div class="item">
                  <span>CPU</span>
                  <span>2核</span>
                </div>
                <div class="item">
                  <span>硬盘</span>
                  <span>30GB</span>
                </div>
                <div class="item">
                  <span>GPU</span>
                  <span>是</span>
                </div>
              </div>
              <div class="name single-ellipsis">数据集名称</div>
              <div
                class="miaoshu single-ellipsis"
                title="数据集描述数据集描述数据集描述数据集描述数据集描述"
              >
                数据集描述数据集描述数据集描述数据集描述数据集描述
              </div>
            </div>
            <div class="right">
              <div class="time">存活倒计时</div>
              <div class="flexCenter">
                <div class="tian">999</div>
                天
              </div>
            </div>
          </div>
          <div class="caoZuo flexCenter">
            <span @click="deleteFun(v)">删除</span>
            <span @click="enterFun(v)">进入</span>
            <span @click="GenerateImage(v)">生成镜像</span>
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  computed,
  toRefs,
  watch,
  defineExpose,
  defineProps,
  createVNode,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { getWorkbenchInfoApi, deleteWorkbenchApi } from "./api";
const router = useRouter();
const route = useRoute();
const { editId } = route.query;
const http = (request as any).teacherImageResourcePool;

var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "在线镜像制作台", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});

const OnlineAdd = () => {
  router.push("/teacher/teacherImageResourcePool/createWorkbench");
};
const getClass = (k: number) => {
  let minArr = [2, 5, 8, 11];
  let rigArr = [3, 6, 9, 12];
  let str = "";
  if (minArr.includes(k + 1)) {
    str = "textMid";
  }
  if (rigArr.includes(k + 1)) {
    str = "textRig";
  }
  return str;
};
const enterFun = (val: any) => {
  let tags: any[] = val.image.tag;
  let id = val.id;
  let status = val.vm.status;
  if (status === 0) {
    message.warn("请先开启工作台，在重新进入");
    return;
  }
  getWorkbenchInfoApi({ id: id }).then((res: any) => {
    if (res?.code === 1) {
      if (tags.indexOf("Notebook") > -1) {
        const { href } = router.resolve({
          path: "/teacher/Workbench/open-jupyte",
          query: {
            id: id,
          },
        });
        window.open(href, "_blank");
      } else {
        const { href } = router.resolve({
          path: "/teacher/Workbench/open-vnc",
          query: {
            id: id,
          },
        });
        window.open(href, "_blank");
      }
    }
  });
};
const deleteFun = (val: any) => {
  Modal.confirm({
    title: "确认删除吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "删除后不可恢复",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      deleteWorkbenchApi(val.id).then((res: any) => {
        if (res.code === 1) {
          message.success("删除成功！");
          initData();
        } else {
          message.warning(res.msg);
        }
      });
    },
  });
};
const GenerateImage = (val: any) => {};

var loading: Ref<boolean> = ref(false);
var list: any = reactive([]);
const initData = () => {
  loading.value = true;
  // http.getList()
  http.getList().then((res: IBusinessResp) => {
    // list.push(...res.data);
    loading.value = false;
  });
};

onMounted(() => {
  // initData();
});
</script>
<style scoped lang="less">
.reference {
  position: fixed;
  width: 100%;
  top: 110px;
  left: 0;
  height: 50px;
  .addBox {
    width: var(--center-width);
    margin: 0 auto;
    .add {
      justify-content: end;
      .addCircular {
        margin-left: 20px;
      }
    }
  }
}
.mainBox {
  flex-wrap: wrap;
  margin-top: 1rem;
  .imageBox {
    width: 33.33%;
    margin-bottom: 1rem;
  }
  .textRig {
    display: flex;
    justify-content: end;
  }
  .textMid {
    display: flex;
    justify-content: center;
  }
  .image {
    width: 384px;
    // height: 224px;
    color: var(--white);
    .top {
      justify-content: space-between;
      padding: 1rem;
      height: 180px;
      border-radius: 14px 14px 0 0;
      background: url("src/assets/images/cover2.png") no-repeat;
      background-size: 100% 100%;
      .left {
        width: 70%;
        .tit {
          color: var(--white-65);
          font-size: 12px;
        }
        .parameter {
          margin: 14px 0 20px 0;
          flex-wrap: wrap;
          width: 80%;
          font-size: 12px;
          .item {
            color: var(--white-65);
            width: 25%;
            display: flex;
            flex-direction: column;
          }
        }
        .name {
          color: var(--white-65);
          font-size: 12px;
        }
        .miaoshu {
          width: 80%;
        }
      }
      .right {
        height: 100%;
        color: #fffa75;
        .time {
          font-size: 12px;
        }
        .tian {
          font-size: 22px;
        }
      }
    }
    .caoZuo {
      height: 44px;
      justify-content: space-around;
      color: var(--black-65);
      span {
        cursor: pointer;
      }
    }
  }
}
</style>
