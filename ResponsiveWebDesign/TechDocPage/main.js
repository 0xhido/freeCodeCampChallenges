let navbar = document.querySelector('#navbar');
let markerPath = document.querySelector('.toc-marker path');
let navbarItems;

// Factor of screen size that the element must cross
// before it's considered visible
const TOP_MARGIN = 0.1;
const BOTTOM_MARGIN = 0.2;

let pathLength;

let lastPathStart;
let lastPathEnd;

window.addEventListener('resize', drawPath, false);
window.addEventListener('scroll', sync, false);

drawPath();

function drawPath() {

    navbarItems = [].slice.call(navbar.querySelectorAll('li'));

    // Cache element references and measurements
    navbarItems = navbarItems.map(item => {
        const anchor = item.querySelector('a');
        const target = document.getElementById(anchor.getAttribute('href').slice(1));

        return {
            listItem: item,
            anchor: anchor,
            target: target
        };
    });

    // Remove missing targets
    navbarItems = navbarItems.filter(item => !!item.target);

    let path = [];
    let pathIndent;

    navbarItems.forEach((item, i) => {

        let x = item.anchor.offsetLeft - 5;
        let y = item.anchor.offsetTop;
        let height = item.anchor.offsetHeight;

        if (i === 0) {
            path.push('M', x, y, 'L', x, y + height);
            item.pathStart = 0;
        }
        else {
            // Draw an additional line when there's a change in
            // indent levels
            if (pathIndent !== x) {
                path.push('L', pathIndent, y);
            }

            path.push('L', x, y);

            // Set the current path so that we can measure it
            markerPath.setAttribute('d', path.join(' '));
            item.pathStart = markerPath.getTotalLength() || 0;

            path.push('L', x, y + height);
        }

        pathIndent = x;

        markerPath.setAttribute('d', path.join(' '));
        item.pathEnd = markerPath.getTotalLength();

    });

    pathLength = markerPath.getTotalLength();

    sync();

}

function sync() {
    let windowHeight = window.innerHeight;

    let pathStart = pathLength;
    let pathEnd = 0;

    let visibleItems = 0;

    navbarItems.forEach(item => {

        let targetBounds = item.target.getBoundingClientRect();

        if (targetBounds.bottom > windowHeight * TOP_MARGIN && targetBounds.top < windowHeight * (1 - BOTTOM_MARGIN)) {
            pathStart = Math.min(item.pathStart, pathStart);
            pathEnd = Math.max(item.pathEnd, pathEnd);

            visibleItems += 1;

            item.listItem.classList.add('visible');
        }
        else {
            item.listItem.classList.remove('visible');
        }

    });

    // Specify the visible path or hide the path altogether
    // if there are no visible items
    if (visibleItems > 0 && pathStart < pathEnd) {
        if (pathStart !== lastPathStart || pathEnd !== lastPathEnd) {
            markerPath.setAttribute('stroke-dashoffset', '1');
            markerPath.setAttribute('stroke-dasharray', '1, ' + pathStart + ', ' + (pathEnd - pathStart) + ', ' + pathLength);
            markerPath.setAttribute('opacity', 1);
        }
    }
    else {
        markerPath.setAttribute('opacity', 0);
    }

    lastPathStart = pathStart;
    lastPathEnd = pathEnd;

}