const BASE_URL = "http://localhost:8000/api/v1/users";
function showMessage(msg, type) {
    const messageEl = document.getElementById("message");

    messageEl.textContent = msg;
    messageEl.style.color = type === "success" ? "lightgreen" : "red";
}
// REGISTER
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", document.getElementById("regUsername").value);
    formData.append("email", document.getElementById("regEmail").value);
    formData.append("password", document.getElementById("regPassword").value);
    document.getElementById("regUsername").value=""
    document.getElementById("regEmail").value=""
    document.getElementById("regPassword").value=""
    const file = document.getElementById("avatar").files?.[0];
    if (file) formData.append("avatar", file);

    try {
        const res = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            body: formData,
            credentials: "include" // 🔥 important
        });
        const data = await res.json();
        if (res.ok) {
            showMessage("Registered Successfully ✅", "success");
        } else {
            showMessage(data.message || "Registration failed ❌", "error");
        }
    } catch (err) {
        console.error(err);
        showMessage("Something went wrong ⚠️", "error");
    }
});

// LOGIN
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Login form submitted")
    const body = {
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value
    };
    document.getElementById("loginEmail").value=""
    document.getElementById("loginPassword").value=""
    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
            credentials: "include" // 🔥 VERY IMPORTANT
        });

        const data = await res.json();
        if (res.ok) {
            showMessage("login Successfully ✅", "success");
            window.location.href="dashboard.html"
        } else {
            showMessage(data.message || "Registration failed ❌", "error");
        }
    } catch (err) {
        console.error(err);
        alert("Something went wrong")
    }
});

// REFRESH TOKEN
async function refreshToken() {
    try {
        const res = await fetch(`${BASE_URL}/refresh-token`, {
            method: "POST",
            credentials: "include"
        });

        const data = await res.json();
        alert("Token Refreshed");
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}
// LOGOUT
async function logout() {
    try {
        const res = await fetch(`${BASE_URL}/logout`, {
            method: "POST",
            credentials: "include"
        });
        if(res.ok){
            window.location.href="login.html"
        }
        const text = await res.text(); // 👈 IMPORTANT
        try {
            const data = JSON.parse(text);
            console.log(data);
            
        } catch {
            console.error("Non-JSON response:", text);
        }
    } catch (err) {
        console.error(err);
    }
}

//change password
document.getElementById("changePasswordForm")?.addEventListener("submit",async(e)=>{
    console.log("FORM SUBMITTED 🔥");   
    e.preventDefault();
    const body={
        oldPassword:document.getElementById("oldPassword").value,
        newPassword:document.getElementById("newPassword").value,
        confirmPassword:document.getElementById("confirmPassword").value
    }
    
    try {
        const res = await fetch(`${BASE_URL}/changePassword`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
            credentials: "include"
        });
        const data = await res.json();
        if(res.ok){
            showMessage("Password is changed successfully","success")
            document.getElementById("oldPassword").value="",
            document.getElementById("newPassword").value="",
            document.getElementById("confirmPassword").value=""
            console.log(data)
        }
        else{
            showMessage(data.message || "Password is not changed","error")
        }
    } catch (error) {
        console.error(error)
    }
})
