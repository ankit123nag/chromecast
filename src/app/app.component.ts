import { Component } from '@angular/core';
import { CastService } from './cast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Chromecast';

  constructor(private _cast: CastService) { }

  castMe() {
    this._cast.launchApp();
  }
}
