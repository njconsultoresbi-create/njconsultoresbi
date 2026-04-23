/**
 * FARMACIAS DE APOYO — Sistema de Auditoría de Calidad
 * =====================================================
 * Stack: React + Hooks + Tailwind (core utilities)
 *
 * GOOGLE SHEETS SETUP:
 * --------------------
 * 1. Ve a https://script.google.com y crea un nuevo proyecto
 * 2. Pega el contenido de APPS_SCRIPT.gs (incluido al final como comentario)
 * 3. Despliega como Web App → "Ejecutar como: Yo" → "Acceso: Cualquiera"
 * 4. Copia la URL del despliegue y reemplaza SHEETS_URL abajo
 * 5. Crea una Google Spreadsheet con las hojas: Usuarios, Sucursales, Auditorias, Detalles, Pendientes
 *    (El Apps Script las inicializa automáticamente en el primer uso)
 *
 * APPS SCRIPT (pega esto en script.google.com):
 * Ver comentario al final del archivo → // ===== APPS SCRIPT =====
 */

import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbz4ySHF54YEQLRLpl0nEik4Ei5b-0roG_nQhuHSMsOK0VEx5FjXyZeQJWUIyOtgtVlE/exec";
const USE_LOCAL_FALLBACK = true; // true = funciona sin Sheets (modo demo)

// ─── DATOS MAESTROS ──────────────────────────────────────────────────────────
const SUCURSALES = [
  { id: "01", nombre: "CENTRO(01)" }, { id: "02", nombre: "MONUMENTO A LA MADRE(02)" },
  { id: "03", nombre: "PARQUE HIDALGO(03)" }, { id: "04", nombre: "LIBRAMIENTO-JUVENTUD(04)" },
  { id: "05", nombre: "MEGA(05)" }, { id: "06", nombre: "ANGELES(06)" },
  { id: "07", nombre: "ARCADIA(07)" }, { id: "08", nombre: "5 SUR Y 3 ORIENTE(08)" },
  { id: "09", nombre: "PORTALES(09)" }, { id: "10", nombre: "GARCI CRESPO(10)" },
  { id: "11", nombre: "HOSPITAL GENERAL(11)" }, { id: "12", nombre: "XOCHIPILLI(12)" },
  { id: "13", nombre: "EL MOLINO(13)" }, { id: "14", nombre: "MERCADO 16 DE MARZO(14)" },
  { id: "15", nombre: "VIA PUEBLA(15)" }, { id: "16", nombre: "SAN LORENZO(16)" },
  { id: "17", nombre: "REFORMA SUR(17)" }, { id: "18", nombre: "HOSPITAL DE LA MUJER(18)" },
  { id: "19", nombre: "LA JOYA(19)" }, { id: "20", nombre: "COAPAN(20)" },
  { id: "22", nombre: "MATRIZ CASA DEL MEDICO(22)" }, { id: "23", nombre: "AMADOR HERNANDEZ(23)" },
  { id: "24", nombre: "RAMON DIAZ(24)" }, { id: "25", nombre: "AJALPAN 01(25)" },
  { id: "26", nombre: "3 NORTE(26)" }, { id: "27", nombre: "AJALPAN 02(27)" },
  { id: "28", nombre: "TELMEX(28)" }, { id: "29", nombre: "REFORMA NORTE(29)" },
  { id: "30", nombre: "TECAMACHALCO 01(30)" }, { id: "31", nombre: "TECAMACHALCO 02(31)" },
  { id: "32", nombre: "TLACOTEPEC 01(32)" }, { id: "33", nombre: "ZINACATEPEC 01(33)" },
  { id: "34", nombre: "TLACOTEPEC 02(34)" }, { id: "35", nombre: "ZINACATEPEC 02(35)" },
  { id: "36", nombre: "1 PONIENTE(36)" },
];

const RESPONSABLES_LIST = [
  "MANTENIMIENTO", "OPERACIONES", "MERCADOTECNIA", "TI",
  "COMERCIALIZACIÓN", "CAPITAL HUMANO", "INSUMOS", "COMISIÓN S&H",
];

const REACTIVOS = [
  { id: "R-001", num: "1.01", seccion: "FRENTE SUCURSAL", texto: "Cortinas / rejas limpias", responsable: "MANTENIMIENTO" },
  { id: "R-002", num: "1.02", seccion: "FRENTE SUCURSAL", texto: "Toldos limpios y en buen estado", responsable: "MANTENIMIENTO" },
  { id: "R-003", num: "1.03", seccion: "FRENTE SUCURSAL", texto: "Paredes externas limpias y con pintura en buen estado", responsable: "MANTENIMIENTO" },
  { id: "R-004", num: "1.04", seccion: "FRENTE SUCURSAL", texto: "Luces y lámparas de calle funcionales", responsable: "MANTENIMIENTO" },
  { id: "R-005", num: "1.05", seccion: "FRENTE SUCURSAL", texto: "Anuncios luminosos funcionales (marquesinas, reflectores, botones)", responsable: "MANTENIMIENTO" },
  { id: "R-006", num: "1.06", seccion: "FRENTE SUCURSAL", texto: "Banquetas limpias", responsable: "OPERACIONES" },
  { id: "R-007", num: "1.07", seccion: "FRENTE SUCURSAL", texto: "Carteles de canceles vigentes y en buen estado", responsable: "MERCADOTECNIA" },
  { id: "R-008", num: "1.08", seccion: "FRENTE SUCURSAL", texto: "Carteles que estorban y/o ajenos a la empresa", responsable: "MERCADOTECNIA" },
  { id: "R-009", num: "1.09", seccion: "FRENTE SUCURSAL", texto: "Canceles en buen estado y con vidrios limpios", responsable: "OPERACIONES" },
  { id: "R-010", num: "1.10", seccion: "FRENTE SUCURSAL", texto: "Ventanilla cierra correctamente", responsable: "MANTENIMIENTO" },
  { id: "R-011", num: "1.11", seccion: "FRENTE SUCURSAL", texto: "Accesos (escalones y rampas) en buen estado y delimitadas con pintura amarilla", responsable: "MANTENIMIENTO" },
  { id: "R-012", num: "1.12", seccion: "FRENTE SUCURSAL", texto: "Señalamiento de protección civil en piso", responsable: "MANTENIMIENTO" },
  { id: "R-013", num: "1.13", seccion: "FRENTE SUCURSAL", texto: "Cajones de estacionamiento con delimitaciones visibles", responsable: "MANTENIMIENTO" },
  { id: "R-014", num: "1.14", seccion: "FRENTE SUCURSAL", texto: "Cuenta con micrófono para atender por ventanilla y este funciona correctamente", responsable: "TI" },
  { id: "R-015", num: "2.01", seccion: "PISO DE VENTA", texto: "Piso de venta limpio", responsable: "OPERACIONES" },
  { id: "R-016", num: "2.02", seccion: "PISO DE VENTA", texto: "Mostradores limpios y llenos", responsable: "OPERACIONES" },
  { id: "R-017", num: "2.03", seccion: "PISO DE VENTA", texto: "Apagadores y contactos funcionales y en buenas condiciones", responsable: "MANTENIMIENTO" },
  { id: "R-018", num: "2.04", seccion: "PISO DE VENTA", texto: "Lámparas y cajas de luz en piso de venta limpias y funcionales", responsable: "MANTENIMIENTO" },
  { id: "R-019", num: "2.05", seccion: "PISO DE VENTA", texto: "Ventiladores en piso de venta limpios y funcionales", responsable: "MANTENIMIENTO" },
  { id: "R-020", num: "2.06", seccion: "PISO DE VENTA", texto: "Producto frenteado y sin huecos", responsable: "OPERACIONES" },
  { id: "R-021", num: "2.07", seccion: "PISO DE VENTA", texto: "Cuentan con planograma impreso y coincide con acomodo en farmacia", responsable: "MERCADOTECNIA" },
  { id: "R-022", num: "2.08", seccion: "PISO DE VENTA", texto: "Sensor en puerta de acceso instalado y funcionando", responsable: "MANTENIMIENTO" },
  { id: "R-023", num: "2.09", seccion: "PISO DE VENTA", texto: "Clima limpio y funcionando correctamente", responsable: "MANTENIMIENTO" },
  { id: "R-024", num: "2.10", seccion: "PISO DE VENTA", texto: "Cortina de aire limpia y funcionando correctamente", responsable: "MANTENIMIENTO" },
  { id: "R-025", num: "2.11", seccion: "PISO DE VENTA", texto: "Publicidad vigente en parte externa de punto de venta y mostradores", responsable: "MERCADOTECNIA" },
  { id: "R-026", num: "3.01", seccion: "EXHIBICIÓN", texto: "PEPS / PCPS en toda el área de exhibición", responsable: "OPERACIONES" },
  { id: "R-027", num: "3.02", seccion: "EXHIBICIÓN", texto: "Refrigerador de bebidas lleno, acomodado, frenteado", responsable: "OPERACIONES" },
  { id: "R-028", num: "3.03", seccion: "EXHIBICIÓN", texto: "Refrigerador de bebidas funcional, enfriando correctamente", responsable: "COMERCIALIZACIÓN" },
  { id: "R-029", num: "3.04", seccion: "EXHIBICIÓN", texto: "Refrigerador de bebidas con portacandado y candado", responsable: "MANTENIMIENTO" },
  { id: "R-030", num: "3.05", seccion: "EXHIBICIÓN", texto: "Refrigerador de helados lleno y acomodado", responsable: "OPERACIONES" },
  { id: "R-031", num: "3.06", seccion: "EXHIBICIÓN", texto: "Refrigerador de helados limpio y sin escarcha", responsable: "COMERCIALIZACIÓN" },
  { id: "R-032", num: "3.07", seccion: "EXHIBICIÓN", texto: "Rack de snacks lleno, acomodado y sin polvo sobre el producto", responsable: "OPERACIONES" },
  { id: "R-033", num: "3.08", seccion: "EXHIBICIÓN", texto: "Puertas de acceso a la dispensación funcionales y con rótulo", responsable: "MANTENIMIENTO" },
  { id: "R-034", num: "3.09", seccion: "EXHIBICIÓN", texto: "Gondolas y botaderos limpios, llenos y con producto acomodado", responsable: "OPERACIONES" },
  { id: "R-035", num: "3.10", seccion: "EXHIBICIÓN", texto: "Vitrinas limpias, llenas, con puertas y chapas funcionales", responsable: "OPERACIONES" },
  { id: "R-036", num: "3.11", seccion: "EXHIBICIÓN", texto: "Pantallas de TV y letrero LED encendidos y con publicidad vigente", responsable: "OPERACIONES" },
  { id: "R-037", num: "3.12", seccion: "EXHIBICIÓN", texto: "Regletas en góndolas pegadas correctamente y sin dañar el producto", responsable: "MERCADOTECNIA" },
  { id: "R-038", num: "3.13", seccion: "EXHIBICIÓN", texto: "Precios en regletas de góndolas actualizados", responsable: "OPERACIONES" },
  { id: "R-039", num: "4.01", seccion: "ÁREA DE FARMACIA", texto: "Acomodo general aplicando PEPS / PCPS en área de farmacia", responsable: "OPERACIONES" },
  { id: "R-040", num: "4.02", seccion: "ÁREA DE FARMACIA", texto: "Acomodo en cajoneras por abecedario y aplicando 'Z'", responsable: "OPERACIONES" },
  { id: "R-041", num: "4.03", seccion: "ÁREA DE FARMACIA", texto: "No se encontraron productos en el piso, cuentan con tarimas", responsable: "OPERACIONES" },
  { id: "R-042", num: "4.04", seccion: "ÁREA DE FARMACIA", texto: "Área de comunicados", responsable: "OPERACIONES" },
  { id: "R-043", num: "4.05", seccion: "ÁREA DE FARMACIA", texto: "Controlados", responsable: "OPERACIONES" },
  { id: "R-044", num: "4.06", seccion: "ÁREA DE FARMACIA", texto: "Punto de venta limpio, en orden y cuenta con tapete ergonómico y silla", responsable: "OPERACIONES" },
  { id: "R-045", num: "4.07", seccion: "ÁREA DE FARMACIA", texto: "Cuadros de registros oficiales", responsable: "OPERACIONES" },
  { id: "R-046", num: "4.08", seccion: "ÁREA DE FARMACIA", texto: "Refrigerador medicamentos", responsable: "OPERACIONES" },
  { id: "R-047", num: "4.09", seccion: "ÁREA DE FARMACIA", texto: "Registro de temperatura y humedad en bitácora", responsable: "OPERACIONES" },
  { id: "R-048", num: "4.10", seccion: "ÁREA DE FARMACIA", texto: "Identificación de áreas (Señalética naranja y cabeceras de padecimientos)", responsable: "MERCADOTECNIA" },
  { id: "R-049", num: "4.11", seccion: "ÁREA DE FARMACIA", texto: "Registro de proveedores en bitácora", responsable: "OPERACIONES" },
  { id: "R-050", num: "4.12", seccion: "ÁREA DE FARMACIA", texto: "Registro de limpieza de refrigerador en bitácora de actividades", responsable: "OPERACIONES" },
  { id: "R-051", num: "4.13", seccion: "ÁREA DE FARMACIA", texto: "Cuentan con separadores funcionales para jaraberas y cajoneras", responsable: "MERCADOTECNIA" },
  { id: "R-052", num: "4.14", seccion: "ÁREA DE FARMACIA", texto: "Viniles publicitarios en jaraberas en buen estado y con publicidad vigente", responsable: "MERCADOTECNIA" },
  { id: "R-053", num: "4.15", seccion: "ÁREA DE FARMACIA", texto: "Repisas cuentan con regletas indicadoras de padecimiento en buen estado", responsable: "MERCADOTECNIA" },
  { id: "R-054", num: "4.16", seccion: "ÁREA DE FARMACIA", texto: "Repisas en buen estado y funcionales", responsable: "MANTENIMIENTO" },
  { id: "R-055", num: "4.17", seccion: "ÁREA DE FARMACIA", texto: "Exhibipanel en buen estado y funcional", responsable: "MANTENIMIENTO" },
  { id: "R-056", num: "4.18", seccion: "ÁREA DE FARMACIA", texto: "Muebles de punto de venta en buen estado", responsable: "MANTENIMIENTO" },
  { id: "R-057", num: "4.19", seccion: "ÁREA DE FARMACIA", texto: "Puertas de mostradores en buen estado, funcionales y con manijas", responsable: "MANTENIMIENTO" },
  { id: "R-058", num: "4.20", seccion: "ÁREA DE FARMACIA", texto: "Cajas de cobro de punto de venta son funcionales y cuentan con llave", responsable: "TI" },
  { id: "R-059", num: "4.21", seccion: "ÁREA DE FARMACIA", texto: "Anaqueles en buen estado y funcionales", responsable: "MANTENIMIENTO" },
  { id: "R-060", num: "5.01", seccion: "ATRÁS DE FARMACIA", texto: "Área bodega limpia y en orden", responsable: "OPERACIONES" },
  { id: "R-061", num: "5.02", seccion: "ATRÁS DE FARMACIA", texto: "Baños limpios y funcionales", responsable: "OPERACIONES" },
  { id: "R-062", num: "5.03", seccion: "ATRÁS DE FARMACIA", texto: "Baño cuenta con dispensadores de jabón, papel higiénico y toallas", responsable: "OPERACIONES" },
  { id: "R-063", num: "5.04", seccion: "ATRÁS DE FARMACIA", texto: "Baño cuenta con tapa en cesto y en inodoro", responsable: "OPERACIONES" },
  { id: "R-064", num: "5.05", seccion: "ATRÁS DE FARMACIA", texto: "Objetos ajenos a la farmacia (lockers)", responsable: "OPERACIONES" },
  { id: "R-065", num: "5.06", seccion: "ATRÁS DE FARMACIA", texto: "Pisos limpios, sin merma de plástico ni cartón", responsable: "OPERACIONES" },
  { id: "R-066", num: "5.07", seccion: "ATRÁS DE FARMACIA", texto: "Área de alimentos: mesa, silla, horno y piso limpios", responsable: "OPERACIONES" },
  { id: "R-067", num: "5.08", seccion: "ATRÁS DE FARMACIA", texto: "Anaqueles en buen estado y funcionales", responsable: "MANTENIMIENTO" },
  { id: "R-068", num: "5.09", seccion: "ATRÁS DE FARMACIA", texto: "Paredes / techos con humedad, goteras o huecos", responsable: "MANTENIMIENTO" },
  { id: "R-069", num: "5.10", seccion: "ATRÁS DE FARMACIA", texto: "Pisos, escaleras, barandales o pilares con óxido", responsable: "MANTENIMIENTO" },
  { id: "R-070", num: "5.11", seccion: "ATRÁS DE FARMACIA", texto: "Escalones funcionales, en buen estado, con barandal y cintas antiderrapantes", responsable: "MANTENIMIENTO" },
  { id: "R-071", num: "5.12", seccion: "ATRÁS DE FARMACIA", texto: "Extractores de aire limpios y funcionales", responsable: "MANTENIMIENTO" },
  { id: "R-072", num: "5.13", seccion: "ATRÁS DE FARMACIA", texto: "Cuentan con mesa para recepción de mercancía", responsable: "OPERACIONES" },
  { id: "R-073", num: "5.14", seccion: "ATRÁS DE FARMACIA", texto: "Olor a drenaje", responsable: "MANTENIMIENTO" },
  { id: "R-074", num: "6.01", seccion: "PERSONAL DE SUCURSAL", texto: "Bata", responsable: "OPERACIONES" },
  { id: "R-075", num: "6.02", seccion: "PERSONAL DE SUCURSAL", texto: "Gafete", responsable: "OPERACIONES" },
  { id: "R-076", num: "6.03", seccion: "PERSONAL DE SUCURSAL", texto: "Cabello corto o recogido", responsable: "OPERACIONES" },
  { id: "R-077", num: "6.04", seccion: "PERSONAL DE SUCURSAL", texto: "Manos (uñas cortas, sin barniz o transparente)", responsable: "OPERACIONES" },
  { id: "R-078", num: "6.05", seccion: "PERSONAL DE SUCURSAL", texto: "Zapatos negros limpios", responsable: "OPERACIONES" },
  { id: "R-079", num: "6.06", seccion: "PERSONAL DE SUCURSAL", texto: "Pantalón azul marino", responsable: "OPERACIONES" },
  { id: "R-080", num: "7.01", seccion: "CALIDAD EN EL SERVICIO", texto: "Protocolo de bienvenida y despedida", responsable: "OPERACIONES" },
  { id: "R-081", num: "7.02", seccion: "CALIDAD EN EL SERVICIO", texto: "Conversación y empatía con los clientes", responsable: "OPERACIONES" },
  { id: "R-082", num: "7.03", seccion: "CALIDAD EN EL SERVICIO", texto: "Preguntar necesidades, respetar receta médica", responsable: "OPERACIONES" },
  { id: "R-083", num: "7.04", seccion: "CALIDAD EN EL SERVICIO", texto: "Verifica existencia y surte los productos requeridos", responsable: "OPERACIONES" },
  { id: "R-084", num: "7.05", seccion: "CALIDAD EN EL SERVICIO", texto: "Ofrecer transferencias en caso de no tener en sucursal", responsable: "OPERACIONES" },
  { id: "R-085", num: "7.06", seccion: "CALIDAD EN EL SERVICIO", texto: "Ofrece venta cruzada y promueve ofertas del día", responsable: "OPERACIONES" },
  { id: "R-086", num: "7.07", seccion: "CALIDAD EN EL SERVICIO", texto: "Pregunta al cliente si lo puede apoyar en algo más", responsable: "OPERACIONES" },
  { id: "R-087", num: "7.08", seccion: "CALIDAD EN EL SERVICIO", texto: "Siempre que presentan receta se registra con F8", responsable: "OPERACIONES" },
  { id: "R-088", num: "7.09", seccion: "CALIDAD EN EL SERVICIO", texto: "Pregunta amablemente la forma de pago", responsable: "OPERACIONES" },
  { id: "R-089", num: "7.10", seccion: "CALIDAD EN EL SERVICIO", texto: "Informar al cliente el monto recibido y forma de pago", responsable: "OPERACIONES" },
  { id: "R-090", num: "7.11", seccion: "CALIDAD EN EL SERVICIO", texto: "Informar al cliente la cantidad que se está entregando de cambio", responsable: "OPERACIONES" },
  { id: "R-091", num: "7.12", seccion: "CALIDAD EN EL SERVICIO", texto: "Si el cliente requiere factura, imprimir o enviar al correo", responsable: "OPERACIONES" },
  { id: "R-092", num: "7.13", seccion: "CALIDAD EN EL SERVICIO", texto: "Informa amablemente que va a retener la receta y ofrece servicio de copias", responsable: "OPERACIONES" },
  { id: "R-093", num: "7.14", seccion: "CALIDAD EN EL SERVICIO", texto: "Banners publicitarios en PHARMACY con publicidad vigente", responsable: "MERCADOTECNIA" },
  { id: "R-094", num: "7.15", seccion: "CALIDAD EN EL SERVICIO", texto: "Cuenta con ayuda visual con las claves de Planes de Lealtad", responsable: "MERCADOTECNIA" },
  { id: "R-095", num: "8.01", seccion: "CONTROL Y ORGANIZACIÓN", texto: "Aperturas y cierres", responsable: "OPERACIONES" },
  { id: "R-096", num: "8.02", seccion: "CONTROL Y ORGANIZACIÓN", texto: "Seguimiento a indicaciones", responsable: "OPERACIONES" },
  { id: "R-097", num: "8.03", seccion: "CONTROL Y ORGANIZACIÓN", texto: "Personal completo", responsable: "CAPITAL HUMANO" },
  { id: "R-098", num: "8.04", seccion: "CONTROL Y ORGANIZACIÓN", texto: "Bitácora de Registro de Valores al día y debidamente requisitada", responsable: "OPERACIONES" },
  { id: "R-099", num: "8.05", seccion: "CONTROL Y ORGANIZACIÓN", texto: "Bitácora de Mantenimiento colocada en un lugar visible", responsable: "OPERACIONES" },
  { id: "R-100", num: "8.06", seccion: "CONTROL Y ORGANIZACIÓN", texto: "Bitácora de Actividades al día y debidamente requisitada", responsable: "OPERACIONES" },
  { id: "R-101", num: "8.07", seccion: "CONTROL Y ORGANIZACIÓN", texto: "Bitácora de Mantenimiento de refrigerador de medicamento", responsable: "OPERACIONES" },
  { id: "R-102", num: "9.01", seccion: "CONOCIMIENTO Y CAPACITACIÓN", texto: "Personal certificado SICAD", responsable: "OPERACIONES" },
  { id: "R-103", num: "9.02", seccion: "CONOCIMIENTO Y CAPACITACIÓN", texto: "Conocimiento y aplicación PNO", responsable: "OPERACIONES" },
  { id: "R-104", num: "9.03", seccion: "CONOCIMIENTO Y CAPACITACIÓN", texto: "Conocimiento y destreza PHARMACYSOFT", responsable: "OPERACIONES" },
  { id: "R-105", num: "10.01", seccion: "ACONDICIONAMIENTO PERSONAL", texto: "Señalamiento protección civil colocado y en buen estado", responsable: "CAPITAL HUMANO" },
  { id: "R-106", num: "10.02", seccion: "ACONDICIONAMIENTO PERSONAL", texto: "Cuentan con botiquín e insumos para este", responsable: "CAPITAL HUMANO" },
  { id: "R-107", num: "10.03", seccion: "ACONDICIONAMIENTO PERSONAL", texto: "Extintores con carga vigente e instalados correctamente", responsable: "CAPITAL HUMANO" },
  { id: "R-108", num: "10.04", seccion: "ACONDICIONAMIENTO PERSONAL", texto: "Lockers suficientes de acuerdo al número de operadores", responsable: "OPERACIONES" },
  { id: "R-109", num: "10.05", seccion: "ACONDICIONAMIENTO PERSONAL", texto: "Cuentan con garrafones de agua y portagarrafón", responsable: "OPERACIONES" },
  { id: "R-110", num: "10.06", seccion: "ACONDICIONAMIENTO PERSONAL", texto: "Cuentan con faja para la carga segura de cajas", responsable: "CAPITAL HUMANO" },
  { id: "R-111", num: "10.07", seccion: "ACONDICIONAMIENTO PERSONAL", texto: "Cuentan con cestas, carrito de carga / diablo de carga o patín", responsable: "OPERACIONES" },
  { id: "R-112", num: "10.08", seccion: "ACONDICIONAMIENTO PERSONAL", texto: "Cuentan con escaleras de aluminio funcionales y en buen estado", responsable: "OPERACIONES" },
];

// ─── USUARIOS DEMO ───────────────────────────────────────────────────────────
const DEMO_USERS = [
  { id: "U1", nombre: "JESUS MENDEZ GUTIERREZ", user: "auditor1", pass: "jemegu12", rol: "auditor" },
  { id: "U2", nombre: "ANDREA DE JESUS CAMPILLO ROMERO", user: "auditor2", pass: "anjeca34", rol: "auditor" },
  { id: "U3", nombre: "LUIS ARTURO FERNANDEZ OCAMPO", user: "auditor3", pass: "luarfe56", rol: "auditor" },
  { id: "U4", nombre: "Dept. Mantenimiento", user: "mant", pass: "mant*2026", rol: "responsable", dept: "MANTENIMIENTO" },
  { id: "U5", nombre: "Dept. Operaciones", user: "oper", pass: "oper*2026", rol: "responsable", dept: "OPERACIONES" },
  { id: "U6", nombre: "Dept. Mercadotecnia", user: "mktg", pass: "merca*2026", rol: "responsable", dept: "MERCADOTECNIA" },
  { id: "U7", nombre: "Dept. TI", user: "ti", pass: "ti*2026", rol: "responsable", dept: "TI" },
  { id: "U8", nombre: "Administrador", user: "admin", pass: "admin*2026", rol: "auditor" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const today = () => new Date().toISOString().split("T")[0];
const nowISO = () => new Date().toISOString();
const fmt = (iso) => iso ? new Date(iso).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtFull = (iso) => iso ? new Date(iso).toLocaleString("es-MX") : "—";
const diasDesde = (iso) => {
  if (!iso) return 0;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
};
const pctColor = (p) => p >= 85 ? "#00C875" : p >= 60 ? "#FFD32A" : "#FF4757";

// ─── GOOGLE SHEETS API ───────────────────────────────────────────────────────
const SheetsAPI = {
  async call(action, payload = {}) {
    if (!SHEETS_URL || SHEETS_URL.includes("TU_URL_AQUI")) return null;
    try {
      const res = await fetch(SHEETS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ action, ...payload }),
      });
      return await res.json();
    } catch {
      return null;
    }
  },
  saveAuditoria: (data) => SheetsAPI.call("saveAuditoria", data),
  savePendiente: (data) => SheetsAPI.call("savePendiente", data),
  updatePendiente: (data) => SheetsAPI.call("updatePendiente", data),
  getAll: () => SheetsAPI.call("getAll"),
};

// ─── LOCAL STORAGE DB ────────────────────────────────────────────────────────
const DB = {
  get: (k) => JSON.parse(localStorage.getItem("fa_" + k) || "[]"),
  set: (k, v) => localStorage.setItem("fa_" + k, JSON.stringify(v)),
  getAuditorias: () => DB.get("auditorias"),
  setAuditorias: (v) => DB.set("auditorias", v),
  getPendientes: () => DB.get("pendientes"),
  setPendientes: (v) => DB.set("pendientes", v),
};

// ─── ESTILOS INLINE ──────────────────────────────────────────────────────────
const GS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html,body{height:100%;background:#080C10;color:#E2E8F0;font-family:'DM Sans',sans-serif;}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:#0D1117;}
::-webkit-scrollbar-thumb{background:#2D3748;border-radius:3px;}
textarea,input,select{font-family:'DM Sans',sans-serif;}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes slideRight{from{transform:translateX(-100%)}to{transform:translateX(0)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
.fade-up{animation:fadeUp .35s ease both}
.fade-in{animation:fadeIn .25s ease both}
.spin{animation:spin 1s linear infinite}
.pulse{animation:pulse 2s ease infinite}
`;

// ─── COMPONENTES PEQUEÑOS ────────────────────────────────────────────────────
const Badge = ({ children, color = "#00C875", bg }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
    letterSpacing: ".5px", textTransform: "uppercase",
    background: bg || color + "22", color,
  }}>{children}</span>
);

const Chip = ({ label, value, color = "#8B949E" }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
    <span style={{ fontSize: 10, color: "#8B949E", textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
    <span style={{ fontSize: 14, color, fontWeight: 600 }}>{value}</span>
  </div>
);

const Spinner = () => (
  <div style={{ width: 20, height: 20, border: "2px solid #2D3748", borderTopColor: "#00C875", borderRadius: "50%" }} className="spin" />
);

const Toast = ({ toasts }) => (
  <div style={{ position: "fixed", top: 72, right: 16, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
    {toasts.map((t) => (
      <div key={t.id} className="fade-up" style={{
        background: "#161B22", border: `1px solid ${t.color || "#00C875"}`,
        borderLeft: `3px solid ${t.color || "#00C875"}`, borderRadius: 10,
        padding: "12px 18px", fontSize: 13, minWidth: 260, boxShadow: "0 8px 32px #00000060",
      }}>{t.msg}</div>
    ))}
  </div>
);

const KpiCard = ({ label, value, sub, accent = "#00C875", icon }) => (
  <div style={{
    background: "#0D1117", border: "1px solid #1E2530", borderRadius: 14,
    padding: "20px 22px", position: "relative", overflow: "hidden",
  }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: accent }} />
    <div style={{ fontSize: 11, color: "#8B949E", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>{label}</div>
    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 36, fontWeight: 800, color: "#E2E8F0", lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: "#8B949E", marginTop: 6 }}>{sub}</div>}
    <div style={{ position: "absolute", bottom: 12, right: 16, fontSize: 28, opacity: .12 }}>{icon}</div>
  </div>
);

const Btn = ({ onClick, children, variant = "primary", style = {}, disabled = false, small = false }) => {
  const base = {
    border: "none", cursor: disabled ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif",
    fontWeight: 600, borderRadius: 8, transition: "all .15s", opacity: disabled ? .5 : 1,
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: small ? "6px 14px" : "11px 22px", fontSize: small ? 12 : 14,
  };
  const variants = {
    primary: { background: "#00C875", color: "#000" },
    danger: { background: "#FF475722", color: "#FF4757", border: "1px solid #FF475740" },
    ghost: { background: "transparent", color: "#8B949E", border: "1px solid #1E2530" },
    blue: { background: "#1E90FF22", color: "#1E90FF", border: "1px solid #1E90FF40" },
    warning: { background: "#FFD32A22", color: "#FFD32A", border: "1px solid #FFD32A40" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

// ─── FOTO EVIDENCIA ──────────────────────────────────────────────────────────
const FotoEvidencia = ({ fotoB64, onCapture }) => {
  const inputRef = useRef();
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onCapture(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
      <input ref={inputRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: "none" }} />
      {fotoB64 ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={fotoB64} alt="evidencia" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, border: "2px solid #00C87560" }} />
          <Btn small variant="ghost" onClick={() => { onCapture(null); }}>✕ Quitar</Btn>
          <Btn small variant="ghost" onClick={() => inputRef.current.click()}>📷 Cambiar</Btn>
        </div>
      ) : (
        <Btn small variant="ghost" onClick={() => inputRef.current.click()}>📷 Foto de evidencia</Btn>
      )}
    </div>
  );
};

// ─── MODAL ───────────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children, width = 700 }) => {
  if (!open) return null;
  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0, background: "#000000BB", zIndex: 800,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div className="fade-up" style={{
        background: "#0D1117", border: "1px solid #1E2530", borderRadius: 16,
        width: "100%", maxWidth: width, maxHeight: "90vh", overflow: "auto",
        padding: 28, boxShadow: "0 24px 60px #00000080",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#8B949E", cursor: "pointer", fontSize: 22, lineHeight: 1, transition: "color .15s" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#FF4757"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#8B949E"}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ─── LOGIN ───────────────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin }) => {
  const [tab, setTab] = useState("auditor");
  const [form, setForm] = useState({ user: "", pass: "" });
  const [err, setErr] = useState("");

  const handle = () => {
    const found = DEMO_USERS.find((u) => u.user === form.user && u.pass === form.pass && u.rol === tab);
    if (!found) { setErr("Usuario o contraseña incorrectos."); return; }
    setErr("");
    onLogin(found);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#080C10", padding: 16 }}>
      <style>{GS}</style>
      {/* BG decoration */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "20%", left: "10%", width: 500, height: 500, background: "radial-gradient(circle, #00C87510 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 400, height: 400, background: "radial-gradient(circle, #1E90FF08 0%, transparent 70%)", borderRadius: "50%" }} />
      </div>
      <div className="fade-up" style={{ background: "#0D1117", border: "1px solid #1E2530", borderRadius: 18, padding: 40, width: 420, maxWidth: "95vw", position: "relative", boxShadow: "0 0 80px #00C87515" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🏥</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: "#00C875", letterSpacing: 1.5 }}>FARMACIAS DE APOYO</div>
          <div style={{ fontSize: 12, color: "#8B949E", marginTop: 4, letterSpacing: 1 }}>SISTEMA DE AUDITORÍA DE CALIDAD</div>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", background: "#080C10", borderRadius: 10, padding: 4, marginBottom: 24, gap: 4 }}>
          {["auditor", "responsable"].map((t) => (
            <button key={t} onClick={() => { setTab(t); setForm({ user: "", pass: "" }); setErr(""); }} style={{
              flex: 1, padding: "9px 0", borderRadius: 8, border: "none", cursor: "pointer",
              background: tab === t ? "#00C875" : "transparent",
              color: tab === t ? "#000" : "#8B949E",
              fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, transition: "all .2s", textTransform: "capitalize",
            }}>{t === "auditor" ? "🔍 Auditor" : "🔧 Responsable"}</button>
          ))}
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, color: "#8B949E", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Usuario</label>
          <input value={form.user} onChange={(e) => setForm({ ...form, user: e.target.value })}
            placeholder={tab === "auditor" ? "auditor1 / auditor2 / admin" : "mant / oper / mktg / ti"}
            style={{ width: "100%", background: "#080C10", border: "1px solid #1E2530", color: "#E2E8F0", padding: "11px 14px", borderRadius: 8, fontSize: 14, transition: "border-color .2s", outline: "none" }}
            onFocus={(e) => e.target.style.borderColor = "#00C875"} onBlur={(e) => e.target.style.borderColor = "#1E2530"}
          />
        </div>
        <div style={{ marginBottom: 6 }}>
          <label style={{ display: "block", fontSize: 11, color: "#8B949E", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Contraseña</label>
          <input type="password" value={form.pass} onChange={(e) => setForm({ ...form, pass: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handle()} placeholder="••••••••"
            style={{ width: "100%", background: "#080C10", border: "1px solid #1E2530", color: "#E2E8F0", padding: "11px 14px", borderRadius: 8, fontSize: 14, transition: "border-color .2s", outline: "none" }}
            onFocus={(e) => e.target.style.borderColor = "#00C875"} onBlur={(e) => e.target.style.borderColor = "#1E2530"}
          />
        </div>
        {err && <div style={{ color: "#FF4757", fontSize: 12, marginBottom: 12, marginTop: 8 }}>⚠ {err}</div>}
        <Btn onClick={handle} style={{ width: "100%", marginTop: 16, justifyContent: "center", fontSize: 15, padding: "13px 0" }}>
          Entrar al Sistema →
        </Btn>
        <div style={{ marginTop: 20, background: "#080C10", borderRadius: 8, padding: 12, fontSize: 11, color: "#8B949E" }}>
          <strong style={{ color: "#4A5568" }}>DEMO —</strong> Auditores: <strong>auditor1</strong> o <strong>auditor2</strong> / Responsables: <strong>mant</strong>, <strong>oper</strong>, <strong>mktg</strong>, <strong>ti</strong> — contraseña: <strong>1234</strong>
        </div>
      </div>
    </div>
  );
};

// ─── HEADER + NAV ────────────────────────────────────────────────────────────
const AppHeader = ({ user, page, setPage, pendientesCount, onLogout, onRefresh, refreshing }) => {
  const navItems = user.rol === "auditor"
    ? [
        { id: "dashboard", label: "Dashboard", icon: "📊" },
        { id: "nueva", label: "Nueva Auditoría", icon: "➕" },
        { id: "historial", label: "Historial", icon: "📋" },
        { id: "pendientes-auditor", label: `Pendientes${pendientesCount > 0 ? ` (${pendientesCount})` : ""}`, icon: "⚠️" },
        { id: "incidencias", label: "Incidencias NO", icon: "❌" },
      ]
    : [
        { id: "pendientes-resp", label: `Mis Pendientes${pendientesCount > 0 ? ` (${pendientesCount})` : ""}`, icon: "🔧" },
        { id: "resueltos-resp", label: "Resueltos", icon: "✅" },
      ];

  return (
    <>
      <header style={{
        background: "#0D1117", borderBottom: "1px solid #1E2530",
        padding: "0 20px", height: 58, display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 200,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🏥</span>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 800, color: "#00C875", letterSpacing: 1 }}>FARMACIAS DE APOYO</span>
          <span style={{ fontSize: 11, color: "#2D3748", marginLeft: 4 }}>|</span>
          <span style={{ fontSize: 11, color: "#8B949E", letterSpacing: .5 }}>Auditoría de Calidad</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {pendientesCount > 0 && (
            <div className="pulse" style={{ background: "#FF475722", color: "#FF4757", border: "1px solid #FF475740", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
              {pendientesCount} pendiente{pendientesCount > 1 ? "s" : ""}
            </div>
          )}
          {/* Botón de actualización */}
          <button
            onClick={onRefresh}
            disabled={refreshing}
            title="Actualizar datos desde todos los dispositivos"
            style={{
              background: refreshing ? "#00C87515" : "transparent",
              border: `1px solid ${refreshing ? "#00C87540" : "#1E2530"}`,
              color: refreshing ? "#00C875" : "#8B949E",
              width: 34, height: 34, borderRadius: 8, cursor: refreshing ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, transition: "all .2s", flexShrink: 0,
            }}
            onMouseEnter={(e) => { if (!refreshing) { e.currentTarget.style.borderColor = "#00C875"; e.currentTarget.style.color = "#00C875"; } }}
            onMouseLeave={(e) => { if (!refreshing) { e.currentTarget.style.borderColor = "#1E2530"; e.currentTarget.style.color = "#8B949E"; } }}
          >
            <span style={{ display: "inline-block", animation: refreshing ? "spin 1s linear infinite" : "none" }}>↻</span>
          </button>
          <div style={{ background: "#161B22", padding: "6px 14px", borderRadius: 20, fontSize: 12, color: "#8B949E", display: "flex", alignItems: "center", gap: 6 }}>
            {user.rol === "auditor" ? "🔍" : "🔧"} <span style={{ color: "#E2E8F0", fontWeight: 500 }}>{user.nombre}</span>
          </div>
          <Btn variant="ghost" small onClick={onLogout}>Salir</Btn>
        </div>
      </header>
      <nav style={{ background: "#0D1117", borderBottom: "1px solid #1E2530", padding: "0 16px", display: "flex", gap: 2, overflowX: "auto" }}>
        {navItems.map((n) => {
          const active = page === n.id;
          const hasBadge = n.label.includes("Pendientes") && pendientesCount > 0;
          return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              background: "none", border: "none", color: active ? "#00C875" : "#8B949E",
              padding: "13px 16px", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif",
              fontWeight: active ? 600 : 400, borderBottom: `2px solid ${active ? "#00C875" : "transparent"}`,
              display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", transition: "all .2s",
            }}>
              <span>{n.icon}</span>
              <span>{n.label}</span>
              {hasBadge && <span style={{ background: "#FF4757", color: "#fff", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>{pendientesCount}</span>}
            </button>
          );
        })}
      </nav>
    </>
  );
};

// ─── NUEVA AUDITORÍA ─────────────────────────────────────────────────────────
const NuevaAuditoria = ({ user, auditToEdit, onSaved, toast }) => {
  const [meta, setMeta] = useState({ sucursalId: "", auditor: user.nombre, fecha: today() });
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);
  // Secciones expandidas/contraídas: empieza con la primera expandida, resto contraídas
  const allSecciones = [...new Set(REACTIVOS.map((r) => r.seccion))];
  const [expanded, setExpanded] = useState(() => {
    const init = {};
    allSecciones.forEach((s, i) => { init[s] = i === 0; });
    return init;
  });
  const toggleSeccion = (sec) => setExpanded((prev) => ({ ...prev, [sec]: !prev[sec] }));

  useEffect(() => {
    if (auditToEdit) {
      setMeta({ sucursalId: auditToEdit.sucursalId, auditor: auditToEdit.auditor, fecha: auditToEdit.fecha });
      const ans = {};
      auditToEdit.detalle.forEach((d) => { ans[d.idReactivo] = { resp: d.resp, obs: d.obs, foto: d.foto || null }; });
      setAnswers(ans);
    }
  }, [auditToEdit]);

  const secciones = allSecciones;
  // Progreso global: excluye N/A del total y del conteo
  const totalEval = REACTIVOS.filter((r) => answers[r.id]?.resp !== "NA").length;
  const done = REACTIVOS.filter((r) => answers[r.id]?.resp && answers[r.id]?.resp !== "NA").length;
  const doneAny = REACTIVOS.filter((r) => answers[r.id]?.resp).length; // including NA for completion
  const pct = totalEval > 0 ? Math.round((done / REACTIVOS.length) * 100) : 0;

  const setResp = (id, resp) => {
    setAnswers((prev) => ({ ...prev, [id]: { ...prev[id], resp, obs: prev[id]?.obs || "", foto: prev[id]?.foto || null } }));
  };
  const setObs = (id, obs) => setAnswers((prev) => ({ ...prev, [id]: { ...prev[id], obs } }));
  const setFoto = (id, foto) => setAnswers((prev) => ({ ...prev, [id]: { ...prev[id], foto } }));

  const handleSave = async () => {
    if (!meta.sucursalId) { toast("Selecciona una sucursal", "#FF4757"); return; }
    if (!meta.auditor) { toast("Escribe el nombre del auditor", "#FF4757"); return; }
    setSaving(true);
    const suc = SUCURSALES.find((s) => s.id === meta.sucursalId);
    const detalle = REACTIVOS.map((r) => ({
      idReactivo: r.id, num: r.num, seccion: r.seccion, texto: r.texto,
      responsable: r.responsable, resp: answers[r.id]?.resp || "", obs: answers[r.id]?.obs || "", foto: answers[r.id]?.foto || null,
    }));
    const totalSI = detalle.filter((d) => d.resp === "SI").length;
    const totalNO = detalle.filter((d) => d.resp === "NO").length;
    const totalNA = detalle.filter((d) => d.resp === "NA").length;
    const evaluados = totalSI + totalNO;
    const pctC = evaluados > 0 ? Math.round((totalSI / evaluados) * 100) : 0;
    const estado = doneAny === REACTIVOS.length ? "Completada" : "En progreso";
    const auditoria = {
      id: auditToEdit?.id || uid(), sucursalId: meta.sucursalId, sucursal: suc.nombre,
      auditor: meta.auditor, fecha: meta.fecha, hora: new Date().toLocaleTimeString("es-MX"),
      estado, totalSI, totalNO, totalNA, pct: pctC, detalle, creadoEn: auditToEdit?.creadoEn || nowISO(),
    };
    // Save local
    const all = DB.getAuditorias();
    const idx = all.findIndex((a) => a.id === auditoria.id);
    if (idx >= 0) all[idx] = auditoria; else all.unshift(auditoria);
    DB.setAuditorias(all);
    // Pendientes: crear para cada NO
    const pendientes = DB.getPendientes();
    const existingPend = auditToEdit ? pendientes.filter((p) => p.auditoriaId === auditoria.id) : [];
    const noPend = detalle.filter((d) => d.resp === "NO");
    noPend.forEach((d) => {
      const exists = existingPend.find((p) => p.idReactivo === d.idReactivo && p.estado !== "Resuelto");
      if (!exists) {
        const nuevo = {
          id: uid(), auditoriaId: auditoria.id, sucursal: suc.nombre, sucursalId: meta.sucursalId,
          auditor: meta.auditor, fechaAuditoria: meta.fecha, idReactivo: d.idReactivo, num: d.num,
          seccion: d.seccion, texto: d.texto, responsable: d.responsable, observacionAuditor: d.obs,
          fotoEvidencia: d.foto, estado: "Pendiente", creadoEn: nowISO(),
          respuestaResponsable: "", fechaResolucion: null,
        };
        pendientes.push(nuevo);
        SheetsAPI.savePendiente(nuevo);
      }
    });
    DB.setPendientes(pendientes);
    await SheetsAPI.saveAuditoria(auditoria);
    setSaving(false);
    toast("✅ Auditoría guardada correctamente", "#00C875");
    onSaved(auditoria);
    if (!auditToEdit) { setMeta({ sucursalId: "", auditor: user.nombre, fecha: today() }); setAnswers({}); }
  };

  const rowStyle = (id) => {
    const r = answers[id]?.resp;
    const base = { background: "#0D1117", border: "1px solid #1E2530", borderRadius: 10, padding: "12px 14px", marginBottom: 7, display: "grid", gridTemplateColumns: "42px 1fr auto", gap: 12, alignItems: "flex-start", transition: "border-color .2s" };
    if (r === "SI") return { ...base, borderColor: "#00C87540", background: "#00C87506" };
    if (r === "NO") return { ...base, borderColor: "#FF475740", background: "#FF475708" };
    if (r === "NA") return { ...base, borderColor: "#4A556840", background: "#4A556806" };
    return base;
  };

  return (
    <div style={{ padding: "24px 20px", maxWidth: 960, margin: "0 auto" }} className="fade-in">
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 20 }}>
        {auditToEdit ? "✏️ Editar Auditoría" : "➕ Nueva Auditoría"}
      </h1>
      {/* META */}
      <div style={{ background: "#0D1117", border: "1px solid #1E2530", borderRadius: 14, padding: 20, marginBottom: 24, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {[
          { label: "Sucursal", key: "sucursalId", type: "select" },
          { label: "Auditor", key: "auditor", type: "text" },
          { label: "Fecha", key: "fecha", type: "date" },
        ].map(({ label, key, type }) => (
          <div key={key}>
            <label style={{ display: "block", fontSize: 11, color: "#8B949E", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</label>
            {type === "select" ? (
              <select value={meta[key]} onChange={(e) => setMeta({ ...meta, [key]: e.target.value })}
                style={{ width: "100%", background: "#080C10", border: "1px solid #1E2530", color: "#E2E8F0", padding: "10px 12px", borderRadius: 8, fontSize: 13, outline: "none" }}>
                <option value="">— Selecciona —</option>
                {SUCURSALES.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            ) : (
              <input type={type} value={meta[key]} onChange={(e) => setMeta({ ...meta, [key]: e.target.value })}
                style={{ width: "100%", background: "#080C10", border: "1px solid #1E2530", color: "#E2E8F0", padding: "10px 12px", borderRadius: 8, fontSize: 13, outline: "none" }} />
            )}
          </div>
        ))}
      </div>
      {/* REACTIVOS — secciones colapsables */}
      {secciones.map((sec) => {
        const items = REACTIVOS.filter((r) => r.seccion === sec);
        // N/A no cuenta en el total ni en el conteo
        const secTotal = items.filter((r) => answers[r.id]?.resp !== "NA").length;
        const secDone = items.filter((r) => answers[r.id]?.resp && answers[r.id]?.resp !== "NA").length;
        const secNA = items.filter((r) => answers[r.id]?.resp === "NA").length;
        const secSI = items.filter((r) => answers[r.id]?.resp === "SI").length;
        const secNO = items.filter((r) => answers[r.id]?.resp === "NO").length;
        const secPct = secTotal > 0 ? Math.round((secSI / secTotal) * 100) : null;
        const isOpen = expanded[sec];
        const allAnswered = items.every((r) => answers[r.id]?.resp);
        const hasNO = secNO > 0;
        const headerAccent = hasNO ? "#FF4757" : allAnswered ? "#00C875" : "#00C875";
        return (
          <div key={sec} style={{ marginBottom: 6 }}>
            {/* Cabecera colapsable */}
            <button
              onClick={() => toggleSeccion(sec)}
              style={{
                width: "100%", background: "#161B22", border: `1px solid ${hasNO ? "#FF475730" : allAnswered ? "#00C87530" : "#1E2530"}`,
                borderLeft: `3px solid ${headerAccent}`, padding: "11px 16px",
                borderRadius: isOpen ? "8px 8px 0 0" : 8, marginBottom: isOpen ? 0 : 0,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                cursor: "pointer", textAlign: "left", transition: "all .2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, color: isOpen ? "#E2E8F0" : "#8B949E", transition: "transform .2s", display: "inline-block", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                <span style={{ fontWeight: 700, fontSize: 13, color: "#E2E8F0" }}>📂 {sec}</span>
                {allAnswered && <span style={{ fontSize: 11, color: "#00C875" }}>✓</span>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Mini stats */}
                {secSI > 0 && <span style={{ fontSize: 11, color: "#00C875", fontFamily: "'DM Mono',monospace" }}>✅{secSI}</span>}
                {secNO > 0 && <span style={{ fontSize: 11, color: "#FF4757", fontFamily: "'DM Mono',monospace" }}>❌{secNO}</span>}
                {secNA > 0 && <span style={{ fontSize: 11, color: "#8B949E", fontFamily: "'DM Mono',monospace" }}>—{secNA}</span>}
                {/* Progress bar mini */}
                <div style={{ width: 60, background: "#080C10", borderRadius: 3, height: 5, overflow: "hidden" }}>
                  <div style={{ width: `${secTotal > 0 ? Math.round(((secSI + secNO + secNA) / items.length) * 100) : 0}%`, height: "100%", background: hasNO ? "#FF4757" : "#00C875", borderRadius: 3, transition: "width .3s" }} />
                </div>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#8B949E", minWidth: 42, textAlign: "right" }}>
                  {secDone}/{secTotal === items.length ? items.length : `${secTotal}`}
                  {secNA > 0 && <span style={{ color: "#4A5568", fontSize: 10 }}> +{secNA}N/A</span>}
                </span>
              </div>
            </button>
            {/* Contenido expandible */}
            {isOpen && (
              <div style={{ border: "1px solid #1E2530", borderTop: "none", borderRadius: "0 0 8px 8px", padding: "8px 8px 4px", background: "#0A0F16" }}>
                {items.map((r) => {
                  const resp = answers[r.id]?.resp || "";
                  const obs = answers[r.id]?.obs || "";
                  const foto = answers[r.id]?.foto || null;
                  return (
                    <div key={r.id} style={rowStyle(r.id)}>
                      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#8B949E", paddingTop: 2 }}>{r.num}</div>
                      <div>
                        <div style={{ fontSize: 13, lineHeight: 1.45 }}>{r.texto}</div>
                        <div style={{ fontSize: 11, color: "#8B949E", marginTop: 3 }}>Responsable: <strong style={{ color: "#4A9EFF" }}>{r.responsable}</strong></div>
                        {resp === "NO" && (
                          <textarea value={obs} onChange={(e) => setObs(r.id, e.target.value)}
                            placeholder="Observaciones del auditor (requerido para NO)..."
                            style={{ marginTop: 8, width: "100%", background: "#080C10", border: "1px solid #FF475740", color: "#E2E8F0", padding: "8px 10px", borderRadius: 6, fontSize: 12, resize: "none", height: 56, outline: "none", fontFamily: "'DM Sans',sans-serif" }}
                          />
                        )}
                        <FotoEvidencia fotoB64={foto} onCapture={(b64) => setFoto(r.id, b64)} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {["SI", "NO", "NA"].map((op) => {
                          const colors = { SI: "#00C875", NO: "#FF4757", NA: "#8B949E" };
                          const icons = { SI: "✅", NO: "❌", NA: "—" };
                          const active = resp === op;
                          return (
                            <button key={op} onClick={() => setResp(r.id, op)} style={{
                              background: active ? colors[op] + "22" : "transparent",
                              border: `1px solid ${active ? colors[op] : "#1E2530"}`,
                              color: active ? colors[op] : "#8B949E", padding: "5px 12px",
                              borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: active ? 700 : 400,
                              fontFamily: "'DM Sans',sans-serif", transition: "all .15s",
                            }}>{icons[op]} {op}</button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      {/* FOOTER */}
      <div style={{ position: "sticky", bottom: 0, background: "#0D1117", borderTop: "1px solid #1E2530", padding: "14px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginTop: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
          <div style={{ flex: 1, maxWidth: 280, background: "#080C10", borderRadius: 4, height: 6 }}>
            <div style={{ width: Math.round((doneAny / REACTIVOS.length) * 100) + "%", height: "100%", background: "#00C875", borderRadius: 4, transition: "width .3s" }} />
          </div>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#8B949E" }}>{doneAny}/{REACTIVOS.length} ({Math.round((doneAny / REACTIVOS.length) * 100)}%)</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" onClick={() => { setMeta({ sucursalId: "", auditor: user.nombre, fecha: today() }); setAnswers({}); }}>Limpiar</Btn>
          <Btn onClick={handleSave} disabled={saving}>{saving ? <Spinner /> : "💾"} {auditToEdit ? "Actualizar" : "Guardar Auditoría"}</Btn>
        </div>
      </div>
    </div>
  );
};

// ─── HISTORIAL ───────────────────────────────────────────────────────────────
const Historial = ({ auditorias, onEdit, onView }) => {
  const [buscar, setBuscar] = useState("");
  const [filtSuc, setFiltSuc] = useState("");
  const filtered = auditorias.filter((a) => {
    const txt = (a.sucursal + a.auditor).toLowerCase();
    return txt.includes(buscar.toLowerCase()) && (!filtSuc || a.sucursalId === filtSuc);
  });
  return (
    <div style={{ padding: "24px 20px", maxWidth: 1100, margin: "0 auto" }} className="fade-in">
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 20 }}>📋 Historial de Auditorías</h1>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input value={buscar} onChange={(e) => setBuscar(e.target.value)} placeholder="🔍 Buscar sucursal o auditor..."
          style={{ flex: 1, minWidth: 200, background: "#0D1117", border: "1px solid #1E2530", color: "#E2E8F0", padding: "9px 14px", borderRadius: 8, fontSize: 13, outline: "none" }} />
        <select value={filtSuc} onChange={(e) => setFiltSuc(e.target.value)}
          style={{ background: "#0D1117", border: "1px solid #1E2530", color: "#E2E8F0", padding: "9px 14px", borderRadius: 8, fontSize: 13, outline: "none" }}>
          <option value="">Todas las sucursales</option>
          {SUCURSALES.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
        </select>
      </div>
      {filtered.length === 0 && <div style={{ textAlign: "center", color: "#8B949E", padding: 60 }}>Sin auditorías registradas.</div>}
      {filtered.map((a) => {
        const pc = pctColor(a.pct);
        return (
          <div key={a.id} style={{ background: "#0D1117", border: "1px solid #1E2530", borderRadius: 12, padding: "16px 20px", marginBottom: 10, display: "flex", alignItems: "center", gap: 16, cursor: "pointer", transition: "border-color .2s" }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#00C87560"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1E2530"}
            onClick={() => onView(a)}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>🏪 {a.sucursal}</div>
              <div style={{ fontSize: 12, color: "#8B949E" }}>
                👤 {a.auditor} &nbsp;•&nbsp; 📅 {fmt(a.fecha)} &nbsp;•&nbsp;
                <span style={{ color: "#00C875" }}>✅ {a.totalSI}</span> &nbsp;
                <span style={{ color: "#FF4757" }}>❌ {a.totalNO}</span> &nbsp;
                <span style={{ color: "#8B949E" }}>— {a.totalNA}</span>
              </div>
            </div>
            <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 28, color: pc, lineHeight: 1 }}>{a.pct}%</div>
              <Badge color={a.estado === "Completada" ? "#00C875" : "#FFD32A"}>{a.estado}</Badge>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <Btn small variant="blue" onClick={(e) => { e.stopPropagation(); onView(a); }}>Ver</Btn>
              <Btn small variant="ghost" onClick={(e) => { e.stopPropagation(); onEdit(a); }}>✏️ Editar</Btn>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── DETALLE AUDITORÍA MODAL ─────────────────────────────────────────────────
const DetalleAuditModal = ({ audit, open, onClose, onEdit }) => {
  if (!audit) return null;
  const secciones = [...new Set(audit.detalle.map((d) => d.seccion))];
  return (
    <Modal open={open} onClose={onClose} title={`📋 ${audit.sucursal}`} width={860}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        <div style={{ background: "#080C10", borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 10, color: "#8B949E", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Cumplimiento</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 32, color: pctColor(audit.pct) }}>{audit.pct}%</div>
        </div>
        <div style={{ background: "#080C10", borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 10, color: "#8B949E", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Resultados</div>
          <div style={{ fontSize: 14 }}><span style={{ color: "#00C875" }}>✅ {audit.totalSI}</span> / <span style={{ color: "#FF4757" }}>❌ {audit.totalNO}</span> / <span style={{ color: "#8B949E" }}>— {audit.totalNA}</span></div>
        </div>
        <div style={{ background: "#080C10", borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 10, color: "#8B949E", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Fecha</div>
          <div style={{ fontSize: 14 }}>{fmt(audit.fecha)} — {audit.auditor}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <Btn variant="blue" small onClick={() => { onClose(); onEdit(audit); }}>✏️ Modificar auditoría</Btn>
      </div>
      {secciones.map((sec) => (
        <div key={sec} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#8B949E", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, borderBottom: "1px solid #1E2530", paddingBottom: 6 }}>{sec}</div>
          {audit.detalle.filter((d) => d.seccion === sec).map((d) => (
            <div key={d.idReactivo} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 10px", borderRadius: 8, background: "#080C10", marginBottom: 5 }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#8B949E", width: 36, flexShrink: 0 }}>{d.num}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13 }}>{d.texto}</div>
                {d.obs && <div style={{ fontSize: 11, color: "#8B949E", fontStyle: "italic", marginTop: 3 }}>💬 {d.obs}</div>}
                {d.foto && <img src={d.foto} alt="evidencia" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6, marginTop: 6, border: "1px solid #1E2530" }} />}
              </div>
              <span style={{ fontWeight: 700, fontSize: 12, color: d.resp === "SI" ? "#00C875" : d.resp === "NO" ? "#FF4757" : "#8B949E", flexShrink: 0 }}>{d.resp || "—"}</span>
            </div>
          ))}
        </div>
      ))}
    </Modal>
  );
};

// ─── PENDIENTES — VISTA AUDITOR ───────────────────────────────────────────────
const PendientesAuditor = ({ pendientes }) => {
  const abiertos = pendientes.filter((p) => p.estado !== "Resuelto");
  const [filtResp, setFiltResp] = useState("");
  const [filtSuc, setFiltSuc] = useState("");
  const filtered = abiertos.filter((p) =>
    (!filtResp || p.responsable === filtResp) && (!filtSuc || p.sucursalId === filtSuc)
  );
  const sorted = [...filtered].sort((a, b) => {
    if (a.estado === "En Proceso" && b.estado !== "En Proceso") return -1;
    if (b.estado === "En Proceso" && a.estado !== "En Proceso") return 1;
    return diasDesde(b.creadoEn) - diasDesde(a.creadoEn);
  });

  return (
    <div style={{ padding: "24px 20px", maxWidth: 1100, margin: "0 auto" }} className="fade-in">
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 6 }}>⚠️ Pendientes sin Resolución</h1>
      <p style={{ fontSize: 13, color: "#8B949E", marginBottom: 20 }}>Reactivos contestados como <strong style={{ color: "#FF4757" }}>NO</strong> que aún no han sido atendidos por el responsable.</p>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <select value={filtResp} onChange={(e) => setFiltResp(e.target.value)}
          style={{ background: "#0D1117", border: "1px solid #1E2530", color: "#E2E8F0", padding: "9px 14px", borderRadius: 8, fontSize: 13, outline: "none" }}>
          <option value="">Todos los responsables</option>
          {RESPONSABLES_LIST.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={filtSuc} onChange={(e) => setFiltSuc(e.target.value)}
          style={{ background: "#0D1117", border: "1px solid #1E2530", color: "#E2E8F0", padding: "9px 14px", borderRadius: 8, fontSize: 13, outline: "none" }}>
          <option value="">Todas las sucursales</option>
          {SUCURSALES.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
        </select>
      </div>
      {sorted.length === 0 && <div style={{ textAlign: "center", color: "#8B949E", padding: 60 }}>🎉 Sin pendientes abiertos.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sorted.map((p) => {
          const dias = diasDesde(p.creadoEn);
          const enProceso = p.estado === "En Proceso";
          const urgencia = enProceso ? "#FFD32A" : dias >= 7 ? "#FF4757" : dias >= 3 ? "#FFD32A" : "#8B949E";
          return (
            <div key={p.id} style={{ background: "#0D1117", border: `1px solid ${urgencia}40`, borderLeft: `3px solid ${urgencia}`, borderRadius: 12, padding: "14px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>🏪 {p.sucursal}</span>
                    {enProceso
                      ? <Badge color="#FFD32A">🔄 EN PROCESO</Badge>
                      : <Badge color={urgencia}>{dias === 0 ? "Hoy" : `${dias} día${dias > 1 ? "s" : ""} sin resolver`}</Badge>
                    }
                    <Badge color="#4A9EFF">{p.responsable}</Badge>
                  </div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#8B949E", marginBottom: 4 }}>{p.num} — {p.seccion}</div>
                  <div style={{ fontSize: 13, marginBottom: 6 }}>{p.texto}</div>
                  {p.observacionAuditor && <div style={{ fontSize: 12, color: "#FFD32A", fontStyle: "italic" }}>💬 Auditor: {p.observacionAuditor}</div>}
                  {p.fotoEvidencia && <img src={p.fotoEvidencia} alt="evidencia" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6, marginTop: 8, border: "1px solid #1E2530" }} />}
                  <div style={{ fontSize: 11, color: "#8B949E", marginTop: 6 }}>📅 Auditado el {fmt(p.fechaAuditoria)} por {p.auditor}</div>
                </div>
                <Badge color={enProceso ? "#FFD32A" : "#FF4757"}>{enProceso ? "EN PROCESO" : "PENDIENTE"}</Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── PENDIENTES — VISTA RESPONSABLE ──────────────────────────────────────────
const PendientesResponsable = ({ user, pendientes, onResolve, toast }) => {
  const misPend = pendientes.filter((p) => p.responsable === user.dept && p.estado !== "Resuelto");
  const [selected, setSelected] = useState(null);
  const [resp, setResp] = useState("");
  const [resolving, setResolving] = useState(false);
  const [markingProceso, setMarkingProceso] = useState(false);
  const [foto, setFoto] = useState(null);

  const updateLocalState = (id, patch) => {
    const all = DB.getPendientes();
    const idx = all.findIndex((p) => p.id === id);
    if (idx >= 0) all[idx] = { ...all[idx], ...patch };
    DB.setPendientes(all);
    onResolve();
  };

  const handleEnProceso = async () => {
    setMarkingProceso(true);
    const patch = { estado: "En Proceso", iniciadoEn: nowISO() };
    updateLocalState(selected.id, patch);
    await SheetsAPI.updatePendiente({ id: selected.id, estado: "En Proceso" });
    setMarkingProceso(false);
    setSelected(null);
    toast("🔄 Reactivo marcado como En Proceso", "#FFD32A");
  };

  const handleResolve = async () => {
    if (!resp.trim()) { toast("Escribe una respuesta antes de resolver", "#FF4757"); return; }
    setResolving(true);
    const now = nowISO();
    const patch = { estado: "Resuelto", respuestaResponsable: resp, fotoSolucion: foto, fechaResolucion: now };
    updateLocalState(selected.id, patch);
    await SheetsAPI.updatePendiente({ id: selected.id, estado: "Resuelto", respuesta: resp, fotoSolucion: foto, fechaResolucion: now });
    setResolving(false);
    setSelected(null);
    setResp("");
    setFoto(null);
    toast("✅ Reactivo marcado como resuelto", "#00C875");
  };

  // Orden: En Proceso primero, luego Pendiente por antigüedad
  const sorted = [...misPend].sort((a, b) => {
    if (a.estado === "En Proceso" && b.estado !== "En Proceso") return -1;
    if (b.estado === "En Proceso" && a.estado !== "En Proceso") return 1;
    return new Date(a.creadoEn) - new Date(b.creadoEn);
  });

  return (
    <div style={{ padding: "24px 20px", maxWidth: 1000, margin: "0 auto" }} className="fade-in">
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 6 }}>🔧 Mis Pendientes</h1>
      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <Badge color="#4A9EFF">{user.dept}</Badge>
        <span style={{ fontSize: 13, color: "#8B949E" }}>{misPend.length} pendiente{misPend.length !== 1 ? "s" : ""} por atender</span>
        {misPend.filter(p => p.estado === "En Proceso").length > 0 && (
          <Badge color="#FFD32A">🔄 {misPend.filter(p => p.estado === "En Proceso").length} en proceso</Badge>
        )}
      </div>
      {sorted.length === 0 && <div style={{ textAlign: "center", color: "#8B949E", padding: 60 }}>🎉 Sin pendientes para tu área.</div>}
      {sorted.map((p) => {
        const dias = diasDesde(p.creadoEn);
        const enProceso = p.estado === "En Proceso";
        const urgencia = enProceso ? "#FFD32A" : dias >= 7 ? "#FF4757" : dias >= 3 ? "#FFD32A" : "#8B949E";
        return (
          <div key={p.id} style={{ background: "#0D1117", border: `1px solid ${urgencia}40`, borderLeft: `3px solid ${urgencia}`, borderRadius: 12, padding: "16px 18px", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 6, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>🏪 {p.sucursal}</span>
                  {enProceso
                    ? <Badge color="#FFD32A">🔄 EN PROCESO</Badge>
                    : <Badge color={urgencia}>{dias === 0 ? "Hoy" : `${dias} día${dias > 1 ? "s" : ""}`}</Badge>
                  }
                </div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#8B949E", marginBottom: 4 }}>{p.num} — {p.seccion}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{p.texto}</div>
                <div style={{ fontSize: 12, color: "#8B949E" }}>📅 Auditoría: {fmt(p.fechaAuditoria)} · Auditor: {p.auditor}</div>
                {p.observacionAuditor && (
                  <div style={{ marginTop: 8, background: "#FFD32A11", border: "1px solid #FFD32A30", borderRadius: 8, padding: "8px 12px" }}>
                    <div style={{ fontSize: 11, color: "#FFD32A", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Comentario del Auditor</div>
                    <div style={{ fontSize: 13 }}>{p.observacionAuditor}</div>
                  </div>
                )}
                {p.fotoEvidencia && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 11, color: "#8B949E", marginBottom: 4 }}>Foto de evidencia:</div>
                    <img src={p.fotoEvidencia} alt="evidencia" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #1E2530" }} />
                  </div>
                )}
              </div>
              <Btn variant="warning" onClick={() => { setSelected(p); setResp(p.respuestaResponsable || ""); setFoto(null); }}>
                ✍️ Atender
              </Btn>
            </div>
          </div>
        );
      })}
      {/* Modal atender */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="✍️ Atender Pendiente" width={600}>
        {selected && (
          <div>
            <div style={{ background: "#080C10", borderRadius: 10, padding: 14, marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 6, flexWrap: "wrap", alignItems: "center" }}>
                {selected.estado === "En Proceso" && <Badge color="#FFD32A">🔄 EN PROCESO</Badge>}
              </div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#8B949E", marginBottom: 4 }}>{selected.num} · {selected.seccion}</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{selected.texto}</div>
              <div style={{ fontSize: 12, color: "#8B949E", marginTop: 6 }}>🏪 {selected.sucursal} · 📅 {fmt(selected.fechaAuditoria)}</div>
              {selected.observacionAuditor && <div style={{ marginTop: 8, fontSize: 13, color: "#FFD32A", fontStyle: "italic" }}>💬 Auditor: {selected.observacionAuditor}</div>}
            </div>
            <label style={{ display: "block", fontSize: 11, color: "#8B949E", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Tu respuesta / acción tomada</label>
            <textarea value={resp} onChange={(e) => setResp(e.target.value)} placeholder="Describe la acción que tomaste para resolver este punto..."
              style={{ width: "100%", background: "#080C10", border: "1px solid #1E2530", color: "#E2E8F0", padding: "10px 12px", borderRadius: 8, fontSize: 13, resize: "none", height: 90, outline: "none", fontFamily: "'DM Sans',sans-serif", marginBottom: 10 }} />
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, color: "#8B949E", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Foto de solución (opcional)</label>
              <FotoEvidencia fotoB64={foto} onCapture={setFoto} />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <Btn variant="ghost" onClick={() => setSelected(null)}>Cancelar</Btn>
              {selected.estado !== "En Proceso" && (
                <Btn variant="warning" onClick={handleEnProceso} disabled={markingProceso}>
                  {markingProceso ? <Spinner /> : "🔄"} En Proceso
                </Btn>
              )}
              <Btn onClick={handleResolve} disabled={resolving}>{resolving ? <Spinner /> : "✅"} Marcar como Resuelto</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ─── RESUELTOS — VISTA RESPONSABLE ──────────────────────────────────────────
const ResueltosResponsable = ({ user, pendientes }) => {
  const resueltos = pendientes.filter((p) => p.responsable === user.dept && p.estado === "Resuelto");
  return (
    <div style={{ padding: "24px 20px", maxWidth: 1000, margin: "0 auto" }} className="fade-in">
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 20 }}>✅ Resueltos por mi Área</h1>
      {resueltos.length === 0 && <div style={{ textAlign: "center", color: "#8B949E", padding: 60 }}>Sin elementos resueltos aún.</div>}
      {resueltos.map((p) => (
        <div key={p.id} style={{ background: "#0D1117", border: "1px solid #00C87530", borderLeft: "3px solid #00C875", borderRadius: 12, padding: "14px 18px", marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 4, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontWeight: 700 }}>🏪 {p.sucursal}</span>
                <Badge color="#00C875">RESUELTO</Badge>
              </div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#8B949E", marginBottom: 3 }}>{p.num} — {p.texto}</div>
              <div style={{ fontSize: 12, color: "#8B949E" }}>📅 Resuelto el {fmtFull(p.fechaResolucion)}</div>
              {p.respuestaResponsable && <div style={{ fontSize: 13, color: "#00C875", marginTop: 6 }}>✍️ {p.respuestaResponsable}</div>}
              {p.fotoSolucion && <img src={p.fotoSolucion} alt="solución" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6, marginTop: 6, border: "1px solid #00C87540" }} />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── INCIDENCIAS (todos los NO) ───────────────────────────────────────────────
const Incidencias = ({ pendientes }) => {
  const [filtResp, setFiltResp] = useState("");
  const filtered = pendientes.filter((p) => !filtResp || p.responsable === filtResp);
  return (
    <div style={{ padding: "24px 20px", maxWidth: 1100, margin: "0 auto" }} className="fade-in">
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 6 }}>❌ Todas las Incidencias "NO"</h1>
      <p style={{ fontSize: 13, color: "#8B949E", marginBottom: 20 }}>Historial completo de reactivos contestados como NO.</p>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <select value={filtResp} onChange={(e) => setFiltResp(e.target.value)}
          style={{ background: "#0D1117", border: "1px solid #1E2530", color: "#E2E8F0", padding: "9px 14px", borderRadius: 8, fontSize: 13, outline: "none" }}>
          <option value="">Todos los responsables</option>
          {RESPONSABLES_LIST.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div style={{ background: "#0D1117", border: "1px solid #1E2530", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#161B22" }}>
              {["Sucursal", "Fecha", "Sección", "Reactivo", "Responsable", "Observación", "Estado"].map((h) => (
                <th key={h} style={{ fontSize: 10, color: "#8B949E", textTransform: "uppercase", letterSpacing: 1, padding: "10px 12px", textAlign: "left", borderBottom: "1px solid #1E2530" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: "center", color: "#8B949E", padding: 40 }}>Sin incidencias.</td></tr>
            ) : filtered.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #1E253040" }}>
                <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 600 }}>{p.sucursal}</td>
                <td style={{ padding: "10px 12px", fontSize: 12, color: "#8B949E" }}>{fmt(p.fechaAuditoria)}</td>
                <td style={{ padding: "10px 12px", fontSize: 11, color: "#8B949E" }}>{p.seccion}</td>
                <td style={{ padding: "10px 12px", fontSize: 13 }}>{p.texto}</td>
                <td style={{ padding: "10px 12px" }}><Badge color="#4A9EFF">{p.responsable}</Badge></td>
                <td style={{ padding: "10px 12px", fontSize: 12, color: "#8B949E", fontStyle: "italic" }}>{p.observacionAuditor || "—"}</td>
                <td style={{ padding: "10px 12px" }}>
                  <Badge color={p.estado === "Resuelto" ? "#00C875" : "#FF4757"}>{p.estado}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({ auditorias, pendientes, setPage }) => {
  const total = auditorias.length;
  const pctProm = total > 0 ? Math.round(auditorias.reduce((s, a) => s + a.pct, 0) / total) : null;
  const abiertosPend = pendientes.filter((p) => p.estado !== "Resuelto").length;
  const sucAuditadas = new Set(auditorias.map((a) => a.sucursalId)).size;
  const secciones = [...new Set(REACTIVOS.map((r) => r.seccion))];

  // Barras secciones
  const seccionBars = secciones.map((sec) => {
    const items = auditorias.flatMap((a) => a.detalle.filter((d) => d.seccion === sec && d.resp));
    const si = items.filter((d) => d.resp === "SI").length;
    const ev = items.filter((d) => d.resp !== "NA").length;
    return { sec, pct: ev > 0 ? Math.round((si / ev) * 100) : 0 };
  }).sort((a, b) => a.pct - b.pct);

  // Barras responsables (por pendientes)
  const respCount = {};
  pendientes.filter((p) => p.estado !== "Resuelto").forEach((p) => { respCount[p.responsable] = (respCount[p.responsable] || 0) + 1; });
  const respBars = Object.entries(respCount).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <div style={{ padding: "24px 20px", maxWidth: 1200, margin: "0 auto" }} className="fade-in">
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 20 }}>📊 Dashboard</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        <KpiCard label="Auditorías Totales" value={total} sub="realizadas" accent="#00C875" icon="📋" />
        <KpiCard label="Cumplimiento Prom." value={pctProm !== null ? pctProm + "%" : "—"} sub="% general" accent="#FFD32A" icon="📈" />
        <KpiCard label="Pendientes Abiertos" value={abiertosPend} sub="sin resolver" accent="#FF4757" icon="⚠️" />
        <KpiCard label="Sucursales Auditadas" value={sucAuditadas} sub={`de ${SUCURSALES.length}`} accent="#1E90FF" icon="🏪" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ background: "#0D1117", border: "1px solid #1E2530", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 11, color: "#8B949E", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>Cumplimiento por Sección</div>
          {total === 0 ? <div style={{ color: "#8B949E", fontSize: 13, textAlign: "center", padding: 20 }}>Sin datos</div>
            : seccionBars.map(({ sec, pct }) => (
              <div key={sec} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: "#8B949E", width: 130, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sec}</div>
                <div style={{ flex: 1, background: "#080C10", borderRadius: 4, height: 7 }}>
                  <div style={{ width: pct + "%", height: "100%", background: pctColor(pct), borderRadius: 4, transition: "width .6s" }} />
                </div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#8B949E", width: 34, textAlign: "right" }}>{pct}%</div>
              </div>
            ))}
        </div>
        <div style={{ background: "#0D1117", border: "1px solid #1E2530", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 11, color: "#8B949E", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>Pendientes por Responsable</div>
          {respBars.length === 0 ? <div style={{ color: "#8B949E", fontSize: 13, textAlign: "center", padding: 20 }}>Sin pendientes 🎉</div>
            : respBars.map(([resp, cnt]) => (
              <div key={resp} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: "#8B949E", width: 130, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{resp}</div>
                <div style={{ flex: 1, background: "#080C10", borderRadius: 4, height: 7 }}>
                  <div style={{ width: Math.round((cnt / (respBars[0][1])) * 100) + "%", height: "100%", background: "#FF4757", borderRadius: 4, transition: "width .6s" }} />
                </div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#FF4757", width: 34, textAlign: "right" }}>{cnt}</div>
              </div>
            ))}
        </div>
      </div>
      {/* Recientes */}
      <div style={{ background: "#0D1117", border: "1px solid #1E2530", borderRadius: 14, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#8B949E", textTransform: "uppercase", letterSpacing: 1.5 }}>Últimas Auditorías</div>
          <Btn small variant="ghost" onClick={() => setPage("historial")}>Ver todas →</Btn>
        </div>
        {auditorias.length === 0 ? <div style={{ color: "#8B949E", fontSize: 13, textAlign: "center", padding: 20 }}>Sin auditorías registradas.</div>
          : auditorias.slice(0, 6).map((a) => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1E253040" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>🏪 {a.sucursal}</div>
                <div style={{ fontSize: 12, color: "#8B949E" }}>{a.auditor} · {fmt(a.fecha)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: pctColor(a.pct) }}>{a.pct}%</span>
                <Badge color={a.estado === "Completada" ? "#00C875" : "#FFD32A"}>{a.estado}</Badge>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

// ─── GOOGLE SHEETS SETUP INFO ─────────────────────────────────────────────────
const SheetsSetup = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose} title="🔗 Configurar Google Sheets" width={760}>
    <div style={{ fontSize: 13, lineHeight: 1.7, color: "#E2E8F0" }}>
      <div style={{ background: "#080C10", borderRadius: 10, padding: 16, marginBottom: 16, borderLeft: "3px solid #00C875" }}>
        <strong style={{ color: "#00C875" }}>Estado actual:</strong> {SHEETS_URL.includes("TU_URL_AQUI") ? "⚠️ No configurado — usando almacenamiento local (demo)" : "✅ Conectado a Google Sheets"}
      </div>
      <ol style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 12 }}>
        <li>Ve a <a href="https://script.google.com" target="_blank" rel="noreferrer" style={{ color: "#4A9EFF" }}>script.google.com</a> y crea un nuevo proyecto.</li>
        <li>Pega el código del archivo <code style={{ background: "#161B22", padding: "2px 6px", borderRadius: 4, color: "#FFD32A" }}>APPS_SCRIPT.gs</code> (incluido al final de este .jsx como comentario).</li>
        <li>En el menú Proyecto, crea una Google Spreadsheet nueva y copia su ID.</li>
        <li>Reemplaza <code style={{ background: "#161B22", padding: "2px 6px", borderRadius: 4, color: "#FFD32A" }}>TU_SPREADSHEET_ID</code> en el script.</li>
        <li>Haz clic en <strong>Implementar → Nueva implementación → App web</strong>.</li>
        <li>Ejecutar como: <strong>Yo</strong> · Quién tiene acceso: <strong>Cualquiera</strong>. Copia la URL.</li>
        <li>En este archivo .jsx, reemplaza <code style={{ background: "#161B22", padding: "2px 6px", borderRadius: 4, color: "#FFD32A" }}>SHEETS_URL</code> con esa URL.</li>
      </ol>
      <div style={{ marginTop: 20, background: "#080C10", borderRadius: 10, padding: 16, fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#8B949E", lineHeight: 1.8 }}>
        Hojas que se crearán automáticamente:<br/>
        📊 <strong style={{ color: "#E2E8F0" }}>Auditorias</strong> — datos de cada auditoría<br/>
        📊 <strong style={{ color: "#E2E8F0" }}>Detalles</strong> — reactivo a reactivo<br/>
        📊 <strong style={{ color: "#E2E8F0" }}>Pendientes</strong> — incidencias NO + seguimiento<br/>
        📊 <strong style={{ color: "#E2E8F0" }}>Usuarios</strong> — catálogo de usuarios
      </div>
    </div>
  </Modal>
);

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [auditorias, setAuditorias] = useState([]);
  const [pendientes, setPendientes] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [auditToEdit, setAuditToEdit] = useState(null);
  const [viewAudit, setViewAudit] = useState(null);
  const [showSheets, setShowSheets] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const toast = useCallback((msg, color = "#00C875") => {
    const id = uid();
    setToasts((prev) => [...prev, { id, msg, color }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const loadDB = useCallback(() => {
    setAuditorias(DB.getAuditorias());
    setPendientes(DB.getPendientes());
  }, []);

  // Sincroniza desde Google Sheets y fusiona con localStorage
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const remote = await SheetsAPI.getAll();
      if (remote && remote.Auditorias && remote.Pendientes) {
        // Merge: remote es fuente de verdad para IDs existentes, local puede tener nuevos no subidos
        const localAud = DB.getAuditorias();
        const remoteIds = new Set(remote.Auditorias.map(a => a.id));
        // Mantén locales que no están en remote (guardados offline), agrega/actualiza los de remote
        const merged = [
          ...remote.Auditorias,
          ...localAud.filter(a => !remoteIds.has(a.id)),
        ];
        DB.setAuditorias(merged);

        const localPend = DB.getPendientes();
        const remotePIds = new Set(remote.Pendientes.map(p => p.id));
        const mergedP = [
          ...remote.Pendientes,
          ...localPend.filter(p => !remotePIds.has(p.id)),
        ];
        DB.setPendientes(mergedP);
        setAuditorias(merged);
        setPendientes(mergedP);
        toast("✅ Datos sincronizados desde Google Sheets", "#00C875");
      } else {
        // Sin Sheets configurado: solo recarga localStorage (sirve para mismo dispositivo)
        loadDB();
        toast("🔄 Datos actualizados (sin Sheets configurado)", "#FFD32A");
      }
    } catch {
      loadDB();
      toast("⚠️ No se pudo conectar a Sheets. Cargando datos locales.", "#FF4757");
    }
    setRefreshing(false);
  }, [loadDB, toast]);

  useEffect(() => { if (user) loadDB(); }, [user, loadDB]);

  const handleLogin = (u) => {
    setUser(u);
    setPage(u.rol === "auditor" ? "dashboard" : "pendientes-resp");
  };

  const handleLogout = () => { setUser(null); setPage("dashboard"); };

  const handleSaved = () => { loadDB(); setAuditToEdit(null); setPage("historial"); };

  const handleEdit = (a) => { setAuditToEdit(a); setPage("nueva"); };

  const pendientesCount = user?.rol === "auditor"
    ? pendientes.filter((p) => p.estado !== "Resuelto").length
    : pendientes.filter((p) => p.responsable === user?.dept && p.estado !== "Resuelto").length;

  if (!user) return <><style>{GS}</style><LoginScreen onLogin={handleLogin} /></>;

  return (
    <div style={{ minHeight: "100vh", background: "#080C10" }}>
      <style>{GS}</style>
      <Toast toasts={toasts} />
      <AppHeader
        user={user} page={page}
        setPage={(p) => { setAuditToEdit(null); setPage(p); }}
        pendientesCount={pendientesCount}
        onLogout={handleLogout}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
      {/* Sheets badge */}
      <div style={{ position: "fixed", bottom: 16, right: 16, zIndex: 100 }}>
        <button onClick={() => setShowSheets(true)} style={{ background: "#0D1117", border: "1px solid #1E2530", color: "#8B949E", padding: "8px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", gap: 6, transition: "all .2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00C875"; e.currentTarget.style.color = "#00C875"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1E2530"; e.currentTarget.style.color = "#8B949E"; }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: SHEETS_URL.includes("TU_URL_AQUI") ? "#FFD32A" : "#00C875", flexShrink: 0 }} />
          Google Sheets
        </button>
      </div>
      {/* PAGES */}
      {page === "dashboard" && <Dashboard auditorias={auditorias} pendientes={pendientes} setPage={setPage} />}
      {page === "nueva" && <NuevaAuditoria user={user} auditToEdit={auditToEdit} onSaved={handleSaved} toast={toast} />}
      {page === "historial" && <Historial auditorias={auditorias} onEdit={handleEdit} onView={(a) => setViewAudit(a)} />}
      {page === "pendientes-auditor" && <PendientesAuditor pendientes={pendientes} />}
      {page === "incidencias" && <Incidencias pendientes={pendientes} />}
      {page === "pendientes-resp" && <PendientesResponsable user={user} pendientes={pendientes} onResolve={loadDB} toast={toast} />}
      {page === "resueltos-resp" && <ResueltosResponsable user={user} pendientes={pendientes} />}
      {/* Modals */}
      <DetalleAuditModal audit={viewAudit} open={!!viewAudit} onClose={() => setViewAudit(null)} onEdit={handleEdit} />
      <SheetsSetup open={showSheets} onClose={() => setShowSheets(false)} />
    </div>
  );
}

/*
========================================
 APPS SCRIPT — pega esto en script.google.com
 Archivo: APPS_SCRIPT.gs
========================================

const SPREADSHEET_ID = "TU_SPREADSHEET_ID"; // ← reemplaza con tu ID de Spreadsheet

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  initSheets(ss);
  let result = {};
  try {
    if (data.action === "saveAuditoria") result = saveAuditoria(ss, data);
    else if (data.action === "savePendiente") result = savePendiente(ss, data);
    else if (data.action === "updatePendiente") result = updatePendiente(ss, data);
    else if (data.action === "getAll") result = getAll(ss);
    else result = { error: "Acción desconocida" };
  } catch (err) {
    result = { error: err.toString() };
  }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function initSheets(ss) {
  const sheets = ["Auditorias", "Detalles", "Pendientes", "Usuarios"];
  const headers = {
    Auditorias: ["id","sucursalId","sucursal","auditor","fecha","hora","estado","totalSI","totalNO","totalNA","pct","creadoEn"],
    Detalles: ["auditoriaId","idReactivo","num","seccion","texto","responsable","resp","obs","tieneFoto"],
    Pendientes: ["id","auditoriaId","sucursal","sucursalId","auditor","fechaAuditoria","idReactivo","num","seccion","texto","responsable","observacionAuditor","tieneFoto","estado","creadoEn","respuestaResponsable","fechaResolucion"],
    Usuarios: ["id","nombre","user","rol","dept"]
  };
  sheets.forEach(name => {
    let sh = ss.getSheetByName(name);
    if (!sh) {
      sh = ss.insertSheet(name);
      sh.appendRow(headers[name]);
      sh.getRange(1, 1, 1, headers[name].length).setFontWeight("bold").setBackground("#1a1a2e").setFontColor("#ffffff");
      sh.setFrozenRows(1);
    }
  });
}

function saveAuditoria(ss, data) {
  const sh = ss.getSheetByName("Auditorias");
  const rows = sh.getDataRange().getValues();
  const headers = rows[0];
  const idIdx = headers.indexOf("id");
  // Find existing row
  const existing = rows.slice(1).findIndex(r => r[idIdx] === data.id);
  const row = headers.map(h => {
    if (h === "creadoEn") return data.creadoEn || new Date().toISOString();
    return data[h] !== undefined ? String(data[h]) : "";
  });
  if (existing >= 0) {
    sh.getRange(existing + 2, 1, 1, row.length).setValues([row]);
  } else {
    sh.appendRow(row);
  }
  // Save details
  const dsh = ss.getSheetByName("Detalles");
  if (data.detalle) {
    const dHeaders = dsh.getRange(1, 1, 1, dsh.getLastColumn()).getValues()[0];
    // Remove old details for this auditoria
    const allD = dsh.getDataRange().getValues();
    const audIdIdx = dHeaders.indexOf("auditoriaId");
    for (let i = allD.length - 1; i >= 1; i--) {
      if (allD[i][audIdIdx] === data.id) dsh.deleteRow(i + 1);
    }
    data.detalle.forEach(d => {
      const dRow = dHeaders.map(h => {
        if (h === "tieneFoto") return d.foto ? "SI" : "NO";
        return d[h] !== undefined ? String(d[h]) : "";
      });
      dsh.appendRow(dRow);
    });
  }
  return { ok: true };
}

function savePendiente(ss, data) {
  const sh = ss.getSheetByName("Pendientes");
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const row = headers.map(h => {
    if (h === "tieneFoto") return data.fotoEvidencia ? "SI" : "NO";
    return data[h] !== undefined ? String(data[h]) : "";
  });
  sh.appendRow(row);
  return { ok: true };
}

function updatePendiente(ss, data) {
  const sh = ss.getSheetByName("Pendientes");
  const rows = sh.getDataRange().getValues();
  const headers = rows[0];
  const idIdx = headers.indexOf("id");
  const rowIdx = rows.slice(1).findIndex(r => r[idIdx] === data.id);
  if (rowIdx >= 0) {
    const estadoIdx = headers.indexOf("estado");
    const respIdx = headers.indexOf("respuestaResponsable");
    const fechaIdx = headers.indexOf("fechaResolucion");
    const fotoIdx = headers.indexOf("tieneFoto");
    const r = rowIdx + 2;
    sh.getRange(r, estadoIdx + 1).setValue(data.estado || "Resuelto");
    sh.getRange(r, respIdx + 1).setValue(data.respuesta || "");
    sh.getRange(r, fechaIdx + 1).setValue(data.fechaResolucion || "");
    if (fotoIdx >= 0) sh.getRange(r, fotoIdx + 1).setValue(data.fotoSolucion ? "SI" : "NO");
  }
  return { ok: true };
}

function getAll(ss) {
  const result = {};
  ["Auditorias","Detalles","Pendientes"].forEach(name => {
    const sh = ss.getSheetByName(name);
    if (!sh) return;
    const rows = sh.getDataRange().getValues();
    const headers = rows[0];
    result[name] = rows.slice(1).map(r => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = r[i]);
      return obj;
    });
  });
  return result;
}

========================================
 FIN APPS SCRIPT
========================================
*/
