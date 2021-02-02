import { waitForAsync, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { of as observableOf } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { SubmissionEditComponent } from './submission-edit.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { SubmissionService } from '../submission.service';
import { SubmissionServiceStub } from '../../shared/testing/submission-service.stub';
import { getMockTranslateService } from '../../shared/mocks/translate.service.mock';

import { RouterStub } from '../../shared/testing/router.stub';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { mockSubmissionObject } from '../../shared/mocks/submission.mock';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import {CollectionDataService} from '../../core/data/collection-data.service';

describe('SubmissionEditComponent Component', () => {

  let comp: SubmissionEditComponent;
  let fixture: ComponentFixture<SubmissionEditComponent>;
  let submissionServiceStub: SubmissionServiceStub;
  let router: RouterStub;

  const submissionId = '826';
  const route: ActivatedRouteStub = new ActivatedRouteStub();
  const submissionObject: any = mockSubmissionObject;
  const collectionDataService: any = jasmine.createSpyObj('collectionDataService', {
    findById: jasmine.createSpy('findById'),
    getAuthorizedCollectionByCommunity: jasmine.createSpy('getAuthorizedCollectionByCommunity'),
    getAuthorizedCollectionByCommunityAndEntityType: jasmine.createSpy('getAuthorizedCollectionByCommunityAndEntityType')
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: ':id/edit', component: SubmissionEditComponent, pathMatch: 'full' },
        ])
      ],
      declarations: [SubmissionEditComponent],
      providers: [
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        { provide: CollectionDataService, useValue: collectionDataService },
        { provide: TranslateService, useValue: getMockTranslateService() },
        { provide: Router, useValue: new RouterStub() },
        { provide: ActivatedRoute, useValue: route },

      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionEditComponent);
    comp = fixture.componentInstance;
    submissionServiceStub = TestBed.inject(SubmissionService as any);
    router = TestBed.inject(Router as any);
  });

  afterEach(() => {
    comp = null;
    fixture = null;
    router = null;
  });

  it('should init properly when a valid SubmissionObject has been retrieved', fakeAsync(() => {

    route.testParams = { id: submissionId };
    submissionServiceStub.retrieveSubmission.and.returnValue(
      createSuccessfulRemoteDataObject$(submissionObject)
    );

    fixture.detectChanges();

    expect(comp.submissionId).toBe(submissionId);
    expect(comp.collectionId).toBe(submissionObject.collection.id);
    expect(comp.selfUrl).toBe(submissionObject._links.self.href);
    expect(comp.sections).toBe(submissionObject.sections);
    expect(comp.submissionDefinition).toBe(submissionObject.submissionDefinition);

  }));

  it('should redirect to mydspace when an empty SubmissionObject has been retrieved', fakeAsync(() => {

    route.testParams = { id: submissionId };
    submissionServiceStub.retrieveSubmission.and.returnValue(createSuccessfulRemoteDataObject$({})
    );

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalled();

  }));

  it('should not has effects when an invalid SubmissionObject has been retrieved', fakeAsync(() => {

    route.testParams = { id: submissionId };
    submissionServiceStub.retrieveSubmission.and.returnValue(observableOf(null));

    fixture.detectChanges();

    expect(router.navigate).not.toHaveBeenCalled();
    expect(comp.collectionId).toBeUndefined();
    expect(comp.selfUrl).toBeUndefined();
    expect(comp.sections).toBeUndefined();
    expect(comp.submissionDefinition).toBeUndefined();
  }));

});
