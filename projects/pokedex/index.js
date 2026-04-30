const API_URL = "https://pokeapi.co/api/v2";
const CACHE_PREFIX = "pokedex-cache:";

const searchMode = document.querySelector("#searchMode");
const searchContent = document.querySelector("#searchContent");
const resultLimit = document.querySelector("#resultLimit");
const searchButton = document.querySelector("#searchButton");
const clearButton = document.querySelector("#clearButton");
const statusText = document.querySelector("#statusText");
const results = document.querySelector("#results");
const prevPageButton = document.querySelector("#prevPageButton");
const nextPageButton = document.querySelector("#nextPageButton");
const pageInfo = document.querySelector("#pageInfo");
const pokemonDetail = document.querySelector("#pokemonDetail");
const pagination = document.querySelector(".pagination");

const state = {
  types: [],
  generations: [],
  colors: [],
  pokemonNames: [],
  currentResults: [],
  currentPage: 1,
};

const typeColors = {
  normal: "#a8a77a",
  fire: "#ee8130",
  water: "#6390f0",
  electric: "#f7d02c",
  grass: "#7ac74c",
  ice: "#96d9d6",
  fighting: "#c22e28",
  poison: "#a33ea1",
  ground: "#e2bf65",
  flying: "#a98ff3",
  psychic: "#f95587",
  bug: "#a6b91a",
  rock: "#b6a136",
  ghost: "#735797",
  dragon: "#6f35fc",
  dark: "#705746",
  steel: "#b7b7ce",
  fairy: "#d685ad",
};

document.addEventListener("DOMContentLoaded", init);
searchMode.addEventListener("change", renderSearchControl);
searchButton.addEventListener("click", searchPokemon);
clearButton.addEventListener("click", resetSearch);
resultLimit.addEventListener("change", () => {
  state.currentPage = 1;
  renderCurrentPage();
});
prevPageButton.addEventListener("click", () => changePage(-1));
nextPageButton.addEventListener("click", () => changePage(1));
results.addEventListener("click", handleResultClick);
results.addEventListener("keydown", handleResultKeydown);
pokemonDetail.addEventListener("click", handleDetailClick);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !pokemonDetail.hidden) {
    closePokemonDetail();
  }
});
searchContent.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchPokemon();
  }
});
searchContent.addEventListener("click", (event) => {
  const option = event.target.closest(".preview-option");

  if (option) {
    selectNamePreview(option.dataset.pokemonName);
  }
});

async function init() {
  setLoading(true, "Cargando filtros desde PokeAPI...");

  try {
    const [types, generations, colors, pokemonNames] = await Promise.all([
      getResourceList("type"),
      getResourceList("generation"),
      getResourceList("pokemon-color"),
      getResourceList("pokemon"),
    ]);

    state.types = types.filter((type) => !["unknown", "shadow"].includes(type.name));
    state.generations = generations;
    state.colors = colors;
    state.pokemonNames = pokemonNames;

    renderSearchControl();
    updatePagination();
    setStatus("Listo. Busca un Pokemon por nombre o usa un filtro.");
  } catch (error) {
    showError("No se pudieron cargar los filtros. Revisa tu conexion e intenta de nuevo.");
  } finally {
    setLoading(false);
  }
}

function renderSearchControl() {
  const mode = searchMode.value;

  if (mode === "name") {
    searchContent.innerHTML = `
      <label for="pokemonName">Nombre del Pokemon</label>
      <div class="autocomplete">
        <input id="pokemonName" type="search" placeholder="Ej: pikachu" autocomplete="off" />
        <div id="namePreview" class="name-preview" hidden></div>
      </div>
    `;
    const pokemonNameInput = document.querySelector("#pokemonName");
    pokemonNameInput.addEventListener("input", handleNamePreview);
    pokemonNameInput.focus();
    return;
  }

  const options = getOptionsForMode(mode);
  searchContent.innerHTML = `
    <label for="filterValue">${getLabelForMode(mode)}</label>
    <select id="filterValue">
      ${options
        .map((option) => `<option value="${option.name}">${formatName(option.name)}</option>`)
        .join("")}
    </select>
  `;
}

function handleNamePreview(event) {
  const query = normalizeQuery(event.target.value);
  const preview = document.querySelector("#namePreview");

  if (!preview) {
    return;
  }

  if (query.length < 3) {
    preview.hidden = true;
    preview.innerHTML = "";
    return;
  }

  const matches = state.pokemonNames
    .filter((pokemon) => pokemon.name.includes(query))
    .slice(0, 5);

  if (!matches.length) {
    preview.hidden = true;
    preview.innerHTML = "";
    return;
  }

  preview.innerHTML = matches
    .map(
      (pokemon) => `
        <button type="button" class="preview-option" data-pokemon-name="${pokemon.name}">
          ${formatName(pokemon.name)}
        </button>
      `
    )
    .join("");
  preview.hidden = false;
}

function selectNamePreview(pokemonName) {
  const input = document.querySelector("#pokemonName");

  if (!input) {
    return;
  }

  input.value = pokemonName;
  closeNamePreview();
  searchPokemon();
}

function closeNamePreview() {
  const preview = document.querySelector("#namePreview");

  if (!preview) {
    return;
  }

  preview.hidden = true;
  preview.innerHTML = "";
}

async function searchPokemon() {
  const mode = searchMode.value;
  const query = getCurrentQuery();
  closeNamePreview();

  if (!query) {
    showError("Escribe un nombre para buscar.");
    return;
  }

  setLoading(true, "Buscando Pokemon...");
  showResultsView();
  results.innerHTML = "";
  pokemonDetail.hidden = true;
  pokemonDetail.innerHTML = "";
  state.currentResults = [];
  state.currentPage = 1;
  updatePagination();

  try {
    state.currentResults = await getPokemonByMode(mode, query);
    state.currentPage = 1;
    await renderCurrentPage();
  } catch (error) {
    showError("No encontre resultados para esa busqueda.");
  } finally {
    setLoading(false);
  }
}

async function getPokemonByMode(mode, query) {
  if (mode === "name") {
    const pokemon = await fetchJson(`${API_URL}/pokemon/${normalizeQuery(query)}`);
    return [pokemon];
  }

  if (mode === "type") {
    const data = await fetchJson(`${API_URL}/type/${query}`);
    return data.pokemon.map((item) => item.pokemon);
  }

  if (mode === "generation") {
    const data = await fetchJson(`${API_URL}/generation/${query}`);
    return sortByPokemonId(data.pokemon_species);
  }

  if (mode === "color") {
    const data = await fetchJson(`${API_URL}/pokemon-color/${query}`);
    return sortByPokemonId(data.pokemon_species);
  }

  return [];
}

async function getPokemonCardData(item) {
  try {
    const pokemon = item.sprites ? item : await fetchJson(`${API_URL}/pokemon/${item.name}`);
    const species = await fetchJson(`${API_URL}/pokemon-species/${pokemon.id}`);
    const sprite =
      pokemon.sprites.other?.["official-artwork"]?.front_default ||
      pokemon.sprites.front_default ||
      "";

    return {
      id: pokemon.id,
      name: pokemon.name,
      sprite,
      height: pokemon.height,
      weight: pokemon.weight,
      types: pokemon.types.map((typeInfo) => typeInfo.type.name),
      generation: species.generation.name,
      color: species.color.name,
    };
  } catch (error) {
    return null;
  }
}

function renderPokemonCards(cards) {
  if (!cards.length) {
    results.innerHTML = `<p class="empty-state">No hay Pokemon para mostrar.</p>`;
    return;
  }

  results.innerHTML = cards
    .map(
      (pokemon) => `
        <article class="pokemon-card" data-pokemon-name="${pokemon.name}" role="button" tabindex="0">
          <div class="pokemon-art">
            <img src="${pokemon.sprite}" alt="${formatName(pokemon.name)}" loading="lazy" />
          </div>
          <div class="pokemon-info">
            <p class="pokemon-id">#${String(pokemon.id).padStart(4, "0")}</p>
            <h2 class="pokemon-name">${formatName(pokemon.name)}</h2>
            <div class="badges">
              ${pokemon.types.map(renderTypeBadge).join("")}
              <span class="badge">${formatName(pokemon.generation)}</span>
              <span class="badge">${formatName(pokemon.color)}</span>
            </div>
            <div class="stats">
              <span><strong>${pokemon.height / 10} m</strong>Altura</span>
              <span><strong>${pokemon.weight / 10} kg</strong>Peso</span>
              <span><strong>${pokemon.types.length}</strong>Tipos</span>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function handleResultClick(event) {
  const card = event.target.closest(".pokemon-card");

  if (card) {
    openPokemonDetail(card.dataset.pokemonName);
  }
}

function handleResultKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const card = event.target.closest(".pokemon-card");

  if (card) {
    event.preventDefault();
    openPokemonDetail(card.dataset.pokemonName);
  }
}

function handleDetailClick(event) {
  if (event.target.closest("[data-close-detail]")) {
    closePokemonDetail();
  }
}

async function openPokemonDetail(pokemonName) {
  showDetailView();
  pokemonDetail.hidden = false;
  pokemonDetail.innerHTML = `<div class="detail-loading">Cargando informacion...</div>`;
  setLoading(true, "Cargando informacion del Pokemon...");

  try {
    const detail = await getPokemonDetailData(pokemonName);
    renderPokemonDetail(detail);
    playLegacyCry(detail.cries);
    setStatus(`Viendo informacion de ${formatName(detail.name)}.`);
  } catch (error) {
    pokemonDetail.innerHTML = `
      <article class="detail-panel">
        <button class="detail-close" type="button" data-close-detail>Volver</button>
        <p class="error-state">No se pudo cargar la informacion de este Pokemon.</p>
      </article>
    `;
    setStatus("No se pudo cargar la informacion del Pokemon.");
  } finally {
    setLoading(false);
  }
}

async function getPokemonDetailData(pokemonName) {
  const pokemon = await fetchJson(`${API_URL}/pokemon/${pokemonName}`);
  const species = await fetchJson(`${API_URL}/pokemon-species/${pokemon.id}`);
  const typeDetails = await Promise.all(pokemon.types.map((typeInfo) => fetchJson(typeInfo.type.url)));
  const evolutionChain = species.evolution_chain?.url
    ? await fetchJson(species.evolution_chain.url)
    : null;
  const encounters = pokemon.location_area_encounters
    ? await fetchJson(pokemon.location_area_encounters)
    : [];
  const sprite =
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default ||
    "";
  const flavorText = getSpanishFlavorText(species.flavor_text_entries);
  const genus = getSpanishGenus(species.genera);

  return {
    id: pokemon.id,
    name: pokemon.name,
    sprite,
    height: pokemon.height,
    weight: pokemon.weight,
    order: pokemon.order,
    baseExperience: pokemon.base_experience,
    types: pokemon.types.map((typeInfo) => typeInfo.type.name),
    abilities: pokemon.abilities.map((abilityInfo) => ({
      name: abilityInfo.ability.name,
      isHidden: abilityInfo.is_hidden,
      slot: abilityInfo.slot,
    })),
    stats: pokemon.stats.map((statInfo) => ({
      name: statInfo.stat.name,
      value: statInfo.base_stat,
      effort: statInfo.effort,
    })),
    moves: pokemon.moves.map((moveInfo) => ({
      name: moveInfo.move.name,
      versions: moveInfo.version_group_details.map((versionInfo) => ({
        level: versionInfo.level_learned_at,
        method: versionInfo.move_learn_method.name,
        version: versionInfo.version_group.name,
      })),
    })),
    sprites: getSpriteList(pokemon.sprites),
    cries: pokemon.cries || {},
    forms: pokemon.forms.map((form) => form.name),
    gameIndices: pokemon.game_indices.map((game) => ({
      gameIndex: game.game_index,
      version: game.version.name,
    })),
    heldItems: pokemon.held_items.map((itemInfo) => ({
      name: itemInfo.item.name,
      versions: itemInfo.version_details.map((versionInfo) => ({
        rarity: versionInfo.rarity,
        version: versionInfo.version.name,
      })),
    })),
    generation: species.generation.name,
    color: species.color.name,
    habitat: species.habitat?.name || "desconocido",
    captureRate: species.capture_rate,
    baseHappiness: species.base_happiness,
    growthRate: species.growth_rate?.name || "desconocido",
    shape: species.shape?.name || "desconocido",
    eggGroups: species.egg_groups.map((group) => group.name),
    hatchCounter: species.hatch_counter,
    genderRate: getGenderRateText(species.gender_rate),
    varieties: species.varieties.map((variety) => ({
      name: variety.pokemon.name,
      isDefault: variety.is_default,
    })),
    isLegendary: species.is_legendary,
    isMythical: species.is_mythical,
    hasGenderDifferences: species.has_gender_differences,
    formsSwitchable: species.forms_switchable,
    genus,
    flavorText,
    damageRelations: getDamageRelations(typeDetails),
    evolution: evolutionChain ? getEvolutionNames(evolutionChain.chain) : [],
    encounters: encounters.map((encounter) => encounter.location_area.name),
  };
}

function renderPokemonDetail(detail) {
  pokemonDetail.innerHTML = `
    <article class="detail-panel">
      <button class="detail-close" type="button" data-close-detail>Volver</button>

      <div class="detail-hero">
        <div class="detail-art">
          <img src="${detail.sprite}" alt="${formatName(detail.name)}" />
        </div>
        <div class="detail-heading">
          <p class="pokemon-id">#${String(detail.id).padStart(4, "0")}</p>
          <h2>${formatName(detail.name)}</h2>
          <p class="detail-genus">${detail.genus}</p>
          <div class="badges">
            ${detail.types.map(renderTypeBadge).join("")}
            <span class="badge">${formatName(detail.generation)}</span>
            <span class="badge">${formatName(detail.color)}</span>
          </div>
          <p class="detail-description">${detail.flavorText}</p>
        </div>
      </div>

      <div class="detail-facts">
        <span><strong>${detail.height / 10} m</strong>Altura</span>
        <span><strong>${detail.weight / 10} kg</strong>Peso</span>
        <span><strong>${detail.baseExperience || "N/A"}</strong>Exp. base</span>
        <span><strong>${detail.order}</strong>Orden</span>
        <span><strong>${detail.captureRate}</strong>Captura</span>
        <span><strong>${formatName(detail.habitat)}</strong>Habitat</span>
        <span><strong>${formatName(detail.growthRate)}</strong>Crecimiento</span>
        <span><strong>${formatName(detail.shape)}</strong>Forma</span>
        <span><strong>${detail.isLegendary ? "Legendario" : detail.isMythical ? "Mitico" : "No"}</strong>Especial</span>
      </div>

      <details class="detail-section" open>
        <summary>Habilidades</summary>
        <div class="badges">
          ${detail.abilities
            .map(
              (ability) =>
                `<span class="badge">${formatName(ability.name)}${ability.isHidden ? " oculta" : ""}</span>`
            )
            .join("")}
        </div>
      </details>

      <details class="detail-section" open>
        <summary>Estadisticas</summary>
        <div class="stat-bars">
          ${detail.stats.map(renderStatBar).join("")}
        </div>
      </details>

      <details class="detail-section" open>
        <summary>Tipos y dano recibido</summary>
        ${renderDamageRelations(detail.damageRelations)}
      </details>

      <details class="detail-section" open>
        <summary>Evolucion</summary>
        ${renderSimpleList(detail.evolution, "No hay cadena evolutiva disponible.")}
      </details>

      <details class="detail-section">
        <summary>Crianza y especie</summary>
        <div class="detail-facts compact">
          <span><strong>${detail.genderRate}</strong>Genero</span>
          <span><strong>${detail.hatchCounter}</strong>Ciclos huevo</span>
          <span><strong>${detail.baseHappiness}</strong>Felicidad base</span>
          <span><strong>${detail.hasGenderDifferences ? "Si" : "No"}</strong>Diferencias genero</span>
          <span><strong>${detail.formsSwitchable ? "Si" : "No"}</strong>Formas cambiables</span>
          <span><strong>${detail.eggGroups.map(formatName).join(", ") || "N/A"}</strong>Grupos huevo</span>
        </div>
      </details>

      <details class="detail-section">
        <summary>Movimientos (${detail.moves.length})</summary>
        <div class="move-list">
          ${detail.moves.map(renderMove).join("")}
        </div>
      </details>

      <details class="detail-section">
        <summary>Sprites e imagenes</summary>
        ${renderSprites(detail.sprites)}
      </details>

      <details class="detail-section">
        <summary>Juegos donde aparece</summary>
        ${renderGameIndices(detail.gameIndices)}
      </details>

      <details class="detail-section">
        <summary>Formas y variedades</summary>
        <div class="split-lists">
          <div>
            <h3>Formas</h3>
            ${renderSimpleList(detail.forms, "No hay formas disponibles.")}
          </div>
          <div>
            <h3>Variedades</h3>
            ${renderSimpleList(
              detail.varieties.map((variety) => `${formatName(variety.name)}${variety.isDefault ? " principal" : ""}`),
              "No hay variedades disponibles."
            )}
          </div>
        </div>
      </details>

      <details class="detail-section">
        <summary>Objetos equipados</summary>
        ${renderHeldItems(detail.heldItems)}
      </details>

      <details class="detail-section">
        <summary>Encuentros</summary>
        ${renderSimpleList(detail.encounters.map(formatName), "No hay ubicaciones de encuentro registradas.")}
      </details>

      <details class="detail-section">
        <summary>Sonidos</summary>
        ${renderCries(detail.cries)}
      </details>
    </article>
  `;
}

function renderStatBar(stat) {
  const maxVisualValue = 160;
  const width = Math.min((stat.value / maxVisualValue) * 100, 100);
  const level = getStatLevel(stat.value);

  return `
    <div class="stat-bar stat-${level}">
      <span>${formatStatName(stat.name)}</span>
      <div class="stat-track">
        <div class="stat-fill" style="width: ${width}%"></div>
      </div>
      <strong>${stat.value}</strong>
      ${stat.effort ? `<small>EV ${stat.effort}</small>` : ""}
    </div>
  `;
}

function getStatLevel(value) {
  if (value >= 130) {
    return "excellent";
  }

  if (value >= 90) {
    return "good";
  }

  if (value >= 60) {
    return "average";
  }

  return "low";
}

function renderDamageRelations(relations) {
  return `
    <div class="split-lists">
      <div>
        <h3>Debilidades</h3>
        ${renderSimpleList(relations.weaknesses, "Sin debilidades registradas.")}
      </div>
      <div>
        <h3>Resistencias</h3>
        ${renderSimpleList(relations.resistances, "Sin resistencias registradas.")}
      </div>
      <div>
        <h3>Inmunidades</h3>
        ${renderSimpleList(relations.immunities, "Sin inmunidades registradas.")}
      </div>
    </div>
  `;
}

function renderMove(move) {
  const latest = move.versions.at(-1);
  const detail = latest
    ? `${formatName(latest.method)}${latest.level ? ` nivel ${latest.level}` : ""} en ${formatName(latest.version)}`
    : "Sin detalle";

  return `
    <span class="move-chip">
      <strong>${formatName(move.name)}</strong>
      <small>${detail}</small>
    </span>
  `;
}

function renderSprites(sprites) {
  if (!sprites.length) {
    return `<p class="empty-state">No hay sprites disponibles.</p>`;
  }

  return `
    <div class="sprite-grid">
      ${sprites
        .map(
          (sprite) => `
            <figure>
              <img src="${sprite.url}" alt="${formatName(sprite.label)}" loading="lazy" />
              <figcaption>${formatName(sprite.label)}</figcaption>
            </figure>
          `
        )
        .join("")}
    </div>
  `;
}

function renderGameIndices(games) {
  if (!games.length) {
    return `<p class="empty-state">No hay juegos registrados.</p>`;
  }

  return `
    <div class="data-table">
      ${games
        .map(
          (game) => `
            <span>${formatName(game.version)}</span>
            <strong>#${game.gameIndex}</strong>
          `
        )
        .join("")}
    </div>
  `;
}

function renderHeldItems(items) {
  if (!items.length) {
    return `<p class="empty-state">No hay objetos equipados registrados.</p>`;
  }

  return `
    <div class="data-table">
      ${items
        .map(
          (item) => `
            <span>${formatName(item.name)}</span>
            <strong>${item.versions.map((version) => `${formatName(version.version)} ${version.rarity}%`).join(", ")}</strong>
          `
        )
        .join("")}
    </div>
  `;
}

function renderCries(cries) {
  const entries = Object.entries(cries).filter(([, url]) => Boolean(url));

  if (!entries.length) {
    return `<p class="empty-state">No hay sonidos disponibles.</p>`;
  }

  return `
    <div class="cries-list">
      ${entries
        .map(
          ([name, url]) => `
            <label>
              ${formatName(name)}
              <audio controls src="${url}" data-cry="${name}"></audio>
            </label>
          `
        )
        .join("")}
    </div>
  `;
}

function playLegacyCry(cries) {
  const legacyCry = cries?.legacy;

  if (!legacyCry) {
    return;
  }

  const audio = new Audio(legacyCry);
  audio.volume = 0.45;
  audio.play().catch(() => {
    const legacyControl = pokemonDetail.querySelector("audio[data-cry='legacy']");

    if (legacyControl) {
      legacyControl.classList.add("needs-interaction");
    }
  });
}

function renderSimpleList(items, emptyMessage) {
  if (!items.length) {
    return `<p class="empty-state">${emptyMessage}</p>`;
  }

  return `<div class="badges">${items.map((item) => `<span class="badge">${formatName(String(item))}</span>`).join("")}</div>`;
}

function getDamageRelations(typeDetails) {
  const multipliers = {};

  typeDetails.forEach((typeDetail) => {
    typeDetail.damage_relations.double_damage_from.forEach((type) => {
      multipliers[type.name] = (multipliers[type.name] || 1) * 2;
    });
    typeDetail.damage_relations.half_damage_from.forEach((type) => {
      multipliers[type.name] = (multipliers[type.name] || 1) * 0.5;
    });
    typeDetail.damage_relations.no_damage_from.forEach((type) => {
      multipliers[type.name] = 0;
    });
  });

  return {
    weaknesses: Object.entries(multipliers)
      .filter(([, value]) => value > 1)
      .map(([name, value]) => `${formatName(name)} x${value}`),
    resistances: Object.entries(multipliers)
      .filter(([, value]) => value > 0 && value < 1)
      .map(([name, value]) => `${formatName(name)} x${value}`),
    immunities: Object.entries(multipliers)
      .filter(([, value]) => value === 0)
      .map(([name]) => name),
  };
}

function getEvolutionNames(chain) {
  const names = [];

  function walk(node) {
    names.push(node.species.name);
    node.evolves_to.forEach(walk);
  }

  walk(chain);
  return names;
}

function getSpriteList(sprites) {
  const spriteMap = {
    front_default: sprites.front_default,
    back_default: sprites.back_default,
    front_shiny: sprites.front_shiny,
    back_shiny: sprites.back_shiny,
    official_artwork: sprites.other?.["official-artwork"]?.front_default,
    official_artwork_shiny: sprites.other?.["official-artwork"]?.front_shiny,
    home: sprites.other?.home?.front_default,
    home_shiny: sprites.other?.home?.front_shiny,
    showdown: sprites.other?.showdown?.front_default,
    showdown_shiny: sprites.other?.showdown?.front_shiny,
  };

  return Object.entries(spriteMap)
    .filter(([, url]) => Boolean(url))
    .map(([label, url]) => ({ label, url }));
}

function getSpanishGenus(genera) {
  const spanishGenus = genera.find((entry) => entry.language.name === "es");
  const englishGenus = genera.find((entry) => entry.language.name === "en");
  return spanishGenus?.genus || englishGenus?.genus || "Pokemon";
}

function getGenderRateText(genderRate) {
  if (genderRate === -1) {
    return "Sin genero";
  }

  const female = (genderRate / 8) * 100;
  const male = 100 - female;
  return `${male}% M / ${female}% F`;
}

function getSpanishFlavorText(entries) {
  const spanishEntry = entries.find((entry) => entry.language.name === "es");
  const englishEntry = entries.find((entry) => entry.language.name === "en");
  const entry = spanishEntry || englishEntry;

  if (!entry) {
    return "No hay descripcion disponible para este Pokemon.";
  }

  return entry.flavor_text.replace(/\f|\n|\r/g, " ");
}

function closePokemonDetail() {
  showResultsView();
  pokemonDetail.hidden = true;
  pokemonDetail.innerHTML = "";
  updatePagination();
  setStatus("Volviste a los resultados.");
}

function showDetailView() {
  results.hidden = true;
  pagination.hidden = true;
}

function showResultsView() {
  results.hidden = false;
  pagination.hidden = false;
}

function renderTypeBadge(type) {
  const color = typeColors[type] || "#edf2f7";
  return `<span class="badge" style="background:${color}; color:${getTextColor(color)}">${formatName(type)}</span>`;
}

function getOptionsForMode(mode) {
  if (mode === "type") {
    return state.types;
  }

  if (mode === "generation") {
    return state.generations;
  }

  if (mode === "color") {
    return state.colors;
  }

  return [];
}

function getLabelForMode(mode) {
  const labels = {
    type: "Tipo",
    generation: "Generacion",
    color: "Color",
  };

  return labels[mode] || "Busqueda";
}

function getCurrentQuery() {
  if (searchMode.value === "name") {
    return document.querySelector("#pokemonName")?.value.trim();
  }

  return document.querySelector("#filterValue")?.value;
}

function getResultLimit() {
  return Number(resultLimit.value);
}

async function renderCurrentPage() {
  if (!state.currentResults.length) {
    renderPokemonCards([]);
    updatePagination();
    setStatus("No hay resultados para mostrar.");
    return;
  }

  setLoading(true, "Cargando pagina...");

  try {
    const perPage = getResultLimit();
    const totalPages = getTotalPages();
    state.currentPage = Math.min(Math.max(state.currentPage, 1), totalPages);

    const start = (state.currentPage - 1) * perPage;
    const end = start + perPage;
    const pageItems = state.currentResults.slice(start, end);
    const cards = await Promise.all(pageItems.map(getPokemonCardData));

    renderPokemonCards(cards.filter(Boolean));
    setResultStatus(cards.length, state.currentResults.length, start + 1);
    updatePagination();
  } catch (error) {
    showError("No se pudo cargar esta pagina de resultados.");
  } finally {
    setLoading(false);
  }
}

function changePage(direction) {
  const nextPage = state.currentPage + direction;

  if (nextPage < 1 || nextPage > getTotalPages()) {
    return;
  }

  state.currentPage = nextPage;
  renderCurrentPage();
}

function getTotalPages() {
  if (!state.currentResults.length) {
    return 0;
  }

  return Math.ceil(state.currentResults.length / getResultLimit());
}

async function getResourceList(endpoint) {
  const data = await fetchJson(`${API_URL}/${endpoint}?limit=1000`);
  return data.results;
}

async function fetchJson(url) {
  const cacheKey = `${CACHE_PREFIX}${url}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (error) {
      localStorage.removeItem(cacheKey);
    }
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const data = await response.json();

  try {
    localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (error) {
    clearPokedexCache();
  }

  return data;
}

function clearPokedexCache() {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(CACHE_PREFIX))
    .forEach((key) => localStorage.removeItem(key));
}

function sortByPokemonId(items) {
  return [...items].sort((first, second) => getIdFromUrl(first.url) - getIdFromUrl(second.url));
}

function getIdFromUrl(url) {
  return Number(url.split("/").filter(Boolean).pop());
}

function normalizeQuery(query) {
  return query.toLowerCase().trim().replace(/\s+/g, "-");
}

function formatName(name) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatStatName(name) {
  const names = {
    hp: "HP",
    attack: "Ataque",
    defense: "Defensa",
    "special-attack": "At. Esp.",
    "special-defense": "Def. Esp.",
    speed: "Velocidad",
  };

  return names[name] || formatName(name);
}

function getTextColor(hexColor) {
  const hex = hexColor.replace("#", "");
  const red = parseInt(hex.substring(0, 2), 16);
  const green = parseInt(hex.substring(2, 4), 16);
  const blue = parseInt(hex.substring(4, 6), 16);
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;
  return brightness > 150 ? "#1c2733" : "#ffffff";
}

function setResultStatus(visible, total, startIndex) {
  const endIndex = startIndex + visible - 1;

  if (total > visible) {
    setStatus(`Mostrando ${startIndex}-${endIndex} de ${total} resultados.`);
    return;
  }

  setStatus(`Mostrando ${visible} resultado${visible === 1 ? "" : "s"}.`);
}

function updatePagination() {
  const totalPages = getTotalPages();
  const hasResults = totalPages > 0;

  pageInfo.textContent = hasResults ? `Pagina ${state.currentPage} de ${totalPages}` : "Pagina 0 de 0";
  prevPageButton.disabled = !hasResults || state.currentPage <= 1;
  nextPageButton.disabled = !hasResults || state.currentPage >= totalPages;
}

function setStatus(message) {
  statusText.textContent = message;
}

function showError(message) {
  setStatus(message);
  results.innerHTML = `<p class="error-state">${message}</p>`;
  updatePagination();
}

function resetSearch() {
  results.innerHTML = "";
  searchMode.value = "name";
  state.currentResults = [];
  state.currentPage = 1;
  showResultsView();
  pokemonDetail.hidden = true;
  pokemonDetail.innerHTML = "";
  renderSearchControl();
  updatePagination();
  setStatus("Elige un filtro para comenzar.");
}

function setLoading(isLoading, message) {
  searchButton.disabled = isLoading;
  clearButton.disabled = isLoading;
  resultLimit.disabled = isLoading;
  prevPageButton.disabled = isLoading || state.currentPage <= 1;
  nextPageButton.disabled = isLoading || state.currentPage >= getTotalPages();

  if (message) {
    setStatus(message);
  }
}
