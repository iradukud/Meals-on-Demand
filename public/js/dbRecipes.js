//trigger event for closing modals
$('.close').click(function () {
    //close add modal
    $('#addIngrInstModal').modal('hide');
    //close edit ingredient/instruction modal
    $('#editIngrInstModal').modal('hide');
    //close editName modal
    $('#editNamRefModal').modal('hide');
    //close change image modal
    $('#changeImageModal').modal('hide');
    //close edit type modal
    $('#editTypeModal').modal('hide');
});

//trigger event edit recipe name or recipe reference
$('.editNamRef').click(function () {
    //show edit recipe name/reference modal
    $('#editNamRefModal').modal('show');

    if (this.getAttribute('class').includes('reference')) {
        /* setup modal to submit reference change */

        //set the modal's title
        document.querySelector('#editNamRefModalTitle').innerText = 'Edit Reference';
        //set input's name
        document.querySelector('#editedItem').setAttribute('name', 'editedReference');
        //set input's default value
        document.querySelector('#editedItem').setAttribute('value', document.querySelector('#editReference').getAttribute('href').trim());
        //set input's label
        document.querySelector('#editedItemLabel').innerText = 'Reference';

    } else if (this.getAttribute('class').includes('name')) {
        /* setup modal to submit name change */

        //set the modal's title
        document.querySelector('#editNamRefModalTitle').innerText = 'Edit Name';
        //set input's name
        document.querySelector('#editedItem').setAttribute('name', 'editedName');
        //set input's default value
        document.querySelector('#editedItem').setAttribute('value', document.querySelector('#editRecipeName').innerText.trim());
        //set input's label
        document.querySelector('#editedItemLabel').innerText = 'Recipe Name';
    };
});

//trigger event change recipe image
$('.fa-upload').click(function () {
    $('#changeImageModal').modal('show');
});

//trigger event for edit recipe type 
$('.editType').click(function () {
    //show recipe modal
    $('#editTypeModal').modal('show');

    //set default checked values
    document.querySelectorAll('.types').forEach(type => {
        document.getElementById('edit' + type.innerText.trim()).checked = true;
    });
});

//trigger event for edit ingredient/instruction
$('.editIngrInst').click(function () {
    $('#editIngrInstModal').modal('show');

    if (this.getAttribute('class').includes('ingredients')) {
        /* setup modal to submit ingredient change */

        //saved the original value of edited item
        const editedIngredient = this.getAttribute('class').split('ingredients')[1].trim();
        //store edited value in the form
        document.querySelector('#editIngrInst').setAttribute('value', editedIngredient);
        //set the modal's title
        document.querySelector('#editIngrInstModalTitle').innerText = 'Edit Ingredient';
        //set input's name
        document.querySelector('#edit').setAttribute('name', 'editIngredient');
        //set input's default value
        document.querySelector('#edit').setAttribute('value', editedIngredient);
        //set input's label
        document.querySelector('#editLabel').innerText = 'Ingredient';

    } else if (this.getAttribute('class').includes('instructions')) {
        /* setup modal to submit instructions change */

        //saved the original value of edited item
        const editInstruction = this.getAttribute('class').split('instructions')[1].trim();
        //store edited value in the form
        document.querySelector('#editIngrInst').setAttribute('value', editInstruction);
        //set the modal's title
        document.querySelector('#editIngrInstModalTitle').innerText = `Edit Instruction`;
        //set input's name
        document.querySelector('#edit').setAttribute('name', 'editInstruction');
        //set input's default value
        document.querySelector('#edit').setAttribute('value', editInstruction);
        //set input's label
        document.querySelector('#editLabel').innerText = 'Instruction';
    };
});


//trigger event to add ingredient/instruction
$('.addIngrInst').click(function () {
    $('#addIngrInstModal').modal('show');

    //extract what's being add to
    const addTo = this.innerText.split(' ')[1].trim().toLowerCase();

    if (addTo == 'ingredient') {
        /* setup modal to submit new ingredient */

        //set the modal's title
         document.querySelector('#addIngrInstModalTitle').innerText = `Add Ingredient`;
        
        //setup form for submission
        document.querySelector('#addTo').setAttribute('name', 'addIngredient');
        //set input's label
        document.querySelector('#addToLabel').innerText = 'Add Ingredient';

    } else if (addTo == 'instruction') {
        /* setup modal to submit new instruction */

        //set the modal's title
        document.querySelector('#addIngrInstModalTitle').innerText = `Add Instruction`;
        //setup form for submission
        document.querySelector('#addTo').setAttribute('name', 'addInstruction');
        //set input's label
        document.querySelector('#addToLabel').innerText = 'Add Instruction';
    };
});