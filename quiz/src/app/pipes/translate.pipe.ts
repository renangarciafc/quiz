// translate.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'translateEnPt'
})
export class TranslateEnPtPipe implements PipeTransform {

  constructor(private translationService: TranslationService) {}

  transform(value: string): Observable<string> {
    return this.translationService.translate([value], 'en', 'pt').pipe(
      catchError(error => {
        console.error(error);
        return of('error');
      }
    )
  )
  }
}