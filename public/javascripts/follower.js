/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-undef
const bodyHeight = $("body").height();
const customize_footer = () => {
    $(".links").css("margin-bottom", "0px");
    $(".result").css("margin-bottom", "0px");
    const footerPosTop = $("footer").offset().top;
    if (bodyHeight > footerPosTop) {
        $(".links").css("margin-bottom", (bodyHeight - footerPosTop) + "px");
        $(".result").css("margin-bottom", (bodyHeight - footerPosTop) + "px");
    }
}