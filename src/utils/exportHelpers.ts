export const exportToCSV = (filename: string, headers: string[], rows: string[][]) => {
  const content = [
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
    ...rows.map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (filename: string, sheetName: string, headers: string[], rows: string[][]) => {
  let tableHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">`;
  tableHtml += `<head><meta charset="utf-8" /><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${sheetName}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>`;
  tableHtml += `<body><table border="1"><thead><tr>`;
  
  headers.forEach(h => {
    tableHtml += `<th style="background-color: #F2B33D; color: #5C3D00; font-weight: bold;">${h}</th>`;
  });
  tableHtml += `</tr></thead><tbody>`;
  
  rows.forEach(row => {
    tableHtml += `<tr>`;
    row.forEach(cell => {
      tableHtml += `<td>${cell || ''}</td>`;
    });
    tableHtml += `</tr>`;
  });
  
  tableHtml += `</tbody></table></body></html>`;

  const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.xls') ? filename : `${filename}.xls`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (title: string, headers: string[], rows: string[][]) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  let html = `<html><head><title>${title}</title>`;
  html += `<style>
    body { font-family: 'Inter', system-ui, sans-serif; background-color: #FAF7F0; color: #1A1A18; padding: 24px; }
    h1 { font-family: 'Outfit', sans-serif; color: #5C3D00; margin-bottom: 8px; font-size: 20px; text-transform: uppercase; border-bottom: 2px solid #F2B33D; padding-bottom: 6px; }
    .meta { font-size: 11px; color: #6B6A66; margin-bottom: 20px; font-style: italic; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; background-color: #FFFDF8; }
    th { background-color: #FDECD2; color: #5C3D00; font-weight: 700; border: 1px solid #E2DFD5; padding: 8px 10px; text-align: left; text-transform: uppercase; }
    td { border: 1px solid #E2DFD5; padding: 8px 10px; color: #1A1A18; }
    tr:nth-child(even) { background-color: #FCFAF5; }
    @media print {
      body { padding: 0; background-color: white; }
    }
  </style></head><body>`;
  
  html += `<h1>${title}</h1>`;
  html += `<div class="meta">Generated officially from KaushalSetu Gujarat Registry Portal on ${new Date().toLocaleDateString()}</div>`;
  html += `<table><thead><tr>`;
  
  headers.forEach(h => {
    html += `<th>${h}</th>`;
  });
  html += `</tr></thead><tbody>`;
  
  rows.forEach(row => {
    html += `<tr>`;
    row.forEach(cell => {
      html += `<td>${cell || ''}</td>`;
    });
    html += `</tr>`;
  });
  
  html += `</tbody></table>`;
  html += `<script>
    window.onload = function() {
      window.print();
      setTimeout(function() { window.close(); }, 500);
    };
  </script></body></html>`;

  printWindow.document.write(html);
  printWindow.document.close();
};
