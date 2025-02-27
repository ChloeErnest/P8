/**
* Creates a new client side storage object and will create an empty
* collection if no collection already exists.
*
* 
*/
export default class Store {
	/**
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
	
	/**
	* Finds items based on a query given as a JS object
	*
	* @param {object} query The query to match against (i.e. {foo: 'bar'})
	* @param {function} callback	 The callback to fire when the query has
	* completed running
	*
	* @example
	* db.find({foo: 'bar', hello: 'world'}, function (data) {
		*	 // data will return any items that have foo: bar and
		*	 // hello: world in their properties
		* });
		*/
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
		
		/**
		* Will retrieve all data from the collection
		*
		* @param {function} callback The callback to fire upon retrieving data
		*/
		findAll(callback) {
			callback = callback || function () {};
			callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
		}
		
		/**
		* Will save the given data to the DB. If no item exists it will create a new
		* item, otherwise it'll simply update an existing item's properties
		*
		* @param {object} updateData The data to save back into the DB
		* @param {function} callback The callback to fire after saving
		* @param {number} id An optional param to enter an ID of an item to update
		*/	
		save(updateData, callback, id) {
			var data = JSON.parse(localStorage[this._dbName]);
			var todos = data.todos;
			
			callback = callback || function () {};
			
			var newId = 1;
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
		
		/**
		* Will remove an item from the Store based on its ID
		*
		* @param {number} id The ID of the item you want to remove
		* @param {function} callback The callback to fire after saving
		*/	
		remove(id, callback) {
			var data = JSON.parse(localStorage[this._dbName]);
			var todos = data.todos;

			for (var i = 0; i < todos.length; i++) {
				if (todos[i].id == id) {
					todos.splice(i, 1);
				}
			}
			
			localStorage[this._dbName] = JSON.stringify(data);
			callback.call(this, todos);
		}
		
	}