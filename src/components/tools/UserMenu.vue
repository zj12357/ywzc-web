<template>
  <div class="user-wrapper">
    <div class="content-box">

      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
         <a-icon type="user"/>
          <span>{{ userInfo.username }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="0">
            <router-link :to="{ name: 'personPassword' }">
              <a-icon type="lock" />
              <span>修改密码</span>
            </router-link>
          </a-menu-item>
          <!--<a-menu-item key="1">-->
            <!--<router-link :to="{ name: 'personInfo' }">-->
              <!--<a-icon type="setting"/>-->
              <!--<span>账户设置</span>-->
            <!--</router-link>-->
          <!--</a-menu-item>-->

          <a-menu-item key="1">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout"/>
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UserMenu',
  components: {
    NoticeIcon
  },
  computed: {
    ...mapGetters(['userInfo'])

  },
  mounted(){
    //获取用户信息
    this.GetInfo()
  },
  methods: {
    ...mapActions(['Logout','GetInfo']),
    handleLogout () {
      this.$confirm({
        title: '提示',
        content: '真的要退出登录吗 ?',
        onOk: () => {
            this.Logout()
        },
        onCancel () {
        }
      })
    }
  }
}
</script>
