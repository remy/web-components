/**
 * Remy Sharp
 * MIT
 *
 * Designed initially for the purpose of moving through a conference schedule
 * and also display elements, such as "buy buttons" for events
 *
 * 2023-07-14
 * - supports show, hide and scroll into view
 */

/**
 * @readonly
 * @enum {string}
 */
const DO_OPTIONS = {
  SHOW: 'show',
  HIDE: 'hide',
  SCROLL: 'scroll', // special state that assumes it's visible, and when it ticks
};

/**
 *
 * @param {string} s
 * @returns { { from: number, until: number }[] }
 */
function parse(s) {
  const dates = s.split(',').map((_) => _.trim());

  const isValid = (d) => d instanceof Date && !isNaN(d);

  return dates.map((_) => {
    const [a, b = Infinity] = _.split(/\s+/).map((_) => {
      if (_.trim() === '') return undefined;
      const d = new Date(_);

      if (!isValid(d)) {
        throw new Error(`Cannot parse the following timestamp: "${_}"`);
      }

      return d;
    });

    return { from: a.getTime(), until: b };
  });
}

/** @type {WhenDo[]} */
const whenables = [];

setInterval(() => {
  // FIXME - go through "whenables" in order of timestamp
  for (let i = 0; i < whenables.length; i++) {
    const when = whenables[i];
    const inRange = when.inRange();

    if (inRange) {
      when[when.what]();
    } else {
      when[when.what === DO_OPTIONS.HIDE ? DO_OPTIONS.SHOW : DO_OPTIONS.HIDE]();
    }
  }
}, 1000);

class WhenDo extends HTMLElement {
  state = undefined;
  triggered = false;
  #ready = false;

  constructor() {
    super();
  }

  connectedCallback() {
    this.init();
    whenables.push(this);
  }

  disconnectedCallback() {
    // remove `this` when-do from the watch list
    const index = whenables.indexOf(this);
    if (index > -1) {
      whenables.splice(index, 1);
    }
  }

  attributeChangedCallback() {
    this.init();
  }

  init() {
    this.what = this.attributes.what?.value || DO_OPTIONS.SHOW;

    if (
      ![DO_OPTIONS.SHOW, DO_OPTIONS.HIDE, DO_OPTIONS.SCROLL].includes(this.what)
    ) {
      throw new Error(
        `when-do "what" property requires either "show", "hide" or "scroll"`
      );
    }

    if (this.attributes.datetime?.value) {
      this.dates = parse(this.attributes.datetime.value);
    }

    // FIXME queue up the animations/scroll from boot time
    if (this.inRange()) {
      this[this.what]();
    } else {
      this[this.what === DO_OPTIONS.HIDE ? DO_OPTIONS.SHOW : DO_OPTIONS.HIDE]();
    }

    this.#ready = true
  }

  inRange() {
    const now = Date.now();

    let res = false;

    for (let i = 0; i < this.dates.length; i++) {
      const { from, until } = this.dates[i];
      if (now >= from && now < until) {
        res = true;
        break;
      }
    }

    return res;
  }

  checkTriggered() {
    if (this.triggered === false && this.#ready === true) {
      this.triggered = true;
      if (this.attributes.apply) {
        // let the DOM apply the style changes, then on the next tick, apply the class
        requestAnimationFrame(() => {
          this.classList.add(this.attributes.apply.value);
        });
      }
    }
  }

  scroll() {
    if (this.state === DO_OPTIONS.SCROLL) return; // nop
    this.show();
    let scrollTarget = this.firstElementChild || this.nextElementSibling || this.parentElement;
    scrollTarget.scrollIntoView({ behavior: 'smooth' });

    this.state = DO_OPTIONS.SCROLL;
    this.checkTriggered();
  }

  show() {
    if (this.state === DO_OPTIONS.SHOW) return; // nop
    this.setAttribute('style', 'display: contents');
    this.state = DO_OPTIONS.SHOW;
    this.checkTriggered();
  }

  hide() {
    if (this.state === DO_OPTIONS.HIDE) return; // nop
    this.setAttribute('style', 'display: none');
    this.state = DO_OPTIONS.HIDE;
    this.checkTriggered();
  }
}

customElements.define('when-do', WhenDo);
