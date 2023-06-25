const editHeader = document.getElementById("editHeader");
const editPhoto = document.getElementById("editPhoto");
const editText = document.getElementById("editText");
const editProjects = document.getElementById("editProjects");
const projectsFilters = document.getElementById("projectsFilters");

if(!sessionStorage.userData) {
    editHeader.style.display = "none";
    editPhoto.style.display = "none";
    editText.style.display = "none";
    editProjects.style.display = "none";
} else {
    projectsFilters.style.display = "none";
};

