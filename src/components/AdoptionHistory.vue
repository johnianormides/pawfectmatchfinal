<template>
  <div class="adoption-history">
    <div class="report-header">
      <h2>Adoption Reports</h2>
      <p class="subtitle">Generate and download adoption statistics and reports</p>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-paw"></i>
        </div>
        <div class="stat-info">
          <h3>Total Pets</h3>
          <p>{{ stats.totalPets }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-home"></i>
        </div>
        <div class="stat-info">
          <h3>Available for Adoption</h3>
          <p>{{ stats.availablePets }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-file-alt"></i>
        </div>
        <div class="stat-info">
          <h3>Pending Applications</h3>
          <p>{{ stats.pendingApplications }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-info">
          <h3>Completed Adoptions</h3>
          <p>{{ stats.completedAdoptions }}</p>
        </div>
      </div>
    </div>

    <!-- Report Generation Section -->
    <div class="report-section">
      <div class="section-header">
        <h3><i class="fas fa-file-download"></i> Generate Reports</h3>
      </div>
      
      <div class="report-options">
        <div class="report-type-selector">
          <label for="reportType">Report Type:</label>
          <select id="reportType" v-model="selectedReportType">
            <option value="adoption-summary">Adoption Summary</option>
            <option value="monthly-stats">Monthly Statistics</option>
            <option value="pet-demographics">Pet Demographics</option>
            <option value="application-status">Application Status</option>
            <option value="custom">Custom Report</option>
          </select>
        </div>

        <!-- Date Range Selector -->
        <div class="date-range">
          <div class="date-input">
            <label for="startDate">Start Date:</label>
            <input type="date" id="startDate" v-model="startDate">
          </div>
          <div class="date-input">
            <label for="endDate">End Date:</label>
            <input type="date" id="endDate" v-model="endDate">
          </div>
        </div>
      </div>

      <!-- Custom Report Options (shown only when custom is selected) -->
      <div class="custom-options" v-if="selectedReportType === 'custom'">
        <h4>Select Data to Include:</h4>
        <div class="checkbox-group">
          <div class="checkbox-item">
            <input type="checkbox" id="includePets" v-model="customOptions.includePets">
            <label for="includePets">Pet Statistics</label>
          </div>
          <div class="checkbox-item">
            <input type="checkbox" id="includeApplications" v-model="customOptions.includeApplications">
            <label for="includeApplications">Application Data</label>
          </div>
          <div class="checkbox-item">
            <input type="checkbox" id="includeAdoptions" v-model="customOptions.includeAdoptions">
            <label for="includeAdoptions">Adoption History</label>
          </div>
          <div class="checkbox-item">
            <input type="checkbox" id="includeCharts" v-model="customOptions.includeCharts">
            <label for="includeCharts">Include Charts</label>
          </div>
        </div>
      </div>

      <!-- Download Buttons -->
      <div class="download-options">
        <button class="download-btn pdf" @click="generateReport('pdf')">
          <i class="fas fa-file-pdf"></i> Download as PDF
        </button>
        <button class="download-btn excel" @click="generateReport('excel')">
          <i class="fas fa-file-excel"></i> Download as Excel
        </button>
        <button class="download-btn word" @click="generateReport('word')">
          <i class="fas fa-file-word"></i> Download as Word
        </button>
      </div>
    </div>

    <!-- Report Preview -->
    <div class="report-preview" v-if="showPreview">
      <div class="preview-header">
        <h3>Report Preview</h3>
        <button class="close-preview" @click="showPreview = false">&times;</button>
      </div>
      <div class="preview-content">
        <div class="preview-loading" v-if="isGenerating">
          <div class="spinner"></div>
          <p>Generating preview...</p>
        </div>
        <div class="preview-data" v-else>
          <!-- Preview content will be rendered here -->
          <h2>{{ getReportTitle() }}</h2>
          <p class="report-date">Report Period: {{ formatDate(startDate) }} - {{ formatDate(endDate) }}</p>
          
          <div class="preview-stats">
            <div class="preview-stat-item">
              <h4>Total Pets</h4>
              <p>{{ stats.totalPets }}</p>
            </div>
            <div class="preview-stat-item">
              <h4>Available Pets</h4>
              <p>{{ stats.availablePets }}</p>
            </div>
            <div class="preview-stat-item">
              <h4>Completed Adoptions</h4>
              <p>{{ stats.completedAdoptions }}</p>
            </div>
            <div class="preview-stat-item">
              <h4>Pending Applications</h4>
              <p>{{ stats.pendingApplications }}</p>
            </div>
          </div>

          <div class="preview-chart" v-if="selectedReportType !== 'custom' || customOptions.includeCharts">
            <h4>Adoption Trends</h4>
            <div class="chart-placeholder">
              <p>Chart visualization will be included in the downloaded report</p>
            </div>
          </div>

          <div class="preview-table">
            <h4>Recent Adoptions</h4>
            <table>
              <thead>
                <tr>
                  <th>Pet Name</th>
                  <th>Species</th>
                  <th>Adoption Date</th>
                  <th>Adopter</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(adoption, index) in recentAdoptions" :key="index">
                  <td>{{ adoption.petName }}</td>
                  <td>{{ adoption.species }}</td>
                  <td>{{ formatDate(adoption.date) }}</td>
                  <td>{{ adoption.adopterName }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdoptionHistory',
  data() {
    return {
      stats: {
        totalPets: 0,
        availablePets: 0,
        pendingApplications: 0,
        completedAdoptions: 0
      },
      selectedReportType: 'adoption-summary',
      startDate: this.getDefaultStartDate(),
      endDate: this.getDefaultEndDate(),
      customOptions: {
        includePets: true,
        includeApplications: true,
        includeAdoptions: true,
        includeCharts: true
      },
      showPreview: false,
      isGenerating: false,
      recentAdoptions: [
        { petName: 'Max', species: 'Dog', date: '2023-06-15', adopterName: 'John Smith' },
        { petName: 'Luna', species: 'Cat', date: '2023-07-02', adopterName: 'Sarah Johnson' },
        { petName: 'Rocky', species: 'Dog', date: '2023-08-10', adopterName: 'Michael Brown' }
      ]
    }
  },
  mounted() {
    this.fetchStats();
  },
  methods: {
    getDefaultStartDate() {
      // Default to 30 days ago
      const date = new Date();
      date.setDate(date.getDate() - 30);
      return date.toISOString().split('T')[0];
    },
    getDefaultEndDate() {
      // Default to today
      return new Date().toISOString().split('T')[0];
    },
    async fetchStats() {
      try {
        // Fetch all necessary data: pets, applications, and stats
        const petsResponse = await fetch('http://localhost:5000/api/pet');
        const applicationsResponse = await fetch('http://localhost:5000/api/application');

        if (!petsResponse.ok || !applicationsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const petsData = await petsResponse.json();
        const applicationsData = await applicationsResponse.json();

        if (petsData.success && petsData.data) {
          // Count total pets
          this.stats.totalPets = petsData.data.length;
          
          // Count available pets
          this.stats.availablePets = petsData.data.filter(pet => 
            pet.status && pet.status.toLowerCase().trim() === 'available'
          ).length;
          
          // Count adopted pets
          this.stats.completedAdoptions = petsData.data.filter(pet => 
            pet.status && pet.status.toLowerCase().trim() === 'adopted'
          ).length;
        }

        if (applicationsData.success && applicationsData.data) {
          // Count pending applications
          this.stats.pendingApplications = applicationsData.data.filter(app => 
            app.status && app.status.toLowerCase() === 'pending'
          ).length;
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to sample data
        this.stats = {
          totalPets: 24,
          availablePets: 15,
          pendingApplications: 0,
          completedAdoptions: 3
        };
      }
    },
    generateReport(format) {
      this.isGenerating = true;
      this.showPreview = true;
      
      // Simulate report generation
      setTimeout(() => {
        this.isGenerating = false;
        
        // In a real implementation, this would generate and download the actual report
        if (!this.showPreview) {
          alert(`Your ${this.getReportTitle()} has been downloaded as ${format.toUpperCase()}`);
        }
      }, 1500);
      
      // In a real implementation, you would use libraries like jsPDF, xlsx, or docx
      // to generate the actual reports based on the selected options
      console.log(`Generating ${format} report for ${this.selectedReportType}`);
      console.log(`Date range: ${this.startDate} to ${this.endDate}`);
      
      if (this.selectedReportType === 'custom') {
        console.log('Custom options:', this.customOptions);
      }
    },
    getReportTitle() {
      const reportTypes = {
        'adoption-summary': 'Adoption Summary Report',
        'monthly-stats': 'Monthly Statistics Report',
        'pet-demographics': 'Pet Demographics Report',
        'application-status': 'Application Status Report',
        'custom': 'Custom Adoption Report'
      };
      
      return reportTypes[this.selectedReportType] || 'Adoption Report';
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
}
</script>

<style scoped>
.adoption-history {
  padding: 2rem;
  background: #f4f6fa;
  min-height: 100vh;
}

.report-header {
  margin-bottom: 2rem;
  text-align: center;
}

.report-header h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1rem;
}

/* Stats Grid Styling */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #fff5eb;
  color: #f7871f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}

.stat-info h3 {
  color: #666;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 0.2rem;
}

.stat-info p {
  color: #222;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

/* Report Section Styling */
.report-section {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
}

.section-header {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 1rem;
}

.section-header h3 {
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
}

.section-header h3 i {
  color: #f7871f;
}

.report-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.report-type-selector {
  flex: 1;
  min-width: 250px;
}

.report-type-selector label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.report-type-selector select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f8f9fa;
  font-size: 0.95rem;
}

.date-range {
  display: flex;
  gap: 1rem;
  flex: 2;
  min-width: 300px;
}

.date-input {
  flex: 1;
}

.date-input label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.date-input input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f8f9fa;
  font-size: 0.95rem;
}

.custom-options {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e0e0e0;
}

.custom-options h4 {
  color: #333;
  font-size: 1rem;
  margin-top: 0;
  margin-bottom: 1rem;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-item input {
  width: 18px;
  height: 18px;
}

.checkbox-item label {
  color: #555;
  font-size: 0.95rem;
}

.download-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
}

.download-btn {
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 0.95rem;
}

.download-btn:hover {
  transform: translateY(-2px);
}

.download-btn.pdf {
  background: #ffebee;
  color: #f44336;
}

.download-btn.pdf:hover {
  background: #ffcdd2;
}

.download-btn.excel {
  background: #e8f5e9;
  color: #4CAF50;
}

.download-btn.excel:hover {
  background: #c8e6c9;
}

.download-btn.word {
  background: #e3f2fd;
  color: #2196F3;
}

.download-btn.word:hover {
  background: #bbdefb;
}

/* Report Preview Styling */
.report-preview {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  overflow: hidden;
}

.preview-header {
  padding: 1.25rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
}

.preview-header h3 {
  color: #333;
  font-size: 1.2rem;
  margin: 0;
}

.close-preview {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
}

.close-preview:hover {
  color: #333;
}

.preview-content {
  padding: 2rem;
}

.preview-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #f7871f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.preview-loading p {
  color: #666;
}

.preview-data h2 {
  color: #333;
  margin-top: 0;
  margin-bottom: 0.5rem;
  text-align: center;
}

.report-date {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.preview-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.preview-stat-item {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.preview-stat-item h4 {
  color: #666;
  font-size: 0.9rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.preview-stat-item p {
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.preview-chart {
  margin-bottom: 2rem;
}

.preview-chart h4 {
  color: #333;
  margin-bottom: 1rem;
}

.chart-placeholder {
  height: 200px;
  background: #f8f9fa;
  border: 1px dashed #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  border-radius: 8px;
}

.preview-table h4 {
  color: #333;
  margin-bottom: 1rem;
}

.preview-table table {
  width: 100%;
  border-collapse: collapse;
}

.preview-table th,
.preview-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.preview-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #555;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .preview-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .adoption-history {
    padding: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .preview-stats {
    grid-template-columns: 1fr;
  }
  
  .date-range {
    flex-direction: column;
    gap: 1rem;
  }
  
  .download-options {
    flex-direction: column;
  }
  
  .download-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>