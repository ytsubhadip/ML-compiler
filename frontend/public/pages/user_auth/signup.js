document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("formSignup");
    const btnSubmitSignup = document.getElementById("btnSubmitSignup");

    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById("signupName");
            const emailInput = document.getElementById("signupEmail");
            const passwordInput = document.getElementById("signupPassword");
            const confirmPasswordInput = document.getElementById("signupConfirmPassword");

            const currentRole = typeof activeRole !== "undefined" ? activeRole : "student";
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
                btnSubmitSignup.disabled = true;
                btnSubmitSignup.innerText = "Creating Account...";

                const response = await fetch("/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (!response.ok) throw new Error(data.error || "Registration rejected.");

                alert("Account created successfully!");
                window.location.href = "/signin";

            } catch (err) {
                console.error("Signup error:", err);
                alert(`Registration Failed: ${err.message}`);
                btnSubmitSignup.disabled = false;
                btnSubmitSignup.innerText = "Create Account";
            }
        });
    }
});