export function addFileFormLogic() {
    const fileForm = document.getElementById("file-form")
    const fileInput = fileForm.querySelector("input")
    fileForm.addEventListener('click', () => {
        fileInput.click()
    })

    fileInput.addEventListener('change', () => {
        fileForm.submit()
    })

}

export function addFolderFormLogic(currFolder) {
    const folderForm = document.getElementById("folder-form")
    folderForm.addEventListener('click', () => {
        fetch(`/folder/${currFolder}/create-folder`, {
            method: 'POST',
            body: JSON.stringify({
                name: "New Folder"
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
}