document.addEventListener("DOMContentLoaded", () => {
    const signinForm = document.getElementById("formSignin");
    const loader = document.getElementById("globalLoaderScreen");
    const loaderMsg = document.getElementById("loaderMessageField");

    if (signinForm) {
        signinForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const emailField = document.getElementById("signinEmail");
            const passwordField = document.getElementById("signinPassword");

            if (!emailField || !passwordField) return;

            let currentRole = "student";
            const teacherTab = document.getElementById("btnTabTeacher");
            if (teacherTab && teacherTab.classList.contains("active")) {
                currentRole = "teacher";
            }

            const payload = {
                email: emailField.value.trim(),
                password: passwordField.value,
                role: currentRole
            };

            try {
                if (loader && loaderMsg) {
                    loaderMsg.innerText = "Synchronizing Matrix Clearance...";
                    loader.classList.add("active");
                }

                const response = await fetch("/signin", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Authentication refused.");

                // Save user metadata 
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("userRole", data.role);
                localStorage.setItem("userName", data.name);

                if (loaderMsg) loaderMsg.innerText = "Workspace Cleared! Generating Sandbox...";

                setTimeout(() => {
                    window.location.href = "/ide";
                }, 1200);

            } catch (err) {
                if (loader) loader.classList.remove("active");
                console.error("AJAX error:", err);
                alert(`Login Error: ${err.message}`);
            }
        });
    }
});