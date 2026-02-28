// src/directives/v-permission.js
import { useAuth } from "@/composables/useAuth"; // <-- ESTA IMPORTACIÓN ES CRUCIAL

export const vPermission = {
  mounted(el, binding) {
    const { hasPermission } = useAuth();
    if (!hasPermission(binding.value)) {
      el.remove();
    }
  },
};

function checkPermission(el, binding) {
  const { value } = binding;
  const { hasPermission } = useAuth();

  if (!hasPermission(value)) {
    el.parentNode && el.parentNode.removeChild(el);
  }
}
