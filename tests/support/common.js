var dojoConfig = {
	parseOnLoad: true,
	isDebug: true,
	locale: 'en-us',
	extraLocale: ['ja-jp'],
	packages: [
		{
			name: 'chai',
			location: '../gridx/node_modules/chai'
		},
		{
			name: 'mocha',
			location: '../gridx/node_modules/mocha'
		},

	]
};

function runCase(){
	if(!window.caseName || !window.require){
		return;
	}
	var casePath = 'gridx/tests/unit/' + window.caseName;
	require([
			'mocha/mocha',
			'chai/chai',
	], function(mocha, chai){
		if(mocha === 'not-a-module'){
			mocha = window.mocha;
		}

		mocha.setup('bdd');
		require([casePath], function(){
			mocha.run();
			console.log(1);
		});

		// console.log(mocha);
		// console.log(window.mocha);
		// console.log(chai);
	});
}

(function(){
	var w = window,
		d = document,
		l = w.location,
		h = l.href,
		i = h.indexOf('?'),
		q = i > -1,
		b = 'RTL',
		p = q && h.substr(i + 1).split(/#/)[0].split(/&/)[0].split('='),	//LIMITATION: dir must be the first parameter...
		v = d.getElementsByTagName('html')[0].dir = 
			p && p[0] == 'dir' &&
					(p[1] || '').replace(/[^\w]/g, '').toUpperCase() == b ?	//replace() to avoid XSS attack...
						b : '';
	v = v == b ? '' : b;
	p = d.createElement('a');
	p.innerHTML = "<button type='button' style='position:fixed;top:0;right:0;width:5em;'>" + (v || 'LTR') + "</button>";
	p.firstChild.onclick = function(){
		l.href = (q ? h.substr(0, i) : h) + (v && '?dir=' + v);
	};
	var testButton = document.createElement('button');
	testButton.id = 'run_test';
	testButton.innerHTML = 'run test';
	testButton.setAttribute('style', 'position:fixed;top:0;right:5em');
	testButton.onclick = function(){
		runCase();
		console.log(123);
	};

	var mochaDiv = document.createElement('div');
	mochaDiv.id = 'mocha';
	w.onload = function(){
		d.body.appendChild(p.firstChild);
		d.body.appendChild(testButton);
		d.body.appendChild(mochaDiv);
	};
})();
