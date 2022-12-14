import { message, Modal } from "ant-design-vue";
// import request from "src/request/getRequest";
// const vmApi = request.vmApi;


import request from 'src/api/index'
const vmApi=(request as any).vmApi

export type TStudyType = "course" | "train"; // 学习类别：course:课程实验/实训；train:实训
export type TopType =
  | "start"
  | "continue"
  | "rebuild"
  | "test"
  | "prepare"
  | "recommend"
  | "help"; // 操作类型:start/continue/rebuild/test/prepare

export interface IEnvirmentsParam {
  type: TStudyType;
  opType: TopType;
  taskId: any;
  experType?: any
  recommendType?: string
}

export interface IStopOperatesParam extends IEnvirmentsParam {
  action: string;
  topoinst_id: string;
}

export interface IRecommendExperiment {
  recommendType: "content" | "train";
  opType: "recommend";
  type: TStudyType;
  taskId: any;
}

export type IAction =
  | "startVm"
  | "closeVm"
  | "revertVm"
  | "resetVm"
  | "switch2Vnc"
  | "saveKvm"
  | "startRecord"
  | "stopRecord"
  | "delay";

export interface IOperatesHandle {
  action: IAction;
  params: {
    type: TStudyType;
    opType: TopType;
    uuid: string;
    taskId: number;
  };
}
/**
 * @description 检查创建环境
 * @param params
 */
function openVm(params: IEnvirmentsParam) {
  return new Promise(async (resolve: any, reject: any) => {
    envirmentsInspect(params)
      .then((result: any) => {
        console.log(result);

        if (result.status === 1) {
          if (result.msg && result.msg.topoinst_id) {
            const modal = Modal.confirm({
              title: "开启新环境，将删除未保存的环境，确定要开启吗？",
              cancelText: "取消",
              okText: "确定",
              onOk() {
                try {
                  cleanEnvirments(result.msg.topoinst_id).then(() => {
                    resourceInspect().then(() => {
                      createExamples(params).then((res) => {
                        console.log(res);
  
                        resolve({
                          data: res, query: {
                            opType: params.opType,
                            type: params.type,
                            taskId: params.taskId,
                          }
                        });
                      }).catch(() => {
                        reject()
                      })
                    }).catch(() => {
                      reject()
                    })
                  }).catch(() => {
                    reject()
                  })
                } catch (error) {
                  console.log(error);
                }
  
  
              },
              onCancel() {
                reject()
                console.log("关闭");
                modal.destroy()
              }
            })
  
          } else {
            resourceInspect().then(() => {
              createExamples(params).then((res: any) => {
                console.log(res);
  
                resolve({
                  data: res, query: {
                    opType: params.opType,
                    type: res.data.type.type,
                    taskId: params.taskId,
                  }
                });
              }).catch(() => {
                reject()
              })
            }).catch(() => {
              reject()
            })
          }
  
        } else {
  
        }
      })
      .catch((err:any) => {
        console.log(err);
      });
  });
}

/**
 * @description 检查环境
 * @param IEnvirmentsParam
 */
function envirmentsInspect(params: IEnvirmentsParam) {
  return new Promise((resolve: any, reject: any) => {
    vmApi
      .envirmentsExists({ param: params })
      .then((res: any) => {
        console.log(res);

        if (res.status === 1) {
          resolve(res);
        } else {
          reject(res);
        }
      })
      .catch((res:any) => {
        if (res.status === 0) {
          resolve(res);
        } else {
          reject(res);
        }
      });
  });
}

/**
 * @description 清理多余环境
 * @param params topoinst_id
 */
function cleanEnvirments(topoinst_id: string) {
  return new Promise((resolve: any, reject: any) => {
    vmApi
      .cleanEnvirments({ param: { topoinst_id } })
      .then((res: any) => {
        console.log(res);

        if (res.status === 1) {
          resolve(res);
          // resourceInspect(params)
        } else {
          message.warn(res.msg);
          reject(res);
        }
      })
      .catch((err:any) => {
        reject(err);
      });
  });
}

/**
 * @description 资源池检查
 * @param params topoinst_id
 */
function resourceInspect() {
  return new Promise((resolve: any, reject: any) => {
    vmApi
      .resourceInspect({})
      .then((res: any) => {
        console.log(res);

        if (res.status === 1) {
          // createExamples(params)
          resolve(res);
        } else {
          message.warn(res.msg);
          reject(res);
        }
      })
      .catch((err:any) => {
        reject(err);
      });
  });
}

/**
 * @description 创建实例
 * @param params IEnvirmentsParam
 */
function createExamples(params: IEnvirmentsParam) {
  return new Promise((resolve: any, reject: any) => {
    vmApi
      .createExamples({ param: params })
      .then((res: any) => {
        console.log(res);

        if (res.status === 1) {
          resolve(res);
        } else {
          message.warn(res.msg);
          reject(res);
        }
      })
      .catch((err:any) => {
        reject(err);
      });
  });
}

/**
 * @description 获取虚机页面加载的当前实验/实训的详情，以及相关的学习记录
 * @param params
 */
function getVmBaseInfo(params: IEnvirmentsParam) {
  return new Promise((resolve: any, reject: any) => {
    vmApi
      .getVmBaseInfo({ param: params })
      .then((res:any) => {
        resolve(res);
      })
      .catch((err:any) => {
        reject(err);
      });
  });
}

/**
 * @description 结束脚本入口
 * @param params
 */
function endOperates(params: IStopOperatesParam) {
  return new Promise((resolve: any, reject: any) => {
    vmApi
      .endOperates({ param: params })
      .then((res:any) => {
        resolve(res);
      })
      .catch((err:any) => {
        reject(err);
      });
  });
}

/**
 * @description 学生结束实验/实训
 * @param params
 */
function endExperiment(params: IEnvirmentsParam) {
  return new Promise((resolve: any, reject: any) => {
    vmApi
      .endExperiment({ param: params })
      .then((res:any) => {
        resolve(res);
      })
      .catch((err:any) => {
        reject(err);
      });
  });
}

/**
 * @description 学生学习推荐实验/实训
 * @param params
 */
function recommendExperiment(params: IRecommendExperiment) {
  return new Promise((resolve: any, reject: any) => {
    vmApi
      .recommendExperiment({ param: params })
      .then((res:any) => {
        resolve(res);
      })
      .catch((err:any) => {
        reject(err);
      });
  });
}

// 跳转虚拟机页面
async function toVmConnect(
  router: any,
  param: IEnvirmentsParam,
  routerQuery: any
) {
  console.log(param);

  return new Promise(async (resolve: any, reject: any) => {
    const createEnvirments: any = await openVm(param);
    console.log(createEnvirments, JSON.stringify(routerQuery));
    let url = "/vm";
    console.log(createEnvirments.data.data.type);
    // if (createEnvirments.data.data.type.taskType === "notebook") {
    //   url = "/vm/notebook";
    // } else {
    //   url = "/vm/vnc";
    // }
    console.log(url);

    if (createEnvirments.data.data.connection_id) {
      resolve()
      router.push({
        path: url,
        query: {
          experType: param.experType,
          connection_id: createEnvirments.data.data.connection_id,
          opType: createEnvirments.query.opType,
          type: createEnvirments.query.type,
          taskId: createEnvirments.query.taskId,
          topoinst_uuid: createEnvirments.data.data.topoinst_uuid,
          topoinst_id: createEnvirments.data.data.topoinst_id,
          routerQuery: JSON.stringify(routerQuery),
        },
      });
    }
  })
}

// 连接环境
import { wsConnect } from "src/request/websocket";
import storage from "src/utils/extStorage";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
const uid = Number(storage.lStorage.get("uid"));
const connection_id = uid+'_0'
let ws_config = storage.lStorage.get("ws_config");
const connectEnv = () => {
  const store = useStore()
  console.log(store)
  console.log(useRoute())
  return new Promise(async (resolve: any, reject: any) => {
    wsConnect({
      url: "://" + ws_config.host + ":" + ws_config.port + "/?uid=" + connection_id,
      close: (ev: CloseEvent) => {
        console.log(ev)
        if (ev.type === "close") {

        }
      },
      message: (ev: MessageEvent) => {
        let regex = /\{.*?\}/g;
        if (typeof ev.data === "string" && regex.test(ev.data)) {
          let wsJsonData = JSON.parse(ev.data);
          console.log(wsJsonData)
          if (wsJsonData.type==="base_vminfo"&&wsJsonData.data.vms && wsJsonData.data.vms.length > 0) {
            resolve()
            store.commit('setIsWsConnect', true)
            store.commit('setConnectStatus', 2)
          }
        }
      }
    })
  })
}
// 准备环境
let paramVm: any = {}
async function prepareEnv(
  param: IEnvirmentsParam,
  router?: any,
  routerQuery?: any
) {
  return new Promise(async (resolve: any, reject: any) => {
    
    // 视频、文档、webide
    if (param.experType === 6 || param.experType === 7 || param.experType === 3) {
      resolve()
      Object.assign(paramVm, 
        {
          type: param.type,
          opType: param.opType,
          taskId: param.taskId,
          experType: param.experType
        }
      );
      // goToVm( router, routerQuery )
      return 
    }
    // await connectEnv()
    // const createExamplesInfo: any = await openVm(param);
    await openVm(param).then((createExamplesInfo: any) => {
    if (createExamplesInfo.data.data.connection_id) {
      resolve()
      Object.assign(paramVm, 
        {
          experType: param.experType,
          connection_id: createExamplesInfo.data.data.connection_id,
          opType: createExamplesInfo.query.opType,
          type: createExamplesInfo.query.type,
          taskId: createExamplesInfo.query.taskId,
          topoinst_uuid: createExamplesInfo.data.data.topoinst_uuid,
          topoinst_id: createExamplesInfo.data.data.topoinst_id,
        }
      );
      param.recommendType ? paramVm.recommendType = param.recommendType : ''
    }
    }).catch(() => {
      reject()
    })
  })
}
// 进入虚拟机页面
function goToVm(
  router: any,
  routerQuery: any,
) {
  router.push({
    path: "/vm",
    query: {
      ...paramVm, 
      // routerQuery: JSON.stringify(routerQuery)
    }
  })
  setTimeout(() => {
    paramVm = {}
  }, 3000)
}

// 推荐学习实验跳转
async function toStudyRecommendExperiment(
  router: any,
  param: IRecommendExperiment,
  otherParams: any
) {
  recommendExperiment(param).then((res: any) => {
    console.log(res);
    let routeUrl = router.resolve({
      path: "/vm/vnc",
      query: {
        connection_id: res.data.connection_id,
        opType: "recommend",
        type: res.data.type.type,
        taskId: param.taskId,
        topoinst_uuid: res.data.topoinst_uuid,
        topoinst_id: otherParams.topoinst_id,
      },
    });
    window.open(routeUrl.href, "_blank");
  });
}

/**
 * 
 * @param params  opType	是	string	学生当前学习记录类型：start/continue/rebuild	start
                  type	是	string	学习类别：course:课程实验/实训；train:实训	course
                  taskId	是	int	课程实验id/实训id	0
                  action	是	string	脚本运行类型：stepScore	stepScore
                  topoinst_id	是	string	拓扑实例uuid	“”
                  task_step_id	是	int	单个步骤的步骤id	0
                  see_current_step	否	int	是否是查看步骤详情	0
 * @description 步骤提交/查看步骤 
 */
function stepAction(params: any) {
  return new Promise((resolve: any, reject: any) => {
    vmApi
      .stepActionApi({ param: params })
      .then((res:any) => {
        resolve(res);
      })
      .catch((err:any) => {
        reject(err);
      });
  });
}
/**
 * @description 操作虚拟机
 * @param params param:{action,params:{type,opType,taskId}}
 */
function operatesHandle(params: IOperatesHandle) {
  return new Promise((resolve: any, reject: any) => {
    vmApi
      .operatesHandle({ param: params })
      .then((res:any) => {
        resolve(res);
      })
      .catch((err:any) => {
        reject(err);
      });
  }).catch((err:any) => {
    console.log(err);
  });
}
/**
 * @description ide实验 创建环境前的检查环境
 * @param params
 */
 function inspectEnv(params: IEnvirmentsParam) {
  return new Promise(async (resolve: any, reject: any) => {
    envirmentsInspect(params)
      .then((result: any) => {
        // console.log(result);

        if (result.status === 1) {
          if (result.msg && result.msg.topoinst_id) {
            const modal = Modal.confirm({
              title: "开启新环境，将删除未保存的环境，确定要开启吗？",
              cancelText: "取消",
              okText: "确定",
              onOk() {
                try {
                  cleanEnvirments(result.msg.topoinst_id).then(() => {
                    resourceInspect().then(() => {
                      resolve()
                    })
                  })
                } catch (error) {
                  console.log(error);
                }
  
  
              },
              onCancel() {
                reject()
                console.log("关闭");
                modal.destroy()
              }
            })
  
          } else {
            resourceInspect().then(() => {
              resolve()
            })
          }
  
        } else {
  
        }
      })
      .catch((err:any) => {
        console.log(err);
      });
  });
}

/* ------工具方法start----- */
/**
 * @description 计时器
 * @param time_s 秒数
 */
function secondToHHMMSS(time_s: number) {
  let h = 0,
    m = 0,
    s = 0;
  h = parseInt((time_s / 60 / 60).toString());
  m = parseInt(((time_s / 60) % 60).toString());
  s = parseInt((time_s % 60).toString());

  return {
    h: h > 9 ? h : "0" + h,
    m: m > 9 ? m : "0" + m,
    s: s > 9 ? s : "0" + s,
  };
}

async function evaluateApi(params: {
  "action": "score",
  "params": {
    "type": string,
    "opType": string,
    "taskId": number,
    "score": number
  }
}) {
  return await vmApi.evaluateApi({ param: params })
}

/**
 * @description 结束实验跳转
 * @param type 课程：course、实训：train
 * @param role 权限：1、2、3
 */
function backTo(route: any, type: string, role: number, routerQuery: string) {
  route.go(-1);
  // let otherParams: any = {}
  // if (routerQuery) {
  //   otherParams = JSON.parse(routerQuery)
  // }
  // if (role === 4) {
  //   if (type === "course") {
  //     route.push({
  //       path: "/studentSideCourse/ContinueDetail",
  //       query: {
  //         DetailId: otherParams.detailId,
  //         course_id: otherParams.course_id
  //       }
  //     })
  //     return;
  //   }
  //   if (type === "train") {
  //     route.push({
  //       path: "/studentExperimental",
  //       query: {
  //         currentTab: 0
  //       }
  //     })
  //     return;
  //   }
  // }
  // if (role===3) {
  //   if (type === "course") {
  //     route.push({
  //       path: "/teacher/teacherCourse/detail",
  //       query: {
  //         course_id: otherParams.course_id,
  //         currentTab: otherParams.currentTab
  //       }
  //     })
  //     return;
  //   }
  //   if (type === "train") {
  //     route.push({
  //       path: "/studentExperimental",
  //       query: {
  //         currentTab: 0
  //       }
  //     })
  //     return;
  //   }
  // }
}
/* ------工具方法end----- */

export {
  openVm,
  getVmBaseInfo,
  endOperates,
  endExperiment,
  recommendExperiment,
  toVmConnect,
  toStudyRecommendExperiment,
  secondToHHMMSS,
  backTo,
  operatesHandle,
  stepAction,
  evaluateApi,
  prepareEnv,
  goToVm,
  connectEnv,
  createExamples,
  inspectEnv,
};
