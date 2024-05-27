<template>
  <div class="login-container">
    <div class="left-panel">
      <carousel-3d
        :autoplay="true"
        :autoplay-timeout="2000"
        :perspective="0"
        :space="400"
        :display="3"
      >
        <slide v-for="(slide, i) in slides" :index="i" :key="i">
          <img :src="slide.src" alt="logo" />
        </slide>
      </carousel-3d>
    </div>
    <div class="right-panel">
      <div class="login-card">
        <div class="login-title">
          <space>
            <h2 v-if="showLogin">登录</h2>
            <h2 v-else>注册</h2>
            <Button v-if="showLogin" type="dashed" @click="showLogin = false">立即注册</Button>
            <Button v-else type="dashed" @click="showLogin = true">立即登录</Button>
          </space>
        </div>
        <Login @on-submit="handleSubmit">
          <Email name="email" />
          <UserName v-if="!showLogin" name="username" />
          <Password name="password" />
          <Password v-if="!showLogin" name="passwordConfirm" placeholder="确认密码" />
          <Submit v-if="showLogin">登录</Submit>
          <Submit v-else>注册</Submit>
        </Login>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Carousel3d, Slide } from 'vue3-carousel-3d';
/*
view-ui-plus中所有的$instance都需要导入使用
   Modal.info({
    title: '输入的内容如下：',
      content: 'email: ' + email + ' | password: ' + password,
    });
    */
import { Modal, Message } from 'view-ui-plus';
import { ref } from 'vue';
import { getNToken, postNToken } from '@/network/index.js';
import { sha256 } from 'js-sha256';
import { useRouter } from 'vue-router';
const router = useRouter();
const slides = ref([
  { id: 1, src: 'https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/svg/macaw.svg' },
  { id: 2, src: 'https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/svg/macaw.svg' },
  { id: 3, src: 'https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/svg/macaw.svg' },
  { id: 4, src: 'https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/svg/macaw.svg' },
  { id: 5, src: 'https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/svg/macaw.svg' },
]);

const showLogin = ref(true);
const handleSubmit = (valid, { email, password, username }) => {
  if (valid) {
    if (showLogin.value) {
      // 登录
      getNToken(
        '/user/salt',
        { email: email },
        (data) => {
          console.log(data.salt);
          postNToken(
            '/user/login',
            { email: email, password: sha256(password + data.salt) },
            (data) => {
              Message.success('成功登录');
              localStorage.setItem('token', data.token);
              router.push('/home');
            },
            (err) => {
              Message.error('账号或密码错误，请重试');
            }
          );
        },
        (err) => {
          Message.error('登陆失败，请稍后重试');
        }
      );
    } else {
      // 注册

      var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
      var a = t.length;
      var salt = '';
      for (var i = 0; i < 20; i++) salt += t.charAt(Math.floor(Math.random() * a));
      postNToken(
        '/user/register',
        {
          username: username,
          email: email,
          password: sha256(password + salt),
          salt: salt,
        },
        (data) => {
          Message.success('成功注册');
        },
        (err) => {
          console.log(err);
          Message.error('注册失败，请稍后重试');
        }
      );
    }
  }
};
</script>

<style>
.login-container {
  display: flex;
  height: 100vh;
}

.left-panel {
  flex: 1;
  background-color: aliceblue;
  /* 添加你想要的背景或者其他样式 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.right-panel {
  width: calc(30vw);
  min-width: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.login-title {
  padding-bottom: 20px;
}
.auto-login {
  padding-bottom: 20px;
}
</style>
