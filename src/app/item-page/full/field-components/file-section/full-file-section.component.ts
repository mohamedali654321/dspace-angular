import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  switchMap,
  tap,
} from 'rxjs/operators';
import {
  APP_CONFIG,
  AppConfig,
} from 'src/config/app-config.interface';

import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../../core/data/feature-authorization/feature-id';
import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { AppConfig, APP_CONFIG } from 'src/config/app-config.interface';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../../core/data/feature-authorization/feature-id';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { Item } from '../../../../core/shared/item.model';
import {
  hasValue,
  isEmpty,
} from '../../../../shared/empty.util';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { PaginationComponentOptions } from '../../../../shared/pagination/pagination-component-options.model';
import { followLink } from '../../../../shared/utils/follow-link-config.model';
import { FileSectionComponent } from '../../../simple/field-components/file-section/file-section.component';

/**
 * This component renders the file section of the item
 * inside a 'ds-metadata-field-wrapper' component.
 */

@Component({
  selector: 'ds-item-page-full-file-section',
  styleUrls: ['./full-file-section.component.scss'],
  templateUrl: './full-file-section.component.html',
})
export class FullFileSectionComponent extends FileSectionComponent implements OnDestroy, OnInit {

  @Input() item: Item;

  label: string;

  originals$: Observable<RemoteData<PaginatedList<Bitstream>>>;
  licenses$: Observable<RemoteData<PaginatedList<Bitstream>>>;

  originalOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'obo' + this.item?.id,
    currentPage: 1,
    pageSize: this.appConfig.item.bitstream.pageSize,
  });

  licenseOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'lbo' + this.item?.id,
    currentPage: 1,
    pageSize: this.appConfig.item.bitstream.pageSize,
  });

  constructor(
    bitstreamDataService: BitstreamDataService,
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService,
    protected paginationService: PaginationService,
    public dsoNameService: DSONameService,
    public authorizationService: AuthorizationDataService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    super(bitstreamDataService, notificationsService, translateService, dsoNameService, appConfig);
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void {
    this.originals$ = this.paginationService.getCurrentPagination(this.originalOptions.id, this.originalOptions).pipe(
      switchMap((options: PaginationComponentOptions) => this.bitstreamDataService.showableByItem(
        this.item.uuid,
        'ORIGINAL',
        [],
        { elementsPerPage: options.pageSize, currentPage: options.currentPage },
        true,
        true,
        followLink('format'),
        followLink('thumbnail'),
      )),
      tap((rd: RemoteData<PaginatedList<Bitstream>>) => {
        if (hasValue(rd.errorMessage)) {
          this.notificationsService.error(this.translateService.get('file-section.error.header'), `${rd.statusCode} ${rd.errorMessage}`);
        }
      },
      ),
    );

    this.licenses$ = this.paginationService.getCurrentPagination(this.licenseOptions.id, this.licenseOptions).pipe(
      switchMap((options: PaginationComponentOptions) => this.bitstreamDataService.showableByItem(
        this.item.uuid,
        'LICENSE',
        [],
        { elementsPerPage: options.pageSize, currentPage: options.currentPage },
        true,
        true,
        followLink('format'),
        followLink('thumbnail'),
      )),
      tap((rd: RemoteData<PaginatedList<Bitstream>>) => {
        if (hasValue(rd.errorMessage)) {
          this.notificationsService.error(this.translateService.get('file-section.error.header'), `${rd.statusCode} ${rd.errorMessage}`);
        }
      },
      ),
    );

  }

  hasValuesInBundle(bundle: PaginatedList<Bitstream>) {
    return hasValue(bundle) && !isEmpty(bundle.page);
  }

  hasNoDownload(bitstream: Bitstream) {
    return bitstream?.allMetadataValues('bitstream.viewer.provider').includes('nodownload');
  }

  canDownload(file: Bitstream): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.CanDownload, file.self);
  }

  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.originalOptions.id);
    this.paginationService.clearPagination(this.licenseOptions.id);
  }

}
