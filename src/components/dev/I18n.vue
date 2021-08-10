<template>
  <div>
    <p>{{ t("home.hello") }}</p>
    <a-calendar :fullscreen="false" :value="moment()" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import moment from "moment";
import "moment/dist/locale/zh-cn";
import { useI18n } from "vue-i18n";
export default defineComponent({
  name: "I18n",
  setup(props) {
    // 这段代码必须在setup的顶部执行
    const { t } = useI18n();
    return { moment, t };
  },
});
</script>
