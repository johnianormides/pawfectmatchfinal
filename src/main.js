import { createPinia } from 'pinia'
import { createApp } from 'vue'

import '@fortawesome/fontawesome-free/css/all.css'
import App from './App.vue'
import router from './router'

// Set cache control headers
const meta = document.createElement('meta');
meta.setAttribute('http-equiv', 'Cache-Control');
meta.setAttribute('content', 'no-store, no-cache, must-revalidate, max-age=0');
document.head.appendChild(meta);

// Prevent back button navigation after logout
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // Page was loaded from cache (back/forward button)
    const adminToken = localStorage.getItem('adminSession');
    const userToken = localStorage.getItem('token');

    // If no tokens but trying to access protected routes, redirect
    if (!adminToken && !userToken &&
        (window.location.pathname.startsWith('/admin') ||
         window.location.pathname === '/status' ||
         window.location.pathname.startsWith('/pet-profile'))) {
      window.location.href = '/';
    }
  }
});

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
// Disable devtools
app.config.devtools = false;
app.config.debug = false;
app.config.silent = true;