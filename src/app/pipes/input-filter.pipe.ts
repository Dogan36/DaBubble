import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inputFilter',
  standalone: true
})
export class InputFilterPipe implements PipeTransform {

    transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter(it => {
      const nameIncludesSearchText = it['name'] && it['name'].toLocaleLowerCase().includes(searchText);
      const emailIncludesSearchText = it['email'] && it['email'].toLocaleLowerCase().includes(searchText);
      const isGuest = it['name'] && it['name'].toLocaleLowerCase().includes('guest');
      return (nameIncludesSearchText || emailIncludesSearchText) && !isGuest;
    });
  }
}
