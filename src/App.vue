<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <keep-alive include="AdminPets,AdminApplications,AdminDashboard,PetHistory">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    globalLogout() {
      // Clear all authentication tokens
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      localStorage.removeItem('adminSession');
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('lastActivity');

      // Set no-cache headers
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', 'Cache-Control');
      meta.setAttribute('content', 'no-store, no-cache, must-revalidate, max-age=0');
      document.head.appendChild(meta);

      // Clear browser history state
      if (window.history.pushState) {
        window.history.pushState(null, null, '/');
        window.onpopstate = function() {
          window.history.pushState(null, null, '/');
        };
      }

      // Redirect to home page
      this.$router.push('/home');
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

body {
  background-color: #f5f5f5;
}
</style>


