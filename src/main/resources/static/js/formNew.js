let formNew = document.forms["formNew"];
createNewUser();

function createNewUser() {
    formNew.addEventListener("submit", ev => {
        ev.preventDefault();
        let username = formNew.username.value;
        let lastname = formNew.lastname.value;
        let password = formNew.password.value;

        let usernameError;
        let lastnameError;
        let passwordError;

        // Clear previously set errors
        const errorElements = document.querySelectorAll(".error");
        errorElements.forEach((el) => el.remove());

        if(username.length < 4 || username.length > 20) {
            usernameError = "Your first name is too short or too long, it must contain at least 3 symbols and not exceed 20 symbols";
        }

        if(lastname.length < 4 || lastname.length > 20) {
            lastnameError = "Your last name is too short or too long, it must contain at least 3 symbols and not exceed 20 symbols";
        }

        if(password.length < 4) {
            passwordError = "Your password is too short, it must contain at least 4 symbols";
        }

        if(usernameError || lastnameError || passwordError) {
            displayError(usernameError, formNew.username);
            displayError(lastnameError, formNew.lastname);
            displayError(passwordError, formNew.password);
            return;
        }

        let rolesForNewUser = [];
        for (let i = 0; i < formNew.roles.options.length; i++) {
            if (formNew.roles.options[i].selected)
                rolesForNewUser.push({
                    id: formNew.roles.options[i].value,
                    role: "ROLE_" + formNew.roles.options[i].text
                });
        }

        fetch("http://localhost:8088/api/admin/users/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                lastname: lastname,
                age: formNew.age.value,
                email: formNew.email.value,
                password: formNew.password.value,
                roles: rolesForNewUser
            })
        }).then(() => {
            formNew.reset();
            getAllUsers();
            $('#usersTable').click();

        });
    });
}

function displayError(errorMessage, field) {
    if(errorMessage) {
        let errorElement = document.createElement("div");
        errorElement.style.color = "red";
        errorElement.style.fontWeight = "bold";
        errorElement.classList.add("error");
        errorElement.innerText = errorMessage;
        field.parentElement.appendChild(errorElement);
    }
}

function loadRolesForNewUser() {
    let selectAdd = document.getElementById("create-roles");

    selectAdd.innerHTML = "";

    fetch("http://localhost:8088/api/admin/roles")
        .then(res => res.json())
        .then(data => {
            data.forEach(role => {
                let option = document.createElement("option");
                option.value = role.id;
                option.text = role.name.toString().replace('ROLE_', '');
                selectAdd.appendChild(option);
            });
        })
        .catch(error => console.error(error));
}

window.addEventListener("load", loadRolesForNewUser);
