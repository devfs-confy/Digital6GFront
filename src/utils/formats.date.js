import { DateTime } from "luxon";
function fechaFormato(date) {
  if (date == null) return "Sin registro";
  const fecha = new Date(date);
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0"); // Sumamos 1 porque enero es 0
  const day = String(fecha.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function InputLocal(date) {
  if (date == null) return "Sin registro";
  console.log({date})
  const fecha = new Date(date);

  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const dd = String(fecha.getDate()).padStart(2, "0");
  const hh = String(fecha.getHours()).padStart(2, "0");
  const mi = String(fecha.getMinutes()).padStart(2, "0");
  const ss = String(fecha.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}
function DateTimeLocal(date) {
  if (date == null) return "Sin registro";
  let newDate = new Date(date);
  const fecha = DateTime.fromISO(newDate).setZone("America/Bogota");
  console.log(fecha);
  return fecha.toFormat("yyyy-MM-dd HH:mm:ss");
}

function FechaSinCeros(fecha) {
  if (fecha == null) return "---";
  // Dividir la fecha en partes
  const [anio, mes, dia] = fecha.split("-");

  // Convertir a números y luego a string para eliminar ceros
  return `${Number(anio)}-${Number(mes)}-${Number(dia)}`;
}


function fechaSinDate(date){ //fecha sin el new date
  if(!date) return ''
  const format = date.split('T')
  return `${format[0]} ${format[1].split('.')[0]}`
}
function getColombiaDateString(fin) {
    const date = new Date().toLocaleString("en-US", {
        timeZone: "America/Bogota",
    });
    const colombiaDate = new Date(date);

    const pad = (n) => n.toString().padStart(2, '0');

    const yyyy = colombiaDate.getFullYear();
    const mm = pad(colombiaDate.getMonth() + 1);
    const dd = pad(colombiaDate.getDate());

    if (fin) return `${yyyy}-${mm}-${dd}`
    return `${yyyy}-${mm}-${dd}`;
}

//DATETIME LUXON - return en new Date()
 function getDateNow(){

    return DateTime.local().setZone('America/Bogota').toJSDate();
   

 }

 function DateOfString(f){
  const dt = DateTime.fromISO(f)

    if (!dt.isValid) {
        console.error('Fecha inválida:', dt.invalidExplanation)
        return ''
    }

    return DateTime
        .fromISO(f, { zone: 'utc' })     // viene en UTC     // lo pasas a local
        .toFormat("yyyy-MM-dd'T'HH:mm")

 }

export default {
  fechaFormato,
  InputLocal,
  DateTimeLocal,
  FechaSinCeros,
  fechaSinDate,
  getColombiaDateString,
  getDateNow,
  DateOfString
};