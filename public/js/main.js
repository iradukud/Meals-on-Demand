//trigger & event for create recipe click
$('#addRecipe').click(function () {
    //show recipe modal
    $('#recipeModal').modal('show');
});

//trigger & event for closing popup
$('.close').click(function () {
    //hide recipe modal
    $('#recipeModal').modal('hide');
    //hide account modal
    $('#accountModal').modal('hide');
    //close addModal
    $('#addModalCenter').modal('hide');
    //close editModal
    $('#editModalCenter').modal('hide');
    //close editName modal
    $('#editNamRefModalCenter').modal('hide');
});

//trigger event for edit account (password, email and username) click
$('.accountEdit').click(function () {
    $('#accountModal').modal('show');

    //extract account info to edit
    const property = this.parentNode.innerText.split(':')[0].toLowerCase().trim();
    const value = this.parentNode.innerText.split(':')[1].trim();
    const presProperty = property.slice(0, 1).toUpperCase() + property.slice(1).toLowerCase();

    //set popup label 
    document.querySelector('#accountModalLabel').innerText = `Edit Account - ${presProperty}`;

    //set form's action
    document.querySelector('#accountForm').action = `/auth/edit${presProperty}?_method=PUT`;

    //store modal input in variable
    const editItem = document.getElementById('editItem');

    //set the input type depending on what's being edited
    if (property == 'email') {
        //Keep password items hidden
        document.querySelectorAll('.password').forEach(input => input.setAttribute('type', 'hidden'));
        document.querySelectorAll('.passwordLabel').forEach(label => label.style.visibility = "hidden");
        document.querySelectorAll('.password').forEach(input => input.disabled = true);

        //set input type of main input
        editItem.setAttribute('type', 'email');

    } else if (property == 'password') {
        //Show hidden password items
        document.querySelectorAll('.password').forEach(input => input.setAttribute('type', 'password'));
        document.querySelectorAll('.passwordLabel').forEach((label, i) => label.style.visibility = "visible");
        document.querySelectorAll('.password').forEach(input => input.disabled = false);

        //set input type of main input
        editItem.setAttribute('type', 'password');
    } else {
        //keep password items hidden
        document.querySelectorAll('.password').forEach(input => input.setAttribute('type', 'hidden'));
        document.querySelectorAll('.passwordLabel').forEach(label => label.style.visibility = "hidden");
        document.querySelectorAll('.password').forEach(input => input.disabled = true);

        //set input type of main input
        editItem.setAttribute('type', 'text');
    };

    //set the input aria-describedby
    editItem.setAttribute('aria-describedby', `${property}Help`);

    //set the input name
    editItem.setAttribute('name', property);


    //set the input value
    if (property != 'password') {
        editItem.setAttribute('value', value);
    } else {
        editItem.setAttribute('value', '');
    };

    //Set label attributes and text
    document.getElementById('editItemLabel').setAttribute('for', property);
    document.getElementById('editItemLabel').innerText = presProperty;
});

//change action of lookup form when user clicks search api
$('#lookApi').click(function () {
    document.querySelector('#searchForm').action = '/apiRecipes/lookup';
});

//change action of lookup form when user clicks search DB
$('#lookDb').click(function () {
    document.querySelector('#searchForm').action = '/dbRecipes/lookup';
});

//trigger event edit recipe name or recipe reference
$('.editNamRef').click(function () {
    //show edit recipe name/reference modal
    $('#editNamRefModalCenter').modal('show');

    if (this.parentNode.innerText == 'Reference Site/Video ') {
        //setup modal to submit reference change
        document.querySelector('#editNamRefModalTitle').innerText = 'Edit Reference';
        document.querySelector('#editedItem').setAttribute('name', 'editedReference');
        document.querySelector('#editedItem').setAttribute('value', this.parentNode.childNodes[1].getAttribute('href'));
        document.querySelector('#editedItemLabel').innerText = 'Recipe Reference';
    } else {
        //setup modal to submit name change
        document.querySelector('#editNamRefModalTitle').innerText = 'Edit Name';
        document.querySelector('#editedItem').setAttribute('name', 'editedName');
        document.querySelector('#editedItem').setAttribute('value', this.parentNode.innerText);
        document.querySelector('#editedItemLabel').innerText = 'Recipe Name';
    }
});

//trigger event for add ingredient/instruction
$('.addIngrInst').click(function () {
    $('#addModalCenter').modal('show');

    //extract information of when the item is being added
    const addTo = this.innerText.split(' ')[1];

    //set popup label 
    if (addTo == 'ingredient') {
        //set to add ingredient 
        document.querySelector('#addModalTitle').innerText = 'Add Ingredient';
        //setup form for submission
        document.querySelector('#addTo').setAttribute('name', 'addIngredient');
        document.querySelector('#addTo').setAttribute('placeholder', 'Add Ingredient');
        document.querySelector('#addToLabel').innerText = 'Add Ingredient';

    } else {
        //set to add instruction 
        document.querySelector('#addModalTitle').innerText = `Add Instruction`;
        //setup form for submission
        document.querySelector('#addTo').setAttribute('name', 'addInstruction');
        document.querySelector('#addTo').setAttribute('placeholder', 'Add Instruction');
        document.querySelector('#addToLabel').innerText = 'Add Instruction';
    };
});

//trigger event for edit ingredient/instruction
$('.editIngrInst').click(function () {
    $('#editModalCenter').modal('show');

    //extract information of when the item is being added
    const edit = this.parentNode.parentNode.parentNode.parentNode.childNodes[1].innerText.toLowerCase();

    //saved the original value of edited item
    document.querySelector('#editIngrInst').setAttribute('value', this.parentNode.parentNode.childNodes[3].innerText.trim());

    //set popup label 
    if (edit == 'ingredients') {
        //set to add ingredient 
        document.querySelector('#editModalTitle').innerText = 'Edit Ingredient';
        //setup form for submission
        document.querySelector('#edit').setAttribute('name', 'editIngredient');
        document.querySelector('#edit').setAttribute('placeholder', 'Edit Ingredient');
        document.querySelector('#edit').setAttribute('value', this.parentNode.parentNode.childNodes[3].innerText.trim());
        document.querySelector('#editLabel').innerText = 'Edit Ingredient';
    } else {
        //set to add instruction 
        document.querySelector('#editModalTitle').innerText = `Edit Instruction`;
        //setup form for submission
        document.querySelector('#edit').setAttribute('name', 'editInstruction');
        document.querySelector('#edit').setAttribute('placeholder', 'Edit Instruction');
        document.querySelector('#edit').setAttribute('value', this.parentNode.parentNode.childNodes[3].innerText.trim());
        document.querySelector('#editLabel').innerText = 'Edit Instruction';
    };
});

//edit image