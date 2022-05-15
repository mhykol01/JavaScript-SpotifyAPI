$(document).ready(function() {
    //Get Token
    const getToken = (sParam) => {
        let sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL != undefined && sPageURL.length > 0 ? sPageURL.split('#') : [],
            sParameterName,
            i
        let split_str = window.location.href.length > 0 ? window.location.href.split('#') : []
        sURLVariables = split_str != undefined && split_str.length > 1 && split_str[1].length > 0 ? split_str[1].split('&') : []
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=')
            if (sParameterName[0] === sParam) {
               return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1])
            }
        }
    }

    const token = getToken('access_token')
    const client_id = '3306728b90f54975b9e09542b49a1196'
    const redirect_uri = 'http%3A%2F%2F127.0.0.1%3A3000%2F'
    const redirect = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}`

    if(token == null || token == "" || token == undefined){
        window.location.replace(redirect)
    }

    //Populate genre field
    $.ajax({
        url: `https://api.spotify.com/v1/browse/categories?locale=sv_US`,
        type: 'GET',
        headers: {
            'Authorization' : 'Bearer ' + token
        },
        success: function(data) {
            let genres = data.categories.items

            for (let i = 0; i < genres.length; i++) {
                $('#genre').append(`<option id=${genres[i].id} value="${genres[i].id}">${genres[i].name}</option>`)
            }
        }
    })

    //Global music search
    $("#search_music").click(function() {
        let search_query = encodeURI(document.getElementById('search_text').value)
        
        if (search_query != '') {
            clearErrorMessage()
            $.ajax({
                url: `https://api.spotify.com/v1/search?q=${search_query}&type=track`,
                type: 'GET',
                headers: {
                    'Authorization' : 'Bearer ' + token
                },
                success: function(data) {
                    let num_of_tracks = data.tracks.items.length

                    for (let i = 0; i < 12; i++) {
                        let src_str = `https://open.spotify.com/embed/track/${data.tracks.items[i].id}`
                        $('#song'+ i).html(`<div class='song'><iframe src=${src_str} frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></div>`)
                    }
                }
            })
        } else {
            errorMessage('music')
        }
    })

    //Genre search
    $("#search_genre").click(function() {
        let genre_element = document.getElementById('genre')
        let genre = genre_element.options[genre_element.selectedIndex].value
        
        if (genre != '') {
            clearErrorMessage()
            $.ajax({
                url: `https://api.spotify.com/v1/search?q=${genre}&type=track`,
                type: 'GET',
                headers: {
                    'Authorization' : 'Bearer ' + token
                },
                success: function(data) {
                    let num_of_tracks = data.tracks.items.length

                    for (let i = 0; i < 12; i++) {
                        let src_str = `https://open.spotify.com/embed/track/${data.tracks.items[i].id}`
                        $('#song'+ i).html(`<div class='song'><iframe src=${src_str} frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></div>`)
                    }
                }
            })
        } else {
            errorMessage('genre')
        }
    })

    //Display error message if user has no input
    const errorMessage = (x) => {
        switch (x) {
            case 'music':
                $('#error').html('Error: Please type in the name of a song')
                break
            case 'genre':
                $('#error').html('Error: Please choose a genre')
                break
        }
    }

    //Clear error message
    const clearErrorMessage = () => {
        $('#error').html('')
    }
})