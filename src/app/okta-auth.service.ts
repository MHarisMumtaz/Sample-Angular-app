import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as OktaAuth from '@okta/okta-auth-js';
import {Observable,Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OktaAuthService {

  private oktaAuth;
  private storageSub = new Subject<any>();

  constructor(private router:Router) { }

  getOidc(){
  	return {
		tokenManager : {
			storage  : "localStorage"
		},
		clientId	 : "0oafkl9qjigSbX0L90h7",
		issuer	 	 : "https://dev-803557.oktapreview.com/oauth2/default",
		redirectUri  : "http://localhost:4200/implicit/callback",
		scope        : "openid email",
		url		     : "https://dev-803557.oktapreview.com"
	}
  }

  initOktaConfig(){
  	this.oktaAuth = new OktaAuth(this.getOidc());
  }

  isAuthenticated() :boolean {
  	if(!this.oktaAuth) {
  		this.initOktaConfig();
  	}
    // Checks if there is a current accessToken in the TokenManger.
    return !!this.oktaAuth.tokenManager.get('accessToken');
  }

  async handleAuthentication() {
  	if(!this.oktaAuth) {
  		this.initOktaConfig();
  	}
    try{
        const tokens = await this.oktaAuth.token.parseFromUrl();
        tokens.forEach(token => {
          if (token.idToken) {
            this.oktaAuth.tokenManager.add('idToken', token);
            this.storageSub.next({
              isAuth : this.isAuthenticated()
            });
          }
          if (token.accessToken) {
            this.oktaAuth.tokenManager.add('accessToken', token);
            this.storageSub.next({
              isAuth : this.isAuthenticated()
            });
          }
          this.router.navigate(['/home']);
        });
    }catch(e){
      switch (e.errorCode) {
        case "access_denied":
          this.storageSub.next({
            isAuth : false,
            isAccessDenied : true
          });
          break;
        case "INTERNAL":
          this.router.navigate(['/home']);
         break;
        default:
          // code...
          break;
      }
      console.log(e);
    }
  }

  login() {
  	if(!this.oktaAuth) {
  		this.initOktaConfig();
  	}
    // Launches the login redirect.
    this.oktaAuth.token.getWithRedirect({
      responseType: ['id_token', 'token'],
      scopes: ['openid', 'email', 'profile']
    });
  }

  async logout() {
    this.oktaAuth.tokenManager.clear();
    await this.oktaAuth.signOut();
  }
}
