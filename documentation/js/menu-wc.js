'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">dabubble documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChannelBoardComponent.html" data-type="entity-link" >ChannelBoardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChatBoardComponent.html" data-type="entity-link" >ChatBoardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConfirmationOverlayComponent.html" data-type="entity-link" >ConfirmationOverlayComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogAddChannelComponent.html" data-type="entity-link" >DialogAddChannelComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogEditChannelComponent.html" data-type="entity-link" >DialogEditChannelComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogShowProfilComponent.html" data-type="entity-link" >DialogShowProfilComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogUserMenuComponent.html" data-type="entity-link" >DialogUserMenuComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogUserProfilComponent.html" data-type="entity-link" >DialogUserProfilComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditMsgTextareaComponent.html" data-type="entity-link" >EditMsgTextareaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ForgotPasswordComponent.html" data-type="entity-link" >ForgotPasswordComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ImprintComponent.html" data-type="entity-link" >ImprintComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link" >LoginComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MainPageComponent.html" data-type="entity-link" >MainPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MessageLeftComponent.html" data-type="entity-link" >MessageLeftComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MessageRightComponent.html" data-type="entity-link" >MessageRightComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NewMsgBoardComponent.html" data-type="entity-link" >NewMsgBoardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PrivacyPolicyComponent.html" data-type="entity-link" >PrivacyPolicyComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ResetPasswordComponent.html" data-type="entity-link" >ResetPasswordComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SearchInputComponent.html" data-type="entity-link" >SearchInputComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SearchMemberInputComponent.html" data-type="entity-link" >SearchMemberInputComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SignupComponent.html" data-type="entity-link" >SignupComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SignuppictureComponent.html" data-type="entity-link" >SignuppictureComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StartAnimationComponent.html" data-type="entity-link" >StartAnimationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StartingPageComponent.html" data-type="entity-link" >StartingPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TextareaMainPageComponent.html" data-type="entity-link" >TextareaMainPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ThreadBoardComponent.html" data-type="entity-link" >ThreadBoardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TimeSeparatorComponent.html" data-type="entity-link" >TimeSeparatorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UploadFormComponent.html" data-type="entity-link" >UploadFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WorkspaceMenuComponent.html" data-type="entity-link" >WorkspaceMenuComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WorkspaceUserProfilComponent.html" data-type="entity-link" >WorkspaceUserProfilComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Channel.html" data-type="entity-link" >Channel</a>
                            </li>
                            <li class="link">
                                <a href="classes/Chat.html" data-type="entity-link" >Chat</a>
                            </li>
                            <li class="link">
                                <a href="classes/Message.html" data-type="entity-link" >Message</a>
                            </li>
                            <li class="link">
                                <a href="classes/PrivateChat.html" data-type="entity-link" >PrivateChat</a>
                            </li>
                            <li class="link">
                                <a href="classes/Reaction.html" data-type="entity-link" >Reaction</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AnimationStateService.html" data-type="entity-link" >AnimationStateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChannelService.html" data-type="entity-link" >ChannelService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChatService.html" data-type="entity-link" >ChatService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EventService.html" data-type="entity-link" >EventService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FileUploadService.html" data-type="entity-link" >FileUploadService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GuestUserService.html" data-type="entity-link" >GuestUserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoginService.html" data-type="entity-link" >LoginService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OverlayService.html" data-type="entity-link" >OverlayService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResetPasswordService.html" data-type="entity-link" >ResetPasswordService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SearchService.html" data-type="entity-link" >SearchService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Message.html" data-type="entity-link" >Message</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#pipes-links"' :
                                'data-bs-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/InputFilterPipe.html" data-type="entity-link" >InputFilterPipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});