/**
 * Created by fokion on 28/02/2017.
 */
function DomImpl() {
    var me = this;
    me.createElement = function (elementType, elementStyleObj) {
        if (elementType && typeof elementType === "string") {
            var htmlElement = document.createElement(elementType);
            if (elementStyleObj) {
                if (elementStyleObj.hasOwnProperty("styles")) {
                    jQuery(htmlElement)[0].css(elementStyleObj.styles);
                }
                htmlElement.className = elementStyleObj.classes.join(" ");
            }
            return htmlElement;
        }
        console.error("[DomImpl][createElement] could not create an element ");
        return null;
    };
    me.clearElement = function (container) {
        if (!container) {
            return;
        }
        while (container && container.hasChildNodes()) {
            container.removeChild(container.lastChild);
        }
    }
}
