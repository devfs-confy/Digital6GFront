# formats.date.js

Utilidades de formateo de fechas. Usa **Luxon** con timezone `America/Bogota`.

## Archivo

`src/utils/formats.date.js`

## Funciones

### `fechaFormato(date)`

Convierte una fecha a formato `YYYY-MM-DD`.

```js
import formats from "@/utils/formats.date"

formats.fechaFormato("2026-05-08T15:30:00Z")  // "2026-05-08"
formats.fechaFormato(null)                      // "Sin registro"
```

---

### `InputLocal(date)`

Convierte a formato para input datetime-local: `YYYY-MM-DD HH:mm:ss`.

```js
formats.InputLocal(new Date())  // "2026-05-08 10:30:45"
```

---

### `DateTimeLocal(date)`

Convierte usando Luxon con timezone Colombia.

```js
formats.DateTimeLocal("2026-05-08T15:30:00Z")  // "2026-05-08 10:30:00" (hora Colombia)
```

---

### `FechaSinCeros(fecha)`

Elimina ceros iniciales de una fecha `YYYY-MM-DD`.

```js
formats.FechaSinCeros("2026-05-08")  // "2026-5-8"
```

---

### `fechaSinDate(date)`

Extrae fecha y hora de un ISO string sin `T` ni milisegundos.

```js
formats.fechaSinDate("2026-05-08T15:30:45.123Z")  // "2026-05-08 15:30:45"
```

---

### `getColombiaDateString(fin?)`

Retorna la fecha actual en Colombia como `YYYY-MM-DD`.

```js
formats.getColombiaDateString()      // "2026-05-08"
formats.getColombiaDateString(true)  // "2026-05-08" (mismo formato)
```

---

### `getDateNow()`

Retorna la fecha/hora actual de Colombia como `Date` object.

```js
const ahora = formats.getDateNow()  // Date object en timezone Colombia
```

---

### `DateOfString(f)`

Convierte ISO string a formato `YYYY-MM-DDTHH:mm` (para input datetime-local).

```js
formats.DateOfString("2026-05-08T15:30:00Z")  // "2026-05-08T10:30"
```

## Exportación

Default export como objeto:

```js
import formats from "@/utils/formats.date"
// formats.fechaFormato(), formats.getColombiaDateString(), etc.
```
