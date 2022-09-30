/*Vars*/
var linxapi = "http://localhost:8062";
var searchString = new URLSearchParams(location.search);
sessionStorage.removeItem("token");

/*Init*/
const msg = searchString.getAll("msg").toString();
if (msg != "") {
    removeFromQuerystring("msg");
    showMessage(msg);
}

const registerButton = document.getElementById("registerButton");
registerButton.addEventListener("click", function () {
    registerUser();
});

const loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", function () {
    loginUser();
});

const updateUserButton = document.getElementById("updateUserButton");
updateUserButton.addEventListener("click", function () {
    updateUser();
});

const logoutLink = document.getElementById("logoutLink");
logoutLink.addEventListener("click", function () {
    logoutUser();
});

pageInit();

/*Page*/
function pageInit() {
    document.getElementById("userUpdateContainer").classList.remove("showBlock");
    var arrEl = document.getElementsByClassName("contentContainer");
    for (i = 0; i < arrEl.length; i++) {
        arrEl[i].classList.remove("showBlock");
    }
    showLoginForm();
    showRegisterForm();
}
function showLoginForm() {
    const loginContainer = document.getElementById("loginContainer");
    loginContainer.classList.add("showBlock");
}
function showRegisterForm() {
    const loginContainer = document.getElementById("registerContainer");
    loginContainer.classList.add("showBlock");
}
function showUpdateForm(userData) {
    document.getElementById("userFirstName").value = userData.FirstName;
    document.getElementById("userLastName").value = userData.LastName;
    document.getElementById("userEmail").value = userData.Email;
    document.getElementById("userUpdateContainer").classList.add("showBlock");
}
/*API CRUD*/
function registerUser() {
    let registerFirstName = document.getElementById("registerFirstName").value;
    let registerLastName = document.getElementById("registerLastName").value;
    let registerEmail = document.getElementById("registerEmail").value;
    let registerPassword = document.getElementById("registerPassword").value;
    if (registerFirstName == "" || registerLastName == "" || registerEmail == "" || registerPassword == "") {
        showErrorMsg("registerContainer", "All fields are required");
    } else {
        removeErrorMsg();
        const postJson = { FirstName: registerFirstName, LastName: registerLastName, Email: registerEmail, Password: registerPassword };
        postData("/register", postJson)
            .then(json)
            .then((data) => {
                showMessage(data.Message);
            })
            .catch((error) => {
                showAPIError(error);
            });
    }
}
function loginUser() {
    const loginEmail = document.getElementById("loginEmail").value;
    const loginPassword = document.getElementById("loginPassword").value;
    if (loginEmail == "") {
        showErrorMsg("loginContainer", "Email required");
    } else if (loginPassword == "") {
        showErrorMsg("loginContainer", "Password required");
    } else {
        removeErrorMsg();
        const postJson = { Email: loginEmail, Password: loginPassword };
        postData("/login", postJson)
            .then(json)
            .then((data) => {
                if (data.Success) {
                    getUser();
                    showMessage("You are logged in");
                    document.querySelector(".wrapper").style.display = "none";
                } else {
                    showMessage(data.Message);
                }
            })
            .catch((error) => {
                showAPIError(error);
            });
    }
}
function getUser() {
    getData("/getuser")
        .then(json)
        .then((data) => {
            if (data.Success) {
                showUpdateForm(data.User);
            } else {
                showMessage(data.Message);
            }
        })
        .catch((error) => {
            showAPIError(error);
        });
}
function logoutUser() {
    getData("/logout")
        .then(json)
        .then((data) => {
            if (data.Success) {
                window.location.href = "?msg=You are logged out";
            }
        })
        .catch((error) => {
            showAPIError(error);
        });
}
function updateUser() {
    let userFirstName = document.getElementById("userFirstName").value;
    let userLastName = document.getElementById("userLastName").value;
    let userEmail = document.getElementById("userEmail").value;
    let userPassword = document.getElementById("userPassword").value;
    if (userFirstName == "" || userLastName == "") {
        showErrorMsg("userUpdateContainer", "FirstName and LastName are required");
    } else {
        removeErrorMsg();
        const postJson = { FirstName: userFirstName, LastName: userLastName, Password: userPassword };
        postData("/updateuser", postJson)
            .then(json)
            .then((data) => {
                showMessage(data.Message);
                userFirstName.value = data.User.FirstName;
                userLastName.value = data.User.LastName;
                userEmail.value = data.User.Email;
                userPassword.value = "";
            })
            .catch((error) => {
                showAPIError(error);
            });
    }
}
/*API Common*/
async function postData(url = "", data = {}) {
    const response = await fetch(linxapi + url, {
        method: "POST",
        cache: "no-cache",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: "abc",
        },
        body: JSON.stringify(data),
    });
    return response;
}
async function getData(url = "") {
    const response = await fetch(linxapi + url, {
        method: "GET",
        cache: "no-cache",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: "abc",
        },
    });
    return response;
}
function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    } else if (response.status === 401) {
        window.location.href = "index.html?msg=Please login";
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}
function json(response) {
    return response.json();
}
/*Utils*/
function showMessage(message) {
    let msgContainer = document.getElementById("msgContainer");
    if (msgContainer) {
        msgContainer.remove();
    }
    msgContainer = document.createElement("div");
    msgContainer.setAttribute("id", "msgContainer");
    const msg = document.createElement("span");
    msg.innerHTML = message;
    msgContainer.appendChild(msg);
    document.getElementsByTagName("body")[0].appendChild(msgContainer);
    setTimeout(function () {
        msgContainer.classList.add("visible");
    }, 500);
}
function showErrorMsg(parent, msg) {
    removeErrorMsg();
    const parentContainer = document.getElementById(parent);
    const errorMsgContainer = document.createElement("span");
    errorMsgContainer.classList.add("errorMsg");
    const textNode = document.createTextNode(msg);
    errorMsgContainer.appendChild(textNode);
    parentContainer.appendChild(errorMsgContainer);
}
function removeErrorMsg() {
    var arrEl = document.getElementsByClassName("errorMsg");
    for (i = 0; i < arrEl.length; i++) {
        arrEl[i].remove();
    }
}
function showAPIError(msg) {
    if (msg == "TypeError: Failed to fetch") {
        showMessage("The API gateway could not be reached");
    } else {
        showMessage(msg);
    }
}
function showPassword(id) {
    const el = document.getElementById(id);
    if (el.type === "password") {
        el.type = "text";
    } else {
        el.type = "password";
    }
}
function addToQuerystring(key, val) {
    const url = new URL(window.location);
    url.searchParams.set(key, val);
    window.history.pushState({}, "", url);
}
function removeFromQuerystring(key) {
    const url = new URL(window.location);
    url.searchParams.delete(key);
    window.history.pushState({}, "", url);
}
