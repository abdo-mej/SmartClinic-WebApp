import React, {useEffect, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

const today = new Date().toISOString().slice(0,10);
const roleAccess = {
  admin:['Dashboard','Patients','Medical Records','Doctors','Nurses','Appointments','Consultations','Prescriptions','Laboratory','Pharmacy','Billing','Reports','AI Assistant','Users','Audit'],
  doctor:['Dashboard','Patients','Medical Records','Appointments','Consultations','Prescriptions','Laboratory','AI Assistant'],
  nurse:['Dashboard','Patients','Medical Records','Appointments','Nursing Care','Laboratory'],
  receptionist:['Dashboard','Patients','Appointments','Billing'],
  pharmacist:['Dashboard','Prescriptions','Pharmacy'],
  lab:['Dashboard','Laboratory','Patients'],
  patient:['Dashboard','My Appointments','My Prescriptions','AI Assistant']
};
const users = [
  {id:1,email:'admin@smartclinic.test',password:'password',name:'System Administrator',role:'admin',status:'Active'},
  {id:2,email:'doctor@smartclinic.test',password:'password',name:'Dr. Adam Bennett',role:'doctor',status:'Active'},
  {id:3,email:'nurse@smartclinic.test',password:'password',name:'Nurse Emma Clark',role:'nurse',status:'Active'},
  {id:4,email:'reception@smartclinic.test',password:'password',name:'Sophia Reception',role:'receptionist',status:'Active'},
  {id:5,email:'pharmacy@smartclinic.test',password:'password',name:'Pharmacy Manager',role:'pharmacist',status:'Active'},
  {id:6,email:'lab@smartclinic.test',password:'password',name:'Lab Technician',role:'lab',status:'Active'},
  {id:7,email:'patient@smartclinic.test',password:'password',name:'John Carter',role:'patient',status:'Active'}
];
const seed = {
  patients:[
    {id:1,fileNo:'SC-2026-0001',firstName:'John',lastName:'Carter',gender:'Male',birthDate:'1992-04-16',phone:'+212 600 111 222',email:'john@example.com',blood:'O+',address:'Oujda',cin:'AA120045',insurance:'CNSS',allergies:'Penicillin',chronic:'None',emergency:'Maya Carter - +212 600 999 888',status:'Active'},
    {id:2,fileNo:'SC-2026-0002',firstName:'Amina',lastName:'El Mansouri',gender:'Female',birthDate:'1988-09-02',phone:'+212 600 333 444',email:'amina@example.com',blood:'A+',address:'Casablanca',cin:'BB450012',insurance:'Private',allergies:'None',chronic:'Hypertension',emergency:'Yassine - +212 600 123 123',status:'Active'},
    {id:3,fileNo:'SC-2026-0003',firstName:'Youssef',lastName:'Bennani',gender:'Male',birthDate:'1977-11-21',phone:'+212 600 555 666',email:'youssef@example.com',blood:'B-',address:'Rabat',cin:'CC907711',insurance:'None',allergies:'Aspirin',chronic:'Diabetes type 2',emergency:'Nadia - +212 600 222 333',status:'Active'}
  ],
  doctors:[
    {id:1,name:'Dr. Adam Bennett',specialty:'General Medicine',phone:'+212 611 111 111',email:'doctor@smartclinic.test',room:'A-101',availability:'Mon-Fri 09:00-16:00',status:'Available'},
    {id:2,name:'Dr. Sarah Miller',specialty:'Cardiology',phone:'+212 611 222 222',email:'sarah@smartclinic.test',room:'A-205',availability:'Mon-Thu 10:00-15:00',status:'Busy'},
    {id:3,name:'Dr. Karim Zahraoui',specialty:'Pediatrics',phone:'+212 611 333 333',email:'karim@smartclinic.test',room:'B-020',availability:'Tue-Sat 08:30-14:00',status:'Available'}
  ],
  nurses:[
    {id:1,name:'Nurse Emma Clark',department:'General Care',phone:'+212 622 111 111',shift:'Morning',status:'On duty'},
    {id:2,name:'Nurse Lina Haddad',department:'Emergency',phone:'+212 622 222 222',shift:'Night',status:'On duty'}
  ],
  appointments:[
    {id:1,patientId:1,doctorId:1,date:today,time:'09:30',type:'Consultation',reason:'Fever and fatigue',status:'Confirmed'},
    {id:2,patientId:2,doctorId:2,date:today,time:'11:00',type:'Follow-up',reason:'Chest pain follow-up',status:'Scheduled'},
    {id:3,patientId:3,doctorId:3,date:today,time:'14:15',type:'Consultation',reason:'Vaccination advice',status:'Completed'}
  ],
  records:[
    {id:1,patientId:1,date:today,summary:'Initial medical record opened. Allergic to penicillin.',risk:'Medium',notes:'Avoid beta-lactam antibiotics unless cleared.'},
    {id:2,patientId:2,date:today,summary:'Hypertension follow-up. BP monitoring required.',risk:'Medium',notes:'Cardiology follow-up.'}
  ],
  consultations:[
    {id:1,patientId:3,doctorId:3,date:today,symptoms:'Mild cough, no fever',diagnosis:'Upper respiratory irritation',notes:'Hydration and observation',treatment:'Rest, saline spray',followUp:'7 days'}
  ],
  prescriptions:[
    {id:1,patientId:3,doctorId:3,date:today,medicines:'Paracetamol 500mg | 3 times/day | 3 days\nSaline Spray | 2 sprays/day | 5 days',instructions:'Take after meals. Stop if adverse reaction appears.',status:'Ready'}
  ],
  invoices:[
    {id:1,patientId:3,appointmentId:3,invoice:'INV-2026-0001',amount:250,method:'Cash',status:'Paid',date:today,items:'Consultation pediatrics'}
  ],
  labRequests:[
    {id:1,patientId:2,doctorId:2,test:'CBC + ECG',priority:'Normal',status:'Requested',date:today,result:''}
  ],
  pharmacy:[
    {id:1,medicine:'Paracetamol 500mg',category:'Analgesic',stock:160,unit:'box',alert:30,price:18},
    {id:2,medicine:'Amoxicillin 1g',category:'Antibiotic',stock:45,unit:'box',alert:20,price:42},
    {id:3,medicine:'Saline Spray',category:'ENT',stock:18,unit:'unit',alert:15,price:35},
    {id:4,medicine:'Insulin Pen',category:'Diabetes',stock:12,unit:'unit',alert:10,price:120}
  ],
  inventory:[
  {id:1,item:'Wheelchair',category:'Equipment',stock:8,unit:'unit',status:'Available',price:1500},
  {id:2,item:'Medical Gloves',category:'Consumables',stock:500,unit:'box',status:'Available',price:120},
  {id:3,item:'Syringes',category:'Medical Tools',stock:1000,unit:'unit',status:'Available',price:250}
],
  vitals:[
    {id:1,patientId:1,nurseId:1,date:today,bp:'120/80',heartRate:78,temp:37.2,spo2:98,notes:'Stable'},
    {id:2,patientId:2,nurseId:2,date:today,bp:'145/90',heartRate:84,temp:36.9,spo2:97,notes:'Monitor BP'}
  ],
  
  audit:[{id:1,date:new Date().toLocaleString(),user:'System',action:'SmartClinic Enterprise initialized with demo data'}]
};
const apiPlan = {
  backend:'Laravel API with Sanctum/JWT ready contract',
  database:'PostgreSQL/MySQL entities: users, roles, patients, appointments, records, consultations, prescriptions, invoices, lab, pharmacy, audit',
  ai:'Python AI service endpoints: /chat, /symptoms, /summary, /report'
};
function load(){try{return JSON.parse(localStorage.getItem('smartclinic_enterprise_v4'))||seed}catch{return seed}}
function save(d){localStorage.setItem('smartclinic_enterprise_v4',JSON.stringify(d))}
function id(arr){return arr.length?Math.max(...arr.map(x=>Number(x.id)||0))+1:1}
function patientName(data,pid){const p=data.patients.find(x=>String(x.id)===String(pid));return p?`${p.firstName} ${p.lastName}`:'—'}
function doctorName(data,did){const d=data.doctors.find(x=>String(x.id)===String(did));return d?d.name:'—'}
function age(birth){if(!birth)return '—';return Math.floor((new Date()-new Date(birth))/(365.25*24*3600*1000))}

function App(){
  const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem('smartclinic_user')||'null'));
  const [data,setData]=useState(load());
  const persist=(next,action='Updated data')=>{const audit={id:id(next.audit||[]),date:new Date().toLocaleString(),user:user?.name||'System',action}; const d={...next,audit:[audit,...(next.audit||[])]}; setData(d); save(d)};
  if(!user) return <Login setUser={setUser}/>;
  return <Shell user={user} setUser={setUser} data={data} persist={persist}/>;
}
function Login({setUser}){
  const [email,setEmail]=useState('admin@smartclinic.test'); const [password,setPassword]=useState('password'); const [err,setErr]=useState('');
  function submit(e){e.preventDefault(); const u=users.find(x=>x.email===email&&x.password===password&&x.status==='Active'); if(!u){setErr('Invalid credentials or disabled account.');return} localStorage.setItem('smartclinic_user',JSON.stringify(u)); setUser(u)}
  return <div className="login-shell">
    <section className="login-visual">
      <div className="brand"><div className="mark">✚</div><div><b>SmartClinic Enterprise</b><span>Clinic operating system</span></div></div>
      <div><h1>Modern medical practice management.</h1><p>One clean workspace for administration, clinical records, appointments, prescriptions, billing, laboratory, pharmacy and safe medical AI assistance.</p></div>
      <div className="hero-stats"><Kpi v="5" l="real roles"/><Kpi v="12" l="clinic modules"/><Kpi v="0" l="manual IDs"/></div>
    </section>
    <form className="login-card" onSubmit={submit}>
      <h2>Welcome back</h2><p>Sign in using one of the demo accounts.</p>
      <Label title="Email"><input value={email} onChange={e=>setEmail(e.target.value)}/></Label>
      <Label title="Password"><input type="password" value={password} onChange={e=>setPassword(e.target.value)}/></Label>
      {err && <div className="alert danger">{err}</div>}
      <button className="btn primary full">Sign in</button>
      <div className="demo-list">{users.map(u=><button type="button" key={u.email} onClick={()=>{setEmail(u.email);setPassword('password')}}><b>{u.role}</b><span>{u.email}</span></button>)}</div>
    </form>
  </div>
}
function Shell({user,setUser,data,persist}){
  const nav=roleAccess[user.role]||[]; const [page,setPage]=useState(nav[0]||'Dashboard'); const [compact,setCompact]=useState(false);
  function logout(){localStorage.removeItem('smartclinic_user'); setUser(null)}
  return <div className="app">
    <aside className={compact?'sidebar compact':'sidebar'}>
      <div className="side-top"><div className="mark">✚</div>{!compact&&<div><b>SmartClinic</b><span>Enterprise</span></div>}<button className="iconbtn" onClick={()=>setCompact(!compact)}>☰</button></div>
      <div className="profile">{!compact&&<><b>{user.name}</b><span>{user.role.toUpperCase()}</span></>}</div>
      <nav>{nav.map(n=><button key={n} className={page===n?'active':''} onClick={()=>setPage(n)}><span>{icon(n)}</span>{!compact&&n}</button>)}</nav>
      <button className="btn ghost logout" onClick={logout}>{compact?'⎋':'Logout'}</button>
    </aside>
    <main className="main">
      <header className="topbar"><div><h1>{page}</h1><p>{description(page)}</p></div><div className="top-actions"><span className="chip">{apiPlan.backend}</span><button className="btn ghost" onClick={()=>{localStorage.removeItem('smartclinic_enterprise_v4'); location.reload()}}>Reset demo</button></div></header>
      <Router page={page} user={user} data={data} persist={persist}/>
    </main>
  </div>
}
function Router(p){const pages={Dashboard:Dashboard,Patients:Patients,'Medical Records':Records,Doctors:Doctors,Nurses:Nurses,Appointments:Appointments,'My Appointments':Appointments,Consultations:Consultations,Prescriptions:Prescriptions,'My Prescriptions':Prescriptions,Laboratory:Laboratory,Pharmacy:Pharmacy,Billing:Billing,Reports:Reports,Inventory:Inventory,'AI Assistant':AI,Users:UsersPage,Audit:Audit,'Nursing Care':Vitals}; const C=pages[p.page]||Dashboard; return <C {...p}/>}
function icon(n){return ({Dashboard:'▣',Patients:'☻','Medical Records':'▤',Doctors:'⚕',Nurses:'♡',Appointments:'◷',Consultations:'✎',Prescriptions:'Rx',Laboratory:'⚗',Pharmacy:'▦',Billing:'$',Reports:'◫','AI Assistant':'🤖',Users:'👥',Audit:'☷','My Appointments':'◷','My Prescriptions':'Rx','Nursing Care':'♥'}[n]||'•')}
function description(n){return ({Dashboard:'Live indicators and daily clinical flow.',Patients:'Register, search and manage patients with no manual IDs.', 'Medical Records':'Centralized patient medical history.',Appointments:'Schedule visits using patient and doctor names.',Consultations:'Clinical notes, diagnosis, treatment and follow-up.',Prescriptions:'Create and print safe prescriptions.',Billing:'Invoices, payments and financial tracking.',Laboratory:'Lab requests and results workflow.',Pharmacy:'Medication stock, dispensing and alerts.',Reports:'Operational, clinical and financial insights.',Users:'Role-based access control summary.',Audit:'Traceability of sensitive actions.', 'AI Assistant':'Safe medical orientation and clinical drafting support.'}[n]||'SmartClinic module')}
function Kpi({v,l}){return <div className="kpi"><b>{v}</b><span>{l}</span></div>}
function Label({title,children,wide}){return <label className={wide?'field wide':'field'}><span>{title}</span>{children}</label>}
function Card({title,children,action}){return <section className="card"><div className="card-head"><h3>{title}</h3>{action}</div>{children}</section>}
function Stat({label,value,sub}){return <div className="stat"><span>{label}</span><b>{value}</b><small>{sub}</small></div>}
function Badge({children,tone=''}){return <span className={'badge '+tone}>{children}</span>}
function Modal({title,onClose,children}){return <div className="modal-bg"><div className="modal"><div className="modal-head"><div><h2>{title}</h2><p>Complete required fields, then save changes.</p></div><button className="iconbtn" onClick={onClose}>✕</button></div>{children}</div></div>}
function DataTable({rows,cols,onEdit,onDelete,search='Search...',filters=[]}){const [q,setQ]=useState(''); const [filter,setFilter]=useState('All'); const visible=rows.filter(r=>(filter==='All'||Object.values(r).includes(filter))&&(!q||JSON.stringify(r).toLowerCase().includes(q.toLowerCase()))); return <><div className="toolbar"><input placeholder={search} value={q} onChange={e=>setQ(e.target.value)}/>{filters.length>0&&<select value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option>{filters.map(f=><option key={f}>{f}</option>)}</select>}</div><div className="table-wrap"><table><thead><tr>{cols.map(c=><th key={c.k}>{c.t}</th>)}{(onEdit||onDelete)&&<th className="actions-col">Actions</th>}</tr></thead><tbody>{visible.map(r=><tr key={r.id}>{cols.map(c=><td key={c.k}>{c.render?c.render(r):String(r[c.k]??'')}</td>)}{(onEdit||onDelete)&&<td className="row-actions">{onEdit&&<button className="btn small" onClick={()=>onEdit(r)}>Edit</button>}{onDelete&&<button className="btn small danger" onClick={()=>onDelete(r)}>Archive</button>}</td>}</tr>)}{visible.length===0&&<tr><td colSpan={cols.length+1} className="empty">No data found.</td></tr>}</tbody></table></div></>}
function pick(data,type,idv){return type==='patient'?patientName(data,idv):doctorName(data,idv)}
function selectPatients(data,value,onChange){return <select value={value} onChange={e=>onChange(Number(e.target.value))}>{data.patients.filter(p=>p.status!=='Archived').map(p=><option key={p.id} value={p.id}>{p.fileNo} — {p.firstName} {p.lastName}</option>)}</select>}
function selectDoctors(data,value,onChange){return <select value={value} onChange={e=>onChange(Number(e.target.value))}>{data.doctors.map(d=><option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}</select>}

function Dashboard({data,user}){const paid=data.invoices.filter(i=>i.status==='Paid').reduce((a,b)=>a+Number(b.amount),0); const low=data.pharmacy.filter(x=>x.stock<=x.alert).length; return <div className="content"><div className="stats"><Stat label="Patients" value={data.patients.filter(p=>p.status==='Active').length} sub="active files"/><Stat label="Appointments" value={data.appointments.filter(a=>a.date===today).length} sub="today"/><Stat label="Revenue" value={`${paid} MAD`} sub="paid invoices"/><Stat label="Stock alerts" value={low} sub="items below threshold"/></div><div className="grid two"><Card title="Today schedule"><div className="timeline">{data.appointments.map(a=><div className="timeline-row" key={a.id}><b>{a.time} · {patientName(data,a.patientId)}</b><span>{doctorName(data,a.doctorId)} · {a.reason}</span><Badge tone={a.status==='Completed'?'success':''}>{a.status}</Badge></div>)}</div></Card><Card title="Workspace logic"><p><b>{user.role}</b> sees only modules allowed by role. Forms use patient and doctor names; internal IDs are handled automatically.</p></Card></div></div>}
function Patients({data,persist}){const [m,setM]=useState(null); const save=f=>{let d={...data,patients:[...data.patients]}; if(f.id)d.patients=d.patients.map(x=>x.id===f.id?f:x); else{f.id=id(d.patients);f.fileNo=`SC-2026-${String(f.id).padStart(4,'0')}`;f.status='Active';d.patients.push(f)} persist(d,`Saved patient ${f.firstName} ${f.lastName}`);setM(null)}; const del=r=>{if(confirm('Archive patient file?'))persist({...data,patients:data.patients.map(p=>p.id===r.id?{...p,status:'Archived'}:p)},`Archived patient ${r.fileNo}`)}; return <Card title="Patients" action={<button className="btn primary" onClick={()=>setM({})}>+ New patient</button>}><DataTable rows={data.patients} onEdit={setM} onDelete={del} filters={['Active','Archived','O+','A+','B-']} cols={[{k:'fileNo',t:'File No'},{k:'patient',t:'Patient',render:p=><b>{p.firstName} {p.lastName}</b>},{k:'age',t:'Age',render:p=>age(p.birthDate)},{k:'phone',t:'Phone'},{k:'insurance',t:'Insurance'},{k:'status',t:'Status',render:p=><Badge tone={p.status==='Active'?'success':'danger'}>{p.status}</Badge>}]} />{m&&<Modal title={m.id?'Edit patient':'New patient'} onClose={()=>setM(null)}><PatientForm item={m} save={save}/></Modal>}</Card>}
function PatientForm({item,save}){const [f,setF]=useState({firstName:'',lastName:'',gender:'Female',birthDate:'1990-01-01',phone:'',email:'',blood:'O+',address:'',cin:'',insurance:'CNSS',allergies:'None',chronic:'None',emergency:'',status:'Active',...item}); const set=(k,v)=>setF({...f,[k]:v}); return <><div className="form-grid"><Label title="First name"><input value={f.firstName} onChange={e=>set('firstName',e.target.value)}/></Label><Label title="Last name"><input value={f.lastName} onChange={e=>set('lastName',e.target.value)}/></Label><Label title="Gender"><select value={f.gender} onChange={e=>set('gender',e.target.value)}><option>Female</option><option>Male</option></select></Label><Label title="Birth date"><input type="date" value={f.birthDate} onChange={e=>set('birthDate',e.target.value)}/></Label><Label title="Phone"><input value={f.phone} onChange={e=>set('phone',e.target.value)}/></Label><Label title="Email"><input value={f.email} onChange={e=>set('email',e.target.value)}/></Label><Label title="Blood group"><select value={f.blood} onChange={e=>set('blood',e.target.value)}>{['O+','O-','A+','A-','B+','B-','AB+','AB-'].map(x=><option key={x}>{x}</option>)}</select></Label><Label title="CIN / ID"><input value={f.cin} onChange={e=>set('cin',e.target.value)}/></Label><Label title="Insurance"><input value={f.insurance} onChange={e=>set('insurance',e.target.value)}/></Label><Label title="Address"><input value={f.address} onChange={e=>set('address',e.target.value)}/></Label><Label title="Allergies"><input value={f.allergies} onChange={e=>set('allergies',e.target.value)}/></Label><Label title="Chronic conditions"><input value={f.chronic} onChange={e=>set('chronic',e.target.value)}/></Label><Label title="Emergency contact" wide><input value={f.emergency} onChange={e=>set('emergency',e.target.value)}/></Label></div><div className="actions"><button className="btn primary" onClick={()=>save(f)}>Save patient</button></div></>}
function Doctors({data,persist}){return <Entity title="Doctors" rowsKey="doctors" data={data} persist={persist} blank={{name:'',specialty:'General Medicine',phone:'',email:'',room:'',availability:'Mon-Fri',status:'Available'}} cols={[['name','Doctor'],['specialty','Specialty'],['room','Room'],['availability','Availability'],['status','Status']]}/>} 
function Nurses({data,persist}){return <Entity title="Nurses" rowsKey="nurses" data={data} persist={persist} blank={{name:'',department:'General Care',phone:'',shift:'Morning',status:'On duty'}} cols={[['name','Nurse'],['department','Department'],['shift','Shift'],['phone','Phone'],['status','Status']]}/>} 
function Entity({title,rowsKey,data,persist,blank,cols}){const [m,setM]=useState(null); const rows=data[rowsKey]; const save=f=>{let d={...data,[rowsKey]:[...rows]}; if(f.id)d[rowsKey]=d[rowsKey].map(x=>x.id===f.id?f:x); else{f.id=id(rows);d[rowsKey].push(f)} persist(d,`Saved ${title}`);setM(null)}; return <Card title={title} action={<button className="btn primary" onClick={()=>setM(blank)}>+ Add</button>}><DataTable rows={rows} cols={cols.map(([k,t])=>({k,t,render:k==='status'?r=><Badge>{r[k]}</Badge>:undefined}))} onEdit={setM}/>{m&&<Modal title={`Edit ${title}`} onClose={()=>setM(null)}><SimpleForm item={m} save={save}/></Modal>}</Card>}
function SimpleForm({item,save}){const [f,setF]=useState(item); return <><div className="form-grid">{Object.keys(f).filter(k=>k!=='id').map(k=><Label key={k} title={k}><input value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}/></Label>)}</div><div className="actions"><button className="btn primary" onClick={()=>save(f)}>Save</button></div></>}
function Appointments({data,persist,user}){const rows=user.role==='patient'?data.appointments.filter(a=>a.patientId===1):data.appointments; const [m,setM]=useState(null); const save=f=>{let d={...data,appointments:[...data.appointments]}; const conflict=d.appointments.some(a=>a.id!==f.id&&a.doctorId===f.doctorId&&a.date===f.date&&a.time===f.time&&a.status!=='Cancelled'); if(conflict){alert('This doctor already has an appointment at this date/time.');return} if(f.id)d.appointments=d.appointments.map(x=>x.id===f.id?f:x); else{f.id=id(d.appointments);d.appointments.push(f)} persist(d,'Saved appointment');setM(null)}; return <Card title="Appointments" action={user.role!=='patient'&&<button className="btn primary" onClick={()=>setM({})}>+ Schedule</button>}><DataTable rows={rows} filters={['Scheduled','Confirmed','Completed','Cancelled']} cols={[{k:'date',t:'Date'},{k:'time',t:'Time'},{k:'patientId',t:'Patient',render:r=>patientName(data,r.patientId)},{k:'doctorId',t:'Doctor',render:r=>doctorName(data,r.doctorId)},{k:'reason',t:'Reason'},{k:'status',t:'Status',render:r=><Badge>{r.status}</Badge>}]} onEdit={user.role!=='patient'?setM:null}/>{m&&<Modal title="Appointment" onClose={()=>setM(null)}><AppointmentForm data={data} item={m} save={save}/></Modal>}</Card>}
function AppointmentForm({data,item,save}){const [f,setF]=useState({patientId:data.patients[0]?.id,doctorId:data.doctors[0]?.id,date:today,time:'09:00',type:'Consultation',reason:'',status:'Scheduled',...item}); const set=(k,v)=>setF({...f,[k]:v}); return <><div className="form-grid"><Label title="Patient">{selectPatients(data,f.patientId,v=>set('patientId',v))}</Label><Label title="Doctor">{selectDoctors(data,f.doctorId,v=>set('doctorId',v))}</Label><Label title="Date"><input type="date" value={f.date} onChange={e=>set('date',e.target.value)}/></Label><Label title="Time"><input type="time" value={f.time} onChange={e=>set('time',e.target.value)}/></Label><Label title="Type"><select value={f.type} onChange={e=>set('type',e.target.value)}><option>Consultation</option><option>Follow-up</option><option>Emergency</option><option>Lab visit</option></select></Label><Label title="Status"><select value={f.status} onChange={e=>set('status',e.target.value)}><option>Scheduled</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option><option>Missed</option></select></Label><Label title="Reason" wide><textarea value={f.reason} onChange={e=>set('reason',e.target.value)}/></Label></div><div className="actions"><button className="btn primary" onClick={()=>save(f)}>Save appointment</button></div></>}
function Records({data,persist}){const [m,setM]=useState(null); const save=f=>{let d={...data,records:[...data.records]}; if(f.id)d.records=d.records.map(x=>x.id===f.id?f:x); else{f.id=id(d.records);d.records.push(f)} persist(d,'Saved medical record');setM(null)}; return <Card title="Medical Records" action={<button className="btn primary" onClick={()=>setM({})}>+ Add note</button>}><DataTable rows={data.records} cols={[{k:'patientId',t:'Patient',render:r=>patientName(data,r.patientId)},{k:'date',t:'Date'},{k:'summary',t:'Summary'},{k:'risk',t:'Risk',render:r=><Badge tone={r.risk==='High'?'danger':''}>{r.risk}</Badge>},{k:'notes',t:'Notes'}]} onEdit={setM}/>{m&&<Modal title="Medical record" onClose={()=>setM(null)}><RecordForm data={data} item={m} save={save}/></Modal>}</Card>}
function RecordForm({data,item,save}){const [f,setF]=useState({patientId:data.patients[0]?.id,date:today,summary:'',risk:'Low',notes:'',...item}); const set=(k,v)=>setF({...f,[k]:v}); return <><div className="form-grid"><Label title="Patient">{selectPatients(data,f.patientId,v=>set('patientId',v))}</Label><Label title="Date"><input type="date" value={f.date} onChange={e=>set('date',e.target.value)}/></Label><Label title="Risk"><select value={f.risk} onChange={e=>set('risk',e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></Label><Label title="Summary" wide><textarea value={f.summary} onChange={e=>set('summary',e.target.value)}/></Label><Label title="Clinical notes" wide><textarea value={f.notes} onChange={e=>set('notes',e.target.value)}/></Label></div><div className="actions"><button className="btn primary" onClick={()=>save(f)}>Save record</button></div></>}
function Consultations({data,persist}){const [m,setM]=useState(null); const save=f=>{let d={...data,consultations:[...data.consultations]}; if(f.id)d.consultations=d.consultations.map(x=>x.id===f.id?f:x); else{f.id=id(d.consultations);d.consultations.push(f)} persist(d,'Saved consultation');setM(null)}; return <Card title="Consultations" action={<button className="btn primary" onClick={()=>setM({})}>+ New consultation</button>}><DataTable rows={data.consultations} cols={[{k:'date',t:'Date'},{k:'patientId',t:'Patient',render:r=>patientName(data,r.patientId)},{k:'doctorId',t:'Doctor',render:r=>doctorName(data,r.doctorId)},{k:'symptoms',t:'Symptoms'},{k:'diagnosis',t:'Diagnosis'},{k:'followUp',t:'Follow-up'}]} onEdit={setM}/>{m&&<Modal title="Consultation" onClose={()=>setM(null)}><ConsultForm data={data} item={m} save={save}/></Modal>}</Card>}
function ConsultForm({data,item,save}){const [f,setF]=useState({patientId:data.patients[0]?.id,doctorId:data.doctors[0]?.id,date:today,symptoms:'',diagnosis:'',notes:'',treatment:'',followUp:'',...item}); const set=(k,v)=>setF({...f,[k]:v}); return <><div className="form-grid"><Label title="Patient">{selectPatients(data,f.patientId,v=>set('patientId',v))}</Label><Label title="Doctor">{selectDoctors(data,f.doctorId,v=>set('doctorId',v))}</Label><Label title="Date"><input type="date" value={f.date} onChange={e=>set('date',e.target.value)}/></Label><Label title="Symptoms" wide><textarea value={f.symptoms} onChange={e=>set('symptoms',e.target.value)}/></Label><Label title="Diagnosis" wide><textarea value={f.diagnosis} onChange={e=>set('diagnosis',e.target.value)}/></Label><Label title="Treatment" wide><textarea value={f.treatment} onChange={e=>set('treatment',e.target.value)}/></Label><Label title="Follow-up"><input value={f.followUp} onChange={e=>set('followUp',e.target.value)}/></Label></div><div className="actions"><button className="btn primary" onClick={()=>save(f)}>Save consultation</button></div></>}
function Prescriptions({data,persist,user}){const rows=user.role==='patient'?data.prescriptions.filter(p=>p.patientId===1):data.prescriptions; const [m,setM]=useState(null); const save=f=>{let d={...data,prescriptions:[...data.prescriptions]}; if(f.id)d.prescriptions=d.prescriptions.map(x=>x.id===f.id?f:x); else{f.id=id(d.prescriptions);d.prescriptions.push(f)} persist(d,'Saved prescription');setM(null)}; return <Card title="Prescriptions" action={user.role!=='patient'&&<button className="btn primary" onClick={()=>setM({})}>+ Prescription</button>}><DataTable rows={rows} cols={[{k:'date',t:'Date'},{k:'patientId',t:'Patient',render:r=>patientName(data,r.patientId)},{k:'doctorId',t:'Doctor',render:r=>doctorName(data,r.doctorId)},{k:'medicines',t:'Medicines',render:r=><pre>{r.medicines}</pre>},{k:'status',t:'Status',render:r=><Badge>{r.status}</Badge>}]} onEdit={user.role!=='patient'?setM:null}/>{m&&<Modal title="Prescription" onClose={()=>setM(null)}><PrescriptionForm data={data} item={m} save={save}/></Modal>}<button className="btn ghost print" onClick={()=>printDoc('Prescription',rxTemplate(data, rows[0]))}>Print sample prescription</button></Card>}
function PrescriptionForm({data,item,save}){const [f,setF]=useState({patientId:data.patients[0]?.id,doctorId:data.doctors[0]?.id,date:today,medicines:'',instructions:'',status:'Draft',...item}); const set=(k,v)=>setF({...f,[k]:v}); return <><div className="form-grid"><Label title="Patient">{selectPatients(data,f.patientId,v=>set('patientId',v))}</Label><Label title="Doctor">{selectDoctors(data,f.doctorId,v=>set('doctorId',v))}</Label><Label title="Date"><input type="date" value={f.date} onChange={e=>set('date',e.target.value)}/></Label><Label title="Status"><select value={f.status} onChange={e=>set('status',e.target.value)}><option>Draft</option><option>Ready</option><option>Dispensed</option></select></Label><Label title="Medicines: name | dosage | frequency | duration" wide><textarea value={f.medicines} onChange={e=>set('medicines',e.target.value)} /></Label><Label title="Instructions" wide><textarea value={f.instructions} onChange={e=>set('instructions',e.target.value)}/></Label></div><div className="actions"><button className="btn ghost" onClick={()=>printDoc('Prescription',rxTemplate(data,f))}>Print / PDF</button><button className="btn primary" onClick={()=>save(f)}>Save prescription</button></div></>}
function Laboratory({data,persist}){const [m,setM]=useState(null); const save=f=>{let d={...data,labRequests:[...data.labRequests]}; if(f.id)d.labRequests=d.labRequests.map(x=>x.id===f.id?f:x); else{f.id=id(d.labRequests);d.labRequests.push(f)} persist(d,'Saved lab request');setM(null)}; return <Card title="Laboratory" action={<button className="btn primary" onClick={()=>setM({})}>+ Lab request</button>}><DataTable rows={data.labRequests} filters={['Requested','In progress','Completed']} cols={[{k:'date',t:'Date'},{k:'patientId',t:'Patient',render:r=>patientName(data,r.patientId)},{k:'test',t:'Test'},{k:'priority',t:'Priority'},{k:'status',t:'Status',render:r=><Badge>{r.status}</Badge>},{k:'result',t:'Result'}]} onEdit={setM}/>{m&&<Modal title="Lab request" onClose={()=>setM(null)}><LabForm data={data} item={m} save={save}/></Modal>}</Card>}
function LabForm({data,item,save}){const [f,setF]=useState({patientId:data.patients[0]?.id,doctorId:data.doctors[0]?.id,test:'',priority:'Normal',status:'Requested',date:today,result:'',...item}); const set=(k,v)=>setF({...f,[k]:v}); return <><div className="form-grid"><Label title="Patient">{selectPatients(data,f.patientId,v=>set('patientId',v))}</Label><Label title="Doctor">{selectDoctors(data,f.doctorId,v=>set('doctorId',v))}</Label><Label title="Test"><input value={f.test} onChange={e=>set('test',e.target.value)}/></Label><Label title="Priority"><select value={f.priority} onChange={e=>set('priority',e.target.value)}><option>Normal</option><option>Urgent</option></select></Label><Label title="Status"><select value={f.status} onChange={e=>set('status',e.target.value)}><option>Requested</option><option>In progress</option><option>Completed</option></select></Label><Label title="Result" wide><textarea value={f.result} onChange={e=>set('result',e.target.value)}/></Label></div><div className="actions"><button className="btn primary" onClick={()=>save(f)}>Save lab</button></div></>}
function Pharmacy({data,persist}){return <Entity title="Pharmacy Medicines" rowsKey="pharmacy" data={data} persist={persist} blank={{medicine:'',category:'',stock:0,unit:'box',alert:10,price:0}} cols={[['medicine','Medicine'],['category','Category'],['stock','Stock'],['unit','Unit'],['alert','Alert'],['price','Price']]}/>} 
function Inventory({data,persist}){
  return (
    <Entity
      title="Medical Equipment Inventory"
      rowsKey="inventory"
      data={data}
      persist={persist}
      blank={{
        item:'',
        category:'',
        stock:0,
        unit:'unit',
        status:'Available',
        price:0
      }}
      cols={[
        ['item','Item'],
        ['category','Category'],
        ['stock','Stock'],
        ['unit','Unit'],
        ['status','Status'],
        ['price','Price']
      ]}
    />
  )
}
function Billing({data,persist}){const [m,setM]=useState(null); const save=f=>{let d={...data,invoices:[...data.invoices]}; if(f.id)d.invoices=d.invoices.map(x=>x.id===f.id?f:x); else{f.id=id(d.invoices);f.invoice=`INV-2026-${String(f.id).padStart(4,'0')}`;d.invoices.push(f)} persist(d,'Saved invoice');setM(null)}; return <Card title="Billing & Invoices" action={<button className="btn primary" onClick={()=>setM({})}>+ Invoice</button>}><DataTable rows={data.invoices} filters={['Paid','Pending','Cancelled']} cols={[{k:'invoice',t:'Invoice',render:r=><b>{r.invoice}</b>},{k:'patientId',t:'Patient',render:r=>patientName(data,r.patientId)},{k:'items',t:'Items'},{k:'amount',t:'Amount',render:r=>`${r.amount} MAD`},{k:'method',t:'Method'},{k:'status',t:'Status',render:r=><Badge tone={r.status==='Paid'?'success':''}>{r.status}</Badge>}]} onEdit={setM}/>{m&&<Modal title="Invoice" onClose={()=>setM(null)}><InvoiceForm data={data} item={m} save={save}/></Modal>}</Card>}
function InvoiceForm({data,item,save}){const [f,setF]=useState({patientId:data.patients[0]?.id,appointmentId:data.appointments[0]?.id,invoice:'',amount:0,method:'Cash',status:'Paid',date:today,items:'Consultation',...item}); const set=(k,v)=>setF({...f,[k]:v}); return <><div className="form-grid"><Label title="Patient">{selectPatients(data,f.patientId,v=>set('patientId',v))}</Label><Label title="Amount"><input type="number" value={f.amount} onChange={e=>set('amount',Number(e.target.value))}/></Label><Label title="Method"><select value={f.method} onChange={e=>set('method',e.target.value)}><option>Cash</option><option>Card</option><option>Insurance</option><option>Bank transfer</option></select></Label><Label title="Status"><select value={f.status} onChange={e=>set('status',e.target.value)}><option>Paid</option><option>Pending</option><option>Cancelled</option></select></Label><Label title="Items" wide><textarea value={f.items} onChange={e=>set('items',e.target.value)}/></Label></div><div className="actions"><button className="btn ghost" onClick={()=>printDoc('Invoice',invoiceTemplate(data,f))}>Print / PDF</button><button className="btn primary" onClick={()=>save(f)}>Save invoice</button></div></>}
function Vitals({data,persist}){const [m,setM]=useState(null); const save=f=>{let d={...data,vitals:[...data.vitals]}; if(f.id)d.vitals=d.vitals.map(x=>x.id===f.id?f:x); else{f.id=id(d.vitals);d.vitals.push(f)} persist(d,'Saved vitals');setM(null)}; return <Card title="Nursing care & vitals" action={<button className="btn primary" onClick={()=>setM({})}>+ Record vitals</button>}><DataTable rows={data.vitals} cols={[{k:'patientId',t:'Patient',render:r=>patientName(data,r.patientId)},{k:'date',t:'Date'},{k:'bp',t:'BP'},{k:'heartRate',t:'HR'},{k:'temp',t:'Temp'},{k:'spo2',t:'SpO2'},{k:'notes',t:'Notes'}]} onEdit={setM}/>{m&&<Modal title="Vitals" onClose={()=>setM(null)}><VitalsForm data={data} item={m} save={save}/></Modal>}</Card>}
function VitalsForm({data,item,save}){const [f,setF]=useState({patientId:data.patients[0]?.id,nurseId:data.nurses[0]?.id,date:today,bp:'',heartRate:70,temp:37,spo2:98,notes:'',...item}); const set=(k,v)=>setF({...f,[k]:v}); return <><div className="form-grid"><Label title="Patient">{selectPatients(data,f.patientId,v=>set('patientId',v))}</Label><Label title="Nurse"><select value={f.nurseId} onChange={e=>set('nurseId',Number(e.target.value))}>{data.nurses.map(n=><option key={n.id} value={n.id}>{n.name}</option>)}</select></Label><Label title="Blood pressure"><input value={f.bp} onChange={e=>set('bp',e.target.value)}/></Label><Label title="Heart rate"><input type="number" value={f.heartRate} onChange={e=>set('heartRate',Number(e.target.value))}/></Label><Label title="Temperature"><input type="number" step="0.1" value={f.temp} onChange={e=>set('temp',Number(e.target.value))}/></Label><Label title="SpO2"><input type="number" value={f.spo2} onChange={e=>set('spo2',Number(e.target.value))}/></Label><Label title="Notes" wide><textarea value={f.notes} onChange={e=>set('notes',e.target.value)}/></Label></div><div className="actions"><button className="btn primary" onClick={()=>save(f)}>Save vitals</button></div></>}
function AI({data}){const [msgs,setMsgs]=useState([{from:'ai',text:'I am SmartClinic AI. I can help with symptom orientation, triage, consultation summaries and clinic workflow. I do not replace a qualified doctor.'}]); const [t,setT]=useState(''); const send=()=>{if(!t.trim())return; setMsgs([...msgs,{from:'user',text:t},{from:'ai',text:ai(t,data)}]); setT('')}; return <div className="grid two"><Card title="Medical AI Assistant"><div className="chat"><div className="msgs">{msgs.map((m,i)=><div key={i} className={'msg '+m.from}>{m.text}</div>)}</div><div className="chatbar"><input value={t} onChange={e=>setT(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask about symptoms, triage, prescriptions, workflow..."/><button className="btn primary" onClick={send}>Send</button></div></div></Card><Card title="AI safety rules"><div className="alert info">The assistant gives orientation only. It must not provide a final diagnosis, emergency decisions, or replace medical responsibility.</div><ul><li>Symptom analysis</li><li>Triage advice and red flags</li><li>Consultation summary draft</li><li>Prescription/report drafting support</li><li>Clinic workflow guidance</li></ul></Card></div>}
function ai(q,data){
  const s = q.toLowerCase();

  if(/symptom|symptoms|symptome|symptômes|analyse|orientation/.test(s)){
    return "Symptom orientation: describe the main symptom, duration, intensity, age, temperature, pain level, breathing, allergies and medical history. Red flags include chest pain, breathing difficulty, confusion, severe bleeding, fainting, very high fever, or low oxygen. In these cases, urgent medical evaluation is required.";
  }

  if(/triage|urgent|emergency|urgence|red flag|danger/.test(s)){
    return "Triage guidance: classify the case as low, medium or high priority. High priority includes chest pain, severe shortness of breath, loss of consciousness, stroke symptoms, severe allergic reaction, uncontrolled bleeding, or SpO2 below 92%. These cases require urgent care.";
  }

  if(/chest|heart|cardiac|pressure|douleur thoracique|coeur/.test(s)){
    return "Chest pain can be serious, especially with shortness of breath, sweating, fainting, nausea, or pain spreading to the arm/jaw. The safest action is urgent medical evaluation.";
  }

  if(/fever|cough|flu|temp|cold|fièvre|toux|grippe/.test(s)){
    return "Fever or cough may be viral infection, flu, allergy, COVID-like illness, or bacterial infection depending on duration, temperature, SpO2 and risk factors. Record vitals and consult a doctor if symptoms persist or worsen.";
  }

  if(/prescription|medicine|dose|pharmacy|médicament|ordonnance/.test(s)){
    return "Prescription workflow: the doctor creates the prescription, the pharmacist verifies allergies, dosage, interactions and stock, then the prescription can be dispensed.";
  }

  if(/appointment|rdv|schedule|rendez-vous/.test(s)){
    return `Today there are ${data.appointments.filter(a=>a.date===today).length} appointments. Use Appointments module to schedule, confirm or complete visits.`;
  }

  if(/lab|analysis|test|laboratory|analyse/.test(s)){
    return "Laboratory workflow: the doctor requests tests, the lab technician records results, and the doctor validates the clinical interpretation.";
  }

  if(/billing|invoice|payment|facture|paiement/.test(s)){
    return "Billing workflow: create an invoice linked to the patient, select items, amount, payment method and status, then print or export the invoice.";
  }

  return "I can help with clinic workflow, symptom orientation, triage, appointments, prescriptions, laboratory, pharmacy and billing. Please describe the case with more details.";
}
function UsersPage(){return <Card title="Users & permissions"><DataTable rows={users.map(u=>({...u,access:(roleAccess[u.role]||[]).join(', ')}))} cols={[{k:'name',t:'Name'},{k:'email',t:'Email'},{k:'role',t:'Role',render:r=><Badge>{r.role}</Badge>},{k:'status',t:'Status'},{k:'access',t:'Allowed modules'}]}/></Card>}
function Reports({data}){const revenue=data.invoices.filter(i=>i.status==='Paid').reduce((a,b)=>a+Number(b.amount),0); return <div className="content"><div className="stats"><Stat label="Revenue" value={`${revenue} MAD`} sub="paid"/><Stat label="Completed visits" value={data.appointments.filter(a=>a.status==='Completed').length} sub="appointments"/><Stat label="Lab pending" value={data.labRequests.filter(x=>x.status!=='Completed').length} sub="requests"/><Stat label="Low stock" value={data.pharmacy.filter(x=>x.stock<=x.alert).length} sub="alerts"/></div><Card title="Management recommendations"><ul><li>Separate clinical and administrative permissions.</li><li>Review low stock every morning.</li><li>Convert completed appointments to consultations and invoices.</li><li>Keep AI output as draft assistance only.</li></ul></Card></div>}
function Audit({data}){return <Card title="Audit log"><DataTable rows={data.audit} cols={[{k:'date',t:'Date'},{k:'user',t:'User'},{k:'action',t:'Action'}]}/></Card>}
function printDoc(title,html){const w=window.open('','_blank'); w.document.write(`<html><head><title>${title}</title><style>body{font-family:Arial;padding:35px;color:#111}h1{text-align:center}.doc{max-width:800px;margin:auto}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ddd;padding:10px}.sign{display:flex;justify-content:space-between;margin-top:60px}</style></head><body><div class="doc">${html}</div><script>window.print()</script></body></html>`); w.document.close()}
function rxTemplate(data,r={}){return `<h1>Medical Prescription</h1><p><b>Date:</b> ${r.date||today}</p><p><b>Patient:</b> ${patientName(data,r.patientId)}</p><p><b>Doctor:</b> ${doctorName(data,r.doctorId)}</p><h3>Medicines</h3><pre>${r.medicines||''}</pre><h3>Instructions</h3><p>${r.instructions||''}</p><p><b>Warning:</b> verify allergies and dosage before dispensing.</p><div class="sign"><span>Doctor signature</span><span>Clinic stamp</span></div>`}
function invoiceTemplate(data,r={}){return `<h1>Invoice</h1><p><b>Invoice:</b> ${r.invoice||'Draft'}</p><p><b>Patient:</b> ${patientName(data,r.patientId)}</p><table><tr><th>Items</th><th>Amount</th></tr><tr><td>${r.items||''}</td><td>${r.amount||0} MAD</td></tr></table><p><b>Method:</b> ${r.method||''} | <b>Status:</b> ${r.status||''}</p>`}

createRoot(document.getElementById('root')).render(<App/>);
