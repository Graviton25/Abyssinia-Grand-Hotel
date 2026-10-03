const API='/api';let rooms=[],selectedRoom=null;const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);const money=n=>new Intl.NumberFormat('en-US').format(n)+' ETB';
function toast(m){const x=$('#toast');x.textContent=m;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),2800)}async function api(path,opt={}){const h={'Content-Type':'application/json',...(opt.headers||{})},t=localStorage.getItem('abyssiniaToken');if(t)h.Authorization='Bearer '+t;const r=await fetch(API+path,{...opt,headers:h}),d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.message||'Request failed.');return d}
function render(list){const g=$('#roomGrid');if(!list.length){g.innerHTML='<div class="empty"><h3>No rooms in this category</h3><p>Try another category.</p></div>';return}g.innerHTML=list.map(r=>`<article class="room-card"><div class="room-image"><img src="${r.image}" alt="${r.name}" loading="lazy"><span class="room-type">${r.type}</span></div><div class="room-content"><div class="room-heading"><h3>${r.name}</h3><span class="room-capacity">${r.capacity} guests</span></div><p class="room-description">${r.description}</p><div class="room-bottom"><div class="room-price"><strong>${money(r.price)}</strong><span>per night</span></div><button class="book-room" data-id="${r.id}">Reserve</button></div></div></article>`).join('');$$('.book-room').forEach(b=>b.onclick=()=>{const r=rooms.find(x=>x.id==b.dataset.id);openBooking(r)})}
async function loadRooms(){const g=$('#roomGrid');g.innerHTML='<div class="loading"><div class="spinner"></div><p>Preparing your rooms...</p></div>';try{rooms=await api('/rooms');render(rooms)}catch(e){g.innerHTML=`<div class="empty"><h3>Unable to load rooms</h3><p>${e.message}</p><button class="btn dark" id="retry">Try again</button></div>`;$('#retry').onclick=loadRooms}}
function modal(id,open=true){$(id).classList.toggle('open',open)}function auth(mode){const reg=mode==='register';$('#authModal').dataset.mode=mode;$('#authTitle').textContent=reg?'Create your account':'Welcome back';$('#authSubmit').textContent=reg?'Create account':'Sign in';$('#nameWrap').hidden=!reg;$('#authSwitch').innerHTML=reg?'Already have an account? <button type="button" id="switch">Sign in</button>':`Don't have an account? <button type="button" id="switch">Create one</button>`;$('#switch').onclick=()=>auth(reg?'login':'register');modal('#authModal')}
function openBooking(r){if(!localStorage.getItem('abyssiniaToken')){toast('Please sign in before reserving a room.');auth('login');return}selectedRoom=r;$('#bookingRoomName').textContent=r.name;$('#bookingRoomPrice').textContent=money(r.price)+' per night';const a=new Date(),b=new Date(a);b.setDate(a.getDate()+1);const f=x=>x.toISOString().slice(0,10);$('#checkIn').min=f(a);$('#checkOut').min=f(b);$('#checkIn').value=f(a);$('#checkOut').value=f(b);$('#guestCount').max=r.capacity;$('#guestCount').value=1;modal('#bookingModal')}
async function authSubmit(e){e.preventDefault();const reg=$('#authModal').dataset.mode==='register';try{const d=await api(reg?'/auth/register':'/auth/login',{method:'POST',body:JSON.stringify(reg?{name:$('#authName').value,email:$('#authEmail').value,password:$('#authPassword').value}:{email:$('#authEmail').value,password:$('#authPassword').value})});localStorage.setItem('abyssiniaToken',d.token);modal('#authModal',false);toast(reg?'Account created.':'Welcome back.');updateAuth()}catch(x){toast(x.message)}}
async function bookSubmit(e){e.preventDefault();try{const d=await api('/bookings',{method:'POST',body:JSON.stringify({roomId:selectedRoom.id,checkIn:$('#checkIn').value,checkOut:$('#checkOut').value,guests:+$('#guestCount').value})});modal('#bookingModal',false);toast('Reservation confirmed — '+money(d.total));selectedRoom=null}catch(x){toast(x.message)}}
async function updateAuth(){
  const token = localStorage.getItem('abyssiniaToken');

  $('#loginBtn').hidden = !!token;
  $('#signupBtn').hidden = !!token;
  $('#dashboardBtn').hidden = !token;

  const adminButton = $('#adminBtn');

  if (adminButton) {
    adminButton.hidden = true;
  }

  if (!token) return;

  try {
    const user = await api('/me');

    $('#dashName').textContent = user.name;

    if (adminButton && user.role === 'admin') {
      adminButton.hidden = false;
    }

  } catch {
    localStorage.removeItem('abyssiniaToken');
    updateAuth();
  }
}
async function dashboard(){
  modal('#dashboardModal');

  const bookingList = $('#bookingList');
  bookingList.innerHTML = '<p>Loading your stay...</p>';

  try {
    const [bookings, services] = await Promise.all([
      api('/bookings/me'),
      api('/service-requests/me')
    ]);

    const bookingHTML = bookings.length
      ? bookings.map(b => `
        <div class="booking-item">
          <div>
            <h3>${b.roomName}</h3>
            <p>${b.checkIn} → ${b.checkOut} · ${b.guests} guest(s)</p>
            <small class="status-badge">${b.status}</small>
          </div>
          <strong>${money(b.total)}</strong>
        </div>
      `).join('')
      : `
        <div class="empty">
          <h3>No reservations yet</h3>
          <p>Your room reservations will appear here.</p>
        </div>
      `;

    const serviceHTML = services.length
      ? services.map(s => `
        <div class="booking-item service-request-item">
          <div>
            <h3>${s.service}</h3>
            <p>${s.items.map(item => item.name).join(', ')}</p>
            <small class="status-badge">${s.status}</small>
          </div>
          <strong>${money(s.total)}</strong>
        </div>
      `).join('')
      : `
        <div class="empty">
          <h3>No service requests yet</h3>
          <p>Food, dining and hotel service requests will appear here.</p>
        </div>
      `;

    bookingList.innerHTML = `
      <section class="stay-section">
        <div class="stay-section-heading">
          <div>
            <small>YOUR RESERVATIONS</small>
            <h3>Room Bookings</h3>
          </div>
          <span>${bookings.length}</span>
        </div>
        ${bookingHTML}
      </section>

      <section class="stay-section">
        <div class="stay-section-heading">
          <div>
            <small>HOTEL SERVICES</small>
            <h3>Service Requests</h3>
          </div>
          <span>${services.length}</span>
        </div>
        ${serviceHTML}
      </section>
    `;

  } catch (error) {
    console.error('My Stay error:', error);
    bookingList.innerHTML = `
      <div class="empty">
        <h3>Unable to load your stay</h3>
        <p>${error.message || 'Please try again.'}</p>
      </div>
    `;
  }
}
async function contact(e){e.preventDefault();try{await api('/contact',{method:'POST',body:JSON.stringify({name:$('#contactName').value,email:$('#contactEmail').value,message:$('#contactMessage').value})});e.target.reset();toast('Your message has been received.')}catch(x){toast(x.message)}}
document.addEventListener('DOMContentLoaded',()=>{$('#year').textContent=new Date().getFullYear();loadRooms();updateAuth();$('#loginBtn').onclick=()=>auth('login');$('#signupBtn').onclick=()=>auth('register');$('#dashboardBtn').onclick=dashboard;$('#adminBtn').onclick=adminDashboard;$('#logoutBtn').onclick=()=>{localStorage.removeItem('abyssiniaToken');modal('#dashboardModal',false);updateAuth();toast('Signed out.')};$('#authForm').onsubmit=authSubmit;$('#bookingForm').onsubmit=bookSubmit;$('#contactForm').onsubmit=contact;$$('[data-close]').forEach(b=>b.onclick=()=>modal('#'+b.dataset.close,false));$$('#filters button').forEach(b=>b.onclick=()=>{$$('#filters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(b.dataset.filter==='all'?rooms:rooms.filter(r=>r.type.toLowerCase()===b.dataset.filter.toLowerCase()))})});

/* =========================================
   DINING & HOTEL SERVICES
   ========================================= */

const serviceMenus = {
  "Grand Restaurant": {
    subtitle: "A curated selection of Ethiopian favorites and international classics.",
    items: [
      ["Traditional Kitfo", "Seasoned Ethiopian minced beef served with traditional sides.", 480],
      ["Special Tibs", "Tender beef sautéed with rosemary, peppers and onions.", 520],
      ["Doro Wot", "Classic Ethiopian chicken stew with egg and injera.", 450],
      ["Grilled Chicken", "Herb-marinated chicken served with seasonal vegetables.", 550],
      ["Beef Steak", "Grilled premium beef with roasted potatoes and vegetables.", 850],
      ["Vegetarian Platter", "A selection of flavorful Ethiopian vegetarian dishes.", 380]
    ]
  },

  "Abyssinia Café": {
    subtitle: "Ethiopian coffee culture meets a relaxed modern café experience.",
    items: [
      ["Ethiopian Coffee Ceremony", "Freshly roasted Ethiopian coffee prepared traditionally.", 250],
      ["Macchiato", "Rich espresso topped with steamed milk.", 120],
      ["Cappuccino", "Espresso with steamed milk and a soft layer of foam.", 150],
      ["Ethiopian Tea", "Aromatic tea served hot with local spices.", 100],
      ["Fresh Pastry", "Freshly baked pastry selected by the chef.", 120],
      ["Club Sandwich", "Classic chicken sandwich with fries.", 350]
    ]
  },

  "Royal Lounge": {
    subtitle: "Relax with refreshing beverages in an elegant hotel atmosphere.",
    items: [
      ["Fresh Mango Juice", "Freshly prepared seasonal mango juice.", 180],
      ["Fresh Avocado Juice", "Creamy avocado blended fresh to order.", 200],
      ["Passion Fruit Mocktail", "Refreshing passion fruit blend with citrus.", 220],
      ["Abyssinia Sunset", "Signature non-alcoholic house creation.", 250],
      ["Sparkling Water", "Chilled premium sparkling water.", 100],
      ["Soft Drink", "Selection of chilled soft drinks.", 100]
    ]
  },

  "Room Service": {
    subtitle: "Enjoy food and beverages privately in the comfort of your room.",
    items: [
      ["Breakfast Basket", "Fresh bread, eggs, fruit, coffee and juice.", 450],
      ["Classic Burger", "Beef burger with cheese, vegetables and fries.", 480],
      ["Chicken Pasta", "Creamy pasta with grilled chicken.", 520],
      ["Club Sandwich", "Triple-layer chicken sandwich with fries.", 400],
      ["Fresh Fruit Plate", "Seasonal selection of fresh fruits.", 280],
      ["Coffee & Pastry", "Fresh Ethiopian coffee with a pastry.", 220]
    ]
  },

  "Breakfast": {
    subtitle: "Start your day with a choice of Ethiopian and continental favorites.",
    items: [
      ["Ethiopian Breakfast", "Chechebsa, scrambled eggs, honey and Ethiopian coffee.", 380],
      ["Continental Breakfast", "Eggs, toast, fruit, yogurt and coffee.", 420],
      ["Pancake Stack", "Fresh pancakes served with honey and seasonal fruit.", 350],
      ["Omelette", "Three-egg omelette with vegetables and cheese.", 300],
      ["Fresh Fruit Bowl", "Seasonal fresh fruit selection.", 250]
    ]
  }
};

let serviceCart = [];

function openServiceModal(serviceName) {
  const modal = document.getElementById("serviceModal");
  const title = document.getElementById("serviceModalTitle");
  const subtitle = document.getElementById("serviceModalSubtitle");
  const menu = document.getElementById("serviceMenu");

  if (!modal || !title || !subtitle || !menu) return;

  const service = serviceMenus[serviceName];

  title.textContent = serviceName;

  if (!service) {
    subtitle.textContent =
      "Our guest services team will be happy to arrange this service for you.";
    menu.innerHTML = `
      <div class="menu-item">
        <div class="menu-item-info">
          <h4>Personal Service Request</h4>
          <p>Please contact our guest services team to arrange ${serviceName.toLowerCase()}.</p>
        </div>
      </div>
    `;
  } else {
    subtitle.textContent = service.subtitle;

    serviceCart = [];

    menu.innerHTML = service.items.map((item, index) => `
      <div class="menu-item">
        <div class="menu-item-info">
          <h4>${item[0]}</h4>
          <p>${item[1]}</p>
          <span class="menu-item-price">${item[2].toLocaleString()} ETB</span>
        </div>
        <button
          class="menu-add"
          data-menu-index="${index}"
          aria-label="Add ${item[0]}"
        >+</button>
      </div>
    `).join("");

    menu.querySelectorAll(".menu-add").forEach(button => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.menuIndex);
        const item = service.items[index];

        serviceCart.push({
          name: item[0],
          price: item[2]
        });

        button.classList.add("added");
        button.textContent = "✓";

        updateServiceTotal();
      });
    });
  }

  updateServiceTotal();

  modal.classList.add("open");
}

function updateServiceTotal() {
  const total = serviceCart.reduce((sum, item) => sum + item.price, 0);
  const totalElement = document.getElementById("serviceOrderTotal");

  if (totalElement) {
    totalElement.textContent = `${total.toLocaleString()} ETB`;
  }
}

document.querySelectorAll(".service-action").forEach(button => {
  button.addEventListener("click", () => {
    openServiceModal(button.dataset.service);
  });
});

const serviceOrderBtn = document.getElementById("serviceOrderBtn");

if (serviceOrderBtn) {
  serviceOrderBtn.addEventListener("click", () => {
    if (!serviceCart.length) {
      toast("Please select an item first.");
      return;
    }

    const items = serviceCart.map(item => item.name).join(", ");

    toast(`Service request received: ${items}`);

    serviceCart = [];
    updateServiceTotal();

    const modal = document.getElementById("serviceModal");

    if (modal) {
      modal.classList.remove("open");
    }
  });
}


/* ================================
   HOTEL SERVICE REQUESTS
================================ */

async function submitServiceRequest() {
  const token = localStorage.getItem("abyssiniaToken");

  if (!token) {
    toast("Please sign in before requesting a service.");
    modal("#serviceModal", false);
    auth("login");
    return;
  }

  if (!serviceCart || !serviceCart.length) {
    toast("Please select an item first.");
    return;
  }

  const titleElement = document.getElementById("serviceModalTitle");
  const serviceName = titleElement?.textContent?.trim() || "Hotel Service";

  const button = document.getElementById("serviceOrderBtn");

  if (button) {
    button.disabled = true;
    button.textContent = "Sending...";
  }

  try {
    const response = await api("/service-requests", {
      method: "POST",
      body: JSON.stringify({
        service: serviceName,
        items: serviceCart
      })
    });

    serviceCart = [];
    updateServiceTotal();

    document.querySelectorAll(".menu-add").forEach(function (btn) {
      btn.classList.remove("added");
      btn.textContent = "Add";
    });

    const serviceModal = document.getElementById("serviceModal");

    if (serviceModal) {
      serviceModal.classList.remove("open");
    }

    toast(
      "Service request received — " +
      Number(response.total || 0).toLocaleString() +
      " ETB"
    );

  } catch (error) {
    console.error("Service request error:", error);
    toast(error.message || "Unable to send service request.");

  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = "Request Service";
    }
  }
}

document.addEventListener("click", function (event) {
  const button = event.target.closest("#serviceOrderBtn");

  if (!button) return;

  event.preventDefault();
  submitServiceRequest();
});

/* ================================
   ADMIN DASHBOARD
================================ */

async function adminDashboard() {
  modal('#adminModal');

  const content = $('#adminContent');
  content.innerHTML = '<p>Loading administration data...</p>';

  try {
    const [stats, bookings, services, messages] = await Promise.all([
      api('/admin/stats'),
      api('/admin/bookings'),
      api('/admin/service-requests'),
      api('/admin/messages')
    ]);

    const statsBox = $('#adminStats');

    if (statsBox) {
      statsBox.innerHTML = `
        <div class="admin-stat">
          <small>ROOMS</small>
          <strong>${stats.rooms}</strong>
        </div>
        <div class="admin-stat">
          <small>GUESTS</small>
          <strong>${stats.users}</strong>
        </div>
        <div class="admin-stat">
          <small>BOOKINGS</small>
          <strong>${stats.bookings}</strong>
        </div>
        <div class="admin-stat">
          <small>REVENUE</small>
          <strong>${money(stats.revenue)}</strong>
        </div>
      `;
    }

    window.aghAdminData = {
      bookings,
      services,
      messages
    };

    renderAdminTab('bookings');

  } catch (error) {
    console.error('Admin dashboard error:', error);

    content.innerHTML = `
      <div class="empty">
        <h3>Unable to load administration</h3>
        <p>${error.message || 'Please try again.'}</p>
      </div>
    `;
  }
}

function renderAdminTab(tab) {
  const content = $('#adminContent');

  if (!content || !window.aghAdminData) return;

  $$('.admin-tabs button').forEach(button => {
    button.classList.toggle(
      'active',
      button.dataset.adminTab === tab
    );
  });

  if (tab === 'bookings') {
    const bookings = window.aghAdminData.bookings;

    content.innerHTML = bookings.length
      ? bookings.map(b => `
        <div class="admin-item">
          <div>
            <small>${b.guestName} · ${b.guestEmail}</small>
            <h3>${b.roomName}</h3>
            <p>${b.checkIn} → ${b.checkOut} · ${b.guests} guest(s)</p>
            <strong>${money(b.total)}</strong>
          </div>

          <select class="admin-status" data-booking-id="${b.id}">
            ${['pending','confirmed','completed','cancelled','rejected']
              .map(status => `
                <option value="${status}" ${b.status === status ? 'selected' : ''}>
                  ${status}
                </option>
              `).join('')}
          </select>
        </div>
      `).join('')
      : '<div class="empty"><h3>No bookings</h3><p>No room reservations have been submitted yet.</p></div>';

    return;
  }

  if (tab === 'services') {
    const services = window.aghAdminData.services;

    content.innerHTML = services.length
      ? services.map(s => `
        <div class="admin-item">
          <div>
            <small>${s.guestName} · ${s.guestEmail}</small>
            <h3>${s.service}</h3>
            <p>${s.items.map(item => item.name).join(', ')}</p>
            <strong>${money(s.total)}</strong>
          </div>

          <select class="admin-service-status" data-service-id="${s.id}">
            ${['requested','preparing','completed','cancelled']
              .map(status => `
                <option value="${status}" ${s.status === status ? 'selected' : ''}>
                  ${status}
                </option>
              `).join('')}
          </select>
        </div>
      `).join('')
      : '<div class="empty"><h3>No service requests</h3><p>No hotel service requests have been submitted yet.</p></div>';

    return;
  }

  if (tab === 'messages') {
    const messages = window.aghAdminData.messages;

    content.innerHTML = messages.length
      ? messages.map(m => `
        <div class="admin-item admin-message">
          <div>
            <small>${m.name} · ${m.email}</small>
            <h3>${m.status}</h3>
            <p>${m.message}</p>
          </div>

          <button
            class="btn outline admin-message-btn"
            data-message-id="${m.id}"
            type="button">
            Mark read
          </button>
        </div>
      `).join('')
      : '<div class="empty"><h3>No messages</h3><p>There are no contact messages.</p></div>';
  }
}

async function updateAdminBooking(id, status) {
  try {
    await api('/admin/bookings/' + id + '/status', {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });

    toast('Booking status updated.');
    await adminDashboard();

  } catch (error) {
    toast(error.message);
  }
}

async function updateAdminService(id, status) {
  try {
    await api('/admin/service-requests/' + id + '/status', {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });

    toast('Service request updated.');
    await adminDashboard();

  } catch (error) {
    toast(error.message);
  }
}

async function updateAdminMessage(id) {
  try {
    await api('/admin/messages/' + id, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'read' })
    });

    toast('Message marked as read.');
    await adminDashboard();

  } catch (error) {
    toast(error.message);
  }
}

document.addEventListener('click', function(event) {

  const tab = event.target.closest('[data-admin-tab]');

  if (tab) {
    renderAdminTab(tab.dataset.adminTab);
    return;
  }

  const messageButton = event.target.closest('.admin-message-btn');

  if (messageButton) {
    updateAdminMessage(Number(messageButton.dataset.messageId));
    return;
  }

});

document.addEventListener('change', function(event) {

  const bookingSelect = event.target.closest('.admin-status');

  if (bookingSelect) {
    updateAdminBooking(
      Number(bookingSelect.dataset.bookingId),
      bookingSelect.value
    );
    return;
  }

  const serviceSelect = event.target.closest('.admin-service-status');

  if (serviceSelect) {
    updateAdminService(
      Number(serviceSelect.dataset.serviceId),
      serviceSelect.value
    );
  }

});
