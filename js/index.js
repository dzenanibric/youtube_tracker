const button = document.querySelector('.theme__button');
const circle = document.querySelector('.theme__button--circle');
const back_btn = document.getElementById('back-btn');
const body = document.querySelector("body");

const goLight = () => {
    localStorage.setItem('theme', 'light');
    body.classList.add(localStorage.getItem('theme'));
}

const removeLightTheme = () => {
    localStorage.setItem('theme', 'dark');
    body.classList.remove('light');
}

body.classList.add(localStorage.getItem('theme'));
circle.style.marginLeft = localStorage.getItem('circle_position');

button.addEventListener('click', ()=>{
    if(circle.style.marginLeft == '1.8rem'){
        localStorage.setItem('circle_position', '0.1rem');
        circle.style.marginLeft = '0.1rem';
        removeLightTheme();
    }
    else{
        circle.style.marginLeft = '1.8rem';
        localStorage.setItem('circle_position', '1.8rem');
        goLight();
    }
});

const API_KEY = 'AIzaSyAPrBRW7WdteTxN8Hk8pkJttsPXW0sp7-8';

const getChannelId = (username) => {
    return new Promise((resolve, reject) => {
        const USERNAME = username;
        fetch(`https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&forUsername=${USERNAME}&part=id`)
        .then(response => response.json()).then(json => resolve(json.items[0].id))
        .catch(error => reject('Invalid username '+error));
    });
}

const getChannelStats = (id) =>{
    return new Promise((resolve, reject) =>{
        const USER_ID = id;
        fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${USER_ID}&key=${API_KEY}`)
        .then(response => response.json()).then(json => resolve(json))
        .catch(error => reject(error));
    });
}

const setData = () =>{
    return new Promise((resolve, reject) => {
        getChannelId(String(username)).then(response =>{
            getChannelStats(response).then(stats => {
               views = stats.items[0].statistics.viewCount;
               subscribers = stats.items[0].statistics.subscriberCount;
               videos = stats.items[0].statistics.videoCount;
               hidden_subs_count = stats.items[0].statistics.hiddenSubscriberCount;
               id_e = stats.items[0].id;
               resolve({
                   views: views,
                   subscribers: subscribers,
                   videos: videos,
                   hiddenSubsCount: hidden_subs_count,
                   id: id_e,
               });
            }).catch(error => console.log(error));
        }).catch(error => reject(error));
    });
}

const username_input = document.querySelector('#username-input');
const viewOne = document.querySelector('.viewOne');
const viewTwo = document.querySelector('.viewTwo');
let username, id, views, subscribers, videos, hidden_subs_count, id_e;

username_input.addEventListener('keypress', (e)=>{
    if(e.key === 'Enter'){
        e.preventDefault();
        username = username_input.value;
        setData().then(response => {
            viewOne.style.display = 'none';
            viewTwo.style.display = 'flex';
            const subs_element = document.createElement('p');
            const views_element = document.createElement('p');
            const videos_element = document.createElement('p');
            const hidden_subs_element = document.createElement('p');
            const id_element = document.createElement('p');

            subs_element.innerText = 'Subscribes: ' + response.subscribers;
            views_element.innerText = 'Total views: ' + response.views;
            videos_element.innerText = 'Total videos: ' + response.videos;
            hidden_subs_element.innerText = 'Hidden Subscribers Count: ' + response.hiddenSubsCount;
            id_element.innerText = 'ID: ' + response.id;

            viewTwo.appendChild(id_element);
            viewTwo.appendChild(subs_element);
            viewTwo.appendChild(views_element);
            viewTwo.appendChild(videos_element);
            viewTwo.appendChild(hidden_subs_element);
        })
        .catch(error => {
            const error_element = document.createElement('p');
            error_element.innerText = error;
            viewOne.appendChild(error_element);
        });
        username_input.value = '';
    }
});

back_btn.addEventListener('click', ()=>{
    viewTwo.style.display = 'none';
    viewOne.style.display = 'flex';
    document.querySelectorAll('p').forEach(element => element.remove());
});