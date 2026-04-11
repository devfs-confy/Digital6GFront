# Page Types — Vue 3 + Tailwind CSS Reference

Complete implementation examples for common page types.

---

## Table of Contents
1. [Auth Pages](#auth-pages)
2. [Dashboard View](#dashboard-view)
3. [Data List / Table View](#data-list--table-view)
4. [Detail / Profile View](#detail--profile-view)
5. [Settings Page](#settings-page)
6. [Multi-step Form](#multi-step-form)
7. [Error Pages](#error-pages)

---

## Auth Pages

### Login Page

```vue
<!-- views/auth/LoginView.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({ email: '', password: '', remember: false })
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    await authStore.login(form.value)
    router.push({ name: 'dashboard' })
  } catch (e: any) {
    error.value = e.message || 'Invalid credentials. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout title="Welcome back" subtitle="Sign in to your account">
    <form @submit.prevent="handleSubmit" class="space-y-5" novalidate>
      <!-- Error alert -->
      <div v-if="error" role="alert" class="rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
        <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
      </div>

      <BaseInput
        v-model="form.email"
        type="email"
        label="Email address"
        placeholder="you@company.com"
        autocomplete="email"
        required
      />

      <div class="space-y-1.5">
        <BaseInput
          v-model="form.password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          autocomplete="current-password"
          required
        />
        <div class="text-right">
          <RouterLink
            :to="{ name: 'forgot-password' }"
            class="text-sm text-primary-600 hover:text-primary-700 hover:underline dark:text-primary-400"
          >
            Forgot password?
          </RouterLink>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <input
          id="remember"
          v-model="form.remember"
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label for="remember" class="text-sm text-gray-600 dark:text-gray-400">
          Remember me for 30 days
        </label>
      </div>

      <BaseButton type="submit" variant="primary" size="lg" :loading="loading" class="w-full">
        Sign in
      </BaseButton>

      <p class="text-center text-sm text-gray-500">
        Don't have an account?
        <RouterLink
          :to="{ name: 'register' }"
          class="font-medium text-primary-600 hover:underline dark:text-primary-400"
        >
          Create one
        </RouterLink>
      </p>
    </form>

    <!-- OAuth divider -->
    <div class="relative my-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-200 dark:border-gray-700" />
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="bg-white px-4 text-gray-500 dark:bg-gray-800">Or continue with</span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <button class="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
        <img src="/icons/google.svg" alt="" class="h-4 w-4" />
        Google
      </button>
      <button class="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
        <img src="/icons/github.svg" alt="" class="h-4 w-4" />
        GitHub
      </button>
    </div>
  </AuthLayout>
</template>
```

---

## Dashboard View

```vue
<!-- views/dashboard/DashboardView.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAsync } from '@/composables/useAsync'
import { getDashboardStats, getRecentActivity } from '@/api/dashboard'

const { data: stats, loading: statsLoading, execute: fetchStats } = useAsync(getDashboardStats)
const { data: activity, loading: activityLoading, execute: fetchActivity } = useAsync(getRecentActivity)

onMounted(() => {
  fetchStats()
  fetchActivity()
})

const statCards = computed(() => [
  { id: 1, label: 'Total Revenue', value: stats.value?.revenue ?? 0, format: 'currency', trend: +12.5 },
  { id: 2, label: 'Active Users', value: stats.value?.users ?? 0, format: 'number', trend: +8.2 },
  { id: 3, label: 'Conversions', value: stats.value?.conversions ?? 0, format: 'percent', trend: -2.1 },
  { id: 4, label: 'Avg. Session', value: stats.value?.avgSession ?? 0, format: 'duration', trend: +5.0 },
])
</script>

<template>
  <div class="space-y-6 p-4 sm:p-6 lg:p-8">
    <!-- Page header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Here's what's happening today.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <BaseButton variant="secondary" size="sm">Export</BaseButton>
        <BaseButton variant="primary" size="sm">New Report</BaseButton>
      </div>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <template v-if="statsLoading">
        <div v-for="i in 4" :key="i" class="h-28 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
      </template>
      <StatCard v-else v-for="stat in statCards" :key="stat.id" v-bind="stat" />
    </div>

    <!-- Content grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Main chart -->
      <BaseCard class="lg:col-span-2">
        <template #header>
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">Revenue Over Time</h2>
          <div class="flex gap-2">
            <button
              v-for="period in ['7d', '30d', '90d']"
              :key="period"
              class="rounded-md px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              {{ period }}
            </button>
          </div>
        </template>
        <RevenueChart :data="stats?.chartData" />
      </BaseCard>

      <!-- Recent activity -->
      <BaseCard>
        <template #header>
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        </template>

        <div v-if="activityLoading" class="space-y-4">
          <div v-for="i in 5" :key="i" class="flex gap-3">
            <div class="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            <div class="flex-1 space-y-1.5">
              <div class="h-3 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div class="h-3 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>

        <div v-else-if="!activity?.length">
          <EmptyState message="No activity yet" icon="activity" />
        </div>

        <ul v-else class="space-y-4" role="list">
          <li v-for="item in activity" :key="item.id" class="flex items-start gap-3">
            <img :src="item.user.avatar" :alt="item.user.name" class="h-8 w-8 rounded-full" />
            <div class="flex-1 min-w-0">
              <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
                {{ item.user.name }}
              </p>
              <p class="text-sm text-gray-500">{{ item.description }}</p>
            </div>
            <time class="flex-shrink-0 text-xs text-gray-400">{{ item.timeAgo }}</time>
          </li>
        </ul>
      </BaseCard>
    </div>
  </div>
</template>
```

---

## Data List / Table View

```vue
<!-- views/users/UsersView.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAsync } from '@/composables/useAsync'
import { getUsers } from '@/api/users'

const search = ref('')
const page = ref(1)
const perPage = ref(20)
const sortBy = ref('name')
const sortOrder = ref<'asc' | 'desc'>('asc')
const selectedIds = ref<Set<number>>(new Set())

const { data, loading, execute: fetchUsers } = useAsync(() =>
  getUsers({ search: search.value, page: page.value, perPage: perPage.value })
)

watch([search, page], fetchUsers, { immediate: true })

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Joined', sortable: true },
]

const allSelected = computed(() => data.value?.items.every(u => selectedIds.value.has(u.id)))
function toggleAll() {
  if (allSelected.value) { selectedIds.value.clear() }
  else { data.value?.items.forEach(u => selectedIds.value.add(u.id)) }
}
</script>

<template>
  <div class="space-y-4 p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
      <BaseButton variant="primary">Invite user</BaseButton>
    </div>

    <!-- Filters bar -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div class="relative flex-1">
        <Icon name="search" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          v-model="search"
          type="search"
          placeholder="Search users..."
          class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div class="flex gap-2">
        <BaseButton variant="secondary" size="sm">
          <Icon name="filter" class="h-4 w-4" />
          Filters
        </BaseButton>
        <BaseButton variant="secondary" size="sm">
          <Icon name="download" class="h-4 w-4" />
          Export
        </BaseButton>
      </div>
    </div>

    <!-- Bulk actions (shown when items selected) -->
    <Transition name="slide-down">
      <div v-if="selectedIds.size > 0" class="flex items-center justify-between rounded-lg bg-primary-50 px-4 py-2.5 dark:bg-primary-900/20">
        <span class="text-sm font-medium text-primary-700 dark:text-primary-300">
          {{ selectedIds.size }} selected
        </span>
        <div class="flex gap-2">
          <BaseButton variant="ghost" size="sm">Assign role</BaseButton>
          <BaseButton variant="danger" size="sm">Delete</BaseButton>
        </div>
      </div>
    </Transition>

    <!-- Table (desktop) -->
    <div class="hidden overflow-hidden rounded-xl ring-1 ring-gray-200 dark:ring-gray-700 md:block">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            <th class="w-10 px-4 py-3">
              <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleAll"
                class="h-4 w-4 rounded border-gray-300 text-primary-600"
              />
            </th>
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400"
            >
              <button v-if="col.sortable" class="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200">
                {{ col.label }}
                <Icon name="chevrons-up-down" class="h-3.5 w-3.5" />
              </button>
              <span v-else>{{ col.label }}</span>
            </th>
            <th class="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-100 bg-white dark:divide-gray-700/50 dark:bg-gray-800">
          <!-- Loading skeleton -->
          <template v-if="loading">
            <tr v-for="i in 5" :key="i">
              <td v-for="j in 7" :key="j" class="px-4 py-3">
                <div class="h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </td>
            </tr>
          </template>

          <!-- Empty state -->
          <tr v-else-if="!data?.items.length">
            <td :colspan="columns.length + 2" class="py-16 text-center">
              <EmptyState message="No users found" hint="Try adjusting your search or filters" icon="users" />
            </td>
          </tr>

          <!-- Data rows -->
          <tr
            v-else
            v-for="user in data.items"
            :key="user.id"
            class="group hover:bg-gray-50 dark:hover:bg-gray-700/30"
          >
            <td class="px-4 py-3">
              <input
                type="checkbox"
                :checked="selectedIds.has(user.id)"
                @change="selectedIds.has(user.id) ? selectedIds.delete(user.id) : selectedIds.add(user.id)"
                class="h-4 w-4 rounded border-gray-300 text-primary-600"
              />
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img :src="user.avatar" :alt="user.name" class="h-8 w-8 rounded-full" />
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ user.name }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ user.email }}</td>
            <td class="px-4 py-3">
              <RoleBadge :role="user.role" />
            </td>
            <td class="px-4 py-3">
              <StatusBadge :status="user.status" />
            </td>
            <td class="px-4 py-3 text-gray-500">{{ user.createdAt }}</td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <BaseButton variant="ghost" size="sm" :to="{ name: 'user-detail', params: { id: user.id } }">
                  View
                </BaseButton>
                <DropdownMenu :items="userActions(user)" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile card list -->
    <div class="space-y-3 md:hidden">
      <div
        v-for="user in data?.items"
        :key="user.id"
        class="rounded-xl bg-white p-4 ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <img :src="user.avatar" :alt="user.name" class="h-10 w-10 rounded-full" />
            <div>
              <p class="font-semibold text-gray-900 dark:text-white">{{ user.name }}</p>
              <p class="text-sm text-gray-500">{{ user.email }}</p>
            </div>
          </div>
          <StatusBadge :status="user.status" />
        </div>
        <div class="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
          <RoleBadge :role="user.role" />
          <RouterLink :to="{ name: 'user-detail', params: { id: user.id } }" class="text-sm font-medium text-primary-600 hover:underline">
            View →
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <p class="text-sm text-gray-500">
        Showing {{ data?.from }}–{{ data?.to }} of {{ data?.total }} users
      </p>
      <div class="flex gap-1">
        <BaseButton variant="secondary" size="sm" :disabled="page === 1" @click="page--">
          Previous
        </BaseButton>
        <BaseButton variant="secondary" size="sm" :disabled="page >= data?.lastPage" @click="page++">
          Next
        </BaseButton>
      </div>
    </div>
  </div>
</template>
```

---

## Detail / Profile View

```vue
<!-- views/users/UserDetailView.vue -->
<script setup lang="ts">
const route = useRoute()
const { data: user, loading, execute } = useAsync(() => getUser(route.params.id as string))
const activeTab = ref('overview')
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'activity', label: 'Activity' },
  { id: 'settings', label: 'Settings' },
]
onMounted(execute)
</script>

<template>
  <div v-if="loading" class="p-8">
    <!-- Skeleton -->
    <div class="animate-pulse space-y-6">
      <div class="h-32 rounded-xl bg-gray-200 dark:bg-gray-700" />
      <div class="h-64 rounded-xl bg-gray-200 dark:bg-gray-700" />
    </div>
  </div>

  <div v-else-if="user" class="space-y-6 p-4 sm:p-6 lg:p-8">
    <!-- Hero header card -->
    <BaseCard>
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <img :src="user.avatar" :alt="user.name" class="h-20 w-20 rounded-full ring-4 ring-white dark:ring-gray-800" />
          <div class="text-center sm:text-left">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ user.name }}</h1>
            <p class="text-gray-500">{{ user.email }}</p>
            <div class="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
              <StatusBadge :status="user.status" />
              <RoleBadge :role="user.role" />
            </div>
          </div>
        </div>
        <div class="flex justify-center gap-2 sm:justify-end">
          <BaseButton variant="secondary" size="sm">Message</BaseButton>
          <BaseButton variant="primary" size="sm">Edit</BaseButton>
          <DropdownMenu :items="userActions" />
        </div>
      </div>

      <!-- Quick stats -->
      <div class="mt-6 grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100 pt-6 dark:divide-gray-700 dark:border-gray-700">
        <div v-for="stat in user.quickStats" :key="stat.label" class="px-4 text-center">
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
          <p class="text-sm text-gray-500">{{ stat.label }}</p>
        </div>
      </div>
    </BaseCard>

    <!-- Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="-mb-px flex gap-6" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="[
            'border-b-2 pb-3 text-sm font-medium transition-colors',
            activeTab === tab.id
              ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300',
          ]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Tab content -->
    <div class="grid gap-6 lg:grid-cols-3">
      <div class="space-y-6 lg:col-span-2">
        <!-- Main content for active tab -->
      </div>
      <div class="space-y-6">
        <!-- Sidebar info -->
        <BaseCard>
          <h3 class="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Details</h3>
          <dl class="space-y-3">
            <div v-for="detail in user.details" :key="detail.label" class="flex justify-between">
              <dt class="text-sm text-gray-500">{{ detail.label }}</dt>
              <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ detail.value }}</dd>
            </div>
          </dl>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
```

---

## Settings Page

```vue
<!-- views/settings/SettingsView.vue -->
<script setup lang="ts">
const sections = [
  { id: 'profile', label: 'Profile', icon: 'user' },
  { id: 'account', label: 'Account', icon: 'settings' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
  { id: 'security', label: 'Security', icon: 'shield' },
  { id: 'billing', label: 'Billing', icon: 'credit-card' },
  { id: 'team', label: 'Team', icon: 'users' },
  { id: 'danger', label: 'Danger Zone', icon: 'alert-triangle' },
]
const activeSection = ref('profile')
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <h1 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

    <div class="flex flex-col gap-6 lg:flex-row">
      <!-- Sidebar nav -->
      <aside class="lg:w-56 lg:flex-shrink-0">
        <!-- Mobile: horizontal scroll -->
        <div class="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          <button
            v-for="section in sections"
            :key="section.id"
            :class="[
              'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
              activeSection === section.id
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
              section.id === 'danger' ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20' : '',
            ]"
            @click="activeSection = section.id"
          >
            <Icon :name="section.icon" class="h-4 w-4 flex-shrink-0" />
            {{ section.label }}
          </button>
        </div>
      </aside>

      <!-- Content -->
      <div class="min-w-0 flex-1">
        <KeepAlive>
          <component :is="sectionComponent" />
        </KeepAlive>
      </div>
    </div>
  </div>
</template>
```

### Settings Section Template
```vue
<!-- Pattern for each settings section -->
<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>
      <p class="mt-1 text-sm text-gray-500">Manage your public profile information.</p>
    </div>

    <BaseCard>
      <form @submit.prevent="save" class="space-y-6">
        <!-- Avatar upload -->
        <div class="flex items-center gap-4">
          <img :src="form.avatar" alt="Avatar" class="h-16 w-16 rounded-full" />
          <div>
            <BaseButton variant="secondary" size="sm" type="button">Change photo</BaseButton>
            <p class="mt-1 text-xs text-gray-500">JPG, GIF or PNG. Max 1MB.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <BaseInput v-model="form.firstName" label="First name" required />
          <BaseInput v-model="form.lastName" label="Last name" required />
        </div>

        <BaseInput v-model="form.email" type="email" label="Email address" required />
        <BaseInput v-model="form.bio" label="Bio" hint="Brief description for your profile." />

        <div class="flex items-center justify-end gap-2 border-t border-gray-100 pt-6 dark:border-gray-700">
          <BaseButton variant="secondary">Cancel</BaseButton>
          <BaseButton type="submit" variant="primary" :loading="saving">Save changes</BaseButton>
        </div>
      </form>
    </BaseCard>

    <!-- Danger zone -->
    <BaseCard v-if="section === 'account'" class="ring-red-200 dark:ring-red-800">
      <h3 class="text-base font-semibold text-red-700 dark:text-red-400">Delete account</h3>
      <p class="mt-1 text-sm text-gray-500">
        Once deleted, your account cannot be recovered. All data will be permanently erased.
      </p>
      <BaseButton variant="danger" size="sm" class="mt-4" @click="showDeleteConfirm = true">
        Delete my account
      </BaseButton>
    </BaseCard>
  </div>
</template>
```

---

## Multi-step Form

```vue
<!-- components/MultiStepForm.vue -->
<script setup lang="ts">
const steps = [
  { id: 1, label: 'Basic info', icon: 'user' },
  { id: 2, label: 'Details', icon: 'file-text' },
  { id: 3, label: 'Review', icon: 'check-circle' },
]
const currentStep = ref(1)
const form = reactive({ name: '', email: '', plan: '', terms: false })

function next() { if (currentStep.value < steps.length) currentStep.value++ }
function prev() { if (currentStep.value > 1) currentStep.value-- }
</script>

<template>
  <div class="mx-auto max-w-2xl p-4 sm:p-6">
    <!-- Step indicator -->
    <nav aria-label="Progress" class="mb-8">
      <ol class="flex items-center">
        <li
          v-for="(step, i) in steps"
          :key="step.id"
          class="flex items-center"
          :class="i < steps.length - 1 ? 'flex-1' : ''"
        >
          <div class="flex items-center gap-2">
            <div
              :class="[
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
                currentStep > step.id ? 'bg-primary-600 text-white' : '',
                currentStep === step.id ? 'border-2 border-primary-600 text-primary-600' : '',
                currentStep < step.id ? 'border-2 border-gray-300 text-gray-400' : '',
              ]"
            >
              <Icon v-if="currentStep > step.id" name="check" class="h-4 w-4" />
              <span v-else>{{ step.id }}</span>
            </div>
            <span class="hidden text-sm font-medium sm:block" :class="currentStep >= step.id ? 'text-gray-900 dark:text-white' : 'text-gray-400'">
              {{ step.label }}
            </span>
          </div>
          <div v-if="i < steps.length - 1" :class="['mx-4 flex-1 border-t-2 transition-colors', currentStep > step.id ? 'border-primary-600' : 'border-gray-200']" />
        </li>
      </ol>
    </nav>

    <!-- Step content -->
    <BaseCard>
      <Transition name="step" mode="out-in">
        <div :key="currentStep">
          <Step1 v-if="currentStep === 1" v-model="form" />
          <Step2 v-else-if="currentStep === 2" v-model="form" />
          <Step3 v-else :form="form" />
        </div>
      </Transition>

      <!-- Navigation -->
      <div class="mt-6 flex items-center justify-between border-t border-gray-100 pt-6 dark:border-gray-700">
        <BaseButton v-if="currentStep > 1" variant="secondary" @click="prev">
          Back
        </BaseButton>
        <div v-else />
        <BaseButton v-if="currentStep < steps.length" variant="primary" @click="next">
          Continue
        </BaseButton>
        <BaseButton v-else variant="primary" type="submit" :loading="submitting">
          Complete
        </BaseButton>
      </div>
    </BaseCard>
  </div>
</template>

<style scoped>
.step-enter-active, .step-leave-active { transition: all 0.2s ease; }
.step-enter-from { opacity: 0; transform: translateX(16px); }
.step-leave-to { opacity: 0; transform: translateX(-16px); }
</style>
```

---

## Error Pages

```vue
<!-- views/errors/NotFoundView.vue -->
<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-4 text-center">
    <p class="text-7xl font-black text-primary-600 dark:text-primary-400">404</p>
    <h1 class="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Page not found</h1>
    <p class="mt-2 text-gray-500">
      Sorry, we couldn't find the page you're looking for.
    </p>
    <div class="mt-8 flex gap-3">
      <BaseButton variant="primary" @click="router.back()">Go back</BaseButton>
      <BaseButton variant="secondary" :to="{ name: 'dashboard' }">Dashboard</BaseButton>
    </div>
  </div>
</template>
```

---

## Transitions Reference

```vue
<!-- Page transition in App.vue / RouterView -->
<RouterView v-slot="{ Component }">
  <Transition name="page" mode="out-in">
    <component :is="Component" :key="$route.path" />
  </Transition>
</RouterView>

<style>
.page-enter-active { transition: opacity 0.2s, transform 0.2s; }
.page-leave-active { transition: opacity 0.15s, transform 0.15s; }
.page-enter-from { opacity: 0; transform: translateY(8px); }
.page-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
```