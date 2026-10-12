$(document).ready(function () {

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    $('.header-links .nav-link').each(function () {
        if ($(this).attr('href') === currentPage) {
            $('.header-links .nav-link').removeClass('active');
            $(this).addClass('active');
        }
    });





    const params = new URLSearchParams(window.location.search);
    let activeCategory = params.get('category') || 'newly-launched';

    $('.category-link').click(function (e) {
        e.preventDefault();
        $('.category-link').removeClass('active');
        $(this).addClass('active');
        activeCategory = $(this).data('category');
        $('#menu-category-title').text($(this).text());
        $('.category-section').hide();
        $('#section-' + activeCategory).show();
        const url = new URL(window.location);
        url.searchParams.set('category', activeCategory);
        window.history.pushState({}, '', url);
        $('.search-input').val('');
        $('.menu-card').show();
        $('#no-search-results').remove();
    });





    $('.delivery-btn').click(function (e) {
        e.preventDefault();
        $('.delivery-btn').removeClass('active');
        $(this).addClass('active');
    });

    if (window.location.pathname.includes('order.html')) {
        $('.category-link').removeClass('active');
        const activeTab = $('.category-link[data-category="' + activeCategory + '"]');
        activeTab.addClass('active');
        if (activeTab.length) {
            $('#menu-category-title').text(activeTab.text());
        }
        $('.category-section').hide();
        $('#section-' + activeCategory).show();
    }




    $('img').on('error', function () {
        $(this).css('opacity', '0');
    });

    $('img').each(function () {
        if (this.complete && this.naturalHeight === 0) {
            $(this).css('opacity', '0');
        }
    });






    $('#loginOrSignUpBtn').click(function () {
        $('#loginModal').modal('show');
    });

    $('.login-input').on('input', function() {
        var val = $(this).val().replace(/\D/g, '');
        $(this).val(val);
        if (val.length === 10) {
            $('.continue-btn').prop('disabled', false)
                .css({'background-color': '#1e3932', 'cursor': 'pointer'});
        } else {
            $('.continue-btn').prop('disabled', true)
                .css({'background-color': '#a0a0a0', 'cursor': 'not-allowed'});
        }
    });






    function performSearch(query) {
        $('#no-search-results').remove();
        if (query.length === 0) {
            var activeCat = $('.category-link.active').data('category') || 'newly-launched';
            $('.category-section').hide();
            $('.menu-card').show();
            $('#section-' + activeCat).show();
            $('#menu-category-title').text($('.category-link.active').text());
        } else {
            $('#menu-category-title').text('Search Results');
            $('.category-section').show();
            var totalVisible = 0;
            $('.category-section').each(function() {
                var section = $(this);
                var visibleInSection = 0;
                section.find('.menu-card').each(function() {
                    var card = $(this);
                    var title = card.find('.menu-card-title').text().toLowerCase();
                    var desc = card.find('.menu-card-desc').text().toLowerCase();
                    if (title.indexOf(query) !== -1 || desc.indexOf(query) !== -1) {
                        card.show();
                        visibleInSection++;
                        totalVisible++;
                    } else {
                        card.hide();
                    }
                });
                if (visibleInSection > 0) {
                    section.show();
                } else {
                    section.hide();
                }
            });
            if (totalVisible === 0) {
                $('.category-section').hide();
                if ($('#no-search-results').length === 0) {
                    $('main.container').append('<div id="no-search-results" class="text-center py-5"><h5 class="text-muted">No items match your search.</h5></div>');
                }
            }
        }
    }

    $('.search-input').on('input', function() {
        var query = $(this).val().toLowerCase().trim();
        if (window.location.pathname.includes('order.html')) {
            performSearch(query);
        }
    });

    $('.search-input').on('keypress', function(e) {
        if (e.which === 13) {
            e.preventDefault();
            var query = $(this).val().trim();
            if (!window.location.pathname.includes('order.html')) {
                window.location.href = 'order.html?search=' + encodeURIComponent(query);
            }
        }
    });

    if (window.location.pathname.includes('order.html')) {
        var searchParam = params.get('search');
        if (searchParam) {
            $('.search-input').val(searchParam);
            performSearch(searchParam.toLowerCase().trim());
        }
    }







    function initCart() {
        if ($('.profile-icon').length > 0 && $('.wishlist-icon').length === 0) {
            var wishlistIconHtml = `
                <a href="wishlist.html" class="wishlist-icon position-relative text-dark me-2" style="text-decoration: none;">
                    <i class="fa-regular fa-heart fs-4"></i>
                    <span class="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle wishlist-badge" style="font-size: 0.65rem; display: none;">0</span>
                </a>
            `;
            $('.profile-icon').before(wishlistIconHtml);
        }

        if ($('.profile-icon').length > 0 && $('.cart-icon').length === 0) {
            var cartIconHtml = `
                <a href="cart.html" class="cart-icon position-relative text-dark me-2" style="text-decoration: none;">
                    <i class="fa-solid fa-cart-shopping fs-4"></i>
                    <span class="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle cart-badge" style="font-size: 0.65rem; display: none;">0</span>
                </a>
            `;
            $('.profile-icon').before(cartIconHtml);
        }
        updateCartBadge();
        updateWishlistBadge();
    }

    function getCart() {
        return JSON.parse(localStorage.getItem('starbucks_cart')) || [];
    }

    function saveCart(cart) {
        localStorage.setItem('starbucks_cart', JSON.stringify(cart));
        updateCartBadge();
    }

    function addToCart(name, price, img) {
        var cart = getCart();
        var existing = cart.find(item => item.name === name);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({
                name: name,
                price: price,
                img: img || 'https://www.starbucks.in/assets/icon/logo.png',
                quantity: 1
            });
        }
        saveCart(cart);
        window.location.href = 'cart.html';
    }

    function updateCartBadge() {
        var cart = getCart();
        var totalCount = 0;
        cart.forEach(item => {
            totalCount += item.quantity;
        });
        if (totalCount > 0) {
            $('.cart-badge').text(totalCount).show();
        } else {
            $('.cart-badge').hide();
        }
    }






    
    function getWishlist() {
        return JSON.parse(localStorage.getItem('starbucks_wishlist')) || [];
    }

    function updateWishlistBadge() {
        var wishlist = getWishlist();
        if (wishlist.length > 0) {
            $('.wishlist-badge').text(wishlist.length).show();
        } else {
            $('.wishlist-badge').hide();
        }
    }

    window.addToCart = addToCart;
    window.updateCartBadge = updateCartBadge;
    window.updateWishlistBadge = updateWishlistBadge;

    $(document).on('click', '.btn-add, .btn-add-item, .card-gift button', function(e) {
        e.preventDefault();
        var name = "";
        var price = 500.00;
        var img = "";

        var menuCard = $(this).closest('.menu-card');
        if (menuCard.length > 0) {
            name = menuCard.find('.menu-card-title').text().trim();
            var priceText = menuCard.find('.menu-card-price').text();
            price = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;
            img = menuCard.find('.menu-card-img-circle img').attr('src');
        } 
        else {
            var productCard = $(this).closest('.product-card');
            if (productCard.length > 0) {
                name = productCard.find('h6').text().trim();
                var priceText = productCard.find('.fw-bold').first().text();
                price = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;
                img = productCard.find('.product-img').attr('src');
            }
            else {
                var giftCard = $(this).closest('.card-gift');
                if (giftCard.length > 0) {
                    name = giftCard.find('h6').text().trim();
                    img = giftCard.find('.gift-banner-img').attr('src');
                }
            }
        }

        if (name) {
            addToCart(name, price, img);
        }
    });

    initCart();

});