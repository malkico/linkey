/* ****************************** make the footer always on the bottom */
exports.customize_footer = () => {
    $(".links").css("margin-bottom", "0px");
    $(".result").css("margin-bottom", "0px");
    const footerPosTop = $("footer").offset().top;
    const bodyHeight = $("body").height();
    if (bodyHeight > footerPosTop) {
        $(".links").css("margin-bottom", (bodyHeight - footerPosTop) + "px");
        $(".result").css("margin-bottom", (bodyHeight - footerPosTop) + "px");
    }
}