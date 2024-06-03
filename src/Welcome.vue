<template>
  <div class="bac_box" style="width: 100vw; height: 100vh; overflow: hidden">
    <div class="card">
      <div class="mine_box">
        <div v-if="pageType == 1" id="page1">
            <div style="margin-top:100px;">
              <span>账号：</span>
              <input v-model="username" placeholder="请输入账号">
            </div>
            <div>
              <span>密码：</span>
              <input v-model="password" type="password" placeholder="请输入密码">
            </div>
            <el-button class="ripple-gradient-button" id="button1" @click="loginSubmit()">
              <span>登录</span>
            </el-button>
        </div>
        <div v-if="pageType == 2" id="page2">
          <div style="margin-top:100px;">
            <span>账号：</span>
            <input v-model="username" placeholder="请输入账号" />
          </div>
          <div>
            <span>密码：</span>
            <input v-model="password" type="password" placeholder="请输入密码" />
          </div>
          <el-button class="ripple-gradient-button" id="button2" @click="register()">
            <span>注册</span>
          </el-button>
        </div>
      </div>
      <div class="box_01" style="display: none">
        <div class="deng">欢迎登录五子棋游戏</div>
        <img class="img1_b" src="./assets/img/symbol.jpg" alt="" />
        <div class="denglu" @click="backLogin()">登录</div>
      </div>
      <div class="box_02">
        <img class="img2_b" src="./assets/img/symbol.jpg" alt="" />
        <div class="zhu">欢迎注册五子棋游戏</div>
        <div class="zhuce" @click="backRegister()">注册</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import {
  registerUser,
  loginUser,
} from "./services/mainServ";
import { message } from "./tools/messageBox";
export default defineComponent({
  //返回的数据，templte中使用的数据
  data: () => ({
    username: "",
    password: "",
    pageType: 1,
  }),
  //页面加载后执行的函数， 执行性一次， 从后台请求验证码，从浏览器获取上次登录的用户信息作为用户和密码的初始值
  async created() {
  },
  //页面加载后执行的函数， 执行性多次
  methods: {
    //返回登录界面
    backLogin() {
      this.username = "";
      this.password = "";
      this.pageType=1;
      let box_01 = document.getElementsByClassName("box_01");
      (box_01[0] as HTMLElement).style.display = "none";
      let box_02 = document.getElementsByClassName("box_02");
      (box_02[0] as HTMLElement).style.display = "block";
    },
    //返回注册界面
    backRegister() {
      this.username = "";
      this.password = "";
      this.pageType=2;
      let box_02 = document.getElementsByClassName("box_02");
      (box_02[0] as HTMLElement).style.display = "none";
      let box_01 = document.getElementsByClassName("box_01");
      (box_01[0] as HTMLElement).style.display = "block";
    },
    //用户注册 请求后台服务，将用户注册信息发送到后台，后台添加用户
    async register() {
      if (this.username == "" || this.username == undefined) {
        message(this, "账号为空,请填写账号");
        return;
      }
      if (this.password == "" || this.password == undefined) {
        message(this, "账号为空,请填写密码");
        return;
      }
      let res = await registerUser({
        username: this.username,
        password: this.password,
      });
      if (res.code == 0) {
        message(this, "已注册成功！");
        this.backLogin()
      } else {
        message(this, res.msg);
      }
    },
    //登录请求后台服务，将用户登录信息发送到后台，后台验证用户信息
    async loginSubmit() {
      if (this.username == "" || this.username == undefined) {
        message(this, "用户名为空");
      } else if (this.password == "" || this.password == undefined) {
        message(this, "密码为空");
      }        
      let res = await loginUser({
        username: this.username,
        password: this.password,
      });
      if (res.code == 0) {
        this.$router.push({ path: '/Lobby', query: { username: this.username }})
        message(this, "已登录成功！");
      } else {
        message(this, res.msg);
      }
    },
  },
});
</script>
<style>
#page1{
  margin-left:75px;
  display:flex;
  flex-direction:column;
}
#page2{
  margin-left:510.64px;
  display:flex;
  flex-direction:column;
  justify-content: space-around;
}
.mine_box {
  transition: left 0.3s ease-out;
}
.bac_box {
  background-image: url("../src/assets/img/background.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.welcome-title {
  position: absolute;
  bottom: 30px;
  left: 30px;
  color: white;
  text-shadow: 0 0 10px black;
}

.card {
  width: 800px;
  height: 300px;
  padding: 20px;
  /* height: 500px; */
  margin: 200px auto;
  z-index: 1;
  /* opacity: 0.9; */
  border-radius: 20px;
  background-color: #ffffff;
  position: relative;
}

.zhuce {
  position: absolute;
  bottom: 30px;
  right: 150px;
  color: white;
  font-size: 20px;
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 10px;
  background: rgb(187, 187, 245);
}

.denglu {
  position: absolute;
  bottom: 30px;
  left: 150px;
  color: white;
  font-size: 20px;
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 10px;
  background: rgb(187, 187, 245);
}

.deng {
  position: absolute;
  top: 175px;
  left: 125px;
  color: #9c0c13;
}

.img1_b {
  width: 150px;
  height: 150px;
  position: absolute;
  top: 20px;
  left: 125px;
}

.zhu {
  position: absolute;
  top: 175px;
  right: 125px;
  color: #9c0c13;
}

.img2_b {
  width: 150px;
  height: 150px;
  position: absolute;
  top: 20px;
  right: 125px;
}

.ripple-gradient-button {
  position: relative;
  overflow: hidden;
  background-color: rgb(137, 137, 253);
  /* 按钮背景色 */
  color: #fff;
  /* 文字颜色 */
  border: none;
  /* 去掉边框 */
  width: 150px;
  /* 按钮宽度 */
  height: 50px;
  /* 按钮高度 */
  font-size: 18px;
  /* 字体大小 */
  cursor: pointer;
  outline: none;
  margin-top:80px;
}
#button1{
  position: absolute;
  bottom: 30px;
  left: 150px;
  color: white;
  font-size: 20px;
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 10px;
}
#button2{
  position: absolute;
  bottom: 30px;
  right: 150px;
  color: white;
  font-size: 20px;
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 10px;
}
.ripple-gradient-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 10%, transparent 10.01%);
  background-size: 300% 300%;
  z-index: 0;
  opacity: 0;
}

.ripple-gradient-button:hover::before {
  opacity: 1;
  background-size: 100% 100%;
}

.ripple-gradient-button span {
  position: relative;
  z-index: 1;
}
</style>