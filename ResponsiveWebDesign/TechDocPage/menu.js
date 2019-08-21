$(document).ready(() => {
    $('.menu-icon').click(() => {
        $('#navbar').toggleClass('active');
        if ($('#navbar').hasClass('active')) {
            $('.menu-icon').removeClass('fa-bars').addClass('fa-times');
        }
        else {
            $('.menu-icon').removeClass('fa-times').addClass('fa-bars');
        }
    })
})