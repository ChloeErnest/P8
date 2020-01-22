export default class Store {
	/**
	* Creates a new client side storage object and will create an empty
	* collection if no collection already exists.
	*
	* @param {string} name The name of our DB we want to use
	* @param {function} callback Our fake DB uses callbacks because in
	* real life you probably would be making AJAX calls
	*/
	constructor(name, callback) {
		callback = callback || function () {};
		
		this._dbName = name;
		
		if (!localStorage[name]) {
			var data = {
				todos: []
			};
			
			localStorage[name] = JSON.stringify(data);
		}
		
		callback.call(this, JSON.parse(localStorage[name]));
	}
	
	find(query, callback) {
		if (!callback) {
			return;
		}
		
		var todos = JSON.parse(localStorage[this._dbName]).todos;
		
		callback.call(this, todos.filter(function (todo) {
			for (var q in query) {
				if (query[q] !== todo[q]) {
					return false;
				}
			}
			return true;
		}));
	}
	
	/**
	* Will retrieve all data from the collection
	*
	* @param {function} callback The callback to fire upon retrieving data
	*/
	findAll(callback) {
		callback = callback || function () {};
		callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
	}
	
	save(updateData, callback, id) {
		var data = JSON.parse(localStorage[this._dbName]);
		var todos = data.todos;
		
		callback = callback || function () {};
		
		var newId = 0;
		if (todos.length > 0) {
			newId = todos[todos.length - 1].id + 1;
		}
		
		// If an ID was actually given, find the item and update each property
		if (id) {
			for (var i = 0; i < todos.length; i++) {
				if (todos[i].id === id) {
					for (var key in updateData) {
						todos[i][key] = updateData[key];
					}
					break;
				}
			}
			
			localStorage[this._dbName] = JSON.stringify(data);
			callback.call(this, todos);
		} else {
			
			// Assign an ID
			updateData.id = newId;
			
			
			todos.push(updateData);
			localStorage[this._dbName] = JSON.stringify(data);
			callback.call(this, [updateData]);
		}
	}
	
	remove(id, callback) {
		var data = JSON.parse(localStorage[this._dbName]);
		var todos = data.todos;
		var todoId;
		
		for (var i = 0; i < todos.length; i++) {
			if (todos[i].id == id) {
				todoId = todos[i].id;
			}
		}
		
		for (var i = 0; i < todos.length; i++) {
			if (todos[i].id == todoId) {
				todos.splice(i, 1);
			}
		}
		
		localStorage[this._dbName] = JSON.stringify(data);
		callback.call(this, todos);
	}
	
	drop(callback) {
		var data = {todos: []};
		localStorage[this._dbName] = JSON.stringify(data);
		callback.call(this, data.todos);
	}
}