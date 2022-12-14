<template>
  <div class="sqlite-form">
    <div class="host-port-user-password">
      <div class="row gutter">
        <div class="col form-group">
          <label for="Database" required>数据库文件</label>
          <file-picker v-model="config.defaultDatabase"></file-picker>
          <div class="alert alert-warning" v-if="$config.isSnap">
            <i class="material-icons">error_outline</i>
            <div>
              嘿Snap用户！如果你想在外部驱动器上使用sqlite数据库，你需要给本系统一些额外权限
              <external-link :href="snap">了解更多</external-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import FilePicker from '@/components/common/form/FilePicker'
  export default {
    props: ['config'],
    components: {
      FilePicker
    },
    data() {
      return {
        snap: "https://github.com/buddy-red/bks-Chinese"
      }
    }
  }
</script>
