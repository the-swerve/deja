var Emitter = require('emitter-component');
var domify = require('domify');
var assert = require('assert');
var deja = require('../');

suite('html');

describe('loops', function () {


	it("renders an array of strings using this", function() {
		var el = domify("<div><p dj-loop='ls' dj-text>this</p></div>");
		var ls = ['finn', 'jake'];
		var data = {ls: ls};
		deja.view(data).render(el);
		var els = el.childNodes;
		assert.equal(els.length - 1, ls.length);
		for (var i = 0; i < ls.length; ++i) {
			assert.equal(els[i].innerHTML, ls[i]);
		}
	});

	it("renders an array of strings using a named scope", function() {
		var el = domify("<div><p dj-loop='ls' dj-as='name' dj-text>name</p></div>");
		var ls = ['finn', 'jake'];
		var data = {ls: ls};
		deja.view(data).render(el);
		var els = el.childNodes;
		assert.equal(els.length - 1, ls.length);
		for (var i = 0; i < ls.length; ++i) {
			assert.equal(els[i].innerHTML, ls[i]);
		}
	});

	it("renders an array of objects", function() {
		var el = domify("<div><p dj-loop='buddies' dj-text>this.name</p></div>");
		var ls = [{name: 'Finn'}, {name: 'Jake'}];
		var data = {buddies: ls};
		deja.view(data).render(el);
		var els = el.childNodes;
		assert.equal(els.length - 1, ls.length);
		for (var i = 0; i < ls.length; ++i) {
			assert.equal(els[i].innerHTML, ls[i].name);
		}
	});

	it("renders nested loops", function() {
		var el = domify('<div><p dj-loop="nested"><i dj-loop="this.sub" dj-text>this</i></p></div>');
		var ls = [{sub: [1, 2]}, {sub: [3, 4]}];
		var data = {nested: ls};
		deja.view(data).render(el);
		var ps = el.childNodes;
		assert.equal(ps.length - 1, ls.length);
		for (var i = 0; i < ls.length; ++i) {
			var is = ps[i].childNodes;
			assert.equal(is.length - 1, ls[i].sub.length);
			for (var j = 0; j < ls[i].sub.length; ++j) {
				assert.equal(is[j].innerHTML, ls[i].sub[j]);
			}
		}
	});

	it("updates loops from events", function() {
		var el = domify("<div><p dj-loop='ls' dj-text>this</p></div>");
		var ls = ['finn', 'jake'];
		var data = {ls: ls};
		Emitter(data);
		deja.view(data).render(el);
		var els = el.childNodes;
		assert.equal(els.length - 1, ls.length);
		for (var i = 0; i < ls.length; ++i) {
			assert.equal(els[i].innerHTML, ls[i]);
		}
		ls = ['finn', 'flame princess'];
		data.ls = ls;
		data.emit('change ls');
		assert.equal(els.length - 1, ls.length);
		for (var i = 0; i < ls.length; ++i) {
			assert.equal(els[i].innerHTML, ls[i]);
		}
	});

	it("updates loops from events and lengthens the list", function() {
		var el = domify("<div><p dj-loop='ls' dj-text>this</p></div>");
		var ls = ['finn', 'jake'];
		var data = {ls: ls};
		Emitter(data);
		deja.view(data).render(el);
		var els = el.childNodes;
		assert.equal(els.length - 1, ls.length);
		for (var i = 0; i < ls.length; ++i) {
			assert.equal(els[i].innerHTML, ls[i]);
		}
		ls = ['finn', 'flame princess', 'ice king'];
		data.ls = ls;
		data.emit('change ls');
		assert.equal(els.length - 1, ls.length);
		for (var i = 0; i < ls.length; ++i) {
			assert.equal(els[i].innerHTML, ls[i]);
		}
	});

	it("updates loops from events and shortens the list", function() {
		var el = domify("<div><p dj-loop='ls' dj-text>this</p></div>");
		var ls = ['finn', 'jake'];
		var data = {ls: ls};
		Emitter(data);
		deja.view(data).render(el);
		var els = el.childNodes;
		assert.equal(els.length - 1, ls.length);
		for (var i = 0; i < ls.length; ++i) {
			assert.equal(els[i].innerHTML, ls[i]);
		}
		ls = ['finn'];
		data.ls = ls;
		data.emit('change ls');
		assert.equal(els.length - 1, ls.length);
		for (var i = 0; i < ls.length; ++i) {
			assert.equal(els[i].innerHTML, ls[i]);
		}
	});

	it("updates loops from events doesn't reset user-set DOM state", function() {
		var el = domify("<div><p dj-loop='ls' dj-text>this</p></div>");
		var ls = ['finn', 'jake'];
		var data = {ls: ls};
		Emitter(data);
		deja.view(data).render(el);
		var els = el.childNodes;
		assert.equal(els.length - 1, ls.length);
		for (var i = 0; i < ls.length; ++i) {
			assert.equal(els[i].innerHTML, ls[i]);
		}
		els[0].setAttribute('data-something', 'yes');
		ls = ['finn'];
		data.ls = ls;
		data.emit('change ls');
		assert.equal(els.length - 1, ls.length);
		for (var i = 0; i < ls.length; ++i) {
			assert.equal(els[i].innerHTML, ls[i]);
		}
		assert.equal(els[0].getAttribute('data-something'), 'yes');
	});

	it('unrenders and clears out memory', function() {
		var el = domify("<div><p dj-loop='ls' dj-text>this</p></div>");
		var ls = ['finn', 'jake'];
		var data = {ls: ls};
		Emitter(data);
		var view = deja.view(data)
		view.render(el);
		assert.equal(view.model.listeners('change ls').length, 1);
		view.unrender();
		assert.deepEqual(view.envs, []);
		assert.deepEqual(view.model.listeners('change ls'), []);
	});

});
