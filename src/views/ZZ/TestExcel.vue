<template>
  <div>
    <button @click="exportToExcel">Export to Excel</button>
  </div>
</template>

<script>
import ExcelJS from 'exceljs';

export default {
  methods: {
    async exportToExcel() {
      // Create a new Excel workbook and worksheet
    //   const res = await axios.post('laporan/stok', {
    //     tanggal1 : '2024-01-01',
    //     tanggal2 : '2024-01-02',
    //   })
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet 1');
      const worksheet2 = workbook.addWorksheet('Sheet 2');

      // Add data to the worksheet (replace this with your own data)
      worksheet.addRow(['Name', 'Age']);
      worksheet.addRow(['Name', 'Age']);
      worksheet.addRow(['John Doe', 25]);
      worksheet.addRow(['Jane Doe', 30]);
      worksheet2.addRow(['Name', 'Age']);
      worksheet2.addRow(['John Doe', 25]);
      worksheet2.addRow(['Jane Doe', 30]);

      // Save the workbook to a file or download it
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'exported_data.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
    },
  },
};
</script>

<style scoped>
/* Add your component styles here if needed */
</style>