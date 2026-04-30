function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value || 0);
}

function updateInvoice() {
  const invoiceNumber = document.getElementById('invoiceNumber').value;
  const invoiceDate = document.getElementById('invoiceDate').value;
  const dueDate = document.getElementById('dueDate').value;
  const yourInfo = document.getElementById('yourInfo').value;
  const clientInfo = document.getElementById('clientInfo').value;
  const description = document.getElementById('description').value;
  const qty = Number(document.getElementById('qty').value) || 0;
  const rate = Number(document.getElementById('rate').value) || 0;
  const tax = Number(document.getElementById('tax').value) || 0;
  const paymentDetails = document.getElementById('paymentDetails').value;
  const notes = document.getElementById('notes').value;

  const subtotal = qty * rate;
  const total = subtotal + tax;

  document.getElementById('previewInvoiceNumber').textContent = invoiceNumber;
  document.getElementById('previewInvoiceDate').textContent = invoiceDate;
  document.getElementById('previewDueDate').textContent = dueDate;
  document.getElementById('previewYourInfo').textContent = yourInfo;
  document.getElementById('previewClientInfo').textContent = clientInfo;
  document.getElementById('previewDescription').textContent = description;
  document.getElementById('previewQty').textContent = qty;
  document.getElementById('previewRate').textContent = formatCurrency(rate);
  document.getElementById('previewAmount').textContent = formatCurrency(subtotal);
  document.getElementById('previewSubtotal').textContent = formatCurrency(subtotal);
  document.getElementById('previewTax').textContent = formatCurrency(tax);
  document.getElementById('previewTotal').textContent = formatCurrency(total);
  document.getElementById('previewPaymentDetails').textContent = paymentDetails;
  document.getElementById('previewNotes').textContent = notes;
}

const today = new Date().toISOString().split('T')[0];
document.getElementById('invoiceDate').value = today;

updateInvoice();