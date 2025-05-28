document.addEventListener('DOMContentLoaded', () => {
    const uploadIcon = document.querySelector('.profile-cover i');
    const profileImage = document.querySelector('.profile-pic');
  
    uploadIcon.addEventListener('click', () => {
      alert('Upload profile photo functionality goes here.');
      
    });
  
    const saveButton = document.querySelector('.btn-warning');
    saveButton.addEventListener('click', () => {
      alert('Profile changes have been saved!');
    });
  });
  