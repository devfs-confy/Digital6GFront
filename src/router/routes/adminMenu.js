import icoClientes from "@/assets/img/account_box.svg?raw";
import icoSolicitudes from "@/assets/img/receipt_long.svg?raw";
import icoArqueos from "@/assets/img/assignment.svg?raw";
import icoSedes from "@/assets/img/emoji_transportation.svg?raw";
import icoMensual2 from "@/assets/img/calendar_add_on.svg?raw";
import icoUsuarios from "@/assets/img/manage_accounts.svg?raw";
import icoDashboard from "@/assets/img/home.svg?raw";
import IcoVerificacion from "@/assets/img/verified.svg?raw";
import icoTarifas from "@/assets/img/car_tag.svg?raw";
import icoTarjetas from "@/assets/img/credit_card_gear.svg?raw";
import icoRoles from "@/assets/img/dashboard_customize_white.svg?raw";
import icoUCC from "@/assets/img/how_to_reg.svg?raw";
import icoAuth from "@/assets/img/fact_check.svg?raw";
import icoPlacas from "@/assets/img/flowsheet.svg?raw";
import icoFacturacion from "@/assets/img/receipt_long.svg?raw";
import icoPagos from "@/assets/img/garage_money.svg?raw";

export const adminMenuItems = [
  { label: "Dashboard", icon: icoDashboard, route: "/admin/dashboard" },
  {
    label: "Clientes",
    icon: icoClientes,
    route: "/admin/clientes",
    permission: "VER-USUARIOS",
  },
  {
    label: "Mensualidades",
    icon: icoMensual2,
    route: "/admin/mensualidades",
    permission: "VER-MENSUALIDADES",
  },
  {
    label: "Solicitudes <br> PQRS",
    icon: icoSolicitudes,
    route: "/admin/solicitudes",
    permission: "VER-PQRS",
  },
  {
    label: "Historial <br> Pagos",
    icon: icoPagos,
    route: "/admin/historial-pagos",
    permission: "VER-MENSUALIDADES",
  },
  {
    label: "Historial Cambio <br> Placas",
    icon: icoPlacas,
    route: "/admin/historial-cambio-placas",
    permission: "VER-MENSUALIDADES",
  },
  {
    label: "Consignaciones",
    icon: icoArqueos,
    route: "/admin/consignaciones",
    permission: "EDITAR-SEDES",
  },
  {
    label: "Facturación",
    icon: icoFacturacion,
    route: "/admin/facturacion",
    permission: "VER-FACTURACION",
  },
  {
    label: "Modalidades<br>de Pago",
    icon: icoTarifas,
    route: "/admin/modalidades-pagos",
    permission: "ASIGNAR-MODALIDADES_PAGOS",
  },
  {
    label: "Administrar<br>Sedes",
    icon: icoSedes,
    route: "/admin/sedes",
    permission: "VER-SEDES",
  },
  {
    label: "Administrar<br>Tarifas",
    icon: icoTarifas,
    route: "/admin/tarifas-admin",
    permission: "VER-TARIFAS",
  },
  {
    label: "Usuarios",
    icon: icoUsuarios,
    route: "/admin/usuarios",
    permission: "VER-ROLES",
  },
  {
    label: "Roles",
    icon: icoRoles,
    route: "/admin/roles",
    permission: "VER-ROLES",
  },
  {
    label: "Codigo<br> Verificacion",
    icon: IcoVerificacion,
    route: "/admin/verificacion",
    permission: "CREAR-CODIGOS",
  },
  {
    label: "Autorizaciones",
    icon: icoAuth,
    route: "/admin/autorizaciones",
    permission: "VER-AUTORIZACIONES",
  },
  {
    label: "Banner",
    icon: icoTarjetas,
    route: "/admin/banner",
    permission: "VER-PUBLICIDAD",
  },
  {
    label: "Comunidad<br>UCC",
    icon: icoUCC,
    route: "/admin/comunidad-ucc",
    permission: "SUBIR-ESTUDIANTES",
  },
];
