const renameForm = document.getElementById("rename-form")
const nameInput = renameForm.querySelector("input")
const renameButton = document.getElementById("rename-button")

function handleClickOutside(event) {
    // Check if the clicked target is not the input
    if (event.target !== nameInput) {
        nameInput.disabled = true; // Disable the input
        // Remove the event listener to prevent future triggers
        document.removeEventListener('click', handleClickOutside);
    }
}

export function addRenameLogic() {
//     probably easiest to make the last element a form with input and make it disabled
//     on button press enable it
    renameButton?.addEventListener("click", (event) => {
        nameInput.disabled = false
        nameInput.focus()

    //     when click outside or do anything else, disable it back to original
        document.addEventListener('click', handleClickOutside)
    })
}