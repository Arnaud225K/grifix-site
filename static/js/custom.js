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

