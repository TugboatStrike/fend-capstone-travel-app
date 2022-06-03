function checkForName(inputText) {
    let response = '';
    console.log("::: Running checkForName :::", inputText);
    let names = [
        "Picard",
        "Janeway",
        "Kirk",
        "Archer",
        "Georgiou"
    ]

    if(names.includes(inputText)) {
        response = 'Welcome, Captain!';
        //alert("Welcome, Captain!")
        console.log('Welcome, Captain!');
    }
    return response;
}

export { checkForName }
