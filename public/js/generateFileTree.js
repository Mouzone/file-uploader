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
    console.log(fileStructure)
    const container = document.getElementById("file-structure")
    const toSee = [ fileStructure.home ]
    const nextToSee = [ fileStructure.home ]
    const idToElements = {}

    while (toSee.length) {
        const currId = toSee.shift()
        const { name, folders } = fileStructure[currId]

        const currLink = document.createElement("a")
        currLink.href = `/folder/${currId}`
        currLink.textContent = name
        idToElements[currId] = currLink

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