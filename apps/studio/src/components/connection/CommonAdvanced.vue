<template>
  <div class="advanced-connection-settings" v-show="!config.socketPathEnabled">
    <h4 class="advanced-heading flex" :class="{enabled: config.sshEnabled}">
      <span class="expand">SSH隧道</span>
      <x-switch @click.prevent="config.sshEnabled = !config.sshEnabled" :toggled="config.sshEnabled"></x-switch>
    </h4>
    <div class="advanced-body" v-show="config.sshEnabled">
      <div class="row gutter">
        <div class="alert alert-info">
          <i class="material-icons-outlined">info</i>
          <div>要使SSH隧道正常工作，必须在ssh服务器配置中将AllowTcpForwarding设置为“yes”。</div>
        </div>
      </div>
      <div class="row gutter">
        <div class="col s9 form-group">
          <label for="sshHost">SSH主机名</label>
          <input type="text" v-model="config.sshHost">
        </div>
        <div class="col s3 form-group">
          <label for="sshPort">端口</label>
          <input type="number" v-model.number="config.sshPort">
        </div>
      </div>
      <div class="row gutter">
        <div class="col s8 form-group">
          <label for="bastionHost">堡垒主机(跳板主机)</label>
          <input class="form-control" v-model="config.sshBastionHost" type="text" name="bastionHost">
        </div>
        <div class="col s4 form-group">
          <label for="sshKeepaliveInterval">
            保活间隔 <i class="material-icons" style="padding-left: 0.25rem"
            v-tooltip="'闲置多少秒后对服务器发送ping包，以防止因不活跃而断开连接 <br/>(例如：ssh/config 中的<code> ServerAliveInterval 60 </code>)'"
            >help_outlined</i>
          </label>
          <input type="number" v-model.number="config.sshKeepaliveInterval" name="sshKeepaliveInterval" placeholder="(in seconds)">
        </div>
      </div>
      <div class="form-group">
        <label>SSH身份验证</label>
        <select class="form-control" v-model="config.sshMode">
          <option v-for="option in sshModeOptions" :key="option.mode" :value="option.mode">{{option.label}}</option>
        </select>
      </div>

      <div v-if="config.sshMode === 'agent'" class="agent flex-col">
        <div class="form-group">
          <label for="sshUsername">SSH用户名</label>
          <input class="form-control" type="text" v-model="config.sshUsername">
        </div>
        <div class="alert alert-warning" v-if="$config.isSnap">
          <i class="material-icons">error_outline</i>
          <div>
            由于Snap应用程序的安全模型，本系统的Snap版本无法进行SSH代理转发。
            <external-link :href="enableSshLink">了解更多</external-link>
          </div>
        </div>
        <div v-else-if="$config.sshAuthSock" class="alert alert-success">
          <i class="material-icons">check</i>
          <div>我们找到了您的SSH代理。您已就绪!</div>
        </div>
        <div v-else-if="$config.isWindows" class="alert alert-info">
          <i class="material-icons-outlined">info</i>
          <div>我们没有发现*nix ssh-agent正在运行，所以我们将尝试使用PuTTY代理，即pageant。</div>
        </div>
        <div v-else class="alert alert-warning">
          <i class="material-icons">error_outline</i>
          <div>您似乎没有运行SSH代理</div>
        </div>
      </div>

      <div v-if="config.sshMode === 'keyfile'" class="private-key gutter">
        <div class="row">
          <div class="col">
            <div class="form-group">
              <label for="sshUsername">SSH用户名</label>
              <input class="form-control" type="text" v-model="config.sshUsername">
            </div>
          </div>
        </div>
        <div v-if="$config.isSnap && !$config.snapSshPlug" class="row">
          <div class="alert alert-warning">
            <i class="material-icons">error_outline</i>
            <div>
              嘿，Snap用户！您需要<external-link :href="enableSshLink">启用SSH访问</external-link>，然后重新启动本系统以提供对您的.ssh目录的访问。
            </div>
          </div>
        </div>
        <div class="row gutter">
          <div class="col s6 form-group">
            <label for="sshKeyfile">私钥文件</label>
            <file-picker
              v-model="config.sshKeyfile"
              :show-hidden-files="true"
              :default-path="filePickerDefaultPath">
            </file-picker>
          </div>
          <div class="col s6 form-group">
            <label for="sshKeyfilePassword">私钥文件密码<span class="hint">(选填)</span></label>
            <input type="password" class="form-control" v-model="config.sshKeyfilePassword">
          </div>
        </div>


      </div>
      <div v-if="config.sshMode === 'userpass'" class="row gutter">
        <div class="col s6">
          <div class="form-group">
            <label for="sshUsername">SSH用户名</label>
            <input class="form-control" type="text" v-model="config.sshUsername">
          </div>
        </div>
        <div class="col s6">
          <div class="form-group">
            <label for="sshPassword">SSH密码</label>
            <input class="form-control" type="password" v-model="config.sshPassword">
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
  import FilePicker from '@/components/common/form/FilePicker'
  import ExternalLink from '@/components/common/ExternalLink'

  import { remote } from 'electron'
  import { join as pathJoin } from 'path'

  export default {
    props: ['config'],
    components: {
      FilePicker, ExternalLink
    },
    data() {
      return {
        enableSshLink: "https://github.com/buddy-red/bks-Chinese",
        sshModeOptions: [
          { label: "私钥文件", mode: 'keyfile' },
          { label: "用户名 & 密码", mode: "userpass" },
          { label: "SSH代理", mode: "agent" }
        ],
        filePickerDefaultPath: pathJoin(remote.app.getPath('home'), '.ssh')
      }
    },
    methods: {
      setMode(option) {
        this.config.sshMode = option.mode
      }
    }
  }
</script>
