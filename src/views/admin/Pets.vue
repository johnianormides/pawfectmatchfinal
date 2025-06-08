<template>
  <div class="admin-layout">
    <!-- Status Change Notification -->
    <div v-if="showNotification" class="status-notification">
      <div class="notification-content" :class="{ 'success-notification': isNewPetNotification }">
        <i class="fas" :class="isNewPetNotification ? 'fa-check-circle' : 'fa-info-circle'"></i>
        <span>{{ notificationMessage }}</span>
        <button class="close-notification" @click="showNotification = false">&times;</button>
      </div>
    </div>

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
      <div class="pets-management">
        <div class="page-header">
          <div class="header-content">
            <h2>Pets Management</h2>
            <p class="subtitle">Manage all pets in the adoption system</p>
          </div>
          <div class="header-actions">
            <button class="refresh-btn" @click="refreshPets" title="Refresh Pets List" :disabled="isRefreshing">
              <i class="fas" :class="isRefreshing ? 'fa-spinner fa-spin' : 'fa-sync-alt'"></i>
              {{ isRefreshing ? 'Refreshing...' : 'Refresh' }}
            </button>
            <router-link to="/admin/pets/add" class="add-pet-btn">
              <i class="fas fa-plus"></i>
              Add New Pet
            </router-link>
          </div>
        </div>

      

        <!-- Filters -->
        <div class="filter-section">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search pets by name, breed, or status..."
              @input="filterPets"
            />
          </div>
          <div class="filter-options">
            <div class="filter-item">
              <label>Status</label>
              <select v-model="statusFilter" @change="filterPets">
                <option value="">All Status</option>
                <option value="Available">Available</option>
                <option value="On Hold">On Hold</option>
                <option value="Adopted">Adopted</option>
              </select>
            </div>
            <div class="filter-item">
              <label>Type</label>
              <select v-model="typeFilter" @change="filterPets">
                <option value="">All Types</option>
                <option value="Dog">Dogs</option>
                <option value="Cat">Cats</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Pets Table -->
        <div class="table-section">
          <div class="table-container">
            <table class="pets-table">
              <thead>
                <tr>
                  <th class="th-photo">Photo</th>
                  <th class="th-name">Name</th>
                  <th class="th-type">Type</th>
                  <th class="th-breed">Breed</th>
                  <th class="th-age">Age</th>
                  <th class="th-status">Status</th>
                  <th class="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredPets.length === 0">
                  <td colspan="7" class="no-data">
                    <div class="no-data-content">
                      <i class="fas fa-search"></i>
                      <p>No pets found matching your search criteria</p>
                      <button class="reset-btn" @click="resetFilters">Reset Filters</button>
                    </div>
                  </td>
                </tr>
                <tr v-for="pet in filteredPets" :key="pet.id" class="pet-row">
                  <td>
                    <div class="pet-photo-container">
                      <img :src="pet.photo" :alt="pet.name" class="pet-photo" />
                    </div>
                  </td>
                  <td class="pet-name">{{ pet.name }}</td>
                  <td>{{ pet.type }}</td>
                  <td>{{ pet.breed }}</td>
                  <td>{{ pet.age }}</td>
                  <td>
                    <span class="status-badge" :class="getStatusClass(pet.status)">
                      {{ pet.status }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button class="action-btn view" @click="viewPet(pet)" title="View Details">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="action-btn edit" @click="editPet(pet)" title="Edit Pet">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="action-btn delete" @click="confirmDelete(pet)" title="Delete Pet">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
          <div class="modal">
            <div class="modal-header">
              <h3>Confirm Delete</h3>
              <button class="close-btn" @click="showDeleteModal = false">&times;</button>
            </div>
            <div class="modal-content">
              <div class="warning-icon">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <p>Are you sure you want to delete <strong>{{ petToDelete?.name }}</strong>?</p>
              <p class="warning-text">This action cannot be undone.</p>
            </div>
            <div class="modal-actions">
              <button class="cancel-btn" @click="showDeleteModal = false">Cancel</button>
              <button class="delete-btn" @click="deletePet">
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'AdminPets',
  data() {
    return {
      pets: [],
      searchQuery: '',
      statusFilter: '',
      typeFilter: '',
      showDeleteModal: false,
      petToDelete: null,
      isRefreshing: false,
      showNotification: false,
      notificationMessage: '',
      previousPetStatuses: {}, // To track status changes
      isNewPetNotification: false
    }
  },
  computed: {
    filteredPets() {
      return this.pets.filter(pet => {
        const matchesSearch =
          pet.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          pet.breed.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          pet.status.toLowerCase().includes(this.searchQuery.toLowerCase())

        const matchesStatus = !this.statusFilter || pet.status.toLowerCase() === this.statusFilter.toLowerCase()
        const matchesType = !this.typeFilter || pet.type === this.typeFilter

        return matchesSearch && matchesStatus && matchesType
      })
    },
    availablePetsCount() {
      return this.pets.filter(pet => pet.status.toLowerCase() === 'available').length
    },
    onHoldPetsCount() {
      return this.pets.filter(pet => pet.status.toLowerCase() === 'on hold').length
    },
    adoptedPetsCount() {
      return this.pets.filter(pet => pet.status.toLowerCase() === 'adopted').length
    }
  },
  mounted() {
    this.fetchPets()
    this.checkForNewPetNotification()
  },
  activated() {
    console.log('Pets component activated - refreshing data')
    this.forceFetchPets()
  },
  watch: {
    '$route'() {
      console.log('Route changed to Pets - refreshing data')
      this.forceFetchPets()
    }
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
    checkForNewPetNotification() {
      const newPetData = localStorage.getItem('newPetAdded');
      if (newPetData) {
        try {
          const petInfo = JSON.parse(newPetData);
          // Check if notification is recent (within last 5 seconds)
          const now = new Date().getTime();
          if (now - petInfo.timestamp < 5000) {
            this.notificationMessage = `Pet "${petInfo.name}" has been added successfully!`;
            this.isNewPetNotification = true;
            this.showNotification = true;
            
            // Auto-hide notification after 5 seconds
            setTimeout(() => {
              this.showNotification = false;
            }, 5000);
          }
          // Remove the notification data
          localStorage.removeItem('newPetAdded');
        } catch (error) {
          console.error('Error parsing new pet notification data:', error);
          localStorage.removeItem('newPetAdded');
        }
      }
    },
    async forceFetchPets() {
      this.pets = []
      await this.fetchPets()
    },
    async fetchPets() {
      try {
        console.log('Fetching pets data...');
        const response = await fetch('http://localhost:5000/api/pet', {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch pets')
        }
        const result = await response.json()

        if (result.success && result.data) {
          // Store previous statuses before updating
          const oldPets = [...this.pets];

          this.pets = result.data.map(pet => ({
            id: pet.id,
            name: pet.name,
            breed: pet.breed,
            type: pet.species,
            age: pet.age,
            status: this.normalizeStatus(pet.status || 'Available'),
            photo: pet.photo_url || '/Img/default-pet.jpg',
            description: pet.description || ''
          }))

          // Check for status changes
          this.detectStatusChanges(oldPets, this.pets);

          console.log('Pets data loaded:', this.pets.length, 'pets');
          console.log('Adopted pets:', this.pets.filter(p => p.status === 'Adopted').length);
          console.log('Available pets:', this.pets.filter(p => p.status === 'Available').length);
        } else {
          throw new Error(result.message || 'Failed to fetch pets')
        }
      } catch (error) {
        console.error('Error fetching pets:', error)
        // Show error message to user
        alert('Failed to load pets. Please try again later.')
      }
    },
    filterPets() {
      // Filtering is handled by computed property
    },
    viewPet(pet) {
      // Navigate to pet detail view
      this.$router.push(`/admin/pets/view/${pet.id}`);
    },
    editPet(pet) {
      // Navigate to pet edit page
      this.$router.push(`/admin/pets/edit/${pet.id}`);
    },
    confirmDelete(pet) {
      this.petToDelete = pet;
      this.showDeleteModal = true;
    },
    async deletePet() {
      if (!this.petToDelete) return;

      try {
        const response = await fetch(`http://localhost:5000/api/pet/${this.petToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to delete pet: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          // Remove from UI
          this.pets = this.pets.filter(pet => pet.id !== this.petToDelete.id);
          alert(`${this.petToDelete.name} has been successfully deleted.`);
        } else {
          throw new Error(result.message || 'Failed to delete pet');
        }
      } catch (error) {
        console.error('Error deleting pet:', error);
        alert(`Error deleting pet: ${error.message}`);
      } finally {
        this.showDeleteModal = false;
        this.petToDelete = null;
      }
    },
    async updatePetStatus(petId, newStatus) {
      const petIndex = this.pets.findIndex(pet => pet.id === petId);
      if (petIndex === -1) return;

      try {
        // Make a deep copy of the pet to update
        const updatedPet = { ...this.pets[petIndex] };
        updatedPet.status = newStatus;

        const updateData = {
          status: newStatus
        };

        const response = await fetch(`http://localhost:5000/api/pet/${petId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });

        if (!response.ok) {
          throw new Error(`Failed to update pet status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          // Update in UI
          this.pets.splice(petIndex, 1, updatedPet);
          alert(`Status for ${updatedPet.name} has been updated to ${newStatus}.`);
        } else {
          throw new Error(result.message || 'Failed to update pet status');
        }
      } catch (error) {
        console.error('Error updating pet status:', error);
        alert(`Error updating pet status: ${error.message}`);
      }
    },
    // Method to change pet availability
    async changeAvailability(pet) {
      const newStatus = pet.status === 'Available' ? 'On Hold' : 'Available';
      await this.updatePetStatus(pet.id, newStatus);
    },
    resetFilters() {
      this.searchQuery = '';
      this.statusFilter = '';
      this.typeFilter = '';
    },
    // Method to manually refresh the pets data
    async refreshPets() {
      console.log('Manually refreshing pets data');
      this.isRefreshing = true;
      try {
        await this.forceFetchPets();
      } finally {
        // Add a small delay to make the refresh animation visible
        setTimeout(() => {
          this.isRefreshing = false;
        }, 500);
      }
    },
    normalizeStatus(status) {
      return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    },
    getStatusClass(status) {
      return status.toLowerCase().replace(' ', '-');
    },
    // Add method to detect status changes
    detectStatusChanges(oldPets, newPets) {
      if (oldPets.length === 0) return; // Skip on initial load

      const statusChanges = [];

      newPets.forEach(newPet => {
        const oldPet = oldPets.find(p => p.id === newPet.id);
        if (oldPet && oldPet.status !== newPet.status) {
          statusChanges.push({
            name: newPet.name,
            oldStatus: oldPet.status,
            newStatus: newPet.status
          });
        }
      });

      if (statusChanges.length > 0) {
        // Create notification message
        if (statusChanges.length === 1) {
          const change = statusChanges[0];
          this.notificationMessage = `Pet "${change.name}" status changed from ${change.oldStatus} to ${change.newStatus}`;
        } else {
          this.notificationMessage = `${statusChanges.length} pets have had their status updated. Please review the list.`;
        }

        // Show notification
        this.showNotification = true;

        // Auto-hide notification after 8 seconds
        setTimeout(() => {
          this.showNotification = false;
        }, 8000);
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
  padding: 1rem;
  overflow-y: auto;
}

.pets-management {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  height: calc(100vh - 130px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.header-content h2 {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.header-content p {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.refresh-btn {
  background: #f4f6fa;
  color: #2196F3;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.refresh-btn:hover:not(:disabled) {
  background: #e3f2fd;
  border-color: #bbdefb;
  transform: translateY(-2px);
}

.add-pet-btn {
  background: #f7871f;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  transition: background 0.2s;
}

.add-pet-btn:hover {
  background: #e67012;
}

.stats-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stat-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #f7871f;
}

.stat-info {
  text-align: center;
}

.stat-info p {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.stat-info .stat-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.filter-section {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 300px;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}

.search-box input {
  width: 96%;
  padding: 0.6rem 1rem 0.6rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
}

.filter-options {
  display: flex;
  gap: 0.75rem;
}

.filter-options select {
  padding: 0.6rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
  min-width: 120px;
}

.table-section {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.table-container {
  overflow-y: auto;
  height: 100%;
  max-height: 100%;
}

.pets-table {
  width: 100%;
  border-collapse: collapse;
}

/* Custom scrollbar for table */
.table-container::-webkit-scrollbar {
  width: 6px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}

.pets-table th,
.pets-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.pets-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.pets-table tbody {
  overflow-y: auto;
}

.pets-table tr:hover {
  background-color: #f8f9fa;
}

.pet-photo {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
}

.status-badge {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.available {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.on-hold {
  background: #fff3e0;
  color: #e65100;
}

.status-badge.adopted {
  background: #e3f2fd;
  color: #0d47a1;
}

.action-buttons {
  display: flex;
  gap: 0.4rem;
}

.action-btn {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8rem;
}

.action-btn.view {
  background: #e3f2fd;
  color: #2196F3;
}

.action-btn.edit {
  background: #fff5eb;
  color: #f7871f;
}

.action-btn.delete {
  background: #ffebee;
  color: #f44336;
}

.action-btn:hover {
  opacity: 0.8;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  padding: 1.5rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-header h3 {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.warning-icon {
  font-size: 2rem;
  color: #f44336;
}

.modal p {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.cancel-btn, .delete-btn {
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
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

@media (max-width: 768px) {
  .admin-sidebar {
    width: 70px;
  }

  .sidebar-header {
    justify-content: center;
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

  .filters {
    flex-direction: column;
  }

  .search-box {
    min-width: 100%;
  }

  .filter-options {
    width: 100%;
  }

  .filter-options select {
    flex: 1;
  }
}

/* Add notification styles */
.status-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
  max-width: 400px;
  animation: slideIn 0.5s ease;
}

.notification-content {
  background: #e3f2fd;
  color: #0d47a1;
  border-left: 4px solid #2196F3;
  padding: 15px 20px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-content i {
  font-size: 1.2rem;
  color: #2196F3;
}

.close-notification {
  background: none;
  border: none;
  color: #666;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: auto;
  padding: 0;
}

.close-notification:hover {
  color: #333;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Success notification styling */
.notification-content.success-notification {
  background: #e8f5e9;
  color: #1b5e20;
  border-left: 4px solid #4caf50;
}

.notification-content.success-notification i {
  color: #4caf50;
}
</style>