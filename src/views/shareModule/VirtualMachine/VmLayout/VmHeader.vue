<template>
  <div class="vm-header-box">
    <div class="left-box">
      <div class="selected pointer" @click="isShowExperiment = !isShowExperiment">
        <span class="name">3-4 基于入侵检测的告警分析-外网</span>
        <span class="iconfont icon-zhankai"></span>
      </div>
      <div class="select-list" v-if="isShowExperiment">
        <div class="list">
          <div class="course-desc">第一章 课程介绍</div>
          <div class="experiment current pointer">1-1 基于入侵检测的告警分析-外网</div>
          <div class="experiment pointer">1-2 基于入侵检测的告警分析-外网</div>
          <div class="experiment pointer">1-3 基于入侵检测的告警分析-外网</div>
          <div class="experiment pointer">1-4 基于入侵检测的告警分析-外网</div>
          <div class="experiment pointer">1-5 基于入侵检测的告警分析-外网</div>
        </div>
        <div class="list">
          <div class="course-desc">第三章 课程介绍</div>
          <div class="experiment">3-1 基于入侵检测的告警分析-外网</div>
          <div class="experiment">3-2 基于入侵检测的告警分析-外网</div>
          <div class="experiment">3-3 基于入侵检测的告警分析-外网</div>
          <div class="experiment">3-4 基于入侵检测的告警分析-外网</div>
          <div class="experiment">3-5 基于入侵检测的告警分析-外网</div>
        </div>
      </div>
    </div>
    <div class="right-box">
      <div class="delayed">
        <span>00 : 40 : 00</span>
        <span class="pointer">延时</span>
      </div>
      <div class="tool pointer" @click="visible = !visible">
        <span class="iconfont icon-gongjuxiang"></span>
        <span>工具箱</span>
      </div>
      <div class="switch pointer">
        <span class="iconfont icon-guanbi1"></span>
      </div>
    </div>
  <a-drawer
    title="Basic Drawer"
    placement="right"
    :closable="false"
    v-model:visible="visible"
    :after-visible-change="afterVisibleChange"
    :drawer-style="{ backgroundColor: '#192843'}"
    :mask-style="{opacity: 0}"
    :width="'216px'"
  >
    <div class="vm-operate">
      <ul>
        <li class="pointer" v-for="(list, index) in toolList" :key="index">
          <span class="iconfont" :class="list.icon"></span>
          <span>{{list.name}}</span>
        </li>
      </ul>
    </div>
    <div class="vm-info">
      <h5>虚拟机信息</h5>
      <div class="neicun">
        <ul>
          <li>
            <span class="iconfont icon-neicun"></span>
            <span>内存：2G</span>
          </li>
          <li>
            <span class="iconfont icon-CPU"></span>
            <span>CPU：2核</span>
          </li>
          <li>
            <span class="iconfont icon-xianka"></span>
            <span>GPU：2核</span>
          </li>
          <li>
            <span class="iconfont icon-yingpan"></span>
            <span>硬盘：30G</span>
          </li>
        </ul>
      </div>
      <div class="user">
        <ul>
          <li>
            <span class="iconfont icon-yonghuming"></span>
            <span>用户名：root</span>
          </li>
          <li>
            <span class="iconfont icon-mima"></span>
            <span>密码：sshpassword</span>
          </li>
          <li>
            <span class="iconfont icon-IP"></span>
            <span>IP：192.168.101.154</span>
          </li>
          <li>
            <span class="iconfont icon-duankou"></span>
            <span>SSH端口：23706</span>
          </li>
        </ul>
      </div>
    </div>
  </a-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, onMounted, provide, inject, watch, nextTick, PropType } from 'vue'

export default defineComponent({
  name: '',
  components: {},
  props: {},
  emit: [],
  setup() {
    const isShowExperiment = ref<boolean>(false)
    const visible = ref<boolean>(false);
    const toolList = [
      {
        icon: 'icon-quanping',
        name: '开启 / 全屏'
      },
      {
        icon: 'icon-baocun',
        name: '保存进度'
      },
      {
        icon: 'icon-guanbi1',
        name: '关机'
      },
      {
        icon: 'icon-zhongzhi',
        name: '重置'
      },
      {
        icon: 'icon-shangchuan',
        name: '上传文件'
      },
      {
        icon: 'icon-xiazai',
        name: '下载文件'
      },
      {
        icon: 'icon-fuzhiniantie',
        name: '复制 / 粘贴'
      },
      {
        icon: 'icon-kaishijieshuluzhi',
        name: '开始 / 结束录制'
      },
      {
        icon: 'icon-gongxiangzhuomian',
        name: '桌面共享'
      },
      {
        icon: 'icon-yuanchengxiezhu',
        name: '请求老师远程协助'
      },
    ]
    // 切换抽屉时动画结束后的回调
    function afterVisibleChange(bool: boolean) {
      console.log('visible', bool);
    }
    return {
      isShowExperiment,
      visible,
      afterVisibleChange,
      toolList,
    }
  },
})
</script>

<style lang="less" scoped>
.vm-header-box {
  display: flex;
  margin-left: 62px;
  margin-right: 50px;
  justify-content: space-between;
  .left-box {
    color: var(--white-100);
    padding: 22px 0;
    position: relative;
    .selected {
      height: 26px;
      line-height: 26px;
      font-size: var(--font-size-20);
      .name {
        padding: 0 10px;
      }
    }
    .select-list {
      width: 389px;
      height: 381px;
      background: #192843;
      padding: 0 28px;
      position: absolute;
      left: 0;
      top: 72px;
      z-index: 1;
      overflow-y: auto;
      .list {
        margin-top: 16px;
        .course-desc {
          height: 16px;
          line-height: 16px;
          color: var(--white-45);
          font-size: var(--font-size-sm);
        }
        .experiment {
          height: 35px;
          line-height: 35px;
          &.current {
            color: var(--primary-color);
          }
        }
      }
    }
  }
  .right-box {
    padding: 25px 0;
    display: flex;
    height: 70px;
    line-height: 20px;
    .delayed, .tool, .switch {
      padding: 0 20px;
      border-left: 1px solid #2c3a54;
    }
    .delayed {
      border: none;
      color: var(--primary-color);
      span:last-child {
        height: 20px;
        line-height: 20px;
        padding: 0 21px;
        color: var(--white-100);
        background-color: var(--primary-color);
        margin-left: 8px;
        border-radius: 10px;
      }
    }
    .tool {
      color: var(--brightBtn);
      .iconfont {
        margin-right: 4px;
        font-size: var(--font-size-20);
        vertical-align: middle;
      }
    }
    .switch {
      .iconfont {
        font-size: var(--font-size-20);
        color: #FF4A3D;
      }
    }
  }
}
</style>
<style lang="less">
.ant-drawer {
  top: 70px;
  color: var(--white-45);
  .iconfont {
    font-size: var(--base-font-size);
  }
  .ant-drawer-body {
    height: calc(100% - 70px);
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .vm-operate {
    ul {
      margin-top: 4px;
    }
    li {
      height: 43px;
      line-height: 43px;
      padding-left: 20px;
      &:hover {
        color: var(--brightBtn);
      }
      .iconfont {
        margin-right: 10px;
      }
    }
  }
  .vm-info {
    height: 330px;
    border-top: 1px solid #2c3a54;
    color: var(--white-85);
    padding: 8px 16px 0 12px;
    h5 {
      color: var(--primary-color);
      font-size: var(--font-size-16);
      padding: 10px 0;
    }
    li {
      height: 31px;
      line-height: 19px;
      padding: 6px 0;
      .iconfont {
        margin-right: 5px;
      }
    }
    .neicun li:last-child {
      margin-bottom: 4px;
    }
    .user li:first-child {
      margin-top: 8px;
    }
  }
}
.ant-drawer-header {
  display: none;
}
</style>