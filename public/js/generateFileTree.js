export function getFileStructure() {
    return fetch(`/folder/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
}

// todo: redesign layout, and put a element to generate the divs
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

        container.classList.add("file-tree-link")
        bar.classList.add("bar")
        link.classList.add("link")

        link.href = `/folder/${currId}`
        text.textContent = name

        link.appendChild(text)

        bar.appendChild(link)
        bar.insertAdjacentHTML("beforeend", `<div class="toggle-icon">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                                    <title>menu-up</title>
                                                                    <path d="M7,15L12,10L17,15H7Z" />
                                                                </svg>
                                                            </div>`)

        container.appendChild(bar)
        idToElements[currId] = container

        toSee.push(...folders)
        nextToSee.unshift(...folders)
    }

    while (nextToSee.length) {
        const currId = nextToSee.shift()
        const { folders } = fileStructure[currId]
        const currLink = idToElements[currId]
        folders.forEach(folder => {
            currLink.appendChild(idToElements[folder])
        })
        idToElements[currId] = currLink
    }

    container.appendChild(idToElements[fileStructure.home])
//     iterate from leaf nodes and add
}

// todo: create option to move folders and use this for the dropdown options
export function getFolders(fileStructure) {

}