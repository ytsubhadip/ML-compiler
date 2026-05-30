document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.querySelector("nav") || document.getElementById("main-navbar");
    if (!navbarContainer) return;

    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole") || "student";
    const name = localStorage.getItem("userName") || "User";

    let navLinks = `
        <a href="/" class="nav-link">Home</a>
        <a href="/playground" class="nav-link">Playground</a>
    `;

    if (token) {
        if (role === "teacher") {
            navLinks += `<a href="/create-test" class="nav-link">Create Test</a>`;
        } else {
            navLinks += `<a href="/coding-test" class="nav-link">Coding Test</a>`;
        }
    } else {
        navLinks += `<a href="/coding-test" class="nav-link">Coding Test</a>`;
    }

    let authSection = "";
    if (token) {
        authSection = `
            <div class="user-profile-menu">
                <div class="profile-avatar-trigger" id="profileTrigger">
                    <div class="avatar-circle">${name.charAt(0).toUpperCase()}</div>
                </div>
                <div class="profile-dropdown-card" id="profileDropdown">
                    <div class="dropdown-header">
                        <h6>${name}</h6>
                        <span>${role.charAt(0).toUpperCase() + role.slice(1)} Matrix</span>
                    </div>
                    <hr class="dropdown-divider">
                    <button class="dropdown-logout-btn" id="btnLogoutAction">
                        <i class="bi bi-box-arrow-left"></i> Log Out
                    </button>
                </div>
            </div>
        `;
    } else {
        authSection = `
            <a href="/signin" class="btn-auth-nav signin-nav-btn">Sign In</a>
            <a href="/signup" class="btn-auth-nav signup-nav-btn">Sign Up</a>
        `;
    }

    navbarContainer.innerHTML = `
        <div class="nav-wrapper-shell">
            <div class="nav-left-brand">
                <i class="fa-brands fa-magento brand-logo-icon"></i>
                <span class="brand-text-logo">ML compiler</span>
            </div>
            <div class="nav-center-links">${navLinks}</div>
            <div class="nav-right-actions">${authSection}</div>
        </div>
    `;

    if (token) {
        const trigger = document.getElementById("profileTrigger");
        const dropdown = document.getElementById("profileDropdown");
        
        if (trigger && dropdown) {
            trigger.addEventListener("click", (e) => {
                e.stopPropagation();
                dropdown.classList.toggle("show");
            });
            document.addEventListener("click", () => dropdown.classList.remove("show"));
        }

        const logoutBtn = document.getElementById("btnLogoutAction");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                localStorage.clear();
                window.location.href = "/signin";
            });
        }
    }
});