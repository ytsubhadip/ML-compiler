document.addEventListener("DOMContentLoaded", () => {
    const signinForm = document.getElementById("formSignin");
    const submitBtn = document.getElementById("btnSubmitSignin");

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
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerText = "Signing in...";
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

                if (submitBtn) submitBtn.innerText = "Signed in";
                setTimeout(() => window.location.href = "/ide", 800);

            } catch (err) {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = "Sign In";
                }
                console.error("AJAX error:", err);
                alert(`Login Error: ${err.message}`);
            }
        });
    }
});