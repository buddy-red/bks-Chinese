import { AppEvent } from "@/common/AppEvent";

export default {
  data() {
    return {
      routineMenuOptions: [
        {
          name: "Copy Name",
          slug: 'copy-name',
          handler: this.routineMenuClick
        },
        {
          name: "Hide",
          slug: 'hide-entity',
          handler: ({ item }) => {
            this.$root.$emit(AppEvent.hideEntity, item)
          }
        },
        {
          type: 'divider',
        },
        {
          name: "SQL: Create",
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
          name: "View Data",
          slug: 'view-data',
          handler: ({ item }) => {
            this.$root.$emit(AppEvent.loadTable, { table: item })
          }
        },
        {
          name: "View Structure",
          slug: 'view-structure',
          handler: ({ item }) => {
            this.$root.$emit(AppEvent.openTableProperties, { table: item })
          }
        },
        {
          name: "Export",
          slug: 'export',
          handler: ({ item }) => {
            this.trigger(AppEvent.beginExport, { table: item })
          }
        },
        {
          type: 'divider'
        },
        {
          name: "Copy Name",
          slug: 'copy-name',
          handler: ({ item }) => {
            this.$copyText(item.name)
          }
        },
        {
          name: "Hide",
          slug: 'hide-entity',
          handler: ({ item }) => {
            this.$root.$emit(AppEvent.hideEntity, item)
          }
        },

        {
          type: 'divider'
        },
        {
          name: "SQL: Create",
          slug: 'sql-create',
          handler: ({ item }) => {
            this.$root.$emit('loadTableCreate', item)
          }
        },
        {
          name: "Drop",
          slug: 'sql-drop',
          handler: ({ item }) => {
            console.log("Drop?")
            this.$root.$emit(AppEvent.dropDatabaseElement, { item, action: 'drop' })
          }
        },
        {
          name: "Truncate",
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
          name: "Hide",
          slug: 'hide-schema',
          handler: ({ item }) => {
            this.$root.$emit(AppEvent.hideSchema, item.schema)
          },
        },
        {
          name: "Drop",
          slug: 'sql-drop',
          handler: ({ item }) => {
            console.log("Drop?")
            this.$root.$emit(AppEvent.dropDatabaseElement, {item, action: 'drop'})
          }
        },
        {
          name: "Truncate",
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
