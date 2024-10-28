let dragged

export function addFolderFunctionality(curr_folder) {
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
            fetch(`/folder/${curr_folder}/move`, {
                method: 'POST',
                body: JSON.stringify({
                    drag_target: {
                        type: dragged.className,
                        id: dragged.dataset.id
                    },
                    drop_target: {
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
