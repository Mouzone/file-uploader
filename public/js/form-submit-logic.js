// add logic to the file form
export function addFileFormLogic() {
    const fileForm = document.getElementById("file-form")
    const fileInput = fileForm.querySelector("input")
    // on clicking the file form the file input is clicked as well thus prompting the os's file selection form
    fileForm.addEventListener('click', () => {
        fileInput.click()
    })

    // on the presence of a file in the file input, automatically submit the file, keeping the ui clean
    fileInput.addEventListener('change', () => {
        fileForm.submit()
    })

}

// add logic to the folder form
export function addFolderFormLogic(currFolder) {
    const folderForm = document.getElementById("folder-form")
    // upon clicking create folder send the request to the backend to create the folder
    // then refresh the page since the page is cached so the redirect is ignored
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