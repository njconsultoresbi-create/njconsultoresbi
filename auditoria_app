import { useState, useRef, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";

// ════════════════════════════════════════════════════════
// THEME
// ════════════════════════════════════════════════════════
const B = '#003087', O = '#F7941D', GR = '#16a34a', RD = '#dc2626', YL = '#eab308';
const card = { background:'#fff', borderRadius:14, padding:16, boxShadow:'0 2px 8px rgba(0,48,135,0.1)', marginBottom:12 };
const btn = (bg, color='#fff', extra={}) => ({ background:bg, color, border:'none', borderRadius:10, padding:'11px 18px', fontWeight:700, cursor:'pointer', fontSize:14, ...extra });
const SECS = ['FRENTE SUCURSAL','PISO DE VENTA','EXHIBICIÓN','ÁREA DE FARMACIA','ATRÁS DE FARMACIA','PERSONAL DE SUCURSAL','CALIDAD EN EL SERVICIO','CONTROL Y ORGANIZACIÓN','CONOCIMIENTO Y CAPACITACIÓN','ACONDICIONAMIENTO'];
const SEC_ICONS = {'FRENTE SUCURSAL':'🏪','PISO DE VENTA':'🛒','EXHIBICIÓN':'📦','ÁREA DE FARMACIA':'💊','ATRÁS DE FARMACIA':'🔙','PERSONAL DE SUCURSAL':'👔','CALIDAD EN EL SERVICIO':'⭐','CONTROL Y ORGANIZACIÓN':'📋','CONOCIMIENTO Y CAPACITACIÓN':'📚','ACONDICIONAMIENTO':'🔧'};

// ════════════════════════════════════════════════════════
// REACTIVOS (112)
// ════════════════════════════════════════════════════════
const RX = [
  {id:'R-001',s:'FRENTE SUCURSAL',t:'Cortinas / rejas limpias',r:'MANTENIMIENTO'},
  {id:'R-002',s:'FRENTE SUCURSAL',t:'Toldos limpios y en buen estado',r:'MANTENIMIENTO'},
  {id:'R-003',s:'FRENTE SUCURSAL',t:'Paredes externas limpias y con pintura en buen estado',r:'MANTENIMIENTO'},
  {id:'R-004',s:'FRENTE SUCURSAL',t:'Luces y lámparas de calle funcionales',r:'MANTENIMIENTO'},
  {id:'R-005',s:'FRENTE SUCURSAL',t:'Anuncios luminosos funcionales (marquesinas, reflectores)',r:'MANTENIMIENTO'},
  {id:'R-006',s:'FRENTE SUCURSAL',t:'Banquetas limpias',r:'OPERACIONES'},
  {id:'R-007',s:'FRENTE SUCURSAL',t:'Carteles de canceles vigentes y en buen estado',r:'MERCADOTECNIA'},
  {id:'R-008',s:'FRENTE SUCURSAL',t:'Carteles que estorban y/o ajenos a la empresa',r:'MERCADOTECNIA'},
  {id:'R-009',s:'FRENTE SUCURSAL',t:'Canceles en buen estado y con vidrios limpios',r:'OPERACIONES'},
  {id:'R-010',s:'FRENTE SUCURSAL',t:'Ventanilla cierra correctamente',r:'MANTENIMIENTO'},
  {id:'R-011',s:'FRENTE SUCURSAL',t:'Accesos (escalones y rampas) en buen estado',r:'MANTENIMIENTO'},
  {id:'R-012',s:'FRENTE SUCURSAL',t:'Señalamiento de protección civil en piso',r:'MANTENIMIENTO'},
  {id:'R-013',s:'FRENTE SUCURSAL',t:'Cajones de estacionamiento con delimitaciones visibles',r:'MANTENIMIENTO'},
  {id:'R-014',s:'FRENTE SUCURSAL',t:'Cuenta con micrófono para atender por ventanilla',r:'TI'},
  {id:'R-015',s:'PISO DE VENTA',t:'Piso de venta limpio',r:'OPERACIONES'},
  {id:'R-016',s:'PISO DE VENTA',t:'Mostradores limpios y llenos',r:'OPERACIONES'},
  {id:'R-017',s:'PISO DE VENTA',t:'Apagadores y contactos funcionales y en buenas condiciones',r:'MANTENIMIENTO'},
  {id:'R-018',s:'PISO DE VENTA',t:'Lámparas y cajas de luz en piso de venta limpias y funcionales',r:'MANTENIMIENTO'},
  {id:'R-019',s:'PISO DE VENTA',t:'Ventiladores en piso de venta limpios y funcionales',r:'MANTENIMIENTO'},
  {id:'R-020',s:'PISO DE VENTA',t:'Producto frenteado y sin huecos',r:'OPERACIONES'},
  {id:'R-021',s:'PISO DE VENTA',t:'Cuentan con planograma impreso y coincide con acomodo',r:'MERCADOTECNIA'},
  {id:'R-022',s:'PISO DE VENTA',t:'Sensor en puerta de acceso instalado y funcionando',r:'MANTENIMIENTO'},
  {id:'R-023',s:'PISO DE VENTA',t:'Clima limpio y funcionando correctamente',r:'MANTENIMIENTO'},
  {id:'R-024',s:'PISO DE VENTA',t:'Cortina de aire limpia y funcionando correctamente',r:'MANTENIMIENTO'},
  {id:'R-025',s:'PISO DE VENTA',t:'Publicidad vigente en parte externa de punto de venta',r:'MERCADOTECNIA'},
  {id:'R-026',s:'EXHIBICIÓN',t:'PEPS / PCPS en toda el área de exhibición',r:'OPERACIONES'},
  {id:'R-027',s:'EXHIBICIÓN',t:'Refrigerador de bebidas lleno, acomodado, frenteado',r:'OPERACIONES'},
  {id:'R-028',s:'EXHIBICIÓN',t:'Refrigerador de bebidas funcional, enfriando correctamente',r:'COMERCIALIZACIÓN'},
  {id:'R-029',s:'EXHIBICIÓN',t:'Refrigerador de bebidas con portacandado y candado',r:'MANTENIMIENTO'},
  {id:'R-030',s:'EXHIBICIÓN',t:'Refrigerador de helados lleno y acomodado',r:'OPERACIONES'},
  {id:'R-031',s:'EXHIBICIÓN',t:'Refrigerador de helados limpio y sin escarcha',r:'COMERCIALIZACIÓN'},
  {id:'R-032',s:'EXHIBICIÓN',t:'Rack de snacks lleno, acomodado y sin polvo',r:'OPERACIONES'},
  {id:'R-033',s:'EXHIBICIÓN',t:'Puertas de acceso a la dispensación funcionales y rotuladas',r:'MANTENIMIENTO'},
  {id:'R-034',s:'EXHIBICIÓN',t:'Gondolas y botaderos limpios, llenos y acomodados',r:'OPERACIONES'},
  {id:'R-035',s:'EXHIBICIÓN',t:'Vitrinas limpias, llenas, con puertas y chapas funcionales',r:'OPERACIONES'},
  {id:'R-036',s:'EXHIBICIÓN',t:'Pantallas de TV y letrero LED con publicidad vigente',r:'MERCADOTECNIA'},
  {id:'R-037',s:'EXHIBICIÓN',t:'Regletas en góndolas pegadas correctamente',r:'MERCADOTECNIA'},
  {id:'R-038',s:'EXHIBICIÓN',t:'Precios en regletas de góndolas actualizados',r:'OPERACIONES'},
  {id:'R-039',s:'ÁREA DE FARMACIA',t:'Acomodo general aplicando PEPS / PCPS en área de farmacia',r:'OPERACIONES'},
  {id:'R-040',s:'ÁREA DE FARMACIA',t:'Acomodo en cajoneras por abecedario y aplicando "Z"',r:'OPERACIONES'},
  {id:'R-041',s:'ÁREA DE FARMACIA',t:'No se encontraron productos en el piso, cuentan con tarimas',r:'OPERACIONES'},
  {id:'R-042',s:'ÁREA DE FARMACIA',t:'Área de comunicados',r:'OPERACIONES'},
  {id:'R-043',s:'ÁREA DE FARMACIA',t:'Controlados',r:'OPERACIONES'},
  {id:'R-044',s:'ÁREA DE FARMACIA',t:'Punto de venta limpio, en orden con tapete ergonómico',r:'OPERACIONES'},
  {id:'R-045',s:'ÁREA DE FARMACIA',t:'Cuadros de registros oficiales',r:'OPERACIONES'},
  {id:'R-046',s:'ÁREA DE FARMACIA',t:'Refrigerador de medicamentos',r:'OPERACIONES'},
  {id:'R-047',s:'ÁREA DE FARMACIA',t:'Registro de temperatura y humedad en bitácora',r:'OPERACIONES'},
  {id:'R-048',s:'ÁREA DE FARMACIA',t:'Identificación de áreas (señalética naranja y cabeceras)',r:'MERCADOTECNIA'},
  {id:'R-049',s:'ÁREA DE FARMACIA',t:'Registro de proveedores en bitácora',r:'OPERACIONES'},
  {id:'R-050',s:'ÁREA DE FARMACIA',t:'Registro de limpieza de refrigerador en bitácora',r:'OPERACIONES'},
  {id:'R-051',s:'ÁREA DE FARMACIA',t:'Separadores funcionales para jaraberas y cajoneras',r:'MERCADOTECNIA'},
  {id:'R-052',s:'ÁREA DE FARMACIA',t:'Viniles publicitarios en jaraberas con publicidad vigente',r:'MERCADOTECNIA'},
  {id:'R-053',s:'ÁREA DE FARMACIA',t:'Repisas con regletas indicadoras de padecimiento',r:'MERCADOTECNIA'},
  {id:'R-054',s:'ÁREA DE FARMACIA',t:'Repisas en buen estado y funcionales',r:'MANTENIMIENTO'},
  {id:'R-055',s:'ÁREA DE FARMACIA',t:'Exhibipanel en buen estado y funcional',r:'MANTENIMIENTO'},
  {id:'R-056',s:'ÁREA DE FARMACIA',t:'Muebles de punto de venta en buen estado',r:'MANTENIMIENTO'},
  {id:'R-057',s:'ÁREA DE FARMACIA',t:'Puertas de mostradores en buen estado, funcionales y con manijas',r:'MANTENIMIENTO'},
  {id:'R-058',s:'ÁREA DE FARMACIA',t:'Cajas de cobro de punto de venta funcionales y con llave',r:'TI'},
  {id:'R-059',s:'ÁREA DE FARMACIA',t:'Anaqueles en buen estado y funcionales',r:'MANTENIMIENTO'},
  {id:'R-060',s:'ATRÁS DE FARMACIA',t:'Área bodega limpia y en orden',r:'OPERACIONES'},
  {id:'R-061',s:'ATRÁS DE FARMACIA',t:'Baños limpios y funcionales',r:'OPERACIONES'},
  {id:'R-062',s:'ATRÁS DE FARMACIA',t:'Baño con dispensadores de jabón, papel higiénico y toallas',r:'OPERACIONES'},
  {id:'R-063',s:'ATRÁS DE FARMACIA',t:'Baño con tapa en cesto y en inodoro',r:'OPERACIONES'},
  {id:'R-064',s:'ATRÁS DE FARMACIA',t:'Objetos ajenos a la farmacia',r:'OPERACIONES'},
  {id:'R-065',s:'ATRÁS DE FARMACIA',t:'Pisos limpios, sin merma de plástico ni cartón',r:'OPERACIONES'},
  {id:'R-066',s:'ATRÁS DE FARMACIA',t:'Área de alimentos limpia (mesa, silla, horno, piso)',r:'OPERACIONES'},
  {id:'R-067',s:'ATRÁS DE FARMACIA',t:'Anaqueles en buen estado y funcionales',r:'MANTENIMIENTO'},
  {id:'R-068',s:'ATRÁS DE FARMACIA',t:'Paredes / techos con humedad, goteras o huecos',r:'MANTENIMIENTO'},
  {id:'R-069',s:'ATRÁS DE FARMACIA',t:'Pisos, escaleras, barandales o pilares con óxido',r:'MANTENIMIENTO'},
  {id:'R-070',s:'ATRÁS DE FARMACIA',t:'Escalones funcionales, con barandal y cintas antiderrapantes',r:'MANTENIMIENTO'},
  {id:'R-071',s:'ATRÁS DE FARMACIA',t:'Extractores de aire limpios y funcionales',r:'MANTENIMIENTO'},
  {id:'R-072',s:'ATRÁS DE FARMACIA',t:'Cuentan con mesa para recepción de mercancía',r:'OPERACIONES'},
  {id:'R-073',s:'ATRÁS DE FARMACIA',t:'Olor a drenaje',r:'MANTENIMIENTO'},
  {id:'R-074',s:'PERSONAL DE SUCURSAL',t:'Bata',r:'OPERACIONES'},
  {id:'R-075',s:'PERSONAL DE SUCURSAL',t:'Gafete',r:'OPERACIONES'},
  {id:'R-076',s:'PERSONAL DE SUCURSAL',t:'Cabello corto o recogido',r:'OPERACIONES'},
  {id:'R-077',s:'PERSONAL DE SUCURSAL',t:'Manos (uñas cortas, sin barniz o transparente)',r:'OPERACIONES'},
  {id:'R-078',s:'PERSONAL DE SUCURSAL',t:'Zapatos negros limpios',r:'OPERACIONES'},
  {id:'R-079',s:'PERSONAL DE SUCURSAL',t:'Pantalón azul marino',r:'OPERACIONES'},
  {id:'R-080',s:'CALIDAD EN EL SERVICIO',t:'Protocolo de bienvenida y despedida',r:'OPERACIONES'},
  {id:'R-081',s:'CALIDAD EN EL SERVICIO',t:'Conversación y empatía con los clientes',r:'OPERACIONES'},
  {id:'R-082',s:'CALIDAD EN EL SERVICIO',t:'Preguntar necesidades y respetar receta médica',r:'OPERACIONES'},
  {id:'R-083',s:'CALIDAD EN EL SERVICIO',t:'Verifica existencia e informa caducidad y condiciones',r:'OPERACIONES'},
  {id:'R-084',s:'CALIDAD EN EL SERVICIO',t:'Ofrecer transferencias si no hay existencia',r:'OPERACIONES'},
  {id:'R-085',s:'CALIDAD EN EL SERVICIO',t:'Ofrece venta cruzada y promueve ofertas y tarjetas',r:'OPERACIONES'},
  {id:'R-086',s:'CALIDAD EN EL SERVICIO',t:'Pregunta al cliente si lo puede apoyar en algo más',r:'OPERACIONES'},
  {id:'R-087',s:'CALIDAD EN EL SERVICIO',t:'Receta registrada con F8 (no antibiótico/controlado)',r:'OPERACIONES'},
  {id:'R-088',s:'CALIDAD EN EL SERVICIO',t:'Pregunta amablemente la forma de pago',r:'OPERACIONES'},
  {id:'R-089',s:'CALIDAD EN EL SERVICIO',t:'Informa monto recibido, forma de pago y cambio',r:'OPERACIONES'},
  {id:'R-090',s:'CALIDAD EN EL SERVICIO',t:'Informa cantidad de cambio o entrega copia de voucher',r:'OPERACIONES'},
  {id:'R-091',s:'CALIDAD EN EL SERVICIO',t:'Si el cliente requiere factura, imprime o envía al correo',r:'OPERACIONES'},
  {id:'R-092',s:'CALIDAD EN EL SERVICIO',t:'Informa que va a retener la receta y ofrece copias',r:'OPERACIONES'},
  {id:'R-093',s:'CALIDAD EN EL SERVICIO',t:'Banners publicitarios en PHARMACY con publicidad vigente',r:'MERCADOTECNIA'},
  {id:'R-094',s:'CALIDAD EN EL SERVICIO',t:'Cuenta con ayuda visual con las claves de Planes de Lealtad',r:'MERCADOTECNIA'},
  {id:'R-095',s:'CONTROL Y ORGANIZACIÓN',t:'Aperturas y cierres',r:'OPERACIONES'},
  {id:'R-096',s:'CONTROL Y ORGANIZACIÓN',t:'Seguimiento a indicaciones',r:'OPERACIONES'},
  {id:'R-097',s:'CONTROL Y ORGANIZACIÓN',t:'Personal completo',r:'CAPITAL HUMANO'},
  {id:'R-098',s:'CONTROL Y ORGANIZACIÓN',t:'Bitácora de Registro de Valores al día y requisitada',r:'OPERACIONES'},
  {id:'R-099',s:'CONTROL Y ORGANIZACIÓN',t:'Bitácora de Mantenimiento en lugar visible',r:'OPERACIONES'},
  {id:'R-100',s:'CONTROL Y ORGANIZACIÓN',t:'Bitácora de Actividades al día requisitada por toda la plantilla',r:'OPERACIONES'},
  {id:'R-101',s:'CONTROL Y ORGANIZACIÓN',t:'Bitácora de Mantenimiento de refrigerador de medicamento',r:'OPERACIONES'},
  {id:'R-102',s:'CONOCIMIENTO Y CAPACITACIÓN',t:'Personal certificado SICAD',r:'OPERACIONES'},
  {id:'R-103',s:'CONOCIMIENTO Y CAPACITACIÓN',t:'Conocimiento y aplicación PNO',r:'OPERACIONES'},
  {id:'R-104',s:'CONOCIMIENTO Y CAPACITACIÓN',t:'Conocimiento y destreza PHARMACYSOFT',r:'OPERACIONES'},
  {id:'R-105',s:'ACONDICIONAMIENTO',t:'Señalamiento protección civil colocado y en buen estado',r:'CAPITAL HUMANO'},
  {id:'R-106',s:'ACONDICIONAMIENTO',t:'Cuentan con botiquín e insumos para este',r:'CAPITAL HUMANO'},
  {id:'R-107',s:'ACONDICIONAMIENTO',t:'Extintores con carga vigente e instalados correctamente',r:'CAPITAL HUMANO'},
  {id:'R-108',s:'ACONDICIONAMIENTO',t:'Lockers suficientes de acuerdo al número de operadores',r:'OPERACIONES'},
  {id:'R-109',s:'ACONDICIONAMIENTO',t:'Cuentan con garrafones de agua y portagarrafón',r:'OPERACIONES'},
  {id:'R-110',s:'ACONDICIONAMIENTO',t:'Cuentan con faja para la carga segura',r:'CAPITAL HUMANO'},
  {id:'R-111',s:'ACONDICIONAMIENTO',t:'Cuentan con cestas, carrito de carga / diablo o patín',r:'OPERACIONES'},
  {id:'R-112',s:'ACONDICIONAMIENTO',t:'Cuentan con escaleras de aluminio funcionales y en buen estado',r:'OPERACIONES'},
];

const SUCURSALES = ['SAN LORENZO (16)','CENTRO (01)','MONUMENTO A LA MADRE (02)','PARQUE HIDALGO (03)','LIBRAMIENTO-JUVENTUD (04)','MEGA (05)','ANGELES (06)','ARCADIA (07)','5 SUR Y 3 ORIENTE (08)','PORTALES (09)','GARCI CRESPO (10)','HOSPITAL GENERAL (11)','XOCHIPILLI (12)','EL MOLINO (13)','MERCADO 16 DE MARZO (14)','VIA PUEBLA (15)','REFORMA SUR (17)','HOSPITAL DE LA MUJER (18)','LA JOYA (19)','COAPAN (20)','MATRIZ CASA DEL MEDICO (22)','AMADOR HERNANDEZ (23)','RAMON DIAZ (24)','AJALPAN 01 (25)','3 NORTE (26)','AJALPAN 02 (27)','TELMEX (28)','REFORMA NORTE (29)','TECAMACHALCO 01 (30)','TECAMACHALCO 02 (31)','TLACOTEPEC 01 (32)','ZINACATEPEC 01 (33)','TLACOTEPEC 02 (34)','ZINACATEPEC 02 (35)','1 PONIENTE (36)','BOD05 (99)'];

const USUARIOS = {
  auditores:[
    {nombre:'JESUS MENDEZ GUTIERREZ',user:'jesus',pass:'jesus01'},
    {nombre:'ANDREA DE JESUS CAMPILLO ROMERO',user:'andrea',pass:'andrea01'},
    {nombre:'LUIS ARTURO FERNANDEZ OCAMPO',user:'luis',pass:'luis01'},
  ],
  responsables:[
    {nombre:'MANTENIMIENTO',user:'mant',pass:'mant2024',dept:'MANTENIMIENTO'},
    {nombre:'OPERACIONES',user:'oper',pass:'oper2024',dept:'OPERACIONES'},
    {nombre:'MERCADOTECNIA',user:'merc',pass:'merc2024',dept:'MERCADOTECNIA'},
    {nombre:'TI',user:'ti',pass:'ti2024',dept:'TI'},
    {nombre:'CAPITAL HUMANO',user:'ch',pass:'ch2024',dept:'CAPITAL HUMANO'},
    {nombre:'COMERCIALIZACIÓN',user:'com',pass:'com2024',dept:'COMERCIALIZACIÓN'},
    {nombre:'INSUMOS',user:'ins',pass:'ins2024',dept:'INSUMOS'},
  ],
};

// ════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════
const uid = () => 'AUD-' + Date.now().toString(36).toUpperCase();
const today = () => new Date().toISOString().split('T')[0];
const fmtDate = d => new Date(d).toLocaleDateString('es-MX',{day:'2-digit',month:'short',year:'numeric'});
const fmtFull = d => new Date(d).toLocaleString('es-MX',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});

function calcStats(resp) {
  const vals = Object.values(resp);
  const si = vals.filter(v=>v.r==='SI').length;
  const no = vals.filter(v=>v.r==='NO').length;
  const na = vals.filter(v=>v.r==='NA').length;
  const ans = si+no;
  return {si,no,na,pct: ans>0?Math.round(si/ans*100):0};
}

function initRespuestas() {
  return Object.fromEntries(RX.map(r=>[r.id,{r:null,foto:null,obs:''}]));
}

// Generate sample demo data
function genSample(id,suc,aud,daysAgo,pctSI) {
  const d = new Date(); d.setDate(d.getDate()-daysAgo);
  const resp = {};
  let si=0,no=0,na=0;
  RX.forEach((rx,i)=>{
    const v = Math.random()<0.08?'NA': Math.random()<pctSI?'SI':'NO';
    resp[rx.id]={r:v,foto:null,obs:v==='NO'?'Requiere corrección':''};
    if(v==='SI')si++; else if(v==='NO')no++; else na++;
  });
  const segs = {};
  Object.entries(resp).filter(([,v])=>v.r==='NO').forEach(([k])=>{
    const rx = RX.find(r=>r.id===k);
    segs[k]={dept:rx.r,resuelto:Math.random()>0.5,notas:'',fechaRes:null};
    if(segs[k].resuelto){segs[k].notas='Problema corregido.';segs[k].fechaRes=new Date(d.getTime()+86400000*2).toISOString();}
  });
  return {id,sucursal:suc,auditor:aud,fecha:d.toISOString().split('T')[0],hora:'10:30',estado:'Completada',resp,si,no,na,pct:Math.round(si/(si+no)*100),segs};
}

const DEMO = [
  genSample('AUD-001','CENTRO (01)','JESUS MENDEZ GUTIERREZ',5,0.87),
  genSample('AUD-002','MEGA (05)','ANDREA DE JESUS CAMPILLO ROMERO',12,0.79),
  genSample('AUD-003','VIA PUEBLA (15)','LUIS ARTURO FERNANDEZ OCAMPO',18,0.92),
  genSample('AUD-004','REFORMA SUR (17)','JESUS MENDEZ GUTIERREZ',25,0.74),
  genSample('AUD-005','PORTALES (09)','ANDREA DE JESUS CAMPILLO ROMERO',31,0.88),
];

// Compress image to base64 thumbnail
function compressImage(file, cb) {
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      const MAX=600; const r=Math.min(MAX/img.width,MAX/img.height);
      const c=document.createElement('canvas');
      c.width=img.width*r; c.height=img.height*r;
      c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      cb(c.toDataURL('image/jpeg',0.7));
    };
    img.src=ev.target.result;
  };
  reader.readAsDataURL(file);
}

async function sendToGoogleSheets(url, data) {
  if(!url) return {ok:false,msg:'URL no configurada'};
  try {
    const r = await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    const json = await r.json();
    return {ok:true,json};
  } catch(e) { return {ok:false,msg:e.message}; }
}

// ════════════════════════════════════════════════════════
// COMPONENTS: LOGIN
// ════════════════════════════════════════════════════════
function Login({onLogin}) {
  const [tipo,setTipo]=useState('auditor');
  const [u,setU]=useState('');const[p,setP]=useState('');const[err,setErr]=useState('');
  const doLogin=()=>{
    const list=tipo==='auditor'?USUARIOS.auditores:USUARIOS.responsables;
    const found=list.find(x=>x.user===u.toLowerCase()&&x.pass===p);
    if(found) onLogin({...found,role:tipo});
    else setErr('Usuario o contraseña incorrectos');
  };
  return (
    <div style={{minHeight:'100dvh',background:`linear-gradient(135deg,${B} 0%,#0052cc 100%)`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'20px',fontFamily:'system-ui,sans-serif'}}>
      <div style={{marginBottom:28,textAlign:'center'}}>
        <div style={{background:'white',borderRadius:16,padding:'18px 36px',display:'inline-block',boxShadow:'0 8px 32px rgba(0,0,0,0.3)'}}>
          <div style={{fontWeight:900,fontSize:38,color:B,lineHeight:1.1}}>Farmacias</div>
          <div style={{fontWeight:900,fontSize:48,color:O,lineHeight:1}}>Apoyo</div>
          <div style={{fontSize:11,color:'#666',letterSpacing:2,marginTop:4}}>AUDITORÍA DE CALIDAD</div>
        </div>
      </div>
      <div style={{background:'white',borderRadius:18,padding:'28px 28px',width:'100%',maxWidth:380,boxShadow:'0 16px 48px rgba(0,0,0,0.3)'}}>
        <h2 style={{margin:'0 0 20px',color:B,fontSize:20,textAlign:'center'}}>Iniciar Sesión</h2>
        <div style={{display:'flex',borderRadius:10,overflow:'hidden',border:`2px solid ${B}`,marginBottom:20}}>
          {[['auditor','🔍 Auditor'],['responsable','👤 Responsable']].map(([t,l])=>(
            <button key={t} onClick={()=>{setTipo(t);setErr('');}} style={{flex:1,padding:'10px 0',border:'none',cursor:'pointer',background:tipo===t?B:'white',color:tipo===t?'white':B,fontWeight:700,fontSize:13}}>{l}</button>
          ))}
        </div>
        <input placeholder={tipo==='auditor'?'Usuario: jesus / andrea / luis':'Usuario: mant / oper / merc / ti / ch'} value={u} onChange={e=>setU(e.target.value)}
          style={{width:'100%',padding:12,borderRadius:9,border:'1.5px solid #ddd',fontSize:15,marginBottom:10,boxSizing:'border-box'}}/>
        <input type="password" placeholder="Contraseña" value={p} onChange={e=>setP(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doLogin()}
          style={{width:'100%',padding:12,borderRadius:9,border:'1.5px solid #ddd',fontSize:15,marginBottom:14,boxSizing:'border-box'}}/>
        {err&&<p style={{color:RD,textAlign:'center',margin:'0 0 12px',fontSize:13}}>{err}</p>}
        <button onClick={doLogin} style={{...btn(O),width:'100%',fontSize:17,padding:14}}>Entrar →</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// HEADER & BOTTOM NAV
// ════════════════════════════════════════════════════════
function Header({user,onLogout}) {
  return (
    <header style={{background:B,padding:'10px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:200,boxShadow:'0 2px 8px rgba(0,0,0,0.2)'}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <span style={{color:O,fontWeight:900,fontSize:22}}>⚕</span>
        <div>
          <div style={{color:'white',fontWeight:800,fontSize:15,lineHeight:1}}>Farmacias Apoyo</div>
          <div style={{color:'rgba(255,255,255,0.6)',fontSize:11}}>Auditoría de Calidad</div>
        </div>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <div style={{textAlign:'right'}}>
          <div style={{color:'white',fontSize:12,fontWeight:600}}>{user.nombre.split(' ')[0]}</div>
          <div style={{color:O,fontSize:10,fontWeight:600}}>{user.role.toUpperCase()}</div>
        </div>
        <button onClick={onLogout} style={{background:'rgba(255,255,255,0.15)',border:'none',color:'white',padding:'6px 10px',borderRadius:7,cursor:'pointer',fontSize:12}}>Salir</button>
      </div>
    </header>
  );
}

function BottomNav({screen,setScreen,role}) {
  const items = role==='auditor'
    ? [{id:'home',icon:'📊',l:'Dashboard'},{id:'nueva',icon:'✏️',l:'Nueva'},{id:'lista',icon:'📋',l:'Historial'},{id:'config',icon:'⚙️',l:'Config'}]
    : [{id:'home',icon:'📊',l:'Dashboard'},{id:'pendientes',icon:'🔔',l:'Pendientes'}];
  return (
    <nav style={{position:'fixed',bottom:0,left:0,right:0,background:'white',borderTop:'1.5px solid #e5e7eb',display:'flex',zIndex:200,paddingBottom:'env(safe-area-inset-bottom)'}}>
      {items.map(i=>(
        <button key={i.id} onClick={()=>setScreen(i.id)} style={{flex:1,padding:'8px 0 6px',border:'none',background:'none',cursor:'pointer',color:screen===i.id?O:'#9ca3af',display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
          <span style={{fontSize:22}}>{i.icon}</span>
          <span style={{fontSize:10,fontWeight:screen===i.id?700:400}}>{i.l}</span>
        </button>
      ))}
    </nav>
  );
}

// ════════════════════════════════════════════════════════
// DASHBOARD - AUDITOR
// ════════════════════════════════════════════════════════
function AuditorDashboard({auditorias,setScreen}) {
  const completadas = auditorias.filter(a=>a.estado==='Completada');
  const pendientes = auditorias.flatMap(a=>Object.entries(a.segs||{}).filter(([,s])=>!s.resuelto)).length;
  const promPct = completadas.length>0?Math.round(completadas.reduce((acc,a)=>acc+a.pct,0)/completadas.length):0;

  const pieData = [
    {name:'Sí',value:completadas.reduce((a,x)=>a+x.si,0),color:GR},
    {name:'No',value:completadas.reduce((a,x)=>a+x.no,0),color:RD},
    {name:'N/A',value:completadas.reduce((a,x)=>a+x.na,0),color:'#94a3b8'},
  ];

  const barData = completadas.slice(-5).map(a=>({name:a.sucursal.split('(')[0].trim().substring(0,10),pct:a.pct,fill:a.pct>=80?GR:a.pct>=60?YL:RD}));

  const pctColor = promPct>=80?GR:promPct>=60?YL:RD;

  return (
    <div style={{padding:'16px 14px 90px',background:'#f1f5f9',minHeight:'100dvh',fontFamily:'system-ui,sans-serif'}}>
      <h2 style={{margin:'0 0 16px',color:B,fontSize:20}}>Dashboard</h2>

      {/* KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
        {[
          {label:'Auditorías',val:completadas.length,color:B,icon:'📋'},
          {label:'% Cumplimiento',val:promPct+'%',color:pctColor,icon:'📈'},
          {label:'Reactivos NO',val:completadas.reduce((a,x)=>a+x.no,0),color:RD,icon:'❌'},
          {label:'Sin resolver',val:pendientes,color:YL,icon:'⚠️'},
        ].map((k,i)=>(
          <div key={i} style={{...card,textAlign:'center',padding:'14px 8px'}}>
            <div style={{fontSize:26}}>{k.icon}</div>
            <div style={{fontSize:28,fontWeight:900,color:k.color}}>{k.val}</div>
            <div style={{fontSize:12,color:'#6b7280'}}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Pie chart */}
      <div style={{...card}}>
        <h3 style={{margin:'0 0 12px',color:B,fontSize:15}}>Distribución de Respuestas</h3>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={65} dataKey="value" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
              {pieData.map((e,i)=><Cell key={i} fill={e.color}/>)}
            </Pie>
            <Tooltip/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart */}
      {barData.length>0&&(
        <div style={{...card}}>
          <h3 style={{margin:'0 0 12px',color:B,fontSize:15}}>% Cumplimiento por Sucursal</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={barData} margin={{top:0,right:10,left:-20,bottom:30}}>
              <CartesianGrid strokeDasharray="3 3" vertical={false}/>
              <XAxis dataKey="name" tick={{fontSize:10}} angle={-30} textAnchor="end"/>
              <YAxis domain={[0,100]} tick={{fontSize:10}}/>
              <Tooltip formatter={v=>[v+'%','Cumplimiento']}/>
              <Bar dataKey="pct" radius={[4,4,0,0]}>
                {barData.map((e,i)=><Cell key={i} fill={e.fill}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Quick action */}
      <button onClick={()=>setScreen('nueva')} style={{...btn(O),width:'100%',padding:16,fontSize:16,borderRadius:12,marginTop:4}}>
        ✏️ Iniciar Nueva Auditoría
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// NUEVA AUDITORÍA (Multi-step)
// ════════════════════════════════════════════════════════
function NuevaAuditoria({user,auditorias,setAuditorias,setScreen,gasUrl}) {
  const [step,setStep]=useState(0); // 0=setup, 1-10=secciones, 11=resumen
  const [sucursal,setSucursal]=useState('');
  const [resp,setResp]=useState(initRespuestas());
  const [sending,setSending]=useState(false);
  const [msg,setMsg]=useState('');
  const fileRef=useRef();
  const [activePhoto,setActivePhoto]=useState(null); // reactivo id for photo capture

  const currentSec = step>=1&&step<=10?SECS[step-1]:null;
  const secRx = currentSec?RX.filter(r=>r.s===currentSec):[];
  const totalAnswered = Object.values(resp).filter(v=>v.r!==null).length;

  const setR = (id,field,val)=>setResp(prev=>({...prev,[id]:{...prev[id],[field]:val}}));

  const handlePhoto=(e)=>{
    const f=e.target.files[0]; if(!f||!activePhoto) return;
    compressImage(f,b64=>setR(activePhoto,'foto',b64));
    e.target.value='';
  };

  const secAnswered = secRx.filter(r=>resp[r.id].r!==null).length;
  const secPct = secRx.length>0?Math.round(secAnswered/secRx.length*100):0;

  const submit = async()=>{
    setSending(true); setMsg('');
    const stats = calcStats(resp);
    const segs = {};
    Object.entries(resp).filter(([,v])=>v.r==='NO').forEach(([k])=>{
      const rx=RX.find(r=>r.id===k);
      segs[k]={dept:rx.r,resuelto:false,notas:'',fechaRes:null};
    });
    const auditoria = {
      id:uid(),sucursal,auditor:user.nombre,
      fecha:today(),hora:new Date().toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'}),
      estado:'Completada',resp,...stats,segs,
    };
    const {ok,msg:m}=await sendToGoogleSheets(gasUrl,auditoria);
    setAuditorias(prev=>[auditoria,...prev]);
    setMsg(ok?'✅ Guardado en Google Sheets':'⚠️ Guardado localmente ('+m+')');
    setSending(false);
    setTimeout(()=>setScreen('lista'),2000);
  };

  // Step 0 - Setup
  if(step===0) return (
    <div style={{padding:'16px 14px 90px',background:'#f1f5f9',minHeight:'100dvh',fontFamily:'system-ui,sans-serif'}}>
      <h2 style={{margin:'0 0 4px',color:B}}>Nueva Auditoría</h2>
      <p style={{margin:'0 0 20px',color:'#6b7280',fontSize:13}}>Selecciona la sucursal para comenzar</p>
      <div style={card}>
        <label style={{display:'block',marginBottom:6,color:B,fontWeight:600,fontSize:14}}>Sucursal</label>
        <select value={sucursal} onChange={e=>setSucursal(e.target.value)}
          style={{width:'100%',padding:12,borderRadius:9,border:'1.5px solid #ddd',fontSize:15,boxSizing:'border-box'}}>
          <option value="">-- Selecciona sucursal --</option>
          {SUCURSALES.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <div style={{marginTop:14,background:'#f8fafc',borderRadius:9,padding:12}}>
          <div style={{color:'#6b7280',fontSize:13}}>📅 Fecha: <b>{fmtDate(today())}</b></div>
          <div style={{color:'#6b7280',fontSize:13,marginTop:4}}>👤 Auditor: <b>{user.nombre.split(' ')[0]}</b></div>
          <div style={{color:'#6b7280',fontSize:13,marginTop:4}}>📝 Reactivos: <b>112</b> en <b>10</b> secciones</div>
        </div>
      </div>
      <button disabled={!sucursal} onClick={()=>setStep(1)}
        style={{...btn(sucursal?O:'#ccc'),width:'100%',padding:15,fontSize:16,borderRadius:12}}>
        Comenzar Auditoría →
      </button>
    </div>
  );

  // Steps 1-10 - Sections
  if(step>=1&&step<=10) return (
    <div style={{padding:'0 0 90px',background:'#f1f5f9',minHeight:'100dvh',fontFamily:'system-ui,sans-serif'}}>
      <input type="file" accept="image/*" capture="environment" ref={fileRef} style={{display:'none'}} onChange={handlePhoto}/>
      
      {/* Section header */}
      <div style={{background:B,padding:'14px 16px'}}>
        <div style={{color:'rgba(255,255,255,0.7)',fontSize:12,marginBottom:4}}>Sección {step} de 10 • {sucursal}</div>
        <div style={{color:'white',fontWeight:800,fontSize:16}}>{SEC_ICONS[currentSec]} {currentSec}</div>
        <div style={{background:'rgba(255,255,255,0.2)',borderRadius:4,height:6,marginTop:10}}>
          <div style={{background:O,height:6,borderRadius:4,width:`${((step-1)/10)*100}%`,transition:'width 0.3s'}}/>
        </div>
        <div style={{color:'rgba(255,255,255,0.7)',fontSize:11,marginTop:4,display:'flex',justifyContent:'space-between'}}>
          <span>{secAnswered}/{secRx.length} respondidos</span>
          <span>{totalAnswered}/112 total</span>
        </div>
      </div>

      <div style={{padding:'12px 14px'}}>
        {secRx.map((rx,idx)=>{
          const ans = resp[rx.id];
          return (
            <div key={rx.id} style={{...card,border:ans.r==='NO'?`2px solid ${RD}`:ans.r==='SI'?`2px solid ${GR}`:'2px solid transparent'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,alignItems:'flex-start',gap:8}}>
                <div style={{flex:1}}>
                  <span style={{background:B,color:'white',fontSize:10,padding:'2px 7px',borderRadius:4,fontWeight:700}}>{rx.id}</span>
                  <span style={{background:'#e5e7eb',color:'#374151',fontSize:10,padding:'2px 7px',borderRadius:4,marginLeft:4}}>{rx.r}</span>
                  <p style={{margin:'6px 0 0',fontSize:14,color:'#1f2937',lineHeight:1.4}}>{rx.t}</p>
                </div>
              </div>
              
              {/* Answer buttons */}
              <div style={{display:'flex',gap:8,marginBottom:ans.r==='NO'?10:0}}>
                {[['SI',GR],['NO',RD],['NA','#6b7280']].map(([v,c])=>(
                  <button key={v} onClick={()=>setR(rx.id,'r',v)}
                    style={{flex:1,padding:'10px 0',border:`2px solid ${ans.r===v?c:'#e5e7eb'}`,borderRadius:9,background:ans.r===v?c:'white',color:ans.r===v?'white':c,fontWeight:800,fontSize:16,cursor:'pointer',transition:'all 0.1s'}}>
                    {v==='SI'?'✓ SÍ':v==='NO'?'✗ NO':'— N/A'}
                  </button>
                ))}
              </div>

              {/* If NO: show obs + photo */}
              {ans.r==='NO'&&(
                <div style={{background:'#fef2f2',borderRadius:8,padding:10}}>
                  <textarea placeholder="Observación (obligatoria)..." value={ans.obs} onChange={e=>setR(rx.id,'obs',e.target.value)}
                    style={{width:'100%',padding:9,borderRadius:8,border:'1px solid #fecaca',fontSize:13,resize:'vertical',minHeight:60,boxSizing:'border-box',marginBottom:8}}/>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <button onClick={()=>{setActivePhoto(rx.id);fileRef.current.click();}}
                      style={{...btn(B,'white',{fontSize:13,padding:'8px 14px',display:'flex',alignItems:'center',gap:6})}}>
                      📷 {ans.foto?'Cambiar foto':'Tomar foto'}
                    </button>
                    {ans.foto&&<img src={ans.foto} alt="" style={{height:48,width:64,objectFit:'cover',borderRadius:6,border:'2px solid '+GR}}/>}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div style={{display:'flex',gap:10,marginTop:4}}>
          <button onClick={()=>setStep(s=>s-1)} style={{...btn('#e5e7eb',B),flex:1}}>← Anterior</button>
          {step<10
            ? <button onClick={()=>setStep(s=>s+1)} style={{...btn(O),flex:2}}>Siguiente sección →</button>
            : <button onClick={()=>setStep(11)} style={{...btn(GR),flex:2}}>Ver Resumen ✓</button>
          }
        </div>
      </div>
    </div>
  );

  // Step 11 - Resumen
  const stats = calcStats(resp);
  const noItems = Object.entries(resp).filter(([,v])=>v.r==='NO').map(([k])=>RX.find(r=>r.id===k)).filter(Boolean);
  const pctColor = stats.pct>=80?GR:stats.pct>=60?YL:RD;

  return (
    <div style={{padding:'16px 14px 90px',background:'#f1f5f9',minHeight:'100dvh',fontFamily:'system-ui,sans-serif'}}>
      <h2 style={{margin:'0 0 4px',color:B}}>Resumen de Auditoría</h2>
      <p style={{margin:'0 0 16px',color:'#6b7280',fontSize:13}}>{sucursal} • {fmtDate(today())}</p>

      {/* Score */}
      <div style={{...card,textAlign:'center',padding:24}}>
        <div style={{fontSize:60,fontWeight:900,color:pctColor}}>{stats.pct}%</div>
        <div style={{fontSize:14,color:'#6b7280',marginBottom:16}}>Cumplimiento general</div>
        <div style={{display:'flex',justifyContent:'center',gap:24}}>
          {[['✓ SÍ',stats.si,GR],['✗ NO',stats.no,RD],['— N/A',stats.na,'#94a3b8']].map(([l,v,c])=>(
            <div key={l} style={{textAlign:'center'}}>
              <div style={{fontSize:24,fontWeight:800,color:c}}>{v}</div>
              <div style={{fontSize:12,color:'#6b7280'}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* NOes list */}
      {noItems.length>0&&(
        <div style={card}>
          <h3 style={{margin:'0 0 12px',color:RD,fontSize:14}}>⚠️ {noItems.length} Reactivos con NO (se enviarán a responsables)</h3>
          {noItems.map(rx=>(
            <div key={rx.id} style={{padding:'8px 0',borderBottom:'1px solid #f3f4f6',fontSize:13}}>
              <span style={{color:B,fontWeight:700}}>{rx.id}</span> <span style={{color:'#374151'}}>{rx.t}</span>
              <div style={{color:RD,fontSize:11,marginTop:2}}>→ {rx.r}</div>
            </div>
          ))}
        </div>
      )}

      {msg&&<div style={{background:msg.includes('✅')?'#f0fdf4':'#fffbeb',border:`1px solid ${msg.includes('✅')?'#86efac':'#fbbf24'}`,borderRadius:9,padding:12,marginBottom:12,fontSize:13,color:msg.includes('✅')?GR:'#92400e'}}>{msg}</div>}

      <div style={{display:'flex',gap:10}}>
        <button onClick={()=>setStep(10)} style={{...btn('#e5e7eb',B),flex:1}}>← Editar</button>
        <button onClick={submit} disabled={sending} style={{...btn(GR),flex:2,padding:15,fontSize:15}}>
          {sending?'Guardando...':'💾 Guardar Auditoría'}
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// HISTORIAL
// ════════════════════════════════════════════════════════
function Historial({auditorias,setScreen,setSelected}) {
  const [buscar,setBuscar]=useState('');
  const filtradas = auditorias.filter(a=>a.sucursal.toLowerCase().includes(buscar.toLowerCase())||a.auditor.toLowerCase().includes(buscar.toLowerCase()));
  return (
    <div style={{padding:'16px 14px 90px',background:'#f1f5f9',minHeight:'100dvh',fontFamily:'system-ui,sans-serif'}}>
      <h2 style={{margin:'0 0 12px',color:B}}>Historial de Auditorías</h2>
      <input placeholder="🔍 Buscar por sucursal o auditor..." value={buscar} onChange={e=>setBuscar(e.target.value)}
        style={{width:'100%',padding:11,borderRadius:10,border:'1.5px solid #ddd',fontSize:14,marginBottom:14,boxSizing:'border-box'}}/>
      {filtradas.length===0&&<p style={{color:'#9ca3af',textAlign:'center'}}>No hay auditorías registradas</p>}
      {filtradas.map(a=>{
        const pending = Object.values(a.segs||{}).filter(s=>!s.resuelto).length;
        const pColor=a.pct>=80?GR:a.pct>=60?YL:RD;
        return (
          <div key={a.id} onClick={()=>{setSelected(a);setScreen('detalle');}} style={{...card,cursor:'pointer',display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:52,height:52,borderRadius:12,background:pColor,display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:900,fontSize:16,flexShrink:0}}>{a.pct}%</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:700,color:B,fontSize:14,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{a.sucursal}</div>
              <div style={{fontSize:12,color:'#6b7280'}}>{fmtDate(a.fecha)} • {a.auditor.split(' ')[0]}</div>
              <div style={{fontSize:12,marginTop:3,display:'flex',gap:10}}>
                <span style={{color:GR}}>✓ {a.si}</span>
                <span style={{color:RD}}>✗ {a.no}</span>
                {pending>0&&<span style={{color:YL}}>⏳ {pending} pendientes</span>}
              </div>
            </div>
            <span style={{color:'#9ca3af',fontSize:18}}>›</span>
          </div>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════
// DETALLE AUDITORÍA
// ════════════════════════════════════════════════════════
function DetalleAuditoria({auditoria,setScreen}) {
  const [secFiltro,setSecFiltro]=useState('');
  const [respFiltro,setRespFiltro]=useState('');
  const [fotoModal,setFotoModal]=useState(null);
  if(!auditoria) return null;
  const {resp,segs={}}=auditoria;
  const rxFiltrados = RX.filter(r=>
    (!secFiltro||r.s===secFiltro)&&(!respFiltro||resp[r.id]?.r===respFiltro)
  );
  const pColor=auditoria.pct>=80?GR:auditoria.pct>=60?YL:RD;
  return (
    <div style={{padding:'0 0 90px',background:'#f1f5f9',minHeight:'100dvh',fontFamily:'system-ui,sans-serif'}}>
      {/* Photo modal */}
      {fotoModal&&(
        <div onClick={()=>setFotoModal(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
          <img src={fotoModal} alt="" style={{maxWidth:'100%',maxHeight:'80vh',borderRadius:12}}/>
        </div>
      )}

      {/* Top card */}
      <div style={{background:B,padding:'16px 16px 20px'}}>
        <button onClick={()=>setScreen('lista')} style={{background:'none',border:'none',color:O,cursor:'pointer',fontSize:14,padding:'0 0 8px',fontWeight:600}}>← Volver</button>
        <div style={{color:'white',fontWeight:800,fontSize:17}}>{auditoria.sucursal}</div>
        <div style={{color:'rgba(255,255,255,0.7)',fontSize:13}}>{fmtDate(auditoria.fecha)} • {auditoria.auditor.split(' ').slice(0,2).join(' ')}</div>
        <div style={{display:'flex',gap:16,marginTop:12}}>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:32,fontWeight:900,color:pColor}}>{auditoria.pct}%</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.6)'}}>Cumplimiento</div>
          </div>
          <div style={{flex:1,display:'flex',gap:12,alignItems:'center'}}>
            {[['SÍ',auditoria.si,GR],['NO',auditoria.no,RD],['N/A',auditoria.na,'#94a3b8']].map(([l,v,c])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.6)'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{padding:'12px 14px',background:'white',borderBottom:'1px solid #e5e7eb',display:'flex',gap:8}}>
        <select value={secFiltro} onChange={e=>setSecFiltro(e.target.value)} style={{flex:1,padding:8,borderRadius:7,border:'1px solid #ddd',fontSize:12}}>
          <option value="">Todas las secciones</option>
          {SECS.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <select value={respFiltro} onChange={e=>setRespFiltro(e.target.value)} style={{flex:1,padding:8,borderRadius:7,border:'1px solid #ddd',fontSize:12}}>
          <option value="">Todas las resp.</option>
          {['SI','NO','NA'].map(v=><option key={v} value={v}>{v==='SI'?'✓ SÍ':v==='NO'?'✗ NO':'— N/A'}</option>)}
        </select>
      </div>

      <div style={{padding:'10px 14px'}}>
        {rxFiltrados.map(rx=>{
          const a=resp[rx.id]||{r:null,foto:null,obs:''};
          const seg=segs[rx.id];
          const bColor=a.r==='SI'?GR:a.r==='NO'?RD:a.r==='NA'?'#94a3b8':'#e5e7eb';
          return (
            <div key={rx.id} style={{...card,padding:12,borderLeft:`4px solid ${bColor}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
                <div style={{flex:1}}>
                  <span style={{background:'#e5e7eb',fontSize:10,padding:'2px 6px',borderRadius:4,color:'#374151',fontWeight:700}}>{rx.id}</span>
                  <p style={{margin:'4px 0',fontSize:13,color:'#1f2937',lineHeight:1.3}}>{rx.t}</p>
                  <span style={{fontSize:10,color:'#9ca3af'}}>{rx.r}</span>
                </div>
                <span style={{fontWeight:900,fontSize:15,color:bColor,flexShrink:0}}>{a.r||'—'}</span>
              </div>
              {a.obs&&<p style={{margin:'6px 0 0',fontSize:12,color:'#6b7280',background:'#f9fafb',padding:'6px 8px',borderRadius:6}}>💬 {a.obs}</p>}
              {a.foto&&<img onClick={()=>setFotoModal(a.foto)} src={a.foto} alt="" style={{marginTop:6,height:56,width:80,objectFit:'cover',borderRadius:6,cursor:'pointer',border:`2px solid ${B}`}}/>}
              {seg&&(
                <div style={{marginTop:8,background:seg.resuelto?'#f0fdf4':'#fef9c3',borderRadius:7,padding:'6px 10px',fontSize:12}}>
                  {seg.resuelto?<span style={{color:GR}}>✅ Resuelto {fmtFull(seg.fechaRes)} — {seg.notas}</span>:<span style={{color:YL}}>⏳ Pendiente resolución por <b>{seg.dept}</b></span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// RESPONSABLE DASHBOARD
// ════════════════════════════════════════════════════════
function ResponsableDashboard({user,auditorias,setScreen,setSelected}) {
  const dept = user.dept;
  const pendientes = [];
  auditorias.forEach(a=>{
    Object.entries(a.segs||{}).forEach(([rid,seg])=>{
      if(seg.dept&&seg.dept.includes(dept)&&!seg.resuelto){
        const rx=RX.find(r=>r.id===rid);
        pendientes.push({auditoria:a,rid,rx,seg});
      }
    });
  });
  return (
    <div style={{padding:'16px 14px 90px',background:'#f1f5f9',minHeight:'100dvh',fontFamily:'system-ui,sans-serif'}}>
      <div style={{...card,background:B,padding:'16px',marginBottom:14}}>
        <div style={{color:O,fontWeight:800,fontSize:16}}>{dept}</div>
        <div style={{color:'white',fontSize:28,fontWeight:900,marginTop:4}}>{pendientes.length}</div>
        <div style={{color:'rgba(255,255,255,0.7)',fontSize:13}}>Reactivos pendientes de resolución</div>
      </div>
      {pendientes.length===0&&<p style={{color:'#9ca3af',textAlign:'center',padding:20}}>✅ No tienes reactivos pendientes</p>}
      {pendientes.map(({auditoria,rid,rx,seg},i)=>(
        <div key={i} onClick={()=>{setSelected({auditoria,rid,rx,seg});setScreen('seguimiento');}}
          style={{...card,cursor:'pointer',borderLeft:`4px solid ${RD}`}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{flex:1}}>
              <span style={{background:RD,color:'white',fontSize:10,padding:'2px 6px',borderRadius:4,fontWeight:700}}>{rid}</span>
              <div style={{fontWeight:600,color:'#1f2937',fontSize:13,marginTop:4}}>{rx?.t}</div>
              <div style={{color:'#6b7280',fontSize:12,marginTop:2}}>📍 {auditoria.sucursal}</div>
              <div style={{color:'#6b7280',fontSize:12}}>📅 {fmtDate(auditoria.fecha)} • {auditoria.auditor.split(' ')[0]}</div>
            </div>
            <span style={{color:'#9ca3af',fontSize:18}}>›</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════
// SEGUIMIENTO DETALLE (Responsable)
// ════════════════════════════════════════════════════════
function SeguimientoDetalle({selected,setScreen,auditorias,setAuditorias,gasUrl}) {
  const [notas,setNotas]=useState('');
  const [done,setDone]=useState(false);
  const [sending,setSending]=useState(false);
  if(!selected) return null;
  const {auditoria,rid,rx,seg}=selected;
  const audOrig=auditorias.find(a=>a.id===auditoria.id);
  const obs=audOrig?.resp[rid]?.obs||'';
  const foto=audOrig?.resp[rid]?.foto||null;

  const resolver=async()=>{
    if(!notas.trim()) return;
    setSending(true);
    const fechaRes=new Date().toISOString();
    setAuditorias(prev=>prev.map(a=>{
      if(a.id!==auditoria.id) return a;
      return {...a,segs:{...a.segs,[rid]:{...a.segs[rid],resuelto:true,notas,fechaRes}}};
    }));
    const payload={auditoria_id:auditoria.id,rid,resuelto:true,notas,fechaRes,dept:seg.dept};
    await sendToGoogleSheets(gasUrl,{action:'resolver',...payload});
    setSending(false);setDone(true);
  };

  return (
    <div style={{padding:'16px 14px 90px',background:'#f1f5f9',minHeight:'100dvh',fontFamily:'system-ui,sans-serif'}}>
      <button onClick={()=>setScreen('home')} style={{background:'none',border:'none',color:B,cursor:'pointer',fontSize:14,fontWeight:600,marginBottom:12,padding:0}}>← Volver</button>
      <div style={{...card,borderLeft:`4px solid ${RD}`,marginBottom:14}}>
        <span style={{background:RD,color:'white',fontSize:11,padding:'3px 8px',borderRadius:5,fontWeight:700}}>{rid}</span>
        <h3 style={{margin:'8px 0 6px',color:'#1f2937',fontSize:15}}>{rx?.t}</h3>
        <div style={{color:'#6b7280',fontSize:13}}>📍 {auditoria.sucursal}</div>
        <div style={{color:'#6b7280',fontSize:13}}>📅 {fmtDate(auditoria.fecha)} • {auditoria.auditor.split(' ')[0]}</div>
        {obs&&<div style={{background:'#fef2f2',borderRadius:8,padding:'8px 10px',marginTop:10,fontSize:13,color:'#7f1d1d'}}>💬 Observación auditor: {obs}</div>}
        {foto&&<img src={foto} alt="" style={{marginTop:10,maxWidth:'100%',borderRadius:8,maxHeight:200,objectFit:'cover'}}/>}
      </div>
      {done?(
        <div style={{...card,background:'#f0fdf4',border:`1px solid ${GR}`,textAlign:'center',padding:24}}>
          <div style={{fontSize:40}}>✅</div>
          <div style={{color:GR,fontWeight:800,fontSize:16,marginTop:8}}>¡Reactivo resuelto!</div>
          <div style={{color:'#6b7280',fontSize:13,marginTop:4}}>Fecha de resolución: {fmtFull(new Date().toISOString())}</div>
          <div style={{marginTop:8,color:'#374151',fontSize:13}}>El auditor puede ver esta resolución en el detalle de la auditoría.</div>
        </div>
      ):(
        <div style={card}>
          <h3 style={{margin:'0 0 10px',color:B,fontSize:15}}>Registrar Resolución</h3>
          <textarea placeholder="Describe la acción correctiva realizada..." value={notas} onChange={e=>setNotas(e.target.value)}
            style={{width:'100%',padding:11,borderRadius:9,border:'1.5px solid #ddd',fontSize:14,resize:'vertical',minHeight:90,boxSizing:'border-box',marginBottom:12}}/>
          <button onClick={resolver} disabled={!notas.trim()||sending}
            style={{...btn(GR),width:'100%',padding:14,fontSize:15,opacity:!notas.trim()?0.5:1}}>
            {sending?'Guardando...':'✅ Marcar como Resuelto'}
          </button>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════
// CONFIG
// ════════════════════════════════════════════════════════
function Config({gasUrl,setGasUrl,setScreen}) {
  const [url,setUrl]=useState(gasUrl);
  return (
    <div style={{padding:'16px 14px 90px',background:'#f1f5f9',minHeight:'100dvh',fontFamily:'system-ui,sans-serif'}}>
      <h2 style={{margin:'0 0 4px',color:B}}>Configuración</h2>
      <p style={{margin:'0 0 16px',color:'#6b7280',fontSize:13}}>Conecta la app con Google Sheets</p>
      <div style={card}>
        <label style={{display:'block',color:B,fontWeight:700,fontSize:14,marginBottom:8}}>🔗 URL de Google Apps Script</label>
        <input placeholder="https://script.google.com/macros/s/.../exec" value={url} onChange={e=>setUrl(e.target.value)}
          style={{width:'100%',padding:11,borderRadius:9,border:'1.5px solid #ddd',fontSize:13,boxSizing:'border-box',marginBottom:10}}/>
        <button onClick={()=>setGasUrl(url)} style={{...btn(B),width:'100%'}}>💾 Guardar URL</button>
        {gasUrl&&<p style={{color:GR,fontSize:12,marginTop:8,textAlign:'center'}}>✅ Conectado a Google Sheets</p>}
      </div>
      <div style={{...card,background:'#fffbeb',border:`1px solid ${YL}`}}>
        <h4 style={{margin:'0 0 8px',color:'#92400e'}}>📋 Credenciales de Responsables (demo)</h4>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
          <thead><tr>{['Departamento','Usuario','Contraseña'].map(h=><th key={h} style={{textAlign:'left',padding:'4px 6px',color:'#374151',borderBottom:'1px solid #fbbf24'}}>{h}</th>)}</tr></thead>
          <tbody>
            {USUARIOS.responsables.map(r=><tr key={r.user}><td style={{padding:'3px 6px',color:'#374151'}}>{r.nombre}</td><td style={{padding:'3px 6px',color:B,fontWeight:600}}>{r.user}</td><td style={{padding:'3px 6px',color:'#6b7280'}}>{r.pass}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// PENDIENTES (Responsable)
// ════════════════════════════════════════════════════════
function Pendientes({user,auditorias,setScreen,setSelected}) {
  const dept=user.dept;
  const resueltos=[];
  const pendientes=[];
  auditorias.forEach(a=>{
    Object.entries(a.segs||{}).forEach(([rid,seg])=>{
      if(!seg.dept||!seg.dept.includes(dept)) return;
      const rx=RX.find(r=>r.id===rid);
      const item={auditoria:a,rid,rx,seg};
      if(seg.resuelto) resueltos.push(item); else pendientes.push(item);
    });
  });
  return (
    <div style={{padding:'16px 14px 90px',background:'#f1f5f9',minHeight:'100dvh',fontFamily:'system-ui,sans-serif'}}>
      <h2 style={{margin:'0 0 16px',color:B}}>Mis Seguimientos</h2>
      {pendientes.length>0&&<h3 style={{color:RD,fontSize:14,margin:'0 0 10px'}}>⚠️ Pendientes ({pendientes.length})</h3>}
      {pendientes.map(({auditoria,rid,rx,seg},i)=>(
        <div key={i} onClick={()=>{setSelected({auditoria,rid,rx,seg});setScreen('seguimiento');}}
          style={{...card,cursor:'pointer',borderLeft:`4px solid ${RD}`}}>
          <span style={{background:RD,color:'white',fontSize:10,padding:'2px 6px',borderRadius:4,fontWeight:700}}>{rid}</span>
          <div style={{fontWeight:600,color:'#1f2937',fontSize:13,marginTop:4}}>{rx?.t}</div>
          <div style={{color:'#6b7280',fontSize:12}}>📍 {auditoria.sucursal} • {fmtDate(auditoria.fecha)}</div>
        </div>
      ))}
      {resueltos.length>0&&(
        <>
          <h3 style={{color:GR,fontSize:14,margin:'12px 0 10px'}}>✅ Resueltos ({resueltos.length})</h3>
          {resueltos.map(({auditoria,rid,rx,seg},i)=>(
            <div key={i} style={{...card,borderLeft:`4px solid ${GR}`,opacity:0.8}}>
              <span style={{background:GR,color:'white',fontSize:10,padding:'2px 6px',borderRadius:4,fontWeight:700}}>{rid}</span>
              <div style={{fontWeight:600,color:'#1f2937',fontSize:13,marginTop:4}}>{rx?.t}</div>
              <div style={{color:'#6b7280',fontSize:12}}>📍 {auditoria.sucursal} • Resuelto {fmtFull(seg.fechaRes)}</div>
            </div>
          ))}
        </>
      )}
      {pendientes.length===0&&resueltos.length===0&&<p style={{color:'#9ca3af',textAlign:'center'}}>Sin seguimientos asignados</p>}
    </div>
  );
}

// ════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════
export default function App() {
  const [user,setUser]=useState(null);
  const [screen,setScreen]=useState('home');
  const [auditorias,setAuditorias]=useState(DEMO);
  const [selected,setSelected]=useState(null);
  const [gasUrl,setGasUrl]=useState('');

  if(!user) return <Login onLogin={u=>{setUser(u);setScreen('home');}}/>;

  const common={user,auditorias,setAuditorias,selected,setSelected,setScreen,gasUrl};

  return (
    <div style={{fontFamily:'system-ui,-apple-system,sans-serif',maxWidth:640,margin:'0 auto',background:'#f1f5f9',minHeight:'100dvh'}}>
      <Header user={user} onLogout={()=>{setUser(null);setScreen('home');}}/>
      
      {user.role==='auditor'&&(
        <>
          {screen==='home'&&<AuditorDashboard {...common} setScreen={setScreen}/>}
          {screen==='nueva'&&<NuevaAuditoria {...common}/>}
          {screen==='lista'&&<Historial {...common} setSelected={setSelected}/>}
          {screen==='detalle'&&<DetalleAuditoria auditoria={selected} setScreen={setScreen}/>}
          {screen==='config'&&<Config gasUrl={gasUrl} setGasUrl={setGasUrl} setScreen={setScreen}/>}
        </>
      )}

      {user.role==='responsable'&&(
        <>
          {screen==='home'&&<ResponsableDashboard {...common}/>}
          {screen==='pendientes'&&<Pendientes {...common}/>}
          {screen==='seguimiento'&&<SeguimientoDetalle {...common}/>}
        </>
      )}

      <BottomNav screen={screen} setScreen={setScreen} role={user.role}/>
    </div>
  );
}
