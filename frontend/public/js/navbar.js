document.addEventListener("DOMContentLoaded", () => {
    // =========================================================================
    // 1. INJECT UNIVERSAL DOMINO LOADER ELEMENT ON EVERY PAGE LOAD
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

    // Smoothly fade out the loader once the current page finishes rendering
    setTimeout(() => {
        if (pageLoader) pageLoader.classList.remove("active");
    }, 300);

    // =========================================================================
    // 2. THE TRANSITION INTERCEPTOR (Triggers loader on clicking ANY link)
    // =========================================================================
    document.addEventListener("click", (e) => {
        const anchor = e.target.closest("a");
        if (!anchor) return;

        const targetURL = anchor.getAttribute("href");
        
        // Skip default interception behavior for dead links, buttons, or blank tabs
        if (!targetURL || targetURL.startsWith("#") || targetURL.startsWith("javascript:") || anchor.getAttribute("target") === "_blank") {
            return;
        }

        // Intercept navigation to show the domino loader during server latency delays
        if (pageLoader) {
            e.preventDefault(); // Stop immediate jump
            if (loaderText) loaderText.innerText = "Compiling Next Module...";
            pageLoader.classList.add("active"); // Run Dominoes!

            // Allow short animation window then hand over destination routing to browser
            setTimeout(() => {
                window.location.href = targetURL;
            }, 450);
        }
    });

    // =========================================================================
    // 3. DYNAMIC ROLE-BASED NAVBAR GENERATION
    // =========================================================================
    const navbarTarget = document.querySelector(".custom-navbar");
    if (!navbarTarget) return;

    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole") || "student";
    const name = localStorage.getItem("userName") || "User";
    const currentPath = window.location.pathname;

    // Conditionally configure core center navigation links based on server role
    let centerLinks = `<li><a href="/" class="nav-link ${currentPath === '/' ? 'active' : ''}">Home</a></li>`;
    centerLinks += `<li><a href="/playground" class="nav-link ${currentPath === '/playground' ? 'active' : ''}">playground</a></li>`;

    if (token) {
        if (role === "teacher") {
            centerLinks += `<li><a href="/create-test" class="nav-link ${currentPath === '/create-test' ? 'active' : ''}">Create Test</a></li>`;
        } else {
            centerLinks += `<li><a href="/ide" class="nav-link ${currentPath === '/ide' ? 'active' : ''}">coding Test</a></li>`;
        }
    } else {
        centerLinks += `<li><a href="/ide" class="nav-link ${currentPath === '/ide' ? 'active' : ''}">coding Test</a></li>`;
    }

    // Configure right-side auth action templates
    let rightActionsHTML = "";
    let mobileActionsHTML = "";

    if (token) {
        const initialChar = name.trim().charAt(0).toUpperCase();
        const dropdownStructure = `
            <div class="user-profile-menu">
                <div class="profile-avatar-trigger" id="profileTrigger">
                    <div class="avatar-circle">${initialChar}</div>
                </div>
                <div class="profile-dropdown-card" id="profileDropdown">
                    <div class="dropdown-header">
                        <h6>${name}</h6>
                        <span class="user-role-badge">${role.toUpperCase()} SYSTEM</span>
                    </div>
                    <hr class="dropdown-divider">
                    <button class="dropdown-logout-btn" id="btnLogoutAction">
                        <i class="bi bi-box-arrow-left"></i> Log Out
                    </button>
                </div>
            </div>
        `;
        rightActionsHTML = dropdownStructure;
        mobileActionsHTML = dropdownStructure;
    } else {
        rightActionsHTML = `
            <a href="/signin" class="btn-signin">Sign In</a>
            <a href="/signup" class="btn-signup">Sign Up</a>
        `;
        mobileActionsHTML = rightActionsHTML;
    }

    // Overwrite navbar inner markup structures cleanly
    navbarTarget.innerHTML = `
        <div class="nav-container">
            <a class="nav-brand" href="/">
                <i class="fa-brands fa-magento nav-logo"></i>
                <span class="nav-title">ML compiler</span>
            </a>
            
            <div class="nav-menu-wrapper" id="navMenuWrapper">
                <ul class="nav-menu">${centerLinks}</ul>
                <div class="nav-actions-mobile">${mobileActionsHTML}</div>
            </div>
            
            <div class="nav-actions">${rightActionsHTML}</div>
            
            <button class="nav-toggle" id="navToggle" aria-label="Toggle Navigation">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </button>
        </div>
    `;

    // Re-attach responsive mobile navigation hamburger links drawer triggers
    const navToggle = document.getElementById("navToggle");
    const navMenuWrapper = document.getElementById("navMenuWrapper");
    if (navToggle && navMenuWrapper) {
        navToggle.addEventListener("click", () => {
            navToggle.classList.toggle("active");
            navMenuWrapper.classList.toggle("active");
        });
    }

    // Attach Avatar profile dropdown card toggles and logout tracking rules
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
                if (pageLoader && loaderText) {
                    loaderText.innerText = "Safely Disconnecting...";
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