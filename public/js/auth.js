//trigger event for closing modals
$('.close').click(function () {
    $('#accountModal').modal('hide');
});

//trigger event for edit account (password, email and username) click
$('.accountEdit').click(function () {
    $('#accountModal').modal('show');

    //Keep password items hidden, unless otherwise state
    document.querySelector('#oldPassword').setAttribute('type', 'hidden');
    document.querySelector('#confirmPassword').setAttribute('type', 'hidden');
    document.querySelector('#oldPassword').disabled = true
    document.querySelector('#confirmPassword').disabled = true;
    document.querySelector('#oldPasswordLabel').innerText = "";
    document.querySelector('#confirmPasswordLabel').innerText = "";

    //extract account info to edit
    const [property, value] = this.parentNode.getAttribute('class').split(' ').map(x => x.trim());

    //set modal title 
    document.querySelector('#accountModalTitle').innerText = `Edit Account - ${property}`;

    //set form's action
    document.querySelector('#accountForm').action = `/auth/edit${property}?_method=PUT`;

    //store modal input in variable
    const editItem = document.getElementById('editItem');

    //set input's default value 
    editItem.setAttribute('value', value);

    //set edited input's name
    editItem.setAttribute('name', property.toLowerCase());

    //Set input's label
    document.getElementById('editItemLabel').setAttribute('for', 'editItem');
    document.getElementById('editItemLabel').innerText = property;

    if (property == 'Username') {
        /* setup modal to submit username change */

        //set input type of main input
        editItem.setAttribute('type', 'text');

    } else if (property == 'Email') {
        /* setup modal to submit email change */

        //set input type of main input
        editItem.setAttribute('type', 'email');

    } else if (property == 'Password') {
        /* setup modal to submit password change */

        //Show hidden password items
        document.querySelector('#oldPassword').setAttribute('type', 'password');
        document.querySelector('#confirmPassword').setAttribute('type', 'password');
        document.querySelector('#oldPassword').disabled = false
        document.querySelector('#confirmPassword').disabled = false;
        //set input value blank
        editItem.setAttribute('value', '')
        //set input label
        document.querySelector('#oldPasswordLabel').innerText = "Old Password";
        document.querySelector('#confirmPasswordLabel').innerText = "Confirm Password";
        //set input type of main input
        editItem.setAttribute('type', 'password');
    };
});