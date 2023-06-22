// Éléments de la galerie
const gallery = document.getElementById("gallery");
const miniGallery = document.getElementById("miniGallery");

// Filtres de la galerie
const filterAll = document.getElementById("filterAll");
const filterObjects = document.getElementById("filterObjects");
const filterAppartements = document.getElementById("filterAppartements");
const filterHotelRestos = document.getElementById("filterHotelRestos");

// Modales de modification de la galerie
const editWindow = document.getElementById("editWindow");
const editGallery = document.getElementById("editGallery");
const addPhoto = document.getElementById("addPhoto");
const addPhotoButton = document.getElementById("addPhotoButton");
const backButton = document.getElementById("backButton");
const closeButton1 = document.getElementById("closeButton1");
const closeButton2 = document.getElementById("closeButton2");
const addPhotoSection = document.getElementById("addPhotoSection");
const uploadButton = document.getElementById("uploadButton");
const imageUpload = document.getElementById("imageUpload");
const newPhoto = document.getElementById("newPhoto");
const newImage = document.getElementById("newImage");
const title = document.getElementById("title");
const categories = document.getElementById("categories");
const validation = document.getElementById("validation");
const deleteGallery = document.getElementById("deleteGallery");

// Liste des projets à supprimer
const projectsToDelete = [];

// Récupération des projets depuis l'API
function getProjects() {
  return fetch("http://localhost:5678/api/works").json();
}

// Affichage des projets, filtrés si une catégorie est spécifiée
function showProjects(category, projectsList) {
  gallery.innerHTML = "";
  let projectsToShow = projectsList;
  if (["Objets", "Appartements", "Hotels & restaurants"].includes(category)) {
    projectsToShow = projectsList.filter((project) => project.category.name === category);
  }
  projectsToShow.forEach((project) => {
    const projectElement = document.createElement("figure");
    projectElement.style.order = project.id;
    const projectImage = document.createElement("img");
    projectImage.src = project.imageUrl;
    projectImage.alt = project.title;
    const projectTitle = document.createElement("figcaption");
    projectTitle.innerHTML = project.title;
    projectElement.appendChild(projectImage);
    projectElement.appendChild(projectTitle);
    gallery.appendChild(projectElement);
  });
}

// Affichage des projets en miniature dans la modale de modification de la galerie
function showMiniProjects(projectsList) {
  miniGallery.innerHTML = "";
  projectsList.forEach((project) => {
    const miniProject = document.createElement("div");
    miniProject.classList.add("miniProject");
    miniProject.style.order = project.id;
    const miniImg = document.createElement("img");
    miniImg.src = project.imageUrl;
    miniImg.alt = project.title;
    miniProject.appendChild(miniImg);
    const miniTitle = document.createElement("p");
    miniTitle.textContent = "éditer";
    miniProject.appendChild(miniTitle);
    const moveProject = document.createElement("div");
    moveProject.classList.add("moveProject");
    miniProject.appendChild(moveProject);
    const moveIcon = document.createElement("i");
    moveIcon.classList.add("fa-solid", "fa-arrows-up-down-left-right");
    moveProject.appendChild(moveIcon);
    const deleteProjectBtn = document.createElement("div");
    deleteProjectBtn.classList.add("deleteProject");
    deleteProjectBtn.id = project.id;
    miniProject.appendChild(deleteProjectBtn);
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can");
    deleteProject.appendChild(deleteIcon);
    miniGallery.appendChild(miniProject);
    projectsToDelete[project.id] = document.getElementById(`${project.id}`);
    projectsToDelete[project.id].addEventListener("click", () => {
      deleteProject(project.id);
    });
  });
}

// Suppression de projets
function deleteProject(id) {
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + JSON.parse(sessionStorage.getItem("userData")).token },
  })
    .then(() => main());
}

// Gestion des modales
function openModale() {
  editWindow.style.display = "block";
  editGallery.style.display = "flex";
  addPhoto.style.display = "none";
}

function switchModale(modale1, modale2) {
    modale1.style.display = "none";
    modale2.style.display = "flex";
    resetAddPhotoModale()
}
 
function closeModale() {
  editWindow.style.display = "none";
  resetAddPhotoModale()
}

function resetAddPhotoModale() {
  newPhoto.style.display = "none";
  newPhoto.innerHTML = "";
  title.value = "";
  categories.selectedIndex = 0;
  activeButton();
}

// Gestion de l'ajout d'image
function uploadImage() {
  imageUpload.click();
}

function handleImageUpload(event) {
  const imgLink = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const img = document.createElement("img");
    img.src = event.target.result;
    img.id = "newImage";
    newPhoto.appendChild(img);
    newPhoto.style.display = "flex";
    activeButton();
  };

  reader.readAsDataURL(imgLink);
}












// Création des options de sélection des catégories pour l'ajout de projet
async function createCategoryOptions() {
  const categoriesList = await fetch("http://localhost:5678/api/categories").json();
  categories.add(new Option("", 0));
  categoriesList.forEach((category) => {
    categories.add(new Option(category.name, category.id));
  });
}

// Activation du bouton de validation
function activeButton() {
  if (!!newPhoto.querySelector("img") && title.value.trim() !== "" && categories.value !== "0") {
    validation.style.backgroundColor = "#1D6154";
    validation.style.cursor = "pointer";
    return true;
  } else {
    validation.style.backgroundColor = "#A7A7A7";
    validation.style.cursor = "auto";
    return false;
  }
}
title.addEventListener("input", activeButton);
categories.addEventListener("change", activeButton);

// Ajout d'un projet
function addProject() {
  if (activeButton()) {
    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { Authorization: "Bearer " + JSON.parse(sessionStorage.getItem("userData")).token },
        body: {
            image: imageUpload.files[0],
            title: title.value.trim(),
            category: categories.value
        },
      })
      .then(() => {
        addPhoto.style.display = "none";
        editGallery.style.display = "flex";
        resetModale();
        main();
      })
  }
}

// Suppression de la galerie
function deleteGalleryAction() {
  fetch("http://localhost:5678/api/works", {
    method: "DELETE",
    headers: { Authorization: "Bearer " + JSON.parse(sessionStorage.getItem("userData")).token },
  })
    .then(() => {
      editWindow.style.display = "none";
      resetModale();
      main();
    })
}

// Fonction principale pour afficher les projets et gérer les événements
async function main() {
  const projects = await getProjects();

  showProjects("All", projects);
  showMiniProjects(projects);

  filterAll.addEventListener("click", () => {
    showProjects("All", projects);
  });

  filterObjects.addEventListener("click", () => {
    showProjects("Objets", projects);
  });

  filterAppartements.addEventListener("click", () => {
    showProjects("Appartements", projects);
  });

  filterHotelRestos.addEventListener("click", () => {
    showProjects("Hotels & restaurants", projects);
  });

  addPhotoButton.addEventListener("click", () => {
    openModale();
  });

  backButton.addEventListener("click", () => {
    goBackToGallery();
  });

  closeButton1.addEventListener("click", () => {
    closeModale();
  });

  closeButton2.addEventListener("click", () => {
    closeModale();
  });

  uploadButton.addEventListener("click", () => {
    uploadImage();
  });

  imageUpload.addEventListener("change", (event) => {
    handleImageUpload(event);
  });

  validation.addEventListener("click", () => {
    addProject();
  });

  deleteGallery.addEventListener("click", () => {
    deleteGalleryConfirmation();
  });

  deleteGallery.addEventListener("dblclick", () => {
    deleteGalleryAction();
  });
}

// Lancement de la fonction principale
main();