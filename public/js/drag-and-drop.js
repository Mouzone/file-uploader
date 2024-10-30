let dragged

export function addFolderFunctionality(currFolder) {
    const folders = document.querySelectorAll(".folder")

    folders.forEach(folder => {
        folder.addEventListener("dragstart", (event) => {
            dragged = event.target
        })

        folder.addEventListener("dragover", (event) => {
            event.preventDefault()
        })

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

    files.forEach(file => {
        file.addEventListener("dragstart", (event) => {
            dragged = event.target
        })
    })
}
