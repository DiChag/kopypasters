// Spinner class
export default class Spinner {
        #running = false;
        #spinnerElem = document.querySelector(".spinner");

        get status() {
                return this.#running;
        }

        show() {
                this.#running = true;

                // Show loading spinner only after 500 ms delay
                new Promise((resolve) => {
                        // prettier-ignore
                        setTimeout(() => resolve((()=>{
                                this.#running && this.#spinnerElem.classList.remove("visually-hidden");
                        })()), 300);
                });
        }
        hide() {
                this.#running = false;
                this.#spinnerElem.classList.add("visually-hidden");
        }
}
