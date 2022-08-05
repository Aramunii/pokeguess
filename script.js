$(function () {

    var all_pokemons = [];
    async function fetchPokes() {
        await fetch('https://aramunii.github.io/pokeguess/data.json').then(function (response) {
            // The API call was successful!
            return response.text();
        }).then(async function (html) {
            all_pokemons = JSON.parse(html);
            all_pokemons2 = JSON.parse(html);
        });

    }

    fetchPokes();


    $('#randomButton').on('click',function(){
        const random = Math.floor(Math.random() * all_pokemons.length);
        $('#imageDel').attr('src',all_pokemons[random].images.small).show().hide();
    
        convertImageToCanvas(all_pokemons[random].images.small);
    })
    

    async function imageUrlToBase64 (url){
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((onSuccess, onError) => {
          try {
            const reader = new FileReader() ;
            reader.onload = function(){ onSuccess(this.result) } ;
            reader.readAsDataURL(blob) ;
          } catch(e) {
            onError(e);
          }
        });
      };

   async function convertImageToCanvas(url) {
        $('#teste').remove();
        var canvas = document.createElement("canvas");
        canvas.setAttribute('id', 'teste');
        var image = new Image();
        const base64 = await imageUrlToBase64(url);
        console.log(base64);
        image.src = url
        canvas.width = image.width;
        canvas.height = image.height;

        image.onload = function() {
            canvas.getContext("2d").drawImage(image, 0, 0);
            console.log('aa');
            $('#image').append(canvas);
        };

        $('#imageDel').hide();
        return canvas;
    }


})
