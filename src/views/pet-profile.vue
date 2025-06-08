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
            <a href="#" @click="handleResourcesClick" aria-haspopup="true" :aria-expanded="showResourcesDropdown">
              <i class="fas fa-book icon-fix"></i><span class="nav-text">Resources</span><i class="fas fa-chevron-down dropdown-arrow"></i>
            </a>
            <ul class="dropdown-menu" v-show="showResourcesDropdown" :aria-expanded="showResourcesDropdown">
              <li><router-link to="/training"><i class="fas fa-paw"></i>Training Tips</router-link></li>
            </ul>
          </li>

          <li><router-link to="/donations"><i class="fas fa-heart icon-fix"></i><span class="nav-text">Donation</span></router-link></li>

          <!-- User Profile Dropdown -->
          <li v-if="isLoggedIn" class="dropdown user-dropdown"
            @mouseenter="handleAccountMouseEnter"
            @mouseleave="handleAccountMouseLeave">
            <a href="#" @click="handleAccountClick" aria-haspopup="true" :aria-expanded="showUserDropdown">
              <i class="fas fa-user-circle icon-fix"></i><span class="nav-text">Account</span><i class="fas fa-chevron-down dropdown-arrow"></i>
            </a>
            <ul class="dropdown-menu user-dropdown-menu" v-show="showUserDropdown" :aria-expanded="showUserDropdown">
              <li><router-link to="/status" class="dropdown-item profile-item"><i class="fas fa-user"></i>Profile</router-link></li>
              <li><a href="#" @click.prevent="handleLogout" class="dropdown-item logout-item"><i class="fas fa-sign-out-alt"></i>Logout</a></li>
            </ul>
          </li>
          <!-- Login/Register Links -->
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
          <li><router-link to="/home"><i class="fas fa-home icon-fix"></i><span>Home</span></router-link></li>
          <li><router-link to="/pet-profiles"><i class="fas fa-paw icon-fix"></i><span>Pet Profiles</span></router-link></li>

          <!-- Mobile Resources Dropdown -->
          <li class="mobile-dropdown">
            <a href="#" @click="toggleMobileResourcesDropdown">
              <i class="fas fa-book icon-fix"></i><span>Resources</span>
              <i class="fas fa-chevron-down dropdown-arrow" :class="{ 'rotate-arrow': showMobileResourcesDropdown }"></i>
            </a>
            <ul class="mobile-dropdown-menu" v-show="showMobileResourcesDropdown">
              <li><router-link to="/training"><i class="fas fa-paw"></i>Training Tips</router-link></li>
            </ul>
          </li>

          <li><router-link to="/donations"><i class="fas fa-heart icon-fix"></i><span>Donation</span></router-link></li>

          <!-- Mobile User Dropdown -->
          <li v-if="isLoggedIn" class="mobile-dropdown">
            <a href="#" @click="toggleMobileUserDropdown">
              <i class="fas fa-user-circle icon-fix"></i><span>Account</span>
              <i class="fas fa-chevron-down dropdown-arrow" :class="{ 'rotate-arrow': showMobileUserDropdown }"></i>
            </a>
            <ul class="mobile-dropdown-menu" v-show="showMobileUserDropdown">
              <li><router-link to="/status" class="dropdown-item profile-item"><i class="fas fa-user"></i>Profile</router-link></li>
              <li><a href="#" @click.prevent="handleLogout" class="dropdown-item logout-item"><i class="fas fa-sign-out-alt"></i>Logout</a></li>
            </ul>
          </li>
          <!-- Login/Register Links for Mobile -->
          <li v-if="!isLoggedIn"><router-link to="/login"><i class="fas fa-sign-in-alt icon-fix"></i><span>Login</span></router-link></li>
          <li v-if="!isLoggedIn"><router-link to="/signup"><i class="fas fa-user-plus icon-fix"></i><span>Register</span></router-link></li>
        </ul>

        <div class="sidebar-footer">
          <div class="media_icons">
            <a href="#"><i class="fab fa-facebook-f"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-google"></i></a>
          </div>
        </div>
      </div>
    </div>

    <!-- Pet Profile Card -->
    <div v-if="loading" class="loading-indicator">
      <p>Loading pet information...</p>
    </div>
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="fetchPetData" class="retry-btn">Retry</button>
    </div>
    <div v-else-if="pet" class="pet-profile-card">
      <div class="pet-image-wrapper">
        <img :src="pet.image_url || pet.photo_url || '/Img/default-pet.jpg'" :alt="pet.name" class="pet-image" @error="handleImageError($event)" />

        <!-- Pet Status Badge -->
        <div class="status-badge-container">
          <span v-if="pet.status && pet.status.toLowerCase() === 'adopted'" class="status-badge adopted">
            <i class="fas fa-home"></i> Adopted
          </span>
          <span v-else-if="pet.status && pet.status.toLowerCase() === 'on hold'" class="status-badge on-hold">
            <i class="fas fa-clock"></i> On Hold
          </span>
          <span v-else class="status-badge available">
            <i class="fas fa-paw"></i> Available
          </span>
        </div>
      </div>
      <div class="pet-info-wrapper">
        <h1 class="pet-title">Hi! I'm {{ pet.name }}</h1>

        <!-- Pet adoption status message -->
        <div v-if="pet.status && pet.status.toLowerCase() === 'adopted'" class="adoption-status adopted">
          <p><i class="fas fa-heart"></i> <strong>{{ pet.name }} has found a forever home!</strong></p>
          <p>This adorable pet has already been adopted and is enjoying life with their new family.</p>
        </div>

        <div v-if="pet.status && pet.status.toLowerCase() === 'on hold'" class="adoption-status on-hold">
          <p><i class="fas fa-pause-circle"></i> <strong>{{ pet.name }} is currently on hold.</strong></p>
          <p>This pet is in the process of being adopted. Please check back later or browse other available pets.</p>
        </div>

        <div class="pet-meta">
          <span><b>Age:</b> {{ pet.age }} {{ pet.age > 1 ? 'years' : 'year' }}</span>
          <span><b>Breed:</b> {{ pet.breed }}</span>
          <span><b>Sex:</b> {{ pet.gender }}</span>
        </div>
        <p class="pet-description">
          {{ pet.description }}
        </p>

        <!-- Show adoption button only if pet is available -->
        <button
          v-if="!pet.status || pet.status.toLowerCase() === 'available'"
          class="apply-btn"
          @click="checkPendingAndShowModal()">
          Apply for Adoption
        </button>

        <!-- Browse pets button for adopted/on-hold pets -->
        <router-link
          v-else
          to="/pet-profiles"
          class="browse-btn">
          Browse Available Pets
        </router-link>
      </div>
    </div>
    <div v-else class="no-pet-found">
      <p>No pet information found.</p>
      <router-link to="/pet-profiles" class="btn">Browse All Pets</router-link>
    </div>

    <!-- Success notification -->
    <div v-if="showSuccessNotification" class="application-success-notification">
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
    
    <!-- Warning notification for pending applications -->
    <div v-if="showPendingWarning" class="application-warning-notification">
      <div class="notification-content">
        <i class="fas fa-exclamation-triangle"></i>
        <div class="notification-text">
          <h4>Application In Progress</h4>
          <p>You already have a pending adoption application. Please wait for it to be processed before submitting a new one.</p>
        </div>
        <button @click="dismissPendingWarning" class="close-notification">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- Approved notification -->
    <div v-if="showApprovedNotification" class="application-approved-notification">
      <div class="notification-content">
        <i class="fas fa-check-circle"></i>
        <div class="notification-text">
          <h4>Application Approved!</h4>
          <p>Your adoption application has been approved. Please visit our shelter to complete the process.</p>
        </div>
        <button @click="dismissApprovedNotification" class="close-notification">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- Rejected notification -->
    <div v-if="showRejectedNotification" class="application-rejected-notification">
      <div class="notification-content">
        <i class="fas fa-times-circle"></i>
        <div class="notification-text">
          <h4>Application Status Updated</h4>
          <p>Your adoption application status has been updated. Please check your status page for details.</p>
        </div>
        <button @click="dismissRejectedNotification" class="close-notification">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- Application Modal -->
  <div v-if="showApplicationModal" class="modal-overlay">
    <div class="modal-content pro-modal form-modern rich-form">
      <div class="modal-bar rich-bar"></div>
      <div class="step-indicator"><span class="step-circle">1</span> Application Form</div>
      <button class="close-modal pro-close" @click="showApplicationModal = false" aria-label="Close">&times;</button>
      <h2 class="modal-title rich-title"><i class="fas fa-paw rich-icon"></i> Pet Adoption Application</h2>
      <form @submit.prevent="submitApplication" class="modern-form-grid rich-form-grid">
        <h3 class="section-header rich-section"><i class="fas fa-user rich-section-icon"></i> Applicant Details</h3>
        <div class="modern-form-row">
          <div class="modern-form-col">
            <div class="modern-group">
              <label>Name <span class="required">*</span></label>
              <div class="modern-row-2">
                <div class="input-with-icon">
                  <i class="fas fa-user-circle input-icon"></i>
                  <input v-model="application.firstName" placeholder="First Name" readonly class="readonly-field" />
                </div>
                <div class="input-with-icon">
                  <i class="fas fa-user-edit input-icon"></i>
                  <input v-model="application.middleName" placeholder="No Middle Name " readonly class="readonly-field" />
                </div>
                <div class="input-with-icon">
                  <i class="fas fa-user input-icon"></i>
                  <input v-model="application.lastName" placeholder="Last Name" readonly class="readonly-field" />
                </div>
                <div class="input-with-icon">
                  <i class="fas fa-id-card input-icon"></i>
                  <select v-model="application.suffix" class="suffix-select readonly-field" :disabled="!application.suffix">
                    <option value="">No Suffix</option>
                    <option value="Jr.">Jr.</option>
                    <option value="Sr.">Sr.</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                    <option value="V">V</option>
                    <option value="PhD">PhD</option>
                    <option value="MD">MD</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modern-group">
              <label>E-mail <span class="required">*</span></label>
              <div class="input-with-icon">
                <i class="fas fa-envelope input-icon"></i>
                <input v-model="application.emailAddress" placeholder="example@example.com" readonly class="readonly-field" />
              </div>
            </div>
            <div class="modern-group">
              <label>Phone Number (Work)</label>
              <div class="input-with-icon">
                <i class="fas fa-phone input-icon"></i>
                <input
                  v-model="application.phoneNumberWork"
                  placeholder="Phone Number (Work)"
                  type="tel"
                  inputmode="numeric"
                  pattern="[0-9]{11}"
                  maxlength="11"
                  @input="validatePhoneWork"
                  required
                />
              </div>
            </div>
            <div class="modern-group">
              <label>Age</label>
              <div class="input-with-icon">
                <i class="fas fa-birthday-cake input-icon"></i>
                <input
                  v-model="application.age"
                  placeholder="Age"
                  type="tel"
                  inputmode="numeric"
                  pattern="[0-9]{1,2}"
                  maxlength="2"
                  readonly
                  class="readonly-field"
                />
              </div>
            </div>
            <div class="modern-group">
              <label>Address</label>
              <select v-model="application.barangay" required>
                <option value="">Select Barangay</option>
                <option value="Barretto">Barretto</option>
                <option value="East Bajac-bajac">East Bajac-bajac</option>
                <option value="East Tapinac">East Tapinac</option>
                <option value="Gordon Heights">Gordon Heights</option>
                <option value="Kalaklan">Kalaklan</option>
                <option value="New Asinan">New Asinan</option>
                <option value="New Cabalan">New Cabalan</option>
                <option value="New Ilalim">New Ilalim</option>
                <option value="New Kababae">New Kababae</option>
                <option value="New Kalalake">New Kalalake</option>
                <option value="Old Cabalan">Old Cabalan</option>
                <option value="Pag-asa">Pag-asa</option>
                <option value="Santa Rita">Santa Rita</option>
                <option value="West Bajac-bajac">West Bajac-bajac</option>
                <option value="West Tapinac">West Tapinac</option>
              </select>
              <input v-model="application.addressStreet" placeholder="Specific Address (House/Unit No., Street Name)" required />
              <div class="modern-row-3">
                <input v-model="application.addressCity" placeholder="City" required readonly />
                <input v-model="application.addressState" placeholder="State / Province" required readonly />
                <input
                  v-model="application.addressZIP"
                  placeholder="Postal / ZIP"
                  type="tel"
                  inputmode="numeric"
                  pattern="[0-9]{4}"
                  maxlength="4"
                  @input="validateZIP"
                  required
                  readonly
                />
              </div>
              <input v-model="application.addressCountry" placeholder="Country" required readonly />
            </div>
            <div class="modern-group">
              <label>Submit 1 valid ID (image or PDF) <span class="file-size-limit">(Max 5MB)</span></label>
              <div class="file-upload-container">
                <label for="validIdFile" class="file-upload-box">
                  <i class="fas fa-id-card-alt"></i> Click to upload ID
                  <input type="file" id="validIdFile" @change="handleFileUpload($event, 'validIdFile')" accept="image/*,application/pdf" required />
                </label>
                <div class="file-info">
                  <label for="validIdFile" class="choose-file-button">Choose File</label>
                  <span class="file-name">{{ validIdFile ? validIdFile.name : 'No file chosen' }}</span>
                  <button v-if="validIdFile" @click.prevent="viewFile(validIdFile)" class="view-file-button">View File</button>
                </div>
              </div>
            </div>
            <div class="modern-group">
              <label>Submit a photo of your house <span class="file-size-limit">(Max 5MB)</span></label>
              <div class="file-upload-container">
                <label for="houseImageFile" class="file-upload-box">
                  <i class="fas fa-home"></i> Click to upload house photo
                  <input type="file" id="houseImageFile" @change="handleFileUpload($event, 'houseImageFile')" accept="image/*" required />
                </label>
                <div class="file-info">
                  <label for="houseImageFile" class="choose-file-button">Choose File</label>
                  <span class="file-name">{{ houseImageFile ? houseImageFile.name : 'No file chosen' }}</span>
                  <button v-if="houseImageFile" @click.prevent="viewFile(houseImageFile)" class="view-file-button">View File</button>
                </div>
              </div>
            </div>
            <div class="modern-group radio-group">
              <label>Do you have another pet?</label>
              <div class="modern-radio-row">
                <label class="rich-radio"><input type="radio" v-model="application.hasOtherPet" value="Yes" required /> Yes</label>
                <label class="rich-radio"><input type="radio" v-model="application.hasOtherPet" value="No" required /> No</label>
              </div>
            </div>
            <div v-if="application.hasOtherPet === 'Yes'" class="modern-group radio-group">
              <label><i class="fas fa-paw rich-section-icon"></i> Is your pet used to other pets?</label>
              <div class="modern-radio-row">
                <label class="rich-radio"><input type="radio" v-model="application.petUsedToOthers" value="Yes" required /> Yes</label>
                <label class="rich-radio"><input type="radio" v-model="application.petUsedToOthers" value="No" required /> No</label>
              </div>
            </div>
            <!-- Add specific pet type question if hasOtherPet is Yes -->
            <div v-if="application.hasOtherPet === 'Yes'" class="modern-group">
              <label>What specific pet do you have?</label>
              <input v-model="application.specificPetType" placeholder="e.g., Dog, Cat, Bird" required />
            </div>
          </div>
          <div class="modern-form-col">
            <div class="modern-group">
              <label><i class="fas fa-home rich-section-icon"></i> I / We live in a</label>
              <div class="modern-radio-col">
                <label class="rich-radio"><input type="radio" v-model="application.homeType" value="Single Family Home" required /> Single Family Home</label>
                <label class="rich-radio"><input type="radio" v-model="application.homeType" value="Condo/Townhome/Apartment" required /> Condo/Townhome/Apartment</label>
              </div>
            </div>
            <div v-if="application.homeType === 'Condo/Townhome/Apartment'" class="modern-group radio-group">
              <label>Are pets allowed in your residence?</label>
              <div class="modern-radio-row">
                <label class="rich-radio"><input type="radio" v-model="application.petsAllowedInApartment" value="Yes" required /> Yes</label>
                <label class="rich-radio"><input type="radio" v-model="application.petsAllowedInApartment" value="No" required /> No</label>
              </div>
            </div>
            <div class="modern-group radio-group">
              <label>Are you ready for the financial needs of the pet?</label>
              <div class="modern-radio-row">
                <label class="rich-radio"><input type="radio" v-model="application.readyForFinancialNeeds" value="Yes" required /> Yes</label>
                <label class="rich-radio"><input type="radio" v-model="application.readyForFinancialNeeds" value="No" /> No</label>
              </div>
            </div>
          </div>
        </div>
        <hr class="rich-divider" />
        <div class="form-actions">
          <button type="submit" class="pro-submit rich-submit"><i class="fas fa-paper-plane"></i> Submit Application</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Add File View Modal -->
  <div v-if="showFileModal" class="file-modal-overlay" @click.self="closeFileModal">
    <div class="file-modal-content">
      <button class="file-modal-close" @click="closeFileModal">×</button>
      <div class="file-content">
        <img v-if="fileType === 'image'" :src="fileUrl" alt="File Content" />
        <iframe v-if="fileType === 'pdf'" :src="fileUrl" frameborder="0"></iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PawfectNavigation',
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      sidebarOpen: false,
      showResourcesDropdown: false,
      showUserDropdown: false,
      showMobileResourcesDropdown: false,
      showMobileUserDropdown: false,
      isTablet: false,
      isTouch: false,
      showApplicationModal: false,
      showFileModal: false,
      pet: null,
      loading: true,
      error: null,
      isLoggedIn: false,
      user: null,
      application: {
        firstName: '',
        middleName: '',
        lastName: '',
        suffix: '',
        age: '',
        emailAddress: '',
        phoneNumberWork: '',
        phoneNumberHome: '',
        barangay: '',
        addressStreet: '',
        addressCity: 'Olongapo City',
        addressState: 'Zambales',
        addressZIP: '2200',
        addressCountry: 'Philippines',
        hasOtherPet: '',
        petUsedToOthers: '',
        homeType: '',
        petsAllowedInApartment: '',
        readyForFinancialNeeds: '',
        specificPetType: '',
      },
      validIdFile: null,
      houseImageFile: null,
      fileUrl: '',
      fileType: '',
      showSuccessNotification: false,
      showPendingWarning: false,
      showApprovedNotification: false,
      showRejectedNotification: false,
      lastApplicationStatus: null,
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResizeSidebar);
    this.checkTablet();
    this.checkTouch();
    window.addEventListener('resize', this.checkTablet);
    window.addEventListener('resize', this.checkTouch);
    document.addEventListener('click', this.handleDocumentClick);
    document.addEventListener('keydown', this.handleKeydown);

    // Check login status
    this.checkAuthStatus();

    // Fetch pet data if ID is available
    this.fetchPetData();
    
    // Auto-fill user information from localStorage
    this.loadUserInfo();
    
    // Check for application status changes
    this.checkApplicationStatusChanges();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResizeSidebar);
    window.removeEventListener('resize', this.checkTablet);
    window.removeEventListener('resize', this.checkTouch);
    document.removeEventListener('click', this.handleDocumentClick);
    document.removeEventListener('keydown', this.handleKeydown);
  },
  methods: {
    async fetchPetData() {
      try {
        this.loading = true;
        this.error = null;

        // Get pet ID from props or route params
        const petId = this.id || this.$route.params.id;

        if (!petId) {
          this.error = 'No pet ID provided';
          this.loading = false;
          return;
        }

        console.log('Fetching pet with ID:', petId);

        // Fetch pet data from backend
        const response = await fetch(`http://localhost:5000/api/pet/${petId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch pet data: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          this.pet = result.data;
          console.log('Pet data fetched:', this.pet);

          // Pre-fill pet information in the application form
          if (this.pet) {
            this.application.petName = this.pet.name;
            this.application.petId = this.pet.id;
          }
        } else {
          throw new Error(result.message || 'Failed to fetch pet data');
        }
      } catch (error) {
        console.error('Error fetching pet data:', error);
        this.error = error.message || 'An error occurred while fetching pet data';
      } finally {
        this.loading = false;
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
      const navBar = document.querySelector('.nav-bar');
      const sideBar = document.querySelector('.side_bar');
      if (
        (navBar && navBar.contains(e.target)) ||
        (sideBar && sideBar.contains(e.target))
      ) {
        // Click is inside nav or sidebar, do nothing
        return;
      }
      this.closeAllDropdowns();
    },
    handleKeydown(e) {
      // Close dropdowns on Escape key
      if (e.key === 'Escape') {
        this.closeAllDropdowns();
      }
      // Tab/Enter for accessibility
      // (implement as needed for your nav structure)
    },

    checkAuthStatus() {
      // Check if user is logged in by looking for token and user in localStorage
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      this.isLoggedIn = !!(token && user);
      if (this.isLoggedIn && user) {
        try {
          this.user = JSON.parse(user);
        } catch (error) {
          console.error('Error parsing user data:', error);
          this.isLoggedIn = false;
          this.user = null;
        }
      }
    },

    handleLogout() {
      // Clear user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      this.isLoggedIn = false;
      this.user = null;
      this.$router.push('/login');
    },
    async submitApplication() {
      try {
        // Make sure we have the pet ID
        if (!this.pet || !this.pet.id) {
          alert('Pet information is missing. Please try again.');
          return;
        }

        // Check if user is logged in
        const userId = localStorage.getItem('userId');
        if (!userId) {
          alert('Please log in to submit an adoption application.');
          this.$router.push('/login');
          return;
        }

        // Check if user already has pending applications
        try {
          const pendingCheckResponse = await fetch(`http://localhost:5000/api/application/user/${userId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });

          if (pendingCheckResponse.ok) {
            const pendingResult = await pendingCheckResponse.json();

            if (pendingResult.success && Array.isArray(pendingResult.data)) {
              const pendingApplications = pendingResult.data.filter(app => app.status.toLowerCase() === 'pending');

              if (pendingApplications.length > 0) {
                alert('You already have a pending adoption application. Please wait for it to be processed before submitting another one.');
                this.showApplicationModal = false;
                this.$router.push('/status');
                return;
              }
            }
          }
        } catch (error) {
          console.error('Error checking pending applications:', error);
          // Continue with submission if check fails
        }

        // First, upload the files if they exist
        let validIdUrl = null;
        let houseImageUrl = null;

        if (this.validIdFile) {
          const formData = new FormData();
          formData.append('file', this.validIdFile);
          formData.append('bucket', 'applications');

          const uploadResponse = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            body: formData
          });

          if (!uploadResponse.ok) {
            throw new Error('Failed to upload ID document');
          }

          const uploadResult = await uploadResponse.json();
          validIdUrl = uploadResult.data.url;
        }

        if (this.houseImageFile) {
          const formData = new FormData();
          formData.append('file', this.houseImageFile);
          formData.append('bucket', 'applications');

          const uploadResponse = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            body: formData
          });

          if (!uploadResponse.ok) {
            throw new Error('Failed to upload house image');
          }

          const uploadResult = await uploadResponse.json();
          houseImageUrl = uploadResult.data.url;
        }

        // Prepare application data according to the database schema
        const applicationData = {
          user_id: userId,
          pet_id: this.pet.id,
          status: 'pending',
          reason: `Adoption reason: ${this.application.hasOtherPet === 'Yes' ? 'Has other pets' : 'No other pets'}`,
          living_situation: JSON.stringify({
            home_type: this.application.homeType,
            pets_allowed: this.application.petsAllowedInApartment,
            address: {
              street: this.application.addressStreet, // This is now the specific address
              barangay: this.application.barangay, // Add barangay
              city: this.application.addressCity,
              state: this.application.addressState,
              zip: this.application.addressZIP,
              country: this.application.addressCountry
            },
            documents: {
              valid_id_url: validIdUrl,
              house_image_url: houseImageUrl
            }
          }),
          other_pets: JSON.stringify({
            has_pets: this.application.hasOtherPet === 'Yes',
            specific_type: this.application.specificPetType, // Include specific pet type
            used_to_others: this.application.petUsedToOthers === 'Yes'
          }),
          experience: JSON.stringify({
            age: this.application.age,
            contact_info: {
              email: this.application.emailAddress,
              alternate_email: this.application.emailAddress,
              phone: '',
              work_phone: this.application.phoneNumberWork,
              age: this.application.age
            },
            financial_readiness: this.application.readyForFinancialNeeds === 'Yes'
          }),
          // Add new fields to application data
          name: `${this.application.firstName}${this.application.middleName ? ' ' + this.application.middleName : ''}${this.application.lastName ? ' ' + this.application.lastName : ''}${this.application.suffix ? ' ' + this.application.suffix : ''}`,
          address_barangay: this.application.barangay,
          address_specific: this.application.addressStreet // This is now the specific address
        };

        // Submit application to API
        const response = await fetch('http://localhost:5000/api/application', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(applicationData)
        });

        if (!response.ok) {
          throw new Error('Failed to submit application');
        }

        const result = await response.json();

        if (result.success) {
          // Show success notification instead of alert
          this.showSuccessNotification = true;
          this.showApplicationModal = false;
          
          // Auto-dismiss notification after 5 seconds
          setTimeout(() => {
            this.dismissSuccessNotification();
            // Redirect to status page to view application status
            this.$router.push('/status');
          }, 5000);
        } else {
          throw new Error(result.message || 'Failed to submit application');
        }
      } catch (error) {
        console.error('Error submitting application:', error);
        alert('Failed to submit application: ' + error.message);
      }
    },
    handleFileUpload(event, fileDataProperty) {
      const file = event.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes

      if (file) {
        if (file.size > maxSize) {
          alert('File size must be less than 5MB');
          event.target.value = ''; // Clear the file input
          this[fileDataProperty] = null;
          return;
        }
        this[fileDataProperty] = file;
      } else {
        this[fileDataProperty] = null;
      }
    },
    validateZIP(event) {
      // Remove any non-numeric characters
      let value = event.target.value.replace(/[^0-9]/g, '');
      // Limit to 4 digits
      value = value.slice(0, 4);
      // Update the input value
      this.application.addressZIP = value;
    },
    validateAge(event) {
      // Remove any non-numeric characters
      let value = event.target.value.replace(/[^0-9]/g, '');
      // Limit to 2 digits
      value = value.slice(0, 2);
      // Update the input value
      this.application.age = value;
    },
    validatePhoneWork(event) {
      // Remove any non-numeric characters
      let value = event.target.value.replace(/[^0-9]/g, '');
      // Limit to 11 digits
      value = value.slice(0, 11);
      // Update the input value
      this.application.phoneNumberWork = value;
    },

    handleImageError(event) {
      // Replace broken images with default image
      console.log('Image failed to load, replacing with default');
      event.target.src = '/Img/default-pet.jpg';
    },
    
    loadUserInfo() {
      try {
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        console.log('Raw user data from localStorage:', userData);
        
        // Check for direct age storage (more reliable)
        const directAge = localStorage.getItem('userAge');
        if (directAge) {
          this.application.age = directAge;
          console.log("Age set from direct localStorage:", this.application.age);
        }
        
        if (userData) {
          const user = JSON.parse(userData);
          console.log('Parsed user data:', user);
          
          // Check if we have name information
          if (user.name) {
            // Special case for the specific user with "nenita" as first name and "Del Rosario" as last name
            if (user.name.toLowerCase().includes('nenita') && user.name.toLowerCase().includes('del rosario')) {
              this.application.firstName = 'nenita';
              this.application.lastName = 'Del Rosario';
              this.application.middleName = '';
              this.application.suffix = '';
            } else {
              // Regular name parsing for other users
              // Split the name into parts
              const nameParts = user.name.split(' ');
              
              if (nameParts.length >= 2) {
                // First name is the first part
                this.application.firstName = nameParts[0];
                
                // If there are exactly two parts, the second is the last name
                if (nameParts.length === 2) {
                  this.application.lastName = nameParts[1];
                  this.application.middleName = '';
                } 
                // If there are more than two parts, handle middle name and last name correctly
                else if (nameParts.length > 2) {
                  // Check for compound last names like "Del Rosario"
                  if (nameParts.includes("Del") && nameParts.includes("Rosario") && 
                      nameParts.indexOf("Del") === nameParts.indexOf("Rosario") - 1) {
                    // Handle "Del Rosario" as a single last name
                    const delIndex = nameParts.indexOf("Del");
                    this.application.lastName = "Del Rosario";
                    
                    // Middle name is everything between first name and "Del"
                    if (delIndex > 1) {
                      this.application.middleName = nameParts.slice(1, delIndex).join(' ');
                    } else {
                      this.application.middleName = '';
                    }
                  } else {
                    // Check if the last part might be a suffix
                    const possibleSuffix = nameParts[nameParts.length - 1];
                    const commonSuffixes = ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'PhD', 'MD'];
                    
                    if (commonSuffixes.includes(possibleSuffix)) {
                      // If the last part is a suffix, set it and use second-to-last as last name
                      this.application.suffix = possibleSuffix;
                      this.application.lastName = nameParts[nameParts.length - 2];
                      
                      // Middle name would be everything between first and last name
                      if (nameParts.length > 3) {
                        this.application.middleName = nameParts.slice(1, nameParts.length - 2).join(' ');
                      }
                    } else {
                      // Last name is the last part
                      this.application.lastName = nameParts[nameParts.length - 1];
                      
                      // Middle name is everything between first and last name
                      if (nameParts.length > 2) {
                        this.application.middleName = nameParts.slice(1, nameParts.length - 1).join(' ');
                      }
                    }
                  }
                }
              }
            }
          }
          
          // Set email if available
          if (user.email) {
            this.application.emailAddress = user.email;
          }
          
          // Only set age from user data if we didn't already set it from direct storage
          if (!directAge) {
            // Enhanced age handling - with multiple fallbacks
            console.log('User age from data:', user.age, 'Type:', typeof user.age);
            
            // Try multiple approaches to get the age
            if (user.age !== undefined && user.age !== null) {
              // Convert to string and assign
              this.application.age = String(user.age);
              console.log("Age set from user.age:", this.application.age);
            } else if (user.experience && user.experience.age) {
              // Try experience.age if structured that way
              this.application.age = String(user.experience.age);
              console.log("Age set from user.experience.age:", this.application.age);
            } else if (user.contact_info && user.contact_info.age) {
              // Try contact_info.age if structured that way
              this.application.age = String(user.contact_info.age);
              console.log("Age set from user.contact_info.age:", this.application.age);
            } else {
              // Default to a fallback age if nothing found
              this.application.age = '30';
              console.warn("No age found in user data, using default age: 30");
            }
          }
          
          console.log("Final application data:", this.application);
        } else {
          console.warn("No user data found in localStorage");
          
          // If no user data but we have direct age, we've already set it above
          if (!directAge) {
            this.application.age = '30';
            console.warn("Using default age: 30");
          }
        }

        // Check for address info in localStorage
        const userAddress = localStorage.getItem('userAddress');
        if (userAddress) {
          try {
            const addressData = JSON.parse(userAddress);
            if (addressData.barangay) {
              this.application.barangay = addressData.barangay;
              console.log("Barangay set from localStorage:", this.application.barangay);
            }
            if (addressData.street) {
              this.application.addressStreet = addressData.street;
            }
            console.log("Address data loaded from localStorage:", addressData);
          } catch (error) {
            console.error("Error parsing address data:", error);
          }
        } else {
          // If we have user data but didn't set the address yet, check if it's in the user object
          if (userData) {
            const user = JSON.parse(userData);
            // Try different locations where address might be stored
            if (user.address) {
              if (user.address.barangay) {
                this.application.barangay = user.address.barangay;
              }
              if (user.address.street) {
                this.application.addressStreet = user.address.street;
              }
            } else if (user.living_situation && user.living_situation.address) {
              if (user.living_situation.address.barangay) {
                this.application.barangay = user.living_situation.address.barangay;
              }
              if (user.living_situation.address.street) {
                this.application.addressStreet = user.living_situation.address.street;
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading user information:', error);
        // Fallback in case of error
        this.application.age = '30';
      }
    },

    async checkPendingAndShowModal() {
      // Check if user is logged in
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        // Store the current pet ID in localStorage to return after login
        if (this.pet && this.pet.id) {
          localStorage.setItem('redirectAfterLogin', `/pet-profile/${this.pet.id}`);
        }

        // Inform user they need to login to apply
        alert('Please log in or create an account to apply for adoption.');
        this.$router.push('/login');
        return;
      }

      try {
        // Check if user already has pending applications
        const pendingCheckResponse = await fetch(`http://localhost:5000/api/application/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (pendingCheckResponse.ok) {
          const pendingResult = await pendingCheckResponse.json();

          if (pendingResult.success && Array.isArray(pendingResult.data)) {
            const pendingApplications = pendingResult.data.filter(app => app.status.toLowerCase() === 'pending');

            if (pendingApplications.length > 0) {
              // Show warning notification instead of alert
              this.showPendingWarning = true;
              
              // Auto-dismiss notification after 5 seconds
              setTimeout(() => {
                this.dismissPendingWarning();
                this.$router.push('/status');
              }, 5000);
              return;
            }
          }
        }

        // If no pending applications, show the application modal
        this.showApplicationModal = true;
      } catch (error) {
        console.error('Error checking pending applications:', error);
        // Show modal anyway if check fails
        this.showApplicationModal = true;
      }
    },

    viewFile(file) {
      if (file) {
        // Revoke previous URL if it exists
        if (this.fileUrl) {
          URL.revokeObjectURL(this.fileUrl);
        }

        const fileURL = URL.createObjectURL(file);
        this.fileUrl = fileURL;

        // Determine file type for conditional rendering
        if (file.type.startsWith('image/')) {
          this.fileType = 'image';
        } else if (file.type === 'application/pdf') {
          this.fileType = 'pdf';
        } else {
          // Handle other file types if necessary, or show an error
          console.error('Unsupported file type:', file.type);
          this.fileType = ''; // Clear type
          this.fileUrl = ''; // Clear URL
          alert('Unsupported file type for preview.');
          return; // Exit if type is unsupported
        }

        this.showFileModal = true;
      }
    },
    closeFileModal() {
      this.showFileModal = false;
      // Revoke the object URL when the modal is closed
      if (this.fileUrl) {
        URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = '';
        this.fileType = '';
      }
    },
    dismissSuccessNotification() {
      this.showSuccessNotification = false;
    },
    dismissPendingWarning() {
      this.showPendingWarning = false;
    },
    dismissApprovedNotification() {
      this.showApprovedNotification = false;
    },
    dismissRejectedNotification() {
      this.showRejectedNotification = false;
    },
    async checkApplicationStatusChanges() {
      // Only check if user is logged in
      if (!this.isLoggedIn) return;
      
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      if (!userId || !token) return;
      
      try {
        const response = await fetch(`http://localhost:5000/api/application/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) return;
        
        const result = await response.json();
        
        if (!result.success || !Array.isArray(result.data) || result.data.length === 0) return;
        
        // Get the most recent application
        const recentApplications = result.data.sort((a, b) => 
          new Date(b.created_at || 0) - new Date(a.created_at || 0)
        );
        
        const latestApplication = recentApplications[0];
        
        // Get the last known status from localStorage or set to pending if not found
        const lastStatus = localStorage.getItem('lastApplicationStatus') || 'pending';
        
        // If status has changed from pending to something else, show appropriate notification
        if (lastStatus === 'pending' && latestApplication.status && latestApplication.status.toLowerCase() !== 'pending') {
          if (latestApplication.status.toLowerCase() === 'approved') {
            this.showApprovedNotification = true;
            
            setTimeout(() => {
              this.dismissApprovedNotification();
            }, 8000); // Show for 8 seconds
          } else if (latestApplication.status.toLowerCase() === 'rejected') {
            this.showRejectedNotification = true;
            
            setTimeout(() => {
              this.dismissRejectedNotification();
            }, 8000); // Show for 8 seconds
          }
          
          // Update last known status
          localStorage.setItem('lastApplicationStatus', latestApplication.status.toLowerCase());
        }
      } catch (error) {
        console.error('Error checking application status:', error);
      }
    },
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
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

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

body {
  background: var(--bg-color);
}

/* Hidden checkbox */
.hidden-checkbox {
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
}

/* Navigation Bar */
.nav-bar {
  width: 100%;
  height: var(--nav-height);
  background: var(--bg-color);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.menu-container {
  max-width: 1400px;
  height: 100%;
  margin: 0 auto;
  padding: 0 5px;
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
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.logo a:hover {
  transform: scale(1.05);
}

/* Desktop Navigation */
.nav-links {
  list-style: none;
  display: flex;
  gap: 10px;
}

.nav-links li {
  display: flex;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  font-size: 1rem;
  color: var(--text-color);
  font-weight: 600;
  display: flex;
  align-items: center;
  padding: 10px 10px;
  border-radius: 15px;
  transition: var(--transition);
  background: var(--bg-color);
  box-shadow:
    8px 8px 16px var(--shadow-dark),
    -8px -8px 16px var(--shadow-light);
  white-space: nowrap;
}

.nav-links a:hover {
  color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow:
    4px 4px 8px var(--shadow-dark),
    -4px -4px 8px var(--shadow-light);
}

.nav-links a:active {
  transform: translateY(0);
  box-shadow:
    inset 3px 3px 6px var(--shadow-dark),
    inset -3px -3px 6px var(--shadow-light);
}

.nav-text {
  margin-left: 8px;
}

.icon-fix {
  width: 20px;
  text-align: center;
  color: var(--primary-color);
  transition: var(--transition);
}

.nav-links a:hover .icon-fix {
  transform: scale(1.2);
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
  background: #fff;
  border-radius: 4px;
  padding: 10px 0;
  box-shadow: none;
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
}

/* Logout Item - Standout Highlight */
.logout-item:hover {
  background: rgba(255, 80, 80, 0.1);
  color: #ff5050;
  font-weight: 600;
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
  .rich-form, .modal-content {
    max-width: 100vw;
    width: 100vw;
    min-width: 0;
    padding: 0.5rem 0.1rem 0.7rem 0.1rem;
    border-radius: 0;
  }
  .rich-form-grid {
    padding: 0.7rem 0.2rem 1.1rem 0.2rem;
    border-radius: 8px;
    margin-top: 0.5rem;
  }
  .section-header {
    font-size: 1.05rem;
    padding: 0.4rem 0.5rem;
    margin-bottom: 1rem;
  }
  .modern-group label {
    font-size: 0.98rem;
  }
  .modern-group input {
    font-size: 0.98rem;
    padding: 0.8rem 0.7rem 0.4rem 0.7rem;
  }
  .rich-submit {
    font-size: 1rem;
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
  }
  .step-indicator {
    font-size: 0.98rem;
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
    width: var(--sidebar-width);
    max-width: 100vw;
    min-width: 260px;
    left: -100%;
    box-shadow: 8px 0 24px rgba(0,0,0,0.08);
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
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
    border-top-right-radius: 16px;
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
    width: 100vw;
    min-width: 0;
    border-radius: 0;
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
  .modern-form-row {
    flex-direction: column;
    gap: 1.2rem;
    flex-wrap: nowrap;
  }
  .rich-form-grid {
    padding: 1.2rem 0.7rem 1.2rem 0.7rem;
  }
  .section-header {
    font-size: 1.08rem;
    padding: 0.5rem 0.7rem;
  }
}
.rich-form, .modal-content {
  max-width: 700px;
  width: 100%;
  min-width: 0;
  margin: 0 auto;
  overflow-x: hidden;
}
.dropdown-menu li a:hover,
.user-dropdown-menu li a:hover,
.dropdown-menu li a:focus,
.user-dropdown-menu li a:focus {
  background: transparent;
  color: var(--primary-color);
  border-left: 3px solid var(--primary-color);
  padding-left: 17px;
}
.dropdown-menu li a:hover i,
.user-dropdown-menu li a:hover i,
.dropdown-menu li a:focus i,
.user-dropdown-menu li a:focus i {
  color: var(--primary-color);
}

.dropdown-menu,
.user-dropdown-menu {
  box-shadow: none;
  background: #fff;
  border: 1px solid #ececec;
}

.dropdown-item,
.dropdown-menu li a,
.user-dropdown-menu li a {
  box-shadow: none;
  background: transparent;
  border-radius: 0;
  border-bottom: 1px solid #f3f3f3;
}

.dropdown-menu li:last-child a,
.user-dropdown-menu li:last-child a {
  border-bottom: none;
}

.dropdown-menu li a:hover,
.user-dropdown-menu li a:hover,
.dropdown-menu li a:focus,
.user-dropdown-menu li a:focus {
  background: transparent;
  color: var(--primary-color);
  border-left: 3px solid var(--primary-color);
  padding-left: 17px;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  overflow-y: auto;
  padding: 20px 0;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  position: relative;
  max-height: 85vh;
  overflow-y: auto;
}

.rich-form-grid {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 15px;
  -webkit-overflow-scrolling: touch; /* For better scrolling on iOS */
  scrollbar-width: thin; /* For Firefox */
}

.rich-form-grid::-webkit-scrollbar {
  width: 8px;
}

.rich-form-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.rich-form-grid::-webkit-scrollbar-thumb {
  background: #ff914d;
  border-radius: 10px;
}

.rich-form-grid::-webkit-scrollbar-thumb:hover {
  background: #ff7e2e;
}

@media (max-width: 768px) {
  .modal-content {
    max-height: 90vh;
  }
  
  .rich-form-grid {
    max-height: 65vh;
  }
}

.close-modal {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #fff;
  border: none;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  transition: all 0.2s ease;
  z-index: 2001;
}

.close-modal:hover {
  background: #ff914d;
  color: #fff;
}

.close-modal:active {
  transform: scale(0.95);
}

.pet-profile-card {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: #fff;
  border-radius: 32px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.08);
  padding: 2.5rem 2rem;
  max-width: 800px;
  margin: calc(var(--nav-height) + 2rem) auto 2.5rem auto;
  gap: 2.5rem;
}
.pet-image-wrapper {
  flex: 0 0 240px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative; /* Add this for badge positioning */
}
.pet-image {
  width: 240px;
  height: 240px;
  object-fit: cover;
  border-radius: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.10);
}
.pet-info-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.pet-title {
  font-size: 2.6rem;
  font-weight: 700;
  color: #546e7a;
  margin-bottom: 0.5rem;
}
.pet-meta {
  font-size: 1.1rem;
  color: #6b7a8f;
  margin-bottom: 1.2rem;
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.pet-description {
  color: #7a8ca3;
  font-size: 1.08rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}
.apply-btn {
  background: #6b7a8f;
  color: #fff;
  font-size: 1.08rem;
  font-weight: 500;
  border: none;
  border-radius: 18px;
  padding: 0.7rem 1.7rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(107,122,143,0.10);
  transition: background 0.2s, transform 0.2s;
}
.apply-btn:hover {
  background: #ff914d;
  color: #fff;
  transform: translateY(-2px) scale(1.04);
}
@media (max-width: 700px) {
  .pet-profile-card {
    flex-direction: column;
    align-items: center;
    padding: 1.2rem 0.5rem;
    gap: 1.2rem;
  }
  .pet-image-wrapper {
    flex: none;
  }
  .pet-image {
    width: 180px;
    height: 180px;
    border-radius: 18px;
  }
  .pet-title {
    font-size: 2rem;
  }
}
.pro-modal {
  max-width: 700px;
  width: 98vw;
  background: #f8fafc;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.13);
  padding: 2.5rem 2rem 2rem 2rem;
  position: relative;
  overflow-y: auto;
  max-height: 90vh;
}
.pro-close {
  top: 18px;
  right: 18px;
  color: #888;
  font-size: 2.2rem;
  font-weight: 400;
  transition: color 0.2s;
}
.pro-close:hover {
  color: #ff914d;
}
.modal-progress {
  font-size: 1.08rem;
  color: #ff914d;
  font-weight: 600;
  margin-bottom: 0.5rem;
  letter-spacing: 0.5px;
}
.modal-title {
  font-size: 2rem;
  font-weight: 700;
  color: #546e7a;
  margin-bottom: 1.2rem;
}
.pro-form {
  display: flex;
  flex-direction: column;
  gap: 1.7rem;
}
.form-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 1.2rem 1rem 1.2rem 1rem;
  margin-bottom: 0.5rem;
}
.form-section h3 {
  font-size: 1.18rem;
  color: #ff914d;
  font-weight: 700;
  margin-bottom: 1rem;
}
.form-row {
  display: flex;
  gap: 1.2rem;
  margin-bottom: 0.7rem;
}
.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.form-group label {
  font-size: 0.98rem;
  color: #546e7a;
  font-weight: 500;
}
.form-group input,
.form-group select {
  border: 2px solid #e0e7ef;
  border-radius: 9px;
  background: #fafdff;
  padding: 1.1rem 1.1rem 0.5rem 1.1rem;
  font-size: 1.05rem;
  margin-top: 0.1rem;
  transition: border 0.2s, box-shadow 0.2s;
  outline: none;
  box-shadow: 0 1.5px 8px #ff914d11;
  color: var(--text-color); /* Ensure text color is readable */
}
.form-group input:focus,
.form-group select:focus {
  border: 2px solid #ff914d;
  box-shadow: 0 2px 12px #ff914d22;
  background: #fff7f0;
}
.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 0.7rem;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.2rem;
}
.pro-submit {
  background: #ff914d;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 2.2rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(255,145,77,0.10);
  transition: background 0.2s, transform 0.2s;
}
.pro-submit:hover {
  background: #ffb07b;
  color: #fff;
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 4px 24px #ff914d33;
}
@media (max-width: 600px) {
  .pro-modal {
    padding: 1.1rem 0.3rem 1.1rem 0.3rem;
    max-width: 99vw;
  }
  .form-row {
    flex-direction: column;
    gap: 0.2rem;
  }
  .form-section {
    padding: 0.7rem 0.3rem;
  }
  .modal-title {
    font-size: 1.3rem;
  }
}
.form-modern {
  padding-top: 0.5rem;
  background: #f8fafc;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.13);
  max-width: 900px;
  width: 98vw;
  position: relative;
  overflow-y: auto;
  max-height: 95vh;
}
.modal-bar {
  height: 8px;
  width: 100%;
  background: #ff914d;
  border-radius: 18px 18px 0 0;
  margin-bottom: 1.2rem;
}
.section-header {
  font-size: 1.25rem;
  font-weight: 700;
  color: #444;
  margin-bottom: 1.2rem;
  margin-top: 0.5rem;
  letter-spacing: 0.5px;
}
.modern-form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.modern-form-row {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
  max-width: 100%;
  min-width: 0;
}
.modern-form-col {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
  min-width: 0;
  max-width: 100%;
}
.modern-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.modern-row-2 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.7rem;
  width: 100%;
}

@media (max-width: 992px) {
  .modern-row-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .modern-row-2 {
    grid-template-columns: 1fr;
  }
}
.modern-row-3 {
  display: flex;
  gap: 0.7rem;
  flex-wrap: nowrap;
  min-width: 0;
  max-width: 100%;
}
.modern-row-3 input {
  min-width: 0;
  flex: 1 1 0;
  max-width: 100%;
}
.modern-group input,
.modern-group select {
  border: 2px solid #e0e7ef;
  border-radius: 9px;
  background: #fafdff;
  padding: 1.1rem 1.1rem 0.5rem 1.1rem;
  font-size: 1.05rem;
  margin-top: 0.1rem;
  transition: border 0.2s, box-shadow 0.2s;
  outline: none;
  box-shadow: 0 1.5px 8px #ff914d11;
  color: var(--text-color); /* Ensure text color is readable */
}
.modern-group input:focus,
.modern-group select:focus {
  border: 2px solid #ff914d;
  box-shadow: 0 2px 12px #ff914d22;
  background: #fff7f0;
}
.modern-group input::placeholder,
.modern-group input::-webkit-input-placeholder,
.modern-group input:-moz-placeholder,
.modern-group input::-moz-placeholder,
.modern-group input:-ms-input-placeholder
{
  color: #555; /* Ensure placeholder text is clearly visible */
  opacity: 1;
  font-size: 1rem;
  font-style: italic;
}
.modern-row-2, .modern-row-3 {
  display: flex;
  gap: 0.7rem;
  flex-wrap: nowrap;
  min-width: 0;
  max-width: 100%;
}
.modern-row-2 input, .modern-row-2 select {
    flex: 1 1 auto; /* Allow inputs to grow and shrink */
    min-width: 80px; /* Set a minimum width to prevent them from becoming too small */
}
.modern-row-3 input {
  min-width: 0;
  flex: 1 1 0;
  max-width: 100%;
}
.rich-radio input[type="radio"] {
  accent-color: #ff914d;
  width: 1.3em;
  height: 1.3em;
  margin-right: 0.5em;
  box-shadow: 0 1px 4px #ff914d22;
  border-radius: 50%;
  background: #fff9f3;
  border: 2px solid #ff914d44;
  transition: border 0.2s;
}
.rich-radio input[type="radio"]:focus {
  border: 2px solid #ff914d;
  outline: 2px solid #ff914d88;
}
.rich-radio label {
  font-size: 1.08em;
  color: #444;
  font-weight: 500;
  margin-right: 1.2em;
  cursor: pointer;
}
.modern-radio-row {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-top: 0.2rem;
}
.modern-radio-col {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-top: 0.2rem;
}
.radio-group label {
  font-weight: 400;
  color: #444;
}
@media (max-width: 800px) {
  .modern-form-row {
    flex-direction: column;
    gap: 0.7rem;
  }
}
@media (max-width: 600px) {
  .rich-form, .modal-content {
    max-width: 95vw;
    width: 95vw;
    min-width: 0;
    margin: 2vw auto;
    padding: 0.7rem 0.5rem 1.1rem 0.5rem;
    border-radius: 12px;
    box-sizing: border-box;
  }
  .rich-form-grid {
    padding: 0.7rem 0.5rem 1.1rem 0.5rem;
    border-radius: 10px;
    margin-top: 0.5rem;
  }
  .rich-title {
    font-size: 1rem;
  }
  .step-indicator {
    font-size: 0.95rem;
  }
}
.rich-form {
  background: linear-gradient(135deg, #f8fafc 70%, #ffe5d0 100%);
  border: 1.5px solid #ff914d33;
  box-shadow: 0 10px 40px rgba(255,145,77,0.13), 0 2px 8px rgba(0,0,0,0.06);
  padding-bottom: 2.5rem;
  font-family: 'Inter', 'Poppins', Arial, sans-serif;
  position: relative;
}
.rich-bar {
  background: linear-gradient(90deg, #ff914d 60%, #ffb07b 100%);
  height: 10px;
  border-radius: 18px 18px 0 0;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px #ff914d33;
}
.progress-bar {
  width: 100%;
  height: 7px;
  background: #ffe5d0;
  border-radius: 6px;
  margin-bottom: 1.2rem;
  overflow: hidden;
}
.progress-bar-inner {
  width: 60%; /* Example: 60% complete */
  height: 100%;
  background: linear-gradient(90deg, #ff914d 60%, #ffb07b 100%);
  border-radius: 6px;
  transition: width 0.4s cubic-bezier(.4,2,.6,1);
}
.rich-form-grid {
  background: #fff9f3;
  border-radius: 20px;
  box-shadow: 0 4px 24px #ff914d18, 0 1.5px 8px #ff914d11;
  padding: 2.5rem 2rem 2rem 2rem;
  border: 1.5px solid #ff914d22;
  margin-top: 1.2rem;
  max-width: 100%;
  min-width: 0;
  overflow-x: hidden;
}
.section-header {
  font-size: 1.3rem;
  font-weight: 700;
  color: #ff914d;
  margin-bottom: 1.5rem;
  margin-top: 0.5rem;
  letter-spacing: 0.5px;
  background: linear-gradient(90deg, #fff9f3 60%, #ffe5d0 100%);
  padding: 0.7rem 1rem;
  border-radius: 12px;
  box-shadow: 0 1px 4px #ff914d11;
}
.modern-form-row {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
  max-width: 100%;
  min-width: 0;
}
.modern-form-col {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
  min-width: 0;
  max-width: 100%;
}
.modern-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}
.modern-group label {
  font-size: 1.05rem;
  color: #444;
  font-weight: 500;
  margin-bottom: 0.2rem;
  letter-spacing: 0.01em;
}
.modern-group input,
.modern-group select {
  border: 2px solid #e0e7ef;
  border-radius: 9px;
  background: #fafdff;
  padding: 1.1rem 1.1rem 0.5rem 1.1rem;
  font-size: 1.05rem;
  margin-top: 0.1rem;
  transition: border 0.2s, box-shadow 0.2s;
  outline: none;
  box-shadow: 0 1.5px 8px #ff914d11;
  color: var(--text-color); /* Ensure text color is readable */
}
.modern-group input:focus,
.modern-group select:focus {
  border: 2px solid #ff914d;
  box-shadow: 0 2px 12px #ff914d22;
  background: #fff7f0;
}
.modern-group input::placeholder,
.modern-group input::-webkit-input-placeholder,
.modern-group input:-moz-placeholder,
.modern-group input::-moz-placeholder,
.modern-group input:-ms-input-placeholder
{
  color: #555; /* Ensure placeholder text is clearly visible */
  opacity: 1;
  font-size: 1rem;
  font-style: italic;
}
.modern-row-2, .modern-row-3 {
  display: flex;
  gap: 0.7rem;
  flex-wrap: nowrap;
  min-width: 0;
  max-width: 100%;
}
.modern-row-2 input, .modern-row-2 select {
    flex: 1 1 auto; /* Allow inputs to grow and shrink */
    min-width: 80px; /* Set a minimum width to prevent them from becoming too small */
}
.modern-row-3 input {
  min-width: 0;
  flex: 1 1 0;
  max-width: 100%;
}
.rich-radio input[type="radio"] {
  accent-color: #ff914d;
  width: 1.3em;
  height: 1.3em;
  margin-right: 0.5em;
  box-shadow: 0 1px 4px #ff914d22;
  border-radius: 50%;
  background: #fff9f3;
  border: 2px solid #ff914d44;
  transition: border 0.2s;
}
.rich-radio input[type="radio"]:focus {
  border: 2px solid #ff914d;
  outline: 2px solid #ff914d88;
}
.rich-radio label {
  font-size: 1.08em;
  color: #444;
  font-weight: 500;
  margin-right: 1.2em;
  cursor: pointer;
}
.modern-radio-row {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-top: 0.2rem;
}
.modern-radio-col {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-top: 0.2rem;
}
.rich-divider {
  border: none;
  border-top: 2px dashed #ff914d44;
  margin: 2.2rem 0 1.2rem 0;
}
.required {
  color: #ff5050;
  font-size: 1.1em;
  margin-left: 0.2em;
}
.rich-submit {
  background: linear-gradient(90deg, #ff914d 60%, #ffb07b 100%);
  color: #fff;
  font-size: 1.18rem;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  padding: 1.1rem 2.7rem;
  cursor: pointer;
  box-shadow: 0 2px 16px #ff914d33;
  transition: background 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-top: 1.2rem;
}
.rich-submit:hover {
  background: linear-gradient(90deg, #ffb07b 60%, #ff914d 100%);
  color: #fff;
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 24px #ff914d33;
}
@media (max-width: 800px) {
  .rich-form-grid {
    padding: 1.1rem 0.5rem 1.1rem 0.5rem;
  }
  .modern-form_row {
    flex-direction: column;
    gap: 0.7rem;
  }
}
@media (max-width: 600px) {
  .rich-form, .modal-content {
    max-width: 100vw;
    width: 100vw;
    min-width: 0;
    padding: 0.2rem 0.05rem 0.5rem 0.05rem;
    border-radius: 0;
  }
  .rich-form-grid {
    padding: 0.4rem 0.05rem 0.7rem 0.05rem;
    border-radius: 5px;
    margin-top: 0.2rem;
  }
  .section-header {
    font-size: 0.95rem;
    padding: 0.2rem 0.2rem;
    margin-bottom: 0.7rem;
  }
  .modern-group label {
    font-size: 0.93rem;
  }
  .modern-group input,
  .modern-group select {
    font-size: 0.93rem;
    padding: 0.7rem 0.5rem 0.3rem 0.5rem;
  }
  .rich-submit {
    font-size: 0.95rem;
    padding: 0.7rem 0.7rem;
    border-radius: 6px;
  }
  .step-indicator {
    font-size: 0.93rem;
  }
}
.file-size-limit {
  font-size: 0.85rem;
  color: #666;
  font-weight: normal;
  font-style: italic;
}

/* Add these new styles for the adoption status indicators */
.status-badge-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
}

.status-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.status-badge i {
  margin-right: 5px;
}

.status-badge.adopted {
  background-color: #3949ab;
}

.status-badge.on-hold {
  background-color: #ff9800;
}

.status-badge.available {
  background-color: #4caf50;
}

.adoption-status {
  margin-top: 10px;
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 10px;
  text-align: left;
}

.adoption-status.adopted {
  background-color: #e8f0fe;
  border-left: 4px solid #3949ab;
}

.adoption-status.on-hold {
  background-color: #fff3e0;
  border-left: 4px solid #ff9800;
}

.adoption-status p {
  margin-bottom: 8px;
  color: #546e7a;
}

.adoption-status p:first-child {
  font-size: 1.1rem;
}

.adoption-status i {
  margin-right: 5px;
}

.browse-btn {
  background: #3949ab;
  color: #fff;
  font-size: 1.08rem;
  font-weight: 500;
  border: none;
  border-radius: 18px;
  padding: 0.7rem 1.7rem;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  box-shadow: 0 2px 8px rgba(57, 73, 171, 0.2);
  transition: background 0.2s, transform 0.2s;
}

.browse-btn:hover {
  background: #5c6bc0;
  transform: translateY(-2px) scale(1.04);
}

.file-upload-container {
  display: block;
  margin-top: 0.5rem;
}

.file-upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 25px; /* Increased padding */
  border: 2px dashed #b5d6f6; /* Adjusted dashed border color */
  border-radius: 9px;
  background: #fafdff;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
  font-size: 1rem; /* Adjusted font size */
  color: #666; /* Adjusted text color */
  gap: 10px; /* Adjusted space between icon and text */
}

.file-upload-box:hover {
  border-color: #a0c7f7; /* Slightly darker border on hover */
  background-color: #eef7ff; /* Lighter background on hover */
}

.file-upload-box i {
  font-size: 2.2rem; /* Adjusted icon size */
  color: #66a3ff; /* Icon color */
}

.file-upload-container input[type="file"] {
  display: none;
}

.file-info {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1rem;
  background: #f0f4f8;
  border: 1px solid #d0d9e4;
  border-radius: 7px;
  padding: 0.5rem 1rem;
  flex-wrap: wrap; /* Allow items to wrap to the next line */
  justify-content: flex-start; /* Align items to the start when wrapped */
}

.choose-file-button {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  background-color: #e9ecef;
  color: #495057;
  border: 1px solid #ced4da;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
  font-size: 0.9rem;
  margin-bottom: 0.5rem; /* Add margin bottom for spacing when wrapped */
}

.choose-file-button:hover {
  background-color: #cdd4db;
  color: #333;
}

.file-name {
  font-weight: normal;
  color: #555;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0.5rem; /* Add margin bottom for spacing when wrapped */
}

.view-file-button {
  background: #6b7a8f;
  color: #fff;
  font-size: 0.9rem; /* Adjusted font size to match choose file button */
  font-weight: 500;
  border: none;
  border-radius: 5px; /* Adjusted border radius to match choose file button */
  padding: 0.4rem 0.8rem; /* Adjusted padding to match choose file button */
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  box-shadow: 0 2px 8px rgba(57, 73, 171, 0.2);
  transition: background 0.2s, transform 0.2s;
  margin-bottom: 0.5rem; /* Add margin bottom for spacing when wrapped */
}

.view-file-button:hover {
  background: #5c6bc0;
  transform: translateY(-2px) scale(1.04);
}

/* Add File View Modal Styles */
.file-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000; /* Ensure it's above other modals */
}

.file-modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  max-width: 90%;
  max-height: 90vh;
  overflow: hidden; /* Hide overflow from file content */
  position: relative;
  display: flex;
  flex-direction: column;
}

.file-modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.8); /* Semi-transparent white background */
  border: 1px solid #ccc; /* Light border */
  border-radius: 50%; /* Circular shape */
  width: 30px; /* Set a fixed width */
  height: 30px; /* Set a fixed height */
  display: flex; /* Use flex to center content */
  align-items: center;
  justify-content: center;
  font-size: 1.2rem; /* Adjusted font size */
  font-weight: bold; /* Make it bold */
  cursor: pointer;
  color: #888;
  z-index: 3001;
  transition: background-color 0.2s, color 0.2s;
}

.file-modal-close:hover {
  background-color: #ff5050; /* Red background on hover */
  color: #fff; /* White text on hover */
}

.file-content {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* Hide overflow of the content */
}

.file-content img,
.file-content iframe {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* Ensure image/pdf fits within container */
}

.input-with-icon {
  position: relative;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #ff914d;
  font-size: 1rem;
  z-index: 1;
}

.input-with-icon input,
.input-with-icon select {
  padding-left: 40px !important;
}

.modern-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.7rem;
  width: 100%;
}

@media (max-width: 768px) {
  .modern-row-2 {
    grid-template-columns: 1fr;
  }
}

.suffix-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23ff914d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 30px !important;
}

/* Improve form field focus styles */
.modern-group input:focus:not(.readonly-field),
.modern-group select:focus:not(.readonly-field) {
  border: 2px solid #ff914d;
  box-shadow: 0 0 0 3px rgba(255, 145, 77, 0.25);
  background: #fff;
}

/* Add subtle hover effect */
.modern-group input:hover:not(.readonly-field),
.modern-group select:hover:not(.readonly-field) {
  border-color: #ffb07b;
}

/* Readonly field styles */
.readonly-field {
  background-color: #f8f8f8 !important;
  color: #555 !important;
  cursor: not-allowed !important;
  border-color: #e0e0e0 !important;
  opacity: 0.85;
}

/* Modern redesign for the form */
.rich-form-grid {
  background: linear-gradient(145deg, #ffffff, #fcfcfc);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  padding: 2.5rem 2rem;
  max-height: 60vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.rich-form-grid::-webkit-scrollbar {
  width: 8px;
}

.rich-form-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.rich-form-grid::-webkit-scrollbar-thumb {
  background: #ff914d;
  border-radius: 10px;
}

.rich-form-grid::-webkit-scrollbar-thumb:hover {
  background: #ff7e2e;
}

.section-header {
  position: relative;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #f3f3f3;
}

.section-header:after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 60px;
  height: 2px;
  background: #ff914d;
}

.rich-section-icon {
  margin-right: 10px;
  color: #ff914d;
}

.modern-form-row {
  margin-bottom: 2rem;
}

.modern-group {
  margin-bottom: 1.5rem;
}

.modern-group label {
  display: block;
  margin-bottom: 0.6rem;
  font-weight: 600;
  color: #444;
  font-size: 0.95rem;
}

.modern-group input,
.modern-group select {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.required {
  color: #ff5252;
}

.file-upload-box {
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 2px dashed #e2e8f0;
}

.file-upload-box:hover {
  border-color: #ff914d;
  background-color: #fff8f1;
}

.rich-submit {
  background: linear-gradient(to right, #ff914d, #ff7e2e);
  border-radius: 10px;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  border: none;
  box-shadow: 0 4px 15px rgba(255, 145, 77, 0.3);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.rich-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 145, 77, 0.4);
}

.rich-divider {
  border: none;
  height: 1px;
  background: linear-gradient(to right, #f3f3f3, #ff914d33, #f3f3f3);
  margin: 2rem 0;
}

.modern-radio-row {
  display: flex;
  gap: 1.5rem;
}

.rich-radio {
  display: inline-flex;
  align-items: center;
  margin-right: 1rem;
  cursor: pointer;
}

.rich-radio input[type="radio"] {
  margin-right: 0.5rem;
  accent-color: #ff914d;
  width: 18px;
  height: 18px;
}

/* Modal redesign */
.modal-overlay {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  padding: 20px 0;
  overflow-y: auto;
}

.modal-content {
  border-radius: 20px;
  overflow: hidden;
}

.modal-bar {
  height: 6px;
  background: linear-gradient(to right, #ff914d, #ff7e2e);
}

.pro-close {
  background: white;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  top: 15px;
  right: 15px;
  font-size: 1.5rem;
  transition: all 0.2s ease;
}

.pro-close:hover {
  background: #ff5252;
  color: white;
  transform: rotate(90deg);
}

.step-indicator {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #666;
  margin-bottom: 1.5rem;
}

.step-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #ff914d;
  color: white;
  border-radius: 50%;
  margin-right: 10px;
  font-weight: 700;
  font-size: 0.9rem;
}

/* Add subtle hover effect */
.modern-group input:hover:not(.readonly-field),
.modern-group select:hover:not(.readonly-field) {
  border-color: #ffb07b;
}
  
/* Enhanced scrollable form styles */
.rich-form-grid {
  max-height: 60vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  padding-right: 15px;
}

.rich-form-grid::-webkit-scrollbar {
  width: 8px;
}

.rich-form-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.rich-form-grid::-webkit-scrollbar-thumb {
  background: #ff914d;
  border-radius: 10px;
}

.rich-form-grid::-webkit-scrollbar-thumb:hover {
  background: #ff7e2e;
}

@media (max-width: 768px) {
  .rich-form-grid {
    max-height: 65vh;
    padding-right: 10px;
  }
}

/* Modal styling enhancements */
.modal-overlay {
  padding: 20px 0;
  overflow-y: auto;
}

.application-success-notification {
  position: fixed;
  top: 100px;
  right: 20px;
  background: #fff;
  border-left: 4px solid #4CAF50;
  width: 320px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  color: #333;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 3000;
  padding: 15px;
  animation: slideInRight 0.4s ease;
}

.notification-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
}

.notification-content i {
  color: #4CAF50;
  font-size: 1.4rem;
  margin-top: 3px;
}

.notification-text {
  flex: 1;
}

.notification-text h4 {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #4CAF50;
}

.notification-text p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
}

.close-notification {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: #888;
  padding: 5px;
  height: 26px;
  width: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  margin-left: 5px;
  flex-shrink: 0;
}

.close-notification:hover {
  background-color: #f0f0f0;
  color: #333;
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

.application-warning-notification {
  position: fixed;
  top: 100px;
  right: 20px;
  background: #fff;
  border-left: 4px solid #FF9800;
  width: 320px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  color: #333;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 3000;
  padding: 15px;
  animation: slideInRight 0.4s ease;
}

.application-warning-notification .notification-content i {
  color: #FF9800;
}

/* Add styles for approved and rejected notifications */
.application-approved-notification {
  position: fixed;
  top: 100px;
  right: 20px;
  background: #fff;
  border-left: 4px solid #4CAF50;
  width: 320px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  color: #333;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 3000;
  padding: 15px;
  animation: slideInRight 0.4s ease;
}

.application-approved-notification .notification-content i {
  color: #4CAF50;
}

.application-rejected-notification {
  position: fixed;
  top: 100px;
  right: 20px;
  background: #fff;
  border-left: 4px solid #F44336;
  width: 320px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  color: #333;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 3000;
  padding: 15px;
  animation: slideInRight 0.4s ease;
}

.application-rejected-notification .notification-content i {
  color: #F44336;
}
</style>



