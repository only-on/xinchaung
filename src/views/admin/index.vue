<template>
  <div v-layout-bg class="admin-home-wrap setScrollbar">
    <div class="a-h-top">
      <div class="a-card-item">
        <div class="a-card-left">
          <span class="a-card-title">课程数</span>
          <span>
            <b class="num">{{ statisticsData.course_num }}</b>
            <i class="unit"> / 门</i>
          </span>
        </div>
        <div class="a-card-right">
          <img class="img" :src="img1" alt="" srcset="" />
        </div>
      </div>
      <div class="a-card-item">
        <div class="a-card-left">
          <span class="a-card-title">实验数</span>
          <span>
            <b class="num">{{ statisticsData.content_num }}</b>
            <i class="unit"> / 个</i>
          </span>
        </div>
        <div class="a-card-right">
          <img class="img" :src="img2" alt="" srcset="" />
        </div>
      </div>
      <div class="a-card-item">
        <div class="a-card-left">
          <span class="a-card-title">实训数</span>
          <span>
            <b class="num">{{ statisticsData.train_num }}</b>
            <i class="unit"> / 个</i>
          </span>
        </div>
        <div class="a-card-right">
          <img class="img" :src="img3" alt="" srcset="" />
        </div>
      </div>
      <div class="a-card-item">
        <div class="a-card-left">
          <span class="a-card-title">教师数</span>
          <span>
            <b class="num">{{ statisticsData.teacher_num }}</b>
            <i class="unit"> / 位</i>
          </span>
        </div>
        <div class="a-card-right">
          <img class="img" :src="img4" alt="" srcset="" />
        </div>
      </div>
      <div class="a-card-item">
        <div class="a-card-left">
          <span class="a-card-title">学生数</span>
          <span>
            <b class="num">{{ statisticsData.student_num }}</b>
            <i class="unit"> / 位</i>
          </span>
        </div>
        <div class="a-card-right">
          <img class="img" :src="img5" alt="" srcset="" />
        </div>
      </div>
    </div>
    <div class="flex-line m-t-20">
      <div class="w-3 bg-white m-l-20 p-22 div-h">
        <canvas-title title="在线 / 离线人数比例"></canvas-title>
        <div class="canvas-wrap">
          <div class="legend">
            <span class="on-line">在线人数</span>
            <span class="off-line">离线人数</span>
          </div>
          <div class="canvas-el" ref="peopleEL"></div>
        </div>
        <div class="flex-line f-j-c">
          <div class="w-3 statistics-item">
            <div>系统在线人数</div>
            <div>
              <span>{{ statisticsData.online_num }}</span>
              <i> / 人</i>
            </div>
          </div>
          <div class="w-3 statistics-item">
            <div>系统离线人数</div>
            <div>
              <span>{{ statisticsData.offline_num }}</span>
              <i> / 人</i>
            </div>
          </div>
          <div class="w-3 statistics-item">
            <div>系统总人数</div>
            <div>
              <span>{{ statisticsData.user_num }}</span>
              <i> / 人</i>
            </div>
          </div>
        </div>
      </div>
      <div class="w-7 bg-white p-22">
        <div class="flex-line">
          <canvas-title title="控制节点资源状态" />
          <a-select
            class="ip-select"
            v-model:value="currentControlsIp"
            v-if="statisticsData.node_ip_list"
          >
            <a-select-option
              v-for="item in statisticsData.node_ip_list.controls"
              :key="item"
              >{{ item }}</a-select-option
            >
          </a-select>
        </div>
        <div class="flex-line">
          <div class="w-3">
            <div class="ip-title">CPU({{ nodeIp.controls.cpu_cores }}core)</div>
            <div class="ip-canvas controls-h" ref="controlsCpuEl"></div>
          </div>
          <div class="w-3">
            <div class="ip-title">
              内存({{ nodeIp.controls.mem_used }}/{{
                nodeIp.controls.mem_total
              }}G)
            </div>
            <div class="ip-canvas m-30 controls-h" ref="controlsMemoryEl"></div>
          </div>
          <div class="w-4">
            <div class="ip-title">硬盘使用率</div>
            <div class="disk-use-status-wrap">
              <div class="disk-use-item">
                <div class="use-base">
                  <span>系统（root)</span>
                  <span
                    >{{ nodeIp.controls.root_disk_used }}/{{
                      nodeIp.controls.root_disk_gb
                    }}G</span
                  >
                </div>
                <div class="disk-use-bg root-bg">
                  <div
                    class="disk-use-num"
                    :style="{
                      width:
                        (nodeIp.controls.root_disk_used /
                          nodeIp.controls.root_disk_gb) *
                          100 +
                        '%',
                    }"
                  ></div>
                </div>
              </div>
              <div class="disk-use-item">
                <div class="use-base">
                  <span>数据（录屏、课件等存放目录）</span>
                  <span
                    >{{ nodeIp.controls.www_disk_used }}/{{
                      nodeIp.controls.www_disk_gb
                    }}G</span
                  >
                </div>
                <div class="disk-use-bg data-bg">
                  <div
                    class="disk-use-num"
                    :style="{
                      width:
                        (nodeIp.controls.www_disk_used /
                          nodeIp.controls.www_disk_gb) *
                          100 +
                        '%',
                    }"
                  ></div>
                </div>
              </div>
              <div class="disk-use-item">
                <div class="use-base">
                  <span>openstack(镜像)</span>
                  <span
                    >{{ nodeIp.controls.kolla_disk_used }}/{{
                      nodeIp.controls.kolla_disk_gb
                    }}G</span
                  >
                </div>
                <div class="disk-use-bg openstack-bg">
                  <div
                    class="disk-use-num"
                    :style="{
                      width:
                        (nodeIp.controls.kolla_disk_used /
                          nodeIp.controls.kolla_disk_gb) *
                          100 +
                        '%',
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-line m-t-20">
      <div class="w-3 bg-white m-l-20 p-22 div-h">
        <canvas-title title="镜像统计"></canvas-title>
        <div class="canvas-wrap">
          <div class="legend">
            <span class="teacher-image">教师镜像</span>
            <span class="init-image">基础镜像</span>
          </div>
          <div class="canvas-el" ref="imageEL"></div>
        </div>
        <div class="flex-line f-j-c">
          <div class="w-3 statistics-item">
            <div>基础镜像</div>
            <div>
              <span>{{ statisticsData.online_num }}</span>
              <i> / 人</i>
            </div>
          </div>
          <div class="w-3 statistics-item">
            <div>教师镜像</div>
            <div>
              <span>{{ statisticsData.offline_num }}</span>
              <i> / 人</i>
            </div>
          </div>
          <div class="w-3 statistics-item">
            <div>镜像总数</div>
            <div>
              <span>{{ statisticsData.user_num }}</span>
              <i> / 人</i>
            </div>
          </div>
        </div>
      </div>
      <div class="w-7 bg-white p-22">
        <div class="flex-line">
          <canvas-title title="计算节点资源状态" />
          <a-select
            class="ip-select"
            v-model:value="currentComputesIp"
            v-if="statisticsData.node_ip_list"
          >
            <a-select-option
              v-for="item in statisticsData.node_ip_list.computes"
              :key="item"
              >{{ item }}</a-select-option
            >
          </a-select>
        </div>
        <div class="flex-line">
          <div class="w-33">
            <div class="ip-title">CPU({{ nodeIp.computes.cpu_cores }}core)</div>
            <div class="ip-canvas computes-h" ref="computesCpuEl"></div>
          </div>
          <div class="w-33">
            <div class="ip-title">
              内存({{ nodeIp.computes.mem_used }}/{{
                nodeIp.computes.mem_total
              }}G)
            </div>
            <div class="ip-canvas m-30 computes-h" ref="computesMemoryEl"></div>
          </div>
          <div class="w-33">
            <div class="ip-title">
              GPU{{
                currentGpu.memory
                  ? (currentGpu.memory_usage / 1024).toFixed(1) +
                    "/" +
                    (currentGpu.memory / 1024).toFixed(1) +
                    "G"
                  : "0"
              }}<a-select v-model:value="currentGpuId" style="width: 80px">
                <a-select-option
                  v-for="(item, index) in gpuSelectData"
                  :key="item.id"
                  >GPU{{ index + 1 }}</a-select-option
                >
              </a-select>
            </div>
            <div class="ip-canvas m-30 computes-h" ref="computesGpuEl"></div>
          </div>
        </div>
        <div class="flex-line compute-progress">
          <div>磁盘使用率</div>
          <div>
            <span
              >系统(root){{
                nodeIp.computes.root_disk_used +
                "/" +
                nodeIp.computes.root_disk_gb
              }}G</span
            >
            <div class="disk-use-bg root-bg">
              <div
                class="disk-use-num"
                :style="{
                  width:
                  !isNaN((nodeIp.computes.root_disk_used /
                      nodeIp.computes.root_disk_gb) *
                      100)?
                    (nodeIp.computes.root_disk_used /
                      nodeIp.computes.root_disk_gb) *
                      100 +
                    '%':'0%',
                }"
              ></div>
            </div>
          </div>
          <div>
            <span
              >openstack(镜像){{
                nodeIp.computes.kolla_disk_used +
                "/" +
                nodeIp.computes.kolla_disk_gb +
                "G"
              }}</span
            >
            <div class="disk-use-bg openstack-bg">
              <div
                class="disk-use-num"
                :style="{
                  width:
                    (nodeIp.computes.kolla_disk_used /
                      nodeIp.computes.kolla_disk_gb) *
                      100 +
                    '%',
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-line row-3">
      <div
        class="line-item"
        v-for="(val, key) in nodeGraphAllData.master"
        :key="key.toString()"
      >
        <line-cnvas :data="val" type="master" :ip="key" />
        <!-- <charts-line :data="val"></charts-line> -->
      </div>
      <div
        class="line-item"
        v-for="(val, key) in nodeGraphAllData.slave"
        :key="key.toString()"
      >
        <line-cnvas :data="val" type="slave" :ip="key" />
        <!-- <charts-line :data="val"></charts-line> -->
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  h,
  ref,
  Ref,
  watch,
  inject
} from "vue";
import {
  getStatisticsApi,
  getNodeIpControlApi,
  getGpuInfoApi,
  getNodeGraphAllApi,
} from "./api";
import img1 from "src/assets/images/admin/home/env1.png";
import img2 from "src/assets/images/admin/home/env-task.png";
import img3 from "src/assets/images/admin/home/env2.png";
import img4 from "src/assets/images/admin/home/env3.png";
import img5 from "src/assets/images/admin/home/env4.png";
import { pieCanvas, gaugeCanvas } from "./canvas";
import { theme, image } from "src/utils/theme";
import lineCanvas from "./lineCanvas.vue";
const canvasTitle = (props: any, context: any) => {
  return h("div", { class: ["canvas-title"] }, props.title);
};

type TreactiveData = {
  statisticsData: any;
  currentControlsIp: "";
  currentComputesIp: "";
  currentGpuId: "";
  nodeIp: {
    controls: any;
    computes: any;
  };
  gpuSelectData: any[];
  currentGpu: any;
  nodeGraphAllData: {
    master: any;
    slave: any;
  };
};
export default defineComponent({
  components: {
    "canvas-title": canvasTitle,
    "line-cnvas": lineCanvas,
  },
  setup() {
    const peopleEL: Ref<HTMLElement> = ref(null) as any;
    const imageEL: Ref<HTMLElement> = ref(null) as any;
    const controlsCpuEl: Ref<HTMLElement> = ref(null) as any;
    const controlsMemoryEl: Ref<HTMLElement> = ref(null) as any;
    const computesCpuEl: Ref<HTMLElement> = ref(null) as any;
    const computesMemoryEl: Ref<HTMLElement> = ref(null) as any;
    const computesGpuEl: Ref<HTMLElement> = ref(null) as any;
    var updata=inject('updataNav') as Function
    const tabRef=ref(null)
    updata({tabs:[],navPosition:'outside',navType:false,showContent:false,componenttype:undefined,showNav:false,backOff:false,showPageEdit:false})

    const reactiveData: TreactiveData = reactive({
      statisticsData: {},
      currentControlsIp: "",
      currentComputesIp: "",
      currentGpuId: "",
      nodeIp: {
        controls: {},
        computes: {},
      },
      gpuSelectData: [],
      currentGpu: {},
      nodeGraphAllData: {
        master: {},
        slave: {},
      },
    });
    const imgs = { img1, img2, img3, img4, img5 };
    const gauge: {
      controlsCpu: any;
      controlsMemory: any;
      computesCpu: any;
      computesMemory: any;
      computesGpu: any;
    } = {
      controlsCpu: null,
      controlsMemory: null,
      computesCpu: null,
      computesMemory: null,
      computesGpu: null,
    };
    watch(
      () => reactiveData.currentControlsIp,
      async () => {
        await method.getNodeIpControl(
          reactiveData.currentControlsIp,
          "controls"
        );
        gauge.controlsCpu = gaugeCanvas(
          "使用率",
          (reactiveData.nodeIp as any).controls.cpu_use_rate,
          theme.themeColor,
          controlsCpuEl.value
        );
        gauge.controlsMemory = gaugeCanvas(
          "使用率",
          (reactiveData.nodeIp as any).controls.cpu_use_rate,
          theme.orangeColor,
          controlsMemoryEl.value
        );
      }
    );

    watch(
      () => reactiveData.currentComputesIp,
      async () => {
        setTimeout(async () => {
          if (gauge.computesCpu) {
            gauge.computesCpu.dispose();
          }
          if (gauge.computesMemory) {
            gauge.computesMemory.dispose();
          }
          await method.getNodeIpControl(
            reactiveData.currentComputesIp,
            "computes"
          );
          gauge.computesCpu = gaugeCanvas(
            "使用率",
            (reactiveData.nodeIp as any).computes.cpu_use_rate,
            theme.themeColor,
            computesCpuEl.value
          );
          gauge.computesMemory = gaugeCanvas(
            "使用率",
            (reactiveData.nodeIp as any).computes.mem_used_rate,
            theme.orangeColor,
            computesMemoryEl.value
          );
        }, 1000);
      }
    );
    watch(
      () => reactiveData.currentGpuId,
      async () => {
        if (gauge.computesGpu) {
          gauge.computesGpu.dispose();
        }
        reactiveData.gpuSelectData.forEach((item: any, index: number) => {
          if (item.id === reactiveData.currentGpuId) {
            reactiveData.currentGpu = item;
            gauge.computesGpu = gaugeCanvas(
              "使用率",
              Number(item.gpu_utilization).toFixed(1),
              theme.blueColor,
              computesGpuEl.value
            );
          }
        });
      }
    );
    const method = {
      getStatistics() {
        return new Promise((resolve: any, reject: any) => {
          getStatisticsApi().then((res: any) => {
            reactiveData.statisticsData = res.data;
            reactiveData.currentControlsIp = (
              reactiveData.statisticsData as any
            ).node_ip_list.controls[0];
            reactiveData.currentComputesIp = (
              reactiveData.statisticsData as any
            ).node_ip_list.computes[0];
            resolve();
          });
        });
      },
      getNodeIpControl(ip: string, type: string) {
        return new Promise((reslove: any, reject: any) => {
          getNodeIpControlApi(ip).then((res: any) => {
            reactiveData.nodeIp[type] = res.data;
            reslove();
          });
        });
      },
      getGpuInfo() {
        return new Promise((resolve: any, reject: any) => {
          getGpuInfoApi().then((res: any) => {
            reactiveData.gpuSelectData = res.data.data;

            if (reactiveData.gpuSelectData.length > 0) {
              reactiveData.currentGpuId = (
                reactiveData as any
              ).gpuSelectData[0].id;
            } else {
              gauge.computesGpu = gaugeCanvas(
                "使用率",
                0,
                theme.blueColor,
                computesGpuEl.value
              );
            }
            resolve();
          });
        });
      },
      getNodeGraphAll() {
        getNodeGraphAllApi().then((res: any) => {
          reactiveData.nodeGraphAllData = res.data;
        });
      },
    };
    onMounted(async () => {
      method.getGpuInfo();
      method.getNodeGraphAll();
      await method.getStatistics();
      if (Object.keys(reactiveData.statisticsData).length > 0) {
        let newData: any = reactiveData.statisticsData;
        let peopleName = ["在线人数", "离线人数"];
        let peopleData = [
          {
            value: newData.online_num,
            name: "在线人数",
          },
          {
            value: newData.offline_num,
            name: "离线人数",
          },
        ];
        pieCanvas(
          peopleName,
          peopleData,
          [theme.themeColor, theme.nextThemeColor],
          peopleEL.value
        );
        let imageName = ["基础镜像", "教师镜像"];
        let imageData = [
          {
            value: newData.init_image_num,
            name: "基础镜像",
          },
          {
            value: newData.teacher_image_num,
            name: "教师镜像",
          },
        ];
        pieCanvas(
          imageName,
          imageData,
          [image.mainColor, image.nextColor],
          imageEL.value
        );
      }
    });
    return {
      ...imgs,
      ...method,
      ...toRefs(reactiveData),
      peopleEL,
      imageEL,
      controlsCpuEl,
      controlsMemoryEl,
      computesCpuEl,
      computesMemoryEl,
      computesGpuEl,
    };
  },
});
</script>

<style lang="less">
.admin-home-wrap {
  min-width: 1330px;
  overflow: auto;
  height: 98%;
  padding: 20px 60px 0px 60px;
  .a-h-top {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-evenly;

    > div {
      width: 20%;
      background: @white;
      margin: 0 10px;
      height: 114px;
      border-radius: @border-radius-base;
      box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.05);
      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }
      &.a-card-item {
        display: flex;
        flex-direction: row;
        > div {
          width: 50%;
        }
        .a-card-right {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          > img {
            margin-right: 27px;
          }
        }
        .a-card-left {
          display: flex;
          flex-direction: column;
          padding-left: 27px;
          justify-content: center;
          .a-card-title {
            font-size: 18px;
            color: #161d67;
          }
          .num {
            font-size: 30px;
            color: #161d67;
          }
          .unit {
            font-size: 14px;
            font-style: normal;
          }
        }
      }
    }
  }
  .flex-line {
    display: flex;
    flex-direction: row;
    width: 100%;
    > .div-h {
      height: 380px;
    }
    > .w-3 {
      width: 30%;
    }
    > .w-4 {
      width: 40%;
    }
    > .w-7 {
      width: 70%;
    }
  }
  .m-t-20 {
    margin-top: 20px;
  }
  .bg-white {
    background-color: @white;
  }
  .m-l-20 {
    margin-right: 20px;
  }
  .w-33 {
    width: 33.33333%;
  }
  .p-22 {
    padding: 22px;
  }
  .f-j-c {
    justify-content: space-between;
  }
  .ip-select {
    margin-left: 10px;
  }
  .canvas-title {
    font-size: 18px;
    font-weight: 600;
  }
  .canvas-wrap {
    position: relative;
    width: 100%;
    height: 240px;
    .legend {
      position: absolute;
      display: flex;
      flex-direction: column;
      top: 50%;
      transform: translateY(-50%) translateX(-50%);
      left: 52%;
      font-size: 12px;

      > span {
        position: relative;
        &::before {
          position: absolute;
          content: "";
          width: 8px;
          height: 8px;
          //   background-color: @theme-color;
          border-radius: 50%;
          left: -10px;
          top: 5px;
        }
        &.on-line {
          &::before {
            background-color: @theme-color;
          }
        }
        &.off-line {
          &::before {
            background-color: rgba(@theme-color, 0.4);
          }
        }
        &.teacher-image {
          &::before {
            background-color: rgba(#73a0fa, 1);
          }
        }
        &.init-image {
          &::before {
            background-color: rgba(#73deb3, 1);
          }
        }
      }
    }
  }
  .canvas-el {
    width: 100%;
    height: 100%;
  }
  .ip-canvas {
    &.controls-h {
      height: 240px;
    }
    &.computes-h {
      height: 200px;
    }
  }
  .ip-title {
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    margin-top: 28px;
  }
  .statistics-item {
    display: flex;
    flex-direction: column;
    > div {
      &:first-child {
        font-size: 14px;
        color: #161d67;
      }
      &:nth-child(2) {
        span {
          font-size: 30px;
        }
        i {
          font-style: normal;
          font-size: 14px;
        }
      }
    }
  }
  .disk-use-status-wrap {
    padding-left: 30px;
    > div {
      margin-top: 30px;
    }
  }
  .disk-use-item {
    display: flex;
    flex-direction: column;
    .use-base {
      display: flex;
      justify-content: space-between;
    }
  }
  .disk-use-bg {
    height: 19px;
    width: 100%;
    .disk-use-num {
      height: 100%;
      width: 0;
    }
    &.root-bg {
      background-color: #ebf1ff;
      .disk-use-num {
        background-color: #6194ff;
      }
    }
    &.data-bg {
      background-color: #ffeaed;
      .disk-use-num {
        background-color: #fa6673;
      }
    }
    &.openstack-bg {
      background-color: #dbf8e1;
      .disk-use-num {
        background-color: #36d188;
      }
    }
  }
  .compute-progress {
    align-items: center;
    justify-content: space-between;
    > div {
      width: 35%;
      &:first-child {
        display: flex;

        width: 15%;
      }
    }
  }
  .line-item {
    width: 50%;
    // flex-shrink: 0;
    margin-top: 20px;
    background-color: @white;
    padding: 22px;
    &:nth-child(2n + 1) {
      margin-right: 20px;
    }
    :nth-child(2n + 2) {
      margin-left: 20px;
    }
  }
}
</style>
