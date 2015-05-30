import {
	ComponentAnnotation as Component, 
	ViewAnnotation as View, 
	NgFor,
	bootstrap
} from 'angular2/angular2';

import {angularfire} from 'angularfire';

import { NameList } from 'services/NameList';



@Component({
    selector: 'sample-app',
    //services: [
    //    AngularFire,
    //    bind(Firebase).toValue(new Firebase('https://dazzling-torch-8123.firebaseio.com'))
    //]
})

@View({
	templateUrl: './templates/sample-app.html',
	directives: [NgFor]
})

class SampleApp {

    constructor() {
        this.names = NameList.get();
        this.newName = '';
 
    }
    addName(newname) {
        this.names.push(newname.value);
        newname.value = '';
    }

    removeName(name) {
        var index = this.names.indexOf(name);
        name !== -1 && this.names.splice(index, 1);
    }
}



export function main(){
	bootstrap(SampleApp);
}

