import { useState, useEffect } from "react";

// ══════════════════════════════════════════════════════════════════
// THEME — BlueGuard Solutions design system (dark + light modes)
// ══════════════════════════════════════════════════════════════════
const DARK_THEME = {
  mode:        "dark",
  bg:          "#08111F",
  bgSoft:      "#0D1E35",
  bgCard:      "rgba(15,37,64,0.6)",
  bgCardSolid: "#0F2540",
  border:      "rgba(90,180,240,0.10)",
  borderMid:   "rgba(90,180,240,0.18)",
  text:        "#EEF4FB",
  textMid:     "rgba(238,244,251,0.82)",
  textSoft:    "#6D87A8",
  textXSoft:   "rgba(109,135,168,0.55)",
  accent:      "#5AB4F0",
  accentMid:   "#2169CC",
  accentDark:  "#1853A8",
  accentLight: "rgba(90,180,240,0.10)",
  gold:        "#C9A84C",
  sidebar:     "rgba(8,17,31,0.98)",
  sidebarBorder:"rgba(90,180,240,0.10)",
  mainBg:      "linear-gradient(160deg,#08111F 0%,#0D1E35 100%)",
  mainRadial:  "radial-gradient(ellipse 80% 50% at 70% 30%, rgba(21,83,168,0.06), transparent)",
  inputBg:     "rgba(8,17,31,0.5)",
  inputBorder: "rgba(90,180,240,0.15)",
  tableHead:   "rgba(8,17,31,0.6)",
  scrollTrack: "#08111F",
  scrollThumb: "rgba(90,180,240,0.22)",
  selectBg:    "#0F2540",
  selectColor: "#EEF4FB",
  noise:       true,
};

const LIGHT_THEME = {
  mode:        "light",
  bg:          "#F0F4FA",
  bgSoft:      "#E6EDF7",
  bgCard:      "rgba(255,255,255,0.92)",
  bgCardSolid: "#FFFFFF",
  border:      "rgba(24,83,168,0.12)",
  borderMid:   "rgba(24,83,168,0.22)",
  text:        "#0D1E35",
  textMid:     "rgba(13,30,53,0.80)",
  textSoft:    "#4A6480",
  textXSoft:   "rgba(74,100,128,0.55)",
  accent:      "#1853A8",
  accentMid:   "#2169CC",
  accentDark:  "#1853A8",
  accentLight: "rgba(24,83,168,0.08)",
  gold:        "#9A6F1A",
  sidebar:     "rgba(255,255,255,0.98)",
  sidebarBorder:"rgba(24,83,168,0.10)",
  mainBg:      "linear-gradient(160deg,#F0F4FA 0%,#E6EDF7 100%)",
  mainRadial:  "radial-gradient(ellipse 80% 50% at 70% 30%, rgba(24,83,168,0.04), transparent)",
  inputBg:     "rgba(255,255,255,0.8)",
  inputBorder: "rgba(24,83,168,0.18)",
  tableHead:   "rgba(240,244,250,0.9)",
  scrollTrack: "#E6EDF7",
  scrollThumb: "rgba(24,83,168,0.20)",
  selectBg:    "#FFFFFF",
  selectColor: "#0D1E35",
  noise:       false,
};

// Runtime theme variable — updated by App and read by all components
let T = DARK_THEME;

// ══════════════════════════════════════════════════════════════════
// CONFIGS
// Enviado removed — declarations go directly to manager/compliance
// ══════════════════════════════════════════════════════════════════
// Status and role configs — use functions so they can be theme-aware at render time
const STATUS_CFG = {
  "Draft":                  {darkColor:"#6D87A8", darkBg:"rgba(109,135,168,0.12)", darkBorder:"rgba(109,135,168,0.25)", lightColor:"#4A6480", lightBg:"rgba(74,100,128,0.08)", lightBorder:"rgba(74,100,128,0.22)", icon:"○"},
  "Info solicitada":        {darkColor:"#5AB4F0", darkBg:"rgba(90,180,240,0.10)", darkBorder:"rgba(90,180,240,0.25)", lightColor:"#1853A8", lightBg:"rgba(24,83,168,0.08)", lightBorder:"rgba(24,83,168,0.25)", icon:"↩"},
  "En revisión manager":    {darkColor:"#C9A84C", darkBg:"rgba(201,168,76,0.10)", darkBorder:"rgba(201,168,76,0.28)", lightColor:"#9A6F1A", lightBg:"rgba(154,111,26,0.08)", lightBorder:"rgba(154,111,26,0.25)", icon:"◐"},
  "En revisión compliance": {darkColor:"#A8D8F8", darkBg:"rgba(33,105,204,0.15)", darkBorder:"rgba(90,180,240,0.30)", lightColor:"#2169CC", lightBg:"rgba(33,105,204,0.08)", lightBorder:"rgba(33,105,204,0.25)", icon:"◑"},
  "Escalado":               {darkColor:"#F87171", darkBg:"rgba(220,38,38,0.12)", darkBorder:"rgba(248,113,113,0.28)", lightColor:"#DC2626", lightBg:"rgba(220,38,38,0.06)", lightBorder:"rgba(220,38,38,0.22)", icon:"⚠"},
  "Completado":             {darkColor:"#4ADE80", darkBg:"rgba(74,222,128,0.10)", darkBorder:"rgba(74,222,128,0.28)", lightColor:"#16A34A", lightBg:"rgba(22,163,74,0.07)", lightBorder:"rgba(22,163,74,0.22)", icon:"✓"},
};
const getStatusCfg = (status) => {
  const c = STATUS_CFG[status] || STATUS_CFG["Draft"];
  const dark = T.mode === "dark";
  return { color: dark ? c.darkColor : c.lightColor, bg: dark ? c.darkBg : c.lightBg, border: dark ? c.darkBorder : c.lightBorder, icon: c.icon };
};

const ROLE_CFG = {
  "Empleado":              {darkColor:"#5AB4F0", darkBg:"rgba(90,180,240,0.10)", darkBorder:"rgba(90,180,240,0.22)", lightColor:"#1853A8", lightBg:"rgba(24,83,168,0.08)", lightBorder:"rgba(24,83,168,0.20)"},
  "Manager":               {darkColor:"#A8D8F8", darkBg:"rgba(33,105,204,0.15)", darkBorder:"rgba(90,180,240,0.28)", lightColor:"#2169CC", lightBg:"rgba(33,105,204,0.08)", lightBorder:"rgba(33,105,204,0.20)"},
  "Compliance Manager":    {darkColor:"#4ADE80", darkBg:"rgba(74,222,128,0.08)", darkBorder:"rgba(74,222,128,0.22)", lightColor:"#16A34A", lightBg:"rgba(22,163,74,0.07)", lightBorder:"rgba(22,163,74,0.20)"},
  "Head de Legal":         {darkColor:"#C9A84C", darkBg:"rgba(201,168,76,0.10)", darkBorder:"rgba(201,168,76,0.28)", lightColor:"#9A6F1A", lightBg:"rgba(154,111,26,0.07)", lightBorder:"rgba(154,111,26,0.22)"},
  "Administrador Empresa": {darkColor:"#F87171", darkBg:"rgba(220,38,38,0.10)", darkBorder:"rgba(248,113,113,0.22)", lightColor:"#DC2626", lightBg:"rgba(220,38,38,0.07)", lightBorder:"rgba(220,38,38,0.20)"},
};
const getRoleCfg = (role) => {
  const c = ROLE_CFG[role] || ROLE_CFG["Empleado"];
  const dark = T.mode === "dark";
  return { color: dark ? c.darkColor : c.lightColor, bg: dark ? c.darkBg : c.lightBg, border: dark ? c.darkBorder : c.lightBorder };
};

// Nav: Empleados NO ven dashboard
// Roles: 1=Dashboard 2=Nueva 3=Declaraciones 4=Auditoría 5=Admin
const ROLE_NAV = {
  "Empleado":              ["new","declarations"],
  "Manager":               ["dashboard","new","declarations"],
  "Compliance Manager":    ["dashboard","new","declarations","audit"],
  "Head de Legal":         ["dashboard","declarations"],
  "Administrador Empresa": ["declarations","audit","admin"],
};

const NAV_ITEMS = [
  {id:"dashboard",    icon:"⬡", label:"Dashboard",         roles:["Manager","Compliance Manager","Head de Legal"]},
  {id:"new",          icon:"+", label:"Nueva Declaración", roles:["Empleado","Manager","Compliance Manager"]},
  {id:"declarations", icon:"◈", label:"Declaraciones",     roles:["Empleado","Manager","Compliance Manager","Head de Legal","Administrador Empresa"]},
  {id:"audit",        icon:"⊞", label:"Auditoría",         roles:["Compliance Manager","Administrador Empresa"]},
  {id:"admin",        icon:"⚙", label:"Administración",    roles:["Administrador Empresa"]},
];

const FIELD_TYPES = [
  {value:"short_text",  label:"Texto corto",       icon:"Aa"},
  {value:"textarea",    label:"Texto largo",        icon:"¶"},
  {value:"number",      label:"Numérico",           icon:"#"},
  {value:"date",        label:"Fecha",              icon:"📅"},
  {value:"select",      label:"Dropdown",           icon:"▾"},
  {value:"multiselect", label:"Selección múltiple", icon:"☰"},
  {value:"file",        label:"Adjunto",            icon:"📎"},
];

// ══════════════════════════════════════════════════════════════════
// MOCK DATA — Iberia only, no Admin user
// ══════════════════════════════════════════════════════════════════
const ALL_USERS_INIT = [
  {id:1,  name:"Carlota",       lastName:"", email:"carlota@conflictguard.com",       role:"Empleado",              manager:"Jose",  dept:"Ventas",       market:"Iberia", active:true},
  {id:2,  name:"Denys",         lastName:"", email:"denys@conflictguard.com",         role:"Empleado",              manager:"Jose",  dept:"TI",           market:"Iberia", active:true},
  {id:3,  name:"Gabriela",      lastName:"", email:"gabriela@conflictguard.com",      role:"Empleado",              manager:"Sunil", dept:"Marketing",    market:"Iberia", active:true},
  {id:4,  name:"Irene",         lastName:"", email:"irene@conflictguard.com",         role:"Empleado",              manager:"Sunil", dept:"Marketing",    market:"Iberia", active:true},
  {id:5,  name:"Jose",          lastName:"", email:"jose@conflictguard.com",          role:"Manager",               manager:"Vinoth",dept:"Ventas",       market:"Iberia", active:true},
  {id:6,  name:"Sunil",         lastName:"", email:"sunil@conflictguard.com",         role:"Manager",               manager:"Vinoth",dept:"Marketing",    market:"Iberia", active:true},
  {id:7,  name:"Vinoth",        lastName:"", email:"vinoth@conflictguard.com",        role:"Manager",               manager:null,    dept:"Operaciones",  market:"Iberia", active:true},
  {id:8,  name:"James",         lastName:"", email:"james@conflictguard.com",         role:"Compliance Manager",    manager:null,    dept:"Cumplimiento", market:"Iberia", active:true},
  {id:9,  name:"Jackie",        lastName:"", email:"jackie@conflictguard.com",        role:"Head de Legal",         manager:null,    dept:"Legal",        market:"Iberia", active:true},
  {id:10, name:"Administrador", lastName:"", email:"admin@conflictguard.com",         role:"Administrador Empresa", manager:null,    dept:"Admin",        market:"Iberia", active:true},
];

const fullName = u => u ? (u.lastName ? `${u.name} ${u.lastName}` : u.name) : "";

// When declaration is submitted, status goes directly to first review step
const getInitialReviewStatus = (wf) => {
  if (wf.requireManagerReview) return "En revisión manager";
  if (wf.requireComplianceReview) return "En revisión compliance";
  return "Completado";
};

const INIT_WORKFLOW = {
  requireManagerReview:           true,
  requireComplianceReview:        true,
  allowEscalation:                true,
  allowEscalationByComplianceOnly:false,
  escalationUserId:               9,
  autoClose:                      false,
};

const INIT_FIELDS = [
  {id:"f1",label:"Tipo de conflicto",    type:"select",    required:true,  active:true,  options:["Relación familiar con proveedor","Participación en empresa competidora","Inversión financiera en cliente","Segunda actividad laboral","Regalo o beneficio recibido","Otro"]},
  {id:"f2",label:"Descripción detallada",type:"textarea",  required:true,  active:true,  options:[]},
  {id:"f3",label:"Entidad involucrada",  type:"short_text",required:false, active:true,  options:[]},
  {id:"f4",label:"Valor económico (€)",  type:"number",    required:false, active:false, options:[]},
  {id:"f5",label:"Fecha del hecho",      type:"date",      required:false, active:true,  options:[]},
  {id:"f6",label:"Adjuntos",             type:"file",      required:false, active:true,  options:[]},
];

const INIT_FORM_META = {
  subtitle:"Declara cualquier situación que pueda constituir un conflicto de interés. Tu declaración es confidencial y es un acto de transparencia.",
};

const INIT_MARKETS = [
  {id:"iberia", name:"Iberia", countries:"España, Portugal", active:true,
   workflow:{...INIT_WORKFLOW},
   fields:[...INIT_FIELDS],
   formMeta:{...INIT_FORM_META}},
];

const INIT_DECLARATIONS = [
  {id:"DEC-001",userId:1,userName:"Carlota",  type:"Relación familiar con proveedor",     formValues:{f1:"Relación familiar con proveedor",f2:"Mi hermano trabaja como director en Proveedor ABC S.L., con quien tenemos contrato activo.",f3:"Proveedor ABC S.L."},status:"En revisión manager",   createdAt:"2026-02-10T09:30:00",updatedAt:"2026-02-11T14:00:00",market:"Iberia",attachments:["contrato_abc.pdf"],comments:[{author:"Jose",      text:"Revisando documentación adjunta.",                                        date:"2026-02-11T14:00:00",type:"review"}]},
  {id:"DEC-002",userId:2,userName:"Denys",    type:"Segunda actividad laboral",            formValues:{f1:"Segunda actividad laboral",  f2:"Realizo consultoría freelance de software los fines de semana para clientes ajenos al sector.",f3:"Clientes varios"},status:"Completado",            createdAt:"2026-01-20T10:00:00",updatedAt:"2026-01-25T16:30:00",market:"Iberia",attachments:[],                   comments:[{author:"Jose",      text:"Revisado. Sin conflicto aparente.",                                        date:"2026-01-22T11:00:00",type:"review"},{author:"James",text:"Completado. Actividad compatible con la política.",date:"2026-01-25T16:30:00",type:"completed"}]},
  {id:"DEC-003",userId:3,userName:"Gabriela", type:"Regalo o beneficio recibido",          formValues:{f1:"Regalo o beneficio recibido",f2:"Recibí entradas para un evento deportivo valoradas en 200€ de parte del proveedor XYZ.",f3:"Proveedor XYZ"},status:"Escalado",              createdAt:"2026-02-15T08:45:00",updatedAt:"2026-02-16T10:00:00",market:"Iberia",attachments:["foto_entradas.jpg"],comments:[{author:"Sunil",        text:"Escalo por valor superior al límite permitido.",                           date:"2026-02-16T10:00:00",type:"escalation"}]},
  {id:"DEC-004",userId:1,userName:"Carlota",  type:"Inversión financiera en cliente",      formValues:{f1:"Inversión financiera en cliente",f2:"Poseo acciones (3%) en Cliente Global S.A., empresa con la que mantenemos relación comercial.",f3:"Cliente Global S.A."},status:"Draft",               createdAt:"2026-02-27T08:00:00",updatedAt:"2026-02-27T08:00:00",market:"Iberia",attachments:[],                   comments:[]},
  {id:"DEC-005",userId:2,userName:"Denys",    type:"Participación en empresa competidora", formValues:{f1:"Participación en empresa competidora",f2:"Soy socio minoritario (8%) en StartupX S.L. que opera en el mismo sector.",f3:"StartupX S.L."},status:"En revisión manager",   createdAt:"2026-02-25T11:00:00",updatedAt:"2026-02-25T11:00:00",market:"Iberia",attachments:[],                   comments:[]},
  {id:"DEC-006",userId:4,userName:"Irene",    type:"Segunda actividad laboral",            formValues:{f1:"Segunda actividad laboral",  f2:"Imparto clases de yoga los sábados en un gimnasio local.",f3:"Gimnasio local"},status:"En revisión compliance",createdAt:"2026-02-01T09:00:00",updatedAt:"2026-02-18T10:00:00",market:"Iberia",attachments:[],                   comments:[{author:"Sunil",        text:"Sin conflicto desde mi perspectiva. Paso a Compliance.",                   date:"2026-02-05T10:00:00",type:"review"}]},
  {id:"DEC-007",userId:3,userName:"Gabriela", type:"Inversión financiera en cliente",      formValues:{f1:"Inversión financiera en cliente",f2:"Tengo un 2% de participación en una empresa que es cliente habitual.",f3:"Cliente habitual"},status:"Info solicitada",       createdAt:"2026-02-20T08:00:00",updatedAt:"2026-02-22T11:00:00",market:"Iberia",attachments:[],                   comments:[{author:"Sunil",        text:"Necesito que adjuntes el contrato de participación y datos identificativos del cliente.",date:"2026-02-22T11:00:00",type:"info_request"}]},
];

const INIT_AUDIT = [
  {id:1,action:"Declaración enviada",  user:"Carlota", target:"DEC-001",date:"2026-02-10T09:30:00",detail:"Draft → En revisión manager → Jose",   market:"Iberia"},
  {id:2,action:"Revisión iniciada",    user:"Jose",    target:"DEC-001",date:"2026-02-11T14:00:00",detail:"En revisión manager (comentario)",market:"Iberia"},
  {id:3,action:"Completado",           user:"James",   target:"DEC-002",date:"2026-01-25T16:30:00",detail:"En revisión compliance → Completado",market:"Iberia"},
  {id:4,action:"Declaración escalada", user:"Sunil",   target:"DEC-003",date:"2026-02-16T10:00:00",detail:"En revisión manager → Escalado → Jackie",  market:"Iberia"},
  {id:5,action:"Info solicitada",      user:"Sunil",   target:"DEC-007",date:"2026-02-22T11:00:00",detail:"En revisión manager → Info solicitada",market:"Iberia"},
];

// ══════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════
const fmtDate = iso => new Date(iso).toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"});
const fmtDT   = iso => new Date(iso).toLocaleString  ("es-ES",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"});

const getMarketConfig = (markets, marketName) => {
  return markets.find(m => m.name === marketName) || markets[0];
};

const getVisibleDeclarations = (declarations, user, allUsers) => {
  if (user.role === "Administrador Empresa") return declarations;
  if (user.role === "Empleado") return declarations.filter(d => d.userId === user.id);
  if (user.role === "Manager") {
    const myFull = fullName(user);
    const directIds = allUsers.filter(u => u.manager === user.name || u.manager === myFull).map(u => u.id);
    return declarations.filter(d => d.userId === user.id || directIds.includes(d.userId));
  }
  return declarations; // compliance, legal, admin see all
};

// ══════════════════════════════════════════════════════════════════
// LOGO — BlueGuard Solutions
// ══════════════════════════════════════════════════════════════════
function Logo({size=40}) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="blg1" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2169CC"/><stop offset="100%" stopColor="#5AB4F0"/>
        </linearGradient>
      </defs>
      <path d="M22 2L38.5 11.5V30.5L22 40L5.5 30.5V11.5L22 2Z" fill="rgba(21,83,168,0.3)" stroke="url(#blg1)" strokeWidth="0.8"/>
      <path d="M22 9L32.5 15V27L22 33L11.5 27V15L22 9Z" fill="rgba(8,17,31,0.7)"/>
      <path d="M13 22C13 22 17 16.5 22 16.5C27 16.5 31 22 31 22C31 22 27 27.5 22 27.5C17 27.5 13 22 13 22Z" fill="url(#blg1)" opacity="0.9"/>
      <circle cx="22" cy="22" r="3.8" fill="rgba(8,17,31,0.85)"/>
      <circle cx="22" cy="22" r="1.4" fill="#5AB4F0"/>
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ══════════════════════════════════════════════════════════════════
function StatusBadge({status}) {
  const c=getStatusCfg(status);
  return <span style={{display:"inline-flex",alignItems:"center",gap:"5px",background:c.bg,color:c.color,border:`1px solid ${c.border}`,borderRadius:"20px",padding:"3px 10px",fontSize:"0.7rem",fontWeight:500,fontFamily:"'Outfit',sans-serif",letterSpacing:"0.04em",whiteSpace:"nowrap"}}><span style={{fontSize:"9px"}}>{c.icon}</span>{status}</span>;
}
function RoleBadge({role}) {
  const c=getRoleCfg(role);
  return <span style={{background:c.bg,color:c.color,border:`1px solid ${c.border}`,borderRadius:"20px",padding:"2px 10px",fontSize:"0.68rem",fontWeight:500,fontFamily:"'Outfit',sans-serif",letterSpacing:"0.04em",whiteSpace:"nowrap"}}>{role}</span>;
}
function Card({children,style={}}) {
  return <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"12px",boxShadow:T.mode==="dark"?"0 4px 24px rgba(0,0,0,0.25)":"0 2px 12px rgba(24,83,168,0.08)",backdropFilter:"blur(8px)",...style}}>{children}</div>;
}
function SectionHeader({title,right}) {
  const hBg=T.mode==="dark"?"rgba(8,17,31,0.4)":"rgba(240,244,250,0.8)";
  return <div style={{padding:"11px 18px",borderBottom:`1px solid ${T.border}`,background:hBg,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
    <span style={{fontSize:"0.62rem",fontWeight:500,color:T.textSoft,fontFamily:"'Outfit',sans-serif",letterSpacing:"0.15em",textTransform:"uppercase"}}>{title}</span>
    {right}
  </div>;
}
function Toggle({value,onChange,activeColor}) {
  const active=activeColor||"#2169CC";
  const trackBg=value?active:(T.mode==="dark"?"rgba(109,135,168,0.20)":"rgba(74,100,128,0.15)");
  const thumbBg=value?(T.mode==="dark"?"#5AB4F0":"#FFFFFF"):(T.mode==="dark"?"#6D87A8":"#A0B4C8");
  return <div onClick={()=>onChange(!value)} style={{width:"38px",height:"21px",borderRadius:"11px",background:trackBg,position:"relative",transition:"all 0.22s",cursor:"pointer",flexShrink:0,border:`1px solid ${value?"rgba(33,105,204,0.4)":T.border}`,boxShadow:value?"0 0 8px rgba(33,105,204,0.25)":"none"}}>
    <div style={{position:"absolute",top:"2.5px",left:value?"18px":"2.5px",width:"15px",height:"15px",borderRadius:"50%",background:thumbBg,transition:"left 0.22s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/>
  </div>;
}
function StatCard({label,value,sub,accent,onClick}) {
  return <div onClick={onClick} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"16px 18px",position:"relative",overflow:"hidden",boxShadow:T.mode==="dark"?"0 4px 24px rgba(0,0,0,0.25)":"0 2px 12px rgba(24,83,168,0.08)",cursor:onClick?"pointer":"default",transition:"all 0.2s",backdropFilter:"blur(8px)"}}
    onMouseEnter={e=>{if(onClick){e.currentTarget.style.borderColor=T.borderMid;e.currentTarget.style.transform="translateY(-2px)";}}}
    onMouseLeave={e=>{if(onClick){e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="translateY(0)";}}}>    <div style={{position:"absolute",top:0,left:0,right:0,height:"3px",background:`linear-gradient(90deg,${accent},transparent)`}}/>
    <div style={{fontSize:"0.62rem",color:T.textSoft,fontFamily:"'Outfit',sans-serif",letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:"8px",fontWeight:400}}>{label}</div>
    <div style={{fontSize:"1.9rem",fontWeight:600,color:T.text,fontFamily:"'Cormorant Garamond',serif",lineHeight:1}}>{value}</div>
    {sub&&<div style={{fontSize:"0.75rem",color:T.textXSoft,marginTop:"5px",fontFamily:"'Outfit',sans-serif"}}>{sub}</div>}
  </div>;
}

// ── Modal ──────────────────────────────────────────────────────────
function Modal({title,onClose,children,width="440px"}) {
  return <div style={{position:"fixed",inset:0,background:"rgba(5,10,18,0.75)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px",backdropFilter:"blur(4px)"}}>
    <div style={{background:T.bgCardSolid,borderRadius:"14px",width:"100%",maxWidth:width,boxShadow:"0 24px 80px rgba(0,0,0,0.6)",animation:"fadeIn 0.15s ease",border:`1px solid ${T.border}`}}>
      {title&&<div style={{padding:"18px 22px 0",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${T.border}`,paddingBottom:"14px"}}>
        <span style={{fontSize:"15px",fontWeight:600,color:T.text,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.01em"}}>{title}</span>
        {onClose&&<button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:T.textSoft,fontSize:"18px",padding:"2px",lineHeight:1}}>✕</button>}
      </div>}
      <div style={{padding:"16px 22px 22px"}}>{children}</div>
    </div>
  </div>;
}
function ConfirmModal({title,body,confirmLabel="Confirmar",confirmColor="#2169CC",onConfirm,onCancel,children}) {
  return <Modal title={title} onClose={onCancel}>
    {body&&<p style={{fontSize:"13px",color:T.textMid,lineHeight:1.65,marginBottom:"12px"}}>{body}</p>}
    {children}
    <div style={{display:"flex",gap:"9px",justifyContent:"flex-end",marginTop:"14px"}}>
      <button onClick={onCancel} style={{padding:"8px 18px",background:T.accentLight,border:`1px solid ${T.border}`,color:T.textSoft,borderRadius:"7px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"0.82rem",letterSpacing:"0.02em"}}>Cancelar</button>
      <button onClick={onConfirm} style={{padding:"8px 18px",background:confirmColor,border:"none",color:T.text,borderRadius:"7px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"12px",fontWeight:600}}>{confirmLabel}</button>
    </div>
  </Modal>;
}

// ══════════════════════════════════════════════════════════════════
// SIDEBAR & TOPBAR
// ══════════════════════════════════════════════════════════════════
function Sidebar({active,onNav,currentUser,isOpen,onClose,isMobile,companyName,markets,onLogout}) {
  const items=NAV_ITEMS.filter(i=>i.roles.includes(currentUser.role));
  const userMarket=markets?.find(m=>m.name===currentUser.market)?.name||currentUser.market||"—";
  const isDark=T.mode==="dark";
  const sidebarBg=isDark?"rgba(8,17,31,0.98)":"rgba(255,255,255,0.98)";
  const dividerColor=isDark?"rgba(90,180,240,0.08)":"rgba(24,83,168,0.08)";
  const logoAccent=isDark?"#5AB4F0":"#1853A8";
  const activeBg=isDark?"rgba(90,180,240,0.10)":"rgba(24,83,168,0.08)";
  const activeBorder=isDark?"rgba(90,180,240,0.22)":"rgba(24,83,168,0.20)";
  const avatarBg="linear-gradient(135deg,#1853A8,#5AB4F0)";

  const inner=<div style={{width:"230px",height:"100%",background:sidebarBg,borderRight:`1px solid ${dividerColor}`,display:"flex",flexDirection:"column",boxShadow:isDark?"none":"2px 0 16px rgba(24,83,168,0.06)"}}>
    {/* Logo block */}
    <div style={{padding:"18px 16px 14px",borderBottom:`1px solid ${dividerColor}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:"11px"}}>
        <Logo size={36}/>
        <div>
          <div style={{fontSize:"1.12rem",fontWeight:700,color:T.text,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.03em",lineHeight:1}}>
            Conflict<span style={{color:logoAccent}}>Guard</span>
          </div>
          <div style={{fontSize:"0.57rem",color:T.textSoft,letterSpacing:"0.22em",textTransform:"uppercase",fontFamily:"'Outfit',sans-serif",fontWeight:400,marginTop:"2px"}}>by BlueGuard</div>
        </div>
      </div>
      {isMobile&&<button onClick={onClose} style={{background:"none",border:"none",fontSize:"17px",cursor:"pointer",color:T.textSoft}}>✕</button>}
    </div>

    {/* Company + Market block */}
    {companyName&&<div style={{padding:"10px 16px 10px",borderBottom:`1px solid ${dividerColor}`,background:isDark?"rgba(90,180,240,0.03)":"rgba(24,83,168,0.02)"}}>
      <div style={{fontSize:"0.82rem",fontWeight:600,color:T.text,fontFamily:"'Outfit',sans-serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{companyName}</div>
      <div style={{display:"flex",alignItems:"center",gap:"5px",marginTop:"3px"}}>
        <span style={{fontSize:"0.6rem",color:logoAccent,opacity:0.7}}>◉</span>
        <span style={{fontSize:"0.68rem",color:T.textSoft,fontFamily:"'Outfit',sans-serif",fontWeight:300,letterSpacing:"0.04em"}}>{userMarket}</span>
      </div>
    </div>}

    <nav style={{flex:1,padding:"10px 8px",overflowY:"auto"}}>
      {items.map(item=>(
        <button key={item.id} onClick={()=>{onNav(item.id);if(isMobile)onClose();}}
          style={{width:"100%",display:"flex",alignItems:"center",gap:"10px",padding:"10px 11px",borderRadius:"8px",marginBottom:"2px",
            background:active===item.id?activeBg:"transparent",
            border:active===item.id?`1px solid ${activeBorder}`:"1px solid transparent",
            color:active===item.id?T.accent:T.textSoft,cursor:"pointer",textAlign:"left",
            fontSize:"0.875rem",fontFamily:"'Outfit',sans-serif",fontWeight:active===item.id?500:300,
            transition:"all 0.14s",letterSpacing:"0.01em"}}>
          <span style={{width:"16px",textAlign:"center",fontSize:"12px",flexShrink:0,opacity:active===item.id?1:0.7}}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>

    {/* User footer */}
    <div style={{padding:"12px 14px",borderTop:`1px solid ${dividerColor}`}}>
      <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
        <div style={{width:"32px",height:"32px",borderRadius:"50%",background:avatarBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",fontWeight:600,color:T.text,flexShrink:0,border:`1px solid ${activeBorder}`}}>{currentUser.name[0]}</div>
        <div style={{overflow:"hidden",flex:1,minWidth:0}}>
          <div style={{fontSize:"0.84rem",fontWeight:500,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontFamily:"'Outfit',sans-serif"}}>{fullName(currentUser)}</div>
          <div style={{fontSize:"0.62rem",color:T.textSoft,fontFamily:"'Outfit',sans-serif",letterSpacing:"0.07em",textTransform:"uppercase",marginTop:"1px"}}>{currentUser.role}</div>
        </div>
        <button onClick={onLogout} title="Cerrar sesión" style={{background:"none",border:`1px solid ${dividerColor}`,borderRadius:"7px",cursor:"pointer",color:T.textSoft,fontSize:"14px",padding:"5px 7px",lineHeight:1,flexShrink:0,transition:"all 0.15s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(220,38,38,0.35)";e.currentTarget.style.color="#DC2626";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=dividerColor;e.currentTarget.style.color=T.textSoft;}}>⎋</button>
      </div>
    </div>
  </div>;

  if(isMobile) return <>
    {isOpen&&<div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:40}}/>}
    <div style={{position:"fixed",top:0,left:0,height:"100vh",zIndex:50,transform:isOpen?"translateX(0)":"translateX(-100%)",transition:"transform 0.25s ease"}}>{inner}</div>
  </>;
  return <div style={{flexShrink:0,height:"100%"}}>{inner}</div>;
}
function TopBar({onMenuOpen,currentUser,companyName}) {
  const isDark=T.mode==="dark";
  return <div style={{height:"52px",background:isDark?"rgba(8,17,31,0.95)":"rgba(255,255,255,0.95)",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",padding:"0 14px",gap:"12px",flexShrink:0,backdropFilter:"blur(16px)"}}>
    <button onClick={onMenuOpen} style={{background:"none",border:"none",fontSize:"20px",cursor:"pointer",color:T.textSoft,padding:"4px"}}>☰</button>
    <div style={{display:"flex",alignItems:"center",gap:"9px",flex:1}}>
      <Logo size={26}/>
      <div>
        <div style={{fontSize:"1.05rem",fontWeight:700,color:T.text,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.03em",lineHeight:1}}>Conflict<span style={{color:isDark?"#5AB4F0":"#1853A8"}}>Guard</span></div>
        {companyName&&<div style={{fontSize:"0.6rem",color:T.textSoft,fontFamily:"'Outfit',sans-serif",letterSpacing:"0.1em",textTransform:"uppercase"}}>{companyName}</div>}
      </div>
    </div>
    <div style={{width:"30px",height:"30px",borderRadius:"50%",background:"linear-gradient(135deg,#1853A8,#5AB4F0)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:600,color:T.text,border:`1px solid rgba(90,180,240,0.3)`}}>{currentUser.name[0]}</div>
  </div>;
}

// ══════════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════════
function Dashboard({declarations,onNav,currentUser,allUsers,isMobile}) {
  const mine=getVisibleDeclarations(declarations,currentUser,allUsers);
  const total=mine.length;
  const pending=mine.filter(d=>["En revisión manager","En revisión compliance"].includes(d.status)).length;
  const escalated=mine.filter(d=>d.status==="Escalado").length;
  const completed=mine.filter(d=>d.status==="Completado").length;
  const infoReq=mine.filter(d=>d.status==="Info solicitada").length;
  const resolved=mine.filter(d=>d.status==="Completado");
  const avgDays=resolved.length?Math.round(resolved.reduce((a,d)=>a+(new Date(d.updatedAt)-new Date(d.createdAt))/86400000,0)/resolved.length):0;
  const completionRate=total?Math.round(completed/total*100):0;
  const escalationRate=total?Math.round(escalated/total*100):0;
  const months=["Sep","Oct","Nov","Dic","Ene","Feb"];
  const monthVals=[2,4,3,6,5,total];
  const maxM=Math.max(...monthVals,1);
  const typeData=[...new Set(declarations.map(d=>d.type))].map(t=>({type:t.length>30?t.slice(0,28)+"…":t,count:mine.filter(d=>d.type===t).length})).filter(x=>x.count>0).sort((a,b)=>b.count-a.count).slice(0,5);
  const maxT=Math.max(...typeData.map(x=>x.count),1);
  const recent=[...mine].sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt)).slice(0,4);
  const col2=isMobile?"1fr":"1fr 1fr";
  const col4=isMobile?"1fr 1fr":"repeat(4,1fr)";
  return <div style={{paddingBottom:"20px"}}>
    <div style={{marginBottom:"18px"}}>
      <h1 style={{fontSize:isMobile?"1.5rem":"2rem",fontWeight:600,color:T.text,fontFamily:"'Cormorant Garamond',serif",margin:0,letterSpacing:"-0.01em"}}>Dashboard</h1>
      <p style={{color:T.textSoft,fontSize:"13px",margin:"5px 0 0",fontWeight:300}}>{new Date().toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p>
    </div>
    <div style={{display:"grid",gridTemplateColumns:col4,gap:"10px",marginBottom:"16px"}}>
      <StatCard label="Total" value={total} sub="declaraciones" accent="#2169CC" onClick={()=>onNav("declarations")}/>
      <StatCard label="En revisión" value={pending} sub="pendientes" accent="#C9A84C"/>
      <StatCard label="Tasa completado" value={`${completionRate}%`} sub={`${completed} completadas`} accent="#34D399"/>
      <StatCard label="Escaladas" value={escalated} sub={`${escalationRate}% tasa`} accent="#F87171"/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:col2,gap:"14px",marginBottom:"14px"}}>
      <Card>
        <SectionHeader title="Declaraciones por mes"/>
        <div style={{padding:"16px 18px"}}>
          <div style={{display:"flex",alignItems:"flex-end",gap:"7px",height:"90px"}}>
            {monthVals.map((v,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"3px"}}>
                <div style={{fontSize:"10px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",height:"14px",display:"flex",alignItems:"flex-end"}}>{v||""}</div>
                <div style={{width:"100%",background:`linear-gradient(180deg,${i===5?"#2169CC":"rgba(90,180,240,0.25)"},${i===5?"#1853A8":"#E0E7FF"})`,borderRadius:"4px 4px 2px 2px",height:`${Math.max(v/maxM*62,3)}px`}}/>
                <div style={{fontSize:"9px",color:T.textXSoft,fontFamily:"'Outfit',sans-serif"}}>{months[i]}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:"10px",fontSize:"11px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",display:"flex",justifyContent:"space-between",borderTop:`1px solid ${T.border}`,paddingTop:"8px"}}>
            <span>Resolución media: <b style={{color:T.text}}>{avgDays}d</b></span>
            <span style={{color:escalationRate>20?"#F87171":"#34D399"}}>Escalado: {escalationRate}%</span>
          </div>
        </div>
      </Card>
      <Card>
        <SectionHeader title="Pipeline actual"/>
        <div style={{padding:"16px 18px"}}>
          {Object.entries(STATUS_CFG).map(([status,cfg])=>{
            const count=mine.filter(d=>d.status===status).length;if(count===0)return null;
            const pct=total?Math.round(count/total*100):0;
            return <div key={status} style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}}>
              <div style={{width:"7px",height:"7px",borderRadius:"50%",background:cfg.color,flexShrink:0}}/>
              <span style={{fontSize:"12px",color:T.textMid,flex:1}}>{status}</span>
              <div style={{width:"70px",height:"4px",background:T.accentLight,borderRadius:"3px",flexShrink:0}}><div style={{height:"100%",width:`${pct}%`,background:cfg.color,borderRadius:"3px"}}/></div>
              <span style={{fontSize:"11px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",width:"22px",textAlign:"right",flexShrink:0}}>{count}</span>
            </div>;
          })}
        </div>
      </Card>
    </div>
    <div style={{display:"grid",gridTemplateColumns:col2,gap:"14px",marginBottom:"14px"}}>
      <Card>
        <SectionHeader title="Tipos más frecuentes"/>
        <div style={{padding:"16px 18px"}}>
          {typeData.length===0?<div style={{color:T.textXSoft,fontSize:"12px",fontFamily:"'Outfit',sans-serif"}}>Sin datos</div>:typeData.map(({type,count})=>(
            <div key={type} style={{marginBottom:"10px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"3px"}}><span style={{fontSize:"12px",color:T.textMid,flex:1,marginRight:"6px"}}>{type}</span><span style={{fontSize:"11px",color:"#5AB4F0",fontFamily:"'Outfit',sans-serif",fontWeight:700,flexShrink:0}}>{count}</span></div>
              <div style={{height:"4px",background:T.accentLight,borderRadius:"3px"}}><div style={{height:"100%",width:`${count/maxT*100}%`,background:"linear-gradient(90deg,#2169CC,#1853A8)",borderRadius:"3px"}}/></div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
        <Card style={{padding:"14px 16px"}}>
          <div style={{fontSize:"10px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"10px"}}>Resumen</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>
            {[{l:"Completadas",v:completed,c:"#34D399",bg:"rgba(52,211,153,0.08)"},{l:"Escaladas",v:escalated,c:"#F87171",bg:"rgba(248,113,113,0.08)"},{l:"Info pedida",v:infoReq,c:"#5AB4F0",bg:"rgba(90,180,240,0.08)"},{l:"En draft",v:mine.filter(d=>d.status==="Draft").length,c:"#6D87A8",bg:"rgba(109,135,168,0.08)"}].map(x=>(
              <div key={x.l} style={{background:x.bg,border:`1px solid ${x.c}25`,borderRadius:"7px",padding:"8px 10px"}}>
                <div style={{fontSize:"18px",fontWeight:700,color:x.c,fontFamily:"'Outfit',sans-serif"}}>{x.v}</div>
                <div style={{fontSize:"11px",color:T.textSoft,marginTop:"1px"}}>{x.l}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{padding:"14px 16px",flex:1}}>
          <div style={{fontSize:"10px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"9px"}}>Indicadores</div>
          {[{l:"Tiempo medio resolución",v:`${avgDays}d`,c:"#2169CC"},{l:"Tasa escalado",v:`${escalationRate}%`,c:escalationRate>20?"#F87171":"#34D399"},{l:"Tasa completado",v:`${completionRate}%`,c:completionRate>60?"#34D399":"#C9A84C"},{l:"Activas",v:pending,c:"#C9A84C"}].map(x=>(
            <div key={x.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${T.border}`}}>
              <span style={{fontSize:"12px",color:T.textMid}}>{x.l}</span>
              <span style={{fontSize:"13px",fontWeight:700,color:x.c,fontFamily:"'Outfit',sans-serif"}}>{x.v}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
    <Card>
      <SectionHeader title="Actividad reciente"/>
      <div>
        {recent.length===0?<div style={{padding:"20px",textAlign:"center",color:T.textXSoft,fontSize:"12px",fontFamily:"'Outfit',sans-serif"}}>Sin actividad</div>:recent.map((d,i)=>(
          <div key={d.id} style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 16px",borderBottom:i<recent.length-1?`1px solid ${T.border}`:"none",cursor:"pointer"}}
            onMouseEnter={e=>e.currentTarget.style.background=T.mode==="dark"?"rgba(90,180,240,0.04)":"rgba(24,83,168,0.04)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{width:"30px",height:"30px",borderRadius:"7px",background:STATUS_CFG[d.status]?.bg,border:`1px solid ${STATUS_CFG[d.status]?.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",color:STATUS_CFG[d.status]?.color,flexShrink:0}}>{STATUS_CFG[d.status]?.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:"12px",color:T.text,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.type}</div>
              <div style={{fontSize:"11px",color:T.textSoft,fontFamily:"'Outfit',sans-serif"}}>{d.userName} · {fmtDT(d.updatedAt)}</div>
            </div>
            <StatusBadge status={d.status}/>
            <span style={{fontFamily:"'Outfit',sans-serif",fontSize:"10px",color:"#5AB4F0",fontWeight:600,flexShrink:0}}>{d.id}</span>
          </div>
        ))}
      </div>
    </Card>
  </div>;
}

// ══════════════════════════════════════════════════════════════════
// DECLARATIONS LIST  — no "Aprobador" column
// ══════════════════════════════════════════════════════════════════
function DeclarationsList({declarations,currentUser,allUsers,onView,isMobile,viewOnly}) {
  const [filter,setFilter]=useState("Todos");
  const [search,setSearch]=useState("");
  const visible=getVisibleDeclarations(declarations,currentUser,allUsers);
  const statuses=["Todos",...Object.keys(STATUS_CFG)];
  const filtered=visible.filter(d=>{
    const mS=filter==="Todos"||d.status===filter;
    const mQ=!search||d.type.toLowerCase().includes(search.toLowerCase())||d.userName.toLowerCase().includes(search.toLowerCase())||d.id.toLowerCase().includes(search.toLowerCase());
    return mS&&mQ;
  });

  const getAprobador=(d)=>{
    if(d.status==="Draft"||d.status==="En revisión manager"){
      // Find manager of the declarant
      const declUser=allUsers.find(u=>u.id===d.userId);
      if(declUser&&declUser.manager){
        const mgr=allUsers.find(u=>u.name===declUser.manager);
        return mgr?mgr.name:declUser.manager;
      }
      return "—";
    }
    if(d.status==="En revisión compliance"||d.status==="Info solicitada"){
      const comp=allUsers.find(u=>u.role==="Compliance Manager"&&u.active);
      return comp?comp.name:"Compliance";
    }
    if(d.status==="Escalado"){
      const legal=allUsers.find(u=>u.role==="Head de Legal"&&u.active);
      return legal?legal.name:"Head de Legal";
    }
    return "—";
  };
  return <div>
    <div style={{marginBottom:"18px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"8px"}}>
      <div>
        <h1 style={{fontSize:isMobile?"1.5rem":"2rem",fontWeight:600,color:T.text,fontFamily:"'Cormorant Garamond',serif",margin:0,letterSpacing:"-0.01em"}}>Declaraciones</h1>
        <p style={{color:T.textSoft,fontSize:"13px",margin:"5px 0 0",fontWeight:300}}>{filtered.length} declaraciones{viewOnly&&<span style={{marginLeft:"8px",background:"rgba(201,168,76,0.10)",border:"1px solid rgba(201,168,76,0.3)",color:"#C9A84C",fontSize:"10px",borderRadius:"4px",padding:"1px 7px",fontFamily:"'Outfit',sans-serif",fontWeight:600}}>Solo lectura</span>}</p>
      </div>
    </div>
    <div style={{marginBottom:"12px"}}>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por ID, tipo o usuario…" style={{width:"100%",background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:"8px",padding:"9px 13px",color:T.text,fontSize:"0.875rem",fontFamily:"'Outfit',sans-serif",outline:"none",marginBottom:"8px",boxSizing:"border-box"}}/>
      <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>
        {statuses.map(s=><button key={s} onClick={()=>setFilter(s)} style={{padding:"4px 10px",borderRadius:"5px",fontSize:"11px",fontFamily:"'Outfit',sans-serif",cursor:"pointer",background:filter===s?"rgba(90,180,240,0.10)":T.bgCard,border:`1px solid ${filter===s?"rgba(90,180,240,0.25)":T.border}`,color:filter===s?T.accent:T.textSoft}}>{s}</button>)}
      </div>
    </div>
    {isMobile?(
      <div style={{display:"grid",gap:"8px"}}>
        {filtered.map(d=>(
          <div key={d.id} onClick={()=>onView(d)} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"12px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",cursor:"pointer",borderLeft:`3px solid ${STATUS_CFG[d.status]?.color||"#ccc"}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
              <span style={{fontFamily:"'Outfit',sans-serif",fontSize:"10px",color:"#5AB4F0",fontWeight:600}}>{d.id}</span>
              <StatusBadge status={d.status}/>
            </div>
            <div style={{fontSize:"13px",color:T.text,fontWeight:500,marginBottom:"2px"}}>{d.type}</div>
            <div style={{fontSize:"11px",color:T.textSoft}}>{d.userName} · {fmtDate(d.updatedAt)}</div>
          </div>
        ))}
        {filtered.length===0&&<div style={{textAlign:"center",padding:"36px",color:T.textXSoft,fontFamily:"'Outfit',sans-serif",fontSize:"12px"}}>Sin resultados</div>}
      </div>
    ):(
      <Card style={{overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:`1px solid ${T.border}`,background:T.mode==="dark"?"rgba(90,180,240,0.04)":"rgba(24,83,168,0.03)"}}>
            {["ID","Tipo","Declarante","Estado","Aprobador","Mercado","Actualizado",""].map(h=><th key={h} style={{padding:"10px 13px",textAlign:"left",fontSize:"10px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",letterSpacing:"0.06em",textTransform:"uppercase",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.length===0&&<tr><td colSpan={8} style={{padding:"32px",textAlign:"center",color:T.textXSoft,fontFamily:"'Outfit',sans-serif",fontSize:"12px"}}>No hay declaraciones</td></tr>}
            {filtered.map((d,i)=>(
              <tr key={d.id} style={{borderBottom:i<filtered.length-1?`1px solid ${T.border}`:"none",cursor:"pointer"}}
                onMouseEnter={e=>e.currentTarget.style.background=T.mode==="dark"?"rgba(90,180,240,0.04)":"rgba(24,83,168,0.04)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"11px 13px"}}><span style={{fontFamily:"'Outfit',sans-serif",fontSize:"11px",color:"#5AB4F0",fontWeight:600}}>{d.id}</span></td>
                <td style={{padding:"11px 13px",maxWidth:"190px"}}><div style={{fontSize:"12px",color:T.text,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.type}</div></td>
                <td style={{padding:"11px 13px"}}><span style={{fontSize:"12px",color:T.textMid}}>{d.userName}</span></td>
                <td style={{padding:"11px 13px"}}><StatusBadge status={d.status}/></td>
                <td style={{padding:"11px 13px"}}><span style={{fontSize:"11px",color:"#5AB4F0",fontFamily:"'Outfit',sans-serif",fontWeight:600}}>{getAprobador(d)}</span></td>
                <td style={{padding:"11px 13px"}}><span style={{fontSize:"11px",color:T.textSoft,fontFamily:"'Outfit',sans-serif"}}>{d.market||"—"}</span></td>
                <td style={{padding:"11px 13px"}}><span style={{fontSize:"11px",color:T.textSoft,fontFamily:"'Outfit',sans-serif"}}>{fmtDate(d.updatedAt)}</span></td>
                <td style={{padding:"11px 13px"}}><button onClick={()=>onView(d)} style={{background:"rgba(90,180,240,0.10)",border:`1px solid ${T.borderMid}`,color:"#5AB4F0",borderRadius:"5px",padding:"4px 11px",fontSize:"11px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:600}}>Ver →</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    )}
  </div>;
}

// ══════════════════════════════════════════════════════════════════
// NEW DECLARATION FORM — with send confirmation modal
// ══════════════════════════════════════════════════════════════════
function NewDeclarationForm({currentUser,markets,onSubmit,isMobile}) {
  const mktCfg = getMarketConfig(markets, currentUser.market);
  const formFields = mktCfg.fields;
  const formMeta = mktCfg.formMeta;
  const workflow = mktCfg.workflow;
  const active=formFields.filter(f=>f.active);
  const [vals,setVals]=useState({});
  const [done,setDone]=useState(false);
  const [showConfirm,setShowConfirm]=useState(false);
  const [lastMode,setLastMode]=useState("draft");

  const validate=()=>{
    for(const f of active.filter(f=>f.required)){
      if(!vals[f.id]||String(vals[f.id]).trim()===""){alert(`"${f.label}" es obligatorio.`);return false;}
    }return true;
  };
  const buildDecl=(status)=>{
    const tf=active.find(f=>f.type==="select");
    return {id:`DEC-${String(Math.floor(Math.random()*9000)+1000)}`,userId:currentUser.id,userName:fullName(currentUser),type:tf?vals[tf.id]||"Declaración":"Declaración",formValues:{...vals},status,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),market:currentUser.market||"Iberia",attachments:[],
      comments:status!=="Draft"?[{author:fullName(currentUser),text:"Declaración enviada por el empleado.",date:new Date().toISOString(),type:"submitted"}]:[]};
  };

  const handleDraft=()=>{if(!validate())return;onSubmit(buildDecl("Draft"),"draft");setLastMode("draft");setDone(true);};
  const handleSendClick=()=>{if(!validate())return;setShowConfirm(true);};
  const confirmSend=()=>{
    const initStatus=getInitialReviewStatus(workflow);
    onSubmit(buildDecl(initStatus),"send");
    setLastMode("send");setShowConfirm(false);setDone(true);
  };

  const tf=active.find(f=>f.type==="select");
  const df=active.find(f=>f.type==="textarea");

  if(done) return <div style={{textAlign:"center",padding:"60px 20px"}}>
    <div style={{width:"56px",height:"56px",borderRadius:"50%",background:"rgba(52,211,153,0.08)",border:"2px solid rgba(74,222,128,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"24px",margin:"0 auto 16px",color:"#34D399"}}>✓</div>
    <h2 style={{fontSize:"20px",fontWeight:700,color:T.text,fontFamily:"'Outfit',sans-serif",margin:"0 0 6px"}}>{lastMode==="send"?"Declaración enviada":"Borrador guardado"}</h2>
    <p style={{color:T.textSoft,fontSize:"13px"}}>{lastMode==="send"?"Tu declaración ha sido enviada correctamente.":"Puedes enviarla desde el detalle."}</p>
    <button onClick={()=>{setDone(false);setVals({});}} style={{marginTop:"16px",padding:"8px 20px",background:"rgba(90,180,240,0.10)",border:`1px solid ${T.borderMid}`,color:"#5AB4F0",borderRadius:"7px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"12px",fontWeight:600}}>Nueva declaración</button>
  </div>;

  const inp={width:"100%",background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:"8px",padding:"9px 12px",color:T.text,fontSize:"0.88rem",fontFamily:"'Outfit',sans-serif",outline:"none",boxSizing:"border-box"};
  return <div style={{maxWidth:"600px"}}>
    {showConfirm&&<ConfirmModal title="Confirmar envío" confirmLabel="Sí, enviar" confirmColor="linear-gradient(135deg,#2169CC,#1853A8)" onConfirm={confirmSend} onCancel={()=>setShowConfirm(false)}>
      <div style={{background:T.accentLight,border:`1px solid ${T.border}`,borderRadius:"9px",padding:"14px",marginBottom:"8px"}}>
        <div style={{fontSize:"11px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"8px"}}>Resumen</div>
        {tf&&<div style={{marginBottom:"7px"}}><div style={{fontSize:"10px",color:T.textXSoft,fontFamily:"'Outfit',sans-serif",marginBottom:"2px"}}>TIPO</div><div style={{fontSize:"13px",color:T.text,fontWeight:600}}>{vals[tf.id]||"—"}</div></div>}
        {df&&<div><div style={{fontSize:"10px",color:T.textXSoft,fontFamily:"'Outfit',sans-serif",marginBottom:"2px"}}>DESCRIPCIÓN</div><div style={{fontSize:"12px",color:T.textMid,lineHeight:1.6,maxHeight:"80px",overflow:"hidden"}}>{vals[df.id]||"—"}</div></div>}
        <div style={{marginTop:"10px",fontSize:"11px",color:"#C9A84C",background:"rgba(201,168,76,0.08)",border:"1px solid rgba(201,168,76,0.28)",borderRadius:"6px",padding:"7px 10px",fontFamily:"'Outfit',sans-serif"}}>⚠ Una vez enviada, solo podrás modificarla si te la devuelven.</div>
      </div>
      <p style={{fontSize:"12px",color:T.textSoft}}>¿Confirmas que la información es correcta?</p>
    </ConfirmModal>}
    <div style={{marginBottom:"20px"}}>
      <h1 style={{fontSize:isMobile?"1.5rem":"2rem",fontWeight:600,color:T.text,fontFamily:"'Cormorant Garamond',serif",margin:0,letterSpacing:"-0.01em"}}>Nueva Declaración</h1>
      <p style={{color:T.textSoft,fontSize:"13px",margin:"6px 0 0",lineHeight:1.65}}>{formMeta.subtitle}</p>
    </div>
    <div style={{background:"rgba(90,180,240,0.10)",border:`1px solid ${T.borderMid}`,borderRadius:"9px",padding:"10px 14px",marginBottom:"20px",fontSize:"12px",color:"#5AB4F0"}}><b>ℹ Recuerda:</b> Declarar un conflicto es un acto de transparencia y no implica sanción.</div>
    <div style={{display:"grid",gap:"13px"}}>
      {active.map(f=>(
        <div key={f.id}>
          <label style={{display:"block",fontSize:"0.62rem",color:T.textSoft,fontFamily:"'Outfit',sans-serif",marginBottom:"5px",letterSpacing:"0.12em",textTransform:"uppercase",fontWeight:400}}>{f.label}{f.required&&<span style={{color:"#F87171",marginLeft:"3px"}}>*</span>}</label>
          {f.type==="select"&&<select value={vals[f.id]||""} onChange={e=>setVals({...vals,[f.id]:e.target.value})} style={{...inp,cursor:"pointer"}}><option value="">Selecciona…</option>{f.options.map(o=><option key={o} value={o}>{o}</option>)}</select>}
          {f.type==="multiselect"&&<select multiple value={vals[f.id]||[]} onChange={e=>setVals({...vals,[f.id]:[...e.target.selectedOptions].map(o=>o.value)})} style={{...inp,height:"86px"}}>{f.options.map(o=><option key={o} value={o}>{o}</option>)}</select>}
          {f.type==="textarea"&&<textarea value={vals[f.id]||""} onChange={e=>setVals({...vals,[f.id]:e.target.value})} rows={5} style={{...inp,resize:"vertical",lineHeight:1.7}}/>}
          {f.type==="short_text"&&<input type="text" value={vals[f.id]||""} onChange={e=>setVals({...vals,[f.id]:e.target.value})} style={inp}/>}
          {f.type==="number"&&<input type="number" value={vals[f.id]||""} onChange={e=>setVals({...vals,[f.id]:e.target.value})} style={inp}/>}
          {f.type==="date"&&<input type="date" value={vals[f.id]||""} onChange={e=>setVals({...vals,[f.id]:e.target.value})} style={inp}/>}
          {f.type==="file"&&<div style={{border:`2px dashed ${T.border}`,borderRadius:"8px",padding:"18px",textAlign:"center",color:T.textXSoft,fontSize:"12px",cursor:"pointer",background:T.mode==="dark"?"rgba(90,180,240,0.04)":"rgba(24,83,168,0.03)"}} onClick={()=>alert("Carga de archivos disponible en producción.")}>📎 Arrastra o haz clic para adjuntar</div>}
        </div>
      ))}
      <div>
        <label style={{display:"block",fontSize:"0.62rem",color:T.textSoft,fontFamily:"'Outfit',sans-serif",marginBottom:"5px",letterSpacing:"0.12em",textTransform:"uppercase",fontWeight:400}}>Declarante</label>
        <input value={fullName(currentUser)} disabled style={{...inp,opacity:0.5,cursor:"not-allowed",background:T.mode==="dark"?"rgba(90,180,240,0.04)":"rgba(24,83,168,0.03)"}}/>
      </div>
      <div style={{display:"flex",gap:"8px",justifyContent:"flex-end",flexWrap:"wrap",paddingTop:"4px"}}>
        <button onClick={()=>setVals({})} style={{padding:"8px 14px",background:T.accentLight,border:`1px solid ${T.border}`,color:T.textSoft,borderRadius:"7px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"12px"}}>Limpiar</button>
        <button onClick={handleDraft} style={{padding:"9px 16px",background:T.bgCard,border:`1px solid ${T.border}`,color:T.text,borderRadius:"7px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"13px",fontWeight:400,letterSpacing:"0.01em"}}>Guardar borrador</button>
        <button onClick={handleSendClick} style={{padding:"9px 24px",background:"linear-gradient(135deg,#1853A8,#2169CC)",border:"none",color:"#EEF4FB",borderRadius:"7px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"13px",fontWeight:500,boxShadow:"0 6px 28px rgba(21,83,168,0.4)",letterSpacing:"0.01em",display:"inline-flex",alignItems:"center",gap:"7px"}}>Enviar declaración <span>→</span></button>
      </div>
    </div>
  </div>;
}

// ══════════════════════════════════════════════════════════════════
// DECLARATION DETAIL
// ══════════════════════════════════════════════════════════════════
function DeclarationDetail({declaration,currentUser,markets,allUsers,onBack,onUpdate,isMobile}) {
  const [d,setD]=useState(declaration);
  const [infoText,setInfoText]=useState("");
  const [showInfoBox,setShowInfoBox]=useState(false);
  const [employeeComment,setEmployeeComment]=useState("");
  const [confirmAction,setConfirmAction]=useState(null);
  const [editFormVals,setEditFormVals]=useState(d.formValues||{});
  const [showCompleteForm,setShowCompleteForm]=useState(false);
  const [completeFormData,setCompleteFormData]=useState({q1:"",q2:"",q3:"",agreed:""});

  const mktCfg = getMarketConfig(markets, d.market);
  const formFields = mktCfg.fields.filter(f=>f.active);
  const workflow = mktCfg.workflow;

  const isAdmin    = currentUser.role==="Administrador Empresa";
  const isEmployee = d.userId===currentUser.id;
  const isManager  = currentUser.role==="Manager";
  const isCompliance=currentUser.role==="Compliance Manager";
  const isHeadLegal= currentUser.role==="Head de Legal";

  // Manager cannot review their own declarations
  const isManagerOwnDecl = isManager && d.userId===currentUser.id;

  const canResubmit  = isEmployee && d.status==="Info solicitada";
  const canSubmitDraft=isEmployee && d.status==="Draft";
  const canCompleteConflictMgr = isManager && !isManagerOwnDecl && d.status==="En revisión manager";
  const canPassCompliance=isManager && !isManagerOwnDecl && d.status==="En revisión manager" && workflow.requireComplianceReview;
  const canCompleteCompliance=isCompliance && d.status==="En revisión compliance";
  const canCompleteMgr=isManager && !isManagerOwnDecl && d.status==="En revisión manager" && !workflow.requireComplianceReview;
  const canCompleteLegal=isHeadLegal && d.status==="Escalado";
  const canEscalateManager = workflow.allowEscalation && !workflow.allowEscalationByComplianceOnly && isManager && !isManagerOwnDecl && d.status==="En revisión manager";
  const canEscalateCompliance = workflow.allowEscalation && isCompliance && d.status==="En revisión compliance";
  const canEscalate = canEscalateManager || canEscalateCompliance;
  const canRequestInfo=(isManager&&!isManagerOwnDecl&&d.status==="En revisión manager")||(isCompliance&&d.status==="En revisión compliance");
  const hasActions   = !isAdmin&&(canSubmitDraft||canResubmit||canCompleteConflictMgr||canPassCompliance||canCompleteCompliance||canCompleteMgr||canCompleteLegal||canEscalate||canRequestInfo);

  // View mode: for pending approval, employee sees read-only; for Info solicitada, employee can edit + comment
  const isInfoMode = canResubmit;
  const isViewMode = !isInfoMode && !canSubmitDraft;

  const act=(newStatus,comment,ctype="action",extraFormVals,completionData,recipient)=>{
    const nc=comment?{author:fullName(currentUser),text:comment,date:new Date().toISOString(),type:ctype,recipient:recipient||null,completionData:completionData||null}:null;
    const upd={...d,status:newStatus,updatedAt:new Date().toISOString(),
      formValues:extraFormVals||d.formValues,
      comments:nc?[...d.comments,nc]:d.comments};
    setD(upd);onUpdate(upd,recipient);setShowInfoBox(false);setInfoText("");setConfirmAction(null);setEmployeeComment("");setShowCompleteForm(false);setCompleteFormData({q1:"",q2:"",q3:"",agreed:""});
  };

  const handleResubmit=()=>{
    if(!employeeComment.trim()){alert("Debes añadir un comentario antes de reenviar.");return;}
    const initStatus=getInitialReviewStatus(workflow);
    act(initStatus,employeeComment,"resubmit",editFormVals,null,null);
  };

  const cfg=STATUS_CFG[d.status];
  const wfSteps=[
    {label:"Borrador",status:"Draft",c:"#6D87A8"},
    ...(workflow.requireManagerReview?[{label:"Rev. Manager",status:"En revisión manager",c:"#C9A84C"}]:[]),
    ...(workflow.requireComplianceReview?[{label:"Rev. Compliance",status:"En revisión compliance",c:"#1853A8"}]:[]),
    {label:"Completado",status:"Completado",c:"#34D399"},
  ];
  const curIdx=wfSteps.findIndex(s=>s.status===d.status);

  const cTs={
    review:      {bg:"rgba(167,139,250,0.08)",border:"rgba(167,139,250,0.3)",tc:"#1853A8",badge:"Revisión"},
    completed:   {bg:"rgba(52,211,153,0.08)",border:"rgba(52,211,153,0.3)",tc:"#34D399",badge:"Completado"},
    escalation:  {bg:"rgba(248,113,113,0.08)",border:"rgba(248,113,113,0.3)",tc:"#F87171",badge:"Escalado"},
    info_request:{bg:T.accentLight,border:T.borderMid,tc:"#5AB4F0",badge:"Info solicitada"},
    resubmit:    {bg:T.accentLight,border:T.border,tc:"#2169CC",badge:"Reenvío"},
    submitted:   {bg:T.accentLight,border:T.border,tc:"#2169CC",badge:"Enviado"},
    action:      {bg:T.bgSoft,  border:T.border,  tc:T.textSoft,badge:"Acción"},
  };

  const inp={width:"100%",background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:"8px",padding:"9px 12px",color:T.text,fontSize:"0.88rem",fontFamily:"'Outfit',sans-serif",outline:"none",boxSizing:"border-box"};

  return <div>
    {confirmAction&&<ConfirmModal title={`Confirmar: ${confirmAction.label}`} body={confirmAction.body} confirmLabel={confirmAction.label} confirmColor={confirmAction.confirmColor||"#2169CC"}
      onConfirm={()=>act(confirmAction.newStatus,confirmAction.comment,confirmAction.ctype,null,null,confirmAction.recipient||null)}
      onCancel={()=>setConfirmAction(null)}/>}

    <button onClick={onBack} style={{background:"none",border:"none",color:"#5AB4F0",cursor:"pointer",fontSize:"0.82rem",marginBottom:"18px",fontFamily:"'Outfit',sans-serif",padding:0,letterSpacing:"0.02em",display:"flex",alignItems:"center",gap:"6px"}}>← Volver a declaraciones</button>
    <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 280px",gap:"12px",alignItems:"start"}}>
      <div>
        {/* Main declaration card */}
        <Card style={{marginBottom:"12px",borderLeft:`4px solid ${cfg?.color||T.accent}`}}>
          <div style={{padding:isMobile?"14px":"18px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"8px",marginBottom:"12px"}}>
              <div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:"0.65rem",color:"#5AB4F0",marginBottom:"5px",fontWeight:400,letterSpacing:"0.12em",textTransform:"uppercase"}}>{d.id} · {d.market}</div>
                <h2 style={{margin:0,fontSize:isMobile?"1.3rem":"1.55rem",fontWeight:600,color:T.text,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"-0.01em"}}>{d.type}</h2>
                <div style={{fontSize:"12px",color:T.textSoft,marginTop:"3px"}}>por <b style={{color:T.textMid}}>{d.userName}</b> · {fmtDT(d.createdAt)}</div>
              </div>
              <StatusBadge status={d.status}/>
            </div>

            {/* Form fields display */}
            <div style={{display:"grid",gap:"10px"}}>
              {formFields.map(f=>{
                const val=isInfoMode?editFormVals[f.id]:d.formValues?.[f.id];
                const ft=FIELD_TYPES.find(t=>t.value===f.type)||FIELD_TYPES[0];
                if(!val&&!isInfoMode) return null;
                return <div key={f.id} style={{background:T.accentLight,borderRadius:"8px",padding:"11px 13px",border:`1px solid ${T.border}`}}>
                  <div style={{fontSize:"10px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",marginBottom:"5px",textTransform:"uppercase",letterSpacing:"0.05em"}}>{f.label}{f.required&&<span style={{color:"#F87171",marginLeft:"2px"}}>*</span>}</div>
                  {isInfoMode?(
                    f.type==="textarea"
                      ?<textarea value={editFormVals[f.id]||""} onChange={e=>setEditFormVals({...editFormVals,[f.id]:e.target.value})} rows={4} style={{...inp,padding:"7px 10px",fontSize:"12px",resize:"vertical",lineHeight:1.7,background:T.tableHead}}/>
                      :f.type==="select"
                      ?<select value={editFormVals[f.id]||""} onChange={e=>setEditFormVals({...editFormVals,[f.id]:e.target.value})} style={{...inp,padding:"7px 10px",fontSize:"12px",background:T.tableHead,cursor:"pointer"}}><option value="">Selecciona…</option>{f.options.map(o=><option key={o} value={o}>{o}</option>)}</select>
                      :<input type={f.type==="number"?"number":f.type==="date"?"date":"text"} value={editFormVals[f.id]||""} onChange={e=>setEditFormVals({...editFormVals,[f.id]:e.target.value})} style={{...inp,padding:"7px 10px",fontSize:"12px",background:T.tableHead}}/>
                  ):(
                    <div style={{fontSize:"13px",color:T.textMid,lineHeight:1.7,fontFamily:f.type==="number"||f.type==="date"?"'Outfit',sans-serif":"inherit"}}>{Array.isArray(val)?val.join(", "):val||<span style={{color:T.textXSoft,fontStyle:"italic"}}>—</span>}</div>
                  )}
                </div>;
              })}
            </div>

            {d.attachments?.length>0&&<div style={{marginTop:"10px"}}>
              <div style={{fontSize:"10px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",marginBottom:"5px",textTransform:"uppercase"}}>Adjuntos</div>
              <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>{d.attachments.map(a=><div key={a} style={{background:"rgba(90,180,240,0.10)",border:`1px solid ${T.borderMid}`,borderRadius:"5px",padding:"3px 9px",fontSize:"11px",color:"#5AB4F0",fontFamily:"'Outfit',sans-serif"}}>📎 {a}</div>)}</div>
            </div>}
            {isAdmin&&<div style={{marginTop:"10px",padding:"8px 11px",background:"rgba(201,168,76,0.08)",border:"1px solid rgba(201,168,76,0.28)",borderRadius:"6px",fontSize:"11px",color:"#92400E",fontFamily:"'Outfit',sans-serif"}}>👁 Modo solo lectura — Administrador del sistema</div>}
            {isManagerOwnDecl&&<div style={{marginTop:"10px",padding:"8px 11px",background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.25)",borderRadius:"6px",fontSize:"11px",color:"#F87171",fontFamily:"'Outfit',sans-serif"}}>⚠ No puedes revisar tu propia declaración como Manager</div>}
          </div>
        </Card>

        {/* Workflow progress */}
        <Card style={{marginBottom:"12px",padding:"13px 16px"}}>
          <div style={{fontSize:"10px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:"10px"}}>Progreso</div>
          <div style={{display:"flex",alignItems:"center",overflowX:"auto",paddingBottom:"2px"}}>
            {wfSteps.map((step,i)=>{
              const done=curIdx>i;const active2=d.status===step.status;const sc=active2?step.c:done?"#34D399":"rgba(90,180,240,0.18)";
              return <div key={step.status} style={{display:"flex",alignItems:"center",flexShrink:0}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px"}}>
                  <div style={{width:"24px",height:"24px",borderRadius:"50%",border:`2px solid ${sc}`,background:done?"rgba(52,211,153,0.08)":active2?`${step.c}18`:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"9px",fontWeight:700,color:sc}}>{done?"✓":i+1}</div>
                  <span style={{fontSize:"9px",color:sc,fontFamily:"'Outfit',sans-serif",whiteSpace:"nowrap",fontWeight:active2||done?600:400}}>{step.label}</span>
                </div>
                {i<wfSteps.length-1&&<div style={{width:"24px",height:"2px",background:done?"rgba(52,211,153,0.3)":"rgba(90,180,240,0.12)",margin:"0 2px 12px",flexShrink:0}}/>}
              </div>;
            })}
            {d.status==="Escalado"&&<><div style={{width:"16px",height:"2px",background:"rgba(248,113,113,0.3)",margin:"0 2px 12px",flexShrink:0}}/><div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",flexShrink:0}}><div style={{width:"24px",height:"24px",borderRadius:"50%",border:"2px solid #F87171",background:"rgba(248,113,113,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"9px",color:"#F87171"}}>⚠</div><span style={{fontSize:"9px",color:"#F87171",fontFamily:"'Outfit',sans-serif",fontWeight:600}}>Escalado</span></div></>}
            {d.status==="Info solicitada"&&<><div style={{width:"16px",height:"2px",background:"rgba(90,180,240,0.3)",margin:"0 2px 12px",flexShrink:0}}/><div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",flexShrink:0}}><div style={{width:"24px",height:"24px",borderRadius:"50%",border:"2px solid #5AB4F0",background:T.accentLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"9px",color:T.accent}}>↩</div><span style={{fontSize:"9px",color:"#5AB4F0",fontFamily:"'Outfit',sans-serif",fontWeight:600}}>Info pedida</span></div></>}
          </div>
        </Card>

        {/* Activity history */}
        <Card>
          <SectionHeader title="Historial de actividad"/>
          <div style={{padding:"12px 16px"}}>
            {d.comments.length===0&&<div style={{color:T.textXSoft,fontSize:"12px",fontFamily:"'Outfit',sans-serif",padding:"4px 0"}}>Sin actividad.</div>}
            {d.comments.map((c,i)=>{
              const ts=cTs[c.type||"action"]||cTs["action"];
              return <div key={i} style={{display:"flex",gap:"9px",marginBottom:"10px"}}>
                <div style={{width:"26px",height:"26px",borderRadius:"50%",background:"linear-gradient(135deg,#2169CC,#1853A8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",fontWeight:700,color:T.text,flexShrink:0}}>{(c.author||"?")[0]}</div>
                <div style={{background:ts.bg,borderRadius:"8px",padding:"8px 12px",flex:1,border:`1px solid ${ts.border}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"3px",flexWrap:"wrap"}}>
                    <span style={{fontSize:"11px",fontWeight:700,color:T.text,fontFamily:"'Outfit',sans-serif"}}>{c.author}</span>
                    <span style={{fontSize:"10px",color:ts.tc,border:`1px solid ${ts.border}`,borderRadius:"3px",padding:"1px 6px",fontFamily:"'Outfit',sans-serif",fontWeight:600,background:ts.bg}}>{ts.badge}</span>
                    {c.recipient&&<span style={{fontSize:"10px",color:"#2169CC",border:`1px solid ${T.borderMid}`,borderRadius:"3px",padding:"1px 6px",fontFamily:"'Outfit',sans-serif",fontWeight:600,background:"rgba(90,180,240,0.10)"}}>→ {c.recipient}</span>}
                    <span style={{fontSize:"10px",color:T.textXSoft,fontFamily:"'Outfit',sans-serif",marginLeft:"auto"}}>{fmtDT(c.date)}</span>
                  </div>
                  <div style={{fontSize:"12px",color:T.textMid,lineHeight:1.65}}>{c.text}</div>
                </div>
              </div>;
            })}

            {/* Manager/Compliance: request info button */}
            {canRequestInfo&&!isAdmin&&<>
              <button onClick={()=>setShowInfoBox(!showInfoBox)} style={{marginTop:"8px",padding:"7px 14px",background:"rgba(90,180,240,0.10)",border:"1px solid rgba(90,180,240,0.3)",color:"#5AB4F0",borderRadius:"7px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"11px",fontWeight:600}}>↩ Solicitar información al empleado</button>
              {showInfoBox&&<div style={{marginTop:"9px",background:T.accentLight,border:`1px solid ${T.borderMid}`,borderRadius:"8px",padding:"12px"}}>
                <div style={{fontSize:"11px",color:"#5AB4F0",fontFamily:"'Outfit',sans-serif",marginBottom:"7px",fontWeight:600}}>¿Qué información necesitas?</div>
                <textarea value={infoText} onChange={e=>setInfoText(e.target.value)} rows={3} placeholder="Describe qué documentación o aclaración se requiere…" style={{width:"100%",background:T.tableHead,border:"1px solid rgba(90,180,240,0.20)",borderRadius:"6px",padding:"7px 10px",fontSize:"12px",color:T.text,fontFamily:"'Outfit',sans-serif",outline:"none",resize:"none",boxSizing:"border-box"}}/>
                <div style={{display:"flex",gap:"7px",marginTop:"7px",justifyContent:"flex-end"}}>
                  <button onClick={()=>{setShowInfoBox(false);setInfoText("");}} style={{padding:"5px 12px",background:T.tableHead,border:`1px solid ${T.border}`,color:T.textSoft,borderRadius:"6px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"11px"}}>Cancelar</button>
                  <button onClick={()=>{if(!infoText.trim()){alert("Indica qué información se solicita.");return;}act("Info solicitada",infoText,"info_request");}} style={{padding:"5px 12px",background:"#5AB4F0",border:"none",color:T.text,borderRadius:"6px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"11px",fontWeight:600}}>Enviar solicitud</button>
                </div>
              </div>}
            </>}

            {/* Employee: info mode — add comment + resubmit */}
            {canResubmit&&<div style={{marginTop:"12px",background:T.accentLight,border:`1px solid ${T.borderMid}`,borderRadius:"10px",padding:"14px"}}>
              <div style={{fontSize:"12px",fontWeight:700,color:"#2169CC",fontFamily:"'Outfit',sans-serif",marginBottom:"4px"}}>↩ Se ha solicitado información adicional</div>
              <div style={{fontSize:"12px",color:T.textSoft,marginBottom:"12px",lineHeight:1.6}}>Edita el formulario si es necesario y añade un comentario explicando los cambios realizados antes de reenviar.</div>
              <label style={{display:"block",fontSize:"10px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",marginBottom:"5px",textTransform:"uppercase",letterSpacing:"0.05em"}}>Tu comentario *</label>
              <textarea value={employeeComment} onChange={e=>setEmployeeComment(e.target.value)} rows={3} placeholder="Explica los cambios realizados o la información adicional aportada…" style={{width:"100%",background:T.tableHead,border:`1px solid ${T.borderMid}`,borderRadius:"7px",padding:"8px 11px",fontSize:"12px",color:T.text,fontFamily:"'Outfit',sans-serif",outline:"none",resize:"none",boxSizing:"border-box",lineHeight:1.65,marginBottom:"10px"}}/>
              <button onClick={handleResubmit} style={{padding:"8px 18px",background:"linear-gradient(135deg,#2169CC,#1853A8)",border:"none",color:T.text,borderRadius:"7px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"12px",fontWeight:600,boxShadow:"0 2px 6px rgba(33,105,204,0.2)"}}>Reenviar declaración →</button>
            </div>}
          </div>
        </Card>
      </div>

      {/* Actions sidebar */}
      <div>
        <Card style={{position:isMobile?"static":"sticky",top:"16px"}}>
          <SectionHeader title="Estado & Acciones"/>
          <div style={{padding:"12px 14px"}}>
            {[["Estado",<StatusBadge status={d.status}/>],["Declarante",<span style={{fontSize:"12px",color:T.textMid,fontWeight:500}}>{d.userName}</span>],["Mercado",<span style={{fontSize:"11px",color:T.textSoft,fontFamily:"'Outfit',sans-serif"}}>{d.market||"—"}</span>],["Creado",<span style={{fontSize:"11px",color:T.textSoft,fontFamily:"'Outfit',sans-serif"}}>{fmtDT(d.createdAt)}</span>]].map(([l,v])=>(
              <div key={l} style={{marginBottom:"10px",paddingBottom:"10px",borderBottom:`1px solid ${T.border}`}}>
                <div style={{fontSize:"10px",color:T.textXSoft,fontFamily:"'Outfit',sans-serif",marginBottom:"3px",textTransform:"uppercase",letterSpacing:"0.04em"}}>{l}</div>
                {v}
              </div>
            ))}
            <div style={{display:"grid",gap:"6px"}}>
              {canSubmitDraft&&<button onClick={()=>setConfirmAction({newStatus:getInitialReviewStatus(workflow),comment:null,ctype:"submitted",label:"Enviar declaración",body:"¿Confirmas el envío? No podrás editarla a menos que te la devuelvan.",confirmColor:"linear-gradient(135deg,#1853A8,#2169CC)"})} style={{padding:"9px",borderRadius:"7px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"11px",background:"rgba(90,180,240,0.10)",border:`1px solid ${T.borderMid}`,color:"#5AB4F0",fontWeight:600}}>✓ Enviar declaración</button>}
              {canPassCompliance&&<button onClick={()=>{const compUser=allUsers.find(u=>u.role==="Compliance Manager"&&u.active);const compName=compUser?compUser.name:"Compliance";setConfirmAction({newStatus:"En revisión compliance",comment:`Revisado por Manager. Enviado a ${compName} para revisión de Compliance.`,ctype:"review",label:"Enviar a Compliance",body:`¿Confirmas que deseas enviar esta declaración a ${compName} (Compliance Manager)?`,confirmColor:"linear-gradient(135deg,#1853A8,#2169CC)",recipient:compName});}} style={{padding:"9px",borderRadius:"7px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"11px",background:"rgba(167,139,250,0.10)",border:"1px solid rgba(167,139,250,0.3)",color:"#A78BFA",fontWeight:500}}>◑ Enviar a Compliance</button>}
              {(canCompleteConflictMgr&&!canPassCompliance)||canCompleteCompliance||canCompleteMgr||canCompleteLegal?<button onClick={()=>setShowCompleteForm(!showCompleteForm)} style={{padding:"9px",borderRadius:"7px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"11px",background:"rgba(52,211,153,0.10)",border:"1px solid rgba(52,211,153,0.3)",color:"#34D399",fontWeight:600}}>✓ Completar conflicto</button>:null}
              {canEscalate&&(()=>{const legalUser=allUsers.find(u=>u.role==="Head de Legal"&&u.active);const legalName=legalUser?legalUser.name:"Head de Legal";return <button onClick={()=>setConfirmAction({newStatus:"Escalado",comment:`Declaración escalada a ${legalName} (Head de Legal).`,ctype:"escalation",label:"Escalar a Legal",body:`¿Confirmas que deseas escalar esta declaración a ${legalName} (Head de Legal)?`,confirmColor:"#F87171",recipient:legalName})} style={{padding:"9px",borderRadius:"7px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"11px",background:"rgba(248,113,113,0.10)",border:"1px solid rgba(248,113,113,0.3)",color:"#F87171",fontWeight:600}}>⚠ Escalar a {legalName}</button>;})()} 
              {!hasActions&&!isAdmin&&!isManagerOwnDecl&&<div style={{fontSize:"11px",color:T.textXSoft,fontFamily:"'Outfit',sans-serif",textAlign:"center",padding:"10px",background:T.accentLight,borderRadius:"7px",border:`1px solid ${T.border}`}}>Sin acciones disponibles</div>}
            </div>
          </div>
        </Card>
        {showCompleteForm&&<Card style={{marginTop:"10px",border:"1px solid rgba(74,222,128,0.25)"}}>
          <SectionHeader title="Completar conflicto"/>
          <div style={{padding:"14px 16px"}}>
            <div style={{fontSize:"12px",color:T.textSoft,marginBottom:"14px",lineHeight:1.6}}>Completa la revisión respondiendo las siguientes preguntas y documentando lo acordado con el empleado.</div>
            {[
              {key:"q1",label:"¿Se ha confirmado la existencia de un conflicto de interés real?",ph:"Sí / No / Parcialmente — explica brevemente…"},
              {key:"q2",label:"¿Se han tomado medidas para mitigar o eliminar el conflicto?",ph:"Describe las medidas adoptadas…"},
              {key:"q3",label:"¿Se requiere seguimiento adicional o revisión periódica?",ph:"Indica si procede seguimiento y con qué periodicidad…"},
            ].map(({key,label,ph})=>(
              <div key={key} style={{marginBottom:"12px"}}>
                <label style={{display:"block",fontSize:"10px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",marginBottom:"5px",textTransform:"uppercase",letterSpacing:"0.05em"}}>{label}</label>
                <textarea value={completeFormData[key]} onChange={e=>setCompleteFormData({...completeFormData,[key]:e.target.value})} rows={3} placeholder={ph} style={{width:"100%",background:T.tableHead,border:"1px solid rgba(74,222,128,0.25)",borderRadius:"7px",padding:"8px 11px",fontSize:"12px",color:T.text,fontFamily:"'Outfit',sans-serif",outline:"none",resize:"none",boxSizing:"border-box",lineHeight:1.65}}/>
              </div>
            ))}
            <div style={{marginBottom:"12px"}}>
              <label style={{display:"block",fontSize:"10px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",marginBottom:"5px",textTransform:"uppercase",letterSpacing:"0.05em"}}>Lo acordado con el empleado *</label>
              <textarea value={completeFormData.agreed} onChange={e=>setCompleteFormData({...completeFormData,agreed:e.target.value})} rows={4} placeholder="Describe el acuerdo alcanzado con el empleado y las condiciones establecidas…" style={{width:"100%",background:T.tableHead,border:"1px solid rgba(74,222,128,0.25)",borderRadius:"7px",padding:"8px 11px",fontSize:"12px",color:T.text,fontFamily:"'Outfit',sans-serif",outline:"none",resize:"none",boxSizing:"border-box",lineHeight:1.65}}/>
            </div>
            <div style={{display:"flex",gap:"8px",justifyContent:"flex-end"}}>
              <button onClick={()=>{setShowCompleteForm(false);setCompleteFormData({q1:"",q2:"",q3:"",agreed:""}); }} style={{padding:"7px 14px",background:T.accentLight,border:`1px solid ${T.border}`,color:T.textSoft,borderRadius:"6px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"11px"}}>Cancelar</button>
              <button onClick={()=>{
                if(!completeFormData.agreed.trim()){alert("El campo 'Lo acordado con el empleado' es obligatorio.");return;}
                const summary=`Revisión completada por ${fullName(currentUser)}.\n\n¿Conflicto real?: ${completeFormData.q1||"—"}\nMedidas adoptadas: ${completeFormData.q2||"—"}\nSeguimiento: ${completeFormData.q3||"—"}\n\nAcordado con el empleado: ${completeFormData.agreed}`;
                act("Completado",summary,"completed",null,completeFormData,null);
              }} style={{padding:"8px 18px",background:"linear-gradient(135deg,#1853A8,#2169CC)",border:"none",color:T.text,borderRadius:"6px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"12px",fontWeight:500,boxShadow:"0 4px 16px rgba(21,83,168,0.4)"}}>✓ Confirmar y completar</button>
            </div>
          </div>
        </Card>}
      </div>
    </div>
  </div>;
}

// ══════════════════════════════════════════════════════════════════
// AUDIT
// ══════════════════════════════════════════════════════════════════
function AuditLog({auditLogs,isMobile}) {
  return <div>
    <div style={{marginBottom:"18px"}}><h1 style={{fontSize:isMobile?"1.5rem":"2rem",fontWeight:600,color:T.text,fontFamily:"'Cormorant Garamond',serif",margin:0,letterSpacing:"-0.01em"}}>Auditoría</h1><p style={{color:T.textSoft,fontSize:"13px",margin:"5px 0 0",fontWeight:300}}>Registro inmutable de todas las acciones</p></div>
    {isMobile?<div style={{display:"grid",gap:"8px"}}>{auditLogs.map(log=><Card key={log.id} style={{padding:"12px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}><span style={{fontSize:"12px",color:T.text,fontWeight:500}}>{log.action}</span><span style={{fontFamily:"'Outfit',sans-serif",fontSize:"10px",color:T.textXSoft}}>{String(log.id).padStart(4,"0")}</span></div><div style={{fontSize:"11px",color:T.textSoft}}><span style={{color:"#5AB4F0",fontWeight:500}}>{log.user}</span> · <span style={{fontFamily:"'Outfit',sans-serif",color:"#5AB4F0"}}>{log.target}</span></div><div style={{fontSize:"11px",color:T.textSoft,marginTop:"2px"}}>{log.detail}</div><div style={{fontSize:"10px",color:T.textXSoft,marginTop:"3px",fontFamily:"'Outfit',sans-serif"}}>{fmtDT(log.date)}</div></Card>)}</div>:(
    <Card style={{overflow:"hidden",marginBottom:"10px"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{borderBottom:`1px solid ${T.border}`,background:T.mode==="dark"?"rgba(90,180,240,0.04)":"rgba(24,83,168,0.03)"}}>{["#","Acción","Usuario","Objeto","Detalle","Mercado","Fecha"].map(h=><th key={h} style={{padding:"10px 13px",textAlign:"left",fontSize:"10px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",letterSpacing:"0.06em",textTransform:"uppercase",fontWeight:600}}>{h}</th>)}</tr></thead>
        <tbody>{auditLogs.map((log,i)=><tr key={log.id} style={{borderBottom:i<auditLogs.length-1?`1px solid ${T.border}`:"none"}} onMouseEnter={e=>e.currentTarget.style.background=T.mode==="dark"?"rgba(90,180,240,0.04)":"rgba(24,83,168,0.04)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <td style={{padding:"10px 13px"}}><span style={{fontFamily:"'Outfit',sans-serif",fontSize:"10px",color:T.textXSoft}}>{String(log.id).padStart(4,"0")}</span></td>
          <td style={{padding:"10px 13px"}}><span style={{fontSize:"12px",color:T.text,fontWeight:500}}>{log.action}</span></td>
          <td style={{padding:"10px 13px"}}><span style={{fontSize:"12px",color:"#5AB4F0",fontWeight:500}}>{log.user}</span></td>
          <td style={{padding:"10px 13px"}}><span style={{fontFamily:"'Outfit',sans-serif",fontSize:"11px",color:"#5AB4F0",fontWeight:600}}>{log.target}</span></td>
          <td style={{padding:"10px 13px"}}><span style={{fontSize:"12px",color:T.textSoft}}>{log.detail}</span></td>
          <td style={{padding:"10px 13px"}}><span style={{fontSize:"11px",color:T.textSoft,fontFamily:"'Outfit',sans-serif"}}>{log.market||"—"}</span></td>
          <td style={{padding:"10px 13px"}}><span style={{fontFamily:"'Outfit',sans-serif",fontSize:"11px",color:T.textSoft}}>{fmtDT(log.date)}</span></td>
        </tr>)}</tbody>
      </table>
    </Card>)}
    <div style={{padding:"8px 12px",background:"rgba(52,211,153,0.08)",border:"1px solid rgba(74,222,128,0.25)",borderRadius:"7px",fontSize:"11px",color:"#34D399",fontFamily:"'Outfit',sans-serif"}}>✓ Registro inmutable · Timestamp sellado · Cumple RGPD</div>
  </div>;
}

// ══════════════════════════════════════════════════════════════════
// ADMIN PANEL — markets each have own workflow + form
// ══════════════════════════════════════════════════════════════════
function AdminPanel({markets,setMarkets,users,setUsers,isMobile,darkMode,setDarkMode,companyName,setCompanyName}) {
  const [tab,setTab]=useState("general");
  const [selectedMktId,setSelectedMktId]=useState(markets[0]?.id||"iberia");
  // User form
  const [showAddUser,setShowAddUser]=useState(false);
  const [editUser,setEditUser]=useState(null);
  const [userForm,setUserForm]=useState({name:"",lastName:"",email:"",role:"Empleado",dept:"",manager:"",market:markets[0]?.name||"Iberia"});
  const [confirmDelete,setConfirmDelete]=useState(null);
  // Market form
  const [showAddMkt,setShowAddMkt]=useState(false);
  const [editMkt,setEditMkt]=useState(null);
  const [mktForm,setMktForm]=useState({name:"",countries:""});
  // Form field editing
  const [editFieldId,setEditFieldId]=useState(null);
  const [newOpt,setNewOpt]=useState("");
  const [editingLabelId,setEditingLabelId]=useState(null);
  const [confirmDeleteField,setConfirmDeleteField]=useState(null);

  const selMkt=markets.find(m=>m.id===selectedMktId)||markets[0];
  const updSelMkt=(patch)=>setMarkets(markets.map(m=>m.id===selectedMktId?{...m,...patch}:m));
  const legalUsers=users.filter(u=>u.role==="Head de Legal"&&u.active);
  const inp={background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:"6px",padding:"7px 10px",color:T.text,fontSize:"0.84rem",fontFamily:"'Outfit',sans-serif",outline:"none"};

  // User CRUD
  const openAddUser=()=>{setUserForm({name:"",lastName:"",email:"",role:"Empleado",dept:"",manager:"",market:markets[0]?.name||"Iberia"});setEditUser(null);setShowAddUser(true);};
  const openEditUser=u=>{setUserForm({name:u.name,lastName:u.lastName||"",email:u.email,role:u.role,dept:u.dept||"",manager:u.manager||"",market:u.market||"Iberia"});setEditUser(u);setShowAddUser(true);};
  const saveUser=()=>{
    if(!userForm.name.trim()||!userForm.email.trim()){alert("Nombre y email son obligatorios.");return;}
    if(editUser) setUsers(users.map(u=>u.id===editUser.id?{...u,...userForm,manager:userForm.manager||null}:u));
    else setUsers([...users,{id:Date.now(),name:userForm.name,lastName:userForm.lastName,email:userForm.email,role:userForm.role,dept:userForm.dept,manager:userForm.manager||null,market:userForm.market,active:true}]);
    setShowAddUser(false);setEditUser(null);
  };
  const deleteUser=id=>{setUsers(users.filter(u=>u.id!==id));setConfirmDelete(null);};
  const toggleActive=id=>setUsers(users.map(u=>u.id===id?{...u,active:!u.active}:u));

  // Market CRUD
  const openAddMkt=()=>{setMktForm({name:"",countries:""});setEditMkt(null);setShowAddMkt(true);};
  const openEditMkt=m=>{setMktForm({name:m.name,countries:m.countries||""});setEditMkt(m);setShowAddMkt(true);};
  const saveMkt=()=>{
    if(!mktForm.name.trim()){alert("Nombre obligatorio.");return;}
    if(editMkt) setMarkets(markets.map(m=>m.id===editMkt.id?{...m,...mktForm}:m));
    else setMarkets([...markets,{id:mktForm.name.toLowerCase().replace(/\s+/g,"-"),name:mktForm.name,countries:mktForm.countries,active:true,workflow:{...INIT_WORKFLOW},fields:[...INIT_FIELDS],formMeta:{...INIT_FORM_META}}]);
    setShowAddMkt(false);setEditMkt(null);
  };
  const deleteMkt=id=>setMarkets(markets.filter(m=>m.id!==id));

  // Workflow helpers
  const wf=selMkt?.workflow||{};
  const setWf=patch=>updSelMkt({workflow:{...wf,...patch}});
  const wfOpts=[
    {key:"requireManagerReview",          label:"Revisión por Manager",              desc:"El Manager debe revisar antes de Compliance.",           icon:"◐",c:"#C9A84C"},
    {key:"requireComplianceReview",       label:"Revisión por Compliance",           desc:"El Compliance Manager debe completar la declaración.",   icon:"◑",c:"#1853A8"},
    {key:"allowEscalation",               label:"Permitir escalado a Legal",         desc:"Permite escalar la declaración al Head de Legal.",       icon:"⚠",c:"#F87171"},
    {key:"allowEscalationByComplianceOnly",label:"Escalado solo por Compliance",     desc:"Solo el Compliance Manager puede escalar al Head de Legal.",icon:"🔒",c:"#92400E"},
    {key:"autoClose",                     label:"Completado automático",             desc:"Se completa al terminar el último paso.",                icon:"✓",c:"#34D399"},
  ];

  // Form field helpers
  const fields=selMkt?.fields||[];
  const setFields=f=>updSelMkt({fields:f});
  const formMeta=selMkt?.formMeta||{subtitle:""};
  const setFormMeta=fm=>updSelMkt({formMeta:fm});
  const moveField=(idx,dir)=>{const a=[...fields],to=idx+dir;if(to<0||to>=a.length)return;[a[idx],a[to]]=[a[to],a[idx]];setFields(a);};
  const addOpt=fid=>{if(!newOpt.trim())return;setFields(fields.map(f=>f.id===fid?{...f,options:[...f.options,newOpt.trim()]}:f));setNewOpt("");};
  const removeOpt=(fid,o)=>setFields(fields.map(f=>f.id===fid?{...f,options:f.options.filter(x=>x!==o)}:f));

  const TABS=[{id:"general",label:"⚙ General"},{id:"users",label:"👤 Usuarios"},{id:"markets",label:"🌍 Mercados"},{id:"workflow",label:"⚙ Workflow"},{id:"form",label:"◻ Formulario"}];

  return <div>
    {confirmDelete&&<ConfirmModal title="¿Eliminar usuario?" body={`${fullName(confirmDelete)} será eliminado permanentemente.`} confirmLabel="Eliminar" confirmColor="#F87171" onConfirm={()=>deleteUser(confirmDelete.id)} onCancel={()=>setConfirmDelete(null)}/>}
    {confirmDeleteField&&<ConfirmModal title="¿Eliminar campo?" body={`El campo "${confirmDeleteField.label}" será eliminado del formulario. Esta acción no se puede deshacer.`} confirmLabel="Eliminar campo" confirmColor="#F87171" onConfirm={()=>{setFields(fields.filter(f=>f.id!==confirmDeleteField.id));setConfirmDeleteField(null);}} onCancel={()=>setConfirmDeleteField(null)}/>}

    <div style={{marginBottom:"18px"}}>
      <h1 style={{fontSize:isMobile?"1.5rem":"2rem",fontWeight:600,color:T.text,fontFamily:"'Cormorant Garamond',serif",margin:0,letterSpacing:"-0.01em"}}>Administración</h1>
      <p style={{color:T.textSoft,fontSize:"13px",margin:"5px 0 0",fontWeight:300}}>Gestión de usuarios, mercados, workflow y formulario</p>
    </div>
    <div style={{display:"flex",gap:"3px",marginBottom:"16px",background:T.mode==="dark"?"rgba(90,180,240,0.04)":"rgba(24,83,168,0.03)",padding:"3px",borderRadius:"9px",border:`1px solid ${T.border}`,width:"fit-content",flexWrap:"wrap"}}>
      {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"7px 14px",borderRadius:"7px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"12px",fontWeight:600,border:"none",background:tab===t.id?(T.mode==="dark"?"rgba(15,37,64,0.8)":"rgba(255,255,255,0.95)"):"transparent",color:tab===t.id?T.accent:T.textSoft,boxShadow:tab===t.id?"0 1px 3px rgba(0,0,0,0.08)":"none",transition:"all 0.14s",whiteSpace:"nowrap"}}>{t.label}</button>)}
    </div>

    {/* ═══ GENERAL ═══ */}
    {tab==="general"&&<div style={{display:"grid",gap:"16px",maxWidth:"600px"}}>

      {/* Company name */}
      <Card style={{overflow:"hidden"}}>
        <SectionHeader title="Identidad de la empresa"/>
        <div style={{padding:"20px 22px"}}>
          <label style={{display:"block",fontSize:"0.62rem",color:T.textSoft,fontFamily:"'Outfit',sans-serif",marginBottom:"6px",letterSpacing:"0.14em",textTransform:"uppercase",fontWeight:500}}>
            Nombre de la compañía
          </label>
          <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
            <input
              type="text"
              value={companyName}
              onChange={e=>setCompanyName(e.target.value)}
              placeholder="Ej. Acme Corporation S.L."
              style={{flex:1,background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:"8px",padding:"10px 14px",color:T.text,fontSize:"0.9rem",fontFamily:"'Outfit',sans-serif",outline:"none"}}
            />
          </div>
          <p style={{fontSize:"0.75rem",color:T.textXSoft,marginTop:"8px",fontFamily:"'Outfit',sans-serif",fontWeight:300}}>
            Este nombre aparece en la barra lateral debajo del logo de ConflictGuard.
          </p>
        </div>
      </Card>

      {/* Dark/Light mode toggle */}
      <Card style={{overflow:"hidden"}}>
        <SectionHeader title="Apariencia"/>
        <div style={{padding:"20px 22px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"20px"}}>
            <div>
              <div style={{fontSize:"0.88rem",fontWeight:500,color:T.text,fontFamily:"'Outfit',sans-serif",marginBottom:"4px"}}>
                Tema de la interfaz
              </div>
              <div style={{fontSize:"0.75rem",color:T.textSoft,fontFamily:"'Outfit',sans-serif",fontWeight:300}}>
                {darkMode ? "Fondo oscuro (activo)" : "Fondo claro (activo)"}
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"12px",flexShrink:0}}>
              <span style={{fontSize:"0.78rem",color:T.mode==="dark"?T.textXSoft:T.accent,fontFamily:"'Outfit',sans-serif",fontWeight:T.mode==="dark"?300:500,transition:"all 0.2s"}}>☀ Claro</span>
              <Toggle value={darkMode} onChange={setDarkMode} activeColor="#2169CC"/>
              <span style={{fontSize:"0.78rem",color:T.mode==="dark"?T.accent:T.textXSoft,fontFamily:"'Outfit',sans-serif",fontWeight:T.mode==="dark"?500:300,transition:"all 0.2s"}}>◗ Oscuro</span>
            </div>
          </div>

          {/* Visual preview */}
          <div style={{marginTop:"16px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
            <div onClick={()=>setDarkMode(false)} style={{cursor:"pointer",borderRadius:"10px",overflow:"hidden",border:`2px solid ${!T.mode==="dark"?T.accentMid:"transparent"}`,transition:"all 0.2s",boxShadow:!T.mode==="dark"?"0 0 0 3px rgba(33,105,204,0.18)":"none"}}>
              <div style={{background:"#F0F4FA",padding:"10px 12px",display:"flex",flexDirection:"column",gap:"5px"}}>
                <div style={{display:"flex",gap:"5px",marginBottom:"3px"}}>
                  <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#F87171"}}/>
                  <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#FBBF24"}}/>
                  <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#34D399"}}/>
                </div>
                <div style={{height:"5px",background:"rgba(24,83,168,0.15)",borderRadius:"3px",width:"60%"}}/>
                <div style={{height:"5px",background:"rgba(24,83,168,0.08)",borderRadius:"3px",width:"85%"}}/>
                <div style={{height:"5px",background:"rgba(24,83,168,0.08)",borderRadius:"3px",width:"70%"}}/>
              </div>
              <div style={{background:"#E6EDF7",padding:"5px 12px",fontSize:"0.65rem",color:"#4A6480",fontFamily:"'Outfit',sans-serif",textAlign:"center"}}>☀ Claro</div>
            </div>
            <div onClick={()=>setDarkMode(true)} style={{cursor:"pointer",borderRadius:"10px",overflow:"hidden",border:`2px solid ${T.mode==="dark"?T.accentMid:"transparent"}`,transition:"all 0.2s",boxShadow:T.mode==="dark"?"0 0 0 3px rgba(33,105,204,0.18)":"none"}}>
              <div style={{background:"#08111F",padding:"10px 12px",display:"flex",flexDirection:"column",gap:"5px"}}>
                <div style={{display:"flex",gap:"5px",marginBottom:"3px"}}>
                  <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#F87171"}}/>
                  <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#FBBF24"}}/>
                  <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#34D399"}}/>
                </div>
                <div style={{height:"5px",background:"rgba(90,180,240,0.25)",borderRadius:"3px",width:"60%"}}/>
                <div style={{height:"5px",background:"rgba(90,180,240,0.12)",borderRadius:"3px",width:"85%"}}/>
                <div style={{height:"5px",background:"rgba(90,180,240,0.12)",borderRadius:"3px",width:"70%"}}/>
              </div>
              <div style={{background:"#0D1E35",padding:"5px 12px",fontSize:"0.65rem",color:T.textSoft,fontFamily:"'Outfit',sans-serif",textAlign:"center"}}>◗ Oscuro</div>
            </div>
          </div>
        </div>
      </Card>

    </div>}


    {/* ═══ USERS ═══ */}
    {tab==="users"&&<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px",flexWrap:"wrap",gap:"8px"}}>
        <div style={{fontSize:"13px",color:T.textSoft}}>{users.length} usuarios · {users.filter(u=>u.active).length} activos</div>
        <button onClick={openAddUser} style={{padding:"7px 15px",background:"linear-gradient(135deg,#2169CC,#1853A8)",border:"none",color:T.text,borderRadius:"7px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"12px",fontWeight:600}}>+ Añadir usuario</button>
      </div>
      {showAddUser&&<Card style={{marginBottom:"14px",border:`1px solid ${T.borderMid}`}}>
        <SectionHeader title={editUser?"Editar usuario":"Nuevo usuario"}/>
        <div style={{padding:"14px 16px"}}>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:"10px",marginBottom:"12px"}}>
            {[["Nombre *","name","text"],["Apellido","lastName","text"],["Email *","email","email"],["Departamento","dept","text"]].map(([lbl,key,tp])=>(
              <div key={key}><label style={{display:"block",fontSize:"10px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",marginBottom:"4px",textTransform:"uppercase",letterSpacing:"0.05em"}}>{lbl}</label><input type={tp} value={userForm[key]} onChange={e=>setUserForm({...userForm,[key]:e.target.value})} style={{...inp,width:"100%"}}/></div>
            ))}
            <div><label style={{display:"block",fontSize:"10px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",marginBottom:"4px",textTransform:"uppercase",letterSpacing:"0.05em"}}>Rol</label><select value={userForm.role} onChange={e=>setUserForm({...userForm,role:e.target.value})} style={{...inp,width:"100%",cursor:"pointer"}}>{Object.keys(ROLE_CFG).map(r=><option key={r} value={r}>{r}</option>)}</select></div>
            <div><label style={{display:"block",fontSize:"10px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",marginBottom:"4px",textTransform:"uppercase",letterSpacing:"0.05em"}}>Mercado</label><select value={userForm.market} onChange={e=>setUserForm({...userForm,market:e.target.value})} style={{...inp,width:"100%",cursor:"pointer"}}>{markets.map(m=><option key={m.id} value={m.name}>{m.name}</option>)}</select></div>
            <div style={{gridColumn:isMobile?"":"1 / -1"}}><label style={{display:"block",fontSize:"10px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",marginBottom:"4px",textTransform:"uppercase",letterSpacing:"0.05em"}}>Manager directo</label><select value={userForm.manager||""} onChange={e=>setUserForm({...userForm,manager:e.target.value})} style={{...inp,width:"100%",cursor:"pointer"}}><option value="">Sin manager</option>{users.filter(u=>u.id!==(editUser?.id)).map(u=><option key={u.id} value={u.name}>{fullName(u)} ({u.role})</option>)}</select></div>
          </div>
          <div style={{display:"flex",gap:"8px",justifyContent:"flex-end"}}>
            <button onClick={()=>{setShowAddUser(false);setEditUser(null);}} style={{padding:"7px 14px",background:T.accentLight,border:`1px solid ${T.border}`,color:T.textSoft,borderRadius:"6px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"11px"}}>Cancelar</button>
            <button onClick={saveUser} style={{padding:"7px 14px",background:T.accent,border:"none",color:T.text,borderRadius:"6px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"11px",fontWeight:600}}>{editUser?"Guardar":"Crear usuario"}</button>
          </div>
        </div>
      </Card>}
      {isMobile?<div style={{display:"grid",gap:"8px"}}>{users.map(u=><Card key={u.id} style={{padding:"12px",opacity:u.active?1:0.6}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"7px"}}><div style={{width:"30px",height:"30px",borderRadius:"50%",background:"linear-gradient(135deg,#1853A8,#5AB4F0)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:700,color:T.text,flexShrink:0}}>{u.name[0]}</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:"13px",fontWeight:600,color:T.text}}>{fullName(u)}</div><div style={{fontSize:"11px",color:T.textSoft,fontFamily:"'Outfit',sans-serif"}}>{u.email}</div></div></div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"5px"}}><div style={{display:"flex",gap:"5px",alignItems:"center"}}><RoleBadge role={u.role}/><span style={{fontSize:"10px",color:T.textXSoft,fontFamily:"'Outfit',sans-serif"}}>{u.market}</span></div><div style={{display:"flex",gap:"5px"}}>
          <button onClick={()=>toggleActive(u.id)} style={{padding:"3px 7px",borderRadius:"4px",fontSize:"10px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:600,background:u.active?"rgba(52,211,153,0.08)":T.accentLight,border:`1px solid ${u.active?"rgba(52,211,153,0.3)":T.border}`,color:u.active?"#34D399":T.textSoft}}>{u.active?"✓":"○"}</button>
          <button onClick={()=>openEditUser(u)} style={{padding:"3px 7px",borderRadius:"4px",fontSize:"10px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",background:"rgba(90,180,240,0.10)",border:`1px solid ${T.borderMid}`,color:"#5AB4F0"}}>✎</button>
          <button onClick={()=>setConfirmDelete(u)} style={{padding:"3px 7px",borderRadius:"4px",fontSize:"10px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.25)",color:"#F87171"}}>✕</button>
        </div></div>
      </Card>)}</div>:(
      <Card style={{overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:`1px solid ${T.border}`,background:T.mode==="dark"?"rgba(90,180,240,0.04)":"rgba(24,83,168,0.03)"}}>{["Usuario","Email","Rol","Mercado","Dept","Manager","Estado","Acc."].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:"10px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",letterSpacing:"0.06em",textTransform:"uppercase",fontWeight:600,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
          <tbody>{users.map((u,i)=><tr key={u.id} style={{borderBottom:i<users.length-1?`1px solid ${T.border}`:"none",opacity:u.active?1:0.55}} onMouseEnter={e=>e.currentTarget.style.background=T.mode==="dark"?"rgba(90,180,240,0.04)":"rgba(24,83,168,0.04)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <td style={{padding:"10px 12px"}}><div style={{display:"flex",alignItems:"center",gap:"7px"}}><div style={{width:"26px",height:"26px",borderRadius:"50%",background:"linear-gradient(135deg,#1853A8,#5AB4F0)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",fontWeight:700,color:T.text,flexShrink:0}}>{u.name[0]}</div><span style={{fontSize:"12px",color:T.text,fontWeight:500,whiteSpace:"nowrap"}}>{fullName(u)}</span></div></td>
            <td style={{padding:"10px 12px"}}><span style={{fontSize:"11px",color:T.textSoft,fontFamily:"'Outfit',sans-serif"}}>{u.email}</span></td>
            <td style={{padding:"10px 12px"}}><RoleBadge role={u.role}/></td>
            <td style={{padding:"10px 12px"}}><span style={{fontSize:"11px",color:T.textSoft,fontFamily:"'Outfit',sans-serif"}}>{u.market||"—"}</span></td>
            <td style={{padding:"10px 12px"}}><span style={{fontSize:"12px",color:T.textMid}}>{u.dept||"—"}</span></td>
            <td style={{padding:"10px 12px"}}><span style={{fontSize:"11px",color:T.textSoft}}>{u.manager||"—"}</span></td>
            <td style={{padding:"10px 12px"}}><button onClick={()=>toggleActive(u.id)} style={{padding:"3px 8px",borderRadius:"4px",fontSize:"10px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:600,background:u.active?"rgba(52,211,153,0.08)":T.accentLight,border:`1px solid ${u.active?"rgba(52,211,153,0.3)":T.border}`,color:u.active?"#34D399":T.textSoft}}>{u.active?"Activo":"Inactivo"}</button></td>
            <td style={{padding:"10px 12px"}}><div style={{display:"flex",gap:"4px"}}><button onClick={()=>openEditUser(u)} style={{padding:"3px 8px",borderRadius:"4px",fontSize:"10px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",background:"rgba(90,180,240,0.10)",border:`1px solid ${T.borderMid}`,color:"#5AB4F0"}}>✎</button><button onClick={()=>setConfirmDelete(u)} style={{padding:"3px 8px",borderRadius:"4px",fontSize:"10px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.25)",color:"#F87171"}}>✕</button></div></td>
          </tr>)}</tbody>
        </table>
      </Card>)}
    </div>}

    {/* ═══ MARKETS ═══ */}
    {tab==="markets"&&<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px",flexWrap:"wrap",gap:"8px"}}>
        <div style={{fontSize:"13px",color:T.textSoft}}>{markets.length} mercados configurados</div>
        <button onClick={openAddMkt} style={{padding:"7px 15px",background:"linear-gradient(135deg,#2169CC,#1853A8)",border:"none",color:T.text,borderRadius:"7px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"12px",fontWeight:600}}>+ Nuevo mercado</button>
      </div>
      {showAddMkt&&<Card style={{marginBottom:"14px",border:`1px solid ${T.borderMid}`}}>
        <SectionHeader title={editMkt?"Editar mercado":"Nuevo mercado"}/>
        <div style={{padding:"14px 16px"}}>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:"10px",marginBottom:"12px"}}>
            <div><label style={{display:"block",fontSize:"10px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",marginBottom:"4px",textTransform:"uppercase",letterSpacing:"0.05em"}}>Nombre *</label><input value={mktForm.name} onChange={e=>setMktForm({...mktForm,name:e.target.value})} placeholder="Ej: EMEA, UK, LATAM…" style={{...inp,width:"100%"}}/></div>
            <div><label style={{display:"block",fontSize:"10px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",marginBottom:"4px",textTransform:"uppercase",letterSpacing:"0.05em"}}>Países / regiones</label><input value={mktForm.countries} onChange={e=>setMktForm({...mktForm,countries:e.target.value})} placeholder="Ej: España, Portugal" style={{...inp,width:"100%"}}/></div>
          </div>
          <div style={{display:"flex",gap:"8px",justifyContent:"flex-end"}}>
            <button onClick={()=>{setShowAddMkt(false);setEditMkt(null);}} style={{padding:"7px 14px",background:T.accentLight,border:`1px solid ${T.border}`,color:T.textSoft,borderRadius:"6px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"11px"}}>Cancelar</button>
            <button onClick={saveMkt} style={{padding:"7px 14px",background:T.accent,border:"none",color:T.text,borderRadius:"6px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"11px",fontWeight:600}}>{editMkt?"Guardar":"Crear mercado"}</button>
          </div>
        </div>
      </Card>}
      <div style={{display:"grid",gap:"10px"}}>
        {markets.map(m=><Card key={m.id} style={{overflow:"hidden",opacity:m.active?1:0.65}}>
          <div style={{padding:"14px 18px",display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"}}>
            <div style={{width:"38px",height:"38px",borderRadius:"9px",background:"linear-gradient(135deg,#2169CC,#1853A8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",flexShrink:0}}>🌍</div>
            <div style={{flex:1,minWidth:"120px"}}><div style={{fontSize:"15px",fontWeight:700,color:T.text,fontFamily:"'Outfit',sans-serif"}}>{m.name}</div><div style={{fontSize:"12px",color:T.textSoft,marginTop:"2px"}}>{m.countries||"Sin países definidos"}</div></div>
            <div style={{display:"flex",alignItems:"center",gap:"8px",flexShrink:0}}>
              <span style={{fontSize:"11px",color:T.textSoft,fontFamily:"'Outfit',sans-serif"}}>{users.filter(u=>u.market===m.name).length} usuarios</span>
              <button onClick={()=>openEditMkt(m)} style={{padding:"4px 10px",borderRadius:"5px",fontSize:"11px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",background:"rgba(90,180,240,0.10)",border:`1px solid ${T.borderMid}`,color:"#5AB4F0"}}>✎ Editar</button>
              <button onClick={()=>deleteMkt(m.id)} style={{padding:"4px 10px",borderRadius:"5px",fontSize:"11px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.25)",color:"#F87171"}}>✕</button>
            </div>
          </div>
        </Card>)}
        {markets.length===0&&<div style={{textAlign:"center",padding:"40px",color:T.textXSoft,fontFamily:"'Outfit',sans-serif",fontSize:"12px"}}>Sin mercados. Crea el primero.</div>}
      </div>
    </div>}

    {/* Market selector for workflow/form tabs */}
    {(tab==="workflow"||tab==="form")&&<div>
      <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"16px",padding:"10px 14px",background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"9px",flexWrap:"wrap"}}>
        <span style={{fontSize:"11px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase",flexShrink:0}}>Mercado:</span>
        <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>
          {markets.map(m=><button key={m.id} onClick={()=>setSelectedMktId(m.id)} style={{padding:"5px 13px",borderRadius:"6px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"12px",fontWeight:600,border:`1px solid ${selectedMktId===m.id?T.borderMid:T.border}`,background:selectedMktId===m.id?T.accentLight:T.bgSoft,color:selectedMktId===m.id?T.accent:T.textSoft}}>{m.name}</button>)}
        </div>
        {selMkt&&<span style={{fontSize:"11px",color:T.textXSoft,fontFamily:"'Outfit',sans-serif",marginLeft:"auto"}}>{selMkt.countries}</span>}
      </div>

      {/* ═══ WORKFLOW ═══ */}
      {tab==="workflow"&&selMkt&&<div>
        <Card style={{marginBottom:"14px"}}>
          <SectionHeader title={`Workflow — ${selMkt.name}`}/>
          <div style={{padding:"14px 16px"}}>
            <div style={{marginBottom:"12px",padding:"10px 12px",background:"rgba(201,168,76,0.08)",border:"1px solid rgba(201,168,76,0.28)",borderRadius:"7px",fontSize:"11px",color:"#92400E"}}>💡 Los cambios aplican a nuevas declaraciones de este mercado.</div>
            <div style={{display:"grid",gap:"9px"}}>
              {wfOpts.map(opt=><div key={opt.key} style={{display:"flex",alignItems:"center",gap:"12px",padding:"13px 14px",background:wf[opt.key]?"rgba(167,139,250,0.08)":T.bgSoft,border:`1px solid ${wf[opt.key]?"rgba(167,139,250,0.3)":T.border}`,borderRadius:"9px",transition:"all 0.2s"}}>
                <div style={{width:"32px",height:"32px",borderRadius:"8px",background:wf[opt.key]?opt.c:"rgba(90,180,240,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",color:wf[opt.key]?"white":T.textXSoft,flexShrink:0}}>{opt.icon}</div>
                <div style={{flex:1}}><div style={{fontSize:"13px",fontWeight:600,color:T.text}}>{opt.label}</div><div style={{fontSize:"11px",color:T.textSoft,marginTop:"2px"}}>{opt.desc}</div></div>
                <Toggle value={!!wf[opt.key]} onChange={v=>setWf({[opt.key]:v})}/>
              </div>)}
            </div>
          </div>
        </Card>
        <Card style={{marginBottom:"14px"}}>
          <SectionHeader title="Escalado"/>
          <div style={{padding:"14px 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"12px",padding:"13px 14px",background:wf.allowEscalation?"rgba(248,113,113,0.08)":T.bgSoft,border:`1px solid ${wf.allowEscalation?"rgba(248,113,113,0.3)":T.border}`,borderRadius:"9px",marginBottom:"12px"}}>
              <div style={{width:"32px",height:"32px",borderRadius:"8px",background:wf.allowEscalation?"#F87171":"rgba(90,180,240,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",color:wf.allowEscalation?"white":T.textXSoft,flexShrink:0}}>⚠</div>
              <div style={{flex:1}}><div style={{fontSize:"13px",fontWeight:600,color:T.text}}>Permitir escalado</div><div style={{fontSize:"11px",color:T.textSoft,marginTop:"2px"}}>Managers pueden escalar a un <b>Head de Legal</b>.</div></div>
              <Toggle value={!!wf.allowEscalation} onChange={v=>setWf({allowEscalation:v})}/>
            </div>
            {wf.allowEscalation&&<div>
              <label style={{display:"block",fontSize:"10px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.05em"}}>Head de Legal asignado</label>
              {legalUsers.length===0?<div style={{padding:"10px 12px",background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.25)",borderRadius:"7px",fontSize:"12px",color:"#F87171"}}>⚠ No hay usuarios con rol Head de Legal activos.</div>:(
                <select value={wf.escalationUserId||""} onChange={e=>setWf({escalationUserId:Number(e.target.value)})} style={{...inp,width:"100%",padding:"9px 12px",fontSize:"13px"}}><option value="">Selecciona…</option>{legalUsers.map(u=><option key={u.id} value={u.id}>{fullName(u)} — {u.dept}</option>)}</select>
              )}
            </div>}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Vista previa del flujo"/>
          <div style={{padding:"14px 16px",overflowX:"auto"}}>
            <div style={{display:"flex",alignItems:"center",minWidth:"fit-content"}}>
              {[{l:"Borrador",c:"#6D87A8"},...(wf.requireManagerReview?[{l:"Rev. Manager",c:"#C9A84C"}]:[]),...(wf.requireComplianceReview?[{l:"Rev. Compliance",c:"#1853A8"}]:[]),{l:"Completado",c:"#34D399"}].map((s,i,arr)=><div key={s.l} style={{display:"flex",alignItems:"center",flexShrink:0}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px"}}>
                  <div style={{width:"32px",height:"32px",borderRadius:"50%",background:s.c,display:"flex",alignItems:"center",justifyContent:"center",color:"#FFFFFF",fontSize:"11px",fontWeight:700,boxShadow:`0 2px 6px ${s.c}40`}}>{i+1}</div>
                  <span style={{fontSize:"9px",color:s.c,fontFamily:"'Outfit',sans-serif",whiteSpace:"nowrap",fontWeight:600}}>{s.l}</span>
                </div>
                {i<arr.length-1&&<div style={{width:"24px",height:"2px",background:`linear-gradient(90deg,${s.c},${arr[i+1].c})`,margin:"0 2px 13px",flexShrink:0}}/>}
              </div>)}
              {wf.allowEscalation&&<div style={{marginLeft:"10px",paddingLeft:"10px",borderLeft:"1px dashed rgba(90,180,240,0.12)",display:"flex",alignItems:"center",gap:"3px"}}>
                <span style={{fontSize:"9px",color:"#F87171",marginBottom:"12px"}}>↗</span>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",flexShrink:0}}><div style={{width:"32px",height:"32px",borderRadius:"50%",background:"#F87171",display:"flex",alignItems:"center",justifyContent:"center",color:"#FFFFFF",fontSize:"11px",boxShadow:"0 2px 6px #F8717140"}}>⚠</div><span style={{fontSize:"9px",color:"#F87171",fontFamily:"'Outfit',sans-serif",fontWeight:600}}>Escalado</span></div>
              </div>}
            </div>
          </div>
        </Card>
      </div>}

      {/* ═══ FORM ═══ */}
      {tab==="form"&&selMkt&&<div>
        <Card style={{marginBottom:"14px"}}>
          <SectionHeader title={`Texto introductorio — ${selMkt.name}`}/>
          <div style={{padding:"14px 16px"}}>
            <label style={{display:"block",fontSize:"10px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.05em"}}>Texto bajo "Nueva Declaración"</label>
            <textarea value={formMeta.subtitle} onChange={e=>setFormMeta({...formMeta,subtitle:e.target.value})} rows={3} style={{width:"100%",background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:"7px",padding:"8px 11px",fontSize:"13px",color:T.text,fontFamily:"'Outfit',sans-serif",outline:"none",resize:"vertical",boxSizing:"border-box",lineHeight:1.65}}/>
            <div style={{fontSize:"10px",color:T.textXSoft,marginTop:"4px",fontFamily:"'Outfit',sans-serif"}}>{formMeta.subtitle.length} caracteres</div>
          </div>
        </Card>
        <Card style={{marginBottom:"14px"}}>
          <SectionHeader title={`Campos — ${selMkt.name} (${fields.filter(f=>f.active).length} activos)`} right={<button onClick={()=>setFields([...fields,{id:`cf${Date.now()}`,label:"Nuevo campo",type:"short_text",required:false,active:true,options:[]}])} style={{padding:"4px 11px",background:"rgba(90,180,240,0.10)",border:`1px solid ${T.borderMid}`,color:"#5AB4F0",borderRadius:"5px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"11px",fontWeight:600}}>+ Campo</button>}/>
          <div style={{padding:"12px 14px"}}>
            <div style={{display:"grid",gap:"7px"}}>
              {fields.map((f,i)=><div key={f.id} style={{border:`1px solid ${f.active?T.border:"rgba(109,135,168,0.08)"}`,borderRadius:"9px",background:f.active?T.bgCard:T.bgSoft,opacity:f.active?1:0.6}}>
                <div style={{display:"flex",alignItems:"center",gap:"7px",padding:"10px 12px",flexWrap:"wrap"}}>
                  <div style={{display:"flex",flexDirection:"column",gap:"2px",flexShrink:0}}>
                    <button onClick={()=>moveField(i,-1)} disabled={i===0} style={{background:"none",border:"none",cursor:i===0?"default":"pointer",color:i===0?T.textXSoft:T.textSoft,fontSize:"8px",padding:"0",lineHeight:1}}>▲</button>
                    <button onClick={()=>moveField(i,1)} disabled={i===fields.length-1} style={{background:"none",border:"none",cursor:i===fields.length-1?"default":"pointer",color:i===fields.length-1?T.textXSoft:T.textSoft,fontSize:"8px",padding:"0",lineHeight:1}}>▼</button>
                  </div>
                  <div style={{flex:1,minWidth:"100px"}}>
                    {editingLabelId===f.id?<input autoFocus value={f.label} onChange={e=>setFields(fields.map(x=>x.id===f.id?{...x,label:e.target.value}:x))} onBlur={()=>setEditingLabelId(null)} onKeyDown={e=>e.key==="Enter"&&setEditingLabelId(null)} style={{...inp,width:"100%",fontSize:"12px",fontWeight:600}}/>:
                    <div style={{display:"flex",alignItems:"center",gap:"4px",cursor:"pointer"}} onClick={()=>setEditingLabelId(f.id)}><span style={{fontSize:"12px",fontWeight:600,color:T.text}}>{f.label}</span><span style={{fontSize:"10px",color:T.textXSoft}}>✎</span>{f.required&&<span style={{fontSize:"10px",color:"#F87171",fontWeight:700}}>*</span>}</div>}
                  </div>
                  <select value={f.type} onChange={e=>setFields(fields.map(x=>x.id===f.id?{...x,type:e.target.value}:x))} style={{...inp,cursor:"pointer",fontSize:"11px",padding:"4px 8px"}}>{FIELD_TYPES.map(t=><option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}</select>
                  <label style={{display:"flex",alignItems:"center",gap:"3px",cursor:"pointer",fontSize:"11px",color:T.textSoft,fontFamily:"'Outfit',sans-serif",flexShrink:0}}><input type="checkbox" checked={f.required} onChange={()=>setFields(fields.map(x=>x.id===f.id?{...x,required:!x.required}:x))} style={{cursor:"pointer"}}/> req.</label>
                  <Toggle value={f.active} onChange={()=>setFields(fields.map(x=>x.id===f.id?{...x,active:!x.active}:x))}/>
                  {(f.type==="select"||f.type==="multiselect")&&<button onClick={()=>setEditFieldId(editFieldId===f.id?null:f.id)} style={{padding:"3px 7px",background:editFieldId===f.id?"rgba(90,180,240,0.10)":T.bgSoft,border:`1px solid ${editFieldId===f.id?"rgba(90,180,240,0.25)":T.border}`,color:editFieldId===f.id?T.accent:T.textSoft,borderRadius:"4px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"10px",flexShrink:0}}>Opc. {editFieldId===f.id?"▲":"▼"}</button>}
                  <button onClick={()=>setConfirmDeleteField(f)} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(248,113,113,0.3)",fontSize:"15px",padding:"1px",flexShrink:0}}>×</button>
                </div>
                {editFieldId===f.id&&(f.type==="select"||f.type==="multiselect")&&<div style={{padding:"10px 12px",borderTop:`1px solid ${T.border}`,background:T.bgSoft}}>
                  <div style={{display:"flex",gap:"6px",marginBottom:"8px"}}>
                    <input value={newOpt} onChange={e=>setNewOpt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addOpt(f.id)} placeholder="Nueva opción…" style={{flex:1,background:T.tableHead,border:`1px solid ${T.border}`,borderRadius:"5px",padding:"5px 9px",fontSize:"12px",color:T.text,fontFamily:"'Outfit',sans-serif",outline:"none"}}/>
                    <button onClick={()=>addOpt(f.id)} style={{padding:"5px 10px",background:T.accent,border:"none",color:T.text,borderRadius:"5px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:"11px",fontWeight:600}}>+</button>
                  </div>
                  <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>
                    {f.options.map(opt=><div key={opt} style={{display:"flex",alignItems:"center",gap:"3px",background:T.tableHead,border:`1px solid ${T.border}`,borderRadius:"4px",padding:"2px 7px"}}><span style={{fontSize:"11px",color:T.textMid}}>{opt}</span><button onClick={()=>removeOpt(f.id,opt)} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(248,113,113,0.3)",fontSize:"12px",padding:"0",lineHeight:1}}>×</button></div>)}
                    {f.options.length===0&&<span style={{fontSize:"11px",color:T.textXSoft,fontFamily:"'Outfit',sans-serif"}}>Sin opciones</span>}
                  </div>
                </div>}
              </div>)}
            </div>
          </div>
        </Card>
        <Card>
          <SectionHeader title="Vista previa del formulario"/>
          <div style={{padding:"14px 16px"}}>
            <div style={{fontSize:"1.1rem",fontWeight:600,color:T.text,fontFamily:"'Cormorant Garamond',serif",marginBottom:"3px",letterSpacing:"-0.01em"}}>Nueva Declaración</div>
            <div style={{fontSize:"12px",color:T.textSoft,marginBottom:"12px",lineHeight:1.6}}>{formMeta.subtitle}</div>
            <div style={{display:"grid",gap:"7px"}}>
              {fields.filter(f=>f.active).map(f=>{const td=FIELD_TYPES.find(t=>t.value===f.type)||FIELD_TYPES[0];return <div key={f.id} style={{display:"flex",alignItems:"center",gap:"8px",padding:"7px 10px",background:T.accentLight,borderRadius:"6px",border:`1px solid ${T.border}`}}><span style={{background:"rgba(90,180,240,0.10)",border:`1px solid ${T.borderMid}`,borderRadius:"3px",padding:"1px 5px",fontSize:"10px",color:"#5AB4F0",fontFamily:"'Outfit',sans-serif",flexShrink:0}}>{td.icon}</span><span style={{fontSize:"12px",fontWeight:600,color:T.text,flex:1}}>{f.label}</span>{f.required&&<span style={{fontSize:"10px",color:"#F87171",fontFamily:"'Outfit',sans-serif"}}>req.</span>}<span style={{fontSize:"10px",color:T.textXSoft,fontFamily:"'Outfit',sans-serif"}}>{td.label}</span></div>;})}
            </div>
          </div>
        </Card>
      </div>}
    </div>}
  </div>;
}

// ══════════════════════════════════════════════════════════════════
// ROLE SWITCHER
// ══════════════════════════════════════════════════════════════════
function RoleSwitcher({current,onChange,allUsers}) {
  const [open,setOpen]=useState(false);
  return <div style={{position:"fixed",bottom:"16px",right:"16px",zIndex:200}}>
    {open&&<>
      <div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,zIndex:198}}/>
      <div style={{position:"absolute",bottom:"48px",right:0,background:T.bgCardSolid,border:`1px solid ${T.borderMid}`,borderRadius:"12px",padding:"12px",boxShadow:T.mode==="dark"?"0 16px 48px rgba(0,0,0,0.6)":"0 8px 32px rgba(24,83,168,0.15)",minWidth:"230px",zIndex:199,maxHeight:"420px",overflowY:"auto"}}>
        <div style={{fontSize:"9px",color:T.textXSoft,fontFamily:"'DM Mono',monospace",marginBottom:"10px",letterSpacing:"0.12em",textTransform:"uppercase",paddingBottom:"8px",borderBottom:`1px solid ${T.border}`}}>Simular usuario</div>
        {allUsers.map(u=><button key={u.id} onClick={()=>{onChange(u);setOpen(false);}} style={{width:"100%",display:"flex",alignItems:"center",gap:"8px",padding:"7px 8px",borderRadius:"7px",cursor:"pointer",border:current.id===u.id?`1px solid rgba(90,180,240,0.3)`:"1px solid transparent",background:current.id===u.id?T.accentLight:"transparent",marginBottom:"1px",textAlign:"left"}}>
          <div style={{width:"24px",height:"24px",borderRadius:"50%",background:"linear-gradient(135deg,#1853A8,#2169CC)",border:"1px solid rgba(90,180,240,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",fontWeight:600,color:"#EEF4FB",flexShrink:0}}>{u.name[0]}</div>
          <div style={{flex:1,minWidth:0}}><div style={{fontSize:"12px",fontWeight:current.id===u.id?500:400,color:current.id===u.id?T.accent:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontFamily:"'Outfit',sans-serif"}}>{fullName(u)}</div><div style={{fontSize:"10px",color:T.textSoft,fontFamily:"'DM Mono',monospace"}}>{u.role}</div></div>
          {current.id===u.id&&<span style={{fontSize:"10px",color:"#5AB4F0",flexShrink:0}}>✓</span>}
        </button>)}
      </div>
    </>}
    <button onClick={()=>setOpen(!open)} style={{width:"38px",height:"38px",borderRadius:"50%",background:"linear-gradient(135deg,#1853A8,#2169CC)",border:"1px solid rgba(90,180,240,0.3)",color:T.text,cursor:"pointer",fontSize:"15px",boxShadow:"0 4px 16px rgba(21,83,168,0.5)",display:"flex",alignItems:"center",justifyContent:"center"}} title="Cambiar usuario">👤</button>
  </div>;
}

// ══════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ══════════════════════════════════════════════════════════════════
const VALID_PASSWORD = "jhmr1234";

function LoginPage({onLogin}) {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [showPass,setShowPass]=useState(false);
  const [loading,setLoading]=useState(false);

  // Use light theme for login always
  const LT = LIGHT_THEME;

  const handleSubmit = () => {
    setError("");
    if(!email||!password){setError("Por favor, introduce tu email y contraseña.");return;}
    const user = ALL_USERS_INIT.find(u=>u.email.toLowerCase()===email.trim().toLowerCase());
    if(!user){setError("Email no encontrado. Usa el formato nombre@conflictguard.com");return;}
    if(password!==VALID_PASSWORD){setError("Contraseña incorrecta.");return;}
    setLoading(true);
    setTimeout(()=>{setLoading(false);onLogin(user);},600);
  };

  const handleKey = e => { if(e.key==="Enter") handleSubmit(); };

  return <div style={{minHeight:"100vh",width:"100vw",background:`linear-gradient(160deg,${LT.bg} 0%,${LT.bgSoft} 100%)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif",padding:"16px"}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0;}html,body,#root{height:100%;width:100%;}button{transition:opacity 0.12s,transform 0.12s;}button:hover:not(:disabled){opacity:0.88;}button:active{opacity:0.72;}`}</style>
    <div style={{width:"100%",maxWidth:"420px",animation:"fadeInUp 0.35s ease"}}>
      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Logo + Brand */}
      <div style={{textAlign:"center",marginBottom:"32px"}}>
        <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"60px",height:"60px",borderRadius:"16px",background:"linear-gradient(135deg,#1853A8,#2169CC)",boxShadow:"0 8px 32px rgba(24,83,168,0.28)",marginBottom:"16px"}}>
          <Logo size={36}/>
        </div>
        <div style={{fontSize:"2rem",fontWeight:700,color:"#0D1E35",fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.02em",lineHeight:1}}>
          Conflict<span style={{color:"#1853A8"}}>Guard</span>
        </div>
        <div style={{fontSize:"0.62rem",color:"#4A6480",letterSpacing:"0.22em",textTransform:"uppercase",fontFamily:"'Outfit',sans-serif",fontWeight:400,marginTop:"4px"}}>by BlueGuard Solutions</div>
      </div>

      {/* Card */}
      <div style={{background:"rgba(255,255,255,0.95)",borderRadius:"16px",boxShadow:"0 8px 40px rgba(24,83,168,0.12)",border:"1px solid rgba(24,83,168,0.10)",padding:"32px",backdropFilter:"blur(16px)"}}>
        <div style={{marginBottom:"24px"}}>
          <div style={{fontSize:"1.1rem",fontWeight:600,color:"#0D1E35",fontFamily:"'Cormorant Garamond',serif",marginBottom:"4px"}}>Iniciar sesión</div>
          <div style={{fontSize:"0.78rem",color:"#4A6480",fontFamily:"'Outfit',sans-serif",fontWeight:300}}>Accede con tu cuenta corporativa</div>
        </div>

        {/* Email */}
        <div style={{marginBottom:"14px"}}>
          <label style={{fontSize:"0.72rem",color:"#4A6480",fontFamily:"'Outfit',sans-serif",letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:"6px",fontWeight:500}}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e=>{setEmail(e.target.value);setError("");}}
            onKeyDown={handleKey}
            placeholder="nombre@conflictguard.com"
            style={{width:"100%",padding:"11px 14px",background:"rgba(240,244,250,0.8)",border:`1.5px solid ${error&&!email?"rgba(220,38,38,0.4)":"rgba(24,83,168,0.15)"}`,borderRadius:"9px",fontSize:"0.875rem",color:"#0D1E35",fontFamily:"'Outfit',sans-serif",outline:"none",transition:"border-color 0.15s"}}
            onFocus={e=>e.target.style.borderColor="rgba(24,83,168,0.45)"}
            onBlur={e=>e.target.style.borderColor="rgba(24,83,168,0.15)"}
          />
        </div>

        {/* Password */}
        <div style={{marginBottom:"20px"}}>
          <label style={{fontSize:"0.72rem",color:"#4A6480",fontFamily:"'Outfit',sans-serif",letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:"6px",fontWeight:500}}>Contraseña</label>
          <div style={{position:"relative"}}>
            <input
              type={showPass?"text":"password"}
              value={password}
              onChange={e=>{setPassword(e.target.value);setError("");}}
              onKeyDown={handleKey}
              placeholder="••••••••"
              style={{width:"100%",padding:"11px 42px 11px 14px",background:"rgba(240,244,250,0.8)",border:`1.5px solid ${error&&!password?"rgba(220,38,38,0.4)":"rgba(24,83,168,0.15)"}`,borderRadius:"9px",fontSize:"0.875rem",color:"#0D1E35",fontFamily:"'Outfit',sans-serif",outline:"none",transition:"border-color 0.15s"}}
              onFocus={e=>e.target.style.borderColor="rgba(24,83,168,0.45)"}
              onBlur={e=>e.target.style.borderColor="rgba(24,83,168,0.15)"}
            />
            <button onClick={()=>setShowPass(!showPass)} style={{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#4A6480",fontSize:"14px",padding:"2px",lineHeight:1}}>{showPass?"🙈":"👁"}</button>
          </div>
        </div>

        {/* Error */}
        {error&&<div style={{background:"rgba(220,38,38,0.07)",border:"1px solid rgba(220,38,38,0.20)",borderRadius:"8px",padding:"10px 14px",fontSize:"0.8rem",color:"#DC2626",fontFamily:"'Outfit',sans-serif",marginBottom:"16px"}}>{error}</div>}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{width:"100%",padding:"12px",background:loading?"rgba(24,83,168,0.6)":"linear-gradient(135deg,#1853A8,#2169CC)",border:"none",borderRadius:"9px",color:"#fff",fontSize:"0.9rem",fontWeight:600,fontFamily:"'Outfit',sans-serif",cursor:loading?"wait":"pointer",letterSpacing:"0.03em",boxShadow:"0 4px 16px rgba(24,83,168,0.3)",transition:"all 0.2s"}}
        >
          {loading?"Verificando...":"Entrar"}
        </button>

        {/* Hint */}
        <div style={{marginTop:"18px",padding:"12px 14px",background:"rgba(24,83,168,0.04)",borderRadius:"8px",border:"1px solid rgba(24,83,168,0.08)"}}>
          <div style={{fontSize:"0.68rem",color:"#4A6480",fontFamily:"'DM Mono',monospace",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:"6px"}}>Cuentas disponibles</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
            {ALL_USERS_INIT.map(u=><button key={u.id} onClick={()=>{setEmail(u.email);setError("");}} style={{background:"rgba(24,83,168,0.07)",border:"1px solid rgba(24,83,168,0.12)",borderRadius:"5px",padding:"3px 8px",fontSize:"0.7rem",color:"#1853A8",fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>{u.email.split("@")[0]}</button>)}
          </div>
        </div>
      </div>
    </div>
  </div>;
}


export default function App() {
  const [loggedIn,setLoggedIn]=useState(false);
  const [page,setPage]=useState("new");
  const [currentUser,setCurrentUser]=useState(ALL_USERS_INIT[0]);
  const [declarations,setDeclarations]=useState(INIT_DECLARATIONS);
  const [users,setUsers]=useState(ALL_USERS_INIT);
  const [auditLogs,setAuditLogs]=useState(INIT_AUDIT);
  const [selected,setSelected]=useState(null);
  const [markets,setMarkets]=useState(INIT_MARKETS);
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const [isMobile,setIsMobile]=useState(typeof window!=="undefined"&&window.innerWidth<768);
  const [darkMode,setDarkMode]=useState(false);
  const [companyName,setCompanyName]=useState("BlueGuard Solutions");

  // Keep global T in sync — components read T at render time
  T = darkMode ? DARK_THEME : LIGHT_THEME;

  useEffect(()=>{
    const onResize=()=>setIsMobile(window.innerWidth<768);
    window.addEventListener("resize",onResize);
    return()=>window.removeEventListener("resize",onResize);
  },[]);

  useEffect(()=>{
    const allowed=ROLE_NAV[currentUser.role]||[];
    if(!allowed.includes(page)&&page!=="detail") setPage(allowed[0]||"declarations");
  },[currentUser]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    const allowed=ROLE_NAV[user.role]||[];
    setPage(allowed[0]||"declarations");
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setCurrentUser(ALL_USERS_INIT[0]);
    setPage("new");
    setSelected(null);
  };

  if(!loggedIn) return <LoginPage onLogin={handleLogin}/>;

  const isAdmin=currentUser.role==="Administrador Empresa";
  const nav=p=>{setSelected(null);setPage(p);setSidebarOpen(false);};
  const handleView=d=>{setSelected(d);setPage("detail");};
  const handleUpdate=(updated,recipient)=>{
    setDeclarations(prev=>prev.map(d=>d.id===updated.id?updated:d));
    const detail=recipient?`→ ${updated.status} → ${recipient}`:`→ ${updated.status}`;
    setAuditLogs(prev=>[...prev,{id:prev.length+1,action:"Estado actualizado",user:fullName(currentUser),target:updated.id,date:new Date().toISOString(),detail,market:updated.market||"—"}]);
  };
  const handleSubmit=(d,mode)=>{
    setDeclarations(prev=>{const e=prev.find(x=>x.id===d.id);return e?prev.map(x=>x.id===d.id?d:x):[...prev,d];});
    if(mode==="send"){
      const mktCfg=markets.find(m=>m.name===d.market)||markets[0];
      const wf=mktCfg.workflow;
      let sentTo="";
      if(wf.requireManagerReview){const mgr=users.find(u=>u.name===currentUser.manager);sentTo=mgr?` → ${mgr.name}`:"";} 
      else if(wf.requireComplianceReview){const comp=users.find(u=>u.role==="Compliance Manager"&&u.active);sentTo=comp?` → ${comp.name}`:"";}
      setAuditLogs(prev=>[...prev,{id:prev.length+1,action:"Declaración enviada",user:fullName(currentUser),target:d.id,date:new Date().toISOString(),detail:`Draft → ${d.status}${sentTo}`,market:d.market||"—"}]);
    } else setAuditLogs(prev=>[...prev,{id:prev.length+1,action:"Borrador guardado",user:fullName(currentUser),target:d.id,date:new Date().toISOString(),detail:"Estado: Draft",market:d.market||"—"}]);
    nav("declarations");
  };

  const activePage=page==="detail"?"declarations":page;

  const renderContent=()=>{
    if(page==="detail"&&selected) return <DeclarationDetail declaration={selected} currentUser={currentUser} markets={markets} allUsers={users} onBack={()=>nav("declarations")} onUpdate={handleUpdate} isMobile={isMobile}/>;
    switch(page){
      case "dashboard":    return <Dashboard declarations={declarations} onNav={nav} currentUser={currentUser} allUsers={users} isMobile={isMobile}/>;
      case "declarations": return <DeclarationsList declarations={declarations} currentUser={currentUser} allUsers={users} onView={handleView} isMobile={isMobile} viewOnly={isAdmin}/>;
      case "new":          return <NewDeclarationForm currentUser={currentUser} markets={markets} onSubmit={handleSubmit} isMobile={isMobile}/>;
      case "audit":        return <AuditLog auditLogs={auditLogs} isMobile={isMobile}/>;
      case "admin":        return <AdminPanel markets={markets} setMarkets={setMarkets} users={users} setUsers={setUsers} isMobile={isMobile} darkMode={darkMode} setDarkMode={setDarkMode} companyName={companyName} setCompanyName={setCompanyName}/>;
      default: return null;
    }
  };

  return <div style={{display:"flex",flexDirection:"column",height:"100vh",width:"100vw",background:T.bg,fontFamily:"'Outfit',sans-serif",overflow:"hidden",transition:"background 0.3s"}}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      html,body,#root{height:100%;width:100%;overflow:hidden;}
      ${T.mode==="dark"?`body::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:9999;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");opacity:.45;}`:`body::after{display:none;}`}
      select option{background:${T.selectBg};color:${T.selectColor};}
      ::-webkit-scrollbar{width:4px;}
      ::-webkit-scrollbar-track{background:${T.scrollTrack};}
      ::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:3px;}
      input::placeholder,textarea::placeholder{color:${T.textXSoft};}
      button{transition:opacity 0.12s,transform 0.12s;}
      button:hover:not(:disabled){opacity:0.88;}
      button:active{opacity:0.72;}
      @keyframes fadeIn{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}
      @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    `}</style>
    {isMobile&&<TopBar onMenuOpen={()=>setSidebarOpen(true)} currentUser={currentUser} companyName={companyName}/>}
    <div style={{display:"flex",flex:1,overflow:"hidden",minHeight:0}}>
      <Sidebar active={activePage} onNav={nav} currentUser={currentUser} isOpen={sidebarOpen} onClose={()=>setSidebarOpen(false)} isMobile={isMobile} companyName={companyName} markets={markets} onLogout={handleLogout}/>
      <main style={{flex:1,padding:isMobile?"14px 14px 80px":"24px 32px 40px",overflowY:"auto",background:T.bg,minWidth:0,backgroundImage:T.mainRadial,transition:"background 0.3s"}}>
        {renderContent()}
      </main>
    </div>
    {isAdmin&&<RoleSwitcher current={currentUser} onChange={u=>{setCurrentUser(u);}} allUsers={users}/>}
  </div>;
}
