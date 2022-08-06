$(function () {

    var all_pokemons = [];
    var actualScale = 80;
    var startScale = 80;
    var canvas;
    var running;
    var selectedPokemon;

    var currentTime = 0;



    LOADING = $('#loading');
    START_BUTTON = $('#startButton');
    GUESS_BUTTON = $("#guessButton");
    REVEAL_BUTTON = $("#revealButton");
    GUESS_CONTENT = $('.guess-content');
    NEW_BUTTON = $('#newGame');
    INPUT_GUESS = $('#inputPokemon');
    POKEMONGUESS_BUTTON = $("guessPokemon");
    DONT_GUESS = $('#dontGuess');
    TIME_CONTENT = $('#timeContent');
    TIME_SPAN = $("#timeUpdate");

    async function fetchPokes() {
        await fetch('https://aramunii.github.io/pokeguess/data.json').then(function (response) {
            // The API call was successful!
            return response.text();
        }).then(async function (html) {
            all_pokemons = JSON.parse(html);
            all_pokemons2 = JSON.parse(html);
        });
        randomPoke()
    }

    fetchPokes();

    function randomPoke() {
        currentTime = 0;
        TIME_SPAN.hide();
        hideGuessContent();
        LOADING.show();
        const random = Math.floor(Math.random() * all_pokemons.length);
        selectedPokemon = all_pokemons[random];
        $('#imageDel').attr('src', all_pokemons[random].images.small).show().hide();
        convertImageToCanvas(all_pokemons[random].images.small);
    }

    NEW_BUTTON.on('click', async function () {
        randomPoke();
    })


    async function imageUrlToBase64(url) {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((onSuccess, onError) => {
            try {
                const reader = new FileReader();
                reader.onload = function () { onSuccess(this.result) };
                reader.readAsDataURL(blob);
            } catch (e) {
                onError(e);
            }
        });
    };

    async function convertImageToCanvas(url) {
        $('#teste').remove();
        canvas = document.createElement("canvas");
        canvas.setAttribute('id', 'teste');
        var image = new Image();
        const base64 = await imageUrlToBase64(url);
        image.src = url
        canvas.width = image.width;
        canvas.height = image.height;
        actualScale = startScale;
        image.onload = function () {
            canvas.getContext("2d").drawImage(image, 0, 0);
            $('#image').append(canvas);
            var context = canvas.getContext("2d");
            dataarr = []
            if (canvas.width == 0) {
                randomPoke()
            } else {
                LOADING.hide();
                START_BUTTON.show(300);
                for (i = 0; i < 100; i++) {
                    dataarr[i] = context.getImageData(0, 0, canvas.width, canvas.height)
                }
                var data = context.getImageData(0, 0, canvas.width, canvas.height);
                JSManipulate.diffusion.filter(data, { scale: startScale });
                context.putImageData(data, 0, 0);
            }
        };

        image.crossOrigin = "anonymous";
        $('#imageDel').hide();
        return canvas;
    }

    function hideGuessContent() {
        $('.guess-content').hide();
    }

    function showGuessContent() {
        $('.guess-content').hide(200);
    }

    function showButtons() {
        GUESS_BUTTON.show(200);
        REVEAL_BUTTON.show(200);
    }


    START_BUTTON.on('click', async function () {
        $(this).hide();
        showButtons();
        running = true;
        startGame();
        TIME_CONTENT.show();
        TIME_SPAN.show();
    });

    // async function startCronometer() {
    //     while (running) {

    //     }
    // }

    async function startGame() {
        while (actualScale > 0 && running) {
            TIME_SPAN.text(currentTime.toFixed(2) + 's');
            currentTime += 0.100;
            actualScale -= 1;
            var context = canvas.getContext("2d");
            JSManipulate.diffusion.filter(dataarr[actualScale], { scale: actualScale });
            context.putImageData(dataarr[actualScale], 0, 0);
            console.log(`A ESCALA ATUAL ESTÁ EM : ${actualScale}`)
            await delay(100);
        }
    }

    INPUT_GUESS.on('click', function () {
        running = false;
    })

    POKEMONGUESS_BUTTON.on('click', function () {
        guessPokemon()
    })

    DONT_GUESS.on('click', function () {
        running = true;
        startGame();
        console.log(running);
    })

    $(".input1").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            // Do something
            guessPokemon()
        }
    });

    function guessPokemon() {
        var input = INPUT_GUESS.val().toUpperCase();
        if (input == selectedPokemon.name.toUpperCase()) {
            Swal.fire({
                title: `Você acertou!`,
                icon: 'success',
                confirmButtonText: 'Ok'
            }).then((result) => {
                if (result.isConfirmed) {
                    var context = canvas.getContext("2d");
                    JSManipulate.diffusion.filter(dataarr[0], { scale: 0 });
                    context.putImageData(dataarr[0], 0, 0);
                }
            });
        } else {
            running = true;
        }
        INPUT_GUESS.val('');
        console.log(input, selectedPokemon.name);
    }


    GUESS_BUTTON.on('click', function () {
        running = false;
        GUESS_CONTENT.show(200);
        GUESS_BUTTON.hide(100);
    })

    const delay = ms => new Promise(res => setTimeout(res, ms));


})
