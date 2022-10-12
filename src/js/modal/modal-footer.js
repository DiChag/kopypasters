(() => {
        const refs = {
                openModalBtn: document.querySelector("[data-footer-modal-open]"),
                closeModalBtn: document.querySelector("[data-footer-modal-close]"),
                modal: document.querySelector("[data-modal]"),
        };

        refs.openModalBtn.addEventListener("click", toggleModal);
        // refs.closeModalBtn.addEventListener("click", toggleModal);

        function toggleModal(e) {
                // console.log([e.target]);
                if (e.target === refs.openModalBtn) {
                        refs.modal.addEventListener("click", handleCloseModal);
                        document.addEventListener("keydown", handleCloseModal);
                }

                document.body.classList.toggle("modal-open");
                refs.modal.classList.toggle("is-hidden");
        }

        function handleCloseModal(e) {
                // Keyboard event
                if (e.type === "keydown") {
                        // Not escape
                        if (e.keyCode !== 27) {
                                return;
                        }
                }

                // Mouse event
                else {
                        // Closest parent is "button" and is "footer-modal"
                        if (
                                !e.target.closest("button") &&
                                !e.target.classList.contains("footer-modal")
                        ) {
                                return;
                        }
                }

                document.body.classList.toggle("modal-open");
                refs.modal.classList.toggle("is-hidden");
                refs.modal.removeEventListener("click", handleCloseModal);
                document.removeEventListener("keydown", handleCloseModal);
        }
})();
