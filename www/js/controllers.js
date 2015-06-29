angular.module('paprika.controllers', [])

/*
 * Controller to handle the listing of all lists. (Mwahahaha!)
*/
.controller('ListsPageCtrl', ['$scope', '$state', '$ionicPopup', '$ionicListDelegate', 'database.svc', 'dataTypes.svc',
    function($scope, $state, $ionicPopup, $ionicListDelegate, dbSvc, dataSvc) {

    $scope.shouldShowDelete = false; // Toggle Delete icons
    $scope.shouldShowReorder = false; // Toggle reorder ability - TODO: add this in someday
    $scope.listCanSwipe = true; // Toggle Swipe to Edit ability
    $scope.lists = []; // Populate the lists with an empty array by default
    $scope.loading = true; // Watch to see when data finishes loading

    // Retrieve the list of all lists from the Database
    dbSvc.all().then(function(results) {
        $scope.lists = results;
    }, function (error) {
        console.log('Failed To Retrieve Lists', error);
    }).finally(function() {
        $scope.loading = false;
    });

    // Do list modification tasks here.
    $scope.deleteList = function (list) {
        // Confirm whether the user intentionally clicked delete
        var deleteConfirm = $ionicPopup.confirm({
            title: 'Delete List?',
            template: 'Are you sure you want to delete \''+list.title+'\'?'
        });
        deleteConfirm.then(function(res) {
            if(res) {
                // Delete list from the Database
                dbSvc.delete(list);
                // Delete list from the UI
                for(var i = 0; i < $scope.lists.length; i++)
                {
                    if($scope.lists[i]._id === list._id)
                    {
                        $scope.lists.splice(i, 1);
                    }
                }
            } else {
                // User decided not to delete the list
                $ionicListDelegate.closeOptionButtons();
            }
        });
    }

    // Change to the edit state, and pass the id of the list to edit
    $scope.editList = function (list) {
        $ionicListDelegate.closeOptionButtons();
        $state.go('paprika.lists.edit', { list: list });
    }

    $scope.createList = function (list) {
        $scope.data = {}

        // An elaborate, custom popup
        var createPrompt = $ionicPopup.show({
        template: '<input type="text" ng-model="data.listName">',
        title: 'List Name?',
        /*subTitle: 'Please use normal things',*/
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.listName) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.data.listName;
              }
            }
          }
        ]
        });
        createPrompt.then(function(res) {
            // Create a new list and add a blank item
            var newList = dataSvc.createList(res);
            newList.items.push(dataSvc.createItem(''));
            
            // Add the new list to the database, and update the list with _id and _rev
            dbSvc.add(newList).then(function (list) {
                // Add the new list to the UI
                $scope.lists.push(list);
                console.log(list);
                // Navigate to the edit page
                $state.go('paprika.lists.edit', { 
                    list: list
                });
            });

            
        });
    }

    // Change to the view state, and pass the id of the list to view
    $scope.viewList = function (list) {
        $ionicListDelegate.closeOptionButtons();
        $state.go('paprika.lists.view', { list: list });
    }

    /* THIS MAY BE ADDED BACK IN AT A LATER TIME
    $scope.reorderList = function (list, fromIndex, toIndex) {
        $scope.lists.splice(fromIndex, 1);
        $scope.lists.splice(toIndex, 0, list);
    }*/
}])

/*
 * Controller to handle the edit state.
*/
.controller('editListCtrl', ['$scope', '$stateParams', '$timeout', 'database.svc', 'dataTypes.svc', 
    function($scope, $stateParams, $timeout, dbSvc, dataSvc) {
    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = false;
    var initializing = true;

    // Retrieve the list form the params passed by the list view
    $scope.list = $stateParams.list;
    $scope.quantities = dataSvc.qtyTypes();

    // Do list modification tasks here.
    $scope.deleteItem = function (index) {
        $scope.list.items.splice(index, 1);
        // Do actual list removal here.
    }

    $scope.reorderList = function (list, fromIndex, toIndex) {
        $scope.lists.splice(fromIndex, 1);
        $scope.lists.splice(toIndex, 0, list);
    }

    $scope.addItem = function () {
        var newItem = dataSvc.createItem('');
        $scope.list.items.unshift(newItem);
    }

    $scope.$watch('list', function(newValue, oldValue) {
        if(initializing)
        {
            $timeout(function() { initializing = false; });
        } else {
            dbSvc.update(newValue);
        }
    }, true); // This is a recursive watch
}])

/*
 * Controller to handle the view state.
*/
.controller('viewListCtrl', ['$scope', '$stateParams', '$timeout', 'database.svc', function($scope, $stateParams, $timeout, dbSvc) {
    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = false;
    var initializing = true;

    // Retrieve the list from the parent state
    $scope.list = $stateParams.list;

    $scope.$watch('list', function(newValue, oldValue) {
        if(initializing)
        {
            $timeout(function() { initializing = false; });
        } else {
            dbSvc.update(newValue);
        }
    }, true); // This is a recursive watch

}])

.controller('StatsPageCtrl', ['$scope', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
}]);
