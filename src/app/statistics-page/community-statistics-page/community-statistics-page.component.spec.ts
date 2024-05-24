import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { UsageReport } from '../../core/statistics/models/usage-report.model';
import { SharedModule } from '../../shared/shared.module';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { Community } from '../../core/shared/community.model';
import { UsageReportDataService } from '../../core/statistics/usage-report-data.service';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { StatisticsTableComponent } from '../statistics-table/statistics-table.component';
import { CommunityStatisticsPageComponent } from './community-statistics-page.component';
import { ComponentFixture, TestBed, waitForAsync, } from '@angular/core/testing';
import { ActivatedRoute, Router, } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '../../core/auth/auth.service';

describe('CommunityStatisticsPageComponent', () => {

  let component: CommunityStatisticsPageComponent;
  let de: DebugElement;
  let fixture: ComponentFixture<CommunityStatisticsPageComponent>;

  beforeEach(waitForAsync(() => {

    const activatedRoute = {
      data: observableOf({
        scope: createSuccessfulRemoteDataObject(
          Object.assign(new Community(), {
            id: 'community_id',
          }),
        ),
      }),
    };

    const router = {
    };

    const usageReportService = {
      getStatistic: (scope, type) => undefined,
    };

    spyOn(usageReportService, 'getStatistic').and.callFake(
      (scope, type) => observableOf(
        Object.assign(
          new UsageReport(), {
            id: `${scope}-${type}-report`,
            points: [],
          },
        ),
      ),
    );

    const nameService = {
      getName: () => observableOf('test dso name'),
    };

    const authService = jasmine.createSpyObj('authService', {
      isAuthenticated: observableOf(true),
      setRedirectUrl: {},
    });

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        CommonModule,
        SharedModule,
      ],
      declarations: [
        CommunityStatisticsPageComponent,
        StatisticsTableComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: router },
        { provide: UsageReportDataService, useValue: usageReportService },
        { provide: DSpaceObjectDataService, useValue: {} },
        { provide: DSONameService, useValue: nameService },
        { provide: AuthService, useValue: authService },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityStatisticsPageComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
