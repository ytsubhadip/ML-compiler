document.addEventListener("DOMContentLoaded", () => {
    const signinForm = document.getElementById("formSignin");
    const btnSubmitSignin = document.getElementById("btnSubmitSignin");

    if (signinForm) {
        signinForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const emailField = document.getElementById("signinEmail");
            const passwordField = document.getElementById("signinPassword");

            if (!emailField || !passwordField) return;

            const payload = {
                email: emailField.value.trim(),
                password: passwordField.value,
                role: typeof activeRole !== "undefined" ? activeRole : "student"
            };

            try {
                btnSubmitSignin.disabled = true;
                btnSubmitSignin.innerText = "Processing Auth...";

                const response = await fetch("/signin", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (!response.ok) throw new Error(data.error || "Authentication refused.");

                alert("Authentication validated successfully!");
                window.location.href = "/ide";

            } catch (err) {
                console.error("AJAX error:", err);
                alert(`Login Error: ${err.message}`);
                btnSubmitSignin.disabled = false;
                btnSubmitSignin.innerHTML = `<i class="bi bi-box-arrow-in-right me-1"></i> Sign In`;
            }
        });
    }
});