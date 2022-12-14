<template>
  <a class="statusbar-item hoverable"
    @click.prevent="fetchTotalRecords"
    v-tooltip="hoverTitle"
  >
    <i class="material-icons">tag</i>
    <span v-if="fetchingTotalRecords">加载...</span>
    <span v-else-if="error">error</span>
    <span v-else-if="totalRecords === null">未知</span>
    <span v-else>~{{totalRecords.toLocaleString()}}</span>
  </a>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: ['table', 'connection'],
  data: () => ({
    totalRecords: null,
    fetchingTotalRecords: false,
    error: null
  }),
  computed: {
    hoverTitle() {
      if (this.error) return this.error.message

      if (this.totalRecords === null)
        return '点击获取总记录数'

      return `大约 ${this.totalRecords} 条记录`
    }
  },
  methods: {
    async fetchTotalRecords() {
      this.fetchingTotalRecords = true
      try {
        this.error = null
        this.totalRecords = await this.connection.getTableLength(this.table.name, this.table.schema)
      } catch (ex) {
        console.error("不能获取总记录", ex)
        this.totalRecords = 0
        this.error = ex
      } finally {
        this.fetchingTotalRecords = false
      }
    },
  }
})
</script>
