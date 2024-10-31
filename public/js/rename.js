export function addRenameLogic() {
//     probably easiest to make the last element a form with input and make it disabled
//     on button press enable it
    const renameForm = document.getElementById("rename-form")
    const nameInput = renameForm.querySelector("input")
    const renameButton = document.getElementById("rename-button")
    renameButton.addEventListener("click", (event) => {
        nameInput.disabled = false
        nameInput.focus()
    //     when click outside or do anything else, disable it back to original
    })
}