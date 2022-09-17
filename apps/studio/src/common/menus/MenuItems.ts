import { IMenuActionHandler } from '@/common/interfaces/IMenuActionHandler';
import { IGroupedUserSettings } from '../appdb/models/user_setting';
import platformInfo from "../platform_info";

interface IMenuItems {
  [x: string]: Electron.MenuItemConstructorOptions
}

export function menuItems(actionHandler: IMenuActionHandler, settings: IGroupedUserSettings): IMenuItems {
  return {
    quit: {
      id: 'quit',
      label: platformInfo.isMac ? '退出' : '退出',
      accelerator: platformInfo.isMac ? 'CommandOrControl+Q' : undefined,
      click: actionHandler.quit
    },
    undo: {
      id: 'undo',
      label: "撤消",
      accelerator: "CommandOrControl+Z",
      click: actionHandler.undo
    },
    redo: {
      id: "redo",
      label: "重做",
      accelerator: platformInfo.isWindows ? 'Ctrl+Y' : 'Shift+CommandOrControl+Z',
      click: actionHandler.redo
    },
    cut: {
      id: 'cut',
      label: '剪切',
      accelerator: 'CommandOrControl+X',
      click: actionHandler.cut,
      registerAccelerator: false

    },
    copy: {
      id: 'copy',
      label: '复制',
      accelerator: 'CommandOrControl+C',
      click: actionHandler.copy,
      registerAccelerator: false
    },
    paste: {
      id: 'paste',
      label: '粘贴',
      accelerator: 'CommandOrControl+V',
      click: actionHandler.paste,
      registerAccelerator: false
    },

    selectAll: {
      id: 'select-all',
      label: '全选',
      accelerator: 'CommandOrControl+A',
      click: actionHandler.selectAll
    },
    // view
    zoomreset: {
      id: 'zoom-reset',
      label: "重置缩放",
      accelerator: "CommandOrControl+0",
      click: actionHandler.zoomreset
    },
    zoomin: {
      id: 'zoom-in',
      label: "放大",
      accelerator: 'CommandOrControl+=',
      click: actionHandler.zoomin
    },
    zoomout: {
      id: 'zoom-out',
      label: "缩小",
      accelerator: "CommandOrControl+-",
      click: actionHandler.zoomout
    },
    fullscreen: {
      id: 'fullscreen',
      label: "切换全屏",
      accelerator: platformInfo.isMac ? 'Shift+CommandOrControl+F' : 'F11',
      click: actionHandler.fullscreen
    },
    // help
    about: {
      id: 'about',
      label: '关于 Beekeeper Studio',
      click: actionHandler.about
    },
    devtools: {
      id: 'dev-tools',
      label: "显示开发工具",
      // @ts-ignore
      nonNativeMacOSRole: true,
      click: actionHandler.devtools
    },
    opendocs : {
      id: 'opendocs',
      label: '文档与技术支持',
      click: actionHandler.opendocs
    },
    reload: {
      id: 'reload-window',
      label: "开发强制重载",
      accelerator: "CommandOrControl+Shift+R",
      click: actionHandler.reload
    },
    newWindow: {
      id: 'new-window',
      label: "打开新窗口",
      accelerator: "CommandOrControl+Shift+N",
      click: actionHandler.newWindow
    },
    addBeekeeper: {
      id: 'add-beekeeper',
      label: "添加Beekeeper数据库",
      click: actionHandler.addBeekeeper
    },
    newTab: {
      id: "new-query-menu",
      label: "打开标签页",
      accelerator: "CommandOrControl+T",
      click: actionHandler.newQuery,
    },
    closeTab: {
      id: 'close-tab',
      label: "关闭标签页",
      accelerator: "CommandOrControl+W",
      click: actionHandler.closeTab,
      registerAccelerator: false
    },
    quickSearch: {
      id: 'go-to',
      label: "快捷搜索",
      accelerator: "CommandOrControl+P",
      registerAccelerator: false,
      click: actionHandler.quickSearch
    },
    disconnect: {
      id: 'disconnect',
      label: "断开连接",
      click: actionHandler.disconnect
    },
    sidebarToggle: {
      id: 'menu-toggle-sidebar',
      label: '切换侧边栏',
      accelerator: "Alt+S",
      click: actionHandler.toggleSidebar,
    },
    menuStyleToggle: {
      id: 'menu-style-toggle-menu',
      label: "菜单风格",
      submenu: [
        {
          id: "ms-native",
          type: 'radio',
          label: '原生',
          click: actionHandler.switchMenuStyle,
          checked: settings.menuStyle.value === 'native'
        },
        {
          id: "ms-client",
          type: 'radio',
          label: '客户端',
          click: actionHandler.switchMenuStyle,
          checked: settings.menuStyle.value === 'client'
        }
      ]
    },
    themeToggle: {
      id: "theme-toggle-menu",
      label: "界面主题",
      submenu: [
        {
          type: 'radio',
          label: "系统自动设置",
          click: actionHandler.switchTheme,
          checked: settings.theme.value === 'system'
        },
        {
          type: "radio",
          label: "白色",
          click: actionHandler.switchTheme,
          checked: settings.theme.value === 'light'
        },
        {
          type: 'radio',
          label: "深色",
          click: actionHandler.switchTheme,
          checked: settings.theme.value === 'dark'
        }
      ]
    }
  }
}
