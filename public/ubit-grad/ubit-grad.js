/* Ubit rig — pausa animaciones offscreen. Opcional: sin este script
   el rig anima igual. Sin dependencias; mismo archivo en Astro y Blazor.
   MutationObserver cubre nodos que se inyectan tras el arranque. */
(function () {
    var observer = null;

    function watch(rig) {
        if (!("IntersectionObserver" in window)) return;
        if (!observer) {
            observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (e) {
                    e.target.classList.toggle("is-paused", !e.isIntersecting);
                });
            });
        }
        observer.observe(rig);
    }

    function scan(root) {
        (root.querySelectorAll ? root.querySelectorAll(".ubit-rig") : []).forEach(function (el) {
            if (el.classList.contains("ubit-rig")) watch(el);
        });
        if (root.classList && root.classList.contains("ubit-rig")) watch(root);
    }

    function init() {
        scan(document);
        if ("MutationObserver" in window) {
            new MutationObserver(function (mutations) {
                mutations.forEach(function (m) {
                    m.addedNodes.forEach(function (n) {
                        if (n.nodeType === 1) scan(n);
                    });
                });
            }).observe(document.body, { childList: true, subtree: true });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
