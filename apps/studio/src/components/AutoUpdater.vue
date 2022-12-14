<template>
  <div></div>
</template>

<script type="text/javascript">
import { ipcRenderer } from 'electron'
import Noty from 'noty'

import {AppEvent} from '../common/AppEvent'

export default {
  data() {
    return {
      manualNotification: new Noty({
        text: "有新版本可用，可立即下载更新。",
        layout: 'bottomRight',
        timeout: false,
        closeWith: 'button',
        buttons: [ 
          Noty.button('现在不行', 'btn btn-flat', () => {
            this.manualNotification.close();
          }),
          Noty.button('下载', 'btn btn-primary', this.linkToDownload)
        ],
        queue: 'download'
      }),
      downloadNotification: new Noty({
        text: '已有新版本，要下载吗?',
        layout: 'bottomRight',
        timeout: false,
        closeWith: 'button',
        buttons: [
          Noty.button('现在不行', 'btn btn-flat', () => {
              this.downloadNotification.close();
          }),
          Noty.button('下载', 'btn btn-primary', this.triggerDownload)
        ],
        queue: 'download'
      }),
      installNotification: new Noty({
        text: "已下载更新，请重启巴豆！",
        layout: 'bottomRight',
        timeout: false,
        closeWith: 'button',
        buttons: [
          Noty.button('稍后重启', 'btn btn-flat', () => {
            this.installNotification.close()
          }),
          Noty.button('立即重启', 'btn btn-primary', this.triggerInstall)
        ],
        queue: 'download'
      })

    }
  },
  computed: {
  },
  mounted() {
    ipcRenderer.on('update-available', this.notifyUpdate)
    ipcRenderer.on('manual-update', this.notifyManual)
    ipcRenderer.on('update-downloaded', this.notifyDownloaded)
    ipcRenderer.send('updater-ready')
  },
  methods: {
    closeAll() {
      Noty.closeAll('download')
    },
    triggerDownload() {
      ipcRenderer.send('download-update')
      this.downloadNotification.close()
      this.$noty.info("请稍等! 正在下载更新...")
    },
    notifyManual() {
      this.closeAll()
      this.manualNotification.show()
    },
    linkToDownload() {
      ipcRenderer.send(AppEvent.openExternally, ["https://github.com/buddy-red/bks-Chinese"])
    },
    triggerInstall() {
      ipcRenderer.send('install-update')
    },
    notifyUpdate() {
      this.closeAll()
      this.downloadNotification.show()
    },
    notifyDownloaded() {
      this.closeAll()
      this.installNotification.show();
    }
  }
}

</script>
