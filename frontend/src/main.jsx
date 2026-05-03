
import React, {useMemo, useState} from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const today = new Date().toISOString().slice(0,10);
const roles = {
  admin: ['Dashboard','Users','Patients','Doctors','Nurses','Appointments','Consultations','Prescriptions','Laboratory','Pharmacy','Billing','Inventory','Reports','AI Assistant','Audit'],
  doctor: ['Dashboard','Patients','Appointments','Consultations','Prescriptions','Laboratory','AI Assistant'],
  nurse: ['Dashboard','Patients','Appointments','Nursing Care','Vitals','Laboratory'],
  secretary: ['Dashboard','Patients','Appointments','Billing'],
  pharmacist: ['Dashboard','Prescriptions','Pharmacy','Inventory'],
  lab: ['Dashboard','Laboratory','Patients'],
  patient: ['Dashboard','My Appointments','My Prescriptions','AI Assistant']
};
const demoUsers=[
 {email:'admin@smartclinic.test',password:'password',role:'admin',name:'System Administrator'},
 {email:'doctor@smartclinic.test',password:'password',role:'doctor',name:'Dr. Adam Bennett'},
 {email:'nurse@smartclinic.test',password:'password',role:'nurse',name:'Nurse Emma Clark'},
 {email:'secretary@smartclinic.test',password:'password',role:'secretary',name:'Sophia Reception'},
 {email:'pharmacist@smartclinic.test',password:'password',role:'pharmacist',name:'Pharmacy Manager'},
 {email:'lab@smartclinic.test',password:'password',role:'lab',name:'Lab Technician'},
 {email:'patient@smartclinic.test',password:'password',role:'patient',name:'John Carter'}
];

const seed = {
 patients:[
  {id:1,fileNo:'SC-2026-0001',firstName:'John',lastName:'Carter',gender:'Male',birthDate:'1992-04-16',phone:'+212 600 111 222',email:'john@example.com',blood:'O+',address:'Oujda',allergies:'Penicillin',status:'Active'},
  {id:2,fileNo:'SC-2026-0002',firstName:'Amina',lastName:'El Mansouri',gender:'Female',birthDate:'1988-09-02',phone:'+212 600 333 444',email:'amina@example.com',blood:'A+',address:'Casablanca',allergies:'None',status:'Active'},
  {id:3,fileNo:'SC-2026-0003',firstName:'Youssef',lastName:'Bennani',gender:'Male',birthDate:'1977-11-21',phone:'+212 600 555 666',email:'youssef@example.com',blood:'B-',address:'Rabat',allergies:'Aspirin',status:'Active'}
 ],
 doctors:[
  {id:1,name:'Dr. Adam Bennett',specialty:'General Medicine',phone:'+212 611 111 111',email:'doctor@smartclinic.test',room:'A-101',status:'Available'},
  {id:2,name:'Dr. Sarah Miller',specialty:'Cardiology',phone:'+212 611 222 222',email:'sarah@smartclinic.test',room:'A-205',status:'Busy'},
  {id:3,name:'Dr. Karim Zahraoui',specialty:'Pediatrics',phone:'+212 611 333 333',email:'karim@smartclinic.test',room:'B-020',status:'Available'}
 ],
 nurses:[
  {id:1,name:'Nurse Emma Clark',department:'General Care',phone:'+212 622 111 111',shift:'Morning',status:'On duty'},
  {id:2,name:'Nurse Lina Haddad',department:'Emergency',phone:'+212 622 222 222',shift:'Night',status:'On duty'}
 ],
 appointments:[
  {id:1,patientId:1,doctorId:1,date:today,time:'09:30',type:'Consultation',reason:'Fever and fatigue',status:'Confirmed'},
  {id:2,patientId:2,doctorId:2,date:today,time:'11:00',type:'Follow-up',reason:'Chest pain follow-up',status:'Scheduled'},
  {id:3,patientId:3,doctorId:3,date:today,time:'14:15',type:'Consultation',reason:'Child vaccination advice',status:'Completed'}
 ],
 consultations:[
  {id:1,patientId:3,doctorId:3,date:today,symptoms:'Mild cough, no fever',diagnosis:'Upper respiratory irritation',notes:'Hydration and observation',treatment:'Rest, saline spray',followUp:'7 days'}
 ],
 prescriptions:[
  {id:1,patientId:3,doctorId:3,date:today,medicines:[{name:'Paracetamol',dosage:'500mg',frequency:'3 times/day',duration:'3 days'}],instructions:'Take after meals.',status:'Ready'}
 ],
 payments:[
  {id:1,patientId:3,appointmentId:3,amount:250,method:'Cash',status:'Paid',date:today,invoice:'INV-2026-0001'}
 ],
 labRequests:[
  {id:1,patientId:2,doctorId:2,test:'CBC + ECG',priority:'Normal',status:'Requested',date:today,result:''}
 ],
 pharmacy:[
  {id:1,medicine:'Paracetamol 500mg',category:'Analgesic',stock:160,unit:'box',alert:30,price:18},
  {id:2,medicine:'Amoxicillin 1g',category:'Antibiotic',stock:45,unit:'box',alert:20,price:42},
  {id:3,medicine:'Saline Spray',category:'ENT',stock:18,unit:'unit',alert:15,price:35}
 ],
 vitals:[
  {id:1,patientId:1,nurseId:1,date:today,bp:'120/80',heartRate:78,temp:37.2,spo2:98,notes:'Stable'}
 ],
 audit:[
  {id:1,date:new Date().toLocaleString(),user:'System',action:'Application initialized with demo data'}
 ]
};

function loadData(){ const s=localStorage.getItem('clinic_os_data_v3'); return s?JSON.parse(s):seed; }
function saveData(data){ localStorage.setItem('clinic_os_data_v3', JSON.stringify(data)); }
function nextId(arr){ return arr.length?Math.max(...arr.map(x=>x.id||0))+1:1; }
function nameById(arr,id,field='name'){ const x=arr.find(a=>String(a.id)===String(id)); return x? (field==='patient'?`${x.firstName} ${x.lastName}`:x.name) : '—'; }

function App(){
 const [user,setUser]=useState(JSON.parse(localStorage.getItem('clinic_user')||'null'));
 const [data,setData]=useState(loadData());
 const persist=(d, action='Updated data')=>{setData(d);saveData(d);};
 if(!user) return <Login onLogin={setUser}/>;
 return <Clinic user={user} setUser={setUser} data={data} persist={persist}/>;
}

function Login({onLogin}){
 const [email,setEmail]=useState('admin@smartclinic.test'),[password,setPassword]=useState('password'),[err,setErr]=useState('');
 const submit=e=>{e.preventDefault(); const u=demoUsers.find(x=>x.email===email && x.password===password); if(!u){setErr('Invalid email or password. Use one of the demo accounts.'); return;} localStorage.setItem('clinic_user',JSON.stringify(u)); onLogin(u);}
 return <div className="login-shell">
  <div className="login-hero">
   <div className="brand"><div className="logo">✚</div> SmartClinic ClinicOS</div>
   <div className="hero-card"><h1>Modern clinic management, from reception to care delivery.</h1><p>A complete role-based clinic operating system: appointments, EMR, nursing care, prescriptions, pharmacy, lab, billing, reports and safe clinical AI assistance.</p>
    <div className="hero-grid"><div className="mini"><b>7</b><span>separate roles</span></div><div className="mini"><b>14</b><span>clinic modules</span></div><div className="mini"><b>0</b><span>manual IDs in forms</span></div></div>
   </div>
   <small style={{color:'#64748b'}}>Academic prototype. Not certified for real medical production use without security/legal validation.</small>
  </div>
  <div className="login-panel"><form className="login-box" onSubmit={submit}>
   <h2>Sign in</h2><p>Choose a demo account. Each role sees a different workspace.</p>
   <div className="field"><label>Email</label><input className="input" value={email} onChange={e=>setEmail(e.target.value)}/></div>
   <div className="field"><label>Password</label><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)}/></div>
   {err && <div className="notice" style={{background:'#fef2f2',borderColor:'#fecaca',color:'#991b1b'}}>{err}</div>}
   <button className="btn btn-primary" style={{width:'100%',marginTop:10}}>Login</button>
   <div className="demo-users">{demoUsers.map(u=><div key={u.email} className="demo-pill" onClick={()=>{setEmail(u.email);setPassword('password')}}><b>{u.role}</b><br/>{u.email}</div>)}</div>
  </form></div>
 </div>
}

function Clinic({user,setUser,data,persist}){
 const [page,setPage]=useState(roles[user.role][0]);
 const nav=roles[user.role];
 const logout=()=>{localStorage.removeItem('clinic_user');setUser(null)}
 return <div className="app">
  <aside className="sidebar">
   <div className="side-brand"><div className="logo">✚</div><div><h2>ClinicOS</h2><span>SmartClinic Pro</span></div></div>
   <div className="user-card"><b>{user.name}</b><span>{user.role.toUpperCase()} workspace</span></div>
   <div className="nav">{nav.map(n=><button key={n} className={page===n?'active':''} onClick={()=>setPage(n)}>{icon(n)} {n}</button>)}</div>
   <button className="btn btn-soft" style={{width:'100%',marginTop:18}} onClick={logout}>Logout</button>
  </aside>
  <main className="main">
   <div className="topbar"><div><h1>{page}</h1><p>{subtitle(page,user.role)}</p></div><span className="badge">Backend status: local working mode</span></div>
   <Page page={page} user={user} data={data} persist={persist}/>
  </main>
 </div>
}

function icon(n){ const m={Dashboard:'▣',Patients:'☻',Doctors:'⚕',Nurses:'♡',Appointments:'◷',Consultations:'✎',Prescriptions:'Rx',Laboratory:'⚗',Pharmacy:'▤',Billing:'$','AI Assistant':'AI',Reports:'◫',Audit:'☷',Inventory:'▦','Nursing Care':'♡',Vitals:'♥','Users':'👥','My Appointments':'◷','My Prescriptions':'Rx'}; return m[n]||'•'}
function subtitle(p,r){return {
 Dashboard:`Overview adapted to ${r} permissions.`,
 Patients:'Search, register and manage patient profiles without typing technical IDs.',
 Doctors:'Manage doctors, specialties, rooms and availability.',
 Nurses:'Manage nursing staff, shifts and departments.',
 Appointments:'Schedule visits by selecting patient and doctor names.',
 Consultations:'Clinical workflow, diagnosis, treatment and follow-up.',
 Prescriptions:'Create, print and dispense prescriptions.',
 Laboratory:'Lab requests, results and clinical validation.',
 Pharmacy:'Medication stock, dispensing and alerts.',
 Billing:'Invoices, payments and revenue follow-up.',
 Inventory:'Medical and pharmacy stock monitoring.',
 Reports:'Operational and financial analytics.',
 'AI Assistant':'Safe clinical support for orientation, not final diagnosis.',
 Audit:'Trace important actions.',
 Users:'Role-based users and permissions.'
}[p]||'SmartClinic module'}

function Page(props){
 const {page}=props;
 if(page==='Dashboard') return <Dashboard {...props}/>;
 if(page==='Users') return <Users {...props}/>;
 if(page==='Patients') return <Patients {...props}/>;
 if(page==='Doctors') return <Doctors {...props}/>;
 if(page==='Nurses') return <Nurses {...props}/>;
 if(page==='Appointments'||page==='My Appointments') return <Appointments {...props}/>;
 if(page==='Consultations') return <Consultations {...props}/>;
 if(page==='Prescriptions'||page==='My Prescriptions') return <Prescriptions {...props}/>;
 if(page==='Laboratory') return <Laboratory {...props}/>;
 if(page==='Pharmacy'||page==='Inventory') return <Pharmacy {...props}/>;
 if(page==='Billing') return <Billing {...props}/>;
 if(page==='AI Assistant') return <AI {...props}/>;
 if(page==='Reports') return <Reports {...props}/>;
 if(page==='Audit') return <Audit {...props}/>;
 if(page==='Nursing Care'||page==='Vitals') return <Vitals {...props}/>;
 return <div className="card">Module ready.</div>
}

function Dashboard({data,user}){
 const revenue=data.payments.filter(p=>p.status==='Paid').reduce((a,b)=>a+Number(b.amount),0);
 return <div className="content">
  <div className="cards">
   <Stat label="Active patients" value={data.patients.length}/>
   <Stat label="Doctors" value={data.doctors.length}/>
   <Stat label="Appointments today" value={data.appointments.filter(a=>a.date===today).length}/>
   <Stat label="Revenue" value={`${revenue} MAD`}/>
  </div>
  <div className="grid-2">
   <div className="card"><div className="section-title"><h3>Today care flow</h3><span className="badge">{today}</span></div><div className="timeline">
    {data.appointments.map(a=><div className="timeline-item" key={a.id}><b>{a.time} — {nameById(data.patients,a.patientId,'patient')}</b><br/><span>{nameById(data.doctors,a.doctorId)} · {a.reason} · {a.status}</span></div>)}
   </div></div>
   <div className="card"><div className="section-title"><h3>Role access summary</h3></div><p><b>{user.role}</b> cannot see everything unless the role requires it. Admin manages users/configuration. Doctor manages clinical care. Nurse manages vitals and nursing tasks. Patient sees only personal data.</p><div className="notice">Forms use patient/doctor names. Internal IDs are hidden and handled automatically.</div></div>
  </div>
 </div>
}
function Stat({label,value}){return <div className="card stat"><div><small>{label}</small><b>{value}</b></div><span className="badge">Live</span></div>}

function Crud({title,rows,columns,onAdd,renderForm,searchFields=[]}){
 const [q,setQ]=useState(''),[modal,setModal]=useState(null);
 const list=rows.filter(r=>!q||searchFields.some(f=>String(r[f]??'').toLowerCase().includes(q.toLowerCase())));
 return <div className="card">
  <div className="section-title"><h3>{title}</h3><button className="btn btn-primary" onClick={()=>setModal({})}>+ Add</button></div>
  <div className="toolbar"><input className="input" placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)}/></div>
  <div className="table-wrap"><table><thead><tr>{columns.map(c=><th key={c.key}>{c.label}</th>)}<th>Actions</th></tr></thead><tbody>
   {list.map(r=><tr key={r.id}>{columns.map(c=><td key={c.key}>{c.render?c.render(r):String(r[c.key]??'')}</td>)}<td><button className="btn btn-soft" onClick={()=>setModal(r)}>Edit</button></td></tr>)}
  </tbody></table></div>
  {modal&&<Modal title={modal.id?`Edit ${title}`:`Add ${title}`} onClose={()=>setModal(null)}>{renderForm(modal,()=>setModal(null))}</Modal>}
 </div>
}
function Modal({title,children,onClose}){return <div className="modal-back"><div className="modal"><div className="section-title"><div><h2>{title}</h2><p>Complete the form and save.</p></div><button className="btn btn-soft" onClick={onClose}>Close</button></div>{children}</div></div>}
function Field({label,children,full}){return <div className={'field '+(full?'full':'')}><label>{label}</label>{children}</div>}

function Patients({data,persist}){
 const save=(form, close)=>{let d={...data,patients:[...data.patients]}; if(form.id){d.patients=d.patients.map(x=>x.id===form.id?form:x)}else{form.id=nextId(d.patients);form.fileNo=`SC-2026-${String(form.id).padStart(4,'0')}`;form.status='Active';d.patients.push(form)} persist(d); close();}
 const remove=(id,close)=>{if(!confirm('Archive this patient?'))return; let d={...data,patients:data.patients.map(p=>p.id===id?{...p,status:'Archived'}:p)};persist(d);close();}
 return <Crud title="Patients" rows={data.patients} searchFields={['firstName','lastName','fileNo','phone']} columns={[
  {key:'fileNo',label:'File no'}, {key:'firstName',label:'Patient',render:p=><b>{p.firstName} {p.lastName}</b>}, {key:'phone',label:'Phone'}, {key:'blood',label:'Blood'}, {key:'status',label:'Status',render:p=><span className="badge">{p.status}</span>}
 ]} renderForm={(item,close)=><PatientForm item={item} onSave={f=>save(f,close)} onDelete={item.id?()=>remove(item.id,close):null}/>}/>;
}
function PatientForm({item,onSave,onDelete}){const [f,setF]=useState({firstName:'',lastName:'',gender:'Female',birthDate:'',phone:'',email:'',blood:'O+',address:'',allergies:'None',...item});const set=(k,v)=>setF({...f,[k]:v});return <><div className="form-grid"><Field label="First name"><input className="input" value={f.firstName} onChange={e=>set('firstName',e.target.value)}/></Field><Field label="Last name"><input className="input" value={f.lastName} onChange={e=>set('lastName',e.target.value)}/></Field><Field label="Gender"><select value={f.gender} onChange={e=>set('gender',e.target.value)}><option>Female</option><option>Male</option></select></Field><Field label="Birth date"><input className="input" type="date" value={f.birthDate} onChange={e=>set('birthDate',e.target.value)}/></Field><Field label="Phone"><input className="input" value={f.phone} onChange={e=>set('phone',e.target.value)}/></Field><Field label="Email"><input className="input" value={f.email} onChange={e=>set('email',e.target.value)}/></Field><Field label="Blood group"><select value={f.blood} onChange={e=>set('blood',e.target.value)}>{['O+','O-','A+','A-','B+','B-','AB+','AB-'].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Allergies"><input className="input" value={f.allergies} onChange={e=>set('allergies',e.target.value)}/></Field><Field label="Address" full><textarea value={f.address} onChange={e=>set('address',e.target.value)}/></Field></div><div className="actions">{onDelete&&<button className="btn btn-danger" onClick={onDelete}>Archive</button>}<button className="btn btn-primary" onClick={()=>onSave(f)}>Save patient</button></div></>}

function Doctors({data,persist}){ const save=(f,c)=>{let d={...data,doctors:[...data.doctors]}; if(f.id)d.doctors=d.doctors.map(x=>x.id===f.id?f:x); else{f.id=nextId(d.doctors);d.doctors.push(f)} persist(d);c()}; return <Crud title="Doctors" rows={data.doctors} searchFields={['name','specialty']} columns={[{key:'name',label:'Doctor',render:x=><b>{x.name}</b>},{key:'specialty',label:'Specialty'},{key:'room',label:'Room'},{key:'status',label:'Status',render:x=><span className="badge">{x.status}</span>}]} renderForm={(i,c)=><StaffForm type="doctor" item={i} onSave={f=>save(f,c)}/>}/> }
function Nurses({data,persist}){ const save=(f,c)=>{let d={...data,nurses:[...data.nurses]}; if(f.id)d.nurses=d.nurses.map(x=>x.id===f.id?f:x); else{f.id=nextId(d.nurses);d.nurses.push(f)} persist(d);c()}; return <Crud title="Nurses" rows={data.nurses} searchFields={['name','department']} columns={[{key:'name',label:'Nurse',render:x=><b>{x.name}</b>},{key:'department',label:'Department'},{key:'shift',label:'Shift'},{key:'status',label:'Status',render:x=><span className="badge">{x.status}</span>}]} renderForm={(i,c)=><StaffForm type="nurse" item={i} onSave={f=>save(f,c)}/>}/> }
function StaffForm({item,onSave,type}){const [f,setF]=useState({name:'',specialty:'General Medicine',department:'General Care',phone:'',email:'',room:'',shift:'Morning',status:'Available',...item});const set=(k,v)=>setF({...f,[k]:v});return <><div className="form-grid"><Field label="Full name"><input className="input" value={f.name} onChange={e=>set('name',e.target.value)}/></Field>{type==='doctor'?<><Field label="Specialty"><input className="input" value={f.specialty} onChange={e=>set('specialty',e.target.value)}/></Field><Field label="Room"><input className="input" value={f.room} onChange={e=>set('room',e.target.value)}/></Field></>:<><Field label="Department"><input className="input" value={f.department} onChange={e=>set('department',e.target.value)}/></Field><Field label="Shift"><select value={f.shift} onChange={e=>set('shift',e.target.value)}><option>Morning</option><option>Evening</option><option>Night</option></select></Field></>}<Field label="Phone"><input className="input" value={f.phone} onChange={e=>set('phone',e.target.value)}/></Field><Field label="Email"><input className="input" value={f.email||''} onChange={e=>set('email',e.target.value)}/></Field><Field label="Status"><select value={f.status} onChange={e=>set('status',e.target.value)}><option>Available</option><option>Busy</option><option>On duty</option><option>Off duty</option></select></Field></div><div className="actions"><button className="btn btn-primary" onClick={()=>onSave(f)}>Save</button></div></>}

function Appointments({data,persist,user,page}){
 const rows=user.role==='patient'?data.appointments.filter(a=>a.patientId===1):data.appointments;
 const save=(f,c)=>{ if(data.appointments.some(a=>a.id!==f.id&&String(a.doctorId)===String(f.doctorId)&&a.date===f.date&&a.time===f.time)){alert('This doctor already has an appointment at this time.');return;} let d={...data,appointments:[...data.appointments]}; if(f.id)d.appointments=d.appointments.map(x=>x.id===f.id?f:x); else{f.id=nextId(d.appointments);d.appointments.push(f)} persist(d);c();}
 return <Crud title="Appointments" rows={rows} searchFields={['reason','status','type']} columns={[
  {key:'patientId',label:'Patient',render:a=>nameById(data.patients,a.patientId,'patient')},{key:'doctorId',label:'Doctor',render:a=>nameById(data.doctors,a.doctorId)},{key:'date',label:'Date'},{key:'time',label:'Time'},{key:'status',label:'Status',render:a=><span className="badge">{a.status}</span>}
 ]} renderForm={(i,c)=><AppointmentForm data={data} item={i} onSave={f=>save(f,c)}/>}/>
}
function AppointmentForm({data,item,onSave}){const [f,setF]=useState({patientId:data.patients[0]?.id,doctorId:data.doctors[0]?.id,date:today,time:'10:00',type:'Consultation',reason:'',status:'Scheduled',...item});const set=(k,v)=>setF({...f,[k]:v});return <><div className="form-grid"><Field label="Patient"><select value={f.patientId} onChange={e=>set('patientId',Number(e.target.value))}>{data.patients.filter(p=>p.status!=='Archived').map(p=><option key={p.id} value={p.id}>{p.fileNo} — {p.firstName} {p.lastName}</option>)}</select></Field><Field label="Doctor"><select value={f.doctorId} onChange={e=>set('doctorId',Number(e.target.value))}>{data.doctors.map(d=><option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}</select></Field><Field label="Date"><input className="input" type="date" value={f.date} onChange={e=>set('date',e.target.value)}/></Field><Field label="Time"><input className="input" type="time" value={f.time} onChange={e=>set('time',e.target.value)}/></Field><Field label="Type"><select value={f.type} onChange={e=>set('type',e.target.value)}><option>Consultation</option><option>Follow-up</option><option>Lab visit</option><option>Nursing care</option></select></Field><Field label="Status"><select value={f.status} onChange={e=>set('status',e.target.value)}><option>Scheduled</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option><option>Missed</option></select></Field><Field label="Reason" full><textarea value={f.reason} onChange={e=>set('reason',e.target.value)}/></Field></div><div className="actions"><button className="btn btn-primary" onClick={()=>onSave(f)}>Save appointment</button></div></>}

function Consultations({data,persist}){const save=(f,c)=>{let d={...data,consultations:[...data.consultations]};if(f.id)d.consultations=d.consultations.map(x=>x.id===f.id?f:x);else{f.id=nextId(d.consultations);d.consultations.push(f)}persist(d);c()};return <Crud title="Consultations" rows={data.consultations} searchFields={['symptoms','diagnosis','notes']} columns={[{key:'patientId',label:'Patient',render:x=>nameById(data.patients,x.patientId,'patient')},{key:'doctorId',label:'Doctor',render:x=>nameById(data.doctors,x.doctorId)},{key:'date',label:'Date'},{key:'diagnosis',label:'Diagnosis'}]} renderForm={(i,c)=><ConsultForm data={data} item={i} onSave={f=>save(f,c)}/>}/> }
function ConsultForm({data,item,onSave}){const [f,setF]=useState({patientId:data.patients[0]?.id,doctorId:data.doctors[0]?.id,date:today,symptoms:'',diagnosis:'',notes:'',treatment:'',followUp:'',...item});const set=(k,v)=>setF({...f,[k]:v});return <><div className="form-grid"><Field label="Patient"><select value={f.patientId} onChange={e=>set('patientId',Number(e.target.value))}>{data.patients.map(p=><option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}</select></Field><Field label="Doctor"><select value={f.doctorId} onChange={e=>set('doctorId',Number(e.target.value))}>{data.doctors.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></Field><Field label="Date"><input className="input" type="date" value={f.date} onChange={e=>set('date',e.target.value)}/></Field><Field label="Symptoms" full><textarea value={f.symptoms} onChange={e=>set('symptoms',e.target.value)}/></Field><Field label="Diagnosis" full><textarea value={f.diagnosis} onChange={e=>set('diagnosis',e.target.value)}/></Field><Field label="Treatment" full><textarea value={f.treatment} onChange={e=>set('treatment',e.target.value)}/></Field><Field label="Clinical notes" full><textarea value={f.notes} onChange={e=>set('notes',e.target.value)}/></Field><Field label="Follow-up"><input className="input" value={f.followUp} onChange={e=>set('followUp',e.target.value)}/></Field></div><div className="actions"><button className="btn btn-primary" onClick={()=>onSave(f)}>Save consultation</button></div></>}

function Prescriptions({data,persist,user}){const rows=user.role==='patient'?data.prescriptions.filter(p=>p.patientId===1):data.prescriptions;const save=(f,c)=>{let d={...data,prescriptions:[...data.prescriptions]};if(f.id)d.prescriptions=d.prescriptions.map(x=>x.id===f.id?f:x);else{f.id=nextId(d.prescriptions);d.prescriptions.push(f)}persist(d);c()};return <Crud title="Prescriptions" rows={rows} searchFields={['status','instructions']} columns={[{key:'patientId',label:'Patient',render:x=>nameById(data.patients,x.patientId,'patient')},{key:'doctorId',label:'Doctor',render:x=>nameById(data.doctors,x.doctorId)},{key:'date',label:'Date'},{key:'medicines',label:'Medicines',render:x=>x.medicines.map(m=>m.name).join(', ')},{key:'status',label:'Status',render:x=><span className="badge">{x.status}</span>}]} renderForm={(i,c)=><PrescriptionForm data={data} item={i} onSave={f=>save(f,c)}/>}/> }
function PrescriptionForm({data,item,onSave}){const [f,setF]=useState({patientId:data.patients[0]?.id,doctorId:data.doctors[0]?.id,date:today,medicines:[{name:'',dosage:'',frequency:'',duration:''}],instructions:'',status:'Ready',...item});const set=(k,v)=>setF({...f,[k]:v});const med=(i,k,v)=>{let a=[...f.medicines];a[i]={...a[i],[k]:v};set('medicines',a)};return <><div className="form-grid"><Field label="Patient"><select value={f.patientId} onChange={e=>set('patientId',Number(e.target.value))}>{data.patients.map(p=><option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}</select></Field><Field label="Doctor"><select value={f.doctorId} onChange={e=>set('doctorId',Number(e.target.value))}>{data.doctors.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></Field><Field label="Date"><input className="input" type="date" value={f.date} onChange={e=>set('date',e.target.value)}/></Field><Field label="Status"><select value={f.status} onChange={e=>set('status',e.target.value)}><option>Ready</option><option>Dispensed</option><option>Cancelled</option></select></Field></div><h3>Medicines</h3>{f.medicines.map((m,i)=><div className="form-grid" key={i}><Field label="Medicine"><input className="input" value={m.name} onChange={e=>med(i,'name',e.target.value)}/></Field><Field label="Dosage"><input className="input" value={m.dosage} onChange={e=>med(i,'dosage',e.target.value)}/></Field><Field label="Frequency"><input className="input" value={m.frequency} onChange={e=>med(i,'frequency',e.target.value)}/></Field><Field label="Duration"><input className="input" value={m.duration} onChange={e=>med(i,'duration',e.target.value)}/></Field></div>)}<button className="btn btn-soft" onClick={()=>set('medicines',[...f.medicines,{name:'',dosage:'',frequency:'',duration:''}])}>+ Add medicine</button><Field label="Instructions" full><textarea value={f.instructions} onChange={e=>set('instructions',e.target.value)}/></Field><div className="actions"><button className="btn btn-soft" onClick={()=>window.print()}>Print</button><button className="btn btn-primary" onClick={()=>onSave(f)}>Save prescription</button></div></>}

function Laboratory({data,persist}){const save=(f,c)=>{let d={...data,labRequests:[...data.labRequests]};if(f.id)d.labRequests=d.labRequests.map(x=>x.id===f.id?f:x);else{f.id=nextId(d.labRequests);d.labRequests.push(f)}persist(d);c()};return <Crud title="Laboratory" rows={data.labRequests} searchFields={['test','status','priority']} columns={[{key:'patientId',label:'Patient',render:x=>nameById(data.patients,x.patientId,'patient')},{key:'test',label:'Test'},{key:'priority',label:'Priority'},{key:'status',label:'Status',render:x=><span className="badge">{x.status}</span>},{key:'result',label:'Result'}]} renderForm={(i,c)=><LabForm data={data} item={i} onSave={f=>save(f,c)}/>}/> }
function LabForm({data,item,onSave}){const [f,setF]=useState({patientId:data.patients[0]?.id,doctorId:data.doctors[0]?.id,test:'',priority:'Normal',status:'Requested',date:today,result:'',...item});const set=(k,v)=>setF({...f,[k]:v});return <><div className="form-grid"><Field label="Patient"><select value={f.patientId} onChange={e=>set('patientId',Number(e.target.value))}>{data.patients.map(p=><option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}</select></Field><Field label="Doctor"><select value={f.doctorId} onChange={e=>set('doctorId',Number(e.target.value))}>{data.doctors.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></Field><Field label="Test"><input className="input" value={f.test} onChange={e=>set('test',e.target.value)}/></Field><Field label="Priority"><select value={f.priority} onChange={e=>set('priority',e.target.value)}><option>Low</option><option>Normal</option><option>Urgent</option></select></Field><Field label="Status"><select value={f.status} onChange={e=>set('status',e.target.value)}><option>Requested</option><option>Sample collected</option><option>In progress</option><option>Completed</option></select></Field><Field label="Result" full><textarea value={f.result} onChange={e=>set('result',e.target.value)}/></Field></div><div className="actions"><button className="btn btn-primary" onClick={()=>onSave(f)}>Save lab request</button></div></>}

function Pharmacy({data,persist}){const save=(f,c)=>{let d={...data,pharmacy:[...data.pharmacy]};if(f.id)d.pharmacy=d.pharmacy.map(x=>x.id===f.id?f:x);else{f.id=nextId(d.pharmacy);d.pharmacy.push(f)}persist(d);c()};return <Crud title="Pharmacy & Inventory" rows={data.pharmacy} searchFields={['medicine','category']} columns={[{key:'medicine',label:'Medicine',render:x=><b>{x.medicine}</b>},{key:'category',label:'Category'},{key:'stock',label:'Stock',render:x=><span className={x.stock<=x.alert?'badge btn-danger':'badge'}>{x.stock} {x.unit}</span>},{key:'price',label:'Price',render:x=>`${x.price} MAD`}]} renderForm={(i,c)=><DrugForm item={i} onSave={f=>save(f,c)}/>}/> }
function DrugForm({item,onSave}){const [f,setF]=useState({medicine:'',category:'',stock:0,unit:'box',alert:10,price:0,...item});const set=(k,v)=>setF({...f,[k]:v});return <><div className="form-grid"><Field label="Medicine"><input className="input" value={f.medicine} onChange={e=>set('medicine',e.target.value)}/></Field><Field label="Category"><input className="input" value={f.category} onChange={e=>set('category',e.target.value)}/></Field><Field label="Stock"><input className="input" type="number" value={f.stock} onChange={e=>set('stock',Number(e.target.value))}/></Field><Field label="Unit"><input className="input" value={f.unit} onChange={e=>set('unit',e.target.value)}/></Field><Field label="Alert threshold"><input className="input" type="number" value={f.alert} onChange={e=>set('alert',Number(e.target.value))}/></Field><Field label="Price"><input className="input" type="number" value={f.price} onChange={e=>set('price',Number(e.target.value))}/></Field></div><div className="actions"><button className="btn btn-primary" onClick={()=>onSave(f)}>Save item</button></div></>}

function Billing({data,persist}){const save=(f,c)=>{let d={...data,payments:[...data.payments]}; if(f.id)d.payments=d.payments.map(x=>x.id===f.id?f:x); else{f.id=nextId(d.payments);f.invoice=`INV-2026-${String(f.id).padStart(4,'0')}`;d.payments.push(f)} persist(d);c()};return <Crud title="Billing & Invoices" rows={data.payments} searchFields={['invoice','method','status']} columns={[{key:'invoice',label:'Invoice',render:x=><b>{x.invoice}</b>},{key:'patientId',label:'Patient',render:x=>nameById(data.patients,x.patientId,'patient')},{key:'amount',label:'Amount',render:x=>`${x.amount} MAD`},{key:'method',label:'Method'},{key:'status',label:'Status',render:x=><span className="badge">{x.status}</span>}]} renderForm={(i,c)=><PaymentForm data={data} item={i} onSave={f=>save(f,c)}/>}/> }
function PaymentForm({data,item,onSave}){const [f,setF]=useState({patientId:data.patients[0]?.id,appointmentId:data.appointments[0]?.id,amount:0,method:'Cash',status:'Paid',date:today,...item});const set=(k,v)=>setF({...f,[k]:v});return <><div className="form-grid"><Field label="Patient"><select value={f.patientId} onChange={e=>set('patientId',Number(e.target.value))}>{data.patients.map(p=><option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}</select></Field><Field label="Appointment"><select value={f.appointmentId} onChange={e=>set('appointmentId',Number(e.target.value))}>{data.appointments.map(a=><option key={a.id} value={a.id}>{a.date} {a.time} — {nameById(data.patients,a.patientId,'patient')}</option>)}</select></Field><Field label="Amount"><input className="input" type="number" value={f.amount} onChange={e=>set('amount',Number(e.target.value))}/></Field><Field label="Method"><select value={f.method} onChange={e=>set('method',e.target.value)}><option>Cash</option><option>Card</option><option>Insurance</option><option>Bank transfer</option></select></Field><Field label="Status"><select value={f.status} onChange={e=>set('status',e.target.value)}><option>Paid</option><option>Pending</option><option>Cancelled</option></select></Field></div><div className="actions"><button className="btn btn-soft" onClick={()=>window.print()}>Print invoice</button><button className="btn btn-primary" onClick={()=>onSave(f)}>Save payment</button></div></>}

function Vitals({data,persist}){const save=(f,c)=>{let d={...data,vitals:[...data.vitals]};if(f.id)d.vitals=d.vitals.map(x=>x.id===f.id?f:x);else{f.id=nextId(d.vitals);d.vitals.push(f)}persist(d);c()};return <Crud title="Nursing care & vitals" rows={data.vitals} searchFields={['bp','notes']} columns={[{key:'patientId',label:'Patient',render:x=>nameById(data.patients,x.patientId,'patient')},{key:'date',label:'Date'},{key:'bp',label:'BP'},{key:'heartRate',label:'HR'},{key:'temp',label:'Temp'},{key:'spo2',label:'SpO2'}]} renderForm={(i,c)=><VitalsForm data={data} item={i} onSave={f=>save(f,c)}/>}/> }
function VitalsForm({data,item,onSave}){const [f,setF]=useState({patientId:data.patients[0]?.id,nurseId:data.nurses[0]?.id,date:today,bp:'',heartRate:70,temp:37,spo2:98,notes:'',...item});const set=(k,v)=>setF({...f,[k]:v});return <><div className="form-grid"><Field label="Patient"><select value={f.patientId} onChange={e=>set('patientId',Number(e.target.value))}>{data.patients.map(p=><option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}</select></Field><Field label="Nurse"><select value={f.nurseId} onChange={e=>set('nurseId',Number(e.target.value))}>{data.nurses.map(n=><option key={n.id} value={n.id}>{n.name}</option>)}</select></Field><Field label="Blood pressure"><input className="input" value={f.bp} onChange={e=>set('bp',e.target.value)}/></Field><Field label="Heart rate"><input className="input" type="number" value={f.heartRate} onChange={e=>set('heartRate',Number(e.target.value))}/></Field><Field label="Temperature"><input className="input" type="number" step="0.1" value={f.temp} onChange={e=>set('temp',Number(e.target.value))}/></Field><Field label="SpO2"><input className="input" type="number" value={f.spo2} onChange={e=>set('spo2',Number(e.target.value))}/></Field><Field label="Notes" full><textarea value={f.notes} onChange={e=>set('notes',e.target.value)}/></Field></div><div className="actions"><button className="btn btn-primary" onClick={()=>onSave(f)}>Save vitals</button></div></>}

function AI({data}){const [messages,setMessages]=useState([{role:'ai',text:'Hello. I can help with clinic workflows, symptom orientation, appointments, medication safety reminders and administrative questions. I do not replace a doctor.'}]);const [text,setText]=useState('');const send=()=>{if(!text.trim())return;const answer=aiAnswer(text,data);setMessages([...messages,{role:'user',text},{role:'ai',text:answer}]);setText('')};return <div className="grid-2"><div className="card"><div className="section-title"><h3>Clinical AI Assistant</h3><span className="badge">Safe mode</span></div><div className="chat"><div className="messages">{messages.map((m,i)=><div key={i} className={'msg '+(m.role==='user'?'user':'ai')}>{m.text}</div>)}</div><div className="chat-input"><input className="input" value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask about symptoms, workflow, appointments, prescriptions..."/><button className="btn btn-primary" onClick={send}>Send</button></div></div></div><div className="card"><h3>Symptom orientation</h3><p>Examples: fever and cough, chest pain, headache, abdominal pain, diabetes follow-up.</p><div className="notice">AI gives orientation only. It must never be used as a final diagnosis.</div><h3>Quick insights</h3><p>Today appointments: <b>{data.appointments.filter(a=>a.date===today).length}</b></p><p>Low stock alerts: <b>{data.pharmacy.filter(x=>x.stock<=x.alert).length}</b></p></div></div>}
function aiAnswer(q,data){const s=q.toLowerCase(); if(/fever|cough|cold|flu|temp/.test(s))return 'Fever/cough may suggest respiratory infection, flu, COVID-like illness or allergy depending on duration and severity. Check temperature, SpO2, breathing difficulty and risk factors. Book doctor review if symptoms persist, worsen, or breathing is difficult.'; if(/chest|heart|cardio|pain/.test(s))return 'Chest pain must be handled carefully. Red flags: pressure-like pain, shortness of breath, sweating, pain radiating to arm/jaw, fainting. In these cases, urgent medical evaluation is required.'; if(/appointment|schedule|rdv/.test(s))return `Use Appointments → Add, then select patient and doctor by name. The system prevents double booking. Today there are ${data.appointments.filter(a=>a.date===today).length} appointments.`; if(/prescription|medicine|drug|dose/.test(s))return 'Doctors create prescriptions after consultation. Pharmacists can view/dispense prescriptions. Always verify allergies, dosage, duration and interactions before dispensing.'; if(/nurse|vital|bp|spo2/.test(s))return 'Nurses record vitals, nursing notes, blood pressure, temperature, SpO2 and care tasks. They should not create final diagnosis or prescribe medication.'; if(/billing|invoice|payment|cash/.test(s))return 'Billing records payments, method, invoice reference and status. Secretary/billing role can create invoices; admin can review financial reports.'; if(/lab|test|analysis/.test(s))return 'Lab workflow: doctor requests test, lab collects sample, result is entered, doctor validates clinical interpretation.'; if(/admin|role|access|permission/.test(s))return 'Access is role-based: admin manages system, doctor handles clinical care, nurse manages vitals/care, secretary schedules and bills, patient sees only own data.'; return 'I can help with clinic operations, patient flow, medical record organization, appointments, nursing care, prescriptions, lab, pharmacy and billing. For medical decisions, the doctor must validate the final action.'}

function Users(){return <div className="card"><h3>Role-based users</h3><div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Access</th></tr></thead><tbody>{demoUsers.map(u=><tr key={u.email}><td><b>{u.name}</b></td><td>{u.email}</td><td><span className="badge">{u.role}</span></td><td>{roles[u.role].join(', ')}</td></tr>)}</tbody></table></div></div>}
function Reports({data}){const rev=data.payments.reduce((a,b)=>a+Number(b.amount),0);return <div className="grid-3"><Stat label="Monthly revenue" value={`${rev} MAD`}/><Stat label="Completed appointments" value={data.appointments.filter(a=>a.status==='Completed').length}/><Stat label="Low stock items" value={data.pharmacy.filter(x=>x.stock<=x.alert).length}/><div className="card full"><h3>Management recommendations</h3><ul><li>Separate administrative and clinical permissions.</li><li>Use appointment confirmation to reduce no-shows.</li><li>Review low stock medicines every morning.</li><li>Validate AI outputs only through doctors.</li></ul></div></div>}
function Audit({data}){return <div className="card"><h3>Audit log</h3><div className="table-wrap"><table><thead><tr><th>Date</th><th>User</th><th>Action</th></tr></thead><tbody>{data.audit.map(a=><tr key={a.id}><td>{a.date}</td><td>{a.user}</td><td>{a.action}</td></tr>)}</tbody></table></div></div>}

createRoot(document.getElementById('root')).render(<App/>);
