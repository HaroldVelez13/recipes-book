import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { en_US, NZ_I18N, NzI18nService } from 'ng-zorro-antd/i18n';

registerLocaleData(en);

@NgModule({
  declarations: [],
  imports: [],
  providers: [{ provide: NZ_I18N, useValue: en_US }, NzI18nService],
  exports: [],
})
export class NgZorroModule {}
