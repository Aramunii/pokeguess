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
    CONTINUE_BUTTON = $("#continueButton");
    GUESS_BUTTON = $("#guessButton");
    REVEAL_BUTTON = $("#revealButton");
    GUESS_CONTENT = $('.guess-content');
    NEW_BUTTON = $('#newGame');
    INPUT_GUESS = $('#inputPokemon');
    POKEMONGUESS_BUTTON = $("#guessPokemon");
    DONT_GUESS = $('#dontGuess');
    TIME_CONTENT = $('#timeContent');
    TIME_SPAN = $("#timeUpdate");
    TRIES_CONTENT = $('.tries');
    TRIES_LIST = $('#tries');
    RESULT = $('#result');
    SHARE_BUTTON = $('#shareButton');
    PAY_BUTTON = $('#payDev');

    async function fetchPokes() {
        await fetch('https://aramunii.github.io/pokeguess/data.json').then(function (response) {
            // The API call was successful!
            return response.text();
        }).then(async function (html) {
            all_pokemons = JSON.parse(html);
        });
        randomPoke()
    }

    fetchPokes();

    function randomPoke() {
        currentTime = 0;
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
            }
        });
    };

    async function convertImageToCanvas(url) {
        try {
            $('#teste').remove();
            canvas = document.createElement("canvas");
            canvas.setAttribute('id', 'teste');
            var image = new Image();
            try {
                var base64 = await imageUrlToBase64(url);
            } catch (error) {
            }
            image.src = url

            actualScale = startScale;
            image.onload = function () {
                canvas.width = image.width;
                canvas.height = image.height;
                try {
                    canvas.getContext("2d").drawImage(image, 0, 0);
                    $('#image').append(canvas);
                    var context = canvas.getContext("2d");
                    dataarr = []
                    if (canvas.width == 0) {
                        randomPoke()
                    } else {
                        LOADING.hide();
                        START_BUTTON.show(300);
                        try {
                            for (i = 0; i < 100; i++) {
                                dataarr[i] = context.getImageData(0, 0, canvas.width, canvas.height)
                            }
                            var data = context.getImageData(0, 0, canvas.width, canvas.height);
                            JSManipulate.diffusion.filter(data, { scale: startScale });
                            context.putImageData(data, 0, 0);
                        } catch (error) {
                        }
                    }
                } catch (error) {
                }

            };
        } catch (error) {
        }


        image.crossOrigin = "anonymous";
        $('#imageDel').hide();
        return canvas;
    }

    function hideGuessContent() {
        $('.guess-content').hide();
        TRIES_CONTENT.hide();
        TIME_SPAN.hide();
        RESULT.hide()
        TRIES_LIST.empty();
        SHARE_BUTTON.hide();
        PAY_BUTTON.hide();
    }

    function showGuessContent() {
        $('.guess-content').hide(200);
    }

    function showButtons() {
        GUESS_BUTTON.show(200);
        REVEAL_BUTTON.show(200);
    }

    REVEAL_BUTTON.on('click', function () {
        revealCard();
    })


    START_BUTTON.on('click', async function () {
        $(this).hide();
        showButtons();
        running = true;
        startGame();
        TIME_CONTENT.show();
        TIME_SPAN.show();
        TRIES_CONTENT.show();
        RESULT.hide()
    });

    CONTINUE_BUTTON.on('click', function () {
        $(this).hide();
        showButtons();
        running = true;
        startGame();
        TIME_CONTENT.show();
        TIME_SPAN.show();
        TRIES_CONTENT.show();
        RESULT.hide()
    })

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
        if (actualScale <= 0) {
            running = false;
            GUESS_CONTENT.hide(300);
            TRIES_CONTENT.hide(300);
            GUESS_BUTTON.hide(300);
            RESULT.show(200).text(`❌ Você não adivinhou a tempo!`)
        }
    }

    function revealCard() {
        running = false;
        var context = canvas.getContext("2d");
        JSManipulate.diffusion.filter(dataarr[0], { scale: 0 });
        context.putImageData(dataarr[0], 0, 0);
        GUESS_CONTENT.hide(300);
        TRIES_CONTENT.hide(300);
        RESULT.show(200).text(`❌ Você perdeu!`)
    }

    INPUT_GUESS.on('click', function () {
        running = false;
        INPUT_GUESS.removeClass('empty-field');
    })

    POKEMONGUESS_BUTTON.on('click', function () {
        running = false;
        guessPokemon()
    })

    DONT_GUESS.on('click', function () {
        running = true;
        startGame();
        console.log(running);
    })

    INPUT_GUESS.on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            guessPokemon()
        }
    });

    function guessPokemon() {
        var input = INPUT_GUESS.val().toUpperCase();
        if (input != '') {
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
                        GUESS_CONTENT.hide(300);
                        TRIES_CONTENT.hide(300);
                        RESULT.show(200);
                        RESULT.text(`✅ Você Acertou!`)
                        SHARE_BUTTON.show(200);
                        PAY_BUTTON.show(200);
                    }
                });
            } else {
                Swal.fire({
                    title: `Você errou!`,
                    text: 'Continue tentando',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                }).then((result) => {
                    if (result.isConfirmed) {
                        TRIES_LIST.append(`<p>${input}</p>`)
                        running = true;
                        CONTINUE_BUTTON.show(200);
                        $('.guess-content').hide();
                    }
                });
            }
            INPUT_GUESS.val('');
            console.log(input, selectedPokemon.name);
        } else {
            INPUT_GUESS.addClass('empty-field');
        }
    }


    GUESS_BUTTON.on('click', function () {
        running = false;
        GUESS_CONTENT.show(200);
        GUESS_BUTTON.hide(100);
    })

    const delay = ms => new Promise(res => setTimeout(res, ms));


    INPUT_GUESS.on('input', function () {
        // do something
        var input = $(this).val().toUpperCase();
        var newPokemons = [];
        newPokemons = all_pokemons.filter(artist => {
            if (artist.name.toUpperCase().includes(input)) {
                return artist.name;
            }
        })

        var options = [];
        if (newPokemons.length < 200) {
            $('#pokemon').empty();
            newPokemons.forEach(option => {
                if (!options.includes(option.name)) {
                    $('#pokemon').append(`<option value="${option.name}">
                    </option>`)
                    options.push(option.name);
                }
            })
        }
    });

    SHARE_BUTTON.on('click', function () {
        var timed = currentTime;
        var pokemon = selectedPokemon.name;
        var string = `Eu acertei a carta *${pokemon}* \n\n Em ${timed.toFixed(2)} segundos \n\n https://aramunii.github.io/pokeguess/ `
        copyStringToClipboard(string);
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Copiado!',
            showConfirmButton: false,
            timer: 300
        })
    })


    function copyStringToClipboard(str) {
        // Create new element
        var el = document.createElement('textarea');
        // Set value (string to be copied)
        el.value = str;
        // Set non-editable to avoid focus and move outside of view
        el.setAttribute('readonly', '');
        el.style = { position: 'absolute', left: '-9999px' };
        document.body.appendChild(el);
        // Select text inside element
        el.select();
        // Copy text to clipboard
        document.execCommand('copy');
        // Remove temporary element
        document.body.removeChild(el);
    }
})
