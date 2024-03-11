import { ITEM_NAMES } from './itemConstants';

export class Item {
  name: string;
  sellIn: number; // number of days we have to sell the item
  quality: number; // how valubale the item is

  // Note: the end of each day the system lowers both of the above values

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    for (let item of this.items) {
      if (item.name === ITEM_NAMES.SULFURAS) {
        this.updateSulfuras(item);
      } else if (item.name === ITEM_NAMES.AGED_BRIE) {
        this.updateAgedBrie(item);
      } else if (item.name === ITEM_NAMES.BACKSTAGE_PASSES) {
        this.updateBackstagePass(item);
      } else if (item.name.startsWith(ITEM_NAMES.CONJURED)) { // Assuming all conjured items start with "Conjured"
          this.updateConjuredItem(item);
      } else {
        this.updateNormalItem(item);
      }
      this.enforceQualityBounds(item);
    }
    return this.items;
  }

  updateConjuredItem(item: Item) {
    if (item.quality > 0) {
      item.quality -= 2; // Degrading twice for a day
    }
  
    item.sellIn -= 1;
  
    this.degradeQualityByValue(item, 2); // Additional call to degradeQualityByValue to ensure it degrades twice as fast after sell by date
  }

  updateSulfuras(item: Item) {
    // Sulfuras does not change, as its a legendary item that never has to be sold or decreases in Quality
  }

  updateAgedBrie(item: Item) {
    if (item.quality < 50) {
      item.quality += 1;
    }

    item.sellIn -= 1;
    this.degradeQualityByValue(item, 1)
  }

  updateBackstagePass(item: Item) {
    if (item.quality < 50) {
      item.quality += 1;
      if (item.sellIn < 11) {
        item.quality += 1;
      }
      if (item.sellIn < 6) {
        item.quality += 1;
      }
    }

    item.sellIn -= 1;

    if (item.sellIn < 0) {
      item.quality = 0;
    }
  }

  updateNormalItem(item: Item) {
    if (item.quality > 0) {
      item.quality -= 1;
    }

    item.sellIn -= 1;

    this.degradeQualityByValue(item, 1)
  }

  degradeQualityByValue(item: Item, degradeValue: number) {
    // degrade quality twice as fast if sell by date has passed
    if (item.sellIn < 0 && item.quality > 0) {
      item.quality -= degradeValue;
    }
  }

  enforceQualityBounds(item: Item) {
    if (item.quality < 0) {
      item.quality = 0;
    } else if (item.quality > 50 && item.name !== ITEM_NAMES.SULFURAS) {
      item.quality = 50;
    }
  }
}
