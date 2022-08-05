$(function () {

    var lyrics;
    var line;
    var song;
    var songsname = [];
    var artists = [];
    var tries = 1;
    var tries_guess = [];
    var all_artists = [];
    var all_songs_mid = [];

    var selectedMusics = [];
    var selectedMidi = [];
    var selectedArtist = [];
    var gameMusics = [];
    var difficult = 0;
    var song_count = 0;
    var correct_count = 0;
    var selectedArtistName = '';
    var totalTimePlayed = 0;

    var SelectMenu = $('#selectMenu');
    var GamePlay = $('#gameContent');
    var GamePlayMidi = $('#gameContentMidi');
    var Difficult = $('#dificultSelect');
    var EndGame = $('#endGame');
    var GameMode = $('#gameMode');
    var gamemode = '';


    async function fetchPokes() {
        await fetch('https://aramunii.github.io/song-guess/data.json').then(function (response) {
            // The API call was successful!
            return response.text();
        }).then(async function (html) {
            all_artists = JSON.parse(html);
        });

    }

    fetchPokes();

})
