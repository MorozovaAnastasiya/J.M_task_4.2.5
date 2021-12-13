const searchInput = document.querySelector('.search-input');
const outputField = document.querySelector('.output-field');

searchInput.addEventListener('keyup', debounce(searchRepositories, 300));

async function searchRepositories() {
  if (!searchInput.value) {
    outputField.textContent = '';
  }
  let response = await fetch(
    `https://api.github.com/search/repositories?q=${searchInput.value}`
  );
  if (response.ok) {
    response = await response.json();
    outputField.textContent = '';
    for (let i = 0; i < 5; i++) {
      await createRepository(response.items[i]);
    }
  }
  const allRepo = document.querySelectorAll('.repoLink');
  for (repo of allRepo) {
    repo.addEventListener('click', function () {
      this.nextElementSibling.classList.remove('hidden');
      searchInput.value = '';
      allRepo.forEach((elem) => {
        elem.classList.add('hidden');
      });
    });
  }

  const allCloseButton = document.querySelectorAll('.button-close');
  for (button of allCloseButton) {
    button.addEventListener('click', function () {
      this.parentElement.classList.add('hidden');
    });
  }
}

function createRepository(repo) {
  const repoLink = document.createElement('a');
  repoLink.classList.add('repoLink');
  const repoInfo = document.createElement('div');
  repoInfo.classList.add('repoInfo');
  repoInfo.classList.add('hidden');
  repoLink.textContent = `${repo.name}`;
  outputField.append(repoLink);
  outputField.append(repoInfo);
  repoInfo.insertAdjacentHTML(
    'afterbegin',
    `<div><p>Name: ${repo.name}</p> <p>Owner: ${repo.owner.login}</p> <p>Stars: ${repo.stargazers_count}</p></div>
    <button class="button-close" type="button"><img class="close-img" src="close.png" ></button>`
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
