<template>
  <div>
    <!-- Navigation Bar -->
    <nav class="nav-bar">
      <div class="menu-container">
        <div class="logo"><img src="/Designer.png" alt="Logo" class="logo-img" /><router-link to="/">PAWFECT</router-link></div>

        <!-- Desktop Navigation -->
        <ul class="nav-links">
          <li><router-link to="/home"><i class="fas fa-home icon-fix"></i><span class="nav-text">Home</span></router-link></li>
          <li><router-link to="/pet-profiles"><i class="fas fa-paw icon-fix"></i><span class="nav-text">Pet Profiles</span></router-link></li>

          <!-- Resources Dropdown -->
          <li class="dropdown"
            @mouseenter="handleResourcesMouseEnter"
            @mouseleave="handleResourcesMouseLeave">
            <a href="#" @click.prevent="handleResourcesClick" aria-haspopup="true" :aria-expanded="showResourcesDropdown">
              <i class="fas fa-book icon-fix"></i><span class="nav-text">Resources</span><i class="fas fa-chevron-down dropdown-arrow"></i>
            </a>
            <ul class="dropdown-menu" v-show="showResourcesDropdown" :aria-expanded="showResourcesDropdown">
              <li><router-link to="/training"><i class="fas fa-paw"></i>Training Tips</router-link></li>
            </ul>
          </li>

          <li><router-link to="/donations"><i class="fas fa-heart icon-fix"></i><span class="nav-text">Donation</span></router-link></li>

          <!-- User Account Links -->
          <li v-if="isLoggedIn" class="dropdown user-dropdown"
            @mouseenter="handleAccountMouseEnter"
            @mouseleave="handleAccountMouseLeave">
            <a href="#" @click.prevent="handleAccountClick" aria-haspopup="true" :aria-expanded="showUserDropdown">
              <i class="fas fa-user-circle icon-fix"></i><span class="nav-text">Account</span><i class="fas fa-chevron-down dropdown-arrow"></i>
            </a>
            <ul class="dropdown-menu user-dropdown-menu" v-show="showUserDropdown" :aria-expanded="showUserDropdown">
              <li><router-link to="/status" class="dropdown-item profile-item"><i class="fas fa-user"></i>Profile</router-link></li>
              <li><a href="#" @click.prevent="handleLogout" class="dropdown-item logout-item"><i class="fas fa-sign-out-alt"></i>Logout</a></li>
            </ul>
          </li>
          <li v-if="!isLoggedIn"><router-link to="/login"><i class="fas fa-sign-in-alt icon-fix"></i><span class="nav-text">Login</span></router-link></li>
          <li v-if="!isLoggedIn"><router-link to="/signup"><i class="fas fa-user-plus icon-fix"></i><span class="nav-text">Register</span></router-link></li>
        </ul>

        <!-- Mobile Menu Button -->
        <label class="mobile-menu-button" for="check" @click="closeAllDropdowns">
          <div class="hamburger-icon">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </div>
        </label>
      </div>
    </nav>

    <!-- Mobile Sidebar -->
    <input type="checkbox" id="check" v-model="sidebarOpen" class="hidden-checkbox">

    <div class="side_bar">
      <div class="sidebar-header">
        <div class="logo">PAWFECT</div>
        <label class="close-sidebar" for="check" @click="closeAllDropdowns">
          <i class="fas fa-times"></i>
        </label>
      </div>

      <div class="sidebar-content">
        <ul class="sidebar-links">
          <li><router-link to="/home" @click="closeAllDropdowns"><i class="fas fa-home icon-fix"></i><span>Home</span></router-link></li>
          <li><router-link to="/pet-profiles" @click="closeAllDropdowns"><i class="fas fa-paw icon-fix"></i><span>Pet Profiles</span></router-link></li>

          <!-- Mobile Resources Dropdown -->
          <li class="mobile-dropdown">
            <a href="#" @click.prevent="toggleMobileResourcesDropdown">
              <i class="fas fa-book icon-fix"></i><span>Resources</span>
              <i class="fas fa-chevron-down dropdown-arrow" :class="{ 'rotate-arrow': showMobileResourcesDropdown }"></i>
            </a>
            <ul class="mobile-dropdown-menu" v-show="showMobileResourcesDropdown">
              <li><router-link to="/training"><i class="fas fa-paw"></i>Training Tips</router-link></li>
            </ul>
          </li>

          <li><router-link to="/donations" @click="closeAllDropdowns"><i class="fas fa-heart icon-fix"></i><span>Donation</span></router-link></li>

          <!-- Mobile User Account Links -->
          <li v-if="isLoggedIn" class="mobile-dropdown">
            <a href="#" @click="toggleMobileUserDropdown">
              <i class="fas fa-user-circle icon-fix"></i><span>Account</span>
              <i class="fas fa-chevron-down dropdown-arrow" :class="{ 'rotate-arrow': showMobileUserDropdown }"></i>
            </a>
            <ul class="mobile-dropdown-menu" v-show="showMobileUserDropdown">
              <li><router-link to="/status" class="dropdown-item profile-item" @click="closeAllDropdowns"><i class="fas fa-user"></i>Profile</router-link></li>
              <li><a href="#" @click.prevent="handleLogout" class="dropdown-item logout-item"><i class="fas fa-sign-out-alt"></i>Logout</a></li>
            </ul>
          </li>
          <li v-if="!isLoggedIn"><router-link to="/login" @click="closeAllDropdowns"><i class="fas fa-sign-in-alt icon-fix"></i><span>Login</span></router-link></li>
          <li v-if="!isLoggedIn"><router-link to="/signup" @click="closeAllDropdowns"><i class="fas fa-user-plus icon-fix"></i><span>Register</span></router-link></li>
        </ul>

        <div class="sidebar-footer">
          <div class="media_icons">
            <a href="#"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
    </div>

    <!-- Pet Profiles Container -->
    <div class="pet-profiles-container">
      <!-- Notification for non-logged in users -->
      <div v-if="showLoginNotification" class="pet-adoption-notification">
        <div class="notification-content">
          <i class="fas fa-info-circle"></i>
          <div class="notification-text">
            <h4>Account Required</h4>
            <p>You need to have an account to adopt a pet. Please login or register.</p>
          </div>
          <button @click="dismissNotification" class="close-notification">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="notification-actions">
          <router-link to="/login" class="notification-btn login-btn">Login</router-link>
          <router-link to="/signup" class="notification-btn signup-btn">Register</router-link>
        </div>
      </div>
      
      <!-- Success Notification for application submission -->
      <div v-if="showSuccessNotification" class="pet-adoption-notification success-notification">
        <div class="notification-content">
          <i class="fas fa-check-circle"></i>
          <div class="notification-text">
            <h4>Application Submitted!</h4>
            <p>Your application has been successfully submitted. Please wait for confirmation from our team.</p>
          </div>
          <button @click="dismissSuccessNotification" class="close-notification">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      
      <div class="pet-profiles-header">
        <h1>Find Your Perfect Companion</h1>
        <p class="subtitle">Browse our available pets looking for their forever homes</p>

        <!-- Filter Controls -->
        <div class="filter-controls">
          <div class="filter-group">
            <label for="species-filter">Species</label>
            <select id="species-filter" v-model="filters.species" @change="applyFilters">
              <option value="">All Species</option>
              <option value="Dog">Dogs</option>
              <option value="Cat">Cats</option>
              <option value="Bird">Birds</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="filter-group">
            <label for="age-filter">Age</label>
            <select id="age-filter" v-model="filters.age" @change="applyFilters">
              <option value="">All Ages</option>
              <option value="puppy">Puppy/Kitten (&lt; 1 year)</option>
              <option value="young">Young (1-3 years)</option>
              <option value="adult">Adult (4-8 years)</option>
              <option value="senior">Senior (9+ years)</option>
            </select>
          </div>

          <div class="filter-group">
            <label for="gender-filter">Gender</label>
            <select id="gender-filter" v-model="filters.gender" @change="applyFilters">
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <button class="reset-filters" @click="resetFilters">
            <i class="fas fa-sync-alt"></i> Reset Filters
          </button>
        </div>

        <!-- Results Summary -->
        <div v-if="!loading && !error && filteredPets.length > 0" class="results-summary">
          <span class="results-count">{{ filteredPets.length }} pets found</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Finding perfect matches for you...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <i class="fas fa-exclamation-circle"></i>
        <p>{{ error }}</p>
        <button @click="fetchPets" class="retry-button">Try Again</button>
      </div>

      <!-- No Results State -->
      <div v-else-if="filteredPets.length === 0" class="no-results">
        <i class="fas fa-search"></i>
        <p>No pets match your current filters.</p>
        <button @click="resetFilters" class="reset-button">Reset Filters</button>
      </div>

      <!-- Pet Grid -->
      <div v-else class="pet-content">
        <div class="pet-grid">
          <div v-for="pet in paginatedPets" :key="pet.id" class="pet-card" @click="viewPetProfile(pet.id)">
            <div class="pet-image-container">
              <img :src="pet.photo || '/Img/default-pet.png'" :alt="pet.name" class="pet-img" />
              <div class="pet-status" :class="pet.status.toLowerCase()">
                {{ pet.status }}
              </div>
            </div>
            <div class="pet-info">
              <h2>{{ pet.name }}</h2>
              <div class="pet-details">
                <span><i class="fas fa-paw"></i> {{ pet.breed }}</span>
                <span><i class="fas fa-birthday-cake"></i> {{ pet.age }}</span>
                <span><i class="fas" :class="pet.gender === 'Male' ? 'fa-mars' : 'fa-venus'"></i> {{ pet.gender }}</span>
              </div>
              <p class="pet-desc">{{ truncateDescription(pet.description) }}</p>
              <button class="meet-pet-btn" @click.stop="meetPet(pet)">
                Meet {{ pet.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <button
            class="pagination-btn"
            :class="{ disabled: currentPage === 1 }"
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
          >
            <i class="fas fa-chevron-left"></i> Previous
          </button>

          <div class="pagination-info">
            Page {{ currentPage }} of {{ totalPages }}
            <span class="pagination-summary">Showing {{ paginationStart + 1 }}-{{ paginationEnd }} of {{ filteredPets.length }} pets</span>
          </div>

          <button
            class="pagination-btn"
            :class="{ disabled: currentPage === totalPages }"
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
          >
            Next <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Footer Section -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-column logo-column">
           <img src="/Designer.png" alt="Pawfect" width="40" height="40">
          <span class="Footer-logo-text">PAWFECT</span>
          <p class="footer-description">Helping paws find their forever home.</p>
        </div>
        <div class="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><router-link to="/home">Home</router-link></li>
            <li><router-link to="/pet-profiles">Pet Profiles</router-link></li>
            <li><router-link to="/training">Resources</router-link></li>
            <li><router-link to="/donations">Donate</router-link></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Contact</h4>
          <p>Email: pawfectmatch5@gmail.com</p>
          <p>Phone: +123 456 7890</p>
          <p>Location: Gordon College, Olongapo</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 PawfectMatch, Inc. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'PetProfiles',
  data() {
    return {
      pets: [],
      featuredPets: [],
      loading: true,
      error: null,
      sidebarOpen: false,
      showResourcesDropdown: false,
      showUserDropdown: false,
      showMobileResourcesDropdown: false,
      showMobileUserDropdown: false,
      isTablet: false,
      isTouch: false,
      isLargeScreen: window.innerWidth > 1024,
      navbarScrolled: false,
      screenWidth: window.innerWidth,
      mobileFeaturedPetIndex: 0,
      touchStartX: 0,
      touchEndX: 0,
      searchQuery: '',
      isLoggedIn: false,
      filters: {
        species: '',
        age: '',
        gender: ''
      },
      filteredPets: [],
      currentPage: 1,
      totalPages: 1,
      paginationStart: 0,
      paginationEnd: 0,
      showLoginNotification: false,
      showSuccessNotification: false
    };
  },
  computed: {
    paginatedPets() {
      return this.filteredPets.slice(this.paginationStart, this.paginationEnd);
    }
  },
  async created() {
    await this.fetchPets();
  },
  mounted() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
    window.addEventListener('scroll', this.handleScroll);
    document.addEventListener('click', this.closeResourceDropdownOnClickOutside);
    window.addEventListener('resize', this.handleResizeSidebar);
    this.checkTablet();
    this.checkTouch();
    window.addEventListener('resize', this.checkTablet);
    window.addEventListener('resize', this.checkTouch);
    document.addEventListener('click', this.handleDocumentClick);
    document.addEventListener('keydown', this.handleKeydown);

    // Check if user is logged in
    this.checkLoginStatus();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkScreenSize);
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('click', this.closeResourceDropdownOnClickOutside);
    window.removeEventListener('resize', this.handleResizeSidebar);
    window.removeEventListener('resize', this.checkTablet);
    window.removeEventListener('resize', this.checkTouch);
    document.removeEventListener('click', this.handleDocumentClick);
    document.removeEventListener('keydown', this.handleKeydown);
  },
  methods: {
    async fetchPets() {
      this.loading = true;
      try {
        const response = await fetch('http://localhost:5000/api/pet');
        if (!response.ok) {
          throw new Error('Failed to fetch pets');
        }
        const result = await response.json();

        if (!result.success || !result.data) {
          throw new Error(result.message || 'Failed to fetch pets');
        }

        const data = result.data;

        // Filter to only show available pets
        this.pets = data.filter(pet => pet.status && pet.status.toLowerCase() === 'available').map(pet => ({
          id: pet.id,
          name: pet.name,
          breed: pet.breed,
          age: pet.age,
          gender: pet.gender || 'Unknown',
          species: pet.species || 'Unknown',
          photo: pet.photo_url || '/Img/default-pet.jpg',
          description: pet.description || 'A wonderful companion waiting for a forever home.',
          status: pet.status
        }));

        // Set featured pets (first 4 available pets)
        this.featuredPets = this.pets.slice(0, 4).map(pet => ({
          id: pet.id,
          name: pet.name,
          breed: pet.breed,
          age: pet.age,
          image: pet.photo || '/Img/default-pet.jpg',
          background: pet.description
        }));

        this.filteredPets = this.pets;
        this.totalPages = Math.ceil(this.filteredPets.length / 8);
        this.changePage(1);
      } catch (error) {
        console.error('Error fetching pets:', error);
        this.error = 'Failed to load pets. Please try again later.';
      } finally {
        this.loading = false;
      }
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
      if (!this.mobileMenuOpen) {
        this.dropdownOpen = false; // Close mobile resources dropdown if menu closes
      }
      if (this.mobileMenuOpen) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
    },
    toggleDesktopDropdown(event) {
      event.preventDefault();
      event.stopPropagation();
      if (this.isMobile) {
        // Toggle mobile resources dropdown
        this.dropdownOpen = !this.dropdownOpen;
        // Ensure other main dropdowns are managed if needed, but userDropdownOpen is independent now
        this.desktopDropdownOpen = false;
      } else {
        // Toggle desktop resources dropdown
        this.desktopDropdownOpen = !this.desktopDropdownOpen;
      }
      // NOTE: userDropdownOpen is NOT affected by this action anymore.
    },
    toggleUserDropdown(event) {
      event.preventDefault();
      event.stopPropagation();
      // If the user menu is not already open, open it.
      // If it is already open, clicking the icon again does nothing to its state,
      // as it can now only be closed by its 'X' button.
      if (!this.userDropdownOpen) {
        this.userDropdownOpen = true;
      }
      // When user dropdown is interacted with, ensure other (non-user) dropdowns are closed.
      this.desktopDropdownOpen = false;
      if (this.isMobile) {
        this.dropdownOpen = false; // mobile resources dropdown
      }
    },
    closeUserDropdown() {
      // This is the only method that should set userDropdownOpen to false.
      this.userDropdownOpen = false;
    },
    closeMenuIfMobile() {
      if (this.isMobile) {
        this.mobileMenuOpen = false;
        this.dropdownOpen = false; // Close mobile resources dropdown
        document.body.classList.remove('no-scroll');
      }
      // userDropdownOpen is not affected here.
      // desktopDropdownOpen is not affected here by simple link clicks.
    },
    checkScreenSize() {
      const previouslyMobile = this.isMobile;
      this.isMobile = window.innerWidth <= 768;

      if (previouslyMobile !== this.isMobile) { // Only run logic if mode actually changes
        if (!this.isMobile) {
          // Switched to Desktop
          this.mobileMenuOpen = false;
          this.dropdownOpen = false; // mobile resources dropdown
          document.body.classList.remove('no-scroll');
        } else {
          // Switched to Mobile
          this.desktopDropdownOpen = false;
        }
      }
      // userDropdownOpen is NOT affected by screen size changes.
    },
    handleScroll() {
      this.hasScrolled = window.scrollY > 20;
    },
    closeResourceDropdownOnClickOutside(event) {
      // This function now ONLY handles closing the desktop resources dropdown.
      // User dropdown is not affected by clicks outside.
      const resourcesDropdownToggle = this.$el.querySelector('.nav-link.dropdown-toggle'); // Assuming this is specific enough
      const resourcesDropdownContent = this.$el.querySelector('.dropdown-content.desktop');

      if (this.desktopDropdownOpen && resourcesDropdownToggle && !resourcesDropdownToggle.contains(event.target) && resourcesDropdownContent && !resourcesDropdownContent.contains(event.target)) {
        this.desktopDropdownOpen = false;
      }
    },
    viewPetProfile(petId) {
      // Check if user is logged in before allowing access to pet profile
      if (this.isLoggedIn) {
        this.$router.push(`/pet-profile/${petId}`);
        // Close mobile menu if open
        this.sidebarOpen = false;
        this.closeAllDropdowns();
      } else {
        // Show notification instead of alert
        this.showLoginNotification = true;
      }
    },
    closeAllDropdowns() {
      this.showResourcesDropdown = false;
      this.showUserDropdown = false;
      this.showMobileResourcesDropdown = false;
      this.showMobileUserDropdown = false;
    },
    toggleMobileResourcesDropdown() {
      this.showMobileResourcesDropdown = !this.showMobileResourcesDropdown;
    },
    toggleMobileUserDropdown() {
      this.showMobileUserDropdown = !this.showMobileUserDropdown;
    },
    handleResizeSidebar() {
      if (window.innerWidth > 768 && this.sidebarOpen) {
        this.sidebarOpen = false;
      }
      this.closeAllDropdowns();
    },
    checkTablet() {
      this.isTablet = window.innerWidth >= 769 && window.innerWidth <= 1024;
    },
    checkTouch() {
      this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    handleResourcesClick(event) {
      if (this.isTablet || this.isTouch) {
        event.preventDefault();
        this.showResourcesDropdown = !this.showResourcesDropdown;
        if (this.showResourcesDropdown) this.showUserDropdown = false;
      }
    },
    handleAccountClick(event) {
      if (this.isTablet || this.isTouch) {
        event.preventDefault();
        this.showUserDropdown = !this.showUserDropdown;
        if (this.showUserDropdown) this.showResourcesDropdown = false;
      }
    },
    handleResourcesMouseEnter() {
      if (!this.isTablet && !this.isTouch) this.showResourcesDropdown = true;
    },
    handleResourcesMouseLeave() {
      if (!this.isTablet && !this.isTouch) this.showResourcesDropdown = false;
    },
    handleAccountMouseEnter() {
      if (!this.isTablet && !this.isTouch) this.showUserDropdown = true;
    },
    handleAccountMouseLeave() {
      if (!this.isTablet && !this.isTouch) this.showUserDropdown = false;
    },
    handleDocumentClick(e) {
      const navBar = this.$el.querySelector('.nav-bar');
      const sideBar = this.$el.querySelector('.side_bar');
      if (
        (navBar && navBar.contains(e.target)) ||
        (sideBar && sideBar.contains(e.target))
      ) {
        return;
      }
      this.closeAllDropdowns();
    },
    handleKeydown(e) {
      // Close dropdowns on Escape key
      if (e.key === 'Escape') {
        this.closeAllDropdowns();
      }
    },
    checkLoginStatus() {
      // Check if user is logged in by looking for token and userId in localStorage
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      this.isLoggedIn = !!(token && userId);
    },

    handleLogout() {
      // Clear user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      this.isLoggedIn = false;
      this.$router.push('/login');
    },
    applyFilters() {
      this.filteredPets = this.pets.filter(pet => {
        const speciesMatch = this.filters.species === '' || pet.species === this.filters.species;
        const ageMatch = this.filters.age === '' || (pet.age === 'puppy' && this.filters.age === 'puppy') ||
                        (pet.age === 'young' && this.filters.age === 'young') ||
                        (pet.age === 'adult' && this.filters.age === 'adult') ||
                        (pet.age === 'senior' && this.filters.age === 'senior');
        const genderMatch = this.filters.gender === '' || pet.gender === this.filters.gender;
        return speciesMatch && ageMatch && genderMatch;
      });
      this.totalPages = Math.ceil(this.filteredPets.length / 8);
      this.changePage(1);
    },
    resetFilters() {
      this.filters = {
        species: '',
        age: '',
        gender: ''
      };
      this.applyFilters();
    },
    truncateDescription(description) {
      if (description.length > 100) {
        return description.slice(0, 100) + '...';
      }
      return description;
    },
    changePage(newPage) {
      this.currentPage = newPage;
      this.paginationStart = (this.currentPage - 1) * 8;
      this.paginationEnd = Math.min(this.paginationStart + 8, this.filteredPets.length);
    },
    dismissNotification() {
      this.showLoginNotification = false;
    },
    showApplicationSuccess() {
      this.showSuccessNotification = true;
      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        this.showSuccessNotification = false;
      }, 5000);
    },
    dismissSuccessNotification() {
      this.showSuccessNotification = false;
    },
    meetPet(pet) {
      if (this.isLoggedIn) {
        this.viewPetProfile(pet.id);
      } else {
        this.showLoginNotification = true;
      }
    }
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css');

:root {
  --primary-color: #ff914d;
  --bg-color: #f0f0f0;
  --shadow-light: #ffffff;
  --shadow-dark: #d3d3d3;
  --text-color: #555;
  --sidebar-width: 300px;
  --nav-height: 70px;
  --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Navigation Bar Styles */
.nav-bar {
  width: 100%;
  height: var(--nav-height);
  background: #f8f8f8;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.menu-container {
  max-width: 1400px;
  height: 100%;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
}

.logo a {
  font-size: 1.8rem;
  font-weight: 800;
  text-decoration: none;
  color: var(--primary-color);
  letter-spacing: 1px;
  transition: var(--transition);
}

.logo-img {
  height: 38px;
  width: 38px;
  margin-right: 10px;
}

/* Desktop Navigation */
.nav-links {
  list-style: none;
  display: flex;
  gap: 15px;
  align-items: center;
}

.nav-links li {
  display: flex;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  font-size: 1rem;
  color: #555;
  font-weight: 500;
  display: flex;
  align-items: center;
  padding: 8px 15px;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: #f0f0f0;
}

.nav-links a:hover {
  color: #f7871f;
  background: #fff7f0;
}

.nav-links a.router-link-active {
  color: #f7871f;
  background: #fff7f0;
}

.nav-text {
  margin-left: 8px;
}

.icon-fix {
  width: 20px;
  text-align: center;
  color: #f7871f;
}

/* Mobile Menu Button */
.mobile-menu-button {
  display: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: var(--transition);
  background: var(--bg-color);
  box-shadow:
    5px 5px 10px var(--shadow-dark),
    -5px -5px 10px var(--shadow-light);
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
}

.hamburger-icon {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 20px;
  height: 14px;
}

.hamburger-icon .bar {
  height: 2px;
  width: 100%;
  background-color: var(--text-color);
  transition: var(--transition);
  border-radius: 2px;
}

.mobile-menu-button:hover {
  transform: scale(1.05);
}

.mobile-menu-button:hover .bar {
  background-color: var(--primary-color);
}

/* Transform hamburger to X when sidebar is open */
.hidden-checkbox:checked ~ .nav-bar .mobile-menu-button .hamburger-icon .bar:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.hidden-checkbox:checked ~ .nav-bar .mobile-menu-button .hamburger-icon .bar:nth-child(2) {
  opacity: 0;
}

.hidden-checkbox:checked ~ .nav-bar .mobile-menu-button .hamburger-icon .bar:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

/* Sidebar Styles */
.side_bar {
  background: var(--bg-color);
  position: fixed;
  top: 0;
  left: -100%;
  height: 100%;
  width: var(--sidebar-width);
  z-index: 1001;
  transition: var(--transition);
  box-shadow: 10px 0 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.hidden-checkbox:checked ~ .side_bar {
  left: 0;
}

.sidebar-header {
  height: var(--nav-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: auto;
}

.sidebar-links {
  list-style: none;
  margin-bottom: 20px;
}

.sidebar-links li {
  margin-bottom: 15px;
}

.sidebar-links a {
  position: relative;
  color: var(--text-color);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 12px;
  padding: 15px 20px;
  transition: var(--transition);
  background: var(--bg-color);
  box-shadow:
    5px 5px 10px var(--shadow-dark),
    -5px -5px 10px var(--shadow-light);
}

.sidebar-links a:hover {
  color: var(--primary-color);
  padding-left: 25px;
  transform: translateX(5px);
  box-shadow:
    3px 3px 6px var(--shadow-dark),
    -3px -3px 6px var(--shadow-light);
}

.sidebar-links a:active {
  transform: translateX(5px) scale(0.98);
  box-shadow:
    inset 2px 2px 5px var(--shadow-dark),
    inset -2px -2px 5px var(--shadow-light);
}

.sidebar-footer {
  padding: 20px 0;
  margin-top: auto;
}

.media_icons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.media_icons a {
  height: 45px;
  width: 45px;
  border-radius: 50%;
  text-align: center;
  line-height: 45px;
  color: var(--text-color);
  font-size: 1.1rem;
  background: var(--bg-color);
  transition: var(--transition);
  box-shadow:
    5px 5px 10px var(--shadow-dark),
    -5px -5px 10px var(--shadow-light);
}

.media_icons a:hover {
  color: var(--primary-color);
  transform: translateY(-3px) scale(1.1);
}

.close-sidebar {
  height: 40px;
  width: 40px;
  text-align: center;
  line-height: 40px;
  cursor: pointer;
  transition: var(--transition);
  color: var(--text-color);
  background: var(--bg-color);
  border-radius: 50%;
  box-shadow:
    3px 3px 6px var(--shadow-dark),
    -3px -3px 6px var(--shadow-light);
}

.close-sidebar:hover {
  color: var(--primary-color);
  transform: rotate(90deg);
}

/* Dropdown Styles */
.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background: var(--bg-color);
  border-radius: 4px;
  padding: 10px 0;
  box-shadow:
    0 8px 24px rgba(0,0,0,0.10),
    8px 8px 16px var(--shadow-dark),
    -8px -8px 16px var(--shadow-light);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  transition: opacity 0.2s, transform 0.2s;
  right: auto;
}

.dropdown-menu[aria-expanded="true"] {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.dropdown-menu[aria-expanded="false"] {
  opacity: 0;
  pointer-events: none;
  transform: translateY(-10px);
}

.dropdown-menu li {
  margin: 0;
}

.dropdown-item,
.dropdown-item:hover,
.dropdown-menu li a,
.dropdown-menu li a:hover,
.user-dropdown-menu li a,
.user-dropdown-menu li a:hover {
  border-radius: 0 !important;
}

.dropdown-item {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  color: var(--text-color);
  white-space: nowrap;
  width: 100%;
  transition: all 0.3s ease;
}

.dropdown-item i {
  margin-right: 10px;
  width: 20px;
  text-align: center;
}

/* Profile Item - Subtle Highlight */
.profile-item:hover {
  background: rgba(255,145,77,0.1);
  color: var(--primary-color);
  border-left: none;
  padding-left: 0;
}

/* Logout Item - Standout Highlight */
.logout-item:hover {
  background: rgba(255, 80, 80, 0.1);
  color: #ff5050;
  font-weight: 600;
  border-left: none;
  padding-left: 0;
}

.dropdown-arrow {
  margin-left: 8px;
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
}

/* User Dropdown Specific */
.user-dropdown-menu {
  right: 0;
  left: auto;
  min-width: 180px;
  border-radius: 0;
}

/* Mobile Dropdown Styles */
.mobile-dropdown-menu {
  padding-left: 20px;
  margin-top: 5px;
  animation: fadeIn 0.3s ease;
}

.mobile-dropdown-menu li {
  margin-bottom: 5px;
}

.mobile-dropdown-menu .dropdown-item {
  padding: 10px 15px;
}

.mobile-dropdown-menu .profile-item:hover {
  background: rgba(255,145,77,0.1);
  color: var(--primary-color);
  padding-left: 25px;
}

.mobile-dropdown-menu .logout-item:hover {
  background: rgba(255, 80, 80, 0.1);
  color: #ff5050;
  font-weight: 600;
  padding-left: 25px;
}

.rotate-arrow {
  transform: rotate(180deg);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .nav-links a {
    padding: 10px 15px;
    font-size: 0.9rem;
  }
}

@media (max-width: 900px) {
  .nav-links a .nav-text {
    display: none;
  }

  .nav-links a {
    padding: 12px;
    border-radius: 50%;
  }

  .icon-fix {
    margin-right: 0;
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .nav-links {
    display: none !important;
  }
  .mobile-menu-button {
    display: flex !important;
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 1100;
  }
  .side_bar {
    width: 260px; /* Ensure a consistent width */
    max-width: 100vw;
    min-width: 0;
    left: -260px; /* Hide it off-screen */
    box-shadow: 8px 0 24px rgba(0,0,0,0.08);
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    background: var(--bg-color);
    padding-top: 0;
  }
  .hidden-checkbox:checked ~ .side_bar {
    left: 0;
  }
  .sidebar-header {
    padding: 0 20px;
    height: 70px;
    border-bottom: none;
    box-shadow: none;
    background: var(--bg-color);
    border-top-right-radius: 0;
  }
  .sidebar-links {
    margin-top: 20px;
  }
  .sidebar-links a {
    margin-bottom: 10px;
    box-shadow:
      4px 4px 12px var(--shadow-dark),
      -4px -4px 12px var(--shadow-light);
    background: var(--bg-color);
    border-radius: 12px;
    padding: 12px 20px;
    font-size: 1rem;
    color: var(--text-color);
    display: flex;
    align-items: center;
    gap: 10px;
    transition: var(--transition);
  }
  .sidebar-links a:hover {
    color: var(--primary-color);
    background: #fff7f0;
    box-shadow:
      2px 2px 6px var(--shadow-dark),
      -2px -2px 6px var(--shadow-light);
  }
  .sidebar-footer {
    margin-top: auto;
    padding-bottom: 24px;
    display: flex;
    justify-content: center;
  }
  .media_icons {
    display: flex;
    gap: 18px;
  }
  .media_icons a {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    background: var(--bg-color);
    box-shadow:
      2px 2px 8px var(--shadow-dark),
      -2px -2px 8px var(--shadow-light);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-color);
    font-size: 1.1rem;
    transition: var(--transition);
  }
  .media_icons a:hover {
    color: var(--primary-color);
    background: #fff7f0;
    transform: scale(1.08);
  }
  .close-sidebar {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 1200;
    background: var(--bg-color);
    box-shadow:
      2px 2px 8px var(--shadow-dark),
      -2px -2px 8px var(--shadow-light);
  }
}

@media (max-width: 480px) {
  .menu-container {
    padding: 0 15px;
  }

  .logo a {
    font-size: 1.5rem;
  }

  .side_bar {
    width: 100vw; /* Full width on very small screens */
    min-width: 0;
    border-radius: 0;
    left: -100vw; /* Hide using full width */
  }
  .hidden-checkbox:checked ~ .side_bar {
    left: 0;
  }
  .sidebar-header {
    border-radius: 0;
  }
  .sidebar-links a {
    padding: 15px 20px;
  }
}

.logo-img {
  height: 38px;
  width: 38px;
  margin-right: 10px;
}

.dropdown-menu i,
.mobile-dropdown-menu i {
  margin-right: 10px;
}

@media (max-width: 1200px) {
  .dropdown-menu {
    right: 0;
    left: auto;
    min-width: 180px;
    max-width: 90vw;
  }
}

.dropdown-menu li a,
.user-dropdown-menu li a {
  transition: background 0.2s, color 0.2s;
  outline: none;
  border-radius: 4px;
  border-left: none;
  padding-left: 20px;
}

.dropdown-menu li a:hover,
.user-dropdown-menu li a:hover,
.dropdown-menu li a:focus,
.user-dropdown-menu li a:focus {
  background: rgba(255,145,77,0.12);
  color: var(--primary-color);
  border-left: none;
  padding-left: 20px;
}

.dropdown-menu li a:hover i,
.user-dropdown-menu li a:hover i,
.dropdown-menu li a:focus i,
.user-dropdown-menu li a:focus i {
  color: var(--primary-color);
}

/* Pet profiles styles */
.pet-profiles-container {
  max-width: 1200px;
  margin: 100px auto 60px;
  padding: 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  min-height: calc(100vh - 160px);
  display: flex;
  flex-direction: column;
}

.pet-profiles-header {
  text-align: center;
  margin-bottom: 2rem;
}

.pet-profiles-header h1 {
  font-size: 2.2rem;
  color: #f7871f;
  margin-bottom: 0.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.pet-profiles-header .subtitle {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 180px;
}

.filter-group label {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #444;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-group select {
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  font-size: 0.95rem;
  color: #333;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f7871f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

.filter-group select:focus {
  outline: none;
  border-color: #f7871f;
  box-shadow: 0 0 0 3px rgba(247, 135, 31, 0.15);
}

.reset-filters {
  background-color: white;
  color: #f7871f;
  padding: 0.75rem 1.5rem;
  border: 2px solid #f7871f;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-end;
  margin-top: 1.5rem;
}

.reset-filters i {
  font-size: 1rem;
}

.reset-filters:hover {
  background-color: #f7871f;
  color: white;
  transform: translateY(-2px);
}

.reset-filters:active {
  transform: translateY(0);
}

/* Pet Grid Layout */
.pet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
  flex-grow: 1;
}

.pet-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  width: 100%;
}

/* Wrapper for proper centering of pet cards */
.pet-grid {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  align-items: flex-start;
}

.pet-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 400px; /* Increased fixed height to account for button position */
  border: 1px solid #f0f0f0;
  width: 260px;
  flex: 0 0 260px;
}

.pet-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(247, 135, 31, 0.15);
  border-color: #ffe0c4;
}

.pet-image-container {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.pet-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.pet-card:hover .pet-img {
  transform: scale(1.05);
}

.pet-status {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.pet-status.available {
  background-color: #e3fcef;
  color: #00a854;
}

.pet-status.on-hold {
  background-color: #fff7e6;
  color: #fa8c16;
}

.pet-status.adopted {
  background-color: #f5f5f5;
  color: #8c8c8c;
}

.pet-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 200px; /* Fixed height for consistent button alignment */
  overflow: hidden;
  position: relative; /* For absolute positioning of the button */
}

.pet-info h2 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 700;
}

.pet-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.pet-details span {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: #666;
  background: #f8f8f8;
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
}

.pet-details span i {
  color: #f7871f;
  font-size: 0.9rem;
}

.pet-desc {
  color: #555;
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  display: box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  text-overflow: ellipsis;
  max-height: 2.8em; /* Limit height to 2 lines */
}

.meet-pet-btn {
  background-color: #f7871f;
  color: white;
  padding: 0.7rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  box-shadow: 0 4px 12px rgba(247, 135, 31, 0.2);
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  width: calc(100% - 2rem);
}

.meet-pet-btn:hover {
  background-color: #e67012;
  transform: translateY(-2px);
}

.meet-pet-btn:active {
  transform: translateY(0);
}

/* Loading and Error States */
.loading-state,
.error-state,
.no-results {
  text-align: center;
  padding: 4rem 2rem;
  border-radius: 12px;
  margin: 2rem 0;
}

.loading-state {
  background-color: #fff8f0;
  color: #f7871f;
}

.spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 4px solid rgba(247, 135, 31, 0.2);
  border-radius: 50%;
  border-top-color: #f7871f;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state {
  background-color: #fff0f0;
  color: #ff5252;
}

.error-state i,
.no-results i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-results {
  background-color: #f9f9f9;
  color: #666;
}

.retry-button,
.reset-button {
  background-color: #f7871f;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1.5rem;
  display: inline-block;
}

.retry-button:hover,
.reset-button:hover {
  background-color: #e67012;
  transform: translateY(-2px);
}

/* Responsive Adjustments */
@media (max-width: 992px) {
  .pet-profiles-container {
    margin: 90px auto 30px;
    padding: 1.5rem;
  }

  .filter-controls {
    padding: 1.2rem;
    gap: 1rem;
  }

  .filter-group {
    min-width: 160px;
  }

  .pet-card {
    width: 220px;
    flex: 0 0 220px;
  }
}

@media (max-width: 768px) {
  .pet-profiles-container {
    margin: 80px auto 20px;
    padding: 1rem;
  }

  .pet-profiles-header h1 {
    font-size: 1.8rem;
  }

  .pet-profiles-header .subtitle {
    font-size: 0.9rem;
  }

  .filter-controls {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
  }

  .filter-group {
    width: 100%;
  }

  .reset-filters {
    align-self: center;
    margin-top: 1rem;
  }

  .pet-card {
    width: 240px;
    flex: 0 0 240px;
  }

  .pagination {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination-info {
    order: -1;
  }
}

@media (max-width: 480px) {
  .pet-card {
    width: 100%;
    flex: 0 0 100%;
    max-width: 320px;
    height: 400px; /* Keep fixed height on mobile */
    min-height: 400px;
  }

  .pet-image-container {
    height: 200px;
  }
}

.results-summary {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.results-count {
  font-weight: 600;
  color: #f7871f;
}

.pet-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
}

/* Pagination Styles */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}

.pagination-btn {
  background-color: #f7871f;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn:hover {
  background-color: #e67012;
  transform: translateY(-2px);
}

.pagination-btn.disabled {
  background-color: #f0f0f0;
  color: #999;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.pagination-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
}

.pagination-summary {
  font-size: 0.8rem;
  color: #999;
  font-weight: normal;
}

/* Notification Styles */
.pet-adoption-notification {
  position: fixed;
  top: 100px;
  right: 20px;
  width: 280px;
  padding: 1.2rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  z-index: 1010;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: slideInRight 0.4s ease;
  border-left: 4px solid #f7871f;
}

.notification-content {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
}

.notification-content i {
  color: #f7871f;
  font-size: 1.4rem;
  margin-top: 0.2rem;
}

.notification-text {
  flex: 1;
}

.notification-text h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
}

.notification-text p {
  margin: 0.5rem 0 0 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
}

.close-notification {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  padding: 5px;
  border-radius: 50%;
  height: 26px;
  width: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-notification:hover {
  background-color: #f0f0f0;
  color: #333;
}

.notification-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
}

.notification-btn {
  flex: 1;
  background-color: #f7871f;
  color: white;
  padding: 0.7rem 0.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  text-decoration: none;
}

.login-btn {
  background-color: #f7871f;
}

.signup-btn {
  background-color: #fff;
  border: 2px solid #f7871f;
  color: #f7871f;
}

.notification-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.login-btn:hover {
  background-color: #e67012;
}

.signup-btn:hover {
  background-color: #fff7f0;
}

@keyframes slideInRight {
  from { 
    opacity: 0;
    transform: translateX(30px);
  }
  to { 
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .pet-adoption-notification {
    top: unset;
    bottom: 20px;
    right: 20px;
    left: 20px;
    width: calc(100% - 40px);
    max-width: 480px;
    margin: 0 auto;
  }
}

/* Success Notification Styles */
.success-notification {
  border-left: 4px solid #4CAF50;
}

.success-notification i {
  color: #4CAF50;
}

.success-notification h4 {
  color: #4CAF50;
}
</style>