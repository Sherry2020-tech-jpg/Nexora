
const IMG={
headphones:"img/headphones.jpg",
smartwatch:"img/smartwatch.jpg",
laptop:"img/laptop.jpg",
phone:"img/phone.jpg",
jacket:"img/jacket.jpg",
shoes:"img/shoes.jpg",
kurti:"img/kurti.jpg",
bag:"img/bag.jpg",
airfryer:"img/airfryer.jpg",
dinner:"img/dinner.jpg",
lipstick:"img/lipstick.jpg",
skincare:"img/skincare.jpg",
football:"img/football.jpg",
yoga:"img/yoga.jpg",
books:"img/books.jpg",
mouse:"img/mouse.jpg",
speaker:"img/speaker.jpg",
monitor:"img/monitor.jpg",
watch:"img/watch.jpg",
sunglasses:"img/sunglasses.jpg",
hoodie:"img/hoodie.jpg",
perfume:"img/perfume.jpg",
bat:"img/bat.jpg",
wallclock:"img/wallclock.jpg",
kettle:"img/kettle.jpg"
};

/* =====================================================================
   EMBEDDED DATABASE ENGINE  (zero dependencies — works fully offline)
   A small relational store: tables = arrays of row objects, persisted
   to browser localStorage. Supports the full app: users, categories,
   products, orders, order_items, cart, wishlist, reviews, coupons, otp.
   ===================================================================== */
const DB = { data:null };
function dbNew(){
  return { users:[], categories:[], products:[], orders:[], order_items:[], cart:[], wishlist:[], reviews:[], coupons:[], otp_codes:[] };
}
function dbLoad(){
  try{ const raw=localStorage.getItem('svdb_v7'); DB.data = raw?JSON.parse(raw):null; }catch(e){ DB.data=null; }
  if(!DB.data || !DB.data.users || !DB.data.users.length){ DB.data=dbNew(); seedData(); dbSave(); }
}
function dbSave(){ try{ localStorage.setItem('svdb_v7', JSON.stringify(DB.data)); }catch(e){} }

/* One-click restore of fresh demo data — perfect for presentations */
function restoreDemoData(){
  if(!confirm('Reset all data?\n\nEverything will return to the original sample state (products, orders, reviews, accounts).')) return;
  DB.data = dbNew(); seedData(); dbSave();
  toast('Data reset ✔ Fresh start ready!');
  if(getSession() && !DB.data.users.find(u=>u.id===getSession().id)) setSession(null);
  renderNav(); route();
}
function nowStr(){ const d=new Date(),p=n=>String(n).padStart(2,'0'); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`; }
function ins(table,obj){
  const t=DB.data[table]; const row=Object.assign({},obj);
  if(table!=='coupons' && table!=='wishlist'){
    row.id = t.reduce((m,r)=>Math.max(m,r.id||0),0)+1;
  }
  if(['users','products','orders','reviews','otp_codes'].includes(table) && !row.created_at) row.created_at=nowStr();
  t.push(row); dbSave(); return row;
}
function upd(table,id,patch){ const r=DB.data[table].find(x=>x.id===id); if(r) Object.assign(r,patch); dbSave(); return r; }
function delW(table,fn){ DB.data[table]=DB.data[table].filter(fn); dbSave(); }

function seedData(){
  ins('users',{name:'Admin',email:'abbasisahab562@gmail.com',phone:null,password:'Sheeraz2023',is_admin:1});
  ins('users',{name:'Ali Khan',email:'ali@example.com',phone:null,password:'demo123',is_admin:0});
  ins('users',{name:'Sara Ahmed',email:null,phone:'03001234567',password:'demo123',is_admin:0});
  // Fake reviewers (different names from order customers - looks like real people)
  [['Hassan Raza','hassan.raza@gmail.com'],['Fatima Noor','fatima.noor@yahoo.com'],
   ['Usman Tariq','usman.tariq@gmail.com'],['Ayesha Malik','ayesha.malik@hotmail.com'],
   ['Bilal Hussain','bilal.h@gmail.com'],['Hira Shahid','hira.shahid@gmail.com'],
   ['Daniyal Akhtar','daniyal.akhtar@yahoo.com'],['Mahnoor Aslam','mahnoor.aslam@gmail.com'],
   ['Zainab Qureshi','zainab.q@gmail.com'],['Ahmed Sheikh','ahmed.sheikh@hotmail.com'],
   ['Komal Rizvi','komal.rizvi@gmail.com'],['Fahad Javed','fahad.javed@yahoo.com'],
   ['Iqra Bano','iqra.bano@gmail.com'],['Saad Naeem','saad.naeem@yahoo.com'],['Mariam Aziz','mariam.aziz@hotmail.com']
  ].forEach((u,i)=>ins('users',{name:u[0],email:u[1],phone:null,password:'demo123',is_admin:0}));
  [['Electronics','💻'],['Fashion','👗'],['Home & Living','🏠'],['Beauty','💄'],['Sports','⚽'],['Books','📚']]
    .forEach(c=>ins('categories',{name:c[0],emoji:c[1]}));
  [
    ["Wireless Bluetooth Headphones",1,3499,4999,25,"Premium sound with deep bass, 30-hour battery life, active noise cancellation and comfortable over-ear fit.","headphones",1],
    ["Smart Watch Series 5",1,8999,12999,15,"AMOLED display, heart-rate & SpO2 monitoring, built-in GPS, 7-day battery and 100+ sport modes.","smartwatch",1],
    ["Gaming Laptop Pro 15",1,154999,179999,8,"RTX 4060, Intel i7 13th Gen, 16GB RAM, 512GB SSD, 15.6 inch 144Hz display, RGB keyboard.","laptop",1],
    ["Smartphone X12 5G",1,74999,84999,20,"8GB RAM, 128GB storage, 108MP triple camera, 5000mAh battery with 67W fast charging.","phone",1],
    ["Denim Jacket Classic",2,2999,4599,40,"Stylish slim-fit denim jacket in premium quality stone-washed fabric.","jacket",1],
    ["Running Shoes Flex",2,4999,6999,30,"Lightweight breathable mesh upper, superior grip sole, all-day comfort cushioning.","shoes",1],
    ["Cotton Kurti Embroidered",2,1899,2799,50,"Elegant machine-embroidered kurti in soft premium cotton.","kurti",0],
    ["Leather Handbag",2,4299,5999,18,"Genuine leather tote with spacious compartments and gold-tone hardware.","bag",0],
    ["Air Fryer 5.5L Digital",3,11499,14999,12,"Digital touch panel, 80% less oil, 8 cooking presets, dishwasher-safe basket.","airfryer",1],
    ["Ceramic Dinner Set 24pc",3,5999,8999,22,"Premium ceramic 24-piece set, microwave & dishwasher safe, elegant finish.","dinner",0],
    ["Matte Lipstick Set (6 Shades)",4,1499,2499,60,"Six long-lasting matte shades enriched with vitamin E, smudge-proof up to 12 hours.","lipstick",1],
    ["Skincare Glow Kit",4,3499,5499,25,"Complete 4-step routine: cleanser, toner, vitamin-C serum and moisturizer.","skincare",0],
    ["Football Professional",5,2299,3499,35,"Match-quality hand-stitched football, all-weather durable PU leather.","football",0],
    ["Yoga Mat Pro 6mm",5,1999,2999,28,"Non-slip extra-thick 6mm mat, eco-friendly TPE, includes carrying strap.","yoga",1],
    ["Novel: The Silent Patient",6,1199,1799,45,"Alex Michaelides bestselling psychological thriller, paperback edition.","books",0],
    ["Wireless Gaming Mouse RGB",1,1999,2999,40,"Ergonomic wireless mouse with RGB lighting, 6 programmable buttons, 4000 DPI precision sensor.","mouse",0],
    ["Bluetooth Speaker Bass+",1,5499,7999,22,"Powerful 20W stereo sound, deep bass radiators, 24-hour playtime, IPX6 water resistant.","speaker",1],
    ["LED Monitor 24 inch Full HD",1,32999,39999,10,"75Hz IPS panel, ultra-slim bezels, eye-care technology, HDMI & VGA ports.","monitor",0],
    ["Classic Leather Watch Men",2,6499,9499,15,"Premium chronograph dial, genuine leather strap, 5ATM water resistance, quartz movement.","watch",1],
    ["Aviator Sunglasses UV400",2,1799,2799,45,"Polarized UV400 protection lenses, gold metal frame, classic aviator style with hard case.","sunglasses",0],
    ["Winter Hoodie Fleece",2,2499,3999,30,"Ultra-soft fleece-lined hoodie, kangaroo pocket, adjustable drawstring, unisex fit.","hoodie",1],
    ["Perfume Oud Royal 100ml",4,5299,7499,14,"Luxurious oriental oud fragrance, long-lasting 12-hour scent, premium gift packaging.","perfume",1],
    ["Cricket Bat English Willow",5,5999,8999,12,"Grade-A English willow, thick edges, balanced pickup, ready-to-play with toe guard.","bat",0],
    ["Elegant Wall Clock 12 inch",3,2499,3499,25,"Silent sweep movement, modern minimalist design, easy wall mounting, glass lens.","wallclock",0],
    ["Electric Kettle 1.8L",3,3499,4999,18,"Fast-boil 1500W, auto shut-off, cool-touch handle, 360° cordless base, stainless steel.","kettle",0]
  ].forEach(p=>ins('products',{name:p[0],category_id:p[1],price:p[2],old_price:p[3],stock:p[4],description:p[5],image:p[6],featured:p[7]}));
  ins('coupons',{code:'WELCOME10',discount_pct:10,active:1});
  ins('coupons',{code:'SAVE20',discount_pct:20,active:1});
  ins('coupons',{code:'FLAT50',discount_pct:50,active:0});
  // 15 realistic reviews from different people (user 2,3 = order customers; 4-15 = reviewers)
  ins('reviews',{product_id:1,user_id:4,rating:5,comment:'Amazing sound quality, bass is next level! Totally worth the price.'});
  ins('reviews',{product_id:1,user_id:5,rating:4,comment:'Great battery life, easily lasts 3-4 days. Very comfortable for long use.'});
  ins('reviews',{product_id:1,user_id:6,rating:5,comment:'Ordered on Monday, delivered Wednesday. Packaging was top class. Highly recommended!'});
  ins('reviews',{product_id:1,user_id:7,rating:3,comment:'Sound is good but ear cushions feel a bit tight for the first week. Overall decent.'});
  ins('reviews',{product_id:2,user_id:8,rating:5,comment:'The AMOLED screen is beautiful and battery really lasts a week. Best smartwatch in this range.'});
  ins('reviews',{product_id:2,user_id:9,rating:4,comment:'Bought for my father, he loves the heart-rate feature. Strap quality could be better.'});
  ins('reviews',{product_id:3,user_id:10,rating:5,comment:'RTX 4060 handles every game on ultra settings. FPS stays above 100 in GTA V.'});
  ins('reviews',{product_id:3,user_id:11,rating:4,comment:'Excellent laptop for the price. Gets a little warm while rendering videos, otherwise perfect.'});
  ins('reviews',{product_id:4,user_id:12,rating:5,comment:'Camera is outstanding and the phone is super fast. Charging 0 to 100 in 40 minutes!'});
  ins('reviews',{product_id:4,user_id:13,rating:4,comment:'Display is crisp, performance smooth. Only wish the box had a charger included.'});
  ins('reviews',{product_id:4,user_id:14,rating:5,comment:'Upgraded from an old phone, what a difference! Best purchase this year.'});
  ins('reviews',{product_id:5,user_id:15,rating:4,comment:'Denim quality is premium, fits perfectly. Got many compliments at university.'});
  ins('reviews',{product_id:6,user_id:16,rating:5,comment:'Super light and grippy, my morning runs feel much better now. True to size.'});
  ins('reviews',{product_id:9,user_id:17,rating:5,comment:'Air fryer changed our kitchen! Crispy fries with 80% less oil, kids love it.'});
  ins('reviews',{product_id:9,user_id:18,rating:4,comment:'Very easy to use, digital panel is responsive. Basket size is perfect for a family of 4.'});
  const o1=ins('orders',{user_id:2,total:6299,subtotal:6999,discount:700,coupon:'WELCOME10',status:'Delivered',payment:'Cash on Delivery',address:'House 12, Street 4, DHA Phase 5',city:'Karachi',phone:'03001112222',created_at:'2026-08-10 14:22:00'});
  ins('order_items',{order_id:o1.id,product_id:1,qty:1,price:3499});
  ins('order_items',{order_id:o1.id,product_id:14,qty:2,price:1400});
  const o2=ins('orders',{user_id:3,total:8999,subtotal:8999,discount:0,coupon:null,status:'Shipped',payment:'Credit/Debit Card',address:'Flat 3B, Clifton Block 5',city:'Karachi',phone:'03003334444',created_at:'2026-09-02 11:05:00'});
  ins('order_items',{order_id:o2.id,product_id:2,qty:1,price:8999});
  const o3=ins('orders',{user_id:2,total:74999,subtotal:74999,discount:0,coupon:null,status:'Confirmed',payment:'Cash on Delivery',address:'House 12, Street 4, DHA Phase 5',city:'Karachi',phone:'03001112222',created_at:'2026-09-28 18:40:00'});
  ins('order_items',{order_id:o3.id,product_id:4,qty:1,price:74999});
  // ---- Extra sample orders across last 6 months (May-Oct 2026) for realistic reports ----
  const demoOrders=[
    [4,  [[1,1],[13,1]],            'WELCOME10','Delivered','Cash on Delivery','2026-05-14 11:30:00'],
    [5,  [[4,1]],                   null,       'Delivered','Credit/Debit Card','2026-05-27 16:45:00'],
    [6,  [[3,1],[6,1]],             'SAVE20',   'Delivered','Cash on Delivery','2026-06-08 13:20:00'],
    [7,  [[9,1],[10,1]],            null,       'Delivered','Cash on Delivery','2026-06-19 19:05:00'],
    [8,  [[3,1]],                   null,       'Delivered','Credit/Debit Card','2026-07-02 12:10:00'],
    [9,  [[2,1],[8,1],[14,1]],      'WELCOME10','Delivered','Cash on Delivery','2026-07-15 15:40:00'],
    [10, [[4,1]],                   null,       'Shipped',  'Credit/Debit Card','2026-07-28 10:25:00'],
    [11, [[5,1],[6,1],[7,1]],       null,       'Delivered','Cash on Delivery','2026-08-06 17:55:00'],
    [9,  [[3,1],[4,1]],              'SAVE20',   'Delivered','Credit/Debit Card','2026-08-18 15:10:00'],
    [12, [[16,1],[17,1]],           'SAVE20',   'Delivered','Cash on Delivery','2026-08-22 14:15:00'],
    [13, [[18,1],[20,1]],           null,       'Shipped',  'Credit/Debit Card','2026-09-05 11:50:00'],
    [14, [[3,1]],                   null,       'Delivered','Cash on Delivery','2026-09-12 20:30:00'],
    [15, [[4,1],[11,2]],            'WELCOME10','Delivered','Cash on Delivery','2026-09-25 09:15:00'],
    [2,  [[19,1],[21,1],[22,1]],    'SAVE20',   'Confirmed','Credit/Debit Card','2026-10-03 13:35:00'],
    [3,  [[3,1]],                   null,       'Shipped',  'Cash on Delivery','2026-10-09 18:20:00'],
    [4,  [[23,1],[24,1],[25,1]],    'WELCOME10','Pending',  'Cash on Delivery','2026-10-14 12:00:00'],
  ];
  demoOrders.forEach(od=>{
    const uid=od[0], items=od[1], cpn=od[2], st=od[3], pay=od[4], dt=od[5];
    const subtotal=items.reduce((a,it)=>{ const p=DB.data.products.find(x=>x.id===it[0]); return a+(p?p.price*it[1]:0); },0);
    const pct=cpn?((DB.data.coupons.find(c=>c.code===cpn)||{}).discount_pct||0):0;
    const discount=Math.round(subtotal*pct/100);
    const shipping=subtotal-discount>=3000?0:199;
    const o=ins('orders',{user_id:uid,total:subtotal-discount+shipping,subtotal,discount,coupon:cpn,status:st,payment:pay,address:'House 21, Street 8, Gulshan-e-Iqbal',city:'Karachi',phone:'03005556666',created_at:dt});
    items.forEach(it=>{ const p=DB.data.products.find(x=>x.id===it[0]); ins('order_items',{order_id:o.id,product_id:it[0],qty:it[1],price:p?p.price:0}); });
  });

}

/* ================= HELPERS ================= */
function esc(s){ return (s==null?'':String(s)).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function money(n){ return 'PKR ' + Number(n).toLocaleString(); }
function toast(msg){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(t._x); t._x=setTimeout(()=>t.classList.remove('show'),2800); }
function openModal(html){ document.getElementById('modalRoot').innerHTML=`<div class="modal-bg" onclick="if(event.target===this)closeModal()"><div class="modal">${html}</div></div>`; }
function closeModal(){ document.getElementById('modalRoot').innerHTML=''; }
function getSession(){ try{ return JSON.parse(localStorage.getItem('sv_session')||'null'); }catch(e){ return null; } }
function setSession(u){ localStorage.setItem('sv_session',JSON.stringify(u||null)); renderNav(); }
function starsHTML(r){ const f=Math.round(r||0); let s=''; for(let i=1;i<=5;i++) s+=i<=f?'★':'☆'; return s; }
function avgRating(pid){ const rs=DB.data.reviews.filter(r=>r.product_id===pid); return { avg: rs.length? rs.reduce((a,r)=>a+r.rating,0)/rs.length : 0, count: rs.length }; }
function imgURL(key){ return IMG[key] || IMG.books; }
function catName(id){ const c=DB.data.categories.find(c=>c.id===id); return c?c.name:''; }
function statusBadge(s){ return `<span class="tag t-${s.toLowerCase()}">${esc(s)}</span>`; }
function statusSteps(status){
  if(status==='Cancelled') return `<span class="tag t-cancelled">✖ Order Cancelled</span>`;
  const steps=['Pending','Confirmed','Shipped','Delivered']; const idx=steps.indexOf(status);
  return `<div class="steps-track">${steps.map((st,i)=>`<span class="step-chip ${i<idx?'done':(i===idx?'current':'')}">${i<idx?'✔ ':''}${st}</span>`).join('')}</div>`;
}

/* ================= NAVBAR ================= */
function cartCount(){ const s=getSession(); if(!s) return 0; return DB.data.cart.filter(c=>c.user_id===s.id).reduce((a,c)=>a+c.qty,0); }
function wishCount(){ const s=getSession(); if(!s) return 0; return DB.data.wishlist.filter(w=>w.user_id===s.id).length; }
function renderNav(){
  const s=getSession();
  const cb=document.getElementById('cartBadge'), wb=document.getElementById('wishBadge');
  const cc=cartCount(), wc=wishCount();
  cb.style.display=cc?'flex':'none'; cb.textContent=cc;
  wb.style.display=wc?'flex':'none'; wb.textContent=wc;
  let h='';
  if(s){
    h+=`<span>Welcome, <b>${esc(s.name.split(' ')[0])}</b></span>`;
    if(s.is_admin) h+=`<a href="#/admin">⚙️ Admin Panel</a>`;
    h+=`<a href="#/account">My Account</a><a href="#" onclick="logout();return false;">Logout</a>`;
  } else {
    h+=`<a href="#/admin">⚙️ Admin</a><a href="#/login">Login</a><a href="#/register">Register</a>`;
  }
  document.getElementById('topbarLinks').innerHTML=h;
  const cats=[...DB.data.categories].sort((a,b)=>a.name.localeCompare(b.name));
  document.getElementById('catNavInner').innerHTML=`<a href="#/shop" class="all-cats">☰ All Categories</a>`+
    cats.map(c=>`<a href="#/shop?cat=${c.id}">${c.emoji} ${esc(c.name)}</a>`).join('');
  document.querySelectorAll('.cat-nav-inner a').forEach(a=>a.onclick=()=>document.getElementById('catNav').classList.remove('open'));
}
function logout(){ setSession(null); toast('Logged out successfully'); location.hash='#/'; route(); }
function doSearch(){ const q=document.getElementById('navSearch').value.trim(); location.hash='#/shop?q='+encodeURIComponent(q); }
document.getElementById('navSearch').addEventListener('keydown',e=>{ if(e.key==='Enter') doSearch(); });

/* ================= ROUTER ================= */
function route(){
  const hash=location.hash.slice(2)||'';
  const [pathQ,queryStr]=hash.split('?');
  const parts=pathQ.split('/');
  const q={}; if(queryStr) queryStr.split('&').forEach(kv=>{ const [k,v]=kv.split('='); q[k]=decodeURIComponent(v||''); });
  window.scrollTo(0,0); closeModal();
  const app=document.getElementById('app');
  switch(parts[0]||''){
    case '': renderHome(app); break;
    case 'shop': renderShop(app,q); break;
    case 'product': renderProduct(app,parseInt(parts[1]),q); break;
    case 'cart': renderCart(app); break;
    case 'checkout': renderCheckout(app); break;
    case 'invoice': renderInvoice(app,parseInt(parts[1])); break;
    case 'login': renderLogin(app); break;
    case 'register': renderRegister(app); break;
    case 'forgot': renderForgot(app); break;
    case 'account': renderAccount(app); break;
    case 'wishlist': renderWishlist(app); break;
    case 'admin': renderAdmin(app,parts[1]||'dashboard',q); break;
    default: renderHome(app);
  }
  renderNav();
}
window.addEventListener('hashchange',route);

/* ================= PRODUCT CARD ================= */
function productCard(p){
  const r=avgRating(p.id);
  const off=p.old_price?Math.round((1-p.price/p.old_price)*100):0;
  const stock=p.stock<=0?"<span class='stock-out'>Out of Stock</span>":(p.stock<10?`<span class='stock-low'>Only ${p.stock} left</span>`:'');
  return `<div class="card p-card">
    <a href="#/product/${p.id}" class="p-img"><img src="${imgURL(p.image)}" alt="${esc(p.name)}">${off?`<span class="off-badge">-${off}%</span>`:''}</a>
    <button class="wish-btn ${isWished(p.id)?'active':''}" onclick="toggleWish(${p.id})">${isWished(p.id)?'♥':'♡'}</button>
    <div class="p-body">
      <div class="p-cat">${esc(catName(p.category_id))}</div>
      <a href="#/product/${p.id}"><div class="p-name">${esc(p.name)}</div></a>
      <div class="p-stars">${starsHTML(r.avg)} <small>${r.avg.toFixed(1)} (${r.count})</small></div>
      <div class="p-price">${money(p.price)}${p.old_price?`<span class="p-old">${money(p.old_price)}</span>`:''}</div>
      <div style="margin-top:4px">${stock}</div>
      <div class="p-actions">
        <button class="btn btn-s btn-sm" ${p.stock<=0?'disabled style="opacity:.5"':''} onclick="addToCart(${p.id})">🛒 Add to Cart</button>
      </div>
    </div></div>`;
}
function isWished(pid){ const s=getSession(); if(!s) return false; return DB.data.wishlist.some(w=>w.user_id===s.id&&w.product_id===pid); }
function toggleWish(pid){
  const s=getSession(); if(!s){ toast('Please login first'); location.hash='#/login'; return; }
  if(isWished(pid)) delW('wishlist',w=>!(w.user_id===s.id&&w.product_id===pid));
  else ins('wishlist',{user_id:s.id,product_id:pid});
  route();
}
function addToCart(pid,qty){
  qty=qty||1;
  const s=getSession(); if(!s){ toast('Please login to add items'); location.hash='#/login'; return; }
  const p=DB.data.products.find(x=>x.id===pid);
  if(!p||p.stock<=0){ toast('Sorry, out of stock'); return; }
  const ex=DB.data.cart.find(c=>c.user_id===s.id&&c.product_id===pid);
  if(ex) upd('cart',ex.id,{qty:Math.min(ex.qty+qty,p.stock)});
  else ins('cart',{user_id:s.id,product_id:pid,qty:Math.min(qty,p.stock)});
  renderNav(); toast('Added to cart 🛒');
}

/* ================= HOME ================= */
function renderHome(app){
  const cats=DB.data.categories.map(c=>({...c,cnt:DB.data.products.filter(p=>p.category_id===c.id).length}));
  const deals=DB.data.products.filter(p=>p.old_price!=null&&p.stock>0).sort((a,b)=>(1-b.price/b.old_price)-(1-a.price/a.old_price)).slice(0,8);
  const featured=DB.data.products.filter(p=>p.featured===1&&p.stock>0).slice(0,8);
  const latest=[...DB.data.products].sort((a,b)=>b.id-a.id).slice(0,8);
  const tcData=[['Tariq Mehmood','Karachi'],['Sana Khalid','Lahore'],['Omer Farooq','Islamabad'],['Rabia Anwar','Faisalabad'],
    ['Noman Iqbal','Multan'],['Saba Yousuf','Peshawar'],['Hamza Ali','Hyderabad'],['Amna Tariq','Rawalpindi'],
    ['Kashif Rana','Sialkot'],['Nimra Hassan','Quetta'],['Zeeshan Haider','Gujranwala'],['Laiba Noor','Bahawalpur']];
  const tcColors=['#4f2fe0','#ff5a1f','#149a52','#d97706','#dc2626','#0e7490','#7c3aed','#be185d'];
  const tcChips=tcData.map((c,i)=>{ const ini=c[0].split(' ').map(w=>w[0]).join('');
    return `<div class="tc-chip"><div class="tc-av" style="background:${tcColors[i%tcColors.length]}">${ini}</div><div><b>${c[0]}</b><small>⭐⭐⭐⭐⭐ • ${c[1]}</small></div></div>`; }).join('');
  app.innerHTML=`
  <section class="hero"><div class="container hero-inner">
    <div>
      <h1>Everything you love, <em>delivered</em> to your door 🚚</h1>
      <p>Shop electronics, fashion, home &amp; beauty — verified sellers, cash on delivery and easy returns across Pakistan.</p>
      <a href="#/shop" class="btn btn-p">Shop Now →</a>
      <a href="#/shop?cat=1" class="btn btn-o" style="margin-left:10px">Electronics</a>
    </div>
    <div class="hero-collage">
      <img src="${IMG.headphones}" alt=""><img src="${IMG.smartwatch}" alt=""><img src="${IMG.shoes}" alt="">
      <img src="${IMG.airfryer}" alt=""><img src="${IMG.kurti}" alt=""><img src="${IMG.football}" alt="">
    </div>
  </div></section>
  <div class="container">
    <section class="section">
      <div class="sec-head"><h2 class="sec-title">Shop by Category</h2><a class="link" href="#/shop">View all →</a></div>
      <div class="grid g4">${cats.map(c=>`<div class="card cat-card" onclick="location.hash='#/shop?cat=${c.id}'"><div class="ci">${c.emoji}</div><div><b>${esc(c.name)}</b><small>${c.cnt} products</small></div></div>`).join('')}</div>
    </section>
    <section class="section">
      <div class="sec-head"><h2 class="sec-title" style="color:var(--accent)">⚡ Flash Deals</h2><a class="link" href="#/shop">View all →</a></div>
      <div class="grid g4">${deals.map(productCard).join('')}</div>
    </section>
    <section class="section">
      <div class="sec-head"><h2 class="sec-title">Featured Products</h2><a class="link" href="#/shop">View all →</a></div>
      <div class="grid g4">${featured.map(productCard).join('')}</div>
    </section>
    <section class="section">
      <div class="sec-head"><h2 class="sec-title">New Arrivals</h2><a class="link" href="#/shop">View all →</a></div>
      <div class="grid g4">${latest.map(productCard).join('')}</div>
    </section>
    <section class="section">
      <div class="sec-head"><div><h2 class="sec-title">Our Top Customers ❤️</h2><p class="sec-sub">15,000+ happy shoppers across Pakistan trust NEXORA every month</p></div></div>
      <div class="tc-marquee"><div class="tc-track">${tcChips}${tcChips}</div></div>
    </section>
  </div>`;
}

/* ================= SHOP ================= */
function renderShop(app,q){
  const cats=[...DB.data.categories].sort((a,b)=>a.name.localeCompare(b.name));
  const cat=q.cat?parseInt(q.cat):0, search=(q.q||'').toLowerCase();
  const min=(q.min!==''&&q.min!=null)?parseFloat(q.min):0;
  const max=(q.max!==''&&q.max!=null)?parseFloat(q.max):1e9;
  const sort=q.sort||'default';
  let prods=DB.data.products.filter(p=>(!cat||p.category_id===cat)
    && (!search || p.name.toLowerCase().includes(search) || (p.description||'').toLowerCase().includes(search))
    && p.price>=min && p.price<=max);
  if(sort==='low') prods.sort((a,b)=>a.price-b.price);
  else if(sort==='high') prods.sort((a,b)=>b.price-a.price);
  else if(sort==='name') prods.sort((a,b)=>a.name.localeCompare(b.name));
  else prods.sort((a,b)=>b.id-a.id);
  const link=params=>{ const o=Object.assign({},q,params); const s=Object.entries(o).filter(([k,v])=>v!==undefined&&v!=='').map(([k,v])=>k+'='+encodeURIComponent(v)).join('&'); return '#/shop'+(s?'?'+s:''); };
  const heading=cat?catName(cat):(q.q?`Results for "${esc(q.q)}"`:'All Products');
  app.innerHTML=`<div class="container section">
    <h2 class="sec-title">${heading}</h2>
    <p class="sec-sub">${prods.length} product(s) found</p>
    <div class="shop-layout">
      <form class="filters" onsubmit="applyFilters(event)">
        <h4>🔍 Filters</h4>
        <div class="f-group"><label>Search</label><input id="fSearch" type="text" value="${esc(q.q||'')}" placeholder="Search products..."></div>
        <div class="f-group"><label>Category</label>
          <div class="f-check"><input type="radio" name="fcat" value="0" ${!cat?'checked':''}><span>All Categories</span></div>
          ${cats.map(c=>`<div class="f-check"><input type="radio" name="fcat" value="${c.id}" ${cat===c.id?'checked':''}><span>${c.emoji} ${esc(c.name)}</span></div>`).join('')}
        </div>
        <div class="f-group"><label>Min Price (PKR)</label><input id="fMin" type="number" value="${esc(q.min||'')}" placeholder="0"></div>
        <div class="f-group"><label>Max Price (PKR)</label><input id="fMax" type="number" value="${esc(q.max||'')}" placeholder="Any"></div>
        <div class="f-group"><label>Sort By</label>
          <select id="fSort">
            <option value="default" ${sort==='default'?'selected':''}>Newest</option>
            <option value="low" ${sort==='low'?'selected':''}>Price: Low → High</option>
            <option value="high" ${sort==='high'?'selected':''}>Price: High → Low</option>
            <option value="name" ${sort==='name'?'selected':''}>Name A–Z</option>
          </select></div>
        <button class="btn btn-s" style="width:100%">Apply Filters</button>
        <a class="btn btn-g" style="width:100%;margin-top:8px;text-align:center" href="#/shop">Clear All</a>
      </form>
      <div>${prods.length?`<div class="grid g3">${prods.map(productCard).join('')}</div>`
        :`<div class="empty"><div class="big">🔍</div><h3>No products found</h3><p>Try different filters or search terms.</p></div>`}</div>
    </div></div>`;
  window._shopQ=q;
}
function applyFilters(e){
  e.preventDefault();
  const q=window._shopQ||{}; const o=Object.assign({},q);
  const s=document.getElementById('fSearch').value.trim(); if(s) o.q=s; else delete o.q;
  const mn=document.getElementById('fMin').value; if(mn) o.min=mn; else delete o.min;
  const mx=document.getElementById('fMax').value; if(mx) o.max=mx; else delete o.max;
  const cat=document.querySelector('input[name=fcat]:checked').value; if(cat!=='0') o.cat=cat; else delete o.cat;
  o.sort=document.getElementById('fSort').value;
  const str=Object.entries(o).map(([k,v])=>k+'='+encodeURIComponent(v)).join('&');
  location.hash='#/shop'+(str?'?'+str:'');
}

/* ================= PRODUCT DETAIL ================= */
function renderProduct(app,id,q){
  const p=DB.data.products.find(x=>x.id===id);
  if(!p){ app.innerHTML=`<div class="container section"><div class="empty"><div class="big">😕</div><h3>Product not found</h3></div></div>`; return; }
  if(q&&q.wish){ toggleWish(id); return; }
  const r=avgRating(id);
  const reviews=DB.data.reviews.filter(v=>v.product_id===id).sort((a,b)=>b.id-a.id)
    .map(v=>({...v,uname:(DB.data.users.find(u=>u.id===v.user_id)||{}).name||'Customer'}));
  const related=DB.data.products.filter(x=>x.category_id===p.category_id&&x.id!==id).slice(0,4);
  const off=p.old_price?Math.round((1-p.price/p.old_price)*100):0;
  const s=getSession();
  app.innerHTML=`<div class="container section">
    <p style="font-size:13px;color:var(--muted);margin-bottom:18px"><a href="#/">Home</a> / <a href="#/shop">Shop</a> / ${esc(p.name)}</p>
    <div class="pd">
      <div class="pd-img"><img src="${imgURL(p.image)}" alt="${esc(p.name)}"></div>
      <div>
        <span class="tag" style="background:#eef0ff;color:var(--primary)">${esc(catName(p.category_id))}</span>
        <h1 style="font-size:30px;margin:10px 0 6px">${esc(p.name)}</h1>
        <div class="p-stars" style="font-size:15px">${starsHTML(r.avg)} <small>${r.avg.toFixed(1)} — ${r.count} review${r.count!=1?'s':''}</small></div>
        <div style="margin:16px 0">
          <span style="font-size:32px;font-weight:800;color:var(--primary)">${money(p.price)}</span>
          ${p.old_price?`<span class="p-old" style="font-size:18px">${money(p.old_price)}</span> <span class="tag" style="background:#fdeee6;color:var(--accent)">-${off}% OFF</span>`:''}
        </div>
        <p style="color:var(--muted);line-height:1.8;margin-bottom:18px">${esc(p.description)}</p>
        <p style="margin-bottom:16px">${p.stock>0?`<span class="tag t-delivered">✔ In Stock (${p.stock} available)</span>`:`<span class="tag t-cancelled">✖ Out of Stock</span>`}</p>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <div class="qty-box"><button type="button" id="qm">−</button><input id="pdQty" value="1" max="${Math.max(1,p.stock)}"><button type="button" id="qp">+</button></div>
          <button class="btn btn-p" ${p.stock<=0?'disabled style="opacity:.5"':''} onclick="addToCart(${p.id},parseInt(document.getElementById('pdQty').value))">🛒 Add to Cart</button>
          <button class="btn btn-g" onclick="toggleWish(${p.id})">${isWished(id)?'♥ Wishlisted':'♡ Add to Wishlist'}</button>
        </div>
        <div style="margin-top:20px;font-size:13px;color:var(--muted)">🚚 Free delivery over PKR 3,000 &nbsp;•&nbsp; 🔄 7-day easy returns &nbsp;•&nbsp; 💳 Cash on Delivery available</div>
      </div>
    </div>
    <div class="grid g2" style="margin-top:36px;align-items:start">
      <div class="panel">
        <h3 style="margin-bottom:8px">Customer Reviews (${reviews.length})</h3>
        <div style="margin-bottom:14px"><b style="font-size:22px">${r.avg.toFixed(1)}</b> / 5 &nbsp; <span class="p-stars" style="font-size:15px">${starsHTML(r.avg)}</span></div>
        ${reviews.length?reviews.map(v=>`<div class="review"><b>${esc(v.uname)}</b><small>${esc(v.created_at)}</small><div class="p-stars">${'★'.repeat(v.rating)}${'☆'.repeat(5-v.rating)}</div><p>${esc(v.comment)}</p></div>`).join(''):`<p style="color:var(--muted)">No reviews yet. Be the first to review!</p>`}
        ${s?`
        <h4 style="margin:18px 0 10px">Write a review</h4>
        <div class="field"><label>Your Rating</label><select id="revRating"><option value="5">★★★★★ (5)</option><option value="4">★★★★ (4)</option><option value="3">★★★ (3)</option><option value="2">★★ (2)</option><option value="1">★ (1)</option></select></div>
        <div class="field"><label>Your Review</label><textarea id="revComment" rows="3" placeholder="Share your experience..."></textarea></div>
        <button class="btn btn-s" onclick="submitReview(${p.id})">Submit Review</button>`
        :`<p style="font-size:13px;color:var(--muted);margin-top:14px"><a class="link" href="#/login">Login</a> to write a review.</p>`}
      </div>
      <div>
        <h3 class="sec-title" style="font-size:20px">Related Products</h3>
        <div class="grid g2" style="margin-top:14px">${related.map(productCard).join('')||`<p style="color:var(--muted)">No related products.</p>`}</div>
      </div>
    </div></div>`;
  document.getElementById('qp').onclick=()=>{ const i=document.getElementById('pdQty'); i.value=Math.min(parseInt(i.value||1)+1,Math.max(1,p.stock)); };
  document.getElementById('qm').onclick=()=>{ const i=document.getElementById('pdQty'); i.value=Math.max(1,parseInt(i.value||1)-1); };
}
function submitReview(pid){
  const s=getSession();
  const rating=parseInt(document.getElementById('revRating').value);
  const comment=document.getElementById('revComment').value.trim();
  if(!comment){ toast('Please write a comment'); return; }
  ins('reviews',{product_id:pid,user_id:s.id,rating,comment});
  toast('Review submitted! Thank you 🎉'); route();
}

/* ================= CART ================= */
function cartItems(){ const s=getSession(); if(!s) return [];
  return DB.data.cart.filter(c=>c.user_id===s.id).map(c=>({cid:c.id,qty:c.qty,...DB.data.products.find(p=>p.id===c.product_id)})); }
function renderCart(app){
  const s=getSession();
  if(!s){ app.innerHTML=authGate('Your Cart','Login to view your shopping cart'); return; }
  const items=cartItems();
  if(!items.length){ app.innerHTML=`<div class="container section"><div class="empty"><div class="big">🛒</div><h3>Your cart is empty</h3><p>Looks like you haven't added anything yet.</p><br><a href="#/shop" class="btn btn-p">Start Shopping</a></div></div>`; return; }
  const subtotal=items.reduce((a,i)=>a+i.price*i.qty,0);
  const shipping=subtotal>=3000?0:199;
  app.innerHTML=`<div class="container section">
    <h2 class="sec-title">Shopping Cart</h2>
    <p class="sec-sub">${items.length} item(s) in your cart</p>
    <div class="grid" style="grid-template-columns:1fr 320px;align-items:start">
      <div class="panel" style="padding:8px 0"><table>
        <tr><th>Product</th><th>Price</th><th>Quantity</th><th>Total</th><th></th></tr>
        ${items.map(i=>`<tr>
          <td><div style="display:flex;align-items:center;gap:12px"><img class="cart-thumb" src="${imgURL(i.image)}"><div><b>${esc(i.name)}</b><br><small style="color:var(--muted)">${money(i.price)} each</small></div></div></td>
          <td>${money(i.price)}</td>
          <td><div class="qty-box"><button onclick="cartQty(${i.cid},-1,${i.stock})">−</button><span style="width:44px;text-align:center;font-weight:700">${i.qty}</span><button onclick="cartQty(${i.cid},1,${i.stock})">+</button></div></td>
          <td><b>${money(i.price*i.qty)}</b></td>
          <td><button class="btn btn-d btn-sm" onclick="cartDel(${i.cid})">✕</button></td></tr>`).join('')}
      </table></div>
      <div class="sum-box">
        <h3 style="margin-bottom:12px">Order Summary</h3>
        <div class="sum-row"><span>Subtotal</span><span>${money(subtotal)}</span></div>
        <div class="sum-row"><span>Shipping</span><span>${shipping===0?'<b style="color:var(--success)">FREE</b>':money(shipping)}</span></div>
        ${shipping>0?`<small style="color:var(--warning)">Add ${money(3000-subtotal)} more for free shipping 🚚</small>`:''}
        <div class="sum-total"><span>Total</span><span>${money(subtotal+shipping)}</span></div>
        <a href="#/checkout" class="btn btn-p" style="width:100%;margin-top:16px;text-align:center">Proceed to Checkout →</a>
        <a href="#/shop" class="btn btn-g" style="width:100%;margin-top:8px;text-align:center">Continue Shopping</a>
      </div>
    </div></div>`;
}
function cartQty(cid,d,max){
  const it=DB.data.cart.find(c=>c.id===cid); if(!it) return; let v=it.qty+d;
  if(v<1){ delW('cart',c=>c.id!==cid); }
  else if(v>max){ toast('Only '+max+' in stock'); return; }
  else upd('cart',cid,{qty:v});
  renderNav(); route();
}
function cartDel(cid){ delW('cart',c=>c.id!==cid); renderNav(); route(); toast('Item removed'); }

/* ================= CHECKOUT ================= */
let appliedCoupon=null;
function renderCheckout(app){
  const s=getSession();
  if(!s){ app.innerHTML=authGate('Checkout','Login to complete your purchase'); return; }
  const items=cartItems();
  if(!items.length){ location.hash='#/cart'; return; }
  appliedCoupon=null;
  const subtotal=items.reduce((a,i)=>a+i.price*i.qty,0);
  app.innerHTML=`<div class="container section" style="max-width:900px">
    <h2 class="sec-title">Checkout</h2>
    <p class="sec-sub">Complete your order in a few steps</p>
    <div class="steps-track" style="margin-bottom:24px"><span class="step-chip done">✔ Cart</span><span class="step-chip current">2. Shipping &amp; Payment</span><span class="step-chip">3. Confirmation</span></div>
    <div class="grid" style="grid-template-columns:1fr 320px;align-items:start">
      <div class="panel">
        <h3 style="margin-bottom:16px">📦 Shipping Information</h3>
        <div class="form-row">
          <div class="field"><label>Full Name *</label><input id="coName" value="${esc(s.name)}"></div>
          <div class="field"><label>Phone Number *</label><input id="coPhone" value="${esc(s.phone||'')}" placeholder="03xxxxxxxxx"></div>
        </div>
        <div class="field"><label>Complete Address *</label><textarea id="coAddr" rows="2" placeholder="House, street, area..."></textarea></div>
        <div class="field"><label>City *</label><select id="coCity">${['Karachi','Lahore','Islamabad','Rawalpindi','Faisalabad','Multan','Peshawar','Quetta','Hyderabad','Other'].map(c=>`<option>${c}</option>`).join('')}</select></div>
        <h3 style="margin:22px 0 14px">💳 Payment Method</h3>
        <label class="pay-opt"><input type="radio" name="pay" value="Cash on Delivery" checked onchange="document.getElementById('cardBox').style.display='none'"><span>💵 <b>Cash on Delivery</b> — pay when your order arrives</span></label>
        <label class="pay-opt"><input type="radio" name="pay" value="Credit/Debit Card" onchange="document.getElementById('cardBox').style.display='block'"><span>💳 <b>Credit / Debit Card</b> — secure online payment</span></label>
        <div id="cardBox" style="display:none;margin-top:14px;padding:16px;border:1px dashed var(--border);border-radius:10px;background:var(--bg)">
          <div class="field"><label>Card Number</label><input id="cardNum" placeholder="4242 4242 4242 4242" maxlength="19"></div>
          <div class="form-row">
            <div class="field"><label>Expiry</label><input id="cardExp" placeholder="MM/YY" maxlength="5"></div>
            <div class="field"><label>CVV</label><input id="cardCvv" type="password" maxlength="4" placeholder="123"></div>
          </div>
          <small style="color:var(--muted)">🔒 Secured by NEXORA Pay — 256-bit SSL encrypted. Your card details are never stored.</small>
        </div>
      </div>
      <div class="sum-box">
        <h3 style="margin-bottom:12px">Your Order</h3>
        ${items.map(i=>`<div class="sum-row"><span>${esc(i.name)} × ${i.qty}</span><span>${money(i.price*i.qty)}</span></div>`).join('')}
        <div class="field" style="margin-top:12px"><label>Coupon Code</label>
          <div style="display:flex;gap:8px"><input id="coCoupon" placeholder="e.g. WELCOME10" style="flex:1"><button class="btn btn-g btn-sm" style="height:42px" onclick="applyCoupon()">Apply</button></div>
        </div>
        <div id="coTotals"></div>
        <button class="btn btn-p" style="width:100%;margin-top:14px" onclick="placeOrder()">Place Order ✔</button>
      </div>
    </div></div>`;
  updateCoTotals(subtotal);
}
function applyCoupon(){
  const code=document.getElementById('coCoupon').value.trim().toUpperCase();
  const c=DB.data.coupons.find(x=>x.code===code&&x.active===1);
  if(!c){ appliedCoupon=null; toast('Invalid or expired coupon code'); }
  else { appliedCoupon={code:c.code,pct:c.discount_pct}; toast(`Coupon applied: ${c.discount_pct}% off 🎉`); }
  updateCoTotals(cartItems().reduce((a,i)=>a+i.price*i.qty,0));
}
function updateCoTotals(subtotal){
  const shipping=subtotal>=3000?0:199;
  const disc=appliedCoupon?Math.round(subtotal*appliedCoupon.pct/100):0;
  document.getElementById('coTotals').innerHTML=`
    ${disc?`<div class="sum-row" style="color:var(--success)"><span>Coupon (${appliedCoupon.code})</span><span>−${money(disc)}</span></div>`:''}
    <div class="sum-row"><span>Subtotal</span><span>${money(subtotal)}</span></div>
    <div class="sum-row"><span>Shipping</span><span>${shipping===0?'FREE':money(shipping)}</span></div>
    <div class="sum-total"><span>Total</span><span>${money(subtotal+shipping-disc)}</span></div>`;
}
function placeOrder(){
  const s=getSession();
  const name=document.getElementById('coName').value.trim();
  const phone=document.getElementById('coPhone').value.trim();
  const addr=document.getElementById('coAddr').value.trim();
  const city=document.getElementById('coCity').value;
  const pay=document.querySelector('input[name=pay]:checked').value;
  if(!name||!/^03\d{9}$/.test(phone.replace(/[\s-]/g,''))||!addr){ toast('Please fill all fields correctly (phone: 03xxxxxxxxx)'); return; }
  if(pay==='Credit/Debit Card'){
    const cn=document.getElementById('cardNum').value.replace(/\s/g,'');
    if(cn.length<12||!document.getElementById('cardExp').value||document.getElementById('cardCvv').value.length<3){ toast('Please enter valid card details'); return; }
  }
  const items=cartItems();
  for(const it of items){ if(it.qty>(DB.data.products.find(p=>p.id===it.id)||{stock:0}).stock){ toast(`"${it.name}" not enough stock`); return; } }
  const subtotal=items.reduce((a,i)=>a+i.price*i.qty,0);
  const shipping=subtotal>=3000?0:199;
  const disc=appliedCoupon?Math.round(subtotal*appliedCoupon.pct/100):0;
  const total=subtotal+shipping-disc;
  const o=ins('orders',{user_id:s.id,total,subtotal,discount:disc,coupon:appliedCoupon?appliedCoupon.code:null,status:'Pending',payment:pay,address:addr,city,phone});
  items.forEach(it=>{
    ins('order_items',{order_id:o.id,product_id:it.id,qty:it.qty,price:it.price});
    upd('products',it.id,{stock:Math.max(0,(DB.data.products.find(p=>p.id===it.id)||it).stock-it.qty)});
  });
  delW('cart',c=>c.user_id!==s.id);
  upd('users',s.id,{name});
  renderNav();
  toast('Order placed successfully! 🎉');
  location.hash='#/invoice/'+o.id;
}

/* ================= INVOICE ================= */
function renderInvoice(app,oid){
  const s=getSession(); if(!s){ location.hash='#/login'; return; }
  const o=DB.data.orders.find(x=>x.id===oid&&x.user_id===s.id);
  if(!o){ app.innerHTML=`<div class="container section"><div class="empty"><div class="big">😕</div><h3>Invoice not found</h3></div></div>`; return; }
  const items=DB.data.order_items.filter(i=>i.order_id===oid).map(i=>({...i,name:(DB.data.products.find(p=>p.id===i.product_id)||{}).name||'Item',image:(DB.data.products.find(p=>p.id===i.product_id)||{}).image||'books'}));
  app.innerHTML=`<div class="container no-print" style="text-align:center;margin-top:20px">
      <button class="btn btn-s btn-sm" onclick="window.print()">🖨️ Print Invoice</button>
      <a class="btn btn-g btn-sm" href="#/account">View My Orders</a>
    </div>
    <div class="invoice">
      <div class="inv-head">
        <div><h2 style="color:var(--primary)">NEXORA</h2><p style="color:var(--muted);font-size:13px">www.nexora.pk — Karachi, Pakistan</p></div>
        <div style="text-align:right"><h3>INVOICE</h3><p style="color:var(--muted);font-size:13px">Order #SV-${String(o.id).padStart(5,'0')}<br>${esc(o.created_at)}</p></div>
      </div>
      <div style="display:flex;justify-content:space-between;gap:20px;margin-bottom:18px;flex-wrap:wrap">
        <div><b>Bill To:</b><br>${esc(o.address)}, ${esc(o.city)}<br>📞 ${esc(o.phone)}</div>
        <div><b>Payment:</b> ${esc(o.payment)}<br><b>Status:</b> ${statusBadge(o.status)}</div>
      </div>
      ${statusSteps(o.status)}
      <table><tr><th>Item</th><th>Qty</th><th>Price</th><th>Amount</th></tr>
        ${items.map(i=>`<tr><td><div style="display:flex;align-items:center;gap:10px"><img src="${imgURL(i.image)}" class="cart-thumb">${esc(i.name)}</div></td><td>${i.qty}</td><td>${money(i.price)}</td><td>${money(i.price*i.qty)}</td></tr>`).join('')}
      </table>
      <div style="margin-top:18px;text-align:right">
        <div class="sum-row"><span>Subtotal:</span><span>${money(o.subtotal)}</span></div>
        ${o.discount?`<div class="sum-row" style="color:var(--success)"><span>Discount${o.coupon?` (${esc(o.coupon)})`:''}:</span><span>−${money(o.discount)}</span></div>`:''}
        <div class="sum-row"><span>Shipping:</span><span>${money(Math.max(0,o.total-o.subtotal+o.discount))}</span></div>
        <div class="sum-total" style="max-width:280px;margin-left:auto"><span>Total:</span><span>${money(o.total)}</span></div>
      </div>
      <p style="text-align:center;color:var(--muted);font-size:12px;margin-top:26px">Thank you for shopping with NEXORA! support@nexora.pk</p>
    </div>`;
}

/* ================= AUTH ================= */
function authGate(title,msg){
  return `<div class="container section"><div class="auth-wrap" style="text-align:center">
    <div style="font-size:50px;margin-bottom:10px">🔐</div><h2>${esc(title)}</h2>
    <p class="sub">${esc(msg)}</p>
    <a class="btn btn-s" href="#/login" style="width:100%">Login</a>
    <p style="margin-top:14px;font-size:13px;color:var(--muted)">New here? <a class="link" href="#/register">Create an account</a></p>
  </div></div>`;
}
function renderLogin(app){
  app.innerHTML=`<div class="container section"><div class="auth-wrap">
    <h2>Welcome Back 👋</h2><p class="sub">Login to your NEXORA account</p>
    <div class="field"><label>Email or Phone</label><input id="lId" placeholder="you@email.com or 03xxxxxxxxx"></div>
    <div class="field"><label>Password</label><input id="lPass" type="password" placeholder="••••••••"></div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <label class="f-check" style="font-size:13px"><input type="checkbox"> Remember me</label>
      <a class="link" href="#/forgot">Forgot Password?</a>
    </div>
    <button class="btn btn-p" style="width:100%" onclick="doLogin()">Login</button>
    <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--muted)">Don't have an account? <a class="link" href="#/register">Register</a></p>
  </div></div>`;
}
function doLogin(){
  const id=document.getElementById('lId').value.trim();
  const pass=document.getElementById('lPass').value;
  const u=DB.data.users.find(x=>(x.email===id||x.phone===id)&&x.password===pass);
  if(!u){ toast('Invalid credentials. Please try again.'); return; }
  setSession(u);
  toast('Welcome back, '+u.name.split(' ')[0]+'! 👋');
  location.hash=u.is_admin?'#/admin':'#/'; route();
}
let regData=null;
function renderRegister(app){
  app.innerHTML=`<div class="container section"><div class="auth-wrap">
    <h2>Create Account ✨</h2><p class="sub">Register with your email or phone — we'll send a verification code.</p>
    <div class="field"><label>Full Name</label><input id="rName" placeholder="Muhammad Ali"></div>
    <div class="field"><label>Email or Phone Number</label><input id="rContact" placeholder="you@email.com or 03xxxxxxxxx"></div>
    <button class="btn btn-s" style="width:100%" onclick="sendRegOTP()">Send Verification Code →</button>
    <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--muted)">Already registered? <a class="link" href="#/login">Login</a></p>
  </div></div>`;
}
function isEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isPhone(v){ return /^03\d{9}$/.test(v.replace(/[\s-]/g,'')); }
function sendRegOTP(){
  const name=document.getElementById('rName').value.trim();
  const contact=document.getElementById('rContact').value.trim();
  if(name.length<3){ toast('Please enter your full name'); return; }
  if(!isEmail(contact)&&!isPhone(contact)){ toast('Enter a valid email or 03xxxxxxxxx phone'); return; }
  if(DB.data.users.some(u=>u.email===contact||u.phone===contact)){ toast('Already registered — please login'); location.hash='#/login'; return; }
  const code=String(Math.floor(100000+Math.random()*900000));
  ins('otp_codes',{identifier:contact,code,expires:Date.now()+300000,purpose:'register'});
  regData={name,contact};
  showOTPModal(contact,code,()=>{
    openModal(`<h3 style="margin-bottom:6px">✔ Contact Verified!</h3>
      <p style="font-size:13px;color:var(--muted);margin-bottom:16px">Now create a secure password.</p>
      <div class="field"><label>Create Password</label><input id="rPass" type="password" placeholder="Minimum 6 characters"></div>
      <div class="field"><label>Confirm Password</label><input id="rPass2" type="password"></div>
      <button class="btn btn-p" style="width:100%" onclick="finishRegister()">Complete Registration ✔</button>`);
  });
}
function showOTPModal(contact,demoCode,onSuccess){
  openModal(`<h3 style="margin-bottom:6px">📨 Verify Your Contact</h3>
    <p style="font-size:13px;color:var(--muted)">A 6-digit code was sent to <b>${esc(contact)}</b> (valid 5 min).</p>
    <div class="otp-row">${'<input maxlength="1" inputmode="numeric">'.repeat(6)}</div>
    <div id="otpErr"></div>
    <button class="btn btn-s" style="width:100%" onclick="verifyOTPStep('${esc(contact)}')">Verify Code</button>
    <div class="sms-preview">💬 <b>NEXORA:</b> Your verification code is <b>${demoCode}</b>. Valid for 5 minutes — do not share it with anyone.</div>`);
  const boxes=[...document.querySelectorAll('.otp-row input')];
  boxes.forEach((b,i)=>{
    b.addEventListener('input',()=>{ b.value=b.value.replace(/\D/g,''); if(b.value&&i<5) boxes[i+1].focus(); });
    b.addEventListener('keydown',e=>{ if(e.key==='Backspace'&&!b.value&&i>0) boxes[i-1].focus(); });
    b.addEventListener('paste',e=>{ e.preventDefault(); const t=(e.clipboardData.getData('text')||'').replace(/\D/g,'').slice(0,6); t.split('').forEach((ch,j)=>{ if(boxes[j]) boxes[j].value=ch; }); });
  });
  boxes[0].focus();
  window._otpSuccess=onSuccess;
}
function verifyOTPStep(contact){
  const code=[...document.querySelectorAll('.otp-row input')].map(b=>b.value).join('');
  const rec=DB.data.otp_codes.find(x=>x.identifier===contact&&x.code===code);
  if(!rec){ document.getElementById('otpErr').innerHTML=`<div class="alert alert-err">Incorrect code. Try again.</div>`; return; }
  if(rec.expires<Date.now()){ document.getElementById('otpErr').innerHTML=`<div class="alert alert-err">Code expired. Start over.</div>`; return; }
  delW('otp_codes',x=>x.identifier!==contact);
  closeModal(); if(window._otpSuccess) window._otpSuccess();
}
function finishRegister(){
  const p1=document.getElementById('rPass').value,p2=document.getElementById('rPass2').value;
  if(p1.length<6){ toast('Password must be at least 6 characters'); return; }
  if(p1!==p2){ toast('Passwords do not match'); return; }
  const e=isEmail(regData.contact);
  const u=ins('users',{name:regData.name,email:e?regData.contact:null,phone:e?null:regData.contact,password:p1,is_admin:0});
  setSession(u); closeModal();
  toast('Account created! Welcome 🎉');
  location.hash='#/'; route();
}
let resetContact=null;
function renderForgot(app){
  app.innerHTML=`<div class="container section"><div class="auth-wrap">
    <h2>Reset Password 🔑</h2><p class="sub">Enter your registered email or phone</p>
    <div class="field"><label>Email or Phone</label><input id="fId" placeholder="you@email.com or 03xxxxxxxxx"></div>
    <button class="btn btn-s" style="width:100%" onclick="sendResetOTP()">Send Reset Code →</button>
    <p style="text-align:center;margin-top:16px;font-size:13px"><a class="link" href="#/login">← Back to Login</a></p>
  </div></div>`;
}
function sendResetOTP(){
  const id=document.getElementById('fId').value.trim();
  if(!DB.data.users.some(u=>u.email===id||u.phone===id)){ toast('No account found with this email/phone'); return; }
  const code=String(Math.floor(100000+Math.random()*900000));
  ins('otp_codes',{identifier:id,code,expires:Date.now()+300000,purpose:'reset'});
  resetContact=id;
  showOTPModal(id,code,()=>{
    openModal(`<h3 style="margin-bottom:6px">🔑 Set New Password</h3>
      <p style="font-size:13px;color:var(--muted);margin-bottom:16px">Verified! Create a new password for <b>${esc(id)}</b></p>
      <div class="field"><label>New Password</label><input id="np1" type="password" placeholder="Minimum 6 characters"></div>
      <div class="field"><label>Confirm Password</label><input id="np2" type="password"></div>
      <button class="btn btn-p" style="width:100%" onclick="doResetPass()">Update Password</button>`);
  });
}
function doResetPass(){
  const p1=document.getElementById('np1').value,p2=document.getElementById('np2').value;
  if(p1.length<6){ toast('Minimum 6 characters'); return; }
  if(p1!==p2){ toast('Passwords do not match'); return; }
  DB.data.users.filter(u=>u.email===resetContact||u.phone===resetContact).forEach(u=>upd('users',u.id,{password:p1}));
  closeModal(); toast('Password updated! Please login 🔓'); location.hash='#/login';
}

/* ================= ACCOUNT / WISHLIST ================= */
function renderAccount(app){
  const s=getSession();
  if(!s){ app.innerHTML=authGate('My Account','Login to view your orders and profile'); return; }
  const u=DB.data.users.find(x=>x.id===s.id)||s;
  const orders=DB.data.orders.filter(o=>o.user_id===s.id).sort((a,b)=>b.id-a.id);
  app.innerHTML=`<div class="container section" style="max-width:920px">
    <div class="panel" style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div><h2>👤 ${esc(u.name)}</h2><p style="color:var(--muted);font-size:13px">${esc(u.email||'')} ${u.phone?'• 📞 '+esc(u.phone):''}</p></div>
      <span class="tag" style="background:#eef0ff;color:var(--primary)">${orders.length} order(s) placed</span>
    </div>
    <h3 class="sec-title" style="font-size:20px;margin-bottom:14px">Order History 📦</h3>
    ${orders.length?orders.map(o=>{
      const items=DB.data.order_items.filter(i=>i.order_id===o.id).map(i=>({qty:i.qty,name:(DB.data.products.find(p=>p.id===i.product_id)||{}).name||'Item'}));
      return `<div class="panel" style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;align-items:center">
          <div><b>Order #SV-${String(o.id).padStart(5,'0')}</b> <small style="color:var(--muted)">• ${esc(o.created_at)}</small></div>
          ${statusBadge(o.status)}
        </div>
        ${statusSteps(o.status)}
        <p style="font-size:13px;color:var(--muted);margin:6px 0">${items.map(i=>esc(i.name)+' ×'+i.qty).join(' &nbsp;•&nbsp; ')}</p>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <b style="color:var(--primary)">${money(o.total)}</b>
          <div style="display:flex;gap:8px">
            ${o.status==='Pending'?`<button class="btn btn-d btn-sm" onclick="cancelOrder(${o.id})">Cancel Order</button>`:''}
            <a class="btn btn-g btn-sm" href="#/invoice/${o.id}">🧾 Invoice</a>
          </div>
        </div></div>`;
    }).join(''):`<div class="empty"><div class="big">📦</div><h3>No orders yet</h3><p>Your placed orders will appear here.</p><br><a href="#/shop" class="btn btn-p">Start Shopping</a></div>`}
  </div>`;
}
function cancelOrder(oid){
  DB.data.order_items.filter(i=>i.order_id===oid).forEach(i=>{
    const p=DB.data.products.find(x=>x.id===i.product_id);
    if(p) upd('products',p.id,{stock:p.stock+i.qty});
  });
  upd('orders',oid,{status:'Cancelled'});
  toast('Order cancelled'); route();
}
function renderWishlist(app){
  const s=getSession();
  if(!s){ app.innerHTML=authGate('Wishlist','Login to view your wishlist'); return; }
  const items=DB.data.wishlist.filter(w=>w.user_id===s.id).map(w=>DB.data.products.find(p=>p.id===w.product_id)).filter(Boolean);
  app.innerHTML=`<div class="container section">
    <h2 class="sec-title">My Wishlist ♥</h2>
    <p class="sec-sub">${items.length} saved item(s)</p>
    ${items.length?`<div class="grid g4">${items.map(productCard).join('')}</div>`
      :`<div class="empty"><div class="big">💔</div><h3>Wishlist is empty</h3><p>Tap ♡ on products to save them here.</p><br><a href="#/shop" class="btn btn-p">Browse Products</a></div>`}
  </div>`;
}

/* ================= ADMIN ================= */
function renderAdmin(app,tab,q){
  const s=getSession();
  if(!s||!s.is_admin){
    app.innerHTML=`<div class="container section"><div class="auth-wrap">
      <h2>⚙️ Admin Login</h2><p class="sub">Restricted area — authorized staff only</p>
      <div class="field"><label>Admin Email</label><input id="aEmail" placeholder="admin@email.com"></div>
      <div class="field"><label>Password</label><input id="aPass" type="password" placeholder="••••••••"></div>
      <button class="btn btn-s" style="width:100%" onclick="doAdminLogin()">Login to Dashboard</button>
      <p style="text-align:center;margin-top:14px;font-size:13px"><a class="link" href="#/">← Back to Store</a></p>
    </div></div>`;
    return;
  }
  const tabs=[['dashboard','📊 Dashboard'],['products','📦 Products'],['categories','🗂️ Categories'],['orders','🧾 Orders'],['coupons','🎟️ Coupons'],['reviews','⭐ Reviews']];
  let body='';
  if(tab==='products') body=adminProducts(q);
  else if(tab==='categories') body=adminCategories();
  else if(tab==='orders') body=adminOrders();
  else if(tab==='coupons') body=adminCoupons();
  else if(tab==='reviews') body=adminReviews();
  else body=adminDashboard();
  app.innerHTML=`<div class="admin-shell">
    <div class="admin-side">
      <div class="logo">NEX<span>ORA</span> <small style="font-size:11px;color:#8a8fa8">ADMIN</small></div>
      ${tabs.map(t=>`<a href="#/admin/${t[0]}" class="${tab===t[0]?'active':''}">${t[1]}</a>`).join('')}
      <a href="#/" style="margin-top:18px">🏠 View Store</a>
      <a href="#" onclick="logout();return false;">🚪 Logout</a>
    </div>
    <div class="admin-main">${body}</div></div>`;
  if(tab==='dashboard') drawSalesChart();
}
function doAdminLogin(){
  const e=document.getElementById('aEmail').value.trim();
  const p=document.getElementById('aPass').value;
  const u=DB.data.users.find(x=>x.email===e&&x.is_admin===1&&x.password===p);
  if(!u){ toast('Invalid admin credentials'); return; }
  setSession(u); toast('Welcome to Admin Panel 👋'); location.hash='#/admin'; route();
}
function adminDashboard(){
  const O=DB.data.orders, P=DB.data.products;
  const rev=O.filter(o=>o.status!=='Cancelled').reduce((a,o)=>a+o.total,0);
  const pending=O.filter(o=>o.status==='Pending').length;
  const cust=DB.data.users.filter(u=>!u.is_admin).length;
  const low=P.filter(p=>p.stock<10);
  const recent=[...O].sort((a,b)=>b.id-a.id).slice(0,6)
    .map(o=>({...o,uname:(DB.data.users.find(u=>u.id===o.user_id)||{}).name||'Customer'}));
  return `<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:18px">
      <h2>Dashboard 📊</h2>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-s btn-sm" onclick="downloadReport()">📥 Download Report</button>
        <button class="btn btn-g btn-sm" onclick="printReport()">🖨️ Print Report</button>
        <button class="btn btn-g btn-sm" onclick="restoreDemoData()">🔄 Reset Data</button>
      </div>
    </div>
    <div class="grid g4" style="margin-bottom:22px">
      <div class="stat-card"><div class="ic">💰</div><div class="num">${money(rev)}</div><div class="lbl">Total Revenue</div></div>
      <div class="stat-card"><div class="ic">🧾</div><div class="num">${O.length}</div><div class="lbl">Orders (${pending} pending)</div></div>
      <div class="stat-card"><div class="ic">👥</div><div class="num">${cust}</div><div class="lbl">Customers</div></div>
      <div class="stat-card"><div class="ic">📦</div><div class="num">${P.length}</div><div class="lbl">Products (${low.length} low stock)</div></div>
    </div>
    <div class="grid" style="grid-template-columns:1.4fr 1fr;align-items:start">
      <div class="panel">
        <h3 style="margin-bottom:6px">Sales Report — Last 6 Months</h3>
        <p style="font-size:12px;color:var(--muted);margin-bottom:10px">Revenue per month (cancelled orders excluded)</p>
        <canvas id="salesChart" width="640" height="260" style="width:100%"></canvas>
      </div>
      <div class="panel">
        <h3 style="margin-bottom:12px">⚠️ Low Stock Alerts</h3>
        ${low.length?low.sort((a,b)=>a.stock-b.stock).slice(0,6).map(p=>`<div class="sum-row"><span>${esc(p.name)}</span><span class="stock-low">${p.stock} left</span></div>`).join(''):`<p style="color:var(--muted);font-size:13px">All products well stocked ✔</p>`}
        <a class="btn btn-g btn-sm" href="#/admin/products" style="margin-top:10px">Manage Inventory →</a>
      </div>
    </div>
    <div class="panel" style="margin-top:20px">
      <h3 style="margin-bottom:12px">Recent Orders</h3>
      <table><tr><th>#</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th></th></tr>
      ${recent.map(o=>`<tr><td>SV-${String(o.id).padStart(5,'0')}</td><td>${esc(o.uname)}</td><td>${esc(o.created_at)}</td><td>${money(o.total)}</td><td>${statusBadge(o.status)}</td><td><a class="link" href="#/admin/orders">Manage</a></td></tr>`).join('')}
      </table></div>`;
}
function drawSalesChart(){
  const cv=document.getElementById('salesChart'); if(!cv||!cv.getContext) return;
  const ctx=cv.getContext('2d');
  const labels=[],values=[];
  for(let i=5;i>=0;i--){
    const d=new Date(); d.setDate(1); d.setMonth(d.getMonth()-i);
    const key=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    labels.push(d.toLocaleString('en',{month:'short'}));
    values.push(DB.data.orders.filter(o=>o.status!=='Cancelled'&&(o.created_at||'').slice(0,7)===key).reduce((a,o)=>a+o.total,0));
  }
  const W=cv.width,H=cv.height,P=42,max=Math.max(...values,1),bw=(W-P-20)/labels.length*0.55,gap=(W-P-20)/labels.length;
  ctx.clearRect(0,0,W,H);
  ctx.strokeStyle='#e6e8f2'; ctx.fillStyle='#666b7f'; ctx.font='11px Segoe UI'; ctx.textAlign='right';
  for(let i=0;i<=4;i++){ const y=P+(H-2*P)*i/4; ctx.beginPath(); ctx.moveTo(P,y); ctx.lineTo(W-10,y); ctx.stroke(); ctx.fillText('PKR '+Math.round(max*(4-i)/4/1000)+'k',P-6,y+4); }
  labels.forEach((lb,i)=>{
    const x=P+gap*i+(gap-bw)/2,h=(H-2*P)*(values[i]/max),y=H-P-h;
    const g=ctx.createLinearGradient(0,y,0,H-P); g.addColorStop(0,'#7a5cff'); g.addColorStop(1,'#3a1fb8');
    ctx.fillStyle=g; ctx.beginPath();
    if(ctx.roundRect) ctx.roundRect(x,Math.max(y,P),bw,Math.max(h,2),[6,6,0,0]); else ctx.rect(x,Math.max(y,P),bw,Math.max(h,2));
    ctx.fill();
    ctx.fillStyle='#191a24'; ctx.textAlign='center';
    ctx.fillText(values[i]>0?Math.round(values[i]/1000)+'k':'',x+bw/2,Math.max(y,P)-6);
    ctx.fillStyle='#666b7f'; ctx.fillText(lb,x+bw/2,H-P+16);
  });
}
function adminProducts(q){
  const cats=[...DB.data.categories].sort((a,b)=>a.name.localeCompare(b.name));
  const catF=q.cat?parseInt(q.cat):0, fQ=(q.q||'').toLowerCase();
  let prods=DB.data.products.filter(p=>(!catF||p.category_id===catF)&&(!fQ||p.name.toLowerCase().includes(fQ))).sort((a,b)=>b.id-a.id);
  return `<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:18px">
    <h2>Products 📦</h2>
    <button class="btn btn-p" onclick="openProductForm()">+ Add Product</button></div>
    <div class="panel">
      <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap">
        <input id="apSearch" value="${esc(q.q||'')}" placeholder="Search products..." style="padding:9px 14px;border:1px solid var(--border);border-radius:8px;flex:1;min-width:180px">
        <select id="apCat" style="padding:9px 14px;border:1px solid var(--border);border-radius:8px">
          <option value="0">All Categories</option>${cats.map(c=>`<option value="${c.id}" ${catF===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}
        </select>
        <button class="btn btn-s btn-sm" style="height:38px" onclick="adminProdFilter()">Filter</button>
      </div>
      <table><tr><th>Image</th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
      ${prods.map(p=>`<tr>
        <td><img src="${imgURL(p.image)}" class="cart-thumb"></td>
        <td><b>${esc(p.name)}</b></td><td>${esc(catName(p.category_id))}</td><td>${money(p.price)}</td>
        <td><div class="qty-box" style="transform:scale(.9);transform-origin:left"><button onclick="admStock(${p.id},-1)">−</button><span style="width:40px;text-align:center;font-weight:700">${p.stock}</span><button onclick="admStock(${p.id},1)">+</button></div></td>
        <td>${p.stock<=0?`<span class="stock-out">Out</span>`:p.stock<10?`<span class="stock-low">Low</span>`:`<span style="color:var(--success);font-weight:700">In stock</span>`}</td>
        <td><button class="btn btn-g btn-sm" onclick="openProductForm(${p.id})">✏️ Edit</button>
            <button class="btn btn-d btn-sm" onclick="delProduct(${p.id})">🗑️</button></td></tr>`).join('')}
      </table></div>`;
}
function adminProdFilter(){
  const q=document.getElementById('apSearch').value.trim();
  const c=document.getElementById('apCat').value;
  location.hash='#/admin/products'+(q||c!=='0'?`?q=${encodeURIComponent(q)}&cat=${c}`:'');
}
function openProductForm(id){
  const cats=[...DB.data.categories].sort((a,b)=>a.name.localeCompare(b.name));
  const imgKeys=Object.keys(IMG);
  const p=id?DB.data.products.find(x=>x.id===id):{name:'',category_id:cats[0].id,price:'',old_price:'',stock:10,description:'',image:'headphones',featured:0};
  openModal(`<h3 style="margin-bottom:16px">${id?'Edit':'Add'} Product 📦</h3>
    <div class="field"><label>Product Name *</label><input id="pfName" value="${esc(p.name)}"></div>
    <div class="form-row">
      <div class="field"><label>Category *</label><select id="pfCat">${cats.map(c=>`<option value="${c.id}" ${p.category_id===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}</select></div>
      <div class="field"><label>Stock Quantity *</label><input id="pfStock" type="number" value="${p.stock}" min="0"></div>
    </div>
    <div class="form-row">
      <div class="field"><label>Price (PKR) *</label><input id="pfPrice" type="number" value="${p.price}"></div>
      <div class="field"><label>Old Price (optional)</label><input id="pfOld" type="number" value="${p.old_price||''}"></div>
    </div>
    <div class="field"><label>Description</label><textarea id="pfDesc" rows="3">${esc(p.description)}</textarea></div>
    <div class="field"><label>Product Image</label>
      <select id="pfImg" onchange="document.getElementById('pfPrev').src=IMG[this.value]">
        ${imgKeys.map(k=>`<option value="${k}" ${p.image===k?'selected':''}>${k}</option>`).join('')}
      </select>
      <img id="pfPrev" src="${imgURL(p.image)}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;margin-top:8px">
    </div>
    <label class="f-check"><input type="checkbox" id="pfFeat" ${p.featured?'checked':''}> Show in Featured Products on homepage</label>
    <button class="btn btn-p" style="width:100%;margin-top:12px" onclick="saveProduct(${id||0})">💾 Save Product</button>`);
}
function saveProduct(id){
  const v=k=>document.getElementById(k).value.trim();
  if(!v('pfName')||!v('pfPrice')){ toast('Name and price are required'); return; }
  const data={name:v('pfName'),category_id:parseInt(v('pfCat')),price:parseFloat(v('pfPrice')),old_price:v('pfOld')?parseFloat(v('pfOld')):null,stock:parseInt(v('pfStock')||0),description:v('pfDesc'),image:v('pfImg'),featured:document.getElementById('pfFeat').checked?1:0};
  if(id) upd('products',id,data);
  else ins('products',data);
  closeModal(); toast('Product saved ✔'); route();
}
function delProduct(id){
  if(!confirm('Delete this product?')) return;
  ['order_items','cart','wishlist','reviews'].forEach(t=>delW(t,r=>r.product_id!==id));
  delW('products',p=>p.id!==id);
  toast('Product deleted'); route();
}
function admStock(id,d){
  const p=DB.data.products.find(x=>x.id===id);
  if(p) upd('products',id,{stock:Math.max(0,p.stock+d)});
  route();
}
function adminCategories(){
  const cats=DB.data.categories.map(c=>({...c,cnt:DB.data.products.filter(p=>p.category_id===c.id).length})).sort((a,b)=>a.id-b.id);
  return `<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:18px">
    <h2>Categories 🗂️</h2>
    <button class="btn btn-p" onclick="openCatForm()">+ Add Category</button></div>
    <div class="panel"><table><tr><th>Icon</th><th>Name</th><th>Products</th><th>Actions</th></tr>
    ${cats.map(c=>`<tr><td style="font-size:24px">${c.emoji}</td><td><b>${esc(c.name)}</b></td><td>${c.cnt}</td>
    <td><button class="btn btn-g btn-sm" onclick="openCatForm(${c.id})">✏️ Edit</button>
    <button class="btn btn-d btn-sm" onclick="delCat(${c.id},${c.cnt})">🗑️</button></td></tr>`).join('')}
    </table></div>`;
}
function openCatForm(id){
  const c=id?DB.data.categories.find(x=>x.id===id):{name:'',emoji:'🏷️'};
  openModal(`<h3 style="margin-bottom:16px">${id?'Edit':'Add'} Category 🗂️</h3>
    <div class="field"><label>Category Name *</label><input id="cfName" value="${esc(c.name)}"></div>
    <div class="field"><label>Icon (emoji)</label><input id="cfEmoji" value="${esc(c.emoji)}" maxlength="4"></div>
    <button class="btn btn-p" style="width:100%" onclick="saveCat(${id||0})">💾 Save Category</button>`);
}
function saveCat(id){
  const name=document.getElementById('cfName').value.trim(),emoji=document.getElementById('cfEmoji').value||'🏷️';
  if(!name){ toast('Name is required'); return; }
  if(DB.data.categories.some(c=>c.name===name&&c.id!==id)){ toast('A category with this name already exists'); return; }
  if(id) upd('categories',id,{name,emoji});
  else ins('categories',{name,emoji});
  closeModal(); toast('Category saved ✔'); route();
}
function delCat(id,cnt){
  if(cnt>0){ toast('Cannot delete — category has products'); return; }
  if(!confirm('Delete this category?')) return;
  delW('categories',c=>c.id!==id);
  toast('Category deleted'); route();
}
function adminOrders(){
  const orders=[...DB.data.orders].sort((a,b)=>b.id-a.id).map(o=>({...o,uname:(DB.data.users.find(u=>u.id===o.user_id)||{}).name||'Customer'}));
  const statuses=['Pending','Confirmed','Shipped','Delivered','Cancelled'];
  return `<h2 style="margin-bottom:18px">Orders 🧾</h2>
    <div class="panel"><table><tr><th>#</th><th>Customer</th><th>Items</th><th>Payment</th><th>Total</th><th>Date</th><th>Status</th></tr>
    ${orders.map(o=>{
      const items=DB.data.order_items.filter(i=>i.order_id===o.id).map(i=>({qty:i.qty,name:(DB.data.products.find(p=>p.id===i.product_id)||{}).name||'Item'}));
      return `<tr><td><b>SV-${String(o.id).padStart(5,'0')}</b></td>
      <td>${esc(o.uname)}<br><small style="color:var(--muted)">${esc(o.city)} — ${esc(o.phone)}</small></td>
      <td style="font-size:12px">${items.map(i=>esc(i.name)+' ×'+i.qty).join('<br>')}</td>
      <td>${esc(o.payment)}</td><td><b>${money(o.total)}</b></td><td style="font-size:12px">${esc(o.created_at)}</td>
      <td>${statusBadge(o.status)}<br>
        <select onchange="setOrderStatus(${o.id},this.value)" style="margin-top:6px;padding:6px 8px;border:1px solid var(--border);border-radius:8px;font-size:13px">
          ${statuses.map(st=>`<option ${o.status===st?'selected':''}>${st}</option>`).join('')}
        </select></td></tr>`;
    }).join('')||`<tr><td colspan="7" style="text-align:center;color:var(--muted)">No orders yet</td></tr>`}
    </table></div>`;
}
function setOrderStatus(id,status){
  const o=DB.data.orders.find(x=>x.id===id);
  if(!o||o.status===status) return;
  if(status==='Cancelled'&&o.status!=='Cancelled'){
    DB.data.order_items.filter(i=>i.order_id===id).forEach(i=>{
      const p=DB.data.products.find(x=>x.id===i.product_id);
      if(p) upd('products',p.id,{stock:p.stock+i.qty});
    });
  }
  upd('orders',id,{status});
  toast('Order updated → '+status); route();
}
function adminCoupons(){
  const coupons=DB.data.coupons;
  return `<h2 style="margin-bottom:18px">Coupons 🎟️</h2>
    <div class="panel" style="margin-bottom:20px">
      <h3 style="margin-bottom:14px">Create Coupon</h3>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <input id="cpCode" placeholder="SUMMER25" style="flex:1;min-width:140px;padding:10px 14px;border:1.5px solid var(--border);border-radius:10px;text-transform:uppercase">
        <input id="cpPct" type="number" min="1" max="90" placeholder="Discount %" style="width:130px;padding:10px 14px;border:1.5px solid var(--border);border-radius:10px">
        <button class="btn btn-p" onclick="saveCoupon()">+ Create</button>
      </div>
    </div>
    <div class="panel"><table><tr><th>Code</th><th>Discount</th><th>Status</th><th>Actions</th></tr>
    ${coupons.map(c=>`<tr><td><b style="letter-spacing:1px">${esc(c.code)}</b></td><td>${c.discount_pct}% off</td>
    <td>${c.active?`<span class="tag t-delivered">Active</span>`:`<span class="tag t-cancelled">Inactive</span>`}</td>
    <td><button class="btn btn-g btn-sm" onclick="toggleCoupon('${esc(c.code)}')">${c.active?'Disable':'Enable'}</button>
    <button class="btn btn-d btn-sm" onclick="delCoupon('${esc(c.code)}')">🗑️</button></td></tr>`).join('')}
    </table>
    <p style="font-size:12px;color:var(--muted);margin-top:12px">💡 Active codes: <b>WELCOME10</b> (10% off) • <b>SAVE20</b> (20% off)</p></div>`;
}
function saveCoupon(){
  const code=document.getElementById('cpCode').value.trim().toUpperCase();
  const pct=parseFloat(document.getElementById('cpPct').value);
  if(!code||!pct||pct<1||pct>90){ toast('Enter valid code and discount 1-90%'); return; }
  if(DB.data.coupons.some(c=>c.code===code)){ toast('This code already exists'); return; }
  ins('coupons',{code,discount_pct:pct,active:1});
  toast('Coupon created ✔'); route();
}
function toggleCoupon(code){ const c=DB.data.coupons.find(x=>x.code===code); if(c){ c.active=1-c.active; dbSave(); } route(); }
function delCoupon(code){ if(!confirm('Delete coupon '+code+'?')) return; delW('coupons',c=>c.code!==code); route(); }
function adminReviews(){
  const revs=[...DB.data.reviews].sort((a,b)=>b.id-a.id).map(r=>({...r,
    pname:(DB.data.products.find(p=>p.id===r.product_id)||{}).name||'Product',
    uname:(DB.data.users.find(u=>u.id===r.user_id)||{}).name||'Customer'}));
  return `<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:18px"><h2>Reviews ⭐</h2><button class="btn btn-s btn-sm" onclick="downloadReviews()">📥 Download Report</button></div>
    <div class="panel"><table><tr><th>Product</th><th>Customer</th><th>Rating</th><th>Review</th><th>Date</th><th></th></tr>
    ${revs.map(r=>`<tr><td>${esc(r.pname)}</td><td>${esc(r.uname)}</td>
    <td class="p-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</td>
    <td style="max-width:280px">${esc(r.comment)}</td><td style="font-size:12px">${esc(r.created_at)}</td>
    <td><button class="btn btn-d btn-sm" onclick="delReview(${r.id})">🗑️</button></td></tr>`).join('')||`<tr><td colspan="6" style="text-align:center;color:var(--muted)">No reviews yet</td></tr>`}
    </table></div>`;
}
function delReview(id){ if(!confirm('Delete this review?')) return; delW('reviews',r=>r.id!==id); route(); }



/* ---------- Reviews Report: Download CSV ---------- */
function downloadReviews(){
  const rows=[...DB.data.reviews].sort((a,b)=>a.id-b.id).map(r=>{
    const p=DB.data.products.find(x=>x.id===r.product_id)||{};
    const u=DB.data.users.find(x=>x.id===r.user_id)||{};
    return [p.name||'',u.name||'',r.rating,'"'+String(r.comment||'').replace(/"/g,'""')+'"',r.created_at||'']
      .map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',');
  });
  const csv='\uFEFF"NEXORA — Reviews Report","Generated: '+nowStr()+'"\nProduct,Customer,Rating (1-5),Review,Date\n'+rows.join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='NEXORA-reviews-report-'+new Date().toISOString().slice(0,10)+'.csv';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(a.href);
  toast('Reviews report downloaded 📥');
}

/* ---------- SALES REPORTS: Download (CSV/Excel) + Print ---------- */
function reportData(){
  const valid = DB.data.orders.filter(o=>o.status!=='Cancelled');
  const byStatus = {};
  DB.data.orders.forEach(o=>byStatus[o.status]=(byStatus[o.status]||0)+1);
  const monthly = {};
  valid.forEach(o=>{ const k=(o.created_at||'').slice(0,7); monthly[k]=(monthly[k]||0)+o.total; });
  const pq = {};
  DB.data.order_items.forEach(i=>{ pq[i.product_id]=(pq[i.product_id]||0)+i.qty; });
  const top = Object.entries(pq).map(([pid,qty])=>{
    const p = DB.data.products.find(x=>x.id==pid)||{};
    return {name:p.name||'Item', qty, revenue:qty*(p.price||0)};
  }).sort((a,b)=>b.revenue-a.revenue).slice(0,5);
  return { valid, byStatus, monthly, top,
    revenue: valid.reduce((a,o)=>a+o.total,0),
    orders: DB.data.orders.length,
    customers: DB.data.users.filter(u=>!u.is_admin).length };
}
function downloadReport(){
  const d = reportData();
  const rows = [...DB.data.orders].sort((a,b)=>a.id-b.id).map(o=>{
    const u = DB.data.users.find(x=>x.id===o.user_id)||{};
    const qty = DB.data.order_items.filter(i=>i.order_id===o.id).reduce((a,i)=>a+i.qty,0);
    return ['SV-'+String(o.id).padStart(5,'0'), o.created_at||'', u.name||'', o.city||'', qty,
            o.subtotal, o.discount, o.total, o.status, o.payment||'', o.coupon||'-']
      .map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',');
  });
  const header = 'Order #,Date,Customer,City,Items,Subtotal (PKR),Discount (PKR),Total (PKR),Status,Payment,Coupon';
  const summary = '"NEXORA — Sales Report","Generated: '+nowStr()+'"\n"Total Revenue","'+d.revenue+'"\n"Total Orders","'+d.orders+'"\n"Customers","'+d.customers+'"\n';
  const csv = '\uFEFF' + summary + '\n' + header + '\n' + rows.join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'NEXORA-sales-report-' + new Date().toISOString().slice(0,10) + '.csv';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(a.href);
  toast('Sales report downloaded 📥 Check your Downloads folder');
}
function printReport(){
  const d = reportData();
  const el = document.getElementById('printReport');
  el.innerHTML = `
    <div style="max-width:800px;margin:0 auto;font-family:Segoe UI,Arial">
      <div style="display:flex;justify-content:space-between;border-bottom:3px solid #4f2fe0;padding-bottom:12px;margin-bottom:18px">
        <div><h2 style="color:#4f2fe0;margin:0">NEXORA</h2><small style="color:#666">Sales Report — generated ${nowStr()}</small></div>
        <div style="text-align:right"><b>Total Revenue</b><br><span style="font-size:22px;font-weight:800">${money(d.revenue)}</span></div>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:18px">
        <tr><td style="border:1px solid #ddd;padding:10px"><b>${d.orders}</b><br>Total Orders</td>
            <td style="border:1px solid #ddd;padding:10px"><b>${d.customers}</b><br>Customers</td>
            <td style="border:1px solid #ddd;padding:10px"><b>${money(d.valid.reduce((a,o)=>a+o.discount,0))}</b><br>Discounts Given</td>
            <td style="border:1px solid #ddd;padding:10px"><b>${(d.revenue/Math.max(1,d.valid.length)).toFixed(0)}</b><br>Avg Order Value (PKR)</td></tr>
      </table>
      <h3 style="margin:14px 0 8px">Monthly Sales</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <tr style="background:#f0f1f8"><th style="padding:8px;text-align:left;border:1px solid #ddd">Month</th><th style="padding:8px;text-align:right;border:1px solid #ddd">Revenue (PKR)</th></tr>
        ${Object.entries(d.monthly).sort().map(([m,v])=>`<tr><td style="padding:8px;border:1px solid #ddd">${m}</td><td style="padding:8px;text-align:right;border:1px solid #ddd">${Number(v).toLocaleString()}</td></tr>`).join('')}
      </table>
      <h3 style="margin:14px 0 8px">Top 5 Products (by revenue)</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <tr style="background:#f0f1f8"><th style="padding:8px;text-align:left;border:1px solid #ddd">Product</th><th style="padding:8px;text-align:right;border:1px solid #ddd">Qty Sold</th><th style="padding:8px;text-align:right;border:1px solid #ddd">Revenue (PKR)</th></tr>
        ${d.top.map(t=>`<tr><td style="padding:8px;border:1px solid #ddd">${esc(t.name)}</td><td style="padding:8px;text-align:right;border:1px solid #ddd">${t.qty}</td><td style="padding:8px;text-align:right;border:1px solid #ddd">${Number(t.revenue).toLocaleString()}</td></tr>`).join('')}
      </table>
      <h3 style="margin:14px 0 8px">Orders by Status</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <tr style="background:#f0f1f8"><th style="padding:8px;text-align:left;border:1px solid #ddd">Status</th><th style="padding:8px;text-align:right;border:1px solid #ddd">Count</th></tr>
        ${Object.entries(d.byStatus).map(([s,c])=>`<tr><td style="padding:8px;border:1px solid #ddd">${s}</td><td style="padding:8px;text-align:right;border:1px solid #ddd">${c}</td></tr>`).join('')}
      </table>
      <p style="text-align:center;color:#999;font-size:11px;margin-top:20px">NEXORA Sales Report • Confidential</p>
    </div>`;
  window.print();
}

/* ================= BOOT ================= */
dbLoad();
route();

