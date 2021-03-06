import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const { get, run, set } = Ember;

moduleForComponent('helper:bind', 'Integration | Helper | bind', {
  integration: true,

  beforeEach() {
    let testContext = this;
    function recordCall(...args) {
      set(testContext, 'context', this);
      set(testContext, 'arguments', args);
    }

    let submodel = { method: recordCall };
    let actions = { method: recordCall };
    let model = { method: recordCall, submodel, actions };

    this.set('model', model);
    this.set('method', recordCall);
    this.set('actions', actions);

    this.callAction = function() {
      run(() => this.$('button').click());
    }

    this.assertContext = function(assert, expectedContext, msg) {
      let actualContext = get(testContext, 'context');
      if (!msg) {
        msg = `Expected context ${expectedContext} but got ${actualContext}`;
      }
      assert.strictEqual(actualContext, expectedContext);
    };

    this.assertArguments = function(assert, expectedArguments, msg) {
      let actualArguments = get(testContext, 'arguments');
      if (!msg) {
        msg = `Expected arguments ${expectedArguments} but got ${actualArguments}`;
      }
      assert.deepEqual(actualArguments, expectedArguments);
    }
  }
});

test('it changes the context of a function, function: method, context: implicit this', function(assert) {
  this.render(hbs`<button {{action (bind method)}}>Click</button>`);

  this.callAction();

  this.assertContext(assert, this);
  this.assertArguments(assert, []);
});

test('it changes the context of a function, function: method, context: this', function(assert) {
  this.render(hbs`<button {{action (bind method target=this)}}>Click</button>`);

  this.callAction();

  this.assertContext(assert, this);
  this.assertArguments(assert, []);
});

test('it changes the context of a function, function: method, context: model.submodel', function(assert) {
  this.render(hbs`<button {{action (bind method target=model.submodel)}}>Click</button>`);

  this.callAction();

  this.assertContext(assert, get(this, 'model.submodel'));
  this.assertArguments(assert, []);
});

test('it changes the context of a function, function: model.method, context: implicit model', function(assert) {
  this.render(hbs`<button {{action (bind model.method)}}>Click</button>`);

  this.callAction();

  this.assertContext(assert, get(this, 'model'));
  this.assertArguments(assert, []);
});

test('it changes the context of a function, function: model.method, context: model', function(assert) {
  this.render(hbs`<button {{action (bind model.method target=model)}}>Click</button>`);

  this.callAction();

  this.assertContext(assert, get(this, 'model'));
  this.assertArguments(assert, []);
});

test('it changes the context of a function, function: model.method, context: model.submodel.', function(assert) {
  this.render(hbs`<button {{action (bind model.method target=model.submodel)}}>Click</button>`);

  this.callAction();

  this.assertContext(assert, get(this, 'model.submodel'));
  this.assertArguments(assert, []);
});

test('it changes the context of a function, function: model.submodel.method, context: implicit model.submodel.', function(assert) {
  this.render(hbs`<button {{action (bind model.submodel.method)}}>Click</button>`);

  this.callAction();

  this.assertContext(assert, get(this, 'model.submodel'));
  this.assertArguments(assert, []);
});

test('it changes the context of a function, function: model.submodel.method, context: model.submodel.', function(assert) {
  this.render(hbs`<button {{action (bind model.submodel.method target=model.submodel)}}>Click</button>`);

  this.callAction();

  this.assertContext(assert, get(this, 'model.submodel'));
  this.assertArguments(assert, []);
});

test('helper explicitly removes `actions` if it is the last part in a PathExpression, function: model.actions.myMethod, context: implicit model', function(assert) {
  this.render(hbs`<button {{action (bind model.actions.method 1)}}>Click</button>`);

  this.callAction();

  this.assertContext(assert, get(this, 'model'));
  this.assertArguments(assert, [1]);
});

test('helper explicitly removes `actions` if it is the last part in a PathExpression, function: actions.myMethod, context: implicit this', function(assert) {
  this.render(hbs`<button {{action (bind actions.method 1)}}>Click</button>`);

  this.callAction();

  this.assertContext(assert, this);
  this.assertArguments(assert, [1]);
});

test('it passes the extra argument to bind', function(assert) {
  this.render(hbs`<button {{action (bind model.submodel.method "adios")}}>Click</button>`);

  this.callAction();

  this.assertContext(assert, get(this, 'model.submodel'));
  this.assertArguments(assert, ['adios']);
});

test('it passes the extra argument to bind and keeps explicit target', function(assert) {
  this.render(hbs`<button {{action (bind model.submodel.method "adios" target=model)}}>Click</button>`);

  this.callAction();

  this.assertContext(assert, get(this, 'model'));
  this.assertArguments(assert, ['adios']);
});

test('it passes the extra arguments to bind', function(assert) {
  this.render(hbs`<button {{action (bind model.submodel.method "adios" 1 model)}}>Click</button>`);

  this.callAction();

  this.assertContext(assert, get(this, 'model.submodel'));
  this.assertArguments(assert, ['adios', 1, get(this, 'model')]);
});
