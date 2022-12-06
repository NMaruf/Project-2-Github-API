class View {
    constructor () {
    this.app = document.getElementById('app');
    this.container = this.createElement('ul', 'container');

    this.searchLine = this.createElement('div', 'search-line');
    this.searchInput = this.createElement('input', 'search-input');
    this.searchLine.append(this.searchInput);

    this.usersWrapper = this.createElement('div', 'users-wrapper');
    this.usersList = this.createElement('ul', 'users');
    this.usersWrapper.append(this.usersList);

    this.main = this.createElement('div', 'main');
    this.main.append(this.usersWrapper);

    this.app.append(this.searchLine);
    this.app.append(this.main);
    this.app.append(this.container);
    }

    createElement (elementTag, elementClass) {
        const element = document.createElement(elementTag);
        if (elementClass) {
            element.classList.add(elementClass);
        }
        return element;
    }

    createUser (userData) {
        const userElement = this.createElement ('li', 'user-prev-name');

        userElement.innerHTML = `<p class= "user-prev-name">${userData.name}</p>`
        this.usersList.append(userElement);

        const userRepo = this.createElement ('li', 'user-repo-hidden');
        const input = document.querySelector('.search-input');

        userElement.addEventListener('click', function() {
            userRepo.innerHTML = `<p class= "user-prev">Name: ${userData.name}</p>\n
                                  <p class= "user-prev">Owner: ${userData.owner.login}</p>\n
                                  <p class= "user-prev">Stars: ${userData.stargazers_count}</p>
                                  <div class="close"></div>`;
            userRepo.classList.add('user-repo-visible');
            userElement.parentElement.classList.add('hidden');
            input.value = '';
        })

        this.container.addEventListener('click', function(event) {
            if (event.target.className != 'close') return;

            let userRepo = event.target.closest('.user-repo-visible');
            userRepo.remove();
        })

        this.container.appendChild(userRepo)
    }

}

const USER_PER_PAGE = 5;

class Search {
    constructor(view) {
        this.view = view;
        this.view.searchInput.addEventListener('keyup', this.debounce(this.searchUsers.bind(this), 500));
    }

    async searchUsers() {
        const searchValue = this.view.searchInput.value;
        if (searchValue) {
            this.view.usersList.classList.remove('hidden');
            this.clearUsers();
            return await fetch(`https://api.github.com/search/repositories?q=${searchValue}&per_page=${USER_PER_PAGE}`)
                .then((res) => {
                    if (res.ok) {
                        res.json().then(res => {
                            res.items.forEach(user => this.view.createUser(user))
                        })
                    }

            })
        } else {
            this.clearUsers()
        }
    }

    clearUsers() {
        this.view.usersList.innerHTML = "";
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            let context = this, args = arguments;
            let later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
}

new Search(new View());