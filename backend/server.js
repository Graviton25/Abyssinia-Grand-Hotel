const express=require('express');const cors=require('cors');const bcrypt=require('bcryptjs');const jwt=require('jsonwebtoken');const fs=require('fs');const path=require('path');
const app=express(),PORT=process.env.PORT||3000,SECRET=process.env.JWT_SECRET||'dev-only-secret-change-me';
const DB=path.join(__dirname,'..','data','db.json'),FRONT=path.join(__dirname,'..','frontend');
const rooms=[
{id:1,name:'Royal Presidential Suite',type:'Presidential',price:18500,capacity:4,description:'An exceptional private retreat with generous living space, refined interiors and an elevated stay experience.',image:'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85'},
{id:2,name:'Imperial Executive Suite',type:'Suite',price:12500,capacity:3,description:'A sophisticated suite combining elegant furnishings, generous space and a calm environment for business or leisure.',image:'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85'},
{id:3,name:'Luxury Deluxe Room',type:'Deluxe',price:8500,capacity:2,description:'A beautifully appointed room offering contemporary comfort, thoughtful details and a relaxing atmosphere.',image:'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85'},
{id:4,name:'Premium Twin Room',type:'Twin',price:7200,capacity:2,description:'A comfortable twin-bed room with a practical layout and refined furnishings for guests traveling together.',image:'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=85'},
{id:5,name:'Classic King Room',type:'Standard',price:6200,capacity:2,description:'A welcoming king room designed around comfort and simplicity, with a spacious bed and peaceful setting.',image:'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=85'},
{id:6,name:'Family Comfort Room',type:'Family',price:9800,capacity:4,description:'A spacious family-friendly room offering generous accommodation and a relaxed environment for small groups.',image:'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=85'}];
function read(){try{return JSON.parse(fs.readFileSync(DB,'utf8'))}catch{return{users:[],bookings:[],messages:[],serviceRequests:[]}}}function save(db){fs.writeFileSync(DB,JSON.stringify(db,null,2))}function token(u){return jwt.sign({id:u.id,email:u.email,role:u.role},SECRET,{expiresIn:'7d'})}
function auth(req,res,next){const h=req.headers.authorization||'';if(!h.startsWith('Bearer '))return res.status(401).json({message:'Authentication required.'});try{req.user=jwt.verify(h.slice(7),SECRET);next()}catch{res.status(401).json({message:'Session expired.'})}}function admin(req,res,next){if(req.user.role!=='admin')return res.status(403).json({message:'Administrator access required.'});next()}
function dates(a,b){const x=new Date(a),y=new Date(b);return a&&b&&!isNaN(x)&&!isNaN(y)&&y>x}function nights(a,b){return Math.ceil((new Date(b)-new Date(a))/86400000)}function available(id,a,b){return !read().bookings.some(x=>x.roomId===id&&!['cancelled','rejected'].includes(x.status)&&new Date(a)<new Date(x.checkOut)&&new Date(b)>new Date(x.checkIn))}
app.use(cors());app.use(express.json());app.use(express.static(FRONT));
app.get('/api/health',(q,r)=>r.json({status:'OK',service:'Abyssinia Grand Hotel API'}));app.get('/api/rooms',(q,r)=>r.json(rooms));app.get('/api/rooms/:id',(q,r)=>{const x=rooms.find(x=>x.id===+q.params.id);x?r.json(x):r.status(404).json({message:'Room not found.'})});
app.post('/api/auth/register',async(q,r)=>{const{name,email,password}=q.body;if(!name||!email||!password||password.length<6)return r.status(400).json({message:'Name, email and a password of at least 6 characters are required.'});const d=read(),e=email.trim().toLowerCase();if(d.users.some(x=>x.email===e))return r.status(409).json({message:'An account with this email already exists.'});const u={id:Date.now(),name:name.trim(),email:e,password:await bcrypt.hash(password,10),role:'guest',createdAt:new Date().toISOString()};d.users.push(u);save(d);r.status(201).json({message:'Account created.',token:token(u),user:{id:u.id,name:u.name,email:u.email,role:u.role}})});
app.post('/api/auth/login',async(q,r)=>{const d=read(),e=String(q.body.email||'').trim().toLowerCase(),u=d.users.find(x=>x.email===e);if(!u||!(await bcrypt.compare(q.body.password||'',u.password)))return r.status(401).json({message:'Invalid email or password.'});r.json({message:'Login successful.',token:token(u),user:{id:u.id,name:u.name,email:u.email,role:u.role}})});
app.get('/api/me',auth,(q,r)=>{const u=read().users.find(x=>x.id===q.user.id);u?r.json({id:u.id,name:u.name,email:u.email,role:u.role}):r.status(404).json({message:'User not found.'})});
app.post('/api/bookings',auth,(q,r)=>{const{roomId,checkIn,checkOut,guests=1}=q.body,room=rooms.find(x=>x.id===+roomId);if(!room)return r.status(404).json({message:'Room not found.'});if(!dates(checkIn,checkOut))return r.status(400).json({message:'Please provide valid dates.'});if(+guests<1||+guests>room.capacity)return r.status(400).json({message:`This room accommodates up to ${room.capacity} guests.`});if(!available(room.id,checkIn,checkOut))return r.status(409).json({message:'That room is unavailable for the selected dates.'});const d=read(),n=nights(checkIn,checkOut),b={id:Date.now(),userId:q.user.id,roomId:room.id,roomName:room.name,checkIn,checkOut,guests:+guests,nights:n,total:n*room.price,status:'confirmed',createdAt:new Date().toISOString()};d.bookings.push(b);save(d);r.status(201).json(b)});
app.get('/api/bookings/me',auth,(q,r)=>r.json(read().bookings.filter(x=>x.userId===q.user.id).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))));
app.delete('/api/bookings/:id',auth,(q,r)=>{const d=read(),b=d.bookings.find(x=>x.id===+q.params.id&&x.userId===q.user.id);if(!b)return r.status(404).json({message:'Reservation not found.'});b.status='cancelled';save(d);r.json({message:'Reservation cancelled.',booking:b})});
app.post('/api/service-requests',auth,(q,r)=>{const{service,items,total}=q.body;if(!service||!Array.isArray(items)||!items.length)return r.status(400).json({message:'Please select at least one service item.'});const cleanItems=items.map(x=>({name:String(x.name||'').trim(),price:Number(x.price)||0})).filter(x=>x.name&&x.price>=0);if(!cleanItems.length)return r.status(400).json({message:'Invalid service items.'});const calculatedTotal=cleanItems.reduce((sum,x)=>sum+x.price,0);const d=read();if(!Array.isArray(d.serviceRequests))d.serviceRequests=[];const request={id:Date.now(),userId:q.user.id,service:String(service).trim(),items:cleanItems,total:calculatedTotal,status:'requested',createdAt:new Date().toISOString()};d.serviceRequests.push(request);save(d);r.status(201).json(request)});
app.get('/api/service-requests/me',auth,(q,r)=>{const d=read();const requests=Array.isArray(d.serviceRequests)?d.serviceRequests:[];r.json(requests.filter(x=>x.userId===q.user.id).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)))});
app.post('/api/contact',(q,r)=>{const{name,email,message}=q.body;if(!name||!email||!message)return r.status(400).json({message:'Please complete all fields.'});const d=read();d.messages.push({id:Date.now(),name:name.trim(),email:email.trim(),message:message.trim(),status:'unread',createdAt:new Date().toISOString()});save(d);r.status(201).json({message:'Your message has been received.'})});
app.get('/api/admin/stats',auth,admin,(q,r)=>{const d=read();r.json({rooms:rooms.length,users:d.users.length,bookings:d.bookings.length,activeBookings:d.bookings.filter(x=>['confirmed','pending'].includes(x.status)).length,messages:d.messages.filter(x=>x.status==='unread').length,revenue:d.bookings.filter(x=>x.status!=='cancelled').reduce((s,x)=>s+x.total,0)})});
app.get('/api/admin/bookings',auth,admin,(q,r)=>{const d=read();r.json(d.bookings.map(b=>({...b,guestName:d.users.find(u=>u.id===b.userId)?.name||'Guest',guestEmail:d.users.find(u=>u.id===b.userId)?.email||''})).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)))});
app.patch('/api/admin/bookings/:id/status',auth,admin,(q,r)=>{const d=read(),b=d.bookings.find(x=>x.id===+q.params.id),allowed=['pending','confirmed','completed','cancelled','rejected'];if(!b)return r.status(404).json({message:'Reservation not found.'});if(!allowed.includes(q.body.status))return r.status(400).json({message:'Invalid status.'});b.status=q.body.status;save(d);r.json(b)});
app.get('/api/admin/service-requests',auth,admin,(q,r)=>{
  const d=read();
  const requests=Array.isArray(d.serviceRequests)?d.serviceRequests:[];
  r.json(requests.map(x=>({
    ...x,
    guestName:d.users.find(u=>u.id===x.userId)?.name||'Guest',
    guestEmail:d.users.find(u=>u.id===x.userId)?.email||''
  })).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)));
});

app.patch('/api/admin/service-requests/:id/status',auth,admin,(q,r)=>{
  const d=read();
  const requests=Array.isArray(d.serviceRequests)?d.serviceRequests:[];
  const item=requests.find(x=>x.id===+q.params.id);
  const allowed=['requested','preparing','completed','cancelled'];

  if(!item)return r.status(404).json({message:'Service request not found.'});
  if(!allowed.includes(q.body.status))return r.status(400).json({message:'Invalid service status.'});

  item.status=q.body.status;
  save(d);
  r.json(item);
});

app.get('/api/admin/messages',auth,admin,(q,r)=>r.json(read().messages));app.patch('/api/admin/messages/:id',auth,admin,(q,r)=>{const d=read(),m=d.messages.find(x=>x.id===+q.params.id);if(!m)return r.status(404).json({message:'Message not found.'});m.status=q.body.status||'read';save(d);r.json(m)});
app.get('/api',(q,r)=>r.json({message:'Abyssinia Grand Hotel API is running',status:'OK'}));app.use((q,r)=>r.sendFile(path.join(FRONT,'index.html')));app.listen(PORT,()=>console.log(`Abyssinia Grand Hotel running on port ${PORT}`));
