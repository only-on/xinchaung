<template>
  <div>
    <a-radio-group v-model:value="locale" style="position: absolute; bottom: 0; right: 0;">
      <a-radio-button key="en" :value="enUS.locale">English</a-radio-button>
      <a-radio-button key="cn" :value="zhCN.locale">中文</a-radio-button>
    </a-radio-group>
    <a-config-provider :locale="locale === 'en' ? enUS : zhCN">
      <!-- <img alt="Vue logo" src="./assets/logo.png" />
  <h3>描述是:{{textWord}}</h3>
  <HelloWorld :msg="textWord" @test2="change2()"/>
  <Testemit @emitclick="change2" :number="n2"></Testemit> -->
      <router-view />
      <a-button type="primary"> ant design vue button</a-button>
      <router-view />
    </a-config-provider>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import HelloWorld from "./components/HelloWorld.vue";
import Testemit from "./components/Test.vue";
import storeC from "./components/store.vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import enUS from "ant-design-vue/es/locale/en_US";

export default defineComponent({
  name: "App",
  components: {
    HelloWorld,
    Testemit,
    storeC,
  },
  setup: (props, { emit }) => {
    // 放在setup的顶行，这个是全局的i18n对象
    const { locale } = useI18n({ useScope: "global" });

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
}
</style>
