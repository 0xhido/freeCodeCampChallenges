$(document).ready(() => {
    $('.menu-toggle').click(() => {
        $('#nav-bar').toggleClass('active');
        if ($('#nav-bar').hasClass('active')) {
            $('.menu-icon').removeClass('fa-bars').addClass('fa-times');
        }
        else {
            $('.menu-icon').removeClass('fa-times').addClass('fa-bars');
        }
    })
})