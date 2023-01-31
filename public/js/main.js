$('#addRecipe').click(function () {
    $('#recipeModal').modal('show');
    document.querySelector('#recipeForm').action = 'dbRecipes/create'
    document.querySelector('#recipeModalLabel').innerText = 'Create new recipe'
})

$('.close').click(function () {
    $('#recipeModal').modal('hide');
})

$('#editRecipe').click(function () {
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