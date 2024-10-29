import { addFileFormLogic, addFolderFormLogic } from "./form-submit-logic.js";
import { toggleMenuIcon } from "./toggle-menu-icon.js";
import {addFileFunctionality, addFolderFunctionality} from "./drag-and-drop.js";

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
    addFileFormLogic()
    addFolderFormLogic(currFolder)
    toggleMenuIcon()
    addFolderFunctionality(currFolder)
    addFileFunctionality()
})