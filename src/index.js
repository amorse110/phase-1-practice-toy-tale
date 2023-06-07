const toyAPI = 'http://localhost:3000/toys'
const toyCollectionElement = document.getElementById('toy-collection');
const addToyForm = document.getElementById('add-toy-form');

const headers = {
  Accepts: 'application/json',
  'Content-type': 'application/json',
}

let toyList = [];

//making the form show and hide
let showAddToyForm = true;
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    showAddToyForm = !showAddToyForm;
    toyFormContainer.style.display = showAddToyForm ? 'block' : 'none';
  });

  addToyForm.addEventListener('submit', addNewToy);

  //FETCH THE TOYS
fetch (toyAPI)
  .then(res => res.json())
  //.then(console.log);  to check db.json logs
  .then(json => {
    toyList = json;
    renderToys()
  });

  function renderToys() {
    //console.log(toys);
    toyCollectionElement.innerHTML = '';
    toyList.forEach(renderToy);
  }

  function renderToy(toy) {
    const card = document.createElement('div');
    card.classList.add('card');
    //console.log(toy);
    const likeButtonId = `like-button-${toy.id}`
    card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${likeButtonId}">Like ❤️</button>
  `;
    toyCollectionElement.append(card);

    document.getElementById(likeButtonId).addEventListener('click', event => {
      incrementLikes(toy.id);
    })
    //console.log(likeButton)

  }

  function addNewToy(event) {
    event.preventDefault();

    const form = event.target;
    const newToy = {
      name: form.name.value,
      image: form.image.value,
      likes: 0
    };

    fetch(toyAPI, {
      headers,
      method: 'POST',
      body: JSON.stringify(newToy),
    })
    .then(res => res.json())
    .then(json => {
      toyList.push(json);
      renderToys()
    });
  }

  function incrementLikes(id) {
    const toy = toyList.find(toy => toy.id ===id);
    //console.log(toy);

    fetch(`${toyAPI}/${id}`, {
      headers,
      method: 'PATCH',
      body: JSON.stringify({
        likes: toy.likes + 1
      })
    })
    .then(res => res.json())
    .then(json => {
      toy.likes = json.likes;
      renderToys();
    });
  }