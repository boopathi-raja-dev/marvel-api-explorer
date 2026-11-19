 
 var publicKey = window.MARVEL_PUBLIC_KEY;
 var privateKey = window.MARVEL_PRIVATE_KEY;
 var ts = new Date().getTime();
 var hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
 var apiUrl = 'https://gateway.marvel.com/v1/public/characters';

 function searchCharacters() {
     var searchTerm = $('#search').val();
     $.ajax({
         url: apiUrl,
         type: 'GET',
         data: {
             ts: ts,
             apikey: publicKey,
             hash: hash,
             nameStartsWith: searchTerm
         },
         success: function(response) {
             displayCharacters(response.data.results);
         },
         error: function(error) {
             console.log('Error:', error);
         }
     });
 }

 function displayCharacters(characters) {
     var charactersList = $('#characters-list');
     charactersList.empty();

     if (characters.length === 0) {
         charactersList.append('<p class="color">No characters found.</p>');
         return;
     }

     characters.forEach(function(character) {
         var name = character.name;
         var description = character.description;
         var imageUrl = character.thumbnail.path + '.' + character.thumbnail.extension;
         var characterId = character.id;

         var characterHtml = '<div class="character-container" data-id="' + characterId + '">';
         characterHtml += '<h2>' + name + '</h2>';
         characterHtml += '<img src="' + imageUrl + '" alt="' + name + '">';
         characterHtml += '<p class="character-description">' + (description || 'No description available.') + '</p>';
         characterHtml += '<a href="character.html?character_id=' + characterId + ',character_name='+name+'">See the Url</a>';
         characterHtml += '</div>';

         charactersList.append(characterHtml);
     });

     // on-click description
     $('.character-container').on('click', function() {
        $(this).find('.character-description').slideToggle();
         var characterId = $(this).data('id');
         getCharacterDetails(characterId);
     });
        
 }

 function getCharacterDetails(characterId) {
     $.ajax({
         url: apiUrl + '/' + characterId,
         type: 'GET',
         data: {
             ts: ts,
             apikey: publicKey,
             hash: hash
         },
         success: function(response) {
             displayCharacterDetails(response.data.results[0]);
         },
         error: function(error) {
             console.log('Error:', error);
         }
     });
 }

 function displayCharacterDetails(character) {
     var characterDetailsContainer = $('#character-details-container');
     characterDetailsContainer.empty();

     var name = character.name;
     var description = character.description;
     var imageUrl = character.thumbnail.path + '.' + character.thumbnail.extension;

     var characterDetailsHtml = '<div class="character-details">';
     characterDetailsHtml += '<h2>' + name + '</h2>';
     characterDetailsHtml += '<img src="' + imageUrl + '" alt="' + name + '">';
     characterDetailsHtml += '<p class="character-description">' + (description || 'No description available.') + '</p>';
     characterDetailsHtml += '</div>';

     characterDetailsContainer.append(characterDetailsHtml);
 }

 $(document).ready(function() {
     $.ajax({
         url: apiUrl,
         type: 'GET',
         data: {
             ts: ts,
             apikey: publicKey,
             hash: hash
         },
         success: function(response) {
             displayCharacters(response.data.results);
         },
         error: function(error) {
             console.log('Error:', error);
         }
     });
 });