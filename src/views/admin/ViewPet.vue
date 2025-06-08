<template>
  <div class="admin-layout">
    <!-- Sidebar Navigation -->
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <img src="/Designer.png" alt="Logo" class="logo-img" />
        <span class="logo-text">PAWFECT</span>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/admin/dashboard" class="nav-item" active-class="active">
          <i class="fas fa-chart-line"></i>
          <span>Dashboard</span>
        </router-link>
        <router-link to="/admin/pets" class="nav-item" :class="{ 'active': $route.path.includes('/admin/pets') }">
          <i class="fas fa-paw"></i>
          <span>Pets</span>
        </router-link>
        <router-link to="/admin/applications" class="nav-item" active-class="active">
          <i class="fas fa-file-alt"></i>
          <span>Applications</span>
        </router-link>
        <router-link to="/admin/pet-history" class="nav-item" active-class="active">
          <i class="fas fa-history"></i>
          <span>Pet History</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <a href="#" @click.prevent="handleLogout" class="nav-item">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </a>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="admin-main">
      <header class="admin-header">
        <div class="header-left">
          <h1>Pet Details</h1>
          <router-link to="/admin/pets" class="back-link">
            <i class="fas fa-arrow-left"></i> Back to Pets
          </router-link>
        </div>
        <div class="header-right">
          <div class="admin-profile">
            <img src="/Designer.png" alt="Admin" class="admin-avatar" />
            <span class="admin-name">Admin</span>
          </div>
        </div>
      </header>

      <div class="content-wrapper">
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading pet details...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
          <i class="fas fa-exclamation-triangle"></i>
          <p>{{ error }}</p>
          <router-link to="/admin/pets" class="return-link">Return to Pets List</router-link>
        </div>

        <!-- Pet Details -->
        <div v-else-if="pet" class="modern-pet-profile">
          <div class="profile-container">
            <!-- Left Column - Photo -->
            <div class="photo-section">
              <div class="photo-container">
                <img :src="pet.photoUrl || '/Img/default-pet.jpg'" :alt="pet.name" class="pet-image">
              </div>
              <input
                type="file"
                ref="photoInput"
                @change="handlePhotoChange"
                accept="image/*"
                class="hidden-input"
              >
              <button @click="triggerPhotoInput" class="photo-btn">
                <i class="fas fa-camera"></i> Change Photo
              </button>
            </div>
            
            <!-- Right Column - Info -->
            <div class="info-section">
              <div class="pet-name-row">
                <h2 class="pet-name">{{ pet.name }}</h2>
                <div class="status-indicator" :class="getStatusClass(pet.status)">
                  {{ pet.status }}
                </div>
              </div>
              
              <div class="attribute-cards">
                <div class="attribute-card">
                  <i class="fas fa-paw"></i>
                  <div>
                    <span class="attribute-label">Type</span>
                    <span class="attribute-value">{{ pet.type }}</span>
                  </div>
                </div>
                <div class="attribute-card">
                  <i class="fas fa-dog"></i>
                  <div>
                    <span class="attribute-label">Breed</span>
                    <span class="attribute-value">{{ pet.breed }}</span>
                  </div>
                </div>
                <div class="attribute-card">
                  <i class="fas fa-birthday-cake"></i>
                  <div>
                    <span class="attribute-label">Age</span>
                    <span class="attribute-value">{{ pet.age }}</span>
                  </div>
                </div>
                <div class="attribute-card">
                  <i class="fas fa-venus-mars"></i>
                  <div>
                    <span class="attribute-label">Gender</span>
                    <span class="attribute-value">{{ pet.gender }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Description Section -->
              <div class="description-inline">
                <h3><i class="fas fa-info-circle"></i> About {{ pet.name }}</h3>
                <p>{{ pet.description || 'No description available.' }}</p>
              </div>
              
              <div class="action-buttons">
                <button @click="editPet" class="primary-btn">
                  <i class="fas fa-edit"></i> Edit Details
                </button>
                <button @click="confirmDelete" class="danger-btn">
                  <i class="fas fa-trash"></i> Delete
                </button>
                <button @click="changeStatus('On Hold')" v-if="pet.status !== 'On Hold'" class="status-btn hold">
                  <i class="fas fa-pause-circle"></i> Put on Hold
                </button>
                <button @click="changeStatus('Adopted')" v-if="pet.status !== 'Adopted'" class="status-btn adopted">
                  <i class="fas fa-home"></i> Mark as Adopted
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
          <div class="modal">
            <div class="modal-header">
              <h3>Confirm Delete</h3>
              <button class="close-btn" @click="showDeleteModal = false">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="modal-body">
              <i class="fas fa-exclamation-triangle warning-icon"></i>
              <p>Are you sure you want to delete <strong>{{ pet?.name }}</strong>?</p>
              <p class="warning-text">This action cannot be undone.</p>
            </div>
            <div class="modal-actions">
              <button class="cancel-btn" @click="showDeleteModal = false">Cancel</button>
              <button class="delete-btn" @click="deletePet">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'AdminViewPet',
  data() {
    return {
      pet: null,
      loading: true,
      error: null,
      showDeleteModal: false
    }
  },
  computed: {
    petId() {
      return this.$route.params.id
    }
  },
  mounted() {
    this.fetchPetDetails()
  },
  methods: {
    handleLogout() {
      // Clear all auth data from localStorage
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
        window.history.pushState(null, null, '/admin-login');
        window.onpopstate = function() {
          window.history.pushState(null, null, '/admin-login');
        };
      }

      // Redirect to admin login
      this.$router.push('/admin-login');
    },

    async fetchPetDetails() {
      this.loading = true
      try {
        const response = await fetch(`http://localhost:5000/api/pet/${this.petId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch pet details: ${response.status}`)
        }

        const result = await response.json()

        if (result.success && result.data) {
          this.pet = {
            id: result.data.id,
            name: result.data.name,
            type: result.data.species,
            breed: result.data.breed,
            age: result.data.age,
            gender: result.data.gender,
            photoUrl: result.data.photo_url,
            description: result.data.description,
            personality: result.data.personality,
            vaccinated: result.data.vaccinated || false,
            neutered: result.data.neutered || false,
            specialNeeds: result.data.special_needs || false,
            medicalInfo: result.data.medical_info,
            history: result.data.history,
            status: result.data.status || 'Available'
          }
        } else {
          throw new Error(result.message || 'Failed to fetch pet details')
        }
      } catch (error) {
        console.error('Error fetching pet details:', error)
        this.error = error.message || 'Failed to load pet details. Please try again.'
      } finally {
        this.loading = false
      }
    },

    getStatusClass(status) {
      switch (status?.toLowerCase()) {
        case 'available': return 'status-available'
        case 'on hold': return 'status-hold'
        case 'adopted': return 'status-adopted'
        default: return 'status-unknown'
      }
    },

    editPet() {
      this.$router.push(`/admin/pets/edit/${this.petId}`)
    },

    confirmDelete() {
      this.showDeleteModal = true
    },

    async deletePet() {
      try {
        const response = await fetch(`http://localhost:5000/api/pet/${this.petId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`Failed to delete pet: ${response.status}`)
        }

        const result = await response.json()

        if (result.success) {
          alert(`${this.pet.name} has been successfully deleted.`)
          this.$router.push('/admin/pets')
        } else {
          throw new Error(result.message || 'Failed to delete pet')
        }
      } catch (error) {
        console.error('Error deleting pet:', error)
        alert(`Error deleting pet: ${error.message}`)
      } finally {
        this.showDeleteModal = false
      }
    },

    async changeStatus(newStatus) {
      try {
        const response = await fetch(`http://localhost:5000/api/pet/${this.petId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: newStatus
          })
        })

        if (!response.ok) {
          throw new Error(`Failed to update pet status: ${response.status}`)
        }

        const result = await response.json()

        if (result.success) {
          this.pet.status = newStatus
          alert(`Status for ${this.pet.name} has been updated to ${newStatus}.`)
        } else {
          throw new Error(result.message || 'Failed to update pet status')
        }
      } catch (error) {
        console.error('Error updating pet status:', error)
        alert(`Error updating pet status: ${error.message}`)
      }
    },

    changePhoto() {
      // This method is no longer needed as we're using triggerPhotoInput
    },

    triggerPhotoInput() {
      this.$refs.photoInput.click()
    },

    async handlePhotoChange(event) {
      const file = event.target.files[0]
      if (!file) return

      try {
        const formData = new FormData()
        formData.append('profile_image', file)

        const response = await fetch(`http://localhost:5000/api/pet/${this.petId}/photo`, {
          method: 'PUT',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (!response.ok) {
          throw new Error(`Failed to update photo: ${response.status}`)
        }

        const result = await response.json()

        if (result.success) {
          // Update the pet's photo URL in the local state
          this.pet.photoUrl = result.data.photo_url
          alert('Photo updated successfully!')
        } else {
          throw new Error(result.message || 'Failed to update photo')
        }
      } catch (error) {
        console.error('Error updating photo:', error)
        alert(`Error updating photo: ${error.message}`)
      }
    }
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f4f6fa;
}

.admin-sidebar {
  width: 260px;
  background: #fff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 1000;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  border-bottom: 1px solid #e0e0e0;
}

.logo-img {
  width: 32px;
  height: 32px;
}

.logo-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: #f7871f;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.5rem;
  color: #666;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.nav-item:hover {
  background: #f8f9fa;
  color: #f7871f;
  padding-left: 1.8rem;
}

.nav-item.active {
  background: #fff5eb;
  color: #f7871f;
  border-left: 3px solid #f7871f;
  font-weight: 500;
}

.nav-item i {
  width: 20px;
  text-align: center;
  font-size: 1.1rem;
}

.sidebar-footer {
  padding: 1rem 0;
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.admin-main {
  flex: 1;
  margin-left: 260px;
  padding: 0;
  background: #f4f6fa;
  padding-top: 70px; /* Add padding to account for the fixed header */
}

.admin-header {
  background: #fff;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.03);
  position: fixed;
  top: 0;
  right: 0;
  left: 260px;
  z-index: 100;
  height: 70px;
}

.header-left h1 {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
  font-weight: 600;
}

.back-link {
  color: #f7871f;
  text-decoration: none;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: #e67012;
}

.back-link i {
  font-size: 0.8rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.admin-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.admin-name {
  font-weight: 500;
  color: #333;
}

.content-wrapper {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  text-align: center;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #f7871f;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container i {
  color: #e74c3c;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.return-link {
  margin-top: 1rem;
  color: #f7871f;
  text-decoration: none;
  font-weight: 500;
}

/* Modern Pet Profile Styling */
.modern-pet-profile {
  display: flex;
  flex-direction: column;
}

.profile-container {
  display: flex;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  height: calc(100vh - 130px);
  max-height: 700px;
}

.photo-section {
  width: 300px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  align-items: center;
  border-right: 1px solid #f0f0f0;
}

.photo-container {
  width: 100%;
  height: 280px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pet-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-btn {
  width: 100%;
  padding: 0.8rem 1rem;
  background: #f7871f;
  color: white;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.photo-btn:hover {
  background: #e67012;
}

.hidden-input {
  display: none;
}

.info-section {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
}

.pet-name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 0.5rem;
  border-bottom: 2px solid #f7871f;
  padding-bottom: 0.5rem;
}

.pet-name {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  display: inline-block;
  border-bottom: none;
  padding-bottom: 0;
}

.status-indicator {
  padding: 0.5rem 1.2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.3s ease;
}

.status-indicator.status-available {
  background: linear-gradient(135deg, #43a047, #2e7d32);
  color: white;
}

.status-indicator.status-hold {
  background: linear-gradient(135deg, #ff9800, #e65100);
  color: white;
}

.status-indicator.status-adopted {
  background: linear-gradient(135deg, #2196f3, #0d47a1);
  color: white;
}

.status-indicator.status-unknown {
  background: linear-gradient(135deg, #9e9e9e, #616161);
  color: white;
}

.attribute-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.attribute-card {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  background: #f9f9f9;
  border-radius: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.attribute-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.attribute-card i {
  font-size: 1.5rem;
  color: #f7871f;
  width: 24px;
  text-align: center;
}

.attribute-card div {
  display: flex;
  flex-direction: column;
}

.attribute-label {
  font-size: 0.85rem;
  color: #777;
  font-weight: 500;
}

.attribute-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.description-inline {
  margin: 0.5rem 0 1rem 0;
}

.description-inline h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.description-inline h3 i {
  color: #f7871f;
}

.description-inline p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  color: #444;
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  text-align: justify;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: auto;
}

.primary-btn, .danger-btn, .status-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-btn {
  background: #f7871f;
  color: white;
}

.primary-btn:hover {
  background: #e67012;
}

.danger-btn {
  background: #ffebee;
  color: #f44336;
}

.danger-btn:hover {
  background: #ffcdd2;
}

.status-btn {
  background: #f8f9fa;
  color: #555;
}

.status-btn.hold {
  background: #fff3e0;
  color: #e65100;
}

.status-btn.hold:hover {
  background: #ffe0b2;
}

.status-btn.adopted {
  background: #e3f2fd;
  color: #0d47a1;
}

.status-btn.adopted:hover {
  background: #bbdefb;
}

.primary-btn i, .danger-btn i, .status-btn i {
  margin-right: 0.6rem;
  font-size: 1rem;
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.modal {
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.4rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 1.8rem 1.5rem;
  text-align: center;
}

.warning-icon {
  font-size: 3.5rem;
  color: #f44336;
  margin-bottom: 1.2rem;
}

.modal-body p {
  margin: 0 0 0.8rem 0;
  font-size: 1.15rem;
  color: #333;
}

.warning-text {
  color: #f44336;
  font-size: 1rem;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.2rem 1.5rem;
  border-top: 1px solid #eee;
}

.cancel-btn, .delete-btn {
  padding: 0.8rem 1.8rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
  border: none;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.delete-btn {
  background: #f44336;
  color: white;
  border: none;
}

.delete-btn:hover {
  background: #d32f2f;
}

/* Responsive Styles */
@media (max-width: 992px) {
  .profile-container {
    flex-direction: column;
    height: auto;
    max-height: none;
  }

  .photo-section {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
  }

  .photo-container {
    max-width: 280px;
    height: 280px;
  }
  
  .photo-btn {
    max-width: 280px;
  }

  .info-section {
    max-height: 500px;
  }
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 70px;
  }
  
  .sidebar-header {
    padding: 1rem;
  }
  
  .logo-text {
    display: none;
  }
  
  .nav-item span {
    display: none;
  }
  
  .nav-item {
    justify-content: center;
    padding: 1rem;
  }
  
  .admin-main {
    margin-left: 70px;
  }
  
  .admin-header {
    left: 70px;
    padding: 1rem;
  }
  
  .status-indicator {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  .content-wrapper {
    padding: 1rem;
  }
  
  .attribute-cards {
    grid-template-columns: 1fr 1fr;
  }
  
  .action-buttons {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

@media (max-width: 576px) {
  .attribute-cards {
    grid-template-columns: 1fr;
  }
  
  .header-left h1 {
    font-size: 1.2rem;
  }
  
  .admin-name {
    display: none;
  }

  .pet-name-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.7rem;
  }

  .status-indicator {
    font-size: 0.7rem;
    padding: 0.4rem 0.8rem;
    align-self: flex-start;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .primary-btn, .danger-btn, .status-btn {
    width: 100%;
  }
}
</style>