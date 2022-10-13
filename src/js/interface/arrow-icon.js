import iconsSVG from "../../images/icons.svg";

const arrowIcon = (type = "left", width = 20, height = 20) => {
        const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        icon.setAttribute("width", width);
        icon.setAttribute("height", height);
        icon.setAttributeNS(null, "viewBox", "0 0 32 32");
        icon.innerHTML = `<use href="${iconsSVG}#icon-arrow-${type}"></use>`;

        return icon;
};

export { arrowIcon };
