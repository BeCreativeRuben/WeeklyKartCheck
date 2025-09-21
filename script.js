// Global variables
let selectedKarts = new Set(); // Track karts with issues
let kartProblems = {}; // Store individual problems for each kart
let checklistData = {}; // Store checklist data
let currentEditingKart = null; // Currently editing kart
let currentDate = new Date().toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
let currentLanguage = 'en'; // Current language
let isSubmitting = false; // Prevent double submission

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Reset everything on page load
    resetAllData();
    
    initializeKartGrid();
    setupEventListeners();
    updateCurrentDate();
});

// Update current date display
function updateCurrentDate() {
    document.getElementById('currentDate').textContent = currentDate;
}

// Create kart selection grid
function initializeKartGrid() {
    const kartGrid = document.querySelector('.kart-grid');
    
    if (!kartGrid) {
        console.error('Kart grid element not found!');
        return;
    }
    
    // Clear any existing buttons first
    kartGrid.innerHTML = '';
    
    for (let i = 1; i <= 36; i++) {
        const kartButton = document.createElement('button');
        kartButton.className = 'kart-button';
        kartButton.textContent = i;
        kartButton.dataset.kartNumber = i;
        kartButton.addEventListener('click', () => selectKartForEditing(i));
        kartGrid.appendChild(kartButton);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Language toggle
    document.getElementById('languageToggle').addEventListener('click', toggleLanguage);
    
    // Kart-specific actions
    document.getElementById('saveKartProblems').addEventListener('click', saveKartProblems);
    document.getElementById('clearKartProblems').addEventListener('click', clearKartProblems);
    
    // Form submission
    document.getElementById('submitAllChecklists').addEventListener('click', submitAllChecklists);
    document.getElementById('clearAll').addEventListener('click', clearAll);
    
    // Dashboard controls
    document.getElementById('viewDashboard').addEventListener('click', showDashboard);
    document.getElementById('backToChecklist').addEventListener('click', showChecklist);
}

// Select a kart for editing problems
function selectKartForEditing(kartNumber) {
    // Check if there's already a kart being edited that hasn't been saved
    if (currentEditingKart && currentEditingKart !== kartNumber) {
        // Check if the current kart has unsaved changes
        const hasUnsavedChanges = !kartProblems[currentEditingKart] || 
                                 !kartProblems[currentEditingKart].issues || 
                                 kartProblems[currentEditingKart].issues.length === 0;
        
        if (hasUnsavedChanges) {
            const message = currentLanguage === 'en' 
                ? `Please complete the checklist for Kart #${currentEditingKart} before selecting another kart.`
                : `Voltooi eerst de checklist voor Kart #${currentEditingKart} voordat je een andere kart selecteert.`;
            showSmallError(message);
            return;
        }
    }
    
    // Add to selected karts if not already selected
    if (!selectedKarts.has(kartNumber)) {
        selectedKarts.add(kartNumber);
        const kartButton = document.querySelector(`[data-kart-number="${kartNumber}"]`);
        kartButton.classList.add('has-issues');
    }
    
    // Set as current editing kart
    currentEditingKart = kartNumber;
    
    // Update display
    updateSelectedKartsList();
    showKartChecklist(kartNumber);
}

// Show checklist for specific kart
function showKartChecklist(kartNumber) {
    const checklistSection = document.getElementById('kartChecklistSection');
    const currentKartNumber = document.getElementById('currentKartNumber');
    const currentKartNumberOther = document.getElementById('currentKartNumberOther');
    
    // Show the checklist section
    checklistSection.style.display = 'block';
    
    // Apply current language to the checklist section
    updateLanguage();
    
    // Update kart numbers in display AFTER language update
    currentKartNumber.textContent = kartNumber;
    currentKartNumberOther.textContent = kartNumber;
    
    // Smooth scroll to the checklist section
    setTimeout(() => {
        checklistSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 100);
    
    // Load existing problems for this kart
    loadKartProblems(kartNumber);
}

// Load existing problems for a kart
function loadKartProblems(kartNumber) {
    if (kartProblems[kartNumber]) {
        const problems = kartProblems[kartNumber];
        
        // Load checklist items
        const checklistCheckboxes = document.querySelectorAll('#detailedChecklist input[type="checkbox"]');
        checklistCheckboxes.forEach(checkbox => {
            checkbox.checked = problems.issues.includes(checkbox.value);
        });
        
        // Load other failures
        document.getElementById('kartOtherFailures').value = problems.otherFailures || '';
    } else {
        // Clear form if no existing data
        clearKartChecklistForm();
    }
}

// Clear the kart checklist form
function clearKartChecklistForm() {
    const checklistCheckboxes = document.querySelectorAll('#detailedChecklist input[type="checkbox"]');
    checklistCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    document.getElementById('kartOtherFailures').value = '';
}

// Save problems for current kart
function saveKartProblems() {
    if (!currentEditingKart) {
        const message = currentLanguage === 'en' 
            ? 'No kart selected for editing.'
            : 'Geen kart geselecteerd voor bewerken.';
        showMessage(message, 'error');
        return;
    }
    
    // Collect checklist data
    const checkedIssues = [];
    const checklistCheckboxes = document.querySelectorAll('#detailedChecklist input[type="checkbox"]:checked');
    
    checklistCheckboxes.forEach(checkbox => {
        checkedIssues.push(checkbox.value);
    });
    
    const otherFailures = document.getElementById('kartOtherFailures').value.trim();
    
    // Save problems for this kart
    kartProblems[currentEditingKart] = {
        issues: checkedIssues,
        otherFailures: otherFailures,
        timestamp: new Date().toISOString()
    };
    
    // Update kart button appearance
    updateKartButtonAppearance(currentEditingKart, 'issues');
    
    // Update the selected karts list immediately
    updateSelectedKartsList();
    
    // Show success message
    const message = currentLanguage === 'en' 
        ? `Problems saved for Kart #${currentEditingKart}`
        : `Problemen opgeslagen voor Kart #${currentEditingKart}`;
    showMessage(message, 'success');
    
    // Clear the form
    clearKartChecklistForm();
    
    // Hide the checklist section
    document.getElementById('kartChecklistSection').style.display = 'none';
    
    // Reset current editing kart so user can select another kart
    currentEditingKart = null;
}

// Clear problems for current kart
function clearKartProblems() {
    if (!currentEditingKart) {
        const message = currentLanguage === 'en' 
            ? 'No kart selected for editing.'
            : 'Geen kart geselecteerd voor bewerken.';
        showMessage(message, 'error');
        return;
    }
    
    const kartNumber = currentEditingKart;
    
    // Remove from selected karts
    selectedKarts.delete(kartNumber);
    
    // Remove problems data
    delete kartProblems[kartNumber];
    
    // Update kart button appearance
    const kartButton = document.querySelector(`[data-kart-number="${kartNumber}"]`);
    kartButton.classList.remove('has-issues');
    
    // Clear and hide form
    clearKartChecklistForm();
    document.getElementById('kartChecklistSection').style.display = 'none';
    currentEditingKart = null;
    
    // Update display
    updateSelectedKartsList();
    
    const message = currentLanguage === 'en' 
        ? `Kart #${kartNumber} cleared and removed from issues list.`
        : `Kart #${kartNumber} gewist en verwijderd uit problemen lijst.`;
    showMessage(message, 'success');
}

// Reset all data (called on page load)
function resetAllData() {
    // Clear all selections
    selectedKarts.clear();
    kartProblems = {};
    currentEditingKart = null;
    
    // Reset all kart buttons to default state
    document.querySelectorAll('.kart-button').forEach(btn => {
        btn.classList.remove('has-issues', 'checked-ok', 'checked-issues', 'selected');
    });
    
    // Clear all forms
    clearKartChecklistForm();
    document.getElementById('otherFailures').value = '';
    
    // Hide checklist section
    document.getElementById('kartChecklistSection').style.display = 'none';
    
    // Update display
    updateSelectedKartsList();
}

// Update the selected karts display
function updateSelectedKartsList() {
    const selectedKartsList = document.getElementById('selectedKartsList');
    
    if (selectedKarts.size === 0) {
        selectedKartsList.innerHTML = '<p class="no-selection">No karts selected yet. Click on kart numbers above to mark them as having issues.</p>';
    } else {
        const kartTags = Array.from(selectedKarts).sort((a, b) => a - b).map(kartNumber => {
            const hasProblems = kartProblems[kartNumber] && Object.keys(kartProblems[kartNumber]).length > 0;
            const statusIcon = hasProblems ? '✅' : '⚠️';
            const statusText = hasProblems ? 'Problems saved' : 'Needs problems';
            
            return `<div class="kart-tag">
                ${statusIcon} Kart #${kartNumber} - ${statusText}
                <button class="remove-btn" onclick="removeKart(${kartNumber})">×</button>
            </div>`;
        }).join('');
        
        selectedKartsList.innerHTML = kartTags;
    }
}

// Remove kart from selection
function removeKart(kartNumber) {
    selectedKarts.delete(kartNumber);
    delete kartProblems[kartNumber];
    
    const kartButton = document.querySelector(`[data-kart-number="${kartNumber}"]`);
    kartButton.classList.remove('has-issues');
    
    updateSelectedKartsList();
    
    // If this was the current editing kart, hide the form
    if (currentEditingKart === kartNumber) {
        document.getElementById('kartChecklistSection').style.display = 'none';
        currentEditingKart = null;
    }
}

// Toggle language
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'nl' : 'en';
    updateLanguage();
}

// Update language throughout the interface
function updateLanguage() {
    // Store current kart numbers before translation
    const currentKartNumber = document.getElementById('currentKartNumber');
    const currentKartNumberOther = document.getElementById('currentKartNumberOther');
    const storedKartNumber = currentKartNumber ? currentKartNumber.textContent : '';
    const storedKartNumberOther = currentKartNumberOther ? currentKartNumberOther.textContent : '';
    
    // Update all elements with translation data, but skip kart number spans
    const elements = document.querySelectorAll('[data-en][data-nl]');
    elements.forEach(element => {
        // Skip elements that contain kart numbers
        if (element.id !== 'currentKartNumber' && element.id !== 'currentKartNumberOther') {
            element.textContent = element.getAttribute(`data-${currentLanguage}`);
        }
    });
    
    // Restore kart numbers after translation
    if (currentKartNumber && storedKartNumber) {
        currentKartNumber.textContent = storedKartNumber;
    }
    if (currentKartNumberOther && storedKartNumberOther) {
        currentKartNumberOther.textContent = storedKartNumberOther;
    }
    
    // Update placeholders
    const placeholders = document.querySelectorAll('[data-en-placeholder][data-nl-placeholder]');
    placeholders.forEach(element => {
        element.placeholder = element.getAttribute(`data-${currentLanguage}-placeholder`);
    });
    
    // Update language toggle button
    const toggleBtn = document.getElementById('languageToggle');
    toggleBtn.textContent = currentLanguage === 'en' ? '🇳🇱 NL' : '🇬🇧 EN';
    
    // Update date format based on language
    if (currentLanguage === 'nl') {
        currentDate = new Date().toLocaleDateString('nl-NL');
    } else {
        currentDate = new Date().toLocaleDateString('en-GB');
    }
    updateCurrentDate();
}

// Submit all checklists
async function submitAllChecklists() {
    if (isSubmitting) return;
    
    // Check if any data has been entered at all
    const otherFailures = document.getElementById('otherFailures').value.trim();
    const hasAnyKartProblems = Object.keys(kartProblems).length > 0;
    
    if (selectedKarts.size === 0 && !otherFailures && !hasAnyKartProblems) {
        const message = currentLanguage === 'en' 
            ? '⚠️ Please fill in some information before submitting. Select karts with issues or add general failures.'
            : '⚠️ Vul eerst wat informatie in voordat u verstuurt. Selecteer karts met problemen of voeg algemene storingen toe.';
        showMessage(message, 'error');
        return;
    }
    
    if (selectedKarts.size === 0) {
        const message = currentLanguage === 'en' 
            ? '⚠️ Please select at least one kart with issues before submitting.'
            : '⚠️ Selecteer ten minste één kart met problemen voordat u verstuurt.';
        showMessage(message, 'error');
        return;
    }
    
    // Check if all selected karts have problems defined
    const kartsWithoutProblems = Array.from(selectedKarts).filter(kartNumber => 
        !kartProblems[kartNumber] || !kartProblems[kartNumber].issues || kartProblems[kartNumber].issues.length === 0
    );
    
    if (kartsWithoutProblems.length > 0) {
        const message = currentLanguage === 'en'
            ? `Please define problems for karts: ${kartsWithoutProblems.join(', ')}`
            : `Definieer problemen voor karts: ${kartsWithoutProblems.join(', ')}`;
        showMessage(message, 'error');
        return;
    }
    
    isSubmitting = true;
    const submitBtn = document.getElementById('submitAllChecklists');
    submitBtn.classList.add('loading');
    
    const otherFailuresValue = document.getElementById('otherFailures').value.trim();
    
    // Generate unique submission ID
    const submissionId = 'SUB_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Prepare data for submission
    const checklistEntry = {
        date: currentDate,
        center: 'Gent 2025',
        timestamp: new Date().toISOString(),
        submissionId: submissionId,
        kartsWithIssues: Array.from(selectedKarts).sort((a, b) => a - b),
        kartProblems: kartProblems,
        otherFailures: otherFailuresValue,
        inspector: 'User' // Default inspector name
    };
    
    // Store data locally
    const entryId = `checklist_${Date.now()}`;
    checklistData[entryId] = checklistEntry;
    
    // Save to localStorage
    saveStoredData();
    
    // Update kart button appearances
    selectedKarts.forEach(kartNumber => {
        updateKartButtonAppearance(kartNumber, 'issues');
    });
    
    // Submit to Google Sheets
    try {
        await submitToGoogleSheets(checklistEntry);
        
        // Show success animation
        showSuccessAnimation(selectedKarts.size, Object.values(kartProblems).reduce((total, problems) => total + problems.issues.length, 0), submissionId);
        
    } catch (error) {
        console.error('Error submitting to Google Sheets:', error);
        showSuccessAnimation(selectedKarts.size, Object.values(kartProblems).reduce((total, problems) => total + problems.issues.length, 0), submissionId);
    }
    
    // Reset button state
    submitBtn.classList.remove('loading');
    isSubmitting = false;
    
    // Clear form after animation
    setTimeout(() => {
        clearAll();
    }, 3000);
}

// Clear all selections and form
function clearAll() {
    resetAllData();
    
    const message = currentLanguage === 'en' 
        ? 'All selections cleared.'
        : 'Alle selecties gewist.';
    showMessage(message, 'success');
}

// Update kart button appearance based on status
function updateKartButtonAppearance(kartNumber, status) {
    const kartButton = document.querySelector(`[data-kart-number="${kartNumber}"]`);
    if (kartButton) {
        kartButton.classList.remove('checked-ok', 'checked-issues', 'has-issues');
        
        if (status === 'ok') {
            kartButton.classList.add('checked-ok');
        } else if (status === 'issues') {
            kartButton.classList.add('checked-issues');
        }
    }
}

// Show dashboard
function showDashboard() {
    document.getElementById('checklistForm').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    loadDashboardData();
}

// Show checklist
function showChecklist() {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('checklistForm').style.display = 'block';
}

// Load dashboard data
function loadDashboardData() {
    const dashboardContent = document.getElementById('dashboardContent');
    
    // Create search and filter controls
    dashboardContent.innerHTML = `
        <div class="search-controls">
            <input type="text" id="searchInput" placeholder="Search by date, karts, or issues...">
            <select id="dateFilter">
                <option value="">All Dates</option>
            </select>
            <button class="btn btn-info" onclick="exportData()">Export Data</button>
        </div>
        <div id="dashboardTable"></div>
    `;
    
    // Populate date filter
    populateDateFilter();
    
    // Setup search and filter event listeners
    document.getElementById('searchInput').addEventListener('input', filterDashboardData);
    document.getElementById('dateFilter').addEventListener('change', filterDashboardData);
    
    // Load and display data
    displayDashboardData();
}

// Populate date filter dropdown
function populateDateFilter() {
    const dateFilter = document.getElementById('dateFilter');
    const dates = [...new Set(Object.values(checklistData).map(entry => entry.date))].sort();
    
    dates.forEach(date => {
        const option = document.createElement('option');
        option.value = date;
        option.textContent = date;
        dateFilter.appendChild(option);
    });
}

// Display dashboard data
function displayDashboardData() {
    const tableContainer = document.getElementById('dashboardTable');
    const data = Object.values(checklistData).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    if (data.length === 0) {
        tableContainer.innerHTML = '<p>No checklist data available yet.</p>';
        return;
    }
    
    let tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Center</th>
                    <th>Karts with Issues</th>
                    <th>Individual Problems</th>
                    <th>Other Failures</th>
                    <th>Inspector</th>
                    <th>Timestamp</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    data.forEach(entry => {
        const kartsList = entry.kartsWithIssues.join(', ');
        const otherFailures = entry.otherFailures || 'None';
        
        // Create detailed problems list
        let problemsList = '';
        entry.kartsWithIssues.forEach(kartNumber => {
            const kartData = entry.kartProblems[kartNumber];
            if (kartData && kartData.issues.length > 0) {
                problemsList += `<strong>Kart #${kartNumber}:</strong> ${kartData.issues.join(', ')}`;
                if (kartData.otherFailures) {
                    problemsList += ` (${kartData.otherFailures})`;
                }
                problemsList += '<br>';
            }
        });
        
        if (!problemsList) {
            problemsList = 'No specific problems recorded';
        }
        
        tableHTML += `
            <tr>
                <td>${entry.date}</td>
                <td>${entry.center}</td>
                <td><strong>${entry.kartsWithIssues.length} karts:</strong> ${kartsList}</td>
                <td>${problemsList}</td>
                <td>${otherFailures}</td>
                <td>${entry.inspector}</td>
                <td>${formatTimestamp(entry.timestamp)}</td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;
}

// Format timestamp for display
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
}

// Filter dashboard data
function filterDashboardData() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const dateFilter = document.getElementById('dateFilter').value;
    
    const rows = document.querySelectorAll('.data-table tbody tr');
    
    rows.forEach(row => {
        const date = row.cells[0].textContent;
        const center = row.cells[1].textContent.toLowerCase();
        const karts = row.cells[2].textContent.toLowerCase();
        const problems = row.cells[3].textContent.toLowerCase();
        const otherFailures = row.cells[4].textContent.toLowerCase();
        
        const matchesSearch = date.includes(searchTerm) || 
                            center.includes(searchTerm) || 
                            karts.includes(searchTerm) || 
                            problems.includes(searchTerm) ||
                            otherFailures.includes(searchTerm);
        
        const matchesDate = !dateFilter || date === dateFilter;
        
        row.style.display = (matchesSearch && matchesDate) ? '' : 'none';
    });
}

// Export data
function exportData() {
    const data = Object.values(checklistData);
    const csvContent = convertToCSV(data);
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kart_checklist_${currentDate.replace(/\//g, '-')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Convert data to CSV format
function convertToCSV(data) {
    const headers = ['Date', 'Center', 'Karts with Issues', 'Individual Problems', 'Other Failures', 'Inspector', 'Timestamp'];
    const csvRows = [headers.join(',')];
    
    data.forEach(entry => {
        const kartsList = entry.kartsWithIssues.join('; ');
        
        // Create detailed problems list
        let problemsList = '';
        entry.kartsWithIssues.forEach(kartNumber => {
            const kartData = entry.kartProblems[kartNumber];
            if (kartData && kartData.issues.length > 0) {
                problemsList += `Kart #${kartNumber}: ${kartData.issues.join(', ')}`;
                if (kartData.otherFailures) {
                    problemsList += ` (${kartData.otherFailures})`;
                }
                problemsList += '; ';
            }
        });
        
        const otherFailures = entry.otherFailures || 'None';
        
        const row = [
            entry.date,
            entry.center,
            `"${kartsList}"`,
            `"${problemsList}"`,
            `"${otherFailures}"`,
            entry.inspector,
            entry.timestamp
        ];
        csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
}

// Show message to user
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at the top of main content
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(messageDiv, mainContent.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Show small error popup
function showSmallError(message) {
    // Remove existing small errors
    const existingErrors = document.querySelectorAll('.small-error');
    existingErrors.forEach(error => error.remove());
    
    // Create small error popup
    const errorDiv = document.createElement('div');
    errorDiv.className = 'small-error';
    errorDiv.textContent = message;
    
    // Add to body
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Save data to localStorage (for Google Sheets submission only)
function saveStoredData() {
    localStorage.setItem('kartChecklistData', JSON.stringify(checklistData));
}

// Show success animation
function showSuccessAnimation(kartCount, issueCount, submissionId = null) {
    const animation = document.getElementById('successAnimation');
    const submittedKarts = document.getElementById('submittedKarts');
    const issuesFound = document.getElementById('issuesFound');
    
    // Update stats
    submittedKarts.textContent = kartCount;
    issuesFound.textContent = issueCount;
    
    // Add submission ID to the success message if provided
    if (submissionId) {
        const successContent = animation.querySelector('.success-content');
        let submissionInfo = successContent.querySelector('.submission-info');
        
        if (!submissionInfo) {
            submissionInfo = document.createElement('div');
            submissionInfo.className = 'submission-info';
            submissionInfo.style.cssText = 'margin-top: 15px; font-size: 0.9rem; opacity: 0.8;';
            successContent.appendChild(submissionInfo);
        }
        
        submissionInfo.innerHTML = `<strong>Submission ID:</strong> ${submissionId}`;
    }
    
    // Show animation
    animation.style.display = 'flex';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        animation.style.display = 'none';
    }, 3000);
}

// Google Sheets integration
async function submitToGoogleSheets(data) {
    // Replace this URL with your actual Google Apps Script web app URL
    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwRpL5Sm_B4-pHNeK-5BNBp7BUfnM0p8jjahki2b8YdvS5YniUdnqozQGefUR9fdmB1/exec';
    
    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=UTF-8'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error);
        }
        
        console.log('Data submitted to Google Sheets successfully:', result);
        console.log('Spreadsheet URL:', result.spreadsheetUrl);
        console.log('Sheet name:', result.sheetName);
        console.log('Last row:', result.lastRow);
        
        return result;
        
    } catch (error) {
        console.error('Error submitting to Google Sheets:', error);
        
        // Show user-friendly message
        const message = currentLanguage === 'en' 
            ? 'Data saved locally. Please check Google Sheets setup.'
            : 'Data lokaal opgeslagen. Controleer Google Sheets instellingen.';
        showMessage(message, 'error');
        
        // Still resolve so the success animation shows
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Continuing with local save only');
                resolve();
            }, 1000);
        });
    }
}