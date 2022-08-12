<template>
  <div class="question-lists">
    <div class="list" v-for="v in props.questionList" :key="v.id">
      <div class="question-type">
        <span class="type" :style="{background: getTopicType[v.kind].bgColor}">{{getTopicType[v.kind].subname}}</span>
      </div>
      <div class="question-content">
        <div class="question-main">
          <div class="left">
            <div class="desc">{{v.question}}</div>
            <!-- <marked-editor v-model="content" :preview="true" /> -->
            <template v-if="v.visible">
            <!-- 选择题 --> 
            <!-- choice,judge,blank,short-answer,program,ai -->
            <div class="option" v-if="v.kind==='choice'">
              <a-checkbox-group v-model:value="v.choice_correct_options" style="width: 100%" :disabled="true">
                <a-row v-for="(option, o) in v.choice_options" :key="o">
                  <a-checkbox :value="optionType[o]">{{`${optionType[o]}、`}}</a-checkbox>
                  <div> {{option.content}}</div>
                </a-row>
              </a-checkbox-group>
            </div>
            <!-- 判断题 -->
            <div class="option" v-if="v.kind==='judge'">
              <a-radio-group v-model:value="v.answers" :disabled="true">
                <a-row>
                  <a-radio :value="'right'">正确</a-radio>
                </a-row>
                <a-row>
                  <a-radio :value="1">错误</a-radio>
                </a-row>
              </a-radio-group>
            </div>
            <!-- 填空题 -->
            <div class="option" v-if="v.kind==='blank'">
              <div class="tiankong flexCenter" v-for="(ans, a) in v.blank_correct" :key="a">
                <span class="tiankong-tit">{{`填空${a+1}`}}</span>
                <a-input v-model:value="v.answer" :disabled="true" />
              </div>
            </div>
            <!-- 简答题 -->
            <div class="option" v-if="v.kind==='short-answer'">
              <div class="jianda">
                <div class="jianda-tit">答案</div>
                <a-textarea v-model:value="v.answer" :disabled="true" placeholder="" :autoSize="{ minRows: 2, maxRows: 6 }" />
              </div>
            </div>
            <!-- 四种基本题型的答案和解析 -->
            <template v-if="['choice','judge','blank','short-answer'].includes(v.kind)">
              <div class="answer">
                <div class="answer-tit">答案：</div>
                <div class="answer-content" v-if="v.kind==='choice'">{{v.choice_correct_options.join('、')}}</div>
                <div class="answer-content" v-if="v.kind==='judge'">{{judgeOption[v.judge_correct]}}</div>
                <div class="answer-content" v-if="v.kind==='blank'">
                  <span v-for="(ans, a) in v.blank_correct" :key="a">填空{{a+1}}({{ans}}){{a===v.blank_correct.length-1?'':' / '}}</span>
                </div>
                <div class="answer-content" v-if="v.kind==='short-answer'">{{v.short_answer_reference}}</div>
              </div>
              <!-- 简答题关键字 -->
              <div class="keyword" v-if="v.kind==='short-answer'">
                <div class="keyword-tit">关键字：</div>
                <div class="keyword-content">{{v.short_answer_keys}}</div>
              </div>
              <div class="topic-analysis">
                <div class="tit">题目解析：</div>
                <div class="analysis-content">
                  <marked-editor v-model="v.question_analysis" :preview="true" />
                </div>
              </div>
            </template>
            <!-- 编程题 -->
            <div class="program" v-if="v.kind === 'program'">
              <Programming></Programming>
            </div>
            <!-- 模型题 -->
            <div class="model" v-if="v.kind === 'ai'">
              <ModelQuestion></ModelQuestion>
            </div>
            <!-- SQL题 -->
            <div class="sql" v-if="v.kind === 'sql'">
              <Sqldetail></Sqldetail>
            </div>
            <!-- 后面三种题型的试用 -->
            <div class="shiyong pointer" v-if="['program','ai','sql'].includes(v.kind)" @click="trialHandle(v)">试用</div>
            </template>
          </div>
          <div class="right">
            <!-- 已选择的在抽屉中禁用 -->
            <a-checkbox v-model:checked="v.checked" @change="checkedHandle" :disabled="inDrawer && v.checked"></a-checkbox>
          </div>
        </div>
        <div class="info">
          <div class="left">
            <span class="user-info" v-if="!isOperation">
              <img :src="defaultAvatar" alt="" srcset="">
              <span class="user-name">小黄帽姑娘</span>
            </span>
            <span 
              class="level" 
              :style="{background: levelTypeList[v.difficulty].bgColor,color: levelTypeList[v.difficulty].color}"
            >{{levelTypeList[v.difficulty].name}}</span>
            <span class="use">{{useTypeList[v.used_by].name}}</span>
            <span class="create-time">创建时间：{{moment(new Date()).format('YYYY/MM/DD')}}</span>
            <span class="num">使用次数：{{v.used_counts||0}}</span>
          </div>
          <div class="right">
            <template v-if="props.isOperation">
              <span class="edit pointer btn" @click="handleClick('edit', v)">编辑</span>
              <a-dropdown>
                <span class="iconfont icon-gengduotianchong btn pointer ope"></span>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <span @click="handleClick('delete', v)">删除</span>
                    </a-menu-item>
                    <a-menu-item>
                      <span @click="handleClick('public', v)">公开</span>
                    </a-menu-item>
                    <a-menu-item>
                      <span @click="handleClick('export', v)">导出</span>
                    </a-menu-item>
                    <a-menu-item>
                      <span @click="handleClick('move', v)">移动到</span>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
            <span 
              class="iconfont pointer btn" 
              @click="v.visible=!v.visible"
              :class="[v.visible?'icon-icon_function_zhankai-copy':'icon-icon_function_zhankai']"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from "vue-router";
import moment from 'moment';
import defaultAvatar from 'src/assets/images/user/admin_p.png'
import Programming from 'src/components/TopicDisplay/detail/programming.vue'
import ModelQuestion from 'src/components/TopicDisplay/detail/ModelQuestion.vue'
import Sqldetail from 'src/components/TopicDisplay/detail/Sqldetail.vue'
import markedEditor from "src/components/editor/markedEditor.vue";
import getTopicType from 'src/components/TopicDisplay/topictype'
import { levelTypeList, useTypeList } from 'src/components/TopicDisplay/configType'
interface Props {
  isOperation: boolean,
  questionList: any,
  inDrawer:boolean
}
const props = withDefaults(defineProps<Props>(), {
  isOperation: true,
  questionList: {},
  inDrawer: false
});
const emit = defineEmits<{
  (e: "menuClick", type: string, val: any): void;
}>();
const router = useRouter();
const route = useRoute();
const optionType:any=reactive(['A','B','C','D','E','F','G'])
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
function checkedHandle(e: any) {
  console.log(props.questionList)
  console.log(e)
}
function handleClick(operateType:string, val: any) {
  emit('menuClick', operateType, val)
}
function trialHandle(val:any) {
  let path = {
    'program': '/programAnswer',
    'ai': './QuestionBank/trialModel'
  }
  const {href} = router.resolve({
    path: path[val.kind],
    query: {
      id: val.id
    }
  })
  window.open(href,'_blank')
}

const judgeOption = {
  right: '正确',
  lll: '错误'
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
          .answer {
            color: var(--brightBtn);
            display: flex;
            font-weight: bold;
            padding: 16px 0;
            .answer-tit {
              width: 45px;
            }
            .answer-content {
              flex: 1;
            }
          }
          .topic-analysis {
            // padding: 16px 20px 0;
            // margin-bottom: 16px;
            background-color: var(--lightgray-2);
            border-bottom: 1px solid var(--black-15);
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
          .keyword {
            display: flex;
            color: #3094EF;
            padding-bottom: 16px;
            // margin-top: 16px;
            // border-bottom: 1px solid var(--black-15);
            .keyword-tit {
              width: 58px;
            }
            .keyword-content {
              flex: 1;
            }
          }
          .option {
            padding-bottom: 12px;
            border-bottom: 1px solid var(--black-15);
            padding-top: 6px;
            .ant-row,.tiankong,.jianda{
              padding: 6px 0;
            }
            .jianda {
              display: flex;
              .jianda-tit {
                width: 30px;
                margin-right: 18px;
              }
            }
            .tiankong {
              .tiankong-tit {
                width: 50px;
              }
              .ant-input {
                width: 250px;
              }
            }
          }
          .shiyong {
            width: 100%;
            height: 38px;
            line-height: 38px;
            text-align: center;
            background: var(--black-0-7);
            border-radius: 19px;
            margin: 10px 0;
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
        margin-top: 16px;
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
            &.iconfont:hover  {
              color: var(--primary-color);
            }
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