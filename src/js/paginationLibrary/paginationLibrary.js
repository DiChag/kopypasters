import { arrowIcon } from "../interface/arrow-icon";
import { scrollToTop } from "../pagination/util";

export default class PaginationLibrary {
        constructor(btnInPagination) {
                this.totalElements = 0;
                this.perPage = 0;
                this.currentPage = 1;
                this.renderCards = "";
                this.paginationContainerClass = "";
                this.btnInPagination = btnInPagination;
                this.firstIndexOfArray = 0;
                this.lastIndexOfArray = 0;
        }
        get paginationContainer() {
                return this.paginationContainerClass;
        }

        set paginationContainer(newContainerClass) {
                this.paginationContainerClass = newContainerClass;
        }

        get current() {
                return this.currentPage;
        }

        set current(newCurrentPage) {
                this.currentPage = newCurrentPage;
        }

        get per_Page() {
                return this.perPage;
        }

        set per_Page(newPerPage) {
                this.perPage = newPerPage;
        }

        getAdjastment() {
                return this.btnInPagination;
        }

        get adjastment() {
                return this.btnInPagination;
        }

        set adjastment(newBtnInPagination) {
                this.btnInPagination = newBtnInPagination;
        }

        clearPaginationLibrary() {
                const paginationContainer = document.querySelector(
                        `.${this.paginationContainerClass}`,
                );
                paginationContainer.innerHTML = "";
        }

        calculateIndexesOfArray() {
                this.firstIndexOfArray =
                        this.currentPage > 0 ? (this.currentPage - 1) * this.perPage : 0;
                this.lastIndexOfArray = 0;
                if (this.currentPage > 0) {
                        if (this.currentPage * this.perPage - 1 < this.totalElements) {
                                this.lastIndexOfArray = this.currentPage * this.perPage - 1;
                        } else {
                                this.lastIndexOfArray = this.totalElements - 1;
                        }
                }
        }

        update() {
                this.clearPaginationLibrary();
                const ul = document.createElement("ul");
                ul.classList.add("paginationLibrary-list");
                const totalOfBtn = Math.ceil(this.totalElements / this.perPage);
                this.currentPage = this.currentPage > totalOfBtn ? totalOfBtn : this.currentPage;
                const countBtnInPagination = Math.min(totalOfBtn, this.btnInPagination);
                if (totalOfBtn > 1) {
                        ul.appendChild(this.createLi("arrow-left", totalOfBtn));
                }
                let txtOfBtn = 0;
                let centerOfPagination = (this.btnInPagination - 1) / 2 + 1;
                let centerOffcet = (this.btnInPagination - 5) / 2;
                for (let i = 1; i <= countBtnInPagination; i += 1) {
                        txtOfBtn = i;
                        if (
                                i === 2 &&
                                this.currentPage >= centerOfPagination &&
                                totalOfBtn > this.btnInPagination
                        ) {
                                txtOfBtn = "...";
                        }
                        if (
                                i > 2 &&
                                i < countBtnInPagination - 1 &&
                                totalOfBtn > this.btnInPagination &&
                                this.currentPage >= centerOfPagination &&
                                this.currentPage <= totalOfBtn - centerOfPagination
                        ) {
                                txtOfBtn = this.currentPage - centerOffcet;
                                centerOffcet -= 1;
                        }
                        if (
                                i > 2 &&
                                i < countBtnInPagination - 1 &&
                                totalOfBtn > this.btnInPagination &&
                                this.currentPage >= centerOfPagination &&
                                this.currentPage > totalOfBtn - centerOfPagination
                        ) {
                                txtOfBtn = totalOfBtn - (this.btnInPagination - i);
                        }
                        if (
                                i === countBtnInPagination - 1 &&
                                totalOfBtn > this.btnInPagination &&
                                this.currentPage <= totalOfBtn - centerOfPagination
                        ) {
                                txtOfBtn = "...";
                        }
                        if (
                                i === countBtnInPagination - 1 &&
                                totalOfBtn > this.btnInPagination &&
                                this.currentPage > totalOfBtn - centerOfPagination
                        ) {
                                txtOfBtn = totalOfBtn - 1;
                        }
                        if (i === countBtnInPagination) {
                                txtOfBtn = totalOfBtn;
                        }
                        ul.appendChild(this.createLi(txtOfBtn, totalOfBtn));
                }
                if (totalOfBtn > 1) {
                        ul.appendChild(this.createLi("arrow-right", totalOfBtn));
                }
                ul.addEventListener("click", (evt) => {
                        if (
                                evt.target.nodeName !== "LI" &&
                                evt.target.nodeName !== "svg" &&
                                evt.target.nodeName !== "use"
                        ) {
                                return;
                        }
                        if (evt.target.nodeName === "use") {
                                this.action(evt.target.parentNode.dataset.page, this.renderCards);
                        } else {
                                this.action(evt.target.dataset.page, this.renderCards);
                        }
                });
                const paginationContainer = document.querySelector(
                        `.${this.paginationContainerClass}`,
                );
                paginationContainer.appendChild(ul);
        }

        initPagination(_totalElements, _perPage, renderCards, adjastment) {
                this.btnInPagination = adjastment;
                this.totalElements = _totalElements;
                this.perPage = _perPage;
                this.renderCards = renderCards;
                this.update();
        }

        action(page, renderCards) {
                this.currentPage = Number(page);
                renderCards();
                scrollToTop();
        }

        createLi(item, totalOfBtn) {
                let txt = "";
                let isArrowLeft = "";
                let isArrowRight = "";
                const li = document.createElement("li");
                if (item === "arrow-left") {
                        item = Number(this.currentPage) - 1;
                        const svg = arrowIcon("left", 16, 16);
                        svg.classList.add("paginationLibrary-list__icon");
                        txt = svg;
                        svg.dataset.page = Number(item);
                        isArrowLeft = true;
                } else if (item === "arrow-right") {
                        item = Number(this.currentPage) + 1;
                        const svg = arrowIcon("right", 16, 16);
                        svg.classList.add("paginationLibrary-list__icon");
                        txt = svg;
                        svg.dataset.page = Number(item);
                        isArrowRight = true;
                } else {
                        txt = document.createTextNode(item);
                }
                li.appendChild(txt);
                li.classList.add("paginationLibrary-list__item");
                if (isArrowRight || isArrowLeft) {
                        li.classList.add("paginationLibrary-list__item--arrow");
                }
                if (
                        item === "..." ||
                        (isArrowLeft === true && this.currentPage === 1) ||
                        (isArrowRight === true && Number(this.currentPage) === Number(totalOfBtn))
                ) {
                        li.classList.add("disabled");
                }
                if (Number(item) === Number(this.currentPage)) {
                        li.classList.add("paginationLibrary-list__item--active");
                }
                if (item >= 100) {
                        li.classList.add("paginationLibrary-list__item--smallLeftPadding");
                }
                li.dataset.page = Number(item);
                return li;
        }
}
