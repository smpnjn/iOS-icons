let icons = document.querySelectorAll('.icon-container');
let removals = document.querySelectorAll('.remove-icon');

let pointerdown = false;
let offset = 0;
let mouseXInit = 0;
let mouseYInit = 0;
let mouseX = 0;
let mouseY = 0;
let positionX = 0;
let positionY = 0;
let currentTop = 0;
let currentLeft = 0;
let timers = { first: undefined, second: undefined, third: undefined }

let helpers = {
    reset: function(extended) {
        mouseX = 0;
        mouseY = 0;
        mouseXInit = 0;
        mouseYInit = 0;
        currentTop = 0;
        currentLeft = 0;
        offset = 0;
        if(typeof timers.first !== "undefined") {
            clearTimeout(timers.first); 
        } else if(typeof timers.first === "number") {
            timers.first = undefined;
        }
        if(typeof timers.second !== "undefined") {
            clearTimeout(timers.second);
        } else if(typeof timers.second === "number") {
            timers.second = undefined;
        }
        if(typeof timers.third !== "undefined") {
            clearTimeout(timers.third);
        } else if(typeof timers.third === "number") {
            timers.third = undefined;
        }
        if(typeof extended == "undefined") {
            document.querySelector('.sub-menu').classList.remove('show-sub-menu');
            document.body.setAttribute('data-shaking', false);
            document.body.setAttribute('data-dropdown', false);
            pointerdown = false;
            icons.forEach(function(item) {
                item.setAttribute('data-selected', false);
                item.style.top = 0;
                item.style.left = 0;
            })
        }
    },
    checkPoint: function(x, y, limit) {
        if(x < limit && x > limit * -1 && y < limit && y > limit * -1) {
            return true;
        } else {
            return false;
        }
    }
}

icons.forEach(function(item) {
    item.addEventListener('pointerdown', function(e) {
        pointerdown = true;
        mouseXInit = e.clientX;
        mouseYInit = e.clientY;
        
        currentTop = parseFloat(item.style.top) || 0;
        currentLeft = parseFloat(item.style.left) || 0;
        // Set a timer to wait for a hold click
        timers.first = setTimeout(function() {
            if(pointerdown === true && ( document.body.getAttribute('data-shaking') == "false" || document.body.getAttribute('data-shaking') == null ) && helpers.checkPoint(mouseX, mouseY, 10)) {
                item.setAttribute('data-selected', true);
                document.body.setAttribute('data-dropdown', true);

                let left = item.getBoundingClientRect().left - document.getElementById('iphone').getBoundingClientRect().left;
                let bottom = item.getBoundingClientRect().bottom - document.getElementById('iphone').getBoundingClientRect().top;
            document.querySelector('.sub-menu').classList.add('show-sub-menu');
                document.querySelector('.sub-menu').style.left = `${left}px`;
                document.querySelector('.sub-menu').style.top = `${bottom - 16}px`;

            }
        }, 1000);
        timers.second = setTimeout(function() {
            if(pointerdown === true && helpers.checkPoint(mouseX, mouseY, 10)) {
                document.body.setAttribute('data-shaking', true);
                item.setAttribute('data-dragging', true);
                document.querySelector('.sub-menu').classList.remove('show-sub-menu');
                document.body.setAttribute('data-dropdown', false);
                timers.third = setTimeout(function() {
                    icons.forEach(function(i) {
                        i.style.animationDelay = `${offset}s`;
                        offset += 0.1;
                    })
                }, 300);
            }
        }, 2000);
        if(document.body.getAttribute('data-shaking') === "true") {
            item.setAttribute('data-dragging', true);
        }
    });
    item.addEventListener('pointerup', function() {
        helpers.reset(false);
    });
})

document.body.addEventListener('mousemove', function(e) {
    if(pointerdown === true) {
        mouseY = mouseXInit - e.pageY;
        mouseX = mouseXInit - e.pageX;
        if(document.body.getAttribute('data-shaking') == "true") {
            positionX = mouseXInit - e.pageX;
            positionY = mouseYInit - e.pageY;

            let el = document.querySelector('[data-dragging="true"]');
            if(el !== null) {
                el.style.top = `${positionY * -1 + currentTop}px`;
                el.style.left = `${positionX * -1 + currentLeft}px`;
            }
        }
    }
})
document.body.addEventListener('pointerup', function(e) {
    if(!e.target.matches('.remove-icon')) {
        helpers.reset(false);
    }

    icons.forEach(function(item) {
        item.setAttribute('data-dragging', false);
    });
});

removals.forEach(function(item) {
    item.addEventListener('click', function(e) {
        let icon = item.parentNode;
        icon.style.animation = 'scaleBack 0.4s linear 1 forwards';
        document.body.setAttribute('data-dropdown', false);
        setTimeout(() => {
            icon.remove();
        }, 400);
    })
    
});

document.body.addEventListener('click', function(e) {
    if(e.target.getAttribute('id') == "all-icons" || e.target.matches('body')) {
        helpers.reset();
        icons.forEach(function(i) {
            i.setAttribute('data-current', false);
        });
    }
});

