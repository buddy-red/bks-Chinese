<template>
  <div class="with-connection-type">
    <common-server-inputs :config="config"></common-server-inputs>

    <div class="advanced-connection-settings">
      <h4 class="advanced-heading flex" :class="{enabled: iamAuthenticationEnabled}">
        <span class="expand">IAM身份验证</span>
        <x-switch @click.prevent="toggleIAMAuthentication" :toggled="iamAuthenticationEnabled"></x-switch>
      </h4>
      <div class="advanced-body" v-show="iamAuthenticationEnabled">
        <div class="row gutter">
          <div class="alert alert-info">
            <i class="material-icons-outlined">info</i>
            <div>使用AWS IAM身份验证连接临时集群凭据<a href="https://docs.aws.amazon.com/redshift/latest/mgmt/generating-user-credentials.html">了解更多</a></div>
          </div>
        </div>

        <div class="form-group">
          <label for="AWS Region">
            AWS区域
          </label>
          <input type="text" class="form-control" v-model="config.redshiftOptions.awsRegion"/>
        </div>
        <div class="form-group">
          <label for="Access Key ID">
            Access Key ID
          </label>
          <input type="text" class="form-control" v-model="config.redshiftOptions.accessKeyId"/>
        </div>
        <div class="form-group">
          <label for="Secret Access Key">
            Secret Access Key
          </label>
          <input type="password" class="form-control" v-model="config.redshiftOptions.secretAccessKey"/>
        </div>
        <div class="form-group">
          <label for="Cluster Identifier">集群标识符</label>
          <input type="text" class="form-control" v-model="config.redshiftOptions.clusterIdentifier"/>
        </div>
        <div class="form-group">
          <label for="Database Group">数据库组 <span class="hint">(选填)</span></label>
          <input type="text" class="form-control" v-model="config.redshiftOptions.databaseGroup"/>
        </div>
        <div class="form-group">
          <label for="Token Duration">令牌时长 <span class="hint">(选填，单位秒)</span></label>
          <input type="text" class="form-control" v-model="config.redshiftOptions.tokenDurationSeconds"/>
        </div>
      </div>
    </div>

    <common-advanced :config="config"></common-advanced>
  </div>
</template>
<script>

  import CommonServerInputs from './CommonServerInputs'
  import CommonAdvanced from './CommonAdvanced'

  export default {
    components: { CommonServerInputs, CommonAdvanced },
    data() {
      return {
        iamAuthenticationEnabled: this.config.redshiftOptions?.iamAuthenticationEnabled || false
      }
    },
    methods: {
      toggleIAMAuthentication() {
        this.config.redshiftOptions.iamAuthenticationEnabled = this.iamAuthenticationEnabled = !this.iamAuthenticationEnabled
      }
    },
    props: ['config'],
  }
</script>