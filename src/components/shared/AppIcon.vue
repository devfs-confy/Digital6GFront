<!-- src/components/shared/AppIcon.vue -->
<template>
    <span class="inline-flex items-center justify-center" :style="{ width: size + 'px', height: size + 'px' }"
        v-html="svgContent" />
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    name: { type: String, required: true },
    size: { type: [String, Number], default: 18 },
})

const svgContent = ref('')

const loadIcon = async (name) => {
    try {
        const mod = await import(`@/assets/img/${name}.svg?raw`)

        // Elimina fill y stroke hardcodeados para que respeten currentColor
        const cleaned = mod.default
            .replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"')
            .replace(/stroke="(?!none)[^"]*"/g, 'stroke="currentColor"')

        svgContent.value = cleaned
    } catch {
        console.warn(`[AppIcon] Icono no encontrado: ${name}.svg`)
        svgContent.value = ''
    }
}

watch(() => props.name, loadIcon, { immediate: true })
</script>

<style scoped>
span :deep(svg) {
    width: 100%;
    height: 100%;
    fill: currentColor;
    display: block;
}
</style>

<!--
account_box
account_box_green
account_circle
account_circle_green
account_circle_off
add
airport_shuttle
arrow_back_ios_new
arrow_left_alt
assignment
assignment_green
attach_money
av1
av1_green
calendar_add_on
calendar_add_on_green
calendar_check
calendar_check_green
calendar_month
car_lock
car_tag
car_tag_green
car-side
colapsenobg
colapsenormal
confyaside
confylogo
content_paste_search
contract
contract_edit
contract_edit_green
contract_green
contact_support
credit_card_gear
credit_card_off
credit_score
dashboard_customize
dashboard_customize_white
edit_square
emoji_transportation
emoji_transportation_green
event_available
event_available_green
home
how_to_reg
id_card
manage_accounts
manage_accounts_green
notifications
parking_sign
parking_sign_green
payment_card
payment_card_green
person_edit
query_stats
receipt_long
receipt_long_green
scan_delete
search
settings
stacked_email
stacked_email_green
swap_driving_apps
two_wheeler
verified
verified_green
visibility
visibility_off 
gpp_maybe
arrow_shape_up_stack
-->