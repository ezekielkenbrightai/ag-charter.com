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
const counties = ['Mombasa','Kwale','Kilifi','Tana River','Lamu','Taita-Taveta','Garissa','Wajir','Mandera','Marsabit','Isiolo','Meru','Tharaka-Nithi','Embu','Kitui','Machakos','Makueni','Nyandarua','Nyeri','Kirinyaga','Murang\'a','Kiambu','Turkana','West Pokot','Samburu','Trans-Nzoia','Uasin Gishu','Elgeyo-Marakwet','Nandi','Baringo','Laikipia','Nakuru','Narok','Kajiado','Kericho','Bomet','Kakamega','Vihiga','Bungoma','Busia','Siaya','Kisumu','Homa Bay','Migori','Kisii','Nyamira','Nairobi'];

const categories = ['Constitutional & Governance','Criminal Justice','Commercial & Trade','Land & Environment','Human Rights & Social','Public Finance','Technology & Digital'];
const catClasses = {
    'Constitutional & Governance': 'cat-constitutional',
    'Criminal Justice': 'cat-criminal',
    'Commercial & Trade': 'cat-commercial',
    'Land & Environment': 'cat-land',
    'Human Rights & Social': 'cat-human-rights',
    'Public Finance': 'cat-finance',
    'Technology & Digital': 'cat-technology'
};

const openBills = [
    {
        id: 'BILL-2026-001',
        title: 'The Data Protection (Amendment) Bill, 2026',
        category: 'Technology & Digital',
        sponsor: 'Attorney General',
        published: '2026-02-01',
        deadline: '2026-03-15',
        summary: 'Proposes amendments to the Data Protection Act, 2019 to strengthen provisions on cross-border data transfers, introduce data portability rights, enhance enforcement powers of the Data Commissioner, and align with emerging international standards on artificial intelligence governance.',
        clauses: 42,
        comments: 186
    },
    {
        id: 'BILL-2026-002',
        title: 'The Legal Aid (Amendment) Bill, 2026',
        category: 'Human Rights & Social',
        sponsor: 'Attorney General',
        published: '2026-02-05',
        deadline: '2026-03-05',
        summary: 'Seeks to expand the scope of legal aid services to include alternative dispute resolution, establish county-level legal aid offices in all 47 counties, create a Legal Aid Fund, and provide for paralegals as recognised legal aid providers.',
        clauses: 38,
        comments: 312
    },
    {
        id: 'BILL-2026-003',
        title: 'The Anti-Corruption and Economic Crimes (Amendment) Bill, 2026',
        category: 'Criminal Justice',
        sponsor: 'State Department for Justice',
        published: '2026-02-10',
        deadline: '2026-03-20',
        summary: 'Introduces enhanced asset recovery mechanisms, beneficial ownership disclosure requirements, digital forensic evidence standards, whistleblower protection strengthening, and mandatory integrity vetting for public officers.',
        clauses: 56,
        comments: 247
    },
    {
        id: 'BILL-2026-004',
        title: 'The Community Land (Amendment) Bill, 2026',
        category: 'Land & Environment',
        sponsor: 'State Department for Justice',
        published: '2026-02-14',
        deadline: '2026-03-28',
        summary: 'Proposes strengthening community land governance structures, introducing environmental impact assessment requirements for community land use changes, protecting pastoral corridor rights, and establishing a Community Land Dispute Tribunal.',
        clauses: 34,
        comments: 89
    }
];

const closedBills = [
    { title: 'The Statute Law (Miscellaneous Amendments) Bill, 2025', category: 'Constitutional & Governance', period: '1 Oct - 31 Oct 2025', received: 423, adopted: 67, status: 'Enacted', statusBadge: 'badge-green' },
    { title: 'The Public Finance Management (Amendment) Bill, 2025', category: 'Public Finance', period: '15 Sep - 15 Oct 2025', received: 289, adopted: 45, status: 'Before Parliament', statusBadge: 'badge-blue' },
    { title: 'The Persons with Disabilities Bill, 2025', category: 'Human Rights & Social', period: '1 Sep - 30 Sep 2025', received: 567, adopted: 89, status: 'Before Parliament', statusBadge: 'badge-blue' },
    { title: 'The Employment (Amendment) Bill, 2025', category: 'Commercial & Trade', period: '15 Aug - 15 Sep 2025', received: 198, adopted: 32, status: 'Enacted', statusBadge: 'badge-green' },
    { title: 'The Computer Misuse and Cybercrimes (Amendment) Bill, 2025', category: 'Technology & Digital', period: '1 Aug - 31 Aug 2025', received: 345, adopted: 56, status: 'Before Parliament', statusBadge: 'badge-blue' },
    { title: 'The National Police Service (Amendment) Bill, 2025', category: 'Criminal Justice', period: '15 Jul - 15 Aug 2025', received: 412, adopted: 71, status: 'Signed into Law', statusBadge: 'badge-green' },
    { title: 'The Climate Change (Amendment) Bill, 2025', category: 'Land & Environment', period: '1 Jul - 31 Jul 2025', received: 234, adopted: 48, status: 'Committee Stage', statusBadge: 'badge-orange' },
    { title: 'The Refugees Bill, 2025', category: 'Human Rights & Social', period: '15 Jun - 15 Jul 2025', received: 156, adopted: 28, status: 'Before Parliament', statusBadge: 'badge-blue' },
    { title: 'The Elections (Amendment) Bill, 2025', category: 'Constitutional & Governance', period: '1 Jun - 30 Jun 2025', received: 678, adopted: 102, status: 'Committee Stage', statusBadge: 'badge-orange' },
    { title: 'The National Land Commission (Amendment) Bill, 2025', category: 'Land & Environment', period: '15 May - 15 Jun 2025', received: 189, adopted: 34, status: 'Enacted', statusBadge: 'badge-green' },
    { title: 'The Mental Health Bill, 2025', category: 'Human Rights & Social', period: '1 May - 31 May 2025', received: 298, adopted: 52, status: 'Before Parliament', statusBadge: 'badge-blue' },
    { title: 'The Alternative Dispute Resolution Bill, 2025', category: 'Constitutional & Governance', period: '15 Apr - 15 May 2025', received: 145, adopted: 38, status: 'Signed into Law', statusBadge: 'badge-green' }
];

// Tracker comments
const submitterTypes = ['Individual Citizen','Civil Society Organisation','Professional Body','Academic/Research Institution','Private Sector','County Government'];
const positions = ['Support with amendments','Oppose specific provisions','Support the Bill as drafted','Neutral / Providing information only'];
const trackerStatuses = ['Received','Under Review','Adopted','Partially Adopted','Noted','Rejected with Reasons'];
const trackerBadges = { 'Received':'badge-gray','Under Review':'badge-blue','Adopted':'badge-green','Partially Adopted':'badge-orange','Noted':'badge-purple','Rejected with Reasons':'badge-red' };

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

const trackerComments = [];
const names = ['John Ochieng','Mary Wambui','Dr. Hassan Ali','Kenya Law Society','Transparency International Kenya','FIDA Kenya','ICJ Kenya','Prof. Njoki Mwangi','Kituo cha Sheria','Samuel Kipchoge','Grace Atieno','Institute of Economic Affairs','Katiba Institute','Kenya National Commission on Human Rights','Dr. Beatrice Kamau','Law Society of Kenya - Mombasa Branch','Centre for Rights Education and Awareness','Patrick Ndung\'u','Amnesty International Kenya','National Gender and Equality Commission'];

const allBills = [...openBills.map(b => b.title), ...closedBills.slice(0, 4).map(b => b.title)];
for (let i = 0; i < 50; i++) {
    const bill = pick(allBills);
    const status = pick(trackerStatuses);
    trackerComments.push({
        ref: 'PP/' + (2025 + rand(0, 1)) + '/' + String(i + 1).padStart(4, '0'),
        bill: bill.length > 50 ? bill.slice(0, 50) + '...' : bill,
        submitter: pick(names),
        type: pick(submitterTypes),
        date: '2025-' + String(rand(1, 12)).padStart(2, '0') + '-' + String(rand(1, 28)).padStart(2, '0'),
        clause: 'S.' + rand(1, 60) + '(' + rand(1, 5) + ')',
        position: pick(positions),
        status: status,
        response: status === 'Adopted' ? 'Amendment incorporated' : status === 'Partially Adopted' ? 'Partially reflected in revised text' : status === 'Noted' ? 'Considered but not adopted' : status === 'Rejected with Reasons' ? 'Outside scope of Bill' : '-'
    });
}

/* ========== RENDER OPEN BILLS ========== */
function renderOpenBills(data) {
    const grid = document.getElementById('openBillsGrid');
    const today = new Date();
    grid.innerHTML = data.map(b => {
        const deadline = new Date(b.deadline);
        const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
        const dlClass = daysLeft <= 7 ? 'deadline-urgent' : daysLeft <= 14 ? 'deadline-normal' : 'deadline-ample';
        const catClass = catClasses[b.category] || 'cat-constitutional';
        return `<div class="bill-card" data-category="${b.category}">
            <div class="bill-card-header">
                <span class="bill-category-badge ${catClass}">${b.category}</span>
                <h4>${b.title}</h4>
                <div class="bill-meta">
                    <span class="bill-meta-item"><strong>Ref:</strong> ${b.id}</span>
                    <span class="bill-meta-item"><strong>Sponsor:</strong> ${b.sponsor}</span>
                    <span class="bill-meta-item"><strong>Clauses:</strong> ${b.clauses}</span>
                </div>
            </div>
            <div class="bill-card-body">
                <p>${b.summary}</p>
            </div>
            <div class="bill-card-footer">
                <span class="bill-deadline ${dlClass}">Deadline: ${b.deadline} (${daysLeft > 0 ? daysLeft + ' days left' : 'CLOSED'})</span>
                <span class="bill-comments-count">${b.comments} comments</span>
                <button class="btn btn-primary" onclick="scrollToComment('${b.id}')">Comment</button>
            </div>
        </div>`;
    }).join('');
}

function filterBills() {
    const cat = document.getElementById('billCategoryFilter').value;
    const search = document.getElementById('billSearch').value.toLowerCase();
    const filtered = openBills.filter(b =>
        (!cat || b.category === cat) &&
        (!search || b.title.toLowerCase().includes(search) || b.summary.toLowerCase().includes(search))
    );
    renderOpenBills(filtered);
}

/* ========== RENDER CLOSED BILLS ========== */
function renderClosedBills() {
    const body = document.getElementById('closedBillsBody');
    body.innerHTML = closedBills.map(b => `<tr>
        <td style="font-weight:600">${b.title}</td>
        <td><span class="bill-category-badge ${catClasses[b.category] || ''}">${b.category}</span></td>
        <td style="white-space:nowrap;font-size:12px">${b.period}</td>
        <td style="text-align:center">${b.received}</td>
        <td style="text-align:center">${b.adopted} (${Math.round(b.adopted / b.received * 100)}%)</td>
        <td><span class="badge ${b.statusBadge}">${b.status}</span></td>
        <td><button class="btn btn-primary" style="padding:4px 10px;font-size:11px">View Report</button></td>
    </tr>`).join('');
}

/* ========== RENDER TRACKER ========== */
function renderTracker(data) {
    const body = document.getElementById('trackerBody');
    body.innerHTML = data.map(c => `<tr>
        <td style="font-weight:700;white-space:nowrap">${c.ref}</td>
        <td style="font-size:12px">${c.bill}</td>
        <td>${c.submitter}</td>
        <td style="font-size:11px">${c.type}</td>
        <td style="white-space:nowrap;font-size:12px">${c.date}</td>
        <td style="white-space:nowrap">${c.clause}</td>
        <td style="font-size:11px">${c.position}</td>
        <td><span class="badge ${trackerBadges[c.status]}">${c.status}</span></td>
        <td style="font-size:11px;color:var(--text-light)">${c.response}</td>
    </tr>`).join('');
}

function filterTracker() {
    const search = document.getElementById('trackerSearch').value.toLowerCase();
    const status = document.getElementById('trackerStatus').value;
    const filtered = trackerComments.filter(c =>
        (!search || c.ref.toLowerCase().includes(search) || c.submitter.toLowerCase().includes(search) || c.bill.toLowerCase().includes(search)) &&
        (!status || c.status === status)
    );
    renderTracker(filtered);
}

/* ========== SUBMIT COMMENT ========== */
function scrollToComment(billId) {
    const sel = document.getElementById('commentBill');
    if (sel) {
        for (let i = 0; i < sel.options.length; i++) {
            if (sel.options[i].value === billId) { sel.selectedIndex = i; break; }
        }
    }
    document.getElementById('submit-comment').scrollIntoView({ behavior: 'smooth' });
}

function submitComment(e) {
    e.preventDefault();
    const ref = 'PP/2026/' + String(trackerComments.length + 1).padStart(4, '0');
    document.getElementById('submissionRef').textContent = ref;
    document.getElementById('submissionSuccess').classList.add('active');
    document.getElementById('commentForm').reset();
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

/* ========== POPULATE SELECTS ========== */
function populateSelects() {
    // Bill select in comment form
    const billSel = document.getElementById('commentBill');
    openBills.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b.id;
        opt.textContent = b.title;
        billSel.appendChild(opt);
    });

    // County select
    const countySel = document.getElementById('commentCounty');
    counties.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        countySel.appendChild(opt);
    });
}

/* ========== INIT ========== */
document.addEventListener('DOMContentLoaded', () => {
    populateSelects();
    renderOpenBills(openBills);
    renderClosedBills();
    renderTracker(trackerComments);
});
