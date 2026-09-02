const demo = !window.supabaseReady;
const db = window.pawSupabase;

const state = {
  user: null,
  profile: { full_name: "Guest Owner", phone: "", city: "" },
  pets: [
    {id:"demo-1",name:"Tommy",species:"Dog",breed:"Golden Retriever",age:3,weight:24,gender:"Male",emoji:"🐕",vaccination:"Rabies • Aug 2026"},
    {id:"demo-2",name:"Milo",species:"Cat",breed:"Indie",age:2,weight:4.6,gender:"Male",emoji:"🐈",vaccination:"FVRCP • Oct 2026"}
  ],
  appointments: [
    {id:"a1",pet:"Tommy",doctor:"Dr. Ananya Mehta",specialty:"General Veterinary",date:"2026-09-08",time:"11:30 AM",mode:"In-person",status:"Confirmed"},
    {id:"a2",pet:"Milo",doctor:"Dr. Rohan Shah",specialty:"Dermatology",date:"2026-09-18",time:"06:00 PM",mode:"Online",status:"Confirmed"}
  ],
  reminders: [
    {id:"r1",pet:"Tommy",title:"Rabies vaccination",type:"Vaccination",due:"2026-09-06",icon:"💉",status:"Due soon"},
    {id:"r2",pet:"Milo",title:"Monthly deworming",type:"Deworming",due:"2026-09-12",icon:"💊",status:"Upcoming"},
    {id:"r3",pet:"Tommy",title:"Grooming appointment",type:"Grooming",due:"2026-09-20",icon:"✂️",status:"Upcoming"}
  ],
  products: [
    {id:"p1",name:"Healthy Paws Adult Food",category:"Food",price:899,emoji:"🥣"},
    {id:"p2",name:"Orthopedic Comfort Bed",category:"Accessories",price:1499,emoji:"🛏️"},
    {id:"p3",name:"Interactive Treat Ball",category:"Toys",price:499,emoji:"🎾"},
    {id:"p4",name:"Daily Grooming Kit",category:"Grooming",price:699,emoji:"🧴"},
    {id:"p5",name:"Dental Care Chews",category:"Care",price:349,emoji:"🦴"},
    {id:"p6",name:"Adjustable Walking Harness",category:"Accessories",price:799,emoji:"🦮"}
  ],
  doctors: [
    {id:"d1",name:"Dr. Ananya Mehta",specialty:"General Veterinary",emoji:"👩‍⚕️",rating:"4.9",experience:"8 yrs",fee:600},
    {id:"d2",name:"Dr. Rohan Shah",specialty:"Veterinary Dermatology",emoji:"👨‍⚕️",rating:"4.8",experience:"10 yrs",fee:800},
    {id:"d3",name:"Dr. Kavya Nair",specialty:"Pet Nutrition",emoji:"👩‍⚕️",rating:"4.9",experience:"6 yrs",fee:700}
  ],
  cart: [],
  aiMessages: [{role:"ai",text:"Hi! I’m PawCare AI. Tell me what’s happening with your pet, or ask me about nutrition, routines, vaccinations, grooming or general care. I’ll keep my guidance general and recommend a vet when something may need professional attention."}],
  view:"dashboard"
};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const money = n => "₹" + Number(n).toLocaleString("en-IN");
const fmtDate = d => new Date(d+"T12:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
const initials = n => (n||"N").split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase();

function toast(message,error=false){
  const el=document.createElement("div"); el.className="toast"+(error?" error":""); el.textContent=message;
  $("#toast-root").appendChild(el); setTimeout(()=>el.remove(),2800);
}
function showView(view){
  state.view=view;
  $$(".view").forEach(v=>v.classList.remove("active-view"));
  $(`#view-${view}`).classList.add("active-view");
  $$(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.view===view));
  $("#breadcrumb").textContent={dashboard:"Overview",pets:"My Pets",appointments:"Appointments",reminders:"Reminders",shop:"Pet Store",ai:"AI Care Assistant",emergency:"Emergency Help",history:"Care History",profile:"Profile"}[view];
  if(innerWidth<761) $("#sidebar").classList.remove("open");
  renderView(view);
}
function renderView(v){({dashboard:renderDashboard,pets:renderPets,appointments:renderAppointments,reminders:renderReminders,shop:renderShop,ai:renderAI,emergency:renderEmergency,history:renderHistory,profile:renderProfile}[v])();}
$$("[data-view]").forEach(el=>el.addEventListener("click",()=>showView(el.dataset.view)));
$("#mobile-menu").onclick=()=>$("#sidebar").classList.toggle("open");

function renderDashboard(){
 const due=state.reminders.filter(r=>r.status==="Due soon").length;
 $("#notification-dot").style.display=due?"block":"none";
 $("#view-dashboard").innerHTML=`
  <div class="hero">
    <div class="hero-copy">
      <div class="eyebrow" style="color:#9fe0c4">Good to see you, ${esc(state.profile.full_name.split(" ")[0])}</div>
      <h1>Better care for every<br>paw in your family.</h1>
      <p>Track health records, book trusted veterinary care, stay ahead of reminders and get smart everyday guidance — all from one calm workspace.</p>
      <div class="hero-actions"><button class="primary" data-view="pets">+ Add a pet</button><button class="secondary" data-view="appointments">Find a veterinarian</button></div>
    </div>
  </div>
  <div class="stats">
    <div class="stat"><div class="stat-top">Pets <span class="stat-icon">🐾</span></div><strong>${state.pets.length}</strong><small>Profiles in your care</small></div>
    <div class="stat"><div class="stat-top">Upcoming visits <span class="stat-icon">◷</span></div><strong>${state.appointments.length}</strong><small>Appointments scheduled</small></div>
    <div class="stat"><div class="stat-top">Care reminders <span class="stat-icon">🔔</span></div><strong>${state.reminders.length}</strong><small>${due} need attention soon</small></div>
    <div class="stat"><div class="stat-top">Store cart <span class="stat-icon">🛍</span></div><strong>${state.cart.reduce((a,x)=>a+x.qty,0)}</strong><small>${money(state.cart.reduce((a,x)=>a+x.price*x.qty,0))} total</small></div>
  </div>
  <div class="grid-2">
    <div class="card"><div class="card-head"><h3>Your pets</h3><button class="text-link" data-view="pets">View all →</button></div>
      <div class="pet-strip">${state.pets.map(p=>`<div class="pet-mini"><div class="pet-photo">${p.emoji}</div><strong>${esc(p.name)}</strong><small>${esc(p.breed)} • ${p.age} yrs</small></div>`).join("")}</div>
    </div>
    <div class="card"><div class="card-head"><h3>Next appointment</h3><button class="text-link" data-view="appointments">Manage →</button></div>
      ${state.appointments.length?appointmentRow(state.appointments[0]):empty("No upcoming appointments","Book a veterinary consultation when you need one.")}
    </div>
  </div>
  <div class="section-title">Care radar</div>
  <div class="reminder-list">${state.reminders.slice(0,3).map(reminderRow).join("")}</div>`;
 wireViewButtons();
}
function wireViewButtons(){ $$("[data-view]").forEach(el=>{if(!el._wired){el._wired=true;el.addEventListener("click",()=>showView(el.dataset.view));}});}

function appointmentRow(a){
 const d=new Date(a.date+"T12:00:00");
 return `<div class="appt"><div class="datebox"><b>${d.getDate()}</b><span>${d.toLocaleString("en",{month:"short"})}</span></div><div class="appt-info"><strong>${esc(a.doctor)} · ${esc(a.pet)}</strong><small>${esc(a.specialty)} • ${a.time} • ${a.mode}</small></div><span class="pill">${esc(a.status)}</span></div>`;
}
function reminderRow(r){
 return `<div class="reminder"><div class="reminder-icon">${r.icon}</div><div class="reminder-info"><strong>${esc(r.title)} · ${esc(r.pet)}</strong><small>${esc(r.type)} • ${fmtDate(r.due)}</small></div><span class="due">${esc(r.status)}</span></div>`;
}
function empty(title,text){return `<div class="empty"><b>${title}</b>${text}</div>`}

function renderPets(){
 $("#view-pets").innerHTML=`<div class="page-head"><div><div class="eyebrow">Pet profiles</div><h1>My pets</h1><p>Every pet gets a complete, organized care profile.</p></div><button class="primary" id="add-pet">+ Add pet</button></div>
 <div class="pet-grid">${state.pets.map(p=>`<article class="pet-card"><div class="pet-cover"><span class="pet-tag">${esc(p.species)}</span>${p.emoji}</div><div class="pet-body"><h3>${esc(p.name)}</h3><div class="muted">${esc(p.breed)}</div><div class="meta-row"><span class="meta">${p.age} years</span><span class="meta">${p.weight} kg</span><span class="meta">${esc(p.gender)}</span></div><div class="muted">💉 ${esc(p.vaccination||"Vaccination record pending")}</div><div class="card-actions"><button class="secondary" onclick="openPet('${p.id}')">View profile</button><button class="primary" onclick="editPet('${p.id}')">Edit</button></div></div></article>`).join("")}</div>`;
 $("#add-pet").onclick=()=>openPetModal();
}
function openPet(id){const p=state.pets.find(x=>x.id===id); openPetModal(p)}
function editPet(id){const p=state.pets.find(x=>x.id===id);openPetModal(p)}
function openPetModal(p=null){
 openModal(`<div class="modal-head"><h2>${p?"Edit pet profile":"Add a pet"}</h2><button class="close" id="close-modal">×</button></div>
 <div class="form-grid">
 <div class="field"><label>Pet name</label><input id="f-name" value="${esc(p?.name||"")}"></div>
 <div class="field"><label>Species</label><select id="f-species"><option>Dog</option><option>Cat</option><option>Bird</option><option>Rabbit</option><option>Other</option></select></div>
 <div class="field"><label>Breed</label><input id="f-breed" value="${esc(p?.breed||"")}"></div>
 <div class="field"><label>Age (years)</label><input id="f-age" type="number" min="0" value="${p?.age||""}"></div>
 <div class="field"><label>Weight (kg)</label><input id="f-weight" type="number" step=".1" value="${p?.weight||""}"></div>
 <div class="field"><label>Gender</label><select id="f-gender"><option>Male</option><option>Female</option></select></div>
 <div class="field"><label>Vaccination summary</label><input id="f-vax" value="${esc(p?.vaccination||"")}"></div>
 <div class="field"><label>Pet icon</label><select id="f-emoji"><option>🐕</option><option>🐈</option><option>🐇</option><option>🦜</option><option>🐾</option></select></div>
 </div><div class="modal-actions"><button class="secondary" id="cancel-modal">Cancel</button><button class="primary" id="save-pet">Save profile</button></div>`);
 $("#f-species").value=p?.species||"Dog";$("#f-gender").value=p?.gender||"Male";$("#f-emoji").value=p?.emoji||"🐕";
 $("#close-modal").onclick=closeModal;$("#cancel-modal").onclick=closeModal;
 $("#save-pet").onclick=async()=>{
   const obj={name:$("#f-name").value.trim(),species:$("#f-species").value,breed:$("#f-breed").value.trim(),age:Number($("#f-age").value)||0,weight:Number($("#f-weight").value)||0,gender:$("#f-gender").value,vaccination:$("#f-vax").value.trim(),emoji:$("#f-emoji").value};
   if(!obj.name||!obj.breed)return toast("Please add a pet name and breed.",true);
   if(p){Object.assign(p,obj)}else{state.pets.push({id:crypto.randomUUID(),...obj})}
   if(!demo) await savePetToDb(obj,p?.id);
   closeModal();toast(p?"Pet profile updated":"Pet added to your family");renderPets();
 }
}
async function savePetToDb(obj,id){
 try{
  if(id) await db.from("pets").update({name:obj.name,species:obj.species,breed:obj.breed,age_years:obj.age,weight_kg:obj.weight,gender:obj.gender}).eq("id",id);
  else await db.from("pets").insert({owner_id:state.user.id,name:obj.name,species:obj.species,breed:obj.breed,age_years:obj.age,weight_kg:obj.weight,gender:obj.gender});
 }catch(e){console.warn(e)}
}

function renderAppointments(){
 $("#view-appointments").innerHTML=`<div class="page-head"><div><div class="eyebrow">Veterinary care</div><h1>Appointments</h1><p>Choose online or in-person care and book a time that works.</p></div></div>
 <div class="section-title">Upcoming</div><div class="card">${state.appointments.length?state.appointments.map(appointmentRow).join(""):empty("Nothing booked yet","Your upcoming veterinary appointments will appear here.")}</div>
 <div class="section-title">Find a veterinarian</div><div class="toolbar"><input class="search" id="doctor-search" placeholder="Search by name or specialty..."></div><div class="doctor-grid" id="doctor-grid">${state.doctors.map(doctorCard).join("")}</div>`;
 $("#doctor-search").oninput=e=>renderDoctorGrid(e.target.value);
}
function renderDoctorGrid(q=""){const list=state.doctors.filter(d=>(d.name+d.specialty).toLowerCase().includes(q.toLowerCase()));$("#doctor-grid").innerHTML=list.map(doctorCard).join("")||empty("No matching veterinarian","Try another specialty or name.")}
function doctorCard(d){return `<article class="doctor-card"><div class="doctor-cover">${d.emoji}</div><div class="doctor-body"><div class="specialty">${esc(d.specialty)}</div><h3>${esc(d.name)}</h3><div class="muted">${d.experience} experience • ${money(d.fee)} consultation</div><div class="rating">★ ${d.rating} · Trusted by pet parents</div><div class="slot-row"><button class="slot" onclick="bookAppointment('${d.id}','10:00 AM')">10:00 AM</button><button class="slot" onclick="bookAppointment('${d.id}','01:30 PM')">01:30 PM</button><button class="slot" onclick="bookAppointment('${d.id}','06:00 PM')">06:00 PM</button></div></div></article>`}
function bookAppointment(id,time){const d=state.doctors.find(x=>x.id===id);openModal(`<div class="modal-head"><h2>Book consultation</h2><button class="close" id="close-modal">×</button></div><div class="muted">${esc(d.name)} · ${esc(d.specialty)}</div><div class="form-grid" style="margin-top:16px"><div class="field"><label>Pet</label><select id="book-pet">${state.pets.map(p=>`<option>${esc(p.name)}</option>`).join("")}</select></div><div class="field"><label>Date</label><input id="book-date" type="date" value="2026-09-10"></div><div class="field"><label>Time</label><input value="${time}" disabled></div><div class="field"><label>Mode</label><select id="book-mode"><option>In-person</option><option>Online</option></select></div></div><div class="modal-actions"><button class="secondary" id="cancel-modal">Cancel</button><button class="primary" id="confirm-book">Confirm booking</button></div>`);
 $("#close-modal").onclick=closeModal;$("#cancel-modal").onclick=closeModal;$("#confirm-book").onclick=async()=>{const a={id:crypto.randomUUID(),pet:$("#book-pet").value,doctor:d.name,specialty:d.specialty,date:$("#book-date").value,time,mode:$("#book-mode").value,status:"Confirmed"};state.appointments.push(a);if(!demo)await db.from("appointments").insert({owner_id:state.user.id,pet_name:a.pet,doctor_name:a.doctor,specialty:a.specialty,appointment_date:a.date,appointment_time:a.time,mode:a.mode,status:"confirmed"});closeModal();toast("Appointment confirmed");renderAppointments()}}
function renderReminders(){$("#view-reminders").innerHTML=`<div class="page-head"><div><div class="eyebrow">Stay ahead</div><h1>Care reminders</h1><p>Vaccinations, medicines, grooming and routine checkups — without the mental load.</p></div><button class="primary" id="add-reminder">+ Add reminder</button></div><div class="reminder-list">${state.reminders.map(reminderRow).join("")}</div>`;$("#add-reminder").onclick=()=>openReminderModal()}
function openReminderModal(){openModal(`<div class="modal-head"><h2>Create a reminder</h2><button class="close" id="close-modal">×</button></div><div class="form-grid"><div class="field"><label>Pet</label><select id="r-pet">${state.pets.map(p=>`<option>${esc(p.name)}</option>`).join("")}</select></div><div class="field"><label>Type</label><select id="r-type"><option>Vaccination</option><option>Medicine</option><option>Deworming</option><option>Grooming</option><option>Checkup</option></select></div><div class="field full"><label>Reminder title</label><input id="r-title" placeholder="e.g. Flea treatment"></div><div class="field"><label>Due date</label><input id="r-date" type="date"></div></div><div class="modal-actions"><button class="secondary" id="cancel-modal">Cancel</button><button class="primary" id="save-reminder">Create reminder</button></div>`);$("#close-modal").onclick=closeModal;$("#cancel-modal").onclick=closeModal;$("#save-reminder").onclick=()=>{const title=$("#r-title").value.trim();if(!title)return toast("Add a reminder title.",true);state.reminders.push({id:crypto.randomUUID(),pet:$("#r-pet").value,title,type:$("#r-type").value,due:$("#r-date").value||"2026-09-30",icon:$("#r-type").value==="Vaccination"?"💉":"💊",status:"Upcoming"});closeModal();toast("Reminder created");renderReminders()}}

function renderShop(){const cats=["All","Food","Toys","Grooming","Accessories","Care"];$("#view-shop").innerHTML=`<div class="page-head"><div><div class="eyebrow">Curated essentials</div><h1>Pet store</h1><p>Useful everyday products for happier, healthier pets.</p></div></div><div class="toolbar"><input class="search" id="product-search" placeholder="Search products..."><select class="select" id="product-cat">${cats.map(c=>`<option>${c}</option>`).join("")}</select></div><div class="product-grid" id="product-grid">${state.products.map(productCard).join("")}</div>${state.cart.length?`<button class="cart-float" id="open-cart">🛍 ${state.cart.reduce((a,x)=>a+x.qty,0)} · ${money(state.cart.reduce((a,x)=>a+x.price*x.qty,0))}</button>`:""}`;const filter=()=>{const q=$("#product-search").value.toLowerCase(),c=$("#product-cat").value;$("#product-grid").innerHTML=state.products.filter(p=>(p.name+p.category).toLowerCase().includes(q)&&(c==="All"||p.category===c)).map(productCard).join("")};$("#product-search").oninput=filter;$("#product-cat").onchange=filter;if(state.cart.length)$("#open-cart").onclick=openCart}
function productCard(p){return `<article class="product-card"><div class="product-image"><span class="category">${esc(p.category)}</span>${p.emoji}</div><div class="product-body"><h3>${esc(p.name)}</h3><div class="muted">Carefully selected for everyday pet routines.</div><div class="price">${money(p.price)}</div><div class="card-actions"><button class="primary" onclick="addToCart('${p.id}')">Add to cart</button><button class="secondary" onclick="quickBuy('${p.id}')">Buy now</button></div></div></article>`}
function addToCart(id){const p=state.products.find(x=>x.id===id),x=state.cart.find(x=>x.id===id);x?x.qty++:state.cart.push({...p,qty:1});toast(`${p.name} added to cart`);renderShop()}
function quickBuy(id){addToCart(id);openCart()}
function openCart(){openModal(`<div class="modal-head"><h2>Your cart</h2><button class="close" id="close-modal">×</button></div>${state.cart.map(x=>`<div class="appt"><div style="font-size:28px">${x.emoji}</div><div class="appt-info"><strong>${esc(x.name)}</strong><small>${money(x.price)} × ${x.qty}</small></div><button class="danger" onclick="removeCart('${x.id}')">Remove</button></div>`).join("")}<div style="display:flex;justify-content:space-between;margin-top:17px;font-weight:800"><span>Total</span><span>${money(state.cart.reduce((a,x)=>a+x.price*x.qty,0))}</span></div><div class="modal-actions"><button class="secondary" id="cancel-modal">Continue shopping</button><button class="primary" id="checkout">Checkout</button></div>`);$("#close-modal").onclick=closeModal;$("#cancel-modal").onclick=closeModal;$("#checkout").onclick=checkout}
function removeCart(id){state.cart=state.cart.filter(x=>x.id!==id);closeModal();renderShop();if(state.cart.length)openCart()}
function checkout(){closeModal();toast("Demo checkout complete — connect your payment provider for live orders.");state.cart=[];renderShop()}

function renderAI(){$("#view-ai").innerHTML=`<div class="page-head"><div><div class="eyebrow">Smart guidance</div><h1>AI Care Assistant</h1><p>Ask everyday pet-care questions. PawCare AI is educational, not a replacement for a veterinarian.</p></div></div><div class="ai-layout"><div class="chat"><div class="chat-head"><div class="ai-dot">✦</div><div><strong>PawCare AI</strong><small>General care guidance · online</small></div></div><div class="messages" id="messages">${state.aiMessages.map(m=>`<div class="message ${m.role}">${esc(m.text).replace(/\n/g,"<br>")}</div>`).join("")}</div><form class="chat-input" id="ai-form"><input id="ai-input" placeholder="Ask about your pet..."><button>↑</button></form></div><div class="card"><div class="card-head"><h3>Try asking</h3></div><div class="prompt-list">${["My dog is scratching frequently. What could cause it?","Suggest a daily care routine for my puppy.","What should I consider when choosing pet food?","What vaccinations should I discuss with my vet?"].map(x=>`<button class="prompt" onclick="askAI(${JSON.stringify(x)})">${x}</button>`).join("")}</div><div class="section-title" style="font-size:13px">Safety first</div><div class="muted">For breathing trouble, poisoning, seizures, severe bleeding, collapse or other emergencies, contact an emergency veterinarian immediately.</div></div></div>`;$("#ai-form").onsubmit=e=>{e.preventDefault();const x=$("#ai-input").value.trim();if(x)askAI(x)}}
async function askAI(text){state.aiMessages.push({role:"user",text});renderAI();const box=$("#messages");box.scrollTop=box.scrollHeight;let reply;if(!demo){try{const {data,error}=await db.functions.invoke("pet-ai",{body:{message:text,pet:state.pets[0]||null}});if(error)throw error;reply=data.reply}catch(e){reply=localAI(text)}}else reply=localAI(text);state.aiMessages.push({role:"ai",text:reply});renderAI();$("#messages").scrollTop=$("#messages").scrollHeight}
function localAI(t){const x=t.toLowerCase();if(x.includes("scratch"))return"Frequent scratching can have several causes, including fleas or other parasites, allergies, dry or irritated skin, infection, or environmental triggers. Check for visible fleas, redness, sores or hair loss, but avoid applying human creams or medicines. If the scratching is persistent, severe, causes wounds, or comes with swelling or breathing changes, arrange veterinary care promptly.";if(x.includes("food")||x.includes("nutrition"))return"Choose food based on species, life stage, activity level and any known medical needs. Look for a complete and balanced diet appropriate for your pet. A veterinarian can help tailor portions and ingredients, especially for growing, senior or medically complex pets.";if(x.includes("routine"))return"A simple routine can include fresh water, measured meals, exercise/play, dental care, grooming, mental enrichment and a quick daily health check. Keep vaccinations, parasite prevention and veterinary checkups on a calendar.";return"I can give general pet-care information, but I can’t diagnose a condition. Tell me your pet’s species, age, symptoms, how long they’ve been happening and anything that changed recently. If your pet seems seriously unwell, contact a veterinarian rather than relying on chat guidance."}

function renderEmergency(){$("#view-emergency").innerHTML=`<div class="page-head"><div><div class="eyebrow">Fast access</div><h1>Emergency help</h1><p>Find veterinary support quickly when something feels urgent.</p></div></div><div class="emergency-grid"><div class="emergency-banner"><div class="eyebrow" style="color:#c26859">Urgent situation?</div><h2>Don't wait if your pet is in serious distress.</h2><p>For collapse, severe breathing difficulty, uncontrolled bleeding, suspected poisoning, repeated seizures or major trauma, contact an emergency veterinarian immediately.</p><button class="primary" style="background:#b95849" onclick="window.location.href='tel:112'">Call emergency services</button></div><div><div class="card-head"><h3>Nearby veterinary support</h3></div>${["24/7 Animal Emergency Centre","City Veterinary Hospital","Paws & Claws Emergency Clinic"].map((x,i)=>`<div class="clinic"><div class="clinic-icon">🏥</div><div class="clinic-body"><strong>${x}</strong><small>${i===0?"Open 24 hours":"Open today · Emergency care"} • ${i+1}.${i} km away</small><div class="clinic-actions"><button onclick="window.open('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('${x}'))">Directions</button><button onclick="toast('Call the clinic from its verified contact listing.')">Call</button></div></div></div>`).join("")}</div></div>`}
function renderHistory(){$("#view-history").innerHTML=`<div class="page-head"><div><div class="eyebrow">Health timeline</div><h1>Care history</h1><p>A simple timeline of appointments, vaccinations and notes.</p></div></div><table class="history-table"><thead><tr><th>Date</th><th>Pet</th><th>Event</th><th>Provider</th><th>Status</th></tr></thead><tbody>${[["28 Aug 2026","Tommy","General checkup","Dr. Ananya Mehta","Completed"],["12 Aug 2026","Milo","FVRCP vaccination","City Vet Hospital","Completed"],["03 Jul 2026","Tommy","Grooming","Paw Spa","Completed"],["16 Jun 2026","Milo","Dermatology consultation","Dr. Rohan Shah","Completed"]].map(r=>`<tr>${r.map((c,i)=>`<td>${i===4?`<span class="pill">${c}</span>`:esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`}
function renderProfile(){$("#view-profile").innerHTML=`<div class="page-head"><div><div class="eyebrow">Account</div><h1>Your profile</h1><p>Manage your pet-parent details and account preferences.</p></div></div><div class="profile-grid"><div class="card profile-card"><div class="profile-big">${initials(state.profile.full_name)}</div><h3 style="margin:0;font-family:Manrope">${esc(state.profile.full_name)}</h3><div class="muted">Pet parent</div><div class="meta-row" style="justify-content:center"><span class="meta">${state.pets.length} pets</span><span class="meta">${state.appointments.length} visits</span></div></div><div class="card"><div class="card-head"><h3>Personal details</h3></div><div class="form-grid"><div class="field"><label>Full name</label><input id="profile-name" value="${esc(state.profile.full_name)}"></div><div class="field"><label>Phone</label><input id="profile-phone" value="${esc(state.profile.phone)}"></div><div class="field"><label>City</label><input id="profile-city" value="${esc(state.profile.city)}"></div></div><div class="modal-actions"><button class="primary" id="save-profile">Save changes</button></div></div></div>`;$("#save-profile").onclick=async()=>{state.profile.full_name=$("#profile-name").value.trim()||"Pet Owner";state.profile.phone=$("#profile-phone").value;state.profile.city=$("#profile-city").value;updateIdentity();if(!demo&&state.user)await db.from("profiles").upsert({id:state.user.id,full_name:state.profile.full_name,phone:state.profile.phone,city:state.profile.city});toast("Profile updated");renderProfile()}}
function updateIdentity(){const n=state.profile.full_name;$("#side-name").textContent=n;$("#top-name").textContent=n;$("#side-avatar").textContent=initials(n);$("#top-avatar").textContent=initials(n)}
function openModal(html){$("#modal").innerHTML=html;$("#modal-backdrop").classList.add("open")}
function closeModal(){$("#modal-backdrop").classList.remove("open")}
$("#modal-backdrop").addEventListener("click",e=>{if(e.target.id==="modal-backdrop")closeModal()});

async function init(){
 if(!demo){
   const {data:{session}}=await db.auth.getSession();
   if(!session){renderLogin();return}
   state.user=session.user;
   await loadCloud();
 }else{
   // Demo mode makes the UI immediately explorable before Supabase is connected.
 }
 updateIdentity();renderDashboard();
}
async function loadCloud(){
 try{
  const p=await db.from("profiles").select("*").eq("id",state.user.id).maybeSingle();if(p.data)state.profile={...state.profile,...p.data};
  const pets=await db.from("pets").select("*").eq("owner_id",state.user.id).order("created_at",{ascending:false});
  if(pets.data?.length)state.pets=pets.data.map(p=>({...p,age:p.age_years,weight:p.weight_kg,emoji:p.species==="Cat"?"🐈":"🐕",vaccination:"Record available"}));
 }catch(e){console.warn(e)}
}
function renderLogin(){
 document.body.innerHTML=`<div class="login-screen"><div class="login-card"><div class="brand"><div class="brand-mark">🐾</div><div><strong>PawCare</strong><span>Pet health, simplified</span></div></div><div class="eyebrow">Welcome back</div><h1>Your pet's care, together.</h1><p>Sign in to manage pets, appointments, reminders and smart care guidance.</p><form class="login-form" id="login-form"><div class="field"><label>Email</label><input id="login-email" type="email" required placeholder="you@example.com"></div><div class="field"><label>Password</label><input id="login-password" type="password" required placeholder="••••••••"></div><button class="primary">Sign in</button></form><button class="secondary" id="signup" style="width:100%;margin-top:9px">Create account</button><div class="demo-note">Authentication is powered by Supabase.</div></div></div>`;
 $("#login-form").onsubmit=async e=>{e.preventDefault();const {error}=await db.auth.signInWithPassword({email:$("#login-email").value,password:$("#login-password").value});if(error)toast(error.message,true);else location.reload()};
 $("#signup").onclick=async()=>{const email=$("#login-email").value.trim(),password=$("#login-password").value;if(!email||password.length<6)return toast("Enter an email and a 6+ character password.",true);const {error}=await db.auth.signUp({email,password});if(error)toast(error.message,true);else toast("Account created. Check your email if confirmation is enabled.")};
}
$("#logout-btn").onclick=async()=>{if(!demo)await db.auth.signOut();location.reload()};
window.openPet=openPet;window.editPet=editPet;window.bookAppointment=bookAppointment;window.addToCart=addToCart;window.quickBuy=quickBuy;window.removeCart=removeCart;window.askAI=askAI;
init();
