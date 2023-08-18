<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >

      <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;"
               :message="loginErrorMsg"/>
      <a-form-item>
        <a-input
          size="large"
          type="text"
          :placeholder="$t('user.login.username.placeholder')"
          v-decorator="[
                'username',
                {rules: [{ required: true, message: $t('user.userName.required') }], validateTrigger: 'change'}
              ]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input-password
          size="large"
          :placeholder="$t('user.login.password.placeholder')"
          v-decorator="[
                'password',
                {rules: [{ required: true, message: $t('user.password.required') }], validateTrigger: 'blur'}
              ]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input-password>
      </a-form-item>

      <a-form-item hidden>
        <a-input v-decorator="['uid',{}]"/>
      </a-form-item>

      <a-row :gutter="16">
        <a-col class="gutter-row" :span="16">
          <a-form-item>
            <a-input size="large" :maxLength="5" type="text" placeholder="验证码"
                     v-decorator="['captcha', {rules: [{ required: true, message: $t('user.verification-code.required') }], validateTrigger: 'blur'}]">
              <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <img :src="captchaImg" @click.stop.prevent="getCaptchaImage"/>

        </a-col>
      </a-row>
      <a-form-item>
        <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked' }]">{{
            $t('user.login.remember-me')
          }}
        </a-checkbox>
        <router-link
          :to="{ name: 'recover', params: { user: 'aaa'} }"
          class="forge-password"
          style="float: right;"
        >{{ $t('user.login.forgot-password') }}
        </router-link>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >{{ $t('user.login.login') }}
        </a-button>
      </a-form-item>

    </a-form>

  </div>
</template>

<script>
import {mapActions} from 'vuex'
import {timeFix, encrypt} from '@/utils/util'
import {captcha} from '@/api/login'

export default {
  components: {},
  data() {
    return {
      loginBtn: false,
      captchaImg: null,
      // login type: 0 email, 1 username, 2 telephone
      isLoginError: false,
      loginErrorMsg: "",
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
      }
    }
  },
  created() {
    this.getCaptchaImage()
  },
  methods: {
    ...mapActions(['Login', 'Logout']),

    handleSubmit(e) {
      e.preventDefault()
      const {
        form: {validateFields},
        state,
        Login
      } = this
      state.loginBtn = true

      validateFields({force: true}, (err, values) => {
        if (!err) {
          const loginParams = {...values}
          loginParams.password = encrypt(values.password)
          loginParams.grant_type = 'captcha'
          Login(loginParams)
            .then((res) => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },

    getCaptchaImage() {
      captcha().then(resp => {
        this.captchaImg = resp.data.captcha
        this.form.setFieldsValue({
          uid: resp.data.uid
        })
      }).catch(err => {
        console.log(err)
      })
    },

    loginSuccess(res) {
      console.log(res);
      // check res.homePage define, set $router.push name res.homePage
      // Why not enter onComplete
      /*
      this.$router.push({ name: 'analysis' }, () => {
        console.log('onComplete')
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      })
      */
      this.$router.push({path: '/'})
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
      this.isLoginError = false
    },
    requestFailed(err) {
      console.log(err);
      this.loginErrorMsg = err.msg
      this.isLoginError = true
      /*this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })*/
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
