<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16" type="flex" justify="center">
      <a-col :order="isMobile ? 2 : 1" :md="24" :lg="16">

        <a-form ref="baseForm" :form="form" layout="vertical">
          <a-form-item
            :label="$t('account.settings.basic.nickname')"
          >
            <a-input
              v-decorator="['nickName',
                            {rules:[{required:true,message:'请输入昵称',whitespace:true}],
                             getValueFromEvent: e => trimInput(e),
                             trigger:'blur',
                             validateTrigger:'blur'
                            }]"
              :placeholder="$t('account.settings.basic.nickname-message')"/>
          </a-form-item>
          <!--          <a-form-item
                      :label="$t('account.settings.basic.email')"
                      :required="false"
                    >
                      <a-input v-model:value="user.mobilePhone" placeholder="请输入手机号"/>
                    </a-form-item>-->
          <a-form-item
            :label="$t('account.settings.basic.email')"
          >
            <a-input
              v-decorator="['email',
                            {
                              rules: [{required:true,message:'请输入邮箱'},
                                      {type: 'email', message: '请输入正确邮件格式'}],
                              getValueFromEvent: e => trimInput(e),
                              trigger: 'blur',
                              validateTrigger: 'blur'
                            }
              ]"
              placeholder="example@ant.design"/>
          </a-form-item>
          <a-form-item
            :label="$t('account.settings.basic.profile')"
          >
            <a-textarea
              rows="3"
              v-decorator="['remark',
                            {rules:[{}],
                             getValueFromEvent: e => trimInput(e),
                             trigger:'blur',
                             validateTrigger:'blur'
                            }]"
              :placeholder="$t('account.settings.basic.profile-message')"/>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" @click="submit">{{ $t('account.settings.basic.update') }}</a-button>
          </a-form-item>
        </a-form>

      </a-col>
      <a-col :order="1" :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit(1)">
          <a-icon type="cloud-upload-o" class="upload-icon"/>
          <div class="mask">
            <a-icon type="plus"/>
          </div>
          <img :src="avatar || option.img"/>
        </div>
      </a-col>

    </a-row>

    <avatar-modal ref="modal" @ok="setAvatar"/>

  </div>
</template>

<script>
import AvatarModal from './AvatarModal'
import { baseMixin } from '@/store/app-mixin'
import { mapGetters } from 'vuex'
import { updateUserProfile } from '@/api/system/user'
import pick from 'lodash.pick'

export default {
  mixins: [baseMixin],
  components: {
    AvatarModal
  },
  data () {
    return {
      // cropper
      preview: {},
      option: {
        img: '/avatar2.jpg',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      },
      user: {},
      form: this.$form.createForm(this)

    }
  },
  methods: {
    setAvatar (url) {
      this.option.img = url
    },
    trimInput (e) {
      return e.target.value.trim()
    },
    submit () {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          values.id = this.userInfo.id
          updateUserProfile(values).then(resp => {
            if (resp.code === 200) {
              this.userInfo.nickName = values.nickName
              this.userInfo.remark = values.remark
              this.userInfo.email = values.email

              this.$message.success('更新成功')
            } else {
              this.$message.error(resp.msg)
            }
          }).catch(err => {
            console.log(err)
          }).finally(() => {
          })
        }
      })
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'avatar'])
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      this.form.setFieldsValue(pick(this.userInfo, 'nickName', 'email', 'remark'))
    })
    /* this.user = {
      nickName: this.userInfo.nickName,
      mobilePhone: this.userInfo.mobilePhone,
      email: this.userInfo.email,
      remark: this.userInfo.remark,
    } */
  }
}
</script>

<style lang="less" scoped>

.avatar-upload-wrapper {
  height: 200px;
  width: 100%;
}

.ant-upload-preview {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;

  .upload-icon {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 1.4rem;
    padding: 0.5rem;
    background: rgba(222, 221, 221, 0.7);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  .mask {
    opacity: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      color: #d6d6d6;
    }
  }

  img, .mask {
    width: 100%;
    max-width: 180px;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>
