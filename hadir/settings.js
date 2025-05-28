function toggleChangePassword() {
    const section = document.getElementById("changePasswordSection");
    section.style.display = section.style.display === "none" ? "block" : "none";
  }
  
  function submitPasswordChange() {
    const oldPass = document.getElementById("oldPassword").value;
    const newPass = document.getElementById("newPassword").value;
    const confirmPass = document.getElementById("confirmPassword").value;
  
    if (newPass !== confirmPass) {
      alert("New passwords do not match!");
      return;
    }
  
    console.log("Password updated from", oldPass, "to", newPass);
    alert("Password successfully updated!");
  }
  
  function editProfile() {
    alert("Edit profile clicked - implement modal or inline form here.");
  }
  
  function toggleDarkMode() {
    const isDark = document.getElementById("darkModeSwitch").checked;
    if (isDark) {
      document.body.style.backgroundColor = "#121212";
      document.querySelector('.main-content').style.color = "white";
    } else {
      document.body.style.backgroundColor = "#f8f9fa";
      document.querySelector('.main-content').style.color = "black";
    }
  }
  
  function showTerms() {
    alert("Terms and Conditions clicked.");
  }
  
  function changeLanguage() {
    alert("Language change clicked.");
  }
  
  function logout() {
    alert("Logged out successfully.");
  }
  