// Job State Management
// Possible states: IDLE, SCHEDULED, RUNNING, COMPLETED, STOPPED
let currentJobState = 'IDLE';

// Update button states based on job state
function updateButtonStates() {
  const btnStart = document.getElementById('btnStartMigration');
  const btnStop = document.getElementById('btnStopMigration');
  const btnDryRun = document.getElementById('btnDryRun');
  const jobStateDisplay = document.getElementById('jobStateDisplay');
  
  jobStateDisplay.textContent = currentJobState;
  
  if (currentJobState === 'RUNNING' || currentJobState === 'SCHEDULED') {
    // When EXECUTING or SCHEDULED: Start disabled, Dry Run disabled, Stop enabled
    btnStart.disabled = true;
    btnDryRun.disabled = true;
    btnStop.disabled = false;
  } else {
    // When IDLE, COMPLETED, or STOPPED: Start enabled, Dry Run enabled, Stop disabled
    btnStart.disabled = false;
    btnDryRun.disabled = false;
    btnStop.disabled = true;
  }
}

// Show sticky banner alert
function showBannerAlert(message, type = 'info') {
  const banner = document.getElementById('bannerAlert');
  const bannerIcon = document.getElementById('bannerIcon');
  const bannerMessage = document.getElementById('bannerMessage');
  
  // Reset classes - keep sticky positioning
  banner.className = 'sticky top-0 z-50 border-b px-4 py-3 flex items-center justify-center';
  
  if (type === 'success') {
    banner.classList.add('bg-emerald-50', 'border-emerald-200', 'text-emerald-800');
    bannerIcon.textContent = '✓';
  } else if (type === 'error') {
    banner.classList.add('bg-red-50', 'border-red-200', 'text-red-800');
    bannerIcon.textContent = '✕';
  } else if (type === 'warning') {
    banner.classList.add('bg-amber-50', 'border-amber-200', 'text-amber-800');
    bannerIcon.textContent = '⚠';
  } else {
    banner.classList.add('bg-blue-50', 'border-blue-200', 'text-blue-800');
    bannerIcon.textContent = 'ℹ';
  }
  
  bannerMessage.textContent = message;
  banner.classList.remove('hidden');
}

// Hide sticky banner alert
function hideBannerAlert() {
  document.getElementById('bannerAlert').classList.add('hidden');
}

// Show Start Migration confirmation modal
function showStartConfirmation() {
  document.getElementById('startConfirmModal').classList.remove('hidden');
}

// Hide Start Migration confirmation modal
function hideStartConfirmation() {
  document.getElementById('startConfirmModal').classList.add('hidden');
}

// Confirm Start Migration
function confirmStartMigration() {
  hideStartConfirmation();
  
  // Simulate saving configuration and calling backend
  currentJobState = 'SCHEDULED';
  updateButtonStates();
  showBannerAlert('Migration scheduled', 'success');
  
  // Show migration status section
  showMigrationStatus('scheduled');
  
  // Simulate backend response - transition to EXECUTING after 2 seconds
  setTimeout(() => {
    currentJobState = 'RUNNING';
    updateButtonStates();
    showBannerAlert('Migration is now executing...', 'info');
    showMigrationStatus('running');
    
    // Transition to COMPLETED after 10 seconds
    setTimeout(() => {
      currentJobState = 'COMPLETED';
      updateButtonStates();
      showBannerAlert('Migration completed successfully!', 'success');
      showMigrationStatus('completed');
    }, 10000);
  }, 2000);
}

// Show Stop Migration confirmation modal
function showStopConfirmation() {
  document.getElementById('stopConfirmModal').classList.remove('hidden');
}

// Hide Stop Migration confirmation modal
function hideStopConfirmation() {
  document.getElementById('stopConfirmModal').classList.add('hidden');
}

// Confirm Stop Migration
function confirmStopMigration() {
  hideStopConfirmation();
  
  // Simulate calling backend stop endpoint
  currentJobState = 'STOPPED';
  updateButtonStates();
  showBannerAlert('Migration stopped', 'warning');
  
  // Update migration status to show stopped state
  showMigrationStatus('stopped');
}

// Refresh status (reloads from DB/system settings)
function refreshStatus() {
  showBannerAlert('Refreshing status...', 'info');
  // In a real app, this would call the backend to get current status
  updateButtonStates();
}

// Show Migration Status with different states
function showMigrationStatus(state) {
  const statusSection = document.getElementById('migrationStatus');
  statusSection.style.display = 'block';
  
  // Show all fields including runtime fields
  document.querySelectorAll('.runtime-field').forEach(el => el.style.display = '');
  
  // Show Quarantined Documents to Migrate, hide Quarantined Documents (dry run only)
  document.getElementById('quarantinedToMigrateRow').style.display = '';
  document.getElementById('quarantinedDocsRow').style.display = 'none';
  
  const badge = document.getElementById('statusBadge');
  const progressBar = document.getElementById('progressBar');
  const endTimeRow = document.getElementById('endTimeRow');
  const endTimeValue = document.getElementById('endTimeValue');
  
  // Hide end time by default
  endTimeRow.style.display = 'none';
  
  if (state === 'scheduled') {
    badge.textContent = 'SCHEDULED';
    badge.className = 'inline-flex items-center rounded px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700';
    progressBar.style.width = '0%';
    progressBar.textContent = '0%';
    progressBar.className = 'h-full bg-emerald-600 transition-all duration-300 flex items-center justify-center text-xs font-semibold text-white';
    document.getElementById('statusMessageValue').textContent = 'Migration scheduled, waiting to start...';
    
  } else if (state === 'running') {
    badge.textContent = 'RUNNING';
    badge.className = 'inline-flex items-center rounded px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700';
    progressBar.style.width = '45%';
    progressBar.textContent = '45%';
    progressBar.className = 'h-full bg-emerald-600 transition-all duration-300 flex items-center justify-center text-xs font-semibold text-white';
    document.getElementById('processedValue').textContent = '495 / 1100';
    document.getElementById('batchValue').textContent = '10 of 22';
    document.getElementById('successValue').textContent = '490';
    document.getElementById('failedValue').textContent = '5';
    document.getElementById('statusMessageValue').textContent = 'Processing batch 10 of 22...';
    
  } else if (state === 'stopped') {
    badge.textContent = 'STOPPED';
    badge.className = 'inline-flex items-center rounded px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-700';
    progressBar.style.width = '45%';
    progressBar.textContent = '45%';
    progressBar.className = 'h-full bg-amber-500 transition-all duration-300 flex items-center justify-center text-xs font-semibold text-white';
    document.getElementById('statusMessageValue').textContent = 'Migration stopped by user.';
    endTimeValue.textContent = new Date().toISOString().replace('T', ' ').substring(0, 19);
    endTimeRow.style.display = '';
    
  } else if (state === 'completed') {
    badge.textContent = 'COMPLETED';
    badge.className = 'inline-flex items-center rounded px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700';
    progressBar.style.width = '100%';
    progressBar.textContent = '100%';
    progressBar.className = 'h-full bg-emerald-600 transition-all duration-300 flex items-center justify-center text-xs font-semibold text-white';
    document.getElementById('processedValue').textContent = '1100 / 1100';
    document.getElementById('batchValue').textContent = '22 of 22';
    document.getElementById('successValue').textContent = '1095';
    document.getElementById('failedValue').textContent = '5';
    document.getElementById('statusMessageValue').textContent = 'Migration completed successfully.';
    endTimeValue.textContent = '2026-02-02 14:15:00';
    endTimeRow.style.display = '';
  }
  
  statusSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Run Dry Run and show Migration Status (preview mode - hide runtime fields)
function runDryRun() {
  const status = document.getElementById('migrationStatus');
  status.style.display = 'block';
  
  // Hide runtime-only elements for dry run preview
  document.querySelectorAll('.runtime-field').forEach(el => el.style.display = 'none');
  
  // Show Quarantined Documents, hide Quarantined Documents to Migrate (migration only)
  document.getElementById('quarantinedDocsRow').style.display = '';
  document.getElementById('quarantinedToMigrateRow').style.display = 'none';
  
  // Hide end time for dry run
  document.getElementById('endTimeRow').style.display = 'none';
  
  // Set status badge to Dry Run Mode
  const badge = document.getElementById('statusBadge');
  badge.textContent = 'DRY RUN MODE';
  badge.className = 'inline-flex items-center rounded px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-700';
  
  // Set progress bar to 100% for dry run completion
  const progressBar = document.getElementById('progressBar');
  progressBar.style.width = '100%';
  progressBar.textContent = '100%';
  progressBar.className = 'h-full bg-emerald-600 transition-all duration-300 flex items-center justify-center text-xs font-semibold text-white';
  
  status.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Toggle Advanced Filtering (Scheduling section)
function toggleAdvancedFiltering() {
  const section = document.getElementById('schedulingSection');
  const icon = document.getElementById('advancedFilteringIcon');
  if (section.style.display === 'none') {
    section.style.display = 'block';
    icon.textContent = '−';
  } else {
    section.style.display = 'none';
    icon.textContent = '+';
  }
}

// Toggle project selector visibility based on Project checkbox
function toggleProjectSelector() {
  const checkbox = document.getElementById('projectCheckbox');
  const selector = document.getElementById('projectSelector');
  selector.style.display = checkbox.checked ? 'block' : 'none';
}

// Toggle expand/collapse for project groups
function toggleExpand(button) {
  const group = button.closest('.project-group');
  const children = group.querySelector('.children');
  const svg = button.querySelector('svg');
  
  if (children.style.display === 'none') {
    children.style.display = 'block';
    svg.style.transform = 'rotate(0deg)';
  } else {
    children.style.display = 'none';
    svg.style.transform = 'rotate(-90deg)';
  }
}

// Toggle all children when parent is checked/unchecked
function toggleParent(parentCheckbox) {
  const group = parentCheckbox.closest('.project-group');
  const childCheckboxes = group.querySelectorAll('.children .project-checkbox');
  childCheckboxes.forEach(cb => cb.checked = parentCheckbox.checked);
  updateSelectedCount();
}

// Update parent checkbox state based on children
function updateParentState(childCheckbox) {
  const group = childCheckbox.closest('.project-group');
  const parentCheckbox = group.querySelector(':scope > div > label > .project-checkbox');
  const childCheckboxes = group.querySelectorAll('.children .project-checkbox');
  
  const allChecked = Array.from(childCheckboxes).every(cb => cb.checked);
  const someChecked = Array.from(childCheckboxes).some(cb => cb.checked);
  
  parentCheckbox.checked = allChecked;
  parentCheckbox.indeterminate = someChecked && !allChecked;
  updateSelectedCount();
}

// Select all projects
function selectAllProjects() {
  document.querySelectorAll('#projectSelector .project-checkbox').forEach(cb => {
    cb.checked = true;
    cb.indeterminate = false;
  });
  updateSelectedCount();
}

// Deselect all projects
function deselectAllProjects() {
  document.querySelectorAll('#projectSelector .project-checkbox').forEach(cb => {
    cb.checked = false;
    cb.indeterminate = false;
  });
  updateSelectedCount();
}

// Update selected count display
function updateSelectedCount() {
  const childCheckboxes = document.querySelectorAll('#projectSelector .children .project-checkbox');
  const count = Array.from(childCheckboxes).filter(cb => cb.checked).length;
  document.getElementById('selectedProjectCount').textContent = count;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  toggleProjectSelector();
  updateSelectedCount();
});
