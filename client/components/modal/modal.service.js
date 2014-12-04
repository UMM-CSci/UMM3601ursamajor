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
          cc: function(del) {
              del = del || angular.noop;

              return function() {
                  var args = Array.prototype.slice.call(arguments),
                    //  name = args.shift(),
                      ccModal;

                  ccModal = openModal({
                      modal: {
                          dismissable: true,
                          title: 'Confirm CC',
                          html: '<p>Would you like to receive email updates about this submission?</p>',
                          buttons: [{
                              classes: 'btn-success',
                              text: 'Yes',
                              click: function(e) {
                                  ccModal.close(e);
                              }
                          }, {
                              classes: 'btn-warning',
                              text: 'No',
                              click: function(e) {
                                  ccModal.dismiss(e);
                              }
                          }, {
                              classes: 'btn-primary',
                              text: 'Cancel',
                              click: function(e) {
                                 ccModal.dismiss(e);
                              }
                          }]
                      }
                  }, 'modal-danger');

                  ccModal.result.then(function(event) {
                      del.apply(event, args);
                  });
              };
          }
      }
    };
  });
