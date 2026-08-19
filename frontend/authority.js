/* ============================================================
   SafeTour AI — Authority Control Center
   JavaScript Application Logic + Mock Data
   ============================================================ */

// === MOCK DATA ===

const mockTourists = [
  {
    id: 'ST-1024', name: 'Rahul Sharma', location: 'Agra', landmark: 'Taj Mahal',
    safetyScore: 42, riskLevel: 'HIGH', status: 'SOS',
    lat: 27.1751, lng: 78.0421, lastUpdate: '7:42 PM',
    phone: '+91 98XXX XXXXX',
    emergencyContact: { name: 'Anita Sharma', relationship: 'Mother', phone: '+91 97XXX XXXXX' }
  },
  {
    id: 'ST-2045', name: 'Aisha Khan', location: 'Delhi', landmark: 'India Gate',
    safetyScore: 78, riskLevel: 'MEDIUM', status: 'Monitoring',
    lat: 28.6129, lng: 77.2295, lastUpdate: '6:28 PM',
    phone: '+91 91XXX XXXXX',
    emergencyContact: { name: 'Farhan Khan', relationship: 'Brother', phone: '+91 93XXX XXXXX' }
  },
  {
    id: 'ST-3012', name: 'Arjun Mehta', location: 'Jaipur', landmark: 'Hawa Mahal',
    safetyScore: 91, riskLevel: 'LOW', status: 'Safe',
    lat: 26.9239, lng: 75.8267, lastUpdate: '5:14 PM',
    phone: '+91 88XXX XXXXX',
    emergencyContact: { name: 'Sunita Mehta', relationship: 'Wife', phone: '+91 85XXX XXXXX' }
  },
  {
    id: 'ST-4088', name: 'Priya Singh', location: 'Varanasi', landmark: 'Dashashwamedh Ghat',
    safetyScore: 66, riskLevel: 'MEDIUM', status: 'Monitoring',
    lat: 25.3176, lng: 83.0126, lastUpdate: '4:51 PM',
    phone: '+91 70XXX XXXXX',
    emergencyContact: { name: 'Rajesh Singh', relationship: 'Father', phone: '+91 72XXX XXXXX' }
  },
  {
    id: 'ST-5011', name: 'Kabir Verma', location: 'Lucknow', landmark: 'Bara Imambara',
    safetyScore: 34, riskLevel: 'HIGH', status: 'At Risk',
    lat: 26.8693, lng: 80.9132, lastUpdate: '3:22 PM',
    phone: '+91 62XXX XXXXX',
    emergencyContact: { name: 'Neha Verma', relationship: 'Sister', phone: '+91 65XXX XXXXX' }
  },
  {
    id: 'ST-6032', name: 'Sneha Patel', location: 'Mumbai', landmark: 'Gateway of India',
    safetyScore: 88, riskLevel: 'LOW', status: 'Safe',
    lat: 18.9220, lng: 72.8347, lastUpdate: '2:15 PM',
    phone: '+91 99XXX XXXXX',
    emergencyContact: { name: 'Vikram Patel', relationship: 'Husband', phone: '+91 98XXX XXXXX' }
  },
  {
    id: 'ST-7019', name: 'Rohan Desai', location: 'Goa', landmark: 'Calangute Beach',
    safetyScore: 73, riskLevel: 'MEDIUM', status: 'Monitoring',
    lat: 15.5449, lng: 73.7554, lastUpdate: '1:48 PM',
    phone: '+91 81XXX XXXXX',
    emergencyContact: { name: 'Meera Desai', relationship: 'Mother', phone: '+91 83XXX XXXXX' }
  },
  {
    id: 'ST-8055', name: 'Divya Nair', location: 'Agra', landmark: 'Agra Fort',
    safetyScore: 55, riskLevel: 'MEDIUM', status: 'Monitoring',
    lat: 27.1795, lng: 78.0211, lastUpdate: '12:30 PM',
    phone: '+91 77XXX XXXXX',
    emergencyContact: { name: 'Suresh Nair', relationship: 'Father', phone: '+91 76XXX XXXXX' }
  },
  {
    id: 'ST-9041', name: 'Amit Joshi', location: 'Delhi', landmark: 'Red Fort',
    safetyScore: 29, riskLevel: 'HIGH', status: 'SOS',
    lat: 28.6562, lng: 77.2410, lastUpdate: '8:05 PM',
    phone: '+91 86XXX XXXXX',
    emergencyContact: { name: 'Pooja Joshi', relationship: 'Wife', phone: '+91 84XXX XXXXX' }
  },
  {
    id: 'ST-1098', name: 'Nisha Gupta', location: 'Jaipur', landmark: 'Amber Fort',
    safetyScore: 95, riskLevel: 'LOW', status: 'Safe',
    lat: 26.9855, lng: 75.8513, lastUpdate: '11:20 AM',
    phone: '+91 90XXX XXXXX',
    emergencyContact: { name: 'Ravi Gupta', relationship: 'Brother', phone: '+91 92XXX XXXXX' }
  },
  {
    id: 'ST-1122', name: 'Vikrant Rao', location: 'Varanasi', landmark: 'Kashi Vishwanath',
    safetyScore: 81, riskLevel: 'LOW', status: 'Safe',
    lat: 25.3109, lng: 83.0107, lastUpdate: '10:45 AM',
    phone: '+91 73XXX XXXXX',
    emergencyContact: { name: 'Lakshmi Rao', relationship: 'Mother', phone: '+91 74XXX XXXXX' }
  },
  {
    id: 'ST-1255', name: 'Fatima Begum', location: 'Lucknow', landmark: 'Rumi Darwaza',
    safetyScore: 60, riskLevel: 'MEDIUM', status: 'Monitoring',
    lat: 26.8606, lng: 80.9445, lastUpdate: '9:15 AM',
    phone: '+91 68XXX XXXXX',
    emergencyContact: { name: 'Ahmed Begum', relationship: 'Father', phone: '+91 67XXX XXXXX' }
  }
];

const mockIncidents = [
  {
    id: 'SOS-001', touristId: 'ST-1024', touristName: 'Rahul Sharma',
    type: 'Personal Safety', location: 'Agra Fort, Agra', time: '7:42 PM',
    riskLevel: 'HIGH', status: 'ACTIVE',
    description: 'Tourist has triggered an emergency SOS alert and requires immediate authority attention. Tourist reported feeling unsafe near the fort premises during evening hours.',
    safetyScore: 42, isSOS: true
  },
  {
    id: 'INC-204', touristId: 'ST-2045', touristName: 'Aisha Khan',
    type: 'Theft', location: 'Connaught Place, Delhi', time: '6:28 PM',
    riskLevel: 'MEDIUM', status: 'UNDER REVIEW',
    description: 'Tourist reported theft of personal belongings including wallet and phone near Connaught Place metro station.',
    safetyScore: 78, isSOS: false
  },
  {
    id: 'INC-302', touristId: 'ST-3012', touristName: 'Arjun Mehta',
    type: 'Unsafe Area', location: 'Old City, Jaipur', time: '5:14 PM',
    riskLevel: 'LOW', status: 'RESOLVED',
    description: 'Tourist entered a geofenced area marked as potentially unsafe. Automated notification was sent and tourist has since moved to a safer location.',
    safetyScore: 91, isSOS: false
  },
  {
    id: 'INC-411', touristId: 'ST-4088', touristName: 'Priya Singh',
    type: 'Medical Emergency', location: 'Dashashwamedh Ghat, Varanasi', time: '4:51 PM',
    riskLevel: 'HIGH', status: 'RESPONDING',
    description: 'Tourist reported feeling unwell and experiencing dehydration symptoms. Medical assistance has been dispatched.',
    safetyScore: 66, isSOS: false
  },
  {
    id: 'SOS-002', touristId: 'ST-9041', touristName: 'Amit Joshi',
    type: 'Personal Safety', location: 'Red Fort Area, Delhi', time: '8:05 PM',
    riskLevel: 'HIGH', status: 'ACTIVE',
    description: 'Tourist triggered SOS alert. Reports being followed by suspicious individuals near the Red Fort area during evening.',
    safetyScore: 29, isSOS: true
  },
  {
    id: 'SOS-003', touristId: 'ST-5011', touristName: 'Kabir Verma',
    type: 'Harassment', location: 'Bara Imambara, Lucknow', time: '3:22 PM',
    riskLevel: 'HIGH', status: 'ACTIVE',
    description: 'Tourist reported harassment by local touts near Bara Imambara. Situation escalating. Authority intervention required.',
    safetyScore: 34, isSOS: true
  }
];

const mockNearbyServices = {
  'Agra': {
    police: { name: 'Agra Police Station', distance: '1.8 km', responseTime: '6 minutes', status: 'AVAILABLE', phone: '0562-2260073' },
    hospital: { name: 'District Hospital Agra', distance: '2.4 km', emergency: 'AVAILABLE', phone: '0562-2260025' }
  },
  'Delhi': {
    police: { name: 'Parliament Street PS', distance: '2.1 km', responseTime: '8 minutes', status: 'AVAILABLE', phone: '011-23361600' },
    hospital: { name: 'RML Hospital', distance: '3.2 km', emergency: 'AVAILABLE', phone: '011-23404446' }
  },
  'Jaipur': {
    police: { name: 'Jaipur City Police', distance: '1.5 km', responseTime: '5 minutes', status: 'AVAILABLE', phone: '0141-2560844' },
    hospital: { name: 'SMS Hospital Jaipur', distance: '2.8 km', emergency: 'AVAILABLE', phone: '0141-2518213' }
  },
  'Varanasi': {
    police: { name: 'Lanka Police Station', distance: '2.0 km', responseTime: '7 minutes', status: 'AVAILABLE', phone: '0542-2368855' },
    hospital: { name: 'BHU Hospital', distance: '3.0 km', emergency: 'AVAILABLE', phone: '0542-2307566' }
  },
  'Lucknow': {
    police: { name: 'Hazratganj PS', distance: '1.2 km', responseTime: '4 minutes', status: 'AVAILABLE', phone: '0522-2620173' },
    hospital: { name: 'KGMU Hospital', distance: '1.9 km', emergency: 'AVAILABLE', phone: '0522-2257540' }
  },
  'Mumbai': {
    police: { name: 'Colaba Police Station', distance: '0.8 km', responseTime: '3 minutes', status: 'AVAILABLE', phone: '022-22820166' },
    hospital: { name: 'GT Hospital', distance: '1.5 km', emergency: 'AVAILABLE', phone: '022-22621520' }
  },
  'Goa': {
    police: { name: 'Calangute Police Station', distance: '1.3 km', responseTime: '5 minutes', status: 'AVAILABLE', phone: '0832-2276040' },
    hospital: { name: 'Goa Medical College', distance: '4.2 km', emergency: 'AVAILABLE', phone: '0832-2458727' }
  }
};

const dashboardStats = {
  totalTourists: 1248,
  activeTourists: 936,
  highRiskTourists: 47,
  activeSOS: 3,
  overallSafetyScore: 82,
  riskBreakdown: { low: 72, medium: 24, high: 4 }
};


// === APPLICATION STATE ===

let currentFilters = { search: '', risk: 'All', status: 'All', location: 'All' };
let incidentStates = {};
let searchDebounceTimer = null;
let mapScale = 1;
let mainMap = null;
let mainMapMarkers = {};
let sosMap = null;

const mockNotifications = [
  { id: 'nt-1', title: '🚨 SOS Alert: ST-1024', desc: 'Rahul Sharma triggered a Personal Safety alarm in Agra Fort.', time: 'Just now', unread: true, type: 'sos', link: 'SOS-001' },
  { id: 'nt-2', title: '🚨 SOS Alert: ST-9041', desc: 'Amit Joshi reports being followed in Red Fort Area, Delhi.', time: '12m ago', unread: true, type: 'sos', link: 'SOS-002' },
  { id: 'nt-3', title: '🚨 SOS Alert: ST-5011', desc: 'Kabir Verma reports harassment by touts in Bara Imambara.', time: '2h ago', unread: true, type: 'sos', link: 'SOS-003' },
  { id: 'nt-4', title: '⚠️ Geofence Breach: ST-3012', desc: 'Arjun Mehta crossed into Demo Restricted Zone (Jaipur).', time: '3h ago', unread: false, type: 'warning', link: 'INC-302' },
  { id: 'nt-5', title: '🏥 Medical Request: ST-4088', desc: 'Priya Singh requested medical assistance in Varanasi.', time: '4h ago', unread: false, type: 'info', link: 'INC-411' },
  { id: 'nt-6', title: '⚠️ Active Review: INC-204', desc: 'Theft incident reported by Aisha Khan is pending review.', time: '5h ago', unread: false, type: 'warning', link: 'INC-204' }
];


// === UTILITY FUNCTIONS ===

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getRiskClass(riskLevel) {
  const map = { 'LOW': 'low', 'MEDIUM': 'medium', 'HIGH': 'high' };
  return map[riskLevel] || 'low';
}

function getStatusBadgeClass(status) {
  const map = {
    'Safe': 'badge-safe', 'Monitoring': 'badge-monitoring', 'At Risk': 'badge-at-risk',
    'SOS': 'badge-sos', 'Resolved': 'badge-resolved',
    'ACTIVE': 'badge-active', 'UNDER REVIEW': 'badge-reviewing',
    'RESPONDING': 'badge-responding', 'RESOLVED': 'badge-resolved'
  };
  return map[status] || 'badge-monitoring';
}

function getRiskLabel(riskLevel) {
  const map = { 'LOW': 'LOW — SAFE', 'MEDIUM': 'MEDIUM — CAUTION', 'HIGH': 'HIGH — CRITICAL' };
  return map[riskLevel] || riskLevel;
}

function getScoreColor(score) {
  if (score >= 70) return 'var(--color-safe)';
  if (score >= 40) return 'var(--color-warning)';
  return 'var(--color-danger)';
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ'}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" aria-label="Close notification">&times;</button>
  `;

  container.appendChild(toast);

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => removeToast(toast));

  setTimeout(() => removeToast(toast), 4500);
}

function removeToast(toast) {
  if (toast.classList.contains('removing')) return;
  toast.classList.add('removing');
  setTimeout(() => toast.remove(), 300);
}

function animateCountUp(element, target, duration = 1500) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);
    element.textContent = formatNumber(current);
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) +
    ' · ' + now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function updateClock() {
  const clock = document.getElementById('header-clock');
  if (clock) clock.textContent = getCurrentTime();
}

function getIncidentStatus(incidentId) {
  return incidentStates[incidentId] || null;
}


// === RENDERING FUNCTIONS ===

function renderDashboardStats() {
  const statMap = {
    'stat-total-value': dashboardStats.totalTourists,
    'stat-active-value': dashboardStats.activeTourists,
    'stat-highrisk-value': dashboardStats.highRiskTourists,
    'stat-sos-value': dashboardStats.activeSOS
  };

  Object.entries(statMap).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) animateCountUp(el, value, 1800);
  });
}

function renderSafetyScore() {
  const scoreVal = document.getElementById('score-value');
  const ringProgress = document.getElementById('score-ring-progress');

  if (scoreVal) animateCountUp(scoreVal, dashboardStats.overallSafetyScore, 2000);

  if (ringProgress) {
    const circumference = 2 * Math.PI * 85; // r=85
    const offset = circumference - (dashboardStats.overallSafetyScore / 100) * circumference;
    setTimeout(() => {
      ringProgress.style.strokeDashoffset = offset;
    }, 300);
  }

  // Risk breakdown bars
  const breakdown = dashboardStats.riskBreakdown;
  setTimeout(() => {
    const lowBar = document.getElementById('risk-low-bar');
    const medBar = document.getElementById('risk-medium-bar');
    const highBar = document.getElementById('risk-high-bar');
    const lowPct = document.getElementById('risk-low-percent');
    const medPct = document.getElementById('risk-medium-percent');
    const highPct = document.getElementById('risk-high-percent');

    if (lowBar) lowBar.style.width = breakdown.low + '%';
    if (medBar) medBar.style.width = breakdown.medium + '%';
    if (highBar) highBar.style.width = breakdown.high + '%';
    if (lowPct) lowPct.textContent = breakdown.low + '%';
    if (medPct) medPct.textContent = breakdown.medium + '%';
    if (highPct) highPct.textContent = breakdown.high + '%';
  }, 500);
}

function geoToMapCoords(lat, lng, mapWidth, mapHeight) {
  // India approximate bounds
  const minLng = 68, maxLng = 97;
  const minLat = 8, maxLat = 35;

  const x = ((lng - minLng) / (maxLng - minLng)) * mapWidth;
  const y = ((maxLat - lat) / (maxLat - minLat)) * mapHeight;
  return { x, y };
}

function renderMap() {
  const container = document.getElementById('map-container');
  if (!container) return;

  // Initialize map if not done
  if (!mainMap) {
    mainMap = L.map('map-container', {
      zoomControl: false,
      attributionControl: false
    }).setView([22.0, 78.0], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mainMap);

    // Zoom buttons implementation
    const zoomInBtn = document.getElementById('map-zoom-in');
    const zoomOutBtn = document.getElementById('map-zoom-out');
    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', (e) => {
        e.preventDefault();
        mainMap.zoomIn();
      });
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        mainMap.zoomOut();
      });
    }
  } else {
    // Force a resize calculation
    setTimeout(() => mainMap.invalidateSize(), 50);
  }

  // Clear existing markers
  Object.values(mainMapMarkers).forEach(marker => mainMap.removeLayer(marker));
  mainMapMarkers = {};

  // Draw tourist markers
  mockTourists.forEach(tourist => {
    // Filter map markers matching filter states
    const matchesSearch = !currentFilters.search || 
      tourist.name.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
      tourist.id.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
      tourist.location.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
      tourist.landmark.toLowerCase().includes(currentFilters.search.toLowerCase());

    const matchesRisk = currentFilters.risk === 'All' || tourist.riskLevel === currentFilters.risk;
    const matchesStatus = currentFilters.status === 'All' || tourist.status === currentFilters.status;
    const matchesLocation = currentFilters.location === 'All' || tourist.location === currentFilters.location;

    if (!matchesSearch || !matchesRisk || !matchesStatus || !matchesLocation) {
      return;
    }

    const riskClass = tourist.status === 'SOS' ? 'sos' : getRiskClass(tourist.riskLevel);
    const riskColor = tourist.status === 'SOS' ? '#ff2d55' : (
      tourist.riskLevel === 'HIGH' ? '#ef4444' :
      tourist.riskLevel === 'MEDIUM' ? '#f59e0b' : '#10b981'
    );

    // Custom HTML marker
    const markerHtml = `<div class="map-marker-dot ${riskClass}"></div>`;
    const customIcon = L.divIcon({
      html: markerHtml,
      className: 'custom-leaflet-icon',
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });

    const marker = L.marker([tourist.lat, tourist.lng], { icon: customIcon }).addTo(mainMap);

    const popupContent = `
      <div class="map-marker-tooltip" style="display:block; position:static; transform:none; min-width:180px; padding: 2px;">
        <div class="tooltip-name" style="font-weight: bold; color: var(--text-white); font-size: 0.8rem;">${tourist.name}</div>
        <div class="tooltip-id" style="font-family: var(--font-mono); color: var(--text-muted); font-size: 0.65rem; margin-top: 2px;">${tourist.id} · ${tourist.landmark}</div>
        <div class="tooltip-risk" style="color: ${riskColor}; font-weight:bold; font-size: 0.7rem; margin-top: 4px;">STATUS: ${tourist.status} (${tourist.riskLevel} RISK)</div>
        <div style="margin-top: 6px; font-size: 0.7rem; color: var(--text-secondary);">Safety Index: <strong>${tourist.safetyScore}/100</strong></div>
        <div style="margin-top: 8px; border-top: 1px solid var(--border-subtle); padding-top: 6px;">
          <button class="incident-action-btn" style="width:100%; display:block; text-align:center; padding: 4px; font-size: 0.65rem; cursor: pointer; background: rgba(223, 177, 91, 0.1); border: 1px solid rgba(223, 177, 91, 0.3); color: var(--accent-gold); border-radius: var(--radius-sm);" onclick="handleTouristClick('${tourist.id}')">View Details</button>
        </div>
      </div>
    `;
    marker.bindPopup(popupContent);
    mainMapMarkers[tourist.id] = marker;
  });
}

function renderTourists(tourists) {
  const tbody = document.getElementById('tourist-tbody');
  const emptyState = document.getElementById('table-empty');
  if (!tbody) return;

  if (tourists.length === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.style.display = 'flex';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  tbody.innerHTML = tourists.map(t => {
    const scoreColor = getScoreColor(t.safetyScore);
    const riskClass = getRiskClass(t.riskLevel);
    const statusClass = getStatusBadgeClass(t.status);

    return `
      <tr data-tourist-id="${t.id}" onclick="handleTouristClick('${t.id}')">
        <td><span class="tourist-id">${t.id}</span></td>
        <td><span class="tourist-name">${t.name}</span></td>
        <td>${t.location} <small style="color: var(--text-muted); display:block; font-size: 0.65rem;">${t.landmark}</small></td>
        <td>
          <div class="score-mini">
            <span class="score-mini-value" style="color: ${scoreColor};">${t.safetyScore}</span>
            <div class="score-mini-bar">
              <div class="score-mini-fill" style="width: ${t.safetyScore}%; background: ${scoreColor};"></div>
            </div>
          </div>
        </td>
        <td><span class="badge badge-${riskClass}" aria-label="${getRiskLabel(t.riskLevel)}">${getRiskLabel(t.riskLevel)}</span></td>
        <td><span class="badge ${statusClass}">${t.status}</span></td>
      </tr>
    `;
  }).join('');
}

function handleTouristClick(touristId) {
  // Center map on the tourist marker
  const tourist = mockTourists.find(t => t.id === touristId);
  const marker = mainMapMarkers[touristId];
  if (tourist && marker && mainMap) {
    mainMap.setView([tourist.lat, tourist.lng], 10);
    marker.openPopup();
  }

  // Find an incident for this tourist
  const incident = Object.values(incidentStates).find(i => i.touristId === touristId);
  if (incident) {
    setTimeout(() => openIncidentModal(incident.id), 300);
  }
}

function renderIncidents() {
  const tbody = document.getElementById('incident-tbody');
  if (!tbody) return;

  const incidents = Object.values(incidentStates);

  tbody.innerHTML = incidents.map(inc => {
    const riskClass = getRiskClass(inc.riskLevel);
    const statusClass = getStatusBadgeClass(inc.status);

    return `
      <tr onclick="openIncidentModal('${inc.id}')" style="cursor:pointer;">
        <td><span class="tourist-id" style="color: ${inc.isSOS ? 'var(--color-sos)' : 'var(--accent-cyan)'}">${inc.id}</span></td>
        <td><span class="tourist-name">${inc.touristName}</span><small style="color: var(--text-muted); display:block; font-size:0.65rem;">${inc.touristId}</small></td>
        <td>${inc.type}</td>
        <td>${inc.location}</td>
        <td><span style="font-family: var(--font-mono); font-size:0.75rem;">${inc.time}</span></td>
        <td><span class="badge badge-${riskClass}">${inc.riskLevel}</span></td>
        <td><span class="badge ${statusClass}">${inc.status}</span></td>
        <td><button class="incident-action-btn" onclick="event.stopPropagation(); openIncidentModal('${inc.id}')">View</button></td>
      </tr>
    `;
  }).join('');
}

function renderSOSAlerts() {
  const container = document.getElementById('sos-cards-container');
  const badge = document.getElementById('sos-badge');
  if (!container) return;

  const activeSOSIncidents = Object.values(incidentStates).filter(i => i.isSOS && i.status === 'ACTIVE');

  if (badge) badge.textContent = activeSOSIncidents.length.toString().padStart(2, '0');

  if (activeSOSIncidents.length === 0) {
    container.innerHTML = `
      <div style="padding: 32px; text-align: center; color: var(--text-muted); font-size: 0.85rem; grid-column: 1/-1;">
        <div style="font-size: 2rem; margin-bottom: 8px; opacity: 0.3;">✓</div>
        No active SOS alerts
      </div>
    `;
    return;
  }

  container.innerHTML = activeSOSIncidents.map(inc => `
    <div class="sos-card">
      <div class="sos-card-header">
        <span class="sos-card-id">${inc.id}</span>
        <span class="sos-indicator"></span>
      </div>
      <div class="sos-card-detail"><strong>Tourist:</strong> ${inc.touristName} (${inc.touristId})</div>
      <div class="sos-card-detail"><strong>Location:</strong> ${inc.location}</div>
      <div class="sos-card-detail"><strong>Type:</strong> ${inc.type}</div>
      <div class="sos-card-detail"><strong>Time:</strong> ${inc.time}</div>
      <div class="sos-card-detail"><strong>Status:</strong> <span class="badge badge-sos">WAITING FOR AUTHORITY</span></div>
      <div class="sos-card-actions">
        <a href="sos.html?id=${inc.id}" class="btn btn-danger btn-sm">View SOS →</a>
        <button class="btn btn-outline btn-sm" onclick="openIncidentModal('${inc.id}')">Details</button>
      </div>
    </div>
  `).join('');
}


// === SEARCH AND FILTER FUNCTIONS ===

function searchTourists(query) {
  const q = query.toLowerCase().trim();
  if (!q) return mockTourists;
  return mockTourists.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.id.toLowerCase().includes(q) ||
    t.location.toLowerCase().includes(q) ||
    t.landmark.toLowerCase().includes(q)
  );
}

function filterTourists() {
  let filtered = searchTourists(currentFilters.search);

  if (currentFilters.risk !== 'All') {
    filtered = filtered.filter(t => t.riskLevel === currentFilters.risk);
  }
  if (currentFilters.status !== 'All') {
    filtered = filtered.filter(t => t.status === currentFilters.status);
  }
  if (currentFilters.location !== 'All') {
    filtered = filtered.filter(t => t.location === currentFilters.location);
  }

  renderTourists(filtered);
  renderMap();
}

function setupFilters() {
  const searchInput = document.getElementById('search-input');
  const riskFilter = document.getElementById('filter-risk');
  const statusFilter = document.getElementById('filter-status');
  const locationFilter = document.getElementById('filter-location');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        currentFilters.search = e.target.value;
        filterTourists();
      }, 300);
    });
  }

  if (riskFilter) {
    riskFilter.addEventListener('change', (e) => {
      currentFilters.risk = e.target.value;
      filterTourists();
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      currentFilters.status = e.target.value;
      filterTourists();
    });
  }

  if (locationFilter) {
    locationFilter.addEventListener('change', (e) => {
      currentFilters.location = e.target.value;
      filterTourists();
    });
  }
}


// === MODAL FUNCTIONS ===

function openIncidentModal(incidentId) {
  const incident = incidentStates[incidentId];
  if (!incident) return;

  const tourist = mockTourists.find(t => t.id === incident.touristId);
  const services = mockNearbyServices[tourist ? tourist.location : ''] || {};

  const modal = document.getElementById('incident-modal');
  const body = document.getElementById('modal-body');
  const footer = document.getElementById('modal-footer');
  const title = document.getElementById('modal-title');

  if (!modal || !body || !footer) return;

  title.textContent = `Incident ${incident.id}`;

  body.innerHTML = `
    <div class="modal-detail-section">
      <div class="modal-section-title">Incident Information</div>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">Incident ID</span>
          <span class="detail-value" style="color: ${incident.isSOS ? 'var(--color-sos)' : 'var(--accent-cyan)'}">${incident.id}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Type</span>
          <span class="detail-value">${incident.type}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Status</span>
          <span class="badge ${getStatusBadgeClass(incident.status)}" id="modal-status-badge">${incident.status}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Risk Level</span>
          <span class="badge badge-${getRiskClass(incident.riskLevel)}">${getRiskLabel(incident.riskLevel)}</span>
        </div>
        <div class="detail-item full-width">
          <span class="detail-label">Description</span>
          <p class="detail-description">${incident.description}</p>
        </div>
      </div>
    </div>

    <div class="modal-detail-section">
      <div class="modal-section-title">Tourist Details</div>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">Tourist ID</span>
          <span class="detail-value">${incident.touristId}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Name</span>
          <span class="detail-value">${incident.touristName}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Location</span>
          <span class="detail-value">${incident.location}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Time</span>
          <span class="detail-value">${incident.time}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Safety Score</span>
          <span class="detail-value" style="color: ${getScoreColor(incident.safetyScore)}">${incident.safetyScore} / 100</span>
        </div>
        ${tourist ? `<div class="detail-item">
          <span class="detail-label">Phone</span>
          <span class="detail-value">${tourist.phone}</span>
        </div>` : ''}
      </div>
    </div>

    ${tourist && tourist.emergencyContact ? `
    <div class="modal-detail-section">
      <div class="modal-section-title">Emergency Contact</div>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">Name</span>
          <span class="detail-value">${tourist.emergencyContact.name}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Relationship</span>
          <span class="detail-value">${tourist.emergencyContact.relationship}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Phone</span>
          <span class="detail-value">${tourist.emergencyContact.phone}</span>
        </div>
      </div>
    </div>` : ''}

    ${services.police ? `
    <div class="modal-detail-section">
      <div class="modal-section-title">Nearby Services</div>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">Police Station</span>
          <span class="detail-value">${services.police.name}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Distance</span>
          <span class="detail-value">${services.police.distance}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Hospital</span>
          <span class="detail-value">${services.hospital.name}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Distance</span>
          <span class="detail-value">${services.hospital.distance}</span>
        </div>
      </div>
    </div>` : ''}
  `;

  // Footer actions
  let footerHTML = '';
  const isResolved = incident.status === 'RESOLVED';

  if (incident.isSOS && incident.status !== 'RESOLVED') {
    footerHTML += `<a href="sos.html?id=${incident.id}" class="btn btn-danger">View SOS →</a>`;
  }

  if (incident.status === 'ACTIVE') {
    footerHTML += `<button class="btn btn-primary" onclick="acceptIncident('${incident.id}')">Accept Incident</button>`;
  }

  footerHTML += `<button class="btn btn-warning" onclick="contactTourist('${incident.id}')" ${isResolved ? 'disabled' : ''}>Contact Tourist</button>`;
  footerHTML += `<button class="btn btn-success" onclick="resolveIncident('${incident.id}')" ${isResolved ? 'disabled' : ''}>Mark Resolved</button>`;

  footer.innerHTML = footerHTML;

  modal.classList.add('active');
  document.addEventListener('keydown', handleModalEscape);
}

function closeIncidentModal() {
  const modal = document.getElementById('incident-modal');
  if (modal) modal.classList.remove('active');
  document.removeEventListener('keydown', handleModalEscape);
}

function handleModalEscape(e) {
  if (e.key === 'Escape') closeIncidentModal();
}


// === ACTION FUNCTIONS ===

function acceptIncident(incidentId) {
  const incident = incidentStates[incidentId];
  if (!incident || incident.status !== 'ACTIVE') return;

  incident.status = 'RESPONDING';
  showToast(`Incident ${incidentId} accepted. Status changed to RESPONDING.`, 'success');

  // Update modal if open
  const modalBadge = document.getElementById('modal-status-badge');
  if (modalBadge) {
    modalBadge.className = 'badge badge-responding';
    modalBadge.textContent = 'RESPONDING';
  }

  // Re-render affected sections
  renderIncidents();
  renderSOSAlerts();

  // Refresh modal to update buttons
  closeIncidentModal();
  setTimeout(() => openIncidentModal(incidentId), 200);

  // Persist to session
  saveIncidentStates();
}

function contactTourist(incidentId) {
  const incident = incidentStates[incidentId];
  if (!incident) return;

  showToast(`Contacting tourist ${incident.touristName}...`, 'info');
  setTimeout(() => {
    showToast(`Tourist ${incident.touristName} has been contacted successfully.`, 'success');
  }, 1800);
}

function resolveIncident(incidentId) {
  const incident = incidentStates[incidentId];
  if (!incident || incident.status === 'RESOLVED') return;

  if (!confirm(`Are you sure you want to mark incident ${incidentId} as resolved?`)) return;

  incident.status = 'RESOLVED';
  showToast(`Incident ${incidentId} resolved successfully.`, 'success');

  // Update counts
  const activeSOSCount = Object.values(incidentStates).filter(i => i.isSOS && i.status === 'ACTIVE').length;
  dashboardStats.activeSOS = activeSOSCount;
  const sosValue = document.getElementById('stat-sos-value');
  if (sosValue) sosValue.textContent = activeSOSCount.toString().padStart(2, '0');

  // Re-render
  renderIncidents();
  renderSOSAlerts();

  // Refresh modal
  closeIncidentModal();
  setTimeout(() => openIncidentModal(incidentId), 200);

  saveIncidentStates();
}


// === SOS PAGE FUNCTIONS ===

function initSOSPage() {
  const params = new URLSearchParams(window.location.search);
  const incidentId = params.get('id') || 'SOS-001';

  // Restore states from session
  loadIncidentStates();

  const incident = incidentStates[incidentId];
  if (!incident) {
    showToast('Incident not found. Showing default SOS data.', 'warning');
    return;
  }

  const tourist = mockTourists.find(t => t.id === incident.touristId);
  const services = mockNearbyServices[tourist ? tourist.location : ''] || {};

  // Populate tourist details
  setTextById('sos-tourist-id', incident.touristId);
  setTextById('sos-tourist-name', incident.touristName);
  setTextById('sos-tourist-location', incident.location);
  setTextById('sos-tourist-time', incident.time);
  setTextById('sos-tourist-score', incident.safetyScore + ' / 100');

  const riskEl = document.getElementById('sos-tourist-risk');
  if (riskEl) {
    riskEl.textContent = getRiskLabel(incident.riskLevel);
    riskEl.style.color = incident.riskLevel === 'HIGH' ? 'var(--color-danger)' : 'var(--color-warning)';
  }

  const statusBadge = document.getElementById('sos-tourist-status');
  if (statusBadge) {
    statusBadge.className = `badge ${getStatusBadgeClass(incident.status)}`;
    statusBadge.textContent = incident.status;
  }

  // Incident details
  setTextById('sos-incident-id', incident.id);
  setTextById('sos-incident-type', incident.type);
  setTextById('sos-incident-description', incident.description);

  const statusEl = document.getElementById('sos-incident-status');
  if (statusEl) {
    statusEl.innerHTML = `<span class="badge ${getStatusBadgeClass(incident.status)}">${incident.status}</span>`;
  }

  // Emergency contact
  if (tourist && tourist.emergencyContact) {
    setTextById('sos-contact-name', tourist.emergencyContact.name);
    setTextById('sos-contact-relationship', tourist.emergencyContact.relationship);
    setTextById('sos-contact-phone', tourist.emergencyContact.phone);
  }

  // Police
  if (services.police) {
    setTextById('sos-police-name', services.police.name);
    setTextById('sos-police-distance', services.police.distance);
    setTextById('sos-police-response', services.police.responseTime);
    setTextById('sos-police-status', services.police.status);
  }

  // Hospital
  if (services.hospital) {
    setTextById('sos-hospital-name', services.hospital.name);
    setTextById('sos-hospital-distance', services.hospital.distance);
    setTextById('sos-hospital-emergency', services.hospital.emergency);
  }

  // Render SOS map
  if (tourist) renderSOSMap(tourist, services);

  // Setup action buttons
  setupSOSActions(incidentId);

  // Update UI based on current state
  updateSOSPageState(incident);

  // Start clock
  updateClock();
  setInterval(updateClock, 1000);
}

function setTextById(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function renderSOSMap(tourist, services) {
  const container = document.getElementById('sos-map-container');
  if (!container) return;

  // Initialize sosMap if not done
  if (sosMap) {
    sosMap.remove();
    sosMap = null;
  }

  sosMap = L.map('sos-map-container', {
    zoomControl: true,
    attributionControl: false
  }).setView([tourist.lat, tourist.lng], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(sosMap);

  // Tourist marker (center) - pulsing red SOS marker
  const touristHtml = `<div class="map-marker-dot sos"></div>`;
  const touristIcon = L.divIcon({
    html: touristHtml,
    className: 'custom-leaflet-icon',
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
  L.marker([tourist.lat, tourist.lng], { icon: touristIcon }).addTo(sosMap)
    .bindPopup(`<strong>${tourist.name} (SOS)</strong><br>${tourist.landmark}, ${tourist.location}`).openPopup();

  // Compute offset positions for services
  const policeLat = tourist.lat + 0.003;
  const policeLng = tourist.lng - 0.005;
  const hospitalLat = tourist.lat - 0.004;
  const hospitalLng = tourist.lng + 0.006;

  // Police marker
  const policeHtml = `<div class="map-marker-dot police" style="background:#4a90d9; width:14px; height:14px; border-radius:50%; border:2px solid #fff; box-shadow:0 0 10px rgba(74, 144, 217, 0.5);"></div>`;
  const policeIcon = L.divIcon({
    html: policeHtml,
    className: 'custom-leaflet-icon',
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
  L.marker([policeLat, policeLng], { icon: policeIcon }).addTo(sosMap)
    .bindPopup(`<strong>🛡 ${services.police ? services.police.name : 'Police Station'}</strong><br>Distance: ${services.police ? services.police.distance : ''}`);

  // Hospital marker
  const hospitalHtml = `<div class="map-marker-dot hospital" style="background:#10b981; width:14px; height:14px; border-radius:50%; border:2px solid #fff; box-shadow:0 0 10px rgba(16, 185, 129, 0.5);"></div>`;
  const hospitalIcon = L.divIcon({
    html: hospitalHtml,
    className: 'custom-leaflet-icon',
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
  L.marker([hospitalLat, hospitalLng], { icon: hospitalIcon }).addTo(sosMap)
    .bindPopup(`<strong>🏥 ${services.hospital ? services.hospital.name : 'Hospital'}</strong><br>Emergency: ${services.hospital ? services.hospital.emergency : ''}`);

  // Draw lines from tourist to police & hospital
  L.polyline([[tourist.lat, tourist.lng], [policeLat, policeLng]], {
    color: '#4a90d9',
    dashArray: '5, 5',
    weight: 2
  }).addTo(sosMap);

  L.polyline([[tourist.lat, tourist.lng], [hospitalLat, hospitalLng]], {
    color: '#10b981',
    dashArray: '5, 5',
    weight: 2
  }).addTo(sosMap);
}

function setupSOSActions(incidentId) {
  const acceptBtn = document.getElementById('sos-accept-btn');
  const contactBtn = document.getElementById('sos-contact-btn');
  const resolveBtn = document.getElementById('sos-resolve-btn');

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => sosAcceptIncident(incidentId));
  }
  if (contactBtn) {
    contactBtn.addEventListener('click', () => sosContactTourist(incidentId));
  }
  if (resolveBtn) {
    resolveBtn.addEventListener('click', () => sosResolveIncident(incidentId));
  }
}

function sosAcceptIncident(incidentId) {
  const incident = incidentStates[incidentId];
  if (!incident || (incident.status !== 'ACTIVE')) return;

  incident.status = 'RESPONDING';
  showToast(`Incident ${incidentId} accepted. Status: RESPONDING`, 'success');
  saveIncidentStates();
  updateSOSPageState(incident);
}

function sosContactTourist(incidentId) {
  const incident = incidentStates[incidentId];
  if (!incident) return;

  showToast(`Contacting ${incident.touristName}...`, 'info');
  setTimeout(() => {
    showToast(`${incident.touristName} contacted successfully.`, 'success');
  }, 1800);
}

function sosResolveIncident(incidentId) {
  const incident = incidentStates[incidentId];
  if (!incident || incident.status === 'RESOLVED') return;

  if (!confirm(`Mark incident ${incidentId} as resolved?`)) return;

  incident.status = 'RESOLVED';
  showToast(`Incident ${incidentId} resolved successfully.`, 'success');
  saveIncidentStates();
  updateSOSPageState(incident);
}

function updateSOSPageState(incident) {
  const acceptBtn = document.getElementById('sos-accept-btn');
  const resolveBtn = document.getElementById('sos-resolve-btn');
  const contactBtn = document.getElementById('sos-contact-btn');
  const banner = document.getElementById('emergency-banner');
  const statusBadge = document.getElementById('sos-tourist-status');
  const incidentStatusEl = document.getElementById('sos-incident-status');

  if (statusBadge) {
    statusBadge.className = `badge ${getStatusBadgeClass(incident.status)}`;
    statusBadge.textContent = incident.status;
  }

  if (incidentStatusEl) {
    incidentStatusEl.innerHTML = `<span class="badge ${getStatusBadgeClass(incident.status)}">${incident.status}</span>`;
  }

  if (incident.status === 'RESPONDING') {
    if (acceptBtn) { acceptBtn.disabled = true; acceptBtn.textContent = '✓ Accepted'; }
    if (banner) {
      banner.querySelector('.emergency-text strong').textContent = 'INCIDENT ACCEPTED — RESPONDING';
      banner.querySelector('.emergency-text span').textContent = 'Authority has accepted the incident. Response in progress.';
    }
  }

  if (incident.status === 'RESOLVED') {
    if (acceptBtn) { acceptBtn.disabled = true; acceptBtn.textContent = '✓ Accepted'; }
    if (resolveBtn) { resolveBtn.disabled = true; resolveBtn.textContent = '✓ Resolved'; }
    if (contactBtn) { contactBtn.disabled = true; }
    if (banner) {
      banner.classList.add('resolved');
      banner.querySelector('.emergency-icon').textContent = '✓';
      banner.querySelector('.emergency-text strong').textContent = 'INCIDENT RESOLVED';
      banner.querySelector('.emergency-text strong').style.color = 'var(--color-safe)';
      banner.querySelector('.emergency-text span').textContent = 'This emergency has been resolved. No further action required.';
    }
  }
}


// === PERSISTENCE (sessionStorage for demo) ===

function saveIncidentStates() {
  try {
    sessionStorage.setItem('safetour_incident_states', JSON.stringify(incidentStates));
  } catch (e) { /* ignore */ }
}

function loadIncidentStates() {
  try {
    const saved = sessionStorage.getItem('safetour_incident_states');
    if (saved) {
      incidentStates = JSON.parse(saved);
      return;
    }
  } catch (e) { /* ignore */ }

  // Initialize from mock data
  mockIncidents.forEach(inc => {
    incidentStates[inc.id] = { ...inc };
  });
}


// === SIDEBAR TOGGLE ===

function setupSidebar() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('active');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      if (sidebar) sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
    }
  });
}

function setupMapControls() {
  const zoomIn = document.getElementById('map-zoom-in');
  const zoomOut = document.getElementById('map-zoom-out');
  const container = document.getElementById('map-container');

  if (zoomIn && container) {
    zoomIn.addEventListener('click', () => {
      mapScale = Math.min(mapScale + 0.2, 2);
      container.style.transform = `scale(${mapScale})`;
      container.style.transformOrigin = 'center center';
    });
  }

  if (zoomOut && container) {
    zoomOut.addEventListener('click', () => {
      mapScale = Math.max(mapScale - 0.2, 0.6);
      container.style.transform = `scale(${mapScale})`;
      container.style.transformOrigin = 'center center';
    });
  }
}

function setupModalClose() {
  const closeBtn = document.getElementById('modal-close-btn');
  const overlay = document.getElementById('incident-modal');

  if (closeBtn) closeBtn.addEventListener('click', closeIncidentModal);

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeIncidentModal();
    });
  }
}


// === INITIALIZATION ===

function runIntroAnimation(callback) {
  const intro = document.getElementById('intro-screen');
  const progressFill = document.getElementById('intro-progress-fill');
  const statusText = document.getElementById('intro-status-text');

  if (!intro) {
    if (callback) callback();
    return;
  }

  const statusMessages = [
    'BOOTING SECURE AUTHORITY HUB...',
    'SYNCING GEOFENCE RADAR CHANNELS...',
    'ESTABLISHING ENCRYPTED SAT-LINK...',
    'POLLING MULTI-AGENT THREAT TELEMETRY...',
    'FETCHING ACTIVE SOS EMISSION RADII...',
    'ONLINE. SECURE AUTHORITY ACCESS GRANTED.'
  ];

  let progress = 0;
  let statusIndex = 0;

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 4; // increment randomly
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      if (progressFill) progressFill.style.width = '100%';
      if (statusText) statusText.textContent = statusMessages[statusMessages.length - 1];

      setTimeout(() => {
        intro.classList.add('fade-out');
        if (callback) {
          setTimeout(callback, 300); // render leaflet map after fade starts
        }
      }, 500);
    } else {
      if (progressFill) progressFill.style.width = progress + '%';
      
      const segment = Math.min(
        Math.floor((progress / 100) * (statusMessages.length - 1)),
        statusMessages.length - 2
      );
      if (segment > statusIndex) {
        statusIndex = segment;
        if (statusText) statusText.textContent = statusMessages[statusIndex];
      }
    }
  }, 80);
}

function initDashboard() {
  loadIncidentStates();
  renderDashboardStats();
  renderSafetyScore();
  renderTourists(mockTourists);
  renderIncidents();
  renderSOSAlerts();
  setupFilters();
  setupSidebar();
  setupMapControls();
  setupModalClose();
  setupNotifications();
  setupProfileDropdown();

  // Run intro loader then initialize map & clock
  runIntroAnimation(() => {
    renderMap();
    updateClock();
    setInterval(updateClock, 1000);
  });

  // Handle window resize for map
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (mainMap) mainMap.invalidateSize();
    }, 300);
  });
}

// === NOTIFICATION SYSTEM INTERACTION ===

function setupNotifications() {
  const btn = document.getElementById('notification-btn');
  const dropdown = document.getElementById('notification-dropdown');
  const markAllRead = document.getElementById('mark-all-read-btn');

  if (!btn || !dropdown) return;

  // Render initial items
  renderNotifications();

  // Click to toggle dropdown
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('active');
  });

  // Close when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });

  // Mark all read listener
  if (markAllRead) {
    markAllRead.addEventListener('click', (e) => {
      e.stopPropagation();
      mockNotifications.forEach(n => n.unread = false);
      renderNotifications();
      showToast('All notifications marked as read', 'success');
    });
  }
}

function renderNotifications() {
  const badge = document.getElementById('notification-badge');
  const body = document.getElementById('notification-dropdown-body');
  if (!body) return;

  const unreadCount = mockNotifications.filter(n => n.unread).length;
  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }

  body.innerHTML = mockNotifications.map(n => {
    let iconSvg = '';
    if (n.type === 'sos') iconSvg = '🚨';
    else if (n.type === 'warning') iconSvg = '⚠️';
    else iconSvg = '🏥';

    return `
      <div class="notification-item ${n.unread ? 'unread' : ''}" onclick="handleNotificationClick('${n.link}', '${n.id}')">
        <div class="notification-item-icon ${n.type}">
          ${iconSvg}
        </div>
        <div class="notification-item-content">
          <div class="notification-item-title">${n.title}</div>
          <div class="notification-item-desc">${n.desc}</div>
          <div class="notification-item-time">${n.time}</div>
        </div>
      </div>
    `;
  }).join('');
}

function handleNotificationClick(linkId, notificationId) {
  // Mark clicked notification as read
  const notification = mockNotifications.find(n => n.id === notificationId);
  if (notification) notification.unread = false;
  renderNotifications();

  // Close dropdown
  const dropdown = document.getElementById('notification-dropdown');
  if (dropdown) dropdown.classList.remove('active');

  // Perform route/action
  if (linkId.startsWith('SOS-')) {
    window.location.href = `sos.html?id=${linkId}`;
  } else {
    openIncidentModal(linkId);
  }
}

// Bind to window object for HTML onclick resolution
window.handleNotificationClick = handleNotificationClick;

// === PROFILE LOGOUT INTERACTION ===
function setupProfileDropdown() {
  const btn = document.getElementById('profile-btn');
  const dropdown = document.getElementById('profile-dropdown');
  const logoutBtn = document.getElementById('logout-btn');

  if (!btn || !dropdown) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('safeyatra_auth_role');
      sessionStorage.removeItem('safeyatra_auth_email');
      
      showToast('Logged out successfully. Redirecting...', 'info');
      
      setTimeout(() => {
        window.location.href = '/SafeTour-AI/login';
      }, 1000);
    });
  }
}

function init() {
  const isSOS = document.body.classList.contains('sos-page');

  if (isSOS) {
    initSOSPage();
  } else {
    initDashboard();
  }
}

document.addEventListener('DOMContentLoaded', init);
