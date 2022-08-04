<template>
  <div class="question-lists">
    <div class="list" v-for="v in props.questionList" :key="v.id">
      <div class="question-type">
        <span class="type" :style="{background: questionTypeList[v.type].bgColor}">{{questionTypeList[v.type].keyword}}</span>
      </div>
      <div class="question-content">
        <div class="question-main">
          <div class="left">
            <div class="desc">在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素</div>
             <!-- 选择题 -->
              <!-- <div class="option" v-if="v.type===1">
                <a-checkbox-group v-model:value="element.answer" style="width: 100%" @change="changebox" :disabled="CanDisabled()">
                  <a-row v-for="(j,b) in element.option" :key="j">
                    <a-checkbox :value="optionType[b]">{{`${optionType[b]}、`}}</a-checkbox>
                    <div> {{j.text}}</div>
                  </a-row>
                </a-checkbox-group>
              </div> -->
              <!-- 判断题答 -->
              <!-- <div class="option" v-if="v.type===2">
                <a-radio-group v-model:value="element.answer" :disabled="CanDisabled()" @change="changebox">
                  <a-row>
                    <a-radio :value="1">正确</a-radio>
                  </a-row>
                  <a-row>
                    <a-radio :value="2">错误</a-radio>
                  </a-row>
                </a-radio-group>
              </div> -->
            <!-- <div class="topic-analysis">
              <div class="tit">题目解析：</div>
              <div class="analysis-content">
                <marked-editor v-model="content" :preview="true" />
              </div>
            </div> -->
            <!-- 编程题 -->
            <div class="option" v-if="v.type === 5">
              <!-- <Programming></Programming> -->
            </div>
            <!-- 模型题 -->
            <div class="option" v-if="v.type === 6">
              <ModelQuestion></ModelQuestion>
            </div>
            <!-- SQL题 -->
            <div class="option" v-if="v.type === 7">
              <Sqldetail></Sqldetail>
            </div>
          </div>
          <div class="right">
            <a-checkbox v-model:checked="v.checked" @change="checkedHandle"></a-checkbox>
          </div>
        </div>
        <div class="info">
          <div class="left">
            <span class="user-info">
              <img :src="defaultAvatar" alt="" srcset="">
              <span class="user-name">小黄帽姑娘</span>
            </span>
            <span 
              class="level" 
              :style="{background: levelTypeList[v.level].bgColor,color: levelTypeList[v.level].color}"
            >{{levelTypeList[v.level].name}}</span>
            <span class="use">{{useTypeList[v.use].name}}</span>
            <span class="create-time">创建时间：2022 / 01 / 12</span>
            <span class="num">使用次数：10</span>
          </div>
          <div class="right">
            <span class="edit pointer btn" v-if="props.isOperation">编辑</span>
            <a-dropdown>
              <span class="iconfont icon-gengduotianchong btn pointer ope"></span>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <span @click="handleClick('delete')">删除</span>
                  </a-menu-item>
                  <a-menu-item>
                    <span @click="handleClick('public')">公开</span>
                  </a-menu-item>
                  <a-menu-item>
                    <span @click="handleClick('export')">导出</span>
                  </a-menu-item>
                  <a-menu-item>
                    <span @click="handleClick('move')">移动到</span>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <span class="iconfont icon-icon_function_zhankai pointer btn"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import defaultAvatar from 'src/assets/images/user/admin_p.png'
import Programming from 'src/components/TopicDisplay/detail/programming.vue'
import ModelQuestion from 'src/components/TopicDisplay/detail/ModelQuestion.vue'
import Sqldetail from 'src/components/TopicDisplay/detail/Sqldetail.vue'
import markedEditor from "src/components/editor/markedEditor.vue";
import { questionTypeList, levelTypeList, useTypeList } from "./../questionConfig"
interface Props {
  isOperation: boolean,
  questionList: any
}
const props = withDefaults(defineProps<Props>(), {
  isOperation: true,
  questionList: {}
});
const emit = defineEmits<{
  (e: "menuClick", val: string): void;
}>();
const content="zsfasd"
const checked = false
const questionList = reactive([
  {
    id: 1,
    type: 1,
    level: 1,
    use: 1,
    desc: '在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱， 设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向 进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。',
    analysis: 'fasdkfj;lqre',
    user_profile: {
      name: "小黄帽姑娘",
      portrait: ""
    },
    created_at: '',
  },
  {
    id: 2,
    type: 2,
    level: 2,
    use: 2,
    desc: '在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱， 设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向 进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。',
    analysis: 'fasdkfj;lqre',
    user_profile: {
      name: "小黄帽姑娘",
      portrait: ""
    },
    created_at: '',
  },
  {
    id: 3,
    type: 3,
    level: 3,
    use: 1,
    desc: '在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱， 设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向 进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。',
    analysis: 'fasdkfj;lqre',
    user_profile: {
      name: "小黄帽姑娘",
      portrait: ""
    },
    created_at: '',
  },
  {
    id: 4,
    type: 4,
    level: 1,
    use: 2,
    desc: '在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱， 设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向 进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。',
    analysis: 'fasdkfj;lqre',
    user_profile: {
      name: "小黄帽姑娘",
      portrait: ""
    },
    created_at: '',
  },
  {
    id: 5,
    type: 5,
    level: 2,
    use: 1,
    desc: '在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱， 设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向 进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。',
    analysis: 'fasdkfj;lqre',
    user_profile: {
      name: "小黄帽姑娘",
      portrait: ""
    },
    created_at: '',
  },
  {
    id: 61,
    type: 6,
    level: 3,
    use: 2,
    desc: '在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱， 设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向 进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。',
    analysis: 'fasdkfj;lqre',
    user_profile: {
      name: "小黄帽姑娘",
      portrait: ""
    },
    created_at: '',
  },
  {
    id: 1,
    type: 1,
    level: 1,
    use: 1,
    desc: '在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱， 设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向 进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。',
    analysis: 'fasdkfj;lqre',
    user_profile: {
      name: "小黄帽姑娘",
      portrait: ""
    },
    created_at: '',
  },
])
function checkedHandle() {
  console.log(props.questionList)
}
function handleClick(operateType:string) {
  emit('menuClick', operateType)
}
</script>


<style lang="less" scoped>
.question-lists {
  .list {
    background: var(--white);
    border-radius: 10px;
    box-shadow: 0px 1px 1px 0px var(--black-0-7);
    display: flex;
    margin-bottom: 16px;
    .question-type {
      margin-right: 18px;
      margin-top: 15px;
      .type {
        display: inline-block;
        width: 52px;
        height: 30px;
        line-height: 30px;
        background: #51b048;
        border-radius: 0px 15px 15px 0px;
        color: var(--white);
        padding-left: 10px;
      }
      .question-content {
        flex: 1;
      }
    }
    .question-content {
      padding: 20px 0;
      flex: 1;
      .question-main {
        display: flex;
        .left {
          flex: 1;
          .topic-analysis {
            padding: 16px 20px 0;
            margin-bottom: 16px;
            background-color: var(--lightgray-2);
            .tit {
              margin-bottom: 8px;
            }
            .analysis-content {
              .demo__container {
                :deep(.mark__container) {
                  background: var(--lightgray-2);
                  .markdown-body {
                    font-size: var(--base-font-size);
                    background-color: var(--lightgray-2);
                    padding: 0;
                  }
                }
              }
            }
          }
        }
        .right {
          margin: 0 20px;
        }
      }
      .info {
        height: 24px;
        line-height: 24px;
        color: var(--black-45);
        display: flex;
        justify-content: space-between;
        .user-info, .level, .use, .create-time {
          margin-right: 32px;
        }
        .user-info {
          img {
            margin-right: 6px;
            display: inline-block;
            width: 24px;
            height: 24px;
          }
        }
        .level {
          display: inline-block;
          padding: 0 18px;
          background-color: rgba(81,176,72,0.15);
          border-radius: 12px;
          color: #51b048;
        }
        .right {
          .btn {
            margin-right: 20px;
          }
          .edit, .ope {
            color: var(--brightBtn)
          }
        }
      }
    }
  }
}
</style>