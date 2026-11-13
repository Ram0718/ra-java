/**
 * Note Downloader Utility
 * Generates and triggers client-side downloads for study handbooks (Markdown and Printable PDF).
 */

export const downloadAsMarkdown = (filename: string, content: string): void => {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.md') ? filename : `${filename}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const printNotesAsPdf = (title: string, htmlContent: string): void => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print/save study notes as PDF.');
    return;
  }

  const printDocument = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} - RA-Java Study Handbook</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1D1D1F;
      background: #FFFFFF;
      padding: 40px;
      line-height: 1.6;
      font-size: 13px;
    }
    
    .header-badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #0071E3;
      background: #E8F2FD;
      padding: 4px 10px;
      border-radius: 9999px;
      margin-bottom: 12px;
    }
    
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #1D1D1F;
      margin-bottom: 6px;
      letter-spacing: -0.02em;
    }
    
    .subtitle {
      font-size: 12px;
      color: #86868B;
      margin-bottom: 24px;
      border-bottom: 1px solid #E5E5EA;
      padding-bottom: 16px;
    }
    
    h2 {
      font-size: 16px;
      font-weight: 600;
      color: #1D1D1F;
      margin-top: 24px;
      margin-bottom: 10px;
      padding-bottom: 6px;
      border-bottom: 1px solid #E5E5EA;
    }
    
    h3 {
      font-size: 14px;
      font-weight: 600;
      color: #0071E3;
      margin-top: 18px;
      margin-bottom: 8px;
    }
    
    p { margin-bottom: 12px; color: #424245; }
    ul, ol { margin-left: 20px; margin-bottom: 12px; }
    li { margin-bottom: 6px; color: #424245; }
    
    pre {
      background: #F5F5F7;
      border: 1px solid #E5E5EA;
      border-radius: 8px;
      padding: 14px;
      overflow-x: auto;
      font-family: 'JetBrains Mono', Consolas, monospace;
      font-size: 11px;
      line-height: 1.5;
      margin: 14px 0;
      color: #1D1D1F;
    }
    
    code {
      font-family: 'JetBrains Mono', Consolas, monospace;
      font-size: 11px;
      background: #F5F5F7;
      padding: 2px 5px;
      border-radius: 4px;
      color: #D12F1B;
    }
    
    pre code {
      background: transparent;
      padding: 0;
      color: #1D1D1F;
    }
    
    .callout {
      background: #FBFBFD;
      border-left: 3px solid #0071E3;
      padding: 12px 16px;
      border-radius: 0 8px 8px 0;
      margin: 14px 0;
      font-size: 12px;
    }
    
    .callout-qa {
      background: #FFF8E6;
      border-left: 3px solid #FF9500;
      padding: 12px 16px;
      border-radius: 0 8px 8px 0;
      margin: 14px 0;
    }
    
    .qa-question {
      font-weight: 600;
      color: #B45309;
      margin-bottom: 4px;
    }
    
    .qa-answer {
      color: #424245;
      font-size: 12px;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 14px;
      border-top: 1px solid #E5E5EA;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #86868B;
    }
    
    @media print {
      body { padding: 0; }
      pre { page-break-inside: avoid; }
      h2, h3 { page-break-after: avoid; }
      .callout, .callout-qa { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div>
    <div class="header-badge">RA-Java • Random Access Java Engineering Vault</div>
    <h1>${title}</h1>
    <div class="subtitle">Complete Placement &amp; Interview Handbook • Production-Ready Java 21</div>
    ${htmlContent}
    <div class="footer">
      <span>RA-Java (Random Access Java) • Placement Mastery Curriculum</span>
      <span>Printed: ${new Date().toLocaleDateString()}</span>
    </div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(printDocument);
  printWindow.document.close();
};
