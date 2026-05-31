document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("formSignup");
    const submitBtn = document.getElementById("btnSubmitSignup");

    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById("signupName");
            const emailInput = document.getElementById("signupEmail");
            const passwordInput = document.getElementById("signupPassword");
            const confirmPasswordInput = document.getElementById("signupConfirmPassword");

            let currentRole = "student";
            const teacherTab = document.getElementById("btnTabTeacher");
            if (teacherTab && teacherTab.classList.contains("active")) {
                currentRole = "teacher";
            }

            const roleIdentifierField = currentRole === 'student' 
                ? document.getElementById("signupStudentId") 
                : document.getElementById("signupTeacherId");

            if (passwordInput.value !== confirmPasswordInput.value) {
                alert("Passwords do not match!");
                return;
            }

            const payload = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value,
                role: currentRole,
                roleIdentifier: roleIdentifierField ? roleIdentifierField.value.trim() : "N/A"
            };

            try {
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerText = "Creating...";
                }

                const response = await fetch("/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Registration rejected.");

                if (submitBtn) submitBtn.innerText = "Created";
                setTimeout(() => window.location.href = "/signin", 900);

            } catch (err) {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = "Create Account";
                }
                console.error("Signup error:", err);
                alert(`Registration Failed: ${err.message}`);
            }
        });
    }
});