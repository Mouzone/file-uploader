export function addFileFormLogic() {
    const file_form = document.getElementById("file-form")
    const file_input = file_form.querySelector("input")
    file_form.addEventListener('click', () => {
        file_input.click()
    })

    file_input.addEventListener('change', () => {
        file_form.submit()
    })

}

export function addFolderFormLogic(curr_folder) {
    const folder_form = document.getElementById("folder-form")
    folder_form.addEventListener('click', () => {
        fetch(`/folder/${curr_folder}/create-folder`, {
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