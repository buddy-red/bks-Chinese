<template>
  <div class="with-connection-type">
    <common-server-inputs :config="config"></common-server-inputs>
    <div class="form-group" v-if="isCockroach">
      <label for="Cluster ID">
        CockroachDB云服务集群ID
        <i
          class="material-icons"
          v-tooltip="`转向线上CockroachDB -> 连接 -> 仅参数 -> 复制自 '选项'`"
          >help_outlined</i>
      </label>
      <input type="text" class="form-control" v-model="config.options.cluster">
    </div>
    <common-advanced :config="config"></common-advanced>
  </div>
</template>

<script>

  import CommonServerInputs from './CommonServerInputs'
  import CommonAdvanced from './CommonAdvanced'

  export default {
    components: { CommonServerInputs, CommonAdvanced },
    props: ['config'],
    computed: {
      isCockroach() {
        return this.config.connectionType === 'cockroachdb'
      }
    }

  }
</script>
