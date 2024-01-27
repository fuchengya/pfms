<template>
  <div class="login-container">
    <div class="typing-text" v-html="typedText"></div>
    <el-card class="login-form-layout">
      <el-form
        v-if="type == 'login'"
        autoComplete="on"
        :model="loginForm"
        :rules="loginRules"
        ref="loginForm"
        label-position="left"
      >
        <div style="text-align: center">
          <svg-icon
            icon-class="login-mall"
            style="width: 56px; height: 56px; color: #409eff"
          ></svg-icon>
        </div>
        <h2 class="login-title color-main">PFMS 登录</h2>
        <el-form-item prop="username">
          <el-input
            name="username"
            type="text"
            v-model="loginForm.username"
            autoComplete="on"
            placeholder="请输入用户名"
          >
            <span slot="prefix">
              <svg-icon icon-class="user" class="color-main"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            name="password"
            :type="pwdType"
            @keyup.enter.native="handleLogin"
            v-model="loginForm.password"
            autoComplete="on"
            placeholder="请输入密码"
          >
            <span slot="prefix">
              <svg-icon icon-class="password" class="color-main"></svg-icon>
            </span>
            <span slot="suffix" @click="showPwd">
              <svg-icon icon-class="eye" class="color-main"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 60px; text-align: center">
          <el-button
            style="width: 45%"
            type="primary"
            :loading="loading"
            @click.native.prevent="handleLogin"
          >
            登录
          </el-button>
          <el-button
            style="width: 45%"
            type="primary"
            @click.native.prevent="handleToRegister"
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>
      <el-form
        v-if="type == 'register'"
        autoComplete="on"
        :model="registerForm"
        :rules="loginRules"
        ref="registerForm"
        label-position="left"
      >
        <div style="text-align: center">
          <svg-icon
            icon-class="login-mall"
            style="width: 56px; height: 56px; color: #409eff"
          ></svg-icon>
        </div>
        <h2 class="login-title color-main">PFMS 注册</h2>
        <el-form-item prop="username">
          <el-input
            name="username"
            type="text"
            v-model="registerForm.username"
            autoComplete="on"
            placeholder="请输入用户名"
          >
            <span slot="prefix">
              <svg-icon icon-class="user" class="color-main"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            name="password"
            :type="regPwdType"
            @keyup.enter.native="handleLogin"
            v-model="registerForm.password"
            autoComplete="on"
            placeholder="请输入密码"
          >
            <span slot="prefix">
              <svg-icon icon-class="password" class="color-main"></svg-icon>
            </span>
            <span slot="suffix" @click="showRegPwd">
              <svg-icon icon-class="eye" class="color-main"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            name="password"
            :type="regConfirmPwdType"
            v-model="registerForm.confirmPassword"
            autoComplete="on"
            placeholder="请确认密码"
          >
            <span slot="prefix">
              <svg-icon icon-class="password" class="color-main"></svg-icon>
            </span>
            <span slot="suffix" @click="showConfirmPwd">
              <svg-icon icon-class="eye" class="color-main"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 60px; text-align: center">
          <el-button
            style="width: 45%"
            type="primary"
            @click.native.prevent="handleToLogin"
          >
            已有账号去登录
          </el-button>
          <el-button
            style="width: 45%"
            type="primary"
            :loading="regLoading"
            @click.native.prevent="handleRegister"
          >
            提交注册
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- <img :src="login_center_bg" class="login-center-layout" /> -->
  </div>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";
import { setSupport, getSupport, setCookie, getCookie } from "@/utils/support";
import login_center_bg from "@/assets/images/login_center_bg.png";
import { createAdmin } from "@/api/login";

export default {
  name: "login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error("密码不能小于3位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
      },
      registerForm: {
        username: "",
        password: "",
        confirmPassword: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePass },
        ],
      },
      loading: false,
      regLoading: false,
      pwdType: "password",
      regPwdType: "password",
      regConfirmPwdType: "password",
      login_center_bg,
      dialogVisible: false,
      supportDialogVisible: false,
      type: "login", // login/register
      typedText: "",
      originalText: "金钱，更好地管理，更好地生活。",
      typingSpeed: 200, // 打字速度，单位为毫秒
      currentIndex: 0,
    };
  },
  created() {
    this.loginForm.username = getCookie("username");
    this.loginForm.password = getCookie("password");
    if (
      this.loginForm.username === undefined ||
      this.loginForm.username == null ||
      this.loginForm.username === ""
    ) {
      this.loginForm.username = "";
    }
    if (
      this.loginForm.password === undefined ||
      this.loginForm.password == null
    ) {
      this.loginForm.password = "";
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    showRegPwd() {
      if (this.regPwdType === "password") {
        this.regPwdType = "";
      } else {
        this.regPwdType = "password";
      }
    },
    showConfirmPwd() {
      if (this.regConfirmPwdType === "password") {
        this.regConfirmPwdType = "";
      } else {
        this.regConfirmPwdType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // let isSupport = getSupport();
          // if(isSupport===undefined||isSupport==null){
          //   this.dialogVisible =true;
          //   return;
          // }
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.loading = false;
              setCookie("username", this.loginForm.username, 15);
              setCookie("password", this.loginForm.password, 15);
              this.$router.push({ path: "/" });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("参数验证不合法！");
          return false;
        }
      });
    },
    handleRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.regLoading = true;
          if (
            this.registerForm.password !== this.registerForm.confirmPassword
          ) {
            this.$message({
              message: "两次输入密码不一致！",
              type: "error",
            });
            this.regLoading = false;
            return false;
          }
          createAdmin(this.registerForm).then((response) => {
            this.$message({
              message: "注册成功！",
              type: "success",
            });
            this.type = "login";
            this.loginForm.username = this.registerForm.username;
            this.regLoading = false;
          });
        } else {
          console.log("参数验证不合法！");
          return false;
        }
      });
    },
    handleToLogin() {
      this.type = "login";
    },
    handleToRegister() {
      this.type = "register";
    },
    handleTry() {
      this.dialogVisible = true;
    },
    dialogConfirm() {
      this.dialogVisible = false;
      setSupport(true);
    },
    dialogCancel() {
      this.dialogVisible = false;
      setSupport(false);
    },
    typeText() {
      if (this.currentIndex < this.originalText.length) {
        this.typedText += this.originalText.charAt(this.currentIndex);
        this.currentIndex++;
        setTimeout(this.typeText, this.typingSpeed);
      }
    },
  },
  mounted() {
    this.typeText();
  },
};
</script>

<style scoped>
.login-form-layout {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 360px;
  border-top: 10px solid #409eff;
  background-color: rgba(206, 198, 195, 0.5);
}

.login-title {
  text-align: center;
}

.login-center-layout {
  background: #409eff;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  margin-top: 200px;
}
.login-container {
  height: 100vh;
  background-color: aquamarine;
  background-image: url("../../assets/images/bg.jpg");
  background-size: cover;
}

.typing-text {
  white-space: pre-wrap;
  overflow: hidden; /* 隐藏超出容器的文本 */
  border-right: 2px solid #333; /* 创建光标效果 */
  padding-right: 8px; /* 留出光标的空间 */
  animation: blink-caret 0.75s step-end infinite; /* 光标闪烁动画 */
  top: 100px;
  padding-left: 10vh;
  padding-top: 20vh;
  font-size: 45px;
}

@keyframes blink-caret {
  from,
  to {
    border-color: transparent; /* 光标闪烁颜色 */
  }
  50% {
    border-color: transparent; /* 光标闪烁颜色 */
  }
}
</style>
