document.addEventListener("DOMContentLoaded", () => {
    // Loader removed: global page loader injection intentionally disabled.

    // Navigation interception removed to avoid showing a global loader on link clicks.

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
                    <button class="dropdown-profile-btn" id="btnProfileAction">
                        <i class="bi bi-person-circle"></i> View Profile
                    </button>
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
        // Toggle dropdown locally inside the parent menu on trigger click
        document.addEventListener("click", (e) => {
            const trigger = e.target.closest(".profile-avatar-trigger");
            if (trigger) {
                e.stopPropagation();
                
                // Find local dropdown card (supports multiple instances like desktop + mobile)
                const menu = trigger.closest(".user-profile-menu");
                const dropdown = menu?.querySelector(".profile-dropdown-card");
                
                if (dropdown) {
                    const isShown = dropdown.classList.contains("show");
                    
                    // Close all profile dropdowns first
                    document.querySelectorAll(".profile-dropdown-card.show").forEach((d) => {
                        d.classList.remove("show");
                    });
                    
                    // Toggle local dropdown state
                    if (!isShown) {
                        dropdown.classList.add("show");
                    }
                }
                return;
            }

            // Close all open dropdowns on clicking anywhere outside
            if (!e.target.closest(".user-profile-menu")) {
                document.querySelectorAll(".profile-dropdown-card.show").forEach((d) => {
                    d.classList.remove("show");
                });
            }
        });

        // Wire delegated handlers for Profile and Log Out actions globally (robust and simple)
        document.addEventListener("click", (e) => {
            const profileBtn = e.target.closest(".dropdown-profile-btn");
            if (profileBtn) {
                e.stopPropagation();
                document.querySelectorAll(".profile-dropdown-card.show").forEach(d => d.classList.remove("show"));
                window.location.href = "/profile";
                return;
            }

            const logoutBtn = e.target.closest(".dropdown-logout-btn");
            if (logoutBtn) {
                e.stopPropagation();
                localStorage.clear();
                window.location.href = "/signin";
                return;
            }
        });
    }
});