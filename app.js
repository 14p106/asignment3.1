var app = angular.module("NarrowItDownApp", []);

app.controller("NarrowItDownController", NarrowItDownController);

NarrowItDownController.$inject = ["$scope", "MenuSearchService"];

function NarrowItDownController($scope, MenuSearchService){
	$scope.enableItemShow = false;
	$scope.notFound = false;
	$scope.getItem = function(inputItem){
		$scope.foundItemsCtrl = [];
		MenuSearchService.getMatchedMenuItems(inputItem, function(response){
			 $scope.foundItemsCtrl = response;
			 if($scope.foundItemsCtrl.length > 0){
				$scope.notFound = false;
			 	$scope.enableItemShow = true;
			 }else if($scope.foundItemsCtrl.length === 0){
				$scope.notFound = true;
				$scope.enableItemShow = false;
			}

		});
		$scope.removeItemIndexFn = function(removeIndex){
			$scope.foundItemsCtrl.splice(removeIndex, 1);
		}

	};

}


app.service("MenuSearchService", MenuSearchService);

MenuSearchService.$inject = ["$http"];

function MenuSearchService($http){
		var getMatchedMenuItems =  function(data, callback){
			
		var foundItemsService = [];
			return $http.get("https://davids-restaurant.herokuapp.com/menu_items.json").then(function(result){
				angular.forEach(result.data.menu_items, function(value, key){
					
					if(value.name === data){
						foundItemsService.push(value);
					}
				});
				return callback(foundItemsService);
			});
		};
		return { getMatchedMenuItems: getMatchedMenuItems };
};


app.directive('foundItems', function () {
    return {        
        restrict: 'E',
        scope: {
        	foundItems : "=",
        	onRemove : "="
        },
        template: "<table><tr><th>Item Name</th><th>Item Price</th></tr><tr ng-repeat='foundItems in  foundItems track by $index'><td>{{foundItems.name}}</td><td>{{foundItems.price_large}}</td><td><button class='btn btn-primary' ng-click ='removeItem($index)'>Don't want this on</button></td></br><tr></table>",
        controller: function ($scope) {
            //$scope.$watch('foundItems', function(){
            	console.log("foundItems", $scope.foundItems);
            	$scope.removeItem = function(index){
            		$scope.onRemove(index);
            	}
            //})
        }
    };
});