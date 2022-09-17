<template>
    <div class="global-items">
      <a
        href=""
        @click.prevent="click('tables')"
        class="nav-item selectable"
        :class="{ active: activeItem === 'tables'}"
        title="数据库"
      >
        <span class="bk-database"></span>
      </a>
      <a
        href=""
        @click.prevent="click('queries')"
        class="nav-item selectable"
        :class="{ active: activeItem === 'queries'}"
        title="已保存查询"
      >
        <span class="material-icons">code</span>
      </a>
      <a
        href=""
        @click.prevent="click('history')"
        class="nav-item selectable"
        :class="{ active: activeItem === 'history'}"
        title="运行记录"
      >
        <span class="material-icons">history</span>
      </a>
      <span class="expand"></span>
    </div>
</template>

<script>
  export default {
    props: ['activeItem'],
    components: { },
    computed: {
    },
    methods: {
      click(item) {
        if( this.activeItem === item ){
          this.$emit('toggleSidebar')
        } else {
          this.$emit('selected', item)
        }
      }
    }
  }
</script>
