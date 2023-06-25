// Éléments de la galerie
const portfolio = document.getElementById("portfolio");
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

// Gestion des projets
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
const deleteGalleryBtn = document.getElementById("deleteGalleryBtn");

// recuperation des projets depuis l'API
let projectsList = []
async function getProjects() {
    try {
        const response = await fetch("http://localhost:5678/api/works")
        projectsList = await response.json()
    } catch {
        const noProject = document.createElement("p")
        noProject.classList.add("no-project")
        noProject.innerHTML = "Erreur de récupération des Projets<br><br>Vérifiez le bon démarrage de l'API"
        portfolio.appendChild(noProject)
    }
}

// affichage des projets, filtrés si la fonction a été appelée avec un filtre
async function showMainProjects(category, projectsList) {
    gallery.innerHTML = ""
    let projectsToShow = projectsList
    if(["Objets", "Appartements", "Hotels & restaurants"].includes(category)) {
        projectsToShow = await projectsList.filter((project) => project.category.name === category)
    }
    projectsToShow.forEach((project) => {
        const projectElement = document.createElement("figure")
        projectElement.style.order = project.id
        const projectImage = document.createElement("img")
        projectImage.setAttribute("src", project.imageUrl)
        projectImage.setAttribute("alt", project.title)
        const projectTitle = document.createElement("figcaption")
        projectTitle.innerHTML = project.title
        projectElement.appendChild(projectImage)
        projectElement.appendChild(projectTitle)
        gallery.appendChild(projectElement)
    })
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
function closeModale(event) {
    if (event.target === editWindow || event.target === closeButton1 || event.target === closeButton2) {
        editWindow.style.display = "none";
        resetAddPhotoModale();
    }
}
function resetAddPhotoModale() {
    newPhoto.style.display = "none";
    newPhoto.innerHTML = "";
    imageUpload.value = "";
    title.value = "";
    categories.selectedIndex = 0;
    activeButton();
}

// affichage des projets en miniature sur la modale de modification de la galerie avec le bouton de suppression
let projectsToDelete = []
function showMiniProjects(projectsList) {
    miniGallery.innerHTML = ""
    projectsList.forEach((project) => {
        const miniProject = document.createElement("div")
        miniProject.setAttribute("class", "miniProject")
        miniProject.style.order = project.id
        const miniImg = document.createElement("img")
        miniImg.setAttribute("src", project.imageUrl)
        miniImg.setAttribute("alt", project.title)
        const miniTitle = document.createElement("p")
        miniTitle.textContent = "éditer"
        const moveProject = document.createElement("div")
        moveProject.setAttribute("class", "moveProject")
        const moveIcon = document.createElement("i")
        moveIcon.classList.add("fa-solid", "fa-arrows-up-down-left-right")
        const deleteProjectBtn = document.createElement("div")
        deleteProjectBtn.setAttribute("class", "deleteProject")
        deleteProjectBtn.setAttribute("id", `${project.id}`)
        const deleteIcon = document.createElement("i")
        deleteIcon.classList.add("fa-solid", "fa-trash-can")
        miniProject.appendChild(miniImg)
        miniProject.appendChild(miniTitle)
        miniProject.appendChild(moveProject)
        miniProject.appendChild(deleteProjectBtn)
        moveProject.appendChild(moveIcon)
        deleteProjectBtn.appendChild(deleteIcon)        
        miniGallery.appendChild(miniProject)  
        
        projectsToDelete[project.id] = document.getElementById(`${project.id}`)
        projectsToDelete[project.id].addEventListener('click', function () {
            deleteProject(project.id)
        })
    })
}

// Gestion de l'ajout et affichage d'une image
let imgLink = ""
uploadButton.addEventListener("click", function(addImage) {
        addImage.preventDefault();
        imageUpload.click();
})
imageUpload.addEventListener("change", function(getImage) {
        imgLink = getImage.target.files[0];
        const reader = new FileReader();
        reader.onload = function(showImage) {
            const img = document.createElement("img");
            img.setAttribute("src", showImage.target.result);
            img.setAttribute("id", "newImage");
            newPhoto.appendChild(img);
            newPhoto.style.display = "flex";
            activeButton();
        }
        reader.readAsDataURL(imgLink);
})

// Ajout des options de catégories pour l'ajout de projet
async function createCategoryOptions() {
    const categoriesList = await fetch("http://localhost:5678/api/categories").then(response => response.json());
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
        validation.addEventListener("click", addProject)
    } else {
        validation.style.backgroundColor = "#A7A7A7";
        validation.style.cursor = "auto";
        validation.removeEventListener("click", addProject)
    }
}

// Ajout d'un projet et raffraichissement des galeries
function addProject() {
        const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + JSON.parse(sessionStorage.getItem("userData")).token);
        const formdata = new FormData();
            formdata.append("id", projectsList[projectsList.length - 1].id + 1);
            formdata.append("image", imgLink);
            formdata.append("title", title.value.trim());
            formdata.append("category", categories.value);
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
        };
        fetch("http://localhost:5678/api/works", requestOptions)
        .then(() => {
            switchModale(addPhoto, editGallery)
            showProjects()
        })
}

// Suppression de projets, de la gallerieet raffraichissement de la galerie
function deleteProject(id) {
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + JSON.parse(sessionStorage.getItem("userData")).token },
    })
    .then(() => showProjects());
}
async function deleteGallery() {
    await getProjects();
    for (let i = projectsList.length - 1; i >= 0; i--) {
        const project = projectsList[i];
        deleteProject(project.id);
        await new Promise(wait => setTimeout(wait, 1000));
    }
}

// Affichage des projets
async function showProjects() {
    await getProjects()
    showMainProjects("", projectsList)
    showMiniProjects(projectsList)
}

// Fonction principale regroupant les appels des autres fonctions
async function main() {
    await getProjects()
    showProjects()
    createCategoryOptions()

    filterAll.addEventListener("click", () => showMainProjects("", projectsList))
    filterObjects.addEventListener("click", () => showMainProjects("Objets", projectsList))
    filterAppartements.addEventListener("click", () => showMainProjects("Appartements", projectsList))
    filterHotelRestos.addEventListener("click", () => showMainProjects("Hotels & restaurants", projectsList))

    editProjects.addEventListener("click", openModale)
    editWindow.addEventListener("click", closeModale)
    addPhotoButton.addEventListener("click", () => switchModale(editGallery, addPhoto))
    backButton.addEventListener("click", () => switchModale(addPhoto, editGallery))
    
    title.addEventListener("input", activeButton)
    categories.addEventListener("change", activeButton)
    
    deleteGalleryBtn.addEventListener("click", deleteGallery)
}
main()