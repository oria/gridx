(function(){
	var w = window,
		d = document,
		l = w.location,
		h = l.href,
		i = h.indexOf('?'),
		q = i > -1,
		a = 'LTR',
		b = 'RTL',
		p = q && h.substr(i + 1).split(/#/)[0].split(/&/)[0].split('='),	//LIMITATION: dir must be the first parameter...
		v = {
			LTR: b,
			RTL: a
		}[
			d.getElementsByTagName('html')[0].dir =
				p && p[0] == 'dir' &&
					(p[1] || '').replace(/[^\w]/g, '').toUpperCase() == b ?	//replace() to avoid XSS attack...
						b : a
		];
	p = d.createElement('a');
	p.innerHTML = "<button style='position:fixed;top:0;right:0;'>" + v + "</button>";
	p.firstChild.onclick = function(){
		l.href = (q ? h.substr(0, i) : h) + '?dir=' + v;
	};
	w.onload = function(){
		d.body.appendChild(p.firstChild);
	};
})();
