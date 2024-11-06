// SVG icons for toggle states
const icons = {
    up: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>menu-up</title>
            <path d="M7,15L12,10L17,15H7Z" />
        </svg>
    `,
    down: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>menu-down</title>
            <path d="M7,10L12,15L17,10H7Z" />
        </svg>
    `
};

// Function to toggle display and icon
function setupToggle(menu, header, icon) {
    header.addEventListener("click", () => {
        menu.style.display = menu.style.display === "flex" ? "none" : "flex"
        icon.innerHTML = icon.innerHTML.includes("menu-up") ? icons.down : icons.up
    });
}

// Initialize menu toggles
export function toggleMenuIcon() {
    const profileMenu = document.querySelector("div#profile div.menu")
    const profileHeader = document.getElementById("profile-header")
    const profileToggleIcon = profileHeader.querySelector(".toggle-icon")

    setupToggle(profileMenu, profileHeader, profileToggleIcon)

    // this prevents errors when rendering File due to lacking of actionMenu
    const actionMenu = document?.querySelector("div#actions div.menu")
    if (actionMenu) {
        const actionHeader = document.getElementById("actions-header")
        const actionToggleIcon = actionHeader.querySelector(".toggle-icon")

        setupToggle(actionMenu, actionHeader, actionToggleIcon)
    }
}
