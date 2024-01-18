<template>
  <v-container>
    <v-row class="d-flex justify-space-between">
        <v-col cols="auto" >
            <h2>DASHBOARD</h2>
            
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="2" class="d-flex justify-end">
            <v-btn small text color="success"><v-icon>mdi-refresh</v-icon></v-btn> 
            <v-combobox label="tahun" hide-details  rounded dense background-color="white">
               
            </v-combobox>
        </v-col>
    </v-row>
    <v-divider class="mt-2"></v-divider>
    <v-row class="mt-2">
        <v-col cols="auto" lg="3" v-for="(item,index) in header1" :key="index">
            <v-card outlined rounded="xl" class="pa-3">
                <v-card-title class="d-flex justify-space-between">
                    <v-icon x-large color="purple">{{ item.icon }}</v-icon>
                    <v-spacer></v-spacer>
                    <v-chip color="indigo" dark small>2023</v-chip>
                </v-card-title>
                <v-card-text>
                    <div class="text-h2">{{ item.value }}</div>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-text>
                    <h3>{{ item.title }}</h3>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
    data() {
        return {
            header1: [
                {
                    icon : 'mdi-scale-balance',
                    value : '1000',
                    title : 'Stok Awal'
                },
                {
                    icon : 'mdi-inbox-arrow-down-outline',
                    value : '2000',
                    title : 'Penerimaan'
                },
                {
                    icon : 'mdi-percent',
                    value : '3000',
                    title : 'Penjualan'
                },
                {
                    icon : 'mdi-archive',
                    value : '4000',
                    title : 'Stok'
                },
            ]
        }
    }
}
</script>

<style>

</style>