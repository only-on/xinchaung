<template>
    <a-radio-group v-model:value="locale" style="position: absolute; bottom: 0; right: 0; z-index: 1081;">
      <a-radio-button key="en" :value="enUS.locale">English</a-radio-button>
      <a-radio-button key="cn" :value="zhCN.locale">中文</a-radio-button>
    </a-radio-group>
    <a-config-provider :locale="locale === 'en' ? enUS : zhCN">
      <router-view />
    </a-config-provider>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, provide } from "vue";
import { useI18n } from "vue-i18n";
import HelloWorld from "./components/HelloWorld.vue";
import storeC from "./components/store.vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import enUS from "ant-design-vue/es/locale/en_US";
import * as echarts from 'echarts'
export default defineComponent({
  name: "App",
  components: {
    HelloWorld,
    storeC,
  },
  setup: (props, { emit }) => {
    // 放在setup的顶行，这个是全局的i18n对象
    const { locale } = useI18n({ useScope: "global" });
    provide('echarts',echarts)
    const textWord = ref("儿子");
    const n2 = ref(0);

    function change2(arr: any) {
      console.log(arr);
      textWord.value = "修改了";
      console.log(textWord.value);
      n2.value = arr;
    }
    onMounted(() => {
      //  console.log(textWord)
    });
    return { change2, textWord, n2, locale, zhCN, enUS };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f7f7f7;
  height: 100%;
}
</style>
