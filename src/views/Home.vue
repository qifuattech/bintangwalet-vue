<template>
  <v-container >
    <v-row class="d-flex justify-center mt-12" >
      <v-col cols="auto">
        <h1>SELAMAT DATANG DI APLIKASI WEB - POS</h1>
        <v-divider></v-divider>
        <div class="d-flex justify-center mt-2">
          <h1>{{ $store.state.auth.company.group }}</h1>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {

};
</script>

<style>
</style>