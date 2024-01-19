<!-- ExcelExport.vue -->
<template>
  <div>
    <button @click="exportToExcel">Export to Excel</button>
  </div>
</template>

<script>
import ExcelJS from "exceljs";
import axios from "axios";

export default {
  methods: {
    async exportToExcel() {
      try {
        // Make an API request to fetch data (replace 'apiEndpoint' with your actual API endpoint)
        const response = await axios.post("laporan/stok", {
          tanggal1: "2024-01-01",
          tanggal2: "2024-01-20",
        });
        console.log(response.data.data);
        // Create a new Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet 1");

        // Add data to the worksheet
        worksheet.addRow(["Laporan Peridoe", this.periode.tanggal1, this.periode.tanggal2 ]);
        worksheet.addRow(["Name", "Age"]);
        worksheet.addRow(["Name", "Age"]);

        // Add fetched data to the worksheet
        response.data.data.forEach((item) => {
          worksheet.addRow([item.kode_bahan, item.nama_bahan]);
        });

        // Save the workbook to a file or download it
        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "exported_data.xlsx";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        });
      } catch (error) {
        console.error("Error fetching data from the API", error);
      }
    },
  },
};
</script>

<style scoped>
/* Add your component styles here if needed */
</style>
