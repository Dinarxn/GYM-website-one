/**
 * Mock timers, matchMedia, and environment testing helpers.
 */

class MockTimers {
  constructor() {
    this.originalSetTimeout = global.setTimeout;
    this.originalClearTimeout = global.clearTimeout;
    this.originalDateNow = Date.now;
    this.currentTime = 0;
    this.timers = new Map();
    this.nextId = 1;
    this.active = false;
  }

  install() {
    if (this.active) return;
    this.active = true;
    this.currentTime = 1000000;

    global.setTimeout = (callback, delay = 0, ...args) => {
      const id = this.nextId++;
      this.timers.set(id, {
        callback,
        runAt: this.currentTime + delay,
        args,
      });
      return id;
    };

    global.clearTimeout = (id) => {
      this.timers.delete(id);
    };

    Date.now = () => this.currentTime;
  }

  advanceBy(ms) {
    if (!this.active) return;
    const targetTime = this.currentTime + ms;

    while (this.currentTime < targetTime) {
      // Find nearest timer
      let nextTimer = null;
      let nextId = null;
      for (const [id, timer] of this.timers.entries()) {
        if (timer.runAt <= targetTime) {
          if (!nextTimer || timer.runAt < nextTimer.runAt) {
            nextTimer = timer;
            nextId = id;
          }
        }
      }

      if (!nextTimer) {
        this.currentTime = targetTime;
        break;
      }

      this.currentTime = nextTimer.runAt;
      this.timers.delete(nextId);
      try {
        nextTimer.callback(...nextTimer.args);
      } catch (err) {
        console.error('Error in mock timer callback:', err);
      }
    }
    this.currentTime = targetTime;
  }

  restore() {
    if (!this.active) return;
    global.setTimeout = this.originalSetTimeout;
    global.clearTimeout = this.originalClearTimeout;
    Date.now = this.originalDateNow;
    this.timers.clear();
    this.active = false;
  }
}

function createMatchMediaMock(initialMatches = {}) {
  const listeners = new Map();

  return function matchMedia(query) {
    let matches = false;
    if (query in initialMatches) {
      matches = initialMatches[query];
    } else if (query === '(prefers-reduced-motion: reduce)') {
      matches = Boolean(initialMatches.reducedMotion);
    } else if (query === '(pointer: coarse)') {
      matches = Boolean(initialMatches.touch);
    } else if (query === '(prefers-contrast: more)') {
      matches = Boolean(initialMatches.highContrast);
    }

    if (!listeners.has(query)) {
      listeners.set(query, []);
    }

    return {
      matches,
      media: query,
      addEventListener: (type, cb) => {
        if (type === 'change') listeners.get(query).push(cb);
      },
      removeEventListener: (type, cb) => {
        const list = listeners.get(query) || [];
        const idx = list.indexOf(cb);
        if (idx !== -1) list.splice(idx, 1);
      },
      dispatchEvent: (e) => {
        const list = listeners.get(query) || [];
        list.forEach(cb => cb(e));
      },
    };
  };
}

module.exports = {
  MockTimers,
  createMatchMediaMock,
};
