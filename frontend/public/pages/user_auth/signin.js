document.addEventListener("DOMContentLoaded", () => {
    const btnTabStudent = document.getElementById('btnTabStudent');
    const btnTabTeacher = document.getElementById('btnTabTeacher');
    const personaSelectorContainer = document.getElementById('personaSelectorContainer');
    const btnSubmitSignin = document.getElementById('btnSubmitSignin');
    const authSubtitle = document.getElementById('authSubtitle');
    const signinForm = document.getElementById("formSignin");
    const toggleSigninPassword = document.getElementById("toggleSigninPassword");

    let activeRole = 'student';

    
    function selectStudentRole() {
        btnTabStudent.classList.add('active');
        btnTabTeacher.classList.remove('active');
        personaSelectorContainer.classList.remove('teacher-active');
        btnSubmitSignin.className = "btn-auth-submit btn-signin-submit";
        btnSubmitSignin.removeAttribute('style');
        activeRole = 'student';
        authSubtitle.innerText = "Log in to ML Compiler to compile and run your solutions as a student.";
    }

    function selectTeacherRole() {
        btnTabStudent.classList.remove('active');
        btnTabTeacher.classList.add('active');
        personaSelectorContainer.classList.add('teacher-active');
        btnSubmitSignin.style.backgroundColor = "#3b82f6";
        btnSubmitSignin.style.borderColor = "#3b82f6";
        btnSubmitSignin.style.color = "#ffffff";
        btnSubmitSignin.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.15)";
        activeRole = 'teacher';
        authSubtitle.innerText = "Log in to ML Compiler to compile and run your solutions as a teacher.";
    }

    if (btnTabStudent) btnTabStudent.addEventListener('click', selectStudentRole);
    if (btnTabTeacher) btnTabTeacher.addEventListener('click', selectTeacherRole);

    // Pas
    if (toggleSigninPassword) {
        toggleSigninPassword.addEventListener("click", () => {
            const passwordInput = document.getElementById('signinPassword');
            if (passwordInput) {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    toggleSigninPassword.classList.remove('bi-eye-slash-fill');
                    toggleSigninPassword.classList.add('bi-eye-fill');
                } else {
                    passwordInput.type = 'password';
                    toggleSigninPassword.classList.remove('bi-eye-fill');
                    toggleSigninPassword.classList.add('bi-eye-slash-fill');
                }
            }
        });
    }

    
    if (signinForm) {
        signinForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const emailInput = document.getElementById("signinEmail");
            const passwordInput = document.getElementById("signinPassword");

            if (!emailInput || !passwordInput) return;

            const authPayload = {
                email: emailInput.value.trim(),
                password: passwordInput.value,
                role: activeRole
            };

            try {
                btnSubmitSignin.disabled = true;
                btnSubmitSignin.innerHTML = `Validating...`;

                const response = await fetch("/signin", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(authPayload)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Authentication failed.");
                }

                alert("Authentication successful! Welcome to your workspace.");
                window.location.href = "/ide";

            } catch (err) {
                console.error("Authentication exception:", err);
                alert(`Login Failed: ${err.message}`);
                
                btnSubmitSignin.disabled = false;
                if (activeRole === 'student') {
                    btnSubmitSignin.innerHTML = `<i class="bi bi-box-arrow-in-right me-1"></i> Sign In`;
                } else {
                    btnSubmitSignin.innerHTML = `Sign In`;
                }
            }
        });
    }
});