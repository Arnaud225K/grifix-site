(() => {
    // Wait for the DOM to fully load
    document.addEventListener("DOMContentLoaded", () => {
        const t = document.querySelector(".cover picture");

        // Check if the selected element exists
        if (t) {
            const positions = [
                { x: 50, y: 16 },
                { x: 20, y: 55 },
                { x: 60, y: 40 },
                { x: 35, y: 20 },
                { x: 50, y: 45 }
            ];

            // Iterate through each position
            positions.forEach((e) => {
                (function (e, n) {
                    const r = document.createElement("div");
                    r.classList.add("svg-lamp");
                    r.innerHTML ='<svg width="20" height="20" viewBox="0 0 178 178" fill="none" xmlns="http://www.w3.org/2000/svg">\n<g style="mix-blend-mode:screen">\n<ellipse cx="89" cy="89" rx="8" ry="89" fill="url(#paint0_radial_172_4248)"/>\n</g>\n<g style="mix-blend-mode:screen">\n<ellipse cx="89" cy="89" rx="8" ry="89" transform="rotate(-90 89 89)" fill="url(#paint1_radial_172_4248)"/>\n</g>\n<g style="mix-blend-mode:screen">\n<ellipse cx="88.4901" cy="89.3365" rx="8" ry="84" transform="rotate(-130 88.4901 89.3365)" fill="url(#paint2_radial_172_4248)"/>\n</g>\n<g style="mix-blend-mode:screen">\n<ellipse cx="8" cy="84" rx="8" ry="84" transform="matrix(0.642788 -0.766044 -0.766044 -0.642788 148.695 149.245)" fill="url(#paint3_radial_172_4248)"/>\n</g>\n<defs>\n<radialGradient id="paint0_radial_172_4248" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(89 89) rotate(90) scale(89 8)">\n<stop stop-color="white"/>\n<stop offset="0.155" stop-color="#F18E1B"/>\n<stop offset="1"/>\n</radialGradient>\n<radialGradient id="paint1_radial_172_4248" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(89 89) rotate(90) scale(89 8)">\n<stop stop-color="white"/>\n<stop offset="0.155" stop-color="#F18E1B"/>\n<stop offset="1"/>\n</radialGradient>\n<radialGradient id="paint2_radial_172_4248" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(88.4901 89.3365) rotate(90) scale(84 8)">\n<stop stop-color="white"/>\n<stop offset="0.155" stop-color="#F18E1B"/>\n<stop offset="1"/>\n</radialGradient>\n<radialGradient id="paint3_radial_172_4248" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(8 84) rotate(90) scale(84 8)">\n<stop stop-color="white"/>\n<stop offset="0.155" stop-color="#F18E1B"/>\n<stop offset="1"/>\n</radialGradient>\n</defs>\n</svg>\n';
                    
                    // Set the position and animation for the lamp
                    r.style.left = `${e}vw`;
                    r.style.top = `${n}%`;
                    r.style.animation = "pulse 2s infinite ease-in-out";

                    // Append the lamp to the selected element
                    t.appendChild(r);
                })(e.x, e.y);
            });
        }
    });
})();