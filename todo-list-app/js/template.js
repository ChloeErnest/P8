var htmlEscapes = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	'\'': '&#x27;',
	'`': '&#x60;'
};

var escapeHtmlChar = function (chr) {
	return htmlEscapes[chr];
};

var reUnescapedHtml = /[&<>"'`]/g;
var reHasUnescapedHtml = new RegExp(reUnescapedHtml.source);

var escape = function (string) {
	return (string && reHasUnescapedHtml.test(string))
	? string.replace(reUnescapedHtml, escapeHtmlChar)
	: string;
};



export default class Template {
	/**
	* Sets up defaults for all the Template methods such as a default template
	*
	* @constructor
	*/
	constructor() {
		this.defaultTemplate
		=	'<li data-id="{{id}}" class="{{completed}}">'
		+		'<div class="view">'
		+			'<input class="toggle" type="checkbox" {{checked}}>'
		+			'<label>{{title}}</label>'
		+			'<button class="destroy"></button>'
		+		'</div>'
		+	'</li>';
	}
	
	show(data) {
		var i, l;
		var view = '';
		
		for (i = 0, l = data.length; i < l; i++) {
			var template = this.defaultTemplate;
			var completed = '';
			var checked = '';
			
			if (data[i].completed) {
				completed = 'completed';
				checked = 'checked';
			}
			
			template = template.replace('{{id}}', data[i].id);
			template = template.replace('{{title}}', escape(data[i].title));
			template = template.replace('{{completed}}', completed);
			template = template.replace('{{checked}}', checked);
			
			view = view + template;
		}
		
		return view;
	}
	
	itemCounter(activeTodos) {
		var plural = activeTodos === 1 ? '' : 's';
		return '<strong>' + activeTodos + '</strong> item' + plural + ' left';
	}
	clearCompletedButton(completedTodos) {
		if (completedTodos > 0) {
			return 'Clear completed';
		} else {
			return '';
		}
	}
}
