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
      isAskable: function() {
        return this.requestedFloors[0] !== this.lastCalledFloor && this.requestedFloors.length < 4;
      },
      canOpen: function (n) {
        if (this.dir == 0 && this.floor == n && this.open === false) {
          return true;
        }
        return false;
      },
      requestedFloor: function() { return this.requestedFloors[this.requestedFloors.length - 1] },

      openDoor: function() { if(this.canOpen(this.floor)) this.open = true },
      call: function(n) {
        this.lastCalledFloor = n;
        if (this.isAskable()) {
          this.requestedFloors.unshift(this.lastCalledFloor);
          this.prepareMove();
        }
      },
      prepareMove: function() {
        floors[this.floor].light = "red";
        floors[this.lastCalledFloor].light = "green";
        this.open = false;
      },
      updateLights: function() {
        floors.forEach(function (floor,n) {
          floor.light = "red";
        });
        floors[this.lastCalledFloor].light = "green";
      },
      stepIn: function () { 
        if (this.dir === 0 && this.open) 
          this.occupied = true 
      },
      stepOut: function () { 
        if (this.dir === 0 && this.open) 
          this.occupied = false 
      },
      up: function() { 
        this.dir = 1; 
        this.floor += 1;
        this.updateLights();
      },
      down: function() { 
        this.dir = -1; 
        this.floor -= 1;
        this.updateLights();
      },
      stop: function() { this.requestedFloors = [] },


      dir: 0,
      floor: 3,
      requestedFloors: [],
      lastCalledFloor: null,
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
        car.call(n);
      },
      stop: function () {
        car.stop();
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
      floor.light = (n === car.floor) ? "green" : "";
    });

    var checkPosition = function() {
      if (car.floor > car.requestedFloor()) {
        car.down();
      } else if (car.floor < car.requestedFloor()) {
        car.up();
      } else {
        car.dir = 0;
        floors.forEach(function (floor,n) {
          floor.light = "";
        });
        floors[car.lastCalledFloor].light = "green";
        car.requestedFloors.pop();
      }
    }

    $interval(function () {
      checkPosition();
    }, 1000);
  }]);