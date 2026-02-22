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
    cases: 'Integrated Case Management System',
    'legal-aid': 'Legal Aid Services - Sheria Mtaani',
    counties: 'County Office Decentralization',
    training: 'Training & Capacity Building',
    workflows: 'Workflow Automation',
    registries: 'Digital Registries',
    complaints: 'Advocates Complaints Commission',
    performance: 'Performance Management'
};

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const page = item.dataset.page;
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('page-' + page).classList.add('active');
        document.getElementById('pageTitle').textContent = pageTitles[page] || '';
        // close mobile sidebar
        document.getElementById('sidebar').classList.remove('open');
    });
});

document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
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

/* ========== PERFORMANCE TABLE ========== */
const departments = ['Civil Litigation','Government Transactions','International Law','Legislative Drafting','Legal Advisory','Registrar General'];
document.getElementById('performanceTableBody').innerHTML = counselNames.slice(0, 10).map(name => {
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

// Dept Performance
new Chart(document.getElementById('chartDeptPerformance'), {
    type: 'radar',
    data: {
        labels: ['Case Success','Turnaround Time','CPD Compliance','Client Satisfaction','Drafting Quality','Digitization'],
        datasets: [
            { label: 'Current', data: [68, 55, 72, 76, 71, 55], borderColor: chartColors.primary, backgroundColor: 'rgba(26,86,50,0.15)' },
            { label: 'Target 2027', data: [93, 85, 100, 100, 96, 100], borderColor: chartColors.gold, backgroundColor: 'rgba(212,160,23,0.1)', borderDash: [5, 5] }
        ]
    },
    options: { responsive: true, scales: { r: { beginAtZero: true, max: 100 } }, plugins: { legend: { position: 'bottom' } } }
});

// Quarterly Targets
new Chart(document.getElementById('chartQuarterlyTargets'), {
    type: 'bar',
    data: {
        labels: ['Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026'],
        datasets: [
            { label: 'Target', data: [75, 78, 80, 83, 85], backgroundColor: 'rgba(229,231,235,0.8)' },
            { label: 'Actual', data: [70, 73, 76, 79, 82], backgroundColor: chartColors.primary }
        ]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
});
