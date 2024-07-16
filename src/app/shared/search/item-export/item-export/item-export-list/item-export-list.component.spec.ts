import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { SearchManager } from '../../../../../core/browse/search-manager';
import { PaginationService } from '../../../../../core/pagination/pagination.service';
import { DSpaceObject } from '../../../../../core/shared/dspace-object.model';
import { Item } from '../../../../../core/shared/item.model';
import { SearchManager } from '../../../../../core/browse/search-manager';
import { SearchOptions } from '../../../models/search-options.model';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../../../remote-data.utils';
import { UUIDService } from '../../../../../core/shared/uuid.service';
import { getMockUUIDService } from '../../../../mocks/uuid.service.mock';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../../../remote-data.utils';
import { PaginationServiceStub } from '../../../../testing/pagination-service.stub';
import { SearchObjects } from '../../../models/search-objects.model';
import { SearchOptions } from '../../../models/search-options.model';
import { ItemExportListComponent } from './item-export-list.component';

describe('ItemExportListComponent', () => {
  let component: ItemExportListComponent;
  let fixture: ComponentFixture<ItemExportListComponent>;

  const paginationService = new PaginationServiceStub();
  const mockDso = Object.assign(new Item(), {
    metadata: {
      'dc.title': [
        {
          language: 'en_US',
          value: 'Item nr 1',
        },
      ],
    },
    _links: {
      self: {
        href: 'selfLink1',
      },
    },
  });

  const mockDso2 = Object.assign(new Item(), {
    metadata: {
      'dc.title': [
        {
          language: 'en_US',
          value: 'Item nr 2',
        },
      ],
    },
    _links: {
      self: {
        href: 'selfLink2',
      },
    },
  });
  const mockSearchResults: SearchObjects<DSpaceObject> = Object.assign(new SearchObjects(), {
    page: [mockDso, mockDso2],
  });
  const mockSearchResultsRD = createSuccessfulRemoteDataObject(mockSearchResults);

  const mockSearchManager = jasmine.createSpyObj('SearchManager', {
    search: jasmine.createSpy('search'),
  });

  const searchOptions = new SearchOptions({});

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemExportListComponent ],
      providers: [
        { provide: PaginationService, useValue: paginationService },
        { provide: SearchManager, useValue: mockSearchManager },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemExportListComponent);
    component = fixture.componentInstance;
    component.searchOptions = searchOptions;
    mockSearchManager.search.and.returnValue(createSuccessfulRemoteDataObject$(mockSearchResults));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.resultsRD$.value).toEqual(mockSearchResultsRD);
  });
});
