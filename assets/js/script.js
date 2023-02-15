const cardContainer = document.querySelector('.swiper-wrapper');
const LOADER = document.querySelector('#loader');

const AGENT_LIST = [];
const agents = [];

function getUrlAgent(agentId){
    return `https://valorant-api.com/v1/agents/${agentId}`;
};

function setFeaturedAgent(agent){
    const img = document.querySelector('.agent-img');

    img.setAttribute('src', agent.fullPortrait);
};

function changeFeaturedAgent(agentId){
    const agent = agents.find(agent => agent.id === agentId);
    setFeaturedAgent(agent);
}

async function addAgentCards(agent){
    const card = document.createElement('div');
    card.classList.add('swiper-slide');

    card.innerHTML  =   `<div class="card-container">`+
                            `<img src="./assets/img/stroke.svg" alt="Linha de fora do card">`+
                            `<div class="agent-card-outline">`+
                                `<img class="agent-card-body" loading="lazy" src="${agent.displayIcon}" onclick="changeFeaturedAgent('${agent.id}');" alt="Imagem agente"/>`+
                            `</div>`+
                            `<p class="agent-card-name">${agent.displayName}</p>`+
                        `</div>`;

    cardContainer.appendChild(card);
};


function createCards(){
    AGENT_LIST.map((agent, index) => {
        fetch(getUrlAgent(agent)).then((response) => response.json()).then((obj) => {
            data = obj.data;
            
            const agentData = {
                id: data.uuid,
                displayName: data.displayName,
                displayIcon: data.displayIconSmall,
                fullPortrait: data.fullPortraitV2
            };

            agents.push(agentData);

            if(index === 0){
                setFeaturedAgent(agentData);
            };

            addAgentCards(agentData).then(() => {
                var swiper = new Swiper(".cards-slider", {
                    slidesPerView: 3,
                    spaceBetween: 0,
                    loop: false,
                    navigation: {
                        nextEl: ".slider-next-button",
                        prevEl: ".slider-prev-button",
                    },
                });
            });
            
        });
    });
};

function setAgents(){
    

    fetch('https://valorant-api.com/v1/agents')
    .then((response) => response.json())
    .then((obj) => {
        for(let { isPlayableCharacter, uuid } of obj.data){
            if(isPlayableCharacter === true){
                AGENT_LIST.push(uuid);
            };
        };
    }).then(() => {
        createCards();
    });
};

setAgents();
