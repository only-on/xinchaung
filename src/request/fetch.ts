import { RESP_AUTH_FAILURE, RESP_SUCCESS } from './../api/index';
import { IMimeMap, TMimeTypes, IBusinessResp, TDataType, IRequestParams, THttpHeaders } from '../typings/fetch';
import store from "../store/index";
import { message } from 'ant-design-vue';
// 检查是否为对象
function isObject(value: any) {
  return Object.prototype.toString.call(value) === "[object Object]";
}
// 构造 URL 的查询字符串
function urlParams(data: Record<string, string>): string {
  let urlParams = new URLSearchParams();
  Object.keys(data).forEach((key) => {
    urlParams.append(key, data[key]);
  });
  return urlParams.toString();
}
// 检查 response 返回状态
function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  throw response
}
// 根据 ContentType 猜测解析方式
function guessType(ct: string): TMimeTypes {
  // 常用类型检查,可以修改此进行调整
  const typeMap: IMimeMap = {
    blob: ["image", "video"],
    json: ["json"],
    arrayBuffer: ["octet-stream"],
    text: ["text", "x-javascript"],
  };
  const target = Object.keys(typeMap).find((key) =>
    typeMap[key as TMimeTypes].some((vi) => ct.toLocaleLowerCase().includes(vi))
  );
  // 如果未找到预设，则直接返回text
  return target as TMimeTypes || "text";
}
// 检查 response 返回数据类型，并进行相应解析，解析异常时，直接按照文本解析
function checkResponseType(response: Response) {
  const contentType = response.headers.get("Content-Type");
  if (contentType) {
    return response[guessType(contentType)]();
  } else {
    return response.text();
  }
}
// 格式化发送数据类型和数据格式
function contentTypeAndData(dataType: TDataType, body: string | Record<string, string>) {
  const currentMode = {
    urlencoded: {
      contentType: "application/x-www-form-urlencoded;charset=utf-8",
      data: isObject(body) ? urlParams(body as Record<string, string>) : "",
    },
    json: {
      contentType: "application/json;charset=utf-8",
      data: isObject(body) ? JSON.stringify(body) : "",
    },
    text: {
      contentType: "text/plain;charset=utf-8",
      data: typeof body === "string" ? body : "",
    },
    formdata: {
      contentType: '',
      data: isObject(body) ? body : "",
    },
  }[dataType];
  if (currentMode) {
    return {
      sendContentType: currentMode.contentType,
      data: currentMode.data,
    };
  }
  throw new Error("dataType 不在预设范围中...，请手动设置 headers 和 body");
}

// 请求成功的处理；请在此处添加自定义成功处理
function responseSucceed(response: IBusinessResp) {
  // const codeList = [1]
  // if (codeList.includes(response.status)) {
  //   response.code = 200
  // }
  return response;
}
// 请求错误处理返回信息；请在此处添加自定错误处理
function responseError(error: Error) {
  const errorMsgMap = {
    "Failed to fetch": "请求失败，详见控制台(Console)",
    "Not Found": "请求地址不存在，请核对地址",
  };
  if (error.message) {
    // @ts-ignore
    return errorMsgMap[error.message] || error.message;
  }
  return error;
}

// fetch 简易包装
export default function request({
  url = "",
  method = "GET",
  headers = {},
  body = {},
  cache = "no-cache",
  credentials = "same-origin",
  mode = "cors",
  dataType = "urlencoded",
  timeout = 0,
}: IRequestParams): Promise<IBusinessResp> {
  // fetch 参数方便后续调整
  let init: RequestInit = { headers, method, cache: cache, credentials: credentials, mode };
  // let fetchUrl = url;
  let fetchUrl = (window as any).proxy_api ? `${(window as any).proxy_api}${url}` : url;
  // 根据发送数据类型来自动生成 ContentType 和 body格式
  let { sendContentType, data } = contentTypeAndData(dataType, body);
  // headers构造
  let httpHeaders: THttpHeaders = {
    "Cache-Control": cache,
    "Content-Type": sendContentType,
    'Authorization': store.state.adminInfo.token as string || '',
    ...headers,
  };
  // 如果Content-Type不存在，删除Content-Type
  if (!sendContentType) {
    delete httpHeaders["Content-Type"];
  }
  // 确保请求方式都是大写
  init.method = method.toLocaleUpperCase();
  // 请求headers
  init.headers = new Headers(httpHeaders);
  // GET DELETE 请求特殊处理
  if (["GET", "DELETE"].includes(init.method)) {
    const urlParamsStr = urlParams(body as Record<string, string>);
    // 重新设置请求路径
    fetchUrl = urlParamsStr ? [fetchUrl, urlParamsStr].join("?") : fetchUrl;
  } else {
    // 设置数据
    init.body = sendContentType ? data as string : body as string;
  }
  // 检查是否支持 AbortController，AbortSignal ，来确定是否使用超时
  if ("signal" in new Request("") && timeout > 0) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    init.signal = controller.signal;
  }
  // 重新包裹fetch而不直接返回，方便做统一处理
  return new Promise((resolve, reject) => {
    fetch(fetchUrl, init)
      .then(checkStatus)
      .then(checkResponseType)
      .then(responseSucceed)
      .then((res: IBusinessResp) => {
        // console.log(res);
        if (res.status === RESP_SUCCESS) {
          // message.success('成功');
          resolve(res);
        } else if (res.status === RESP_AUTH_FAILURE) {    // 登录失效或其他特殊状态码处理
          // store.commit("logout");
          // router.replace({ path: "/login" }).catch(() => {});
          reject(null)
        } else {
          let meg= res.message || res.msg || res.error.msg
          message.warning(meg);
          reject(null)
        }
      })
      .catch((error: Error) => {
        reject(responseError(error));
      });
  });
}
