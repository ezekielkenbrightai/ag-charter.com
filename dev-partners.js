/* ========== SCROLL SPY ========== */
const navLinks = document.querySelectorAll('.charter-nav .nav-link');
const sections = document.querySelectorAll('.section');

function updateActiveNav() {
    let current = '';
    sections.forEach(s => { if (s.getBoundingClientRect().top <= 120) current = s.id; });
    navLinks.forEach(l => {
        l.classList.remove('active');
        if (l.getAttribute('href') === '#' + current) l.classList.add('active');
    });
}
window.addEventListener('scroll', updateActiveNav);
navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(link.getAttribute('href'));
        if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
    });
});

/* ========== DATA ========== */
const partners = ['World Bank','UNDP','EU','USAID','AfDB','JICA','GIZ','DFID/FCDO','DANIDA','IMF'];
const mdas = ['Ministry of Interior','Ministry of Health','Ministry of Education','Ministry of Lands','Judiciary','Ethics & Anti-Corruption Commission','Kenya Law Reform Commission','State Dept. for Immigration','National Police Service','Kenya Revenue Authority'];
const agTypes = ['Bilateral Treaty','Multilateral Treaty','Loan Agreement','Grant Agreement','MoU','Technical Cooperation'];
const agStatuses = ['Drafting','OAG Legal Review','Treasury Clearance','MDA Technical Review','Partner Negotiation','Cabinet Approval','Signed','Ratified'];
const statusBadge = { 'Drafting':'badge-gray','OAG Legal Review':'badge-green','Treasury Clearance':'badge-orange','MDA Technical Review':'badge-blue','Partner Negotiation':'badge-purple','Cabinet Approval':'badge-gold','Signed':'badge-teal','Ratified':'badge-green' };

function rand(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function pick(arr) { return arr[rand(0, arr.length - 1)]; }
function fmtM(n) { return n >= 1000 ? (n / 1000).toFixed(1) + 'B' : n + 'M'; }

// --- Agreements data ---
const agreements = [];
const agTitles = [
    'Kenya-Japan Bilateral Investment Protection','East Africa Regional Integration Framework','World Bank Justice Sector Reform Loan',
    'EU Rule of Law Strengthening Programme','USAID Access to Justice Programme','AfDB Governance & Anti-Corruption Support',
    'UNDP Legal Aid Expansion Project','GIZ Technical Cooperation on Legal Education','DANIDA Human Rights & Governance Grant',
    'IMF Public Financial Management TA','JICA Capacity Building for Judiciary','FCDO Constitutional Implementation Support',
    'World Bank Digital Government Loan','EU Anti-Money Laundering Framework','USAID Counter-Terrorism Legal Framework',
    'AfDB Infrastructure PPP Legal Advisory','UNDP Election Legal Framework Review','GIZ Environmental Law Harmonisation',
    'DANIDA Gender-Based Violence Legal Response','JICA Maritime Law Cooperation',
    'World Bank Land Administration Reform','EU Trade Law Approximation Programme','USAID Cybersecurity Legal Framework',
    'AfDB Climate Finance Legal Architecture','UNDP Transitional Justice Programme','GIZ Consumer Protection Legal Reform',
    'FCDO Anti-Corruption Legal Strengthening','World Bank Tax Law Modernisation','EU Data Protection & Privacy Framework',
    'USAID Intellectual Property Rights Programme','AfDB Blue Economy Legal Framework','UNDP Refugee & Migration Legal Support',
    'JICA Disaster Risk Reduction Legal Framework','DANIDA Social Protection Legal Reforms'
];

for (let i = 0; i < 34; i++) {
    const status = pick(agStatuses);
    agreements.push({
        ref: 'AG/' + (2024 + rand(0, 2)) + '/' + String(i + 1).padStart(3, '0'),
        title: agTitles[i] || 'Agreement ' + (i + 1),
        type: pick(agTypes),
        partner: pick(partners),
        mda: pick(mdas),
        value: rand(50, 2000),
        status: status,
        days: status === 'Ratified' || status === 'Signed' ? 0 : rand(1, 60),
        stages: generateStages(status)
    });
}

function generateStages(currentStatus) {
    const stageNames = ['Receipt & Registration','OAG Legal Review','MDA Technical Review','Treasury Fiscal Clearance','Negotiation with Dev Partner','Final OAG Clearance','Cabinet Approval & Signing','Ratification & Gazettement'];
    const statusIdx = agStatuses.indexOf(currentStatus);
    const mappedIdx = Math.min(Math.floor(statusIdx / agStatuses.length * stageNames.length + 1), stageNames.length);
    return stageNames.map((name, i) => ({
        name,
        oag: i === 0 || i === 1 || i === 5 || i === 6 || i === 7,
        mda: i === 2 || i === 4,
        dp: i === 4 || i === 7,
        treasury: i === 3,
        status: i < mappedIdx ? 'complete' : i === mappedIdx ? 'active' : (i === mappedIdx + 1 ? 'waiting' : 'pending')
    }));
}

// --- Programmes data ---
const programmes = [
    { id: 'OAG-P001', name: 'Justice Sector Reform Programme', partner: 'World Bank', type: 'Loan', amount: 2400, disbursed: 1680, spent: 1450, start: '2022-07-01', end: '2027-06-30', status: 'Active', meScore: 78, officer: 'Dr. Sarah Odhiambo', component: 'Legal Aid & Access to Justice' },
    { id: 'OAG-P002', name: 'Rule of Law Strengthening', partner: 'EU', type: 'Grant', amount: 1200, disbursed: 900, spent: 780, start: '2023-01-01', end: '2026-12-31', status: 'Active', meScore: 82, officer: 'Mr. James Mwangi', component: 'Anti-Corruption' },
    { id: 'OAG-P003', name: 'Access to Justice Programme', partner: 'USAID', type: 'Grant', amount: 860, disbursed: 645, spent: 590, start: '2023-06-01', end: '2026-05-31', status: 'Active', meScore: 88, officer: 'Ms. Florence Akinyi', component: 'Legal Aid & Access to Justice' },
    { id: 'OAG-P004', name: 'Governance & Anti-Corruption', partner: 'AfDB', type: 'Loan', amount: 1500, disbursed: 750, spent: 620, start: '2024-01-01', end: '2028-12-31', status: 'Active', meScore: 72, officer: 'Mr. Peter Kamau', component: 'Anti-Corruption' },
    { id: 'OAG-P005', name: 'Legal Aid Expansion Project', partner: 'UNDP', type: 'Grant', amount: 420, disbursed: 336, spent: 310, start: '2023-03-01', end: '2026-02-28', status: 'Closing', meScore: 91, officer: 'Ms. Grace Wanjiku', component: 'Legal Aid & Access to Justice' },
    { id: 'OAG-P006', name: 'Legal Education Technical Cooperation', partner: 'GIZ', type: 'Technical Assistance', amount: 280, disbursed: 210, spent: 195, start: '2024-04-01', end: '2026-03-31', status: 'Active', meScore: 85, officer: 'Dr. Daniel Kiprop', component: 'Capacity Building' },
    { id: 'OAG-P007', name: 'Human Rights & Governance', partner: 'DANIDA', type: 'Grant', amount: 380, disbursed: 285, spent: 260, start: '2023-09-01', end: '2026-08-31', status: 'Active', meScore: 76, officer: 'Ms. Amina Hassan', component: 'Legal Aid & Access to Justice' },
    { id: 'OAG-P008', name: 'Digital Government Programme', partner: 'World Bank', type: 'Loan', amount: 650, disbursed: 325, spent: 280, start: '2024-07-01', end: '2028-06-30', status: 'Active', meScore: 68, officer: 'Mr. Kevin Otieno', component: 'Digitization' },
    { id: 'OAG-P009', name: 'Counter-Terrorism Legal Framework', partner: 'USAID', type: 'Grant', amount: 190, disbursed: 95, spent: 82, start: '2025-01-01', end: '2027-12-31', status: 'Active', meScore: 65, officer: 'Mr. Hassan Abdullahi', component: 'Capacity Building' },
    { id: 'OAG-P010', name: 'Constitutional Implementation Support', partner: 'DFID/FCDO', type: 'Grant', amount: 310, disbursed: 248, spent: 230, start: '2022-01-01', end: '2025-12-31', status: 'Closing', meScore: 89, officer: 'Ms. Joyce Nyambura', component: 'Legal Aid & Access to Justice' },
    { id: 'OAG-P011', name: 'PPP Legal Advisory Facility', partner: 'AfDB', type: 'Hybrid', amount: 140, disbursed: 42, spent: 30, start: '2025-06-01', end: '2028-05-31', status: 'Pipeline', meScore: 0, officer: 'Mr. James Mwangi', component: 'Decentralization' },
    { id: 'OAG-P012', name: 'Decentralisation of Legal Services', partner: 'JICA', type: 'Grant', amount: 70, disbursed: 35, spent: 25, start: '2025-03-01', end: '2027-02-28', status: 'Active', meScore: 70, officer: 'Dr. Sarah Odhiambo', component: 'Decentralization' }
];

// --- Officers data ---
const officers = [
    { name: 'Dr. Sarah Odhiambo', role: 'Senior Legal Adviser', dept: 'International Law', progs: ['OAG-P001','OAG-P012'], ags: ['AG/2024/001','AG/2025/003'], email: 's.odhiambo@ag.go.ke', load: 85 },
    { name: 'Mr. James Mwangi', role: 'Deputy Director', dept: 'Government Transactions', progs: ['OAG-P002','OAG-P011'], ags: ['AG/2024/005','AG/2024/008'], email: 'j.mwangi@ag.go.ke', load: 90 },
    { name: 'Ms. Florence Akinyi', role: 'Programme Coordinator', dept: 'Legal Aid (NLAS)', progs: ['OAG-P003'], ags: ['AG/2025/012'], email: 'f.akinyi@ag.go.ke', load: 60 },
    { name: 'Mr. Peter Kamau', role: 'Legal Counsel', dept: 'Anti-Corruption Advisory', progs: ['OAG-P004'], ags: ['AG/2024/006','AG/2025/009','AG/2024/015'], email: 'p.kamau@ag.go.ke', load: 75 },
    { name: 'Ms. Grace Wanjiku', role: 'Programme Manager', dept: 'Legal Aid (NLAS)', progs: ['OAG-P005'], ags: ['AG/2025/017'], email: 'g.wanjiku@ag.go.ke', load: 45 },
    { name: 'Dr. Daniel Kiprop', role: 'Director, Legal Education', dept: 'Legal Advisory & Research', progs: ['OAG-P006'], ags: ['AG/2024/020','AG/2025/022'], email: 'd.kiprop@ag.go.ke', load: 70 },
    { name: 'Ms. Amina Hassan', role: 'Human Rights Adviser', dept: 'International Law', progs: ['OAG-P007'], ags: ['AG/2024/024'], email: 'a.hassan@ag.go.ke', load: 55 },
    { name: 'Mr. Kevin Otieno', role: 'ICT Legal Specialist', dept: 'Digitization Unit', progs: ['OAG-P008'], ags: ['AG/2025/027','AG/2025/029'], email: 'k.otieno@ag.go.ke', load: 80 },
    { name: 'Mr. Hassan Abdullahi', role: 'Security Law Specialist', dept: 'Legislative Drafting', progs: ['OAG-P009'], ags: ['AG/2024/030'], email: 'h.abdullahi@ag.go.ke', load: 40 },
    { name: 'Ms. Joyce Nyambura', role: 'Constitutional Affairs Lead', dept: 'Legal Advisory & Research', progs: ['OAG-P010'], ags: ['AG/2024/032','AG/2025/033','AG/2025/034'], email: 'j.nyambura@ag.go.ke', load: 65 }
];

/* ========== RENDER AGREEMENTS TABLE ========== */
function renderAgreements(data) {
    const body = document.getElementById('agreementsBody');
    body.innerHTML = data.map(a => `<tr>
        <td style="font-weight:700;white-space:nowrap">${a.ref}</td>
        <td>${a.title}</td>
        <td><span class="badge badge-blue">${a.type}</span></td>
        <td>${a.partner}</td>
        <td>${a.mda}</td>
        <td style="white-space:nowrap">KSh ${a.value}M</td>
        <td><span class="badge ${statusBadge[a.status] || 'badge-gray'}">${a.status}</span></td>
        <td style="text-align:center">${a.days > 0 ? a.days + 'd' : '-'}</td>
        <td><button class="btn btn-primary" style="padding:4px 10px;font-size:11px" onclick="viewProcess('${a.ref}')">Track</button></td>
    </tr>`).join('');
}

function filterAgreements() {
    const type = document.getElementById('agTypeFilter').value;
    const status = document.getElementById('agStatusFilter').value;
    const partner = document.getElementById('agPartnerFilter').value;
    const search = document.getElementById('agSearch').value.toLowerCase();
    const filtered = agreements.filter(a =>
        (!type || a.type === type) &&
        (!status || a.status === status) &&
        (!partner || a.partner === partner) &&
        (!search || a.title.toLowerCase().includes(search) || a.ref.toLowerCase().includes(search))
    );
    renderAgreements(filtered);
}

/* ========== PROCESS TRACKER ========== */
function populateProcessSelect() {
    const sel = document.getElementById('processAgreementSelect');
    agreements.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a.ref;
        opt.textContent = a.ref + ' - ' + a.title;
        sel.appendChild(opt);
    });
}

function viewProcess(ref) {
    document.getElementById('processAgreementSelect').value = ref;
    renderProcessTracker();
    document.getElementById('process-tracker').scrollIntoView({ behavior: 'smooth' });
}

function renderProcessTracker() {
    const ref = document.getElementById('processAgreementSelect').value;
    const container = document.getElementById('processTrackerContainer');
    if (!ref) { container.innerHTML = '<div class="process-empty">Select an agreement above to view its 4-party process map</div>'; return; }
    const ag = agreements.find(a => a.ref === ref);
    if (!ag) return;

    const stageLabels = ['ss-complete','ss-active','ss-waiting','ss-pending'];
    const statusLabel = { complete: 'Complete', active: 'In Progress', waiting: 'Waiting', pending: 'Pending' };

    let html = `<div style="margin-bottom:12px;font-size:13px;"><strong>${ag.ref}</strong> &mdash; ${ag.title} &mdash; <span class="badge ${statusBadge[ag.status]}">${ag.status}</span></div>`;
    html += '<div class="process-map">';
    html += '<div class="process-stage-header"><div>#</div><div>OAG</div><div>Lead MDA</div><div>Dev. Partner</div><div>Treasury</div></div>';

    ag.stages.forEach((st, i) => {
        const sClass = 'ss-' + st.status;
        const sLabel = statusLabel[st.status];
        const cellOAG = st.oag ? `<span class="stage-status ${sClass}">${sLabel}</span> ${st.name}` : '<span style="color:#ccc">-</span>';
        const cellMDA = st.mda ? `<span class="stage-status ${sClass}">${sLabel}</span> ${st.name}` : '<span style="color:#ccc">-</span>';
        const cellDP = st.dp ? `<span class="stage-status ${sClass}">${sLabel}</span> ${st.name}` : '<span style="color:#ccc">-</span>';
        const cellTreasury = st.treasury ? `<span class="stage-status ${sClass}">${sLabel}</span> ${st.name}` : '<span style="color:#ccc">-</span>';
        html += `<div class="process-stage">
            <div class="process-stage-num">${i + 1}</div>
            <div>${cellOAG}</div><div>${cellMDA}</div><div>${cellDP}</div><div>${cellTreasury}</div>
        </div>`;
    });
    html += '</div>';
    container.innerHTML = html;
}

/* ========== RENDER PROGRAMMES TABLE ========== */
function renderProgrammes(data) {
    const body = document.getElementById('programmesBody');
    body.innerHTML = data.map(p => {
        const pct = p.amount > 0 ? Math.round(p.disbursed / p.amount * 100) : 0;
        const sBadge = p.status === 'Active' ? 'badge-green' : p.status === 'Closing' ? 'badge-orange' : p.status === 'Completed' ? 'badge-blue' : 'badge-gray';
        return `<tr>
            <td style="font-weight:700">${p.id}</td>
            <td>${p.name}</td>
            <td>${p.partner}</td>
            <td><span class="badge badge-blue">${p.type}</span></td>
            <td style="white-space:nowrap">KSh ${fmtM(p.amount)}</td>
            <td style="white-space:nowrap">KSh ${fmtM(p.disbursed)} <div class="mini-progress"><div class="mini-progress-fill" style="width:${pct}%"></div></div></td>
            <td style="white-space:nowrap;font-size:12px">${p.start.slice(0,7)} to ${p.end.slice(0,7)}</td>
            <td style="text-align:center"><strong>${p.meScore > 0 ? p.meScore + '%' : '-'}</strong></td>
            <td><span class="badge ${sBadge}">${p.status}</span></td>
            <td><button class="btn btn-primary" style="padding:4px 10px;font-size:11px">Detail</button></td>
        </tr>`;
    }).join('');
}

function filterProgrammes() {
    const type = document.getElementById('progTypeFilter').value;
    const status = document.getElementById('progStatusFilter').value;
    const search = document.getElementById('progSearch').value.toLowerCase();
    const filtered = programmes.filter(p =>
        (!type || p.type === type) &&
        (!status || p.status === status) &&
        (!search || p.name.toLowerCase().includes(search) || p.id.toLowerCase().includes(search))
    );
    renderProgrammes(filtered);
}

/* ========== FINANCIAL TABLE ========== */
function renderFinancials() {
    const body = document.getElementById('financialBody');
    body.innerHTML = programmes.map(p => {
        const balance = p.disbursed - p.spent;
        const absorption = p.disbursed > 0 ? Math.round(p.spent / p.disbursed * 100) : 0;
        const absClass = absorption >= 80 ? 'badge-green' : absorption >= 60 ? 'badge-orange' : 'badge-red';
        return `<tr>
            <td style="font-weight:600">${p.name}</td>
            <td>${p.partner}</td>
            <td><span class="badge badge-blue">${p.type}</span></td>
            <td style="text-align:right">${p.amount.toLocaleString()}</td>
            <td style="text-align:right">${p.disbursed.toLocaleString()}</td>
            <td style="text-align:right">${p.spent.toLocaleString()}</td>
            <td style="text-align:right">${balance.toLocaleString()}</td>
            <td style="text-align:center"><span class="badge ${absClass}">${absorption}%</span></td>
        </tr>`;
    }).join('');
}

/* ========== M&E SCORECARD ========== */
const meData = programmes.filter(p => p.meScore > 0).map(p => ({
    name: p.name,
    dpRating: pick(['Satisfactory','Moderately Satisfactory','Moderately Unsatisfactory','Highly Satisfactory']),
    dpDisburse: rand(60, 98),
    dpFiduciary: pick(['Low','Medium','Low','Substantial']),
    oagAlign: rand(65, 98),
    oagImpact: rand(55, 95),
    oagCitizen: rand(50, 92),
    overall: p.meScore
}));

function renderME() {
    const body = document.getElementById('meBody');
    const frBadge = { Low: 'badge-green', Medium: 'badge-orange', Substantial: 'badge-red', High: 'badge-red' };
    const drBadge = { 'Highly Satisfactory': 'badge-green', 'Satisfactory': 'badge-green', 'Moderately Satisfactory': 'badge-orange', 'Moderately Unsatisfactory': 'badge-red' };
    body.innerHTML = meData.map(m => `<tr>
        <td style="font-weight:600">${m.name}</td>
        <td><span class="badge ${drBadge[m.dpRating] || 'badge-gray'}">${m.dpRating}</span></td>
        <td style="text-align:center">${m.dpDisburse}%</td>
        <td><span class="badge ${frBadge[m.dpFiduciary] || 'badge-gray'}">${m.dpFiduciary}</span></td>
        <td style="text-align:center">${m.oagAlign}%</td>
        <td style="text-align:center">${m.oagImpact}%</td>
        <td style="text-align:center">${m.oagCitizen}%</td>
        <td style="text-align:center;font-weight:800">${m.overall}%</td>
    </tr>`).join('');
}

/* ========== RISK GRID ========== */
function renderRiskGrid() {
    const grid = document.getElementById('riskGrid');
    const risks = [
        { label: 'Fiduciary', level: 'low' }, { label: 'Legal Compliance', level: 'low' }, { label: 'Political', level: 'medium' },
        { label: 'Implementation', level: 'medium' }, { label: 'Disbursement Delay', level: 'high' }, { label: 'Capacity', level: 'medium' },
        { label: 'Currency', level: 'high' }, { label: 'Sustainability', level: 'medium' }, { label: 'Reputational', level: 'low' }
    ];
    grid.innerHTML = risks.map(r => `<div class="risk-cell risk-${r.level}">${r.label}<br>${r.level.toUpperCase()}</div>`).join('');
}

/* ========== OFFICERS TABLE ========== */
function renderOfficers() {
    const body = document.getElementById('officersBody');
    body.innerHTML = officers.map(o => {
        const wlClass = o.load >= 80 ? 'wl-high' : o.load >= 60 ? 'wl-med' : 'wl-low';
        return `<tr>
            <td style="font-weight:600">${o.name}</td>
            <td>${o.role}</td>
            <td>${o.dept}</td>
            <td>${o.progs.join(', ')}</td>
            <td>${o.ags.join(', ')}</td>
            <td style="font-size:12px">${o.email}</td>
            <td>${o.load}% <div class="workload-bar"><div class="workload-fill ${wlClass}" style="width:${o.load}%"></div></div></td>
        </tr>`;
    }).join('');
}

/* ========== CHARTS ========== */
function initCharts() {
    const colors = ['#1a5632','#3b82f6','#c8102e','#d4a017','#14b8a6','#8b5cf6','#f59e0b','#6366f1','#ec4899','#22c55e'];
    const fontOpts = { family: "'Segoe UI', system-ui, sans-serif" };
    Chart.defaults.font.family = fontOpts.family;
    Chart.defaults.font.size = 12;

    // Portfolio by partner (horizontal bar)
    const partnerTotals = {};
    programmes.forEach(p => { partnerTotals[p.partner] = (partnerTotals[p.partner] || 0) + p.amount; });
    new Chart(document.getElementById('chartPartnerPortfolio'), {
        type: 'bar',
        data: {
            labels: Object.keys(partnerTotals),
            datasets: [{ label: 'Portfolio (KSh M)', data: Object.values(partnerTotals), backgroundColor: colors.slice(0, Object.keys(partnerTotals).length) }]
        },
        options: { indexAxis: 'y', responsive: true, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true } } }
    });

    // Pipeline status (doughnut)
    const pipelineCounts = {};
    agreements.forEach(a => { pipelineCounts[a.status] = (pipelineCounts[a.status] || 0) + 1; });
    new Chart(document.getElementById('chartPipelineStatus'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(pipelineCounts),
            datasets: [{ data: Object.values(pipelineCounts), backgroundColor: colors.slice(0, Object.keys(pipelineCounts).length) }]
        },
        options: { responsive: true, plugins: { legend: { position: 'right' } } }
    });

    // Disbursement trend (line)
    new Chart(document.getElementById('chartDisbursement'), {
        type: 'line',
        data: {
            labels: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025'],
            datasets: [
                { label: 'Disbursed', data: [1.2, 2.1, 2.8, 3.4, 4.0, 4.6, 5.1, 5.6], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.3 },
                { label: 'Spent', data: [0.9, 1.7, 2.3, 2.9, 3.4, 3.9, 4.3, 4.8], borderColor: '#1a5632', backgroundColor: 'rgba(26,86,50,0.1)', fill: true, tension: 0.3 }
            ]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });

    // M&E Scores radar
    const meLabels = meData.slice(0, 6).map(m => m.name.length > 20 ? m.name.slice(0, 20) + '...' : m.name);
    new Chart(document.getElementById('chartMEScores'), {
        type: 'radar',
        data: {
            labels: meLabels,
            datasets: [{
                label: 'M&E Score %',
                data: meData.slice(0, 6).map(m => m.overall),
                borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.15)', pointBackgroundColor: '#8b5cf6'
            }]
        },
        options: { responsive: true, scales: { r: { beginAtZero: true, max: 100 } } }
    });

    // Spend by programme (bar)
    const topProgs = programmes.filter(p => p.spent > 0).sort((a, b) => b.spent - a.spent).slice(0, 8);
    new Chart(document.getElementById('chartSpendByProg'), {
        type: 'bar',
        data: {
            labels: topProgs.map(p => p.name.length > 25 ? p.name.slice(0, 25) + '...' : p.name),
            datasets: [
                { label: 'Committed', data: topProgs.map(p => p.amount), backgroundColor: 'rgba(26,86,50,0.3)' },
                { label: 'Disbursed', data: topProgs.map(p => p.disbursed), backgroundColor: 'rgba(59,130,246,0.5)' },
                { label: 'Spent', data: topProgs.map(p => p.spent), backgroundColor: '#1a5632' }
            ]
        },
        options: { responsive: true, scales: { x: { ticks: { maxRotation: 45 } }, y: { beginAtZero: true } } }
    });

    // Quarterly disbursement vs spend (bar)
    new Chart(document.getElementById('chartQuarterlySpend'), {
        type: 'bar',
        data: {
            labels: ['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025'],
            datasets: [
                { label: 'Disbursed', data: [1200, 900, 700, 600, 600, 600, 500, 500], backgroundColor: '#3b82f6' },
                { label: 'Spent', data: [900, 800, 600, 600, 500, 500, 400, 500], backgroundColor: '#1a5632' }
            ]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });

    // M&E Dual comparison (bar grouped - DP vs OAG)
    new Chart(document.getElementById('chartMEDual'), {
        type: 'bar',
        data: {
            labels: meData.slice(0, 8).map(m => m.name.length > 18 ? m.name.slice(0, 18) + '...' : m.name),
            datasets: [
                { label: 'DP: Disbursement Compliance', data: meData.slice(0, 8).map(m => m.dpDisburse), backgroundColor: '#8b5cf6' },
                { label: 'OAG: Strategic Alignment', data: meData.slice(0, 8).map(m => m.oagAlign), backgroundColor: '#1a5632' },
                { label: 'OAG: Citizen Outcome', data: meData.slice(0, 8).map(m => m.oagCitizen), backgroundColor: '#d4a017' }
            ]
        },
        options: { responsive: true, scales: { x: { ticks: { maxRotation: 45 } }, y: { beginAtZero: true, max: 100 } } }
    });
}

/* ========== MODALS ========== */
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

/* ========== INIT ========== */
document.addEventListener('DOMContentLoaded', () => {
    renderAgreements(agreements);
    populateProcessSelect();
    renderProgrammes(programmes);
    renderFinancials();
    renderME();
    renderRiskGrid();
    renderOfficers();
    initCharts();
});
