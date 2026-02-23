<template>
    <div>
        <input type="text" v-model="searchTerm" placeholder="Search table..." />
        <table>
            <thead>
                <tr>
                    <th v-for="header in headers" :key="header">{{ header }}</th>
                </tr>
            </thead>
            <tbody>
                <!-- Iterate over the computed property (filteredRows) -->
                <tr v-for="(row, index) in filteredRows" :key="`row-${index}`">
                    <td v-for="(value, key) in row" :key="key">{{ value }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const searchTerm = ref('');
const headers = ['Name', 'Department', 'Employee ID'];
const tableData = ref([
    { Name: 'John Doe', Department: 'Engineering', 'Employee ID': 101 },
    { Name: 'Jane Smith', Department: 'Sales', 'Employee ID': 102 },
    { Name: 'Peter Jones', Department: 'Engineering', 'Employee ID': 103 },
]);

// Computed property to filter the table data
const filteredRows = computed(() => {
    if (!searchTerm.value) {
        return tableData.value;
    }
    const lowerCaseSearch = searchTerm.value.toLowerCase();

    return tableData.value.filter(row => {
        // Check if any value in the row matches the search term
        return Object.values(row).some(value =>
            String(value).toLowerCase().includes(lowerCaseSearch)
        );
    });
});
</script>
