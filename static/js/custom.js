function setupModal(modalSelector, closeButtonSelector, overlaySelector) {
    let modal = document.querySelector(modalSelector),
        closeButton = document.querySelector(closeButtonSelector),
        overlay = document.querySelector(overlaySelector);
    function openModal() {
        modal.classList.add("show");
        overlay.classList.add("show");
        document.body.classList.add("no-scroll");
    }
    closeButton.addEventListener("click", function (event) {
        closeModal(event);
    });
    document.addEventListener("click", function (event) {
        if (!modal.contains(event.target) && !closeButton.contains(event.target)) {
            closeModal(event);
        }
    });
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeModal(event);
        }
    });
    function closeModal(event) {
        modal.classList.remove("show");
        overlay.classList.remove("show");
        document.body.classList.remove("no-scroll");
        event.stopPropagation();
    }
    return openModal;
}

// Initialize  "Thank You" modal
const openThankYouModal = setupModal(".thank", ".thank-popup__close", ".thank-popup__overlay");

// Initialize "error" modal
const openErrorModal = setupModal(".error", ".error-popup__close", ".error-popup__overlay");





//:::::::::::::::::::GET PRICE BY MATERIAL AND SURFACE 
document.addEventListener('DOMContentLoaded', function () {
    function getCookie(name) { 
        let cookieValue = null; 
        if (document.cookie && document.cookie !== '') { 
            const cookies = document.cookie.split(';'); 
            for (let i = 0; i < cookies.length; i++) { 
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break; 
                } 
            } 
        } 
        return cookieValue; 
    }

    function updateSurface() {
        const materialSlug = document.getElementById('material-select').value;
        const houseId = document.querySelector('.house__info').getAttribute('data-house-id');
        
        if (!materialSlug || !houseId) {
            return;
        }
    
        const formData = new FormData();
        formData.append('material_slug', materialSlug);
        formData.append('house_id', houseId);
    
        fetch('/get_surfaces', {
            method: 'POST',
            body: formData,
            headers: { 'X-CSRFToken': getCookie('csrftoken') }
        })
        .then(response => response.json())
        .then(data => {
            if (data.surfaces_html) {
                document.getElementById('surface-select').outerHTML = data.surfaces_html;
                // console.log("Surfaces mises à jour");
                
                attachSurfaceChangeEvent();
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function attachSurfaceChangeEvent() {
        const surfaceSelect = document.getElementById('surface-select');
        
        if (surfaceSelect) {
            surfaceSelect.addEventListener('change', updatePrice);
        }
    }

    function updatePrice() {
        // console.log("updatePrice called");
        
        const materialSlug = document.getElementById('material-select').value;
        const surface = document.getElementById('surface-select').value;

        // console.log("Material:", materialSlug); 
        // console.log("Surface:", surface);

        if (!materialSlug || !surface) {
            // console.log("Material or surface is missing.");
            return;
        }

        const formData = new FormData();
        formData.append('material_slug', materialSlug);
        formData.append('surface', surface);

        fetch('/get_price', {
            method: 'POST',
            body: formData,
            headers: { 'X-CSRFToken': getCookie('csrftoken') }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données.');
            }
            return response.json();
        })
        .then(data => {
            if (data.total_price) {
                document.querySelector('.price__sum').textContent = data.total_price + ' ₽';
                // console.log("Prix mis à jour : " + data.total_price);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    const materialSelect = document.getElementById('material-select');

    if (materialSelect) {
        materialSelect.addEventListener('change', updateSurface);
    }
    
    attachSurfaceChangeEvent();
});


//:::::::AJAX REQUEST ON SITE:::::::::::::::::::::://

//::::::::::: COMMON AJAX FUNCTION :::::::::::::::://
// Handle AJAX error response
function handleError(xhr, status, error) {
    console.log('Error:', xhr.responseText);
}
// Get cookie value by name
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
// Check if the method requires CSRF protection
function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
// Check if the URL is same-origin
function sameOrigin(url) {
    const host = document.location.host;
    const protocol = document.location.protocol;
    const sr_origin = '//' + host;
    const origin = protocol + sr_origin;

    return (url === origin || url.slice(0, origin.length + 1) === origin + '/') ||
           (url === sr_origin || url.slice(0, sr_origin.length + 1) === sr_origin + '/') ||
           !(/^(\/\/|http:|https:).*/.test(url));
}

//::::::::::: CHECK FORM VALIDATION PHONE AND EMAIL:::::::::::::::: //
// Custom function to validate phone number
function validatePhoneNumber(phoneNumber) {
    // Vérifie si le numéro commence par +7 ou 8 et contient 10 chiffres
    var regex = /^(?:\+7|8)[0-9]{10}$/;
    return regex.test(phoneNumber);
}
// Custom function to validate email
function validateEmail(email) {
    // Basic email validation regex
    var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}
// Custom function to format phone number as user types
window.addEventListener("DOMContentLoaded", function() {
    [].forEach.call(document.querySelectorAll('input[data-phone]'), function(input) {
        input.addEventListener("input", mask);
        input.addEventListener("focus", mask);
        input.addEventListener("blur", mask);

        function mask(event) {
            var blank = "+_ (___) ___-__-__";
            var i = 0;
            var val = this.value.replace(/\D/g, ""); // Remove non-digit characters

            // Allow user to type before replacing
            if (val.length > 0) {
                // Replace the prefix with '7' if the number starts with '8'
                if (val.startsWith('8')) {
                    val = '7' + val.slice(1); // Replace '8' with '7'
                } else if (!val.startsWith('7')) {
                    val = '7' + val; // Replace any other starting digit with '7'
                }
            }

            this.value = blank.replace(/./g, function(char) {
                if (/[_\d]/.test(char) && i < val.length) return val.charAt(i++);
                return i >= val.length ? "" : char;
            });

            if (event.type == "blur") {
                if (this.value.length == 2) this.value = "";

                var pattern = /^(\+7)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
                if (pattern.test(this.value)) {
                    this.classList.add('input-ok');
                    this.classList.remove('input-error');
                    this.parentNode.classList.remove('error-input');
                    this.parentNode.classList.add('ok-input');
                } else {
                    this.classList.add('input-error');
                    this.classList.remove('input-ok');
                    this.parentNode.classList.add('error-input');
                    this.parentNode.classList.remove('ok-input');
                }
            } else {
                setCursorPosition(this, this.value.length);
            }
        };

        function setCursorPosition(elem, pos) {
            elem.focus();
            
            if (elem.setSelectionRange) {    
                elem.setSelectionRange(pos, pos);
                return;
            }
            
            if (elem.createTextRange) {    
                var range = elem.createTextRange();
                range.collapse(true);
                range.moveEnd("character", pos);
                range.moveStart("character", pos);
                range.select();      
                return;
            }
        }
    });
});

//::::::::::::::::::: SEND ORDER GLOBAL FORM ::::::::::::://
function send_form_order(form_name) {
    const form = document.getElementById(form_name);
    
    const csrftoken = getCookie('csrftoken');

    if (!validatePhoneNumber(form) || !validateEmailInput(form)) {
        return false;  // Stop submission if validation fails
    }

    const form_data = new FormData(form);

    $.ajax({
        url: form.getAttribute('action'),
        type: 'POST',
        contentType: false,
        processData: false,
        data: form_data,
        dataType: 'json',
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data) {
            OrderHandleSuccess(data, form);  // Pass the form reference
        },
        error: handleError
    });

    return false;  // Prevent default form submission
}

// Validate phone number format
function validatePhoneNumber(form) {
    const phoneInput = form.querySelector('input[name="phone"]');
    const phoneError = form.querySelector('.phone-error');
    
    if (phoneInput) {
        const phoneValue = phoneInput.value;
        const pattern = /^(\+7)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;

        if (!pattern.test(phoneValue)) {
            phoneError.style.display = 'block';
            phoneInput.classList.add('invalid');
            return false;  // Invalid phone number
        } else {
            phoneError.style.display = 'none';
            phoneInput.classList.remove('invalid');
        }
    }
    return true;  // Valid phone number
}

// Validate email format
function validateEmailInput(form) {
    const emailInput = form.querySelector('input[name="email"]');
    const emailError = form.querySelector('.email-error');

    if (emailInput && emailInput.value) { 
        const emailValue = emailInput.value;

        if (!validateEmail(emailValue)) {
            emailError.style.display = 'block';
            emailInput.classList.add('invalid');
            return false;  // Invalid email address
        } else {
            emailError.style.display = 'none';
            emailInput.classList.remove('invalid');
        }
    }
    return true;  // Valid email address
}

// Simple email validation function
function validateEmail(email) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
}

// Handle successful AJAX response
function OrderHandleSuccess(data, form) {
    if (data.success) {
        openThankYouModal();
        form.reset();  // Reset the form after successful submission
    } else {
        openErrorModal();  // Handle failure case
    }
}


//::::::::::::: SEND HOUSE ORDER :::::::::::::://

function send_house_order(form_name) {
    const form = document.getElementById(form_name);

    const csrftoken = getCookie('csrftoken');

    if (!validatePhoneNumberHouseOrder(form)) {
        return false; 
    }

    const form_data = new FormData(form);

    // Perform AJAX request
    $.ajax({
        url: form.getAttribute('action'),
        type: 'POST',
        contentType: false,
        processData: false,
        data: form_data,
        dataType: 'json',
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data) {
            SendHouseHandleSuccess(data, form);  // Pass the form reference
        },
        error: handleError
    });

    return false;  // Prevent default form submission
}

// Validate phone number format send house order
function validatePhoneNumberHouseOrder(form) {
    const phoneInput = form.querySelector('input[name="phone"]');
    if (phoneInput) {
        const phoneValue = phoneInput.value;
        const pattern = /^(\+7)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        
        if (!pattern.test(phoneValue)) {
            phoneInput.classList.add('invalid');
            return false;  // Invalid phone number
        } else {
            phoneInput.classList.remove('invalid');
        }
    }
    return true;  // Valid phone number
}

// Handle successful AJAX response
function SendHouseHandleSuccess(data, form) {
    if (data.success) {
        form.reset();
        closeOrderPopup();
        openThankYouModal();
    } else {
        openErrorModal();
    }
}
//close popup send order house
function closeOrderPopup() {
    const orderPopup = document.querySelector(".popup.order");
    const orderOverlay = document.querySelector(".order-popup__overlay");
    orderPopup.classList.remove("show");
    orderOverlay.classList.remove("show");
    document.body.classList.remove("no-scroll");
}




//:::::::::::::: FAVORITES SETUP AJAX :::::::::::::://

// $(document).ready(function() {
//     $('#add-to-favorites').on('click', function(e) {
//         e.preventDefault(); // Empêcher le rechargement de la page

//         const houseId = $(this).data('house-id'); // Récupérer l'ID de la maison
        
//         // Envoyer une requête AJAX pour ajouter aux favoris
//         $.ajax({
//             url: '/add_to_favorites/',
//             type: 'POST',
//             data: {
//                 'house_id': houseId,
//                 'csrfmiddlewaretoken': getCookie('csrftoken') // Ajouter le token CSRF
//             },
//             success: function(response) {
//                 if (response.success) {
//                     console.log('Maison ajoutée aux favoris !');
//                     // loadFavorites(); // Charger les favoris après ajout
//                 } else {
//                     console.log('Erreur : ' + response.error);
//                 }
//             },
//             error: function(xhr, status, error) {
//                 console.error('Error:', xhr.responseText);
//                 console.log('Une erreur est survenue lors de l\'ajout aux favoris.');
//             }
//         });
//     });

    // Fonction pour charger et afficher les maisons favorites
    // function loadFavorites() {
    //     $.ajax({
    //         url: "get_favorites/",
    //         type: 'GET',
    //         success: function(data) {
    //             if (data.success) {
    //                 $('#favorites-list').html(data.favorites_html); // Mettre à jour la liste des favoris avec le HTML retourné
    //             }
    //         },
    //         error: function(xhr, status, error) {
    //             console.error('Error:', xhr.responseText);
    //         }
    //     });
    // }

    // // Initialiser le chargement des favoris au démarrage de la page
    // loadFavorites();

    // Fonction pour récupérer le cookie CSRF
    // function getCookie(name) {
    //     var cookieValue = null;
    //     if (document.cookie && document.cookie !== '') {
    //         var cookies = document.cookie.split(';');
    //         for (var i =0; i < cookies.length; i++) {
    //             var cookie = jQuery.trim(cookies[i]);
    //             if (cookie.substring(0, name.length +1) === (name + '=')) {
    //                 cookieValue = decodeURIComponent(cookie.substring(name.length +1));
    //                 break;
    //             }
    //         }
    //     }
    //     return cookieValue;
    // }

    // Événement pour supprimer un favori
    // $(document).on('click', '.remove-favorite', function(e) {
    //     e.preventDefault();
        
    //     const houseId = $(this).data('house-id');
        
    //     let favorites = getFavoritesFromCookie();
        
    //     favorites = favorites.filter(id => id !== houseId); // Retirer l'ID de la maison des favoris
    //     setFavoritesCookie(favorites); // Mettre à jour le cookie
        
    //     $(this).closest('.products-list__item').remove(); // Supprimer l'élément DOM correspondant
    //     alert('Maison supprimée des favoris !');
        
    //     updateFavoritesCount(); // Mettre à jour le compteur si nécessaire
    // });

    // function setFavoritesCookie(favorites) {
    //     document.cookie = "favorites=" + encodeURIComponent(JSON.stringify(favorites)) + "; path=/; max-age=31536000"; // Cookie valable pendant un an
    // }
// 



// function toggleFavorite(houseId) {
//     const action = document.querySelector(`#add-to-favorites[house-id="${houseId}"]`).classList.contains('favorited') ? 'remove' : 'add';

//     $.ajax({
//         url: '/manage_favorites/',
//         type: 'POST',
//         data: {
//             house_id: houseId,
//             action: action,
//             csrfmiddlewaretoken: getCookie('csrftoken'), // Assurez-vous d'inclure le token CSRF
//         },
//         success: function(data) {
//             if (data.success) {
//                 if (action === 'add') {
//                     document.querySelector(`#add-to-favorites[house-id="${houseId}"]`).classList.add('favorited');
//                 } else {
//                     document.querySelector(`#add-to-favorites[house-id="${houseId}"]`).classList.remove('favorited');
//                 }
//                 console.log(data.message);
//             } else {
//                 console.log(data.error);
//             }
//         },
//         error: function(xhr, status, error) {
//             console.error('Error:', xhr.responseText);
//         }
//     });
// }

// document.addEventListener("DOMContentLoaded", function() {
//     function toggleFavorite(houseId) {
//         const favoriteLink = document.querySelector(`#add-to-favorites[house-id="${houseId}"]`);
        
//         // Vérifiez si l'élément existe avant d'accéder à classList
//         if (!favoriteLink) {
//             console.error(`Element not found for house ID: ${houseId}`);
//             return;
//         }

//         const action = favoriteLink.classList.contains('favorited') ? 'remove' : 'add';

//         $.ajax({
//             url: "/manage-favorites/",
//             type: 'POST',
//             data: {
//                 house_id: houseId,
//                 action: action,
//                 csrfmiddlewaretoken: getCookie('csrftoken'), // Assurez-vous d'inclure le token CSRF
//             },
//             success: function(data) {
//                 if (data.success) {
//                     if (action === 'add') {
//                         favoriteLink.classList.add('favorited');
//                     } else {
//                         favoriteLink.classList.remove('favorited');
//                     }
//                     alert(data.message);
//                 } else {
//                     alert(data.error);
//                 }
//             },
//             error: function(xhr, status, error) {
//                 console.error('Error:', xhr.responseText);
//             }
//         });
//     }

//     // Ajoutez un gestionnaire d'événements pour chaque bouton "В избранное"
//     document.querySelectorAll('.favorite a#add-to-favorites').forEach(function(link) {
//         link.addEventListener('click', function() {
//             const houseId = this.getAttribute('house-id');
//             toggleFavorite(houseId);
//         });
//     });
// });

// Assurez-vous que le code est exécuté après le chargement du DOM



// document.addEventListener("DOMContentLoaded", function() {
//     // Définir la fonction toggleFavorite
//     window.toggleFavorite = function(houseId) {
//         console.log("House ID passed:", houseId); // Vérifiez que l'ID est correctement passé
        
//         if (!houseId) {
//             console.error('House ID is undefined');
//             return;
//         }

//         const favoriteLink = document.querySelector(`#add-to-favorites[house-id="${houseId}"]`);

//         if (!favoriteLink) {
//             console.error(`Element not found for house ID: ${houseId}`);
//             return;
//         }

//         const action = favoriteLink.classList.contains('saved') ? 'remove' : 'add';

//         $.ajax({
//             url: '/manage_favorites/',
//             type: 'POST',
//             data: {
//                 house_id: houseId,
//                 action: action,
//                 csrfmiddlewaretoken: getCookie('csrftoken'), // Assurez-vous d'inclure le token CSRF
//             },
//             success: function(data) {
//                 if (data.success) {
//                     if (action === 'add') {
//                         favoriteLink.classList.add('saved');
//                     } else {
//                         favoriteLink.classList.remove('saved');
//                     }
//                     alert(data.message);
//                 } else {
//                     alert(data.error);
//                 }
//             },
//             error: function(xhr, status, error) {
//                 console.error('Error:', xhr.responseText);
//             }
//         });
//     };

//     // Ajoutez un gestionnaire d'événements pour chaque bouton "В избранное"
//     document.querySelectorAll('.favorite a#add-to-favorites').forEach(function(link) {
//         link.addEventListener('click', function() {
//             const houseId = this.getAttribute('house-id');
//             toggleFavorite(houseId);
//         });
//     });
// });


// document.addEventListener("DOMContentLoaded", function () {
//     let favorites = document.querySelectorAll(".favorite");

//     favorites.forEach((favorite) => {
//         favorite.addEventListener("click", function (event) {
//             event.preventDefault();

//             const houseId = this.querySelector('a').getAttribute('house-id');
//             const isSaved = this.classList.toggle("saved"); // Ajoute ou retire la classe "saved"


//             if (!favorites) {
//                 console.error(`Element not found for house ID: ${houseId}`);
//                 return;
//             } else {
//                 console.log("House ID passed:", houseId); // Vérifiez que l'ID est correctement passé

//             }


//             // Déterminez l'action en fonction de l'état
//             const action = isSaved ? 'add' : 'remove';

//             // Envoi de la requête AJAX
//             $.ajax({
//                 url: '/manage_favorites/',
//                 type: 'POST',
//                 data: {
//                     house_id: houseId,
//                     action: action,
//                     csrfmiddlewaretoken: getCookie('csrftoken'), // Inclure le token CSRF
//                 },
//                 success: function (data) {
//                     if (data.success) {
//                         console.log(data.message);
//                     } else {
//                         console.log(data.error);
//                     }
//                 },
//                 error: function (xhr, status, error) {
//                     console.error('Error:', xhr.responseText);
//                 }
//             });
//         });
//     });
// });


// document.addEventListener("DOMContentLoaded", function () {
//     let favorites = document.querySelectorAll(".favorite");

//     favorites.forEach((favorite) => {
//         favorite.addEventListener("click", function (event) {
//             event.preventDefault();

//             // Récupérer l'ID de la maison
//             const houseId = this.querySelector('a').getAttribute('house-id');
//             const isSaved = this.classList.toggle("saved"); // Ajoute ou retire la classe "saved"

//             // Vérifiez si houseId est défini
//             if (!houseId) {
//                 console.error(`House ID not found.`);
//                 return;
//             } else {
//                 console.log("House ID passed:", houseId); // Vérifiez que l'ID est correctement passé
//             }

//             // Déterminez l'action en fonction de l'état
//             const action = isSaved ? 'add' : 'remove';

//             // Envoi de la requête AJAX
//             $.ajax({
//                 url: '/manage_favorites/',
//                 type: 'POST',
//                 data: {
//                     house_id: houseId,
//                     action: action,
//                     csrfmiddlewaretoken: getCookie('csrftoken'), // Inclure le token CSRF
//                 },
//                 success: function (data) {
//                     if (data.success) {
//                         console.log(data.message);
//                     } else {
//                         console.log(data.error);
//                     }
//                 },
//                 error: function (xhr, status, error) {
//                     console.error('Error:', xhr.responseText);
//                 }
//             });
//         });
//     });
// });


// document.addEventListener("DOMContentLoaded", function () {
//     let favorites = document.querySelectorAll(".favorite");
    

//     favorites.forEach((favorite) => {
//         favorite.addEventListener("click", function (event) {
//             event.preventDefault();

//             // Récupérer l'ID de la maison
//             const houseId = this.querySelector('a').getAttribute('house-id');
//             const isSaved = this.classList.toggle("saved"); // Ajoute ou retire la classe "saved"

//             // Vérifiez si houseId est défini
//             if (!houseId) {
//                 console.error(`House ID not found.`);
//                 return;
//             } else {
//                 console.log("House ID passed:", houseId); // Vérifiez que l'ID est correctement passé
//             }

//             // Déterminez l'action en fonction de l'état
//             const action = isSaved ? 'add' : 'remove';
//             console.log("Action determined:", action); // Log de l'action déterminée

//             // Envoi de la requête AJAX
//             $.ajax({
//                 url: '/manage_favorites/',
//                 type: 'POST',
//                 data: {
//                     house_id: houseId,
//                     action: action,
//                     csrfmiddlewaretoken: getCookie('csrftoken'),
//                 },
//                 beforeSend: function() {
//                     console.log("Sending AJAX request to /manage_favorites/ with data:", {
//                         house_id: houseId,
//                         action: action,
//                     }); // Log avant l'envoi de la requête
//                 },
//                 success: function (data) {
//                     console.log("Response from server:", data); // Log de la réponse du serveur
//                     if (data.success) {
//                         console.log(data.message);
//                     } else {
//                         console.log(data.error);
//                     }
//                 },
//                 error: function (xhr, status, error) {
//                     console.error('Error:', xhr.responseText); // Log d'erreur
//                 }
//             });
//         });
//     });
// });

// document.addEventListener("DOMContentLoaded", function () {
//     let favorites = document.querySelectorAll(".favorite");

//     favorites.forEach((favorite) => {
//         favorite.addEventListener("click", function (event) {
//             event.preventDefault();

//             // Récupérer l'ID de la maison
//             const houseId = this.querySelector('a').getAttribute('house-id');
//             const isSaved = this.classList.toggle("saved"); // Ajoute ou retire la classe "saved"

//             // Vérifiez si houseId est défini
//             if (!houseId) {
//                 console.error(`House ID not found.`);
//                 return;
//             } else {
//                 console.log("House ID passed:", houseId); // Vérifiez que l'ID est correctement passé
//             }

//             // Déterminez l'action en fonction de l'état
//             const action = isSaved ? 'add' : 'remove';
//             console.log("Action determined:", action); // Log de l'action déterminée

//             // Récupérer l'URL depuis data-url
//             var url = this.querySelector('a').getAttribute('data-url');
//             console.log("URL to send:", url); // Log de l'URL

//             // Créer un objet FormData
//             const formData = new FormData();
//             formData.append('house_id', houseId);
//             formData.append('action', action);
//             formData.append('csrfmiddlewaretoken', getCookie('csrftoken')); // Inclure le token CSRF

//             // Envoi de la requête AJAX avec fetch
//             fetch(url, {
//                 method: 'POST',
//                 body: formData,
//                 headers: {
//                     'X-CSRFToken': getCookie('csrftoken') // Inclure le token CSRF
//                 }
//             })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 console.log("Response from server:", data); // Log de la réponse du serveur
//                 if (data.success) {
//                     console.log(data.message);
//                 } else {
//                     console.log(data.error);
//                 }
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//             });
//         });
//     });
// });



document.addEventListener("DOMContentLoaded", function () {
    FavoriteButtons()
    checkFavoriteStatus();
});



function FavoriteButtons() {
    let favorites = document.querySelectorAll(".favorite");

    favorites.forEach((favorite) => {
        favorite.addEventListener("click", function (event) {
            event.preventDefault();

            // Récupérer l'ID de la maison
            const houseId = this.querySelector('a').getAttribute('house-id');
            const isSaved = this.classList.toggle("saved"); // Ajoute ou retire la classe "saved"

            // Vérifiez si houseId est défini
            if (!houseId) {
                console.error(`House ID not found.`);
                return;
            } else {
                console.log("House ID passed:", houseId); // Vérifiez que l'ID est correctement passé
            }

            // Déterminez l'action en fonction de l'état
            const action = isSaved ? 'add' : 'remove';
            console.log("Action determined:", action); // Log de l'action déterminée

            // Récupérer l'URL depuis data-url
            var url = this.querySelector('a').getAttribute('data-url');
            console.log("URL to send:", url); // Log de l'URL

            // Créer un objet FormData
            const formData = new FormData();
            formData.append('house_id', houseId);
            formData.append('action', action);
            formData.append('csrfmiddlewaretoken', getCookie('csrftoken')); // Inclure le token CSRF

            // Envoi de la requête AJAX avec fetch
            fetch(url, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCookie('csrftoken') // Inclure le token CSRF
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log("Response from server:", data); // Log de la réponse du serveur
                if (data.success) {
                    // console.log(data.message);
                    // updateFavoriteCount(); // Mettre à jour le compteur si nécessaire
                    if (action === 'remove') {
                        // Retirer l'élément de la liste des favoris du DOM et ajouter le nouveau contenu
                        const productElement = document.getElementById(`product${houseId}`);
                        if (productElement) {
                            productElement.remove(); // Supprimer l'élément existant
                        }
    
                        // // Ajouter le nouveau contenu du template partiel si nécessaire
                        const productsList = document.querySelector('.products-list');
                        productsList.insertAdjacentHTML('beforeend', data.favorites_list); // Ajouter le nouveau contenu
                        // Mettre à jour la liste avec le contenu renvoyé par le serveur
                        // const productsList = document.querySelector('.products-list');
                        // productsList.innerHTML = data.favorites_list; // Remplacer par le nouveau contenu

                        // // Si tous les favoris sont retirés, afficher un message vide
                        // if (!data.is_favorite) {
                        //     productsList.innerHTML += data.favorites_list;  // Ajoute le message vide si nécessaire
                        // }
                    }
                    
                    updateFavoriteCount(); // Mettre à jour le compteur si nécessaire
                } else {
                    console.log(data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });
}



// Function to check the status of favorites on page load
function checkFavoriteStatus() {
    fetch('/izbrannoe/status_favorites/') // Replace with your FavoritesStatusView URL
        .then(response => response.json())
        .then(data => updateFavoriteStatus(data))
        .catch(error => console.error('Error:', error));
}

// Function to update the favorite status based on server data
function updateFavoriteStatus(data) {
    updateFavoriteCount(); // Update the favorite count display

    data.favorites.forEach(house => {
        const favoriteLink = document.querySelector(`a[house-id="${house.id}"]`);
        
        if (favoriteLink) {
            const favoriteDiv = favoriteLink.parentNode; // Access the parent div
            favoriteDiv.classList.add('saved'); // Add 'saved' class if it's a favorite
        }
    });
}


// function updateFavoriteCount() {
//     fetch('/izbrannoe/status_favorites/') // Remplacez par l'URL de votre vue FavoritesStatusView
//         .then(response => response.json())
//         .then(data => {
//             document.querySelector(".header__block-favorites").setAttribute("data-before", data.count);
//         })
//         .catch(error => console.error('Error:', error));
// }

function updateFavoriteCount() {
    fetch('/izbrannoe/status_favorites/') // Remplacez par l'URL de votre vue FavoritesStatusView
        .then(response => response.json())
        .then(data => {
            // Vérifiez si le compteur est supérieur à zéro
            if (data.count > 0) {
                document.querySelector(".header__block-favorites").setAttribute("data-before", data.count);
            } else {
                // Si le compteur est zéro, vous pouvez soit ne rien faire, soit définir une valeur vide
                document.querySelector(".header__block-favorites").setAttribute("data-before", ""); // Ou ne rien faire
            }
        })
        .catch(error => console.error('Error:', error));
}

