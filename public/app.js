/* ========== KENYA COUNTIES DATA ========== */
const COUNTIES = {
    operational: [
        'Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Nyeri','Meru','Embu',
        'Machakos','Garissa','Kakamega','Kisii','Kericho','Uasin Gishu',
        'Wajir','Lamu','Tharaka','Nyandarua','Trans Nzoia','Kajiado',
        'Vihiga','Siaya','Narok','Tana River','Marsabit','Kirinyaga',
        'Baringo','Elgeyo Marakwet','Homa Bay','West Pokot','Turkana',
        'Kwale','Isiolo'
    ],
    opening: ['Makueni','Kiambu','Kitui','Nandi','Laikipia','Migori','Nyamira'],
    planned: ['Bomet','Taita Taveta','Muranga','Bungoma','Busia','Samburu','Mandera']
};

const ALL_COUNTIES = [...COUNTIES.operational, ...COUNTIES.opening, ...COUNTIES.planned].sort();

/* ========== PAGE NAVIGATION ========== */
const pageTitles = {
    dashboard: 'Executive Dashboard',
    'org-structure': 'Organizational Structure',
    'legal-framework': 'Legal Framework & Mandate',
    performance: 'Performance Contract — FY 2025/26',
    cases: 'Integrated Case Management System',
    workflows: 'Workflow Automation',
    registries: 'Digital Registries',
    complaints: 'Advocates Complaints Commission',
    'legal-aid': 'Legal Aid Services — Sheria Mtaani',
    counties: 'County Office Decentralization',
    training: 'Training & Capacity Building',
    sdjhca: 'State Department for Justice, Human Rights & Constitutional Affairs',
    users: 'User Management',
    profile: 'My Profile'
};

// Track which pages have been initialized (lazy rendering)
const pageInitialized = {};

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const page = item.dataset.page;
        if (!page) return; // External links (charter, dev-partners, etc.)
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const pageEl = document.getElementById('page-' + page);
        if (pageEl) pageEl.classList.add('active');
        document.getElementById('pageTitle').textContent = pageTitles[page] || '';
        // Lazy-initialize page content
        if (!pageInitialized[page]) {
            initPage(page);
            pageInitialized[page] = true;
        }
        // close mobile sidebar
        document.getElementById('sidebar').classList.remove('open');
    });
});

/* ========== TIER-BASED NAV VISIBILITY ========== */
function applyTierVisibility() {
    const user = window.__oagUser;
    if (!user) return;
    document.querySelectorAll('[data-max-tier]').forEach(el => {
        const maxTier = parseInt(el.getAttribute('data-max-tier'));
        if (user.tier_level > maxTier) {
            el.style.display = 'none';
        }
    });
}
// Apply on load (wait for auth guard to set __oagUser)
setTimeout(applyTierVisibility, 500);

document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});

// Sidebar avatar → navigate to profile page
document.getElementById('sidebar-user-link').addEventListener('click', () => {
    const profileNav = document.querySelector('[data-page="profile"]');
    if (profileNav) profileNav.click();
});

/* ========== MODALS ========== */
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

/* ========== POPULATE COUNTY DROPDOWNS ========== */
function populateCountySelect(selectEl) {
    ALL_COUNTIES.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c; opt.textContent = c;
        selectEl.appendChild(opt);
    });
}
document.querySelectorAll('#caseCountyFilter, #caseModalCounty, #aidModalCounty').forEach(populateCountySelect);

/* ========== SAMPLE DATA GENERATORS ========== */
const caseTypes = ['Civil Litigation','Government Transactions','International Law','Constitutional Petition','Arbitration','Legal Advisory'];
const statuses = ['Open','In Progress','Under Review','Resolved','Closed'];
const priorities = ['Critical','High','Medium','Low'];
const counselNames = [
    'Amina Wanjiku','Brian Ochieng','Catherine Njeri','David Kiprop','Esther Akinyi',
    'Francis Mutua','Grace Wambui','Hassan Abdi','Irene Chebet','James Otieno',
    'Karen Muthoni','Linus Barasa','Mary Auma','Nelson Kimani','Olive Nyambura'
];

function randItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function padNum(n, len) { return String(n).padStart(len, '0'); }

function genCases(n) {
    const cases = [];
    for (let i = 0; i < n; i++) {
        const yr = randItem([2024, 2025, 2026]);
        cases.push({
            caseNo: `OAG/${yr}/${padNum(randInt(1, 9999), 4)}`,
            title: randItem([
                'Republic v. Contractor Ltd','Land Dispute - Parcel No. ','Treaty Review - ','Constitutional Petition No. ',
                'Contract Clearance - Ministry of ','Advisory Opinion - ','Arbitration - Infrastructure ','Succession Cause No. '
            ]) + randInt(100, 999),
            type: randItem(caseTypes),
            county: randItem(ALL_COUNTIES),
            priority: randItem(priorities),
            status: randItem(statuses),
            counsel: randItem(counselNames),
            filed: `${yr}-${padNum(randInt(1,12),2)}-${padNum(randInt(1,28),2)}`
        });
    }
    return cases;
}

function statusBadge(s) {
    const map = { Open:'blue', 'In Progress':'orange', 'Under Review':'purple', Resolved:'green', Closed:'gray' };
    return `<span class="badge badge-${map[s] || 'gray'}">${s}</span>`;
}
function priorityBadge(p) {
    const map = { Critical:'red', High:'orange', Medium:'blue', Low:'green' };
    return `<span class="badge badge-${map[p] || 'gray'}">${p}</span>`;
}

/* ========== CASES TABLE ========== */
const casesData = genCases(40);
function renderCases(data) {
    const tbody = document.getElementById('casesTableBody');
    tbody.innerHTML = data.map(c => `<tr>
        <td><strong>${c.caseNo}</strong></td><td>${c.title}</td><td>${c.type}</td>
        <td>${c.county}</td><td>${priorityBadge(c.priority)}</td><td>${statusBadge(c.status)}</td>
        <td>${c.counsel}</td><td>${c.filed}</td>
        <td><button class="btn btn-sm btn-primary">View</button></td>
    </tr>`).join('');
}
renderCases(casesData);

// Case filters
['caseTypeFilter','caseStatusFilter','casePriorityFilter','caseCountyFilter','caseSearch'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
        const type = document.getElementById('caseTypeFilter').value;
        const status = document.getElementById('caseStatusFilter').value;
        const priority = document.getElementById('casePriorityFilter').value;
        const county = document.getElementById('caseCountyFilter').value;
        const search = document.getElementById('caseSearch').value.toLowerCase();
        const filtered = casesData.filter(c =>
            (!type || c.type === type) && (!status || c.status === status) &&
            (!priority || c.priority === priority) && (!county || c.county === county) &&
            (!search || c.caseNo.toLowerCase().includes(search) || c.title.toLowerCase().includes(search))
        );
        renderCases(filtered);
    });
});

/* ========== LEGAL AID TABLE ========== */
const aidCategories = ['Land Disputes','Probate & Administration','Children in Conflict with Law','Family Law','Employment Disputes','Criminal Defense'];
const aidData = Array.from({length: 15}, (_, i) => ({
    id: `LA/${2025}/${padNum(i + 1, 4)}`,
    name: randItem(['John Kamau','Alice Wanjiru','Peter Odhiambo','Rose Cherop','Samuel Maina','Faith Njoki','David Omondi','Grace Achieng']),
    county: randItem(ALL_COUNTIES),
    category: randItem(aidCategories),
    status: randItem(['Active','Resolved','Referred']),
    counsel: randItem(counselNames),
    date: `2025-${padNum(randInt(1,12),2)}-${padNum(randInt(1,28),2)}`
}));
document.getElementById('legalAidTableBody').innerHTML = aidData.map(a => `<tr>
    <td>${a.id}</td><td>${a.name}</td><td>${a.county}</td><td>${a.category}</td>
    <td>${statusBadge(a.status === 'Active' ? 'In Progress' : a.status === 'Resolved' ? 'Resolved' : 'Open')}</td>
    <td>${a.counsel}</td><td>${a.date}</td>
</tr>`).join('');

/* ========== TRAINING TABLE ========== */
const trainingData = [
    { program:'Human Rights & Rule of Law', domain:'Human Rights', duration:'5 days', enrolled:85, completed:72, status:'Active' },
    { program:'AI Governance for Legal Officers', domain:'AI Governance', duration:'3 days', enrolled:60, completed:45, status:'Active' },
    { program:'ADR & Mediation Certification', domain:'ADR & Mediation', duration:'10 days', enrolled:40, completed:40, status:'Completed' },
    { program:'Legislative Drafting Workshop', domain:'Legislative Drafting', duration:'4 days', enrolled:55, completed:30, status:'Active' },
    { program:'Cyber Law & Digital Evidence', domain:'Cyber Law', duration:'3 days', enrolled:35, completed:35, status:'Completed' },
    { program:'Anti-Corruption Frameworks', domain:'Anti-Corruption', duration:'2 days', enrolled:90, completed:90, status:'Completed' },
    { program:'International Treaty Negotiation', domain:'International Law', duration:'5 days', enrolled:25, completed:10, status:'Active' },
    { program:'Ethics & Professional Conduct', domain:'Ethics', duration:'1 day', enrolled:120, completed:101, status:'Active' },
];
document.getElementById('trainingTableBody').innerHTML = trainingData.map(t => `<tr>
    <td><strong>${t.program}</strong></td><td>${t.domain}</td><td>${t.duration}</td>
    <td>${t.enrolled}</td><td>${t.completed}</td>
    <td>${statusBadge(t.status === 'Active' ? 'In Progress' : 'Resolved')}</td>
</tr>`).join('');

/* ========== WORKFLOW TABLE ========== */
const wfTypes = ['Contract Clearance','Legal Opinion','Treaty Review','Legislative Draft','Marriage Certificate','Society Registration','Estate Administration'];
const wfSteps = ['Submitted','Under Review','Legal Clearance','SG Approval','Completed'];
const workflowData = Array.from({length: 12}, (_, i) => ({
    id: `WF/${2026}/${padNum(i + 1, 4)}`,
    type: randItem(wfTypes),
    requester: randItem(['Ministry of Health','Ministry of Finance','KEMSA','KRA','Ministry of Education','Ministry of Transport','ODPP','DCI']),
    step: randItem(wfSteps.slice(0, 4)),
    assigned: randItem(counselNames),
    days: randInt(1, 21),
    status: randItem(['Pending','In Progress','Awaiting Approval'])
}));
document.getElementById('workflowTableBody').innerHTML = workflowData.map(w => `<tr>
    <td><strong>${w.id}</strong></td><td>${w.type}</td><td>${w.requester}</td>
    <td>${w.step}</td><td>${w.assigned}</td><td>${w.days}</td>
    <td>${statusBadge(w.status === 'Pending' ? 'Open' : w.status === 'In Progress' ? 'In Progress' : 'Under Review')}</td>
    <td><button class="btn btn-sm btn-primary">Advance</button></td>
</tr>`).join('');

/* ========== PERFORMANCE TABLE (legacy — now API-driven via initPerformance) ========== */
const departments = ['Civil Litigation','Government Transactions','International Law','Legislative Drafting','Legal Advisory','Registrar General'];
const perfBody = document.getElementById('performanceTableBody');
if (perfBody) {
    perfBody.innerHTML = counselNames.slice(0, 10).map(name => {
        const cases = randInt(15, 80);
        const rate = randInt(55, 95);
        const cpd = randInt(10, 60);
        const rating = rate >= 80 ? 'Excellent' : rate >= 65 ? 'Good' : 'Needs Improvement';
        return `<tr>
            <td><strong>${name}</strong></td><td>${randItem(departments)}</td>
            <td>${cases}</td><td>${rate}%</td><td>${cpd} hrs</td>
            <td><span class="badge badge-${rate >= 80 ? 'green' : rate >= 65 ? 'blue' : 'orange'}">${rating}</span></td>
        </tr>`;
    }).join('');
}

/* ========== COUNTY GRID ========== */
const countyGrid = document.getElementById('countyGrid');
COUNTIES.operational.forEach(c => {
    countyGrid.innerHTML += `<div class="county-card operational">${c}<br><small>Operational</small></div>`;
});
COUNTIES.opening.forEach(c => {
    countyGrid.innerHTML += `<div class="county-card opening">${c}<br><small>Opening 2025</small></div>`;
});
COUNTIES.planned.forEach(c => {
    countyGrid.innerHTML += `<div class="county-card planned">${c}<br><small>Planned</small></div>`;
});

/* ========== CHARTS ========== */
const chartColors = {
    green: '#22c55e', blue: '#3b82f6', orange: '#f59e0b',
    red: '#c8102e', purple: '#8b5cf6', teal: '#14b8a6',
    primary: '#1a5632', gold: '#d4a017'
};

// Dashboard - Case Resolution Trend
new Chart(document.getElementById('chartCasesTrend'), {
    type: 'line',
    data: {
        labels: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026'],
        datasets: [
            { label: 'Cases Filed', data: [320,345,290,380,410,390,425,460,480], borderColor: chartColors.blue, backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.3 },
            { label: 'Cases Resolved', data: [280,300,310,340,370,385,400,420,445], borderColor: chartColors.green, backgroundColor: 'rgba(34,197,94,0.1)', fill: true, tension: 0.3 }
        ]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: false } } }
});

// Dashboard - Turnaround
new Chart(document.getElementById('chartTurnaround'), {
    type: 'bar',
    data: {
        labels: ['Contract Clearance','Legal Opinion','Marriage Cert','Society Reg','Estate Admin','Business Reg'],
        datasets: [
            { label: 'Current (days)', data: [12, 8, 3, 7, 14, 2], backgroundColor: chartColors.orange },
            { label: 'Target (days)', data: [5, 3, 1, 3, 6, 1], backgroundColor: chartColors.green }
        ]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
});

// Dashboard - County Coverage
new Chart(document.getElementById('chartCountyCoverage'), {
    type: 'doughnut',
    data: {
        labels: ['Operational (33)', 'Opening 2025 (7)', 'Planned (7)'],
        datasets: [{ data: [33, 7, 7], backgroundColor: [chartColors.green, chartColors.orange, chartColors.red] }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
});

// Legal Aid - Category
new Chart(document.getElementById('chartLegalAidCategory'), {
    type: 'doughnut',
    data: {
        labels: aidCategories,
        datasets: [{ data: [28, 22, 15, 18, 10, 7], backgroundColor: [chartColors.green, chartColors.blue, chartColors.orange, chartColors.purple, chartColors.teal, chartColors.red] }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
});

// Legal Aid - Monthly
new Chart(document.getElementById('chartLegalAidMonthly'), {
    type: 'bar',
    data: {
        labels: ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'],
        datasets: [{ label: 'Beneficiaries', data: [820,950,1100,1250,1180,900,1050,1200,1380,1420,1500,1350], backgroundColor: chartColors.primary }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
});

// County Status
new Chart(document.getElementById('chartCountyStatus'), {
    type: 'bar',
    data: {
        labels: ['Operational','Opening 2025','Planned'],
        datasets: [{ label: 'Counties', data: [33, 7, 7], backgroundColor: [chartColors.green, chartColors.orange, chartColors.red] }]
    },
    options: { responsive: true, indexAxis: 'y', plugins: { legend: { display: false } } }
});

// Training Domain
new Chart(document.getElementById('chartTrainingDomain'), {
    type: 'polarArea',
    data: {
        labels: ['Human Rights','AI Governance','ADR','Legislative Drafting','Cyber Law','Anti-Corruption','International Law','Ethics'],
        datasets: [{ data: [85, 60, 40, 55, 35, 90, 25, 120], backgroundColor: [
            'rgba(26,86,50,0.7)','rgba(59,130,246,0.7)','rgba(245,158,11,0.7)','rgba(139,92,246,0.7)',
            'rgba(200,16,46,0.7)','rgba(34,197,94,0.7)','rgba(20,184,166,0.7)','rgba(212,160,23,0.7)'
        ] }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
});

// CPD Hours
new Chart(document.getElementById('chartCPDHours'), {
    type: 'bar',
    data: {
        labels: ['Civil Litigation','Govt Transactions','International Law','Legislative Drafting','Legal Advisory','Registrar General'],
        datasets: [
            { label: 'CPD Hours Achieved', data: [42, 38, 50, 35, 44, 30], backgroundColor: chartColors.primary },
            { label: 'Target (50 hrs)', data: [50, 50, 50, 50, 50, 50], backgroundColor: 'rgba(229,231,235,0.8)' }
        ]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
});

// Registrations
new Chart(document.getElementById('chartRegistrations'), {
    type: 'line',
    data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [
            { label: 'Business', data: [2800,3100,3400,3200,3500,3800,4000,4200,3900,4100,4300,4500], borderColor: chartColors.green, tension: 0.3 },
            { label: 'Marriage', data: [1200,1100,1400,1350,1500,1300,1250,1400,1450,1600,1550,1700], borderColor: chartColors.blue, tension: 0.3 },
            { label: 'Society', data: [200,180,220,250,230,210,240,260,280,270,300,290], borderColor: chartColors.orange, tension: 0.3 }
        ]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
});

// Complaints
new Chart(document.getElementById('chartComplaints'), {
    type: 'bar',
    data: {
        labels: ['Withholding Funds','Failure to Account','Failure to Render Services','Failure to Inform','Overcharging','Other'],
        datasets: [
            { label: 'FY 2023/24', data: [141, 47, 17, 14, 3, 7], backgroundColor: chartColors.blue },
            { label: 'FY 2024/25', data: [220, 60, 26, 20, 3, 7], backgroundColor: chartColors.red }
        ]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
});

// Recovery
new Chart(document.getElementById('chartRecovery'), {
    type: 'line',
    data: {
        labels: ['FY 2022/23','FY 2023/24','FY 2024/25'],
        datasets: [{ label: 'Amount Recovered (KSh M)', data: [38, 52, 65.5], borderColor: chartColors.gold, backgroundColor: 'rgba(212,160,23,0.15)', fill: true, tension: 0.3, pointRadius: 6 }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
});

/* ========== LAZY PAGE INITIALIZATION ========== */
function initPage(page) {
    switch(page) {
        case 'org-structure': renderOrgStructure(); break;
        case 'legal-framework': renderLegalFramework(); break;
        case 'sdjhca': renderSDJHCA(); break;
        case 'performance': renderPerformanceContract(); break;
        case 'users': renderUserManagement(); break;
        case 'profile': renderProfile(); break;
    }
}

/* ========== ORG STRUCTURE PAGE ========== */
function renderOrgStructure() {
    if (!window.OAG) return;
    const container = document.getElementById('org-chart-container');
    const org = OAG.ORG;

    container.innerHTML = `
        <div class="org-tiers">
            <!-- Executive Office -->
            <div class="org-tier" style="border-left:4px solid ${org.EXECUTIVE.color}">
                <h3 style="color:${org.EXECUTIVE.color}">${org.EXECUTIVE.name}</h3>
                <p class="org-head">${org.EXECUTIVE.head.title}: ${org.EXECUTIVE.head.name}</p>
                <div class="dept-grid">
                    ${org.EXECUTIVE.units.map(u => `
                        <div class="dept-card" style="border-top:3px solid ${org.EXECUTIVE.color}">
                            <strong>${u.name}</strong><br><small>${u.head}</small>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- State Law Office -->
            <div class="org-tier" style="border-left:4px solid ${org.SLO.color}">
                <h3 style="color:${org.SLO.color}">${org.SLO.name}</h3>
                <p class="org-head">${org.SLO.head.title}: ${org.SLO.head.name}</p>
                <h4>Legal Divisions</h4>
                <div class="dept-grid">
                    ${org.SLO.divisions.map(d => `
                        <div class="dept-card" style="border-top:3px solid ${org.SLO.color}">
                            <strong>${d.name}</strong><br><small>${d.head}</small>
                        </div>
                    `).join('')}
                </div>
                <h4>Support Departments</h4>
                <div class="dept-grid">
                    ${org.SLO.support.map(d => `
                        <div class="dept-card dept-card-support">
                            <strong>${d.name}</strong><br><small>${d.head}</small>
                        </div>
                    `).join('')}
                </div>
                <h4>Semi-Autonomous Agencies (SAGAs)</h4>
                <div class="dept-grid">
                    ${org.SLO.sagas.map(s => `
                        <div class="dept-card dept-card-saga">
                            <strong>${s.short}</strong> — ${s.name}<br><small>${s.head}</small>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- SDJHCA -->
            <div class="org-tier" style="border-left:4px solid ${org.SDJHCA.color}">
                <h3 style="color:${org.SDJHCA.color}">${org.SDJHCA.name}</h3>
                <p class="org-head">${org.SDJHCA.head.title}: ${org.SDJHCA.head.name}</p>
                <h4>Directorates</h4>
                <div class="dept-grid">
                    ${org.SDJHCA.directorates.map(d => `
                        <div class="dept-card" style="border-top:3px solid ${org.SDJHCA.color}">
                            <strong>${d.name}</strong><br><small>${d.head}</small>
                            <p class="dept-focus">${d.focus}</p>
                        </div>
                    `).join('')}
                </div>
                <h4>Agencies</h4>
                <div class="dept-grid">
                    ${org.SDJHCA.agencies.map(a => `
                        <div class="dept-card dept-card-saga">
                            <strong>${a.short}</strong> — ${a.name}<br><small>${a.head}</small>
                            <p class="dept-focus">${a.mandate}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

/* ========== LEGAL FRAMEWORK PAGE ========== */
function renderLegalFramework() {
    if (!window.OAG) return;
    const legal = OAG.LEGAL;

    // Articles
    document.getElementById('legal-articles').innerHTML = legal.ARTICLES.map(a => `
        <div class="legal-article-card">
            <div class="article-badge">Art. ${a.article}</div>
            <div><strong>${a.title}</strong><p>${a.text}</p></div>
        </div>
    `).join('');

    // Key Functions
    document.getElementById('key-functions').innerHTML = OAG.KEY_FUNCTIONS.map(f => `
        <div class="function-card">
            <div class="function-icon">${f.icon}</div>
            <strong>${f.name}</strong>
            <p>${f.desc}</p>
        </div>
    `).join('');

    // Statutes
    document.getElementById('statutes-body').innerHTML = legal.STATUTES.map(s => `
        <tr><td><strong>${s.name}</strong></td><td>${s.cap}</td><td>${s.purpose}</td></tr>
    `).join('');

    // Timeline
    document.getElementById('legal-timeline').innerHTML = legal.TIMELINE.map(t => `
        <div class="timeline-item timeline-${t.type}">
            <div class="timeline-year">${t.year}</div>
            <div class="timeline-event">${t.event}</div>
        </div>
    `).join('');
}

/* ========== SDJHCA PAGE ========== */
function renderSDJHCA() {
    if (!window.OAG) return;
    const sdjhca = OAG.ORG.SDJHCA;

    document.getElementById('sdjhca-directorates').innerHTML = sdjhca.directorates.map(d => `
        <div class="dept-card" style="border-top:3px solid ${sdjhca.color}">
            <strong>${d.name}</strong><br><small>${d.head}</small>
            <p class="dept-focus">${d.focus}</p>
        </div>
    `).join('');

    document.getElementById('sdjhca-agencies').innerHTML = sdjhca.agencies.map(a => `
        <div class="dept-card dept-card-saga">
            <strong>${a.short}</strong> — ${a.name}<br><small>${a.head}</small>
            <p class="dept-focus">${a.mandate}</p>
        </div>
    `).join('');
}

/* ========== PERFORMANCE CONTRACT PAGE (API-driven) ========== */
function renderPerformanceContract() {
    fetch('/api/performance/summary')
        .then(r => r.json())
        .then(data => {
            document.getElementById('pc-overall-score').textContent = data.overall_score + '%';
            document.getElementById('pc-indicator-count').textContent =
                data.categories.reduce((s, c) => s + parseInt(c.total_indicators), 0);
        });

    fetch('/api/performance/indicators')
        .then(r => r.json())
        .then(data => {
            // Group by category
            const groups = {};
            data.indicators.forEach(ind => {
                const key = ind.category_code;
                if (!groups[key]) groups[key] = { name: ind.category_name, code: key, indicators: [] };
                groups[key].indicators.push(ind);
            });

            const container = document.getElementById('pc-categories-container');
            container.innerHTML = Object.values(groups).map(cat => `
                <div class="pc-category">
                    <div class="pc-category-header" onclick="this.parentElement.classList.toggle('open')">
                        <span class="pc-cat-code">${cat.code}</span>
                        <span class="pc-cat-name">${cat.name}</span>
                        <span class="pc-cat-count">${cat.indicators.length} indicator${cat.indicators.length !== 1 ? 's' : ''}</span>
                        <span class="pc-cat-arrow">&#9660;</span>
                    </div>
                    <div class="pc-category-body">
                        <table class="data-table pc-table">
                            <thead><tr><th>Code</th><th>Indicator</th><th>Target</th><th>Status</th><th>Weight</th></tr></thead>
                            <tbody>
                                ${cat.indicators.map(ind => `
                                    <tr>
                                        <td><code>${ind.indicator_code}</code></td>
                                        <td>${ind.name}</td>
                                        <td>${ind.target_value} ${ind.unit_of_measure || ''}</td>
                                        <td>${statusBadge(ind.status === 'in_progress' ? 'In Progress' :
                                            ind.status === 'completed' ? 'Resolved' :
                                            ind.status === 'overdue' ? 'Open' : 'Under Review')}</td>
                                        <td>${ind.weight}%</td>
                                    </tr>
                                    ${ind.sub_indicators && ind.sub_indicators.length ? ind.sub_indicators.map(sub => `
                                        <tr class="pc-sub-row">
                                            <td></td>
                                            <td class="pc-sub-desc">${sub.description}</td>
                                            <td>${sub.target_value} ${sub.unit_of_measure || ''}</td>
                                            <td></td>
                                            <td>${sub.weight_pct ? sub.weight_pct + '%' : ''}</td>
                                        </tr>
                                    `).join('') : ''}
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `).join('');
        })
        .catch(() => {
            document.getElementById('pc-categories-container').innerHTML =
                '<p class="error-text">Failed to load performance data. Please try again.</p>';
        });
}

/* ========== USER MANAGEMENT PAGE ========== */
function renderUserManagement() {
    loadUsers();

    // Search/filter handlers
    ['userTierFilter', 'userStatusFilter'].forEach(id => {
        document.getElementById(id).addEventListener('change', loadUsers);
    });
    let searchTimeout;
    document.getElementById('userSearch').addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(loadUsers, 300);
    });
}

function loadUsers() {
    const tier = document.getElementById('userTierFilter').value;
    const active = document.getElementById('userStatusFilter').value;
    const search = document.getElementById('userSearch').value;

    let url = '/api/users?';
    if (tier) url += 'tier_level=' + tier + '&';
    if (active) url += 'is_active=' + active + '&';
    if (search) url += 'search=' + encodeURIComponent(search) + '&';

    fetch(url)
        .then(r => r.json())
        .then(data => {
            const tbody = document.getElementById('usersTableBody');
            if (!data.users || data.users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#6b7280">No users found</td></tr>';
                return;
            }
            tbody.innerHTML = data.users.map(u => `<tr>
                <td><code>${u.staff_id}</code></td>
                <td><strong>${u.full_name}</strong></td>
                <td>${u.title || '-'}</td>
                <td>${u.department_short || u.department_name || '-'}</td>
                <td><span class="badge badge-${u.tier_level <= 2 ? 'green' : u.tier_level <= 4 ? 'blue' : u.tier_level <= 6 ? 'orange' : 'gray'}">Tier ${u.tier_level}</span></td>
                <td>${u.is_active ? '<span class="badge badge-green">Active</span>' : '<span class="badge badge-gray">Inactive</span>'}</td>
                <td><button class="btn btn-sm btn-primary" onclick="alert('Edit user: ${u.staff_id}')">Edit</button></td>
            </tr>`).join('');
        })
        .catch(() => {
            document.getElementById('usersTableBody').innerHTML =
                '<tr><td colspan="7" class="error-text">Failed to load users</td></tr>';
        });
}

/* ========== USER PROFILE PAGE ========== */
function renderProfile() {
    // Fetch profile data, activity, and sessions in parallel
    Promise.all([
        fetch('/api/profile/me').then(r => r.json()),
        fetch('/api/profile/activity').then(r => r.json()),
        fetch('/api/profile/sessions').then(r => r.json())
    ]).then(([profileData, activityData, sessionData]) => {
        const u = profileData.user;
        if (!u) return;

        // Avatar initials
        const initials = (u.full_name || '').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
        document.getElementById('profile-avatar').textContent = initials || '--';

        // Identity header
        document.getElementById('profile-name').textContent = u.full_name;
        document.getElementById('profile-title').textContent = u.title || '';
        document.getElementById('profile-staff-id').textContent = u.staff_id;
        document.getElementById('profile-department').textContent = u.department_name || 'Unassigned';

        // Tier badge in header
        const tierBadge = document.getElementById('profile-tier-badge');
        tierBadge.textContent = `Tier ${u.tier_level} — ${u.tier_name || ''}`;
        tierBadge.setAttribute('data-tier', u.tier_level);

        // Contact info
        document.getElementById('profile-email').value = u.email || '';
        document.getElementById('profile-staff-id-display').textContent = u.staff_id;
        document.getElementById('profile-created').textContent = formatDate(u.created_at);
        document.getElementById('profile-updated').textContent = formatDate(u.updated_at);

        // Access & permissions card
        const tierDetail = document.getElementById('profile-tier-detail');
        tierDetail.textContent = `Tier ${u.tier_level} — ${u.tier_name || ''}`;
        tierDetail.setAttribute('data-tier', u.tier_level);
        document.getElementById('profile-tier-desc').textContent = u.tier_description || '';
        document.getElementById('profile-dept-full').textContent = u.department_name || 'Unassigned';
        document.getElementById('profile-dept-tier').textContent = u.department_tier || '';
        document.getElementById('profile-status').textContent = u.is_active ? 'Active' : 'Inactive';
        document.getElementById('profile-status').className = u.is_active ? 'badge badge-green' : 'badge badge-red';

        // Render activity
        renderProfileActivity(activityData.activities || []);

        // Render sessions
        renderProfileSessions(sessionData.sessions || []);

        // Wire up email editing
        wireEmailEdit();

        // Wire up password change
        wirePasswordChange();

    }).catch(err => {
        console.error('Profile load error:', err);
        document.getElementById('profile-name').textContent = 'Failed to load profile';
    });
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatTimeAgo(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return Math.floor(diff / 60) + ' min ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
    return formatDate(dateStr);
}

function renderProfileActivity(activities) {
    const container = document.getElementById('profile-activity');
    if (!activities.length) {
        container.innerHTML = '<p class="profile-field-note">No recent activity</p>';
        return;
    }
    container.innerHTML = activities.slice(0, 15).map(a => `
        <div class="activity-item">
            <div>
                <div class="activity-action">${formatAction(a.action)}</div>
                ${a.details ? `<div class="activity-detail">${a.details}</div>` : ''}
            </div>
            <div class="activity-time">${formatTimeAgo(a.created_at)}</div>
        </div>
    `).join('');
}

function formatAction(action) {
    const map = {
        login: 'Signed in',
        logout: 'Signed out',
        update_email: 'Updated email',
        change_password: 'Changed password',
        revoke_session: 'Revoked session',
        create_user: 'Created user',
        update_user: 'Updated user',
        deactivate_user: 'Deactivated user'
    };
    return map[action] || action.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function renderProfileSessions(sessions) {
    const tbody = document.getElementById('sessions-body');
    if (!sessions.length) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#6b7280">No active sessions</td></tr>';
        return;
    }
    tbody.innerHTML = sessions.map(s => `<tr>
        <td>${s.is_current ? '<span class="badge-current">Current Session</span>' : `Session ...${s.sid.substring(s.sid.length - 8)}`}</td>
        <td>${formatDate(s.expires)}</td>
        <td>${s.is_current ? '<span class="badge badge-green">Active</span>' : '<span class="badge badge-blue">Active</span>'}</td>
        <td>${s.is_current ? '<span style="color:#6b7280;font-size:0.82rem">Current</span>' :
            `<button class="btn-revoke" onclick="revokeSession('${s.sid}')">Revoke</button>`}</td>
    </tr>`).join('');
}

function wireEmailEdit() {
    const emailInput = document.getElementById('profile-email');
    const btnEdit = document.getElementById('btn-edit-email');
    const btnSave = document.getElementById('btn-save-email');
    const btnCancel = document.getElementById('btn-cancel-email');
    const actions = document.getElementById('email-actions');
    const status = document.getElementById('email-status');
    let originalEmail = emailInput.value;

    btnEdit.addEventListener('click', () => {
        emailInput.disabled = false;
        emailInput.focus();
        actions.style.display = 'flex';
        btnEdit.style.display = 'none';
        status.textContent = '';
    });

    btnCancel.addEventListener('click', () => {
        emailInput.value = originalEmail;
        emailInput.disabled = true;
        actions.style.display = 'none';
        btnEdit.style.display = '';
        status.textContent = '';
    });

    btnSave.addEventListener('click', () => {
        const newEmail = emailInput.value.trim();
        if (!newEmail) { status.textContent = 'Email cannot be empty'; status.className = 'profile-field-note error'; return; }

        btnSave.disabled = true;
        btnSave.textContent = 'Saving...';

        fetch('/api/profile/email', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: newEmail })
        })
        .then(r => r.json().then(data => ({ ok: r.ok, data })))
        .then(({ ok, data }) => {
            if (ok) {
                originalEmail = data.email;
                emailInput.value = data.email;
                emailInput.disabled = true;
                actions.style.display = 'none';
                btnEdit.style.display = '';
                status.textContent = 'Email updated successfully';
                status.className = 'profile-field-note success';
            } else {
                status.textContent = data.error || 'Failed to update email';
                status.className = 'profile-field-note error';
            }
        })
        .catch(() => {
            status.textContent = 'Network error — please try again';
            status.className = 'profile-field-note error';
        })
        .finally(() => {
            btnSave.disabled = false;
            btnSave.textContent = 'Save';
        });
    });
}

function wirePasswordChange() {
    const form = document.getElementById('password-form');
    const status = document.getElementById('pw-status');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const current = document.getElementById('pw-current').value;
        const newPw = document.getElementById('pw-new').value;
        const confirm = document.getElementById('pw-confirm').value;

        if (newPw !== confirm) {
            status.textContent = 'New passwords do not match';
            status.className = 'profile-field-note error';
            return;
        }
        if (newPw.length < 6) {
            status.textContent = 'Password must be at least 6 characters';
            status.className = 'profile-field-note error';
            return;
        }

        const btn = document.getElementById('btn-change-pw');
        btn.disabled = true;
        btn.textContent = 'Changing...';

        fetch('/api/profile/password', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ current_password: current, new_password: newPw })
        })
        .then(r => r.json().then(data => ({ ok: r.ok, data })))
        .then(({ ok, data }) => {
            if (ok) {
                status.textContent = 'Password changed. Other sessions signed out.';
                status.className = 'profile-field-note success';
                form.reset();
                // Refresh sessions table
                fetch('/api/profile/sessions').then(r => r.json()).then(d => renderProfileSessions(d.sessions || []));
            } else {
                status.textContent = data.error || 'Failed to change password';
                status.className = 'profile-field-note error';
            }
        })
        .catch(() => {
            status.textContent = 'Network error — please try again';
            status.className = 'profile-field-note error';
        })
        .finally(() => {
            btn.disabled = false;
            btn.textContent = 'Change Password';
        });
    });
}

// Global: revoke session from table button
function revokeSession(sid) {
    if (!confirm('Revoke this session? The device will be signed out.')) return;

    fetch('/api/profile/sessions/' + encodeURIComponent(sid), { method: 'DELETE' })
        .then(r => r.json().then(data => ({ ok: r.ok, data })))
        .then(({ ok, data }) => {
            if (ok) {
                // Re-fetch sessions
                fetch('/api/profile/sessions').then(r => r.json()).then(d => renderProfileSessions(d.sessions || []));
                // Re-fetch activity
                fetch('/api/profile/activity').then(r => r.json()).then(d => renderProfileActivity(d.activities || []));
            } else {
                alert(data.error || 'Failed to revoke session');
            }
        })
        .catch(() => alert('Network error'));
}

/* ========== GLOBAL SEARCH ========== */
function buildSearchIndex() {
    var index = [];
    var O = window.OAG;
    if (!O) return index;

    function add(text, detail, category, page, icon) {
        index.push({
            text: (text + ' ' + (detail || '')).toLowerCase(),
            display: text,
            detail: detail || '',
            category: category,
            page: page,
            icon: icon || ''
        });
    }

    // Organization — Executive units
    var org = O.ORG;
    org.EXECUTIVE.units.forEach(function(u) { add(u.name, u.head, 'Organization', 'org-structure', '&#127970;'); });
    add(org.EXECUTIVE.head.name, org.EXECUTIVE.head.title, 'Organization', 'org-structure', '&#127970;');

    // Organization — SLO divisions, support, agencies
    org.SLO.divisions.forEach(function(d) { add(d.name, d.head, 'Organization', 'org-structure', '&#9878;'); });
    org.SLO.support.forEach(function(d) { add(d.name, d.head, 'Organization', 'org-structure', '&#127970;'); });
    org.SLO.sagas.forEach(function(s) { add(s.name + ' (' + s.short + ')', s.head, 'Organization', 'org-structure', '&#127970;'); });
    add(org.SLO.head.name, org.SLO.head.title, 'Organization', 'org-structure', '&#127970;');

    // Organization — SDJHCA directorates + agencies
    org.SDJHCA.directorates.forEach(function(d) { add(d.name, d.focus, 'Organization', 'sdjhca', '&#128101;'); });
    org.SDJHCA.agencies.forEach(function(a) { add(a.name + ' (' + a.short + ')', a.mandate, 'Organization', 'sdjhca', '&#128101;'); });
    add(org.SDJHCA.head.name, org.SDJHCA.head.title, 'Organization', 'sdjhca', '&#128101;');

    // Legal Framework — Articles, Statutes, Timeline
    O.LEGAL.ARTICLES.forEach(function(a) { add('Article ' + a.article + ' — ' + a.title, a.text.substring(0, 80), 'Legal Framework', 'legal-framework', '&#128220;'); });
    O.LEGAL.STATUTES.forEach(function(s) { add(s.name, s.cap + ' — ' + s.purpose, 'Statutes', 'legal-framework', '&#128220;'); });
    O.LEGAL.TIMELINE.forEach(function(t) { add(t.year + ' — ' + t.event, t.type, 'Timeline', 'legal-framework', '&#128197;'); });

    // Key Functions
    O.KEY_FUNCTIONS.forEach(function(f) { add(f.name, f.desc, 'AG Functions', 'legal-framework', '&#9878;'); });

    // Access Tiers
    O.ACCESS_TIERS.forEach(function(t) { add('Tier ' + t.level + ' — ' + t.name, t.description, 'Access Tiers', 'org-structure', '&#128274;'); });

    // Workflow stages
    O.WORKFLOWS.PUBLIC.stages.forEach(function(s) { add(s.name, s.desc, 'Workflows', 'workflows', '&#8635;'); });
    O.WORKFLOWS.INTERNAL.stages.forEach(function(s) { add(s.name, s.desc, 'Workflows', 'workflows', '&#8635;'); });

    // Cases
    if (typeof casesData !== 'undefined') {
        casesData.forEach(function(c) { add(c.caseNo + ' ' + c.title, c.type + ' — ' + c.counsel, 'Cases', 'cases', '&#9998;'); });
    }

    // Legal Aid
    if (typeof aidData !== 'undefined') {
        aidData.forEach(function(a) { add(a.id + ' ' + a.name, a.category + ' — ' + a.county, 'Legal Aid', 'legal-aid', '&#9878;'); });
    }

    // Training
    if (typeof trainingData !== 'undefined') {
        trainingData.forEach(function(t) { add(t.program, t.domain + ' — ' + t.duration, 'Training', 'training', '&#9734;'); });
    }

    // Workflows (instances)
    if (typeof workflowData !== 'undefined') {
        workflowData.forEach(function(w) { add(w.id + ' ' + w.type, w.requester + ' — ' + w.assigned, 'Workflows', 'workflows', '&#8635;'); });
    }

    // Counties
    COUNTIES.operational.forEach(function(c) { add(c, 'Operational', 'Counties', 'counties', '&#9873;'); });
    COUNTIES.opening.forEach(function(c) { add(c, 'Opening 2025', 'Counties', 'counties', '&#9873;'); });
    COUNTIES.planned.forEach(function(c) { add(c, 'Planned', 'Counties', 'counties', '&#9873;'); });

    // Pages (so users can search for page names)
    Object.keys(pageTitles).forEach(function(key) {
        add(pageTitles[key], 'Page', 'Navigation', key, '&#128196;');
    });

    return index;
}

(function() {
    var searchInput = document.getElementById('globalSearchInput');
    var searchDropdown = document.getElementById('searchDropdown');
    var searchResults = document.getElementById('searchResults');
    if (!searchInput || !searchDropdown) return;

    var searchIndex = buildSearchIndex();
    var debounceTimer = null;
    var activeIdx = -1;

    function escapeHtml(str) {
        var d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    function highlightMatch(text, query) {
        var escaped = escapeHtml(text);
        var idx = escaped.toLowerCase().indexOf(query);
        if (idx === -1) return escaped;
        return escaped.substring(0, idx) + '<mark>' + escaped.substring(idx, idx + query.length) + '</mark>' + escaped.substring(idx + query.length);
    }

    function openSearch() { searchDropdown.classList.add('open'); }
    function closeSearch() { searchDropdown.classList.remove('open'); activeIdx = -1; }

    function executeSearch(query) {
        query = query.trim().toLowerCase();
        if (query.length < 2) { closeSearch(); return; }

        // Filter: text match + RBAC (skip results whose nav page is hidden)
        var matches = searchIndex.filter(function(entry) {
            if (entry.text.indexOf(query) === -1) return false;
            var nav = document.querySelector('[data-page="' + entry.page + '"]');
            return nav && nav.style.display !== 'none';
        });

        if (matches.length > 30) matches = matches.slice(0, 30);

        if (matches.length === 0) {
            searchResults.innerHTML = '<div class="search-empty">No results for &ldquo;' + escapeHtml(query) + '&rdquo;</div>';
            openSearch();
            return;
        }

        // Group by category
        var groups = {};
        matches.forEach(function(m) {
            if (!groups[m.category]) groups[m.category] = [];
            groups[m.category].push(m);
        });

        var html = '';
        Object.keys(groups).forEach(function(cat) {
            html += '<div class="search-category-label">' + escapeHtml(cat) + '</div>';
            groups[cat].forEach(function(item) {
                html += '<div class="search-result-item" data-page="' + item.page + '">' +
                    '<div class="search-result-icon">' + item.icon + '</div>' +
                    '<div class="search-result-body">' +
                    '<strong>' + highlightMatch(item.display, query) + '</strong>' +
                    '<small>' + escapeHtml(item.detail) + '</small>' +
                    '</div></div>';
            });
        });
        html += '<div class="search-footer">' + matches.length + ' result' + (matches.length !== 1 ? 's' : '') + '</div>';

        searchResults.innerHTML = html;
        activeIdx = -1;
        openSearch();

        searchResults.querySelectorAll('.search-result-item').forEach(function(el) {
            el.addEventListener('click', function(e) {
                e.stopPropagation();
                navigateToResult(el.getAttribute('data-page'));
            });
        });
    }

    function navigateToResult(page) {
        var navItem = document.querySelector('[data-page="' + page + '"]');
        if (navItem) navItem.click();
        closeSearch();
        searchInput.value = '';
        searchInput.blur();
    }

    // Debounced input
    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function() { executeSearch(searchInput.value); }, 250);
    });

    // Keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
        var items = searchResults.querySelectorAll('.search-result-item');
        if (e.key === 'Escape') { closeSearch(); searchInput.blur(); return; }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIdx = Math.min(activeIdx + 1, items.length - 1);
            updateActive(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIdx = Math.max(activeIdx - 1, 0);
            updateActive(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIdx >= 0 && items[activeIdx]) {
                navigateToResult(items[activeIdx].getAttribute('data-page'));
            } else if (items.length > 0) {
                navigateToResult(items[0].getAttribute('data-page'));
            }
        }
    });

    function updateActive(items) {
        items.forEach(function(el, i) {
            el.classList.toggle('active', i === activeIdx);
            if (i === activeIdx) el.scrollIntoView({ block: 'nearest' });
        });
    }

    // Close on outside click
    document.addEventListener('click', function(e) {
        if (!document.getElementById('globalSearchBox').contains(e.target)) closeSearch();
    });
    searchDropdown.addEventListener('click', function(e) { e.stopPropagation(); });

    // Close notification dropdown when search opens
    searchInput.addEventListener('focus', function() {
        var nd = document.getElementById('notifDropdown');
        if (nd) nd.classList.remove('open');
    });
})();

/* ========== NOTIFICATION SYSTEM ========== */
(function() {
    var notifications = [];
    var notifToggle = document.getElementById('notifToggle');
    var notifDropdown = document.getElementById('notifDropdown');
    var notifBadge = document.getElementById('notifBadge');
    var notifList = document.getElementById('notifList');
    var notifMarkAll = document.getElementById('notifMarkAll');

    // System-generated notifications based on platform data
    function generateNotifications() {
        var now = new Date();
        var items = [
            { id: 1, type: 'warning', icon: '&#9888;', title: 'Performance Contract Deadline',
              text: 'Q3 FY 2025/26 indicator submissions due in 14 days', time: minutesAgo(12), unread: true },
            { id: 2, type: 'info', icon: '&#128203;', title: 'New Case Assigned',
              text: 'OAG/2026/0847 — Constitutional Petition transferred to your department', time: minutesAgo(45), unread: true },
            { id: 3, type: 'success', icon: '&#9989;', title: 'Workflow Completed',
              text: 'Contract Clearance WF/2026/0011 approved by SG Office', time: hoursAgo(2), unread: true },
            { id: 4, type: 'urgent', icon: '&#128308;', title: 'Overdue: Legal Opinion',
              text: 'Ministry of Finance request pending 18 days (SLA: 14 days)', time: hoursAgo(3), unread: true },
            { id: 5, type: 'info', icon: '&#128100;', title: 'New User Registered',
              text: 'Sarah Wambui Njoroge (AG/CIV/015) added by ICT Admin', time: hoursAgo(5), unread: true },
            { id: 6, type: 'warning', icon: '&#128197;', title: 'Training Enrollment Closing',
              text: 'AI Governance for Legal Officers — 5 spots remaining', time: hoursAgo(8), unread: false },
            { id: 7, type: 'success', icon: '&#128200;', title: 'Budget Absorption Update',
              text: 'Q2 absorption at 47.2% — on track for 95% annual target', time: daysAgo(1), unread: false },
            { id: 8, type: 'info', icon: '&#127970;', title: 'County Office Update',
              text: 'Makueni county office operational — 34 of 47 now active', time: daysAgo(1), unread: false }
        ];
        return items;
    }

    function minutesAgo(m) { return m + ' min ago'; }
    function hoursAgo(h) { return h + 'h ago'; }
    function daysAgo(d) { return d + 'd ago'; }

    function renderNotifications() {
        var unreadCount = notifications.filter(function(n){ return n.unread; }).length;
        notifBadge.textContent = unreadCount;
        if (unreadCount === 0) {
            notifBadge.classList.add('hidden');
        } else {
            notifBadge.classList.remove('hidden');
        }

        if (notifications.length === 0) {
            notifList.innerHTML = '<div class="notif-empty">No notifications</div>';
            return;
        }

        notifList.innerHTML = notifications.map(function(n) {
            return '<div class="notif-item' + (n.unread ? ' unread' : '') + '" data-id="' + n.id + '">' +
                '<div class="notif-icon-badge ' + n.type + '">' + n.icon + '</div>' +
                '<div class="notif-body">' +
                    '<strong>' + n.title + '</strong>' +
                    '<p>' + n.text + '</p>' +
                    '<div class="notif-time">' + n.time + '</div>' +
                '</div>' +
            '</div>';
        }).join('');

        // Click individual notification to mark as read
        notifList.querySelectorAll('.notif-item').forEach(function(el) {
            el.addEventListener('click', function(e) {
                e.stopPropagation();
                var id = parseInt(el.getAttribute('data-id'));
                notifications.forEach(function(n) { if (n.id === id) n.unread = false; });
                renderNotifications();
            });
        });
    }

    // Toggle dropdown
    notifToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        notifDropdown.classList.toggle('open');
    });

    // Prevent dropdown close when clicking inside it
    notifDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        notifDropdown.classList.remove('open');
    });

    // Mark all as read
    notifMarkAll.addEventListener('click', function(e) {
        e.stopPropagation();
        notifications.forEach(function(n) { n.unread = false; });
        renderNotifications();
    });

    // Initialize
    notifications = generateNotifications();
    renderNotifications();
})();
