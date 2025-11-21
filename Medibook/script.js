// Mock doctor data
const doctors = [
    { id: 1, name: 'Dr. John Doe', specialty: 'Cardiology', bio: 'Expert in heart care.', rating: 4.8, image: 'assets/doctor1.jpg' },
    { id: 2, name: 'Dr. Jane Smith', specialty: 'Pediatrics', bio: 'Specialist for kids.', rating: 4.9, image: 'assets/doctor2.jpg' },
    { id: 3, name: 'Dr. Alex Johnson', specialty: 'Dermatology', bio: 'Skin health pro.', rating: 4.7, image: 'assets/doctor3.jpg' }
];

// Populate doctor list
if (document.getElementById('doctor-list')) {
    displayDoctors(doctors);
    document.getElementById('specialty-filter').addEventListener('change', (e) => {
        const filtered = e.target.value ? doctors.filter(d => d.specialty === e.target.value) : doctors;
        displayDoctors(filtered);
    });
}

function displayDoctors(list) {
    const container = document.getElementById('doctor-list');
    container.innerHTML = list.map(d => `
        <div class="card" onclick="viewProfile(${d.id})">
            <img src="${d.image}" alt="${d.name}" style="width:100px; height:100px; border-radius:50%;">
            <h4>${d.name}</h4>
            <p>${d.specialty} - Rating: ${d.rating}</p>
        </div>
    `).join('');
}

// View specialty (redirect to doctors.html with filter)
function viewSpecialty(specialty) {
    localStorage.setItem('filter', specialty);
    window.location.href = 'doctors.html';
}

// On doctors.html load, apply filter
if (window.location.pathname.includes('doctors.html') && localStorage.getItem('filter')) {
    document.getElementById('specialty-filter').value = localStorage.getItem('filter');
    document.getElementById('specialty-filter').dispatchEvent(new Event('change'));
    localStorage.removeItem('filter');
}

// View profile
function viewProfile(id) {
    const doctor = doctors.find(d => d.id === id);
    localStorage.setItem('selectedDoctor', JSON.stringify(doctor));
    window.location.href = 'profile.html';
}

// Populate profile
if (document.getElementById('profile')) {
    const doctor = JSON.parse(localStorage.getItem('selectedDoctor'));
    document.getElementById('profile').innerHTML = `
        <img src="${doctor.image}" alt="${doctor.name}">
        <h2>${doctor.name}</h2>
        <p><strong>Specialty:</strong> ${doctor.specialty}</p>
        <p><strong>Bio:</strong> ${doctor.bio}</p>
        <p><strong>Rating:</strong> ${doctor.rating}/5</p>
        <button onclick="bookAppointment()">Book Appointment</button>
    `;
}

// Book appointment
function bookAppointment() {
    window.location.href = 'booking.html';
}

// Handle booking form
if (document.getElementById('booking-form')) {
    document.getElementById('booking-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const doctor = JSON.parse(localStorage.getItem('selectedDoctor'));
        const booking = {
            doctor: doctor.name,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value
        };
        localStorage.setItem('booking', JSON.stringify(booking));
        window.location.href = 'confirmation.html';
    });
}

// Populate confirmation
if (document.querySelector('.confirmation')) {
    const booking = JSON.parse(localStorage.getItem('booking'));
    document.getElementById('details').textContent = `Doctor: ${booking.doctor}, Date: ${booking.date}, Time: ${booking.time}, Name: ${booking.name}`;
}

// Search (simple redirect)
function searchDoctors() {
    const query = document.getElementById('search').value.toLowerCase();
    const filtered = doctors.filter(d => d.name.toLowerCase().includes(query) || d.specialty.toLowerCase().includes(query));
    localStorage.setItem('searchResults', JSON.stringify(filtered));
    window.location.href = 'doctors.html';
}

// On doctors.html, show search results
if (window.location.pathname.includes('doctors.html') && localStorage.getItem('searchResults')) {
    displayDoctors(JSON.parse(localStorage.getItem('searchResults')));
    localStorage.removeItem('searchResults');
}