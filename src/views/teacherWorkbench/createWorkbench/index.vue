<template>
  <div v-layout-bg class="create-workbench-box">
    <a-form
      ref="ruleFormDom"
      :model="ruleForm"
      :rules="rules"
      class="create-form"
      layout="vertical"
    >
      <div class="form-left">
        <a-form-item has-feedback name="end_time" class="time-item">
          <template #label>
            <div class="time-label">
              <span>容器使用日期</span>
              <div class="time-check-box">
                <a-checkbox v-model:checked="permanent"></a-checkbox>
                永久有效
              </div>
            </div>
          </template>
          <div class="start-end-date-box">
            <a-date-picker v-model:value="ruleForm.start_time" disabled />
            <span class="and-line">~</span>
            <a-date-picker
              v-model:value="ruleForm.end_time"
              :allowClear="false"
              :disabled="permanent"
              :disabled-date="disabledDate"
            />
          </div>
        </a-form-item>
        <div>参数设置</div>
        <a-form-item name="cpu" label="CPU">
          <a-radio-group v-model:value="ruleForm.cpu" button-style="solid">
            <a-radio-button
              v-for="(it, key) in configs.cpu"
              :key="key"
              :value="key"
              >{{ it }}核</a-radio-button
            >
          </a-radio-group>
        </a-form-item>
        <a-form-item name="ram" label="内存">
          <a-radio-group v-model:value="ruleForm.ram" button-style="solid">
            <a-radio-button
              v-for="(it, key) in configs.ram"
              :key="key"
              :value="key"
              >{{ it }}</a-radio-button
            >
          </a-radio-group>
        </a-form-item>
        <a-form-item name="disk" label="硬盘">
          <a-radio-group v-model:value="ruleForm.disk" button-style="solid">
            <a-radio-button
              v-for="(it, key) in configs.disk"
              :key="key"
              :value="key"
              >{{ it }}</a-radio-button
            >
          </a-radio-group>
        </a-form-item>
        <div>
          <label v-if="showGPU">
            <a-checkbox v-model:checked="ruleForm.openGPU">启动GPU</a-checkbox>
          </label>
        </div>
      </div>
      <div class="form-right">
        <a-form-item name="image" label="选择镜像">
          <a-select
            v-model:value="ruleForm.image"
            placeholder="选择镜像"
            @change="iamgeChange"
          >
            <a-select-opt-group v-for="(val, key) in images" :key="key">
              <template #label>
                {{ key }}
              </template>
              <a-select-option v-for="v in val" :key="v.id" :value="v.id">{{
                v.name
              }}</a-select-option>
            </a-select-opt-group>
          </a-select>
        </a-form-item>
        <a-form-item name="datasets" label="选择数据集">
          <a-button
            @click="addDataset"
            v-if="selectedName.length < 3"
            class="add-data-set-btn"
            ><span class="icon-tianjia iconfont"></span
          ></a-button>
          <div
            class="data-set-item"
            v-for="(it, ind) in selectedName"
            :key="it"
            :value="it"
          >
            <span>{{ it.name }}</span>
            <span @click="remove(it, ind)" class="iconfont icon-shanchu"></span>
          </div>
        </a-form-item>
      </div>
      <div class="form-bottom">
        <a-button @click="cancel">取消</a-button>
        <a-button type="primary" @click="create">创建</a-button>
      </div>
    </a-form>
    <a-drawer
      class="select-imag-drawer"
      :closable="false"
      placement="right"
      :visible="drawerVisible"
      @close="closeDrawer"
      width="640"
    >
      <select-data-set
        v-model:value="ruleForm.datasets"
        v-model:name="selectedName"
      ></select-data-set>
    </a-drawer>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  watch,
  Ref,
  ref,
  inject,
  reactive,
  toRefs,
  onMounted,
} from "vue";
import moment from "moment";
import { getConfigApi, createWorkbenchApi } from "../api";
import { includes } from "lodash";
import selectDataSet from "src/components/selectDataSet/selectDataSet.vue";
import { RuleObject } from "ant-design-vue/es/form/interface";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
export default defineComponent({
  components: {
    "select-data-set": selectDataSet,
  },
  setup() {
    const router = useRouter();
    const dateFormat = "YYYY-MM-DD";
    var updata = inject("updataNav") as Function;
    updata({
      tabs: false,
      navPosition: "outside",
      navType: false,
      showContent: true,
      componenttype: undefined,
      showNav: true,
      backOff: false,
      showPageEdit: false,
    });
    let endTimeValidator = async (rule: RuleObject, value: string) => {
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
    const reactiveData:{
      ruleForm:any,
      permanent:boolean,
      configs:any,
      images: any,
      showGPU: boolean,
      drawerVisible: boolean,
      selectedName: any[], 
    } = reactive({
      // form数据
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
      },
      images: {
        notebook: [],
        vnc: [],
      },
      showGPU: false,
      drawerVisible: false,
      selectedName: [], // 已经选择的数据集
    });
    const ruleFormDom = ref();
    // 禁止选择的时间
    function disabledDate(current: any) {
      return current && current < moment().endOf("day");
    }
    onMounted(() => {
      init();
    });

    watch(
      () => reactiveData.ruleForm.datasets,
      () => {
        console.log(11111);
      },
      { deep: true }
    );
    function init() {
      getConfig().then(() => {
        const { cpu, disk, ram } = reactiveData.configs || {};
        console.log(cpu);
        let cpuKeys: any[] = Object.keys(cpu);
        let ramKeys: any[] = Object.keys(ram);
        let diskKeys: any[] = Object.keys(disk);
        for (let i = 0; i < cpuKeys.length; i++) {
          if (i === 0) {
            reactiveData.ruleForm.cpu = cpuKeys[i];
            continue;
          }
        }

        for (let i = 0; i < ramKeys.length; i++) {
          if (i === 0) {
            reactiveData.ruleForm.ram = ramKeys[i];
            continue;
          }
        }

        for (let i = 0; i < diskKeys.length; i++) {
          if (i === 0) {
            reactiveData.ruleForm.disk = diskKeys[i];
            continue;
          }
        }
      });
    }
    function getConfig() {
      return new Promise((resolve: any, reject: any) => {
        getConfigApi().then((res: any) => {
          const { base_image, image_configs } = res.data;
          reactiveData.configs = image_configs;
          reactiveData.images = base_image;
          resolve();
        });
      });
    }

    // 镜像选择发生变化时
    function iamgeChange(val: any) {
      console.log(val);
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
      console.log(currentImageTemp.tags);
      if (includes(currentImageTemp.tags, 3)) {
        reactiveData.showGPU = true;
        if (currentImageTemp.is_use_gpu === 1) {
          reactiveData.ruleForm.openGPU = true;
        } else {
          reactiveData.ruleForm.openGPU = false;
        }
      } else {
        reactiveData.showGPU = false;
        reactiveData.ruleForm.openGPU = false;
      }
    }

    // 打开选择数据集抽屉
    function addDataset() {
      reactiveData.drawerVisible = true;
    }

    // 关闭抽屉
    function closeDrawer() {
      reactiveData.drawerVisible = false;
    }
    // 创建
    function create() {
      ruleFormDom.value.validate().then(() => {
        console.log(reactiveData.ruleForm);
        let params: any = {
          flavor: {},
        };
        params.dataset_id = reactiveData.ruleForm.datasets;
        if (reactiveData.permanent) {
          params.is_permanent = 1;
          params.start_time = null;
          params.end_time = null;
        } else {
          params.start_time =
            moment(reactiveData.ruleForm.start_time).format("yyyy-MM-DD") +
            " 00:00:00";
          params.end_time =
            moment(reactiveData.ruleForm.end_time).format("yyyy-MM-DD") +
            " 23:59:00";
        }
        if (reactiveData.showGPU) {
          params.use_gpu = reactiveData.ruleForm.openGPU ? 1 : 0;
        } else {
          params.use_gpu = 0;
        }

        params.image_id = reactiveData.ruleForm.image;
        params.flavor.cpu = Number(reactiveData.ruleForm.cpu);
        params.flavor.ram = Number(reactiveData.ruleForm.ram);
        params.flavor.disk = Number(reactiveData.ruleForm.disk);

        createWorkbenchApi(params).then((res: any) => {
          console.log(res);
          message.success("创建成功!");
          router.push({
            path: "/teacher/Workbench",
            query: {
              currentTab: 0,
            },
          });
        });
      });
    }

    // 移除数据集
    function remove(val: any, index: number) {
      let i = (reactiveData.ruleForm as any).datasets.indexOf(val.uid);
      i != -1 ? (reactiveData.ruleForm as any).datasets.splice(i, 1) : "";
      reactiveData.selectedName.splice(index, 1);
    }

    // 取消
    function cancel() {
      router.push({
        path: "/teacher/Workbench",
        query: {
          currentTab: 0,
        },
      });
    }
    return {
      ...toRefs(reactiveData),
      dateFormat,
      rules,
      moment,
      ruleFormDom,
      disabledDate,
      iamgeChange,
      addDataset,
      closeDrawer,
      create,
      remove,
      cancel,
    };
  },
});
</script>

<style lang="less">
.create-workbench-box {
  width: 1000px;
  margin: 0 auto;
  height: 100%;
  .create-form {
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    .form-left {
      width: 50%;
      padding-right: 40px;
      .time-item {
        label.ant-form-item-required {
          width: 100%;
        }
        .start-end-date-box {
          display: flex;
          border: 1px solid #d9d9d9;
          .and-line {
            position: relative;
            right: 50px;
            color: #d9d9d9;
          }
          input {
            border: none;
            &:focus {
              box-shadow: none;
            }
            &.ant-input-disabled {
              background: none;
            }
          }
          > .ant-calendar-picker {
            &:nth-child(1) {
              span {
                display: none;
              }
            }
          }
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
    .form-right {
      width: 50%;
      padding-left: 20px;
      .add-data-set-btn {
        width: 100px;
        font-size: 14px;
        border: 1px solid @theme-color;
      }
      .data-set-item {
        margin-top: 15px;
        padding: 0 10px;
        border-radius: 4px;
        display: flex;
        width: 100%;
        justify-content: space-between;
        border: 1px solid #d9d9d9;
        color: #d9d9d9;

        .icon-shanchu {
          color: #000000;
          cursor: pointer;
        }
      }
    }
    .form-bottom {
      width: 100%;
      margin-top: auto;
      text-align: center;
      > button {
        margin-right: 40px;
      }
    }
  }
}
.select-imag-drawer {
  .ant-drawer-body {
    height: 100%;
  }
}
</style>
