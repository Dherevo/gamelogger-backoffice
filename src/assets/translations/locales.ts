import ca from "./ca"
import es from "./es"
import en from "./en"

// Moment:
import momentCA from "../../../lib/moment-locales/ca";
import momentES from "../../../lib/moment-locales/es";

// Prime:
import primeCA from "primelocale/ca.json";
import primeES from "primelocale/es.json";
import primeEN from "primelocale/en.json";

export default {

    defaultLanguage: 'ca',

    locales: {
        ca: ca,
        es: es,
        en: en,
    },

    moment: {
        // English is bundled by default.
        ca: momentCA,
        es: momentES,
    },

    prime: {
        // https://primevue.org/configuration/#locale
        ...primeCA,
        ...primeES,
        ...primeEN,
    }
}
