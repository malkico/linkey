/*
const a = 1
a = 2; */

// ++++++++++++++++++++ Cookie follower_id 
const getCookie = (name) => {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

/* ****************************** make the footer always on the bottom */
const customize_footer = function(){
    $(".links").css("margin-bottom", "0px");
    $(".result").css("margin-bottom", "0px");
    $(".customize").addClass("d-none")
    const footerPosTop = $("footer").offset().top;
    const bodyHeight = $("body").height();
    if (bodyHeight >= footerPosTop) {
        $(".links").css("margin-bottom", (bodyHeight - footerPosTop) + "px");
        $(".result").css("margin-bottom", (bodyHeight - footerPosTop) + "px");
    }
}

// console.log("follower cookie => %s", getCookie("follower_id"))
console.log("i18n_lang cookie => %s", getCookie("i18n_lang_2"))

$(() => {

    // *************************** customize_footer ***************
    customize_footer()

    // ***************************** hide ads and header on keyboeard is show up 
    var _originalSize = $(window).width() + $(window).height()
    $(window).resize(function () {
        if ($(window).width() + $(window).height() != _originalSize) {
            console.log("keyboard show up");
            $(".ads").hide();
            $(".influencer").hide();

        } else {
            console.log("keyboard closed");
            $(".ads").show();
            $(".influencer").show();
        }
    });

    //  ---------------------- Scraping from instagram ------>
    const socket = io.connect('127.0.0.1:3000');
    $.get("https://www.instagram.com/" + $("body").data('influencerInstaUrl') + "/?__a=1")
        .done(function (data) {
            // getting the url
            if (Object.keys(data).length) {
                const full_name = data["graphql"]["user"]["full_name"];
                const username = data["graphql"]["user"]["username"];
                const photoURL = data["graphql"]["user"]["profile_pic_url_hd"];
                $(".login span").text(full_name)
                $(".login small").text(username)
                $(".photo img").attr("src", photoURL)
            }
        })

    /* **************************** SEARCH ENGINE ************************/

    // +++++++++++++++++  GET influencer links 
    const links = $("body").data('influencerLinks')
    const link_filtered = (url, title, key, _id) => {
        let span_key = "";
        if(key){
            span_key = "<span class='badge badge-c-dark'>KEY: " + key + "</span>"
        }
        return "<a href='" + url + "' class='text-dark filtred' data-id='" + _id + "'>" +
            "<div class='alink list-group-item d-flex pr-0 pl-0 row pt-0'>" +
            "<div class='d-flex offset-1 col-10 border-bottom pb-2 max-with'>" +
            "<p class='mb-0'><i class='fab fa-slack-hash fa-2x mr-4' aria-hidden='true'></i>" +
            "<div class='my-auto'>" +
            "<h6 class='mb-0'> " + title + "<h6>" +
            span_key +
            "</div>" +
            " <div class='spinner-border ml-2 ' role='status'>" +
            " <span class='sr-only'>Loading...</span>" +
            " </div>" +
            "</p>" +
            "</div>" +
            "</div>" +
            "</a>"
    }

    // ++++++++++++ Looking for KEY and keyword on title
    const conditions = (link, keywords) => {

        const array_keywords = keywords.replace(/ +/g, " ").trim().split(" ")
        console.log("looking for %s => %s", typeof (array_keywords), array_keywords.join())
        let allFilter = false
        array_keywords.forEach(k => {
            if (link.title.toLowerCase().includes(k.toLowerCase())) {
                allFilter = true;
            }
        })
        return (link.key == parseInt(keywords, 10) || allFilter)
    }

    // ++++++++++++++++ make keywords on bold style
    const boldingKeyword = (title, keywords) => {
        const array_keywords = keywords.replace(/ +/g, " ").trim().split(" ")
        array_keywords.forEach(k => {
            if (k !== "")
                title = title.replace(new RegExp(k, "gi"), "aa1a" + k + "bb2b")
        })

        title = title.replace(/aa1a/gi, "<span style='background-color: grey; color: #fff'>")
        title = title.replace(/bb2b/gi, "</span>")
        return title
    }

    // +++++++++++++++++++++  research function
    const research = (val) => {
        const founds = links.filter(link => conditions(link, val))
        $(".all-links").fadeOut()
        $('.filtred').remove()
        founds.forEach(v => {
            $(".links .list-group-flush").append(link_filtered(v.url, boldingKeyword(v.title, val),
                v.key, v._id))
        })
        return founds
    }

    // +++++++++++++++++++++ research logic
    $(".customize").css("height", $("body").height() + "px")
    const logicSearch = () => {
        $(".customize").removeClass("d-none")
        const form = $('.search form')
        // $(".links").hide()
        $(".searching").fadeIn()
        // customize_footerrrr()
        socket.emit("search", {
                keyword: form.find("input").val(),
                follower_id: getCookie("follower_id"),
                influencer_id: $("body").data('influencerId')
            },
            (data) => {
                const founds = research(form.find("input").val())
                let fixLinksPromise, fixResultPromise
                const hideSearchingPromise = new Promise(resolve => {
                    $(".searching").fadeOut(() => {
                        resolve(true)
                    })
                })

                if (!data.confirm || !founds.length) {
                    if (!data.confirm)
                        $(".result p").text(data.message)
                    else if (!founds.length)
                        $(".result p").text($(".result p").data("nothingFound"))

                fixLinksPromise = new Promise(resolve => {
                        $(".links").fadeOut(() => {
                            resolve(true)
                        })

                    })
                fixResultPromise = new Promise(resolve => {
                        $(".result").fadeIn(() => {
                            resolve(true)
                        })
                    })

                    console.log("showing the error message")
                } else if (data.confirm) {
                    $("form input").data("id", data.search_id)
                    fixLinksPromise = new Promise(resolve => {
                        $(".links").fadeIn(() => {
                            resolve(true)
                        })
                    })
                    fixResultPromise = new Promise(resolve => {
                        $(".result").fadeOut(( ) => {
                            resolve(true)
                        })

                    })

                    console.log("showing the links")
                }

                Promise.all([hideSearchingPromise,
                    fixResultPromise,
                    fixLinksPromise])
                    .then((results) => {
                        if(results){
                            customize_footer()
                        }
                    }
                )

            })
        // research(form.find("input").val())
    }

    // +++++++++++++++++++++ Strart research
    $(".search form").submit(function (e) {
        e.preventDefault()
        logicSearch()
    })
    $(".search form .fa-search").click(function () {
        console.log("click to research")
        logicSearch()
    })
    // console.log("links => %s",JSON.stringify(links))

    // +++++++++++++++++++++++++++++ Save the click
    $("body").delegate('.links a', 'click', function (e) {
        e.preventDefault()
        $(this).find(".spinner-border").fadeIn()

        socket.emit('click', {
            link_id: $(this).data("id"),
            follower_id: getCookie("follower_id"),
            search_id: $("form input").data("id")
        }, data => {
            if (data.confirm) {
                console.log("redirect to the link ...")
            } else {
                console.log(data.message)
            }

            location.href = $(this).attr("href")
        });
    })


})