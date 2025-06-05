// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import AdminLogin from '../views/admin-login.vue';
import AddPet from '../views/admin/AddPet.vue';
import Applications from '../views/admin/Applications.vue';
import Dashboard from '../views/admin/Dashboard.vue';
import EditPet from '../views/admin/EditPet.vue';
import PetHistory from '../views/admin/PetHistory.vue';
import Pets from '../views/admin/Pets.vue';
import ViewPet from '../views/admin/ViewPet.vue';
import ConfirmEmail from '../views/confirm-email.vue';
import donations from '../views/donations.vue';
import HomeVue from '../views/home.vue';
import Login from '../views/login.vue';
import PetProfile from '../views/pet-profile.vue';
import PetProfiles from '../views/pet-profiles.vue';
import Signup from '../views/signup.vue';
import status from '../views/status.vue';
import training from '../views/training.vue';

const routes = [
  // Public routes - accessible by anyone
  {
    path: '/home',
    name: 'home',
    component: HomeVue,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
    meta: { requiresAuth: false }
  },
  {
    path: '/admin-login',
    name: 'adminLogin',
    component: AdminLogin,
    meta: { requiresAuth: false }
  },
  {
    path: '/confirm-email',
    name: 'confirmEmail',
    component: ConfirmEmail,
    meta: { requiresAuth: false }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../views/forgot-password.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('../views/reset-password.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/verify-identity',
    name: 'verify-identity',
    component: () => import('../views/verify-identity.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/training',
    name: 'training',
    component: training,
    meta: { requiresAuth: false }
  },
  {
    path: '/donations',
    name: 'donations',
    component: donations,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    redirect: '/home',
    meta: { requiresAuth: false }
  },

  // User routes - require user authentication
  {
    path: '/pet-profiles',
    name: 'petProfiles',
    component: PetProfiles,
    meta: { requiresAuth: false, adminOnly: false }
  },
  {
    path: '/pet-profile',
    name: 'petProfile',
    component: PetProfile,
    meta: { requiresAuth: false, adminOnly: false }
  },
  {
    path: '/pet-profile/:id',
    name: 'petProfileWithId',
    component: PetProfile,
    props: true,
    meta: { requiresAuth: false, adminOnly: false }
  },
  {
    path: '/status',
    name: 'status',
    component: status,
    meta: { requiresAuth: true, adminOnly: false }
  },

  // Admin routes - require admin authentication
  {
    path: '/admin',
    name: 'admin',
    component: Dashboard,
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/admin/dashboard',
    name: 'adminDashboard',
    component: Dashboard,
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/admin/pets',
    name: 'adminPets',
    component: Pets,
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/admin/pets/add',
    name: 'adminAddPet',
    component: AddPet,
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/admin/pets/view/:id',
    name: 'adminViewPet',
    component: ViewPet,
    props: true,
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/admin/pets/edit/:id',
    name: 'adminEditPet',
    component: EditPet,
    props: true,
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/admin/applications',
    name: 'adminApplications',
    component: Applications,
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/admin/pet-history',
    name: 'adminPetHistory',
    component: PetHistory,
    meta: { requiresAuth: true, adminOnly: true }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const adminOnly = to.matched.some(record => record.meta.adminOnly);

  // Get authentication tokens
  const userToken = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminSession');
  const userRole = localStorage.getItem('userRole');
  const lastActivity = localStorage.getItem('lastActivity');

  // Check for session timeout (30 minutes)
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
  const currentTime = new Date().getTime();

  if (lastActivity && currentTime - parseInt(lastActivity) > SESSION_TIMEOUT) {
    // Session timeout - clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('adminSession');
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('lastActivity');

    // Redirect to login with timeout message
    if (adminOnly) {
      next({ path: '/admin-login', query: { timeout: 'true' } });
    } else {
      next({ path: '/login', query: { timeout: 'true' } });
    }
    return;
  }

  // Update last activity timestamp for authenticated routes
  if (requiresAuth && (userToken || adminToken)) {
    localStorage.setItem('lastActivity', currentTime.toString());
  }

  // Logic for route access
  if (!requiresAuth) {
    // Public routes are accessible by anyone
    next();
  } else if (adminOnly) {
    // Admin routes require admin authentication
    if (adminToken && userRole === 'admin') {
      // Set cache control headers to prevent caching
      if (window.history.pushState) {
        window.history.pushState(null, null, to.fullPath);
      }
      next();
    } else {
      // Redirect to admin login
      next('/admin-login');
    }
  } else {
    // User routes require user authentication
    if (userToken) {
      // If admin tries to access user pages, redirect to admin dashboard
      if (userRole === 'admin' && adminToken) {
        next('/admin/dashboard');
      } else {
        // Set cache control headers to prevent caching
        if (window.history.pushState) {
          window.history.pushState(null, null, to.fullPath);
        }
        next();
      }
    } else {
      // Redirect to login
      next('/login');
    }
  }
});

export default router
