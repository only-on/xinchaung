<template>
  <div class="forumn-top">
		<div class="top-content">
			<div class="search_input">
				<a-input-search v-model:value="ForumSearch.title" placeholder="请输入搜索关键词" @search="search" />
			</div>
			<div class="label-list">
				<span class="label-btn" :class="{'current': item.id === ForumSearch.type}" v-for="item in labelList" :key="item.id" @click="changeLabel(item.id)">{{item.name}}</span>
			</div>
		</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, Ref, inject, watch, toRefs, computed } from 'vue'
import { IForumSearch } from './../forumnTyping.d'
export default defineComponent({
  name: 'ForumTop',
  components: {
  },
	emits: ['search'],
  setup: (props, { emit }) => {
		let ForumSearch = reactive<IForumSearch>({
			title: '',
			type: 1
		})
		let labelList: Ref = computed(() => inject('labelList'))
		function search() {
			emit('search', ForumSearch)
		}
		function changeLabel(val: number) {
			ForumSearch.type = val
			emit('search', ForumSearch)
		}

    onMounted(() => {
    
    })
    return {
			...toRefs(props),
			ForumSearch,
			search,
			labelList,
			changeLabel
		};
  },
})
</script>

<style scoped lang="less">
.forumn-top {
	width: 100%;
  height: 70px;
	background-color: var(--lightgray-3);
	.top-content {
  	width: var(--center-width);
		height: 100%;
  	margin: 0 auto;
		padding: 18px 0;
		display: flex;
		.search_input {
			width: 273px;
			margin-right: 88px;
			.ant-input-search {
				height: 34px;
				border: 1px solid #e6e6e6;
				border-radius: 18px;
			}
		}
		.label-list {
			margin: 2px 0;
		}
	}
}
</style>
