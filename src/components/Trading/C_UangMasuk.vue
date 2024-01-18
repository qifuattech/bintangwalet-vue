<template>
  <v-container>
      <v-row>
          <v-col>
              <v-data-table
                  :headers="gridHeaders"
                  items="items"
                  class="elevation-1"
              >
                  
              </v-data-table>
          </v-col>
      </v-row>
  </v-container>
</template>

<script>
export default {
    data() {
        return {
            gridHeaders: [
                { text: "", value: "" }
            ],
            arrData: [

            ]
        }
    },
    mounted() {

    },
    methods: {

    }
}
</script>

<style>

</style>