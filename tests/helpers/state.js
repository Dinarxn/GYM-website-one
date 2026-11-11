/**
 * Finite State Machine (FSM) Transition Validator for UI states, forms, drawers, and showcase.
 */

class StateMachine {
  constructor(initialState, transitions = {}) {
    this.initialState = initialState;
    this.state = initialState;
    this.transitions = transitions; // e.g. { idle: ['validating', 'submitting'], submitting: ['success', 'error'] }
    this.history = [initialState];
  }

  can(targetState) {
    const allowed = this.transitions[this.state] || [];
    return allowed.includes(targetState);
  }

  transition(targetState) {
    if (!this.can(targetState)) {
      throw new Error(
        `Invalid transition: cannot transition from state "${this.state}" to "${targetState}". Allowed: [${(
          this.transitions[this.state] || []
        ).join(', ')}]`
      );
    }
    this.state = targetState;
    this.history.push(targetState);
    return this.state;
  }

  reset() {
    this.state = this.initialState;
    this.history = [this.initialState];
  }
}

function createContactFormFSM() {
  return new StateMachine('idle', {
    idle: ['validating', 'submitting', 'error'],
    validating: ['submitting', 'idle', 'error'],
    submitting: ['success', 'error'],
    success: ['idle'],
    error: ['idle', 'submitting', 'validating'],
  });
}

function createModalFSM() {
  return new StateMachine('closed', {
    closed: ['opening', 'open'],
    opening: ['open', 'closed'],
    open: ['closing', 'closed'],
    closing: ['closed', 'open'],
  });
}

function createDrawerFSM() {
  return new StateMachine('closed', {
    closed: ['open'],
    open: ['closed'],
  });
}

function createEquipmentFSM() {
  const items = ['barbell', 'dumbbell', 'plates', 'bench'];
  const transitions = {};
  for (const item of items) {
    transitions[item] = items.filter(x => x !== item);
  }
  return new StateMachine('barbell', transitions);
}

module.exports = {
  StateMachine,
  createContactFormFSM,
  createModalFSM,
  createDrawerFSM,
  createEquipmentFSM,
};
