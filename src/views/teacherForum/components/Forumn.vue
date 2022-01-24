<template>
	<div class="forumn-list">
		<div class="lists" v-for="item in forumnList" :key="item.id">
			<forumn-list :item="item"></forumn-list>
		</div>
	</div>
	<div class="forumn-pagination">
		111
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, Ref, inject, watch, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import ForumnList from './ForumnList.vue'
export default defineComponent({
  name: 'Forum',
  components: {
		ForumnList
  },
	props: {
		type: String,
		forumnList: {
			type: Array 
		}
	},
	setup: (props, { emit }) => {
		return {
			...toRefs(props)
		}
	}
})
</script>

<style lang="less" scoped>
.forumn-list {
	.lists {
		margin-top: 32px;
	}
}
.forumn-pagination {

}
</style>