<template>
  <div>
    <div v-if="type == 'w1'" data-type="w1" class="wrapper title">
      <div class="title-text"></div>
    </div>
    <div v-if="type == 'w2'" data-type="w2" class="wrapper">
      <div class="slash vertical"></div>
      <div class="slash-wrapper">
        <div class="slash-lager"></div>
      </div>
    </div>
    <div v-if="type == 'w3'" data-type="w3" class="wrapper">
      <div class="slash vertical-T"></div>
      <div class="slash-wrapper">
        <div class="slash-small"></div>
      </div>
      <div class="slash vertical-T second"></div>
      <div class="slash-wrapper">
        <div class="slash-small"></div>
      </div>
    </div>
    <div v-if="type == 'w4'" data-type="w4" class="wrapper vertical wrapper-column">
      <div class="slash horizontal"></div>
      <div class="slash-wrapper">
        <div class="slash-lager"></div>
      </div>
    </div>
    <div v-if="type == 'w5'" data-type="w5" class="wrapper wrapper-region">
      <div class="slash vertical"></div>
      <div class="slash-wrapper break-wrap">
        <div class="slash-mean-less space-right">
          <div class="slash-middle"></div>
          <div class="slash-middle"></div>
        </div>
        <div class="slash-mean-less">
          <div class="slash-middle"></div>
          <div class="slash-middle"></div>
        </div>
      </div>
    </div>
    <div v-if="type == 'w6'" data-type="w6" class="wrapper vertical region">
      <div class="slash horizontal"></div>
      <div class="slash-wrapper break-wrap">
        <div class="slash-mean-less space-right">
          <div class="slash-middle"></div>
          <div class="slash-middle"></div>
        </div>
        <div class="slash-mean-less">
          <div class="slash-middle"></div>
          <div class="slash-middle"></div>
        </div>
      </div>
    </div>
    <div v-if="type == 'w7'" data-type="w7" class="wrapper region">
      <div class="slash vertical region"></div>
      <div class="slash-wrapper break-wrap">
        <div class="slash-mean-less space-right">
          <div class="slash-block"></div>
        </div>
        <div class="slash-mean-less">
          <div class="slash-middle"></div>
          <div class="slash-middle"></div>
        </div>
      </div>
    </div>
    <div v-if="type == 'w8'" data-type="w8" class="wrapper vertical region">
      <div class="slash horizontal"></div>
      <div class="slash-wrapper break-wrap">
        <div class="slash-mean-less space-right">
          <div class="slash-block"></div>
        </div>
        <div class="slash-mean-less">
          <div class="slash-middle"></div>
          <div class="slash-middle"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref,watch } from 'vue'
export default defineComponent({
  props: ['type'],
  setup(props) {
    const type = ref<string>(props.type)
    watch(()=>props.type, newVal => {
      type.value = newVal
    })
    return {
      type
    }
  },
})
</script>
<style lang="less" scoped>
.wrapper {
  width: 100%;
  height: 24px;
  display: flex;
  // margin-right: 22px;
  background-color: #F4F4FF;
  margin-bottom: 12px;

  &.vertical {
    flex-direction: column;
  }

  &-column {
    height: 50px;
  }

  &-region {
    height: 70px;
  }

  &.region {
    height: 70px;
  }
  .title {
  background-color: #F4F4FF;
  border: 1px solid #c2c0f0;
  // justify-content: center;
  align-items: center;

  &-text {
    width: 11px;
    height: 26px;
    font-size: 20px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: left;
    color: #ffb745;
    line-height: 24px;
    letter-spacing: 2px;
  }
}

.slash {
  // background: rgba(var(--primary-color), 0.3);
  flex-shrink: 0;
  background-color: #E2DFFF;
  border: 1px solid #c2c0f0;
  &.vertical {
    height: 100%;
    width: 67px;
    border-right: 0;
    &-T {
      width: 36px;
      border-right: 0;
      &.second{
        border-left: 0;
      }
    }
  }

  &.horizontal {
    height: 24px;
    width: 100%;
    border-bottom: 0;
  }
}

.slash-wrapper {
  display: flex;
  flex: 1 0 auto;
  justify-content: center;
  align-items: center;
  border: 1px solid #c2c0f0;

  &.break-wrap {
    flex-wrap: wrap;

    .slash-middle {
      margin-top: 7px;
      margin-bottom: 7px;
    }

    .slash-block {
      margin-top: 1px;
    }
  }

  .slash-mean-less {
    &.space-right {
      margin-right: 6px;
    }
  }

  .slash-lager {
    width: 27px;
    height: 2px;
    background: var(--white-100);
  }

  .slash-small {
    width: 8px;
    height: 2px;
    background: var(--white-100);
  }

  .slash-middle {
    width: 12px;
    height: 2px;
    background: var(--white-100);
  }

  .slash-block {
    width: 12px;
    height: 10px;
    background: var(--white-100);
  }
}
}


</style>
