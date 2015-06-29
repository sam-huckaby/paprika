angular.module('paprika.services', [])

.factory('database.svc', ['$q', function($q) {
  // Instantiate service values here
  var db = new PouchDB('paprika_storage');

  // Watch for any changes to the Database
  db.changes({
      live: true,
      since: 'now',
      include_docs: true
    }).on('change', function (change) {
    if (change.deleted) {
      // change.id holds the deleted id
      //onDeleted(change.id);
    } else { // updated/inserted
      // change.doc holds the new doc
      //onUpdatedOrInserted(change.doc);
    }
    //console.log(change);
    //renderDocsSomehow();
  }).on('error', console.log.bind(console));

  return {
  	all: function () {
  		var defer = $q.defer();

  		db.allDocs({include_docs: true}).then(function (result) {
				var docs = result.rows.map(function (row) { return row.doc; });
				defer.resolve(docs);
			}).catch(function (error) {
				console.log('CouchDB Error', error);
				defer.reject(error);
			});

		  return defer.promise;

  	},
    // Add a list
    add: function (list) {
      // Build a promise to wait on
      var defer = $q.defer();

      db.put(list, list.title).then(function (response) {
        list._id = response.id;
        list._rev = response.rev;
        // Resolve the promise and return the newly populated list
        defer.resolve(list);
      }).catch(function (error) {
        // Reject the promise with the error
        defer.reject(error);
      });
      // Return the promise to the caller
      return defer.promise;
    },
    delete: function (list) {
      // Remove a list from the database
      db.remove(list);
    },
    update: function (list) {
      // Update a list in the database
      db.put(list, function (err, result) {
        console.log(err);
      });
    }
  };
}])

.factory('dataTypes.svc', ['$q', function($q) {
  // Build list of quantity types
  var qtyTypes = [
          {
              name: 'cnt',
              value: 'Count'
          },
          {
              name: 'oz',
              value: 'Ounce(s)'
          },
          {
              name: 'cup',
              value: 'Cup(s)'
          },
          {
              name: 'lb',
              value: 'Pound(s)'
          },
          {
              name: 'jar',
              value: 'Jar(s)'
          },
          {
              name: 'bag',
              value: 'Bag(s)'
          },
          {
              name: 'gal',
              value: 'Gallon(s)'
          },
          {
              name: 'pint',
              value: 'Pint(s)'
          },
          {
              name: 'tbls',
              value: 'Tablespoon(s)'
          }
      ],
      defaultIndex = 0;

  return {
    createList: function(listName) {
      // Create and return a new list object
      return {
        title: listName,
        created: (new Date()),
        items: []
      };
    },
    createItem: function(itemName) {
      // Create and return a new item object
      return {
        name: itemName,
        added: (new Date()),
        price: 0.00,
        collected: false,
        quantity: 1,
        type: qtyTypes[defaultIndex]
      };
    },
    qtyTypes: function() {
      return qtyTypes;
    }
  }
}]);

