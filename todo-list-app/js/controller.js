	/**
	* Takes a model and view and acts as the controller between them
	*
	* @constructor
	*/
	export default class Controller {
		/** 
		* @param {object} model The model instance
		* @param {object} view The view instance
		*/
		constructor(model, view) {
			var self = this;
			self.model = model;
			self.view = view;
			
			self.view.bind('newTodo', function (title) {
				self.addItem(title);
			});
			
			self.view.bind('itemEdit', function (item) {
				self.editItem(item.id);
			});
			
			self.view.bind('itemEditDone', function (item) {
				self.editItemSave(item.id, item.title);
			});
			
			self.view.bind('itemEditCancel', function (item) {
				self.editItemCancel(item.id);
			});
			
			self.view.bind('itemRemove', function (item) {
				self.removeItem(item.id);
			});
			
			self.view.bind('itemToggle', function (item) {
				self.toggleComplete(item.id, item.completed);
			});
			
			self.view.bind('removeCompleted', function () {
				self.removeCompletedItems();
			});
			
			self.view.bind('toggleAll', function (status) {
				self.toggleAll(status.completed);
			});
		}
		
		/**
		* Loads and initialises the view
		*
		* @param {string} locationHash '' | 'active' | 'completed'
		*/
		setView(locationHash) {
			var route = locationHash.split('/')[1];
			var page = route || '';
			this._updateFilterState(page);
		}
		
		/**
		* An event to fire on load. Will get all items and display them in the
		* todo-list
		*/
		showAll() {
			var self = this;
			self.model.read(function (data) {
				self.view.render('showEntries', data);
			});
		}
		
		/**
		* Renders all active tasks
		*/
		showActive() {
			var self = this;
			self.model.read({ completed: false }, function (data) {
				self.view.render('showEntries', data);
			});
		}
		
		/**
		* Renders all completed tasks
		*/
		showCompleted() {
			var self = this;
			self.model.read({ completed: true }, function (data) {
				self.view.render('showEntries', data);
			});
		}
		
		/**
		* An event to fire whenever you want to add an item. Simply pass in the event
		* object and it'll handle the DOM insertion and saving of the new item.
		*/
		addItem(title) {
			var self = this;
			
			if (title.trim() === '') {
				return;
			}
			
			self.model.create(title, function () {
				self.view.render('clearNewTodo');
				self._filter(true);
			});
		}
		
		/*
		* Triggers the item editing mode.
		*/
		editItem(id) {
			var self = this;
			self.model.read(id, function (data) {
				self.view.render('editItem', {id: id, title: data[0].title});
			});
		}
		
		editItemSave(id, title) {
			var self = this;
			
			title = title.trim();
			
			if (title.length !== 0) {
				self.model.update(id, {title: title}, function () {
					self.view.render('editItemDone', {id: id, title: title});
				});
			} else {
				self.removeItem(id);
			}
		}
		
		
		/*
		* Cancels the item editing mode.
		*/
		editItemCancel(id) {
			var self = this;
			self.model.read(id, function (data) {
				self.view.render('editItemDone', {id: id, title: data[0].title});
			});
		}
		
		/**
		* By giving it an ID it'll find the DOM element matching that ID,
		* remove it from the DOM and also remove it from storage.
		*
		* @param {number} id The ID of the item to remove from the DOM and
		* storage
		*/
		removeItem(id) {
			var self = this;

			self.model.remove(id, function () {
				self.view.render('removeItem', id);
			});
			
			self._filter();
		}
		
		
		/**
		* Will remove all completed items from the DOM and storage.
		*/
		removeCompletedItems() {
			var self = this;
			self.model.read({ completed: true }, function (data) {
				data.forEach(function (item) {
					self.removeItem(item.id);
				});
			});
			
			self._filter();
		}
		
		/**
		* Give it an ID of a model and a checkbox and it will update the item
		* in storage based on the checkbox's state.
		*
		* @param {number} id The ID of the element to complete or uncomplete
		* @param {object} completed The checkbox to check the state of complete
		*                          or not
		* @param {boolean|undefined} silent Prevent re-filtering the todo items
		*/
		toggleComplete(id, completed, silent) {
			var self = this;
			self.model.update(id, { completed: completed }, function () {
				self.view.render('elementComplete', {
					id: id,
					completed: completed
				});
			});
			
			if (!silent) {
				self._filter();
			}
		}
		
		/**
		* Will toggle ALL checkboxes' on/off state and completeness of models.
		* Just pass in the event object.
		*/
		toggleAll(completed) {
			var self = this;
			self.model.read({ completed: !completed }, function (data) {
				data.forEach(function (item) {
					self.toggleComplete(item.id, completed, true);
				});
			});
			
			self._filter();
		}
		
		/**
		* Updates the pieces of the page which change depending on the remaining
		* number of todos.
		*/
		_updateCount() {
			var self = this;
			self.model.getCount(function (todos) {
				self.view.render('updateElementCount', todos.active);
				self.view.render('clearCompletedButton', {
					completed: todos.completed,
					visible: todos.completed > 0
				});
				
				self.view.render('toggleAll', {checked: todos.completed === todos.total});
				self.view.render('contentBlockVisibility', {visible: todos.total > 0});
			});
		}
		
		/**
		* Re-filters the todo items, based on the active route.
		* @param {boolean|undefined} force  forces a re-painting of todo items.
		*/
		_filter(force) {
			var activeRoute = this._activeRoute.charAt(0).toUpperCase() + this._activeRoute.substr(1);
			
			// Update the elements on the page, which change with each completed todo
			this._updateCount();
			
			// If the last active route isn't "All", or we're switching routes, we
			// re-create the todo item elements, calling:
			//   this.show[All|Active|Completed]();
			if (force || this._lastActiveRoute !== 'All' || this._lastActiveRoute !== activeRoute) {
				this['show' + activeRoute]();
			}
			
			this._lastActiveRoute = activeRoute;
		}
		
		
		/**
		* Simply updates the filter nav's selected states
		*/
		_updateFilterState(currentPage) {
			this._activeRoute = currentPage;
			
			if (currentPage === '') {
				this._activeRoute = 'All';
			}
			
			this._filter();
			
			this.view.render('setFilter', currentPage);
		}
	}
	