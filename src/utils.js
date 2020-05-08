import Axios from 'axios';

const animated = function animateCSS(element, animationName, callback) {
    element.classList.add('animated', ...animationName)

    function handleAnimationEnd() {
        element.classList.remove('animated', ...animationName)
        element.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    element.addEventListener('animationend', handleAnimationEnd)
}

const getGeolocation = async function () {
    let coord = null;
    try {
        coord = await this.$getLocation();
    } catch (error) {
        try {
            coord = await Axios.get("http://ip-api.com/json/").then(response => {
                return {
                    lat: response.data.lat,
                    lng: response.data.lon
                };
            });
        } catch (error) {
            coord = {
                lat: "42.787788",
                lng: "3.033359"
            };
        }
    }
    return coord;
}

export { animated, getGeolocation };