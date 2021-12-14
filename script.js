const searchInput = document.querySelector('.search-input');
const searchOutput = document.querySelector('.search-output');
const infoReposOutput = document.querySelector('.infoRepos-output');
let arrReposInfo = {};

async function searchRepositories() {
  if (!searchInput.value) {
    searchOutput.textContent = '';
  }
  arrReposInfo = {};
  let response = await fetch(
    `https://api.github.com/search/repositories?q=${searchInput.value}`
  );
  if (response.ok) {
    response = await response.json();
    searchOutput.textContent = '';
    for (let i = 0; i < 5; i++) {
      await createLinksToRepos(response.items[i]);
    }
  }

  const allRepoLinks = document.querySelectorAll('.search-output__link');
  for (link of allRepoLinks) {
    link.addEventListener('click', function () {
      createCardInfoRepo(link);
      searchOutput.textContent = '';
      searchInput.value = '';
      infoReposOutput.classList.remove('hidden');
      closeCard();
    });
  }
}
function closeCard() {
  const allCloseButton = document.querySelectorAll('.card__button-close');
  console.log(allCloseButton);
  for (button of allCloseButton) {
    button.addEventListener('click', function () {
      this.parentElement.remove();
    });
  }
}

function createLinksToRepos(repo) {
  const repoLink = document.createElement('a');
  repoLink.classList.add('search-output__link');
  repoLink.textContent = `${repo.name}`;
  arrReposInfo[repo.name] = {
    Name: repo.name,
    Owner: repo.owner.login,
    Stars: repo.stargazers_count,
  };
  searchOutput.append(repoLink);
}

function createCardInfoRepo(link) {
  const nameRepo = link.textContent;
  infoReposOutput.insertAdjacentHTML(
    'afterbegin',
    `<div class="infoRepos-output__card">
        <div class="card__text text">
          <p class="text__elem">Name: ${arrReposInfo[nameRepo].Name}</p>
          <p class="text__elem">Owner: ${arrReposInfo[nameRepo].Owner}</p>
          <p class="text__elem">Stars: ${arrReposInfo[nameRepo].Stars}</p>
        </div>
        <button class="card__button-close button-close" type="button">
          <img class="button-close__img" src="close.png" >
        </button>
    </div>
    `
  );
}

function debounce(fn, debounceTime) {
  let timer;
  return function () {
    const fnCall = () => {
      fn.apply(this, arguments);
    };
    clearTimeout(timer);
    timer = setTimeout(fnCall, debounceTime);
  };
}

searchInput.addEventListener('keydown', debounce(searchRepositories, 300));
