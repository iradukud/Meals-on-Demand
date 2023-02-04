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
    //
    $('#addModalCenter').modal('hide');
});

/*
temporarily disabled as better edit implementation are being worked on
//trigger & event for edit recippe click
$('#editRecipe').click(function () {
    //show recipe modal
    $('#recipeModal').modal('show');

    //changed the form's action to allow for it to send request to right route
    document.querySelector('#recipeForm').action = '/dbRecipes/edit?_method=PUT'
    //take information on screen and place it into the form
    document.querySelector('#recipeModalLabel').innerText = 'Edit Recipe'
    document.querySelector('#recipeName').value = document.querySelector('#editName').innerText
    document.querySelector('#recipeIngredients').value = Object.values(document.querySelectorAll('.editIngredient')).map(x => x.innerText).join('. ')
    document.querySelector('#recipeInstructions').value = Object.values(document.querySelectorAll('.editInstruction')).map(x => x.innerText).join('. ')
    document.querySelector('#recipeReference').value = document.querySelector('#editreference').getAttribute("href")
    document.querySelectorAll('.types').forEach(type => {
        document.getElementById(type.innerText).checked = true
    })

    //inserted hidden input for recipe's id
    const id = document.createElement("input")
    id.setAttribute('type', 'hidden')
    id.setAttribute('name', 'recipeId')
    id.setAttribute('value', document.querySelector('#recipeId').innerText)
    document.querySelector('.modal-body').appendChild(id)
})
*/


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

//trigger event for add ingredient/instruction
$('.addIngrInst').click(function () {
    $('#addModalCenter').modal('show');

    //extract information of when the item is being added
    const addTo = this.innerText.split(' ')[1];
    console.log(addTo);

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

//edit ingredients
//delete ingredients

//edit instructions
//delete instructions

//edit name
//edit reference
//edit image