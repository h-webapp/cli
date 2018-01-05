import { Application } from 'webapp-core';
Application.app('test-app').service('caseService',function () {
    this.getCase = function () {
        console.log('test');
    }
});