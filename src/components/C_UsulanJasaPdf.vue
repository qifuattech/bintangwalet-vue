<template>
  <v-row> </v-row>
</template>

<script>
import { jsPDF } from "jspdf";
export default {
  props: ["noUsulan"],
  mounted() {
    this.cetak();
    this.loadDetail();
  },
  methods: {
    cetak() {
      var doc = new jsPDF();

      doc.setFontSize(14);
      doc.text(this.noUsulan, 15, 15);

      doc.line(15,20,80,20)

      var string = doc.output("datauristring");
      var embed = "<embed width='100%' height='100%' src='" + string + "'/>";
      var x = window.open();
      x.document.open();
      x.document.write(embed);
      x.document.close();
    },
    loadDetail() {

    }
  },
};
</script>

<style>
</style>