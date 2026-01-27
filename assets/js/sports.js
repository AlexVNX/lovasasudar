export const SPORTS = [
  { key:"run",     es:"Correr suave",     en:"Easy run",            met:8.0 },
  { key:"walk",    es:"Caminar rápido",   en:"Brisk walk",          met:4.3 },
  { key:"bike",    es:"Bici moderada",    en:"Cycling (moderate)",  met:6.8 },
  { key:"swim",    es:"Natación",         en:"Swimming",            met:6.0 },
  { key:"hiit",    es:"HIIT",             en:"HIIT",                met:9.0 },
  { key:"weights", es:"Pesas",            en:"Weight training",     met:5.0 },
  { key:"football",es:"Fútbol",           en:"Soccer",              met:7.0 },
  { key:"dance",   es:"Bailar",           en:"Dancing",             met:5.5 },
  { key:"stairs",  es:"Subir escaleras",  en:"Stairs",              met:8.8 },
  { key:"yoga",    es:"Yoga",             en:"Yoga",                met:2.5 },
  { key:"bowling", es:"Bolos",            en:"Bowling",             met:3.0 },
  { key:"darts",   es:"Dardos",           en:"Darts",               met:2.5 },
  { key:"petanque",es:"Petanca",          en:"Bocce / Petanque",    met:3.0 }
];

export const GENDER_FACTOR = { na:1.00, male:1.00, female:0.95 };

export function genderLabel(LANG, g){
  if (LANG==="en"){
    return g==="male" ? "Male" : g==="female" ? "Female" : "NA";
  }
  return g==="male" ? "Hombre" : g==="female" ? "Mujer" : "N/D";
}
