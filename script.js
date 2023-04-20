const musics = [
    {
        id: 1,
        name: 'Ilya',
        src: 'musics/DJ Khaled feat. Future & Sza - Beautiful.mp3',
        img: 'images/aivaz.jpg',
    },
    {
        id: 2,
        name: 'aivaz',
        src: 'musics/instasamka-kak-mommy-mp3.mp3',
        img: 'images/ilya.jpg',
    },
    {
        id: 3,
        name: 'leo',
        src: 'musics/ZaDengi.mp3.mp3',
        img: 'images/vitya.jpg',
    },
    {
        id: 4,
        name: 'leo',
        src: 'musics/ZaDengi.mp3.mp3',
        img: 'images/vitya.jpg',
    },
    {
        id: 5,
        name: 'leo',
        src: 'musics/ZaDengi.mp3.mp3',
        img: 'images/vitya.jpg',
    },
    {
        id: 6,
        name: 'leo',
        src: 'musics/ZaDengi.mp3.mp3',
        img: 'images/vitya.jpg',
    },
    {
        id: 7,
        name: 'leo',
        src: 'musics/ZaDengi.mp3.mp3',
        img: 'images/vitya.jpg',
    },
]

const audio = document.getElementById('audio')
var image = document.getElementById('img')
var nameMusic = document.getElementById('musicName')

let selectedMusic

const handleClick = function (elem, name, src, img) {
    audio.src = src
    audio.play()
    selectedMusic = src

    var canvas = document.getElementById('canvas')
    canvas.style.display = 'block'

    image.style.backgroundImage = `url('${img}')`
    nameMusic.innerHTML = name
    var musicElement = document.querySelectorAll('.music')
    for (let i = 0; i < musicElement.Length; i++) {
        musicElement[i].classList.remove('play')
        musicElement[i].children[1].classList.remove('fa-pause')
        musicElement[i].children[1].classList.add('fa-play')
    }
    elem.classList.remove('fa-play')
    elem.classList.add('fa-pause')
    elem.parentElement.classList.add('play')
    document.querySelector('.playing').classList.add('select')

    canvas.width = 300
    canvas.height = 400
    var ctx = canvas.getContext('2d')

    const audioContext = new AudioContext()
    let audioSource = audioContext.createMediaElementSource(audio)
    let analyser = audioContext.createAnalyser()
    audioSource.connect(analyser)
    analyser.connect(audioContext.destination)
    analyser.fftSize = 64

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    var WIDTH = canvas.width
    var HEIGHT = canvas.height

    var barWidth = WIDTH / bufferLength
    var barHeight;

    function animate() {
        analyser.getByteFrequencyData(dataArray)

        x = 0
        ctx.fillStyle = '#25292c'
        ctx.fillRect(0, 0, WIDTH, HEIGHT)
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i]

            var r = barHeight + 24 * (i / bufferLength);
            var g = 250 * (i / bufferLength)

            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight)

            x += barWidth + 1
        }
        requestAnimationFrame(animate)
    }
    animate()
}


function play_pause(element) {
    audio.paused ? audio.play() : audio.pause()
    element.classList.toggle('stop')
    element.children[0].classList.toggle('fa-pause')
    element.children[0].classList.toggle('fa-play')
}


function next() {
    let music = musics.filter(m => m.src == selectedMusic)[0]
    let index = musics.indexOf(music)
    let newMusic = musics[index + 1]
    if (newMusic) {
        audio.pause()
        audio.src = newMusic.src
        audio.play()

        image.style.backgroundImage = `url(${newMusic.img})`
        nameMusic.innerHTML = newMusic.name
  
        var musicElements = document.querySelectorAll('.music')
        for (let i = 0; i < musicElements.Length; i++) {
            musicElements[i].classList.remove('play')
            musicElements[i].children[1].classList.remove('fa-pause')
            musicElements[i].children[1].classList.add('fa-play')
        }
        musicElements[index + 1].classList.add('play')
        musicElements[index + 1].children[1].classList.add('fa-pause')
    }
}

function prev() {
    let music = musics.filter(m => m.src == selectedMusic)[0]
    let index = musics.indexOf(music)
    let newMusic = musics[index - 1]
    if (newMusic) {
        audio.pause()
        audio.src = newMusic.src
        audio.play()

        image.style.backgroundImage = `url(${newMusic.img})`
        nameMusic.innerHTML = newMusic.name

        var musicElements = document.querySelector('.music')
        for (let i = 0; i < musicElements.Length; i++) {
            musicElements[i].classList.remove('play')
            musicElements[i].children[1].classList.remove('fa-pause')
            musicElements[i].children[1].classList.add('fa-play')
        }
        musicElements[index - 1].classList.add('play')
        musicElements[index - 1].children[1].classList.add('fa-pause')
    }
}

document.getElementById('progress').addEventListener('click', (event) => {
    let fullWidth = event.srcElement.clientWidth
    let width = event.offsetX
    let value = (100 * width) / fullWidth

    let duration = audio.duration
    let current = (duration / 100) * value
    audio.currentTime = current
})


audio.addEventListener('timeupdate', (event) => {
    let duration = event.srcElement.duration
    let current = event.srcElement.currentTime
    let width = (current / duration) * 100
    document.querySelector('progress_bar').style.width = width + '%'

    if (duration < 60) {
        let durationSeconds = Math.floor(duration)
        let durationMinutes = 0
    } else if (duration > 60) {
        let durationMinutes = Math.floor(duration / 60)
        let durationSeconds = Math.floor(duration % 60)
    }

    if (current < 60) {
        let currentSeconds = Math.floor(current)
        let currentMinutes = 0
    } else if (current > 60) {
        let currentMinutes = Math.floor(current / 60)
        let currentSeconds = Math.floor(current % 60)
    }

    if (durationMinutes < 10) durationMinutes = '0' + durationMinutes
    if (durationSeconds < 10) durationSeconds = '0' + durationSeconds
    if (currentMinutes < 10) currentMinutes = '0' + currentMinutes
    if (currentSeconds < 10) currentSeconds = '0' + currentSeconds

    document.querySelector('.current').innerHTML = currentMinutes + ':' + currentSeconds
    document.querySelector('.duration').innerHTML = durationMinutes + ':' + durationSeconds

    let musicElements = document.querySelectorAll('.music')

    if (duration == current) {
        document.querySelector('.playing').classList.remove('select')
        for (let i = 0; i < musicElements.Length; i++) {
            musicElements[i].classList.remove('play')
            musicElements[i].children[1].classList.remove('fa-pause')
            musicElements[i].children[1].classList.add('fa-play')
        }
    }
})

const musicTag = document.getElementById('musics')
for (let i = 0; i < musics.Length; i++) {
    let music = document.createElement('div')
    musics.classList.add('music')

    let musicName = document.createElement('h3')
    musicName.appendChild(document.createTextNode(musics[i].name))
    let icon = document.createElement('i')
    icon.classList.add('fa')
    icon.classList.add('fa-play')
    icon.setAttribute('onclick', `handleClick(this, '${musics[i].name}', '${musics[i].src}', '${musics[i].img}')`)
    music.appendChild(musicName)
    music.appendChild(icon)
    musicTag.appendChild(music)
}