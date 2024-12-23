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
        const houseId = document.querySelector('.house__info').getAttribute('data-house-slug');
        
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
                document.querySelector('.price__sum').textContent = 'площадь дома не выбрана';
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


//:::::::AJAX REQUEST ON SITE::::::::::::::::::::::

//::::::::::: COMMON AJAX FUNCTION ::::::::::::::::
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

//::::::::::: CHECK FORM VALIDATION PHONE AND EMAIL:::::::::::::::: 
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

//::::::::::::::::::: SEND ORDER GLOBAL FORM :::::::::::::
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


//::::::::::::: SEND HOUSE ORDER ::::::::::::::

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




// //:::::::::::::: FAVORITES SETUP AJAX ::::::::::::::

// Initialize filter state object
const filterState = {
    material: [],
    floor: [],
    bedroom: [],
    bathroom: [],
    dop_param: [],
    priceMin: null,
    priceMax: null
};

// Track the current page for pagination
// let currentPage = 1; // Start from page 1

// Function to attach event listener for "Показать" button
// function attachShowProductsListener() {
//     const buttonShowProd = document.querySelector('.show-products-filter');
//     if (buttonShowProd) { 
//         buttonShowProd.addEventListener('click', filterHouses);
//     }
// }

// function attachShowProductsListener() {
//     const buttonShowProd = document.querySelector('.show-products-filter');
//     const filterPopup = document.querySelector('.filters-mobile'); // Sélectionner le popup

//     if (buttonShowProd) { 
//         buttonShowProd.addEventListener('click', function() {
//             filterHouses(); // Appeler la fonction pour filtrer les maisons
//         });
//     }
// }

function attachShowProductsListener() {
    // Sélectionner les boutons pour desktop et mobile
    const buttonShowProdMobile = document.querySelector('.show-products-filter-mobile');
    const buttonShowProdDesktop = document.querySelector('.show-products-filter');
    const filterPopup = document.querySelector('.filters-mobile'); // Sélectionner le popup

    // Fonction pour gérer le clic sur le bouton de filtrage
    function handleShowProducts() {
        filterHouses(); // Appeler la fonction pour filtrer les maisons

        // Fermer le popup si c'est sur mobile
        if (filterPopup) {
            filterPopup.classList.remove('show'); // Retirer la classe 'show' pour masquer le popup
        }
    }

    // // Ajouter un gestionnaire d'événements pour le bouton mobile
    // if (buttonShowProdMobile) {
    //     buttonShowProdMobile.addEventListener('click', handleShowProducts);
    // }
    // Vérifiez si l'utilisateur est sur mobile ou desktop
    const isMobile = detectDevice();
    
    if (isMobile) {
        // Ajouter un gestionnaire d'événements pour le bouton mobile
        if (buttonShowProdMobile) {
            buttonShowProdMobile.addEventListener('click', handleShowProducts);
        }
    } else {
        // Ajouter un gestionnaire d'événements pour le bouton desktop
        if (buttonShowProdDesktop) {
            buttonShowProdDesktop.addEventListener('click', handleShowProducts);
        }
    }

    // // Ajouter un gestionnaire d'événements pour le bouton desktop
    // if (buttonShowProdDesktop) {
    //     buttonShowProdDesktop.addEventListener('click', handleShowProducts);
    // }
}

// Function to attach event listener for "Сбросить" button
// function attachResetFiltersListener() {
//     const resetButton = document.getElementById('clear-filters');
//     if (resetButton) {
//         resetButton.addEventListener('click', resetFilters);
//     }
// }
function attachResetFiltersListener() {
    const resetButton = document.getElementById('clear-filters');
    const resetButtonMobile = document.getElementById('clear-filters-mobile');

    // Vérifiez si l'utilisateur est sur mobile ou desktop
    // const isMobile = window.innerWidth <= 768; // Ajustez cette valeur selon vos besoins
    
    const isMobile = detectDevice();

    if (isMobile) {
        // Ajouter un gestionnaire d'événements pour le bouton mobile
        if (resetButtonMobile) {
            resetButtonMobile.addEventListener('click', resetFilters);
        }
    } else {
        // Ajouter un gestionnaire d'événements pour le bouton desktop
        if (resetButton) {
            resetButton.addEventListener('click', resetFilters);
        }
    }

}


// Function to reset all filters
function resetFilters() {
    // Clear all active classes from material buttons
    const materialButtons = document.querySelectorAll('.filters__characteristics-options .filter-button[data-name="material"]');
    materialButtons.forEach(button => {
        button.classList.remove('active'); // Remove active class from all buttons
    });

    // Deselect all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false; // Uncheck all checkboxes
    });

    // Clear price inputs
    document.getElementById('price-min').value = '';
    document.getElementById('price-max').value = '';
    document.querySelector(".price-min").value='',
    document.querySelector(".price-max").value='';

    // Clear filter state object
    filterState.material = [];
    filterState.floor = [];
    filterState.bedroom = [];
    filterState.bathroom = [];
    filterState.dop_param = [];

    // Reset price state
    filterState.priceMin = null;
    filterState.priceMax = null;
    

    // Refresh the product list without any filters applied
    filterHouses();
}

// Function to handle clicking on "Все" button for materials
function handleAllMaterialsClick() {
    const allButton = document.querySelector('.filter-button[data-value=""]'); // Assuming "Все" has an empty value
    if (allButton) {
        allButton.addEventListener('click', function () {
            // Mark "Все" as active
            allButton.classList.add('active');

            // Deselect all other material buttons
            const materialButtons = document.querySelectorAll('.filters__characteristics-options .filter-button[data-name="material"]');
            materialButtons.forEach(button => {
                if (button !== allButton) {
                    button.classList.remove('active'); // Remove active class from other buttons
                }
            });

            // Clear filter state for materials but do not trigger AJAX yet
            filterState.material = []; // Clear stored values
        });
    }
}

// Function to handle sorting by price
function handleSortByPrice() {
    const sortButton = document.querySelector('.sort-img');
    const currentSortType = sortButton.getAttribute('data-sort-type') || '2'; // Default is descending

    // Toggle sort type between ascending (1) and descending (2)
    const newSortType = currentSortType === '1' ? '2' : '1';
    sortButton.setAttribute('data-sort-type', newSortType); // Update attribute

    // console.log("Sorting by price:", newSortType); // Debugging log

    // Call filterHouses with the new sort type
    filterHouses(newSortType, 1);
}

function UpdateSortByPrice() {
    const sortHouse = document.querySelector('.sort-img');
    if (sortHouse)
    {
        sortHouse.addEventListener('click', handleSortByPrice);
    }
}

// Function to gather selected filters and make AJAX call
function filterHouses(sortType, pageNumber = 1) {
    const formData = new FormData();

    // Gather active material filters
    const materials = Array.from(document.querySelectorAll('.filters__characteristics-options .filter-button.active'))
        .map(button => button.getAttribute('data-value'));

    // Check if "Все" is selected (assuming it has an empty data-value)
    const allMaterialsButton = document.querySelector('.filter-button[data-value=""]');
    if (allMaterialsButton && allMaterialsButton.classList.contains('active')) {
        materials.length = 0; // Clear materials array to indicate no specific filter
    }

    const floors = Array.from(document.querySelectorAll('input[name="floor"]:checked'))
        .map(input => input.value);

    const bedrooms = Array.from(document.querySelectorAll('input[name="bedroom"]:checked'))
        .map(input => input.value);

    const bathrooms = Array.from(document.querySelectorAll('input[name="bathroom"]:checked'))
        .map(input => input.value);

    const dopParams = Array.from(document.querySelectorAll('input[name="dop_param"]:checked'))
        .map(input => input.value);

   // Get price range values from inputs
   const priceMinValue = parseFloat(document.getElementById('price-min').value) || null;
   const priceMaxValue = parseFloat(document.getElementById('price-max').value) || null;
    
    // Append data to FormData object
    formData.append('menu_slug', 'katalog-domov');  // Pass the current menu slug
    materials.forEach(material => formData.append('material', material));
    floors.forEach(floor => formData.append('floor', floor));
    bedrooms.forEach(bedroom => formData.append('bedroom', bedroom));
    bathrooms.forEach(bathroom => formData.append('bathroom', bathroom));
    dopParams.forEach(dopParam => formData.append('dop_param', dopParam));

    // Append price range to FormData object if provided
    if (priceMinValue !== null) {
        formData.append('price_min', priceMinValue);
        filterState.priceMin = priceMinValue;  // Update state with min price value 
    }
    if (priceMaxValue !== null) {
        formData.append('price_max', priceMaxValue);
        filterState.priceMax = priceMaxValue;  // Update state with max price value 
    }

    // Append sort type to FormData object
    if (sortType) {
        formData.append('sort_type', sortType);
    }

    // Append page number to FormData object
    formData.append('page', pageNumber);


    fetch('/get_filter_url', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': getCookie('csrftoken') // Include CSRF token for security
        },
    })
    .then(response => response.json())
    .then(data => {
        // Update the URL and house listing
        history.pushState(null, '', data.url);  // Update the browser URL
        // document.querySelector('.products-list').innerHTML = data.html_block;  // Update the house listing
        updateProductList(data, pageNumber)

        // Deactivate "Все" after showing results
        if (allMaterialsButton) {
            allMaterialsButton.classList.remove('active'); // Remove active state from "Все"
        }

        checkFavoriteStatus();  // Update favorite status display
        attachFavoritesFunctionality();  // Reattach favorites functionality after updating product list
    })
    .catch(error => console.error('Error:', error));
}


// Function to update product list based on filter selection
function updateProductList(data, pageNumber) {
    const productListblock = document.querySelector('.products-list');

    if (pageNumber === 1) {
        productListblock.innerHTML = data.html_block;
    } else {
        productListblock.insertAdjacentHTML('beforeend', data.html_block);
    }

    const loadMoreButton = document.getElementById('show-more-houses');
    loadMoreButton.style.display = data.has_next ? 'flex' : 'none';
    loadMoreButton.dataset.page = data.current_page;
}

// Function to gather selected filters and return display text
function Q(dropdown) {
   let checkedInputs = dropdown.querySelectorAll('input[type="checkbox"]:checked');
   let selectedValues = Array.from(checkedInputs)
       .map(input => {
           let label = input.closest('label');
           return label ? label.textContent.trim() : input.value;
       })
       .join(", ");

   // Limit display text length
   if (selectedValues.length > 35) {
       selectedValues = selectedValues.substring(0, 35) + "...";
   }
   return selectedValues;
}

// Function to update the display text of a dropdown
function Z(dropdown, displayText) {
   let span = dropdown.querySelector("span");
   if (span) {
        span.textContent = displayText.length > 0 ? displayText : "Не важно"; // Default text if no selection 
   }
}

// Function to update dropdown displays based on checked state
function updateDropdownDisplays() {
   document.querySelectorAll('.dropdown__block').forEach(dropdown => {
       Z(dropdown, Q(dropdown));  // Call existing functions to update display text 
   });
}

// Function to activate filters based on JSON data from script tag
// function initializeButtonState() {
//    const selectedFiltersElement = document.getElementById('selected-filters');
//    if (!selectedFiltersElement) return;

//    let selectedFilters;
//    try {
//        const filtersText = selectedFiltersElement.textContent.trim();
//        if (filtersText) {
//            selectedFilters = JSON.parse(filtersText);
//        } else {
//         //    console.warn("No selected filters found in the script tag.");
//            return; // Exit if no filters are found 
//        }
//    } catch (error) {
//        console.error("Error parsing selected filters:", error);
//        return; // Exit if there's an error in parsing 
//    }

//    // Activate material buttons and check checkboxes as before.
//    if (selectedFilters.mat) {
//        selectedFilters.mat.forEach(material => {
//            const button = document.querySelector(`.filter-button[data-name="material"][data-value="${material}"]`);
//            if (button) {
//                button.classList.add('active'); // Mark button as active 
//            }
//        });
//    }

//    // Check floor checkboxes, bedroom checkboxes, etc.
//    if (selectedFilters.etazh) {
//        selectedFilters.etazh.forEach(floor => {
//            const checkbox = document.querySelector(`input[name="floor"][value="${floor}"]`);
//            if (checkbox) checkbox.checked = true; // Check the checkbox 
//        });
//    }

//    if (selectedFilters.spal) {
//        selectedFilters.spal.forEach(bedroom => {
//            const checkbox = document.querySelector(`input[name="bedroom"][value="${bedroom}"]`);
//            if (checkbox) checkbox.checked = true; // Check the checkbox 
//        });
//    }

//    if (selectedFilters.sanuzl) {
//        selectedFilters.sanuzl.forEach(bathroom => {
//            const checkbox = document.querySelector(`input[name="bathroom"][value="${bathroom}"]`);
//            if (checkbox) checkbox.checked = true; // Check the checkbox 
//        });
//    }

//    if (selectedFilters.dop) {
//        selectedFilters.dop.forEach(dopParam => {
//            const checkbox = document.querySelector(`input[name="dop_param"][value="${dopParam}"]`);
//            if (checkbox) checkbox.checked = true; // Check the checkbox 
//        });
//    }

//    filterHouses();
// }


function initializeButtonState() {
    const selectedFiltersElement = document.getElementById('selected-filters');
    if (!selectedFiltersElement) return;

    let selectedFilters;
    try {
        const filtersText = selectedFiltersElement.textContent.trim();
        if (filtersText) {
            selectedFilters = JSON.parse(filtersText);
        } else {
            return; // Exit if no filters are found 
        }
    } catch (error) {
        console.error("Error parsing selected filters:", error);
        return; // Exit if there's an error in parsing 
    }

    // Synchroniser les filtres pour le desktop
    // synchronizeDesktopFilters(selectedFilters);

    // // Synchroniser les filtres pour le mobile
    // synchronizeMobileFilters(selectedFilters);

    // // Vérifiez si l'utilisateur est sur mobile ou desktop
    // const isMobile = window.innerWidth <= 768; // Ajustez cette valeur selon vos besoins
    const isMobile = detectDevice();

    if (isMobile) {
        // Synchroniser les filtres pour le mobile
        synchronizeMobileFilters(selectedFilters);
    } else {
        // Synchroniser les filtres pour le desktop
        synchronizeDesktopFilters(selectedFilters);
    }
    

    // Appliquer les filtres aux maisons
    filterHouses(); // Call to filter houses based on selected filters
}

// Fonction pour synchroniser les filtres dans la version desktop
function synchronizeDesktopFilters(selectedFilters) {
    if (selectedFilters.mat) {
        selectedFilters.mat.forEach(material => {
            const button = document.querySelector(`.filters .filter-button[data-name="material"][data-value="${material}"]`);
            if (button) {
                button.classList.add('active'); // Marquer le bouton comme actif 
            }
        });
    }

    if (selectedFilters.etazh) {
        selectedFilters.etazh.forEach(floor => {
            const checkbox = document.querySelector(`.filters input[name="floor"][value="${floor}"]`);
            if (checkbox) checkbox.checked = true; // Cocher la case 
        });
    }

    if (selectedFilters.spal) {
        selectedFilters.spal.forEach(bedroom => {
            const checkbox = document.querySelector(`.filters input[name="bedroom"][value="${bedroom}"]`);
            if (checkbox) checkbox.checked = true; // Cocher la case 
        });
    }

    if (selectedFilters.sanuzl) {
        selectedFilters.sanuzl.forEach(bathroom => {
            const checkbox = document.querySelector(`.filters input[name="bathroom"][value="${bathroom}"]`);
            if (checkbox) checkbox.checked = true; // Cocher la case 
        });
    }

    if (selectedFilters.dop) {
        selectedFilters.dop.forEach(dopParam => {
            const checkbox = document.querySelector(`.filters input[name="dop_param"][value="${dopParam}"]`);
            if (checkbox) checkbox.checked = true; // Cocher la case 
        });
    }
}

// Fonction pour synchroniser les filtres dans le popup mobile
function synchronizeMobileFilters(selectedFilters) {
    if (selectedFilters.mat) {
        selectedFilters.mat.forEach(material => {
            const button = document.querySelector(`.filters-mobile .filter-button[data-name="material"][data-value="${material}"]`);
            if (button) {
                button.classList.add('active'); // Marquer le bouton comme actif dans le mobile
            }
        });
    }

    if (selectedFilters.etazh) {
        selectedFilters.etazh.forEach(floor => {
            const checkbox = document.querySelector(`.filters-mobile input[name="floor"][value="${floor}"]`);
            if (checkbox) checkbox.checked = true; // Cocher la case dans le mobile
        });
    }

    if (selectedFilters.spal) {
        selectedFilters.spal.forEach(bedroom => {
            const checkbox = document.querySelector(`.filters-mobile input[name="bedroom"][value="${bedroom}"]`);
            if (checkbox) checkbox.checked = true; // Cocher la case dans le mobile
        });
    }

    if (selectedFilters.sanuzl) {
        selectedFilters.sanuzl.forEach(bathroom => {
            const checkbox = document.querySelector(`.filters-mobile input[name="bathroom"][value="${bathroom}"]`);
            if (checkbox) checkbox.checked = true; // Cocher la case dans le mobile
        });
    }

    if (selectedFilters.dop) {
        selectedFilters.dop.forEach(dopParam => {
            const checkbox = document.querySelector(`.filters-mobile input[name="dop_param"][value="${dopParam}"]`);
            if (checkbox) checkbox.checked = true; // Cocher la case dans le mobile
        });
    }
}


// Function to attach event listeners for favorite buttons
function attachFavoritesFunctionality() { 
   const favoriteButtons = document.querySelectorAll('.favorite');  // Adjust selector as needed 
   favoriteButtons.forEach(button => { 
       button.addEventListener('click', function(event) { 
           event.preventDefault();  // Prevent default link behavior 

           const houseId = this.querySelector('a').getAttribute('house-slug');  // Get house ID from attribute 

           const isSaved = this.classList.toggle("saved");  // Toggle saved class 

           if (!houseId) { 
            //    console.error(`House ID not found.`); 
               return; 
           } else { 
            //    console.log("House ID passed:", houseId); 
           } 

           const action = isSaved ? 'add' : 'remove';  // Determine action based on state 

           var url = this.querySelector('a').getAttribute('data-url');  // Get URL from data attribute 

           const formData = new FormData(); 
           formData.append('house_id', houseId); 
           formData.append('action', action); 
           formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));  // Include CSRF token 
          

           fetch(url, { method: 'POST', body: formData }) 
               .then(response => response.json()) 
               .then(data => { 
                   if (data.success) {
                        const productsList = document.querySelector('.products-list-favorite');
                        if (productsList) {
                            productsList.innerHTML = data.favorites_list; 
                        }
                       updateFavoriteCount();  // Update favorite count display  
                       checkFavoriteStatus();   // Check favorite status again  
                   } else { 
                       console.log(data.error);  
                   }  
               })  
               .catch(error => console.error('Error:', error));  
       });  
   });  
}


// Function to check the status of favorites on page load 
function checkFavoriteStatus() { 
   fetch('/izbrannoe/status_favorites/')  // Replace with your FavoritesStatusView URL  
       .then(response => response.json())  
       .then(data => updateFavoriteStatus(data))  
       .catch(error => console.error('Error:', error));  
}

// Function to update the favorite status based on server data  
function updateFavoriteStatus(data) {  
   updateFavoriteCount();  // Update the favorite count display  

   data.favorites.forEach(house => {  
       const favoriteLink = document.querySelector(`a[house-slug="${house.slug}"]`);  
       if (favoriteLink) {  
           const favoriteDiv = favoriteLink.parentNode;  // Access the parent div  
           favoriteDiv.classList.add('saved');  // Add 'saved' class if it's a favorite  
       }  
   });  
}

// Function to update favorite count display  
function updateFavoriteCount() {  
   fetch('/izbrannoe/status_favorites/')  // Replace with your FavoritesStatusView URL  
       .then(response => response.json())  
       .then(data => {  
           if (data.count > 0) {  
               document.querySelector(".header__block-favorites").setAttribute("data-before", data.count);  
           } else {  
               document.querySelector(".header__block-favorites").setAttribute("data-before", "");  
           }  
       })  
       .catch(error => console.error('Error:', error));  
}


function showMoreHouses() {
    // Load more products on click
    const showMoreButton = document.getElementById('show-more-houses');    
    if (showMoreButton) { 
        showMoreButton.addEventListener('click', function () {
            const nextPage = parseInt(showMoreButton.dataset.page) + 1; // Increment page number from data attribute
            filterHouses(null, nextPage); 
          });
    }
}

// function closeFilterPopup() {
//     const filterPopup = document.querySelector(".filters-mobile");
//     if (filterPopup) {
//         filterPopup.classList.remove("show"); // Retirer la classe 'show' pour masquer le popup
//     }
// }

function detectDevice() {
    const isMobileWidth = window.innerWidth <= 768; // Vérification de la largeur
    const isMobileUserAgent = /Mobi|Android|iPhone/i.test(navigator.userAgent); // Vérification de l'agent utilisateur

    return isMobileWidth || isMobileUserAgent; // Retourne vrai si l'un ou l'autre est vrai
}


// Event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
    initializeButtonState();
    handleAllMaterialsClick();
    updateDropdownDisplays();
    attachShowProductsListener();
    attachFavoritesFunctionality();
    checkFavoriteStatus(); // Check favorite status on page load
    attachResetFiltersListener(); // Attach listener for reset button
    // UpdateSortByPrice();
    showMoreHouses();
});


//FAVORIS SHOW MORE 
// Function to show more favorites when "Показать еще" is clicked
function showMoreFavorites() {
    const showMoreButton = document.getElementById('show-more-favoris');
    
    if (showMoreButton) {
        const nextPage = parseInt(showMoreButton.dataset.page) + 1; // Increment page number from data attribute

        // Load more favorites based on the updated page number
        loadMoreFavorites(nextPage);
        
        // Update the data-page attribute with the new value
        showMoreButton.dataset.page = nextPage; 
    }
}

// Function to load more favorites based on the current page
function loadMoreFavorites(pageNumber) {
    const formData = new FormData();
    formData.append('fpage', pageNumber); // Append current page number to FormData object

    fetch('/izbrannoe/get_favorites/', { // Adjust this URL to your actual endpoint for favorites pagination
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': getCookie('csrftoken') // Include CSRF token for security
        },
    })
    .then(response => response.json())
    .then(data => {
        const productListBlock = document.querySelector('.products-list-favorite');

        // Append new content for subsequent loads or replace for first load
        if (pageNumber === 1) {
            productListBlock.innerHTML = data.html_favoris_page; // Replace content for first load
        } else {
            productListBlock.insertAdjacentHTML('beforeend', data.html_favoris_page); // Append new content for subsequent loads
        }

        const loadMoreButton = document.getElementById('show-more-favoris');
        
        // Show or hide button based on availability of more favorites
        loadMoreButton.style.display = data.has_next ? 'flex' : 'none'; 
    })
    .catch(error => console.error('Error:', error));
}

// Attach event listener for "Показать еще" button click at DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function () {
    const showMoreButton = document.getElementById('show-more-favoris');
    if (showMoreButton) {
        showMoreButton.addEventListener('click', showMoreFavorites);
    }
});




// document.addEventListener("DOMContentLoaded", function () {
//     const mainImage = document.querySelector(".house__images-main img");
//     const overlayThumb = document.querySelector(".thumb.overlay");
//     const imageList = document.querySelector(".house__images-list");

//     // Écoutez le clic sur l'image d'overlay pour charger plus d'images
//     if (overlayThumb) {
//         overlayThumb.addEventListener("click", function () {
//             // Supprimer l'image d'overlay
//             overlayThumb.parentElement.removeChild(overlayThumb);
    
//             // Afficher les nouvelles images
//             const additionalImages = [
//                 "{% static 'img/images/extra1.webp' %}",
//                 "{% static 'img/images/extra2.webp' %}",
//                 "{% static 'img/images/extra3.webp' %}",
//                 "{% static 'img/images/extra4.webp' %}",
//                 "{% static 'img/images/extra5.webp' %}"
//             ];
    
//             additionalImages.forEach(src => {
//                 const newThumb = document.createElement("div");
//                 newThumb.classList.add("thumb");
//                 newThumb.innerHTML = `<img src="${src}" alt="">`;
                
//                 // Changer l'image principale au clic
//                 newThumb.addEventListener("click", function () {
//                     mainImage.src = src; // Changer l'image principale au clic
//                 });
    
//                 imageList.appendChild(newThumb);
//             });
    
//             // Appliquer l'effet de diaporama
//             updateImageDisplay();
//         });
//     }
    

//     // Ajoutez des événements de clic aux autres vignettes existantes
//     const thumbs = document.querySelectorAll(".house__images-list .thumb img");
//     thumbs.forEach(thumb => {
//         thumb.addEventListener("click", function () {
//             mainImage.src = this.src; // Changer l'image principale au clic
//         });
//     });

//     function updateImageDisplay() {
//         // Optionnel : Vous pouvez ajouter une logique ici si nécessaire
//         // Ajustez la largeur des vignettes si nécessaire
//         const thumbsList = document.querySelectorAll(".house__images-list .thumb");
        
//         thumbsList.forEach(thumb => {
//             thumb.style.minWidth = "179px"; // Assurez-vous que chaque vignette a la même largeur
//         });
        
//         // Si vous avez besoin de faire défiler les images, vous pouvez ajouter une logique ici.
//         // Par exemple, vous pouvez utiliser `scrollLeft` pour faire défiler automatiquement.
        
//         imageList.scrollLeft += 179; // Fait défiler vers la droite après ajout
//     }
// });


// document.addEventListener("DOMContentLoaded", function () {
//     const mainImage = document.querySelector(".house__images-main img");
//     const overlayThumb = document.querySelector(".thumb.overlay");
//     const imageList = document.querySelector(".house__images-list");

//     if (overlayThumb) { 
//         // Écoutez le clic sur l'image d'overlay pour charger plus d'images
//         overlayThumb.addEventListener("click", function () {
//             // Supprimer l'image d'overlay
//             overlayThumb.parentElement.removeChild(overlayThumb);

//             // Afficher les nouvelles images dynamiquement
//             const additionalImages = [
//                 "{{ produit.image_4.url }}",
//                 "{{ produit.image_5.url }}",
//                 "{{ produit.image_6.url }}"
//             ].filter(Boolean); // Ne garder que les URLs valides

//             additionalImages.forEach(src => {
//                 const newThumb = document.createElement("div");
//                 newThumb.classList.add("thumb");
//                 newThumb.innerHTML = `<img src="${src}" alt="">`;
                
//                 // Changer l'image principale au clic
//                 newThumb.addEventListener("click", function () {
//                     mainImage.src = src; // Changer l'image principale au clic
//                 });

//                 imageList.appendChild(newThumb);
//             });

//             // Mettez à jour l'affichage pour s'assurer que les nouvelles images sont visibles
//             updateImageDisplay();
//         });
//     }

//     // Ajoutez des événements de clic aux autres vignettes existantes
//     const thumbs = document.querySelectorAll(".house__images-list .thumb img");
//     thumbs.forEach(thumb => {
//         thumb.addEventListener("click", function () {
//             mainImage.src = this.src; // Changer l'image principale au clic
//         });
//     });

//     function updateImageDisplay() {
//         const thumbsList = document.querySelectorAll(".house__images-list .thumb");
        
//         thumbsList.forEach(thumb => {
//             thumb.style.minWidth = "179px"; // Assurez-vous que chaque vignette a la même largeur
//         });
        
//         imageList.scrollLeft += 179; // Fait défiler vers la droite après ajout (si nécessaire)
//     }
// });


// document.addEventListener("DOMContentLoaded", function () {
//     const mainImage = document.querySelector(".house__images-main img");
//     const overlayThumb = document.querySelector(".thumb.overlay");
//     const imageList = document.querySelector(".house__images-list");

//     if (overlayThumb) {
//         // Écoutez le clic sur l'image d'overlay pour charger plus d'images
//         overlayThumb.addEventListener("click", function () {
//             // Supprimer l'image d'overlay
//             overlayThumb.parentElement.removeChild(overlayThumb);

//             // Récupérer toutes les vignettes cachées avec l'attribut data-img-url
//             const additionalImages = Array.from(imageList.querySelectorAll('.thumb.hidden'))
//                 .map(thumb => thumb.getAttribute('data-img-url'))
//                 .filter(Boolean); // Ne garder que les URLs valides

//             // Afficher les nouvelles images dynamiquement
//             additionalImages.forEach(src => {
//                 const newThumb = document.createElement("div");
//                 newThumb.classList.add("thumb");
//                 newThumb.innerHTML = `<img src="${src}" alt="">`;
                
//                 // Changer l'image principale au clic
//                 newThumb.addEventListener("click", function () {
//                     mainImage.src = src; // Changer l'image principale au clic
//                 });

//                 imageList.appendChild(newThumb);
//             });

//             // Mettez à jour l'affichage pour s'assurer que les nouvelles images sont visibles
//             updateImageDisplay();
//         });
//     }
    

//     // Ajoutez des événements de clic aux autres vignettes existantes
//     const thumbs = document.querySelectorAll(".house__images-list .thumb img");
//     thumbs.forEach(thumb => {
//         thumb.addEventListener("click", function () {
//             mainImage.src = this.src; // Changer l'image principale au clic
//         });
//     });

//     function updateImageDisplay() {
//         const thumbsList = document.querySelectorAll(".house__images-list .thumb");
        
//         thumbsList.forEach(thumb => {
//             thumb.style.minWidth = "179px"; // Assurez-vous que chaque vignette a la même largeur
//         });
        
//         imageList.scrollLeft += 179; // Fait défiler vers la droite après ajout (si nécessaire)
//     }
// });


document.addEventListener("DOMContentLoaded", function () {
    const mainImage = document.querySelector(".house__images-main img");
    const overlayThumb = document.querySelector(".thumb.overlay");
    const imageList = document.querySelector(".house__images-list");

    if (overlayThumb) {
        // Écoutez le clic sur l'image d'overlay pour charger plus d'images
        overlayThumb.addEventListener("click", function () {
            // Supprimer l'image d'overlay
            overlayThumb.parentElement.removeChild(overlayThumb);

            // Récupérer toutes les vignettes cachées avec l'attribut data-img-url
            const additionalImages = Array.from(imageList.querySelectorAll('.thumb.hidden'))
                .map(thumb => thumb.getAttribute('data-img-url'))
                .filter(Boolean); // Ne garder que les URLs valides

            // Afficher les nouvelles images dynamiquement
            additionalImages.forEach(src => {
                const newThumb = document.createElement("div");
                newThumb.classList.add("thumb");
                newThumb.innerHTML = `<img src="${src}" alt="">`;

                // Changer l'image principale au clic
                newThumb.addEventListener("click", function () {
                    mainImage.src = src; // Changer l'image principale au clic
                });

                imageList.appendChild(newThumb);
            });

            // Mettre à jour le compteur d'images supplémentaires dans l'overlay
            updateOverlayCounter(additionalImages.length);
            
            // Mettez à jour l'affichage pour s'assurer que les nouvelles images sont visibles
            updateImageDisplay();
        });
    }

    // Ajoutez des événements de clic aux autres vignettes existantes
    const thumbs = document.querySelectorAll(".house__images-list .thumb img");
    thumbs.forEach(thumb => {
        thumb.addEventListener("click", function () {
            mainImage.src = this.src; // Changer l'image principale au clic
        });
    });

    function updateImageDisplay() {
        const thumbsList = document.querySelectorAll(".house__images-list .thumb");

        thumbsList.forEach(thumb => {
            thumb.style.minWidth = "179px"; // Assurez-vous que chaque vignette a la même largeur
        });

        imageList.scrollLeft += 179; // Fait défiler vers la droite après ajout (si nécessaire)
    }

    function updateOverlayCounter(count) {
        const overlayText = `+${count} фото`;
        overlayThumb.setAttribute('data-before', overlayText); // Mettre à jour le texte affiché dans l'overlay
    }
});