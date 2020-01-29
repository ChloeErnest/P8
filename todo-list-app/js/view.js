/*global qs, qsa, $on, $parent, $delegate */
import {qs, qsa, $on, $delegate, $parent} from "./helpers.js";

/**
* View that abstracts away the browser's DOM completely.
* It has two simple entry points:
*
*   - bind(eventName, handler)
*     Takes a todo application event and registers the handler
*   - render(command, parameterObject)
*     Renders the given command with the options
*/
export default class View {
	/**
	* creates a new view from the next template instance
	* 
	* @param {Template} template 
	*/
	constructor(template) {
		this.template = template;
		
		this.ENTER_KEY = 13;
		this.ESCAPE_KEY = 27;
		
		this.$todoList = qs('.todo-list');
		this.$todoItemCounter = qs('.todo-count');
		this.$clearCompleted = qs('.clear-completed');
		this.$main = qs('.main');
		this.$footer = qs('.footer');
		this.$toggleAll = qs('.toggle-all');
		this.$newTodo = qs('.new-todo');
	}
	
	/**
	* Removes a todo from the model
	*
	* @param {string} id The ID of the todo to remove
	*/	
	removeItem(id) {
		var elem = qs('[data-id="' + id + '"]');
		
		if (elem) {
			this.$todoList.removeChild(elem);
		}
	}
	
	/**
	* Removes a todo from the todolist
	*
	* @param {string} id The ID of the todo to remove
	*/	
	_removeItem(id) {
		var elem = qs('[data-id="' + id + '"]');
		
		if (elem) {
			this.$todoList.removeChild(elem);
		}
	}
	
	/**
	* Generate clear button
	*
	* @param {number} completedCount Number of todos completed
	* @param {boolean} visible If we see the button or not
	*/	
	_clearCompletedButton(completedCount, visible) {
		this.$clearCompleted.innerHTML = this.template.clearCompletedButton(completedCount);
		this.$clearCompleted.style.display = visible ? 'block' : 'none';
	}
	
	/**
	* update selected filter visually
	*
	* @param {string} currentPage Current page where applicate filter
	*/	
	_setFilter(currentPage) {
		qs('.filters .selected').className = '';
		qs('.filters [href="#/' + currentPage + '"]').className = 'selected';
	}
	
	/**
	* Visually update the status of a todo
	*
	* @param {number} id Id of the current todo
	* @param {boolean} completed If it's completed or not
	*/	
	_elementComplete(id, completed) {
		var listItem = qs('[data-id="' + id + '"]');
		
		if (!listItem) {
			return;
		}
		
		listItem.className = completed ? 'completed' : '';
		
		// In case it was toggled from an event and not by clicking the checkbox
		qs('input', listItem).checked = completed;
	}
	
	/**
	* Initiate item editing
	*
	* @param {number} id If of the todo to edit
	* @param {string} title Title of the edited todo
	*/	
	_editItem(id, title) {
		var listItem = qs('[data-id="' + id + '"]');
		
		if (!listItem) {
			return;
		}
		
		listItem.className = listItem.className + ' editing';
		
		var input = document.createElement('input');
		input.className = 'edit';
		
		listItem.appendChild(input);
		input.focus();
		input.value = title;
	}
	
	/**
	* To stop editing a given todo
	*
	* @param {number} id If of the current todo
	* @param {string} title Title of the edited todo
	*/	
	_editItemDone(id, title) {
		var listItem = qs('[data-id="' + id + '"]');
		
		if (!listItem) {
			return;
		}
		
		var input = qs('input.edit', listItem);
		listItem.removeChild(input);
		
		listItem.className = listItem.className.replace('editing', '');
		
		qsa('label', listItem).forEach(function (label) {
			label.textContent = title;
		});
	}
	
	/**
	* To update view depending on a command
	*
	* @param {string} viewCmd name of the command
	* @param {object} parameter a parameter to pass to the command
	*/	
	render(viewCmd, parameter) {
		var self = this;
		var viewCommands = {
			showEntries: function () {
				self.$todoList.innerHTML = self.template.show(parameter);
			},
			removeItem: function () {
				self._removeItem(parameter);
			},
			updateElementCount: function () {
				self.$todoItemCounter.innerHTML = self.template.itemCounter(parameter);
			},
			clearCompletedButton: function () {
				self._clearCompletedButton(parameter.completed, parameter.visible);
			},
			contentBlockVisibility: function () {
				self.$main.style.display = self.$footer.style.display = parameter.visible ? 'block' : 'none';
			},
			toggleAll: function () {
				self.$toggleAll.checked = parameter.checked;
			},
			setFilter: function () {
				self._setFilter(parameter);
			},
			clearNewTodo: function () {
				self.$newTodo.value = '';
			},
			elementComplete: function () {
				self._elementComplete(parameter.id, parameter.completed);
			},
			editItem: function () {
				self._editItem(parameter.id, parameter.title);
			},
			editItemDone: function () {
				self._editItemDone(parameter.id, parameter.title);
			}
		};
		
		viewCommands[viewCmd]();
	}
	
	/**
	* Return parent's id
	*
	* @param {object} element a html element
	* @return {number} the id of the parent todo
	*/	
	_itemId(element) {
		var li = $parent(element, 'li');
		return parseInt(li.dataset.id, 10);
	}
	
	/**
	* defines a callback for handling the end of the edition of a todo
	* 
	* @param {function} handler callback which takes a todo in argument
	*/
	_bindItemEditDone(handler) {
		var self = this;
		$delegate(self.$todoList, 'li .edit', 'blur', function () {
			if (!this.dataset.iscanceled) {
				handler({
					id: self._itemId(this),
					title: this.value
				});
			}
		});
		
		
		$delegate(self.$todoList, 'li .edit', 'keypress', function (event) {
			if (event.keyCode === self.ENTER_KEY) {
				// Remove the cursor from the input when you hit enter just like if it
				// were a real form
				this.blur();
			}
		});
	}
	
	/**
	* Add a callback to the escape key to cancel edition
	*
	* @param {function} handler binds a callback to cancel edit
	*/	
	_bindItemEditCancel(handler) {
		var self = this;
		$delegate(self.$todoList, 'li .edit', 'keyup', function (event) {
			if (event.keyCode === self.ESCAPE_KEY) {
				this.dataset.iscanceled = true;
				this.blur();
				
				handler({id: self._itemId(this)});
			}
		});
	}
	
	/**
	* binds custom events to the view
	*
	* @param {string} event event's name
	* @param {function} handler event's callback
	*/	
	bind(event, handler) {
		var self = this;
		if (event === 'newTodo') {
			$on(self.$newTodo, 'change', function () {
				handler(self.$newTodo.value);
			});
			
		} else if (event === 'removeCompleted') {
			$on(self.$clearCompleted, 'click', function () {
				handler();
			});
			
		} else if (event === 'toggleAll') {
			$on(self.$toggleAll, 'click', function () {
				handler({completed: this.checked});
			});
			
		} else if (event === 'itemEdit') {
			$delegate(self.$todoList, 'li label', 'dblclick', function () {
				handler({id: self._itemId(this)});
			});
			
		} else if (event === 'itemRemove') {
			$delegate(self.$todoList, '.destroy', 'click', function () {
				handler({id: self._itemId(this)});
			});
			
		} else if (event === 'itemToggle') {
			$delegate(self.$todoList, '.toggle', 'click', function () {
				handler({
					id: self._itemId(this),
					completed: this.checked
				});
			});
			
		} else if (event === 'itemEditDone') {
			self._bindItemEditDone(handler);
			
		} else if (event === 'itemEditCancel') {
			self._bindItemEditCancel(handler);
		}
	}
	
	
}
