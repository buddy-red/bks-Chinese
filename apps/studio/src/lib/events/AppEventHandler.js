import { AppEvent } from "../../common/AppEvent"

export default class {

  vueApp
  ipcRenderer

  constructor(ipcRenderer, vueApp) {
    this.vueApp = vueApp
    this.ipcRenderer = ipcRenderer
  }

  registerCallbacks() {
    this.ipcRenderer.on(AppEvent.settingsChanged, this.settingsChanged.bind(this))
    this.ipcRenderer.on(AppEvent.menuStyleChanged, this.menuStyle.bind(this))
    this.ipcRenderer.on(AppEvent.disconnect, this.disconnect.bind(this))
    this.ipcRenderer.on(AppEvent.beekeeperAdded, this.addBeekeeper.bind(this))
    this.forward(AppEvent.closeTab)
    this.forward(AppEvent.newTab)
    this.forward(AppEvent.toggleSidebar)
    this.forward(AppEvent.quickSearch)
  }

  forward(event) {
    const emit = () => {
      this.vueApp.$emit(event)
    }
    this.ipcRenderer.on(event, emit.bind(this))
  }

  closeTab() {
    this.vueApp.$emit(AppEvent.closeTab)
  }

  addBeekeeper() {
    this.vueApp.$noty.success("数据库已添加到您的已保存连接")
    this.vueApp.$store.dispatch('data/connections/load')
  }

  disconnect() {
    this.vueApp.$store.dispatch('disconnect')
  }

  settingsChanged() {
    this.vueApp.$store.dispatch("settings/initializeSettings")
  }

  menuStyle() {
    this.vueApp.$noty.success("重启保存更新")
  }
}
