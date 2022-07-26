<template>
  <div id="terminal" ref="refTerminal"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref, watch } from "vue";
import { ITerminalOptions, Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import http from "src/api";
import "xterm/css/xterm.css";
import { lStorage } from "../../utils/extStorage";
import { message } from "ant-design-vue";

const props = defineProps<{
  wsshServerWsUrl?: string; // webssh服务ws地址前缀
  host?: string; // 虚拟主机ip
  port?: number | string; // 虚拟主机ssh端口，一般是22，但是这里不作设置，因为虚拟机的一般都是代理出来的
  bgColor?: string; // 终端背景颜色
  fontColor?: string; // 终端字体颜色
  reconnect?: boolean; // 是否重新连接
}>();
const refTerminal: Ref<HTMLDivElement | undefined> = ref();
const termOptions: ITerminalOptions = {
  cursorBlink: true,
  theme: {
    background: props.bgColor || "black",
    foreground: props.fontColor || "white",
  },
};
const emit = defineEmits([
  "wsConnected",
  "wsDisconnected",
  "wsError",
  "sniffing",
  "sniffFailed",
  "sniffNoWorker",
  "sniffSuccessful",
]);

let encoding = "utf-8";
let decoder = window.TextDecoder ? new window.TextDecoder(encoding) : encoding;
let wsSchema = window.location.protocol === "https:" ? "wss" : "ws";
let wsUrl =
  props.wsshServerWsUrl?.indexOf("ws") === -1
    ? wsSchema + "://" + props.wsshServerWsUrl + "/ws"
    : props.wsshServerWsUrl + "/ws";
let sock: WebSocket | undefined = undefined; // websocket连接
let terminal: Terminal | undefined = undefined; // xterm事例
let fitAddon: FitAddon | undefined = undefined; // xterm的fit插件

/**
 * 向webssh服务发送消息
 * @param data
 */
const onSend = (data: object | string[] | string) => {
  data = JSON.stringify(data);
  sock?.send(data);
};

/**
 * 使用指定编码将数据读为字符串
 * @param file
 * @param callback
 * @param encoding
 */
const readAsTextWithEncoding = (
  file: Blob,
  callback: (result: string | ArrayBuffer | null) => void,
  encoding: string | undefined
) => {
  let reader = new window.FileReader();

  if (encoding === undefined) {
    encoding = "utf-8";
  }
  reader.onload = function () {
    if (callback) {
      callback(reader.result);
    }
  };
  reader.onerror = function (e) {
    console.error(e);
  };

  reader.readAsText(file, encoding);
};

/**
 * 使用解码器将数据读为字符串
 * @param file
 * @param callback
 * @param decoder
 */
const readAsTextWithDecoder = (
  file: Blob,
  callback: (result: string | undefined | null) => void,
  decoder: TextDecoder | undefined
) => {
  let reader = new window.FileReader();

  if (decoder === undefined) {
    decoder = new window.TextDecoder("utf-8", { fatal: true });
  }

  reader.onload = function () {
    let text: string | undefined | null = null;
    try {
      text = decoder?.decode(reader.result as ArrayBuffer);
    } catch (TypeError) {
      console.log("Decoding error happened.");
    } finally {
      if (callback) {
        callback(text);
      }
    }
  };

  reader.onerror = function (e) {
    console.error(e);
  };

  reader.readAsArrayBuffer(file);
};

/**
 * 将块文件读为字符串文本
 * @param file
 * @param callback
 * @param decoder
 */
const readFileAsText = (
  file: Blob,
  callback: (result: string | ArrayBuffer | undefined | null) => void,
  decoder: TextDecoder | string | undefined
) => {
  if (!window.TextDecoder) {
    readAsTextWithEncoding(file, callback, decoder as string | undefined);
  } else {
    readAsTextWithDecoder(file, callback, decoder as TextDecoder | undefined);
  }
};

const resizeScreen = () => {
  try {
    fitAddon?.fit();

    // 终端尺寸变化时的操作
    terminal?.onResize(() => {
      onSend({
        resize: [terminal?.cols, terminal?.rows],
      });
    });
  } catch (e) {
    console.error("[WebSsh] onResize: ", e);
  }
};

/**
 * 连接服务
 */
const connect = () => {
  if (terminal !== undefined) {
    return;
  }
  emit("sniffing");
  console.log("[WebSsh] connecting...");
  let baseUrl =
    "http://" +
    (lStorage.get("webssh_ip") || "") +
    ":" +
    (lStorage.get("webssh_port") || "");
  if (baseUrl === "http://:") {
    message.warn("参数配置有误，无法连接虚拟机！");
    return;
  }
  http.vmApi
    .getWsshId({
      urlParams: { hostname: props.host, port: props.port },
      baseUrl: baseUrl,
    })
    .then((res: any) => {
      console.log("[WebSsh] index: ", res);
      if (res.data.id) {
        emit("sniffSuccessful");
        encoding = res.data.encoding.toLowerCase();
        decoder = window.TextDecoder
          ? new window.TextDecoder(encoding)
          : encoding;

        console.log("[webSsh] got id", res.data.id, " connect to ws server...");
        sock = new window.WebSocket(wsUrl + "?id=" + res.data.id);
        sock.onopen = () => {
          terminal = new Terminal(termOptions); // xterm事例
          fitAddon = new FitAddon(); // xterm的fit插件
          terminal.loadAddon(fitAddon);
          terminal.onData((key) => {
            onSend({ data: key });
          });

          terminal.open(refTerminal.value!);
          fitAddon.fit();
          terminal.focus();
          emit("wsConnected");
        };
        sock.onmessage = (msg: MessageEvent) => {
          console.log("[webSsh] onmessage: ", msg);
          readFileAsText(
            msg.data,
            (result: string | ArrayBuffer | undefined | null) => {
              if (result) {
                terminal?.write(result as string);
              }
            },
            decoder!
          );
        };
        sock.onerror = (e: Event) => {
          console.log("[webSsh] error: ", e);
          terminal?.dispose();
          terminal = undefined;
          sock = undefined;
          emit("wsError", { e: e });
        };
        sock.onclose = (e) => {
          console.log("[WebSsh] onclose: ", e, e.reason); // 主动断开后，reason是chan closed，服务没有开，reason是空
          terminal?.dispose();
          terminal = undefined;
          sock = undefined;
          emit("wsDisconnected", { e: e });
        };
      } else {
        emit("sniffNoWorker");
        console.log("[WebSsh] not got id");
      }
    })
    .catch((err) => {
      emit("sniffFailed");
      console.error("[WebSsh]", err);
    });
};

window.addEventListener("resize", resizeScreen);

watch(
  () => props.reconnect,
  (newVal) => {
    console.log("[WebSsh] props.reconnect changed: ", newVal);
    connect();
  }
);

onMounted(() => {
  connect();
});
</script>

<style scoped>
#terminal {
  width: 100%;
  height: 100%;
}
</style>
