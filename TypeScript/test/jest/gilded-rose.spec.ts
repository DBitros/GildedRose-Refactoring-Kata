import { Item, GildedRose } from '@/gilded-rose';
import { ITEM_NAMES } from '@/itemConstants';

describe('GildedRose', () => {
  describe('updateQuality', () => {
    it('should decrease the quality and sellIn values for normal items', () => {
      const gildedRose = new GildedRose([new Item(ITEM_NAMES.NORMAL, 10, 20)]);
      const items = gildedRose.updateQuality();
      expect(items[0].sellIn).toBe(9);
      expect(items[0].quality).toBe(19);
    });

    it('should degrade quality twice as fast once the sell by date has passed', () => {
      const gildedRose = new GildedRose([new Item(ITEM_NAMES.NORMAL, 0, 20)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(18);
    });

    it('should not decrease the quality of an item to a negative value', () => {
      const gildedRose = new GildedRose([new Item(ITEM_NAMES.NORMAL, 10, 0)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(0);
    });

    it('should increase the quality of "Aged Brie" as it gets older', () => {
      const gildedRose = new GildedRose([new Item(ITEM_NAMES.AGED_BRIE, 10, 20)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(21);
    });

    it('"Sulfuras" should never decrease in quality or sellIn', () => {
      const gildedRose = new GildedRose([new Item(ITEM_NAMES.SULFURAS, 10, 80)]);
      const items = gildedRose.updateQuality();
      expect(items[0].sellIn).toBe(10);
      expect(items[0].quality).toBe(80);
    });

    describe('"Backstage passes" quality rules', () => {
      it('should increase in quality by 2 when there are 10 days or less', () => {
        const gildedRose = new GildedRose([new Item(ITEM_NAMES.BACKSTAGE_PASSES, 10, 20)]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).toBe(22);
      });

      it('should increase in quality by 3 when there are 5 days or less', () => {
        const gildedRose = new GildedRose([new Item(ITEM_NAMES.BACKSTAGE_PASSES, 5, 20)]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).toBe(23);
      });

      it('should drop quality to 0 after the concert', () => {
        const gildedRose = new GildedRose([new Item(ITEM_NAMES.BACKSTAGE_PASSES, 0, 20)]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).toBe(0);
      });
    });

    describe('"Conjured" items', () => {
      it('should degrade in quality twice as fast as normal items', () => {
        const conjuredItem = new Item(ITEM_NAMES.CONJURED + ' Mana Cake', 10, 20);
        const gildedRose = new GildedRose([conjuredItem]);
        gildedRose.updateQuality();
        expect(conjuredItem.quality).toBe(18); // Quality decreases by 2 each day
      });
  
      it('should degrade in quality four times as fast as normal items after the sell by date', () => {
        const conjuredItem = new Item(ITEM_NAMES.CONJURED + ' Mana Cake', 0, 20);
        const gildedRose = new GildedRose([conjuredItem]);
        gildedRose.updateQuality();
        expect(conjuredItem.quality).toBe(16); // Quality decreases by 4 after the sell by date
      });
  
      it('should not degrade quality below 0', () => {
        const conjuredItem = new Item(ITEM_NAMES.CONJURED + ' Mana Cake', 10, 1);
        const gildedRose = new GildedRose([conjuredItem]);
        gildedRose.updateQuality();
        expect(conjuredItem.quality).toBe(0); // Ensures quality does not go negative
      });
    });
  
  });
});
