<template>
  <div v-if="false"></div>
</template>
<script lang="ts">
import { ipcRenderer } from 'electron'
import { SmartLocalStorage } from '@/common/LocalStorage'
import Vue from 'vue'
import Noty from 'noty'
import { AppEvent } from '@/common/AppEvent'

export default Vue.extend({
  data: () => {
    return {
      upsellNotification: new Noty({
        text: "👋 Beekeeper Studio 由一个小团队经营。购买完整版Beekeeper Studio以支持开发并获得更多功能。谢谢 ♥",
        timeout: false,
        queue: "upsell",
        layout: 'bottomRight',
        closeWith: ['button'],
        buttons: [
          Noty.button('关闭', 'btn btn-flat', () => Noty.closeAll('upsell')),
          Noty.button('快速上手', 'btn btn-primary', () => ipcRenderer.send(AppEvent.openExternally, ['https://beekeeperstudio.io/']))
        ]
      })
    }
  },
  mounted() {
    const today = new Date()
    const upgradeSuggested = SmartLocalStorage.getDate('ultimate-upsell')
    const lastWeek = new Date(today.getTime() - (28 * 24 * 60 * 60 * 1000))
    if (!upgradeSuggested || upgradeSuggested < lastWeek) {
      setTimeout(() => {
        this.upsellNotification.show()
        SmartLocalStorage.setDate('ultimate-upsell', today)
      }, (1000 * 60 * 5)) // 5 minutes
    }
  }
})
</script>
