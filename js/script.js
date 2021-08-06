const input = document.querySelector('.form-control'),
    search = document.querySelector('.search'),
    themeBtn = document.querySelector('.change-theme'),
    loader = document.querySelector('.loader'),
    userInfo = document.querySelector('.user-info'),
    notExist = document.querySelector('.notExist'),
    exist = document.querySelector('.exist');

ScrollReveal().reveal('.first', { delay: 50 });
ScrollReveal().reveal('.second', { delay: 200 });
ScrollReveal().reveal('.madeby', { delay: 400 });

input.addEventListener('keypress', (event) => {
    if (event.code === 'Enter') getPlayer();
});

search.onclick = () => {
    getPlayer();
};

const get = (key) => localStorage.getItem(key);

(function () {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-dark');
    } else {
        setTheme('theme-light');
    }
})();

function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

if (!get('theme')) {
    setTheme('theme-light');
}

themeBtn.onclick = () => {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-light');
    } else {
        setTheme('theme-dark');
    }
};

function getPlayer() {
    document.querySelector('.tops').innerHTML = '';
    let url =
        'https://api.vimeworld.ru/user/name/' + input.value + '/leaderboards';

    fetch(url).then(function (response) {
        let contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
            return response.json().then(function (data) {
                if (!data.error) {
                    document.querySelector('#id').innerHTML = data.user.id;
                    getInfo(
                        data.user.username,
                        data.user.level,
                        data.user.levelPercentage,
                        data.user.rank
                    );
                    getGuild(data.user.guild);
                    getTop(data);

                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 600);
                    userInfo.style.opacity = '1';
                    setTimeout(() => {
                        userInfo.style.display = 'flex';
                    }, 600);
                } else {
                    $.toast({
                        heading: 'Ошибка',
                        text: 'Введите корректный никнейм',
                        position: 'bottom-right',
                        loaderBg: '#3b753d',
                        class: 'jq-toast-danger mb-10',
                        hideAfter: 5000,
                        allowToastClose: true,
                    });

                    loader.style.display = 'block';
                    loader.style.opacity = '1';
                    userInfo.style.display = 'none';
                    userInfo.style.opacity = '0';
                }
            });
        }
    });
}

function getInfo(username, level, levelPercentage, rank) {
    document.querySelector('#nick').innerHTML = username;
    document.querySelector('#lvl').innerHTML = level;
    document.querySelector('#rank').innerHTML =
        rank.charAt(0).toUpperCase() + rank.slice(1).toLowerCase();
    setRankColor(rank);
    var elementg = document.querySelector('.guild');
    elementg.style.visibility = 'hidden';
    var pbar = document.querySelector('.progress-bar');
    pbar.style.width = levelPercentage * 100 + '%';
    var progressLvl = levelPercentage * 100;
    progressLvl_str = progressLvl.toFixed(1);
    document.querySelector('#progress').innerHTML = progressLvl_str + '%';
    Skin(username);
}

function getGuild(guild) {
    var elementg = document.querySelector('.guild');
    if (guild !== 'null') {
        elementg.style.visibility = 'visible';
    }
    guild
        ? document
              .querySelector('#name')
              .setAttribute('href', `https://vimetop.ru/guild/${guild.id}`)
        : '';
    document.querySelector('#name').innerHTML = guild
        ? guild.name
        : 'Без гильдии';
    var gavatar = document.querySelector('#avatar_url');
    guild
        ? guild.avatar_url
            ? gavatar.setAttribute('src', guild.avatar_url)
            : gavatar.setAttribute(
                  'src',
                  'https://vimeworld.ru/images/guild.png'
              )
        : '';
    gavatar.style.width = '32px';
    gavatar.style.height = '32px';
}

function setRankColor(rank) {
    const colorR = document.querySelector('#rank');
    switch (rank) {
        case 'VIP':
            colorR.style.color = '#00B74A';
            return;
        case 'PREMIUM':
            colorR.style.color = '#39C0ED';
            return;
        case 'HOLY':
            colorR.style.color = '#FFA900';
            return;
        case 'IMMORTAL':
            colorR.style.color = '#B23CFD';
            return;
        case 'BUILDER' || 'SRBUILDER' || 'MAPLEAD':
            colorR.style.color = '#00B74A';
            return;
        case 'YOUTUBE':
            colorR.style.color = '#D32F2F';
            return;
        case 'DEV' || 'ORGANIZER' || 'ADMIN':
            colorR.style.color = '#00BCD4';
            return;
        case 'MODER' || 'WARDEN' || 'CHIEF':
            colorR.style.color = '#304FFE';
            return;
        default:
            colorR.style.color = '#ccc';
            return;
    }
}

function Skin(username) {
    var skk = document.querySelector('#skin');
    var skk2 = document.querySelector('#skin-viewer');
    skk.setAttribute(
        'src',
        'http://skin.vimeworld.ru/helm/' + username + '/64.png'
    );
    var skkkkk = 'url(https://skin.vimeworld.ru/raw/skin/' + username + '.png)';
    for (var i = 0; i < 71; i++) {
        var skin3d = document.querySelectorAll('.st3d')[i];
        skin3d.style.backgroundImage = skkkkk;
    }
    var cppppp = 'url(https://skin.vimeworld.ru/raw/cape/' + username + '.png)';
    var img = new Image();
    img.src = 'https://skin.vimeworld.ru/raw/cape/' + username + '.png';
    img.onload = function () {
        var width = this.width;
        var height = this.height;
        if (width == 64 && height == 32) {
            skk2.setAttribute('class', 'mc-skin-viewer-9x legacy cape spin');
        } else {
            skk2.setAttribute(
                'class',
                'mc-skin-viewer-9x legacy legacy-cape spin'
            );
        }
    };

    for (var i = 0; i < 7; i++) {
        var cape3d = document.querySelectorAll('.ct3d')[i];
        cape3d.style.backgroundImage = cppppp;
    }
}

async function getTop(response) {
    const leaderboards = {
        user: {
            level: 'Топ по <span style="color: var(--indigo);">Уровню</span>',
            online: 'Топ по <span style="color: var(--indigo);">Онлайну</span>',
        },
        ann: {
            kills: 'Топ <span style="color: var(--indigo);">Annihilation</span> по убийствам',
        },
        ann_monthly: {
            kills: 'Топ <span style="color: var(--indigo);">Annihilation Season</span> по убийствам',
        },
        bb: {
            wins: 'Топ <span style="color: var(--indigo);">BuildBattle</span> по победам',
        },
        bb_monthly: {
            wins: 'Топ <span style="color: var(--indigo);">BuildBattle Season</span> по победам',
        },
        bp: {
            wins: 'Топ <span style="color: var(--indigo);">BlockParty</span> по победам',
        },
        bp_monthly: {
            wins: 'Топ <span style="color: var(--indigo);">BlockParty Season</span> по победам',
        },
        bw: {
            wins: 'Топ <span style="color: var(--indigo);">BedWars</span> по победам',
            kills: 'Топ <span style="color: var(--indigo);">BedWars</span> по убийствам',
            bedBreaked:
                'Топ <span style="color: var(--indigo);">BedWars</span> по сломанным кроватям',
        },
        bw_monthly: {
            wins: 'Топ <span style="color: var(--indigo);">BedWars Season</span> по победам',
            kills: 'Топ <span style="color: var(--indigo);">BedWars Season</span> по убийствам',
        },
        cp: {
            wins: 'Топ <span style="color: var(--indigo);">ClashPoint</span> по победам',
            kills: 'Топ <span style="color: var(--indigo);">ClashPoint</span> по убийствам',
        },
        cp_monthly: {
            wins: 'Топ <span style="color: var(--indigo);">ClashPoint Season</span> по победам',
            kills: 'Топ <span style="color: var(--indigo);">ClashPoint Season</span> по убийствам',
        },
        dr: {
            wins: 'Топ <span style="color: var(--indigo);">DeathRun</span> по победам',
        },
        dr_monthly: {
            wins: 'Топ <span style="color: var(--indigo);">DeathRun Season</span> по победам',
        },
        duels: {
            total_wins:
                'Топ <span style="color: var(--indigo);">Duels</span> по победам',
            total_games:
                'Топ <span style="color: var(--indigo);">Duels</span> по играм',
        },
        duels_monthly: {
            rate: 'Топ <span style="color: var(--indigo);">Duels Season</span> по рейтингу',
            total_wins:
                'Топ <span style="color: var(--indigo);">Duels Season</span> по победам',
        },
        gg: {
            wins: 'Топ <span style="color: var(--indigo);">GunGame</span> по победам',
            kills: 'Топ <span style="color: var(--indigo);">GunGame</span> по убийствам',
        },
        gg_monthly: {
            wins: 'Топ <span style="color: var(--indigo);">GunGame Season</span> по победам',
            kills: 'Топ <span style="color: var(--indigo);">GunGame Season</span> по убийствам',
        },
        hg: {
            wins: 'Топ <span style="color: var(--indigo);">HungerGames</span> по победам',
        },
        hg_monthly: {
            wins: 'Топ <span style="color: var(--indigo);">HungerGames Season</span> по победам',
        },
        kpvp: {
            points: 'Топ <span style="color: var(--indigo);">KitPvP</span> по очкам',
            kills: 'Топ <span style="color: var(--indigo);">KitPvP</span> по убийствам',
        },
        kpvp_monthly: {
            kills: 'Топ <span style="color: var(--indigo);">KitPvP Season</span> по убийствам',
        },
        mw: {
            wins: 'Топ <span style="color: var(--indigo);">MobWars</span> по победам',
        },
        mw_monthly: {
            wins: 'Топ <span style="color: var(--indigo);">MobWars Season</span> по победам',
        },
        prison: {
            total_blocks:
                'Топ <span style="color: var(--indigo);">Prison</span> по вскопанным блокам',
            kills: 'Топ <span style="color: var(--indigo);">Prison</span> по убийствам',
        },
        prison_season: {
            total_blocks:
                'Топ <span style="color: var(--indigo);">Prison Season</span> по вскопанным блокам',
            kills: 'Топ <span style="color: var(--indigo);">Prison Season</span> по убийствам',
            earned_money:
                'Топ <span style="color: var(--indigo);">Prison Season</span> по заработанным деньгам',
        },
        sw: {
            wins: 'Топ <span style="color: var(--indigo);">SkyWars</span> по победам',
            kills: 'Топ <span style="color: var(--indigo);">SkyWars</span> по убийствам',
        },
        sw_monthly: {
            wins: 'Топ <span style="color: var(--indigo);">SkyWars Season</span> по победам',
            kills: 'Топ <span style="color: var(--indigo);">SkyWars Season</span> по убийствам',
        },
        arc: {
            wins: 'Топ <span style="color: var(--indigo);">Arcade</span> по победам',
        },
        arc_monthly: {
            wins: 'Топ <span style="color: var(--indigo);">Arcade Season</span> по победам',
        },
        bridge: {
            wins: 'Топ <span style="color: var(--indigo);">The Bridge</span> по победам',
            kills: 'Топ <span style="color: var(--indigo);">The Bridge</span> по убийствам',
            points: 'Топ <span style="color: var(--indigo);">The Bridge</span> по очкам',
        },
        jumpleague: {
            wins: 'Топ <span style="color: var(--indigo);">Jump League</span> по победам',
            kills: 'Топ <span style="color: var(--indigo);">Jump League</span> по убийствам',
        },
        murder: {
            wins_as_maniac:
                'Топ <span style="color: var(--indigo);">Murder Mystery</span> по победам за маньяка',
            total_wins:
                'Топ <span style="color: var(--indigo);">Murder Mystery</span> по общим победам',
            kills: 'Топ <span style="color: var(--indigo);">Murder Mystery</span> по убийствам',
        },
        paintball: {
            wins: 'Топ <span style="color: var(--indigo);">Paintball</span> по победам',
            kills: 'Топ <span style="color: var(--indigo);">Paintball</span> по убийствам',
        },
        sheep: {
            wins: 'Топ <span style="color: var(--indigo);">SheepWars</span> по победам',
            kills: 'Топ <span style="color: var(--indigo);">SheepWars</span> по убийствам',
            tamed_sheep:
                'Топ <span style="color: var(--indigo);">SheepWars</span> по принесенным овечкам',
        },
        tntrun: {
            wins: 'Топ <span style="color: var(--indigo);">TNT Run</span> по победам',
        },
        tnttag: {
            wins: 'Топ <span style="color: var(--indigo);">TNT Tag</span> по победам',
            kills: 'Топ <span style="color: var(--indigo);">TNT Tag</span> по убийствам',
        },
        turfwars: {
            wins: 'Топ <span style="color: var(--indigo);">TurfWars</span> по победам',
            kills: 'Топ <span style="color: var(--indigo);">TurfWars</span> по убийствам',
        },
        luckywars: {
            wins: 'Топ <span style="color: var(--indigo);">LuckyWars</span> по победам',
            kills: 'Топ <span style="color: var(--indigo);">LuckyWars</span> по убийствам',
        },
    };

    if (response.leaderboards.length !== 0) {
        notExist.style.display = 'none';
        exist.style.display = 'block';
        let l = response.leaderboards.length;
        for (let i = 0; i !== l; i++) {
            document.querySelector('.tops').innerHTML += `
            <li>
                <i class="ri-check-double-line"></i>
                <span>
                ${
                    leaderboards[response.leaderboards[i].type][
                        response.leaderboards[i].sort
                    ]
                } - <span style="color: #ff8c00;">${
                response.leaderboards[i].place + 1
            }</span> место</span>
            </li>`;
        }
        document.querySelector(
            '.total h5'
        ).innerHTML = `Всего топов: <span style="color: var(--ggray);">${l}</span>`;
        document
            .querySelector('.more a')
            .setAttribute(
                'href',
                `https://vime.top/p/${response.user.username}`
            );
        if (l < 10) {
            exist.classList.add('my-4');
        } else if (l < 5) {
            exist.classList.add('my-5');
        }
    } else {
        notExist.style.display = 'block';
        exist.style.display = 'none';
    }
}
