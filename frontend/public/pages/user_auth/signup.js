document.addEventListener("DOMContentLoaded", () => {
    const btnTabStudent = document.getElementById('btnTabStudent');
    const btnTabTeacher = document.getElementById('btnTabTeacher');
    const personaSelectorContainer = document.getElementById('personaSelectorContainer');
    const groupStudentId = document.getElementById('groupStudentId');
    const groupTeacherId = document.getElementById('groupTeacherId');
    const signupStudentId = document.getElementById('signupStudentId');
    const signupTeacherId = document.getElementById('signupTeacherId');
    const btnSubmitSignup = document.getElementById('btnSubmitSignup');
    const authSubtitle = document.getElementById('authSubtitle');
    const signupForm = document.getElementById("formSignup");
    const toggleSignupPassword = document.getElementById("toggleSignupPassword");
    const toggleSignupConfirmPassword = document.getElementById("toggleSignupConfirmPassword");

    let activeRole = 'student';

    function selectStudentRole() {
        btnTabStudent.classList.add('active');
        btnTabTeacher.classList.remove('active');
        personaSelectorContainer.classList.remove('teacher-active');
        groupStudentId.classList.add('active');
        groupTeacherId.classList.remove('active');
        if (signupStudentId) signupStudentId.required = true;
        if (signupTeacherId) signupTeacherId.required = false;

        btnSubmitSignup.className = "btn-auth-submit btn-signup-submit";
        btnSubmitSignup.removeAttribute('style');

        activeRole = 'student';
        authSubtitle.innerText = "Create an account to track your progress and compete globally as a student.";
    }

    function selectTeacherRole() {
        btnTabStudent.classList.remove('active');
        btnTabTeacher.classList.add('active');
        personaSelectorContainer.classList.add('teacher-active');

        groupStudentId.classList.remove('active');
        groupTeacherId.classList.add('active');
        if (signupStudentId) signupStudentId.required = false;
        if (signupTeacherId) signupTeacherId.required = true;

        btnSubmitSignup.style.backgroundColor = "#ffffff";
        btnSubmitSignup.style.borderColor = "#3b82f6";
        btnSubmitSignup.style.color = "#0d0f12";

        activeRole = 'teacher';
        authSubtitle.innerText = "Create an account to track your progress and compete globally as a teacher.";
    }

    if (btnTabStudent) btnTabStudent.addEventListener('click', selectStudentRole);
    if (btnTabTeacher) btnTabTeacher.addEventListener('click', selectTeacherRole);

    // Eye Toggles
    if (toggleSignupPassword) {
        toggleSignupPassword.addEventListener("click", () => {
            const input = document.getElementById('signupPassword');
            if (input.type === 'password') {
                input.type = 'text';
                toggleSignupPassword.classList.remove('bi-eye-slash-fill');
                toggleSignupPassword.classList.add('bi-eye-fill');
            } else {
                input.type = 'password';
                toggleSignupPassword.classList.remove('bi-eye-fill');
                toggleSignupPassword.classList.add('bi-eye-slash-fill');
            }
        });
    }

    if (toggleSignupConfirmPassword) {
        toggleSignupConfirmPassword.addEventListener("click", () => {
            const input = document.getElementById('signupConfirmPassword');
            if (input.type === 'password') {
                input.type = 'text';
                toggleSignupConfirmPassword.classList.remove('bi-eye-slash-fill');
                toggleSignupConfirmPassword.classList.add('bi-eye-fill');
            } else {
                input.type = 'password';
                toggleSignupConfirmPassword.classList.remove('bi-eye-fill');
                toggleSignupConfirmPassword.classList.add('bi-eye-slash-fill');
            }
        });
    }

    // Submission Handler
    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nameVal = document.getElementById("signupName").value.trim();
            const emailVal = document.getElementById("signupEmail").value.trim();
            const passVal = document.getElementById("signupPassword").value;
            const confirmPassVal = document.getElementById("signupConfirmPassword").value;
            
            const rollNumberVal = signupStudentId ? signupStudentId.value.trim() : "";
            const deptCodeVal = signupTeacherId ? signupTeacherId.value.trim() : "";

            if (passVal !== confirmPassVal) {
                alert("Passwords do not match!");
                return;
            }

            const payload = {
                name: nameVal,
                email: emailVal,
                password: passVal,
                role: activeRole,
                roleIdentifier: activeRole === 'student' ? rollNumberVal : deptCodeVal
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

                if (!response.ok) throw new Error(data.error || "Registration encountered an issue.");

                alert("Account created successfully! Redirecting to login gate...");
                window.location.href = "/signin";

            } catch (err) {
                console.error("Signup network execution error:", err);
                alert(`Signup Failed: ${err.message}`);
                btnSubmitSignup.disabled = false;
                btnSubmitSignup.innerText = "Create Account";
            }
        });
    }
});