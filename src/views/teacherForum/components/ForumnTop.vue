<template>
  <div class="forumn-top">
		<div class="top-content">
			<div class="search_input">
				<a-input-search v-model:value="ForumSearch.title" placeholder="请输入搜索关键词" @search="search" />
			</div>
			<div class="label-list">
				<span :class="{'label': true, 'current': item.id === ForumSearch.type}" v-for="item in labelList" :key="item.id" @click="changeLabel(item.id)">{{item.name}}</span>
			</div>
		</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, Ref, inject, watch, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router';
export default defineComponent({
  name: 'ForumTop',
  components: {
  },
	props: {
		type: String
	},
  setup: (props, { emit }) => {
    const route = useRoute();
		let ForumSearch = reactive<IForumSearch>({
			title: '',
			type: 1
		})
		let labelList: Ref = ref(inject('labelList'))
		function search() {

		}
		function changeLabel(val: number) {
			ForumSearch.type = val
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
interface IForumSearch {
	title: string
	type: number
}
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
			.label {
				display: inline-block;
				height: 30px;
				line-height: 30px;
				border-radius: 15px;
				padding: 0 20px;
				margin-right: 14px;
				color: var(--black-65);
				&.current {
					background-color: var(--orange-1);
					color: var(--white-100);
				}
			}
		}
	}
}
</style>
