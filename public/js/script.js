import { addFileFormLogic, addFolderFormLogic } from "./form-submit-logic.js";
import { toggleMenuIcon } from "./toggle-menu-icon.js";
import {addFileFunctionality, addFolderFunctionality} from "./drag-and-drop.js";

// get the current folder id that the page is on right now
const paragraphs = document.getElementById("path").querySelectorAll("p")
const currFolder = parseInt(paragraphs[paragraphs.length - 1].dataset.currFolder)

fetch(`/folders/`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
})
    .then(response => response.json())
    .then(data => console.log(data))

document.addEventListener('DOMContentLoaded', () => {
    // add form submission logic to file upload form and folder creation form
    addFileFormLogic()
    addFolderFormLogic(currFolder)

    // add svg and menu toggles for user menu and action menu
    toggleMenuIcon()

    // add logic to make drag and drove to mvoe folders and files possible
    addFolderFunctionality(currFolder)
    addFileFunctionality()
})