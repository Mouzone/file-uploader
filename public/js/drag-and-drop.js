let dragged

export function addFolderFunctionality(currFolder) {
    const folders = document.querySelectorAll(".folder")

    folders?.forEach(folder => {
        // set dragged to the item getting dragged
        folder.addEventListener("dragstart", (event) => {
            dragged = event.target
        })

        // prevent error on drag
        folder.addEventListener("dragover", (event) => {
            event.preventDefault()
        })

        // once dropped send request to server to move folder to the new id
        folder.addEventListener("drop", (event) => {
            event.preventDefault()
            const dropped = event.target.closest('a')
            fetch(`/${dragged.className}/${currFolder}/move`, {
                method: 'POST',
                body: JSON.stringify({
                    dragTarget: {
                        id: dragged.dataset.id
                    },
                    dropTarget: {
                        id: dropped.dataset.id
                    },
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    // reload page due to being cached
                    if (response.ok) {
                        window.location.reload()
                    } else {
                        console.error('Error updating folder:', response.statusText)
                    }
                })
        })
    })
}

export function addFileFunctionality() {
    const files = document.querySelectorAll(".file")

    files?.forEach(file => {
        // only need to define dragstart, since request is only sent if the user drops an item into a folder
        file.addEventListener("dragstart", (event) => {
            dragged = event.target
        })

        file.addEventListener("dragover", (event) => {
            event.preventDefault()
        })
    })
}
