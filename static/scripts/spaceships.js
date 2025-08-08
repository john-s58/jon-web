(function() {
    const SPACESHIP_COUNT = Math.floor(Math.random() * 2) + 1;
    const TRAIL_LENGTH = 15;
    const TRAIL_LIFETIME = 2000;
    const MIN_SPEED = 0.3;
    const MAX_SPEED = 0.8;
    
    class Spaceship {
        constructor() {
            const pageHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
            const edge = Math.floor(Math.random() * 4);
            const margin = 30;
            
            switch(edge) {
                case 0: // top edge
                    this.x = Math.random() * window.innerWidth;
                    this.y = -margin;
                    this.angle = Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 3;
                    break;
                case 1: // right edge
                    this.x = window.innerWidth + margin;
                    this.y = Math.random() * pageHeight;
                    this.angle = Math.PI + (Math.random() - 0.5) * Math.PI / 3;
                    break;
                case 2: // bottom edge
                    this.x = Math.random() * window.innerWidth;
                    this.y = pageHeight + margin;
                    this.angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 3;
                    break;
                case 3: // left edge
                    this.x = -margin;
                    this.y = Math.random() * pageHeight;
                    this.angle = (Math.random() - 0.5) * Math.PI / 3;
                    break;
            }
            
            this.speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
            this.angleVelocity = (Math.random() - 0.5) * 0.02;
            this.trail = [];
            this.lastTrailTime = Date.now();
            this.trailInterval = 100;
            
            this.element = this.createElement();
            document.getElementById('spaceship-container').appendChild(this.element);
        }
        
        createElement() {
            const elem = document.createElement('div');
            elem.className = 'spaceship';
            elem.innerHTML = '<img src="/icons/spaceship.svg" alt="" style="width: 100%; height: 100%;">';
            elem.style.position = 'absolute';
            elem.style.width = '24px';
            elem.style.height = '24px';
            elem.style.pointerEvents = 'none';
            elem.style.zIndex = '1';
            elem.style.opacity = '0.7';
            return elem;
        }
        
        createDash(x, y) {
            const dash = document.createElement('div');
            dash.className = 'dash-trail';
            dash.innerHTML = '<img src="/icons/dash.svg" alt="" style="width: 100%; height: 100%;">';
            dash.style.position = 'absolute';
            dash.style.left = x + 'px';
            dash.style.top = y + 'px';
            dash.style.width = '12px';
            dash.style.height = '12px';
            dash.style.pointerEvents = 'none';
            dash.style.zIndex = '1';
            dash.style.opacity = '0.5';
            dash.style.transition = `opacity ${TRAIL_LIFETIME}ms ease-out`;
            
            document.getElementById('spaceship-container').appendChild(dash);
            
            setTimeout(() => {
                dash.style.opacity = '0';
            }, 10);
            
            setTimeout(() => {
                dash.remove();
            }, TRAIL_LIFETIME);
            
            return dash;
        }
        
        update() {
            this.angle += this.angleVelocity;
            
            if (Math.random() < 0.02) {
                this.angleVelocity = (Math.random() - 0.5) * 0.04;
            }
            
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            
            const margin = 50;
            const pageHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
            if (this.x < -margin) this.x = window.innerWidth + margin;
            if (this.x > window.innerWidth + margin) this.x = -margin;
            if (this.y < -margin) this.y = pageHeight + margin;
            if (this.y > pageHeight + margin) this.y = -margin;
            
            this.element.style.left = this.x + 'px';
            this.element.style.top = this.y + 'px';
            this.element.style.transform = `rotate(${this.angle + Math.PI/2}rad)`;
            
            const now = Date.now();
            if (now - this.lastTrailTime > this.trailInterval) {
                this.createDash(this.x + 6, this.y + 6);
                this.lastTrailTime = now;
            }
        }
    }
    
    function init() {
        const container = document.createElement('div');
        container.id = 'spaceship-container';
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.minHeight = '100vh';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '1';
        container.style.overflow = 'hidden';
        document.body.appendChild(container);
        
        const spaceships = [];
        for (let i = 0; i < SPACESHIP_COUNT; i++) {
            spaceships.push(new Spaceship());
        }
        
        function animate() {
            spaceships.forEach(ship => ship.update());
            requestAnimationFrame(animate);
        }
        
        animate();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();