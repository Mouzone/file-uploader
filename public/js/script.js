const folders = document.querySelectorAll(".folder")
const files = document.querySelectorAll(".file")
const curr_folder = "<%= folder_id %>"
let dragged

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
                dragged: {
                    type: dragged.className,
                    id: dragged.dataset.id
                },
                dropped: {
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

files.forEach(file => {
    file.addEventListener("dragstart", (event) => {
        dragged = event.target
    })
})

fetch(`/folders/`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
})
    .then(response => response.json())
    .then(data => console.log(data))

const menuUp = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>menu-up</title>
                <path d="M7,15L12,10L17,15H7Z" />
            </svg>
        `

const menuDown = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>menu-down</title>
                <path d="M7,10L12,15L17,10H7Z" />
            </svg>
        `

const profile_menu = document.querySelector("div#profile > div.menu")
const profile_header = document.getElementById("profile-header")
const profile_toggle_icon = profile_header.querySelector(".toggle-icon")
profile_header.addEventListener("click", (event) => {
    profile_menu.style.display = profile_menu.style.display === "flex" ? "none" : "flex"
    profile_toggle_icon.innerHTML = profile_toggle_icon.innerHTML.includes("menu-up") ? menuDown : menuUp
})

const action_menu = document.querySelector("div#actions > div.menu")
const action_header = document.getElementById("actions-header")
const action_toggle_icon = action_header.querySelector(".toggle-icon")
action_header.addEventListener("click", (event) => {
    action_menu.style.display = action_menu.style.display === "flex" ? "none" : "flex"
    action_toggle_icon.innerHTML = action_toggle_icon.innerHTML.includes("menu-up") ? menuDown : menuUp
})

const file_form = document.getElementById("file-form")
const file_input = file_form.querySelector("input")
file_form.addEventListener('click', () => {
    file_input.click()
})

file_input.addEventListener('change', () => {
    file_form.submit()
})

const folder_form = document.getElementById("folder-form")
folder_form.addEventListener('click', () => {
    fetch("/folder/<%= folder_id %>/create-folder", {
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