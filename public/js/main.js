//trigger & event for create recipe click
$('#addRecipe').click(function () {
    //show recipe modal
    $('#recipeModal').modal('show');
});

//trigger event for closing modals
$('.close').click(function () {
    //hide recipe modal
    $('#recipeModal').modal('hide');
});

//trigger event to change action for api query
$('#lookApi').click(function () {
    document.querySelector('#searchForm').action = '/apiRecipes/lookup';
});

//trigger event to change action for db query
$('#lookDb').click(function () {
    document.querySelector('#searchForm').action = '/dbRecipes/lookup';
});