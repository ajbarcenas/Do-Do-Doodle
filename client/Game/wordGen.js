const words = [
    "America",
    "Balloon",
    "Biscuit",
    "Blanket",
    "Chicken",
    "Chimney",
    "Country",
    "Cupcake",
    "Curtain",
    "Diamond",
    "Eyebrow",
    "Fireman",
    "Florida",
    "Germany",
    "Harpoon",
    "Husband",
    "Morning",
    "Octopus",
    "Popcorn",
    "Printer",
    "Sandbox",
    "Skyline",
    "Spinach"];

    const getWord = () => `${words[Math.floor(Math.random() * words.length)]}`;

    console.log(getWord());
const setWord = () =>{
    document.getElementById('generate').innerText = getWord();
}

document.getElementById('roll')
    .addEventListener('click', setWord);

setWord();