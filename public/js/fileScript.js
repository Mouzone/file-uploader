import {addRenameLogic} from "./rename.js";
import {generateFileTree, getFileStructure} from "./generateFileTree.js";
import {addFileStructureDragFunctionality} from "./drag-and-drop.js";
import { toggleMenuIcon } from "./toggle-menu-icon.js";

const fileStructure = await getFileStructure()

// generate file tree on the left for navigation
generateFileTree(fileStructure)

// add logic to rename form in file path
addRenameLogic()

// add svg and menu toggles for user menu and action menu
toggleMenuIcon()