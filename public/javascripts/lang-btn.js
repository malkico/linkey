// ++++++++++++++++++++ Cookie follower_id 
const getCookie = (name) => {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}


// ***************************************** bootstrap-select Flags *******************
    // *********************** Change CSS
    $('#selectFlag').selectpicker()
    $('.bootstrap-select').css("width", "auto")
    $('.bootstrap-select button').css("width", "max-content")
    $('.bootstrap-select .dropdown-menu').css("background-color", "rgba(0, 0, 0, 0)")
    .css("padding-bottom",0)
    .css("width", $('.bootstrap-select button').css("width"))
    $('.bootstrap-select .dropdown-menu div.inner').css("width", "max-content").css("background-color","#fff")
    $(".bootstrap-select .dropdown-toggle").css("padding",'0 0.4rem').addClass("auto-my").css("border-color","#9a9da0")

    // *********************** SET icon for the currect langage
    switch(getCookie($("body").data("prefix")+"lang")){
      case 'en' :
        $(".bootstrap-select .dropdown-toggle .flag").addClass("united states")
        console.log("lang button en")
        break;
      case 'fr' :
        $(".bootstrap-select .dropdown-toggle .flag").addClass("france")
        console.log("lang button fr")
        break;
    }

    // *********************** change lang
    let dropdown_item = false
    $(".bootstrap-select .dropdown-toggle").click( function(){
      if(!dropdown_item){
        $('.bootstrap-select .dropdown-item .flag').css("margin","0rem")
        $('.bootstrap-select .dropdown-item').removeClass("active").css("padding","0 0.5rem")

        $('.bootstrap-select a.dropdown-item').click(function() {
          console.log("change lang ....")
          const new_lang = $(this).find(".lang_txt").text()
          console.log("lang =>"+new_lang)
          window.location.replace(window.location.pathname+"?lang="+new_lang)
        })
        dropdown_item = true
      }

    })    