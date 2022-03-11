<template>
  <div class="create-workbench-box">
    <a-form
      v-show="!AddedSuccessfully"
      ref="ruleFormDom"
      :model="reactiveData.ruleForm"
      :rules="rules"
      class="create-form"
      layout="vertical"
    >
      <div class="form-left">
        <a-form-item name="image" label="选择镜像">
          <iconInput :icon="selectIcon">
            <a-select
              v-model:value="reactiveData.ruleForm.image"
              placeholder="选择镜像"
              @change="imageChange"
            >
              <a-select-opt-group
                v-for="(val, key) in reactiveData.images"
                :key="key"
              >
                <template #label>
                  {{ key }}
                </template>
                <a-select-option v-for="v in val" :key="v.id" :value="v.id">{{
                  v.name
                }}</a-select-option>
              </a-select-opt-group>
            </a-select>
          </iconInput>
        </a-form-item>
        <div class="configs">镜像配置</div>
        <ImageConfig
          v-if="!AddedSuccessfully"
          @change="configChange"
        ></ImageConfig>
      </div>
      <div class="form-right">
        <a-form-item name="end_time" class="time-item" :extra="false">
          <template #label>
            <div class="time-label">
              <span>容器使用日期</span>
              <!-- <div class="time-check-box">
                <a-checkbox
                  v-model:checked="reactiveData.permanent"
                ></a-checkbox>
                永久有效
              </div> -->
            </div>
          </template>
          <div class="start-end-date-box">
            <a-date-picker
              v-model:value="reactiveData.ruleForm.start_time"
              disabled
            />
            <span class="and-line">~</span>
            <a-date-picker
              v-model:value="reactiveData.ruleForm.end_time"
              :allowClear="false"
              :disabled="reactiveData.permanent"
              :disabled-date="disabledDate"
            />
          </div>
        </a-form-item>
        <a-form-item name="datasets" label="数据集">
          <div class="datasets-box flexCenter">
            <a-button
              type="primary"
              @click="reactiveData.drawerVisible = true"
              :disabled="reactiveData.selectedName.length >= 3"
              class="add-data-set-btn"
            >
              选择</a-button
            >
            <labelDisplay
              :labels="reactiveData.selectedName"
              @remove="remove"
            ></labelDisplay>
          </div>
          <div class="data-set-hint">最多可选3个数据集</div>
        </a-form-item>
      </div>
      <Submit @submit="create" @cancel="cancel"></Submit>
    </a-form>
    <div v-show="AddedSuccessfully" class="ContinueAdding">
      <div class="img"></div>
      <div class="succTit">自定义镜像创建成功</div>
      <div class="text">
        该镜像已存放置镜像列表，可点击下方按钮返回查看或继续添加
      </div>
      <div class="sub">
        <a-button @click="ContinueAdding">继续添加</a-button>
        <a-button type="primary" @click="cancel">返回列表</a-button>
      </div>
    </div>
    <a-drawer
      class="select-imag-drawer"
      :closable="false"
      placement="right"
      :visible="reactiveData.drawerVisible"
      width="640"
      @close="closeDrawer"
    >
      <select-data-set
        v-model:value="reactiveData.ruleForm.datasets"
        v-model:names="reactiveData.selectedName"
      ></select-data-set>
    </a-drawer>
  </div>
</template>
<script lang="ts" setup>
import ImageConfig from "src/components/imageConfig/index.vue";
import labelDisplay from "src/components/labelDisplay/index.vue";
import Submit from "src/components/submit/index.vue";
import selectDataSet from "src/components/selectDataSet/selectDataSet.vue";
import selectIcon from "src/assets/images/screenicon/Group14.png";
import iconInput from "src/components/aiAnt/beforeIcon.vue";
import { ref, onMounted, reactive, Ref, inject, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import { getConfigApi, createWorkbenchApi } from "./api";
import moment from "moment";
const router = useRouter();
const route = useRoute();
const { editId } = route.query;
const http = (request as any).teacherImageResourcePool;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "创建容器", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const dateFormat = "YYYY-MM-DD";
var AddedSuccessfully: Ref<boolean> = ref(false);
var reactiveData: any = reactive({
  ruleForm: {
    start_time: moment(new Date(), dateFormat),
    end_time: undefined,
    cpu: 1,
    ram: 1,
    disk: 1,
    image: undefined,
    openGPU: false,
    datasets: [],
  },
  // 是否永久有效
  permanent: false,
  configs: {
    cpu: {},
    disk: {},
    ram: {},
    gpu: false,
  },
  images: {
    notebook: [],
    vnc: [],
  },
  showGPU: false,
  drawerVisible: false,
  selectedName: [], // 已经选择的数据集
  // loading: false,
});
function disabledDate(current: any) {
  return current && current < moment().endOf("day");
}
let endTimeValidator = async (rule: any, value: string) => {
  if (reactiveData.permanent) {
    return Promise.resolve();
  } else {
    if (value) {
      return Promise.resolve();
    } else {
      return Promise.reject("请选择结束时间");
    }
  }
};
// 规则验证
let rules = {
  end_time: [{ validator: endTimeValidator, trigger: "change" }],
  cpu: [{ required: true, message: "请选择cpu" }],
  ram: [{ required: true, message: "请选择内存" }],
  disk: [{ required: true, message: "请选择硬盘" }],
  image: [{ required: true, message: "请选择" }],
};
// 镜像选择发生变化时
function imageChange(val: any) {
  let currentImageTemp: any = {};
  outerloop: for (const key in reactiveData.images) {
    if (Object.prototype.hasOwnProperty.call(reactiveData.images, key)) {
      for (let i = 0; i < reactiveData.images[key].length; i++) {
        if (Number(reactiveData.images[key][i].id) === val) {
          currentImageTemp = reactiveData.images[key][i];
          break outerloop;
        }
      }
    }
  }
  // if (includes(currentImageTemp.tags, 3)) {
  //   reactiveData.showGPU = true;
  //   if (currentImageTemp.is_use_gpu === 1) {
  //     reactiveData.ruleForm.openGPU = true;
  //   } else {
  //     reactiveData.ruleForm.openGPU = false;
  //   }
  // } else {
  //   reactiveData.showGPU = false;
  //   reactiveData.ruleForm.openGPU = false;
  // }
}
const ContinueAdding = () => {
  // configs[0].value = 2;
  // configs[1].value = 1;
  // configs[2].value = 30;
  // configs[3].value = false;
  ruleFormDom.value.resetFields();
  reactiveData.selectedName = [];
  reactiveData.ruleForm.datasets = [];
  AddedSuccessfully.value = false;
};
const ruleFormDom = ref();
// 创建
function create() {
  // AddedSuccessfully.value = true;
  // return;
  ruleFormDom.value.validate().then(() => {
    let params: any = {
      flavor: {
        // ...reactiveData.configs,
        cpu:reactiveData.configs.cpu,
        disk:reactiveData.configs.disk,
        ram:reactiveData.configs.ram*1024
      },
      dataset_id :reactiveData.ruleForm.datasets,
      start_time:moment(reactiveData.ruleForm.start_time).format("yyyy-MM-DD") + " 00:00:00",
      end_time:moment(reactiveData.ruleForm.end_time).format("yyyy-MM-DD") +" 23:59:00",
      image_id:reactiveData.ruleForm.image,  //reactiveData.ruleForm.image
      use_gpu:reactiveData.configs.gpu?1:0
    };
    console.log(params)
    // reactiveData.loading = true;
    http.createWorkbenchApi({param:{...params}}).then((res: any) => {
      message.success("创建成功!");
      AddedSuccessfully.value = true;
      // reactiveData.loading = false;
      // router.go(-1);
    });
  });
}
// 关闭抽屉
function closeDrawer() {
  reactiveData.drawerVisible = false;
}
// 取消
function cancel() {
  router.go(-1);
  // router.push({
  //   path: "/teacher/teacherImageResourcePool/OnlineMake",
  //   query: {
  //     currentTab: 0,
  //   },
  // });
}
// 移除数据集
function remove(val: any, index: number) {
  let i = (reactiveData.ruleForm as any).datasets.indexOf(val.uid);
  i != -1 ? (reactiveData.ruleForm as any).datasets.splice(i, 1) : "";
  reactiveData.selectedName.splice(index, 1);
}

function getConfig() {
  http.getConfigApi().then((res: any) => {
    const { base_image, image_configs } = res.data;
    reactiveData.configs = image_configs;
    reactiveData.images = base_image;
  });
}
const configChange = (val: any) => {
  // console.log(val)
  reactiveData.configs = val;
};
onMounted(() => {
  getConfig();
});
</script>
<style scoped lang="less">
.create-workbench-box {
  width: 1000px;
  margin: 0 auto;
  input {
    border: none;
    font-size: var(--base-font-size);
    &::placeholder {
      font-size: var(--base-font-size);
    }
  }
  span {
    font-size: var(--base-font-size);
  }
  .data-set-hint {
    font-size: 12px;
    font-style: normal;
    color: var(--black-25);
    margin-top: 1rem;
  }
  .create-form {
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    min-height: 600px;
    .form-left {
      width: 50%;
      padding-right: 70px;
      .time-item {
        label.ant-form-item-required {
          width: 100%;
        }
        label[html-for="end_time"] {
          pointer-events: none;
        }
        .time-check-box {
          pointer-events: all;
        }
      }
      .time-item {
        .ant-form-item-label {
          > label {
            width: 100%;
          }
        }
      }
      .time-label {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .time-check-box {
          display: flex;
          flex-direction: row;
          flex-shrink: 0;
          color: orange;
          .ant-checkbox-wrapper {
            margin-right: 5px;
          }
        }
      }
    }
    .configs {
      margin-bottom: 1rem;
    }
    .form-right {
      width: 50%;
      padding-left: 70px;
      .add-data-set-btn {
        width: 100px;
        font-size: var(--base-font-size);
        border: 1px solid var(--primary-color);
      }
      .data-set-item {
        margin-top: 15px;
        padding: 0 10px;
        border-radius: var(--border-radius-default);
        display: flex;
        width: 100%;
        justify-content: space-between;
        border: 1px solid var(--black-15);
        background-color: var(--black-0-4);
        line-height: 32px;
        span {
          color: var(--black-65);
        }
        .icon-shanchu {
          color: var(--black-45);
          cursor: pointer;
          transition: 0.5s;
          &:hover {
            color: var(--black-85);
          }
        }
      }
    }
    .start-end-date-box {
      display: flex;
      border: 1px solid #d9d9d9;
      border-radius: var(--border-radius-default);
      height: 32px;
      .and-line {
        position: relative;
        right: 50px;
        color: #d9d9d9;
      }
      input {
        border: none;
        font-size: var(--base-font-size);
        &:focus {
          box-shadow: none;
        }
        &.ant-input-disabled {
          background: none;
        }
      }
      > .ant-calendar-picker {
        width: 50%;
        &:nth-child(1) {
          span {
            display: none;
          }
        }
      }
    }
    .datasets-box {
      .ant-btn {
        margin-right: 1rem;
      }
    }
  }
}
.select-imag-drawer {
  .ant-drawer-body {
    height: 100%;
    padding: 24px 0;
  }
}
.ContinueAdding {
  margin-top: 100px;
  div {
    width: 100%;
    margin: 0 auto;
    text-align: center;
  }
  .img {
    width: 94px;
    height: 94px;
    background: url("src/assets/images/teacherImageResourcePool/success.png")
      no-repeat;
    background-size: 100% 100%;
  }
  .succTit {
    font-size: 24px;
    color: var(--black-85);
    margin-top: 2rem;
  }
  .text {
    padding-top: 0.5rem;
    color: var(--black-45);
  }
  .sub {
    margin-top: 2rem;
    .ant-btn {
      margin: 0 1rem;
    }
  }
}
</style>
