<template>
  <div class="progress-bar">
    <div class="flex-col layout-center">
      <span>{{message || '加载...'}}</span>
      <a @click.prevent="$emit('cancel')" title="取消查询执行(Esc)" class="cancel-query btn btn-flat">取消</a>
    </div>
  </div>
</template>
<script type="text/javascript">
  export default {
    props: ['message']
  }
</script>
