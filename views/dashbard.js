document.addEventListener("DOMContentLoaded", function() {
    const menuItems = document.querySelectorAll(".sidebar ul li");
    menuItems.forEach(item => {
        item.addEventListener("click", function() {
            menuItems.forEach(i => i.classList.remove("active"));
            this.classList.add("active");
        });
    });

    const uploadButton = document.querySelector(".upload-btn");
    if (uploadButton) {
        uploadButton.addEventListener("click", function() {
            alert("Upload New Content clicked!");
        });
    }
});