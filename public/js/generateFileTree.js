export function getFileStructure() {
    return fetch(`/folder/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
}

export function generateFileTree(fileStructure) {
    const container = document.getElementById("file-structure")
    const toSee = [ fileStructure.home ]
    const nextToSee = [ fileStructure.home ]
    const idToElements = {}

    while (toSee.length) {
        const currId = toSee.shift()
        const { name, folders } = fileStructure[currId]

        const container = document.createElement("div")
        const bar = document.createElement("div")
        const link = document.createElement("a")
        const text = document.createElement("p")
        const popup = document.createElement("p")

        container.classList.add("file-tree-link")
        bar.classList.add("bar")
        text.classList.add("text")
        link.classList.add("link")
        link.dataset.id = currId
        popup.classList.add("file-tree-popup")

        link.href = `/folder/${currId}`
        text.textContent = name
        popup.textContent = name

        link.appendChild(text)

        link.appendChild(popup)
        bar.appendChild(link)
        if (folders.length) {
            bar.insertAdjacentHTML("beforeend", `<div class="toggle-icon">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                                    <title>menu-up</title>
                                                                    <path d="M7,15L12,10L17,15H7Z" />
                                                                </svg>
                                                            </div>`)
        }

        container.appendChild(bar)
        idToElements[currId] = container

        toSee.push(...folders)
        nextToSee.unshift(...folders)
    }

    while (nextToSee.length) {
        const currId = nextToSee.shift()
        if (currId !== fileStructure.home) {
            idToElements[currId].style.display = "none";
        }
        const { folders } = fileStructure[currId]
        const currLink = idToElements[currId]
        folders.forEach(folder => {
            currLink.appendChild(idToElements[folder])
        })
        idToElements[currId] = currLink
    }

    container.appendChild(idToElements[fileStructure.home])
//     iterate from leaf nodes and add
    addFileTreeFunctionality()
}

const icons = {
    up: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>menu-up</title>
            <path d="M7,15L12,10L17,15H7Z" />
        </svg>
    `,
    down: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>menu-down</title>
            <path d="M7,10L12,15L17,10H7Z" />
        </svg>
    `
};

function addFileTreeFunctionality() {
    const containers = document.querySelectorAll("div.file-tree-link")
    containers.forEach(container => {
        const icon = container.querySelector(".toggle-icon")
        if (!icon) {
            return
        }
        icon.addEventListener("click", (event) => {
            if (icon.innerHTML.includes("menu-up")) {
                // shows direct children on click
                const childFolders = container.querySelectorAll(":scope > div.file-tree-link")
                childFolders.forEach(childFolder => {
                    childFolder.style.display = childFolder.style.display === "flex" ? "none" : "flex"
                })
            } else {
                // on all children if display="flex" close all folders regardless of children or not
                const childFolders = container.querySelectorAll("div.file-tree-link")
                childFolders.forEach(childFolder => {
                    childFolder.style.display = "none"
                    const childIcon = childFolder.querySelector(":scope > div.bar > div.toggle-icon")
                    if (childIcon) {
                        childIcon.innerHTML = icons.up
                    }
                })
            }
            icon.innerHTML = icon.innerHTML.includes("menu-up") ? icons.down : icons.up
        })
    })
}

// todo: create option to move folders and use this for the dropdown options
export function getFolders(fileStructure) {

}