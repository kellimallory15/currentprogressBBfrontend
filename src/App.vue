<template>
  <ul class="nav justify-content-end">
    <li class="nav-item">
      <img src="images/book_buddy_logo.png" alt="Book Buddy Logo" class="nav-logo">
    </li>
    <div class="FS">Book Buddy</div>
    <li class="nav-item active">
      <router-link to="/">Home</router-link> |
    </li>
    <li class="nav-item">
      <router-link :to="{name: 'AuthorList'}">Authors</router-link> |
    </li>
    <li class="nav-item">
      <router-link :to="{name: 'BookList'}">Books</router-link> |
    </li>
    <li class="nav-item" v-if="!authenticated">
      <router-link :to="{name: 'Register'}">Register</router-link> |
    </li>
    <li class="nav-item" v-if="!authenticated">
      <router-link :to="{name: 'Auth'}">Log in</router-link>
    </li>
    <li class="nav-item" v-if="authenticated" @click="logout">
      <router-link to="/">Logout</router-link>
    </li>
  </ul>
  <router-view/>
</template>

<script>
import router from './router';

export default {
  name: 'App',
  data() {
    return {
      authenticated: false
    };
  },
  created() {
    this.checkAuthentication();
  },
  methods: {
    logout() {
      localStorage.removeItem("isAuthenticated");
      this.authenticated = false;
      router.push('/auth');
    },
    checkAuthentication() {
      this.authenticated = localStorage.getItem("isAuthenticated") === "true";
    }
  }
}
</script>

<style lang="scss">
 #app {
     font-family: Avenir, Helvetica, Arial, sans-serif;
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
     text-align: center;
     color: #FF3131;
 }
 #nav {
     padding: 30px;
     background-color: rgb(255, 255, 255);
     a {
         font-weight: bold;
         color: #FF3131;
         &.router-link-exact-active {
             color: #8fb9db;
         }
     }
 }
 .nav {
    width: 100%;
    padding: 1em;
    background-color: rgb(0, 0, 0);
    margin: 0;
    list-style: none;
    display: flex;
    justify-content: space-between;
     
     li {
         font-weight: bold;
         color: #8fb9db;
     }
     a {
         color: rgb(255, 255, 255);
         padding: .5em;

         &.router-link-exact-active {
             color: #ffffff;
         }
     }
 }
</style>
