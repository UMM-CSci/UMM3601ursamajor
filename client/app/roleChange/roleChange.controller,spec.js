'use strict';

describe('Controller: RoleChangeCtrl', function () {

  // load the controller's module
  beforeEach(module('umm3601ursamajorApp'));
  beforeEach(module('socketMock'));


  var RoleChangeCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RoleChangeCtrl = $controller('RoleChangeCtrl', {
      $scope: scope
    });
  }));

  beforeEach(function() {

    scope.filterSelection = "All";
    scope.filterRoleOptions =
      [
        'All',
        'chair',
        'reviewer',
        'admin',
        'user'
      ];

    scope.roleOptions =
      [
        'chair',
        'reviewer',
        'admin',
        'user'
      ];

    scope.groupOptions =
      [
        1,
        2,
        3,
        4
      ];

    scope.users =
    [
     {
      name: "Mark Lehet",
      email: "lehet005@morris.umn.edu",
      provider: "google",
      google: {
        hd: "morris.umn.edu",
        locale: "en",
        gender: "male",
        picture: "https://lh6.googleusercontent.com/-ismwlkS7xqs/AAAAAAAAAAI/AAAAAAAAABI/j0NXKAx-4GU/photo.jpg",
        link: "https://plus.google.com/102737466880551658774",
        family_name: "Lehet",
        given_name: "Mark",
        name: "Mark Lehet",
        verified_email: true,
        email: "lehet005@morris.umn.edu",
        id: "102737466880551658774"
      },
      group: -1,
      role: "user",
      __v: 0
     }, {
      name: "Maggie Casale",
      email: "casal033@morris.umn.edu",
      tShirtSize: "Small",
      provider: "google",
      google: {
        hd: "morris.umn.edu",
        locale: "en",
        gender: "female",
        picture: "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg",
        link: "https://plus.google.com/116234824364241021424",
        family_name: "Casale",
        given_name: "Maggie",
        name: "Maggie Casale",
        verified_email: true,
        email: "casal033@morris.umn.edu",
        id: "116234824364241021424"
      },
      group: 2,
      role: "chair",
      __v: 0
     }
    ]
  });


  it('should ...', function () {
    expect(1).toEqual(1);
  });

  describe('role change functions', function(){
    it('check is admin' ,function(){
      expect(scope.userIsAdmin(scope.users[0])).toEqual(false);
      scope.users[0].role = "admin";
      expect(scope.userIsAdmin(scope.users[0])).toEqual(true);

    });

    it('check is reviewer' ,function(){
      expect(scope.userIsReviewer(scope.users[1])).toEqual(false);
      scope.users[1].role = "reviewer";
      expect(scope.userIsReviewer(scope.users[1])).toEqual(true);

    });

    it('check is user' ,function(){
      expect(scope.userIsUser(scope.users[0])).toEqual(true);
      expect(scope.userIsUser(scope.users[1])).toEqual(false);

    });

    it('testing filters depending on role' ,function(){
      expect(scope.filterByUser(scope.users[0])).toEqual(true);
      scope.filterSelection = "reviewer";
      expect(scope.filterByUser(scope.users[0])).toEqual(false);
      scope.users[0].role = "reviewer";
      expect(scope.filterByUser(scope.users[0])).toEqual(true);
      scope.filterSelection = "chair";
      expect(scope.filterByUser(scope.users[0])).toEqual(false);
      scope.users[0].role = "chair";
      expect(scope.filterByUser(scope.users[0])).toEqual(true);
      scope.filterSelection = "user";
      expect(scope.filterByUser(scope.users[0])).toEqual(false);
      scope.users[0].role = "user";
      expect(scope.filterByUser(scope.users[0])).toEqual(true);
      scope.filterSelection = "admin";
      expect(scope.filterByUser(scope.users[0])).toEqual(false);
      scope.users[0].role = "admin";
      expect(scope.filterByUser(scope.users[0])).toEqual(true);
      scope.filterSelection = "Something that would never ever really be chosen for a filter.";
      expect(scope.filterByUser(scope.users[0])).toEqual(false);
    });
  });
})
