/**
 * =========================================================================
 * CORE MODULE: UNIVERSAL DYNAMIC NAVBAR & DOMINO LOADER SYSTEM
 * =========================================================================
 * IMPLEMENTATION:
 * Just add <script src="/js/navbar.js"></script> at the bottom of ANY page.
 * No HTML placeholders or wrappers are needed!
 */

document.addEventListener("DOMContentLoaded", () => {
    // =========================================================================
    // 1. INJECT LOADER OVERLAY DIRECTLY INTO DOM
    // =========================================================================
    const globalLoaderHTML = `
        <div class="matrix-loader-overlay" id="globalPageLoader">
            <div class="spinner">
                <span></span><span></span><span></span><span></span>
                <span></span><span></span><span></span><span></span>
            </div>
            <div class="loader-status-msg" id="globalLoaderText">Syncing Environment...</div>
        </div>
    `;
    document.body.insertAdjacentHTML("afterbegin", globalLoaderHTML);
    const pageLoader = document.getElementById("globalPageLoader");
    const loaderText = document.getElementById("globalLoaderText");

    // Smoothly hide loading screen once current assets render
    setTimeout(() => {
        if (pageLoader) pageLoader.classList.remove("active");
    }, 300);

    // =========================================================================
    // 2. GLOBAL LINK CLICK INTERCEPTOR (Fires dominoes on redirection lag)
    // =========================================================================
    document.addEventListener("click", (e) => {
        const anchor = e.target.closest("a");
        if (!anchor) return;

        const targetURL = anchor.getAttribute("href");
        if (!targetURL || targetURL.startsWith("#") || targetURL.startsWith("javascript:") || anchor.getAttribute("target") === "_blank") {
            return;
        }

        if (pageLoader) {
            e.preventDefault(); // Hold redirection process
            if (loaderText) loaderText.innerText = "Compiling Next Module...";
            pageLoader.classList.add("active"); // Trigger Domino Trail
            
            setTimeout(() => {
                window.location.href = targetURL;
            }, 400);
        }
    });

    // =========================================================================
    // 3. AUTO-GENERATE OR TARGET NAVBAR SHELL Container
    // =========================================================================
    let navbarTarget = document.querySelector(".custom-navbar");
    if (!navbarTarget) {
        navbarTarget = document.createElement("nav");
        navbarTarget.className = "custom-navbar";
        document.body.insertAdjacentElement("afterbegin", navbarTarget);
    }

    // Parse session storage parameters
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole") || "student";
    const name = localStorage.getItem("userName") || "User";
    const currentPath = window.location.pathname;

    // Build dynamic center links by role authorization permissions
    let centerLinksHTML = `<li><a href="/" class="nav-link ${currentPath === '/' ? 'active' : ''}">Home</a></li>`;
    centerLinksHTML += `<li><a href="/playground" class="nav-link ${currentPath === '/playground' ? 'active' : ''}">playground</a></li>`;

    if (token) {
        if (role.trim().toLowerCase() === "teacher") {
            // 🟢 Teachers see ONLY Create Test
            centerLinksHTML += `<li><a href="/create-test" class="nav-link ${currentPath === '/create-test' ? 'active' : ''}">Create Test</a></li>`;
        } else {
            // 🟢 Students see ONLY coding Test
            centerLinksHTML += `<li><a href="/ide" class="nav-link ${currentPath === '/ide' ? 'active' : ''}">coding Test</a></li>`;
        }
    } else {
        centerLinksHTML += `<li><a href="/ide" class="nav-link ${currentPath === '/ide' ? 'active' : ''}">coding Test</a></li>`;
    }

    // Process right-side auth section (Sign In/Up vs Custom Avatar Dropdown)
    let rightActionsHTML = "";
    if (token) {
        const userInitial = name.trim().charAt(0).toUpperCase();
        rightActionsHTML = `
            <div class="user-profile-menu">
                <div class="profile-avatar-trigger" id="profileTrigger">
                    <div class="avatar-circle">${userInitial}</div>
                </div>
                <div class="profile-dropdown-card" id="profileDropdown">
                    <div class="dropdown-header">
                        <h6>${name}</h6>
                        <span class="user-role-badge">${role.toUpperCase()} LEVEL</span>
                    </div>
                    <hr class="dropdown-divider">
                    <button class="dropdown-logout-btn" id="btnLogoutAction">
                        <i class="bi bi-box-arrow-left"></i> Log Out
                    </button>
                </div>
            </div>
        `;
    } else {
        rightActionsHTML = `
            <a href="/signin" class="btn-signin">Sign In</a>
            <a href="/signup" class="btn-signup">Sign Up</a>
        `;
    }

    // Overwrite the entire inner template structure cleanly
    navbarTarget.innerHTML = `
        <div class="nav-container">
            <a class="nav-brand" href="/">
                <i class="fa-brands fa-magento nav-logo"></i>
                <span class="nav-title">ML compiler</span>
            </a>
            
            <div class="nav-menu-wrapper" id="navMenuWrapper">
                <ul class="nav-menu">${centerLinksHTML}</ul>
                <div class="nav-actions-mobile">${rightActionsHTML}</div>
            </div>
            
            <div class="nav-actions">${rightActionsHTML}</div>
            
            <button class="nav-toggle" id="navToggle" aria-label="Toggle Navigation">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </button>
        </div>
    `;

    // =========================================================================
    // 4. ATTACH RESPONSIVE UI INTERACTIVE LISTENERS
    // =========================================================================
    const navToggle = document.getElementById('navToggle');
    const navMenuWrapper = document.getElementById('navMenuWrapper');
    if (navToggle && navMenuWrapper) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenuWrapper.classList.toggle('active');
        });
    }

    if (token) {
        const trigger = document.getElementById("profileTrigger");
        const dropdown = document.getElementById("profileDropdown");
        if (trigger && dropdown) {
            trigger.addEventListener("click", function(e) {
                e.stopPropagation();
                dropdown.classList.toggle("show");
            });
            document.addEventListener("click", () => dropdown.classList.remove("show"));
        }

        const logoutBtn = document.getElementById("btnLogoutAction");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function() {
                if (pageLoader && loaderText) {
                    loaderText.innerText = "De-allocating Session Context...";
                    pageLoader.classList.add("active");
                }
                setTimeout(() => {
                    localStorage.clear();
                    window.location.href = "/signin";
                }, 600);
            });
        }
    }
});