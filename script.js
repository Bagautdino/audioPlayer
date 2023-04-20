const musics = [
    {
        id: 1,
        name: 'Frank Sinatra - My Way',
        src: 'musics/1.mp3',
        img: 'images/1.jpg',
    },
    {
        id: 2,
        name: 'Louis Armstrong - What the Wonderful World',
        src: 'musics/2.mp3',
        img: 'images/2.jpg',
    },
    {
        id: 3,
        name: 'Ray Charles - Georgia On My Mind',
        src: 'musics/3.mp3',
        img: 'images/3.jpg',
    },
    {
        id: 4,
        name: 'ABBA - The Winners Take It All',
        src: 'musics/4.mp3',
        img: 'images/4.jpg',
    },
    {
        id: 5,
        name: 'Madcon - Beggin',
        src: 'musics/5.mp3',
        img: 'images/5.jpg',
    },
    {
        id: 6,
        name: 'Kid Cudi - Persuit Hapinness',
        src: 'musics/6.mp3',
        img: 'images/6.jpg',
    },
]

const audio = document.getElementById('audio')
var image = document.getElementById('img')
var nameMusic = document.getElementById('musicName')

let selectedMusic

const handleClick = function(elem, name, src, img) {
    audio.src = src
    audio.play()
    selectedMusic = src
    var canvas = document.getElementById('canvas')
    canvas.style.display = 'block'
    image.style.backgroundImage = `url('${img}')`
    nameMusic.innerHTML = name
    var musicElement = document.querySelectorAll('.music')
    for (let i = 0; i < musicElement.length; i++) {
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
            var b = 240
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
        for (let i = 0; i < musicElements.length; i++) {
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
        var musicElements = document.querySelectorAll('.music')
        for (let i = 0; i < musicElements.length; i++) {
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

let duration = document.querySelector('.duration')
let current = document.querySelector('.current')
let progress_bar = document.querySelector('.progress_bar')

audio.addEventListener('timeupdate', (event) => {
    let durationValue = event.srcElement.duration
    let currentValue = event.srcElement.currentTime
    let width = (currentValue / durationValue) * 100
    progress_bar.style.width = width + '%'

    if (durationValue < 60) {
        let durationSeconds = Math.floor(durationValue)
        let durationMinutes = 0
    } else if (durationValue > 60) {
        let durationMinutes = Math.floor(durationValue / 60)
        let durationSeconds = Math.floor(durationValue % 60)
    }

    if (currentValue < 60) {
        let currentSeconds = Math.floor(currentValue)
        let currentMinutes = 0
    } else if (currentValue > 60) {
        let currentMinutes = Math.floor(currentValue / 60)
        let currentSeconds = Math.floor(currentValue % 60)
    }

    if (durationMinutes < 10) durationMinutes = '0' + durationMinutes
    if (durationSeconds < 10) durationSeconds = '0' + durationSeconds
    if (currentMinutes < 10) currentMinutes = '0' + currentMinutes
    if (currentSeconds < 10) currentSeconds = '0' + currentSeconds

    current.innerHTML = currentMinutes + ':' + currentSeconds
    duration.innerHTML = durationMinutes + ':' + durationSeconds

    let musicElements = document.querySelectorAll('.music')

    if (durationValue == currentValue) {
        document.querySelector('.playing').classList.remove('select')
        for (let i = 0; i < musicElements.Length; i++) {
            musicElements[i].classList.remove('play')
            musicElements[i].children[1].classList.remove('fa-pause')
            musicElements[i].children[1].classList.add('fa-play')
        }
    }
})

const musicTag = document.getElementById('musics')
for (let i = 0; i < musics.length; i++) {
    let music = document.createElement('div')
    music.classList.add('music')
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