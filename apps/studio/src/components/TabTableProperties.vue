<template>
  <div class="table-properties">
    <div v-if="error" class="alert-wrapper">
      <div class="alert alert-danger">
        {{error.message}}
      </div>
    </div>
    <template  v-else>
      <div class="table-properties-header">
        <div class="nav-pills" v-if="pills.length > 1">
          <a
            v-for="(pill) in pills"
            :key="pill.id"
            class="nav-pill"
            :class="{active: pill.id === activePill}"
            :title="pill.dirty ? '未保存更改' : ''"
            @click.prevent="activePill = pill.id"
          >
            {{pill.name}} {{pill.dirty ? '*' : ''}}
          </a>
        </div>
      </div>
      <div v-if="loading" class="table-properties-loading">
        <x-progressbar></x-progressbar>
      </div>
      <div class="table-properties-wrap" v-if="table && !loading">
        <component
          class="schema-builder"
          :is="pill.component"
          :table="table"
          :primaryKeys="primaryKeys"
          :tabState="pill"
          :properties="properties"
          :connection="connection"
          :active="pill.id === activePill && active"
          v-show="pill.id === activePill"
          v-for="(pill) in pills"
          :key="pill.id"
          @actionCompleted="refresh"
          @refresh="refresh"
        >
          <template v-slot:footer>
            <div class="statusbar-info col flex expand">
              <x-button @click.prevent="openData" class="btn btn-flat btn-icon end" title="浏览数据">
                数据 <i class="material-icons">north_east</i>
              </x-button>
              <template v-if="properties">
                <table-length :table="table" :connection="connection" />
                <span class="statusbar-item" v-if="humanSize !== null" :title="`数据表大小 ${humanSize}`">
                  <i class="material-icons">aspect_ratio</i>
                  <span>{{humanSize}}</span>
                </span>
                <span class="statusbar-item" v-if="humanIndexSize !== null" :title="`索引大小  ${humanIndexSize}`">
                  <i class="material-icons">location_searching</i>
                  <span>{{humanIndexSize}}</span>
                </span>
                <span class="statusbar-item" v-if="!editable" title="仅能编辑的数据表">
                  <i class="material-icons-outlined">report_problem</i> 只读
                </span>
              </template>
            </div>
          </template>

          <template v-slot:actions >
            <x-button class="actions-btn btn btn-flat" title="Actions">
              <i class="material-icons">settings</i>
              <i class="material-icons">arrow_drop_down</i>
              <x-menu>
                <x-menuitem @click.prevent="refresh">
                  <x-label>刷新</x-label>
                </x-menuitem>
                <x-menuitem @click.prevent="openTable">
                  <x-label>浏览数据</x-label>
                </x-menuitem>
                <hr v-if="dev">
                <x-menuitem v-if="dev" @click.prevent="triggerError">
                  <x-label>[DEV]切换错误</x-label>
                </x-menuitem>
                <x-menuitem v-if="dev" @click.prevent="loading = !loading">
                  <x-label>[DEV]切换加载</x-label>
                </x-menuitem>
              </x-menu>
            </x-button>
          </template>
        </component>
      </div>
    </template>
  </div>
</template>

<script>
import {Tabulator} from 'tabulator-tables'
import Statusbar from './common/StatusBar'
import TableSchemaVue from './tableinfo/TableSchema.vue'
import TableIndexesVue from './tableinfo/TableIndexes.vue'
import TableRelationsVue from './tableinfo/TableRelations.vue'
import TableTriggersVue from './tableinfo/TableTriggers.vue'
import TableLength from '@/components/common/TableLength.vue'
import { format as humanBytes } from 'bytes'
import platformInfo from '../common/platform_info'
import { AppEvent } from '@/common/AppEvent'
import { mapState } from 'vuex'
import rawLog from 'electron-log'

const log = rawLog.scope('TabTableProperties')
export default {
  props: ["connection", "tabId", "active", "tab", "table"],
  components: { Statusbar, TableLength },
  data() {
    return {
      initialized: false,
      dev: platformInfo.isDevelopment,
      loading: true,
      error: null,
      primaryKeys: [],
      properties: {},
      dirtyPills: {},
      rawPills: [
        {
          id: 'schema',
          name: "Columns",
          needsProperties: false,
          component: TableSchemaVue,
          dirty: false,
        },
        {
          id: 'indexes',
          name: "Indexes",
          tableOnly: true,
          needsProperties: true,
          component: TableIndexesVue,
          dirty: false,
        },
        {
          id: 'relations',
          name: "Relations",
          tableOnly: true,
          needsProperties: true,
          component: TableRelationsVue,
          dirty: false,
        },
        {
          id: 'triggers',
          name: "Triggers",
          tableOnly: true,
          needsProperties: true,
          component: TableTriggersVue,
          dirty: false
        }
      ],
      activePill: 'schema', // the only tab that is always there.
      tableSchema: null,
      tableIndexes: null,
      tableRelations: null,
      tableTriggers: null,
      actualTableHeight: "100%",
    }
  },
  watch: {
    unsavedChanges() {
      this.tab.unsavedChanges = this.unsavedChanges
    },
    shouldInitialize() {
      if (this.shouldInitialize) this.initialize()
    }
  },
  computed: {
    ...mapState(['tables', 'tablesInitialLoaded']),
    shouldInitialize() {
      // TODO (matthew): Move this to the wrapper TabWithTable
      return this.tablesInitialLoaded && this.active && !this.initialized
    },
    editable() {
      return this.table.entityType === 'table' && !!this.primaryKeys.length
    },
    unsavedChanges() {
      return this.pills.filter((p) => p.dirty).length > 0
    },
    pills() {
      if (!this.table) return []
      const isTable = this.table.entityType === 'table'
      return this.rawPills.filter((p) => {

        if (!this.properties) {
          if (p.needsProperties) {
            return false
          }
        }

        if (p.needsProperties && !this.connection.supportedFeatures().properties) {
          return false
        }
        if(p.tableOnly) {
          return isTable
        }
        return true
      })
    },
    humanSize() {
      return humanBytes(this.properties.size)
    },
    humanIndexSize() {
      return humanBytes(this.properties.indexSize)
    },
  },
  methods: {
    close() {
      this.$root.$emit(AppEvent.closeTab)
    },
    openData() {
      this.$root.$emit(AppEvent.loadTable, { table: this.table })
    },
    triggerError() {
      // this is for dev only
      this.error = new Error("出错")
    },
    async fetchTotalRecords() {
      this.fetchingTotalRecords = true
      try {
        this.totalRecords = await this.connection.getTableLength(this.table.name, this.table.schema)
      } catch (ex) {
        console.error("不能获取总记录", ex)
        this.totalRecords = 0
      } finally {
        this.fetchingTotalRecords = false
      }
    },
    async initialize() {
      log.info("initializing")
      this.initialized = true
      await this.refresh()
    },
    async refresh() {
      if (!this.table) return;
      log.info("refresh")
      this.loading = true
      this.error = null
      // this.properties = null
      try {
        await this.$store.dispatch('updateTableColumns', this.table)
        this.primaryKeys = await this.connection.getPrimaryKeys(this.table.name, this.table.schema)
        if (this.table.entityType === 'table') {
          this.properties = await this.connection.getTableProperties(this.table.name, this.table.schema)
        }
        this.loading = false
      } catch (ex) {
        this.error = ex
      } finally {
        log.info("setting loaded = false")
        this.loading = false
      }
    },
    async openTable() {
      this.$root.$emit("loadTable", { table: this.table })
    }
  },
  async mounted() {
    if (this.shouldInitialize) this.initialize()
  }
}
</script>
