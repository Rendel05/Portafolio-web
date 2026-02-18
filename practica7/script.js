const cloudUser = "dkhyey2os";
const uploadPreset = "Testing";

const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const loadingIndicator = document.getElementById("loadingIndicator");
const errorMessage = document.getElementById("errorMessage");
const resultContainer = document.getElementById("resultContainer");
const uploadedImage = document.getElementById("uploadedImage");

uploadBtn.addEventListener("click", function () {

  const file = fileInput.files[0];

  if (!file) {
    showError("Selecciona una imagen primero.");
    return;
  }

  if (!file.type.startsWith("image/")) {
    showError("Solo se permiten archivos de imagen.");
    return;
  }

  errorMessage.classList.add("d-none");
  resultContainer.classList.add("d-none");

  uploadBtn.disabled = true;
  loadingIndicator.classList.remove("d-none");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const url = `https://api.cloudinary.com/v1_1/${cloudUser}/image/upload`;

  fetch(url, {
    method: "POST",
    body: formData
  })
  .then(response => response.json())
  .then(data => {

    if (data.error) {
      throw new Error(data.error.message);
    }

    const transformedUrl = data.secure_url.replace(
      "/upload/",
      "/upload/w_400,h_400,c_fill,g_auto,e_sepia,q_auto,f_auto/"
    );

    uploadedImage.src = transformedUrl;
    resultContainer.classList.remove("d-none");
  })
  .catch(error => {
    showError("Error al subir la imagen: " + error.message);
  })
  .finally(() => {
    uploadBtn.disabled = false;
    loadingIndicator.classList.add("d-none");
  });

});

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("d-none");
}