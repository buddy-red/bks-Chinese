import { AppEvent } from "@/common/AppEvent";

export default {
  data() {
    return {
      routineMenuOptions: [
        {
          name: "复制名称",
          slug: 'copy-name',
          handler: this.routineMenuClick
        },
        {
          name: "隐藏",
          slug: 'hide-entity',
          handler: ({ item }) => {
            this.$root.$emit(AppEvent.hideEntity, item)
          }
        },
        {
          type: 'divider',
        },
        {
          name: "SQL: 创建",
          slug: 'sql-create',
          handler: this.routineMenuClick
        },


      ],

    }
  },
  computed: {
    tableMenuOptions() {
      return [
        {
          name: "浏览数据",
          slug: 'view-data',
          handler: ({ item }) => {
            this.$root.$emit(AppEvent.loadTable, { table: item })
          }
        },
        {
          name: "浏览结构",
          slug: 'view-structure',
          handler: ({ item }) => {
            this.$root.$emit(AppEvent.openTableProperties, { table: item })
          }
        },
        {
          name: "导出",
          slug: 'export',
          handler: ({ item }) => {
            this.trigger(AppEvent.beginExport, { table: item })
          }
        },
        {
          type: 'divider'
        },
        {
          name: "复制名称",
          slug: 'copy-name',
          handler: ({ item }) => {
            this.$copyText(item.name)
          }
        },
        {
          name: "隐藏",
          slug: 'hide-entity',
          handler: ({ item }) => {
            this.$root.$emit(AppEvent.hideEntity, item)
          }
        },

        {
          type: 'divider'
        },
        {
          name: "SQL: 创建",
          slug: 'sql-create',
          handler: ({ item }) => {
            this.$root.$emit('loadTableCreate', item)
          }
        },
        {
          name: "删除",
          slug: 'sql-drop',
          handler: ({ item }) => {
            console.log("删除?")
            this.$root.$emit(AppEvent.dropDatabaseElement, { item, action: 'drop' })
          }
        },
        {
          name: "截断",
          slug: 'sql-truncate',
          handler: ({ item }) => {
            this.$root.$emit(AppEvent.dropDatabaseElement, { item, action: 'truncate' })
          }
        },
      ]
    },
    schemaMenuOptions() {
      return [
        {
          name: "隐藏",
          slug: 'hide-schema',
          handler: ({ item }) => {
            this.$root.$emit(AppEvent.hideSchema, item.schema)
          },
        },
        {
          name: "删除",
          slug: 'sql-drop',
          handler: ({ item }) => {
            console.log("删除?")
            this.$root.$emit(AppEvent.dropDatabaseElement, {item, action: 'drop'})
          }
        },
        {
          name: "截断",
          slug: 'sql-truncate',
          handler: ({ item }) => {
            this.$root.$emit(AppEvent.dropDatabaseElement, {item, action: 'truncate'})
          }
        },
      ]
    }
  },
  methods: {
    routineMenuClick({ item, option }) {
      switch (option.slug) {
        case 'copy-name':
          return this.$copyText(item.name)
        case 'sql-create':
          return this.$root.$emit('loadRoutineCreate', item)
        default:
          break;
      }
    },
  }
}
