'use strict';

angular.module('umm3601ursamajorApp')
  .factory('Modal', function ($rootScope, $modal) {
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @return {Object}            - the instance $modal.open() returns
     */
    function openModal(scope, modalClass) {
        console.log("making new modal");
        console.log(modalClass);
      var modalScope = $rootScope.$new();
      scope = scope || {};
      modalClass = modalClass || 'modal-default';

      angular.extend(modalScope, scope);

      return $modal.open({
        templateUrl: 'components/modal/modal.html',
        windowClass: modalClass,
        scope: modalScope
      });
    }

    // Public API here
    return {

      /* Confirmation modals */
      confirm: {

          /**
           * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
           * @param  {Function} del - callback, ran when delete is confirmed
           * @return {Function}     - the function to open the modal (ex. myModalFn)
           */
          reject: function(del) {
              del = del || angular.noop;

              /**
               * Open a delete confirmation modal
               * @param  {String} name   - name or info to show on modal
               * @param  {All}           - any additional args are passed staight to del callback
               */
              return function() {
                  var args = Array.prototype.slice.call(arguments),
                      name = args.shift(),
                      rejectModal;

                  rejectModal = openModal({
                      modal: {
                          dismissable: true,
                          title: 'Confirm Submission Rejection',
                          html: '<p>Are you sure you want to reject <strong>' + name + '</strong> ?</p>',
                          buttons: [{
                              classes: 'btn-danger',
                              text: 'Confirm',
                              click: function(e) {
                                  rejectModal.close(e);
                              }
                          }, {
                              classes: 'btn-default',
                              text: 'Cancel',
                              click: function(e) {
                                  rejectModal.dismiss(e);
                              }
                          }]
                      }
                  }, 'modal-danger');

                  rejectModal.result.then(function(event) {
                      del.apply(event, args);
                  });
              };
          },

        /**
         * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param  {Function} del - callback, ran when delete is confirmed
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
        delete: function(del) {
          del = del || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed staight to del callback
           */
            return function() {
                var args = Array.prototype.slice.call(arguments),
                    name = args.shift(),
                    deleteModal;

                deleteModal = openModal({
                    modal: {
                        dismissable: true,
                        title: 'Confirm Delete',
                        html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
                        buttons: [{
                            classes: 'btn-danger',
                            text: 'Delete',
                            click: function(e) {
                                deleteModal.close(e);
                            }
                        }, {
                            classes: 'btn-default',
                            text: 'Cancel',
                            click: function(e) {
                                deleteModal.dismiss(e);
                            }
                        }]
                    }
                }, 'modal-danger');

                deleteModal.result.then(function(event) {
                    del.apply(event, args);
                });
            };
        },

        info: function(callback) {
            callback = callback || angular.noop;

            /**
             * Open an info confirmation modal
             * @param {String} content - text for the confirmation modal
             * @param {All}         - Any additional arguments are passed to the callback
             */
            return function() {
                var args = Array.prototype.slice.call(arguments),
                    content = args.shift(),
                    infoModal;

                infoModal = openModal({
                    modal: {
                        dismissable: true,
                        title: "Confirm",
                        html: '<p>' + content + '</p>',
                        buttons: [{
                            classes: 'btn-info',
                            text: 'OK',
                            click: function(e) {
                                infoModal.close(e);
                            }
                        }, {
                            classes:"btn-default",
                            text: "Cancel",
                            click: function(e) {
                                infoModal.dismiss(e);
                            }
                        }]
                    }
                }, 'modal-info');

                infoModal.result.then(function(event) {
                   callback.apply(event, args);
                });
            }
        },

          warning: function(callback){
              callback = callback || angular.noop;
              /**
               * Open an info confirmation modal
               * @param {String} content - text for the confirmation modal
               * @param {All}         - Any additional arguments are passed to the callback
               */
              return function() {
                  var args = Array.prototype.slice.call(arguments),
                      content = args.shift(),
                      warningModal;

                  warningModal = openModal({
                      modal: {
                          dismissable: true,
                          title: "Warning!",
                          html: '<p>' + content + '</p>',
                          buttons: [{
                              classes:"btn-default",
                              text: "OK",
                              click: function(e) {
                                  warningModal.dismiss(e);
                              }
                          }]
                      }
                  }, 'modal-warning');

                  warningModal.result.then(function(event) {
                      callback.apply(event, args);
                  });
              }
          },

          option: function(callbackYes, callbackNo){
              callbackYes = callbackYes || angular.noop;
              callbackNo = callbackNo || angular.noop;
              /**
               * Open an info confirmation modal
               * @param {String} content - text for the confirmation modal
               * @param {All}         - Any additional arguments are passed to the callback
               */
              return function() {
                  var args = Array.prototype.slice.call(arguments),
                      content = args.shift(),
                      optionModal;
                  var clicked = "?";

                  optionModal = openModal({
                      modal: {

                          dismissable: true,
                          title: "Confirm",
                          html: '<p>' + content + '</p>',
                          buttons: [{
                              classes: 'btn-info',
                              text: 'Yes',
                              click: function(e) {
                                  clicked = "yes";
                                  optionModal.close(e);
                              }
                          }, {
                              classes: 'btn-default',
                              text: 'No',
                              click: function(e) {
                                  clicked = "no";
                                  optionModal.close(e);
                              }
                          }, {
                              classes:"btn-default",
                              text: "Cancel",
                              click: function(e) {
                                  optionModal.dismiss(e);
                              }
                          }]
                      }
                  }, 'modal-info');

                  optionModal.result.then(function(event) {
                      if(clicked == "yes"){
                          callbackYes.apply(event, args);
                      } else {
                          callbackNo.apply(event, args);
                      }

                  });
              }
          }

      }
    };
  });
