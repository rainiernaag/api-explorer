const searchBtn = document.getElementById('searchBtn');
const searchBox = document.getElementById('searchBox');
const result = document.getElementById('result');

const singleModeBtn = document.getElementById('singleModeBtn');
const compareModeBtn = document.getElementById('compareModeBtn');
const singleSearch = document.getElementById('singleSearch');
const compareSearch = document.getElementById('compareSearch');

const searchBox1 = document.getElementById('searchBox1');
const searchBox2 = document.getElementById('searchBox2');
const compareBtn = document.getElementById('compareBtn');
const compareResult = document.getElementById('compareResult');

const historyList = document.getElementById('historyList');

let searchHistory = [];

function addToHistory(name) {
    searchHistory = searchHistory.filter(n => n !== name);
    searchHistory.unshift(name);
    if (searchHistory.length > 5) {
        searchHistory = searchHistory.slice(0, 5);
    }
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    searchHistory.forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        li.classList.add('history-item');
        li.addEventListener('click', () => {
            searchBox.value = name;
            fetchPokemon(name).then(data => {
                if (data) renderSingleResult(data);
            });
        });
        historyList.appendChild(li);
    });
}

function fetchPokemon(name) {
    const url = 'https://pokeapi.co/api/v2/pokemon/' + name;
    return fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Not found');
            return response.json();
        })
        .catch(() => null);
}

function getTypes(data) {
    return data.types.map(t => t.type.name).join(', ');
}

function getAbilities(data) {
    return data.abilities.map(a => a.ability.name).join(', ');
}

function renderSingleResult(data) {
    result.innerHTML = `
        <h2>${data.name}</h2>
        <img src="${data.sprites.front_default}">
        <p>Height: ${data.height} | Weight: ${data.weight}</p>
        <p>Type(s): ${getTypes(data)}</p>
        <p>Abilities: ${getAbilities(data)}</p>
    `;
}

searchBtn.addEventListener('click', () => {
    const name = searchBox.value.toLowerCase().trim();
    if (!name) return;

    fetchPokemon(name).then(data => {
        if (data) {
            renderSingleResult(data);
            addToHistory(data.name);
        } else {
            result.innerHTML = '<p>Pokémon not found. Check the spelling.</p>';
        }
    });
});

function renderComparePokemon(data) {
    if (!data) {
        return '<div class="compare-card"><p>Pokémon not found.</p></div>';
    }
    return `
        <div class="compare-card">
            <h2>${data.name}</h2>
            <img src="${data.sprites.front_default}">
            <p>Height: ${data.height} | Weight: ${data.weight}</p>
            <p>Type(s): ${getTypes(data)}</p>
            <p>Abilities: ${getAbilities(data)}</p>
        </div>
    `;
}

compareBtn.addEventListener('click', () => {
    const name1 = searchBox1.value.toLowerCase().trim();
    const name2 = searchBox2.value.toLowerCase().trim();
    if (!name1 || !name2) return;

    compareResult.innerHTML = '<p>Loading...</p>';

    Promise.all([fetchPokemon(name1), fetchPokemon(name2)]).then(([data1, data2]) => {
        compareResult.innerHTML = renderComparePokemon(data1) + renderComparePokemon(data2);
        if (data1) addToHistory(data1.name);
        if (data2) addToHistory(data2.name);
    });
});

function showSingleMode() {
    singleSearch.classList.remove('hidden');
    compareSearch.classList.add('hidden');
    singleModeBtn.classList.add('active');
    compareModeBtn.classList.remove('active');
}

function showCompareMode() {
    compareSearch.classList.remove('hidden');
    singleSearch.classList.add('hidden');
    compareModeBtn.classList.add('active');
    singleModeBtn.classList.remove('active');
}

singleModeBtn.addEventListener('click', showSingleMode);
compareModeBtn.addEventListener('click', showCompareMode);