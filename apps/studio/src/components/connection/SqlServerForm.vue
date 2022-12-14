<template>
  <div class="with-connection-type">
    <common-server-inputs :config="config">
    <div class="advanced-connection-settings">
      <h4 class="advanced-heading">SQL Server选项</h4>
      <div class="advanced-body">
        <div class="form-group">
          <label for="domain">
            域名
            <i class="material-icons" v-tooltip="'将“域名”设置为使用Windows集成身份验证(NTLM)登录'">help_outlined</i>
            </label>
          <input type="text" v-model="config.domain" class="form-control">
        </div>
        <div class="form-group">
          <label for="trustServerCertificate" class="checkbox-group">
            <input type="checkbox" name="trustServerCertificate" v-model="config.trustServerCertificate" id="trustServerCertificate">
            信任服务器证书?
            <i class="material-icons" v-tooltip="'将其用于本地开发服务器和自签名证书 ssl -> rejectUnauthorized如果启用ssl，则覆盖此设置。'">help_outlined</i>
          </label>
        </div>

      </div>
    </div>

    </common-server-inputs>
    <common-advanced :config="config"></common-advanced>
  </div>
</template>

<script>

  import CommonServerInputs from './CommonServerInputs'
  import CommonAdvanced from './CommonAdvanced'

  export default {
    components: { CommonServerInputs, CommonAdvanced },
    props: ['config']

  }
</script>
