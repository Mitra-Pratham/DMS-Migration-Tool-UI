// Toggle migration dropdown
function toggleMigrationDropdown() {
  const dropdown = document.getElementById('migrationDropdown');
  dropdown.classList.toggle('hidden');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  const dropdown = document.getElementById('migrationDropdown');
  const button = e.target.closest('button[onclick="toggleMigrationDropdown()"]');
  if (!button && !dropdown.contains(e.target)) {
    dropdown.classList.add('hidden');
  }
});

// Start Migration and show all fields based on selected status
function startMigration(selectedStatus) {
  // Hide dropdown
  document.getElementById('migrationDropdown').classList.add('hidden');
  
  const statusSection = document.getElementById('migrationStatus');
  statusSection.style.display = 'block';
  
  // Show all fields including runtime fields
  document.querySelectorAll('.runtime-field').forEach(el => el.style.display = '');
  
  const badge = document.getElementById('statusBadge');
  const progressBar = document.getElementById('progressBar');
  const auditLogRow = document.getElementById('auditLogRow');
  const auditLogLink = document.getElementById('auditLogLink');
  
  // Hide audit log by default
  auditLogRow.style.display = 'none';
  
  if (selectedStatus === 'success') {
    badge.textContent = 'SUCCESS';
    badge.className = 'inline-flex items-center rounded px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700';
    progressBar.style.width = '100%';
    progressBar.textContent = '100%';
    progressBar.className = 'h-full bg-emerald-600 transition-all duration-300 flex items-center justify-center text-xs font-semibold text-white';
    
    // Show audit log download link
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];
    const batchId = 'B' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    auditLogLink.textContent = `MigrationAudit_${timestamp}_${batchId}.csv`;
    auditLogLink.href = '#';
    auditLogRow.style.display = '';
    
  } else if (selectedStatus === 'running') {
    badge.textContent = 'RUNNING';
    badge.className = 'inline-flex items-center rounded px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700';
    progressBar.style.width = '45%';
    progressBar.textContent = '45%';
    progressBar.className = 'h-full bg-emerald-600 transition-all duration-300 flex items-center justify-center text-xs font-semibold text-white';
    
  } else if (selectedStatus === 'failed') {
    badge.textContent = 'FAILED';
    badge.className = 'inline-flex items-center rounded px-2 py-1 text-xs font-semibold bg-red-100 text-red-700';
    progressBar.style.width = '67%';
    progressBar.textContent = '67%';
    progressBar.className = 'h-full bg-red-600 transition-all duration-300 flex items-center justify-center text-xs font-semibold text-white';
  }
  
  statusSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Run Dry Run and show Migration Status (preview mode - hide runtime fields)
function runDryRun() {
  const status = document.getElementById('migrationStatus');
  status.style.display = 'block';
  
  // Hide runtime-only elements for dry run preview
  document.querySelectorAll('.runtime-field').forEach(el => el.style.display = 'none');
  
  // Hide audit log row
  document.getElementById('auditLogRow').style.display = 'none';
  
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
