<template>
  <div style="width: 100%; height: 100%">
    <iframe
      v-if="isShowPdf"
      style="width: 100%; height: 100%"
      :src="`${env ? '' : ''}/pdfjs-2.5.207/web/viewer.html?file=${pdfUrl}`"
      frameborder="0"
    ></iframe>
    <div v-else>
      <div class="pdtView">
        <div class="status-img">
          <img :src="transimg" />
        </div>
        <div class="status-word">文档转换中，请稍后查看！</div>
        <!-- <div class="status-btn">
          <a-button type="primary" @click="checkPdf(pdfUrl)">刷新</a-button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, onUnmounted } from "vue";
import empty from "src/components/Empty.vue";
import { message } from "ant-design-vue";
import transimg from "src/assets/images/common/ppt-trans.gif";
export default defineComponent({
  components: {
    empty,
  },
  props: ["url"],
  setup(props) {
    const env = process.env.NODE_ENV == "development" ? true : false;
    const pdfUrl = ref("");
    const isShowPdf = ref(false);
    const spinning = ref(false);
    let timer: NodeJS.Timeout | null = null;
    watch(
      () => props.url,
      () => {
        clearTimeout(Number(timer));
        if (/(http|https):\/\/\S*/.test(props.url)) {
          pdfUrl.value = props.url;
        } else {
          pdfUrl.value = env ? "/proxyPrefix" + props.url : props.url;
        }

        checkPdf(pdfUrl.value);
      },
      { immediate: true }
    );

    function checkPdf(url: string) {
      if (!url) {
        clearTimeout(Number(timer));
        return;
      }
      spinning.value = true;
      clearTimeout(Number(timer));
      fetch(url).then((res) => {
        if (res.status == 200) {
          isShowPdf.value = true;
          clearTimeout(Number(timer));
        } else {
          isShowPdf.value = false;
          // message.warn("加载失败")
          timer = setTimeout(() => {
            checkPdf(url);
          }, 2000);
        }
        spinning.value = true;
      });
    }

    onUnmounted(() => {
      clearTimeout(Number(timer));
    });
    return {
      env,
      pdfUrl,
      isShowPdf,
      spinning,
      checkPdf,
      transimg,
    };
  },
});
</script>
<style lang="less" scoped>
.pdtView {
  margin: 0 auto;
  margin-top: 30px;
  .status-img {
    width: 100%;
    text-align: center;
    height: 96px;
  }
  .status-word {
    color: var(--black-45);
    display: flex;
    justify-content: center;
  }
  .status-btn {
    text-align: center;
    margin-top: 30px;
  }
}
</style>
