
  <script>
    document.getElementById("profile-pic").addEventListener("change", function(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById("profile-pic-preview").src = e.target.result;
        }
        reader.readAsDataURL(file);
      }
    });

    // Sauvegarde des données (simulation console)
    function saveProfile() {
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const bio = document.getElementById("bio").value;
      
      console.log("Profil mis à jour !");
      console.log("Nom :", name);
      console.log("Email :", email);
      console.log("Bio :", bio);

      alert("Profil enregistré avec succès !");
    }
  </script>