/*
*
* https://stackoverflow.com/questions/23542153/implementing-a-hermite-curve
* taken reference from the C++ code
*
* */
var HermiteCurve = undefined;

(function () {
    "use strict";

    HermiteCurve = function HermiteCurve(point) {
        // The point data should be of the form [P0, P1, D1, D2]
        // and each of P0,P1,D0,D2 should be of the form [x, y, z]
        this.P0 = point[0];
        this.P1 = point[1];
        this.D0 = point[2];
        this.D1 = point[3];
    }
    HermiteCurve.prototype.hermite = function (x) {
        return [
               2*x*x*x-3*x*x+1,
               x*x*x-2*x*x+x,
               -2*x*x*x+3*x*x,
               x*x*x-x*x
               ];
    }
    HermiteCurve.prototype.hermiteDerivative = function (x) {
        return [
               6*x*x-6*x,
               3*x*x-4*x+1,
               -6*x*x+6*x,
               3*x*x-2*x
               ];
    }
    HermiteCurve.prototype.value = function (x) {
        var a = this.hermite(x);
        var result=twgl.v3.mulScalar(this.P0,a[0]);
        twgl.v3.add(twgl.v3.mulScalar(this.D0,a[1]),result,result);
        twgl.v3.add(twgl.v3.mulScalar(this.P1,a[2]),result,result);
        twgl.v3.add(twgl.v3.mulScalar(this.D1,a[3]),result,result);
        return result;
    }
    HermiteCurve.prototype.dtValue = function (x) {
        var a = this.hermiteDerivative(x);
        var result=twgl.v3.mulScalar(this.P0,a[0]);
        twgl.v3.add(twgl.v3.mulScalar(this.D0,a[1]),result,result);
        twgl.v3.add(twgl.v3.mulScalar(this.P1,a[2]),result,result);
        twgl.v3.add(twgl.v3.mulScalar(this.D1,a[3]),result,result);
        return result;
    }
})();