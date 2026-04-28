import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import router from "./router";
import "./style.css";
import "./assets/main.css";
import "./assets/base.css";
import "./assets/swal.css"; // o donde lo hayas puesto
import App from "./App.vue"; //app main
import AppIcon from "@/components/shared/AppIcon.vue";  //component
import AdminPageHeader from "@/components/shared/AdminPageHeader.vue";
import { vPermission } from "./directives/v-permission";
import "@/assets/table-system.css";
import "@/assets/tutorial.css"
import "@/assets/mobile-perf.css";

const app = createApp(App);

app.component("AppIcon", AppIcon);
app.component("AdminPageHeader", AdminPageHeader);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

app.directive("permission", vPermission);
app.use(pinia);
app.use(router);
app.mount("#app");
