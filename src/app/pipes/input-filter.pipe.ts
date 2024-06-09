import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inputFilter',
  standalone: true
})
export class InputFilterPipe implements PipeTransform {

  /**
   * First items and searchText are checked if they have values. Than items are checked if searchText is included inside items and returns all included items
   * 
   * @param items - array of objects
   * @param searchText - input value
   * @returns 
   */
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
