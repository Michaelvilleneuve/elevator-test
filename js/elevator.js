angular.module("elevator", []).
  controller("ElevatorCtrl", ["$scope", "$interval", function ($scope, $interval) {
    // Object representing the car
    var car = $scope.car = {
      active: function (n) {
        return this.floor == n;
      },
      state: function () {
        var r = this.occupied ? "Occpd " : "Empty ";
        switch (this.dir) {
          case -1: r += "↑↑↑↑"; break;
          case  1: r += "↓↓↓↓"; break;
          case  0: r += this.open ? "OPEN" : "STOP";
        }
        return r;
      },
      isAskable: function(floor) {
        return this.requestedFloors[0] !== floor.n && this.requestedFloors.length < 4;
      },
      isBeforeRequestedFloor: function(floor) {
        return floor.n > this.floor && floor.n < this.requestedFloor || floor.n < this.floor && floor.n > this.requestedFloor;
      },
      canOpen: function (n) {
        if(this.dir == 0 && this.floor == n) {
          return true;
        }
        return false;
      },
      call: function(floor) {
        if (this.isAskable(floor)) {
          if (this.isBeforeRequestedFloor(floor)) {
            this.requestedFloors.unshift(floor.n);
          } else {
            this.requestedFloors.unshift(floor.n);
            this.open = false;
          }
        }
      },
      stepIn: function () { 
        if (this.dir === 0 && this.open) 
          this.occupied = true 
      },
      stepOut: function () { 
        if (this.dir === 0 && this.open) 
          this.occupied = false 
      },
      up: function() { this.dir = 1; this.floor += 1 },
      down: function() { this.dir = -1; this.floor -= 1 },
      requestedFloor: function() { return this.requestedFloors[this.requestedFloors.length - 1] },
      openDoor: function() { if(this.dir == 0) this.open = true },

      dir: 0,
      floor: 3,
      requestedFloors: [],
      open: false,
      occupied: false
    }

    // Object representing the control panel in the car
    $scope.panel = {
      btnClass: function (n) {
        // This can be used to emulate a LED light near or inside the button
        // to give feedback to the user.
        return null;
      },
      press: function (n) {
      },
      stop: function () {
      }
    }

    // Floors
    var floors = $scope.floors = [];
    for (var i=10; i>0; i--) floors.push({title:i});
    floors.push({title:"G"});

    // Let's have them know their indices. Zero-indexed, from top to bottom.
    // Also let's initialize them.
    floors.forEach(function (floor,n) {
      floor.n = n;
      floor.open = false;
      floor.light = null;
    });

    var checkPosition = function() {
      if (car.floor > car.requestedFloor()) {
        car.down();
      } else if (car.floor < car.requestedFloor()) {
        car.up();
      } else {
        car.dir = 0;
        car.requestedFloors.pop();
      }
      console.log(car);
    }
    $interval(function () {
      checkPosition();
    }, 1000);
  }]);
