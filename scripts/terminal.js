class TerminalElement extends HTMLElement {
    connectedCallback() {
        this._line = null;

        /*
         * API pública do terminal
         * Uso:
         * document.querySelector('terminal-window').api.type(...)
         */
        this.api = {
            type: this._type.bind(this),
            print: this._print.bind(this),
            newline: this._newline.bind(this),
            wait: this._wait.bind(this),
            reveal: this._reveal.bind(this),
        };
    }

    _newLine() {
        const line = document.createElement('span');
        line.className = 'tw-line';
        this.appendChild(line);
        this._line = line;
        return line;
    }

    _cursor() {
        const cur = document.createElement('span');
        cur.className = 'tw-cursor';
        return cur;
    }

    /*
     * Digitação animada
     */
    _type(text, opts = {}) {
        const { cls, speed = 50 } = opts;
        const line = this._line || this._newLine();

        const span = document.createElement('span');
        if (cls) span.className = cls;
        line.appendChild(span);

        let cur = line.querySelector('.tw-cursor');
        if (!cur) {
            cur = this._cursor();
        }
        line.appendChild(cur);

        return new Promise(resolve => {
            let i = 0;

            const tick = () => {
                if (i < text.length) {
                    span.appendChild(document.createTextNode(text[i++]));
                    setTimeout(tick, speed);
                } else {
                    resolve();
                }
            };

            tick();
        });
    }

    /*
     * Print direto (sem animação)
     */
    _print(text, opts = {}) {
        const { cls, delay = 0 } = opts;

        return new Promise(resolve => {
            setTimeout(() => {
                const cur = this.querySelector('.tw-cursor');
                if (cur) cur.remove();

                const line = this._newLine();
                const span = document.createElement('span');

                if (cls) span.className = cls;

                span.textContent = text;
                line.appendChild(span);

                resolve();
            }, delay);
        });
    }

    /*
     * Nova linha
     */
    _newline() {
        const cur = this.querySelector('.tw-cursor');
        if (cur) cur.remove();

        this._newLine();
        return Promise.resolve();
    }

    /*
     * Delay
     */
    _wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /*
     * Revela elemento com fade-in
     */
    _reveal(target, delay = 200) {
        return new Promise(resolve => {
            setTimeout(() => {
                const cur = this.querySelector('.tw-cursor');
                if (cur) cur.remove();

                const el = typeof target === 'string'
                    ? document.querySelector(target)
                    : target;

                if (!el) {
                    resolve();
                    return;
                }

                el.style.transition = 'opacity .5s ease, transform .5s ease';
                el.style.opacity = '0';
                el.style.transform = 'translateY(6px)';
                el.style.display = 'block';

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';

                        setTimeout(resolve, 500);
                    });
                });
            }, delay);
        });
    }
}

/*
 * Registro do Web Component
 */
customElements.define('terminal-window', TerminalElement);