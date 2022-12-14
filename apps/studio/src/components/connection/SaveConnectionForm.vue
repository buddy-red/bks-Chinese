<template>
  <div class="save-connection expand">
    <h3 class="dialog-c-title">保存连接</h3>
    <div class="form-group">
      <input class="form-control" ref="nameInput" @keydown.enter.prevent.stop="save" type="text" v-model="config.name" placeholder="连接名称">
    </div>

    <div class="row flex-middle">
      <label class="checkbox-group" for="rememberPassword">
        <input class="form-control" id="rememberPassword" type="checkbox" name="rememberPassword" v-model="config.rememberPassword">
        <span>保存密码</span>
        <i class="material-icons" v-tooltip="'Passwords are encrypted when saved'">help_outlined</i>
      </label>
      <span class="expand"></span>
      <ColorPicker :value="config.labelColor" v-model="config.labelColor"></ColorPicker>
    </div>

    <div class="save-actions">
      <button v-if="canCancel" class="btn btn-flat" @click.prevent="$emit('cancel')">取消</button>
      <button class="btn btn-primary save" @click.prevent="save">保存</button>
    </div>
  </div>
</template>
<script>
import ColorPicker from '../common/form/ColorPicker';
export default {
  components: { ColorPicker },
  props: ['config', 'canCancel', 'selectInput'],
  mounted(){
    if(this.selectInput) {
      const $input = this.$refs.nameInput
      $input.focus()
      const len = $input.value.length
      $input.setSelectionRange(len, len)
    }
  },
  methods: {
    save() {
      this.$emit('save', this.config)
    }
  }
}
</script>
