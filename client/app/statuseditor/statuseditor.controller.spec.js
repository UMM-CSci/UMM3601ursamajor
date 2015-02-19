'use strict';

describe('Controller: StatuseditorCtrl', function () {

  // load the controller's module
  beforeEach(module('umm3601ursamajorApp'));
  beforeEach(module('socketMock'));


    var StatuseditorCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StatuseditorCtrl = $controller('StatuseditorCtrl', {
      $scope: scope
    });
  }));

  beforeEach(function() {
     scope.statusArray = [
         {
             strict: "Accepted",
             color: {red: 0, green: 255, blue: 0, alpha: 1},
             emailSubject: "URS submission update",
             emailBody:  ", Your URS submission has been approved, congratulations!",
             priority: 15,
             required: true
         },{
             strict: "Revisions Needed",
             color: {red: 0, green: 100, blue: 255, alpha: 1},
             emailSubject: "URS submission update",
             emailBody: ", Your URS submission has been flagged for revisions, and is in need of changes.",
             priority: 3,
             required: false
         },{
             strict: "Reviewing in Process",
             color: {red: 255, green: 220, blue: 10, alpha: 1},
             emailSubject: "URS submission update",
             emailBody: ", Your URS submission has been approved by your adviser.",
             priority: 2,
             required: false
         },{
             strict: "Awaiting Adviser Approval",
             color: {red: 255, green: 0, blue: 0, alpha: 1},
             emailSubject: "URS submission update",
             emailBody: ", Your URS submission is pending approval from your adviser.",
             priority: -15,
             required: true
         },{
             strict: "Withdrawn",
             color: {red: 70, green: 70, blue: 70, alpha: 1},
             emailSubject: "URS submission update",
             emailBody: ", Your URS submission has either been rejected by your adviser or been withdrawn.",
             priority: 14,
             required: true
         },{
         strict: "EmptyStaus",
         color: {red: 0, green: 0, blue: 0, alpha: 1},
         emailSubject: "",
         emailBody: "",
         priority: null,
         required: true
       }
     ]
  });


  it('should ...', function () {
    expect(1).toEqual(1);
  });

  it('A required status should be required', function() {
    expect(scope.requiredStatus(scope.statusArray[0])).toEqual(true);
  });

  it('A non-required status should be not required', function(){
    expect(scope.requiredStatus(scope.statusArray[1])).toEqual(false);
  })

  describe('status editor', function(){
    it('Status editor color' ,function(){
      expect(scope.statusEditorColor(scope.statusArray[1])).toEqual({'border-left': '4px solid rgb(0,100,255)'});
    });

    it('Status box color' ,function(){
      expect(scope.statusBoxColor(scope.statusArray[2].color)).toEqual({'background-color': 'rgb(255,220,10)'});
    });

    it('Color click' ,function(){
      expect(scope.colorClick(scope.statusArray[1], {red: 194, green: 194, blue: 194, alpha: 1})).toEqual();
    });

    it('selected color' ,function(){
      expect(scope.selectedColor(scope.statusArray[1], {red: 194, green: 194, blue: 194, alpha: 1})).toEqual(false);
      expect(scope.selectedColor(scope.statusArray[1], {red: 0, green: 100, blue: 255, alpha: 1})).toEqual(true);
    });

    it('Find empty priority' ,function(){
      expect(scope.findEmptyPriority(scope.statusArray)).toEqual(4);
    });
  });
})
