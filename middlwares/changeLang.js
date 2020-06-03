const i18n = require("i18n")
module.exports = (req, res, next) => {
    let lang;
    const lang_allowed = ['en', 'fr', 'ar', 'es']
    const lang_cookie = "i18n_lang_2"
    lang = req.acceptsLanguages(lang_allowed);
    
    if (req.query.lang && lang_allowed.filter(v => v === req.query.lang).length) {
        console.log("get langage from URL")
        lang = req.query.lang
    }
    else if (req.cookies[lang_cookie] && lang_allowed.filter(v => v === req.cookies[lang_cookie]).length ) {
        console.log("get langage from cookie")
        lang = req.cookies[lang_cookie]
    }
    else if (lang) {
        console.log('The first accepted of %s is: %s', lang_allowed, lang);
    } else {
        console.log('None of %s is accepted', lang_allowed);
        lang = "en"
    }

    res.cookie(lang_cookie, lang)
    i18n.setLocale(lang);
    res.set("Content-Language",lang)
    res.locals.i18n_lang_2 = lang
    console.log("change langage to %s", lang)

    next();
}