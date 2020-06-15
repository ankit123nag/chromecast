import { Injectable, NgZone } from '@angular/core';

declare var chrome: any;

@Injectable()
export class CastService {
  ngZone: any;

  session: any = null;
  initialized: boolean = false;

  constructor(zone: NgZone) {
    this.ngZone = zone;

    if (!this.initialized) {
      window['__onGCastApiAvailable'] = function (loaded: any, errorInfo: any) {
        if (loaded) {
          this.initializeCastApi();
        } else {
          console.log(errorInfo);
        }
      }.bind(this);
    }
  }

  initializeCastApi() {
    var applicationID = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
    var sessionRequest = new chrome.cast.SessionRequest(applicationID);
    var apiConfig = new chrome.cast.ApiConfig(sessionRequest, this.sessionListener, this.receiverListener);
    chrome.cast.initialize(apiConfig, this.onInitSuccess, this.onInitError);
  };

  sessionListener(e) {
    this.session = e;
    console.log('New session');
    if (this.session.media.length != 0) {
      console.log('Found ' + this.session.media.length + ' sessions.');
    }
  }

  receiverListener(e) {
    if (e === 'available') {
      console.log("Chromecast was found on the network.");
    }
    else {
      console.log("There are no Chromecasts available.");
    }
  }

  onInitSuccess() {
    console.log("Initialization succeeded");
  }

  onInitError() {
    console.log("Initialization failed");
  }

  launchApp() {
    console.log("Launching the Chromecast App...");
    chrome.cast.requestSession(this.onRequestSessionSuccess, this.onLaunchError);
  }

  onLaunchError() {
    console.log("Error connecting to the Chromecast.");
  }

  onRequestSessionSuccess(e) {
    console.log("Successfully created session: " + e.sessionId);
    this.session = e;
    this.loadMedia();
  }

  loadMedia() {
    if (!this.session) {
      console.log("No session.");
      return;
    }

    var mediaInfo = new
      chrome.cast.media.MediaInfo('http://i.imgur.com/IFD14.jpg');
    mediaInfo.contentType = 'image/jpg';

    var request = new chrome.cast.media.LoadRequest(mediaInfo);
    request.autoplay = true;

    this.session.loadMedia(request, this.onLoadSuccess, this.onLoadError);
  }

  onLoadSuccess() {
    console.log('Successfully loaded image.');
  }

  onLoadError() {
    console.log('Failed to load image.');
  }

  stopApp() {
    this.session.stop(this.onStopAppSuccess, this.onStopAppError);
  }

  onStopAppSuccess() {
    console.log('Successfully stopped app.');
  }

  onStopAppError() {
    console.log('Error stopping app.');
  }
}