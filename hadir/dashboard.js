document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.sidebar nav a');
    navLinks.forEach(link => {
      link.addEventListener('click', function () {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      });
    });
  
    const monthBtn = document.querySelector('.btn-primary');
    const semesterBtn = document.querySelector('.btn-outline-primary');
  
    monthBtn.addEventListener('click', () => {
      alert('Month view is already active.');
    });
  
    semesterBtn.addEventListener('click', () => {
      alert('Semester view selected.');
    });
  
    const exportBtn = document.querySelector('.payment-history button');
    exportBtn.addEventListener('click', () => {
      alert('Exporting payment history...');
    });
  
    const alertBox = document.querySelector('.alert-warning');
    if (alertBox) {
      alertBox.classList.add('animate__animated', 'animate__pulse');
    }
  });
  