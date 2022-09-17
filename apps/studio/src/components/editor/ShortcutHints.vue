<template>
  <div class="shortcuts">
    <div class="shortcut-item">
      <div>快捷搜索</div>
      <div class="shortcut" v-if="$config.isMac"><span>⌘</span><span>P</span></div>
      <div class="shortcut" v-else><span>Ctrl</span><span>P</span></div>
    </div>
    <div class="shortcut-item">
      <div>运行</div>
      <div class="shortcut" v-if="$config.isMac"><span>⌘</span><span>回车键</span></div>
      <div class="shortcut" v-else><span>Ctrl</span><span>回车键</span></div>
    </div>
    <div class="shortcut-item">
      <div>运行当前</div>
      <div class="shortcut" v-if="$config.isMac"><span>⌘</span><span>⇧</span><span>回车键</span></div>
      <div class="shortcut" v-else><span>Ctrl</span><span>Shift</span><span>Enter</span></div>
    </div>
    <div class="shortcut-item">
      <div>打开新窗口</div>
      <div class="shortcut" v-if="$config.isMac"><span>⌘</span><span>⇧</span><span>N</span></div>
      <div class="shortcut" v-else><span>Ctrl</span><span>Shift</span><span>N</span></div>
    </div>
    <div class="shortcut-item">
      <div>打开标签页</div>
      <div class="shortcut" v-if="$config.isMac"><span>⌘</span><span>T</span></div>
      <div class="shortcut" v-else><span>Ctrl</span><span>T</span></div>
    </div>
    <div class="shortcut-item">
      <div>关闭标签页</div>
      <div class="shortcut" v-if="$config.isMac"><span>⌘</span><span>W</span></div>
      <div class="shortcut" v-else><span>Ctrl</span><span>W</span></div>
    </div>
    <!-- <div class="shortcut-item">
      <div>Shortcut</div>
      <div v-if="$config.isMac"><span class="badge">⌘ + P</span></div>
      <div v-else><span class="badge">⌃ + P</span></div>
    </div> -->
  </div>
</template>
<script type="text/javascript">
  export default {
    data() {
      return {

      }
    },
  }
</script>
