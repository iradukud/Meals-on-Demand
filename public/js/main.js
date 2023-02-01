//trigger & event for create recipe click
$('#addRecipe').click(function () {
    //show recipe modal
    $('#recipeModal').modal('show');
    //present right route
    document.querySelector('#recipeForm').action = 'dbRecipes/create'
    //present right recipe label
    document.querySelector('#recipeModalLabel').innerText = 'Create new recipe'
})

//trigger & event for closing popup
$('.close').click(function () {
    //hide recipe modal
    $('#recipeModal').modal('hide');
    //hide account modal
    $('#accountModal').modal('hide');
})

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



//trigger & event for edit account (password, email and username) click
$('.accountEdit').click(function () {
    $('#accountModal').modal('show');

    //extract account info to edit
    const property = this.parentNode.innerText.split(':')[0].toLowerCase().trim()
    const value = this.parentNode.innerText.split(':')[1].trim()
    const presProperty = property.slice(0, 1).toUpperCase() + property.slice(1).toLowerCase()

    //Set popup label 
    document.querySelector('#accountModalLabel').innerText = `Edit Account - ${presProperty}`

    //Set form's action
    document.querySelector('#accountForm').action = `/edit${presProperty}?_method=PUT`

    //store modal input in variable
    const editItem = document.getElementById('editItem')

    //Set the input type depending on what's being edited
    if (property == 'email') {
        //Keep password items hidden
        document.querySelectorAll('.password').forEach(input => input.setAttribute('type', 'hidden'))
        document.querySelectorAll('.passwordLabel').forEach(label => label.style.visibility = "hidden")
        document.querySelectorAll('.password').forEach(input => input.disabled = true)

        //set input type of main input
        editItem.setAttribute('type', 'email')
    } else if (property == 'password') {
        //Show hidden password items
        document.querySelectorAll('.password').forEach(input => input.setAttribute('type', 'password'))
        document.querySelectorAll('.passwordLabel').forEach((label, i) => label.style.visibility = "visible")
        document.querySelectorAll('.password').forEach(input => input.disabled = false)
        //set input type of main input
        editItem.setAttribute('type', 'password')
    } else {
        //Keep password items hidden
        document.querySelectorAll('.password').forEach(input => input.setAttribute('type', 'hidden'))
        document.querySelectorAll('.passwordLabel').forEach(label => label.style.visibility = "hidden")
        document.querySelectorAll('.password').forEach(input => input.disabled = true)
        //set input type of main input
        editItem.setAttribute('type', 'text')
    }

    //Set the input aria-describedby
    editItem.setAttribute('aria-describedby', `${property}Help`)

    //Set the input name
    editItem.setAttribute('name', property)


    //Set the input value
    if (property != 'password') {
        editItem.setAttribute('value', value)
    }else{
        editItem.setAttribute('value', '')
    }

    //Set label attributes and text
    document.getElementById('editItemLabel').setAttribute('for', property)
    document.getElementById('editItemLabel').innerText = presProperty
})