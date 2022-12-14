<template>
    <div class="import-button">
      <a
        class="btn btn-link btn-small"
        @click.prevent="$modal.show('import-modal')"
      ><slot></slot></a>
      <portal to="modals">
        <modal
          class="vue-dialog beekeeper-modal import-modal"
          name="import-modal"
          height="auto"
          :scrollable="true"
          @opened="$refs.importInput.select()"
        >
          <form @submit.prevent="importFromUrl">
            <div class="dialog-content">
              <div class="dialog-c-title">自网址导入</div>
              <div v-if="importError" class="alert alert-danger">{{importError}}</div>
              <div class="form-group">
                <label for="url">粘贴网址</label>
                <input class="form-control" ref="importInput" type="text" v-model="url">
              </div>
            </div>
            <div class="vue-dialog-buttons">
              <button class="btn btn-flat" type="button" @click.prevent="$modal.hide('import-modal')">取消</button>
              <button class="btn btn-primary" type="submit" @click.prevent="importFromUrl">导入</button>
            </div>
          </form>
        </modal>
      </portal>
    </div>
</template>
<script>
export default {
    props: ['config'],
    data() {
      return {
        importError: null,
        url: null
      }
    },
    methods: {
      importFromUrl() {
        if(this.config.parse(this.url)) {
          if(!this.config.connectionType) {
            this.importError = "无法从网址确定数据库类型"
          } else {
            this.url = null
            this.$modal.hide('import-modal')
          }
        } else {
          this.importError = "无法解析网址"
        }
      },
    }
}
</script>
